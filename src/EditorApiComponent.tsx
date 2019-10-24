import React,{Component} from "react";
import * as uuid from 'uuid'
import NavEmpowerComponent from "./NavEmpowerComponent";

type editorApiComponentProps = {
    originToWhichMessagesWillBePosted: string
}

const METHOD_RESPONSE = "method response";

export class EditorApiComponent extends Component<editorApiComponentProps, editorApiState> {

    componentDidMount(): void {
        window.addEventListener("message", this.handleMessage);
    };

    componentWillUnmount(): void {
        window.removeEventListener("message", this.handleMessage);
    }

    isFunction = (functionToCheck: any) => {
        return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
    };

    call = (uniqueIdentifier: string, methodName: string, args: any): callObject => ({
            uniqueIdentifier,
            methodName,
            args,
            action: "method call"
    });

    setIframeWindow = (iframeWindow: Window) => {
        console.log(`setting iframwindow:`, iframeWindow.origin, iframeWindow)
        this.setState({windowToWhichMessagesWillBeSent: iframeWindow});
    };

    simpleCall = (methodName: string, args: any, fnCallback: Function) => {
        if (!this.isFunction(fnCallback)) {
            console.error(methodName + " expects a callback");
            return
        }
        const callId = uuid.v4();
        const callToSend = this.call(callId, methodName, args);

        this.setState({callbacks: {...this.state.callbacks, [callId]: fnCallback}});
        this.state.windowToWhichMessagesWillBeSent.postMessage(JSON.stringify(callToSend), this.props.originToWhichMessagesWillBePosted);
    };

    parseMessage = (messageEvent: any) => {
        if(messageEvent && messageEvent.data && messageEvent.data.source){
            if(messageEvent.data.source === "react-devtools-content-script") return undefined;
            if(messageEvent.data.source === "react-devtools-detector") return undefined;
            if(messageEvent.data.source === "react-devtools-bridge") return undefined;
            if(messageEvent.data.source === "react-devtools-inject-backend") return undefined;
        }
        try {
            return JSON.parse(messageEvent.data);
        }
        catch (_) {
            console.error(`EditorAPI is unable to parse a message recieved from ${messageEvent.origin} as JSON. The data was '${messageEvent.data.toString()}'`);
            return undefined
        }
    };

    validateMethodResponse = (response: any, callBacks: callbackType) => {
        const fnCallback = callBacks[response.uniqueIdentifier];
        if (fnCallback) {
            if (response.action === METHOD_RESPONSE) {
                return true
            } else {
                console.error(`EditorAPI received an Unexpected action '${response.action}' in response.`);
                return false;
            }
        } else {
            console.error("EditorAPI recieved a response with an unknown uniqueIdentifier");
            return false;
        }

    };

    handleMessage = (messageEvent: any) => {
        const response = this.parseMessage(messageEvent);
        if(!response || !this.validateMethodResponse(response, this.state.callbacks)){
            return
        }

        this.state.callbacks[response.uniqueIdentifier](response.returnValue);
        let newCallbacks = this.state.callbacks;
        delete newCallbacks[response.uniqueIdentifier];
        this.setState({callbacks: newCallbacks})
    };

    render() {
        return <NavEmpowerComponent
            empowerServerUrl={this.props.originToWhichMessagesWillBePosted}
            setIframeWindow={this.setIframeWindow}
            simpleCall={this.simpleCall}
        />
    };
}

type callObject = {
    uniqueIdentifier: string,
    methodName: string,
    args: any,
    action: string
}

type callbackType = { [index:string] : Function }

type editorApiState = {
    callbacks: callbackType,
    windowToWhichMessagesWillBeSent: Window
}

export default EditorApiComponent;
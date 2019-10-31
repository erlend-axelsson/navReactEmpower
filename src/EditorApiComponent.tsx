import React,{Component} from "react";
import * as uuid from 'uuid'
import NavEmpowerComponent from "./NavEmpowerComponent";
import isFunction from './isFunction'
import Axios from 'axios'

type editorApiPathProps = {
    path: string,
    ferdigstillFunction?: Function
    enableDelete?: boolean
};

type editorApiOptionProps = {
    host: string,
    version?: string,
    locale?: string,
    docId: string,
    showUserLogs?: string | boolean,
    documentNumber?: string | number,
    page?: string | number,
    ferdigstillFunction?: Function
    enableDelete?: boolean
};

type editorApiState = {
    callbacks: callbackType,
    targetWindow: Window | undefined,
    targetURL: URL,
};

type callbackType = { [index:string] : Function }

const METHOD_RESPONSE = "method response";

export class EditorApiComponent extends Component<editorApiPathProps | editorApiOptionProps, editorApiState> {

    constructor(props: editorApiPathProps) {
        super(props);

        this.setIframeWindow = this.setIframeWindow.bind(this);
        this.refreshWindow = this.refreshWindow.bind(this);
        this.simpleCall = this.simpleCall.bind(this);
        this.handleMessage = this.handleMessage.bind(this);
        this.deleteDocument = this.deleteDocument.bind(this);

        this.state = {
            callbacks: {},
            targetWindow: undefined,
            targetURL: parseUrl(this.props)
        }
    };

    componentDidMount(): void {
        window.addEventListener("message", this.handleMessage);
    };

    componentWillUnmount(): void {
        window.removeEventListener("message", this.handleMessage);
    };

    async deleteDocument(): Promise<void> {
        const documentID = this.state.targetURL.searchParams.get("docId");

        const securityTokenURL = new URL("empower/resource/GetToken", this.state.targetURL.origin);
        const deleteDocumentURL = new URL("empower/resource/documents/" + documentID, this.state.targetURL.origin);
        try {
            const tokenResponse = await Axios.get(securityTokenURL.href, {withCredentials: true});

            const tokenBody = tokenResponse.data.body;

            const deleteResponse = await Axios.delete(deleteDocumentURL.href, {
                withCredentials: true,
                headers: {"X-CSRF-TOKEN": tokenBody.csrfToken}
            });

            console.info(deleteResponse)
        } catch(e) {
            console.error("Error occured while trying to delete " + documentID, e);
            return
        }
    }

    static call(uniqueIdentifier: string, methodName: string, args: any): callObject {
        return { uniqueIdentifier, methodName, args, action: "method call" }
    };

    setIframeWindow (iframeWindow: Window): void {
        this.setState({targetWindow: iframeWindow});
    };

    refreshWindow (): void {
        if(this.state.targetWindow === undefined){
            console.error("iFrame window is undefined");
            return
        }
        // Reloads by passing a new url with a different iframeInstance uuid
        // The host window can't directly call functions of an iframe window without disabling sandbox
        const newURL = this.state.targetURL;
        newURL.searchParams.set("iframeInstance", uuid.v4());
        this.setState({
            targetURL: newURL
        });
    };

    simpleCall (methodName: string, args: any, fnCallback: Function): void {
        if(this.state.targetWindow === undefined){
            console.error("iFrame window is undefined");
            return
        }
        if (!isFunction(fnCallback)) {
            console.error(methodName + " expects a callback");
            return
        }
        const callId = uuid.v4();
        const callToSend = EditorApiComponent.call(callId, methodName, args);

        this.setState({callbacks: {...this.state.callbacks, [callId]: fnCallback}});
        this.state.targetWindow.postMessage(JSON.stringify(callToSend), this.state.targetURL.origin);
    };

    static parseMessage (messageEvent: any): any|undefined {
        if(messageEvent && messageEvent.data && messageEvent.data.source){
            if(messageEvent.data.source === "react-devtools-content-script") return undefined;
            if(messageEvent.data.source === "react-devtools-detector") return undefined;
            if(messageEvent.data.source === "react-devtools-bridge") return undefined;
            if(messageEvent.data.source === "react-devtools-inject-backend") return undefined;
        }
        try { return JSON.parse(messageEvent.data); }
        catch (_) {
            console.error(`EditorAPI is unable to parse a message received from ${messageEvent.origin} as JSON. The data was '${messageEvent.data.toString()}'`);
            return undefined
        }
    };

    static validateMethodResponse (response: any, callBacks: callbackType): boolean {
        const fnCallback = callBacks[response.uniqueIdentifier];
        if (fnCallback) {
            if (response.action === METHOD_RESPONSE) {
                return true
            } else {
                console.error(`EditorAPI received an Unexpected action '${response.action}' in response.`);
                return false;
            }
        } else {
            console.error("EditorAPI received a response with an unknown uniqueIdentifier");
            return false;
        }

    };

    handleMessage (messageEvent: any): void {
        const response = EditorApiComponent.parseMessage(messageEvent);
        if(!response || !EditorApiComponent.validateMethodResponse(response, this.state.callbacks)){
            return
        }

        this.state.callbacks[response.uniqueIdentifier](response.returnValue);
        let newCallbacks = this.state.callbacks;
        delete newCallbacks[response.uniqueIdentifier];
        this.setState({callbacks: newCallbacks})
    };

    render() {
        return <>
            <NavEmpowerComponent
                empowerServerUrl={this.state.targetURL.href}
                setIframeWindow={this.setIframeWindow}
                simpleCall={this.simpleCall}
                refreshWindow={this.refreshWindow}
                deleteDocument={this.deleteDocument}
                ferdigstillFunction={this.props.ferdigstillFunction}
                enableDelete={this.props.enableDelete}
            />
        </>
    };
}

type callObject = {
    uniqueIdentifier: string,
    methodName: string,
    args: any,
    action: string
}


function parseUrl(props: editorApiPathProps | editorApiOptionProps): URL{
    if((props as editorApiPathProps).path !== undefined){
        const path = (props as editorApiPathProps).path;
        const empowerUrl = new URL(path);
        return empowerUrl;
    }

    const options = props as editorApiOptionProps;
    const empowerUrl = new URL(options.host);
    empowerUrl.searchParams.set("locale", options.locale || "en_US");
    empowerUrl.searchParams.set("docId", options.docId);
    // showUserLogs might be a boolean so we have to either use a conditional
    // or just run toString which is essentially a no-op if the value is already a string.
    empowerUrl.searchParams.set("showUserLogs", (options.showUserLogs || "false").toString());
    empowerUrl.searchParams.set("iframeInstance", uuid.v4());
    empowerUrl.hash = "/document/" + (options.documentNumber || "1") +
        "/page/" + (options.page || "1");
    empowerUrl.pathname = "empower/resource/docedit/editor/" + (options.version || "16.4.10.31904") + "/empower.html";

    return empowerUrl;
}

export default EditorApiComponent;

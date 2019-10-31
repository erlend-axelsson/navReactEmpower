import { Component } from "react";
declare type editorApiPathProps = {
    path: string;
    ferdigstillFunction?: Function;
    enableDelete?: boolean;
};
declare type editorApiOptionProps = {
    host: string;
    version?: string;
    locale?: string;
    docId: string;
    showUserLogs?: string | boolean;
    documentNumber?: string | number;
    page?: string | number;
    ferdigstillFunction?: Function;
    enableDelete?: boolean;
};
declare type editorApiState = {
    callbacks: callbackType;
    targetWindow: Window | undefined;
    targetURL: URL;
};
declare type callbackType = {
    [index: string]: Function;
};
export declare class EditorApiComponent extends Component<editorApiPathProps | editorApiOptionProps, editorApiState> {
    constructor(props: editorApiPathProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    deleteDocument(): Promise<void>;
    static call(uniqueIdentifier: string, methodName: string, args: any): callObject;
    setIframeWindow(iframeWindow: Window): void;
    refreshWindow(): void;
    simpleCall(methodName: string, args: any, fnCallback: Function): void;
    static parseMessage(messageEvent: any): any | undefined;
    static validateMethodResponse(response: any, callBacks: callbackType): boolean;
    handleMessage(messageEvent: any): void;
    render(): JSX.Element;
}
declare type callObject = {
    uniqueIdentifier: string;
    methodName: string;
    args: any;
    action: string;
};
export default EditorApiComponent;

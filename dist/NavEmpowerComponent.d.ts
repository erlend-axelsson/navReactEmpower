import React from "react";
declare type appProps = {
    empowerServerUrl: string;
    setIframeWindow: Function;
    simpleCall: Function;
    refreshWindow: Function;
    deleteDocument: Function;
    enableDelete?: boolean;
    ferdigstillFunction?: Function;
};
export declare const NavEmpowerComponent: React.FC<appProps>;
export default NavEmpowerComponent;

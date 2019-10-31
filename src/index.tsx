import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import "core-js/stable/url";

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import EditorApiComponent from "./EditorApiComponent";


//'empower/resource/docedit/editor/16.4.10.31904/'
//'empower.html?locale=en_US&docId=c6bf057b-0cf4-4f5c-9187-6138c5591cd3&showUserLogs=true#'
//'document/1/page/1'
// "https://localhost:8000/empower/resource/docedit/editor/16.4.10.31904/empower.html?locale=en_US&docId=c6bf057b-0cf4-4f5c-9187-6138c5591cd3&showUserLogs=true#/document/1/page/1"></iframe>

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

const options : editorApiOptionProps = {
    host: "https://localhost:8000",
    version: "16.4.10.31904",
    locale: "en_US",
    docId: "77117c7b-aaf9-464e-bba4-50db1b25b897",
    showUserLogs: "false",
    documentNumber: "1",
    page: "1",
    ferdigstillFunction: ()=>console.log("ferdigstill"),
    enableDelete: true
};

ReactDOM.render(<EditorApiComponent  {...options} />, document.getElementById('root'));
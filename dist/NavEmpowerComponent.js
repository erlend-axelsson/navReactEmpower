import React from "react";
import { Hovedknapp, Fareknapp } from 'nav-frontend-knapper';
import { Container, Row, Column } from "nav-frontend-grid";
import isFunction from './isFunction';
function hasChanged(simpleCall, includeUncommitedChangesInActiveVarArea) {
    var boundSave = save.bind(null, simpleCall, console.info, includeUncommitedChangesInActiveVarArea);
    var boundHasChangedCallback = hasChangedCallback.bind(null, boundSave);
    var args = includeUncommitedChangesInActiveVarArea !== undefined ? [includeUncommitedChangesInActiveVarArea] : undefined;
    var hasChangedFn = simpleCall.bind(null, "EditorAPI.document.hasChanged", args, boundHasChangedCallback);
    return onClickFunctionCall(hasChangedFn);
}
function hasChangedCallback(boundSave, res) {
    if (!res.success) {
        console.error("Server returns error while checking dirty status");
    }
    if (res.isDirty) {
        boundSave();
    }
    else {
        console.info("Detecting no changes");
    }
}
function save(simpleCall, fnCallback, includeUncommitedChangesInActiveVarArea) {
    var args = includeUncommitedChangesInActiveVarArea !== undefined ? [includeUncommitedChangesInActiveVarArea] : undefined;
    simpleCall("EditorAPI.document.save", args, fnCallback);
}
function onClickFunctionCall(fn) {
    return function (e) {
        if (fn !== undefined) {
            fn();
        }
    };
}
function iframeOnLoad(setIframeWindow) {
    return function (event) {
        var eventTarget = event.target;
        if (eventTarget && eventTarget instanceof HTMLIFrameElement) {
            setIframeWindow(eventTarget.contentWindow);
        }
    };
}
export var NavEmpowerComponent = function (props) {
    return (React.createElement(Container, { className: "nav-empower-frontend-container" },
        React.createElement(Row, { className: "nav-empower-frontend-row" },
            React.createElement(Column, { className: "nav-empower-frontend-column-buttons" },
                React.createElement("ul", { className: "nav-empower-button-list" },
                    React.createElement("li", null,
                        React.createElement(Hovedknapp, { onClick: hasChanged(props.simpleCall, true), className: "nav-empower-button" }, "Mellomlagre")),
                    isFunction(props.ferdigstillFunction)
                        ? React.createElement("li", null,
                            React.createElement(Hovedknapp, { onClick: onClickFunctionCall(props.ferdigstillFunction), className: "nav-empower-button" }, "Ferdigstill"))
                        : null,
                    React.createElement("li", null,
                        React.createElement(Hovedknapp, { onClick: onClickFunctionCall(props.refreshWindow), className: "nav-empower-button" }, "Tilbake til sist lagrede")),
                    props.enableDelete
                        ? React.createElement("li", null,
                            React.createElement(Fareknapp, { onClick: onClickFunctionCall(props.deleteDocument), className: "nav-empower-button" }, "Kanseller dokument"))
                        : null)),
            React.createElement(Column, { className: "nav-empower-frontend-column-frame", md: "12" },
                React.createElement("iframe", { title: "Empower Editor Window", id: "empower-editor-frame", className: "empowerFrame", src: props.empowerServerUrl, onLoad: iframeOnLoad(props.setIframeWindow) })))));
};
export default NavEmpowerComponent;

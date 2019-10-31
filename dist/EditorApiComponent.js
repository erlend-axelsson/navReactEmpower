var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import React, { Component } from "react";
import * as uuid from 'uuid';
import NavEmpowerComponent from "./NavEmpowerComponent";
import isFunction from './isFunction';
import Axios from 'axios';
var METHOD_RESPONSE = "method response";
var EditorApiComponent = /** @class */ (function (_super) {
    __extends(EditorApiComponent, _super);
    function EditorApiComponent(props) {
        var _this = _super.call(this, props) || this;
        _this.setIframeWindow = _this.setIframeWindow.bind(_this);
        _this.refreshWindow = _this.refreshWindow.bind(_this);
        _this.simpleCall = _this.simpleCall.bind(_this);
        _this.handleMessage = _this.handleMessage.bind(_this);
        _this.deleteDocument = _this.deleteDocument.bind(_this);
        _this.state = {
            callbacks: {},
            targetWindow: undefined,
            targetURL: parseUrl(_this.props)
        };
        return _this;
    }
    ;
    EditorApiComponent.prototype.componentDidMount = function () {
        window.addEventListener("message", this.handleMessage);
    };
    ;
    EditorApiComponent.prototype.componentWillUnmount = function () {
        window.removeEventListener("message", this.handleMessage);
    };
    ;
    EditorApiComponent.prototype.deleteDocument = function () {
        return __awaiter(this, void 0, void 0, function () {
            var documentID, securityTokenURL, deleteDocumentURL, tokenResponse, tokenBody, deleteResponse, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        documentID = this.state.targetURL.searchParams.get("docId");
                        securityTokenURL = new URL("empower/resource/GetToken", this.state.targetURL.origin);
                        deleteDocumentURL = new URL("empower/resource/documents/" + documentID, this.state.targetURL.origin);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, Axios.get(securityTokenURL.href, { withCredentials: true })];
                    case 2:
                        tokenResponse = _a.sent();
                        tokenBody = tokenResponse.data.body;
                        return [4 /*yield*/, Axios.delete(deleteDocumentURL.href, {
                                withCredentials: true,
                                headers: { "X-CSRF-TOKEN": tokenBody.csrfToken }
                            })];
                    case 3:
                        deleteResponse = _a.sent();
                        console.info(deleteResponse);
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        console.error("Error occured while trying to delete " + documentID, e_1);
                        return [2 /*return*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    EditorApiComponent.call = function (uniqueIdentifier, methodName, args) {
        return { uniqueIdentifier: uniqueIdentifier, methodName: methodName, args: args, action: "method call" };
    };
    ;
    EditorApiComponent.prototype.setIframeWindow = function (iframeWindow) {
        this.setState({ targetWindow: iframeWindow });
    };
    ;
    EditorApiComponent.prototype.refreshWindow = function () {
        if (this.state.targetWindow === undefined) {
            console.error("iFrame window is undefined");
            return;
        }
        // Reloads by passing a new url with a different iframeInstance uuid
        // The host window can't directly call functions of an iframe window without disabling sandbox
        var newURL = this.state.targetURL;
        newURL.searchParams.set("iframeInstance", uuid.v4());
        this.setState({
            targetURL: newURL
        });
    };
    ;
    EditorApiComponent.prototype.simpleCall = function (methodName, args, fnCallback) {
        var _a;
        if (this.state.targetWindow === undefined) {
            console.error("iFrame window is undefined");
            return;
        }
        if (!isFunction(fnCallback)) {
            console.error(methodName + " expects a callback");
            return;
        }
        var callId = uuid.v4();
        var callToSend = EditorApiComponent.call(callId, methodName, args);
        this.setState({ callbacks: __assign(__assign({}, this.state.callbacks), (_a = {}, _a[callId] = fnCallback, _a)) });
        this.state.targetWindow.postMessage(JSON.stringify(callToSend), this.state.targetURL.origin);
    };
    ;
    EditorApiComponent.parseMessage = function (messageEvent) {
        if (messageEvent && messageEvent.data && messageEvent.data.source) {
            if (messageEvent.data.source === "react-devtools-content-script")
                return undefined;
            if (messageEvent.data.source === "react-devtools-detector")
                return undefined;
            if (messageEvent.data.source === "react-devtools-bridge")
                return undefined;
            if (messageEvent.data.source === "react-devtools-inject-backend")
                return undefined;
        }
        try {
            return JSON.parse(messageEvent.data);
        }
        catch (_) {
            console.error("EditorAPI is unable to parse a message received from " + messageEvent.origin + " as JSON. The data was '" + messageEvent.data.toString() + "'");
            return undefined;
        }
    };
    ;
    EditorApiComponent.validateMethodResponse = function (response, callBacks) {
        var fnCallback = callBacks[response.uniqueIdentifier];
        if (fnCallback) {
            if (response.action === METHOD_RESPONSE) {
                return true;
            }
            else {
                console.error("EditorAPI received an Unexpected action '" + response.action + "' in response.");
                return false;
            }
        }
        else {
            console.error("EditorAPI received a response with an unknown uniqueIdentifier");
            return false;
        }
    };
    ;
    EditorApiComponent.prototype.handleMessage = function (messageEvent) {
        var response = EditorApiComponent.parseMessage(messageEvent);
        if (!response || !EditorApiComponent.validateMethodResponse(response, this.state.callbacks)) {
            return;
        }
        this.state.callbacks[response.uniqueIdentifier](response.returnValue);
        var newCallbacks = this.state.callbacks;
        delete newCallbacks[response.uniqueIdentifier];
        this.setState({ callbacks: newCallbacks });
    };
    ;
    EditorApiComponent.prototype.render = function () {
        return React.createElement(React.Fragment, null,
            React.createElement(NavEmpowerComponent, { empowerServerUrl: this.state.targetURL.href, setIframeWindow: this.setIframeWindow, simpleCall: this.simpleCall, refreshWindow: this.refreshWindow, deleteDocument: this.deleteDocument, ferdigstillFunction: this.props.ferdigstillFunction, enableDelete: this.props.enableDelete }));
    };
    ;
    return EditorApiComponent;
}(Component));
export { EditorApiComponent };
function parseUrl(props) {
    if (props.path !== undefined) {
        var path = props.path;
        var empowerUrl_1 = new URL(path);
        return empowerUrl_1;
    }
    var options = props;
    var empowerUrl = new URL(options.host);
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

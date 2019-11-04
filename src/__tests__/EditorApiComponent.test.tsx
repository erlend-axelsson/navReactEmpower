import React from "react";
import {shallow, ShallowWrapper} from "enzyme";
import EditorApiComponent, {editorApiState} from "../EditorApiComponent";

import * as uuid from 'uuid';
import axios, {AxiosRequestConfig} from 'axios'

jest.mock('uuid/v4');
jest.mock('axios');

// @ts-ignore
uuid.v4.mockImplementation(() => 'someUUID');
// @ts-ignore
axios.get.mockImplementation((url: string, config: AxiosRequestConfig | undefined)=> Promise.resolve({ data: {body: {csrfToken: '123'}}}))
// @ts-ignore
axios.delete.mockImplementation((url: string, config: AxiosRequestConfig | undefined) => Promise.resolve({ data: {body: {deleted: 'true'}}}));


const pathProps = {
    path: "http://example.com:1337/empower/resource/docedit/editor/123.456/empower.html?locale=foo_BAR&docId=qwerty123&showUserLogs=true#/document/2/page/58",
    ferdigstillFunction: ()=>{},
    enableDelete: true
};

const optionProps = {
    host: "http://example.com:1337",
    version: "123.456",
    locale: "foo_BAR",
    docId: "qwerty123",
    showUserLogs: "true",
    documentNumber: 2,
    page: 58,
    ferdigstillFunction: ()=>{},
    enableDelete: true
};

describe("EditorApiComponent", ()=> {
    it("renders", () => {
        let wrapper;

        wrapper = shallow(<EditorApiComponent {...pathProps}/>);
        expect(wrapper.isEmptyRender()).toEqual(false);

        wrapper = shallow(<EditorApiComponent {...optionProps}/>);
        expect(wrapper.isEmptyRender()).toEqual(false);
    });

    it("parses the url from pathProps", ()=>{
        const wrapper = shallow(<EditorApiComponent {...pathProps} />);

        const state = wrapper.state() as editorApiState;

        expect(state.targetURL.href).toEqual(
            "http://example.com:1337/empower/resource/docedit/editor/123.456/empower.html?locale=foo_BAR&docId=qwerty123&showUserLogs=true&iframeInstance=someUUID#/document/2/page/58"
        );
    });

    it("parses the url from optionProps", ()=>{
        const wrapper = shallow(<EditorApiComponent {...optionProps} />);

        const state = wrapper.state() as editorApiState;

        expect(state.targetURL.href).toEqual(
            "http://example.com:1337/empower/resource/docedit/editor/123.456/empower.html?locale=foo_BAR&docId=qwerty123&showUserLogs=true&iframeInstance=someUUID#/document/2/page/58"
        );
    });

    it("adds and removes eventlistener to window", ()=>{
        const map: { [index:string] : EventListenerOrEventListenerObject } = {};
        window.addEventListener = jest.fn((event, callback) => {
            map[event] = callback;
        });
        window.removeEventListener = jest.fn((event, callback) => {
            map[event] = callback;
        });

        const wrapper = shallow(<EditorApiComponent {...optionProps} />);

        expect(window.addEventListener).toBeCalled()

        wrapper.unmount()

        expect(window.removeEventListener).toBeCalled()
    });

    it("delete calls the right endpoints",  async (done) => {
        const wrapper= shallow(<EditorApiComponent {...optionProps} />);
        const instance: EditorApiComponent = wrapper.instance() as EditorApiComponent;
        await instance.deleteDocument()

        expect(axios.get).toBeCalledWith("http://example.com:1337/empower/resource/GetToken", {"withCredentials": true})
        expect(axios.delete).toBeCalledWith("http://example.com:1337/empower/resource/documents/qwerty123", {"headers": {"X-CSRF-TOKEN": "123"}, "withCredentials": true});
        done()
    });

    it("call generates correct call object", ()=> {
        expect(EditorApiComponent.call("uuid", "methodName", "args")).toEqual(
            {
                "action": "method call",
                "args": "args",
                "methodName": "methodName",
                "uniqueIdentifier": "uuid"
            })
    });

    it("setIframeWindow sets state correctly", ()=>{
        const wrapper = shallow(<EditorApiComponent {...optionProps} />);
        const instance = wrapper.instance() as EditorApiComponent;

        instance.setIframeWindow(window);

        const state = wrapper.state() as editorApiState;

        expect(state.targetWindow).toEqual(window);
    });

    it("parseMessage ignores React dev tools", () => {
        const parse = EditorApiComponent.parseMessage

        expect(parse({data: {source: "react-devtools-content-script" }})).toEqual(undefined);
        expect(parse({data: {source: "react-devtools-detector" }})).toEqual(undefined);
        expect(parse({data: {source: "react-devtools-bridge" }})).toEqual(undefined);
        expect(parse({data: {source: "react-devtools-inject-backend" }})).toEqual(undefined);
    });

    it("parseMessage logs error and returns undefined when message is not JSON", () => {
        const parse = EditorApiComponent.parseMessage

        console.error = jest.fn();
        expect(parse(new String("TEST: not a JSON object"))).toEqual(undefined);
        expect(console.error).toBeCalledWith("EditorAPI is unable to parse a message received as JSON. The data was TEST: not a JSON object");
    });

    it("parseMessage logs error and returns undefined when message object lacks data property", () => {
        const parse = EditorApiComponent.parseMessage

        console.error = jest.fn();
        expect(parse(`{"valid": {"json": {"object": true} } }` )).toEqual(undefined);
        expect(console.error).toBeCalledWith("EditorAPI is unable to parse a message received as JSON. The data was {\"valid\": {\"json\": {\"object\": true} } }");
    });

    it("parseMessage parses message when data is valid JSON", () => {
        const parse = EditorApiComponent.parseMessage

        expect(parse({data: `{"valid": {"json": {"object": true} } }` })).toEqual({"valid": {"json": {"object": true}}});
    });

    it("simpleCall logs error and returns if window is not set", ()=>{

        window.postMessage = jest.fn();
        console.error = jest.fn();
        const testCallBack = jest.fn();

        const wrapper = shallow(<EditorApiComponent {...optionProps} />);
        const instance = wrapper.instance() as EditorApiComponent;

        instance.simpleCall("TESTMETHOD", "TESTARGS", testCallBack)

        expect(window.postMessage).not.toBeCalled()
        expect(console.error).toBeCalledWith("iFrame window is undefined")
    });

    it("simpleCall logs error and returns if callback is not a function", ()=>{

        window.postMessage = jest.fn();
        console.error = jest.fn();
        const testCallBack = "jest.fn();";

        const wrapper = shallow(<EditorApiComponent {...optionProps} />);
        const instance = wrapper.instance() as EditorApiComponent;
        instance.setIframeWindow(window);

        // @ts-ignore
        instance.simpleCall("TESTMETHOD", "TESTARGS", testCallBack)

        expect(window.postMessage).not.toBeCalled()
        expect(console.error).toBeCalledWith("TESTMETHOD expects a callback")
    });


    it("simpleCall sets state and calls postMessage", ()=>{

        window.postMessage = jest.fn();
        const testCallBack = jest.fn();
        const wrapper = shallow(<EditorApiComponent {...optionProps} />);
        const instance = wrapper.instance() as EditorApiComponent;
        instance.setIframeWindow(window);
        let state = wrapper.state() as editorApiState;


        expect(state.callbacks["someUUID"]).toEqual(undefined);

        instance.simpleCall("TESTMETHOD", "TESTARGS", testCallBack)

        state = wrapper.state() as editorApiState;

        expect(typeof state.callbacks["someUUID"]).toEqual("function");
        expect(window.postMessage).toBeCalledWith("{\"uniqueIdentifier\":\"someUUID\",\"methodName\":\"TESTMETHOD\",\"args\":\"TESTARGS\",\"action\":\"method call\"}", "http://example.com:1337")
    });

    it("validateMethodResponse fails if there is no matching callback", () => {
        console.error = jest.fn();
        const result = EditorApiComponent.validateMethodResponse( {uniqueIdentifier: "someOtherUUID"}, {});
        expect(result).toEqual(false);
        expect(console.error).toBeCalledWith("EditorAPI received a response with an unknown uniqueIdentifier");
    });

    it("validateMethodResponse fails if action is not method response", () => {
        console.error = jest.fn()
        const result = EditorApiComponent.validateMethodResponse( {uniqueIdentifier: "someUUID", action: "method TEST"}, {"someUUID": jest.fn()});
        expect(result).toEqual(false);
        expect(console.error).toBeCalledWith("EditorAPI received an Unexpected action 'method TEST' in response.");
    });

    it("validateMethodResponse succeeds if there is a matching callback and action is method response", () => {
        const result = EditorApiComponent.validateMethodResponse( {uniqueIdentifier: "someUUID", action: "method response"}, {"someUUID": jest.fn()});
        expect(result).toEqual(true);
    });

    it("handleMessage return without doing anything if messageEvent can't be parsed", () => {
        const testCallback = jest.fn()

        const wrapper = shallow(<EditorApiComponent {...optionProps} />);
        wrapper.setState({callbacks: {"someUUID": testCallback}});

        const instance = wrapper.instance() as EditorApiComponent;

        instance.handleMessage({data: new String("TEST, not valid JSON")});

        const state = wrapper.state() as editorApiState;
        expect(state.callbacks["someUUID"]).toEqual(testCallback);
    });

    it("handleMessage return without doing anything if messageEvent can't be validated", () => {
        const testCallback = jest.fn()

        const wrapper = shallow(<EditorApiComponent {...optionProps} />);
        wrapper.setState({callbacks: {"someUUID": testCallback}});

        const instance = wrapper.instance() as EditorApiComponent;

        instance.handleMessage( {data: `{uniqueIdentifier: "someUUID", action: "method TEST"}`});

        const state = wrapper.state() as editorApiState;
        expect(state.callbacks["someUUID"]).toEqual(testCallback);
    });

    it("handleMessage will call callback and remove it from state if messageEvent is parsed and validated", () => {
        const testCallback = jest.fn()

        const wrapper = shallow(<EditorApiComponent {...optionProps} />);
        wrapper.setState({callbacks: {"someUUID": testCallback}});
        let state = wrapper.state() as editorApiState;
        expect(state.callbacks["someUUID"]).toEqual(testCallback);

        const instance = wrapper.instance() as EditorApiComponent;

        instance.handleMessage({data: `{"uniqueIdentifier": "someUUID", "action": "method response"}`})

        state = wrapper.state() as editorApiState;

        expect(state.callbacks["someUUID"]).toEqual(undefined);
        expect(testCallback).toBeCalled()
    });

    it("Calls handleMessage on message", () => {
        const map: { [index:string] : EventListenerOrEventListenerObject } = {};
        window.addEventListener = jest.fn((event, callback) => {
            map[event] = callback;
        });

        const spy = jest.spyOn(EditorApiComponent.prototype, "handleMessage");
        const wrapper = shallow(<EditorApiComponent {...optionProps}/>);

        // @ts-ignore
        map.message({data: `{"uniqueIdentifier": "someUUID", "action": "method response"}`})

        expect(spy).toBeCalled();
    })
});
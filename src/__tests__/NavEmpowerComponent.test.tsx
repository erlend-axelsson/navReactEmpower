import React from "react";
import {shallow} from "enzyme";
import NavEmpowerComponent, {appProps} from "../NavEmpowerComponent";

const props: appProps = {
    empowerServerUrl: "https://localhost:8080",
    setIframeWindow: jest.fn(),
    simpleCall: jest.fn(),
    refreshWindow: jest.fn(),
    deleteDocument: jest.fn(),
    enableDelete: true,
    ferdigstillFunction: jest.fn(),
}


describe("NavEmpowerComponent", ()=> {
    it("renders", () => {
        const wrapper = shallow(<NavEmpowerComponent {...props}/>);
        expect(wrapper.isEmptyRender()).toEqual(false);
    });

    it("renders all buttons", () => {
        const wrapper = shallow(<NavEmpowerComponent {...props}/>);

        expect(wrapper.exists("#nav-empower-mellomlagre")).toEqual(true);
        expect(wrapper.exists("#nav-empower-ferdigstill")).toEqual(true);
        expect(wrapper.exists("#nav-empower-sistlagrede")).toEqual(true);
        expect(wrapper.exists("#nav-empower-kanseller")).toEqual(true);
    });

    it("does not render ferdigstill button if ferdigstillFunction is undefined", () => {
        let wrapper;

        wrapper = shallow(<NavEmpowerComponent {...props} ferdigstillFunction={jest.fn()} />);
        expect(wrapper.exists("#nav-empower-ferdigstill")).toEqual(true);

        wrapper = shallow(<NavEmpowerComponent {...props} ferdigstillFunction={undefined} />);
        expect(wrapper.exists("#nav-empower-ferdigstill")).toEqual(false);
    });

    it("does not render kanseller button if enableDelete is false or undefined", () => {
        let wrapper;
        wrapper = shallow(<NavEmpowerComponent {...props} enableDelete={true}/>);
        expect(wrapper.exists("#nav-empower-kanseller")).toEqual(true);

        wrapper = shallow(<NavEmpowerComponent {...props} enableDelete={false} />);
        expect(wrapper.exists("#nav-empower-kanseller")).toEqual(false);

        wrapper = shallow(<NavEmpowerComponent {...props} enableDelete={undefined} />);
        expect(wrapper.exists("#nav-empower-kanseller")).toEqual(false);
    });

    it("renders iframe", () => {
        const wrapper = shallow(<NavEmpowerComponent {...props} />)
        expect(wrapper.exists("#empower-editor-frame")).toEqual(true);
    });

    it("iframe calls setIframeWindow on load", ()=> {
        const setIframeWindow = jest.fn()
        const wrapper = shallow(<NavEmpowerComponent {...props} setIframeWindow={setIframeWindow}/>)

        wrapper.find("#empower-editor-frame").simulate("load", {target: document.createElement("iframe")});

        expect(setIframeWindow).toBeCalled();
    });

    it("Mellomlagre onClick calls simpleCall twice if hasChanged is successfull and returns dirty", () => {
        const simpleCall = jest.fn().mockImplementation((methodName: string, args: any, fnCallback: Function) => {
            fnCallback({isDirty: true, success: true})
        });

        const wrapper = shallow(<NavEmpowerComponent {...props} simpleCall={simpleCall}/>)

        wrapper.find("#nav-empower-mellomlagre").simulate("click");

        expect(simpleCall).toBeCalledTimes(2);
        expect(simpleCall.mock.calls[0][0]).toEqual("EditorAPI.document.hasChanged");
        expect(simpleCall.mock.calls[1][0]).toEqual("EditorAPI.document.save");
    });

    it("Mellomlagre onClick calls simpleCall once if hasChanged is successfull and returns not dirty", () => {
        const simpleCall = jest.fn().mockImplementation((methodName: string, args: any, fnCallback: Function) => {
            fnCallback({isDirty: false, success: true})
        });

        const wrapper = shallow(<NavEmpowerComponent {...props} simpleCall={simpleCall}/>)

        wrapper.find("#nav-empower-mellomlagre").simulate("click");

        expect(simpleCall).toBeCalled();
        expect(simpleCall.mock.calls[0][0]).toEqual("EditorAPI.document.hasChanged");
    });

    it("Mellomlagre onClick calls simpleCall once if hasChanged is unsuccessful", () => {
        const simpleCall = jest.fn().mockImplementation((methodName: string, args: any, fnCallback: Function) => {
            fnCallback({success: false})
        });

        const wrapper = shallow(<NavEmpowerComponent {...props} simpleCall={simpleCall}/>)

        wrapper.find("#nav-empower-mellomlagre").simulate("click");

        expect(simpleCall).toBeCalled();
        expect(simpleCall.mock.calls[0][0]).toEqual("EditorAPI.document.hasChanged");
    });

    it("Mellomlagre onClick calls simpleCall once if hasChanged returns gibberish", () => {
        const simpleCall = jest.fn().mockImplementation((methodName: string, args: any, fnCallback: Function) => {
            fnCallback(String("This is an unexpected value"))
        });

        const wrapper = shallow(<NavEmpowerComponent {...props} simpleCall={simpleCall}/>)

        wrapper.find("#nav-empower-mellomlagre").simulate("click");

        expect(simpleCall).toBeCalled();
        expect(simpleCall.mock.calls[0][0]).toEqual("EditorAPI.document.hasChanged");
    });

    it("Ferdigstill onClick calls ferdigstillFunction", () => {
        const ferdigstillFunction = jest.fn();
        const wrapper = shallow(<NavEmpowerComponent {...props} ferdigstillFunction={ferdigstillFunction}/>);

        wrapper.find("#nav-empower-ferdigstill").simulate("click");

        expect(ferdigstillFunction).toBeCalled();
    });

    it("sistlagrede onClick calls refreshWindow", () => {
        const refreshWindow = jest.fn();
        const wrapper = shallow(<NavEmpowerComponent {...props} refreshWindow={refreshWindow}/>);

        wrapper.find("#nav-empower-sistlagrede").simulate("click");

        expect(refreshWindow).toBeCalled();
    });

    it("Kanseller onClick calls deleteDocument", () => {
        const deleteDocument = jest.fn();

        const wrapper = shallow(<NavEmpowerComponent {...props} deleteDocument={deleteDocument}/>)

        wrapper.find("#nav-empower-kanseller").simulate("click");

        expect(deleteDocument).toBeCalled();
    });

});
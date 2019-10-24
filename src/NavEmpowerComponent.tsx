import React, {Component} from "react";
import { Hovedknapp, Fareknapp } from 'nav-frontend-knapper';
import { Container, Row, Column } from "nav-frontend-grid";
import NavLogo from "./svg/NavLogo";
import './App.css';


type appProps = {
    empowerServerUrl: string,
    setIframeWindow: Function,
    simpleCall: Function
}

export class NavEmpowerComponent extends Component<appProps, {}> {
    componentDidMount(): void {
        const iframe = document.getElementById("frame");
        if(iframe && iframe instanceof HTMLIFrameElement){
            this.props.setIframeWindow(iframe.contentWindow)
        }
        this.buttonFunc = this.buttonFunc.bind(this)
    }

    hasChanged = (fnCallback: Function, includeUncommitedChangesInActiveVarArea: any) => {
        const args = includeUncommitedChangesInActiveVarArea !== undefined ? [includeUncommitedChangesInActiveVarArea] : undefined;
        this.props.simpleCall("EditorAPI.document.hasChanged", args, fnCallback);
    };

    save = (fnCallback: Function, includeUncommitedChangesInActiveVarArea: any) => {
        const args = includeUncommitedChangesInActiveVarArea !== undefined ? [includeUncommitedChangesInActiveVarArea] : undefined;
        this.props.simpleCall("EditorAPI.document.save", args, fnCallback);
    };

    downloadEmpowerDocument = () => {
        //let documentID = document.getElementById("documentID").value || undefined
        const iframe = document.getElementById("frame");
        if(iframe && iframe instanceof HTMLIFrameElement) {
            iframe.src = window.location.origin + "/empower/resource/docedit/" + 'documentID' + "/open"
        };
    };

    buttonFunc(e: React.MouseEvent): void {
        this.props.simpleCall("hello!", undefined, console.log)
    }

    render() {
        return (
            <Container className="nav-empower-frontend-container">
                <Row className="nav-empower-frontend-row">
                    <Column className="nav-empower-frontend-column-buttons">
                        <NavLogo/>
                        <ul className="nav-empower-button-list">
                            <li><Hovedknapp onClick={this.buttonFunc} className="nav-empower-button">Mellomlagre</Hovedknapp></li>
                            <li><Hovedknapp className="nav-empower-button">Ferdigstill</Hovedknapp></li>
                            <li><Hovedknapp className="nav-empower-button">Tilbake til sist lagrede</Hovedknapp></li>
                            <li><Fareknapp className="nav-empower-button">Kanseller dokument</Fareknapp></li>
                        </ul>
                    </Column>
                    <Column className="nav-empower-frontend-column-frame">
                        <iframe title="Empower Editor Window" id="frame" className="empowerFrame"
                                src={this.props.empowerServerUrl}/>
                    </Column>
                </Row>
            </Container>
        );
    };
}

export default NavEmpowerComponent;
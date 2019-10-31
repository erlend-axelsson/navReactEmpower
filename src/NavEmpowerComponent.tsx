import React, {SyntheticEvent} from "react";
import { Hovedknapp, Fareknapp } from 'nav-frontend-knapper';
import { Container, Row, Column } from "nav-frontend-grid";
import isFunction from './isFunction';
import './App.css';


type appProps = {
    empowerServerUrl: string,
    setIframeWindow: Function,
    simpleCall: Function,
    refreshWindow: Function,
    deleteDocument: Function,
    enableDelete?: boolean
    ferdigstillFunction?: Function,
}

type hasChangedResponse = {
    isDirty: boolean,
    success: boolean
}

function hasChanged(simpleCall: Function, includeUncommitedChangesInActiveVarArea?: any){
    const boundSave = save.bind(null, simpleCall, console.info, includeUncommitedChangesInActiveVarArea);
    const boundHasChangedCallback = hasChangedCallback.bind(null, boundSave);
    const args = includeUncommitedChangesInActiveVarArea !== undefined ? [includeUncommitedChangesInActiveVarArea] : undefined;
    const hasChangedFn = simpleCall.bind(null, "EditorAPI.document.hasChanged", args, boundHasChangedCallback);

    return onClickFunctionCall(hasChangedFn)
}

function hasChangedCallback(boundSave: Function, res: hasChangedResponse): void{
    if(!res.success){
        console.error("Server returns error while checking dirty status")
    }
    if(res.isDirty){
        boundSave()
    } else {
        console.log("Detecting no changes")
    }
}

function save(simpleCall: Function, fnCallback: Function, includeUncommitedChangesInActiveVarArea?: any): void {
    const args = includeUncommitedChangesInActiveVarArea !== undefined ? [includeUncommitedChangesInActiveVarArea] : undefined;
    simpleCall("EditorAPI.document.save", args, fnCallback);
}

function onClickFunctionCall(fn?: Function){
    return function(e: React.MouseEvent){
        if(fn !== undefined) { fn(); }
    }
}

function iframeOnLoad(setIframeWindow: Function){
    return function(event: SyntheticEvent) {
        const eventTarget = event.target;
        if (eventTarget && eventTarget instanceof HTMLIFrameElement) {
            setIframeWindow(eventTarget.contentWindow)
        }
    }
}

export const NavEmpowerComponent: React.FC<appProps> = (props) => {
    return (
        <Container className="nav-empower-frontend-container">
            <Row className="nav-empower-frontend-row">
                <Column className="nav-empower-frontend-column-buttons">
                    <ul className="nav-empower-button-list">
                        <li><Hovedknapp onClick={hasChanged(props.simpleCall, true)} className="nav-empower-button">Mellomlagre</Hovedknapp></li>
                        {isFunction(props.ferdigstillFunction)
                            ? <li><Hovedknapp onClick={onClickFunctionCall(props.ferdigstillFunction)} className="nav-empower-button">Ferdigstill</Hovedknapp></li>
                            : null
                        }
                        <li><Hovedknapp onClick={onClickFunctionCall(props.refreshWindow)} className="nav-empower-button">Tilbake til sist lagrede</Hovedknapp></li>
                        {props.enableDelete
                            ? <li><Fareknapp onClick={onClickFunctionCall(props.deleteDocument)} className="nav-empower-button">Kanseller dokument</Fareknapp></li>
                            : null
                        }
                    </ul>
                </Column>
                <Column className="nav-empower-frontend-column-frame" md={"12"}>
                    <iframe title="Empower Editor Window" id="frame" className="empowerFrame"
                             src={props.empowerServerUrl}
                             onLoad={iframeOnLoad(props.setIframeWindow)}
                    />
                </Column>
            </Row>
        </Container>
    );
};

export default NavEmpowerComponent;


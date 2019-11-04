React component to interact with an Empower OpenText editor
-----------------------------------------------------------

## Props
###### editorApiPathProps
    path: string, (full path, ie. https://example.com:8080/path?query#hash)
    ferdigstillFunction?: Function, (callback for ferdigstill button)
    enableDelete?: boolean (enable delete button, delete function is untested)

###### editorApiOptionProps
    host: string, (host ie https://example.com:8080)
    version?: string, (empower version)
    locale?: string, (locale)
    docId: string, (document ID)
    showUserLogs?: string | boolean, (console logging toggle)
    documentNumber?: string | number,
    page?: string | number, 
    ferdigstillFunction?: Function, (callback for ferdigstill button)
    enableDelete?: boolean (enable delete button, delete function is untested)

## Install
    npm i nav-empower-frontend
## Usage
    <NavEmpowerFrontend [editorApiPathProps OR editorApiOptionProps] />

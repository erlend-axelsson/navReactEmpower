import React from 'react';
import './App.css';
import EditorApiComponent from "./EditorApiComponent";
type appProps = {
  empowerServerUrl: string
}

const App: React.FC<appProps> = (props) => {
  return <EditorApiComponent originToWhichMessagesWillBePosted={props.empowerServerUrl} />
};

export default App;






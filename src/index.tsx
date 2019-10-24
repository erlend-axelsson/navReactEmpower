import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import EditorApiComponent from "./EditorApiComponent";



ReactDOM.render(<EditorApiComponent originToWhichMessagesWillBePosted={"http://localhost:8000"} />, document.getElementById('root'));
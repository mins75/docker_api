import ReadForm from './components/ReadForm';
import DeleteForm from './components/DeleteForm';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';

import { useState } from 'react';
import './App.css';

function App() {

  const [crud, setCrud] = useState("create");


  return (
    <div className="App" id="form">
      <h2 class="header">Siret analyzer</h2>
      <div class = "multi-button">
        <button id="buttonz" onClick={() => setCrud("create")}><i class="fas fa-database"></i>Create</button>
        <button id="buttonz" onClick={() => setCrud("read")}><i class="fas fa-book-reader"></i>Read</button>
        <button id="buttonz" onClick={() => setCrud("update")}><i class="fas fa-edit"></i>Update</button>
        <button id="buttonz" onClick={() => setCrud("delete")}><i class="fas fa-trash-alt"></i>Delete</button>

        {(crud === "read") && <ReadForm/> }
        {(crud === "delete") && <DeleteForm/>}
        {(crud === "update") && <UpdateForm/>}
        {(crud === "create") && <CreateForm/>}
      </div>
    
    </div>
    
    
  );
}

export default App;

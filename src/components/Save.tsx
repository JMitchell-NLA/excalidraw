import React, { useState } from 'react';
import logo from './logo.svg';
import './Save.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderOpen,faPenSquare,faTrash,faSave,faTimes } from '@fortawesome/free-solid-svg-icons'
import { windowFuncs } from './App'
import { CloudDocInfo } from './App';


// now the odd thing about this is that because the current reload mechanism
// involves forcing a page refresh I actually, strictly speaking; only need the open
// button, since the other endpoints aren't implemented yet.
// to a large extent this is just a throwaway component, however it can have the list of docs
// passed to it as a prop, which is what we're going to do. 

/** To export this into a component that will be usable in excalidraw
 * we first need to: 1) Wrap it in a file.  2) Give it an export parameter. 3) Import it into excalidraw's app.tsx; 
 * 4) Give it a prop that sets whether it is visible or not. 5) Give excalidraw toolbar a reference to set that visibility. 
 * 6) Change the references slightly so it can handle the excalidrawStore items 7) add a filter. 8)                                                      
 * 
 * 7) Need a button that will dismiss this UI
 * */



const handleRename = (id:number,e:any) => {
  // call the rename API
  console.log("tried to handle rename")
}

const handleDelete = (id:number,e:any) => {
 // call the delete API
}

const handleLoad = (id:number,e:any) => {
 // call the load API
 (window as windowFuncs).loadDoc(id);
}

const Save = (props:any) => {
  const [show,setShow] = useState(false);
  const [filter,setFilter] = useState("");

  let sorted;
  if(typeof props.docs !== "undefined"){
    sorted = [...props.docs]
    sorted.sort((a,b) => a.dateLastSaved.localeCompare(b.dateLastSaved))
  }

  return (
    <div className="Save-fixed-right-positioner">
    <div className={show?"Save-hidden-save":"Save-collapsed-save"} onClick={()=>{setShow(true)}}>
      <FontAwesomeIcon className="Save-button-icon" icon={faSave}/>
    </div>  
    <div className={show?"Save-container-pane":"Save-hidden-save"}>
        <div className="Save-pane-content-container">
          <div className="Save-pane-header-container">
            <h3 className="Save-pane-header">Cloud docs</h3>
            <div className="Save-search-box-container"><input type="text" className="Save-search-box" onChange={(e)=>{setFilter(e.target.value)}}></input></div>
            <FontAwesomeIcon className="Save-sbutton-icon Save-close-icon" icon={faTimes} onClick={()=>{setShow(false)}}></FontAwesomeIcon>
          </div>
            <div>
            {
              (typeof sorted === "undefined")?"":sorted.filter((entry:CloudDocInfo) =>{return (entry.name.indexOf(filter)!= -1)||filter==""}).map((entry:CloudDocInfo) => {
                return (
                <div className="Save-entry-container" key={entry.id}>
                <p className="Save-entry-name">{entry.name}</p>
                {/* <div className = "pane-button" onClick={(e) => handleRename(entry.id,e)}> <FontAwesomeIcon className="Save-button-icon" icon={faPenSquare}/> </div>  */}
                <div className="Save-pane-button" onClick={(e) => handleLoad(entry.id,e)}> <FontAwesomeIcon className="Save-button-icon" icon={faFolderOpen}/> </div>
                {/* <div className = "pane-button"> <FontAwesomeIcon className="Save-button-icon" icon={faTrash} /></div> */}
                </div>
                )
              })
            }
            </div>
        </div>
    </div>
</div>
  );
}

export default Save;

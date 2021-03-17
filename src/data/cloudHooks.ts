import axios from 'axios';
import { clearAppStateForLocalStorage } from "../appState";
import { globalSceneState} from "../scene";

import { loadScene } from "../data";
import {CloudDocInfo} from "../components/App" // This strikes me as a a little bit off.


export interface Window {   // It may be that the functions should be declared here instead
    // of the body of typescript.
    // TS linter may be helpful here.
restoreFromURL(name: string): any; // implemented
SaveToURL(url:string,name: string): any; // implemented
listDocs():any; // lists cached docs - complains if there's no server 
fetchDocs():any; // populates docs cache , depends on activcate cloud lists docs.
loadDoc(id:number):any; // loads a doc by index from the server 
loadDoc(id:number,ver:number):any; // load a doc and an index 
getVersions(id:number):any; // lists version for a given ID - not implemented servderside
saveAlt(id:number):any; 
activateCloud(URL:string):any; // should set the server URL, then fetch + list the docs.
saveActiveDoc():any;
saveNewDoc(name:string):any;
activeDocIndex:number;
activeDocName:String;
isOnOldVersion:boolean;
isCloudConnected:boolean;
serverURL:string;
SaveDoc():any;
cloudDocs:CloudDocInfo[];
docsUpToDate:boolean;
}

function addWindowFunctions(window:any,that:any){
    // I PUT IT HERE.
    window.SaveToURL = async (url:string,name:string) => {

        // This method is synchronous up until the post request.
        // so we don't need a return value from it.
        
        let appState = clearAppStateForLocalStorage(that.state);
        let elements = globalSceneState.getElementsIncludingDeleted()
  
        if (elements.length == 0){
          console.log("aborting save, elements array was empty.");
          return;
        }      
  
        
  
        let appStateJSON = JSON.stringify(appState)
        let elementsJSON = JSON.stringify(elements)
        let update = false;
  
        if(name == ""){ // this is hacky AF
          update = true;
         }
  
        return await axios({ // hopefully this returns the ID. 
          method: update?'put':'post',
          url: url,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type':'application/json'
          },
          data: {
            elements:elementsJSON,
            state:appStateJSON,
            name:update?window.activeDocName:name,
          }
        });
      };
  
      window.restoreFromURL = async (url: string) => {
        let scene = await loadScene(url);
        that.syncActionResult(scene);
    };
  
      window.fetchDocs = async () => {
        // needs to fetch the docs list from the server,
        // but that hasn't been set yet so.
        let response = await axios.get(window.serverURL+"/names")
        // should auto map
        window.cloudDocs = response.data;
        console.log(window.cloudDocs.length + "records fetched");
        return response;
    };
  
      window.listDocs = async () => {
        if(window.cloudDocs){
            window.cloudDocs.forEach((e:any) => 
          {console.log(`${e.id} ${e.name} ${e.dateLastSaved}`)});
        }
      }
  
      window.activateCloud = async (url: string) => {
       // needs to set the serverURL value.
       console.log("Cloud server is now" + url);
       window.serverURL = url;
       await window.fetchDocs(); // implemented, untested
       await window.listDocs(); // 
       window.isCloudConnected = true;
       window.activeDocIndex = -1;
    };
  
    window.saveActiveDoc = async () => {
        if(window.activeDocIndex>0){
         await window.SaveToURL(window.serverURL+"/"+window.activeDocIndex,"")
        } else {
          console.log("save failed, no active doc")
        }
        return true; // Hack to ensure things are executed in order, find a better way to do this.
    }
  
    window.loadDoc = async (id:number) => {
  
      // add exception handling for if you put the wrong number in here.
  
      // Save the previous document if one was open
      if(window.isCloudConnected && window.activeDocIndex>0){
        let s = await window.saveActiveDoc();
      }
      
      try {
      let req = await window.restoreFromURL(window.serverURL+"/"+id);
        if(req.status != 200) throw req;
      window.activeDocIndex = id;
  
      // this should probably live in it's own function
      window.activeDocName = window.cloudDocs.filter((cd:any) => cd.id == id)[0].name;
      window.isCloudConnected = true;
  
      console.log(`document number ${id} restored! from cloud.`)
    }
    catch {
      console.log(" I'm sorryworry senpai, I couldn't fetch the document ~UwU")
    }
    }
      
    window.saveNewDoc = async (name:string) => {
  
        let w = await window.SaveToURL(window.serverURL,name);
        // Put the freeze here!
        
        let l:CloudDocInfo[] = await window.fetchDocs();
        // try catch block should go her
        let doc = l.filter(l => {l.name = name});
  
        window.loadDoc(doc[0].id);
        console.log(`new doc saved with id: ${name}`)
    }

}

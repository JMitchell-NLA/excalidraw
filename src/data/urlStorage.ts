import { AppState, LibraryItems } from "../types";
import { restore } from "./restore";
import { getDefaultAppState } from "../appState";
import Window from "../components/App"
const axios = require('axios');

/*

      __      __  __  __         ______ _          _     _______                              _       _                    _   _               _       _                 _ 
     / /     / / |  \/  |       |  ____(_)        | |   |__   __|                            (_)     | |                  | | | |             | |     | |               | |
    / /     / /  | \  / |_   _  | |__   _ _ __ ___| |_     | |_   _ _ __   ___  ___  ___ _ __ _ _ __ | |_   _ __ ___   ___| |_| |__   ___   __| |  ___| |_ ___  _ __ ___| |
   / /     / /   | |\/| | | | | |  __| | | '__/ __| __|    | | | | | '_ \ / _ \/ __|/ __| '__| | '_ \| __| | '_ ` _ \ / _ \ __| '_ \ / _ \ / _` | / __| __/ _ \| '__/ _ \ |
  / /     / /    | |  | | |_| | | |    | | |  \__ \ |_     | | |_| | |_) |  __/\__ \ (__| |  | | |_) | |_  | | | | | |  __/ |_| | | | (_) | (_| | \__ \ || (_) | | |  __/_|
 /_/     /_/     |_|  |_|\__, | |_|    |_|_|  |___/\__|    |_|\__, | .__/ \___||___/\___|_|  |_| .__/ \__| |_| |_| |_|\___|\__|_| |_|\___/ \__,_| |___/\__\___/|_|  \___(_)
                          __/ |                                __/ | |                         | |                                                                         
                         |___/                                |___/|_|                         |_|                                                                         

*/



export const restoreFromUrl = async (url:String):Promise<any> => {

    let savedElements = null;
    let savedState = null;

    // Future me's problem .. this should probably live in a try catch block.
    let response
    try {
    response = await axios.get(url)
        savedElements = response.data.elements
        savedState = response.data.state
    } catch {
        console.log("Restore from URL failed.")
    }
    
      let elements = [];
      if (savedElements) {
        try {
          elements = JSON.parse(savedElements);
        } catch {
          console.log("could not parse elements")
        }
      }
    
      let appState = null;
      let defaultAppState = getDefaultAppState();

      if (savedState) {
        try {
          appState = JSON.parse(savedState) as AppState;
          // If we're retrieving from local storage, we should not be collaborating
          appState.isCollaborating = false;
          appState.collaborators = new Map();
          delete appState.width;
          delete appState.height;

          appState = {...appState,...defaultAppState}
        } catch {
          console.log("could not parse state")
        }
      }
      console.log(elements)
      console.log(appState)

      window.lastHttpStatus = response.status+""
      let leadingDigit = window.lastHttpStatus.substr(0,1);
      if(leadingDigit === "2"){
        window.lastSuccessfulPut = new Date();
      }
    
      return restore(elements, appState);
    
  };
  


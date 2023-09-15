import { populate_HTML_Calender, clickToday} from "./function/generate.js";
import { dates } from "./function/eListeners.js";
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
export let projects_ALL
export var pageLoaded = false;

//-----------------------------------------------------------------

(function() {
    setLocalStorage()
    populate_HTML_Calender(dates.year, dates.month)
    pageLoaded = true

    clickToday()
})();

function setLocalStorage() {
    const skeleton = [
        {
            name: "calProjects",
            day_Objects: []
        },
        {
            name: "not_calProjects",
            objects: []
        }
    ]

    if (localStorage.getItem("projects_ALL") !== null) {
        projects_ALL = JSON.parse(localStorage.getItem("projects_ALL"))
    
    } else {
        localStorage.setItem("projects_ALL", JSON.stringify(skeleton));
        projects_ALL = JSON.parse(localStorage.getItem("projects_ALL"))
    }

    
}



///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////








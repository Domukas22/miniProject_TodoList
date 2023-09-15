import { projects_ALL } from "../index.js"
import { remove_unusedDays } from "./logic.js"
import { months } from "./eListeners.js"

import { hasDayPassed, isWeekend, containsTodos, collectTitles, findToday } from "./other.js"
import { find_dayObj, create_Todo, create_todoLive, findSelectedDay, create_Blanks } from "./other.js"


function populate_HTML_rightSide(chosenObj) {

    const html_todoBundle_right = document.querySelector('.todo_wrap_right')
    html_todoBundle_right.innerHTML = ''

    const pageHeading_right = document.getElementById('title_Right')
    pageHeading_right.textContent = chosenObj.title

    pageHeading_right.setAttribute('data-month', chosenObj.month)
    pageHeading_right.setAttribute('data-year', chosenObj.year)

    create_Todo(chosenObj).forEach( todo => {
        html_todoBundle_right.appendChild(todo)
    })

}
function add_singleTodo_rightSide(singleTodo) {
    
    const html_todoBundle_right = document.querySelector('.todo_wrap_right')
    const todo = create_todoLive(singleTodo)
    html_todoBundle_right.appendChild(todo)
    console.log("hello");
    setTimeout(() => {
        todo.classList.remove('added')
    }, 1); 
}

//----------------------------------------------------
function populate_HTML_Calender(chosenYear, chosenMonth) { 

    remove_unusedDays()
    
    const html_content = document.querySelector('.calender')
    const pageHeading = document.querySelector('.mainTitle')
    const blank_Count = new Date(chosenYear, chosenMonth, 0).getDay()
    
    html_content.innerHTML = ''
    pageHeading.textContent = months[chosenMonth] + " " + chosenYear
    
    create_Blanks(blank_Count).forEach(blank => {
        html_content.appendChild(blank)
    })


    create_calDays(chosenMonth, chosenYear).forEach( day => {
        html_content.appendChild(day)
    })

    findSelectedDay()
    localStorage.setItem("projects_ALL", JSON.stringify(projects_ALL))
}

function load_calenderDay(obj, obj_date) {  

    if (find_dayObj(obj_date)) {
        populate_HTML_rightSide(find_dayObj(obj_date))
    } else {
        projects_ALL[0].day_Objects.push(obj)
        populate_HTML_rightSide(obj)        
    }

    findSelectedDay()
} 

function create_calDays(given_Month, given_Year) {

    const daysInMonth = new Date(given_Year, given_Month + 1, 0).getDate()
    let output = []

    for (let i = 1; i < daysInMonth + 1; i++) {

        const cal_Day = document.createElement('p')
        cal_Day.classList.add('calNumber')
        cal_Day.textContent = i

        const html_DAY = document.createElement('div')
        html_DAY.classList.add('day')
        html_DAY.setAttribute("data-date", `${i}. ${months[given_Month]} ${given_Year}`)
        html_DAY.setAttribute("data-day", i)
        html_DAY.appendChild(cal_Day)

        const obj_Day = {
            html_DAY,
            title: `${i}. ${months[given_Month]} ${given_Year}`,
            type: 'calDay',
            todos:[],
            date: new Date(given_Year, given_Month, i),
    
            // localStorage converts the date to a string.
            // this solves the problem at populate_HTML_rightSide, pageHeadingRight
            year: given_Year,
            month: given_Month,
    
        }

        // DAY CLICK
        html_DAY.addEventListener('click', () => { 
            load_calenderDay(obj_Day, obj_Day.html_DAY.dataset.date)
            remove_unusedDays()    
        })
    
        if (isWeekend(given_Year, given_Month, i)) {
            html_DAY.classList.add('weekendDay')  
        }
        if (hasDayPassed(obj_Day.date)) {
            obj_Day.html_DAY.classList.add('day_passed')
        }
        if (containsTodos(obj_Day.title)) { 
            collectTitles(obj_Day.title).forEach(html_title => {
                obj_Day.html_DAY.appendChild(html_title)
            })
        }
        if (findToday(i, given_Month, given_Year)) {
            obj_Day.html_DAY.classList.add('today')
        }

        output.push(html_DAY)
    }

    return output
}

//----------------------------------------------------
function clickToday() {
    const html_calenderChildren = document.querySelector('.calender').children
    const html_today = Array.from(html_calenderChildren).filter( day => day.dataset.day == new Date().getDate())[0]

    html_today.click()
    
}

export { clickToday, populate_HTML_rightSide, populate_HTML_Calender, load_calenderDay}
export { add_singleTodo_rightSide}
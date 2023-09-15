import { toggle_todoTemplate, submit_Todo, change_CalenderView, selected_Dates  } from "./logic.js"
import { populate_HTML_Calender } from "./generate.js"

export const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const dates = {
    today: new Date(),
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    weekDay: new Date().getDay(),
    dayOfMonth: new Date().getDate(),
}

const btn_newTodo = document.querySelector('.add_todo_btn')
const btn_canTodo = document.getElementById('btn_cancelTodo')
const btn_subTodo = document.getElementById('btn_submitTodo')
const buttons_changeMonths = document.querySelectorAll('.btn_changeMonth')

btn_newTodo.addEventListener('click', toggle_todoTemplate)
btn_canTodo.addEventListener('click', toggle_todoTemplate)
btn_subTodo.addEventListener('click', () => {
    
    submit_Todo();
    populate_HTML_Calender(selected_Dates.sel_Year, selected_Dates.sel_Month) 
})

buttons_changeMonths.forEach(btn => btn.addEventListener('click', (e) => {
    change_CalenderView(e.currentTarget.id)
}))

document.addEventListener('keydown', (e) => {
    if (e.key == 'Escape') {
        btn_canTodo.click()
    }
})








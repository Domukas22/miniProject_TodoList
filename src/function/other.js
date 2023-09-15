
import { dates } from "./eListeners.js";
import { projects_ALL } from "../index.js";
import { openTodo, delete_Todo, change_todo_priority, toggle_editTodo, selected_Dates } from "./logic.js";
import { populate_HTML_Calender } from "./generate.js";


function hasDayPassed(given_Date) {
    const YEAR = given_Date.getFullYear()
    const MONTH = given_Date.getMonth()
    const DAY = given_Date.getDate()

    // find days passed
    if ((DAY < dates.dayOfMonth && MONTH == dates.month && YEAR == dates.year)
       || (MONTH < dates.month && YEAR == dates.year)
       || (YEAR < dates.year)) {
        return true

    } else {
        return false
    }
}

function isWeekend(year, month, day) {
    const weekDay = new Date(year, month, day).getDay()

    if (weekDay == 6 || weekDay == 0) {
        return true
    } else {
        return false
    }
}

function containsTodos(given_Title) {
    const dayList = projects_ALL[0].day_Objects

    if (dayList.some(day => day.title == given_Title)) {
        return true
    } return false
}

function collectTitles(given_Title) {
    
    const todos = projects_ALL[0].day_Objects.filter(p => p.title == given_Title)[0].todos

    let output = []

    for (let i = 0; i < todos.length; i++) {
        const todo_Priority = todos[i].priority
        const title_Todo = document.createElement('p')

        title_Todo.textContent = todos[i].todoName
        title_Todo.classList.add('dayBox_todoTitle')
        title_Todo.classList.add(todo_Priority)
        // const Dot = document.createElement('div')
        // Dot.classList.add('mark_activeTodo')
        // Dot.classList.add(todo_Priority)
        output.push(title_Todo)
    }

    return output
}

function findToday(day, month, year) {
    if (day == dates.dayOfMonth && month == dates.month && year == dates.year) {
        return true
    } return false
}

function findSelectedDay() {
    const title_rightSide = document.getElementById('title_Right').textContent
    const html_content = document.querySelector('.calender')

    Array.from(html_content.children).forEach(day => {

        if (title_rightSide == day.dataset.date) {
            day.classList.add('selected')
        } else {
            day.classList.remove('selected')
        }
    })
}

function create_Blanks(count) {
    let output = []

    for (let i = 0; i < count; i++) {
        const html_Blank = document.createElement('div')
        html_Blank.classList.add('blankDay')
        output.push(html_Blank)
    }

    return output
}

function find_dayObj(date_Title) {
    const obj = projects_ALL[0].day_Objects.filter(p => p.title == date_Title)[0] 

    if (obj == undefined) {
        return false
    } return obj
}

function create_Todo(given_Obj) {

    let output = []
    given_Obj.todos.forEach(todo => { 

        const todo_Div = document.createElement('div')
        todo_Div.classList.add('todo')
        todo_Div.setAttribute("data-ID", todo.id)

        

        todo_Div.innerHTML = `
                            <div class="todo_Front">                        
                                <div class="todo_title ${todo.priority}" contenteditable="false">${todo.todoName}</div>
                                <div class="line_todoTitle ${todo.priority}"></div>
                                <p class="todo_desc preview">${todo.todoDesc}</p>
                            </div>
                            <div class="todo_Back">
                                <div class="temp">
                                    <p class="todo_desc content" contenteditable="false"> ${todo.todoDesc}</p>
                                </div>
                                <div class="todo_buttons_wrap">
                                    <div class="todo_btn shrink">
                                        <img src="./img/Arrow up.svg" class="icon_btn arrow">
                                    </div> 
                                    <div class="todo_btn edit">
                                        <div class="todo_btn btns_editWrap">
                                            <div class="todo_btn subEdit">Save</div>
                                            <div class="todo_btn canEdit">Cancel</div>
                                         </div>
                                         <img src="../src/img/pen_Edit.svg" class="icon_btn edit">
                                    </div>
                                    <div class="todo_btn delete">
                                        <div class="line one"></div>
                                        <div class="line two"></div>
                                    </div>
                                    <div class="todo_btn priority">
                                        <div class="edit_PriorityWrap">
                                            <input type="radio" name="${todo.id}" class="edit_Priority low" id="low"></input>
                                            <input type="radio" name="${todo.id}" class="edit_Priority medium" id="medium"></input>
                                            <input type="radio" name="${todo.id}" class="edit_Priority high" id="high"></input>
                                        </div>
                                        <div class="mark_priorityEditBtn ${todo.priority}"></div>
                                    </div>  
                                    
                                </div> 
                            </div> 
                            <div class="todo_Trigger"></div>`

        const btn_showPrioRadios = todo_Div.querySelector('.todo_btn.priority')
        const radio_editPrio = todo_Div.querySelectorAll('.edit_Priority')
 
//--------------------------
        btn_showPrioRadios.addEventListener('click', (e) => {
            e.currentTarget.classList.add('active')
            e.stopImmediatePropagation()
        })
        // select new color
        radio_editPrio.forEach(btn => btn.addEventListener('click', (e) => {

            const wrap_prioritySelection = e.currentTarget.parentElement.parentElement
            change_todo_priority(e.currentTarget.id, todo, todo_Div, wrap_prioritySelection)
            e.stopImmediatePropagation()
        }))

        // autofocus active priority radio
        radio_editPrio.forEach(btn => {
            if (btn.id == todo.priority) {
                btn.checked = true
            }
        })
//--------------------------

        // OPEN todo
        todo_Div.querySelector('.todo_Trigger').addEventListener('click', (e) => { 
            openTodo(e.currentTarget.parentElement, todo)
            e.stopPropagation() 
        })
        // DELETE todo
        todo_Div.querySelector('.todo_btn.delete').addEventListener('click', (e) => {
            const todo_id = e.currentTarget.parentElement.parentElement.parentElement.dataset.id;
            const html_selectedTodo = e.currentTarget.parentElement.parentElement.parentElement

            html_selectedTodo.style.opacity = '0%'
            html_selectedTodo.style.height = '0px'
            
            setTimeout(() => {
                html_selectedTodo.style.display = 'none'
                delete_Todo(todo_id)
                populate_HTML_Calender(selected_Dates.sel_Year, selected_Dates.sel_Month);
                
            }, 150);
            
            e.stopImmediatePropagation()    
        })
        // CLOSE todo
        todo_Div.querySelector('.todo_btn.shrink').addEventListener('click', (e) => {
            const html_selectedTodo = e.currentTarget.parentElement.parentElement.parentElement
            openTodo(html_selectedTodo, todo)
            e.stopImmediatePropagation()
            
        })
        // Fix the click on the margin
        todo_Div.querySelector('.todo_btn.btns_editWrap').addEventListener('click', (e) => { 
            e.stopPropagation()    
        })
//--------------------------

        // EDIT todo
        todo_Div.querySelector('.todo_btn.edit').addEventListener('click', (e) => {
            e.stopPropagation()    
            const todoEl = e.currentTarget.parentElement.parentElement.parentElement
            toggle_editTodo(todoEl, todoEl.dataset.id, false)
        })
        // submitEdit
        todo_Div.querySelector('.todo_btn.subEdit').addEventListener('click', (e) => {
            const todoEl = e.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement
            toggle_editTodo(todoEl, todoEl.dataset.id, false);

            e.stopImmediatePropagation()    
        })
        // canEdit
        todo_Div.querySelector('.todo_btn.canEdit').addEventListener('click', (e) => {
            const todoEl = e.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement
            toggle_editTodo(todoEl, todoEl.dataset.id, true);

            e.stopImmediatePropagation()    
        })
//--------------------------
        output.push(todo_Div)  
})
    return output
}

function create_todoLive(given_Obj) {
    console.log('hello');

    const todo_Div = document.createElement('div')
    todo_Div.classList.add('todo')
    todo_Div.setAttribute("data-id", given_Obj.id)
    console.log('hello');
    todo_Div.innerHTML = `
                            <div class="todo_Front">                        
                                <div class="todo_title ${given_Obj.priority}" contenteditable="false">${given_Obj.todoName}</div>
                                <div class="line_todoTitle ${given_Obj.priority}"></div>
                                <p class="todo_desc preview">${given_Obj.todoDesc}</p>
                            </div>
                            <div class="todo_Back">
                                <div class="temp">
                                    <p class="todo_desc content" contenteditable="false">${given_Obj.todoDesc}</p>
                                </div>
                                <div class="todo_buttons_wrap">
                                    <div class="todo_btn shrink">
                                        <img src="./img/Arrow up.svg" class="icon_btn arrow">
                                    </div> 
                                    <div class="todo_btn delete">
                                        <div class="line one"></div>
                                        <div class="line two"></div>
                                    </div>
                                    <div class="todo_btn edit">
                                        <div class="todo_btn btns_editWrap">
                                            <div class="todo_btn subEdit">Save</div>
                                            <div class="todo_btn canEdit">Cancel</div>
                                         </div>
                                         <img src="./img/pen_Edit.svg" class="icon_btn edit">
                                    </div>
                                    <div class="todo_btn priority">
                                        <div class="edit_PriorityWrap">
                                            <input type="radio" name="${given_Obj.id}" class="edit_Priority low" id="low"></input>
                                            <input type="radio" name="${given_Obj.id}" class="edit_Priority medium" id="medium"></input>
                                            <input type="radio" name="${given_Obj.id}" class="edit_Priority high" id="high"></input>
                                        </div>
                                        <div class="mark_priorityEditBtn ${given_Obj.priority}"></div>
                                    </div>  
                                    
                                </div> 
                            </div> 
                            <div class="todo_Trigger"></div>`
                            
    const btn_showPrioRadios = todo_Div.querySelector('.todo_btn.priority')
    const radio_editPrio = todo_Div.querySelectorAll('.edit_Priority')

//--------------------------
    btn_showPrioRadios.addEventListener('click', (e) => {
        e.currentTarget.classList.add('active')
        e.stopImmediatePropagation()
    })

    // select new color
    radio_editPrio.forEach(btn => btn.addEventListener('click', (e) => {

        const wrap_prioritySelection = e.currentTarget.parentElement.parentElement
        change_todo_priority(e.currentTarget.id, given_Obj, todo_Div, wrap_prioritySelection)
        e.stopImmediatePropagation()
    }))

    // autofocus active priority radio
    radio_editPrio.forEach(btn => {
        if (btn.id == given_Obj.priority) {
            btn.checked = true
        }
    })

//--------------------------
    // OPEN todo
    todo_Div.querySelector('.todo_Trigger').addEventListener('click', (e) => { 
        openTodo(e.currentTarget.parentElement, given_Obj)
        e.stopPropagation() 
    })
    // DELETE todo
    todo_Div.querySelector('.todo_btn.delete').addEventListener('click', (e) => {
        const todo_id = e.currentTarget.parentElement.parentElement.parentElement.dataset.id;
        const html_selectedTodo = e.currentTarget.parentElement.parentElement.parentElement

        html_selectedTodo.style.opacity = '0%'
        html_selectedTodo.style.height = '0px'
        
        setTimeout(() => {

            //const year = 
            delete_Todo(given_Obj.id)
            populate_HTML_Calender(selected_Dates.sel_Year, selected_Dates.sel_Month);
        }, 150);
        
        e.stopImmediatePropagation()    

        
    })
    // CLOSE todo
    todo_Div.querySelector('.todo_btn.shrink').addEventListener('click', (e) => {
        const html_selectedTodo = e.currentTarget.parentElement.parentElement.parentElement
        openTodo(html_selectedTodo, given_Obj)
        e.stopImmediatePropagation()
        
    })

//--------------------------
     // EDIT todo
     todo_Div.querySelector('.todo_btn.edit').addEventListener('click', (e) => {
        e.stopPropagation()    
        const todoEl = e.currentTarget.parentElement.parentElement.parentElement
        toggle_editTodo(todoEl, todoEl.dataset.id, false)
    })

    // submitEdit
    todo_Div.querySelector('.todo_btn.subEdit').addEventListener('click', (e) => {
        const todoEl = e.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement
        toggle_editTodo(todoEl, todoEl.dataset.id, false);

        e.stopImmediatePropagation()    
    })

    // canEdit
    todo_Div.querySelector('.todo_btn.canEdit').addEventListener('click', (e) => {
        const todoEl = e.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement
        toggle_editTodo(todoEl, todoEl.dataset.id, true);

        e.stopImmediatePropagation()    
    })
//--------------------------
    todo_Div.classList.add('added')

    return todo_Div
}


export { hasDayPassed, isWeekend, containsTodos, collectTitles, findToday, findSelectedDay, create_Blanks }
export { find_dayObj, create_Todo, create_todoLive}
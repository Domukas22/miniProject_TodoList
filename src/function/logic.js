import { projects_ALL, pageLoaded } from "../index.js"
import { add_singleTodo_rightSide } from "./generate.js"
import { populate_HTML_Calender } from "./generate.js";
import { dates } from "./eListeners.js";

export const selected_Dates = {
    sel_Month: dates.month,
    sel_Year: dates.year
}

function toggle_todoTemplate() {
    const todoTemplate = document.getElementById('todo_template_right');
    const btn_newTodo = document.querySelector('.add_todo_btn')
    
    if (!todoTemplate.classList.contains('show')) {
        btn_newTodo.style.opacity = '0%'
        todoTemplate.classList.add('show')
    
    } else {
        todoTemplate.classList.remove('show')
        toggle_todoInput()
        setTimeout(() => {
            btn_newTodo.style.opacity = '100%'
        }, 60);
    }

    // console.log(todoTemplate.getBoundingClientRect().height);
}
function toggle_todoInput() {
    const input_title = document.querySelector('.input_todo.title');
    const input_desc = document.querySelector('.input_todo.desc');
    const radio_low = document.querySelector('.input_priority.low');

    input_title.value = '';
    input_desc.value = ''
    radio_low.checked = true
    input_title.focus()
}
//-----------------------------------------------------------------

function submit_Todo() {
    
    const input_title = document.querySelector('.input_todo.title').value


    if (!input_title.match(/^[a-z|[0-9]/i)) {
        return 
    } else {
        const input_desc = document.querySelector('.input_todo.desc').value
        const priorityInputs= document.querySelectorAll('.input_priority')
        const input_priority = Array.from(priorityInputs).filter(inp => inp.checked == true)[0].dataset.priority;

        find_displayedDay().todos.push({
            todoName: input_title,
            todoDesc: input_desc,
            priority: input_priority,
            id: generateID(),
            open: false,
            height: undefined,
        });

        const obj_theTodo = find_displayedDay().todos.filter(todo => todo.todoName == input_title)[0]

        // populate_HTML_rightSide(find_displayedDay())
        add_singleTodo_rightSide(obj_theTodo)
        toggle_todoInput()

    }

    
}

let height_current;

function openTodo(todo_el, todo_obj) {
    
    const todo_Tigger = todo_el.querySelector('.todo_Trigger')
    const todo_desc = todo_el.querySelector('.todo_desc.content')
    const todo_Front = todo_el.querySelector('.todo_Front')
    todo_el.classList.toggle('open')

    if (todo_el.classList.contains('open')) {
        const newH = 64 + todo_Front.getBoundingClientRect().height + todo_desc.getBoundingClientRect().height
        height_current = newH
        todo_el.style.height = `${newH}px`

    } else {
        todo_el.style.height = '50px';
        todo_Tigger.style.display = "block"
        todo_obj.open = false
    }
}

let title_current = "";
let desc_current = "";


function toggle_editTodo(todo_el, todo_id, isCancel) {

    todo_el.classList.toggle('editing')

    const todo_Title = todo_el.querySelector('.todo_title')
    const todo_Desc = todo_el.querySelector('.todo_desc.content')
    const todo_Desc_Preview = todo_el.querySelector('.todo_desc.preview')
    const todo_Tigger = todo_el.querySelector('.todo_Trigger')
    const todo_Front = todo_el.querySelector('.todo_Front')
    const wrap_editBtns = todo_el.querySelector('.btns_editWrap')
    
    if (todo_el.classList.contains('editing')) {
        console.log('open edit');

        todo_Title.setAttribute("contenteditable", true)
        todo_Desc.setAttribute("contenteditable", true)

        todo_Front.style.justifyContent = 'space-between'
        todo_el.style.height = `${height_current + 15 + 50}px`
        todo_Tigger.style.display = "none"
        title_current = todo_Title.textContent
        desc_current = todo_Desc.textContent;

        wrap_editBtns.classList.add('flex')

        setTimeout(() => {
            wrap_editBtns.style.opacity = '100%'
        }, 150);
        
    
        return;

    } 
    else if (!todo_el.classList.contains('editing') && isCancel == true){
        console.log('cancel');
//------------------------------------------------------------
        wrap_editBtns.style.opacity = '0%'
        setTimeout(() => {
            wrap_editBtns.classList.remove('flex')
            todo_Front.style.justifyContent = 'left'
        }, 301);
//------------------------------------------------------------
        todo_Title.setAttribute("contenteditable", false)
        todo_Desc.setAttribute("contenteditable", false)
        

        todo_el.style.height = `${height_current}px`
        todo_Tigger.style.display = "flex"
        todo_Tigger.style.zIndex = "0"

        const newTodos = find_displayedDay().todos.map(todo => {
            if (todo.id == todo_id) {
                todo.todoName = title_current
                todo.todoDesc = desc_current

                todo_Title.textContent = title_current;
                todo_Desc.textContent = desc_current;
                todo_Desc_Preview.textContent = desc_current;
               
            }
            return todo
        })
        find_displayedDay().todos = newTodos
        populate_HTML_Calender(selected_Dates.sel_Year, selected_Dates.sel_Month); 
        return;

    } 
    else if (!todo_el.classList.contains('editing')){
        console.log('submit');


        wrap_editBtns.classList.remove('flex')
        const newH = 75 + todo_Front.getBoundingClientRect().height + todo_Desc.getBoundingClientRect().height 
        height_current = newH
        todo_el.style.height = `${newH}px`

        todo_Title.setAttribute("contenteditable", false)
        todo_Desc.setAttribute("contenteditable", false)

        todo_Tigger.style.display = "flex"
        todo_Tigger.style.zIndex = "0"

        setTimeout(() => {
            todo_Front.style.justifyContent = 'left'
        }, 301);

        const newTodos = find_displayedDay().todos.map(todo => {
            if (todo.id == todo_id) {

                todo.todoName = todo_Title.textContent
                todo.todoDesc = todo_Desc.textContent
                todo_Desc_Preview.textContent = todo_Desc.textContent;
            }
            return todo
        })
        find_displayedDay().todos = newTodos
        populate_HTML_Calender(selected_Dates.sel_Year, selected_Dates.sel_Month); 
        return; 
    }
}

function delete_Todo(id) {

    const newTodos = find_displayedDay().todos.reduce((box, todo) => {
        if (todo.id != id) {
            box.push(todo)
        } else {
            // console.log('delete this');
            // console.log(todo);
        }
        return box
    },[])

    find_displayedDay().todos = newTodos
}

function change_todo_priority(priority, obj_todo, html_Todo, html_wrapPrioritySelection) {

    obj_todo.priority = priority
    populate_HTML_Calender(selected_Dates.sel_Year, selected_Dates.sel_Month)

    const title = html_Todo.querySelector('.todo_title')
    const line = html_Todo.querySelector('.line_todoTitle')
    const dot = html_Todo.querySelector('.mark_priorityEditBtn')

    title.className = '';
    line.className = '';
    dot.className = '';

    title.classList.add(`todo_title`);
    line.classList.add(`line_todoTitle`);
    dot.classList.add(`mark_priorityEditBtn`);

    title.classList.add(priority)
    line.classList.add(priority)
    dot.classList.add(priority)

    html_wrapPrioritySelection.classList.remove('active')
    // console.log('change this');
    // console.log(obj_todo);
}
//-----------------------------------------------------------------

function find_displayedDay() {
    const dateOf_displayedDay = document.getElementById('title_Right').textContent
    const obj_displayedDay = projects_ALL[0].day_Objects.filter(p => p.title == dateOf_displayedDay)[0]
    // console.log(obj_displayedDay);
    return obj_displayedDay
}
function remove_unusedDays() {

    if (pageLoaded == false) {
        return
    } else {
         
        projects_ALL[0].day_Objects.forEach((element, index) => {  
            if (element.todos.length == 0 && element.title != find_displayedDay().title) {
                //console.log('unused');
                // console.log(element);

                projects_ALL[0].day_Objects.splice(index, 1)
                
            }
        })           
    }
}
function generateID() {
    let id = []
    for (let i = 0; i < 50; i++) {
        const nr = Math.floor(Math.random() * 10)
        id += nr
        
    }
    return parseInt(id)
}
//-----------------------------------------------------------------

function change_CalenderView(btn_Clicked) {
    switch (btn_Clicked) {
//============================================= 
        case 'prev':
            if (selected_Dates.sel_Month == 0) {
                selected_Dates.sel_Month = 11
                selected_Dates.sel_Year --
              } else {
                selected_Dates.sel_Month --
              }
        break;
//--------------------------------------------   
        case 'now':
            selected_Dates.sel_Year = dates.year
            selected_Dates.sel_Month = dates.month
        break;
//--------------------------------------------    
        case 'next':
          if (selected_Dates.sel_Month == 11) {
            selected_Dates.sel_Month = 0
            selected_Dates.sel_Year ++
          } else {
            selected_Dates.sel_Month ++
          }
          
          
        break;
      }
//=============================================  

populate_HTML_Calender(selected_Dates.sel_Year, selected_Dates.sel_Month)


}


export {toggle_todoInput, toggle_todoTemplate, submit_Todo, delete_Todo, openTodo, toggle_editTodo }
export {remove_unusedDays, find_displayedDay, change_todo_priority, change_CalenderView}







 
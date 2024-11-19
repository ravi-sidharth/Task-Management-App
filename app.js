let todos = JSON.parse(localStorage.getItem('todos')) || []     
let editingIndex = -1
let filterTodos = []

let formSubmit = document.getElementById('formSubmit')
let submitBtn = document.querySelector('button')
let taskTitle = document.getElementById('taskTitle')
let taskDescription = document.getElementById('taskDescription')
let taskDueDate = document.getElementById('taskDueDate')
let priorityLevel = document.getElementById('priorityLevel')

formSubmit.addEventListener('submit',(event)=> { 
    event.preventDefault()

    const newTask = {
        taskTitle: taskTitle.value.trim(),
        taskDescription: taskDescription.value.trim(),
        taskDueDate: taskDueDate.value.trim(),
        priorityLevel: priorityLevel.value.trim(),
        taskCompleted: false
    }

    if (editingIndex >= 0) {
        // Update existing todo
        todos[editingIndex] = newTask
        editingIndex =-1
        submitBtn.textContent = "Add Task"; 
        saveTodosToLocalStorage()
    }
    else {
        todos.push(newTask)
    }
    clearForm()
    renderTodos()
})

function clearForm() {
    taskTitle.value=""
    taskDescription.value=""
    taskDueDate.value=""
    priorityLevel.value=""
}

// function start editing a todo 
function editTodo(index){
    const task = todos[index]
    // console.log(task)

    taskTitle.value = task.taskTitle;
    // console.log(task.taskTitle)

    taskDescription.value = task.taskDescription;
    // console.log(task.taskDescription)

    taskDueDate.value = task.taskDueDate;
    // console.log(task.taskDueDate)

    priorityLevel.value = task.priorityLevel;
    // console.log(task.priorityLevel)
    editingIndex=index
    submitBtn.textContent="Update Task"
   
}

// Function to delete a todo
function deleteTodo(index) {
    todos.splice(index,1)
    saveTodosToLocalStorage()
    renderTodos()
}

function completeTodo(index) {
    // Toggle the task's completed status
    // todos[index].taskCompleted = !todos[index].taskCompleted;

    if (todos[index].taskCompleted) {
        todos[index].taskCompleted = false;
    } else {
        todos[index].taskCompleted = true;
    }
    saveTodosToLocalStorage();
    renderTodos();
}

function renderTodos() {
    const todoList = document.getElementById('pendingTask')
    const completedTaskList = document.getElementById('completedTask')
    todoList.innerHTML=""
    completedTaskList.innerHTML=""
    
    todos.forEach((todo,index)=> {
        const list = document.createElement('div')
        const checked =todo.taskCompleted ? 'checked' : '';

        list.innerHTML =`
        <ul>
            <li><strong>Task Title:</strong> ${todo.taskTitle}</li>
            <li><strong>Task Description:</strong> ${todo.taskDescription}</li>
            <li><strong>Task Due Date:</strong> ${todo.taskDueDate}</li>
            <li><strong>Priority Level:</strong> ${todo.priorityLevel}</li>
        </ul>
            <button class="text-white p-1 bg-yellow-700 rounded-lg mr-2" onclick="editTodo(${index})">Edit</button>
            <button class="text-white p-1 bg-red-700 rounded-lg" onclick="deleteTodo(${index})">Delete</button>
            <button class="text-white mx-2 p-1 bg-green-700 rounded-lg"><input onclick="completeTodo(${index})" class="text-blue" type="checkbox" ${checked}>Completed</button>
        `
        if (todo.taskCompleted) {
            list.className ="bg-slate-300 rounded-lg mt-6 p-3 border-2 opacity-0.2 line-through"
            completedTaskList.appendChild(list);
        } else {
            todoList.appendChild(list);
            list.className ="bg-fuchsia-500 rounded-lg mt-6 p-3 border-2 uppercase"
        }
    })
}

// For data filter function 
const filterTasks = document.getElementById('filterTasks')
filterTasks.addEventListener('change',(e)=>{
    filterTodos=[]

    if (e.target.value=="low"){
        todos.forEach(todo=> {
            if(todo.priorityLevel=="low") {
                filterTodos.push(todo)
            }
        })
    }

    else if (e.target.value=="medium"){
        todos.forEach(todo=> {
            if(todo.priorityLevel=="medium") {
                filterTodos.push(todo)
            }
        })
    }

    else if (e.target.value=="high"){
        todos.forEach(todo=> {
            if(todo.priorityLevel=="high") {
                filterTodos.push(todo)
            }
        })
    }

    else if (e.target.value=="7daysTask"){
        todos.forEach(todo=> {
            const todayDate = new Date().getDate()
            // console.log(todayDate)
            // console.log(todo.taskDueDate)
            const taskDate =new Date(todo.taskDueDate).getDate()
            // console.log(taskDate)
            if(taskDate>todayDate && taskDate<=(todayDate+7)) {
                filterTodos.push(todo)
            }
        })
    }
    
    else if (e.target.value=="pending"){
        todos.forEach(todo=> {
            if(todo.taskCompleted==false){
                filterTodos.push(todo)
            }
        })
    }
    
    else if (e.target.value=="completed"){
        todos.forEach(todo=> {
            if(todo.taskCompleted==true) {
                filterTodos.push(todo)
            }
        })
    }
    saveTodosToLocalStorage();
    renderFilterTodos();
})

function renderFilterTodos() {
    const todoList = document.getElementById('pendingTask')
    const completedTaskList = document.getElementById('completedTask')
    todoList.innerHTML=""
    completedTaskList.innerHTML=""

    filterTodos.forEach((todo,index)=> {
        const list = document.createElement('div')
        const checked =todo.taskCompleted ? 'checked' : '';

        list.innerHTML =`
        <ul>
            <li><strong>Task Title:</strong> ${todo.taskTitle}</li>
            <li><strong>Task Description:</strong> ${todo.taskDescription}</li>
            <li><strong>Task Due Date:</strong> ${todo.taskDueDate}</li>
            <li><strong>Priority Level:</strong> ${todo.priorityLevel}</li>
        </ul>
            <button class="text-white p-1 bg-yellow-700 rounded-lg mr-2" onclick="editTodo(${index})">Edit</button>
            <button class="text-white p-1 bg-red-700 rounded-lg" onclick="deleteTodo(${index})">Delete</button>
            <button class="text-white mx-2 p-1 bg-green-700 rounded-lg"><input onclick="completeTodo(${index})" class="text-blue" type="checkbox" ${checked}>Completed</button>
        `
        if (todo.taskCompleted) {
            list.className ="bg-slate-300 rounded-lg mt-6 p-3 border-2 opacity-0.2 lowercase line-through"
            completedTaskList.appendChild(list);
        } else {
            list.className ="bg-fuchsia-700 rounded-lg mt-6 p-3 border-2 uppercase"
            todoList.appendChild(list); 
        }
    })  
}

function saveTodosToLocalStorage() {
    localStorage.setItem('todos', JSON.stringify(todos)); 
}

window.onload = function() {
    renderTodos();
}
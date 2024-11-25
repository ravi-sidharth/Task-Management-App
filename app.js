const todos = JSON.parse(localStorage.getItem('todos')) || []     
let editingIndex = -1
let filterTodos = []

const formSubmit = document.getElementById('formSubmit')
const submitBtn = document.querySelector('button')
const taskTitle = document.getElementById('taskTitle')
const taskDescription = document.getElementById('taskDescription')
const taskDueDate = document.getElementById('taskDueDate')
const priorityLevel = document.getElementById('priorityLevel')

formSubmit.addEventListener('submit',(event)=> { 
    event.preventDefault()
    const newTask = {
        taskTitle:taskTitle.value.trim(),
        taskDescription:taskDescription.value.trim(),
        taskDueDate:taskDueDate.value.trim(),
        priorityLevel:priorityLevel.value.trim(),
        taskCompleted:false
    }

    if (!newTask.taskTitle){
        alert("The task title is empty, Please write something else!")
        return
    }

    if (!newTask.taskDescription){
        alert("The task Description is empty, Please write something else!")
        return
    }

    const todayDate = new Date()
    todayDate.setHours(0,0,0,0); 
    
    const taskDate = new Date(newTask.taskDueDate)
    taskDate.setHours(0,0,0,0); 
    
    if(taskDate-todayDate<0) {
        alert("The task due date cannot be in the past, Please change it to another upcoming date.")
        return 
        }

    if (editingIndex >= 0) {
        // Update existing todo
        todos[editingIndex] = newTask
        editingIndex =-1
        submitBtn.textContent = "Add Task"; 
    }
    else {
        todos.push(newTask)
    }
    clearForm()
    renderTodos()
})

// clear the form data 
function clearForm() {
    taskTitle.value=""
    taskDescription.value=""
    taskDueDate.value=""
    priorityLevel.value=""
}

// function start editing a todo 
function editTodo(index){
    alert("Edit the data in the below form")
    const task = todos[index]

    taskTitle.value = task.taskTitle;
    taskDescription.value = task.taskDescription;
    taskDueDate.value = task.taskDueDate;
    priorityLevel.value = task.priorityLevel;
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
    todos[index].taskCompleted = !todos[index].taskCompleted;
    saveTodosToLocalStorage();
    renderTodos();
}

function renderTodos() {
    filterTodos=[]
    // for priority wise todo 
    todos.forEach(todo=> {
        if(todo.priorityLevel=="high"){
            filterTodos.push(todo)
        }
    })

    todos.forEach(todo=> {
        if(todo.priorityLevel=="medium"){
            filterTodos.push(todo)
        }
    })

    todos.forEach(todo=> {
        if(todo.priorityLevel=="low"){
            filterTodos.push(todo)
        }
    })
    saveTodosToLocalStorage();
    renderFilterTodos()
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
            const taskDate =new Date(todo.taskDueDate).getDate()
            
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
            if(todo.taskCompleted==true){
                filterTodos.push(todo)
            }
        })
    }
    saveTodosToLocalStorage();
    renderFilterTodos();
})

function renderFilterTodos() {
    const pendingTaskList = document.getElementById('pendingTask')
    const completedTaskList = document.getElementById('completedTask')
    pendingTaskList.innerHTML=""
    completedTaskList.innerHTML=""

    filterTodos.forEach((todo,index)=> {
        const list = document.createElement('div')
        const checked =todo.taskCompleted ? 'checked' : '';

        list.innerHTML =`
        <ul>
            <li><span class="font-bold">Task Title:</span> ${todo.taskTitle}</li>
            <li><span class="font-bold">Task Description:</span> ${todo.taskDescription}</li>
            <li><span class="font-bold">Task Due Date:</span> ${todo.taskDueDate}</li>
            <li><span class="font-bold">Priority Level:</span> ${todo.priorityLevel}</li>
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
            pendingTaskList.appendChild(list); 
        }
    })  
}

function saveTodosToLocalStorage() {
    localStorage.setItem('todos', JSON.stringify(todos)); 
}

window.onload = function() {
    renderTodos();
}

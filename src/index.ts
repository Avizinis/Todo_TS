import { v4 as uuidV4 } from "uuid"

type Task = { 
    id: string, 
    title: string, 
    completed: boolean, 
    createdAt: Date 
}

const list = document.querySelector<HTMLUListElement>("#list")
const form = document.getElementById("new_task_form") as HTMLFormElement | null
const input = document.querySelector<HTMLInputElement>("#new_task_title")
const tasks: Task[] = loadTasks()
tasks.forEach(addListItem)

// add event listener to the submit event of the form. 
form?.addEventListener("submit", e => {
    // Prevents the default form submission behavior, which would cause a page reload.
    e.preventDefault()

    if(input?.value == "" || input?.value == null) return

    const newTask: Task = {
        id: uuidV4(),
        title: input.value,
        completed: false,
        createdAt: new Date()
    }

    tasks.push(newTask)
    saveTasks()

    addListItem(newTask)
    input.value = ""
})

function addListItem(task: Task) {
    const item = document.createElement("li")
    const label = document.createElement("label")
    const checkbox = document.createElement("input")
    checkbox.addEventListener("change", e => {
        task.completed = checkbox.checked
        console.log(tasks)
        saveTasks()
    })
    checkbox.type = "checkbox"
    checkbox.checked = task.completed
    label.append(checkbox, task.title)
    item.append(label)
    list?.append(item)
}

function saveTasks() {
    localStorage.setItem("TASKS", JSON.stringify(tasks))
}

function loadTasks(): Task[] {
    const taskJSON = localStorage.getItem("TASKS")
    if(taskJSON == null) return []
    return JSON.parse(taskJSON)
}
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
const archive: Task[] = loadArchive()
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

    // console.log("tasks: ")
    // console.log(tasks)
    // console.log("archive: ")
    // console.log(archive)
})

function addListItem(task: Task) {
    const item = document.createElement("li")
    const label = document.createElement("label")
    const checkbox = document.createElement("input")
    checkbox.type = "checkbox"
    checkbox.checked = task.completed
    checkbox.addEventListener("change", e => {
        task.completed = checkbox.checked
        saveTasks() // Save task status when checkbox is changed
        if(task.completed == true) {
            archiveTask(task)
            removeListItem(task)
        }
    })

    label.append(checkbox, task.title)
    item.append(label)
    list?.append(item)
}

function removeListItem(task: Task) {
    const listItem = findListItem(task)
    if (listItem) {
        listItem.remove()
        console.log("task removed")
    }
}

function findListItem(task: Task): HTMLLIElement | null {
    const listItems = document.querySelectorAll("li")
    for (const listItem of listItems) {
        const label = listItem.querySelector("label")
        if (label?.innerText == task.title) {
            return listItem as HTMLLIElement
        }
    }
    return null
}

function saveTasks() {
    localStorage.setItem("TASKS", JSON.stringify(tasks))
}

function loadTasks(): Task[] {
    const taskJSON = localStorage.getItem("TASKS")
    if(taskJSON == null) return []
    return JSON.parse(taskJSON)
}

function archiveTask(task: Task){
    // push to archive and save archive in local storage
    archive.push(task)
    localStorage.setItem("ARCHIVE", JSON.stringify(archive))

    // remove from tasks and save tasks
    const index: number = tasks.indexOf(task)
    if(index !== -1) tasks.splice(index, 1)
    saveTasks()
    // console.log("tasks after deletion: ")
    // console.log(tasks)
}

function loadArchive(): Task[] {
    const taskJSON = localStorage.getItem("ARCHIVE")
    if(taskJSON == null) return []
    return JSON.parse(taskJSON)
}


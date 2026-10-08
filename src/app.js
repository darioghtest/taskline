import { loadTasks, saveTasks } from "./store.js"

let tasks = loadTasks()
const list = document.querySelector("#tasks")
const form = document.querySelector("#new-task")
const title = document.querySelector("#title")

function render() {
  list.innerHTML = ""
  for (const task of tasks) {
    const item = document.createElement("li")
    item.className = task.done ? "done" : ""
    const box = document.createElement("input")
    box.type = "checkbox"
    box.checked = task.done
    box.addEventListener("change", () => toggle(task.id))
    const label = document.createElement("span")
    label.textContent = task.title
    item.append(box, label)
    list.append(item)
  }
}

function toggle(id) {
  tasks = tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
  saveTasks(tasks)
  render()
}

form.addEventListener("submit", (event) => {
  event.preventDefault()
  tasks = [...tasks, { id: crypto.randomUUID(), title: title.value.trim(), done: false }]
  saveTasks(tasks)
  title.value = ""
  render()
})

render()

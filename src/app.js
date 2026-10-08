import { loadTasks, saveTasks } from "./store.js"

let tasks = loadTasks()
const list = document.querySelector("#tasks")
const form = document.querySelector("#new-task")
const title = document.querySelector("#title")
const due = document.querySelector("#due")

const today = () => new Date().toISOString().slice(0, 10)

// Undated tasks sink below dated ones; dated ones run soonest first.
function byDueDate(a, b) {
  if (!a.due) return b.due ? 1 : 0
  if (!b.due) return -1
  return a.due.localeCompare(b.due)
}

function dueLabel(date) {
  if (date === today()) return "Due today"
  if (date < today()) return `Overdue · ${date}`
  return `Due ${date}`
}

function render() {
  list.innerHTML = ""
  for (const task of [...tasks].sort(byDueDate)) {
    const item = document.createElement("li")
    item.className = task.done ? "done" : ""
    const box = document.createElement("input")
    box.type = "checkbox"
    box.checked = task.done
    box.addEventListener("change", () => toggle(task.id))
    const label = document.createElement("span")
    label.textContent = task.title
    item.append(box, label)
    if (task.due) {
      const badge = document.createElement("small")
      badge.className = !task.done && task.due < today() ? "due overdue" : "due"
      badge.textContent = dueLabel(task.due)
      item.append(badge)
    }
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
  tasks = [
    ...tasks,
    {
      id: crypto.randomUUID(),
      title: title.value.trim(),
      due: due.value || null,
      done: false,
    },
  ]
  saveTasks(tasks)
  title.value = ""
  due.value = ""
  render()
})

render()

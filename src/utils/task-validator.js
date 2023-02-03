import { Database } from "../database.js"

const database = new Database()

export const isTaskEmpty = (task) => {
  const { title, description } = task
  if (title && description) {
    return true
  }
}

export const taskFound = (id) => {
  const tasks = database.select("tasks", { id })
  if (tasks.length > 0) {
    return true
  }

  return false
}

export const taskCompleted = (id) => {
  const tasks = database.select("tasks", { id })
  
  if (tasks.length > 0) {
    return tasks[0].completed_at
  }

  return false
}
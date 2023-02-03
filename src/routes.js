import { Database } from "./database.js"
import { buildRoutePath } from "./utils/build-route-path.js"
import { randomUUID } from "crypto"
import { isTaskEmpty, taskFound, taskCompleted } from "./utils/task-validator.js"

const database = new Database()

export const routes = [
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body

      if (!isTaskEmpty(req.body)) {
        return res.writeHead(400).end("Task title and description are required")
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      }
      database.insert("tasks", task)
      return res.writeHead(201).end("Task created successfully")
    },
  },
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { search } = req.query
      const tasks = database.select("tasks", {
        title: search,
        description: search,
      })
      return res.end(JSON.stringify(tasks))
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params
      
      if(!taskFound(id)) {
        return res.writeHead(404).end("Task not found")
      }

      database.delete("tasks", id)
      return res.writeHead(204).end()
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body
      
      if(!taskFound(id)) {
        return res.writeHead(404).end("Task not found")
      }

      const task = database.select("tasks", { id })[0]
      const updatedTask = {
        ...task,
        title,
        description,
        updated_at: new Date(),
      }
      database.update("tasks", updatedTask)
      return res.end(JSON.stringify(updatedTask))
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params

      if(!taskFound(id)) {
        return res.writeHead(404).end("Task not found")
      }

      if(taskCompleted(id)) {
        return res.writeHead(400).end("Task already completed")
      }

      const task = database.select("tasks", { id })[0]
      const updatedTask = {
        ...task,
        completed_at: new Date(),
      }
      database.update("tasks", updatedTask)
      return res.end(JSON.stringify(updatedTask))
    },
  },
]

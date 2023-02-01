import { Database } from "./database.js"
import { buildRoutePath } from "./utils/build-route-path.js"
import { randomUUID } from "crypto"

const database = new Database()

export const routes = [
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body
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

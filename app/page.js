"use client";

import { useEffect, useState } from "react";

const initial = {
  title: "",
  description: "",
  dueDate: "",
};

export default function Home() {
  const [form, setForm] = useState(initial);
  const [todos, setTodos] = useState([]);

  const fetchData = async () => {
    try {

      const res = await fetch("/api/todos");
      const data = await res.json();
      setTodos(data);

    } catch (err) {
      console.error("Error fetching todos:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleForm = (e) => {
    setForm({ 
      ...form,
       [e.target.name]: e.target.value 
      });
  };

  const addTodo = async () => {
    if (!form.title || !form.description) {
      return alert("Fill title & description");
    }

    await fetch("/api/todos", {

      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm(initial);
    fetchData();
  };

  const toggleTodo = async (id, isCompleted) => {
    const todo = todos.find((t) => t.id === id);

    await fetch(`/api/todos/${id}`, {
      method: "PUT",

      headers: { "Content-Type": "application/json" },

      body: JSON.stringify({
        title: todo.title,
        description: todo.description,
        dueDate: todo.dueDate,
        isCompleted: !isCompleted,
      }),
    });

    fetchData();
  };

  const deleteTodo = async (id) => {
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    fetchData();
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">

      <h1 className="text-3xl  font-bold  mb-4">Todo App</h1>

      
      <div className="space-y-2 mb-6 border p-4 rounded">
        <input

          className="border px-2 py-1 w-full"
          placeholder="Title"
          name="title"
          value={form.title}
          onChange={handleForm}
        />
        <textarea

          className="border px-2 py-1 w-full"
          placeholder="Description"
          value={form.description}
          name="description"
          onChange={handleForm}
        />
        <input

          type="date"
          className="border  px-2  py-1 w-full"
          value={form.dueDate}
          name="dueDate"
          onChange={handleForm}
        />
        <button
          className="bg-blue-600  text-white px-4 py-1 rounded"
          onClick={addTodo}
        >
          Add Todo
        </button>
      </div>

    
      <ul className="space-y-3">
        {todos.length > 0 ? (
          todos.map((todo) => (
            <li
              key={todo.id}
              className="border p-3   rounded  flex  justify-between items-start"
            >
              <div>
                <h2
                  className={`font-semibold cursor-pointer ${
                    todo.isCompleted ? "line-through text-gray-500" : ""
                  }`}
                  onClick={() => toggleTodo(todo.id, todo.isCompleted)}
                >
                  {todo.title}
                </h2>

                <p className="text-sm text-gray-600">{todo.description}</p>
                
                <p className="text-xs text-gray-400">

                  Created: {new Date(todo.createdAt).toLocaleString() }
                </p>
                {todo.dueDate && (
                  <p className="text-xs text-red-500">
                    Due: {new Date(todo.dueDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              <button
                className="text-red-500 font-bold"
                onClick={() => deleteTodo(todo.id)}
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          <div>Todos Not Found</div>
        )}
      </ul>
    </div>
  );
}

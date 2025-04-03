import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { BASE_URL } from "../App";

const TodoForm = () => {
  const [todoData, setTodoData] = useState("");

  const queryClient = useQueryClient()

  const { mutate: createTodo, isPending: isCreating } = useMutation({
    mutationKey: ['createTodo'],
    mutationFn: async (e: React.FormEvent) => {
      e.preventDefault()
      try {
        const response = await fetch(`${BASE_URL}/todo`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            body: todoData
          })
        })
        const data = await response.json()
        if (!response.ok) {
          throw new Error('Something went wrong')
        }

        setTodoData("")
        return data
      } catch (error) {
        console.error(error)
      }
    },
    // This is the function that will be refetched the data if you dont write this then you want to refresh the page and show the updated data
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
    onError: (error) => {
      alert(error.message)
    }
  })
  return (
    <form
      onSubmit={createTodo}
      className="flex justify-center items-center gap-2 "
    >
      <input
        required
        type="text"
        name="todo"
        id="todo"
        placeholder="Enter your todo..."
        className="w-xl p-3 border border-slate-300 shadow-md outline-none rounded-xl hover:border-slate-400 transition-all duration-300"
        value={todoData}
        onChange={(e) => setTodoData(e.target.value)}
      />
      <button className="bg-slate-900 p-3 rounded-xl cursor-pointer shadow-md hover:scale-95 transition-all duration-300">
        {isCreating ? (
          <div className="w-5 h-5 border-4 animate-spin border-t-slate-200 border-slate-500 rounded-full"></div>
        ) : (
          <Plus color="white" />
        )}
      </button>
    </form>
  );
};

export default TodoForm;

import { CheckCircle, Trash2 } from "lucide-react";
import { Todo } from "../types/Todo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "../App";
const TodoItem = ({ todo }: { todo: Todo }) => {
  const queryClient = useQueryClient();

  //  Mutation function is use for the update todo
  const { mutate: updateTodo, isPending: isUpdating } = useMutation({
    mutationKey: ["updateTodo"],
    mutationFn: async () => {
      // update todo logic here
      if (todo.completed) {
        return alert("Todo is already completed");
      }
      try {
        const response = await fetch(`${BASE_URL}/todo/${todo._id}`, {
          method: "PATCH",
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        console.error(error);
      }
    },

    // This is the function that will be refetched the data
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const { mutate: deleteTodo, isPending: isDeleting } = useMutation({
    mutationKey: ["deleteTodo"],
    mutationFn: async () => {
      try {
        const response = await fetch(`${BASE_URL}/todo/${todo._id}`, {
          method: "DELETE",
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        console.error(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      })
    }
  });
  return (
    <div className="max-w-[20rem] sm:max-w-lg lg:max-w-xl">
      <li
        key={todo._id}
        className="flex justify-center items-center gap-10 sm:gap-5 p-2 border-b border-gray-300"
      >
        <span
          className={`flex-1 w-2xs  ${todo.completed ? "line-through text-green-500" : "text-yellow-600"
            }`}
        >
          {todo.body}
        </span>
        <div className="flex gap-4 justify-center items-end flex-col sm:flex-row">
          <p
            className={`font-extrabold px-2 py-1 rounded-md ${todo.completed
              ? "text-border-complete text-green-500 bg-green-100 "
              : "text-border-incomplete text-yellow-500 bg-yellow-100"
              }`}
          >
            {todo.completed ? "DONE" : "IN PROGRESS"}
          </p>
          <div className="flex gap-2">
            <button
              className="text-green-500 hover:text-green-700"
              onClick={() => updateTodo()}
            >
              {isUpdating ? (
                <div className="w-5 h-5 border-4 animate-spin border-t-slate-200 border-green-500 rounded-full"></div>
              ) : (
                <CheckCircle className="w-5 h-5" />
              )}
            </button>
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => deleteTodo()}
            >
              {isDeleting ? (
                <div className="w-5 h-5 border-4 animate-spin border-t-slate-200 border-red-500 rounded-full"></div>
              ) : (
                <Trash2 className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </li>
    </div>
  );
};

export default TodoItem;


import { useQuery } from '@tanstack/react-query';
import TodoItem from './TodoItem';
import { Todo } from '../types/Todo';
import { BASE_URL } from '../App';

const TodoList = () => {
  // Fetching Data With the help of TenstackQuery
  const { data: todos, isLoading } = useQuery<Todo[]>({
    queryKey: ['todos'],
    queryFn: async () => {
      try {
        const response = await fetch(`${BASE_URL}/todos`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Something went wrong')
        }

        return data || []
      } catch (error) {
        console.error(error)
      }
    }
  })


  if (isLoading) {
    return (
      <div className='flex items-center justify-center '>
        <div className="w-10 h-10 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div >
      <h1 className='my-5 font-bold text-3xl text-center'>TODO Task List </h1>
      <ul className="list-disc  space-y-4">
        {todos?.map(todo => (
          <TodoItem todo={todo} />
        ))}
        {todos?.length === 0 && (
          <div className="flex justify-center items-center my-10">
            <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-500 to-green-500">
                All Tasks Completed!
            </p>
            <p className="text-xl font-extrabold">
               Now Create New Task
            </p>
          </div>
        )}
      </ul>
    </div>
  );
};

export default TodoList;


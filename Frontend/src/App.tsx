import  { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import TodoForm from './components/TodoForm'
import TodoList from './components/TodoList'

export const BASE_URL=import.meta.env.MODE === 'development' ? "http://localhost:3000/api" : "/api"

const App = () => {
  const [toggle, setToggle] = useState(false)
  const handleToggle = () => {
    setToggle(!toggle)
  }

  useEffect(() => {
    if (toggle) {
      document.body.style.backgroundColor = 'black'
      document.body.style.color = 'white'
    } else {
      document.body.style.backgroundColor = 'white'
      document.body.style.color = 'black'
    }
  }, [toggle])

  return (
    <div className='flex flex-col h-screen gap-10 '>
      <div className=' bg-gray-800'>
        <Navbar toggle={toggle} handleToggle={handleToggle} />
      </div>
      <TodoForm />
      <div className=' mx-auto'>
        <TodoList />
      </div>
    </div>
  )
}

export default App
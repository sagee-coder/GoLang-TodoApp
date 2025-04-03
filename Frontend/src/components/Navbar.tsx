import { Moon, Sun } from 'lucide-react'

interface NavbarProps {
    toggle: boolean
    handleToggle: () => void
}

const Navbar = ({ toggle, handleToggle }: NavbarProps) => {
    return ( 
        <div>
            <nav className="flex items-center justify-between px-4 py-3 xl:w-[80%] mx-auto">
                <h1 className="text-3xl font-bold text-white">Daily Task</h1>
                <button
                    onClick={handleToggle}
                    className="cursor-pointer flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600"
                >
                    {toggle ? <Moon className="w-6 h-6 text-white" /> : <Sun className="w-6 h-6 text-white" />}
                </button>
            </nav>
        </div>
    )
}

export default Navbar


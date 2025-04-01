import type React from "react"
import { Link, useNavigate } from "react-router-dom"
import { CgProfile } from "react-icons/cg";

export const Header: React.FC = () => (
  <header className="bg-white shadow-md py-4 px-6">
    <div className="flex items-center justify-between">
      <h1 className="text-xl font-semibold text-gray-800">My Dashboard</h1>
      <button className="text-gray-600 hover:text-gray-800">
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
      </button>
    </div>
  </header>
)

export const Sidebar: React.FC = () => (
  <aside className="bg-purple-800 text-purple-100 w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
    <nav>
      <Link
        to="/dashboard"
        className="block py-2.5 px-4 rounded transition duration-200 hover:bg-purple-700 hover:text-white"
      >
        Home
      </Link>
      <Link
        to="/dashboard/create-qr"
        className="block py-2.5 px-4 rounded transition duration-200 hover:bg-purple-700 hover:text-white"
      >
        Create QR
      </Link>
      <Link
        to="/dashboard/qr-details"
        className="block py-2.5 px-4 rounded transition duration-200 hover:bg-purple-700 hover:text-white"
      >
        QR Details
      </Link>
      <Link
        to="/dashboard/settings"
        className="block py-2.5 px-4 rounded transition duration-200 hover:bg-purple-700 hover:text-white"
      >
        Settings
      </Link>
    </nav>
  </aside>
)

export const MainContent: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h4 className="text-lg font-semibold mb-4">Recent Activity</h4>
      <p></p>
    </div>
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h4 className="text-lg font-semibold mb-4">Statistics</h4>
      <p></p>
    </div>
  </div>
)

export const Footer: React.FC = () => (
  <footer className="bg-white shadow-md py-4 px-6">
    <p className="text-center text-gray-600">© 2025 My QR Location. All rights reserved.</p>
  </footer>
)

export const UserProfile = () => {  
    const navigate = useNavigate()
    const handleLogout: any = () =>{
      alert("Logout successfully")
      localStorage.removeItem("token");
      navigate('/login')
    }
  
  
  return(
  <div className="bg-white w-64 shadow-md p-6 absolute top-0 right-0 bottom-0 transform translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
    <div className="flex flex-col items-center">
    <CgProfile className="text-gray-600 hover:text-gray-800 h-8 w-8" />
      <h3 className="text-lg font-semibold">Harish</h3>
      <p className="text-gray-600">harish.ganesan@gmail.com</p>
    </div>
    <div className="mt-6 p-4 flex flex-col gap-y-4">
  <button className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition duration-200">
    Edit Profile
  </button>
  <button onClick={handleLogout} className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition duration-200">
    Logout
  </button>
</div>

  </div>)
}


import { Routes, Route, useLocation } from "react-router-dom";
import { Header, Sidebar, MainContent, Footer, UserProfile } from "./DashboardComponents";
import CreateQR from "../Pages/CreateQR";
import { useEffect, useState } from "react";
import QrDetails from "../Pages/QrDetails";
import Settings from "../Pages/Settings";
import { FaUserCircle } from "react-icons/fa"; // ✅ Import profile icon

const Dashboard: React.FC = () => {
  const [title, setTitle] = useState("Home");
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false); // ✅ Track profile visibility

  // Update title dynamically based on the current route
  useEffect(() => {
    switch (location.pathname) {
      case "/dashboard":
        setTitle("Home");
        break;
      case "/dashboard/create-qr":
        setTitle("Create QR");
        break;
      case "/dashboard/qr-details":
        setTitle("QR Details");
        break;
      case "/dashboard/settings":
        setTitle("Settings");
        break;
      default:
        setTitle("Page Not Found");
    }
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content - Adjust width based on profile panel state */}
      <div className={`flex flex-col transition-all duration-300 ${isProfileOpen ? "md:w-3/4 w-full" : "w-full"} overflow-hidden`}>
        {/* Header with Profile Icon */}
        <div className="relative">
          <Header />
          {/* Profile Icon Button (Top Right) */}
          <button 
            className="absolute top-4 right-6 text-gray-700 hover:text-gray-900 text-3xl"
            onClick={() => setIsProfileOpen(!isProfileOpen)} // ✅ Toggle profile visibility
          >
            <FaUserCircle />
          </button>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <div className="container mx-auto px-6 py-8">
            <h3 className="text-3xl font-bold text-green-900 text-center mt-2 mb-4 ">{title}</h3>
            <Routes>
              <Route path="/" element={<MainContent />} />
              <Route path="/create-qr" element={<CreateQR />} />
              <Route path="/qr-details" element={<QrDetails />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>

      {isProfileOpen && (
        <div 
          className={`fixed top-0 right-0 h-screen bg-white shadow-lg p-4 transition-transform duration-300
          ${isProfileOpen ? "translate-x-0" : "translate-x-full"} 
          w-full md:w-1/4`}
        >
          <button 
            className="text-gray-500 hover:text-gray-700 text-xl absolute top-4 right-4 cursor-pointer"
            onClick={() => setIsProfileOpen(false)}
          >
            ✖
          </button>

          <UserProfile />
        </div>
      )}
    </div>
  );
};

export default Dashboard;

import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Home,
  Book,
  Award,
  Users,
  Briefcase,
  Settings,
  LogOut,
  Bell,
  Search,
} from "lucide-react";
import axios from "axios";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // State to track active main menu item
  const [activeMenuItem, setActiveMenuItem] = useState("dashboard");

  // Dropdown visibility states
  const [showEventsDropdown, setShowEventsDropdown] = useState(false);
  const [showProgramsDropdown, setShowProgramsDropdown] = useState(false);

  // Admin name from session/localStorage
  const [adminName, setAdminName] = useState<string | null>(null);

  // Helper functions to check if current route belongs to dropdown groups
  const isEventsActive = () => {
    return ["/admin_events", "/manage_events", "/manage_payment_events"].includes(location.pathname);
  };

  const isProgramsActive = () => {
    return ["/admin_programs", "/manage_programs"].includes(location.pathname);
  };

  useEffect(() => {

    const path = location.pathname;


    if (isEventsActive()) {
      setActiveMenuItem("events");
      setShowEventsDropdown(true);
    } else {
      setShowEventsDropdown(false);
    }

    if (isProgramsActive()) {
      setActiveMenuItem("programs");
      setShowProgramsDropdown(true);
    } else {
      setShowProgramsDropdown(false);
    }







    if (path === "/admin_events") {
      setActiveMenuItem("events");
    } else if (path === "/admin_programs") {
      setActiveMenuItem("programs");
    } else if (path === "/certificates") {
      setActiveMenuItem("certificates");
    } else if (path === "/community") {
      setActiveMenuItem("community");
    } else if (path === "/freelance") {
      setActiveMenuItem("freelance");
    } 
    
     else if (path === "/manage_events") {
      setActiveMenuItem("events");
    }
    
    
     else if (path === "/manage_programs") {
      setActiveMenuItem("programs");
    }
    
    else if (path === "/manage_payment_events") {
      setActiveMenuItem("manage_payment_events");
    }
    
     else if (path === "/manage_payment_programs") {
      setActiveMenuItem("manage_payment_programs");
    }
    
    
    
    
    
    
    else {
      setActiveMenuItem("dashboard");
    }
    
  }, [location]);

  useEffect(() => {
    if (!adminName) {
      const savedName = localStorage.getItem("admin_name");
      if (savedName) setAdminName(savedName);
    }
  }, [adminName]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/auth/admin_session", { withCredentials: true })
      .then((res) => {
        if (res.data.loggedIn && res.data.admin?.name) {
          setAdminName(res.data.admin.name);
          localStorage.setItem("admin_name", res.data.admin.name);
        } else {
          setAdminName(null);
          localStorage.removeItem("admin_name");
        }
      })
      .catch(() => {
        setAdminName(null);
        localStorage.removeItem("admin_name");
      });
  }, []);

  const handleLogout = () => {
    axios
      .post("http://localhost:5000/api/auth/admin_logout", {}, { withCredentials: true })
      .then(() => {
        localStorage.removeItem("admin_id");
        localStorage.removeItem("admin_name");
        navigate("/admin_login");
      })
      .catch(() => {
        alert("Logout failed. Please try again.");
      });
  };

  const toggleEventsDropdown = () => {
    setShowEventsDropdown(!showEventsDropdown);
  };

  const toggleProgramsDropdown = () => {
    setShowProgramsDropdown(!showProgramsDropdown);
  };

  return (
    <div className="min-h-screen flex bg-mmk-dark">
      {/* Sidebar */}
      <div className="w-64 bg-mmk-dark border-r border-white/10 flex flex-col fixed h-full">
        <div className="p-4 border-b border-white/10">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-gradient-primary">MMK Universe</span>
            <p className="text-gray-400">Welcome back, {adminName}</p>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <Link to="/dashboard">
            <button
              className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                activeMenuItem === "dashboard"
                  ? "bg-mmk-purple text-white"
                  : "text-gray-400 hover:bg-white/5"
              }`}
              onClick={() => setActiveMenuItem("dashboard")}
            >
              <Home className="w-5 h-5 mr-3" />
              Dashboard
            </button>
          </Link>

          <div>
            <button 
              className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                activeMenuItem === "events"
                  ? "bg-mmk-purple text-white"
                  : "text-gray-400 hover:bg-white/5"
              }`}
              onClick={toggleEventsDropdown}
            >
              <Book className="w-5 h-5 mr-3" />
              EVENTS
            </button>
            {showEventsDropdown && (
              <div className="ml-4 space-y-1">
                {/* <Link to="/admin_events">
                  <button className="w-full text-gray-400 hover:bg-white/5 p-2 rounded-lg">
                    Add Events
                  </button>
                </Link> */}
                <Link to="/manage_events">
                  <button className="w-full text-gray-400 hover:bg-white/5 p-2 rounded-lg">
                    Manage Events
                  </button>
                </Link>

                  <Link to="/manage_payment_events">
                  <button className="w-full text-gray-400 hover:bg-white/5 p-2 rounded-lg">
                    Manage User Payments
                  </button>
                </Link>


              </div>







            )}
          </div>









          <div>
            <button
              className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                activeMenuItem === "programs"
                  ? "bg-mmk-purple text-white"
                  : "text-gray-400 hover:bg-white/5"
              }`}
              onClick={toggleProgramsDropdown}
            >
              <Book className="w-5 h-5 mr-3" />
              Programs
            </button>
            {showProgramsDropdown && (
              <div className="ml-4 space-y-1">
                {/* <Link to="/admin_programs">
                  <button className="w-full text-gray-400 hover:bg-white/5 p-2 rounded-lg">
                    Add Program
                  </button>
                </Link> */}
                <Link to="/manage_programs">
                  <button className="w-full text-gray-400 hover:bg-white/5 p-2 rounded-lg">
                    Manage Programs
                  </button>
                </Link>

                    <Link to="/manage_payment_programs">
                  <button className="w-full text-gray-400 hover:bg-white/5 p-2 rounded-lg">
                    Manage User Payments
                  </button>
                </Link>
              </div>
            )}
          </div>

          <Link to="/certificates">
            <button
              className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                activeMenuItem === "certificates"
                  ? "bg-mmk-purple text-white"
                  : "text-gray-400 hover:bg-white/5"
              }`}
              onClick={() => setActiveMenuItem("certificates")}
            >
              <Award className="w-5 h-5 mr-3" />
              Certificates
            </button>
          </Link>

          <Link to="/community">
            <button
              className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                activeMenuItem === "community"
                  ? "bg-mmk-purple text-white"
                  : "text-gray-400 hover:bg-white/5"
              }`}
              onClick={() => setActiveMenuItem("community")}
            >
              <Users className="w-5 h-5 mr-3" />
              Community
            </button>
          </Link>

          <Link to="/freelance">
            <button
              className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                activeMenuItem === "freelance"
                  ? "bg-mmk-purple text-white"
                  : "text-gray-400 hover:bg-white/5"
              }`}
              onClick={() => setActiveMenuItem("freelance")}
            >
              <Briefcase className="w-5 h-5 mr-3" />
              Freelance
            </button>
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="space-y-1">
            <button
              className="w-full flex items-center p-3 rounded-lg text-gray-400 hover:bg-white/5 transition-colors"
            >
              <Settings className="w-5 h-5 mr-3" />
              Settings
            </button>
            <button
              className="w-full flex items-center p-3 rounded-lg text-gray-400 hover:bg-white/5 transition-colors"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-mmk-dark/80 backdrop-blur-sm border-b border-white/10 sticky top-0 z-10">
          <div className="flex items-center justify-between p-4">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/5">
                <Search className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/5 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-mmk-amber rounded-full"></span>
              </button>
              <button className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-mmk-purple flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">SM</span>
                </div>
              </button>
            </div>
          </div>
        </header>
        
        {/* Dashboard Content */}
      </div>
    </div>
  );
};

export default Dashboard;


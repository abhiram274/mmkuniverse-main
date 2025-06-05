import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
  ChevronDown,
  ChevronUp
} from "lucide-react";
import axios from "axios";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeMenuItem, setActiveMenuItem] = useState("");
  const [showEventsDropdown, setShowEventsDropdown] = useState(false);
  const [showProgramsDropdown, setShowProgramsDropdown] = useState(false);
  const [adminName, setAdminName] = useState<string | null>(null);

  // Automatically handle active menu and dropdowns
  useEffect(() => {
    const path = location.pathname;

    if (
      path.startsWith("/admin_events") ||
      path.startsWith("/manage_events") ||
      path.startsWith("/manage_payment_events")
    ) {
      setActiveMenuItem("events");
      setShowEventsDropdown(true);
    } else {
      setShowEventsDropdown(false);
    }

    if (
      path.startsWith("/admin_programs") ||
      path.startsWith("/manage_programs") ||
      path.startsWith("/manage_payment_programs")
    ) {
      setActiveMenuItem("programs");
      setShowProgramsDropdown(true);
    } else {
      setShowProgramsDropdown(false);
    }

    if (path === "/certificates") setActiveMenuItem("certificates");
    else if (path === "/community") setActiveMenuItem("community");
    else if (path === "/freelance") setActiveMenuItem("freelance");
    else if (path === "/dashboard") setActiveMenuItem("dashboard");
  }, [location.pathname]);

  useEffect(() => {
    const savedName = localStorage.getItem("admin_name");
    if (savedName) setAdminName(savedName);

    axios
      .get("https://mmkuniverse-main.onrender.com/api/auth/admin_session", { withCredentials: true })
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
      .post("https://mmkuniverse-main.onrender.com/api/auth/admin_logout", {}, { withCredentials: true })
      .then(() => {
        localStorage.removeItem("admin_id");
        localStorage.removeItem("admin_name");
        navigate("/admin_login");
      })
      .catch(() => {
        alert("Logout failed. Please try again.");
      });
  };

  return (
    <div className="min-h-screen flex bg-mmk-dark">
      {/* Sidebar */}
      <div className="w-64 bg-mmk-dark border-r border-white/10 fixed h-full flex flex-col">
        <div className="p-4 border-b border-white/10">
          <Link to="/" className="flex flex-col text-gradient-primary font-bold text-lg">
            MMK Universe
            <span className="text-sm text-gray-400 font-normal">Welcome back, {adminName}</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {/* Dashboard */}
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

          {/* Events Dropdown */}
          <div>
            <button
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                activeMenuItem === "events"
                  ? "bg-mmk-purple text-white"
                  : "text-gray-400 hover:bg-white/5"
              }`}
              onClick={() => setShowEventsDropdown(!showEventsDropdown)}
            >
              <span className="flex items-center">
                <Book className="w-5 h-5 mr-3" />
                Events
              </span>
              {showEventsDropdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {showEventsDropdown && (
              <div className="ml-6 mt-1 space-y-1 border-l border-white/10 pl-4">
                <Link to="/manage_events">
                  <button
                    className={`w-full text-left p-2 rounded-lg transition-colors ${
                      location.pathname === "/manage_events" ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5"
                    }`}
                  >
                    Manage Events
                  </button>
                </Link>
                <Link to="/manage_payment_events">
                  <button
                    className={`w-full text-left p-2 rounded-lg transition-colors ${
                      location.pathname === "/manage_payment_events" ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5"
                    }`}
                  >
                    Manage Payments
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Programs Dropdown */}
          <div>
            <button
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                activeMenuItem === "programs"
                  ? "bg-mmk-purple text-white"
                  : "text-gray-400 hover:bg-white/5"
              }`}
              onClick={() => setShowProgramsDropdown(!showProgramsDropdown)}
            >
              <span className="flex items-center">
                <Book className="w-5 h-5 mr-3" />
                Programs
              </span>
              {showProgramsDropdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {showProgramsDropdown && (
              <div className="ml-6 mt-1 space-y-1 border-l border-white/10 pl-4">
                <Link to="/manage_programs">
                  <button
                    className={`w-full text-left p-2 rounded-lg transition-colors ${
                      location.pathname === "/manage_programs" ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5"
                    }`}
                  >
                    Manage Programs
                  </button>
                </Link>
                <Link to="/manage_payment_programs">
                  <button
                    className={`w-full text-left p-2 rounded-lg transition-colors ${
                      location.pathname === "/manage_payment_programs" ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5"
                    }`}
                  >
                    Manage Payments
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Certificates */}
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

          {/* Community */}
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

          {/* Freelance */}
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

        {/* Settings & Logout */}
        <div className="p-4 border-t border-white/10">
          <div className="space-y-1">
            <button className="w-full flex items-center p-3 rounded-lg text-gray-400 hover:bg-white/5 transition-colors">
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
        <header className="bg-mmk-dark/80 backdrop-blur-sm border-b border-white/10 sticky top-0 z-10">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/5">
                <Search className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/5 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-mmk-amber rounded-full" />
              </button>
              <div className="w-8 h-8 rounded-full bg-mmk-purple flex items-center justify-center">
                <span className="text-white font-semibold text-sm">SM</span>
              </div>
            </div>
          </div>
        </header>
        {/* Place your dashboard content here */}
      </div>
    </div>
  );
};

export default Dashboard;

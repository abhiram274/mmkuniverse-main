import axios from 'axios';
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };



  const [userName, setUserName] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch session info on mount
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/auth/session", { withCredentials: true })
      .then((res) => {
        if (res.data.loggedIn && res.data.user?.name) {
          setUserName(res.data.user.name);
          // Save to localStorage so it persists on reload
          localStorage.setItem("MMK_U_name", res.data.user.name);
        } else {
          setUserName(null);
          localStorage.removeItem("MMK_U_name");
        }
      })
      .catch(() => {
        setUserName(null);
        localStorage.removeItem("MMK_U_name");
      });
  }, []);



  // Load name from localStorage as fallback (for fast render)
  useEffect(() => {
    if (!userName) {
      const savedName = localStorage.getItem("MMK_U_name");
      if (savedName) setUserName(savedName);
    }
  }, [userName]);

  // Logout handler
  const handleLogout = () => {
    axios
      .post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true })
      .then(() => {
        setUserName(null);
        localStorage.removeItem("MMK_U_name");
        navigate("/login"); // redirect to login after logout
      })
      .catch(() => {
        alert("Logout failed. Please try again.");
      });
  };

  const isActive = (path: string) => location.pathname === path;

  // const navLinkClass = (path: string) =>
  //   `transition ${isActive(path) ? "text-white font-semibold border-b-2 border-white" : "text-gray-300 hover:text-white"
  //   }`;

const navLinkClass = (path: string) =>
  location.pathname === path
    ? "text-white font-semibold bg-white/10 px-2 py-1 rounded"
    : "text-gray-300 hover:text-white transition px-2 py-1";


  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-mmk-dark/80 border-b border-white/10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
  <Link to="/home" className="flex items-center">
  <span className="font-bold text-gray-400 mr-1">Welcome</span>
  <span className="text-2xl font-bold text-gradient-primary">{userName}</span>
</Link>


        {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-8">
          <Link to="/home" className={navLinkClass("/home")}>Home</Link>
          <Link to="/programs" className={navLinkClass("/programs")}>Programs</Link>
          <Link to="/events" className={navLinkClass("/events")}>Events</Link>
          <Link to="/my_profile" className={navLinkClass("/my_profile")}>My Profile</Link>
          <Link to="/about" className={navLinkClass("/about")}>About Us</Link>
          <Button onClick={handleLogout} className="bg-red-600 hover:bg-red-700">Logout</Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-300 focus:outline-none"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-mmk-dark z-50 shadow-lg">
          <div className="flex flex-col space-y-4 p-4">
<Link to="/home" className={navLinkClass("/home")}>Home</Link>
          <Link to="/programs" className={navLinkClass("/programs")}>Programs</Link>
          <Link to="/events" className={navLinkClass("/events")}>Events</Link>
          <Link to="/my_profile" className={navLinkClass("/my_profile")}>My Profile</Link>
          <Link to="/about" className={navLinkClass("/about")}>About Us</Link>
      
             {/* <Link to="/community" className="text-gray-300 hover:text-white transition py-2">Community</Link>*/}
            {/* <Link to="/freelance" className="text-gray-300 hover:text-white transition py-2">Freelance</Link> */} 
            {/* <Link to="/login" className="text-gray-300 hover:text-white transition py-2">Login</Link>
            <Link to="/signup" className="py-2">
              <Button className="bg-mmk-purple hover:bg-mmk-purple/90 text-white w-full">
                Sign Up
              </Button>
            </Link> */}
            <Link to="/logout">
              <Button onClick={handleLogout} className="bg-red-600 hover:bg-red-700">
                Logout
              </Button>
            </Link>

          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

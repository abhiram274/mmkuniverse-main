
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-mmk-dark/80 border-b border-white/10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold text-gradient-primary">MMK Universe</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/programs" className="text-gray-300 hover:text-white transition">Programs</Link>
          <Link to="/events" className="text-gray-300 hover:text-white transition">Events</Link>
          {/* <Link to="/community" className="text-gray-300 hover:text-white transition">Community</Link> */}
          {/* <Link to="/freelance" className="text-gray-300 hover:text-white transition">Freelance</Link> */}
          <Link to="/about" className="text-gray-300 hover:text-white transition">About Us</Link>
          <Link to="/login" className="text-gray-300 hover:text-white transition">Login</Link>
          <Link to="/signup">
            <Button className="bg-mmk-purple hover:bg-mmk-purple/90 text-white">
              Sign Up
            </Button>
          </Link>
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
        // <div className="md:hidden absolute top-16 left-0 right-0 ">
        //   <div className="flex flex-col space-y-4 p-4">
       <div className="md:hidden absolute top-16 left-0 right-0 bg-mmk-dark z-50 shadow-lg">
          <div className="flex flex-col space-y-4 p-4">

            <Link to="/programs" className="text-gray-300 hover:text-white transition py-2">Programs</Link>
            <Link to="/events" className="text-gray-300 hover:text-white transition py-2">Events</Link>
            {/* <Link to="/community" className="text-gray-300 hover:text-white transition py-2">Community</Link> */}
            {/* <Link to="/freelance" className="text-gray-300 hover:text-white transition py-2">Freelance</Link> */}
            <Link to="/about" className="text-gray-300 hover:text-white transition py-2">About Us</Link>
            <Link to="/login" className="text-gray-300 hover:text-white transition py-2">Login</Link>
            <Link to="/signup" className="py-2">
              <Button className="bg-mmk-purple hover:bg-mmk-purple/90 text-white w-full">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

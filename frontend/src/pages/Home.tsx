import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Book, Award, Users, Briefcase } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProgramCard from "@/components/ProgramCard";


// Sample program data
const featuredPrograms = [
  {
    id: 1,
    title: "Web Development Bootcamp",
    description: "Comprehensive course covering HTML, CSS, JavaScript, React, and Node.js.",
    image: "https://images.unsplash.com/photo-1579403124614-197f69d8187b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    price: "$99",
    isFree: false,
    isCertified: true,
    isLive: true,
    duration: "8 weeks",
    date: "Starts Oct 15, 2025"
  },
  {
    id: 2,
    title: "UI/UX Design Fundamentals",
    description: "Learn design principles, tools, and techniques for creating amazing user experiences.",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    price: "$79",
    isFree: false,
    isCertified: true,
    isLive: false,
    duration: "6 weeks",
    date: "Starts Oct 20, 2025"
  },
  {
    id: 3,
    title: "Python for Data Science",
    description: "Introduction to Python programming with a focus on data analysis and visualization.",
    image: "https://images.unsplash.com/photo-1551033406-611cf9a28f67?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    price: "$0",
    isFree: true,
    isCertified: false,
    isLive: false,
    duration: "4 weeks",
    date: "Start anytime"
  }
];

const Home = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch session info on mount
  useEffect(() => {
    axios
      .get("https://mmkuniverse-main.onrender.com/api/auth/session", { withCredentials: true })
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
      .post("https://mmkuniverse-main.onrender.com/api/auth/logout", {}, { withCredentials: true })
      .then(() => {
        setUserName(null);
        localStorage.removeItem("MMK_U_name");
        navigate("/login"); // redirect to login after logout
      })
      .catch(() => {
        alert("Logout failed. Please try again.");
      });
  };
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
       {/* Welcome message + logout */}
      {/* {userName && (
        <div className="bg-mmk-purple/10 py-4 px-6 text-white text-xl font-medium flex justify-between items-center">
          <span>Welcome back, {userName}! 👋</span>
          <Button onClick={handleLogout} className="bg-red-600 hover:bg-red-700">
            Logout
          </Button>
        </div>
      )} */}
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-mmk-purple/20 to-transparent -z-10"></div>
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-gradient-primary">MMK Universe</span>
                 {/* <span className="text-gradient-primary">{userName}</span> */}
                <br />
                <span className="text-white">Grow Together</span>
              </h1>
              <p className="text-xl text-gray-300">
                Explore. Share. Grow. A Community for Knowledge & Collaboration.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/programs">
                  <Button className="bg-mmk-purple hover:bg-mmk-purple/90 text-white px-8 py-6 text-lg rounded-xl">
                    Explore Programs
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="outline" className="border-mmk-purple text-mmk-purple hover:bg-mmk-purple/10 px-8 py-6 text-lg rounded-xl">
                    Join Community
                  </Button>
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 mt-12 lg:mt-0 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-mmk-purple to-mmk-amber rounded-2xl blur opacity-30 animate-pulse-slow"></div>
                <div className="glass-card relative p-1 rounded-2xl overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                    alt="MMK Community" 
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-mmk-amber/20 rounded-full blur-3xl"></div>
                <div className="absolute -left-16 -top-16 w-48 h-48 bg-mmk-purple/20 rounded-full blur-3xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Join <span className="text-gradient-primary">MMK Universe</span>?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Join a thriving community of learners and professionals, where knowledge is shared and skills are developed collaboratively.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="glass-card p-6 rounded-xl text-center">
              <div className="w-16 h-16 bg-mmk-purple/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Book className="w-8 h-8 text-mmk-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Live Classes</h3>
              <p className="text-gray-400">Interactive sessions with industry experts and peer-to-peer learning opportunities.</p>
            </div>
            
            <div className="glass-card p-6 rounded-xl text-center">
              <div className="w-16 h-16 bg-mmk-purple/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-mmk-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Certifications</h3>
              <p className="text-gray-400">Earn recognized certificates to showcase your skills and knowledge.</p>
            </div>
            
            <div className="glass-card p-6 rounded-xl text-center">
              <div className="w-16 h-16 bg-mmk-purple/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-mmk-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-gray-400">Connect with like-minded individuals, share ideas, and grow together.</p>
            </div>
            
            <div className="glass-card p-6 rounded-xl text-center">
              <div className="w-16 h-16 bg-mmk-purple/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-mmk-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Freelancing</h3>
              <p className="text-gray-400">Find projects, build your portfolio, and earn while you learn.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Programs */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent via-mmk-purple/5 to-transparent">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Featured <span className="text-gradient-primary">Programs</span></h2>
            <Link to="/programs" className="text-mmk-purple hover:text-mmk-purple/80 flex items-center">
              View All
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPrograms.map((program) => (
              <ProgramCard category={""} key={program.id} {...program} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Join Community Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-mmk-purple/10 -z-10"></div>
        <div className="container mx-auto glass-card p-8 md:p-12 rounded-2xl relative overflow-hidden">
          <div className="absolute -right-24 -bottom-24 w-64 h-64 bg-mmk-purple/30 rounded-full blur-3xl"></div>
          <div className="absolute -left-24 -top-24 w-64 h-64 bg-mmk-amber/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="lg:w-2/3">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Join the MMK Universe?</h2>
              <p className="text-gray-300 text-lg">
                Become part of a growing community of learners, creators, and professionals. Get access to courses, events, and freelancing opportunities.
              </p>
            </div>
            <div className="lg:w-1/3 flex justify-center">
              <Link to="/signup">
                <Button className="bg-mmk-purple hover:bg-mmk-purple/90 text-white px-8 py-6 text-lg rounded-xl">
                  Join Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Home;

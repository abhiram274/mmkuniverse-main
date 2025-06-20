import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Book, Award, Users, Briefcase } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProgramCard from "@/components/ProgramCard";
import { toast } from "sonner";

interface Program {
  id: number;
  title: string;
  description: string;
  image: string;
  price: string;
  isFree: boolean;
  isCertified: boolean;
  isLive: boolean;
  duration: string;
  date: string;
  category: string;
  isEnrolled?: boolean;
  start_date?: string;
  end_date?: string;
  attendees: number;
  attendance_limit: number;
}


const formatDateDisplay = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-CA'); // YYYY-MM-DD format
};


const Home = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [featuredPrograms, setFeaturedPrograms] = useState<Program[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentPrograms = async () => {
      try {
        const res = await axios.get("https://mmkuniverse-main.onrender.com/programs/non-complete");

        const CLOUDINARY_BASE = "https://res.cloudinary.com/dxf8n44lz/image/upload/";
        const data: Program[] = res.data.map((p: Program) => ({
          ...p,
          image: p.image && !p.image.startsWith("http") ? `${CLOUDINARY_BASE}${p.image}` : p.image,
        }));

        const sorted = data
          .filter((p) => p.start_date)
          .sort((a, b) => new Date(b.start_date!).getTime() - new Date(a.start_date!).getTime())
          .slice(0, 3);

        setFeaturedPrograms(sorted);
      } catch (err) {
        console.error("Failed to fetch programs:", err);
      }
    };

    fetchRecentPrograms();
  }, []);

  useEffect(() => {
    if (!userName) {
      const savedName = localStorage.getItem("MMK_U_name");
      if (savedName) setUserName(savedName);
    }
  }, [userName]);

  const handleEnroll = async (programId: number, programName: string) => {
    const userId = localStorage.getItem("MMK_U_user_id");
    const userName = localStorage.getItem("MMK_U_name");
    const userEmail = localStorage.getItem("MMK_U_email");

    if (!userId || !userName || !userEmail) {
      toast.error("Please log in to join.");
      return;
    }

    try {
      const res = await fetch(
        `https://mmkuniverse-main.onrender.com/programs/check-attendance/${userId}/${programId}`
      );
      const data = await res.json();

      if (data.alreadyJoined) {
        toast.info("You have already joined this Program.");
        return;
      }

      const program = featuredPrograms.find(p => p.id === programId);
      if (program) {
        setSelectedProgram(program);
      }

      localStorage.setItem("MMK_P_program_id", programId.toString());
      localStorage.setItem("MMK_P_program_name", programName);

      setTimeout(() => {
        navigate("/join-program-payment");
      }, 1500);
    } catch (err) {
      console.error("Enrollment error:", err);
      toast.error("Enrollment failed.");
    }
  };

  console.log("🧪 Checking localStorage on route:");
  console.log("user_id:", localStorage.getItem("MMK_U_user_id"));
  console.log("name:", localStorage.getItem("MMK_U_name"));

  console.log("email:", localStorage.getItem("MMK_U_email"));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {/* Welcome message + logout */}
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
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-1" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPrograms.map((program) => (
              // <ProgramCard key={program.id} {...program} onEnroll={() => handleEnroll(program.id, program.title)} />
           
           <div key={program.id}>
                               <ProgramCard
                                 location={""} {...program}
                                 // startDate={program.start_date}
                                 // endDate={program.end_date}
                                 startDate={formatDateDisplay(program.start_date)}
                                 endDate={formatDateDisplay(program.end_date)}
           
                                 onEnroll={() => handleEnroll(program.id, program.title)}
                                 isCertified={Boolean(program.isCertified)}
                                 isFree={Boolean(program.isFree)}
                                 isLive={Boolean(program.isLive)}
                                 // isEnrolled={Boolean(program.isEnrolled)}
                                 disabled={
                                    program.isEnrolled ||
                                   new Date() > new Date(program.end_date) ||  // after event end
                                   new Date() < new Date(program.start_date) ||  // before event start
                                   program.attendees >= program.attendance_limit  // attendee limit reached
                                 }
                               />
           
                             </div>
           
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

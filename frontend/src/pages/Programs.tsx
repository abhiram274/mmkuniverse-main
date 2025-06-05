import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Share2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProgramCard from "@/components/ProgramCard";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

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

const Programs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filters, setFilters] = useState({
    isFree: false,
    isCertified: false,
    isLive: false,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  const navigate = useNavigate();


  const [programsData, setProgramsData] = useState<Program[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const storedId = localStorage.getItem("MMK_U_user_id");
        let userId: number | null = null;
        if (storedId) {
          userId = parseInt(storedId.replace("MMK_U_", ""), 10);
          if (isNaN(userId)) userId = null;
        }

        // Pass user_id as query param if available
        const url = userId ? `https://mmkuniverse-main.onrender.com/programs/non-complete?user_id=${userId}` : "https://mmkuniverse-main.onrender.com/programs/non-complete";
        const res = await axios.get(url);


        const data: Program[] = res.data.map((p: Program) => ({
          ...p,
          image: p.image || "",
          isFree: Boolean(p.isFree),
          isCertified: Boolean(p.isCertified),
          isLive: Boolean(p.isLive),
          isEnrolled: Boolean(p.isEnrolled),
          end_date: p.end_date ?? undefined,
          start_date: p.start_date ?? undefined,
        }));

        setProgramsData(data);

        const uniqueCategories = [...new Set(data.map((p) => p.category))];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Error fetching programs:", err);
      }
    };

    fetchPrograms();
  }, []);


  const handleFilterChange = (filter: keyof typeof filters) => {
    setFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };

  const filteredPrograms = programsData.filter(program => {
    const matchesSearch = program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === "All" || program.category === selectedCategory;

    const matchesFilters = (
      (!filters.isFree || program.isFree) &&
      (!filters.isCertified || program.isCertified) &&
      (!filters.isLive || program.isLive)
    );

    return matchesSearch && matchesCategory && matchesFilters;
  });



  const handleEnroll = async (programId: number, programName: string) => {
    const storedId = localStorage.getItem("MMK_U_user_id");
    const storedUserName = localStorage.getItem("MMK_U_name");
    const storedUserEmail = localStorage.getItem("MMK_U_email");


    console.log(storedUserName)
    console.log(storedUserEmail);
    if (!storedId || !storedUserName || !storedUserEmail) {
      toast.error("Please log in to join.");
      return;
    }


    // const userId = parseInt(storedId.replace("MMK_U_", ""), 10); // ✅ Convert to number

    const userId = storedId; // keep as string "MMK_U_1234"
    const userName = storedUserName;
    const userEmail = storedUserEmail;

    if (!(userId)) {
      toast.error("Invalid user ID.");
      return;
    }

    try {
      const res = await fetch(`https://mmkuniverse-main.onrender.com/programs/check-attendance?userId=${userId}&programId=${programId}`);
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json"
      //   },
      //   body: JSON.stringify({ user_id: userId }) // send numeric ID
      // });

      const data = await res.json();

      if (data.alreadyJoined) {
        toast.info("You have already joined this Program.");
        return;
      }


      const program = programsData.find((p) => p.id === programId);
      if (program) {
        setSelectedProgram(program);
      }

      localStorage.setItem("MMK_P_program_id", programId.toString());
      localStorage.setItem("MMK_P_program_name", programName);
      // navigate("/join-program-payment");
      setTimeout(() => {
        navigate("/join-program-payment");
      }, 1500);
    } catch (err) {
      console.error("Enrollment error:", err);
      toast.error("Enrollment failed.");
    }
  };





  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="pt-32 pb-16 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-mmk-purple/20 to-transparent -z-10"></div>
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Explore <span className="text-gradient-primary">Programs</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover courses, workshops, and programs to enhance your skills and grow your career.
          </p>
        </div>
      </section>




      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="glass-card p-6 rounded-xl">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search programs..."
                  className="pl-10 bg-mmk-dark/60 border-white/10 h-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div>
                  <select
                    className="h-12 px-4 rounded-md bg-mmk-dark/60 border border-white/10 text-gray-300 focus:border-mmk-purple focus:outline-none w-full sm:w-auto"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="All">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  variant="outline"
                  className="border-white/10 text-gray-300 flex items-center gap-2 h-12"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>

              </div>
            </div>


            {showFilters && (
              <div id="filters" className=" mt-4 pt-4 border-t border-white/10">
                <div className="flex flex-wrap gap-4">
                  <Button
                    variant={filters.isFree ? "default" : "outline"}
                    className={filters.isFree ? "bg-mmk-purple text-white" : "border-white/10 text-gray-300"}
                    onClick={() => handleFilterChange("isFree")}
                  >
                    Free Courses
                  </Button>

                  <Button
                    variant={filters.isCertified ? "default" : "outline"}
                    className={filters.isCertified ? "bg-mmk-purple text-white" : "border-white/10 text-gray-300"}
                    onClick={() => handleFilterChange("isCertified")}
                  >
                    Certified
                  </Button>

                  <Button
                    variant={filters.isLive ? "default" : "outline"}
                    className={filters.isLive ? "bg-mmk-purple text-white" : "border-white/10 text-gray-300"}
                    onClick={() => handleFilterChange("isLive")}
                  >
                    Live Classes
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>


      {/*Program Cards*/}

      {/* <section className="py-12 px-4 flex-grow"> */}
      <section className="py-12 px-4 bg-mmk-dark/40">
        <div className="container mx-auto">
          {filteredPrograms.length > 0 ? (
            <>
              <div className="text-gray-400 mb-6">
                Showing {filteredPrograms.length} programs
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                
                {filteredPrograms.map((program) => (
                  <div key={program.id}>
                    <ProgramCard
                      {...program}
                      onEnroll={() => handleEnroll(program.id, program.title)}
                      isCertified={Boolean(program.isCertified)}
                      isFree={Boolean(program.isFree)}
                      isLive={Boolean(program.isLive)}
                      // isEnrolled={Boolean(program.isEnrolled)}
                      disabled={program.isEnrolled ||
                        new Date() > new Date(program.end_date) || // after event end
                        new Date() < new Date(program.start_date) || // before event start
                        program.attendees >= program.attendance_limit // attendee limit reached
                      }
                      
                    />
           
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-2xl font-semibold mb-2">No programs found</h3>
              <p className="text-gray-400 mb-8">Try adjusting your search or filters</p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                  setFilters({
                    isFree: false,
                    isCertified: false,
                    isLive: false,
                  });
                }}
                className="bg-mmk-purple hover:bg-mmk-purple/90 text-white"
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Programs;

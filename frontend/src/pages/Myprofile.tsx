import { useEffect, useState } from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer?: string;
  instructor?: string;
  attendees: number;
  image?: string;
  imageUrl?: string;
  completed?: boolean;
};

const MyProfile = () => {
  const [joinedEvents, setJoinedEvents] = useState<Event[]>([]);
  const [joinedPrograms, setJoinedPrograms] = useState<Event[]>([]);
  const [activeTab, setActiveTab] = useState<"events" | "programs">("events");

  const userId = 1; // 🔁 Replace with real authenticated user ID

  useEffect(() => {
    const fetchJoinedEvents = async () => {
      const userId = localStorage.getItem("MMK_U_user_id");
      const res = await fetch(`http://localhost:5000/events/user-events/${userId}`);
      const data = await res.json();
      const withImageUrls = data.map((event: Event) => ({
        ...event,
        imageUrl: event.image ? `http://localhost:5000/uploads/${event.image}` : null,
        completed: String(event.completed) === "true" || String(event.completed) === "1",

      }));
      setJoinedEvents(withImageUrls);
    };

    const fetchJoinedPrograms = async () => {
      const userId = localStorage.getItem("MMK_U_user_id");
      const res = await fetch(`http://localhost:5000/programs/user-programs/${userId}`);
      const data = await res.json();
      const withImageUrls = data.map((program: Event) => ({
        ...program,
        imageUrl: program.image ? `http://localhost:5000/uploads/${program.image}` : null,
        completed: String(program.completed) === "true" || String(program.completed) === "1",

      }));
      setJoinedPrograms(withImageUrls);
    };

    fetchJoinedEvents();
    fetchJoinedPrograms();
  }, []);

  const activeList = activeTab === "events" ? joinedEvents : joinedPrograms;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
  <main className="flex-1">

      <div className="container mx-auto max-w-screen-lg px-4 pt-24 pb-10">
        <h2 className="text-3xl font-bold mb-6">My {activeTab === "events" ? " Joined Events" : " Enrolled Programs"}</h2>

        <div className="flex gap-4 mb-6">
          <Button
            variant={activeTab === "events" ? "default" : "outline"}
            onClick={() => setActiveTab("events")}
          >
            Events
          </Button>
          <Button
            variant={activeTab === "programs" ? "default" : "outline"}
            onClick={() => setActiveTab("programs")}
          >
            Programs
          </Button>
        </div>

        {activeList.length === 0 ? (
          <p className="text-gray-400">You haven’t joined any {activeTab} yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeList.map((item) => (




              <Card key={item.id} className=" disabled bg-secondary/40 border-white/10 overflow-hidden relative">

                {item.completed && (
                  <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                    Completed
                  </div>
                )}

                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-40 object-cover rounded-t-md max-w-full"
                  />
                )}
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Calendar className="h-4 w-4 text-mmk-purple" />
                    {item.date}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Clock className="h-4 w-4 text-mmk-amber" />
                    {item.time}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <MapPin className="h-4 w-4 text-mmk-purple" />
                    {item.location}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyProfile;

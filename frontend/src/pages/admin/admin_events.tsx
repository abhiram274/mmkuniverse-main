// AdminEvents.tsx
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import Dashboard from "../Dashboard";
import { useNavigate } from "react-router-dom";

const EVENT_CATEGORIES = ["Workshop", "Hackathon", "Webinar", "Competition", "Career Fair", "Conference", "Social", "Other"];

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  attendees?: number;
  image?: string;
  category?: string;
}

const AdminEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    organizer: "",
    category: "",
    image: null as File | null,
  });

  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      const res = await fetch("https://mmkuniverse-main.onrender.com/events"); // Ensure this URL is correct
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error("Error fetching events:", err);
      toast.error("Failed to fetch events");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);










  
const handleSubmit = async () => {
  try {
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("date", formData.date);
    data.append("time", formData.time);
    data.append("location", formData.location);
    data.append("organizer", formData.organizer);
    data.append("category", formData.category);

    if (formData.image) {
      data.append("image", formData.image);
    }

    const res = await fetch("https://mmkuniverse-main.onrender.com/events", {
      method: "POST",
      body: data,
    });

    if (res.ok) {
      toast.success("Event created successfully!");
      setFormData({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        organizer: "",
        category: "",
        image: null,
      });
      fetchEvents();
      navigate("/manage_events");
    } else {
      const errorData = await res.json();
      toast.error(`Failed to create event: ${errorData.error}`);
    }
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong");
  }
};


  return (
    <div className="flex h-screen">
      {/* Sidebar / Dashboard fixed width */}
      <div className="w-64 bg-gray-900 text-white overflow-auto">
        <Dashboard />
      </div>

      {/* Main content grows and scrolls independently */}
      <main className="flex-1 overflow-auto p-8 bg-gray-800 text-white">
        <h1 className="text-2xl font-bold mb-6">Admin - Manage Events</h1>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <Card className="bg-secondary/20 border-white/10">
            <CardHeader>
              <CardTitle>Create New Event</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Event Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <Textarea
                placeholder="Event Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
                <Input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>
              <Input
                placeholder="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
              <Input
                placeholder="Organizer"
                value={formData.organizer}
                onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
              />
              <Select
                onValueChange={(val) => setFormData({ ...formData, category: val })}
                value={formData.category}
              >
                <SelectTrigger className="bg-transparent border-white/20">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, image: e.target.files ? e.target.files[0] : null })}
              />
            </CardContent>
            <CardFooter>
              <Button onClick={handleSubmit} className="bg-mmk-purple hover:bg-mmk-purple/90 w-full">
                Submit Event
              </Button>
            </CardFooter>
          </Card>

          <div>
            <h2 className="text-lg font-semibold mb-4">Existing Events</h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {events.length > 0 ? (
                events.map((event) => (
                  <Card key={event.id} className="bg-black/20 border-white/10">
                    <CardContent className="py-4">
                      <h3 className="text-md font-semibold">{event.title}</h3>
                      <p className="text-sm text-gray-400">{event.description.slice(0, 100)}...</p>
                      <div className="text-xs text-gray-500 mt-2">
                        {event.date} • {event.time}
                      </div>
                      {event.image && (
                        <img src={event.image} alt={event.title} className="my-2 max-h-32 object-cover rounded" />
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-gray-400">No events found.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminEvents;

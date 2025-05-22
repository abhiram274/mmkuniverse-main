// ManageEvents.tsx
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import Dashboard from "../Dashboard";

const EVENT_CATEGORIES = [
  "Workshop",
  "Hackathon",
  "Webinar",
  "Competition",
  "Career Fair",
  "Conference",
  "Social",
  "Other"
];

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
  completed: boolean;
}

const ManageEvents = () => {
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

  const formatDateInput = (isoDate: string) => {
    return isoDate.split("T")[0]; // Gets 'YYYY-MM-DD'
  };



  const [editingId, setEditingId] = useState<number | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const EVENTS_PER_PAGE = 5;

  const fetchEvents = async () => {
    try {
      const res = await fetch("http://localhost:5000/events"); // Corrected URL
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
      data.append("date", (formData.date));
      data.append("time", formData.time);
      data.append("location", formData.location);
      data.append("organizer", formData.organizer);
      data.append("category", formData.category);
      if (formData.image) {
        data.append("image", formData.image);
      }

      const endpoint = editingId
        ? `http://localhost:5000/events/${editingId}` // Corrected endpoint for editing
        : "http://localhost:5000/events"; // Corrected endpoint for creating

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        body: data,
      });

      if (res.ok) {
        toast.success(editingId ? "Event updated" : "Event created");
        setFormData({ title: "", description: "", date: "", time: "", location: "", organizer: "", category: "", image: null });
        setEditingId(null);
        fetchEvents();
      } else {
        const errorData = await res.json();
        toast.error(`Failed to submit event: ${errorData.error}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };



  const handleComplete = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:5000/events/${id}/complete`, {
        method: "PUT",
      });
      if (res.ok) {
        toast.success("Event marked as completed");
        fetchEvents();
      } else {
        toast.error("Failed to complete event");
      }
    } catch (err) {
      console.error("Error completing event:", err);
      toast.error("Error completing event");
    }
  };





  const handleEdit = (event: Event) => {
    setEditingId(event.id);
    setFormData({
      title: event.title,
      description: event.description,
      date: formatDateInput(event.date), // ✅ Format date here
      time: event.time,
      location: event.location,
      organizer: event.organizer,
      category: event.category || "",
      image: null,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:5000/events/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Event deleted");
        fetchEvents();
      } else {
        toast.error("Failed to delete event");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting event");
    }
  };

  const filteredEvents = filterCategory === "all"
    ? events
    : events.filter((e) => e.category === filterCategory);

  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * EVENTS_PER_PAGE,
    currentPage * EVENTS_PER_PAGE
  );
  const totalPages = Math.ceil(filteredEvents.length / EVENTS_PER_PAGE);

  return (
    <div className="flex h-screen">
      <div className="w-64 bg-gray-900 text-white overflow-auto">
        <Dashboard />
      </div>

      <main className="flex-1 overflow-auto p-8 bg-gray-800 text-white">
        <h1 className="text-2xl font-bold mb-6">Admin - Manage Events</h1>

        {/* Create/Update Form */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <Card className="bg-secondary/20 border-white/10">
            <CardHeader>
              <CardTitle>{editingId ? "Edit Event" : "Create New Event"}</CardTitle>
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
                onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
              />
            </CardContent>
            <CardFooter>
              <Button onClick={handleSubmit} className="bg-mmk-purple hover:bg-mmk-purple/90 w-full">
                {editingId ? "Update Event" : "Submit Event"}
              </Button>
            </CardFooter>
          </Card>

          {/* Filters + Table */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Existing Events</h2>
              <Select value={filterCategory} onValueChange={(val) => setFilterCategory(val)}>
                <SelectTrigger className="w-40 bg-gray-700 border-white/20">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {EVENT_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="overflow-auto border border-white/10 rounded">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-4 py-2">Title</th>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Time</th>
                    <th className="px-4 py-2">Category</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedEvents.map((event) => (
                    <tr key={event.id} className="border-t border-white/10">
                      <td className="px-4 py-2">{event.title}</td>
                      <td className="px-4 py-2">{event.date.split("T")[0]}</td>
                      <td className="px-4 py-2">{event.time}</td>
                      <td className="px-4 py-2">{event.category}</td>
                      <td className="px-4 py-2">
                        <div className="flex gap-2">


                          {event.completed ? (

                            <Button disabled className="bg-blue-600 text-xs px-3 py-1 cursor-not-allowed">Edit</Button>
                          ) : (
                            <Button onClick={() => handleEdit(event)} className="bg-blue-600 text-xs px-3 py-1">Edit</Button>
                          )}





                          {event.completed ? (

                            <Button disabled className="bg-red-600 text-xs px-3 py-1 cursor-not-allowed">Delete</Button>
                          ) : (
                          <Button onClick={() => handleDelete(event.id)} className="bg-red-600 text-xs px-3 py-1">Delete</Button>
                          )}




                          {event.completed ? (

                            <Button disabled className="bg-green-500 text-xs px-3 py-1 cursor-not-allowed">Completed</Button>
                          ) : (
                            <Button onClick={() => handleComplete(event.id)} className="bg-green-600 text-xs px-3 py-1">Complete</Button>
                          )}



                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-end gap-2 mt-4">
              <Button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="bg-gray-600 px-3 py-1">
                Prev
              </Button>
              <span className="self-center text-sm">Page {currentPage} of {totalPages}</span>
              <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} className="bg-gray-600 px-3 py-1">
                Next
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManageEvents;

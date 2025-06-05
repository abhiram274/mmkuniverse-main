import { useEffect, useRef, useState } from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { CardFooter } from "@/components/ui/card"; // Also needed
import { toast } from "sonner";
import AttendeesModal from "@/components/AttendeesModal";
type User = {
  user_id: string;
  name: string;
  email: string;
  phone?: string;
};

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  image?: string;
  imageUrl?: string | null;
  completed?: boolean;
  attendance_limit?: number; // <-- updated
  start_date?: string;       // <-- updated
  end_date?: string;
  attendees: number;
  category: string;
  email: string;
  price: string;
  qrcode?: string;
};
const EVENT_CATEGORIES = ["Workshop", "Seminar", "Conference", "Meetup"];
const isValidDate = (dateStr: unknown) =>
  typeof dateStr === "string" && !["", "null", "undefined"].includes(dateStr) && !isNaN(Date.parse(dateStr));

const formatDateInput = (isoDate: string) => {
  const date = new Date(isoDate);
  // Adjust to local timezone by correcting offset
  const tzOffsetInMs = date.getTimezoneOffset() * 60000;
  const localDate = new Date(date.getTime() - tzOffsetInMs);
  return localDate.toISOString().split("T")[0];
};

const formatDateDisplay = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-CA'); // YYYY-MM-DD format
};


const MyProfile = () => {

  const [user, setUser] = useState<User | null>(null);
  const [joinedEvents, setJoinedEvents] = useState<Event[]>([]);
  const [joinedPrograms, setJoinedPrograms] = useState<Event[]>([]);
  const [hostedEvents, setHostedEvents] = useState<Event[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [attendees, setAttendees] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [sendingType, setSendingType] = useState<null | 'joined' | 'participated'>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    date: "",
    time: "",
    location: "",
    organizer: "",
    category: "",
    limit: "",
    image: null as File | null,
    email: "",
    price: "",
    qrcode: null as File | null,
  });
  const [activeTab, setActiveTab] = useState<"overview" | "events" | "programs" | "hosted events">("overview");

  const userId = localStorage.getItem("MMK_U_user_id");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const formRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!userId) return;

    const fetchUserInfo = async () => {
      const res = await fetch(`http://localhost:5000/events/users/${userId}`);
      if (!res.ok) {
        console.error("Failed to fetch user info");
        return;
      }
      const data = await res.json();
      setUser(data);
    };

    const fetchJoinedEvents = async () => {
      const res = await fetch(`http://localhost:5000/events/user-events/${userId}`);
      if (!res.ok) {
        console.error("Failed to fetch user events");
        return;
      }
      const data = await res.json();
      const withImages = data.map((item: Event) => ({
        ...item,
        imageUrl: item.image ? `http://localhost:5000/uploads/${item.image}` : null,
        completed: String(item.completed) === "true" || String(item.completed) === "1",
      }));
      setJoinedEvents(withImages);
    };




    const fetchJoinedPrograms = async () => {
      const res = await fetch(`http://localhost:5000/programs/user-programs/${userId}`);
      if (!res.ok) {
        console.error("Failed to fetch user programs");
        return;
      }
      const data = await res.json();
      const withImages = data.map((item: Event) => ({
        ...item,
        imageUrl: item.image ? `http://localhost:5000/uploads/${item.image}` : null,
        completed: String(item.completed) === "true" || String(item.completed) === "1",
      }));
      setJoinedPrograms(withImages);
    };



    const fetchHostedEvents = async () => {
      const res = await fetch(`http://localhost:5000/events/hosted/${userId}`);
      if (!res.ok) {
        console.error("Failed to fetch hosted events");
        return;
      }
      const data = await res.json();
      const withImages = data.map((item: Event) => ({
        ...item,
        imageUrl: item.image ? `http://localhost:5000/uploads/${item.image}` : null,
        completed: String(item.completed) === "true" || String(item.completed) === "1",
      }));
      setHostedEvents(withImages);
    };


    fetchUserInfo();
    fetchJoinedEvents();
    fetchJoinedPrograms();
    fetchHostedEvents();

  }, [userId]);



  //Fetch attendees
  const fetchAttendees = async (eventId: number) => {
    try {
      const res = await fetch(`http://localhost:5000/events/${eventId}/attendees`);
      const data = await res.json();
      console.log("Fetched attendees:", data);
      //  setAttendeesForEvent(data.attendees);
      setAttendees(data.attendees || []);
      setSelectedEventId(eventId);
      //setAttendees(data.attendees);
      setShowModal(true);
    } catch (err) {
      toast.error("Failed to fetch attendees");
    }
  };


  //Mark as participated

  const markAsParticipated = async (eventId: number, userId: string | null, guestEmail: string | null) => {
    try {
      const res = await fetch(`http://localhost:5000/events/${eventId}/mark-participation`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId, guestEmail })
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Marked as participated");
        fetchAttendees(eventId); // Refresh list
      } else {
        toast.error(data.error || "Failed to mark participation");
      }
    } catch (err) {
      toast.error("Failed to mark participation");
    }
  };








  const renderOverview = () => (
    <div className="flex flex-col sm:flex-row gap-6 items-start">
      {/* User info table */}
      <table className="min-w-[300px] max-w-[400px] bg-gray-800 rounded-md overflow-hidden shadow-md flex-shrink-0">
        <tbody>
          {[
            ["User ID", user?.user_id],
            ["Name", user?.name],
            ["Email", user?.email],
            ["Phone", user?.phone],
          ].map(([label, value], idx) => (
            <tr
              key={label}
              className={idx % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}
            >
              <th className="text-left py-3 px-4 text-gray-300 font-semibold w-1/3">
                {label}:
              </th>
              <td className="py-3 px-4 text-gray-400 font-semibold">{value || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary cards container */}
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 w-full max-w-lg">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xl font-bold">{joinedEvents.length}</p>
            <p className="text-sm text-gray-400">Events Joined</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xl font-bold">{joinedEvents.filter(e => e.completed).length}</p>
            <p className="text-sm text-gray-400">Events Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xl font-bold">{joinedPrograms.length}</p>
            <p className="text-sm text-gray-400">Programs Enrolled</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xl font-bold">{joinedPrograms.filter(p => p.completed).length}</p>
            <p className="text-sm text-gray-400">Programs Finished</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );



  const renderEventOrProgramCards = (items: Event[]) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {items.map((item) => (
        <Card key={item.id} className="bg-secondary/40 border-white/10 overflow-hidden relative">
          {item.completed && (
            <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
              Completed
            </div>
          )}
          {item.imageUrl && (
            <div className="w-full h-40 overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
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
  );


  // useEffect(() => {
  //   const fetchEvents = async () => {
  //     const res = await fetch("http://localhost:5000/events");
  //     const data = await res.json();
  //     setHostedEvents(data);
  //   };
  //   fetchEvents();
  // }, []);

  const filteredEvents =
    filterCategory === "all"
      ? hostedEvents
      : hostedEvents.filter((e) => e.category === filterCategory);

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );



  const handleEdit = (event: Event) => {
    setEditingId(event.id);
    setFormData({
      title: event.title || "",
      description: event.description || "",
      date: event.date ? formatDateInput(event.date) : "",
      startDate: event.start_date ? formatDateInput(event.start_date) : "",
      endDate: event.end_date ? formatDateInput(event.end_date) : "",

      time: event.time || "",
      location: event.location || "",
      organizer: event.organizer || "",
      category: event.category || "",
      limit: event.attendance_limit?.toString() || "",
      image: null,
      email: event.email || "",
      price: event.price || "",
      qrcode: null,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await fetch(`http://localhost:5000/events/${eventId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete event");
      setHostedEvents((prev) => prev.filter((e) => e.id !== eventId));
    } catch {
      alert("Error deleting event");
    }
  };

  const handleComplete = async (eventId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/events/${eventId}/complete`, {
        method: "PUT",
      });
      if (res.ok) {
        toast.success("Event marked as completed");

      } else {
        toast.error("Failed to complete event");
      }
    } catch (err) {
      console.error("Error completing event:", err);
      toast.error("Error completing event");
    }
  };



  const handleSubmit = async () => {
    try {
      const data = new FormData();
      data.append("user_id", localStorage.getItem("MMK_U_user_id"));
      data.append("user_name", localStorage.getItem("MMK_U_name"));
      //data.append("email", localStorage.getItem("MMK_U_email"));


      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("date", (formData.date));
      data.append("startDate", formData.startDate);


      data.append("endDate", formData.endDate);



      data.append("limit", formData.limit);



      data.append("time", formData.time);
      data.append("location", formData.location);
      data.append("organizer", formData.organizer);
      data.append("category", formData.category);
      data.append("email", formData.email);
      data.append("price", formData.price);

      if (formData.image) {
        data.append("image", formData.image);
      }
            if (formData.qrcode) {
        data.append("qrcode", formData.qrcode);
      }


      const endpoint = editingId
        ? `http://localhost:5000/events/${editingId}` // Corrected endpoint for editing
        : "http://localhost:5000/events/user-create-event"; // Corrected endpoint for creating

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        body: data,
      });

      if (res.ok) {
        toast.success(editingId ? "Event updated" : "Event created");
        setFormData({ title: "", description: "", date: "", startDate: "", endDate: "", time: "", location: "", organizer: "", category: "", image: null, limit: "", email: "", price: "" , qrcode:null});
        setEditingId(null);

      } else {
        const errorData = await res.json();
        toast.error(`Failed to submit event: ${errorData.error}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };





  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      date: "",
      time: "",
      location: "",
      organizer: "",
      category: "",
      limit: "",
      image: null,
      email: "",
      price: "",
      qrcode:null,
    });
  };






  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-10 px-4 w-full max-w-6xl mx-auto transition-all">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">Profile</h1>
          <div className="flex gap-2 flex-wrap">
            {["overview", "events", "programs", "hosted events"].map(tab => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "outline"}
                onClick={() => setActiveTab(tab as any)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {activeTab === "overview" && renderOverview()}
        {activeTab === "events" && (
          joinedEvents.length === 0
            ? <p className="text-gray-400">No joined events yet.</p>
            : renderEventOrProgramCards(joinedEvents)
        )}
        {activeTab === "programs" && (
          joinedPrograms.length === 0
            ? <p className="text-gray-400">No enrolled programs yet.</p>
            : renderEventOrProgramCards(joinedPrograms)
        )}





        {activeTab === "hosted events" && (
          // <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <Card ref={formRef} className="bg-secondary/20 border-white/10">
              <CardHeader>
                <CardTitle>{editingId ? "Edit Event" : "Create New Event"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">

                <div>
                  <label className="block text-sm font-medium text-gray-500">Event Title</label>
                  <Input
                    placeholder="Event Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>


                <div>
                  <label className="block text-gray-500 text-sm font-medium ">Description</label>
                  <Textarea
                    placeholder="Event Description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>






                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date" className="text-gray-500">Event Starts From</Label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>


                  <div>
                    <Label htmlFor="time" className="text-gray-400">Time</Label>
                    <Input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-500">Location</label>

                    <Input
                      placeholder="Location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>

                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-500">Mail</label>

                    <Input
                      placeholder="Your Mail"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>





                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-500">Event Price</label>
                    <Input
                      placeholder="(Example:₹100) or Free"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />

                  </div>

                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-500">Organizer</label>

                    <Input
                      placeholder="Organizer"
                      value={formData.organizer}
                      onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                    />

                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate" className="text-gray-500">Registrations From</Label>
                    <Input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value.split("T")[0] })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate" className="text-gray-500">To</Label>
                    <Input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>




                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-300">Attendees Limit*</label>
                    <Input
                      type="number"
                      placeholder="Limit of Attendees"
                      value={formData.limit}
                      onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
                    />
                  </div>


                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-300">Category</label>
                    <Select

                      value={formData.category}
                      onValueChange={(val) => setFormData({ ...formData, category: val })}
                    >
                      <SelectTrigger className="w-full bg-mmk-dark text-white p-2 rounded-md border-2 border-gray-700 ">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {EVENT_CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>




                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-300">Event Image </label>

                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.files?.[0] || null })
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-300">Payment Qr Code </label>


                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setFormData({ ...formData, qrcode: e.target.files?.[0] || null })
                      }
                    />

                  </div>
                </div>


                {editingId && (
                  <Button
                    variant="ghost"
                    className="w-full mt-2 text-red-400"
                    onClick={resetForm}
                  >
                    Cancel Editing
                  </Button>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleSubmit}
                  className="bg-mmk-purple hover:bg-mmk-purple/90 w-full"
                >
                  {editingId ? "Update Event" : "Submit Event"}
                </Button>
              </CardFooter>
            </Card>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Existing Events</h2>
                <Select
                  value={filterCategory}
                  onValueChange={(val) => {
                    setFilterCategory(val);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-40 bg-gray-700 border-white/20">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {EVENT_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
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
                      <th className="px-4 py-2">View Attendees</th>
                      <th className="px-4 py-2">Attendees Excel</th>
                      <th className="px-4 py-2">Send Certificate</th>
                      <th className="px-4 py-2">Send Certficate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedEvents.map((event) => (
                      <tr
                        key={event.id}
                        className={`border-t border-white/10 ${editingId === event.id ? "bg-white/10" : ""
                          }`}
                      >
                        <td className="px-4 py-2">{event.title}</td>
                        <td className="px-4 py-2">{formatDateDisplay(event.date)}</td>
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

                        <td className="px-4 py-2">


                          <Button className="bg-gray-700 text-xs px-3 py-1" onClick={() => fetchAttendees(Number(event.id))}>View Attendees</Button>
                          {showModal && (
                            <AttendeesModal
                              attendees={attendees}
                              onClose={() => setShowModal(false)}
                              onMarkParticipated={(userId, guestEmail) =>
                                markAsParticipated(selectedEventId, userId, guestEmail)
                              }
                            />
                          )}
                          {/* <Button
                          className="bg-gray-700 text-xs px-3 py-1"
                          onClick={() => fetchAttendees(event.id)}
                        >
                          View Attendees
                        </Button> */}

                        </td>



                        <td className="px-4 py-2">
                          <Button
                            className="bg-yellow-500 text-xs px-3 py-1"
                            onClick={() =>
                              window.open(
                                `http://localhost:5000/events/${event.id}/export-excel`,
                                "_blank"
                              )
                            }
                          >
                            Export Excel
                          </Button>
                        </td>

                        <td className="px-4 py-2">
                          <Button
                            className="bg-purple-700 text-xs px-3 py-1"
                            disabled={sendingType === 'joined'}
                            onClick={() => {
                              setSendingType('joined');
                              fetch(`http://localhost:5000/events/send-certificates/${event.id}?type=joined`, {
                                method: "POST",
                              })
                                .then((res) => res.json())
                                .then((data) => toast.success(data.message))
                                .catch(() => toast.error("Failed to send certificates"))
                                .finally(() => setSendingType(null));
                            }}
                          >
                            {sendingType === 'joined' ? 'Sending...' : 'Send to Joined'}
                          </Button>
                        </td>

                        <td className="px-4 py-2">
                          <Button
                            className="bg-indigo-700 text-xs px-3 py-1"
                            disabled={sendingType === 'participated'}
                            onClick={() => {
                              setSendingType('participated');
                              fetch(`http://localhost:5000/events/send-certificates/${event.id}?type=participated`, {
                                method: "POST",
                              })
                                .then((res) => res.json())
                                .then((data) => toast.success(data.message))
                                .catch(() => toast.error("Failed to send certificates"))
                                .finally(() => setSendingType(null));
                            }}
                          >
                            {sendingType === 'participated' ? 'Sending...' : 'Send to Participants'}
                          </Button>
                        </td>








                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* <div className="flex justify-between items-center mt-4 text-white"> */}
              <div className="flex justify-end gap-2 mt-4">

                <Button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="bg-gray-600 px-3 py-1">
                  Prev
                </Button>
                <span className="self-center text-sm">Page {currentPage} of {totalPages}</span>
                <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} className="bg-gray-600 px-3 py-1">
                  Next
                </Button>
              </div>
              <br />
              <br />
              <p className="text-gray-400">Registrations for the events will be approved by the MMK Team </p>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
};

export default MyProfile;
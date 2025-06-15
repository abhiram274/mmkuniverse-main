// ManageEvents.tsx
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import Dashboard from "../Dashboard";
import { Label } from "@radix-ui/react-label";
import AttendeesModal from "@/components/AttendeesModal";

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
  image?: string;
  category?: string;
  completed: boolean;
  attendance_limit?: number; // <-- updated
  start_date?: string;       // <-- updated
  end_date?: string;
  attendees: number;
  price: string;
  email: string;
}
const isValidDate = (dateStr: unknown) =>
  typeof dateStr === "string" && !["", "null", "undefined"].includes(dateStr) && !isNaN(Date.parse(dateStr));


const ManageEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  // const [attendeesForEvent, setAttendeesForEvent] = useState<any[]>([]);
  const [attendees, setAttendees] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [sendingType, setSendingType] = useState<null | 'joined' | 'participated'>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [certificateType, setCertificateType] = useState<null | 'joined' | 'participated'>(null);
  const [description, setDescription] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null); // 👈 store current event object

  // const [attendees, setAttendees] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    startDate: "",
    endDate: "",
    time: "",
    location: "",
    organizer: "",
    category: "",
    image: null as File | null,
    limit: "",
    qrCodeImage: null as File | null, // <-- added
    price: "",
    email: "",
  });

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


  const [editingId, setEditingId] = useState<number | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const EVENTS_PER_PAGE = 5;

  //Fetch attendees
  const fetchAttendees = async (eventId: number) => {
    try {
      const res = await fetch(`https://mmkuniverse-main.onrender.com/events/${eventId}/attendees`);
      const data = await res.json();
      console.log("Fetched attendees:", data);


      const normalizedAttendees = (data.attendees || []).map(attendee => ({
        ...attendee,
        userId: attendee.user_id || null,
        guestEmail: attendee.guest_email || null,
      }));


      // setAttendees(data.attendees || []);
      setAttendees(normalizedAttendees);
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
      const res = await fetch(`https://mmkuniverse-main.onrender.com/events/${eventId}/mark-participation`, {
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

  //fetch events
  const fetchEvents = async () => {
    try {
      const res = await fetch("https://mmkuniverse-main.onrender.com/events"); // Corrected URL
      const data = await res.json();

      // console.log("Fetched events:", data);
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
      data.append("startDate", formData.startDate);


      data.append("endDate", formData.endDate);



      data.append("limit", formData.limit);



      data.append("time", formData.time);
      data.append("location", formData.location);
      data.append("organizer", formData.organizer);
      data.append("category", formData.category);
      data.append("price", formData.price);
      data.append("email", formData.email);
      if (formData.image) {
        data.append("image", formData.image);
      }
      if (formData.qrCodeImage) {
        data.append("qrcode", formData.qrCodeImage); // <-- added
      }

      const endpoint = editingId
        ? `https://mmkuniverse-main.onrender.com/events/${editingId}` // Corrected endpoint for editing
        : "https://mmkuniverse-main.onrender.com/events"; // Corrected endpoint for creating

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        body: data,
      });

      if (res.ok) {
        toast.success(editingId ? "Event updated" : "Event created");
        setFormData({ title: "", description: "", date: "", startDate: "", endDate: "", time: "", location: "", organizer: "", category: "", image: null, limit: "", qrCodeImage: null, price: "", email: "", });
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
      const res = await fetch(`https://mmkuniverse-main.onrender.com/events/${id}/complete`, {
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
    console.log("Editing Event:", event);

    setEditingId(event.id);
    setFormData({
      title: event.title,
      description: event.description,
      date: isValidDate(event.date) ? formatDateInput(event.date) : "",
      startDate: event.start_date ? formatDateInput(event.start_date) : "",
      endDate: event.end_date ? formatDateInput(event.end_date) : "",

      time: event.time,
      location: event.location,
      organizer: event.organizer,
      category: event.category || "",
      image: null,
      limit: event.attendance_limit?.toString() || "",
      qrCodeImage: null,
      price: event.price,
      email: event.email,

    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };



  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`https://mmkuniverse-main.onrender.com/events/${id}`, {
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

              <div>
                <label className="block text-sm font-medium text-gray-300">Event Title</label>
                <Input
                  placeholder="Event Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>



              <div>
                <label className="block text-gray-300 text-sm font-medium ">Description</label>
                <Textarea
                  placeholder="Event Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>


              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">Registration Start Date</label>
                  <Input
                    placeholder="registration starting date"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">Registration End Date</label>
                  <Input
                    placeholder="registration ending date"

                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                  />
                </div>
              </div>


              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">Event Starts From</label>
                  <Input
                    placeholder="Event starts"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">Time</label>
                  <Input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
              </div>


              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300">Location</label>
                <Input
                  placeholder="Location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-300">Mail</label>

                <Input
                  placeholder="Your Mail"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>





              <div>
                <label className="block text-sm font-medium text-gray-300">Event Price</label>

                <Input
                  placeholder="(Example:₹100) or Free"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
              </div>



              <div>
                <label className="block text-sm font-medium text-gray-300">Organizer</label>

                <Input
                  placeholder="Organizer"
                  value={formData.organizer}
                  onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                />
              </div>


              {/* <Input
                placeholder="Attendees"
                value={formData.attendees}
                disabled
                onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
              /> */
              }



              <div>
                <label className="block text-sm font-medium text-gray-300">Category</label>
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
              </div>





              <div>
                <label className="block text-sm font-medium text-gray-300">Attendees Limit*</label>
                <Input
                  type="number"
                  placeholder="Limit of Attendees"
                  value={formData.limit}
                  onChange={(e) =>
                    setFormData({ ...formData, limit: e.target.value })
                  }
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300">Event Image </label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                />
              </div>


              <div>


                <Label className="block text-sm font-medium text-gray-300" htmlFor="qrCodeImage" style={{ marginTop: "20px" }}>QR Code Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({ ...formData, qrCodeImage: e.target.files?.[0] || null })
                  }
                />
              </div>


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
                    <th className="px-4 py-2">View Attendees</th>
                    <th className="px-4 py-2">Export Excel</th>
                    <th className="px-4 py-2">Send Certificate</th>
                    <th className="px-4 py-2">Send Certficate</th>


                  </tr>
                </thead>
                <tbody>
                  {paginatedEvents.map((event) => (
                    <tr key={event.id} className="border-t border-white/10">
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


                        <Button className="bg-gray-700 text-xs px-3 py-1" onClick={() => fetchAttendees(event.id)}>View Attendees</Button>
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
                          onClick={() => window.open(`https://mmkuniverse-main.onrender.com/events/${event.id}/export-excel`, "_blank")}
                        >
                          Export Excel
                        </Button>
                      </td>


                      {/* 
                     <td className="px-4 py-2">
                        <Button
                          className="bg-purple-700 text-xs px-3 py-1"
                          disabled={sendingType === 'joined'}
                          onClick={() => {
                            setSendingType('joined');
                            setOpenDialog(true);
                            fetch(`https://mmkuniverse-main.onrender.com/events/send-certificates/${event.id}?type=joined`, {
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
                            fetch(`https://mmkuniverse-main.onrender.com/events/send-certificates/${event.id}?type=participated`, {
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
                        */}



                      <td className="px-4 py-2">
                        <Button
                          className="bg-purple-700 text-xs px-3 py-1"
                          onClick={() => {
                            setCertificateType('joined');
                            setSelectedEvent(event); // 👈 store selected event for modal use
                            setOpenDialog(true);
                          }}
                        >
                            {sendingType === 'joined' ? 'Sending...' : 'Send to Joined'}
                        </Button>
                      </td>

                      <td className="px-4 py-2">
                        <Button
                          className="bg-indigo-700 text-xs px-3 py-1"
                          onClick={() => {
                            setCertificateType('participated');
                            setSelectedEvent(event); // 👈 store selected event
                            setOpenDialog(true);
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

            {openDialog && selectedEvent && (
              <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-zinc-900 text-zinc-100 p-6 rounded-2xl w-full max-w-md shadow-2xl border border-zinc-700">
                  <h2 className="text-xl font-semibold mb-4">Send Certificate</h2>
                  <p className="text-sm mb-6">
                    You're sending to: <span className="text-indigo-400 font-medium">{certificateType}</span> for{' '}
                    <span className="text-indigo-400 font-medium">{selectedEvent.title}</span>
                  </p>

                  <div className="mb-5">
                    <label className="block text-sm font-medium mb-1">Certificate Description</label>
                    <textarea
                      className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="e.g., For outstanding contribution and participation..."
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      className="px-4 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 transition"
                      onClick={() => {
                        setOpenDialog(false);
                        setDescription('');
                        setCertificateType(null);
                        setSelectedEvent(null);
                      }}
                    >
                      Cancel
                    </button>

                    <button
                      className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition"
                      onClick={() => {
                        setSendingType(certificateType);
                        setOpenDialog(false);

                        fetch(`https://mmkuniverse-main.onrender.com/events/send-certificates/${selectedEvent.id}?type=${certificateType}`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            description,
                            eventName: selectedEvent.title,
                          }),
                        })
                          .then((res) => res.json())
                          .then((data) => toast.success(data.message))
                          .catch(() => toast.error('Failed to send certificates'))
                          .finally(() => {
                            setSendingType(null);
                            setDescription('');
                            setCertificateType(null);
                            setSelectedEvent(null);
                          });
                      }}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            )}




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
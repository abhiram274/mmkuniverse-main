import { useState, useEffect } from "react";
import { Calendar, Users, MapPin, Clock, Filter, Plus, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Share2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  attendees: number;
  attendance_limit: number;
  category?: string;
  imageUrl?: string;
  qrCodeImage?: string;
  isEnrolled?: boolean;
  start_date?: string;
  end_date?: string;
  price: string;
  email: string;

};

const EVENT_CATEGORIES = ["Workshop", "Hackathon", "Webinar", "Competition", "Career Fair", "Conference", "Social", "Other"];

// const formatDateToYMD = (date: Date): string => {
//   return date.toISOString().split("T")[0];
// };

const formatDateToYMD = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};



const formatDateDisplay = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-CA'); // YYYY-MM-DD format
};

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isCreateEventDialogOpen, setIsCreateEventDialogOpen] = useState(false);
  const [isEventDetailsDialogOpen, setIsEventDetailsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const storedId = localStorage.getItem("MMK_U_user_id");
        let userId: number | null = null;
        if (storedId) {
          userId = parseInt(storedId.replace("MMK_U_", ""), 10);
          if (isNaN(userId)) userId = null;
        }

        const url = userId ? `https://mmkuniverse-main.onrender.com/events/non-complete?user_id=${storedId}` : "https://mmkuniverse-main.onrender.com/events/non-complete";
        const res = await axios.get(url);

        const baseCloudinaryURL = "https://res.cloudinary.com/dxf8n44lz/image/upload/";
        const mappedEvents: Event[] = res.data.map((event) => {
          let imageUrl = event.imageUrl ?? event.image ?? "";

          // If it's not a full URL already, add the Cloudinary base path
          if (imageUrl && !imageUrl.startsWith("http")) {
            imageUrl = baseCloudinaryURL + imageUrl;
          }

          return {
            ...event,
            category: event.category || "Other",
            imageUrl,
            qrCodeImage: event.qrcode ?? undefined,
            isEnrolled: Boolean(event.isEnrolled),
            end_date: event.end_date ?? undefined,
            start_date: event.start_date ?? undefined,
          };
        });

        setEvents(mappedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Unable to load events at this time.");
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    let temp = [...events];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      temp = temp.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q)
      );
    }
    if (selectedCategory !== "All") {
      temp = temp.filter((e) => e.category === selectedCategory);
    }




    if (selectedDate) {
      const selectedFormatted = formatDateToYMD(selectedDate); // "YYYY-MM-DD"

      temp = temp.filter((e) => {
        if (!e.date) return false;
        // Create Date object from UTC string, then convert to LOCAL YMD
        const localEventDate = formatDateToYMD(new Date(e.date)); // Uses local time
        return localEventDate === selectedFormatted;
      });
    }



    setFilteredEvents(temp);
  }, [events, searchQuery, selectedCategory, selectedDate]);




  const handleJoinEvent = async (eventId: string, eventName: string) => {
    const storedId = localStorage.getItem("MMK_U_user_id");
    const storedUserName = localStorage.getItem("MMK_U_name");
    const storedUserEmail = localStorage.getItem("MMK_U_email");

    if (!storedId || !storedUserName || !storedUserEmail) {
      toast.error("Please log in to join.");
      return;
    }

    const userId = storedId; // keep as string "MMK_U_1234"

    try {
      const res = await fetch(
        // `https://mmkuniverse-main.onrender.com/events/check-attendance?userId=${userId}&eventId=${eventId}`
          `https://mmkuniverse-main.onrender.com/events/check-attendance/${userId}/${eventId}`

      );
      const data = await res.json();

      if (data.alreadyJoined) {
        toast.info("You have already joined this event.");
        return;
      }

      localStorage.setItem("MMK_E_event_id", eventId);
      localStorage.setItem("MMK_E_event_name", eventName);
      navigate("/join-event-payment");
    } catch (error) {
      console.error("Error checking join status:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsEventDetailsDialogOpen(true);
  };

  // const handleDateSelect = (offset: number) => {
  //   const date = new Date();
  //   date.setDate(date.getDate() + offset);
  //   setSelectedDate(date);
  // };

  const handleDateSelect = (offset: number) => {
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset); // midnight local time
    setSelectedDate(midnight);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-20">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gradient-primary">Discover & Join Live Learning Events</h1>
              <p className="text-gray-400 mt-2">Level up with real-time learning and interaction.</p>
            </div>
            <Button onClick={() => setIsCreateEventDialogOpen(true)} className="bg-mmk-purple hover:bg-mmk-purple/90">
              <Plus size={18} />
              Host an Event
            </Button>
          </div>

          <section className="py-8 px-4">
            <div className="container mx-auto">
              <div className="glass-card p-6 rounded-xl">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                    <Input
                      type="text"
                      placeholder="Search events..."
                      className="pl-10 bg-mmk-dark/60 border-white/10 h-12"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <Button
                    variant="outline"
                    className="border-white/10 text-gray-300 flex items-center gap-2 h-12"
                    onClick={() => document.getElementById("filters")?.classList.toggle("hidden")}
                  >
                    <Filter className="h-4 w-4" />
                    Filters
                  </Button>
                </div>

                <div className="mt-4 flex items-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center mr-2">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span className="text-sm">Select Date:</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Tap any date to see what's happening.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <div className="flex overflow-x-auto space-x-2 py-2 scrollbar-none">
                    {Array.from({ length: 10 }).map((_, index) => {
                      const date = new Date();
                      date.setDate(date.getDate() + index);
                      return (
                        <button
                          key={index}
                          onClick={() => handleDateSelect(index)}
                          className={`flex-shrink-0 py-1 px-3 rounded-full border ${selectedDate &&
                            formatDateToYMD(selectedDate) === formatDateToYMD(date)
                            ? "bg-mmk-purple border-mmk-purple text-white"
                            : "border-white/20 hover:border-mmk-purple/60 hover:bg-mmk-purple/10"
                            }`}
                        >
                          {date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </button>
                      );
                    })}

                    <Button
                      className="text-sm bg-purple-500 text-white-400 "
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("All");
                        setSelectedDate(null);
                      }}
                    >
                      Reset Filters
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {loading ? (
            <div className="text-center text-gray-400 py-10">Loading events...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-10">{error}</div>
          ) : filteredEvents.length === 0 ? (
            <div className="glass-card p-10 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-mmk-purple/20 rounded-full flex items-center justify-center mb-4">
                <Calendar className="h-10 w-10 text-mmk-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No events yet. Why not host one?</h3>
              <p className="text-gray-400 max-w-md mb-6">
                Be the first to organize an event and kickstart the community learning!
              </p>
              <Button onClick={() => setIsCreateEventDialogOpen(true)} className="bg-mmk-purple hover:bg-mmk-purple/90">
                <Plus size={18} className="mr-2" />
                Host an Event
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <Card key={event.id} className="bg-secondary/40 border-white/10 overflow-hidden hover:border-mmk-purple/60 transition-all">
                  {event.imageUrl && (
                    <div className="relative overflow-hidden">
                      <img
                        src={event.imageUrl || "/placeholder.jpg"}
                        alt={event.title}
                        className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  )}

                  <CardHeader className="pb-2">
                    <CardTitle className=" font-semibold line-clamp-2">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-300 line-clamp-2">{event.description}</p>

                    <div className="space-y-4 text-s text-gray-300">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-mmk-purple" />
                        <span>
                          <strong>Registration From:</strong>{" "}
                          {formatDateDisplay(event.start_date)} <strong>to</strong>{" "}
                          {formatDateDisplay(event.end_date)}
                        </span>
                      </div>


                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-mmk-purple" />
                        <span>
                          <strong>Event Starts:</strong> {formatDateDisplay(event.date)}
                        </span>
                      </div>
                      {/* <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Clock className="h-4 w-4 text-mmk-amber" />
                        Time: {event.time}
                      </div> */}
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <MapPin className="h-4 w-4 text-mmk-purple" />
                        Location: {event.location}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300">

                        Members Limit: {event.attendance_limit}
                      </div>
                    </div>



                    <div className="flex justify-between items-center text-sm text-gray-400">
                      <div>By: {event.organizer}</div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {event.attendees} attending
                      </div>


                      {/*<div className="pt-4"> */}
                      <Button
                        variant="outline"
                        onClick={() => {
                          const url = `${window.location.origin}/guest-join-payment?event_id=${event.id}&event_name=${encodeURIComponent(event.title)}`;
                          navigator.clipboard.writeText(url);
                          toast.success("Join link copied to clipboard!");
                        }}
                        className="flex items-center gap-2 text-sm"
                      >
                        <Share2 className="w-4 h-4" />
                        Share Event Join Link
                      </Button>
                    </div>




                  </CardContent>
                  <CardFooter className="pt-0 flex justify-between">
                    <Button variant="outline" className="border-white/20 hover:bg-mmk-purple/10 hover:border-mmk-purple/60" onClick={() => handleViewEvent(event)}>
                      Details
                    </Button>
                    <Button
                      className="bg-mmk-purple hover:bg-mmk-purple/90 text-white"
                      onClick={() => handleJoinEvent(event.id, event.title)}
                      disabled={
                        event.isEnrolled ||
                        new Date() > new Date(event.end_date) || // after event end
                        new Date() < new Date(event.start_date) || // before event start
                        event.attendees >= event.attendance_limit // attendee limit reached
                      }
                    >
                      {event.isEnrolled ? "Joined" : "Join Now"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Create Event Dialog */}
        <Dialog open={isCreateEventDialogOpen} onOpenChange={setIsCreateEventDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create a New Event</DialogTitle>
              <DialogDescription>Fill in the event details to host a new event.</DialogDescription>
            </DialogHeader>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                formData.append("user_id", localStorage.getItem("MMK_U_user_id"));
                formData.append("user_name", localStorage.getItem("MMK_U_name"));
                // formData.append("email", localStorage.getItem("MMK_U_email"));

                try {
                  const res = await axios.post("https://mmkuniverse-main.onrender.com/events/user-create-event", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                  });

                  toast.success("Event created successfully!");

                  // Optional: Refresh event list or append to UI
                  setEvents((prev) => [...prev, res.data]);
                  setIsCreateEventDialogOpen(false);
                } catch (err) {
                  console.error(err);
                  toast.error("Failed to create event.");
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-300">Event Title</label>
                <Input className="border-2 border-gray-700 rounded-md p-2" name="title" placeholder="Event Title" required />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium ">Description</label>
                <Textarea className="border-2 border-gray-700 rounded-md p-2" name="description" placeholder="Event Description" required />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-300">Event Starts From</label>
                  <Input className="border-2 border-gray-700 rounded-md p-2" type="date" name="date" required />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-300">Time</label>
                  <Input className="border-2 border-gray-700 rounded-md p-2" type="time" name="time" required />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-300">Location</label>
                  <Input className="border-2 border-gray-700 rounded-md p-2" name="location" placeholder="Location" required />
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-300">Mail</label>
                  <Input className="border-2 border-gray-700 rounded-md p-2" name="email" placeholder="Your mail" required />
                </div>


              </div>

              <div className="flex gap-4">

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-300">Event Price</label>
                  <Input className="border-2 border-gray-700 rounded-md p-2" name="price" placeholder="(Example:₹100) or Free" />
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-300">Organizer</label>
                  <Input className="border-2 border-gray-700 rounded-md p-2" name="organizer" placeholder="Organizer Name" required />
                </div>
              </div>



              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-300">Registration Start Date</label>
                  <Input className="border-2 border-gray-700 rounded-md p-2" type="date" name="startDate" required />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-300">Registration End Date</label>
                  <Input className="border-2 border-gray-700 rounded-md p-2" type="date" name="endDate" required />
                </div>

              </div>



              <div className="flex gap-4">

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-300">Attendees Limit*</label>
                  <Input className="border-2 border-gray-700 rounded-md p-2" type="number" name="limit" placeholder="Limit" min={1} required />
                </div>




                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-300">Category</label>
                  <select name="category" required className="w-full bg-mmk-dark text-white p-2 rounded-md border-2 border-gray-700 ">
                    <option value="">Select Category</option>
                    {EVENT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>


              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-300">Event Image </label>
                  <Input className="border-2 border-gray-700 rounded-md p-2" type="file" name="image" accept="image/*" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-300">Payment Qr Code </label>
                  <Input className="border-2 border-gray-700 rounded-md p-2" type="file" name="qrcode" accept="image/*" />
                </div>
              </div>






              <DialogFooter className="pt-4">
                <Button type="submit" className="bg-mmk-purple hover:bg-mmk-purple/90">Create Event</Button>
                <Button type="button" variant="ghost" onClick={() => setIsCreateEventDialogOpen(false)}>Cancel</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Event Details Dialog */}
        <Dialog open={isEventDetailsDialogOpen} onOpenChange={setIsEventDetailsDialogOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>{selectedEvent?.title}</DialogTitle>
              <DialogDescription>{selectedEvent?.description}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex gap-4">
                <Calendar className="h-5 w-5 text-mmk-purple" />
                <span>{formatDateDisplay(selectedEvent?.date)}</span>
              </div>
              <div className="flex gap-4">
                <Clock className="h-5 w-5 text-mmk-amber" />
                <span>{selectedEvent?.time}</span>
              </div>

              <div className="flex gap-4">
                <MapPin className="h-5 w-5 text-mmk-purple" />
                <span>{selectedEvent?.location}</span>
              </div>
              <div className="flex gap-4">
                <Users className="h-5 w-5" />
                <span>{selectedEvent?.attendees} attending</span>
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsEventDetailsDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </main>
      <Footer />
    </div>
  );
};

export default Events;

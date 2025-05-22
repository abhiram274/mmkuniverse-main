import { useState, useEffect } from "react";
import { Calendar, Users, MapPin, Clock, Filter, Plus, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
import { Footer } from "react-day-picker";

// 👇 Define Event type

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  attendees: number;
  category?: string;
  imageUrl?: string;
  isEnrolled?: boolean;
};


const EVENT_CATEGORIES = ["Workshop", "Hackathon", "Webinar", "Competition", "Career Fair", "Conference", "Social", "Other"];


const formatDateToYMD = (date: Date): string => {
  return date.toISOString().split("T")[0];
};


const Events = () => {

  const [events, setEvents] = useState<Event[]>([]);
  const [isCreateEventDialogOpen, setIsCreateEventDialogOpen] = useState(false);
  const [isEventDetailsDialogOpen, setIsEventDetailsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);


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


        // Pass user_id as query param if available
        const url = userId ? `http://localhost:5000/events?user_id=${userId}` : "http://localhost:5000/events";
        const res = await axios.get(url);


        // if (!res.ok) throw new Error("Failed to fetch events");


        // const data = await res.json();

        const mappedEvents: Event[] = res.data.map((event) => ({
          ...event,
          imageUrl: event.image ?? undefined,
          isEnrolled: Boolean(event.isEnrolled),

        }));



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





  const navigate = useNavigate();


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
      const formatted = formatDateToYMD(selectedDate);
      temp = temp.filter((e) => e.date === formatted);
    }
    setFilteredEvents(temp);
  }, [events, searchQuery, selectedCategory, selectedDate]);










  //handle join
  const handleJoinEvent = async (eventId: string) => {

    const storedId = localStorage.getItem("MMK_U_user_id");
    const storedUserName = localStorage.getItem("MMK_U_user_name");
    console.log("Stored ID:", storedId); // Debugging line

   if (!storedId || !storedUserName) {
    toast.error("Please log in to join.");
    return;
  }

    const userId = parseInt(storedId.replace("MMK_U_", ""), 10); // ✅ Convert to number
    const userName = storedUserName;

    if (isNaN(userId)) {
      toast.error("Invalid user ID.");
      return;
    }


    try {
      // const userJson = localStorage.getItem("user");
      // if (!userJson) {
      //   alert("Please log in to join an event.");
      //   return;
      // }
      // const user = JSON.parse(userJson);

      const res = await fetch(`http://localhost:5000/events/${eventId}/join-event`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userId }),
      });

      if (res.ok) {
        toast.success("Joined successfully!");
        // navigate('/my_profile');

        setEvents((prev) =>
          prev.map((e) =>
            e.id === eventId ? { ...e, attendees: e.attendees + 1, isEnrolled: true } : e
          )
        );
      }


      else {
        const errorData = await res.json();

        if (errorData.message === "User already joined the event") {
          toast.error("You are already joined in this program.");
        } else {
          toast.error("Joining  failed.");
        }
      }
    } catch (err) {
      console.error("Joining in an event error:", err);
      toast.error("Joining failed.");
    }


  };









  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsEventDetailsDialogOpen(true);
  };


  const handleDateSelect = (offset) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    setSelectedDate(date);
  };






  // // ✅ Filtered Events Logic (fixed from programsData)
  // const filteredEvents = events.filter(event => {
  //   const matchesSearch =
  //     event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     event.description.toLowerCase().includes(searchQuery.toLowerCase());

  //   const matchesCategory =
  //     selectedCategory === "All" || event.category === selectedCategory;

  //   return matchesSearch && matchesCategory;
  // });



  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-20">
        <div className="flex flex-col gap-8">
          {/* Header */}
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


          {/* Search and Filter */}
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
                  {/* <Select>
                    <SelectTrigger className="w-full md:w-[180px] bg-transparent border-white/20">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date-asc">Soonest First</SelectItem>
                      <SelectItem value="date-desc">Latest First</SelectItem>
                      <SelectItem value="popularity">Most Popular</SelectItem>
                      <SelectItem value="recent">Recently Added</SelectItem>
                    </SelectContent>
                  </Select> */}

                </div>




                {/* Date Filter Buttons */}
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



          {/* Events Section */}
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
            <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <Card key={event.id} className="bg-secondary/40 border-white/10 overflow-hidden hover:border-mmk-purple/60  transition-all">
                  {event.imageUrl && (
                    <div className="relative  overflow-hidden">

                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  )}



                  <CardHeader className="pb-2">

                    <CardTitle className="text-lg font-semibold line-clamp-2">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-300 line-clamp-2">{event.description}</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Calendar className="h-4 w-4 text-mmk-purple" />
                        {event.date.split("T")[0]}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Clock className="h-4 w-4 text-mmk-amber" />
                        {event.time}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <MapPin className="h-4 w-4 text-mmk-purple" />
                        {event.location}
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-400">
                      <div>By: {event.organizer}</div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {event.attendees} attending
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 flex justify-between">
                    <Button variant="outline" className="border-white/20 hover:bg-mmk-purple/10 hover:border-mmk-purple/60" onClick={() => handleViewEvent(event)}>
                      Details
                    </Button>
                    {/* <Button
                      className="bg-mmk-purple hover:bg-mmk-purple/90"
                      onClick={() => handleJoinEvent(event.id)}
                    >
                      Join Event
                    </Button> */}
                    <Button
                      className="bg-mmk-purple hover:bg-mmk-purple/90 text-white"
                      onClick={() => handleJoinEvent(event.id)}
                      disabled={event.isEnrolled}
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
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const file = formData.get("image") as File;
                const imageUrl = file && file.size > 0 ? URL.createObjectURL(file) : null;

                const newEvent: Event = {
                  id: Date.now().toString(),
                  title: formData.get("title") as string,
                  description: formData.get("description") as string,
                  date: formData.get("date") as string,
                  time: formData.get("time") as string,
                  location: formData.get("location") as string,
                  organizer: formData.get("organizer") as string,
                  attendees: 0,

                  imageUrl: imageUrl || undefined, // optional field
                };
                setEvents((prev) => [...prev, newEvent]);
                setIsCreateEventDialogOpen(false);
              }}
              className="space-y-4"
            >
              <Input name="title" placeholder="Event Title" required />
              <Textarea name="description" placeholder="Event Description" required />
              <div className="flex gap-4">
                <Input type="date" name="date" required />
                <Input type="time" name="time" required />
              </div>
              <Input name="location" placeholder="Location" required />
              <Input name="organizer" placeholder="Organizer Name" required />
              <Select name="tag">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a tag" />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Image Upload */}
              <div>
                <label className="block text-sm mb-1 font-medium text-white">Event Image (Optional)</label>
                <Input type="file" name="image" accept="image/*" />
              </div>

              <DialogFooter className="pt-4">
                <Button type="submit" className="bg-mmk-purple hover:bg-mmk-purple/90">
                  Create Event
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsCreateEventDialogOpen(false)}
                >
                  Cancel
                </Button>
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
                <span>{selectedEvent?.date}</span>
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

    </div>
  );
};

export default Events;

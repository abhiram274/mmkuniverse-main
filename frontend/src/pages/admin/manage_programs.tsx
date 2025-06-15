// ManagePrograms.tsx
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import Dashboard from "../Dashboard";
import { useNavigate } from "react-router-dom";
import { Label } from "@radix-ui/react-label";
import AttendeesModal from "@/components/AttendeesModal";

const PROGRAM_CATEGORIES = [
    "Tech",
    "Business",
    "Creative",
    "Health",
    "Language",
    "Lifestyle",
    "Other",
    "Marketing",
];

interface Program {
    id: number;
    title: string;
    description: string;
    image?: string;
    price: string;
    isFree: boolean;
    isCertified: boolean;
    isLive: boolean;
    duration: string;
    date: string;
    category: string;
    completed: boolean;
    attendance_limit?: number; // <-- updated
    start_date?: string;       // <-- updated
    end_date?: string;
    location?: string;
    email: string;
}


const isValidDate = (dateStr: unknown) =>
    typeof dateStr === "string" && !["", "null", "undefined"].includes(dateStr) && !isNaN(Date.parse(dateStr));




const ManagePrograms = () => {
    const [programs, setPrograms] = useState<Program[]>([]);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        isFree: false,
        isCertified: false,
        isLive: false,
        duration: "",
        date: "",
        startDate: "",
        endDate: "",
        category: "",
        image: null as File | null,
        limit: "",
        location: "",
        qrCodeImage: null as File | null, // <-- added
        email: "",
    });


    const [attendees, setAttendees] = useState([]);
    const [selectedProgramId, setSelectedProgramId] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [sendingType, setSendingType] = useState<null | 'joined' | 'participated'>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [certificateType, setCertificateType] = useState<null | 'joined' | 'participated'>(null);
  const [description, setDescription] = useState('');
  const [selectedProgram, setSelectedProgram] = useState(null); // 👈 store current event object




    const [editingId, setEditingId] = useState<number | null>(null);
    const [filterCategory, setFilterCategory] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const PROGRAMS_PER_PAGE = 5;
    const navigate = useNavigate();

    const formatDateInput = (isoDate: string) => {
        const date = new Date(isoDate);
        // Adjust to local timezone by correcting offset
        const tzOffsetInMs = date.getTimezoneOffset() * 60000;
        const localDate = new Date(date.getTime() - tzOffsetInMs);
        return localDate.toISOString().split("T")[0];
    };


    //Fetch attendees
    const fetchAttendees = async (programId: number) => {
        try {
            const res = await fetch(`https://mmkuniverse-main.onrender.com/programs/${programId}/attendees`);
            const data = await res.json();
            console.log("Fetched attendees:", data);

            
      const normalizedAttendees = (data.attendees || []).map(attendee => ({
        ...attendee,
        userId: attendee.user_id || null,
        guestEmail: attendee.guest_email || null,
      }));

            //  setAttendeesForEvent(data.attendees);
            // setAttendees(data.attendees || []);
            setAttendees(normalizedAttendees);
            setSelectedProgramId(programId);
            //setAttendees(data.attendees);
            setShowModal(true);
        } catch (err) {
            toast.error("Failed to fetch attendees");
        }
    };


    //Mark as participated
    const markAsParticipated = async (programId: number, userId: string | null, guestEmail: string | null) => {
        try {
            const res = await fetch(`https://mmkuniverse-main.onrender.com/programs/${programId}/mark-participation`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userId, guestEmail })
            });

            const data = await res.json();
            console.log(data);
            if (res.ok) {
                toast.success("Marked as participated");
                fetchAttendees(programId); // Refresh list
            } else {
                toast.error(data.error || "Failed to mark participation");
            }
        } catch (err) {
            toast.error("Failed to mark participation");
        }
    };






    const fetchPrograms = async () => {
        try {
            const res = await fetch("https://mmkuniverse-main.onrender.com/programs");
            const data = await res.json();
            setPrograms(data);
        } catch (err) {
            console.error("Error fetching programs:", err);
            toast.error("Failed to fetch programs");
        }
    };

    useEffect(() => {
        fetchPrograms();
    }, []);

    const handleSubmit = async () => {
        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (key === "image" && value) {
                    data.append("image", value as Blob);
                } else if (key === "qrCodeImage" && value) {
                    data.append("qrcode", value as Blob); // 🔥 Fix is here
                } else if (typeof value === "boolean") {
                    data.append(key, value ? "true" : "false");
                } else if (value !== null && value !== undefined) {
                    data.append(key, String(value));
                }
            });


            const endpoint = editingId
                ? `https://mmkuniverse-main.onrender.com/programs/${editingId}`
                : "https://mmkuniverse-main.onrender.com/programs";

            const method = editingId ? "PUT" : "POST";

            const res = await fetch(endpoint, {
                method,
                body: data,
            });

            if (res.ok) {
                toast.success(editingId ? "Program updated" : "Program created");
                setFormData({
                    title: "",
                    description: "",
                    price: "",
                    isFree: false,
                    isCertified: false,
                    isLive: false,
                    duration: "",
                    date: "",
                    startDate: "",
                    endDate: "",
                    category: "",
                    image: null,
                    limit: '',
                    location: '',
                    qrCodeImage: null,
                    email: ''
                });
                setEditingId(null);
                fetchPrograms();
            } else {
                const errorData = await res.json();
                toast.error(`Failed to submit: ${errorData.error}`);
            }

            navigate("/manage_programs")
        } catch (err) {
            console.error(err);
            toast.error("Submission failed");
        }
    };

    const handleEdit = (program: Program) => {
        setEditingId(program.id);
        setFormData({
            title: program.title,
            description: program.description,
            price: program.price,
            isFree: program.isFree,
            isCertified: program.isCertified,
            isLive: program.isLive,
            duration: program.duration,
            date: formatDateInput(program.date),
            startDate: program.start_date ? formatDateInput(program.start_date) : "",
            endDate: program.end_date ? formatDateInput(program.end_date) : "",

            category: program.category,
            image: null,
            limit: program.attendance_limit?.toString() || "",
            location: program.location,
            qrCodeImage: null,
            email: program.email,
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };




    const handleComplete = async (id: number) => {
        try {
            const res = await fetch(`https://mmkuniverse-main.onrender.com/programs/${id}/complete`, {
                method: "PUT",
            });
            if (res.ok) {
                toast.success("program marked as completed");
                fetchPrograms();
            } else {
                toast.error("Failed to complete program");
            }
        } catch (err) {
            console.error("Error completing program:", err);
            toast.error("Error completing program");
        }
    };



    const handleDelete = async (id: number) => {
        try {
            const res = await fetch(`https://mmkuniverse-main.onrender.com/programs/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                toast.success("Program deleted");
                fetchPrograms();
            } else {
                toast.error("Failed to delete program");
            }
        } catch (err) {
            console.error(err);
            toast.error("Error deleting program");
        }
    };

    const filteredPrograms = filterCategory === "all"
        ? programs
        : programs.filter((p) => p.category === filterCategory);

    const paginatedPrograms = filteredPrograms.slice(
        (currentPage - 1) * PROGRAMS_PER_PAGE,
        currentPage * PROGRAMS_PER_PAGE
    );

    const totalPages = Math.ceil(filteredPrograms.length / PROGRAMS_PER_PAGE);

    return (
        <div className="flex h-screen">
            <div className="w-64 bg-gray-900 text-white overflow-auto">
                <Dashboard />
            </div>

            <main className="flex-1 overflow-auto p-8 bg-gray-800 text-white">
                <h1 className="text-2xl font-bold mb-6">Admin - Manage Programs</h1>

                <div className="grid md:grid-cols-2 gap-6 mb-10">
                    <Card className="bg-secondary/20 border-white/10">
                        <CardHeader>
                            <CardTitle>{editingId ? "Edit Program" : "Create New Program"}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">

                            <div>
                                <label className="block text-sm font-medium text-gray-300">Event Title</label>

                                <Input placeholder="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                            </div>

                            <div>
                                <label className="block text-gray-300 text-sm font-medium ">Description</label>

                                <Textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                            </div>


                            <div>
                                <label className="block text-gray-300 text-sm font-medium ">Price</label>

                                <Input placeholder="Price" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                            </div>



                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="startDate" > Registrations From</Label>
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
                                    <Label htmlFor="endDate"> To</Label>
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




                            <div>
                                <Label htmlFor="date"> Program Starts From</Label>

                                <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                            </div>



                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-300">Duration</label>

                                <Input placeholder="Duration (e.g. 4 weeks)" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} />

                            </div>


                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-300">Location</label>

                                <Input
                                    placeholder="Location"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>


                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-300">Mail</label>

                                <Input
                                    placeholder="Your Mail"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>




                            <div className="flex gap-4">
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" checked={formData.isFree} onChange={(e) => setFormData({ ...formData, isFree: e.target.checked })} />
                                    Free
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" checked={formData.isCertified} onChange={(e) => setFormData({ ...formData, isCertified: e.target.checked })} />
                                    Certified
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" checked={formData.isLive} onChange={(e) => setFormData({ ...formData, isLive: e.target.checked })} />
                                    Live
                                </label>
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

                            <div>
                                <label className="block text-sm font-medium text-gray-300">Category</label>

                                <Select onValueChange={(val) => setFormData({ ...formData, category: val })} value={formData.category}>
                                    <SelectTrigger className="bg-transparent border-white/20">
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PROGRAM_CATEGORIES.map((cat) => (
                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>


                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-300">Program Image </label>

                                <Input type="file" accept="image/*" onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })} />
                            </div>

                            <div>


                                <Label className="block text-sm font-medium text-gray-300" htmlFor="qrCodeImage" style={{ marginTop: "20px" }}>QR Code Image</Label>
                                <Input
                                    className="bg-[#2e2e48] text-white border border-white/30 file:bg-mmk-purple file:text-white file:rounded file:border-0"
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
                                {editingId ? "Update Program" : "Submit Program"}
                            </Button>
                        </CardFooter>
                    </Card>

                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">Existing Programs</h2>
                            <Select value={filterCategory} onValueChange={(val) => setFilterCategory(val)}>
                                <SelectTrigger className="w-40 bg-gray-700 border-white/20">
                                    <SelectValue placeholder="Filter by category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    {PROGRAM_CATEGORIES.map((cat) => (
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
                                        <th className="px-4 py-2">Price</th>
                                        <th className="px-4 py-2">Category</th>
                                        <th className="px-4 py-2">Actions</th>
                                        <th className="px-4 py-2">View Attendees</th>
                                        <th className="px-4 py-2">Export Excel</th>
                                        <th className="px-4 py-2">Send Certificate</th>
                                        <th className="px-4 py-2">Send Certficate</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedPrograms.map((program) => (
                                        <tr key={program.id} className="border-t border-white/10">
                                            <td className="px-4 py-2">{program.title}</td>
                                            <td className="px-4 py-2">{program.date}</td>
                                            <td className="px-4 py-2">{program.isFree ? "Free" : `$${program.price}`}</td>
                                            <td className="px-4 py-2">{program.category}</td>
                                            <td className="px-4 py-2">
                                                <div className="flex gap-2">


                                                    {program.completed ? (

                                                        <Button disabled className="bg-blue-600 text-xs px-3 py-1 cursor-not-allowed">Edit</Button>
                                                    ) : (
                                                        <Button onClick={() => handleEdit(program)} className="bg-blue-600 text-xs px-3 py-1">Edit</Button>
                                                    )}





                                                    {program.completed ? (

                                                        <Button disabled className="bg-red-600 text-xs px-3 py-1 cursor-not-allowed">Delete</Button>
                                                    ) : (
                                                        <Button onClick={() => handleDelete(program.id)} className="bg-red-600 text-xs px-3 py-1">Delete</Button>
                                                    )}




                                                    {program.completed ? (

                                                        <Button disabled className="bg-green-500 text-xs px-3 py-1 cursor-not-allowed">Completed</Button>
                                                    ) : (
                                                        <Button onClick={() => handleComplete(program.id)} className="bg-green-600 text-xs px-3 py-1">Complete</Button>
                                                    )}



                                                </div>
                                            </td>

                                            <td className="px-4 py-2">


                                                <Button className="bg-gray-700 text-xs px-3 py-1" onClick={() => fetchAttendees(program.id)}>View Attendees</Button>
                                                {showModal && (
                                                    <AttendeesModal
                                                        attendees={attendees}
                                                        onClose={() => setShowModal(false)}
                                                        onMarkParticipated={(userId, guestEmail) =>
                                                            markAsParticipated(selectedProgramId, userId, guestEmail)
                                                        }
                                                    />
                                                )}
                                
                                            </td>

                                            <td className="px-4 py-2">
                                                <Button
                                                    className="bg-yellow-500 text-xs px-3 py-1"
                                                    onClick={() => window.open(`https://mmkuniverse-main.onrender.com/programs/${program.id}/export-excel`, "_blank")}
                                                >
                                                    Export Excel
                                                </Button>


                                            </td>



  <td className="px-4 py-2">
                          <Button
     className="bg-purple-700 text-xs px-3 py-1"
                          onClick={() => {
                            setCertificateType('joined');
                            setSelectedProgram(program); // 👈 store selected event for modal use
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
                            setSelectedProgram(program); // 👈 store selected event
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


            {openDialog && selectedProgram && (
              <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-zinc-900 text-zinc-100 p-6 rounded-2xl w-full max-w-md shadow-2xl border border-zinc-700">
                  <h2 className="text-xl font-semibold mb-4">Send Certificate</h2>
                  <p className="text-sm mb-6">
                    You're sending to: <span className="text-indigo-400 font-medium">{certificateType}</span> for{' '}
                    <span className="text-indigo-400 font-medium">{selectedProgram.title}</span>
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
                        setSelectedProgram(null);
                      }}
                    >
                      Cancel
                    </button>

                    <button
                      className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition"
                      onClick={() => {
                        setSendingType(certificateType);
                        setOpenDialog(false);

                        fetch(`https://mmkuniverse-main.onrender.com/programs/send-certificates/${selectedProgram.id}?type=${certificateType}`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            description,
                            eventName: selectedProgram.title,
                          }),
                        })
                          .then((res) => res.json())
                          .then((data) => toast.success(data.message))
                          .catch(() => toast.error('Failed to send certificates'))
                          .finally(() => {
                            setSendingType(null);
                            setDescription('');
                            setCertificateType(null);
                            setSelectedProgram(null);
                          });
                      }}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            )}








                        <div className="flex justify-end gap-2 mt-4">
                            <Button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="bg-gray-600 px-3 py-1">Prev</Button>
                            <span className="self-center text-sm">Page {currentPage} of {totalPages}</span>
                            <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} className="bg-gray-600 px-3 py-1">Next

                            </Button>
                        </div>
                    </div>
                </div>



            </main>
        </div>
    );
};

export default ManagePrograms;

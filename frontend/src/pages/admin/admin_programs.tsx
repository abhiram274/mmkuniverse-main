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

const PROGRAM_CATEGORIES = [
  "Tech",
  "Business",
  "Creative",
  "Health",
  "Language",
  "Lifestyle",
  "Other",
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
}

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
    category: "",
    image: null as File | null,
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const PROGRAMS_PER_PAGE = 5;
  const navigate = useNavigate();

  const formatDateInput = (isoDate: string) => isoDate.split("T")[0];

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
          data.append(key, value as Blob);
        } else {
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
          category: "",
          image: null,
        });
        setEditingId(null);
        fetchPrograms();
      } else {
        const errorData = await res.json();
        toast.error(`Failed to submit: ${errorData.error}`);
      }
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
      category: program.category,
      image: null,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
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
              <Input placeholder="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
              <Textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              <Input placeholder="Price" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
              <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
              <Input placeholder="Duration (e.g. 4 weeks)" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} />

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

              <input type="file" accept="image/*" onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })} />
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
                  </tr>
                </thead>
                <tbody>
                  {paginatedPrograms.map((program) => (
                    <tr key={program.id} className="border-t border-white/10">
                      <td className="px-4 py-2">{program.title}</td>
                      <td className="px-4 py-2">{program.date}</td>
                      <td className="px-4 py-2">{program.isFree ? "Free" : `$${program.price}`}</td>
                      <td className="px-4 py-2">{program.category}</td>
                      <td className="px-4 py-2 space-x-2">
                        <Button onClick={() => handleEdit(program)} className="bg-blue-600 text-xs px-3 py-1">Edit</Button>
                        <Button onClick={() => handleDelete(program.id)} className="bg-red-600 text-xs px-3 py-1">Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="bg-gray-600 px-3 py-1">Prev</Button>
              <span className="self-center text-sm">Page {currentPage} of {totalPages}</span>
              <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} className="bg-gray-600 px-3 py-1">Next</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManagePrograms;

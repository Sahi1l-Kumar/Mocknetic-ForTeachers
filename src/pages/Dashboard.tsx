import { useState, useEffect } from "react";
import type { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { api } from "@/lib/api";
import { toast } from "sonner";
import {
  Plus,
  Users,
  Loader2,
  GraduationCap,
  MoreVertical,
  Trash2,
  Settings,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ClassroomData {
  _id: string;
  name: string;
  description?: string;
  code: string;
  teacherId: string;
  subject?: string;
  isActive: boolean;
  studentCount: number;
  createdAt: string;
  updatedAt: string;
}

const CARD_COLORS = [
  { header: "from-blue-600 to-blue-700", pattern: "bg-blue-800/10" },
  { header: "from-emerald-600 to-emerald-700", pattern: "bg-emerald-800/10" },
  { header: "from-purple-600 to-purple-700", pattern: "bg-purple-800/10" },
  { header: "from-rose-600 to-rose-700", pattern: "bg-rose-800/10" },
  { header: "from-amber-600 to-amber-700", pattern: "bg-amber-800/10" },
  { header: "from-indigo-600 to-indigo-700", pattern: "bg-indigo-800/10" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [classrooms, setClassrooms] = useState<ClassroomData[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    subject: "",
  });

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    try {
      setLoading(true);
      const response = await api.classroom.getAll();

      console.log("Classrooms response:", response.data);

      if (response.data.success && response.data.data) {
        setClassrooms(response.data.data);
      }
    } catch (error: any) {
      console.error("Error fetching classrooms:", error);
      toast.error(
        error?.response?.data?.error?.message || "Failed to load classrooms"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClassroom = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Classroom name is required");
      return;
    }

    setCreating(true);

    try {
      const response = await api.classroom.create({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        subject: formData.subject.trim() || undefined,
      });

      if (response.data.success) {
        toast.success("Classroom created successfully");
        setCreateDialogOpen(false);
        setFormData({ name: "", description: "", subject: "" });
        fetchClassrooms();
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error?.message || "Failed to create classroom"
      );
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteClassroom = async (
    id: string,
    name: string,
    e: MouseEvent
  ) => {
    e.stopPropagation();

    if (
      !confirm(
        `Are you sure you want to delete "${name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const response = await api.classroom.delete(id);
      if (response.data.success) {
        toast.success("Classroom deleted successfully");
        fetchClassrooms();
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error?.message || "Failed to delete classroom"
      );
    }
  };

  const copyClassCode = (code: string, e: MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success("Class code copied to clipboard");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Classrooms</h1>
            <p className="text-gray-600 mt-1">
              Manage your classrooms and assessments
            </p>
          </div>

          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Classroom
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleCreateClassroom}>
                <DialogHeader>
                  <DialogTitle>Create New Classroom</DialogTitle>
                  <DialogDescription>
                    Set up a new classroom for your students
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Classroom Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="e.g., Mathematics Grade 10"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="e.g., Mathematics"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Brief description of the classroom"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCreateDialogOpen(false)}
                    disabled={creating}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={creating}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {creating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Classroom"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {classrooms.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No classrooms yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first classroom to get started
              </p>
              <Button
                onClick={() => setCreateDialogOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Classroom
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {classrooms.map((classroom, index) => {
              const colorScheme = CARD_COLORS[index % CARD_COLORS.length];
              return (
                <Card
                  key={classroom._id}
                  className="relative overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                  onClick={() => navigate(`/classroom/${classroom._id}`)}
                >
                  <div
                    className={`relative h-28 bg-linear-to-br ${colorScheme.header} p-4 overflow-hidden`}
                  >
                    <div
                      className={`absolute inset-0 ${colorScheme.pattern} opacity-20`}
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-1/2 translate-x-1/2 border-8 border-white/20" />
                      <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full translate-y-1/2 -translate-x-1/2 border-8 border-white/20" />
                    </div>
                    <div className="relative">
                      <h3 className="text-white font-semibold text-lg line-clamp-2">
                        {classroom.name}
                      </h3>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-white rounded-full transition-colors z-10">
                        <MoreVertical className="w-4 h-4 text-gray-700" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/classroom/${classroom._id}`);
                        }}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Manage
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) =>
                          handleDeleteClassroom(
                            classroom._id,
                            classroom.name,
                            e
                          )
                        }
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <CardContent className="p-4">
                    {classroom.subject && (
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        {classroom.subject}
                      </p>
                    )}
                    {classroom.description && (
                      <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                        {classroom.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{classroom.studentCount} students</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs font-mono hover:bg-gray-100"
                        onClick={(e) => copyClassCode(classroom.code, e)}
                      >
                        {classroom.code}
                        {copiedCode === classroom.code ? (
                          <Check className="w-3 h-3 ml-1 text-green-600" />
                        ) : (
                          <Copy className="w-3 h-3 ml-1" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

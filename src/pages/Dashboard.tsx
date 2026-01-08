import { useState } from "react";
import type { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { toast } from "sonner";
import { Plus, Users, FileText, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Classroom {
  id: string;
  name: string;
  classCode: string;
  studentCount: number;
  assessmentCount: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [classroomName, setClassroomName] = useState("");

  const [classrooms, setClassrooms] = useState<Classroom[]>([
    {
      id: "1",
      name: "Computer Science 101",
      classCode: "CS101ABC",
      studentCount: 32,
      assessmentCount: 5,
    },
    {
      id: "2",
      name: "Data Structures",
      classCode: "DS202XYZ",
      studentCount: 28,
      assessmentCount: 3,
    },
    {
      id: "3",
      name: "Web Development",
      classCode: "WD303DEF",
      studentCount: 45,
      assessmentCount: 7,
    },
  ]);

  const generateClassCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCreateClassroom = () => {
    if (!classroomName.trim()) {
      toast.error("Error", {
        description: "Please enter a classroom name",
      });
      return;
    }

    const newClassroom: Classroom = {
      id: String(classrooms.length + 1),
      name: classroomName,
      classCode: generateClassCode(),
      studentCount: 0,
      assessmentCount: 0,
    };

    setClassrooms([...classrooms, newClassroom]);
    setClassroomName("");
    setIsDialogOpen(false);

    toast.success("Classroom created", {
      description: `${classroomName} has been created successfully`,
    });
  };

  const copyClassCode = (code: string, e: MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    toast.success("Copied!", {
      description: "Class code copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Classrooms</h1>
            <p className="text-gray-600 mt-1">
              Manage your classes and assessments
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Create Class
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Class</DialogTitle>
                <DialogDescription>
                  Enter a name for your new classroom. A unique class code will
                  be generated automatically.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="classroom-name">Classroom Name</Label>
                  <Input
                    id="classroom-name"
                    placeholder="e.g., Computer Science 101"
                    value={classroomName}
                    onChange={(e) => setClassroomName(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateClassroom}>
                  Create Classroom
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classrooms.map((classroom) => (
            <Card
              key={classroom.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/classroom/${classroom.id}`)}
            >
              <CardHeader>
                <CardTitle>{classroom.name}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <span>Class Code: {classroom.classCode}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => copyClassCode(classroom.classCode, e)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="mr-2 h-4 w-4" />
                    <span>{classroom.studentCount} Students</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FileText className="mr-2 h-4 w-4" />
                    <span>{classroom.assessmentCount} Assessments</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

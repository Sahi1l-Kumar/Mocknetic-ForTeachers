import { useState } from "react";
import { Plus } from "lucide-react";
import Navbar from "../components/Navbar";
import ClassCard from "../components/ClassCard";
import CreateClassroomModal from "../components/CreateClassroomModal";
import Card from "../components/Card";
import Button from "../components/Button";

interface Classroom {
  id: string;
  name: string;
  section: string;
  subject: string;
  studentCount: number;
  assessmentCount: number;
  quizCount: number;
  code: string;
}

const mockClassrooms: Classroom[] = [
  {
    id: "1",
    name: "Data Structures & Algorithms",
    section: "Section A",
    subject: "Computer Science",
    studentCount: 28,
    assessmentCount: 5,
    quizCount: 3,
    code: "DSA101",
  },
  {
    id: "2",
    name: "Web Development Fundamentals",
    section: "Section B",
    subject: "Web Development",
    studentCount: 35,
    assessmentCount: 7,
    quizCount: 4,
    code: "WEB201",
  },
  {
    id: "3",
    name: "Machine Learning Basics",
    section: "Section C",
    subject: "Artificial Intelligence",
    studentCount: 22,
    assessmentCount: 4,
    quizCount: 2,
    code: "ML301",
  },
];

export default function Dashboard() {
  const [classrooms, setClassrooms] = useState<Classroom[]>(mockClassrooms);
  const [modalOpen, setModalOpen] = useState(false);

  const handleCreateClassroom = (data: {
    name: string;
    section: string;
    subject: string;
  }) => {
    const newClassroom: Classroom = {
      id: String(classrooms.length + 1),
      ...data,
      studentCount: 0,
      assessmentCount: 0,
      quizCount: 0,
      code: `${data.subject.toUpperCase().slice(0, 3)}${
        classrooms.length + 1
      }01`,
    };
    setClassrooms([...classrooms, newClassroom]);
    setModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold text-gray-900">
                  Your Classes
                </h1>
                <p className="text-gray-600 mt-2">
                  Manage your classrooms and assessments
                </p>
              </div>
              <Button onClick={() => setModalOpen(true)} size="lg">
                <Plus className="w-5 h-5" />
                Create Class
              </Button>
            </div>

            {classrooms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classrooms.map((classroom) => (
                  <ClassCard
                    key={classroom.id}
                    id={classroom.id}
                    name={classroom.name}
                    section={classroom.section}
                    subject={classroom.subject}
                    studentCount={classroom.studentCount}
                    assessmentCount={classroom.assessmentCount}
                    quizCount={classroom.quizCount}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Plus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  No classes yet
                </h2>
                <p className="text-gray-600 mb-6">
                  Create your first classroom to get started
                </p>
                <Button onClick={() => setModalOpen(true)} size="lg">
                  <Plus className="w-5 h-5" />
                  Create Class
                </Button>
              </Card>
            )}
          </div>
        </main>
      </div>

      <CreateClassroomModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreateClassroom}
      />
    </div>
  );
}

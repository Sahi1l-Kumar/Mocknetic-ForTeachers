import { useState } from "react";
import {
  Plus,
  Users,
  FileText,
  Copy,
  Check,
  BookOpen,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import CreateClassroomModal from "../components/CreateClassroomModal";
import ClassroomDetails from "../components/ClassroomDetails";

interface Classroom {
  id: string;
  name: string;
  code: string;
  subject: string;
  studentCount: number;
  assessmentCount: number;
  createdAt: string;
}

interface DashboardProps {
  onBack: () => void;
}

function Dashboard({ onBack }: DashboardProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(
    null
  );
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const [classrooms] = useState<Classroom[]>([
    {
      id: "1",
      name: "Advanced Web Development",
      code: "WEB-2024-A1",
      subject: "Computer Science",
      studentCount: 24,
      assessmentCount: 8,
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      name: "Data Structures & Algorithms",
      code: "DSA-2024-B2",
      subject: "Computer Science",
      studentCount: 32,
      assessmentCount: 12,
      createdAt: "2024-01-10",
    },
    {
      id: "3",
      name: "System Design Fundamentals",
      code: "SYS-2024-C3",
      subject: "Software Engineering",
      studentCount: 18,
      assessmentCount: 6,
      createdAt: "2024-02-01",
    },
  ]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (selectedClassroom) {
    return (
      <ClassroomDetails
        classroom={selectedClassroom}
        onBack={() => setSelectedClassroom(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Classroom Hub
              </h1>
              <p className="text-sm text-slate-600">Teacher View</p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create Classroom</span>
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            My Classrooms
          </h2>
          <p className="text-slate-600">
            Manage your classes and create assessments
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classrooms.map((classroom) => (
            <div
              key={classroom.id}
              className="bg-white rounded-xl border-2 border-slate-200 hover:border-blue-400 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer"
              onClick={() => setSelectedClassroom(classroom)}
            >
              <div className="bg-linear-to-br from-blue-600 to-blue-700 p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <BookOpen className="w-8 h-8 text-white" />
                    <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold">
                      {classroom.subject}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {classroom.name}
                  </h3>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <div className="flex items-center justify-between bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-slate-600">
                        Class Code:
                      </span>
                      <span className="font-mono font-bold text-slate-900">
                        {classroom.code}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyCode(classroom.code);
                      }}
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      {copiedCode === classroom.code ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <div className="flex items-center space-x-2 mb-1">
                      <Users className="w-4 h-4 text-slate-600" />
                      <span className="text-xs text-slate-600">Students</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">
                      {classroom.studentCount}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <div className="flex items-center space-x-2 mb-1">
                      <FileText className="w-4 h-4 text-slate-600" />
                      <span className="text-xs text-slate-600">
                        Assessments
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">
                      {classroom.assessmentCount}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-sm text-slate-500">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Created {new Date(classroom.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {showCreateModal && (
        <CreateClassroomModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}

export default Dashboard;

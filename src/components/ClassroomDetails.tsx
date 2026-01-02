import { useState } from "react";
import {
  ArrowLeft,
  Plus,
  Users,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import CreateAssessmentModal from "./CreateAssessmentModal";

interface Classroom {
  id: string;
  name: string;
  code: string;
  subject: string;
  studentCount: number;
  assessmentCount: number;
}

interface Assessment {
  id: string;
  title: string;
  description: string;
  status: "draft" | "active" | "completed";
  dueDate: string;
  duration: number;
  participants: number;
  totalStudents: number;
  type: "file" | "text";
}

interface ClassroomDetailsProps {
  classroom: Classroom;
  onBack: () => void;
}

function ClassroomDetails({ classroom, onBack }: ClassroomDetailsProps) {
  const [activeTab, setActiveTab] = useState<"assessments" | "students">(
    "assessments"
  );
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [assessments] = useState<Assessment[]>([
    {
      id: "1",
      title: "React Hooks & State Management",
      description: "Assessment covering useState, useEffect, and Context API",
      status: "active",
      dueDate: "2024-03-15",
      duration: 45,
      participants: 18,
      totalStudents: 24,
      type: "file",
    },
    {
      id: "2",
      title: "Component Lifecycle & Performance",
      description:
        "Understanding React component lifecycle and optimization techniques",
      status: "active",
      dueDate: "2024-03-20",
      duration: 60,
      participants: 12,
      totalStudents: 24,
      type: "text",
    },
    {
      id: "3",
      title: "TypeScript Fundamentals",
      description: "Basic types, interfaces, and generics in TypeScript",
      status: "completed",
      dueDate: "2024-03-01",
      duration: 30,
      participants: 24,
      totalStudents: 24,
      type: "file",
    },
  ]);

  const [students] = useState([
    {
      id: "1",
      name: "Emma Wilson",
      email: "emma.wilson@example.com",
      joinedAt: "2024-01-15",
      completedAssessments: 7,
    },
    {
      id: "2",
      name: "James Chen",
      email: "james.chen@example.com",
      joinedAt: "2024-01-16",
      completedAssessments: 8,
    },
    {
      id: "3",
      name: "Sofia Rodriguez",
      email: "sofia.r@example.com",
      joinedAt: "2024-01-16",
      completedAssessments: 7,
    },
    {
      id: "4",
      name: "Marcus Johnson",
      email: "marcus.j@example.com",
      joinedAt: "2024-01-17",
      completedAssessments: 6,
    },
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center space-x-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
            <CheckCircle className="w-3 h-3" />
            <span>Active</span>
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center space-x-1 bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold">
            <CheckCircle className="w-3 h-3" />
            <span>Completed</span>
          </span>
        );
      case "draft":
        return (
          <span className="inline-flex items-center space-x-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">
            <AlertCircle className="w-3 h-3" />
            <span>Draft</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Classrooms</span>
          </button>

          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-slate-900">
                  {classroom.name}
                </h1>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
                  {classroom.code}
                </span>
              </div>
              <p className="text-slate-600">{classroom.subject}</p>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Create Assessment</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-blue-100 rounded-lg p-2">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm text-slate-600 font-medium">
                Total Students
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {classroom.studentCount}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-green-100 rounded-lg p-2">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm text-slate-600 font-medium">
                Active Assessments
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {assessments.filter((a) => a.status === "active").length}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-purple-100 rounded-lg p-2">
                <CheckCircle className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-sm text-slate-600 font-medium">
                Completion Rate
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {Math.round(
                (assessments.filter((a) => a.status === "completed").length /
                  assessments.length) *
                  100
              )}
              %
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="border-b border-slate-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab("assessments")}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === "assessments"
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Assessments
              </button>
              <button
                onClick={() => setActiveTab("students")}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === "students"
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Students
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === "assessments" && (
              <div className="space-y-4">
                {assessments.map((assessment) => (
                  <div
                    key={assessment.id}
                    className="border border-slate-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold text-slate-900">
                            {assessment.title}
                          </h3>
                          {getStatusBadge(assessment.status)}
                          <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-semibold uppercase">
                            {assessment.type}
                          </span>
                        </div>
                        <p className="text-slate-600">
                          {assessment.description}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                        <div className="flex items-center space-x-2 mb-1">
                          <Clock className="w-4 h-4 text-slate-600" />
                          <span className="text-xs text-slate-600 font-medium">
                            Duration
                          </span>
                        </div>
                        <p className="text-lg font-bold text-slate-900">
                          {assessment.duration} min
                        </p>
                      </div>

                      <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                        <div className="flex items-center space-x-2 mb-1">
                          <Users className="w-4 h-4 text-slate-600" />
                          <span className="text-xs text-slate-600 font-medium">
                            Participation
                          </span>
                        </div>
                        <p className="text-lg font-bold text-slate-900">
                          {assessment.participants}/{assessment.totalStudents}
                        </p>
                      </div>

                      <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                        <div className="flex items-center space-x-2 mb-1">
                          <FileText className="w-4 h-4 text-slate-600" />
                          <span className="text-xs text-slate-600 font-medium">
                            Due Date
                          </span>
                        </div>
                        <p className="text-sm font-bold text-slate-900">
                          {new Date(assessment.dueDate).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                        <div className="flex items-center space-x-2 mb-1">
                          <CheckCircle className="w-4 h-4 text-slate-600" />
                          <span className="text-xs text-slate-600 font-medium">
                            Progress
                          </span>
                        </div>
                        <p className="text-lg font-bold text-slate-900">
                          {Math.round(
                            (assessment.participants /
                              assessment.totalStudents) *
                              100
                          )}
                          %
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "students" && (
              <div className="space-y-3">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between border border-slate-200 rounded-lg p-5 hover:border-blue-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-linear-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">
                          {student.name}
                        </h4>
                        <p className="text-sm text-slate-600">
                          {student.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-8">
                      <div className="text-right">
                        <p className="text-sm text-slate-600 mb-1">
                          Completed Assessments
                        </p>
                        <p className="text-2xl font-bold text-slate-900">
                          {student.completedAssessments}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-600 mb-1">Joined</p>
                        <p className="text-sm font-semibold text-slate-900">
                          {new Date(student.joinedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {showCreateModal && (
        <CreateAssessmentModal
          classroomId={classroom.id}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
}

export default ClassroomDetails;

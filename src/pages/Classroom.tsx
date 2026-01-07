import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, FileText, HelpCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import ClassroomDetails from "../components/ClassroomDetails";
import Card from "../components/Card";
import Button from "../components/Button";

interface Assessment {
  id: string;
  title: string;
  topic: string;
  questionCount: number;
  difficulty: string;
  createdDate: string;
}

interface Quiz {
  id: string;
  title: string;
  topic: string;
  questionCount: number;
  timeLimit: number;
  createdDate: string;
}

const mockAssessments: Assessment[] = [
  {
    id: "a1",
    title: "Array & Linked List Fundamentals",
    topic: "Data Structures",
    questionCount: 15,
    difficulty: "Medium",
    createdDate: "2024-01-15",
  },
  {
    id: "a2",
    title: "Graph Traversal Methods",
    topic: "Algorithms",
    questionCount: 12,
    difficulty: "Hard",
    createdDate: "2024-01-20",
  },
];

const mockQuizzes: Quiz[] = [
  {
    id: "q1",
    title: "Quick Recap: Sorting Algorithms",
    topic: "Algorithms",
    questionCount: 10,
    timeLimit: 30,
    createdDate: "2024-01-10",
  },
  {
    id: "q2",
    title: "Practice: String Operations",
    topic: "Data Structures",
    questionCount: 8,
    timeLimit: 20,
    createdDate: "2024-01-18",
  },
];

const classroomData = {
  id: "1",
  name: "Data Structures & Algorithms",
  section: "Section A",
  subject: "Computer Science",
  studentCount: 28,
  assessmentCount: 2,
  quizCount: 2,
  code: "DSA101",
};

type TabType = "assessments" | "quizzes";

export default function Classroom() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("assessments");
  const [assessments] = useState<Assessment[]>(mockAssessments);
  const [quizzes] = useState<Quiz[]>(mockQuizzes);

  const tabs = [
    {
      id: "assessments" as TabType,
      label: "Assessments",
      icon: FileText,
      count: assessments.length,
    },
    {
      id: "quizzes" as TabType,
      label: "Quizzes",
      icon: HelpCircle,
      count: quizzes.length,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl">
            <ClassroomDetails {...classroomData} />

            <div className="border-b border-gray-200 bg-white rounded-t-lg -mx-6 lg:-mx-8 px-6 lg:px-8 mb-6">
              <div className="flex gap-1 -mb-px">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                    {tab.count > 0 && (
                      <span className="ml-1 px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {activeTab === "assessments" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Assessments
                  </h2>
                  <Button
                    onClick={() =>
                      navigate(`/classes/${classId}/assessments/new`)
                    }
                  >
                    <Plus className="w-5 h-5" />
                    Create Assessment
                  </Button>
                </div>

                {assessments.length > 0 ? (
                  <div className="space-y-4">
                    {assessments.map((assessment) => (
                      <Card key={assessment.id} hover className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {assessment.title}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                              <span className="font-medium text-blue-600">
                                {assessment.topic}
                              </span>
                              <span>{assessment.questionCount} questions</span>
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                                {assessment.difficulty}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">
                              Created on{" "}
                              {new Date(
                                assessment.createdDate
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button variant="secondary" size="sm">
                              Preview
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-12 text-center">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      No assessments yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Create your first assessment to get started
                    </p>
                    <Button
                      onClick={() =>
                        navigate(`/classes/${classId}/assessments/new`)
                      }
                    >
                      <Plus className="w-5 h-5" />
                      Create Assessment
                    </Button>
                  </Card>
                )}
              </div>
            )}

            {activeTab === "quizzes" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Quizzes</h2>
                  <Button
                    onClick={() => navigate(`/classes/${classId}/quizzes/new`)}
                  >
                    <Plus className="w-5 h-5" />
                    Create Quiz
                  </Button>
                </div>

                {quizzes.length > 0 ? (
                  <div className="space-y-4">
                    {quizzes.map((quiz) => (
                      <Card key={quiz.id} hover className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {quiz.title}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                              <span className="font-medium text-blue-600">
                                {quiz.topic}
                              </span>
                              <span>{quiz.questionCount} questions</span>
                              <span>{quiz.timeLimit} minutes</span>
                            </div>
                            <p className="text-xs text-gray-500">
                              Created on{" "}
                              {new Date(quiz.createdDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button variant="secondary" size="sm">
                              Preview
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-12 text-center">
                    <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      No quizzes yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Create your first quiz to get started
                    </p>
                    <Button
                      onClick={() =>
                        navigate(`/classes/${classId}/quizzes/new`)
                      }
                    >
                      <Plus className="w-5 h-5" />
                      Create Quiz
                    </Button>
                  </Card>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

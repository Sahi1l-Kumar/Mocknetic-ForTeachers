import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { toast } from "sonner";
import {
  ArrowLeft,
  Plus,
  Users,
  FileText,
  Copy,
  Eye,
  BarChart3,
  Award,
  CheckCircle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Student {
  id: string;
  name: string;
  email: string;
  enrolledDate: string;
  averageScore?: number;
  completedAssessments?: number;
}

interface Assessment {
  id: string;
  title: string;
  description: string;
  questionCount: number;
  createdDate: string;
  status: "draft" | "published";
  completedCount?: number;
  totalStudents?: number;
  averageScore?: number;
}

interface StudentResult {
  studentId: string;
  studentName: string;
  score: number;
  percentage: number;
  status: "completed" | "pending";
  submittedAt?: string;
}

const ClassroomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedAssessment, setSelectedAssessment] =
    useState<Assessment | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showResultsSheet, setShowResultsSheet] = useState(false);
  const [showStudentSheet, setShowStudentSheet] = useState(false);

  const [classroom] = useState({
    id: id,
    name: "Computer Science 101",
    classCode: "CS101ABC",
  });

  const [students] = useState<Student[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      enrolledDate: "2026-01-05",
      averageScore: 85,
      completedAssessments: 4,
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      enrolledDate: "2026-01-06",
      averageScore: 92,
      completedAssessments: 5,
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike@example.com",
      enrolledDate: "2026-01-07",
      averageScore: 78,
      completedAssessments: 3,
    },
  ]);

  const [assessments] = useState<Assessment[]>([
    {
      id: "1",
      title: "Mid-term Exam",
      description: "Covering chapters 1-5",
      questionCount: 50,
      createdDate: "2026-01-02",
      status: "published",
      completedCount: 30,
      totalStudents: 32,
      averageScore: 85.5,
    },
    {
      id: "2",
      title: "Quiz 1: Arrays",
      description: "Basic array operations and algorithms",
      questionCount: 20,
      createdDate: "2026-01-04",
      status: "draft",
      completedCount: 0,
      totalStudents: 32,
      averageScore: 0,
    },
  ]);

  // Mock results for selected assessment
  const [assessmentResults] = useState<StudentResult[]>([
    {
      studentId: "1",
      studentName: "John Doe",
      score: 85,
      percentage: 85,
      status: "completed",
      submittedAt: "2026-01-08T10:30:00",
    },
    {
      studentId: "2",
      studentName: "Jane Smith",
      score: 92,
      percentage: 92,
      status: "completed",
      submittedAt: "2026-01-08T11:15:00",
    },
    {
      studentId: "3",
      studentName: "Mike Johnson",
      score: 78,
      percentage: 78,
      status: "completed",
      submittedAt: "2026-01-08T09:45:00",
    },
  ]);

  const copyClassCode = () => {
    navigator.clipboard.writeText(classroom.classCode);
    toast.success("Copied!", {
      description: "Class code copied to clipboard",
    });
  };

  const handleViewResults = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    setShowResultsSheet(true);
  };

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setShowStudentSheet(true);
  };

  const handleViewDetailedResult = (studentId: string) => {
    navigate(`/assessment/${selectedAssessment?.id}/result/${studentId}`);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />

      <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <Button
          variant="ghost"
          className="mb-4"
          size="sm"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Back to Dashboard</span>
          <span className="sm:hidden">Back</span>
        </Button>

        {/* Mobile-optimized header */}
        <div className="mb-4 sm:mb-6 bg-white p-4 sm:p-6 rounded-lg border shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {classroom.name}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs sm:text-sm text-gray-600">Code:</span>
                <span className="font-mono text-xs sm:text-sm bg-slate-100 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md border">
                  {classroom.classCode}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 sm:h-8 sm:w-8"
                  onClick={copyClassCode}
                >
                  <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>

            {/* Quick Stats - Mobile friendly */}
            <div className="grid grid-cols-2 sm:flex gap-3 sm:gap-4 text-center">
              <div className="bg-blue-50 p-3 rounded-lg">
                <Users className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {students.length}
                </p>
                <p className="text-xs text-gray-600">Students</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <FileText className="h-5 w-5 mx-auto text-purple-600 mb-1" />
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {assessments.length}
                </p>
                <p className="text-xs text-gray-600">Assessments</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-optimized tabs */}
        <Tabs defaultValue="assessments" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 h-auto">
            <TabsTrigger
              value="assessments"
              className="flex items-center gap-2 py-3"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Assessments</span>
              <span className="sm:hidden">Tests</span>
            </TabsTrigger>
            <TabsTrigger
              value="students"
              className="flex items-center gap-2 py-3"
            >
              <Users className="h-4 w-4" />
              Students
            </TabsTrigger>
          </TabsList>

          {/* Assessments Tab */}
          <TabsContent value="assessments" className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold">
                  Assessments
                </h2>
                <p className="text-xs sm:text-sm text-gray-600">
                  Manage your classroom assessments
                </p>
              </div>
              <Button
                onClick={() => navigate(`/classroom/${id}/create-assessment`)}
                size="sm"
                className="w-full sm:w-auto"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Assessment
              </Button>
            </div>

            {/* Mobile-friendly assessment cards */}
            <div className="grid gap-3 sm:gap-4">
              {assessments.map((assessment) => (
                <Card
                  key={assessment.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base sm:text-lg truncate">
                          {assessment.title}
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm line-clamp-1">
                          {assessment.description}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={
                          assessment.status === "published"
                            ? "default"
                            : "secondary"
                        }
                        className="shrink-0"
                      >
                        {assessment.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Stats Grid - Mobile optimized */}
                    {assessment.status === "published" && (
                      <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center bg-slate-50 p-2 sm:p-3 rounded-lg">
                        <div>
                          <p className="text-lg sm:text-xl font-bold text-primary">
                            {assessment.averageScore}%
                          </p>
                          <p className="text-xs text-gray-600">Avg Score</p>
                        </div>
                        <div>
                          <p className="text-lg sm:text-xl font-bold">
                            {assessment.completedCount}
                          </p>
                          <p className="text-xs text-gray-600">Completed</p>
                        </div>
                        <div>
                          <p className="text-lg sm:text-xl font-bold">
                            {assessment.questionCount}
                          </p>
                          <p className="text-xs text-gray-600">Questions</p>
                        </div>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      {assessment.status === "published" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewResults(assessment)}
                          className="w-full sm:w-auto"
                        >
                          <BarChart3 className="mr-2 h-4 w-4" />
                          View Results
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full sm:w-auto"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-4">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold">
                Enrolled Students ({students.length})
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">
                View student performance
              </p>
            </div>

            {/* Mobile-friendly student cards */}
            <div className="grid gap-3">
              {students.map((student) => (
                <Card
                  key={student.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleViewStudent(student)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm sm:text-base truncate">
                          {student.name}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 truncate">
                          {student.email}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                        <div className="text-right">
                          <p className="text-lg sm:text-xl font-bold text-primary">
                            {student.averageScore}%
                          </p>
                          <p className="text-xs text-gray-600 whitespace-nowrap">
                            {student.completedAssessments} tests
                          </p>
                        </div>
                        <Eye className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Assessment Results Sheet - Mobile friendly */}
      <Sheet open={showResultsSheet} onOpenChange={setShowResultsSheet}>
        <SheetContent side="right" className="w-full sm:max-w-2xl p-0">
          <ScrollArea className="h-full">
            <div className="p-4 sm:p-6">
              <SheetHeader className="mb-4">
                <SheetTitle className="text-xl sm:text-2xl">
                  {selectedAssessment?.title}
                </SheetTitle>
                <SheetDescription>
                  Student results and performance metrics
                </SheetDescription>
              </SheetHeader>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <Card>
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xl sm:text-2xl font-bold">
                          {selectedAssessment?.averageScore}%
                        </p>
                        <p className="text-xs text-gray-600">Avg Score</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-xl sm:text-2xl font-bold">
                          {selectedAssessment?.completedCount}
                        </p>
                        <p className="text-xs text-gray-600">Completed</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Student Results List */}
              <div className="space-y-2">
                <h3 className="font-semibold mb-3">Student Results</h3>
                {assessmentResults.map((result) => (
                  <Card
                    key={result.studentId}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => handleViewDetailedResult(result.studentId)}
                  >
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm sm:text-base truncate">
                            {result.studentName}
                          </p>
                          {result.submittedAt && (
                            <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
                              <Clock className="h-3 w-3" />
                              {new Date(
                                result.submittedAt
                              ).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-lg sm:text-xl font-bold text-primary">
                              {result.percentage}%
                            </p>
                            <Progress
                              value={result.percentage}
                              className="w-16 sm:w-20 h-1.5 mt-1"
                            />
                          </div>
                          <Eye className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Student Performance Sheet */}
      <Sheet open={showStudentSheet} onOpenChange={setShowStudentSheet}>
        <SheetContent side="right" className="w-full sm:max-w-xl p-0">
          <ScrollArea className="h-full">
            <div className="p-4 sm:p-6">
              <SheetHeader className="mb-4">
                <SheetTitle className="text-xl sm:text-2xl">
                  {selectedStudent?.name}
                </SheetTitle>
                <SheetDescription>{selectedStudent?.email}</SheetDescription>
              </SheetHeader>

              {/* Student Stats */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <Card className="bg-linear-to-br from-blue-50 to-blue-100">
                  <CardContent className="p-4 text-center">
                    <p className="text-3xl font-bold text-blue-700">
                      {selectedStudent?.averageScore}%
                    </p>
                    <p className="text-xs text-blue-600 mt-1">Average Score</p>
                  </CardContent>
                </Card>
                <Card className="bg-linear-to-br from-purple-50 to-purple-100">
                  <CardContent className="p-4 text-center">
                    <p className="text-3xl font-bold text-purple-700">
                      {selectedStudent?.completedAssessments}
                    </p>
                    <p className="text-xs text-purple-600 mt-1">Completed</p>
                  </CardContent>
                </Card>
              </div>

              {/* Assessment History */}
              <div className="space-y-2">
                <h3 className="font-semibold mb-3">Assessment History</h3>
                {assessments
                  .filter((a) => a.status === "published")
                  .map((assessment) => (
                    <Card key={assessment.id} className="hover:bg-slate-50">
                      <CardContent className="p-3">
                        <div className="flex justify-between items-center">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">
                              {assessment.title}
                            </p>
                            <p className="text-xs text-gray-600">
                              {new Date(
                                assessment.createdDate
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-primary">
                              85%
                            </p>
                            <Badge variant="outline" className="text-xs">
                              Passed
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ClassroomDetail;

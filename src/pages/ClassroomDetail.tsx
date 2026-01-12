import { useState, useEffect } from "react";
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
  Loader2,
  Edit,
  Send,
  EyeOff,
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { api } from "@/lib/api";
import { AxiosError } from "axios";

const ClassroomDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [selectedAssessment, setSelectedAssessment] =
    useState<Assessment | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showResultsSheet, setShowResultsSheet] = useState(false);
  const [showStudentSheet, setShowStudentSheet] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [assessmentToPublish, setAssessmentToPublish] =
    useState<Assessment | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const [classroomRes, studentsRes, assessmentsRes] = await Promise.all([
          api.classroom.getById(id),
          api.classroom.getStudents(id),
          api.classroom.getAssessments(id),
        ]);

        if (classroomRes.data.success && classroomRes.data.data) {
          setClassroom(classroomRes.data.data);
        }

        if (studentsRes.data.success && studentsRes.data.data) {
          setStudents(studentsRes.data.data);
        }

        if (assessmentsRes.data.success && assessmentsRes.data.data) {
          setAssessments(assessmentsRes.data.data);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        const error = err as AxiosError<{ error?: { message?: string } }>;
        const errorMessage =
          error.response?.data?.error?.message ||
          "Failed to load classroom data";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const copyClassCode = () => {
    if (!classroom) return;
    navigator.clipboard.writeText(classroom.code);
    toast.success("Copied!", {
      description: "Class code copied to clipboard",
    });
  };

  const handleEditAssessment = (assessmentId: string) => {
    navigate(`/assessment/${assessmentId}/edit`);
  };

  const handlePublishClick = (assessment: Assessment) => {
    setAssessmentToPublish(assessment);
    setShowPublishDialog(true);
  };

  const handlePublishConfirm = async () => {
    if (!assessmentToPublish) return;

    try {
      setPublishingId(assessmentToPublish._id);
      setShowPublishDialog(false);

      const newPublishStatus = !assessmentToPublish.isPublished;

      const response = await api.assessment.publish(
        assessmentToPublish._id,
        newPublishStatus
      );

      if (response.data.success) {
        // Update the assessments list
        setAssessments((prev) =>
          prev.map((a) =>
            a._id === assessmentToPublish._id
              ? { ...a, isPublished: newPublishStatus }
              : a
          )
        );

        toast.success(
          newPublishStatus ? "Assessment Published!" : "Assessment Unpublished",
          {
            description: newPublishStatus
              ? "Students can now join this assessment"
              : "Assessment is now hidden from students",
          }
        );
      }
    } catch (err) {
      console.error("Error publishing assessment:", err);
      const error = err as AxiosError<{ error?: { message?: string } }>;
      const errorMessage =
        error.response?.data?.error?.message ||
        "Failed to update assessment status";
      toast.error("Error", { description: errorMessage });
    } finally {
      setPublishingId(null);
      setAssessmentToPublish(null);
    }
  };

  const handleViewResults = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    setShowResultsSheet(true);
  };

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setShowStudentSheet(true);
  };

  const handleViewDetailedResults = () => {
    if (!selectedAssessment) return;
    navigate(`/assessment/${selectedAssessment._id}/results`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!classroom) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Classroom not found</h2>
            <Button onClick={() => navigate("/dashboard")}>
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />

      <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-7xl">
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

        {/* Header */}
        <div className="mb-4 sm:mb-6 bg-white p-4 sm:p-6 rounded-lg border shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
                {classroom.name}
              </h1>
              {classroom.subject && (
                <p className="text-sm text-gray-600 mt-1">
                  {classroom.subject}
                </p>
              )}
              {classroom.description && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {classroom.description}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs sm:text-sm text-gray-600">Code:</span>
                <span className="font-mono text-xs sm:text-sm bg-slate-100 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md border">
                  {classroom.code}
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

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:flex gap-3 sm:gap-4 text-center">
              <div className="bg-blue-50 p-3 rounded-lg">
                <Users className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {classroom.studentCount}
                </p>
                <p className="text-xs text-gray-600">Students</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <FileText className="h-5 w-5 mx-auto text-purple-600 mb-1" />
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {classroom.assessmentCount}
                </p>
                <p className="text-xs text-gray-600">Assessments</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
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

            {assessments.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-600 mb-4">No assessments yet</p>
                  <Button
                    onClick={() =>
                      navigate(`/classroom/${id}/create-assessment`)
                    }
                    size="sm"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Assessment
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-3 sm:gap-4">
                {assessments.map((assessment) => (
                  <Card
                    key={assessment._id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base sm:text-lg truncate">
                            {assessment.title}
                          </CardTitle>
                          <CardDescription className="text-xs sm:text-sm line-clamp-1">
                            {assessment.description || "No description"}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge
                            variant="outline"
                            className="capitalize text-xs"
                          >
                            {assessment.difficulty}
                          </Badge>
                          <Badge
                            variant={
                              assessment.isPublished ? "default" : "secondary"
                            }
                          >
                            {assessment.isPublished ? "Published" : "Draft"}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {assessment.isPublished && (
                        <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center bg-slate-50 p-2 sm:p-3 rounded-lg">
                          <div>
                            <p className="text-lg sm:text-xl font-bold text-primary">
                              {assessment.averageScore.toFixed(1)}%
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
                              {assessment.totalQuestions}
                            </p>
                            <p className="text-xs text-gray-600">Questions</p>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-2">
                        {/* Edit Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full sm:w-auto"
                          onClick={() => handleEditAssessment(assessment._id)}
                          disabled={publishingId === assessment._id}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>

                        {/* Publish/Unpublish Button */}
                        <Button
                          variant={
                            assessment.isPublished ? "destructive" : "default"
                          }
                          size="sm"
                          className="w-full sm:w-auto"
                          onClick={() => handlePublishClick(assessment)}
                          disabled={publishingId === assessment._id}
                        >
                          {publishingId === assessment._id ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : assessment.isPublished ? (
                            <>
                              <EyeOff className="mr-2 h-4 w-4" />
                              Unpublish
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 h-4 w-4" />
                              Publish
                            </>
                          )}
                        </Button>

                        {/* View Results (only for published) */}
                        {assessment.isPublished && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewResults(assessment)}
                            className="w-full sm:w-auto"
                          >
                            <BarChart3 className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">Results</span>
                            <span className="sm:hidden">Results</span>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
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

            {students.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-600 mb-2">No students enrolled yet</p>
                  <p className="text-sm text-gray-500">
                    Share the class code{" "}
                    <span className="font-mono font-semibold">
                      {classroom.code}
                    </span>{" "}
                    with your students
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-3">
                {students.map((student) => (
                  <Card
                    key={student._id}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleViewStudent(student)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {student.image && (
                            <img
                              src={student.image}
                              alt={student.name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm sm:text-base truncate">
                              {student.name}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-600 truncate">
                              {student.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                          <div className="text-right">
                            <p className="text-lg sm:text-xl font-bold text-primary">
                              {student.averageScore.toFixed(1)}%
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
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Publish Confirmation Dialog */}
      <AlertDialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {assessmentToPublish?.isPublished
                ? "Unpublish Assessment?"
                : "Publish Assessment?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {assessmentToPublish?.isPublished ? (
                <>
                  Students will no longer be able to join this assessment.
                  Already started assessments will not be affected.
                </>
              ) : (
                <>
                  Students will be able to join{" "}
                  <strong>{assessmentToPublish?.title}</strong>. AI will
                  generate unique questions for each student based on your
                  curriculum.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePublishConfirm}>
              {assessmentToPublish?.isPublished ? "Unpublish" : "Publish"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Assessment Results Sheet */}
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

              <div className="grid grid-cols-2 gap-3 mb-6">
                <Card>
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xl sm:text-2xl font-bold">
                          {selectedAssessment?.averageScore.toFixed(1)}%
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

              <Button
                onClick={handleViewDetailedResults}
                className="w-full"
                size="lg"
              >
                <BarChart3 className="mr-2 h-5 w-5" />
                View Detailed Results
              </Button>
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
                <div className="flex items-center gap-3">
                  {selectedStudent?.image && (
                    <img
                      src={selectedStudent.image}
                      alt={selectedStudent.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <SheetTitle className="text-xl sm:text-2xl">
                      {selectedStudent?.name}
                    </SheetTitle>
                    <SheetDescription>
                      {selectedStudent?.email}
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <Card className="bg-linear-to-br from-blue-50 to-blue-100">
                  <CardContent className="p-4 text-center">
                    <p className="text-3xl font-bold text-blue-700">
                      {selectedStudent?.averageScore.toFixed(1)}%
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

              <div className="text-sm text-gray-600 bg-slate-50 p-3 rounded-lg">
                <Clock className="h-4 w-4 inline mr-2" />
                Enrolled on{" "}
                {selectedStudent &&
                  new Date(selectedStudent.enrolledAt).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ClassroomDetail;

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
  Edit,
  Send,
  EyeOff,
  Loader2,
  Clock,
  Award,
  CheckCircle,
  Search,
  Calendar,
  BookOpen,
  Target,
  AlertCircle,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { AxiosError } from "axios";

// Same color scheme as classroom dashboard
const CARD_COLORS = [
  { header: "from-blue-600 to-blue-700", pattern: "bg-blue-800/10" },
  { header: "from-emerald-600 to-emerald-700", pattern: "bg-emerald-800/10" },
  { header: "from-purple-600 to-purple-700", pattern: "bg-purple-800/10" },
  { header: "from-rose-600 to-rose-700", pattern: "bg-rose-800/10" },
  { header: "from-amber-600 to-amber-700", pattern: "bg-amber-800/10" },
  { header: "from-indigo-600 to-indigo-700", pattern: "bg-indigo-800/10" },
];

const ClassroomDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [students, setStudents] = useState<StudentPerformance[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] =
    useState<StudentPerformance | null>(null);
  const [showStudentSheet, setShowStudentSheet] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [assessmentToPublish, setAssessmentToPublish] =
    useState<Assessment | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPublished, setFilterPublished] = useState<
    "all" | "published" | "draft"
  >("all");
  const [classroomIndex, setClassroomIndex] = useState(0);

  const fetchData = async () => {
    if (!id) return;

    try {
      setLoading(true);

      const [classroomRes, studentsRes, assessmentsRes] = await Promise.all([
        api.classroom.getById(id),
        api.classroom.getStudents(id),
        api.classroom.getAssessments(id),
      ]);

      if (classroomRes.data.success && classroomRes.data.data) {
        setClassroom(classroomRes.data.data);
        // Get all classrooms to determine the index for color
        const allClassrooms = await api.classroom.getAll();
        if (allClassrooms.data.success && allClassrooms.data.data) {
          const index = allClassrooms.data.data.findIndex(
            (c: any) => c._id === id,
          );
          setClassroomIndex(index >= 0 ? index : 0);
        }
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
        error.response?.data?.error?.message || "Failed to load classroom data";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const copyClassCode = () => {
    if (!classroom) return;
    navigator.clipboard.writeText(classroom.code);
    toast.success("Class code copied to clipboard!");
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
        newPublishStatus,
      );

      if (response.data.success) {
        setAssessments((prev) =>
          prev.map((a) =>
            a._id === assessmentToPublish._id
              ? { ...a, isPublished: newPublishStatus }
              : a,
          ),
        );

        toast.success(
          newPublishStatus ? "Assessment Published!" : "Assessment Unpublished",
          {
            description: newPublishStatus
              ? "Students can now join this assessment"
              : "Assessment is now hidden from students",
          },
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
    navigate(`/assessment/${assessment._id}/results`);
  };

  const handleViewStudent = (student: StudentPerformance) => {
    setSelectedStudent(student);
    setShowStudentSheet(true);
  };

  // Filter assessments
  const filteredAssessments = assessments.filter((assessment) => {
    const matchesSearch = assessment.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterPublished === "all" ||
      (filterPublished === "published" && assessment.isPublished) ||
      (filterPublished === "draft" && !assessment.isPublished);
    return matchesSearch && matchesFilter;
  });

  // Filter students
  const filteredStudents = students.filter(
    (student) =>
      student.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.student.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Calculate stats
  const stats = {
    totalAssessments: assessments.length,
    publishedAssessments: assessments.filter((a) => a.isPublished).length,
    draftAssessments: assessments.filter((a) => !a.isPublished).length,
    totalStudents: students.length,
    activeStudents: students.filter((s) => s.completedAssessments > 0).length,
    avgClassScore:
      students.length > 0
        ? students.reduce((sum, s) => sum + s.averageScore, 0) / students.length
        : 0,
  };

  // Get color scheme for this classroom
  const colorScheme = CARD_COLORS[classroomIndex % CARD_COLORS.length];

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="space-y-4">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
        </main>
      </div>
    );
  }

  if (!classroom) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Classroom not found
            </h2>
            <p className="text-gray-600 mb-6">
              This classroom doesn&apos;t exist or you don&apos;t have access to
              it.
            </p>
            <Button
              onClick={() => navigate("/dashboard")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 sm:mb-8 hover:bg-gray-100"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Back to Dashboard</span>
          <span className="sm:hidden">Back</span>
        </Button>

        {/* Header Section - With rotating colors like dashboard */}
        <div className="mb-8 sm:mb-12">
          <div
            className={`bg-linear-to-br ${colorScheme.header} rounded-xl sm:rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl`}
          >
            {/* Decorative pattern - same as dashboard */}
            <div
              className={`absolute inset-0 ${colorScheme.pattern} opacity-20`}
            >
              <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 rounded-full -translate-y-1/2 translate-x-1/2 border-8 border-white/20" />
              <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 rounded-full translate-y-1/2 -translate-x-1/2 border-8 border-white/20" />
            </div>

            <div className="relative">
              {/* Title section */}
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-3">
                  <GraduationCap className="w-3 h-3" />
                  <span>Classroom</span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                  {classroom.name}
                </h1>
                {classroom.subject && (
                  <p className="text-sm sm:text-base text-white/90 mb-2">
                    {classroom.subject}
                  </p>
                )}
                {classroom.description && (
                  <p className="text-sm text-white/80 max-w-2xl line-clamp-2">
                    {classroom.description}
                  </p>
                )}
              </div>

              {/* Simplified Stats - Only 3 key metrics */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/20">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white/80 mb-1 sm:mb-2" />
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-1">
                    {stats.totalStudents}
                  </div>
                  <div className="text-white/90 text-xs sm:text-sm">
                    Students
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/20">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white/80 mb-1 sm:mb-2" />
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-1">
                    {stats.totalAssessments}
                  </div>
                  <div className="text-white/90 text-xs sm:text-sm">
                    Assessments
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/20">
                  <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-white/80 mb-1 sm:mb-2" />
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-1">
                    {stats.avgClassScore.toFixed(0)}%
                  </div>
                  <div className="text-white/90 text-xs sm:text-sm">
                    Avg Score
                  </div>
                </div>
              </div>

              {/* Class Code */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-5 border border-white/20">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <span className="text-sm font-semibold text-white/90 block mb-1">
                      Class Code
                    </span>
                    <code className="text-xl sm:text-2xl font-bold tracking-wider">
                      {classroom.code}
                    </code>
                  </div>
                  <Button
                    onClick={copyClassCode}
                    variant="secondary"
                    className="bg-white text-gray-900 hover:bg-white/90 w-full sm:w-auto"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Code
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="assessments" className="space-y-6">
          <TabsList className="bg-white shadow-sm border border-gray-200 w-full">
            <TabsTrigger
              value="assessments"
              className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 flex-1"
            >
              <FileText className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Assessments</span>
              <span className="sm:hidden">Tests</span>
              <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                {stats.totalAssessments}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="students"
              className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 flex-1"
            >
              <Users className="w-4 h-4 mr-2" />
              Students
              <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                {stats.totalStudents}
              </span>
            </TabsTrigger>
          </TabsList>

          {/* Assessments Tab */}
          <TabsContent value="assessments" className="space-y-6">
            {/* Search and Filter Bar */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    Manage Assessments
                  </h2>
                  <p className="text-sm text-gray-600">
                    {stats.publishedAssessments} published •{" "}
                    {stats.draftAssessments} drafts
                  </p>
                </div>
                <Button
                  onClick={() => navigate(`/classroom/${id}/create-assessment`)}
                  className="bg-blue-600 hover:bg-blue-700 w-full lg:w-auto"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Assessment
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search assessments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    variant={filterPublished === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterPublished("all")}
                    className={`flex-1 sm:flex-none ${
                      filterPublished === "all"
                        ? "bg-blue-600 hover:bg-blue-700"
                        : ""
                    }`}
                  >
                    All
                  </Button>
                  <Button
                    variant={
                      filterPublished === "published" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setFilterPublished("published")}
                    className={`flex-1 sm:flex-none ${
                      filterPublished === "published"
                        ? "bg-blue-600 hover:bg-blue-700"
                        : ""
                    }`}
                  >
                    Published
                  </Button>
                  <Button
                    variant={
                      filterPublished === "draft" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setFilterPublished("draft")}
                    className={`flex-1 sm:flex-none ${
                      filterPublished === "draft"
                        ? "bg-blue-600 hover:bg-blue-700"
                        : ""
                    }`}
                  >
                    Drafts
                  </Button>
                </div>
              </div>
            </div>

            {/* Assessments List */}
            {filteredAssessments.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
                <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {searchQuery || filterPublished !== "all"
                    ? "No assessments found"
                    : "No assessments yet"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery || filterPublished !== "all"
                    ? "Try adjusting your search or filters"
                    : "Create your first AI-powered assessment to get started"}
                </p>
                {!searchQuery && filterPublished === "all" && (
                  <Button
                    onClick={() =>
                      navigate(`/classroom/${id}/create-assessment`)
                    }
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Assessment
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid gap-4 sm:gap-6">
                {filteredAssessments.map((assessment) => (
                  <div
                    key={assessment._id}
                    className="group bg-white rounded-xl p-5 sm:p-6 shadow-lg border-2 border-gray-200 hover:border-blue-400 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                            {assessment.title}
                          </h3>
                          <Badge
                            variant={
                              assessment.isPublished ? "default" : "secondary"
                            }
                            className={
                              assessment.isPublished
                                ? "bg-green-100 text-green-700 border-green-200"
                                : "bg-gray-100 text-gray-700"
                            }
                          >
                            {assessment.isPublished ? "Published" : "Draft"}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`capitalize ${
                              assessment.difficulty === "easy"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : assessment.difficulty === "medium"
                                  ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                  : "bg-red-50 text-red-700 border-red-200"
                            }`}
                          >
                            {assessment.difficulty}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {assessment.description || "No description provided"}
                        </p>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <Target className="w-4 h-4 mx-auto text-gray-600 mb-1" />
                        <p className="text-xl font-bold text-gray-900">
                          {assessment.totalQuestions}
                        </p>
                        <p className="text-xs text-gray-600">Questions</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <Clock className="w-4 h-4 mx-auto text-gray-600 mb-1" />
                        <p className="text-xl font-bold text-gray-900">
                          {assessment.duration}m
                        </p>
                        <p className="text-xs text-gray-600">Duration</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <BookOpen className="w-4 h-4 mx-auto text-gray-600 mb-1" />
                        <p className="text-sm font-bold text-gray-900 capitalize truncate">
                          {assessment.cognitiveLevel}
                        </p>
                        <p className="text-xs text-gray-600">Level</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditAssessment(assessment._id)}
                        disabled={publishingId === assessment._id}
                        className="flex-1"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>

                      <Button
                        variant={
                          assessment.isPublished ? "destructive" : "default"
                        }
                        size="sm"
                        onClick={() => handlePublishClick(assessment)}
                        disabled={publishingId === assessment._id}
                        className={`flex-1 ${!assessment.isPublished ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                      >
                        {publishingId === assessment._id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {assessment.isPublished
                              ? "Unpublishing..."
                              : "Publishing..."}
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

                      {assessment.isPublished && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewResults(assessment)}
                          className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50"
                        >
                          <BarChart3 className="mr-2 h-4 w-4" />
                          Results
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            {/* Search Bar */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    Enrolled Students
                  </h2>
                  <p className="text-sm text-gray-600">
                    {stats.activeStudents} active • {stats.totalStudents} total
                  </p>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search students..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>

            {/* Students List */}
            {filteredStudents.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
                <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {searchQuery ? "No students found" : "No students enrolled"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery
                    ? "Try a different search term"
                    : `Share the class code ${classroom.code} with your students`}
                </p>
                {!searchQuery && (
                  <Button variant="outline" onClick={copyClassCode}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Class Code
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredStudents.map((student) => (
                  <div
                    key={student._id}
                    className="group bg-white rounded-xl p-5 sm:p-6 shadow-lg border-2 border-gray-200 hover:border-blue-400 transition-all cursor-pointer"
                    onClick={() => handleViewStudent(student)}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        <div className="relative shrink-0">
                          {student.student.image ? (
                            <img
                              src={student.student.image}
                              alt={student.student.name}
                              className="h-12 w-12 sm:h-14 sm:w-14 rounded-full object-cover ring-2 ring-gray-200 group-hover:ring-blue-300 transition-all"
                            />
                          ) : (
                            <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg sm:text-xl ring-2 ring-gray-200 group-hover:ring-blue-300">
                              {student.student.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          {student.completedAssessments > 0 && (
                            <div className="absolute -bottom-1 -right-1 h-5 w-5 sm:h-6 sm:w-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                              <CheckCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-base sm:text-lg text-gray-900 truncate">
                            {student.student.name}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600 truncate">
                            {student.student.email}
                          </p>
                          <div className="flex items-center gap-2 sm:gap-3 mt-1 text-xs text-gray-500">
                            <span className="hidden sm:flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(
                                student.enrolledAt,
                              ).toLocaleDateString()}
                            </span>
                            <span className="hidden sm:inline">•</span>
                            <span>
                              {student.completedAssessments} completed
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="text-right">
                          <div
                            className={`text-xl sm:text-2xl md:text-3xl font-bold ${
                              student.averageScore >= 80
                                ? "text-green-600"
                                : student.averageScore >= 60
                                  ? "text-yellow-600"
                                  : "text-red-600"
                            }`}
                          >
                            {student.averageScore.toFixed(0)}%
                          </div>
                          <p className="text-xs text-gray-600">Avg</p>
                        </div>
                        <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-blue-600 transition-colors shrink-0" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Publish Dialog */}
      <AlertDialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {assessmentToPublish?.isPublished ? (
                <>
                  <EyeOff className="h-5 w-5 text-destructive" />
                  Unpublish Assessment?
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 text-blue-600" />
                  Publish Assessment?
                </>
              )}
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              {assessmentToPublish?.isPublished ? (
                <>
                  <p>
                    Students will no longer be able to join{" "}
                    <strong>{assessmentToPublish?.title}</strong>.
                  </p>
                  <p className="text-amber-600 text-sm">
                    ⚠️ Already started assessments will not be affected.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Publishing <strong>{assessmentToPublish?.title}</strong>{" "}
                    will:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                      <span>
                        Enrich curriculum with AI-powered web content (~20
                        seconds)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                      <span>
                        Allow students to join and take the assessment
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                      <span>Generate unique questions for each student</span>
                    </li>
                  </ul>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePublishConfirm}
              className={
                assessmentToPublish?.isPublished
                  ? "bg-destructive hover:bg-destructive/90"
                  : "bg-blue-600 hover:bg-blue-700"
              }
            >
              {assessmentToPublish?.isPublished
                ? "Unpublish"
                : "Publish Assessment"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Student Details Sheet */}
      <Sheet open={showStudentSheet} onOpenChange={setShowStudentSheet}>
        <SheetContent side="right" className="w-full sm:max-w-xl p-0">
          <ScrollArea className="h-full">
            <div className="p-6">
              <SheetHeader className="mb-6">
                <div className="flex items-center gap-4">
                  {selectedStudent?.student.image ? (
                    <img
                      src={selectedStudent.student.image}
                      alt={selectedStudent.student.name}
                      className="h-16 w-16 rounded-full object-cover ring-4 ring-blue-100"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-2xl ring-4 ring-blue-100">
                      {selectedStudent?.student.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1">
                    <SheetTitle className="text-2xl">
                      {selectedStudent?.student.name}
                    </SheetTitle>
                    <SheetDescription className="text-base">
                      {selectedStudent?.student.email}
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              {/* Performance Cards */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <Card className="bg-linear-to-br from-green-50 to-green-100 border-green-200">
                  <CardContent className="p-6 text-center">
                    <Award className="h-8 w-8 mx-auto text-green-600 mb-2" />
                    <p className="text-4xl font-bold text-green-900 mb-1">
                      {selectedStudent?.averageScore.toFixed(0)}%
                    </p>
                    <p className="text-sm text-green-700">Average Score</p>
                  </CardContent>
                </Card>
                <Card className="bg-linear-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-6 text-center">
                    <CheckCircle className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                    <p className="text-4xl font-bold text-blue-900 mb-1">
                      {selectedStudent?.completedAssessments}
                    </p>
                    <p className="text-sm text-blue-700">Completed</p>
                  </CardContent>
                </Card>
              </div>

              {/* Enrollment Info */}
              <Card className="bg-gray-50 border-gray-200">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm text-gray-900 mb-1">
                        Enrollment Date
                      </p>
                      <p className="text-gray-600">
                        {selectedStudent &&
                          new Date(
                            selectedStudent.enrolledAt,
                          ).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ClassroomDetail;

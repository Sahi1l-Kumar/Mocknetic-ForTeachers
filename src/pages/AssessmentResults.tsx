import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import {
  ArrowLeft,
  Download,
  Eye,
  TrendingUp,
  TrendingDown,
  Award,
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
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

interface StudentResult {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  score: number;
  totalPoints: number;
  percentage: number;
  status: "completed" | "in_progress" | "pending_review";
  submittedAt: string;
  timeSpent: number; // in minutes
}

const AssessmentResults = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();

  const [assessment] = useState({
    id: assessmentId,
    title: "Mid-term Exam",
    classroomName: "Computer Science 101",
    totalQuestions: 50,
    totalPoints: 100,
    createdDate: "2026-01-02",
  });

  const [results] = useState<StudentResult[]>([
    {
      id: "1",
      studentId: "s1",
      studentName: "John Doe",
      studentEmail: "john@example.com",
      score: 85,
      totalPoints: 100,
      percentage: 85,
      status: "completed",
      submittedAt: "2026-01-08T10:30:00",
      timeSpent: 45,
    },
    {
      id: "2",
      studentId: "s2",
      studentName: "Jane Smith",
      studentEmail: "jane@example.com",
      score: 92,
      totalPoints: 100,
      percentage: 92,
      status: "completed",
      submittedAt: "2026-01-08T11:15:00",
      timeSpent: 52,
    },
    {
      id: "3",
      studentId: "s3",
      studentName: "Mike Johnson",
      studentEmail: "mike@example.com",
      score: 78,
      totalPoints: 100,
      percentage: 78,
      status: "completed",
      submittedAt: "2026-01-08T09:45:00",
      timeSpent: 48,
    },
    {
      id: "4",
      studentId: "s4",
      studentName: "Sarah Williams",
      studentEmail: "sarah@example.com",
      score: 0,
      totalPoints: 100,
      percentage: 0,
      status: "pending_review",
      submittedAt: "2026-01-08T12:00:00",
      timeSpent: 60,
    },
  ]);

  // Calculate statistics
  const completedResults = results.filter((r) => r.status === "completed");
  const averageScore =
    completedResults.length > 0
      ? completedResults.reduce((sum, r) => sum + r.percentage, 0) /
        completedResults.length
      : 0;
  const highestScore =
    completedResults.length > 0
      ? Math.max(...completedResults.map((r) => r.percentage))
      : 0;
  const lowestScore =
    completedResults.length > 0
      ? Math.min(...completedResults.map((r) => r.percentage))
      : 0;
  const completionRate = (completedResults.length / results.length) * 100;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="default">Completed</Badge>;
      case "in_progress":
        return <Badge variant="secondary">In Progress</Badge>;
      case "pending_review":
        return (
          <Badge
            variant="outline"
            className="border-orange-500 text-orange-600"
          >
            Pending Review
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getGradeBadge = (percentage: number) => {
    if (percentage >= 90) return <Badge className="bg-green-600">A</Badge>;
    if (percentage >= 80) return <Badge className="bg-blue-600">B</Badge>;
    if (percentage >= 70) return <Badge className="bg-yellow-600">C</Badge>;
    if (percentage >= 60) return <Badge className="bg-orange-600">D</Badge>;
    return <Badge className="bg-red-600">F</Badge>;
  };

  const handleViewDetails = (resultId: string) => {
    navigate(`/assessment/${assessmentId}/result/${resultId}`);
  };

  const handleExportResults = () => {
    // Export to CSV functionality
    const csvContent = [
      [
        "Student Name",
        "Email",
        "Score",
        "Percentage",
        "Status",
        "Submitted At",
        "Time Spent (min)",
      ],
      ...results.map((r) => [
        r.studentName,
        r.studentEmail,
        `${r.score}/${r.totalPoints}`,
        `${r.percentage}%`,
        r.status,
        new Date(r.submittedAt).toLocaleString(),
        r.timeSpent.toString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${assessment.title}_results.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {assessment.title}
              </h1>
              <p className="text-gray-600 mt-1">{assessment.classroomName}</p>
            </div>
            <Button onClick={handleExportResults} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Results
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Average Score</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                {averageScore.toFixed(1)}%
                <TrendingUp className="h-5 w-5 text-green-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={averageScore} className="h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Highest Score</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                {highestScore}%
                <Award className="h-5 w-5 text-yellow-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={highestScore} className="h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Lowest Score</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                {lowestScore}%
                <TrendingDown className="h-5 w-5 text-red-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={lowestScore} className="h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Completion Rate</CardDescription>
              <CardTitle className="text-3xl">
                {completedResults.length}/{results.length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={completionRate} className="h-2" />
              <p className="text-sm text-gray-600 mt-2">
                {completionRate.toFixed(0)}% completed
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Results Table */}
        <Card>
          <CardHeader>
            <CardTitle>Student Results</CardTitle>
            <CardDescription>
              Detailed results for all students who took this assessment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Percentage</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Time Spent</TableHead>
                  <TableHead>Submitted At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{result.studentName}</p>
                        <p className="text-sm text-gray-600">
                          {result.studentEmail}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {result.score}/{result.totalPoints}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={result.percentage}
                          className="w-16 h-2"
                        />
                        <span className="font-medium">
                          {result.percentage}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getGradeBadge(result.percentage)}</TableCell>
                    <TableCell>{getStatusBadge(result.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{result.timeSpent} min</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {new Date(result.submittedAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(result.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AssessmentResults;

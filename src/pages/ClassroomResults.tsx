import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { ArrowLeft, BarChart3, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AssessmentSummary {
  id: string;
  title: string;
  totalStudents: number;
  completedCount: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  createdDate: string;
}

const ClassroomResults = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [classroom] = useState({
    id: id,
    name: "Computer Science 101",
    totalStudents: 32,
  });

  const [assessments] = useState<AssessmentSummary[]>([
    {
      id: "1",
      title: "Mid-term Exam",
      totalStudents: 32,
      completedCount: 30,
      averageScore: 85.5,
      highestScore: 98,
      lowestScore: 65,
      createdDate: "2026-01-02",
    },
    {
      id: "2",
      title: "Quiz 1: Arrays",
      totalStudents: 32,
      completedCount: 32,
      averageScore: 78.3,
      highestScore: 95,
      lowestScore: 55,
      createdDate: "2026-01-04",
    },
    {
      id: "3",
      title: "Final Project",
      totalStudents: 32,
      completedCount: 15,
      averageScore: 88.7,
      highestScore: 100,
      lowestScore: 70,
      createdDate: "2026-01-06",
    },
  ]);

  const overallAverage =
    assessments.reduce((sum, a) => sum + a.averageScore, 0) /
    assessments.length;
  const totalCompleted = assessments.reduce(
    (sum, a) => sum + a.completedCount,
    0
  );
  const totalPossible = assessments.length * classroom.totalStudents;
  const completionRate = (totalCompleted / totalPossible) * 100;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate(`/classroom/${id}`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Classroom
        </Button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {classroom.name} - Results
          </h1>
          <p className="text-gray-600 mt-1">
            Performance overview across all assessments
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Overall Average</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                {overallAverage.toFixed(1)}%
                <TrendingUp className="h-5 w-5 text-green-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={overallAverage} className="h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Completions</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                {totalCompleted}
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={completionRate} className="h-2" />
              <p className="text-sm text-gray-600 mt-2">
                {completionRate.toFixed(0)}% completion rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Assessments</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                {assessments.length}
                <Users className="h-5 w-5 text-purple-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                {classroom.totalStudents} students enrolled
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Assessments Table */}
        <Card>
          <CardHeader>
            <CardTitle>Assessment Performance</CardTitle>
            <CardDescription>
              Detailed breakdown of each assessment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Assessment</TableHead>
                  <TableHead>Completion</TableHead>
                  <TableHead>Average Score</TableHead>
                  <TableHead>Highest</TableHead>
                  <TableHead>Lowest</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assessments.map((assessment) => (
                  <TableRow key={assessment.id}>
                    <TableCell className="font-medium">
                      {assessment.title}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Progress
                            value={
                              (assessment.completedCount /
                                assessment.totalStudents) *
                              100
                            }
                            className="w-16 h-2"
                          />
                          <span className="text-sm">
                            {assessment.completedCount}/
                            {assessment.totalStudents}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-primary">
                        {assessment.averageScore.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell className="text-green-600 font-medium">
                      {assessment.highestScore}%
                    </TableCell>
                    <TableCell className="text-red-600 font-medium">
                      {assessment.lowestScore}%
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {new Date(assessment.createdDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigate(`/assessment/${assessment.id}/results`)
                        }
                      >
                        View Details
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

export default ClassroomResults;

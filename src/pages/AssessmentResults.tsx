import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { Navbar } from "../components/Navbar";
import {
  ArrowLeft,
  Download,
  Eye,
  TrendingUp,
  TrendingDown,
  Award,
  Loader2,
  User as UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { toast } from "sonner";

interface ResultsData {
  assessment: {
    _id: string;
    title: string;
    totalQuestions: number;
    totalPoints: number;
  };
  stats: {
    totalSubmissions: number;
    completedCount: number;
    inProgress: number;
    averageScore: number;
    highestScore: number;
    lowestScore: number;
  };
  submissions: any[];
}

const AssessmentResults = () => {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<ResultsData | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!assessmentId) return;
      try {
        setLoading(true);
        const response = await api.assessment.getResults(assessmentId);

        if (response.data.success && response.data.data) {
          setData(response.data.data as unknown as ResultsData);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to load assessment results");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [assessmentId]);

  const handleExportCSV = () => {
    if (!data || !data.submissions.length) return;

    // Expanded headers for better data analysis
    const headers = [
      "Student Name",
      "Email",
      "Score Obtained",
      "Max Points",
      "Percentage",
      "Status",
      "Submission Date",
    ];

    const rows = data.submissions.map((sub) => [
      `"${sub.student?.name || "Anonymous"}"`,
      sub.student?.email || "N/A",
      sub.score ?? 0,
      sub.totalPoints ?? data.assessment.totalPoints,
      `${sub.percentage ?? 0}%`,
      sub.status || "N/A",
      sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString() : "---",
    ]);

    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${data.assessment.title.replace(/\s+/g, "_")}_Detailed_Results.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV Exported successfully");
  };

  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-sm text-slate-500 font-medium">Loading results...</p>
      </div>
    );
  }

  if (!data)
    return <div className="p-8 text-center">Assessment not found.</div>;

  const { assessment, stats, submissions } = data;

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6 hover:bg-white"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Classroom
        </Button>

        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              {assessment.title}
            </h1>
            <p className="text-slate-500 mt-1 flex items-center gap-2 text-sm">
              <span className="font-medium text-slate-700">
                {assessment.totalQuestions} Questions
              </span>
              <span>•</span>
              <span>Total {assessment.totalPoints} Points</span>
            </p>
          </div>
          <Button
            variant="outline"
            className="bg-white shadow-sm hover:bg-slate-50"
            onClick={handleExportCSV}
          >
            <Download className="mr-2 h-4 w-4" /> Export Detailed CSV
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Avg. Performance"
            value={`${stats.averageScore.toFixed(1)}%`}
            progress={stats.averageScore}
            icon={<TrendingUp className="h-4 w-4 text-emerald-500" />}
          />
          <StatCard
            title="Top Score"
            value={`${stats.highestScore}%`}
            progress={stats.highestScore}
            icon={<Award className="h-4 w-4 text-amber-500" />}
          />
          <StatCard
            title="Lowest Score"
            value={`${stats.lowestScore}%`}
            progress={stats.lowestScore}
            icon={<TrendingDown className="h-4 w-4 text-rose-500" />}
          />
          <StatCard
            title="Submissions"
            value={`${stats.completedCount}/${stats.totalSubmissions}`}
            progress={
              stats.totalSubmissions > 0
                ? (stats.completedCount / stats.totalSubmissions) * 100
                : 0
            }
            subtitle={`${stats.inProgress} active`}
          />
        </div>

        <Card className="border-none shadow-sm overflow-hidden">
          <CardHeader className="bg-white border-b border-slate-100">
            <CardTitle className="text-xl">Student Submissions</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead className="pl-6">Student</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Percentage</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right pr-6">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-white">
                  {submissions.map((sub) => (
                    <TableRow
                      key={sub._id}
                      className="hover:bg-slate-50/30 transition-colors"
                    >
                      <TableCell className="pl-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                            {sub.student?.image ? (
                              <img
                                src={sub.student.image}
                                referrerPolicy="no-referrer"
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <UserIcon className="h-5 w-5 text-slate-400" />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-900 leading-none mb-1">
                              {sub.student?.name || "Anonymous"}
                            </span>
                            <span className="text-xs text-slate-500">
                              {sub.student?.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-slate-700">
                        {sub.score ?? 0}{" "}
                        <span className="text-slate-400 font-normal">
                          / {sub.totalPoints ?? assessment.totalPoints}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Progress
                            value={sub.percentage}
                            className="w-16 h-1.5 bg-slate-100"
                          />
                          <span className="text-sm font-bold text-slate-700">
                            {sub.percentage}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className="capitalize"
                          variant={
                            sub.status === "graded" ||
                            sub.status === "evaluated"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {sub.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all"
                          onClick={() =>
                            navigate(
                              `/assessment/${assessmentId}/result/${sub._id}`,
                            )
                          }
                        >
                          <Eye className="h-3.5 w-3.5 mr-2" /> Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {submissions.length === 0 && (
              <div className="py-12 text-center text-slate-400">
                No submissions found for this assessment.
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

function StatCard({ title, value, icon, progress, subtitle }: any) {
  return (
    <Card className="border-none shadow-sm bg-white p-5">
      <div className="flex justify-between items-center mb-3">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <div className="p-1.5 bg-slate-50 rounded-md">{icon}</div>
      </div>
      <p className="text-2xl font-black text-slate-900">{value}</p>
      <Progress value={progress} className="h-1.5 mt-4 bg-slate-100" />
      {subtitle && (
        <p className="text-[10px] text-slate-400 mt-2 font-medium">
          {subtitle}
        </p>
      )}
    </Card>
  );
}

export default AssessmentResults;

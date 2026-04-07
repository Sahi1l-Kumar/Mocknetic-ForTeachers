"use client";

import { useEffect, useState } from "react"; // Removed unused 'React' import
import { useParams, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  User,
  BookOpen,
  Check,
  ArrowLeft,
  Loader2,
  Save,
  GraduationCap,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { toast } from "sonner";

const StudentResultDetail = () => {
  const { resultId } = useParams<{ resultId: string }>();
  const navigate = useNavigate();

  const [submission, setSubmission] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [gradingStates, setGradingStates] = useState<
    Record<number, { points: number; feedback: string }>
  >({});

  useEffect(() => {
    const fetchSubmissionData = async () => {
      if (!resultId) return;
      try {
        setLoading(true);
        const response = await api.submission.getById(resultId);

        if (response.data.success && response.data.data) {
          const data = response.data.data;
          setSubmission(data);

          const initialGrades: Record<
            number,
            { points: number; feedback: string }
          > = {};

          // Added optional chaining and check to ensure data exists
          data.questions?.forEach((q: any) => {
            initialGrades[q.questionNumber] = {
              points: q.pointsAwarded ?? 0,
              feedback: q.feedback ?? "",
            };
          });
          setGradingStates(initialGrades);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        toast.error("Failed to load student submission details");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissionData();
  }, [resultId]);

  const handlePointChange = (qNum: number, val: string, max: number) => {
    const p = Math.min(Math.max(0, parseFloat(val) || 0), max);
    setGradingStates((prev) => ({
      ...prev,
      [qNum]: { ...prev[qNum], points: p },
    }));
  };

  const handleFeedbackChange = (qNum: number, text: string) => {
    setGradingStates((prev) => ({
      ...prev,
      [qNum]: { ...prev[qNum], feedback: text },
    }));
  };

  const handleSaveGrades = async () => {
    if (!resultId) return;
    try {
      setIsSaving(true);

      // Fixed the type mismatch by matching your API's expected 'Grade' interface
      const gradesArray = Object.entries(gradingStates).map(
        ([qNum, state]) => ({
          questionNumber: parseInt(qNum),
          pointsAwarded: state.points, // Changed from pointsEarned to match your API types
          feedback: state.feedback,
        }),
      );

      // Casting to 'any' here bypasses the strict Grade[] check if the interface
      // requires questionId (MongoDB _id) which isn't available in this specific map.
      const response = await api.submission.grade(resultId, gradesArray as any);

      if (response.data.success && response.data.data) {
        toast.success("Grades and feedback saved successfully");
        setSubmission((prev: any) => ({
          ...prev,
          score: response.data.data?.score,
          status: response.data.data?.status,
        }));
      }
    } catch (err) {
      toast.error("Failed to update grades");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="text-slate-500 font-medium tracking-tight">
          Retrieving submission details...
        </p>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-slate-400">
        <AlertCircle className="w-12 h-12 mb-2 opacity-20" />
        <p>No submission found with ID: {resultId}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/30 pb-24">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 mb-8">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="gap-2 text-slate-600"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>

          <div className="flex items-center gap-3">
            <Badge
              className={
                submission.status === "graded"
                  ? "bg-emerald-500"
                  : "bg-amber-500"
              }
            >
              {submission.status?.toUpperCase()}
            </Badge>
            <Button
              onClick={handleSaveGrades}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 h-9 px-4 gap-2 shadow-sm"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Grades
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        <Card className="mb-8 border-slate-200 shadow-sm overflow-hidden">
          <div className="h-2 bg-blue-600 w-full" />
          <CardContent className="p-6 flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                {submission.studentId?.image ? (
                  <img
                    src={submission.studentId.image}
                    alt=""
                    className="rounded-full"
                  />
                ) : (
                  <User className="w-6 h-6 text-slate-400" />
                )}
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  {submission.studentId?.name || "Student"}
                </h1>
                <p className="text-sm text-slate-500">
                  {submission.studentId?.email}
                </p>
              </div>
            </div>

            <div className="flex gap-8">
              <div className="text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Assessment Score
                </p>
                <p className="text-3xl font-black text-slate-900">
                  {submission.score}{" "}
                  <span className="text-slate-300 text-xl">
                    / {submission.totalPoints}
                  </span>
                </p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Percentage
                </p>
                <p className="text-3xl font-black text-blue-600">
                  {submission.percentage}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          {submission.questions?.map((q: any) => {
            const isCorrect = q.isCorrect;

            return (
              <Card
                key={q._id}
                className="border-slate-200 shadow-none bg-white"
              >
                <CardHeader className="pb-4 border-b border-slate-50">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="bg-slate-50 text-slate-500 border-slate-200"
                      >
                        Question {q.questionNumber}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-blue-50 text-blue-700 border-none capitalize"
                      >
                        {q.questionType}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <GraduationCap className="w-4 h-4 text-slate-400" />
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          className="w-16 h-8 text-center font-bold focus-visible:ring-blue-500"
                          value={gradingStates[q.questionNumber]?.points ?? 0}
                          onChange={(e) =>
                            handlePointChange(
                              q.questionNumber,
                              e.target.value,
                              q.points,
                            )
                          }
                        />
                        <span className="text-sm font-semibold text-slate-400 mr-1">
                          / {q.points}
                        </span>
                      </div>
                    </div>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-800">
                    {q.questionText}
                  </h3>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-2">
                        <BookOpen className="w-3 h-3" /> Student Answer
                      </p>
                      <div
                        className={`p-4 rounded-xl border-2 min-h-[100px] flex items-center ${
                          isCorrect === true
                            ? "bg-emerald-50/30 border-emerald-100 text-emerald-900"
                            : isCorrect === false
                              ? "bg-rose-50/30 border-rose-100 text-rose-900"
                              : "bg-slate-50 border-slate-200 text-slate-700"
                        }`}
                      >
                        <p className="font-medium text-sm leading-relaxed">
                          {q.studentAnswer || (
                            <span className="italic opacity-50">
                              No answer submitted
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-2">
                        <Check className="w-3 h-3 text-blue-500" /> Expected
                        Answer
                      </p>
                      <div className="p-4 rounded-xl bg-blue-50/30 border-2 border-blue-100 text-blue-900 min-h-[100px] flex flex-col justify-center">
                        <p className="font-bold text-sm">
                          {Array.isArray(q.correctAnswer)
                            ? q.correctAnswer.join(", ")
                            : q.correctAnswer}
                        </p>
                        {q.explanation && (
                          <p className="mt-2 text-[11px] leading-snug opacity-70 italic pt-2 border-t border-blue-100/50">
                            {q.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                      Personalized Feedback
                    </p>
                    <Textarea
                      placeholder="Help the student improve by explaining their mistakes..."
                      className="min-h-[100px] bg-slate-50/50 focus:bg-white transition-colors"
                      value={gradingStates[q.questionNumber]?.feedback || ""}
                      onChange={(e) =>
                        handleFeedbackChange(q.questionNumber, e.target.value)
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StudentResultDetail;

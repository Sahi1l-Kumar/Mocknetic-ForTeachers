import { useState, type JSX } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface QuestionAnswer {
  questionId: string;
  questionNumber: number;
  questionText: string;
  questionType: "mcq" | "descriptive" | "numerical";
  correctAnswer: string | string[];
  studentAnswer: string | string[];
  isCorrect: boolean | null;
  pointsAwarded: number;
  pointsPossible: number;
  feedback?: string;
  needsReview: boolean;
}

const StudentResultDetail = () => {
  const { assessmentId, resultId } = useParams();
  const navigate = useNavigate();

  const [result] = useState({
    id: resultId,
    studentName: "John Doe",
    studentEmail: "john@example.com",
    assessmentTitle: "Mid-term Exam",
    score: 85,
    totalPoints: 100,
    percentage: 85,
    submittedAt: "2026-01-08T10:30:00",
    timeSpent: 45,
  });

  const [answers, setAnswers] = useState<QuestionAnswer[]>([
    {
      questionId: "q1",
      questionNumber: 1,
      questionText: "What is the time complexity of binary search?",
      questionType: "mcq",
      correctAnswer: "O(log n)",
      studentAnswer: "O(log n)",
      isCorrect: true,
      pointsAwarded: 2,
      pointsPossible: 2,
      needsReview: false,
    },
    {
      questionId: "q2",
      questionNumber: 2,
      questionText: "Explain the concept of polymorphism in OOP.",
      questionType: "descriptive",
      correctAnswer:
        "Polymorphism allows objects of different classes to be treated as objects of a common parent class...",
      studentAnswer:
        "Polymorphism means many forms. It allows methods to do different things based on the object.",
      isCorrect: null,
      pointsAwarded: 0,
      pointsPossible: 10,
      feedback: "",
      needsReview: true,
    },
    {
      questionId: "q3",
      questionNumber: 3,
      questionText: 'What is the output of: console.log(2 + "2")?',
      questionType: "mcq",
      correctAnswer: '"22"',
      studentAnswer: "4",
      isCorrect: false,
      pointsAwarded: 0,
      pointsPossible: 2,
      needsReview: false,
    },
  ]);

  const handleUpdateGrade = (
    questionId: string,
    points: number,
    feedback: string
  ) => {
    setAnswers(
      answers.map((a) =>
        a.questionId === questionId
          ? {
              ...a,
              pointsAwarded: points,
              feedback,
              isCorrect: points > 0,
              needsReview: false,
            }
          : a
      )
    );
    toast.success("Grade updated successfully");
  };

  const getAnswerIcon = (isCorrect: boolean | null) => {
    if (isCorrect === null) {
      return <AlertCircle className="h-5 w-5 text-orange-600" />;
    }
    return isCorrect ? (
      <CheckCircle className="h-5 w-5 text-green-600" />
    ) : (
      <XCircle className="h-5 w-5 text-red-600" />
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate(`/assessment/${assessmentId}/results`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Results
        </Button>

        {/* Student Info Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{result.studentName}</CardTitle>
                <CardDescription className="text-base mt-1">
                  {result.studentEmail} • {result.assessmentTitle}
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">
                  {result.percentage}%
                </div>
                <div className="text-sm text-gray-600">
                  {result.score}/{result.totalPoints} points
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Submitted</p>
                <p className="font-medium">
                  {new Date(result.submittedAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Time Spent</p>
                <p className="font-medium">{result.timeSpent} minutes</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Correct Answers</p>
                <p className="font-medium text-green-600">
                  {answers.filter((a) => a.isCorrect === true).length}/
                  {answers.length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Needs Review</p>
                <p className="font-medium text-orange-600">
                  {answers.filter((a) => a.needsReview).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question-by-Question Breakdown */}
        <div className="space-y-4">
          {answers.map((answer) => (
            <QuestionCard
              key={answer.questionId}
              answer={answer}
              onUpdateGrade={handleUpdateGrade}
              getAnswerIcon={getAnswerIcon}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

// Question Card Component
interface QuestionCardProps {
  answer: QuestionAnswer;
  onUpdateGrade: (questionId: string, points: number, feedback: string) => void;
  getAnswerIcon: (isCorrect: boolean | null) => JSX.Element;
}

const QuestionCard = ({
  answer,
  onUpdateGrade,
  getAnswerIcon,
}: QuestionCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [points, setPoints] = useState(answer.pointsAwarded);
  const [feedback, setFeedback] = useState(answer.feedback || "");

  const handleSave = () => {
    onUpdateGrade(answer.questionId, points, feedback);
    setIsEditing(false);
  };

  return (
    <Card
      className={`${answer.needsReview ? "border-2 border-orange-400" : ""}`}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            {getAnswerIcon(answer.isCorrect)}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-lg">
                  Question {answer.questionNumber}
                </CardTitle>
                <Badge variant="outline">
                  {answer.questionType.toUpperCase()}
                </Badge>
                {answer.needsReview && (
                  <Badge
                    variant="outline"
                    className="border-orange-500 text-orange-600"
                  >
                    Needs Review
                  </Badge>
                )}
              </div>
              <CardDescription className="text-base">
                {answer.questionText}
              </CardDescription>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold">
              {answer.pointsAwarded}/{answer.pointsPossible}
            </p>
            <p className="text-sm text-gray-600">points</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Student Answer */}
        <div>
          <Label className="text-sm font-semibold text-gray-700">
            Student's Answer:
          </Label>
          <div className="mt-1 p-3 bg-slate-50 rounded-lg border">
            <p className="text-gray-900">{answer.studentAnswer}</p>
          </div>
        </div>

        {/* Correct Answer (for reference) */}
        {answer.questionType !== "descriptive" && (
          <div>
            <Label className="text-sm font-semibold text-gray-700">
              Correct Answer:
            </Label>
            <div className="mt-1 p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-900">{answer.correctAnswer}</p>
            </div>
          </div>
        )}

        {/* Grading Section */}
        {answer.needsReview && (
          <div className="border-t pt-4">
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                size="sm"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Grade This Answer
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`points-${answer.questionId}`}>
                      Points Awarded
                    </Label>
                    <Input
                      id={`points-${answer.questionId}`}
                      type="number"
                      min="0"
                      max={answer.pointsPossible}
                      value={points}
                      onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
                    />
                    <p className="text-sm text-gray-600">
                      Max: {answer.pointsPossible} points
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`feedback-${answer.questionId}`}>
                    Feedback (Optional)
                  </Label>
                  <Textarea
                    id={`feedback-${answer.questionId}`}
                    placeholder="Provide feedback to the student..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSave}>Save Grade</Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Existing Feedback */}
        {answer.feedback && !isEditing && (
          <div className="border-t pt-4">
            <Label className="text-sm font-semibold text-gray-700">
              Teacher Feedback:
            </Label>
            <div className="mt-1 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-900">{answer.feedback}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentResultDetail;

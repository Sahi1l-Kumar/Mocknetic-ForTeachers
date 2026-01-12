import { useState } from "react";
import type { ChangeEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { toast } from "sonner";
import { ArrowLeft, FileText, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { AxiosError } from "axios";

const CreateAssessment = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionMethod, setDescriptionMethod] = useState<"text" | "file">(
    "text"
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [evaluationCriteria, setEvaluationCriteria] = useState("");

  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium"
  );
  const [mcqCount, setMcqCount] = useState(10);
  const [descriptiveCount, setDescriptiveCount] = useState(5);
  const [numericalCount, setNumericalCount] = useState(5);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ];

      if (validTypes.includes(file.type)) {
        setSelectedFile(file);
      } else {
        toast.error("Invalid file type", {
          description: "Please upload a PDF, Word document, or text file",
        });
      }
    }
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("File upload failed");

      const data = await response.json();
      return data.url;
    } catch (err) {
      console.error("Error uploading file:", err);
      toast.error("Failed to upload file");
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!id) {
      toast.error("Error", { description: "Classroom ID is missing" });
      return;
    }

    if (!title.trim()) {
      toast.error("Error", { description: "Please enter an assessment title" });
      return;
    }

    if (descriptionMethod === "text" && !description.trim()) {
      toast.error("Error", {
        description: "Please enter a curriculum description",
      });
      return;
    }

    if (descriptionMethod === "file" && !selectedFile) {
      toast.error("Error", { description: "Please upload a curriculum file" });
      return;
    }

    const totalQuestions = mcqCount + descriptiveCount + numericalCount;

    if (totalQuestions === 0) {
      toast.error("Error", {
        description: "Please configure at least one question",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      let curriculumFile: string | undefined;

      // Upload file if file method is selected
      if (descriptionMethod === "file" && selectedFile) {
        const uploadedUrl = await uploadFile(selectedFile);
        if (!uploadedUrl) {
          setIsSubmitting(false);
          return;
        }
        curriculumFile = uploadedUrl;
      }

      // Prepare assessment data with questionConfig
      const assessmentData = {
        title: title.trim(),
        description:
          descriptionMethod === "text" ? description.trim() : undefined,
        curriculum:
          descriptionMethod === "text"
            ? description.trim()
            : selectedFile?.name || "",
        curriculumFile: curriculumFile,
        difficulty: difficulty,
        totalQuestions: totalQuestions,
        questionConfig: {
          mcq: mcqCount,
          descriptive: descriptiveCount,
          numerical: numericalCount,
        },
        skills: evaluationCriteria.trim()
          ? evaluationCriteria.split(",").map((s) => s.trim())
          : [],
      };

      // Create assessment
      const response = await api.classroom.createAssessment(id, assessmentData);

      if (response.data.success) {
        toast.success("Success!", {
          description:
            "Assessment created successfully. You can now edit or publish it.",
        });
        navigate(`/classroom/${id}`);
      }
    } catch (err) {
      console.error("Error creating assessment:", err);
      const error = err as AxiosError<{ error?: { message?: string } }>;
      const errorMessage =
        error.response?.data?.error?.message || "Failed to create assessment";
      toast.error("Error", { description: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />

      <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-4xl">
        <Button
          variant="ghost"
          className="mb-4"
          size="sm"
          onClick={() => navigate(`/classroom/${id}`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Back to Classroom</span>
          <span className="sm:hidden">Back</span>
        </Button>

        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Create New Assessment
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Design a comprehensive assessment for your students
          </p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">
                Basic Information
              </CardTitle>
              <CardDescription className="text-sm">
                Provide the assessment title and curriculum
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Assessment Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Mid-term Exam - Data Structures"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <Tabs
                value={descriptionMethod}
                onValueChange={(v) =>
                  setDescriptionMethod(v as "text" | "file")
                }
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="text">
                    <FileText className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Text Editor</span>
                    <span className="sm:hidden">Text</span>
                  </TabsTrigger>
                  <TabsTrigger value="file">
                    <Upload className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">File Upload</span>
                    <span className="sm:hidden">File</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="text" className="space-y-2">
                  <Label htmlFor="description">Curriculum / Topics *</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter curriculum topics, syllabus, concepts to be covered, etc.&#10;&#10;Example:&#10;- Arrays and Strings&#10;- Linked Lists&#10;- Trees and Graphs&#10;- Sorting Algorithms"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={8}
                    className="resize-none"
                  />
                  <p className="text-xs text-gray-500">
                    AI will generate questions based on this curriculum
                  </p>
                </TabsContent>

                <TabsContent value="file" className="space-y-2">
                  <Label htmlFor="file">Upload Curriculum File *</Label>
                  <div className="border-2 border-dashed rounded-lg p-4 sm:p-6 text-center hover:border-primary/50 transition-colors">
                    <Upload className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mb-2 sm:mb-4" />
                    <Input
                      id="file"
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileChange}
                      className="max-w-xs mx-auto cursor-pointer"
                    />
                    {selectedFile && (
                      <div className="mt-3 p-2 bg-blue-50 rounded-md">
                        <p className="text-sm font-medium text-blue-900 truncate">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-blue-600">
                          {(selectedFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    )}
                    <p className="text-xs sm:text-sm text-gray-500 mt-2">
                      Supported: PDF, Word (.doc, .docx), Text (.txt)
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Evaluation Criteria */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">
                Evaluation Skills (Optional)
              </CardTitle>
              <CardDescription className="text-sm">
                Define skills to evaluate (comma-separated)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="e.g., Problem Solving, Critical Thinking, Code Implementation, Algorithm Design"
                value={evaluationCriteria}
                onChange={(e) => setEvaluationCriteria(e.target.value)}
                rows={3}
                className="resize-none"
              />
              <p className="text-xs text-gray-500 mt-2">
                Separate multiple skills with commas
              </p>
            </CardContent>
          </Card>

          {/* Question Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">
                Question Configuration
              </CardTitle>
              <CardDescription className="text-sm">
                Configure the types and difficulty of questions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <Select
                  value={difficulty}
                  onValueChange={(v) =>
                    setDifficulty(v as "easy" | "medium" | "hard")
                  }
                >
                  <SelectTrigger id="difficulty">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mcq">MCQ Questions</Label>
                  <Input
                    id="mcq"
                    type="number"
                    min="0"
                    max="100"
                    value={mcqCount}
                    onChange={(e) => setMcqCount(parseInt(e.target.value) || 0)}
                  />
                  <p className="text-xs text-gray-500">Multiple choice</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descriptive">Descriptive</Label>
                  <Input
                    id="descriptive"
                    type="number"
                    min="0"
                    max="100"
                    value={descriptiveCount}
                    onChange={(e) =>
                      setDescriptiveCount(parseInt(e.target.value) || 0)
                    }
                  />
                  <p className="text-xs text-gray-500">Text answers</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numerical">Numerical</Label>
                  <Input
                    id="numerical"
                    type="number"
                    min="0"
                    max="100"
                    value={numericalCount}
                    onChange={(e) =>
                      setNumericalCount(parseInt(e.target.value) || 0)
                    }
                  />
                  <p className="text-xs text-gray-500">Number answers</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                <p className="text-sm font-medium text-blue-900">
                  Total Questions:{" "}
                  {mcqCount + descriptiveCount + numericalCount}
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Unique questions will be generated by AI for each student when
                  they join
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => navigate(`/classroom/${id}`)}
              className="w-full sm:w-auto"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Assessment"
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateAssessment;

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

const CreateAssessment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionMethod, setDescriptionMethod] = useState<"text" | "file">(
    "text"
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [evaluationCriteria, setEvaluationCriteria] = useState("");

  const [difficulty, setDifficulty] = useState("medium");
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
      ];

      if (validTypes.includes(file.type)) {
        setSelectedFile(file);
      } else {
        toast.error("Invalid file type", {
          description: "Please upload a PDF or Word document",
        });
      }
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Error", {
        description: "Please enter an assessment title",
      });
      return;
    }

    if (descriptionMethod === "text" && !description.trim()) {
      toast.error("Error", {
        description: "Please enter a description",
      });
      return;
    }

    if (descriptionMethod === "file" && !selectedFile) {
      toast.error("Error", {
        description: "Please upload a description file",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast.success("Success!", {
      description: "Assessment created successfully",
    });

    setIsSubmitting(false);
    navigate(`/classroom/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
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
            Create New Assessment
          </h1>
          <p className="text-gray-600 mt-1">
            Design a comprehensive assessment for your students
          </p>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Provide the assessment title and description
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Assessment Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Mid-term Exam"
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
                    Text Editor
                  </TabsTrigger>
                  <TabsTrigger value="file">
                    <Upload className="mr-2 h-4 w-4" />
                    File Upload
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="text" className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter assessment description, topics covered, instructions, etc."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                  />
                </TabsContent>

                <TabsContent value="file" className="space-y-2">
                  <Label htmlFor="file">Upload Description File</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <Input
                      id="file"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="max-w-xs mx-auto"
                    />
                    {selectedFile && (
                      <p className="mt-2 text-sm text-gray-600">
                        Selected: {selectedFile.name}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 mt-2">
                      Supported formats: PDF, Word (.doc, .docx)
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Evaluation Criteria */}
          <Card>
            <CardHeader>
              <CardTitle>Evaluation Criteria</CardTitle>
              <CardDescription>
                Define how the assessment will be evaluated
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter evaluation criteria, grading rubrics, marking scheme, etc."
                value={evaluationCriteria}
                onChange={(e) => setEvaluationCriteria(e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Question Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Question Configuration</CardTitle>
              <CardDescription>
                Configure the types and difficulty of questions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger id="difficulty">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                    <SelectItem value="mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mcq">Multiple Choice Questions</Label>
                  <Input
                    id="mcq"
                    type="number"
                    min="0"
                    value={mcqCount}
                    onChange={(e) => setMcqCount(parseInt(e.target.value) || 0)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descriptive">Descriptive Questions</Label>
                  <Input
                    id="descriptive"
                    type="number"
                    min="0"
                    value={descriptiveCount}
                    onChange={(e) =>
                      setDescriptiveCount(parseInt(e.target.value) || 0)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numerical">Numerical Questions</Label>
                  <Input
                    id="numerical"
                    type="number"
                    min="0"
                    value={numericalCount}
                    onChange={(e) =>
                      setNumericalCount(parseInt(e.target.value) || 0)
                    }
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-medium text-blue-900">
                  Total Questions:{" "}
                  {mcqCount + descriptiveCount + numericalCount}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4 justify-end">
            <Button
              variant="outline"
              onClick={() => navigate(`/classroom/${id}`)}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
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

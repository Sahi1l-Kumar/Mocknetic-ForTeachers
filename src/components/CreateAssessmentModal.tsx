import { useState } from "react";
import {
  X,
  FileText,
  AlignLeft,
  Upload,
  File,
  CheckCircle2,
  Calendar,
  Clock,
} from "lucide-react";

interface CreateAssessmentModalProps {
  classroomId: string;
  onClose: () => void;
}

function CreateAssessmentModal({
  classroomId,
  onClose,
}: CreateAssessmentModalProps) {
  const [step, setStep] = useState<"type" | "details" | "success">("type");
  const [assessmentType, setAssessmentType] = useState<"file" | "text" | null>(
    null
  );
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [duration, setDuration] = useState("30");
  const [curriculum, setCurriculum] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("success");
  };

  const handleComplete = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Create Assessment
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {step === "type" && "Choose curriculum input method"}
              {step === "details" && "Fill in assessment details"}
              {step === "success" && "Assessment created successfully"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {step === "type" && (
          <div className="p-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">
              How would you like to provide the course curriculum?
            </h3>

            <div className="grid grid-cols-2 gap-6">
              <button
                onClick={() => {
                  setAssessmentType("file");
                  setStep("details");
                }}
                className="group border-2 border-slate-200 rounded-xl p-8 hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
              >
                <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors">
                  <Upload className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">
                  Upload File
                </h4>
                <p className="text-slate-600">
                  Upload a PDF or Word document containing your course
                  curriculum
                </p>
                <div className="mt-4 text-sm text-slate-500">
                  Supported: PDF, DOC, DOCX
                </div>
              </button>

              <button
                onClick={() => {
                  setAssessmentType("text");
                  setStep("details");
                }}
                className="group border-2 border-slate-200 rounded-xl p-8 hover:border-emerald-500 hover:bg-emerald-50 transition-all text-left"
              >
                <div className="bg-emerald-100 w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-500 transition-colors">
                  <AlignLeft className="w-8 h-8 text-emerald-600 group-hover:text-white transition-colors" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">
                  Enter Text
                </h4>
                <p className="text-slate-600">
                  Type or paste your course curriculum directly into a text
                  editor
                </p>
                <div className="mt-4 text-sm text-slate-500">
                  Markdown supported
                </div>
              </button>
            </div>
          </div>
        )}

        {step === "details" && (
          <form onSubmit={handleSubmit} className="p-8">
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Assessment Title
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., React Hooks Assessment"
                    className="w-full pl-11 pr-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of what this assessment covers..."
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="dueDate"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Due Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      id="dueDate"
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="duration"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Duration (minutes)
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      id="duration"
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      min="5"
                      step="5"
                      className="w-full pl-11 pr-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              {assessmentType === "file" ? (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Course Curriculum File
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition-all">
                    {!uploadedFile ? (
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-700 font-semibold mb-2">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-sm text-slate-500">
                          PDF, DOC, or DOCX (max 10MB)
                        </p>
                        <input
                          id="file-upload"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileUpload}
                          className="hidden"
                          required
                        />
                      </label>
                    ) : (
                      <div className="flex items-center justify-center space-x-3 text-green-600">
                        <File className="w-8 h-8" />
                        <div className="text-left">
                          <p className="font-semibold">{uploadedFile.name}</p>
                          <p className="text-sm text-slate-600">
                            {(uploadedFile.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setUploadedFile(null)}
                          className="text-red-600 hover:text-red-700 ml-4"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <label
                    htmlFor="curriculum"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Course Curriculum Content
                  </label>
                  <textarea
                    id="curriculum"
                    value={curriculum}
                    onChange={(e) => setCurriculum(e.target.value)}
                    placeholder="Enter your course curriculum here...&#10;&#10;You can use markdown formatting:&#10;# Heading&#10;## Subheading&#10;- List item&#10;**bold text**"
                    rows={12}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none font-mono text-sm"
                    required
                  />
                  <p className="text-sm text-slate-500 mt-2">
                    Tip: The more detailed your curriculum, the better the AI
                    can generate relevant assessment questions
                  </p>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">
                  What happens next?
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>
                    • AI will analyze your curriculum and generate relevant
                    assessment questions
                  </li>
                  <li>• Students will be notified about the new assessment</li>
                  <li>• Assessment will be available until the due date</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setStep("type")}
                className="px-6 py-2.5 text-slate-700 hover:text-slate-900 font-medium transition-colors"
              >
                Back
              </button>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 text-slate-700 hover:text-slate-900 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-8 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-sm"
                >
                  Create Assessment
                </button>
              </div>
            </div>
          </form>
        )}

        {step === "success" && (
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-3">
                Assessment Created!
              </h3>
              <p className="text-lg text-slate-600 max-w-md mx-auto">
                Your assessment has been created and students will be notified.
                AI is now generating questions based on your curriculum.
              </p>
            </div>

            <div className="bg-linear-to-br from-blue-600 to-blue-700 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
                  <p className="text-blue-200 text-sm mb-1">Assessment Title</p>
                  <p className="text-white font-bold">{title}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
                  <p className="text-blue-200 text-sm mb-1">Due Date</p>
                  <p className="text-white font-bold">
                    {new Date(dueDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
                  <p className="text-blue-200 text-sm mb-1">Duration</p>
                  <p className="text-white font-bold">{duration} minutes</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
                  <p className="text-blue-200 text-sm mb-1">Type</p>
                  <p className="text-white font-bold capitalize">
                    {assessmentType}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <button
                onClick={handleComplete}
                className="bg-blue-600 text-white px-10 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateAssessmentModal;

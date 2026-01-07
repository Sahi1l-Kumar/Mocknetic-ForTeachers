import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, FileText, Trash2, Check } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';

interface UploadedFile {
  id: string;
  name: string;
  size: string;
}

export default function CreateAssessment() {
  const { classId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    topicName: '',
    topicDescription: '',
    evaluationCriteria: '',
    numberOfQuestions: 10,
    difficulty: 'Medium' as 'Easy' | 'Medium' | 'Hard',
    questionTypes: {
      mcq: true,
      descriptive: true,
      numerical: false,
    },
  });

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleInputChange = (
    field: string,
    value: string | number | boolean | Record<string, boolean>
  ) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleFileUpload = (files: FileList) => {
    const newFiles = Array.from(files).map((file) => ({
      id: Math.random().toString(36),
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
    }));
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const removeFile = (id: string) => {
    setUploadedFiles(uploadedFiles.filter((f) => f.id !== id));
  };

  const handleGenerateQuestions = () => {
    navigate(`/classes/${classId}`);
  };

  const handleSaveDraft = () => {
    navigate(`/classes/${classId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-4xl">
            <button
              onClick={() => navigate(`/classes/${classId}`)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Classroom
            </button>

            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Assessment</h1>
              <p className="text-gray-600">Design a comprehensive assessment for your students</p>
            </div>

            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  1. Assessment Title
                </h2>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Advanced Problem Solving Techniques"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  2. Topic Name
                </h2>
                <input
                  type="text"
                  value={formData.topicName}
                  onChange={(e) => handleInputChange('topicName', e.target.value)}
                  placeholder="e.g., Dynamic Programming Patterns"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  3. Topic Description
                </h2>
                <textarea
                  value={formData.topicDescription}
                  onChange={(e) => handleInputChange('topicDescription', e.target.value)}
                  placeholder="Provide a brief description of the topic/lesson..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  4. Upload Teaching Materials
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  Upload PDFs, presentations, documents, or lesson plans that will be used for evaluation
                </p>

                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-700 font-medium mb-1">Drag and drop files here</p>
                  <p className="text-sm text-gray-600 mb-4">or</p>
                  <label className="inline-block">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                      className="hidden"
                      accept=".pdf,.ppt,.pptx,.doc,.docx"
                    />
                    <Button variant="outline" size="sm" as="span">
                      Browse Files
                    </Button>
                  </label>
                  <p className="text-xs text-gray-500 mt-3">
                    PDF, PPT, PPTX, DOC, DOCX up to 25MB each
                  </p>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-medium text-gray-900 mb-3">Uploaded Files ({uploadedFiles.length})</h3>
                    <div className="space-y-2">
                      {uploadedFiles.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-blue-600" />
                            <div className="text-left">
                              <p className="text-sm font-medium text-gray-900">{file.name}</p>
                              <p className="text-xs text-gray-500">{file.size}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFile(file.id)}
                            className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  5. Evaluation Criteria
                </h2>
                <textarea
                  value={formData.evaluationCriteria}
                  onChange={(e) => handleInputChange('evaluationCriteria', e.target.value)}
                  placeholder="Enter keywords or rubrics that the AI should use while evaluating answers (e.g., time complexity, edge cases, code readability)."
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  6. Question Configuration
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Questions
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={formData.numberOfQuestions}
                      onChange={(e) =>
                        handleInputChange('numberOfQuestions', parseInt(e.target.value))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty Level
                    </label>
                    <div className="flex gap-3">
                      {['Easy', 'Medium', 'Hard'].map((level) => (
                        <button
                          key={level}
                          onClick={() => handleInputChange('difficulty', level)}
                          className={`px-6 py-2 rounded-lg font-medium transition-all ${
                            formData.difficulty === level
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Question Types
                    </label>
                    <div className="space-y-3">
                      {[
                        { key: 'mcq', label: 'Multiple Choice Questions (MCQ)' },
                        { key: 'descriptive', label: 'Descriptive Questions' },
                        { key: 'numerical', label: 'Numerical Questions' },
                      ].map(({ key, label }) => (
                        <label key={key} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.questionTypes[key as keyof typeof formData.questionTypes]}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                questionTypes: {
                                  ...formData.questionTypes,
                                  [key]: e.target.checked,
                                },
                              });
                            }}
                            className="w-5 h-5 text-blue-600 rounded"
                          />
                          <span className="text-gray-700 font-medium">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              <div className="flex gap-4 pt-4">
                <Button
                  variant="secondary"
                  onClick={handleSaveDraft}
                  fullWidth
                >
                  Save as Draft
                </Button>
                <Button
                  onClick={handleGenerateQuestions}
                  fullWidth
                  disabled={!formData.title || !formData.topicName}
                >
                  <Check className="w-5 h-5" />
                  Generate Questions
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

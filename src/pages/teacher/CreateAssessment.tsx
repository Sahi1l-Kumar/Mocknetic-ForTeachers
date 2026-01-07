import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Eye, Save } from 'lucide-react';
import { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import Modal from '../../components/Modal';
import { topics, mockQuestions } from '../../data/mockData';

type Difficulty = 'Easy' | 'Medium' | 'Hard';
type QuestionType = 'MCQ' | 'Descriptive' | 'Numerical';

interface AssessmentConfig {
  title: string;
  topic: string;
  difficulty: Difficulty[];
  questionTypes: QuestionType[];
  questionCounts: Record<QuestionType, number>;
}

export default function CreateAssessment() {
  const navigate = useNavigate();
  const { classId } = useParams();
  const [step, setStep] = useState(1);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  const [config, setConfig] = useState<AssessmentConfig>({
    title: '',
    topic: '',
    difficulty: [],
    questionTypes: [],
    questionCounts: {
      MCQ: 0,
      Descriptive: 0,
      Numerical: 0,
    },
  });

  const difficulties: Difficulty[] = ['Easy', 'Medium', 'Hard'];

  const toggleDifficulty = (diff: Difficulty) => {
    setConfig((prev) => ({
      ...prev,
      difficulty: prev.difficulty.includes(diff)
        ? prev.difficulty.filter((d) => d !== diff)
        : [...prev.difficulty, diff],
    }));
  };

  const toggleQuestionType = (type: QuestionType) => {
    setConfig((prev) => ({
      ...prev,
      questionTypes: prev.questionTypes.includes(type)
        ? prev.questionTypes.filter((t) => t !== type)
        : [...prev.questionTypes, type],
    }));
  };

  const updateQuestionCount = (type: QuestionType, count: number) => {
    setConfig((prev) => ({
      ...prev,
      questionCounts: {
        ...prev.questionCounts,
        [type]: Math.max(0, count),
      },
    }));
  };

  const totalQuestions = Object.values(config.questionCounts).reduce((a, b) => a + b, 0);

  const handleFinalize = () => {
    navigate(`/teacher/class/${classId}`);
  };

  const steps = [
    { number: 1, label: 'Basic Info' },
    { number: 2, label: 'Configure' },
    { number: 3, label: 'Review' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-800 text-white shadow-lg">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/teacher/class/${classId}`)}
              className="p-2 hover:bg-blue-700 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold">Create Assessment</h1>
              <p className="text-sm text-blue-100">Step {step} of 3</p>
            </div>
          </div>
          <Button variant="secondary" onClick={() => setPreviewModalOpen(true)}>
            <Eye className="w-5 h-5" />
            Preview
          </Button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((s, index) => (
              <div key={s.number} className="flex items-center flex-1">
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      step >= s.number
                        ? 'bg-blue-800 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step > s.number ? <Check className="w-5 h-5" /> : s.number}
                  </div>
                  <span
                    className={`ml-2 font-medium ${
                      step >= s.number ? 'text-gray-900' : 'text-gray-500'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 ${
                      step > s.number ? 'bg-blue-800' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {step === 1 && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assessment Title
                </label>
                <input
                  type="text"
                  value={config.title}
                  onChange={(e) => setConfig({ ...config, title: e.target.value })}
                  placeholder="e.g., Computer Vision Fundamentals"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Topic
                </label>
                <select
                  value={config.topic}
                  onChange={(e) => setConfig({ ...config, topic: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a topic</option>
                  {topics.map((topic) => (
                    <option key={topic} value={topic}>
                      {topic}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={() => setStep(2)}
                  disabled={!config.title.trim() || !config.topic}
                >
                  Next Step
                </Button>
              </div>
            </div>
          </Card>
        )}

        {step === 2 && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Configure Assessment</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Difficulty Levels
                </label>
                <div className="flex gap-3">
                  {difficulties.map((diff) => (
                    <button
                      key={diff}
                      onClick={() => toggleDifficulty(diff)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        config.difficulty.includes(diff)
                          ? 'bg-blue-800 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Question Types
                </label>
                <div className="space-y-3">
                  {(['MCQ', 'Descriptive', 'Numerical'] as QuestionType[]).map((type) => (
                    <div key={type} className="flex items-center gap-4">
                      <label className="flex items-center gap-3 flex-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={config.questionTypes.includes(type)}
                          onChange={() => toggleQuestionType(type)}
                          className="w-5 h-5 text-blue-800 rounded"
                        />
                        <span className="font-medium text-gray-900">{type}</span>
                      </label>
                      {config.questionTypes.includes(type) && (
                        <div className="flex items-center gap-2">
                          <label className="text-sm text-gray-600">Number of questions:</label>
                          <input
                            type="number"
                            min="0"
                            value={config.questionCounts[type]}
                            onChange={(e) =>
                              updateQuestionCount(type, parseInt(e.target.value) || 0)
                            }
                            className="w-20 px-3 py-1 border border-gray-300 rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total Questions:</span>
                  <span className="text-xl font-bold text-blue-800">{totalQuestions}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Previous
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={config.difficulty.length === 0 || totalQuestions === 0}
                  fullWidth
                >
                  Next Step
                </Button>
              </div>
            </div>
          </Card>
        )}

        {step === 3 && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Review & Finalize</h2>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Title</div>
                  <div className="font-semibold text-gray-900">{config.title}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Topic</div>
                  <div className="font-semibold text-gray-900">{config.topic}</div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">Difficulty Levels</div>
                <div className="flex gap-2">
                  {config.difficulty.map((diff) => (
                    <Badge key={diff} variant="info">
                      {diff}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-3">Question Distribution</div>
                <div className="space-y-2">
                  {config.questionTypes.map((type) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{type}</span>
                      <span className="text-blue-800 font-semibold">
                        {config.questionCounts[type]} questions
                      </span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-blue-800">
                      {totalQuestions} questions
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Previous
                </Button>
                <Button onClick={() => setPreviewModalOpen(true)} variant="secondary">
                  <Eye className="w-5 h-5" />
                  Preview
                </Button>
                <Button onClick={handleFinalize} fullWidth>
                  <Save className="w-5 h-5" />
                  Finalize & Publish
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      <Modal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        title="Assessment Preview"
        size="xl"
      >
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{config.title}</h3>
            <div className="flex items-center gap-3">
              <Badge variant="info">{config.topic}</Badge>
              {config.difficulty.map((diff) => (
                <Badge key={diff} variant="warning">
                  {diff}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {mockQuestions.slice(0, totalQuestions).map((question, index) => (
              <Card key={question.id} className="p-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-800 font-semibold text-sm">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <Badge variant="info" className="mb-2">
                      {question.type}
                    </Badge>
                    <p className="text-gray-900 font-medium mb-2">{question.question}</p>
                    {question.options && (
                      <div className="space-y-2 mt-3">
                        {question.options.map((option, i) => (
                          <div key={i} className="text-sm text-gray-600 pl-4">
                            {String.fromCharCode(65 + i)}. {option}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={() => setPreviewModalOpen(false)} fullWidth>
              Close Preview
            </Button>
            {step === 3 && (
              <Button onClick={handleFinalize} fullWidth>
                <Save className="w-5 h-5" />
                Finalize & Publish
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}

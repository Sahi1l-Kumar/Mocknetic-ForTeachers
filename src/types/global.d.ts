interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: "teacher" | "student";
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
  };
  message?: string;
}

interface Classroom {
  _id: string;
  name: string;
  description?: string;
  code: string;
  subject?: string;
  teacherId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  studentCount: number;
  assessmentCount: number;
}

interface ClassroomData {
  _id: string;
  name: string;
  description?: string;
  code: string;
  teacherId: string;
  subject?: string;
  isActive: boolean;
  studentCount: number;
  createdAt: string;
  updatedAt: string;
}

interface Student {
  _id: string;
  name: string;
  email: string;
  image?: string;
  username?: string;
}

interface StudentPerformance {
  _id: string;
  student: {
    _id: string;
    name: string;
    email: string;
    image?: string;
    username?: string;
  };
  enrolledAt: string;
  averageScore: number;
  completedAssessments: number;
}

interface Question {
  _id?: string;
  questionNumber: number;
  questionText: string;
  questionType: "mcq" | "numerical";
  options?: string[];
  correctAnswer?: string | string[] | number;
  points?: number;
  topic?: string;
  explanation?: string;
  variantId?: string;
  equationContent?: {
    latex: string;
    description: string;
    position: "inline" | "display";
  };
  cognitiveLevel?: string;
  bloomsLevel?: number;
}

interface Assessment {
  _id: string;
  classroomId: string;
  teacherId: string;
  title: string;
  description?: string;
  curriculum: string;
  curriculumFile?: string;
  enrichedCurriculumContent?: string;
  dueDate?: string;
  duration: number;
  difficulty: "easy" | "medium" | "hard";
  cognitiveLevel:
    | "knowledge"
    | "comprehension"
    | "application"
    | "analysis"
    | "synthesis"
    | "evaluation";
  totalQuestions: number;
  questionConfig: {
    mcq: number;
    numerical: number;
  };
  questionVariants?: QuestionVariant[];
  fairnessConfig: FairnessConfig;
  includesEquations: boolean;
  averageScore?: number;
  completedCount?: number;
  skills?: string[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

interface QuestionVariant {
  variantId: string;
  conceptId: string;
  topicArea: string;
  parameters: Record<string, number | string>;
  estimatedDifficulty: number;
  semanticSimilarityScore: number;
}

interface FairnessConfig {
  enableQuestionVariants: boolean;
  minVariantsPerConcept: number;
  maxDifficultyDeviation: number;
  requirementPerStudent: "unique_variants" | "same_difficulty" | "both";
}

interface CreateClassroomData {
  name: string;
  description?: string;
  subject?: string;
}

interface UpdateClassroomData {
  name?: string;
  description?: string;
  subject?: string;
  isActive?: boolean;
}

interface CreateAssessmentData {
  title: string;
  description?: string;
  curriculum: string;
  curriculumFile?: string;
  duration: number;
  difficulty: "easy" | "medium" | "hard";
  cognitiveLevel?:
    | "knowledge"
    | "comprehension"
    | "application"
    | "analysis"
    | "synthesis"
    | "evaluation";
  totalQuestions: number;
  questionConfig: {
    mcq: number;
    numerical: number;
  };
  skills?: string[];
  dueDate?: string;
  includesEquations?: boolean;
  fairnessConfig?: FairnessConfig;
}

interface UpdateAssessmentData {
  title?: string;
  description?: string;
  curriculum?: string;
  curriculumFile?: string;
  dueDate?: string;
  duration?: number;
  difficulty?: "easy" | "medium" | "hard";
  cognitiveLevel?:
    | "knowledge"
    | "comprehension"
    | "application"
    | "analysis"
    | "synthesis"
    | "evaluation";
  totalQuestions?: number;
  questionConfig?: {
    mcq: number;
    numerical: number;
  };
  skills?: string[];
  isPublished?: boolean;
  includesEquations?: boolean;
}

interface Grade {
  questionId: string;
  pointsAwarded: number;
  feedback?: string;
}

interface Submission {
  _id: string;
  assessmentId: string;
  studentId: string;
  classroomId: string;
  questions: Question[];
  answers: Array<{
    questionNumber: number;
    answer: string | number;
    isCorrect?: boolean;
  }>;
  score: number;
  totalPoints: number;
  percentage: number;
  status: "in_progress" | "submitted" | "evaluated";
  startedAt: string;
  submittedAt?: string;
  gradedAt?: string;
  variantIndices?: number[];
}

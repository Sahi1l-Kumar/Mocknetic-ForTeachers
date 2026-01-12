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
  subject?: string;
  code: string;
  teacherId: string;
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
  enrolledAt: string;
}

interface Question {
  questionText: string;
  questionType: "mcq" | "descriptive" | "numerical" | "coding";
  options?: string[];
  correctAnswer?: string | string[] | number;
  points?: number;
  difficulty?: "easy" | "medium" | "hard";
  topic?: string;
  explanation?: string;
}

interface Assessment {
  _id: string;
  classroomId: string;
  teacherId: string;
  title: string;
  description?: string;
  curriculum: string;
  curriculumFile?: string;
  dueDate?: string;
  difficulty: "easy" | "medium" | "hard";
  totalQuestions: number;
  skills?: string[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
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
  dueDate?: string;
  difficulty?: "easy" | "medium" | "hard";
  totalQuestions: number;
  skills?: string[];
  questions?: Question[];
}

interface UpdateAssessmentData {
  title?: string;
  description?: string;
  curriculum?: string;
  curriculumFile?: string;
  dueDate?: string;
  difficulty?: "easy" | "medium" | "hard";
  totalQuestions?: number;
  skills?: string[];
  isPublished?: boolean;
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
  answers: any[];
  score: number;
  totalPoints: number;
  percentage: number;
  status: "submitted" | "graded" | "pending_review";
  submittedAt: string;
  gradedAt?: string;
}

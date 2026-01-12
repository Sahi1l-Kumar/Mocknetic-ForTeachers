import axios, { type AxiosResponse } from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const api = {
  auth: {
    signIn: (
      email: string,
      password: string
    ): Promise<AxiosResponse<ApiResponse<{ user: User }>>> =>
      apiClient.post("/auth/teacher/signin", { email, password }),

    signOut: (): Promise<AxiosResponse<ApiResponse>> =>
      apiClient.post("/auth/teacher/signout"),

    getSession: (): Promise<AxiosResponse<{ user: User | null }>> =>
      apiClient.get("/auth/teacher/session"),
  },

  classroom: {
    getAll: (): Promise<AxiosResponse<ApiResponse<Classroom[]>>> =>
      apiClient.get("/classroom"),

    getById: (id: string): Promise<AxiosResponse<ApiResponse<Classroom>>> =>
      apiClient.get(`/classroom/${id}`),

    create: (
      data: CreateClassroomData
    ): Promise<AxiosResponse<ApiResponse<Classroom>>> =>
      apiClient.post("/classroom", data),

    update: (
      id: string,
      data: UpdateClassroomData
    ): Promise<AxiosResponse<ApiResponse<Classroom>>> =>
      apiClient.put(`/classroom/${id}`, data),

    delete: (id: string): Promise<AxiosResponse<ApiResponse>> =>
      apiClient.delete(`/classroom/${id}`),

    getStudents: (id: string): Promise<AxiosResponse<ApiResponse<Student[]>>> =>
      apiClient.get(`/classroom/${id}/student`),

    addStudent: (
      id: string,
      studentEmail: string
    ): Promise<AxiosResponse<ApiResponse>> =>
      apiClient.post(`/classroom/${id}/student`, { studentEmail }),

    removeStudent: (
      classroomId: string,
      studentId: string
    ): Promise<AxiosResponse<ApiResponse>> =>
      apiClient.delete(`/classroom/${classroomId}/student/${studentId}`),

    getAssessments: (
      id: string
    ): Promise<AxiosResponse<ApiResponse<Assessment[]>>> =>
      apiClient.get(`/classroom/${id}/assessment`),

    createAssessment: (
      id: string,
      data: CreateAssessmentData
    ): Promise<AxiosResponse<ApiResponse<Assessment>>> =>
      apiClient.post(`/classroom/${id}/assessment`, data),
  },

  assessment: {
    getById: (id: string): Promise<AxiosResponse<ApiResponse<Assessment>>> =>
      apiClient.get(`/classroom-assessment/${id}`),

    update: (
      id: string,
      data: UpdateAssessmentData
    ): Promise<AxiosResponse<ApiResponse<Assessment>>> =>
      apiClient.put(`/classroom-assessment/${id}`, data),

    delete: (id: string): Promise<AxiosResponse<ApiResponse>> =>
      apiClient.delete(`/classroom-assessment/${id}`),

    publish: (
      id: string,
      isPublished: boolean
    ): Promise<AxiosResponse<ApiResponse>> =>
      apiClient.post(`/classroom-assessment/${id}/publish`, { isPublished }),

    getResults: (
      id: string
    ): Promise<AxiosResponse<ApiResponse<Submission[]>>> =>
      apiClient.get(`/classroom-assessment/${id}/results`),
  },

  submission: {
    getById: (id: string): Promise<AxiosResponse<ApiResponse<Submission>>> =>
      apiClient.get(`/classroom-submission/${id}`),

    grade: (
      id: string,
      grades: Grade[]
    ): Promise<
      AxiosResponse<
        ApiResponse<{
          submissionId: string;
          score: number;
          totalPoints: number;
          percentage: number;
          status: string;
        }>
      >
    > => apiClient.post(`/classroom-submission/${id}/grade`, { grades }),
  },
};

export default apiClient;

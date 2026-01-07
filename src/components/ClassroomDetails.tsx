import { ArrowLeft, Users, FileText, HelpCircle, Code } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Card from "./Card";

interface ClassroomDetailsProps {
  id: string;
  name: string;
  section: string;
  subject: string;
  studentCount: number;
  assessmentCount: number;
  quizCount: number;
  code?: string;
}

export default function ClassroomDetails({
  name,
  section,
  subject,
  studentCount,
  assessmentCount,
  quizCount,
  code,
}: ClassroomDetailsProps) {
  const navigate = useNavigate();

  return (
    <>
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-lg mb-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold">{name}</h1>
            <p className="text-blue-100">
              {section} • {subject}
            </p>
          </div>
        </div>

        {code && (
          <div className="flex items-center gap-2 text-sm bg-white/20 w-fit px-3 py-2 rounded-lg">
            <Code className="w-4 h-4" />
            <span>
              Class Code: <strong>{code}</strong>
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-gray-600 text-sm">Enrolled Students</div>
              <div className="text-2xl font-bold text-gray-900">
                {studentCount}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-gray-600 text-sm">Assessments</div>
              <div className="text-2xl font-bold text-gray-900">
                {assessmentCount}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <HelpCircle className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-gray-600 text-sm">Quizzes</div>
              <div className="text-2xl font-bold text-gray-900">
                {quizCount}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

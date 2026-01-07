import { useNavigate } from 'react-router-dom';
import { GraduationCap, UserCircle } from 'lucide-react';
import Card from '../components/Card';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Mocknetic
          </h1>
          <p className="text-xl md:text-2xl text-blue-100">
            AI Career Platform
          </p>
          <p className="text-lg text-blue-200 mt-2">
            Select your role to continue
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <Card
            hover
            onClick={() => navigate('/student/dashboard')}
            className="p-8 text-center"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Student</h2>
              <p className="text-gray-600">
                Join classes, take assessments, and track your progress
              </p>
            </div>
          </Card>

          <Card
            hover
            onClick={() => navigate('/teacher/dashboard')}
            className="p-8 text-center"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
                <UserCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Teacher</h2>
              <p className="text-gray-600">
                Create classes, manage content, and evaluate students
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

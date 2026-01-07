import { useNavigate } from 'react-router-dom';
import { Users, FileText, HelpCircle, ArrowRight } from 'lucide-react';
import Card from './Card';
import Button from './Button';

interface ClassCardProps {
  id: string;
  name: string;
  section: string;
  subject: string;
  studentCount: number;
  assessmentCount: number;
  quizCount: number;
  coverImage?: string;
}

export default function ClassCard({
  id,
  name,
  section,
  subject,
  studentCount,
  assessmentCount,
  quizCount,
  coverImage,
}: ClassCardProps) {
  const navigate = useNavigate();

  return (
    <Card hover className="overflow-hidden group">
      {coverImage && (
        <div
          className="h-32 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
          style={{ backgroundImage: `url(${coverImage})` }}
        />
      )}
      <div className={`p-6 ${!coverImage && 'pt-8'}`}>
        <h3 className="text-xl font-bold text-gray-900 mb-1">{name}</h3>
        <p className="text-sm text-gray-600 mb-1">{section}</p>
        <p className="text-sm font-medium text-blue-600 mb-4">{subject}</p>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{studentCount} students</span>
          </div>
          <div className="flex items-center gap-1">
            <FileText className="w-4 h-4" />
            <span>{assessmentCount} assessments</span>
          </div>
          <div className="flex items-center gap-1">
            <HelpCircle className="w-4 h-4" />
            <span>{quizCount} quizzes</span>
          </div>
        </div>

        <Button
          onClick={() => navigate(`/classes/${id}`)}
          fullWidth
          size="md"
        >
          Open Class
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}

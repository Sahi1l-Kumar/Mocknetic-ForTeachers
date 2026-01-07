import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, FileText, Bell, HelpCircle, BookOpen } from 'lucide-react';
import { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { mockClasses } from '../../data/mockData';

type ContentType = 'assessment' | 'announcement' | 'quiz' | 'material';

export default function TeacherClassView() {
  const navigate = useNavigate();
  const { classId } = useParams();
  const [contentTypeModalOpen, setContentTypeModalOpen] = useState(false);
  const [selectedContentType, setSelectedContentType] = useState<ContentType | null>(null);

  const currentClass = mockClasses.find((c) => c.id === classId);

  if (!currentClass) {
    return <div>Class not found</div>;
  }

  const contentTypes = [
    {
      type: 'assessment' as ContentType,
      icon: FileText,
      label: 'Assessment',
      description: 'Create a comprehensive assessment with multiple question types',
      color: 'bg-blue-500',
    },
    {
      type: 'announcement' as ContentType,
      icon: Bell,
      label: 'Announcement',
      description: 'Share important updates with your students',
      color: 'bg-green-500',
    },
    {
      type: 'quiz' as ContentType,
      icon: HelpCircle,
      label: 'Quiz',
      description: 'Create a quick quiz to test student knowledge',
      color: 'bg-purple-500',
    },
    {
      type: 'material' as ContentType,
      icon: BookOpen,
      label: 'Material',
      description: 'Upload course materials, documents, or links',
      color: 'bg-orange-500',
    },
  ];

  const handleContentTypeSelect = (type: ContentType) => {
    setSelectedContentType(type);
    setContentTypeModalOpen(false);
    if (type === 'assessment') {
      navigate(`/teacher/class/${classId}/create-assessment`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div
        className="h-48 bg-gradient-to-r from-blue-800 to-blue-900 relative"
        style={{
          backgroundImage: `linear-gradient(rgba(30, 64, 175, 0.9), rgba(30, 64, 175, 0.9)), url(${currentClass.coverImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 flex flex-col justify-between p-6">
          <button
            onClick={() => navigate('/teacher/dashboard')}
            className="self-start p-2 hover:bg-white/20 rounded-lg text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{currentClass.name}</h1>
            <p className="text-blue-100">Class Code: {currentClass.code}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Class Workspace</h2>
                <p className="text-gray-600">
                  Create and manage content for your students
                </p>
              </div>
              <Button onClick={() => setContentTypeModalOpen(true)} size="lg">
                <Plus className="w-5 h-5" />
                Create Content
              </Button>
            </div>
          </Card>
        </div>

        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Plus className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Start Creating Content
          </h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            Click the "Create Content" button above to add assessments, announcements, quizzes, or materials to your class
          </p>
          <Button onClick={() => setContentTypeModalOpen(true)} size="lg">
            <Plus className="w-5 h-5" />
            Create Content
          </Button>
        </div>
      </div>

      <Modal
        isOpen={contentTypeModalOpen}
        onClose={() => setContentTypeModalOpen(false)}
        title="Select Content Type"
        size="lg"
      >
        <div className="grid md:grid-cols-2 gap-4">
          {contentTypes.map((content) => (
            <Card
              key={content.type}
              hover
              onClick={() => handleContentTypeSelect(content.type)}
              className="p-6 cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 ${content.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <content.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {content.label}
                  </h3>
                  <p className="text-sm text-gray-600">{content.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Modal>
    </div>
  );
}

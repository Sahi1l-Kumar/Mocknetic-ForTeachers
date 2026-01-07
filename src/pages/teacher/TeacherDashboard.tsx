import { useNavigate } from 'react-router-dom';
import { Plus, Users, Home, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { mockClasses } from '../../data/mockData';

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [className, setClassName] = useState('');
  const [classCode, setClassCode] = useState('');
  const [description, setDescription] = useState('');

  const handleCreateClass = () => {
    setCreateModalOpen(false);
    setClassName('');
    setClassCode('');
    setDescription('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-800 text-white shadow-lg">
        <div className="px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Mocknetic - Teacher Portal</h1>
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Home className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">My Classes</h2>
            <p className="text-gray-600 mt-1">Manage your classes and course content</p>
          </div>
          <Button onClick={() => setCreateModalOpen(true)}>
            <Plus className="w-5 h-5" />
            Create Class
          </Button>
        </div>

        {mockClasses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockClasses.map((cls) => (
              <Card key={cls.id} hover className="overflow-hidden group">
                <img
                  src={cls.coverImage}
                  alt={cls.name}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{cls.name}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {cls.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Users className="w-4 h-4" />
                      <span>{cls.studentCount} students</span>
                    </div>
                    <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                      {cls.code}
                    </span>
                  </div>
                  <Button
                    onClick={() => navigate(`/teacher/class/${cls.id}`)}
                    variant="primary"
                    fullWidth
                  >
                    Enter Class
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-16 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No classes yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Create your first class to start managing course content and engaging with students
            </p>
            <Button onClick={() => setCreateModalOpen(true)} size="lg">
              <Plus className="w-5 h-5" />
              Create Your First Class
            </Button>
          </Card>
        )}
      </div>

      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Class"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Class Name
            </label>
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="e.g., Computer Vision & Pattern Recognition"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Class Code
            </label>
            <input
              type="text"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value)}
              placeholder="e.g., CVPR2024"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">
              Students will use this code to join your class
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the class..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Image
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
              <div className="text-gray-400 mb-2">
                <svg
                  className="w-12 h-12 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={() => setCreateModalOpen(false)} fullWidth>
              Cancel
            </Button>
            <Button
              onClick={handleCreateClass}
              fullWidth
              disabled={!className.trim() || !classCode.trim()}
            >
              Create Class
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

import { useState } from 'react';
import Modal from './Modal';
import Button from './Button';

interface CreateClassroomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (classroom: { name: string; section: string; subject: string }) => void;
}

export default function CreateClassroomModal({
  isOpen,
  onClose,
  onCreate,
}: CreateClassroomModalProps) {
  const [name, setName] = useState('');
  const [section, setSection] = useState('');
  const [subject, setSubject] = useState('');

  const handleCreate = () => {
    if (name && section && subject) {
      onCreate({ name, section, subject });
      setName('');
      setSection('');
      setSubject('');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Classroom" size="md">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Classroom Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Data Structures 101"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Section / Class Code
          </label>
          <input
            type="text"
            value={section}
            onChange={(e) => setSection(e.target.value)}
            placeholder="e.g., Section A"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject / Topic
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g., Computer Science"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="secondary" onClick={onClose} fullWidth>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            fullWidth
            disabled={!name || !section || !subject}
          >
            Create Classroom
          </Button>
        </div>
      </div>
    </Modal>
  );
}

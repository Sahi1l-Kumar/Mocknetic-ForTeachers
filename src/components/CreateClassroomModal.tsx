import { useState } from "react";
import { X, BookOpen, Hash, Tag, CheckCircle2 } from "lucide-react";

interface CreateClassroomModalProps {
  onClose: () => void;
}

function CreateClassroomModal({ onClose }: CreateClassroomModalProps) {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  const generateClassCode = () => {
    const prefix = subject.slice(0, 3).toUpperCase() || "CLS";
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substring(2, 4).toUpperCase();
    return `${prefix}-${year}-${random}${Math.floor(Math.random() * 9) + 1}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = generateClassCode();
    setGeneratedCode(code);
  };

  const handleCopyAndClose = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">
            Create New Classroom
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {!generatedCode ? (
          <form onSubmit={handleSubmit} className="p-8">
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Classroom Name
                </label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Advanced Web Development"
                    className="w-full pl-11 pr-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Subject
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    id="subject"
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g., Computer Science"
                    className="w-full pl-11 pr-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the classroom..."
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Hash className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">
                      Class Code Generation
                    </h4>
                    <p className="text-sm text-blue-700">
                      A unique class code will be automatically generated when
                      you create this classroom. Students can use this code to
                      join your class.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 mt-8">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 text-slate-700 hover:text-slate-900 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-sm"
              >
                Create Classroom
              </button>
            </div>
          </form>
        ) : (
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Classroom Created Successfully!
              </h3>
              <p className="text-slate-600">
                Share this code with your students to let them join
              </p>
            </div>

            <div className="bg-linear-to-br from-blue-600 to-blue-700 rounded-xl p-8 text-center mb-6">
              <p className="text-blue-200 text-sm font-semibold uppercase tracking-wide mb-3">
                Class Code
              </p>
              <p className="text-5xl font-bold text-white font-mono tracking-wider mb-6">
                {generatedCode}
              </p>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
                <p className="text-sm text-white">
                  Students can enter this code to join{" "}
                  <span className="font-bold">{name}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4">
              <button
                onClick={handleCopyAndClose}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-sm"
              >
                Copy Code & Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateClassroomModal;

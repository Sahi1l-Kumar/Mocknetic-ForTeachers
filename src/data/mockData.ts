export interface Class {
    id: string;
    name: string;
    code: string;
    description: string;
    coverImage: string;
    studentCount: number;
    teacherName: string;
  }
  
  export interface Assessment {
    id: string;
    classId: string;
    title: string;
    topic: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    questionTypes: string[];
    totalQuestions: number;
    duration: number;
    status: 'Published' | 'Draft';
    createdAt: string;
  }
  
  export interface Question {
    id: string;
    type: 'MCQ' | 'Descriptive' | 'Numerical';
    question: string;
    options?: string[];
    correctAnswer?: string | number;
  }
  
  export interface Announcement {
    id: string;
    classId: string;
    title: string;
    content: string;
    createdAt: string;
  }
  
  export interface Quiz {
    id: string;
    classId: string;
    title: string;
    topic: string;
    questionCount: number;
    duration: number;
    status: 'Published' | 'Draft';
    createdAt: string;
  }
  
  export interface Material {
    id: string;
    classId: string;
    title: string;
    type: 'PDF' | 'Video' | 'Link' | 'Document';
    url: string;
    description: string;
    createdAt: string;
  }
  
  export const mockClasses: Class[] = [
    {
      id: 'cvpr',
      name: 'Computer Vision & Pattern Recognition',
      code: 'CVPR2024',
      description: 'Advanced computer vision techniques and pattern recognition algorithms',
      coverImage: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg',
      studentCount: 45,
      teacherName: 'Dr. Sarah Johnson',
    },
    {
      id: 'webdev',
      name: 'Full Stack Web Development',
      code: 'WEB101',
      description: 'Learn modern web development with React, Node.js, and databases',
      coverImage: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg',
      studentCount: 67,
      teacherName: 'Prof. Michael Chen',
    },
    {
      id: 'aiml',
      name: 'Artificial Intelligence & Machine Learning',
      code: 'AIML303',
      description: 'Deep dive into AI/ML algorithms, neural networks, and practical applications',
      coverImage: 'https://images.pexels.com/photos/8438918/pexels-photo-8438918.jpeg',
      studentCount: 52,
      teacherName: 'Dr. Emily Rodriguez',
    },
  ];
  
  export const mockAssessments: Assessment[] = [
    {
      id: 'assess1',
      classId: 'cvpr',
      title: 'Computer Vision Fundamentals',
      topic: 'Computer Vision',
      difficulty: 'Medium',
      questionTypes: ['MCQ', 'Descriptive'],
      totalQuestions: 15,
      duration: 45,
      status: 'Published',
      createdAt: '2024-01-15',
    },
    {
      id: 'assess2',
      classId: 'cvpr',
      title: 'Pattern Recognition Basics',
      topic: 'Machine Learning',
      difficulty: 'Easy',
      questionTypes: ['MCQ', 'Numerical'],
      totalQuestions: 20,
      duration: 30,
      status: 'Published',
      createdAt: '2024-01-10',
    },
  ];
  
  export const mockQuestions: Question[] = [
    {
      id: 'q1',
      type: 'MCQ',
      question: 'What is the primary purpose of convolutional neural networks in computer vision?',
      options: [
        'Text processing',
        'Image feature extraction',
        'Audio recognition',
        'Data compression',
      ],
      correctAnswer: 'Image feature extraction',
    },
    {
      id: 'q2',
      type: 'MCQ',
      question: 'Which activation function is commonly used in deep learning models?',
      options: ['Linear', 'ReLU', 'Constant', 'Binary'],
      correctAnswer: 'ReLU',
    },
    {
      id: 'q3',
      type: 'Descriptive',
      question: 'Explain the concept of transfer learning in computer vision and provide an example of its application.',
    },
    {
      id: 'q4',
      type: 'Numerical',
      question: 'If a convolutional layer has a kernel size of 3x3, stride of 1, and input size of 28x28, what is the output size (assuming no padding)?',
      correctAnswer: 26,
    },
    {
      id: 'q5',
      type: 'MCQ',
      question: 'What does CNN stand for in machine learning?',
      options: [
        'Computer Network Node',
        'Convolutional Neural Network',
        'Central Neural Node',
        'Compiled Network Notation',
      ],
      correctAnswer: 'Convolutional Neural Network',
    },
  ];
  
  export const mockAnnouncements: Announcement[] = [
    {
      id: 'ann1',
      classId: 'cvpr',
      title: 'Welcome to CVPR Course!',
      content: 'Welcome everyone! This course will cover advanced topics in computer vision and pattern recognition. Please complete the first assessment by end of this week.',
      createdAt: '2024-01-01',
    },
    {
      id: 'ann2',
      classId: 'cvpr',
      title: 'Mid-term Exam Schedule',
      content: 'The mid-term examination will be held on February 15th. Please prepare topics from modules 1-5.',
      createdAt: '2024-01-20',
    },
  ];
  
  export const mockQuizzes: Quiz[] = [
    {
      id: 'quiz1',
      classId: 'cvpr',
      title: 'Quick Quiz: Image Processing',
      topic: 'Image Processing',
      questionCount: 10,
      duration: 15,
      status: 'Published',
      createdAt: '2024-01-12',
    },
  ];
  
  export const mockMaterials: Material[] = [
    {
      id: 'mat1',
      classId: 'cvpr',
      title: 'Introduction to Computer Vision - Lecture Slides',
      type: 'PDF',
      url: '#',
      description: 'Comprehensive slides covering the basics of computer vision',
      createdAt: '2024-01-05',
    },
    {
      id: 'mat2',
      classId: 'cvpr',
      title: 'CNN Architecture Tutorial',
      type: 'Video',
      url: '#',
      description: 'Video tutorial explaining CNN architectures',
      createdAt: '2024-01-08',
    },
  ];
  
  export const topics = [
    'Artificial Intelligence',
    'Machine Learning',
    'Computer Vision',
    'Web Development',
    'Data Structures',
    'Algorithms',
    'Database Systems',
    'Cloud Computing',
    'Cybersecurity',
    'DevOps',
  ];
  
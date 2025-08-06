import React, { createContext, useContext, useState, useEffect } from 'react';

// Mock data for the LMS
const mockUsers = {
  student: {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@student.com',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    enrolledCourses: [1, 2, 3],
    completedLessons: [1, 2, 3, 4, 5],
    badges: ['First Course', 'Quick Learner', 'Dedicated Student'],
  },
  instructor: {
    id: 2,
    name: 'Dr. Sarah Wilson',
    email: 'sarah.wilson@instructor.com',
    role: 'instructor',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    courses: [1, 2, 4],
    totalStudents: 150,
    totalEarnings: 12450,
    avgRating: 4.8,
  }
};

const mockCourses = [
  {
    id: 1,
    title: 'React Fundamentals',
    instructor: 'Dr. Sarah Wilson',
    instructorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    description: 'Learn the basics of React development with hands-on projects',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop',
    duration: '8 weeks',
    level: 'Beginner',
    rating: 4.8,
    students: 1234,
    price: 99,
    category: 'Web Development',
    lessons: [
      { id: 1, title: 'Introduction to React', duration: '15:30', type: 'video', completed: true },
      { id: 2, title: 'JSX and Components', duration: '22:15', type: 'video', completed: true },
      { id: 3, title: 'Props and State', duration: '18:45', type: 'video', completed: true },
      { id: 4, title: 'Event Handling', duration: '20:30', type: 'video', completed: true },
      { id: 5, title: 'Conditional Rendering', duration: '16:20', type: 'video', completed: true },
      { id: 6, title: 'Lists and Keys', duration: '19:10', type: 'video', completed: false },
      { id: 7, title: 'Forms in React', duration: '25:40', type: 'video', completed: false },
      { id: 8, title: 'React Hooks', duration: '30:15', type: 'video', completed: false },
    ],
    progress: 62,
  },
  {
    id: 2,
    title: 'Advanced JavaScript',
    instructor: 'Dr. Sarah Wilson',
    instructorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    description: 'Master advanced JavaScript concepts and modern ES6+ features',
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop',
    duration: '6 weeks',
    level: 'Intermediate',
    rating: 4.9,
    students: 856,
    price: 129,
    category: 'Programming',
    lessons: [
      { id: 9, title: 'Closures and Scope', duration: '28:45', type: 'video', completed: false },
      { id: 10, title: 'Promises and Async/Await', duration: '32:20', type: 'video', completed: false },
    ],
    progress: 0,
  },
  {
    id: 3,
    title: 'UI/UX Design Principles',
    instructor: 'Maria Garcia',
    instructorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    description: 'Learn fundamental design principles for creating beautiful user interfaces',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop',
    duration: '10 weeks',
    level: 'Beginner',
    rating: 4.7,
    students: 2103,
    price: 149,
    category: 'Design',
    lessons: [
      { id: 11, title: 'Design Fundamentals', duration: '20:30', type: 'video', completed: false },
    ],
    progress: 25,
  },
  {
    id: 4,
    title: 'Node.js Backend Development',
    instructor: 'Mike Johnson',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    description: 'Build scalable backend applications with Node.js and Express',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop',
    duration: '12 weeks',
    level: 'Advanced',
    rating: 4.6,
    students: 743,
    price: 199,
    category: 'Backend Development',
    lessons: [],
    progress: 0,
  },
];

const mockLearningPaths = [
  {
    id: 1,
    title: 'Full Stack Developer',
    description: 'Complete path to become a full stack web developer',
    courses: [1, 2, 4],
    duration: '26 weeks',
    level: 'Beginner to Advanced',
    students: 2847,
  },
  {
    id: 2,
    title: 'Frontend Specialist',
    description: 'Master frontend development with React and modern tools',
    courses: [1, 3],
    duration: '18 weeks',
    level: 'Beginner to Intermediate',
    students: 1923,
  },
];

const LMSContext = createContext();

export const useLMS = () => {
  const context = useContext(LMSContext);
  if (!context) {
    throw new Error('useLMS must be used within an LMSProvider');
  }
  return context;
};

export const LMSProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState(mockCourses);
  const [learningPaths] = useState(mockLearningPaths);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate authentication check
    const savedUser = localStorage.getItem('lms_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password, role = 'student') => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const userData = role === 'instructor' ? mockUsers.instructor : mockUsers.student;
    setUser(userData);
    localStorage.setItem('lms_user', JSON.stringify(userData));
    setLoading(false);
    return userData;
  };

  const register = async (formData) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const userData = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      role: formData.role,
      avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face`,
      ...(formData.role === 'student' 
        ? { enrolledCourses: [], completedLessons: [], badges: [] }
        : { courses: [], totalStudents: 0, totalEarnings: 0, avgRating: 0 }
      )
    };
    
    setUser(userData);
    localStorage.setItem('lms_user', JSON.stringify(userData));
    setLoading(false);
    return userData;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('lms_user');
  };

  const enrollInCourse = (courseId) => {
    if (user && user.role === 'student') {
      const updatedUser = {
        ...user,
        enrolledCourses: [...user.enrolledCourses, courseId]
      };
      setUser(updatedUser);
      localStorage.setItem('lms_user', JSON.stringify(updatedUser));
    }
  };

  const markLessonComplete = (lessonId) => {
    if (user && user.role === 'student') {
      const updatedUser = {
        ...user,
        completedLessons: [...user.completedLessons, lessonId]
      };
      setUser(updatedUser);
      localStorage.setItem('lms_user', JSON.stringify(updatedUser));
    }
  };

  const getEnrolledCourses = () => {
    if (!user || user.role !== 'student') return [];
    return courses.filter(course => user.enrolledCourses.includes(course.id));
  };

  const getInstructorCourses = () => {
    if (!user || user.role !== 'instructor') return [];
    return courses.filter(course => user.courses.includes(course.id));
  };

  const value = {
    user,
    courses,
    learningPaths,
    loading,
    login,
    register,
    logout,
    enrollInCourse,
    markLessonComplete,
    getEnrolledCourses,
    getInstructorCourses,
  };

  return <LMSContext.Provider value={value}>{children}</LMSContext.Provider>;
};
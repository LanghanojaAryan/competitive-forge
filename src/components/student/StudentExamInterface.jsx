import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '../../hooks/use-toast';
import { useAuth } from '../../contexts/AuthContext';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { oneDark } from '@codemirror/theme-one-dark';
import { useTheme } from '../../contexts/ThemeContext';

const StudentExamInterface = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(7200); // 2 hours in seconds
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [loading, setLoading] = useState(true);
  const fullscreenRef = useRef(null);

  const languages = [
    { value: 'python', label: 'Python', extension: python() },
    { value: 'javascript', label: 'JavaScript', extension: javascript() },
    { value: 'cpp', label: 'C++', extension: cpp() }
  ];

  // Check fullscreen on component mount
  useEffect(() => {
    const checkFullscreen = () => {
      const isCurrentlyFullscreen = document.fullscreenElement !== null;
      setIsFullscreen(isCurrentlyFullscreen);
      
      if (!isCurrentlyFullscreen && exam) {
        // Show warning if not in fullscreen during exam
        toast({
          title: "Fullscreen Required",
          description: "Please return to fullscreen mode to continue the exam",
          variant: "destructive"
        });
      }
    };

    document.addEventListener('fullscreenchange', checkFullscreen);
    return () => document.removeEventListener('fullscreenchange', checkFullscreen);
  }, [exam, toast]);

  // Timer countdown
  useEffect(() => {
    if (!exam || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [exam, timeRemaining]);

  // Load exam data
  useEffect(() => {
    const fetchExam = async () => {
      try {
        setLoading(true);
        
        // Mock exam data
        const mockExam = {
          id: examId,
          title: 'Programming Fundamentals - Midterm Exam',
          duration: 120, // minutes
          class: { name: 'CS101 - Introduction to Programming' },
          instructions: 'Solve all problems within the time limit. You can switch between questions using the sidebar.',
          status: 'active'
        };

        const mockQuestions = [
          {
            id: 1,
            title: 'Two Sum',
            description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
            examples: [
              {
                input: 'nums = [2,7,11,15], target = 9',
                output: '[0,1]',
                explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
              }
            ],
            constraints: [
              '2 ≤ nums.length ≤ 10⁴',
              '-10⁹ ≤ nums[i] ≤ 10⁹',
              '-10⁹ ≤ target ≤ 10⁹'
            ],
            starterCode: {
              python: 'def twoSum(nums, target):\n    # Write your solution here\n    pass',
              javascript: 'function twoSum(nums, target) {\n    // Write your solution here\n}',
              cpp: '#include <vector>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    // Write your solution here\n}'
            },
            testCases: [
              { input: '[2,7,11,15], 9', expectedOutput: '[0,1]' },
              { input: '[3,2,4], 6', expectedOutput: '[1,2]' }
            ]
          },
          {
            id: 2,
            title: 'Reverse String',
            description: 'Write a function that reverses a string. The input string is given as an array of characters s.',
            examples: [
              {
                input: 's = ["h","e","l","l","o"]',
                output: '["o","l","l","e","h"]'
              }
            ],
            constraints: [
              '1 ≤ s.length ≤ 10⁵',
              's[i] is a printable ascii character.'
            ],
            starterCode: {
              python: 'def reverseString(s):\n    # Write your solution here\n    pass',
              javascript: 'function reverseString(s) {\n    // Write your solution here\n}',
              cpp: '#include <vector>\nusing namespace std;\n\nvoid reverseString(vector<char>& s) {\n    // Write your solution here\n}'
            },
            testCases: [
              { input: '["h","e","l","l","o"]', expectedOutput: '["o","l","l","e","h"]' },
              { input: '["H","a","n","n","a","h"]', expectedOutput: '["h","a","n","n","a","H"]' }
            ]
          },
          {
            id: 3,
            title: 'Valid Palindrome',
            description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.',
            examples: [
              {
                input: 's = "A man, a plan, a canal: Panama"',
                output: 'true',
                explanation: '"amanaplanacanalpanama" is a palindrome.'
              }
            ],
            constraints: [
              '1 ≤ s.length ≤ 2 × 10⁵',
              's consists only of printable ASCII characters.'
            ],
            starterCode: {
              python: 'def isPalindrome(s):\n    # Write your solution here\n    pass',
              javascript: 'function isPalindrome(s) {\n    // Write your solution here\n}',
              cpp: '#include <string>\nusing namespace std;\n\nbool isPalindrome(string s) {\n    // Write your solution here\n}'
            },
            testCases: [
              { input: '"A man, a plan, a canal: Panama"', expectedOutput: 'true' },
              { input: '"race a car"', expectedOutput: 'false' }
            ]
          }
        ];

        setExam(mockExam);
        setQuestions(mockQuestions);
        
        // Initialize answers
        const initialAnswers = {};
        mockQuestions.forEach(q => {
          initialAnswers[q.id] = {
            python: q.starterCode.python,
            javascript: q.starterCode.javascript,
            cpp: q.starterCode.cpp
          };
        });
        setAnswers(initialAnswers);

      } catch (error) {
        console.error('Error fetching exam:', error);
        toast({
          title: "Error",
          description: "Failed to load exam",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    if (examId) {
      fetchExam();
    }
  }, [examId, toast]);

  const enterFullscreen = async () => {
    try {
      if (fullscreenRef.current) {
        await fullscreenRef.current.requestFullscreen();
        setIsFullscreen(true);
        toast({
          title: "Fullscreen Activated",
          description: "You can now start your exam",
        });
      }
    } catch (error) {
      toast({
        title: "Fullscreen Failed",
        description: "Please allow fullscreen access to start the exam",
        variant: "destructive"
      });
    }
  };

  const exitFullscreen = async () => {
    try {
      await document.exitFullscreen();
      setIsFullscreen(false);
    } catch (error) {
      console.error('Error exiting fullscreen:', error);
    }
  };

  const handleCodeChange = (questionId, language, code) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [language]: code
      }
    }));
  };

  const handleSubmitExam = async () => {
    try {
      // Calculate completion status
      const totalQuestions = questions.length;
      const answeredQuestions = Object.keys(answers).filter(qId => {
        const answer = answers[qId]?.[selectedLanguage];
        return answer && answer.trim() !== questions.find(q => q.id.toString() === qId)?.starterCode?.[selectedLanguage];
      }).length;

      toast({
        title: "Exam Submitted",
        description: `You answered ${answeredQuestions} out of ${totalQuestions} questions`,
      });

      // Exit fullscreen and navigate back
      if (isFullscreen) {
        await exitFullscreen();
      }
      
      setTimeout(() => {
        navigate('/student/exams');
      }, 2000);
    } catch (error) {
      toast({
        title: "Submission Error",
        description: "Failed to submit exam. Please try again.",
        variant: "destructive"
      });
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getQuestionStatus = (questionId) => {
    const answer = answers[questionId]?.[selectedLanguage];
    const starterCode = questions.find(q => q.id === questionId)?.starterCode?.[selectedLanguage];
    
    if (!answer || answer === starterCode) return 'not-started';
    if (answer.trim() !== starterCode) return 'in-progress';
    return 'completed';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-yellow-500';
      default: return 'bg-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Fullscreen requirement check
  if (!isFullscreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-8">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Fullscreen Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              To maintain exam integrity, you must enter fullscreen mode before starting the exam.
            </p>
            <div className="space-y-2">
              <h4 className="font-medium">Exam Details:</h4>
              <p className="text-sm"><strong>Title:</strong> {exam?.title}</p>
              <p className="text-sm"><strong>Duration:</strong> {exam?.duration} minutes</p>
              <p className="text-sm"><strong>Questions:</strong> {questions.length}</p>
            </div>
            <Button onClick={enterFullscreen} className="w-full">
              Enter Fullscreen & Start Exam
            </Button>
            <Button variant="outline" onClick={() => navigate('/student/exams')} className="w-full">
              Cancel
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div ref={fullscreenRef} className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? '→' : '←'}
          </Button>
          <h1 className="text-lg font-bold">{exam?.title}</h1>
          <Badge variant="secondary">{exam?.class?.name}</Badge>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-muted-foreground">
            Question {currentQuestion + 1} of {questions.length}
          </div>
          <div className={`text-lg font-bold ${timeRemaining < 600 ? 'text-red-600' : 'text-primary'}`}>
            {formatTime(timeRemaining)}
          </div>
          <Button variant="destructive" onClick={handleSubmitExam}>
            Submit Exam
          </Button>
          <Button variant="outline" size="sm" onClick={exitFullscreen}>
            Exit Fullscreen
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Collapsible Sidebar */}
        <div className={`border-r transition-all duration-300 ${sidebarCollapsed ? 'w-12' : 'w-80'} bg-card`}>
          {!sidebarCollapsed && (
            <div className="p-4">
              <h3 className="font-medium mb-4">Questions</h3>
              <div className="space-y-2">
                {questions.map((q, index) => {
                  const status = getQuestionStatus(q.id);
                  return (
                    <div
                      key={q.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        currentQuestion === index ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                      }`}
                      onClick={() => setCurrentQuestion(index)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`} />
                          <span className="text-sm font-medium">
                            Q{index + 1}: {q.title}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-6 p-3 bg-muted rounded-lg">
                <div className="text-sm font-medium mb-2">Progress</div>
                <Progress 
                  value={(questions.filter(q => getQuestionStatus(q.id) !== 'not-started').length / questions.length) * 100} 
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {questions.filter(q => getQuestionStatus(q.id) === 'completed').length} completed, {' '}
                  {questions.filter(q => getQuestionStatus(q.id) === 'in-progress').length} in progress
                </div>
              </div>
            </div>
          )}
          
          {sidebarCollapsed && (
            <div className="p-2 space-y-1">
              {questions.map((q, index) => (
                <div
                  key={q.id}
                  className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold cursor-pointer ${
                    currentQuestion === index ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
                  }`}
                  onClick={() => setCurrentQuestion(index)}
                  title={`Question ${index + 1}: ${q.title}`}
                >
                  {index + 1}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Problem Description - Left Half */}
          <div className="w-1/2 p-6 overflow-y-auto">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">{currentQ?.title}</h2>
                <p className="text-muted-foreground">{currentQ?.description}</p>
              </div>

              {/* Examples */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Examples</h3>
                <div className="space-y-4">
                  {currentQ?.examples.map((example, index) => (
                    <div key={index} className="bg-muted p-4 rounded-lg">
                      <div className="space-y-2">
                        <div><strong>Input:</strong> <code>{example.input}</code></div>
                        <div><strong>Output:</strong> <code>{example.output}</code></div>
                        {example.explanation && (
                          <div><strong>Explanation:</strong> {example.explanation}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Test Cases */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Test Cases</h3>
                <div className="space-y-2">
                  {currentQ?.testCases.map((testCase, index) => (
                    <div key={index} className="bg-muted p-3 rounded text-sm">
                      <div><strong>Input:</strong> <code>{testCase.input}</code></div>
                      <div><strong>Expected Output:</strong> <code>{testCase.expectedOutput}</code></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Constraints */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Constraints</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {currentQ?.constraints.map((constraint, index) => (
                    <li key={index}>{constraint}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Code Editor - Right Half */}
          <div className="w-1/2 border-l flex flex-col">
            {/* Editor Header */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Code Editor</h3>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Code Editor */}
            <div className="flex-1">
              <CodeMirror
                value={answers[currentQ?.id]?.[selectedLanguage] || currentQ?.starterCode?.[selectedLanguage] || ''}
                onChange={(value) => handleCodeChange(currentQ?.id, selectedLanguage, value)}
                extensions={[languages.find(l => l.value === selectedLanguage)?.extension]}
                theme={isDarkMode ? oneDark : undefined}
                style={{ height: '100%', fontSize: '14px' }}
                basicSetup={{
                  lineNumbers: true,
                  foldGutter: true,
                  dropCursor: false,
                  allowMultipleSelections: false,
                  indentOnInput: true,
                  bracketMatching: true,
                  closeBrackets: true,
                  autocompletion: true,
                  highlightSelectionMatches: false,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentExamInterface;
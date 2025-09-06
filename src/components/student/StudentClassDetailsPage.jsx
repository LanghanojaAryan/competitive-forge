import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../ui/table';
import { useToast } from '../../hooks/use-toast';
import { useAuth } from '../../contexts/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import classesService from '../../services/classesService';

const StudentClassDetailsPage = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [classData, setClassData] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [studentPerformance, setStudentPerformance] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch class details
        const classResult = await classesService.getClassDetails(classId);
        if (classResult.success) {
          setClassData(classResult.data);
        }

        // Fetch class members/participants
        const membersResult = await classesService.listClassMembers(classId);
        if (membersResult.success) {
          setParticipants(membersResult.data.members || []);
        }

        // Mock student performance data
        const mockPerformance = {
          overallScore: 82.5,
          rank: 8,
          totalStudents: 25,
          completedExams: 4,
          totalExams: 5,
          averageSubmissionTime: '45 mins',
          strongestTopic: 'Arrays & Strings',
          weakestTopic: 'Dynamic Programming',
          recentScores: [
            { exam: 'Quiz 1', score: 85, date: '2024-01-10' },
            { exam: 'Midterm', score: 78, date: '2024-01-20' },
            { exam: 'Quiz 2', score: 92, date: '2024-01-25' },
            { exam: 'Assignment 1', score: 75, date: '2024-02-01' }
          ],
          progressData: [
            { week: 'Week 1', score: 75, classAvg: 72 },
            { week: 'Week 2', score: 78, classAvg: 75 },
            { week: 'Week 3', score: 85, classAvg: 78 },
            { week: 'Week 4', score: 82, classAvg: 82 },
            { week: 'Week 5', score: 88, classAvg: 79 },
            { week: 'Week 6', score: 92, classAvg: 85 }
          ]
        };
        setStudentPerformance(mockPerformance);

        // Mock leaderboard data
        const mockLeaderboard = [
          { rank: 1, name: 'Alice Johnson', score: 94.2, submissions: 12, avatar: null },
          { rank: 2, name: 'Bob Smith', score: 91.8, submissions: 11, avatar: null },
          { rank: 3, name: 'Carol White', score: 89.5, submissions: 12, avatar: null },
          { rank: 4, name: 'David Brown', score: 87.3, submissions: 10, avatar: null },
          { rank: 5, name: 'Emma Davis', score: 86.1, submissions: 12, avatar: null },
          { rank: 6, name: 'Frank Wilson', score: 84.7, submissions: 9, avatar: null },
          { rank: 7, name: 'Grace Lee', score: 83.9, submissions: 11, avatar: null },
          { rank: 8, name: user?.name || 'You', score: 82.5, submissions: 10, avatar: user?.avatar, isCurrentUser: true },
          { rank: 9, name: 'Henry Taylor', score: 81.2, submissions: 8, avatar: null },
          { rank: 10, name: 'Ivy Clark', score: 79.8, submissions: 11, avatar: null }
        ];
        setLeaderboard(mockLeaderboard);

      } catch (error) {
        console.error('Error fetching class details:', error);
        toast({
          title: "Error",
          description: "Failed to fetch class details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    if (classId) {
      fetchClassDetails();
    }
  }, [classId, toast, user]);

  const getPerformanceColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRankColor = (rank, total) => {
    const percentile = (rank / total) * 100;
    if (percentile <= 10) return 'text-green-600';
    if (percentile <= 25) return 'text-blue-600';
    if (percentile <= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Class not found</p>
        <Button onClick={() => navigate('/student/classes')} className="mt-4">
          Back to Classes
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <Button variant="outline" onClick={() => navigate('/student/classes')} className="mb-4">
            ← Back to My Classes
          </Button>
          <h1 className="text-3xl font-bold mb-2">{classData.class_name}</h1>
          <p className="text-muted-foreground">
            Class Code: <code className="bg-muted px-2 py-1 rounded">{classData.join_code}</code>
          </p>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overall Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getPerformanceColor(studentPerformance?.overallScore)}`}>
              {studentPerformance?.overallScore}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Class Rank</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getRankColor(studentPerformance?.rank, studentPerformance?.totalStudents)}`}>
              #{studentPerformance?.rank}
            </div>
            <div className="text-sm text-muted-foreground">of {studentPerformance?.totalStudents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed Exams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {studentPerformance?.completedExams}/{studentPerformance?.totalExams}
            </div>
            <Progress 
              value={(studentPerformance?.completedExams / studentPerformance?.totalExams) * 100} 
              className="mt-2" 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Submission Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {studentPerformance?.averageSubmissionTime}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Trend</CardTitle>
            <CardDescription>Your performance vs class average over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={studentPerformance?.progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={2} name="Your Score" />
                <Line type="monotone" dataKey="classAvg" stroke="#10B981" strokeWidth={2} strokeDasharray="5 5" name="Class Average" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Strengths & Weaknesses */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Analysis</CardTitle>
            <CardDescription>Your strongest and weakest areas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Strongest Topic</span>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Excellent
                </Badge>
              </div>
              <div className="text-lg font-semibold text-green-600">
                {studentPerformance?.strongestTopic}
              </div>
              <Progress value={92} className="mt-2" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Needs Improvement</span>
                <Badge variant="destructive" className="bg-red-100 text-red-800">
                  Focus Area
                </Badge>
              </div>
              <div className="text-lg font-semibold text-red-600">
                {studentPerformance?.weakestTopic}
              </div>
              <Progress value={65} className="mt-2" />
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-3">Recent Scores</h4>
              <div className="space-y-2">
                {studentPerformance?.recentScores.map((exam, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm">{exam.exam}</span>
                    <div className="flex items-center space-x-2">
                      <span className={`font-medium ${getPerformanceColor(exam.score)}`}>
                        {exam.score}%
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(exam.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard and Participants */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle>Class Leaderboard</CardTitle>
            <CardDescription>Top performers in the class</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaderboard.slice(0, 10).map((student) => (
                <div 
                  key={student.rank} 
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    student.isCurrentUser ? 'bg-primary/10 border border-primary/20' : 'bg-muted/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`text-sm font-bold w-6 ${
                      student.rank <= 3 ? 'text-yellow-600' : 'text-muted-foreground'
                    }`}>
                      #{student.rank}
                    </div>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={student.avatar} />
                      <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className={`font-medium ${student.isCurrentUser ? 'text-primary' : ''}`}>
                        {student.name}
                        {student.isCurrentUser && <span className="ml-1 text-xs">(You)</span>}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {student.submissions} submissions
                      </div>
                    </div>
                  </div>
                  <div className={`font-bold ${getPerformanceColor(student.score)}`}>
                    {student.score}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* All Participants */}
        <Card>
          <CardHeader>
            <CardTitle>Class Participants</CardTitle>
            <CardDescription>All students in this class ({participants.length} total)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {participants.map((participant, index) => (
                <div key={participant.id} className="flex items-center justify-between p-2">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={participant.avatar} />
                      <AvatarFallback>{participant.name?.charAt(0) || 'S'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {participant.name || 'Student'}
                        {participant.email === user?.email && <span className="ml-1 text-xs text-primary">(You)</span>}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {participant.email}
                      </div>
                    </div>
                  </div>
                  <Badge variant={participant.role === 'assistant' ? 'default' : 'secondary'}>
                    {participant.role || 'student'}
                  </Badge>
                </div>
              ))}
            </div>

            {participants.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No participants found in this class.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentClassDetailsPage;
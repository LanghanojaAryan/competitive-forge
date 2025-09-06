import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
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
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '../ui/dropdown-menu';
import { useToast } from '../../hooks/use-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import classesService from '../../services/classesService';

const ClassDetailsPage = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [classData, setClassData] = useState(null);
  const [students, setStudents] = useState([]);
  const [exams, setExams] = useState([]);
  const [analytics, setAnalytics] = useState(null);
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

        // Fetch class members
        const membersResult = await classesService.listClassMembers(classId);
        if (membersResult.success) {
          setStudents(membersResult.data.members || []);
        }

        // Mock exam data for this class
        const mockExams = [
          {
            id: 1,
            title: 'Midterm Exam - Programming Basics',
            date: '2024-01-25',
            duration: 120,
            totalStudents: 25,
            submittedStudents: 22,
            averageScore: 78.5,
            status: 'completed'
          },
          {
            id: 2,
            title: 'Quiz - Data Types',
            date: '2024-01-15',
            duration: 60,
            totalStudents: 25,
            submittedStudents: 25,
            averageScore: 85.2,
            status: 'completed'
          },
          {
            id: 3,
            title: 'Final Exam',
            date: '2024-02-15',
            duration: 180,
            totalStudents: 25,
            submittedStudents: 0,
            averageScore: null,
            status: 'scheduled'
          }
        ];
        setExams(mockExams);

        // Mock analytics data
        const mockAnalytics = {
          performanceData: [
            { week: 'Week 1', average: 72, submissions: 20 },
            { week: 'Week 2', average: 75, submissions: 22 },
            { week: 'Week 3', average: 78, submissions: 23 },
            { week: 'Week 4', average: 82, submissions: 25 },
            { week: 'Week 5', average: 79, submissions: 24 },
            { week: 'Week 6', average: 85, submissions: 25 }
          ],
          gradeDistribution: [
            { grade: 'A', count: 8, color: '#10B981' },
            { grade: 'B', count: 10, color: '#3B82F6' },
            { grade: 'C', count: 5, color: '#F59E0B' },
            { grade: 'D', count: 2, color: '#EF4444' },
            { grade: 'F', count: 0, color: '#6B7280' }
          ],
          engagementMetrics: {
            totalAssignments: 12,
            averageSubmissionTime: '2.5 hours',
            participationRate: 92,
            averageLoginFrequency: '4.2 times/week'
          }
        };
        setAnalytics(mockAnalytics);

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
  }, [classId, toast]);

  const handlePromoteStudent = async (studentId) => {
    try {
      const result = await classesService.promoteMember(classId, studentId);
      if (result.success) {
        // Refresh students list
        const membersResult = await classesService.listClassMembers(classId);
        if (membersResult.success) {
          setStudents(membersResult.data.members || []);
        }
        
        toast({
          title: "Success",
          description: "Student promoted to assistant successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to promote student",
        variant: "destructive"
      });
    }
  };

  const handleRemoveStudent = async (studentId) => {
    if (!confirm('Are you sure you want to remove this student from the class?')) {
      return;
    }

    try {
      const result = await classesService.removeMember(classId, studentId);
      if (result.success) {
        // Refresh students list
        const membersResult = await classesService.listClassMembers(classId);
        if (membersResult.success) {
          setStudents(membersResult.data.members || []);
        }
        
        toast({
          title: "Success",
          description: "Student removed from class successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove student",
        variant: "destructive"
      });
    }
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
        <Button onClick={() => navigate('/teacher/classes')} className="mt-4">
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
          <Button variant="outline" onClick={() => navigate('/teacher/classes')} className="mb-4">
            ← Back to Classes
          </Button>
          <h1 className="text-3xl font-bold mb-2">{classData.class_name}</h1>
          <p className="text-muted-foreground">
            Class Code: <code className="bg-muted px-2 py-1 rounded">{classData.join_code}</code>
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate(`/teacher/classes/${classId}/exams`)}>
            Manage Exams
          </Button>
          <Button onClick={() => navigate(`/teacher/exams?class=${classId}`)}>
            Create Exam
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{students.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Exams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{exams.filter(e => e.status === 'active').length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed Exams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{exams.filter(e => e.status === 'completed').length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Class Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {exams.filter(e => e.averageScore).length > 0 
                ? Math.round(exams.filter(e => e.averageScore).reduce((sum, e) => sum + e.averageScore, 0) / exams.filter(e => e.averageScore).length)
                : '--'}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="analytics">Class Analytics</TabsTrigger>
          <TabsTrigger value="students">Student Management</TabsTrigger>
          <TabsTrigger value="exams">Exam Section</TabsTrigger>
        </TabsList>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Over Time */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Class performance over the past weeks</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics?.performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="average" stroke="#3B82F6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Grade Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Grade Distribution</CardTitle>
                <CardDescription>Overall grade distribution for the class</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics?.gradeDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ grade, count }) => `${grade}: ${count}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {analytics?.gradeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Engagement Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Engagement Metrics</CardTitle>
              <CardDescription>Student engagement and participation statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{analytics?.engagementMetrics.totalAssignments}</div>
                  <div className="text-sm text-muted-foreground">Total Assignments</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{analytics?.engagementMetrics.averageSubmissionTime}</div>
                  <div className="text-sm text-muted-foreground">Avg Submission Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{analytics?.engagementMetrics.participationRate}%</div>
                  <div className="text-sm text-muted-foreground">Participation Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{analytics?.engagementMetrics.averageLoginFrequency}</div>
                  <div className="text-sm text-muted-foreground">Login Frequency</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Student Management Tab */}
        <TabsContent value="students" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Management</CardTitle>
              <CardDescription>Manage students in your class</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined Date</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src={student.avatar} />
                              <AvatarFallback>{student.name?.charAt(0) || 'S'}</AvatarFallback>
                            </Avatar>
                            <div className="font-medium">{student.name || 'Student'}</div>
                          </div>
                        </TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>
                          <Badge variant={student.role === 'assistant' ? 'default' : 'secondary'}>
                            {student.role || 'student'}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(student.joined_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="w-full">
                            <Progress value={Math.random() * 100} className="mb-1" />
                            <div className="text-xs text-muted-foreground">
                              {Math.round(Math.random() * 100)}% complete
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">⋮</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => navigate(`/student/${student.id}/profile`)}>
                                View Profile
                              </DropdownMenuItem>
                              {student.role !== 'assistant' && (
                                <DropdownMenuItem onClick={() => handlePromoteStudent(student.id)}>
                                  Promote to Assistant
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem 
                                onClick={() => handleRemoveStudent(student.id)}
                                className="text-red-600"
                              >
                                Remove from Class
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {students.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No students enrolled in this class yet.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Exam Section Tab */}
        <TabsContent value="exams" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Class Exams</CardTitle>
              <CardDescription>Manage exams for this class</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Exam</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Average Score</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {exams.map((exam) => (
                      <TableRow key={exam.id}>
                        <TableCell>
                          <div className="font-medium">{exam.title}</div>
                        </TableCell>
                        <TableCell>{new Date(exam.date).toLocaleDateString()}</TableCell>
                        <TableCell>{exam.duration} mins</TableCell>
                        <TableCell>
                          <div>{exam.submittedStudents}/{exam.totalStudents}</div>
                          <Progress 
                            value={(exam.submittedStudents / exam.totalStudents) * 100} 
                            className="w-20 h-2 mt-1" 
                          />
                        </TableCell>
                        <TableCell>
                          {exam.averageScore ? `${exam.averageScore}%` : '--'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={exam.status === 'completed' ? 'default' : 'secondary'}>
                            {exam.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">⋮</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => navigate(`/teacher/exams/${exam.id}`)}>
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => navigate(`/teacher/exams/${exam.id}/results`)}>
                                View Results
                              </DropdownMenuItem>
                              {exam.status === 'draft' && (
                                <DropdownMenuItem onClick={() => navigate(`/teacher/exams/${exam.id}/edit`)}>
                                  Edit Exam
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {exams.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="mb-4">No exams created for this class yet.</p>
                  <Button onClick={() => navigate(`/teacher/exams?class=${classId}`)}>
                    Create First Exam
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClassDetailsPage;
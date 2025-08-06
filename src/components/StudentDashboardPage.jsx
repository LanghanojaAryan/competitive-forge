import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  BookOpen,
  Clock,
  Award,
  TrendingUp,
  Calendar,
  PlayCircle,
  Star,
  Users,
  ChevronRight,
} from 'lucide-react';
import { useLMS } from '@/contexts/LMSContext';

const StudentDashboardPage = () => {
  const navigate = useNavigate();
  const { user, courses, getEnrolledCourses } = useLMS();
  const enrolledCourses = getEnrolledCourses();

  const upcomingDeadlines = [
    { course: 'React Fundamentals', task: 'Complete Chapter 3 Quiz', dueDate: 'Tomorrow', priority: 'high' },
    { course: 'UI/UX Design Principles', task: 'Submit Design Portfolio', dueDate: 'In 3 days', priority: 'medium' },
    { course: 'React Fundamentals', task: 'Final Project Submission', dueDate: 'Next week', priority: 'low' },
  ];

  const recentAchievements = [
    { title: 'First Course', description: 'Completed your first course', icon: '🎯', earned: '2 days ago' },
    { title: 'Quick Learner', description: 'Completed 5 lessons in one day', icon: '⚡', earned: '1 week ago' },
    { title: 'Dedicated Student', description: 'Logged in for 7 consecutive days', icon: '🔥', earned: '2 weeks ago' },
  ];

  const recommendedCourses = courses.filter(course => !enrolledCourses.some(enrolled => enrolled.id === course.id)).slice(0, 3);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <Card className="bg-gradient-primary text-white border-0 shadow-elegant">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Welcome back, {user?.name}! 👋</CardTitle>
              <CardDescription className="text-white/80 mt-2">
                Ready to continue your learning journey? You're doing great!
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-sm text-white/80">Total Progress</div>
              <div className="text-3xl font-bold">68%</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Active Courses */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-primary" />
                  My Active Courses
                </CardTitle>
                <CardDescription>Continue where you left off</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/student/courses')}
              >
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {enrolledCourses.slice(0, 3).map((course) => (
                <div 
                  key={course.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer card-hover"
                  onClick={() => navigate(`/student/course/${course.id}`)}
                >
                  <div className="flex items-start space-x-4">
                    <img 
                      src={course.thumbnail} 
                      alt={course.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{course.title}</h3>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {course.instructor}
                      </p>
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <PlayCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recommended Courses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                Recommended for You
              </CardTitle>
              <CardDescription>Based on your learning preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendedCourses.map((course) => (
                  <div key={course.id} className="border rounded-lg p-4 card-hover cursor-pointer"
                       onClick={() => navigate(`/student/course/${course.id}`)}>
                    <img 
                      src={course.thumbnail} 
                      alt={course.title}
                      className="w-full h-32 rounded-lg object-cover mb-3"
                    />
                    <h3 className="font-semibold text-sm mb-1 line-clamp-2">{course.title}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{course.instructor}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs">
                        <Star className="h-3 w-3 text-yellow-500 mr-1" />
                        {course.rating}
                      </div>
                      <Badge variant="secondary" className="text-xs">{course.level}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-primary" />
                Upcoming Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingDeadlines.map((deadline, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm">{deadline.task}</h4>
                    <Badge variant={getPriorityColor(deadline.priority)} className="text-xs">
                      {deadline.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{deadline.course}</p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    {deadline.dueDate}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2 text-primary" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentAchievements.map((achievement, index) => (
                <div key={index} className="flex items-start space-x-3 p-2">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm">{achievement.title}</h4>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    <p className="text-xs text-muted-foreground">{achievement.earned}</p>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full mt-3">
                View All Badges
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">5</div>
                <div className="text-xs text-muted-foreground">Courses</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-success">15</div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-info">42h</div>
                <div className="text-xs text-muted-foreground">Learning</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-warning">12</div>
                <div className="text-xs text-muted-foreground">Certificates</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardPage;
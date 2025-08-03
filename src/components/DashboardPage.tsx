import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

const DashboardPage = ({ onViewChange }: any) => {
  const { user } = useAuth();

  // Prepare chart data
  const submissionData = [
    { name: 'Easy', value: user.submissionStats.easy.solved, total: user.submissionStats.easy.total, color: '#10B981' },
    { name: 'Medium', value: user.submissionStats.medium.solved, total: user.submissionStats.medium.total, color: '#F59E0B' },
    { name: 'Hard', value: user.submissionStats.hard.solved, total: user.submissionStats.hard.total, color: '#EF4444' }
  ];

  const skillsData = Object.entries(user.skills).map(([skill, level]) => ({
    skill,
    level,
    fullMark: 100
  }));

  const formatRatingTooltip = (value, name, props) => {
    if (name === 'rating') {
      return [`Rating: ${value}`, props.payload.contest];
    }
    return [value, name];
  };

  const formatHeatmapTooltip = (value, date) => {
    if (!value || !value.count) return null;
    return `${value.count} submissions on ${value.date}`;
  };

  const getHeatmapClassForValue = (value) => {
    if (!value || value.count === 0) return 'color-empty';
    if (value.count === 1) return 'color-scale-1';
    if (value.count === 2) return 'color-scale-2';
    if (value.count <= 3) return 'color-scale-3';
    return 'color-scale-4';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user.name}! Here's your coding progress overview.
        </p>
      </div>

      {/* Learning Features Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="card-colorful group hover:scale-[1.03] transition-all duration-300 cursor-pointer">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-gradient-primary rounded-xl shadow-primary">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <Badge className="achievement-badge">Popular</Badge>
            </div>
            <CardTitle className="text-xl bg-gradient-primary bg-clip-text text-transparent">
              Explore Courses
            </CardTitle>
            <CardDescription className="text-base">Master new skills with our comprehensive interactive course library</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => onViewChange?.('courses')}
              className="w-full button-gradient font-semibold py-3 text-lg"
            >
              Browse Courses
            </Button>
          </CardContent>
        </Card>

        <Card className="card-colorful group hover:scale-[1.03] transition-all duration-300 cursor-pointer">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-gradient-secondary rounded-xl shadow-secondary">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <Badge variant="secondary" className="bg-gradient-secondary text-white">Featured</Badge>
            </div>
            <CardTitle className="text-xl bg-gradient-secondary bg-clip-text text-transparent">
              Take Assessment
            </CardTitle>
            <CardDescription className="text-base">Test your knowledge with our gamified interactive exams</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => onViewChange?.('exam')}
              className="w-full button-secondary-gradient font-semibold py-3 text-lg"
            >
              Start Exam
            </Button>
          </CardContent>
        </Card>

        <Card className="card-colorful group hover:scale-[1.03] transition-all duration-300 cursor-pointer">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-gradient-warm rounded-xl shadow-elegant">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <Badge className="bg-gradient-warm text-white">Guided</Badge>
            </div>
            <CardTitle className="text-xl bg-gradient-warm bg-clip-text text-transparent">
              Learning Paths
            </CardTitle>
            <CardDescription className="text-base">Follow structured roadmaps tailored to achieve your goals</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => onViewChange?.('learning-paths')}
              variant="outline" 
              className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold py-3 text-lg transition-all"
            >
              View Paths
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="stats-card group hover:scale-[1.02] transition-transform duration-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Problems Solved</CardTitle>
              <div className="p-2 bg-gradient-primary rounded-lg shadow-primary">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">{user.problemsSolved}</div>
            <div className="text-sm text-muted-foreground mt-2">
              out of {user.submissionStats.easy.total + user.submissionStats.medium.total + user.submissionStats.hard.total} total
            </div>
          </CardContent>
        </Card>

        <Card className="stats-card group hover:scale-[1.02] transition-transform duration-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Current Rating</CardTitle>
              <div className="p-2 bg-gradient-secondary rounded-lg shadow-secondary">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold bg-gradient-secondary bg-clip-text text-transparent">{user.rating}</div>
            <Badge className="achievement-badge mt-2">
              {user.rank}
            </Badge>
          </CardContent>
        </Card>

        <Card className="stats-card group hover:scale-[1.02] transition-transform duration-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Acceptance Rate</CardTitle>
              <div className="p-2 bg-gradient-success rounded-lg shadow-success">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold bg-gradient-success bg-clip-text text-transparent">{user.acceptanceRate}%</div>
            <div className="text-sm text-muted-foreground mt-2">
              {user.problemsSolved} / {user.totalSubmissions} submissions
            </div>
          </CardContent>
        </Card>

        <Card className="stats-card group hover:scale-[1.02] transition-transform duration-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Badges Earned</CardTitle>
              <div className="p-2 bg-gradient-warm rounded-lg shadow-elegant">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold bg-gradient-warm bg-clip-text text-transparent">{user.badges.length}</div>
            <div className="text-sm text-muted-foreground mt-2">achievements unlocked</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* User Profile Summary */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Profile Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.profilePhoto} alt={user.name} />
                <AvatarFallback className="text-lg">
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">{user.name}</h3>
                <p className="text-muted-foreground">@{user.username}</p>
                <p className="text-sm text-muted-foreground">{user.university}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Easy Problems</span>
                  <span>{user.submissionStats.easy.solved}/{user.submissionStats.easy.total}</span>
                </div>
                <Progress value={(user.submissionStats.easy.solved / user.submissionStats.easy.total) * 100} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Medium Problems</span>
                  <span>{user.submissionStats.medium.solved}/{user.submissionStats.medium.total}</span>
                </div>
                <Progress value={(user.submissionStats.medium.solved / user.submissionStats.medium.total) * 100} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Hard Problems</span>
                  <span>{user.submissionStats.hard.solved}/{user.submissionStats.hard.total}</span>
                </div>
                <Progress value={(user.submissionStats.hard.solved / user.submissionStats.hard.total) * 100} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Problems Solved Chart */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Submission Statistics</CardTitle>
            <CardDescription>Distribution of solved problems by difficulty</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={submissionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {submissionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Rating History */}
        <Card className="lg:col-span-2 xl:col-span-1">
          <CardHeader>
            <CardTitle>Rating History</CardTitle>
            <CardDescription>Your contest performance over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={user.ratingHistory}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip labelFormatter={(value) => new Date(value).toLocaleDateString()} formatter={formatRatingTooltip} />
                <Line 
                  type="monotone" 
                  dataKey="rating" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Heatmap */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Activity Map</CardTitle>
            <CardDescription>Your coding activity over the past year</CardDescription>
          </CardHeader>
          <CardContent>
            <style>
              {`
                .react-calendar-heatmap .color-empty { fill: hsl(var(--muted)); }
                .react-calendar-heatmap .color-scale-1 { fill: hsl(var(--primary) / 0.3); }
                .react-calendar-heatmap .color-scale-2 { fill: hsl(var(--primary) / 0.5); }
                .react-calendar-heatmap .color-scale-3 { fill: hsl(var(--primary) / 0.7); }
                .react-calendar-heatmap .color-scale-4 { fill: hsl(var(--primary)); }
                .react-calendar-heatmap text { fill: hsl(var(--muted-foreground)); font-size: 10px; }
              `}
            </style>
            <CalendarHeatmap
              startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
              endDate={new Date()}
              values={user.activityData}
              classForValue={getHeatmapClassForValue}
              tooltipDataAttrs={(value) => {
                return {
                  'data-tip': formatHeatmapTooltip(value, value?.date),
                };
              }}
              showWeekdayLabels={true}
            />
          </CardContent>
        </Card>

        {/* Skills Radar Chart */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Skill Breakdown</CardTitle>
            <CardDescription>Your proficiency across different topics</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={skillsData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]} 
                  tick={{ fontSize: 10 }}
                  tickCount={6}
                />
                <Radar
                  name="Skill Level"
                  dataKey="level"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Badges Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
          <CardDescription>Badges you've earned for your coding accomplishments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {user.badges.map((badge, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 rounded-xl card-colorful group hover:scale-[1.02] transition-all duration-200">
                <div className="text-3xl p-2 bg-gradient-primary rounded-lg shadow-primary">{badge.icon}</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-lg bg-gradient-primary bg-clip-text text-transparent">{badge.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
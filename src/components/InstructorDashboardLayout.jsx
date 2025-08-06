import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  Bell,
  BookOpen,
  GraduationCap,
  Home,
  Menu,
  Search,
  Settings,
  User,
  LogOut,
  BarChart3,
  Plus,
  DollarSign,
  Users,
} from 'lucide-react';
import { useLMS } from '@/contexts/LMSContext';
import { useTheme } from '@/contexts/ThemeContext';

const InstructorDashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useLMS();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const sidebarItems = [
    { title: 'Dashboard', url: '/instructor/dashboard', icon: Home },
    { title: 'Course Management', url: '/instructor/courses', icon: BookOpen },
    { title: 'Student Analytics', url: '/instructor/analytics', icon: BarChart3 },
    { title: 'Create Content', url: '/instructor/create', icon: Plus },
    { title: 'Payouts', url: '/instructor/payouts', icon: DollarSign },
    { title: 'Profile', url: '/instructor/profile', icon: User },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/instructor/courses?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Sidebar */}
        <Sidebar className="border-r border-border">
          <SidebarContent>
            <div className="p-6 border-b border-border">
              <div className="flex items-center space-x-2">
                <GraduationCap className="h-8 w-8 text-primary" />
                <span className="text-lg font-semibold text-gradient">CodeArena LMS</span>
              </div>
              <div className="mt-2">
                <Badge variant="secondary" className="text-xs">
                  <Users className="h-3 w-3 mr-1" />
                  Instructor
                </Badge>
              </div>
            </div>

            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sidebarItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        onClick={() => navigate(item.url)}
                        className={`w-full justify-start ${
                          isActive(item.url) 
                            ? 'bg-primary/10 text-primary font-medium border-r-2 border-primary' 
                            : 'hover:bg-muted/50'
                        }`}
                      >
                        <item.icon className="h-4 w-4 mr-3" />
                        {item.title}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <SidebarTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SidebarTrigger>

              {/* Global Search */}
              <form onSubmit={handleSearch} className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search courses, students..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-80"
                  />
                </div>
              </form>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  5
                </Badge>
              </Button>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/instructor/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={toggleTheme}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-6">
            {children || <Outlet />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default InstructorDashboardLayout;
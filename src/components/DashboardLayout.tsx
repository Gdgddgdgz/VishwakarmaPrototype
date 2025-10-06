import { ReactNode } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Eye, 
  BarChart3, 
  Activity, 
  Settings, 
  Bell,
  User,
  ChevronRight,
  Camera
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

interface DashboardLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: Eye },
  { name: 'Live Monitor', href: '/monitor', icon: Camera },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Exercises', href: '/exercises', icon: Activity },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border flex flex-col">
        {/* Logo/Brand */}
        <div className="p-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-lg">ABT Digital Eye</h2>
              <p className="text-sm text-muted-foreground">Eye Health Monitor</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link key={item.name} to={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <item.icon className="w-4 h-4 mr-3" />
                  {item.name}
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </Button>
              </Link>
            );
          })}
        </nav>

        <Separator />

        {/* User Profile */}
        <div className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm">John Doe</p>
              <p className="text-xs text-muted-foreground">john.doe@email.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl">
                {navigation.find(item => item.href === location.pathname)?.name || 'Dashboard'}
              </h1>
              <p className="text-muted-foreground">
                Monitor your eye health and screen interaction
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
                <Badge variant="destructive" className="ml-2">3</Badge>
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
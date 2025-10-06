import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { useEyeTracking } from '../EyeTrackingContext';
import { 
  Eye, 
  Timer, 
  AlertTriangle, 
  TrendingUp,
  Monitor,
  Activity,
  CheckCircle2,
  Clock,
  Camera
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

const recentAlerts = [
  { time: '2:45 PM', type: 'Blink Rate', message: 'Low blink rate detected', severity: 'warning' },
  { time: '2:20 PM', type: 'Posture', message: 'Too close to screen', severity: 'error' },
  { time: '1:55 PM', type: '20-20-20 Rule', message: 'Time for break reminder', severity: 'info' },
  { time: '1:30 PM', type: 'Exercise', message: 'Eye exercise completed', severity: 'success' },
];

export function Overview() {
  const { state } = useEyeTracking();

  // Generate chart data from real tracking history
  const generateBlinkData = () => {
    if (state.blinkHistory.length === 0) {
      // Fallback sample data if no real data available
      return [
        { time: '9:00', blinks: 18 },
        { time: '10:00', blinks: 15 },
        { time: '11:00', blinks: 12 },
        { time: '12:00', blinks: 20 },
        { time: '13:00', blinks: 22 },
        { time: '14:00', blinks: 14 },
        { time: '15:00', blinks: 11 },
        { time: '16:00', blinks: 13 },
        { time: '17:00', blinks: 16 },
      ];
    }

    // Group real data by hour
    const hourlyData: { [key: string]: number[] } = {};
    state.blinkHistory.forEach(entry => {
      const hour = new Date(entry.timestamp).getHours();
      const timeKey = `${hour}:00`;
      if (!hourlyData[timeKey]) {
        hourlyData[timeKey] = [];
      }
      hourlyData[timeKey].push(entry.blinkRate);
    });

    // Calculate averages for each hour
    return Object.entries(hourlyData).map(([time, rates]) => ({
      time,
      blinks: rates.reduce((sum, rate) => sum + rate, 0) / rates.length
    })).sort((a, b) => parseInt(a.time) - parseInt(b.time));
  };

  const blinkData = generateBlinkData();

  const getBlinkRateStatus = (rate: number) => {
    if (rate >= 15 && rate <= 20) return { status: 'Good', variant: 'default' as const };
    if (rate >= 12 && rate < 15) return { status: 'Low', variant: 'secondary' as const };
    return { status: 'Critical', variant: 'destructive' as const };
  };

  const getDistanceStatus = (distance: number) => {
    if (distance >= 50) return { status: 'Good', variant: 'default' as const };
    if (distance >= 40) return { status: 'Fair', variant: 'secondary' as const };
    return { status: 'Too Close', variant: 'destructive' as const };
  };

  const blinkStatus = getBlinkRateStatus(state.currentBlinkRate);
  const distanceStatus = getDistanceStatus(state.currentDistance);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Blink Rate</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{state.currentBlinkRate.toFixed(1)}/min</div>
            <p className="text-xs text-muted-foreground">
              {state.currentBlinkRate < 15 ? (
                <span className="text-destructive">-{(15 - state.currentBlinkRate).toFixed(1)} from optimal</span>
              ) : (
                <span className="text-green-600">Within optimal range</span>
              )}
            </p>
            <div className="mt-2">
              <Badge variant={blinkStatus.variant}>{blinkStatus.status}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Screen Distance</CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{state.currentDistance.toFixed(0)}cm</div>
            <p className="text-xs text-muted-foreground">
              {state.currentDistance >= 40 ? (
                <span className="text-green-600">+{(state.currentDistance - 40).toFixed(0)}cm from minimum</span>
              ) : (
                <span className="text-destructive">{(40 - state.currentDistance).toFixed(0)}cm too close</span>
              )}
            </p>
            <div className="mt-2">
              <Badge variant={distanceStatus.variant}>{distanceStatus.status}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Screen Time</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{Math.floor(state.screenTime / 60)}h {state.screenTime % 60}m</div>
            <p className="text-xs text-muted-foreground">
              Today's session
            </p>
            <div className="mt-2">
              <Badge variant={state.screenTime > 480 ? "destructive" : state.screenTime > 240 ? "secondary" : "default"}>
                {state.screenTime > 480 ? "High" : state.screenTime > 240 ? "Moderate" : "Light"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Eye Health Score</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{state.dailyStats.eyeStrainScore}/100</div>
            <p className="text-xs text-muted-foreground">
              Based on current metrics
            </p>
            <div className="mt-2">
              <Badge variant={
                state.dailyStats.eyeStrainScore >= 80 ? "default" :
                state.dailyStats.eyeStrainScore >= 60 ? "secondary" : "destructive"
              }>
                {state.dailyStats.eyeStrainScore >= 80 ? "Excellent" :
                 state.dailyStats.eyeStrainScore >= 60 ? "Good" : "Needs Attention"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Blink Rate Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Blink Rate Trend</CardTitle>
            <CardDescription>
              Your blink rate throughout the day (optimal: 15-20 blinks/minute)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={blinkData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="blinks" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.3}
                  />
                  {/* Optimal range reference lines */}
                  <Area 
                    type="monotone" 
                    dataKey={() => 20} 
                    stroke="#10b981" 
                    strokeDasharray="5 5"
                    fill="none"
                  />
                  <Area 
                    type="monotone" 
                    dataKey={() => 15} 
                    stroke="#10b981" 
                    strokeDasharray="5 5"
                    fill="none"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Daily Goals */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Goals</CardTitle>
            <CardDescription>Track your eye health progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Eye Exercises</span>
                <span className="text-sm text-muted-foreground">3/5</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">20-20-20 Breaks</span>
                <span className="text-sm text-muted-foreground">8/12</span>
              </div>
              <Progress value={67} className="h-2" />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Optimal Blink Rate</span>
                <span className="text-sm text-muted-foreground">4/8 hours</span>
              </div>
              <Progress value={50} className="h-2" />
            </div>

            <div className="space-y-2 mt-4">
              <Link to="/monitor">
                <Button className="w-full" variant={state.isActive ? "secondary" : "default"}>
                  <Camera className="w-4 h-4 mr-2" />
                  {state.isActive ? "View Live Monitor" : "Start Eye Monitoring"}
                </Button>
              </Link>
              <Link to="/exercises">
                <Button className="w-full" variant="outline">
                  <Activity className="w-4 h-4 mr-2" />
                  Start Eye Exercise
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Alerts */}
      {(state.alerts.lowBlinkRate || state.alerts.tooCloseToScreen || state.alerts.poorPosture) && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-800">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Active Health Alerts
            </CardTitle>
            <CardDescription className="text-orange-700">
              Take action to improve your eye health
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {state.alerts.lowBlinkRate && (
              <div className="flex items-start space-x-3 p-3 bg-white rounded-md border border-orange-200">
                <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-orange-800">Low Blink Rate Detected</p>
                  <p className="text-xs text-orange-700">
                    Your blink rate is {state.currentBlinkRate.toFixed(1)}/min. Try to blink more consciously or take a break.
                  </p>
                </div>
              </div>
            )}
            
            {state.alerts.tooCloseToScreen && (
              <div className="flex items-start space-x-3 p-3 bg-white rounded-md border border-orange-200">
                <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-orange-800">Too Close to Screen</p>
                  <p className="text-xs text-orange-700">
                    You're {state.currentDistance.toFixed(0)}cm from screen. Move back to at least 40cm distance.
                  </p>
                </div>
              </div>
            )}
            
            {state.alerts.poorPosture && (
              <div className="flex items-start space-x-3 p-3 bg-white rounded-md border border-orange-200">
                <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-orange-800">Poor Posture Detected</p>
                  <p className="text-xs text-orange-700">
                    Your posture may be causing eye strain. Adjust your position and screen angle.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your eye tracking session history
          </CardDescription>
        </CardHeader>
        <CardContent>
          {state.isActive ? (
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 rounded-lg border border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm">Eye monitoring active</p>
                    <span className="text-xs text-muted-foreground">Now</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Tracking blink rate: {state.currentBlinkRate.toFixed(1)}/min, Distance: {state.currentDistance.toFixed(0)}cm
                  </p>
                </div>
              </div>
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">
                  Session time: {Math.floor(state.screenTime / 60)}h {state.screenTime % 60}m
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Camera className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                Start eye monitoring to see your activity here
              </p>
              <Link to="/monitor">
                <Button>
                  <Camera className="w-4 h-4 mr-2" />
                  Start Monitoring
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
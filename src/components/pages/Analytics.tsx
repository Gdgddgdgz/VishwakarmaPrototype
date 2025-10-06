import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { TrendingUp, TrendingDown, Eye, Timer, Monitor } from 'lucide-react';

const weeklyBlinkData = [
  { day: 'Mon', avgBlinks: 16, screenTime: 7.2 },
  { day: 'Tue', avgBlinks: 14, screenTime: 8.1 },
  { day: 'Wed', avgBlinks: 15, screenTime: 6.8 },
  { day: 'Thu', avgBlinks: 13, screenTime: 9.0 },
  { day: 'Fri', avgBlinks: 12, screenTime: 8.5 },
  { day: 'Sat', avgBlinks: 18, screenTime: 4.2 },
  { day: 'Sun', avgBlinks: 19, screenTime: 3.8 },
];

const monthlyTrends = [
  { month: 'Jan', eyeStrain: 65, exercises: 45, breaks: 78 },
  { month: 'Feb', eyeStrain: 58, exercises: 52, breaks: 82 },
  { month: 'Mar', eyeStrain: 52, exercises: 68, breaks: 85 },
  { month: 'Apr', eyeStrain: 48, exercises: 75, breaks: 88 },
  { month: 'May', eyeStrain: 45, exercises: 82, breaks: 92 },
];

const postureData = [
  { name: 'Good Posture', value: 45, color: '#10b981' },
  { name: 'Too Close', value: 35, color: '#f59e0b' },
  { name: 'Poor Angle', value: 20, color: '#ef4444' },
];

const exerciseCompletion = [
  { exercise: 'Palming', completed: 85, target: 100 },
  { exercise: 'Focus Shifting', completed: 72, target: 100 },
  { exercise: 'Figure Eight', completed: 90, target: 100 },
  { exercise: 'Blinking', completed: 78, target: 100 },
  { exercise: 'Eye Rolling', completed: 65, target: 100 },
];

export function Analytics() {
  return (
    <div className="space-y-6">
      {/* Time Period Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Detailed insights into your eye health patterns</p>
        </div>
        <Select defaultValue="week">
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Blink Rate</p>
                <p className="text-xl">15.2/min</p>
                <div className="flex items-center text-sm">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500">+2.1%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Timer className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Screen Time</p>
                <p className="text-xl">6.8h</p>
                <div className="flex items-center text-sm">
                  <TrendingDown className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500">-8.2%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Monitor className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Good Posture</p>
                <p className="text-xl">72%</p>
                <div className="flex items-center text-sm">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500">+5.4%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Health Score</p>
                <p className="text-xl">78/100</p>
                <Badge variant="secondary">Good</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="posture">Posture</TabsTrigger>
          <TabsTrigger value="exercises">Exercises</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Blink Rate & Screen Time</CardTitle>
                <CardDescription>
                  Correlation between screen time and blink frequency
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklyBlinkData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Area 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="avgBlinks" 
                        stroke="#3b82f6" 
                        fill="#3b82f6" 
                        fillOpacity={0.3}
                        name="Avg Blinks/min"
                      />
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="screenTime" 
                        stroke="#f59e0b"
                        name="Screen Time (hrs)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Health Trends</CardTitle>
                <CardDescription>
                  Eye strain, exercises, and break compliance over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="eyeStrain" 
                        stroke="#ef4444" 
                        name="Eye Strain %" 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="exercises" 
                        stroke="#10b981" 
                        name="Exercise Completion %" 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="breaks" 
                        stroke="#3b82f6" 
                        name="Break Compliance %" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="posture" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Posture Distribution</CardTitle>
                <CardDescription>
                  How you spend your screen time by posture quality
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={postureData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {postureData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Posture Alerts</CardTitle>
                <CardDescription>Recent posture-related notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm">Too close to screen</p>
                        <p className="text-xs text-muted-foreground">Distance: 32cm (min: 40cm)</p>
                      </div>
                      <Badge variant="destructive">High</Badge>
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm">Poor screen angle</p>
                        <p className="text-xs text-muted-foreground">Angle: 45° (optimal: 10-20°)</p>
                      </div>
                      <Badge variant="secondary">Medium</Badge>
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm">Good posture maintained</p>
                        <p className="text-xs text-muted-foreground">Duration: 45 minutes</p>
                      </div>
                      <Badge variant="default">Good</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="exercises" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Exercise Completion Rates</CardTitle>
              <CardDescription>
                Your progress on different eye exercise types this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={exerciseCompletion} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="exercise" type="category" width={100} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Completion']} />
                    <Bar 
                      dataKey="completed" 
                      fill="#3b82f6" 
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Usage Patterns</CardTitle>
                <CardDescription>When you're most active on screens</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Morning (6-12 PM)</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 h-2 bg-muted rounded-full">
                        <div className="w-1/4 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                      <span className="text-sm text-muted-foreground">25%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Afternoon (12-6 PM)</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 h-2 bg-muted rounded-full">
                        <div className="w-2/3 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                      <span className="text-sm text-muted-foreground">65%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Evening (6-12 AM)</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 h-2 bg-muted rounded-full">
                        <div className="w-1/10 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                      <span className="text-sm text-muted-foreground">10%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Break Compliance</CardTitle>
                <CardDescription>Following the 20-20-20 rule</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl">78%</div>
                    <p className="text-sm text-muted-foreground">Average compliance this week</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Breaks taken</span>
                      <span>47/60</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Avg break duration</span>
                      <span>32 seconds</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Longest work session</span>
                      <span>2.5 hours</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
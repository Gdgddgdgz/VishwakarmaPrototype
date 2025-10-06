import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { 
  Bell, 
  Eye, 
  Monitor, 
  Clock, 
  Camera, 
  Shield,
  Download,
  Trash2,
  RefreshCw
} from 'lucide-react';

export function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl">Settings</h2>
        <p className="text-muted-foreground">Customize your ABT Digital Eye experience</p>
      </div>

      <Tabs defaultValue="monitoring" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="exercises">Exercises</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="monitoring" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Blink Rate Monitoring
              </CardTitle>
              <CardDescription>
                Configure how the app monitors your blink rate
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Blink Detection</Label>
                  <div className="text-sm text-muted-foreground">
                    Monitor blink frequency using your camera
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="space-y-2">
                <Label>Optimal Blink Rate Range</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Minimum (blinks/min)</Label>
                    <Input type="number" defaultValue="15" />
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Maximum (blinks/min)</Label>
                    <Input type="number" defaultValue="20" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Monitoring Sensitivity</Label>
                <Select defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Less frequent checks</SelectItem>
                    <SelectItem value="medium">Medium - Balanced monitoring</SelectItem>
                    <SelectItem value="high">High - Continuous monitoring</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Monitor className="w-5 h-5 mr-2" />
                Screen Distance & Posture
              </CardTitle>
              <CardDescription>
                Settings for posture and screen distance monitoring
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Posture Monitoring</Label>
                  <div className="text-sm text-muted-foreground">
                    Track screen distance and sitting posture
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="space-y-2">
                <Label>Minimum Screen Distance (cm)</Label>
                <Input type="number" defaultValue="40" />
                <div className="text-sm text-muted-foreground">
                  Alert when screen is closer than this distance
                </div>
              </div>

              <div className="space-y-2">
                <Label>Screen Angle Range</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Minimum angle (degrees)</Label>
                    <Input type="number" defaultValue="10" />
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Maximum angle (degrees)</Label>
                    <Input type="number" defaultValue="20" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure when and how you receive alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Desktop Notifications</Label>
                  <div className="text-sm text-muted-foreground">
                    Show system notifications for alerts
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Sound Alerts</Label>
                  <div className="text-sm text-muted-foreground">
                    Play sounds for important alerts
                  </div>
                </div>
                <Switch />
              </div>

              <div className="space-y-2">
                <Label>Alert Frequency</Label>
                <Select defaultValue="normal">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minimal">Minimal - Only critical alerts</SelectItem>
                    <SelectItem value="normal">Normal - Balanced notifications</SelectItem>
                    <SelectItem value="frequent">Frequent - All recommendations</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4>Specific Alerts</h4>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Low Blink Rate</Label>
                    <div className="text-sm text-muted-foreground">Alert when blink rate drops</div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Poor Posture</Label>
                    <div className="text-sm text-muted-foreground">Alert for posture issues</div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>20-20-20 Reminders</Label>
                    <div className="text-sm text-muted-foreground">Regular break reminders</div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Exercise Suggestions</Label>
                    <div className="text-sm text-muted-foreground">Recommend eye exercises</div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exercises" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Exercise Preferences
              </CardTitle>
              <CardDescription>
                Customize your eye exercise routine
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Daily Exercise Goal</Label>
                <Select defaultValue="5">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 exercises per day</SelectItem>
                    <SelectItem value="5">5 exercises per day</SelectItem>
                    <SelectItem value="8">8 exercises per day</SelectItem>
                    <SelectItem value="10">10 exercises per day</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Preferred Exercise Types</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch defaultChecked />
                    <Label className="text-sm">Relaxation</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch defaultChecked />
                    <Label className="text-sm">Focus Training</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch defaultChecked />
                    <Label className="text-sm">Coordination</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch />
                    <Label className="text-sm">Advanced</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Exercise Reminders</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Morning reminder</Label>
                    <Input type="time" defaultValue="09:00" className="w-32" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Afternoon reminder</Label>
                    <Input type="time" defaultValue="14:00" className="w-32" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Evening reminder</Label>
                    <Input type="time" defaultValue="18:00" className="w-32" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Privacy & Data
              </CardTitle>
              <CardDescription>
                Control how your data is collected and used
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm">Privacy-First Design</p>
                    <p className="text-xs text-muted-foreground">
                      All camera processing is done locally on your device. No video data is stored or transmitted.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Camera Access</Label>
                  <div className="text-sm text-muted-foreground">
                    Allow app to access camera for monitoring
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">Required</Badge>
                  <Switch defaultChecked disabled />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Anonymous Analytics</Label>
                  <div className="text-sm text-muted-foreground">
                    Share anonymous usage data to improve the app
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Health Data Export</Label>
                  <div className="text-sm text-muted-foreground">
                    Allow exporting your eye health data
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="space-y-4">
                <h4>Data Management</h4>
                
                <div className="flex justify-between items-center">
                  <div>
                    <Label>Export Data</Label>
                    <div className="text-sm text-muted-foreground">Download all your health data</div>
                  </div>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <Label>Clear Cache</Label>
                    <div className="text-sm text-muted-foreground">Clear temporary app data</div>
                  </div>
                  <Button variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <Label>Delete All Data</Label>
                    <div className="text-sm text-muted-foreground">Permanently delete all your data</div>
                  </div>
                  <Button variant="destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Manage your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input defaultValue="John" />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input defaultValue="Doe" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" defaultValue="john.doe@email.com" />
              </div>

              <div className="space-y-2">
                <Label>Occupation</Label>
                <Select defaultValue="developer">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="developer">Software Developer</SelectItem>
                    <SelectItem value="designer">Designer</SelectItem>
                    <SelectItem value="gamer">Gamer</SelectItem>
                    <SelectItem value="office">Office Worker</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Typical Daily Screen Time</Label>
                <Select defaultValue="6-8">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2-4">2-4 hours</SelectItem>
                    <SelectItem value="4-6">4-6 hours</SelectItem>
                    <SelectItem value="6-8">6-8 hours</SelectItem>
                    <SelectItem value="8+">8+ hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="mt-6">Save Changes</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
              <CardDescription>Manage your subscription plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p>Current Plan</p>
                  <p className="text-sm text-muted-foreground">ABT Digital Eye Pro</p>
                </div>
                <Badge>Active</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p>Next Billing Date</p>
                  <p className="text-sm text-muted-foreground">November 5, 2024</p>
                </div>
                <div className="text-right">
                  <p>$9.99/month</p>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1">Manage Billing</Button>
                <Button variant="outline" className="flex-1">Change Plan</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
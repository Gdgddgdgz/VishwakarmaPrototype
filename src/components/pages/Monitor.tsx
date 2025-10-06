import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { EyeTracker } from '../EyeTracker';
import { useEyeTracking } from '../EyeTrackingContext';
import { 
  Play, 
  Pause, 
  AlertTriangle, 
  CheckCircle2,
  Eye,
  Monitor,
  Clock,
  Activity
} from 'lucide-react';

export function MonitorPage() {
  const { state, dispatch } = useEyeTracking();

  const handleDataUpdate = (data: any) => {
    dispatch({ type: 'UPDATE_DATA', payload: data });
  };

  const toggleTracking = () => {
    dispatch({ type: 'SET_ACTIVE', payload: !state.isActive });
  };

  const getBlinkRateStatus = (rate: number) => {
    if (rate >= 15 && rate <= 20) return { status: 'Good', color: 'bg-green-500' };
    if (rate >= 12 && rate < 15) return { status: 'Low', color: 'bg-yellow-500' };
    return { status: 'Critical', color: 'bg-red-500' };
  };

  const getDistanceStatus = (distance: number) => {
    if (distance >= 50) return { status: 'Good', color: 'bg-green-500' };
    if (distance >= 40) return { status: 'Fair', color: 'bg-yellow-500' };
    return { status: 'Too Close', color: 'bg-red-500' };
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Eye Monitoring Control</span>
            <Button
              onClick={toggleTracking}
              variant={state.isActive ? "secondary" : "default"}
              size="sm"
            >
              {state.isActive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {state.isActive ? 'Stop Monitoring' : 'Start Monitoring'}
            </Button>
          </CardTitle>
          <CardDescription>
            {state.isActive 
              ? 'Eye tracking is active and monitoring your behavior'
              : 'Click Start Monitoring to begin tracking your eye health metrics'
            }
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Eye Tracker Component */}
        <div>
          <EyeTracker 
            onDataUpdate={handleDataUpdate}
            isActive={state.isActive}
          />
        </div>

        {/* Live Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Live Metrics</CardTitle>
            <CardDescription>Real-time eye health indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Blink Rate */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">Blink Rate</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{state.currentBlinkRate.toFixed(1)}/min</span>
                  <Badge 
                    variant="outline" 
                    className={getBlinkRateStatus(state.currentBlinkRate).color}
                  >
                    {getBlinkRateStatus(state.currentBlinkRate).status}
                  </Badge>
                </div>
              </div>
              <Progress 
                value={Math.min(100, (state.currentBlinkRate / 20) * 100)} 
                className="h-2"
              />
              <p className="text-xs text-muted-foreground">Optimal: 15-20 blinks/minute</p>
            </div>

            {/* Screen Distance */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Monitor className="w-4 h-4" />
                  <span className="text-sm">Screen Distance</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{state.currentDistance.toFixed(0)}cm</span>
                  <Badge 
                    variant="outline" 
                    className={getDistanceStatus(state.currentDistance).color}
                  >
                    {getDistanceStatus(state.currentDistance).status}
                  </Badge>
                </div>
              </div>
              <Progress 
                value={Math.min(100, (state.currentDistance / 100) * 100)} 
                className="h-2"
              />
              <p className="text-xs text-muted-foreground">Minimum: 40cm recommended</p>
            </div>

            {/* Screen Time */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Session Time</span>
                </div>
                <span className="text-sm font-medium">{formatTime(state.screenTime)}</span>
              </div>
              <Progress 
                value={Math.min(100, (state.screenTime / 480) * 100)} 
                className="h-2"
              />
              <p className="text-xs text-muted-foreground">Daily limit: 8 hours</p>
            </div>

            {/* Eye Strain Score */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4" />
                  <span className="text-sm">Eye Health Score</span>
                </div>
                <span className="text-sm font-medium">{state.dailyStats.eyeStrainScore}/100</span>
              </div>
              <Progress 
                value={state.dailyStats.eyeStrainScore} 
                className="h-2"
              />
              <p className="text-xs text-muted-foreground">
                {state.dailyStats.eyeStrainScore >= 80 ? 'Excellent' :
                 state.dailyStats.eyeStrainScore >= 60 ? 'Good' :
                 state.dailyStats.eyeStrainScore >= 40 ? 'Fair' : 'Needs Attention'}
              </p>
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
              Active Alerts
            </CardTitle>
            <CardDescription className="text-orange-700">
              Recommendations to improve your eye health
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {state.alerts.lowBlinkRate && (
              <div className="flex items-start space-x-3 p-3 bg-white rounded-md border border-orange-200">
                <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-orange-800">Low Blink Rate Detected</p>
                  <p className="text-xs text-orange-700">
                    Your blink rate is below normal. Try to blink more consciously or take a break.
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
                    You're sitting too close to your screen. Move back to at least 40cm distance.
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

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Immediate steps to improve your eye health</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Eye className="w-8 h-8" />
              <span className="text-sm">Start Eye Exercise</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Clock className="w-8 h-8" />
              <span className="text-sm">Take 20-20-20 Break</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <CheckCircle2 className="w-8 h-8" />
              <span className="text-sm">Adjust Posture</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
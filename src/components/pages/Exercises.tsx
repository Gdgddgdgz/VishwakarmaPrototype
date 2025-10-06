import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Clock,
  Eye,
  Target,
  Infinity,
  Circle
} from 'lucide-react';

const exercises = [
  {
    id: 1,
    name: 'Palming',
    description: 'Cover your eyes with palms for deep relaxation',
    duration: 60,
    difficulty: 'Easy',
    category: 'Relaxation',
    instructions: [
      'Sit comfortably and rub your palms together to warm them',
      'Close your eyes and gently place your palms over them',
      'Rest your fingers on your forehead',
      'Breathe deeply and relax for 60 seconds',
      'Remove hands slowly and blink gently'
    ],
    benefits: ['Reduces eye strain', 'Improves circulation', 'Promotes relaxation']
  },
  {
    id: 2,
    name: 'Focus Shifting',
    description: 'Improve focus flexibility by shifting between near and far objects',
    duration: 120,
    difficulty: 'Medium',
    category: 'Focus',
    instructions: [
      'Hold your thumb 6 inches from your face',
      'Focus on your thumb for 15 seconds',
      'Shift focus to an object 10-20 feet away for 15 seconds',
      'Return focus to your thumb',
      'Repeat 4 times'
    ],
    benefits: ['Improves focus flexibility', 'Strengthens eye muscles', 'Reduces accommodation fatigue']
  },
  {
    id: 3,
    name: 'Figure Eight',
    description: 'Trace imaginary figure eights to improve eye coordination',
    duration: 90,
    difficulty: 'Medium',
    category: 'Coordination',
    instructions: [
      'Sit comfortably and look straight ahead',
      'Imagine a large figure eight about 8 feet in front of you',
      'Slowly trace the figure eight with your eyes',
      'Focus on smooth, controlled movements',
      'Repeat for 90 seconds, changing direction occasionally'
    ],
    benefits: ['Improves eye coordination', 'Enhances tracking skills', 'Strengthens eye muscles']
  },
  {
    id: 4,
    name: 'Rapid Blinking',
    description: 'Quick blinking exercises to lubricate eyes',
    duration: 30,
    difficulty: 'Easy',
    category: 'Lubrication',
    instructions: [
      'Sit up straight and look ahead',
      'Blink rapidly for 30 seconds',
      'Focus on complete blinks - fully close and open',
      'Try to maintain a rhythm of 2-3 blinks per second',
      'Finish with 3 slow, deliberate blinks'
    ],
    benefits: ['Increases tear production', 'Reduces dry eyes', 'Improves blink reflex']
  }
];

const exerciseHistory = [
  { date: '2024-10-05', completed: 4, streak: 7 },
  { date: '2024-10-04', completed: 3, streak: 6 },
  { date: '2024-10-03', completed: 5, streak: 5 },
  { date: '2024-10-02', completed: 2, streak: 4 },
  { date: '2024-10-01', completed: 4, streak: 3 },
];

export function Exercises() {
  const [selectedExercise, setSelectedExercise] = useState(exercises[0]);
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(selectedExercise.duration);
  const [completedToday, setCompletedToday] = useState(3);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Relaxation': return <Circle className="w-4 h-4" />;
      case 'Focus': return <Target className="w-4 h-4" />;
      case 'Coordination': return <Infinity className="w-4 h-4" />;
      case 'Lubrication': return <Eye className="w-4 h-4" />;
      default: return <Eye className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today's Progress</p>
                <p className="text-2xl">{completedToday}/5</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <Progress value={completedToday * 20} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <p className="text-2xl">7 days</p>
              </div>
              <Badge variant="default">Active</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Completed</p>
                <p className="text-2xl">147</p>
              </div>
              <div className="text-sm text-green-600">+5 this week</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Time Invested</p>
                <p className="text-2xl">2.4h</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="exercises" className="space-y-6">
        <TabsList>
          <TabsTrigger value="exercises">Exercise Library</TabsTrigger>
          <TabsTrigger value="session">Active Session</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="exercises" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {exercises.map((exercise) => (
              <Card key={exercise.id} className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedExercise(exercise)}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(exercise.category)}
                      <CardTitle className="text-lg">{exercise.name}</CardTitle>
                    </div>
                    <Badge variant="outline" className={getDifficultyColor(exercise.difficulty)}>
                      {exercise.difficulty}
                    </Badge>
                  </div>
                  <CardDescription>{exercise.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Duration</span>
                      <span>{exercise.duration}s</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Category</span>
                      <span>{exercise.category}</span>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedExercise(exercise);
                        setTimeRemaining(exercise.duration);
                      }}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Exercise
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="session" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Exercise Player */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{selectedExercise.name}</CardTitle>
                    <CardDescription>{selectedExercise.description}</CardDescription>
                  </div>
                  <Badge variant="outline" className={getDifficultyColor(selectedExercise.difficulty)}>
                    {selectedExercise.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Timer Display */}
                <div className="text-center">
                  <div className="text-6xl mb-2">{timeRemaining}s</div>
                  <Progress 
                    value={((selectedExercise.duration - timeRemaining) / selectedExercise.duration) * 100} 
                    className="w-full"
                  />
                </div>

                {/* Controls */}
                <div className="flex justify-center space-x-4">
                  <Button
                    size="lg"
                    onClick={() => setIsActive(!isActive)}
                    variant={isActive ? "secondary" : "default"}
                  >
                    {isActive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                    {isActive ? 'Pause' : 'Start'}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => setTimeRemaining(selectedExercise.duration)}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>

                {/* Benefits */}
                <div>
                  <h4 className="mb-2">Benefits:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {selectedExercise.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle2 className="w-3 h-3 mr-2 text-green-500" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
                <CardDescription>Follow these steps for the best results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedExercise.instructions.map((instruction, index) => (
                    <div key={index} className="flex space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm">
                        {index + 1}
                      </div>
                      <p className="text-sm">{instruction}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Exercise History</CardTitle>
              <CardDescription>Your recent exercise activity and progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {exerciseHistory.map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-sm">
                        <p>{new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                        <p className="text-muted-foreground">{day.completed} exercises completed</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant="outline">
                        {day.streak} day streak
                      </Badge>
                      <div className="flex space-x-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-3 h-3 rounded-full ${
                              i < day.completed ? 'bg-green-500' : 'bg-muted'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
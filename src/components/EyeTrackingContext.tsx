import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';

interface BlinkData {
  timestamp: number;
  blinkRate: number;
  distance: number;
  eyePosition: { x: number; y: number };
}

interface EyeTrackingState {
  isActive: boolean;
  currentBlinkRate: number;
  currentDistance: number;
  totalBlinks: number;
  screenTime: number;
  blinkHistory: BlinkData[];
  dailyStats: {
    averageBlinkRate: number;
    averageDistance: number;
    totalScreenTime: number;
    eyeStrainScore: number;
  };
  alerts: {
    lowBlinkRate: boolean;
    tooCloseToScreen: boolean;
    poorPosture: boolean;
  };
}

type EyeTrackingAction =
  | { type: 'SET_ACTIVE'; payload: boolean }
  | { type: 'UPDATE_DATA'; payload: BlinkData }
  | { type: 'INCREMENT_SCREEN_TIME' }
  | { type: 'RESET_DAILY_STATS' };

const initialState: EyeTrackingState = {
  isActive: false,
  currentBlinkRate: 16,
  currentDistance: 50,
  totalBlinks: 0,
  screenTime: 0,
  blinkHistory: [],
  dailyStats: {
    averageBlinkRate: 16,
    averageDistance: 50,
    totalScreenTime: 0,
    eyeStrainScore: 70,
  },
  alerts: {
    lowBlinkRate: false,
    tooCloseToScreen: false,
    poorPosture: false,
  },
};

function eyeTrackingReducer(state: EyeTrackingState, action: EyeTrackingAction): EyeTrackingState {
  switch (action.type) {
    case 'SET_ACTIVE':
      return { ...state, isActive: action.payload };
    
    case 'UPDATE_DATA': {
      const newData = action.payload;
      const newHistory = [...state.blinkHistory, newData].slice(-100); // Keep last 100 entries
      
      // Calculate running averages
      const recentData = newHistory.slice(-10); // Last 10 entries for current averages
      const avgBlinkRate = recentData.reduce((sum, d) => sum + d.blinkRate, 0) / recentData.length;
      const avgDistance = recentData.reduce((sum, d) => sum + d.distance, 0) / recentData.length;
      
      // Update alerts
      const alerts = {
        lowBlinkRate: avgBlinkRate < 12,
        tooCloseToScreen: avgDistance < 40,
        poorPosture: avgDistance < 35 || avgBlinkRate < 10,
      };
      
      // Calculate eye strain score (0-100, higher is better)
      let eyeStrainScore = 100;
      if (avgBlinkRate < 15) eyeStrainScore -= 30;
      if (avgDistance < 40) eyeStrainScore -= 25;
      if (state.screenTime > 480) eyeStrainScore -= 20; // 8 hours
      eyeStrainScore = Math.max(0, eyeStrainScore);
      
      return {
        ...state,
        currentBlinkRate: avgBlinkRate,
        currentDistance: avgDistance,
        totalBlinks: state.totalBlinks + (newData.blinkRate > 0 ? 1 : 0),
        blinkHistory: newHistory,
        dailyStats: {
          ...state.dailyStats,
          averageBlinkRate: avgBlinkRate,
          averageDistance: avgDistance,
          eyeStrainScore,
        },
        alerts,
      };
    }
    
    case 'INCREMENT_SCREEN_TIME':
      return {
        ...state,
        screenTime: state.screenTime + 1,
        dailyStats: {
          ...state.dailyStats,
          totalScreenTime: state.screenTime + 1,
        },
      };
    
    case 'RESET_DAILY_STATS':
      return {
        ...state,
        screenTime: 0,
        totalBlinks: 0,
        blinkHistory: [],
        dailyStats: {
          averageBlinkRate: 16,
          averageDistance: 50,
          totalScreenTime: 0,
          eyeStrainScore: 70,
        },
        alerts: {
          lowBlinkRate: false,
          tooCloseToScreen: false,
          poorPosture: false,
        },
      };
    
    default:
      return state;
  }
}

const EyeTrackingContext = createContext<{
  state: EyeTrackingState;
  dispatch: React.Dispatch<EyeTrackingAction>;
} | null>(null);

export function EyeTrackingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(eyeTrackingReducer, initialState);

  // Increment screen time every minute when active
  useEffect(() => {
    if (!state.isActive) return;

    const interval = setInterval(() => {
      dispatch({ type: 'INCREMENT_SCREEN_TIME' });
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, [state.isActive]);

  // Load saved data on mount
  useEffect(() => {
    const savedData = localStorage.getItem('eyeTrackingData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // You could dispatch actions to restore state here
      } catch (error) {
        console.error('Failed to load saved eye tracking data:', error);
      }
    }
  }, []);

  // Save data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      localStorage.setItem('eyeTrackingData', JSON.stringify({
        dailyStats: state.dailyStats,
        screenTime: state.screenTime,
        totalBlinks: state.totalBlinks,
      }));
    }, 30000); // Save every 30 seconds

    return () => clearInterval(interval);
  }, [state.dailyStats, state.screenTime, state.totalBlinks]);

  return (
    <EyeTrackingContext.Provider value={{ state, dispatch }}>
      {children}
    </EyeTrackingContext.Provider>
  );
}

export function useEyeTracking() {
  const context = useContext(EyeTrackingContext);
  if (!context) {
    throw new Error('useEyeTracking must be used within an EyeTrackingProvider');
  }
  return context;
}
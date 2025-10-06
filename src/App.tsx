import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './components/DashboardLayout';
import { Overview } from './components/pages/Overview';
import { Analytics } from './components/pages/Analytics';
import { Exercises } from './components/pages/Exercises';
import { Settings } from './components/pages/Settings';
import { MonitorPage } from './components/pages/Monitor';
import { EyeTrackingProvider } from './components/EyeTrackingContext';

export default function App() {
  return (
    <EyeTrackingProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <DashboardLayout>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Overview />} />
              <Route path="/monitor" element={<MonitorPage />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/exercises" element={<Exercises />} />
              <Route path="/settings" element={<Settings />} />
              {/* Catch-all route for any unmatched paths */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </DashboardLayout>
        </div>
      </Router>
    </EyeTrackingProvider>
  );
}
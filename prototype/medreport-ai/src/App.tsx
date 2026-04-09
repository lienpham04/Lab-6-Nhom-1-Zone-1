/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CreateReport from './components/CreateReport';

export interface Report {
  id: string;
  patientName: string;
  age: number;
  gender: string;
  modality: string;
  diagnosis: string;
  status: 'Bình thường' | 'Nghi ngờ' | 'Cần theo dõi' | 'Khẩn cấp';
  date: string;
  content: string;
}

type Screen = 'login' | 'dashboard' | 'create';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [userRole, setUserRole] = useState<'doctor' | 'patient' | null>(null);
  const [reports, setReports] = useState<Report[]>([]);

  // Load reports from localStorage on mount
  useEffect(() => {
    const savedReports = localStorage.getItem('medreport_ai_reports');
    if (savedReports) {
      try {
        setReports(JSON.parse(savedReports));
      } catch (e) {
        console.error("Failed to parse reports", e);
      }
    }
  }, []);

  // Save reports to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('medreport_ai_reports', JSON.stringify(reports));
  }, [reports]);

  const handleLogin = (role: 'doctor' | 'patient') => {
    setUserRole(role);
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentScreen('login');
  };

  const handleSaveReport = (newReport: Report) => {
    setReports(prev => [newReport, ...prev]);
  };

  return (
    <div className="min-h-screen bg-surface">
      {currentScreen === 'login' && <Login onLogin={handleLogin} />}
      {currentScreen === 'dashboard' && (
        <Dashboard 
          role={userRole!} 
          onNavigate={(screen) => setCurrentScreen(screen as Screen)} 
          onLogout={handleLogout}
          reports={reports}
        />
      )}
      {currentScreen === 'create' && (
        <CreateReport 
          onNavigate={(screen) => setCurrentScreen(screen as Screen)} 
          onSaveReport={handleSaveReport}
        />
      )}
    </div>
  );
}


import { 
  LayoutDashboard, 
  PlusCircle, 
  Users, 
  History, 
  User as UserIcon, 
  LogOut, 
  FileText, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  TrendingUp,
  Stethoscope,
  Pill,
  Calendar,
  ChevronRight,
  AlertCircle,
  Activity,
  ShieldCheck,
  BarChart3,
  Loader2,
  X
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { generateAnalyticsSummary, AnalyticsData } from '../services/GeminiService';
import Markdown from 'react-markdown';
import { Report } from '../App';

interface DashboardProps {
  role: 'doctor' | 'patient';
  onNavigate: (screen: string) => void;
  onLogout: () => void;
  reports: Report[];
}

export default function Dashboard({ role, onNavigate, onLogout, reports }: DashboardProps) {
  const [analyticsSummary, setAnalyticsSummary] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleRunAnalytics = async () => {
    setIsAnalyzing(true);
    // Mock data for analytics
    const mockData: AnalyticsData = {
      total_reports: 1284,
      total_patients: 1284,
      time_range: "7 days",
      reports: [
        { diagnosis: "Nghi viêm phổi", age: 65, gender: "Nam" },
        { diagnosis: "Bình thường", age: 30, gender: "Nữ" },
        { diagnosis: "Nghi khối u phổi", age: 58, gender: "Nam" },
        { diagnosis: "Viêm phế quản", age: 12, gender: "Nam" },
        { diagnosis: "Bình thường", age: 45, gender: "Nữ" },
        { diagnosis: "Nghi lao phổi", age: 70, gender: "Nam" },
      ]
    };

    try {
      const summary = await generateAnalyticsSummary(mockData);
      setAnalyticsSummary(summary || "Không có dữ liệu phân tích.");
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface pb-24 md:pb-0 md:pt-20">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center text-white">
              <FileText className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-primary tracking-tighter font-headline">MedReport AI</h1>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <button className="text-primary font-semibold text-sm">Dashboard</button>
            <button className="text-on-surface-variant hover:text-primary transition-colors text-sm">Patients</button>
            <button className="text-on-surface-variant hover:text-primary transition-colors text-sm">History</button>
            <div className="flex items-center gap-3 pl-4 border-l border-outline-variant/20">
              <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary-container">
                <img 
                  src={role === 'doctor' 
                    ? "https://lh3.googleusercontent.com/aida-public/AB6AXuB9GQU7J9M9H2kP6bIGg-d2_xMy02eRQ496AoxctRBdSyUN6vgp46eDqK6OsRtKUFM6fKWwbieWJWTKtUt5_lHws9-1Zs3vJLELpo3LFkfLnyuLuk4FsyRbIEhIyCLHiZDxebGVHRNG6ezCyoj9qQav1zgPYV1tV6jD8dEYwylRYRfUJcx_eBJ50KISHFUIV9pyFnigoZ0fZ4zu2a8sRli51znB-fvjSkHNnL5OsUqxQ9AqWO2l16cnVHJTnUdvYEisa4vhv-iEAU1q" 
                    : "https://lh3.googleusercontent.com/aida-public/AB6AXuC2vwgs1558Ug4CsREiWLh3ibCnjmZ9J7z0RlxuG4j5cdxwuPd90nXJf_0rzMfySXzCfwDq1MMQEykUckAsxfrAJibKg3zQlhUacpXaNIWq_MhQj9VJEueA9TlnmAFwzXf6w2Qlty6qxCsb59hcelvZQ7kFVbaJwdtHiC4IEVUXqVKQ3QlrYDzaQe3Dm0YiT5yffgB0Ch3kgN8ZSkwcOQ6ih1ATUHTDf3L11EmCHUckf7-gdbFiufgki2wgh31uryoi6kTuBHfF0TPk"
                  } 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <button onClick={onLogout} className="text-on-surface-variant hover:text-error transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </nav>

          <div className="md:hidden">
            <button onClick={onLogout} className="text-on-surface-variant">
              <LogOut className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-8 pb-12">
        {role === 'doctor' ? (
          <DoctorDashboard 
            onNavigate={onNavigate} 
            onRunAnalytics={handleRunAnalytics} 
            isAnalyzing={isAnalyzing}
            reports={reports}
          />
        ) : (
          <PatientDashboard />
        )}
      </main>

      {/* Analytics Modal */}
      <AnimatePresence>
        {analyticsSummary && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-on-surface/20 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface-container-lowest w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center bg-primary/5">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold font-headline text-primary">ANALYTICS DASHBOARD</h3>
                </div>
                <button 
                  onClick={() => setAnalyticsSummary(null)}
                  className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-on-surface-variant" />
                </button>
              </div>
              <div className="p-8 overflow-y-auto prose prose-sm max-w-none">
                <div className="markdown-body">
                  <Markdown>{analyticsSummary}</Markdown>
                </div>
              </div>
              <div className="p-4 bg-surface-container-low/50 border-t border-outline-variant/10 text-center">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">AI-Generated Clinical Insights • Confidential</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation Bar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-3 bg-white border-t border-outline-variant/10 z-50 rounded-t-2xl shadow-lg">
        <button className="flex flex-col items-center justify-center text-primary">
          <LayoutDashboard className="w-6 h-6" />
          <span className="text-[10px] font-medium mt-1">Dashboard</span>
        </button>
        <button 
          onClick={() => onNavigate('create')}
          className="flex flex-col items-center justify-center text-on-surface-variant"
        >
          <PlusCircle className="w-6 h-6" />
          <span className="text-[10px] font-medium mt-1">Create</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant">
          <Users className="w-6 h-6" />
          <span className="text-[10px] font-medium mt-1">Patients</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant">
          <History className="w-6 h-6" />
          <span className="text-[10px] font-medium mt-1">History</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant">
          <UserIcon className="w-6 h-6" />
          <span className="text-[10px] font-medium mt-1">Profile</span>
        </button>
      </nav>
    </div>
  );
}

function DoctorDashboard({ 
  onNavigate, 
  onRunAnalytics, 
  isAnalyzing,
  reports
}: { 
  onNavigate: (screen: string) => void;
  onRunAnalytics: () => void;
  isAnalyzing: boolean;
  reports: Report[];
}) {
  const displayReports = reports.length > 0 ? reports : [
    { id: '1', patientName: 'James Sullivan', age: 45, gender: 'Male', diagnosis: 'Routine Checkup', status: 'Bình thường', date: 'Oct 24, 2023' },
    { id: '2', patientName: 'Elena Wright', age: 32, gender: 'Female', diagnosis: 'Urgent AI Flag', status: 'Nghi ngờ', date: 'Oct 23, 2023' },
    { id: '3', patientName: 'Marcus Knight', age: 68, gender: 'Male', diagnosis: 'Report Ready', status: 'Cần theo dõi', date: 'Oct 22, 2023' },
    { id: '4', patientName: 'Sarah Robinson', age: 29, gender: 'Female', diagnosis: 'Follow-up', status: 'Bình thường', date: 'Oct 21, 2023' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Bình thường': return 'bg-secondary/10 text-secondary';
      case 'Nghi ngờ': return 'bg-error/10 text-error';
      case 'Khẩn cấp': return 'bg-error text-white';
      case 'Cần theo dõi': return 'bg-surface-container-high text-on-surface-variant';
      default: return 'bg-surface-container-high text-on-surface-variant';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-primary font-medium text-[10px] uppercase tracking-widest mb-1">Overview</p>
          <h2 className="text-3xl font-extrabold text-on-surface tracking-tight font-headline">Physician Dashboard</h2>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onRunAnalytics}
            disabled={isAnalyzing}
            className="bg-surface-container-highest text-on-surface px-4 py-2.5 rounded-lg font-semibold flex items-center gap-2 hover:bg-surface-container-high transition-all active:scale-95 disabled:opacity-50"
          >
            {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <BarChart3 className="w-5 h-5" />}
            <span className="text-sm">Run Analytics</span>
          </button>
          <button 
            onClick={() => onNavigate('create')}
            className="bg-gradient-to-br from-primary to-primary-container text-white px-6 py-2.5 rounded-lg font-bold shadow-sm flex items-center gap-2 active:scale-95 transition-all"
          >
            <PlusCircle className="w-5 h-5" />
            <span className="text-sm">Create New Report</span>
          </button>
        </div>
      </div>

      {/* Bento Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 flex flex-col justify-between group cursor-pointer transition-all hover:shadow-lg hover:shadow-primary/5">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-primary font-bold text-xs bg-primary/10 px-2 py-1 rounded-full">+12% vs last month</span>
          </div>
          <div>
            <p className="text-on-surface-variant text-sm font-medium">Total Active Patients</p>
            <h3 className="text-4xl font-extrabold tracking-tighter mt-1 font-headline">1,284</h3>
          </div>
        </div>
        <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10 flex flex-col justify-between">
          <div className="p-2 w-fit bg-tertiary/10 rounded-lg text-tertiary mb-4">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-on-surface-variant text-sm font-medium">Pending Reports</p>
            <h3 className="text-4xl font-extrabold tracking-tighter mt-1 font-headline">24</h3>
          </div>
        </div>
        <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10 flex flex-col justify-between">
          <div className="p-2 w-fit bg-secondary/10 rounded-lg text-secondary mb-4">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-on-surface-variant text-sm font-medium">Recent Diagnoses</p>
            <h3 className="text-4xl font-extrabold tracking-tighter mt-1 font-headline">{156 + reports.length}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden">
            <div className="px-6 py-5 flex justify-between items-center border-b border-outline-variant/10">
              <h3 className="text-lg font-bold tracking-tight font-headline">Recent Patients</h3>
              <button className="text-primary text-xs font-bold hover:underline">View All</button>
            </div>
            <div className="divide-y divide-outline-variant/10">
              {displayReports.map((p, i) => (
                <div key={p.id || i} className="px-6 py-4 flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                      {p.patientName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-semibold text-on-surface">{p.patientName}</h4>
                      <p className="text-xs text-on-surface-variant">{p.age} years • {p.gender}</p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <span className="text-xs font-medium text-on-surface-variant">Last Visit: {p.date}</span>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusColor(p.status)}`}>{p.diagnosis}</span>
                      <ChevronRight className="w-4 h-4 text-on-surface-variant" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-gradient-to-br from-primary-container to-primary p-6 rounded-2xl text-white shadow-lg overflow-hidden relative">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">AI Insight Engine</span>
              </div>
              <p className="text-sm font-medium mb-4 leading-relaxed">System confidence for <span className="underline decoration-white/30">Cardiology Reports</span> has increased by 4.2% following the latest clinical update.</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white w-[96%]"></div>
                </div>
                <span className="text-[10px] font-bold">96%</span>
              </div>
            </div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white opacity-10 rounded-full blur-3xl" />
          </div>

          <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              System Milestones
            </h3>
            <div className="space-y-6 relative before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-outline-variant/20">
              {[
                { title: 'Data Integration', desc: 'EMR Cloud Sync Complete • 09:42 AM', active: true },
                { title: 'Batch Processing', desc: '12 Lab results indexed • 11:15 AM', active: true },
                { title: 'Evening Review', desc: 'Scheduled for 18:00 PM', active: false },
              ].map((m, i) => (
                <div key={i} className={`flex gap-4 relative ${!m.active && 'opacity-50'}`}>
                  <div className={`w-6 h-6 rounded-full border-4 border-surface-container-low flex-shrink-0 z-10 ${m.active ? 'bg-primary' : 'bg-outline-variant'}`} />
                  <div>
                    <p className="text-[11px] font-bold text-on-surface">{m.title}</p>
                    <p className="text-[10px] text-on-surface-variant">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PatientDashboard() {
  return (
    <div className="space-y-8">
      {/* Read-Only Banner */}
      <div className="flex items-center gap-3 bg-secondary-container/30 px-4 py-3 rounded-xl border border-secondary-container/20">
        <AlertCircle className="w-5 h-5 text-secondary" />
        <p className="text-sm font-medium text-on-secondary-container">This is a Read-Only view of your medical records for your personal reference.</p>
      </div>

      {/* Hero Card */}
      <section className="bg-surface-container-lowest p-8 rounded-3xl flex flex-col md:flex-row gap-8 items-center md:items-start relative overflow-hidden border border-outline-variant/10 shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="relative w-32 h-32 rounded-3xl overflow-hidden shrink-0 border-4 border-surface-container-low shadow-sm">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2vwgs1558Ug4CsREiWLh3ibCnjmZ9J7z0RlxuG4j5cdxwuPd90nXJf_0rzMfySXzCfwDq1MMQEykUckAsxfrAJibKg3zQlhUacpXaNIWq_MhQj9VJEueA9TlnmAFwzXf6w2Qlty6qxCsb59hcelvZQ7kFVbaJwdtHiC4IEVUXqVKQ3QlrYDzaQe3Dm0YiT5yffgB0Ch3kgN8ZSkwcOQ6ih1ATUHTDf3L11EmCHUckf7-gdbFiufgki2wgh31uryoi6kTuBHfF0TPk" 
            alt="Sarah Jenkins" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex-1 text-center md:text-left space-y-2">
          <h2 className="text-3xl font-extrabold font-headline tracking-tight text-on-surface">Sarah Jenkins</h2>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-on-surface-variant font-medium text-sm">
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> 42 years</span>
            <span className="flex items-center gap-1"><Activity className="w-4 h-4" /> ID: MR-8829-X</span>
            <span className="flex items-center gap-1 text-primary"><ShieldCheck className="w-4 h-4" /> Standard Access</span>
          </div>
          <div className="pt-4 flex flex-wrap justify-center md:justify-start gap-3">
            <div className="bg-surface-container-low px-4 py-2 rounded-lg">
              <span className="block text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Blood Type</span>
              <span className="text-lg font-bold text-on-surface">O Positive</span>
            </div>
            <div className="bg-surface-container-low px-4 py-2 rounded-lg">
              <span className="block text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Known Allergies</span>
              <span className="text-lg font-bold text-error">Penicillin</span>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-end px-2">
            <div>
              <h3 className="text-2xl font-bold font-headline text-on-surface">My Results</h3>
              <p className="text-on-surface-variant text-sm">Simplified summaries from your latest consultations.</p>
            </div>
            <button className="text-primary font-semibold text-sm flex items-center gap-1 hover:underline">
              View All <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 group cursor-pointer transition-all hover:shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold font-headline">AI ANALYZED</div>
                <span className="text-on-surface-variant text-xs font-medium">Oct 12, 2023</span>
              </div>
              <h4 className="text-xl font-bold font-headline mb-2 text-on-surface">Annual Respiratory Check</h4>
              <p className="text-on-surface-variant leading-relaxed mb-4">Your lung function tests show excellent capacity. The AI detected no significant changes from last year's baseline. Continue your regular cardio routine.</p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-secondary-container/50 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-3 h-3 text-secondary" />
                  <span className="text-[11px] font-bold text-on-secondary-container">98% Confidence</span>
                </div>
                <span className="text-xs text-on-surface-variant">Reviewed by Dr. Aris Thorne</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 group cursor-pointer transition-all hover:shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-blue-500/10 text-blue-600 px-3 py-1 rounded-full text-xs font-bold font-headline">BLOOD WORK</div>
                <span className="text-on-surface-variant text-xs font-medium">Sept 28, 2023</span>
              </div>
              <h4 className="text-xl font-bold font-headline mb-2 text-on-surface">General Wellness Panel</h4>
              <p className="text-on-surface-variant leading-relaxed mb-4">All vitamin and mineral levels are within the target range. Cholesterol shows a slight improvement from the previous quarter.</p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-secondary-container/50 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-3 h-3 text-secondary" />
                  <span className="text-[11px] font-bold text-on-secondary-container">Diagnostic Match</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="px-2">
            <h3 className="text-2xl font-bold font-headline text-on-surface">Prescriptions</h3>
            <p className="text-on-surface-variant text-sm">Active medication and refills.</p>
          </div>

          <div className="bg-surface-container-low rounded-3xl p-6 space-y-4">
            <div className="bg-surface-container-lowest p-4 rounded-xl border-l-4 border-primary shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="font-bold text-on-surface">Lisinopril</h5>
                  <p className="text-xs text-on-surface-variant font-medium">10mg • Once Daily</p>
                </div>
                <Pill className="w-5 h-5 text-primary" />
              </div>
              <div className="mt-4 flex justify-between items-center text-[10px] font-bold uppercase tracking-tighter">
                <span className="text-on-surface-variant">Refills left: 2</span>
                <span className="text-primary">Expires Dec 2023</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-4 rounded-xl border-l-4 border-outline-variant shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="font-bold text-on-surface">Vitamin D3</h5>
                  <p className="text-xs text-on-surface-variant font-medium">2000 IU • Daily</p>
                </div>
                <Pill className="w-5 h-5 text-outline-variant" />
              </div>
              <div className="mt-4 flex justify-between items-center text-[10px] font-bold uppercase tracking-tighter">
                <span className="text-on-surface-variant">OTC Supplement</span>
                <span className="text-on-surface-variant">Ongoing</span>
              </div>
            </div>

            <button className="w-full py-4 bg-primary-container text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md shadow-primary/10">
              <Activity className="w-5 h-5" />
              Request a Refill
            </button>
          </div>

          <div className="bg-gradient-to-br from-primary to-primary-container p-6 rounded-3xl text-white shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full border-2 border-white/30 overflow-hidden">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8_HOPZuxzT22gx7Y78U4S6CACIkwUfcq2Loxv5VBFSHW7ONtFCajsMTM1HUHRkjN62hffm9Udel-MOovKdzFCiTiaiNKhihwZk5Z2g0B_gUkkhHC6VS293vWd529rcDig-oMH-mcpwrzvvP15gYkUv6GTBcF2yScySEzjEjOm12H7jPUYjz0-XF2_v5a4LZT0HEn6etZUC9E-UXSyRjcNgWPVr3vGDrRTVReQFD8LXS8mh3piN-UtqyKBlOASDswV-A5Ur18RQ_29" 
                  alt="Dr. Thorne" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <p className="text-xs opacity-80">Next Appointment</p>
                <p className="font-bold">Dr. Aris Thorne</p>
              </div>
            </div>
            <p className="text-sm font-medium leading-snug mb-4">"Sarah, your progress is excellent. Let's touch base on the 24th to review your energy levels."</p>
            <div className="bg-white/10 rounded-xl p-3 flex justify-between items-center">
              <span className="text-sm font-bold">Oct 24 • 10:30 AM</span>
              <Calendar className="w-4 h-4" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

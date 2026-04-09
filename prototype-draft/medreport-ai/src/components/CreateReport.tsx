import { useState, useEffect, useRef } from 'react';
import { 
  CloudUpload, 
  UserSearch, 
  Sparkles, 
  Maximize2, 
  Download, 
  ShieldCheck, 
  Zap, 
  Lightbulb,
  ArrowLeft,
  FileText,
  Loader2,
  CheckCircle2,
  Send,
  MessageSquare,
  ClipboardCheck,
  BrainCircuit,
  Info,
  Save,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Edit3,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  generateMedicalReport, 
  editMedicalReport, 
  finalizeReport,
  submitFeedback,
  PatientInfo 
} from '../services/GeminiService';
import Markdown from 'react-markdown';
import { Report } from '../App';

interface CreateReportProps {
  onNavigate: (screen: string) => void;
  onSaveReport: (report: Report) => void;
}

export default function CreateReport({ onNavigate, onSaveReport }: CreateReportProps) {
  const [patientName, setPatientName] = useState('');
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    age: '',
    gender: 'Select Gender',
    history: '',
    clinicalNotes: ''
  });
  const [modality, setModality] = useState('xray');
  const [imageDescription, setImageDescription] = useState('Chest X-ray');
  const [report, setReport] = useState<string | null>(null);
  const [finalOutput, setFinalOutput] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [doctorMessage, setDoctorMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [isFinalized, setIsFinalized] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const reportEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (report && !isFinalized) {
      setIsSidebarCollapsed(true);
    }
  }, [report, isFinalized]);

  useEffect(() => {
    if (reportEndRef.current) {
      reportEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [report]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setIsFinalized(false);
    setFinalOutput(null);
    try {
      const generatedReport = await generateMedicalReport(patientInfo, imageDescription, modality);
      setReport(generatedReport || 'Không thể tạo báo cáo.');
    } catch (error) {
      console.error(error);
      setReport('Đã xảy ra lỗi khi tạo báo cáo.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEdit = async () => {
    if (!report || !doctorMessage.trim() || isFinalized) return;
    setIsEditing(true);
    try {
      const updatedReport = await editMedicalReport(report, doctorMessage, patientInfo);
      setReport(updatedReport || report);
      setDoctorMessage('');
    } catch (error) {
      console.error(error);
    } finally {
      setIsEditing(false);
    }
  };

  const parseSummary = (output: string) => {
    const summarySection = output.split('### 🧾 TÓM TẮT NGẮN')[1];
    if (!summarySection) return { diagnosis: 'N/A', status: 'Cần theo dõi' as const };

    const diagnosisMatch = summarySection.match(/\* Chẩn đoán chính: (.*)/);
    const statusMatch = summarySection.match(/\* Tình trạng: (.*)/);

    let status: Report['status'] = 'Cần theo dõi';
    const statusText = statusMatch ? statusMatch[1].toLowerCase() : '';
    if (statusText.includes('bình thường')) status = 'Bình thường';
    else if (statusText.includes('nghi ngờ')) status = 'Nghi ngờ';
    else if (statusText.includes('khẩn cấp')) status = 'Khẩn cấp';

    return {
      diagnosis: diagnosisMatch ? diagnosisMatch[1] : 'N/A',
      status
    };
  };

  const handleSaveAndExit = async () => {
    if (!report) return;
    setIsFinalizing(true);
    try {
      // Finalize the report (clean up, generate summary)
      const output = await finalizeReport(report);
      setFinalOutput(output || null);
      
      // Submit feedback for AI learning (Mode 5)
      if (output) {
        await submitFeedback(report, patientInfo, output);
      }
      
      if (output) {
        const { diagnosis, status } = parseSummary(output);
        const newReport: Report = {
          id: Math.random().toString(36).substr(2, 9),
          patientName: patientName || 'Anonymous Patient',
          age: parseInt(patientInfo.age) || 0,
          gender: patientInfo.gender,
          modality: modality,
          diagnosis: diagnosis,
          status: status,
          date: new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' }),
          content: output
        };
        onSaveReport(newReport);
      }

      setIsFinalized(true);
      setShowSuccess(true);
      
      // Auto-redirect after 4 seconds
      setTimeout(() => {
        onNavigate('dashboard');
      }, 4000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsFinalizing(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface pb-24 md:pb-12 md:pt-20 relative">
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-surface/90 backdrop-blur-xl flex items-center justify-center p-6 text-center"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-md space-y-6"
            >
              <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-success" />
              </div>
              <h2 className="text-3xl font-extrabold font-headline text-on-surface">Report Saved Successfully</h2>
              <p className="text-on-surface-variant leading-relaxed">The finalized report has been stored in the clinical database and synced with the patient's history. Redirecting to dashboard...</p>
              <div className="flex justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navigation Bar */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onNavigate('dashboard')}
              className="p-2 hover:bg-surface-container-low rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-on-surface-variant" />
            </button>
            <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center text-white">
              <FileText className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-primary tracking-tighter font-headline">MedReport AI</h1>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-high rounded-full border border-outline-variant/10">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">AI Training Active</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-surface-container-high border-2 border-primary/10 overflow-hidden">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9GQU7J9M9H2kP6bIGg-d2_xMy02eRQ496AoxctRBdSyUN6vgp46eDqK6OsRtKUFM6fKWwbieWJWTKtUt5_lHws9-1Zs3vJLELpo3LFkfLnyuLuk4FsyRbIEhIyCLHiZDxebGVHRNG6ezCyoj9qQav1zgPYV1tV6jD8dEYwylRYRfUJcx_eBJ50KISHFUIV9pyFnigoZ0fZ4zu2a8sRli51znB-fvjSkHNnL5OsUqxQ9AqWO2l16cnVHJTnUdvYEisa4vhv-iEAU1q" 
                alt="Doctor" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 pt-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl font-extrabold font-headline tracking-tight text-on-surface mb-1">
              {isSidebarCollapsed ? 'Clinical Workspace' : 'Generate AI Diagnosis'}
            </h2>
            <p className="text-on-surface-variant text-sm max-w-2xl leading-relaxed">
              {isSidebarCollapsed 
                ? `Reviewing report for ${patientName || 'Anonymous Patient'}` 
                : 'Leverage clinical-grade neural networks to analyze medical imaging and patient history.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {report && (
              <button 
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="p-2.5 bg-surface-container-high rounded-xl text-on-surface-variant hover:text-primary transition-all active:scale-95 border border-outline-variant/10"
                title={isSidebarCollapsed ? "Expand Input" : "Collapse Input"}
              >
                {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
              </button>
            )}
            {report && !isFinalized && (
              <button 
                onClick={handleSaveAndExit}
                disabled={isFinalizing}
                className="bg-primary text-white px-8 py-3 rounded-xl font-bold flex items-center gap-3 shadow-lg shadow-primary/20 hover:bg-primary-container transition-all active:scale-95 disabled:opacity-50"
              >
                {isFinalizing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Save and Exit
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start relative">
          {/* Left Column: Input & Upload (Sidebar) */}
          <motion.div 
            initial={false}
            animate={{ 
              width: isSidebarCollapsed ? '280px' : '450px',
              opacity: 1
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="flex-shrink-0 space-y-6 sticky top-24"
          >
            {isSidebarCollapsed ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-surface-container-low rounded-3xl p-6 border border-outline-variant/10 space-y-6 shadow-sm"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-surface-container-lowest rounded-2xl border border-outline-variant/5">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                      {patientName ? patientName.split(' ').map(n => n[0]).join('') : 'P'}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-bold truncate">{patientName || 'Anonymous'}</p>
                      <p className="text-[10px] text-on-surface-variant font-medium">{patientInfo.age}Y • {patientInfo.gender}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">Modality</p>
                    <div className="px-3 py-2 bg-surface-container-lowest rounded-xl text-xs font-semibold border border-outline-variant/5">
                      {modality.toUpperCase()}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-outline-variant/10 space-y-3">
                  <button 
                    onClick={() => setIsSidebarCollapsed(false)}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-surface-container-high rounded-xl text-xs font-bold text-on-surface hover:bg-surface-container-highest transition-all active:scale-95"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Input
                  </button>
                  <button 
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary/10 rounded-xl text-xs font-bold text-primary hover:bg-primary/20 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    Regenerate
                  </button>
                </div>

                <div className="bg-secondary-container/20 rounded-2xl p-4 border border-secondary-container/30">
                  <div className="flex gap-3">
                    <Lightbulb className="w-4 h-4 text-on-secondary-container shrink-0" />
                    <p className="text-[10px] leading-relaxed text-on-secondary-container/80 font-medium">
                      AI precision is currently optimized for {modality.toUpperCase()} imaging.
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Upload Zone */}
                <div className={`bg-surface-container-lowest rounded-3xl p-1 border-2 border-dashed transition-colors group ${isFinalized ? 'opacity-50 pointer-events-none border-outline-variant/10' : 'border-outline-variant/30 hover:border-primary/50'}`}>
                  <div className="bg-surface-container-low rounded-[22px] p-8 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <CloudUpload className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-sm font-bold font-headline mb-1">Medical Imaging</h3>
                    <p className="text-[10px] text-on-surface-variant mb-4">DICOM, PNG, JPG supported</p>
                    <button className="bg-primary text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-primary-container transition-all active:scale-95 shadow-md shadow-primary/10">
                      Browse Files
                    </button>
                  </div>
                </div>

                {/* Patient Metadata Grid */}
                <div className={`bg-surface-container-low rounded-3xl p-6 border border-outline-variant/10 transition-opacity ${isFinalized ? 'opacity-50 pointer-events-none' : ''}`}>
                  <h3 className="text-[10px] font-bold font-headline uppercase tracking-widest text-on-surface-variant mb-6 flex items-center gap-2">
                    <UserSearch className="w-4 h-4" />
                    Patient Specifications
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-on-surface-variant ml-1 uppercase tracking-wider">Patient Full Name</label>
                      <input 
                        className="w-full bg-surface-container-lowest border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant" 
                        placeholder="Enter patient name" 
                        type="text"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-on-surface-variant ml-1 uppercase tracking-wider">Medical Modality</label>
                      <select 
                        className="w-full bg-surface-container-lowest border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
                        value={modality}
                        onChange={(e) => setModality(e.target.value)}
                      >
                        <option value="xray">X-ray (X-quang)</option>
                        <option value="ultrasound">Ultrasound (Siêu âm)</option>
                        <option value="endoscopy">Endoscopy (Nội soi)</option>
                        <option value="ct">CT Scan</option>
                        <option value="mri">MRI</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-on-surface-variant ml-1 uppercase tracking-wider">Age</label>
                        <input 
                          className="w-full bg-surface-container-lowest border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant" 
                          placeholder="Age" 
                          type="number"
                          value={patientInfo.age}
                          onChange={(e) => setPatientInfo({ ...patientInfo, age: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-on-surface-variant ml-1 uppercase tracking-wider">Gender</label>
                        <select 
                          className="w-full bg-surface-container-lowest border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
                          value={patientInfo.gender}
                          onChange={(e) => setPatientInfo({ ...patientInfo, gender: e.target.value })}
                        >
                          <option>Select Gender</option>
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-on-surface-variant ml-1 uppercase tracking-wider">Medical History</label>
                      <textarea 
                        className="w-full bg-surface-container-lowest border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant resize-none" 
                        placeholder="Previous conditions..." 
                        rows={2}
                        value={patientInfo.history}
                        onChange={(e) => setPatientInfo({ ...patientInfo, history: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-on-surface-variant ml-1 uppercase tracking-wider">Clinical Notes</label>
                      <textarea 
                        className="w-full bg-surface-container-lowest border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant resize-none" 
                        placeholder="Current symptoms..." 
                        rows={3}
                        value={patientInfo.clinicalNotes}
                        onChange={(e) => setPatientInfo({ ...patientInfo, clinicalNotes: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="mt-6">
                    <button 
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="w-full bg-gradient-to-r from-primary to-primary-container text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-primary/10 hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                      {isGenerating ? 'Generating...' : 'Generate AI Report'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Right Column: Context & Preview (Main Workspace) */}
          <div className="flex-1 min-w-0">
            <div className="bg-surface-container-lowest rounded-3xl overflow-hidden min-h-[700px] flex flex-col border border-outline-variant/10 shadow-sm relative">
              <div className="p-4 border-b border-surface-container-high flex justify-between items-center bg-surface-container-low/30 sticky top-0 z-20 backdrop-blur-md">
                <span className="text-[10px] font-bold font-headline text-on-surface-variant flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isGenerating || isEditing || isFinalizing ? 'bg-primary animate-pulse' : 'bg-outline-variant'}`}></div>
                  CLINICAL REPORT WORKSPACE
                </span>
                <div className="flex gap-2">
                  <button className="p-2 text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-container-high rounded-lg">
                    <Maximize2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-container-high rounded-lg">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex-grow p-10 overflow-y-auto">
                <AnimatePresence mode="wait">
                  {report ? (
                    <motion.div 
                      key="report"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="max-w-4xl mx-auto"
                    >
                      {isFinalized && (
                        <div className="mb-8 p-4 bg-success/5 border border-success/20 rounded-2xl flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-success" />
                          <span className="text-xs font-bold text-success uppercase tracking-tight">Report Finalized & Validated</span>
                        </div>
                      )}
                      
                      {/* Final Summary Card (AI Analysis Summary) */}
                      <AnimatePresence>
                        {finalOutput && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-10 bg-primary/5 rounded-3xl p-8 border border-primary/20 relative overflow-hidden"
                          >
                            <div className="absolute top-0 right-0 p-6 opacity-5">
                              <BrainCircuit className="w-32 h-32 text-primary" />
                            </div>
                            <div className="relative z-10">
                              <div className="flex items-center gap-2 mb-6">
                                <ShieldCheck className="w-6 h-6 text-primary" />
                                <h3 className="text-sm font-bold font-headline uppercase tracking-widest text-primary">AI Clinical Insight</h3>
                              </div>
                              <div className="prose prose-sm max-w-none text-on-surface font-medium leading-relaxed">
                                <Markdown>{finalOutput}</Markdown>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="markdown-body text-lg leading-relaxed">
                        <Markdown>{report}</Markdown>
                      </div>
                      <div ref={reportEndRef} className="h-24" />
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.6 }}
                      className="h-[500px] flex flex-col items-center justify-center text-center"
                    >
                      <div className="relative w-48 h-48 mb-8">
                        <div className="absolute inset-0 rounded-full border-2 border-dashed border-outline-variant/40 animate-[spin_20s_linear_infinite]"></div>
                        <div className="absolute inset-4 rounded-full bg-surface-container-low flex items-center justify-center">
                          <FileText className="w-16 h-16 text-outline-variant" />
                        </div>
                      </div>
                      <h4 className="text-xl font-bold font-headline text-on-surface mb-3">Awaiting Clinical Input</h4>
                      <p className="text-sm text-on-surface-variant max-w-xs mx-auto leading-relaxed">Submit patient history and imaging to initiate AI-powered diagnostic analysis.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Fixed AI Chat at Bottom */}
              {report && !isFinalized && (
                <div className="sticky bottom-0 left-0 w-full p-6 bg-surface-container-lowest/80 backdrop-blur-xl border-t border-outline-variant/10 z-30">
                  <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <MessageSquare className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Copilot: Refine Report</span>
                    </div>
                    <div className="relative group">
                      <input 
                        type="text"
                        className="w-full bg-surface-container-low border border-outline-variant/20 rounded-[20px] py-4 pl-5 pr-14 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary/30 transition-all placeholder:text-outline-variant shadow-sm"
                        placeholder="Ask AI to modify sections, add findings, or clarify diagnosis..."
                        value={doctorMessage}
                        onChange={(e) => setDoctorMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
                        disabled={isEditing}
                      />
                      <button 
                        onClick={handleEdit}
                        disabled={isEditing || !doctorMessage.trim()}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/20 hover:bg-primary-container transition-all active:scale-90 disabled:opacity-30"
                      >
                        {isEditing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {isFinalized && (
                <div className="p-6 bg-primary/5 flex items-center gap-4 border-t border-outline-variant/10">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-xs font-medium text-on-surface-variant leading-relaxed">
                    This clinical report has been finalized and locked. All subsequent modifications will be tracked as amendments in the patient's permanent record.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

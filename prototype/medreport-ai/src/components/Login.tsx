import { useState } from 'react';
import { Stethoscope, User, ArrowRight, ShieldCheck, Zap, Mail, Lock, Eye } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginProps {
  onLogin: (role: 'doctor' | 'patient') => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [role, setRole] = useState<'doctor' | 'patient'>('doctor');

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center p-6 sm:p-12 relative overflow-hidden bg-surface">
      {/* Abstract Background Decoration */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[60%] rounded-full bg-secondary-container/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[50%] rounded-full bg-primary-fixed/30 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
        {/* Left Side: Branding and Welcome */}
        <div className="hidden lg:flex flex-col space-y-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <Stethoscope className="w-7 h-7" />
            </div>
            <span className="font-headline font-extrabold text-3xl tracking-tighter text-primary">MedReport AI</span>
          </div>
          <div className="space-y-4">
            <h1 className="font-headline text-5xl font-extrabold text-on-surface leading-[1.1] tracking-tight">
              Precision Analytics for <br /><span className="text-primary-container">Modern Medicine.</span>
            </h1>
            <p className="text-on-surface-variant text-lg max-w-md leading-relaxed">
              Transforming patient data into actionable clinical insights with surgical precision and AI-driven reliability.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/10">
              <ShieldCheck className="w-6 h-6 text-primary mb-2" />
              <h3 className="font-headline font-bold text-on-surface">HIPAA Compliant</h3>
              <p className="text-xs text-on-surface-variant">Enterprise-grade security standards.</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/10">
              <Zap className="w-6 h-6 text-primary mb-2" />
              <h3 className="font-headline font-bold text-on-surface">Instant Reports</h3>
              <p className="text-xs text-on-surface-variant">AI-generated summaries in seconds.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col"
        >
          <div className="bg-surface-container-lowest p-8 sm:p-12 rounded-3xl shadow-[0_12px_40px_rgba(25,28,29,0.06)] border border-outline-variant/15">
            {/* Mobile Logo */}
            <div className="flex lg:hidden items-center justify-center space-x-2 mb-8">
              <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center text-white">
                <Stethoscope className="w-6 h-6" />
              </div>
              <span className="font-headline font-extrabold text-2xl tracking-tighter text-primary">MedReport AI</span>
            </div>

            <div className="text-center mb-10">
              <h2 className="font-headline text-3xl font-bold text-on-surface mb-2">Welcome Back</h2>
              <p className="text-on-surface-variant">Please select your role and sign in</p>
            </div>

            {/* Role Selection Cards */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button
                onClick={() => setRole('doctor')}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 ${
                  role === 'doctor' 
                    ? 'border-primary bg-primary-container/5' 
                    : 'border-transparent bg-surface-container-low hover:bg-surface-container-high'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${
                  role === 'doctor' ? 'bg-primary text-white' : 'bg-surface-container-high text-primary'
                }`}>
                  <Stethoscope className="w-6 h-6" />
                </div>
                <span className="font-headline font-bold text-sm text-on-surface">Medical Staff</span>
                <span className="text-[10px] text-on-surface-variant uppercase tracking-wider mt-1">Doctor / Nurse</span>
              </button>

              <button
                onClick={() => setRole('patient')}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 ${
                  role === 'patient' 
                    ? 'border-primary bg-primary-container/5' 
                    : 'border-transparent bg-surface-container-low hover:bg-surface-container-high'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${
                  role === 'patient' ? 'bg-primary text-white' : 'bg-surface-container-high text-primary'
                }`}>
                  <User className="w-6 h-6" />
                </div>
                <span className="font-headline font-bold text-sm text-on-surface">Patient</span>
                <span className="text-[10px] text-on-surface-variant uppercase tracking-wider mt-1">Personal Access</span>
              </button>
            </div>

            {/* Input Fields */}
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onLogin(role); }}>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-on-surface-variant px-1 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                  <input 
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-surface-container-low border-none ring-1 ring-outline-variant/30 focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none text-on-surface placeholder:text-outline-variant" 
                    placeholder={role === 'doctor' ? "dr.smith@hospital.org" : "patient@email.com"}
                    type="email"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Password</label>
                  <button type="button" className="text-xs font-semibold text-primary hover:underline">Forgot?</button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                  <input 
                    className="w-full pl-12 pr-12 py-4 rounded-xl bg-surface-container-low border-none ring-1 ring-outline-variant/30 focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none text-on-surface placeholder:text-outline-variant" 
                    placeholder="••••••••" 
                    type="password"
                    required
                  />
                  <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors">
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2 px-1">
                <input className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" id="remember" type="checkbox" />
                <label className="text-sm text-on-surface-variant" htmlFor="remember">Keep me signed in for 30 days</label>
              </div>

              <button 
                className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-primary-container text-white font-headline font-bold text-lg hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center space-x-2" 
                type="submit"
              >
                <span>Sign In to MedReport</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-outline-variant/20 text-center">
              <p className="text-on-surface-variant text-sm">
                Don't have an account yet? 
                <button className="text-primary font-bold hover:underline ml-1">Create an account</button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <footer className="absolute bottom-6 w-full text-center">
        <p className="text-xs text-on-surface-variant/70 font-medium">
          © 2026 MedReport AI. All clinical data is encrypted with enterprise-grade AES-256 protocols.
        </p>
      </footer>
    </div>
  );
}

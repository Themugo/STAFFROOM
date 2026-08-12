import { useEffect, useState, useMemo } from 'react';
import {
  Briefcase, Users, Clock, UserCheck, Calendar, Plus, Eye, Edit2, Trash2,
  Download, LayoutGrid, List, TrendingUp, Target, Timer, Search, Filter,
  Sparkles, CheckCircle2, XCircle, ArrowRight, ShieldCheck, Mail, Phone,
  FileText, Star, Award, DollarSign, Send, Share2, Video, Check, ChevronRight,
  ExternalLink, Building2, MapPin, Zap, RefreshCw, MessageSquare, AlertTriangle,
  FileCheck, UserPlus, UserX, BarChart2, PieChart, Sliders, ChevronDown
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { formatDate, formatTime } from '../lib/format';
import { StatCard, Modal, StatusBadge, EmptyState, PageHeader } from '../components/ui';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from "@/contexts/ToastContext";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart as RePieChart, Pie, Cell } from 'recharts';

const PIPELINE_COLUMNS = [
  { id: 'APPLIED', label: 'Applied', color: 'blue' },
  { id: 'SCREENING', label: 'Screening', color: 'yellow' },
  { id: 'SHORTLISTED', label: 'Shortlisted', color: 'indigo' },
  { id: 'ASSESSMENT', label: 'Assessment', color: 'cyan' },
  { id: 'INTERVIEW', label: 'Interview', color: 'purple' },
  { id: 'REFERENCE', label: 'Ref Check', color: 'amber' },
  { id: 'OFFER', label: 'Offer Sent', color: 'emerald' },
  { id: 'HIRED', label: 'Hired', color: 'green' },
  { id: 'REJECTED', label: 'Rejected', color: 'red' },
];

const COLUMN_COLORS = {
  blue: { dot: 'bg-blue-500', text: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/30' },
  yellow: { dot: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/30' },
  indigo: { dot: 'bg-indigo-500', text: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/30' },
  cyan: { dot: 'bg-cyan-500', text: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-950/30' },
  purple: { dot: 'bg-purple-500', text: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/30' },
  amber: { dot: 'bg-amber-600', text: 'text-amber-700 dark:text-amber-300', bg: 'bg-amber-50 dark:bg-amber-950/30' },
  emerald: { dot: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
  green: { dot: 'bg-green-600', text: 'text-green-700 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-950/30' },
  red: { dot: 'bg-red-500', text: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950/30' },
};

const DEMO_VACANCIES = [
  {
    id: 'vac_1',
    title: 'Senior Full Stack Engineer',
    department: 'Engineering',
    location: 'Nairobi / Hybrid',
    type: 'Full-time',
    salary_range: '$90,000 - $125,000',
    openings: 2,
    status: 'OPEN',
    hiring_manager: 'Marcus Vance',
    recruiter: 'Sarah Jenkins',
    deadline: '2026-08-30',
    description: 'Lead backend and frontend architecture for core enterprise platforms using React, Node.js, and Postgres.',
    requirements: '5+ years Node.js, React, AWS, GraphQL, Microservices experience.',
    applicants_count: 18,
  },
  {
    id: 'vac_2',
    title: 'Staff HR Operations Manager',
    department: 'People Operations',
    location: 'London / Onsite',
    type: 'Full-time',
    salary_range: '£65,000 - £80,000',
    openings: 1,
    status: 'OPEN',
    hiring_manager: 'Amina Al-Mansoor',
    recruiter: 'Sarah Jenkins',
    deadline: '2026-08-25',
    description: 'Oversee global HR compliance, onboarding workflows, payroll alignment, and employee experience.',
    requirements: '7+ years HR generalist or ops leadership, CIPD certified preferred.',
    applicants_count: 12,
  },
  {
    id: 'vac_3',
    title: 'Lead Product Designer (UX/UI)',
    department: 'Product',
    location: 'Remote',
    type: 'Full-time',
    salary_range: '$100,000 - $130,000',
    openings: 1,
    status: 'OPEN',
    hiring_manager: 'David Kim',
    recruiter: 'Sarah Jenkins',
    deadline: '2026-09-05',
    description: 'Craft beautiful, accessible design systems and desktop/mobile workflows for enterprise web applications.',
    requirements: 'Design system expertise, Figma mastery, user research, WCAG AA compliance.',
    applicants_count: 15,
  },
  {
    id: 'vac_4',
    title: 'Cloud Infrastructure Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    salary_range: '$95,000 - $120,000',
    openings: 2,
    status: 'ON_HOLD',
    hiring_manager: 'Marcus Vance',
    recruiter: 'Sarah Jenkins',
    deadline: '2026-09-15',
    description: 'Manage Cloud Run containers, Terraform IaC, Kubernetes clusters, and Zero-Trust security.',
    requirements: 'GCP / AWS Kubernetes certification, CI/CD automation, Terraform.',
    applicants_count: 8,
  }
];

const DEMO_APPLICATIONS = [
  {
    id: 'app_1',
    vacancy_id: 'vac_1',
    vacancy_title: 'Senior Full Stack Engineer',
    full_name: 'David Kim',
    email: 'david.kim@example.com',
    phone: '+254 712 345 678',
    status: 'INTERVIEW',
    match_score: 96,
    rating: 5,
    applied_at: '2026-07-20',
    experience_years: 7,
    current_company: 'Safaricom Tech',
    source: 'LinkedIn',
    tags: ['Top Tier', 'React Guru', 'Immediate Joiner'],
    location: 'Nairobi, Kenya',
    notes: 'Exceptional system architecture knowledge. Demonstrated high proficiency in React + Node.js live coding.',
    interviews: [
      { type: 'Screening', interviewer: 'Sarah Jenkins', date: '2026-07-22', score: 4.8, status: 'Completed' },
      { type: 'Technical Deep-Dive', interviewer: 'Marcus Vance', date: '2026-07-28', score: 5.0, status: 'Completed' },
      { type: 'Executive Final', interviewer: 'Elena Rostova', date: '2026-08-02', score: 0, status: 'Scheduled' }
    ]
  },
  {
    id: 'app_2',
    vacancy_id: 'vac_1',
    vacancy_title: 'Senior Full Stack Engineer',
    full_name: 'Sophia Chen',
    email: 'sophia.chen@techcorp.io',
    phone: '+1 415 890 1234',
    status: 'ASSESSMENT',
    match_score: 91,
    rating: 4,
    applied_at: '2026-07-24',
    experience_years: 6,
    current_company: 'Stripe',
    source: 'Referral',
    tags: ['Referral', 'Strong Systems'],
    location: 'San Francisco, CA (Remote)',
    notes: 'Passed initial screening with high marks. Assessment link dispatched.',
    interviews: [
      { type: 'Screening', interviewer: 'Sarah Jenkins', date: '2026-07-26', score: 4.5, status: 'Completed' }
    ]
  },
  {
    id: 'app_3',
    vacancy_id: 'vac_2',
    vacancy_title: 'Staff HR Operations Manager',
    full_name: 'Elena Rostova',
    email: 'elena.rostova@hrglobal.org',
    phone: '+44 20 7946 0912',
    status: 'OFFER',
    match_score: 98,
    rating: 5,
    applied_at: '2026-07-15',
    experience_years: 9,
    current_company: 'Deloitte HR',
    source: 'Careers Site',
    tags: ['Executive Pick', 'CIPD Level 7'],
    location: 'London, UK',
    notes: 'Offer extended at £75,000 base + performance bonus. Candidate reviewing terms.',
    interviews: [
      { type: 'Screening', interviewer: 'Sarah Jenkins', date: '2026-07-18', score: 5.0, status: 'Completed' },
      { type: 'Panel Interview', interviewer: 'Amina Al-Mansoor & Team', date: '2026-07-25', score: 4.9, status: 'Completed' }
    ]
  },
  {
    id: 'app_4',
    vacancy_id: 'vac_3',
    vacancy_title: 'Lead Product Designer (UX/UI)',
    full_name: 'Marcus Vance',
    email: 'marcus.vance@designstudio.co',
    phone: '+254 798 112 233',
    status: 'SHORTLISTED',
    match_score: 88,
    rating: 4,
    applied_at: '2026-07-27',
    experience_years: 5,
    current_company: 'Canva',
    source: 'Dribbble',
    tags: ['Design System', 'Figma Specialist'],
    location: 'Nairobi, Kenya',
    notes: 'Outstanding portfolio link submitted. Ready for initial screening interview.',
    interviews: []
  },
  {
    id: 'app_5',
    vacancy_id: 'vac_1',
    vacancy_title: 'Senior Full Stack Engineer',
    full_name: 'Michael Brown',
    email: 'mbrown@devnet.com',
    phone: '+1 212 555 0199',
    status: 'APPLIED',
    match_score: 75,
    rating: 3,
    applied_at: '2026-07-30',
    experience_years: 4,
    current_company: 'Fintech Inc',
    source: 'Indeed',
    tags: ['New Applicant'],
    location: 'New York, USA',
    notes: 'Recently submitted resume via Indeed integration.',
    interviews: []
  },
  {
    id: 'app_6',
    vacancy_id: 'vac_2',
    vacancy_title: 'Staff HR Operations Manager',
    full_name: 'Amara Okafor',
    email: 'amara.o@peoplefirst.ng',
    phone: '+234 803 123 4567',
    status: 'SCREENING',
    match_score: 84,
    rating: 4,
    applied_at: '2026-07-28',
    experience_years: 6,
    current_company: 'Interswitch',
    source: 'LinkedIn',
    tags: ['HR Tech', 'Process Ops'],
    location: 'Lagos, Nigeria',
    notes: 'HR Operations experience matches job requisitions cleanly.',
    interviews: []
  }
];

const DEMO_OFFERS = [
  {
    id: 'off_1',
    candidate_name: 'Elena Rostova',
    position: 'Staff HR Operations Manager',
    department: 'People Operations',
    base_salary: '£75,000 / year',
    bonus: '£10,000 Signing Bonus',
    start_date: '2026-09-01',
    status: 'Sent',
    sent_date: '2026-07-29',
    expiry_date: '2026-08-05'
  },
  {
    id: 'off_2',
    candidate_name: 'Kojo Mensah',
    position: 'Senior Data Architect',
    department: 'Engineering',
    base_salary: '$115,000 / year',
    bonus: '$15,000 Performance Pool',
    start_date: '2026-08-15',
    status: 'Accepted',
    sent_date: '2026-07-20',
    expiry_date: '2026-07-27'
  }
];

const FUNNEL_DATA = [
  { stage: 'Applied', count: 63, color: '#3b82f6' },
  { stage: 'Screened', count: 38, color: '#f59e0b' },
  { stage: 'Assessment', count: 22, color: '#06b6d4' },
  { stage: 'Interviewed', count: 14, color: '#8b5cf6' },
  { stage: 'Offers', count: 6, color: '#10b981' },
  { stage: 'Hired', count: 5, color: '#22c55e' }
];

const SOURCE_DATA = [
  { name: 'LinkedIn', value: 45, color: '#0077b5' },
  { name: 'Careers Portal', value: 25, color: '#6366f1' },
  { name: 'Employee Referral', value: 20, color: '#10b981' },
  { name: 'Agencies / Sourcing', value: 10, color: '#f59e0b' }
];

export default function Recruitment() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [vacancies, setVacancies] = useState(DEMO_VACANCIES);
  const [applications, setApplications] = useState(DEMO_APPLICATIONS);
  const [offers, setOffers] = useState(DEMO_OFFERS);
  const [search, setSearch] = useState('');
  const [selectedJobFilter, setSelectedJobFilter] = useState('ALL');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedJobForModal, setSelectedJobForModal] = useState(null);
  const [showCareersPortal, setShowCareersPortal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);

  // New Application Form state
  const [applyForm, setApplyForm] = useState({
    job_id: '', full_name: '', email: '', phone: '', linkedin: '', resume: '', experience: 3, cover_letter: ''
  });

  // Selected candidates for bulk actions
  const [selectedAppIds, setSelectedAppIds] = useState(new Set());

  // Handle Drag / Stage change
  const handleUpdateCandidateStatus = (appId, newStatus) => {
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
    if (selectedCandidate && selectedCandidate.id === appId) {
      setSelectedCandidate(prev => ({ ...prev, status: newStatus }));
    }
  };

  const handleApplySubmit = (e) => {
    e.preventDefault();
    const job = vacancies.find(v => v.id === applyForm.job_id) || vacancies[0];
    const newApp = {
      id: `app_${Date.now()}`,
      vacancy_id: job.id,
      vacancy_title: job.title,
      full_name: applyForm.full_name,
      email: applyForm.email,
      phone: applyForm.phone || '+254 700 000 000',
      status: 'APPLIED',
      match_score: Math.floor(Math.random() * 20) + 80,
      rating: 4,
      applied_at: new Date().toISOString().slice(0, 10),
      experience_years: Number(applyForm.experience) || 3,
      current_company: 'Self / Applicant',
      source: 'Careers Portal',
      tags: ['Portal Applicant'],
      location: 'Remote',
      notes: applyForm.cover_letter || 'Submitted via StaffRoom Careers Portal.',
      interviews: []
    };

    setApplications(prev => [newApp, ...prev]);
    setShowApplyModal(false);
    setApplyForm({ job_id: '', full_name: '', email: '', phone: '', linkedin: '', resume: '', experience: 3, cover_letter: '' });
    toast.success('Thank you! Your application has been received and routed to HR for screening.');
  };

  const toggleSelectApp = (id) => {
    setSelectedAppIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBulkMove = (newStatus) => {
    setApplications(prev => prev.map(a => selectedAppIds.has(a.id) ? { ...a, status: newStatus } : a));
    setSelectedAppIds(new Set());
  };

  const filteredApplications = useMemo(() => {
    return applications.filter(a => {
      const matchesSearch = !search ||
        a.full_name.toLowerCase().includes(search.toLowerCase()) ||
        a.vacancy_title.toLowerCase().includes(search.toLowerCase()) ||
        a.email.toLowerCase().includes(search.toLowerCase());
      const matchesJob = selectedJobFilter === 'ALL' || a.vacancy_id === selectedJobFilter;
      return matchesSearch && matchesJob;
    });
  }, [applications, search, selectedJobFilter]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Briefcase className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Recruitment & Talent Acquisition ATS
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Enterprise candidate pipeline, job requisitions, digital offers & public careers portal
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            className="text-xs gap-1.5 h-9"
            onClick={() => setShowCareersPortal(true)}
          >
            <ExternalLink size={14} /> Public Careers Portal
          </Button>

          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs gap-1.5 h-9 shadow-md shadow-indigo-600/20"
            onClick={() => {
              setApplyForm(f => ({ ...f, job_id: vacancies[0]?.id || '' }));
              setShowApplyModal(true);
            }}
          >
            <UserPlus size={14} /> Add Candidate / Apply
          </Button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1 scrollbar-hide">
        {[
          { id: 'dashboard', label: 'Command Center', icon: BarChart2 },
          { id: 'vacancies', label: 'Job Requisitions', icon: Building2 },
          { id: 'ats', label: 'ATS Pipeline', icon: LayoutGrid },
          { id: 'interviews', label: 'Interview Hub', icon: Calendar },
          { id: 'offers', label: 'Offer Management', icon: FileCheck },
          { id: 'analytics', label: 'Hiring Analytics', icon: TrendingUp },
        ].map(t => {
          const Icon = t.icon;
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                active
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon size={14} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* 1. COMMAND CENTER (DASHBOARD TAB)                        */}
      {/* ========================================================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { label: 'Open Jobs', val: vacancies.filter(v => v.status === 'OPEN').length, icon: Briefcase, color: 'text-indigo-600 bg-indigo-50' },
              { label: 'Total Candidates', val: applications.length, icon: Users, color: 'text-blue-600 bg-blue-50' },
              { label: 'In Interview', val: applications.filter(a => a.status === 'INTERVIEW').length, icon: Calendar, color: 'text-purple-600 bg-purple-50' },
              { label: 'Offers Pending', val: offers.filter(o => o.status === 'Sent').length, icon: FileCheck, color: 'text-amber-600 bg-amber-50' },
              { label: 'Hired This Month', val: applications.filter(a => a.status === 'HIRED').length + 2, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' },
              { label: 'Avg Time-to-Hire', val: '18 Days', icon: Timer, color: 'text-cyan-600 bg-cyan-50' },
              { label: 'Acceptance Rate', val: '92%', icon: Target, color: 'text-green-600 bg-green-50' },
            ].map((m, idx) => {
              const Icon = m.icon;
              return (
                <div key={idx} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3.5 shadow-sm">
                  <div className={`w-8 h-8 rounded-lg ${m.color} flex items-center justify-center mb-2`}>
                    <Icon size={16} />
                  </div>
                  <p className="text-[11px] font-medium text-slate-400">{m.label}</p>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{m.val}</h4>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pipeline Funnel Visualizer */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Candidate Hiring Funnel</h3>
                  <p className="text-xs text-slate-400">Conversion across application stages</p>
                </div>
                <Badge className="bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border-0">
                  Active Batch 2026
                </Badge>
              </div>

              <div className="space-y-3 pt-2">
                {FUNNEL_DATA.map((f, i) => {
                  const pct = Math.round((f.count / FUNNEL_DATA[0].count) * 100);
                  return (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{f.stage}</span>
                        <span className="text-slate-500">{f.count} candidates ({pct}%)</span>
                      </div>
                      <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, backgroundColor: f.color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Upcoming Interviews & Workload */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Calendar size={18} className="text-indigo-600" /> Today's Interview Schedule
              </h3>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-900 dark:text-white">David Kim</span>
                    <Badge className="bg-indigo-600 text-white text-[10px]">14:30 PM</Badge>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Senior Full Stack Engineer · Executive Final</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-400">Interviewer: Elena Rostova</span>
                    <Button size="sm" className="h-7 text-[10px] bg-indigo-600 text-white gap-1">
                      <Video size={11} /> Join Call
                    </Button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-900 dark:text-white">Sophia Chen</span>
                    <Badge className="bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 text-[10px]">16:00 PM</Badge>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Senior Full Stack Engineer · System Design</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-400">Interviewer: Marcus Vance</span>
                    <Button size="sm" variant="outline" className="h-7 text-[10px]">
                      View Scorecard
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. JOB REQUISITIONS & CAREERS PORTAL                      */}
      {/* ========================================================= */}
      {activeTab === 'vacancies' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-[240px]">
              <Search size={16} className="text-slate-400" />
              <Input
                placeholder="Search job requisitions by title, manager or department..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
            <Button
              className="bg-indigo-600 text-white text-xs gap-1.5 h-9"
              onClick={() => toast.info('Opening new Job Requisition wizard...')}
            >
              <Plus size={14} /> Create Job Requisition
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vacancies.map(v => (
              <div
                key={v.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:border-indigo-500 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 dark:text-white text-base">{v.title}</h4>
                      <Badge className={`text-[10px] ${
                        v.status === 'OPEN' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {v.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{v.department} · {v.location} · {v.type}</p>
                  </div>
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-lg">
                    {v.salary_range}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">{v.description}</p>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Hiring Mgr: <strong className="text-slate-700 dark:text-slate-200">{v.hiring_manager}</strong></span>
                  <span>{v.applicants_count} Active Candidates</span>
                  <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => setSelectedJobForModal(v)}>
                    View Requisition
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. ATS KANBAN PIPELINE                                    */}
      {/* ========================================================= */}
      {activeTab === 'ats' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-[280px]">
              <Input
                placeholder="Search candidate name, email or role..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="h-9 text-xs"
              />
              <Select value={selectedJobFilter} onValueChange={setSelectedJobFilter}>
                <SelectTrigger className="h-9 text-xs w-52"><SelectValue placeholder="All Positions" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Requisitions</SelectItem>
                  {vacancies.map(v => <SelectItem key={v.id} value={v.id}>{v.title}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {selectedAppIds.size > 0 && (
              <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950 px-3 py-1.5 rounded-xl border border-indigo-200 text-xs">
                <span className="font-semibold text-indigo-900 dark:text-indigo-200">{selectedAppIds.size} Selected</span>
                <Button size="sm" className="h-7 text-[10px] bg-indigo-600 text-white" onClick={() => handleBulkMove('INTERVIEW')}>
                  Move to Interview
                </Button>
                <Button size="sm" variant="outline" className="h-7 text-[10px]" onClick={() => handleBulkMove('REJECTED')}>
                  Reject Selected
                </Button>
              </div>
            )}
          </div>

          {/* Kanban Columns */}
          <div className="overflow-x-auto pb-4 custom-scrollbar">
            <div className="flex gap-3 min-w-max">
              {PIPELINE_COLUMNS.map(col => {
                const colItems = filteredApplications.filter(a => a.status === col.id);
                const colors = COLUMN_COLORS[col.color];

                return (
                  <div key={col.id} className="w-72 flex-shrink-0 bg-slate-100/70 dark:bg-slate-900/60 rounded-2xl p-3 border border-slate-200/60 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${colors.dot}`} />
                        <h4 className="font-semibold text-xs text-slate-800 dark:text-slate-200">{col.label}</h4>
                      </div>
                      <Badge className="text-[10px] bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-0">
                        {colItems.length}
                      </Badge>
                    </div>

                    <div className="space-y-2.5 min-h-[120px]">
                      {colItems.length === 0 ? (
                        <div className="h-20 flex items-center justify-center text-slate-400 text-[11px] border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                          No candidates
                        </div>
                      ) : (
                        colItems.map(a => (
                          <div
                            key={a.id}
                            onClick={() => setSelectedCandidate(a)}
                            className="bg-white dark:bg-slate-800 rounded-xl p-3.5 shadow-sm border border-slate-200 dark:border-slate-700/80 cursor-pointer hover:border-indigo-500 transition-all space-y-2 group"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={selectedAppIds.has(a.id)}
                                  onClick={e => e.stopPropagation()}
                                  onChange={() => toggleSelectApp(a.id)}
                                  className="rounded border-slate-300 text-indigo-600"
                                />
                                <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center">
                                  {a.full_name[0]}
                                </div>
                                <span className="font-semibold text-xs text-slate-900 dark:text-white truncate max-w-[120px]">
                                  {a.full_name}
                                </span>
                              </div>

                              <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] border-0">
                                {a.match_score}% Match
                              </Badge>
                            </div>

                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{a.vacancy_title}</p>

                            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-700/50">
                              <span>{a.experience_years} yrs exp</span>
                              <span>{a.applied_at}</span>
                            </div>

                            {/* Quick Move Dropdown */}
                            <div className="pt-1 flex items-center justify-between" onClick={e => e.stopPropagation()}>
                              <select
                                value={a.status}
                                onChange={e => handleUpdateCandidateStatus(a.id, e.target.value)}
                                className="text-[10px] rounded bg-slate-100 dark:bg-slate-700 px-2 py-1 text-slate-700 dark:text-slate-200 border-0 cursor-pointer"
                              >
                                {PIPELINE_COLUMNS.map(p => (
                                  <option key={p.id} value={p.id}>Move to: {p.label}</option>
                                ))}
                              </select>
                              <ChevronRight size={14} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. INTERVIEW HUB                                          */}
      {/* ========================================================= */}
      {activeTab === 'interviews' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Scheduled Panel & Virtual Interviews</h3>
            <Button className="bg-indigo-600 text-white text-xs gap-1.5 h-8" onClick={() => setShowInterviewModal(true)}>
              <Calendar size={14} /> Schedule Interview
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {applications.flatMap(a => a.interviews || []).map((inv, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <Badge className="bg-purple-50 text-purple-700 dark:bg-purple-950 text-xs border-purple-200">
                    {inv.type}
                  </Badge>
                  <span className="text-xs font-semibold text-slate-500">{inv.date}</span>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{inv.interviewer}</h4>
                  <p className="text-xs text-slate-400">Panel Lead / Assessor</p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Score: <strong className="text-indigo-600">{inv.score > 0 ? `${inv.score} / 5.0` : 'Pending'}</strong></span>
                  <Button size="sm" variant="outline" className="text-xs h-7">
                    Open Scorecard
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. OFFER MANAGEMENT                                       */}
      {/* ========================================================= */}
      {activeTab === 'offers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Digital Offer Management & Acceptance</h3>
              <p className="text-xs text-slate-400">Generate, send, and track e-signatures for candidate offers</p>
            </div>
            <Button className="bg-indigo-600 text-white text-xs gap-1.5 h-8" onClick={() => setShowOfferModal(true)}>
              <FileCheck size={14} /> Draft Digital Offer
            </Button>
          </div>

          <div className="space-y-3">
            {offers.map(off => (
              <div key={off.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex items-center justify-between flex-wrap gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">{off.candidate_name}</h4>
                    <Badge className={`text-xs ${
                      off.status === 'Accepted' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {off.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400">{off.position} · {off.department}</p>
                </div>

                <div className="text-xs space-y-0.5 text-right">
                  <p className="font-semibold text-slate-900 dark:text-white">{off.base_salary}</p>
                  <p className="text-slate-400">{off.bonus} · Start: {off.start_date}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="text-xs h-8">
                    View Offer PDF
                  </Button>
                  {off.status === 'Accepted' && (
                    <Button size="sm" className="bg-emerald-600 text-white text-xs h-8 gap-1">
                      <UserCheck size={13} /> Onboard Employee
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. RECRUITMENT ANALYTICS                                  */}
      {/* ========================================================= */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Applicant Sourcing Channels</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie data={SOURCE_DATA} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {SOURCE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Hiring Funnel Volume</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={FUNNEL_DATA}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stage" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CANDIDATE 360 WORKSPACE                            */}
      {/* ========================================================= */}
      {selectedCandidate && (
        <Modal
          open={Boolean(selectedCandidate)}
          onClose={() => setSelectedCandidate(null)}
          title={`Candidate 360 Workspace — ${selectedCandidate.full_name}`}
          size="lg"
        >
          <div className="space-y-5 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedCandidate.full_name}</h3>
                <p className="text-slate-400">{selectedCandidate.vacancy_title} · Applied {selectedCandidate.applied_at}</p>
              </div>
              <Badge className="bg-indigo-600 text-white text-xs px-3 py-1">
                {selectedCandidate.match_score}% Skill Fit Score
              </Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-400 block">Email</span>
                <span className="font-semibold text-slate-900 dark:text-white">{selectedCandidate.email}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-400 block">Phone</span>
                <span className="font-semibold text-slate-900 dark:text-white">{selectedCandidate.phone}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-400 block">Current Employer</span>
                <span className="font-semibold text-slate-900 dark:text-white">{selectedCandidate.current_company}</span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-1">Recruiter Notes & Assessment Summary</h4>
              <p className="text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                {selectedCandidate.notes}
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" onClick={() => setSelectedCandidate(null)}>Close</Button>
              <Button className="bg-indigo-600 text-white" onClick={() => {
                setShowOfferModal(true);
                setSelectedCandidate(null);
              }}>
                Issue Offer Letter
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ========================================================= */}
      {/* MODAL: PUBLIC CAREERS PORTAL PREVIEW                      */}
      {/* ========================================================= */}
      {showCareersPortal && (
        <Modal
          open={showCareersPortal}
          onClose={() => setShowCareersPortal(false)}
          title="Live Public Careers Portal Preview"
          size="xl"
        >
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-8 rounded-2xl text-center space-y-3">
              <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30">We Are Hiring!</Badge>
              <h2 className="text-2xl font-black">Build the Future of Enterprise Technology</h2>
              <p className="text-xs text-slate-300 max-w-lg mx-auto">
                Join our mission-driven team. Work on scalable distributed systems, enterprise HR tech, and human-first workplace culture.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Open Positions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {vacancies.filter(v => v.status === 'OPEN').map(job => (
                  <div key={job.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-2">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{job.title}</h4>
                    <p className="text-xs text-slate-400">{job.department} · {job.location}</p>
                    <div className="pt-2 flex justify-between items-center">
                      <span className="text-xs font-semibold text-indigo-600">{job.salary_range}</span>
                      <Button
                        size="sm"
                        className="bg-indigo-600 text-white text-xs h-7"
                        onClick={() => {
                          setApplyForm(f => ({ ...f, job_id: job.id }));
                          setShowCareersPortal(false);
                          setShowApplyModal(true);
                        }}
                      >
                        Apply Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* ========================================================= */}
      {/* MODAL: APPLY ONLINE / ADD CANDIDATE                      */}
      {/* ========================================================= */}
      {showApplyModal && (
        <Modal
          open={showApplyModal}
          onClose={() => setShowApplyModal(false)}
          title="Submit Candidate Application"
          size="md"
        >
          <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Position *</label>
              <select
                value={applyForm.job_id}
                onChange={e => setApplyForm({ ...applyForm, job_id: e.target.value })}
                className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs px-3"
                required
              >
                {vacancies.map(v => <option key={v.id} value={v.id}>{v.title} ({v.department})</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Full Name *</label>
                <Input
                  required
                  value={applyForm.full_name}
                  onChange={e => setApplyForm({ ...applyForm, full_name: e.target.value })}
                  placeholder="Jane Doe"
                  className="h-9 text-xs"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Email *</label>
                <Input
                  required
                  type="email"
                  value={applyForm.email}
                  onChange={e => setApplyForm({ ...applyForm, email: e.target.value })}
                  placeholder="jane.doe@example.com"
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Cover Letter / Notes</label>
              <textarea
                rows={3}
                value={applyForm.cover_letter}
                onChange={e => setApplyForm({ ...applyForm, cover_letter: e.target.value })}
                placeholder="Brief summary of experience..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs p-3"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setShowApplyModal(false)}>Cancel</Button>
              <Button type="submit" className="bg-indigo-600 text-white">Submit Application</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

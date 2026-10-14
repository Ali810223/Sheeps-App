import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Home,
  Heart,
  Stethoscope,
  Coins,
  Bell,
  AlertTriangle,
  Package,
  TrendingUp,
  Plus,
  X,
  CheckCircle2,
  Sparkles,
  Layers,
  ChevronLeft,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

type TabType = 'home' | 'herd' | 'repro' | 'health' | 'finance';

interface AnimalGroup {
  id: string;
  name: string;
  count: number;
  desc: string;
  badge: string;
  badgeColor: string;
  icon: string;
}

interface AlertItem {
  id: string;
  title: string;
  desc: string;
  badge: string;
  badgeColor: string;
  iconBg: string;
  icon: string;
}

interface HealthRecord {
  id: string;
  title: string;
  desc: string;
  badge: string;
  badgeColor: string;
  icon: string;
  iconBg: string;
}

interface FinanceItem {
  id: string;
  title: string;
  desc: string;
  amount: string;
  isIncome: boolean;
  icon: string;
  iconBg: string;
}

const TAB_INFO: Record<TabType, { title: string; subtitle: string; icon: string }> = {
  home: { title: 'دام‌یار صوتی', subtitle: 'مدیریت هوشمند گله', icon: '🐐' },
  herd: { title: 'گله من', subtitle: 'دسته‌بندی و آمار دام‌ها', icon: '🐑' },
  repro: { title: 'تولیدمثل و فحلی', subtitle: 'پیش‌بینی و زمان‌بندی زایش', icon: '❤️' },
  health: { title: 'سلامت و درمان', subtitle: 'سوابق بیماری و واکسیناسیون', icon: '🩺' },
  finance: { title: 'دفتر مالی و سود', subtitle: 'تراز هزینه، درآمد و سود', icon: '💰' },
};

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [tabHistory, setTabHistory] = useState<TabType[]>([]);
  const [todayDate, setTodayDate] = useState<string>('');
  
  // App Dynamic State
  const [totalAnimals, setTotalAnimals] = useState<number>(124);
  const [alertCount, setAlertCount] = useState<number>(3);
  const [pregnantCount, setPregnantCount] = useState<number>(8);
  const [heatTodayCount, setHeatTodayCount] = useState<number>(3);
  const [birthCount, setBirthCount] = useState<number>(14);

  // Financial Stats
  const [monthlyExpense, setMonthlyExpense] = useState<number>(42);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(68);
  const [todayExpense, setTodayExpense] = useState<string>('۱٫۲ میلیون تومان');

  // Groups
  const [herdGroups, setHerdGroups] = useState<AnimalGroup[]>([
    { id: '1', name: 'گله بز ماده', count: 64, desc: 'شیری و مولد', badge: 'سالم', badgeColor: 'bg-emerald-100 text-emerald-800', icon: '🐐' },
    { id: '2', name: 'گله گوسفند', count: 52, desc: 'نژاد افشاری', badge: 'سالم', badgeColor: 'bg-emerald-100 text-emerald-800', icon: '🐏' },
    { id: '3', name: 'بره‌های پرواری', count: 18, desc: '۳-۶ ماهه', badge: 'در حال رشد', badgeColor: 'bg-blue-100 text-blue-800', icon: '🐑' },
  ]);

  // Health
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([
    { id: '1', title: 'گوسفند ۵۶ — اسهال', desc: '۲ ساعت پیش | احتمال: آنتروتوکسمی', badge: 'درمان', badgeColor: 'bg-red-100 text-red-700', icon: '🤒', iconBg: 'bg-red-50' },
    { id: '2', title: 'بز ۲۰۰ — واکسن آبله', desc: 'دیروز | دوز یادآور ۹ ماه دیگر', badge: 'انجام شد', badgeColor: 'bg-emerald-100 text-emerald-800', icon: '💊', iconBg: 'bg-amber-50' },
    { id: '3', title: 'معاینه دوره‌ای گله ۱', desc: '۳ روز پیش | همه سالم', badge: 'سالم', badgeColor: 'bg-emerald-100 text-emerald-800', icon: '✅', iconBg: 'bg-emerald-50' },
  ]);

  // Alerts
  const [alerts, setAlerts] = useState<AlertItem[]>([
    { id: '1', title: 'فحلی پیش‌بینی‌شده — بز ۲۰۰', desc: 'بر اساس الگوی ۱۹ روزه، احتمال فحلی تا ۲۴ ساعت آینده ۸۷٪', badge: 'فوری', badgeColor: 'bg-orange-100 text-orange-800', iconBg: 'bg-orange-50', icon: '🔔' },
    { id: '2', title: 'علائم بیماری — گوسفند ۵۶', desc: 'اسهال + بی‌حالی ثبت شد. احتمال آنتروتوکسمی: متوسط', badge: 'بیمار', badgeColor: 'bg-red-100 text-red-700', iconBg: 'bg-red-50', icon: '⚠️' },
    { id: '3', title: 'موجودی یونجه کم است', desc: 'برای ۴ روز آینده کافی است. پیشنهاد خرید: ۵۰۰ کیلو', badge: 'انبار', badgeColor: 'bg-blue-100 text-blue-800', iconBg: 'bg-amber-50', icon: '📦' },
  ]);

  // Transactions
  const [transactions, setTransactions] = useState<FinanceItem[]>([
    { id: '1', title: 'خرید دارو', desc: 'امروز', amount: '۱۰ میلیون تومان', isIncome: false, icon: '💊', iconBg: 'bg-red-50' },
    { id: '2', title: 'فروش شیر', desc: 'دیروز', amount: '۴٫۵ میلیون تومان', isIncome: true, icon: '🥛', iconBg: 'bg-emerald-50' },
    { id: '3', title: 'خرید یونجه', desc: '۳ روز پیش', amount: '۱۲ میلیون تومان', isIncome: false, icon: '🌾', iconBg: 'bg-amber-50' },
  ]);

  // Navigation handlers with History Stack
  const navigateTo = (tab: TabType) => {
    if (tab === activeTab) return;
    setTabHistory((prev) => [...prev, activeTab]);
    setActiveTab(tab);
  };

  const handleGoBack = () => {
    if (tabHistory.length > 0) {
      const prevTab = tabHistory[tabHistory.length - 1];
      setTabHistory((prev) => prev.slice(0, -1));
      setActiveTab(prevTab);
    } else {
      setActiveTab('home');
    }
  };

  // Voice Modal State
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<'listening' | 'thinking' | 'result'>('listening');
  const [voiceText, setVoiceText] = useState('در حال شنیدن...');
  const [voiceSub, setVoiceSub] = useState('مثال: «سه تا بز ماده امروز علائم فحلی داشتن»');
  const [voiceResult, setVoiceResult] = useState<{ title: string; lines: string[]; action?: string } | null>(null);
  const [customVoiceInput, setCustomVoiceInput] = useState('');

  // Animal Register Modal State
  const [isAnimalModalOpen, setIsAnimalModalOpen] = useState(false);
  const [animalForm, setAnimalForm] = useState({
    tag: '۱۰۲۴',
    type: 'بز ماده',
    age: '۲ سال',
    group: 'گله بز ماده',
  });

  // Toast notice
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  useEffect(() => {
    try {
      const d = new Date();
      const fmt = new Intl.DateTimeFormat('fa-IR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      setTodayDate(fmt.format(d));
    } catch {
      setTodayDate('امروز');
    }
  }, []);

  // Web Speech API Ref
  const recognitionRef = useRef<any>(null);

  const startVoiceSession = () => {
    setIsVoiceOpen(true);
    setVoiceStatus('listening');
    setVoiceText('در حال شنیدن صدا...');
    setVoiceSub('صحبت کنید یا از نمونه‌های زیر انتخاب کنید:');
    setVoiceResult(null);

    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      try {
        const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const rec = new SpeechRec();
        rec.lang = 'fa-IR';
        rec.interimResults = false;
        rec.maxAlternatives = 1;
        rec.onresult = (e: any) => {
          const transcript = e.results[0][0].transcript;
          handleProcessVoice(transcript);
        };
        rec.onerror = () => {};
        rec.start();
        recognitionRef.current = rec;
      } catch (e) {
        console.log('Speech recognition init error:', e);
      }
    }
  };

  const closeVoice = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsVoiceOpen(false);
  };

  const handleProcessVoice = (text: string) => {
    setVoiceStatus('thinking');
    setVoiceText('در حال تحلیل با هوش مصنوعی...');
    setVoiceSub(`«${text}»`);

    setTimeout(() => {
      setVoiceStatus('result');
      setVoiceText('متوجه شدم!');

      if (/خریدم|ثبت دام|تگش|تگ/i.test(text)) {
        setVoiceResult({
          title: '🐑 ثبت دام جدید',
          lines: [
            'تگ: ۱۰۲۴ | نوع: بز ماده | سن: ۲ سال',
            '✅ به گله «بز ماده» اضافه شد.',
            '📅 تقویم واکسن‌ها و دوره‌های فحلی فعال شد.',
          ],
          action: 'animal',
        });
        setAnimalForm({
          tag: '۱۰۲۴',
          type: 'بز ماده',
          age: '۲ سال',
          group: 'گله بز ماده',
        });
        setTimeout(() => {
          setIsVoiceOpen(false);
          setIsAnimalModalOpen(true);
        }, 1800);
      } else if (/اسهال|بی‌حال|بیمار|لنگش|تب/i.test(text)) {
        setVoiceResult({
          title: '🩺 ثبت علائم بیماری',
          lines: [
            'دام: گوسفند ۵۶',
            'علائم: اسهال + بی‌حالی',
            '🤖 تشخیص AI: احتمال آنتروتوکسمی (۶۸٪)',
            '💊 اقدام فوری: جداسازی در قرنطینه + تزریق واکسن/سرم',
            '⏰ یادآوری معاینه مجدد: فردا ۸:۰۰ صبح',
          ],
          action: 'health',
        });
        setAlertCount((prev) => prev + 1);
        showToast('علائم بیماری برای گوسفند ۵۶ با موفقیت ثبت شد');
      } else if (/فحلی|بی‌قرار|دنبال نر|نر میگرده/i.test(text)) {
        setVoiceResult({
          title: '❤️ ثبت فحلی و آماده‌سازی جفت‌گیری',
          lines: [
            'دام: بز ۲۰۰',
            '🤖 هوش مصنوعی: دوره قبلی ۱۹ روز پیش بوده است.',
            '📅 بهترین پنجره تلقیح: امشب ساعت ۲۱:۰۰ تا فردا صبح',
            '⏰ اعلان یادآوری تلقیح برای شما ارسال خواهد شد.',
          ],
          action: 'repro',
        });
        setHeatTodayCount((prev) => prev + 1);
        showToast('فحلی بز ۲۰۰ ثبت شد - پنجره تلقیح مشخص گردید');
      } else if (/یونجه|خوراک|کیلو|دادم/i.test(text)) {
        setVoiceResult({
          title: '📦 ثبت مصرف خوراک و انبارداری',
          lines: [
            'مصرف ثبت‌شده: ۵۰ کیلوگرم یونجه برای گله ۳',
            'موجودی فعلی انبار: ۱۸۰ کیلوگرم',
            '⚠️ موجودی تا ۴ روز دیگر به پایان می‌رسد (پیشنهاد خرید: ۵۰۰ کیلو)',
          ],
          action: 'finance',
        });
        showToast('مصرف ۵۰ کیلو یونجه ثبت شد');
      } else if (/هزینه|خرج|خریدم|میلیون|تومان/i.test(text)) {
        setVoiceResult({
          title: '💰 ثبت هزینه در دفتر حسابداری',
          lines: [
            'دسته‌بندی: خرید دارو و مکمل',
            'مبلغ ثبت‌شده: ۱۰٫۰۰۰٫۰۰۰ تومان',
            '📊 تراز مالی ماهانه و سود هر راس به‌روزرسانی شد.',
          ],
          action: 'finance',
        });
        setMonthlyExpense((prev) => prev + 10);
        showToast('هزینه ۱۰ میلیون تومان در دفاتر مالی ثبت گردید');
      } else {
        setVoiceResult({
          title: '🤖 فرمان نامشخص',
          lines: [
            'جمله به درستی تشخیص داده نشد.',
            'لطفاً ساده‌تر بگویید، مثلاً:',
            '«گوسفند ۵۶ اسهال دارد»',
            '«بز ۲۰۰ علائم فحلی دارد»',
            '«۵۰ کیلو یونجه به گله دادم»',
          ],
        });
      }
    }, 1200);
  };

  const handleAddAnimalConfirm = () => {
    setTotalAnimals((prev) => prev + 1);
    setHerdGroups((prev) =>
      prev.map((g) => (g.name === animalForm.group ? { ...g, count: g.count + 1 } : g))
    );
    setIsAnimalModalOpen(false);
    showToast(`دام جدید با تگ ${animalForm.tag} با موفقیت به گله اضافه شد.`);
  };

  const canGoBack = activeTab !== 'home' || tabHistory.length > 0;
  const previousTabName = tabHistory.length > 0 ? TAB_INFO[tabHistory[tabHistory.length - 1]].title : 'صفحه اصلی (خانه)';

  return (
    <div className="min-h-screen bg-slate-200 flex justify-center items-center p-0 sm:p-4 select-none">
      {/* Mobile Shell Container */}
      <div className="w-full max-w-[480px] h-[100dvh] sm:h-[840px] bg-[#f8f9f4] flex flex-col relative overflow-hidden shadow-2xl sm:rounded-3xl border border-slate-300/80">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="absolute top-16 left-4 right-4 z-50 bg-slate-900/90 text-white text-xs px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 backdrop-blur-sm animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="flex-1 font-medium">{toastMessage}</span>
          </div>
        )}

        {/* ============ HEADER WITH BACK BUTTON ============ */}
        <header className="bg-gradient-to-r from-[#1b4332] via-[#2d6a4f] to-[#1b4332] text-white px-3.5 py-3 flex justify-between items-center shrink-0 shadow-md z-10">
          <div className="flex items-center gap-2.5">
            {/* The Back Button (Appears whenever not on Home or when there is history) */}
            {canGoBack ? (
              <button
                onClick={handleGoBack}
                className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 active:scale-90 text-white px-2.5 py-1.5 rounded-xl border border-white/25 transition-all text-xs font-bold shrink-0 shadow-sm cursor-pointer group"
                title={`بازگشت به ${previousTabName}`}
                aria-label="دکمه بازگشت"
              >
                <ArrowRight className="w-4 h-4 text-emerald-100 group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-[11.5px]">بازگشت</span>
              </button>
            ) : (
              <div className="w-9 h-9 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-xl shadow-inner border border-white/20">
                🐐
              </div>
            )}

            <div>
              <h1 className="text-sm font-extrabold tracking-tight flex items-center gap-1.5">
                {activeTab === 'home' ? (
                  <>
                    <span>دام‌یار صوتی</span>
                    <span className="text-[9px] bg-emerald-500/30 text-emerald-200 px-1.5 py-0.5 rounded-full border border-emerald-400/30 font-normal">
                      هوشمند
                    </span>
                  </>
                ) : (
                  <>
                    <span>{TAB_INFO[activeTab].icon}</span>
                    <span>{TAB_INFO[activeTab].title}</span>
                  </>
                )}
              </h1>
              <p className="text-[10.5px] text-emerald-100/80 font-medium">
                {activeTab === 'home' ? todayDate || 'در حال بارگذاری...' : TAB_INFO[activeTab].subtitle}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="bg-white/15 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-full text-[11px] font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#4ade80]"></span>
              <span>دستیار آماده</span>
            </div>
          </div>
        </header>

        {/* ============ MAIN CONTENT AREA ============ */}
        <main className="flex-1 overflow-y-auto px-4 pt-3 pb-32 space-y-3.5 scroll-smooth">
          
          {/* Breadcrumb / Inline Return Bar on Sub-pages */}
          {canGoBack && (
            <div className="flex items-center justify-between bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-emerald-100/90 shadow-xs text-xs animate-in fade-in duration-150">
              <button
                onClick={handleGoBack}
                className="flex items-center gap-1.5 text-emerald-800 hover:text-emerald-950 font-bold active:scale-95 transition-all cursor-pointer group"
              >
                <div className="w-5 h-5 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
                <span>بازگشت به {previousTabName}</span>
              </button>
              <span className="text-[10px] text-slate-400 font-medium">
                {tabHistory.length > 1 ? `${tabHistory.length} مرحله قبل` : 'صفحه قبلی'}
              </span>
            </div>
          )}

          {/* TAB: HOME */}
          {activeTab === 'home' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Hero Banner */}
              <div className="bg-gradient-to-br from-white via-[#f0f9f4] to-[#e4f3eb] rounded-2xl p-4 border border-[#d8e6dd] shadow-sm relative overflow-hidden">
                <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none"></div>
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-[15px] font-bold text-[#1b4332] flex items-center gap-1.5 mb-1">
                      <span>👋</span> سلام دامدار عزیز!
                    </h2>
                    <p className="text-xs text-slate-600 leading-relaxed max-w-[280px]">
                      دکمه صوتی پایین را لمس کنید و فقط <span className="font-bold text-[#2d6a4f]">صحبت کنید</span>. سیستم همه رویدادها، زایش، درمان و هزینه‌ها را خودش دسته‌بندی و ثبت می‌کند.
                    </p>
                  </div>
                  <button 
                    onClick={startVoiceSession}
                    className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-md hover:bg-emerald-700 active:scale-95 transition-all"
                    title="شروع ضبط صدا"
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* 3 Overview Stats */}
              <div className="grid grid-cols-3 gap-2.5">
                <div 
                  onClick={() => navigateTo('herd')} 
                  className="bg-white p-3 rounded-2xl text-center border border-slate-100 shadow-sm cursor-pointer hover:border-emerald-300 transition-all active:scale-95"
                >
                  <div className="text-2xl font-black text-[#2d6a4f]">{totalAnimals}</div>
                  <div className="text-[11px] text-slate-500 mt-1 font-medium">کل دام (راس)</div>
                </div>
                <div 
                  onClick={() => navigateTo('health')} 
                  className="bg-white p-3 rounded-2xl text-center border border-slate-100 shadow-sm cursor-pointer hover:border-orange-300 transition-all active:scale-95"
                >
                  <div className="text-2xl font-black text-amber-600">{alertCount}</div>
                  <div className="text-[11px] text-slate-500 mt-1 font-medium">هشدارهای باز</div>
                </div>
                <div 
                  onClick={() => navigateTo('repro')} 
                  className="bg-white p-3 rounded-2xl text-center border border-slate-100 shadow-sm cursor-pointer hover:border-blue-300 transition-all active:scale-95"
                >
                  <div className="text-2xl font-black text-blue-600">{pregnantCount}</div>
                  <div className="text-[11px] text-slate-500 mt-1 font-medium">دام آبستن</div>
                </div>
              </div>

              {/* Section: AI Smart Alerts */}
              <div>
                <div className="flex items-center justify-between mb-2 px-1">
                  <div className="text-xs font-bold text-[#1b4332] flex items-center gap-1.5">
                    <span className="w-1.5 h-3.5 bg-emerald-600 rounded-full"></span>
                    هشدارهای هوشمند هوش مصنوعی
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">به‌روزرسانی خودکار</span>
                </div>

                <div className="space-y-2">
                  {alerts.map((al) => (
                    <div
                      key={al.id}
                      onClick={() => {
                        if (al.id === '1') navigateTo('repro');
                        else if (al.id === '2') navigateTo('health');
                        else if (al.id === '3') navigateTo('finance');
                      }}
                      className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm flex items-center gap-3 active:scale-[0.98] transition-transform cursor-pointer hover:border-emerald-200"
                    >
                      <div className={`w-11 h-11 ${al.iconBg} rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-sm`}>
                        {al.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-800 truncate mb-1">{al.title}</div>
                        <div className="text-[11px] text-slate-500 line-clamp-2 leading-tight">{al.desc}</div>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${al.badgeColor}`}>
                        {al.badge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section: Today Financial Overview */}
              <div>
                <div className="flex items-center justify-between mb-2 px-1">
                  <div className="text-xs font-bold text-[#1b4332] flex items-center gap-1.5">
                    <span className="w-1.5 h-3.5 bg-emerald-600 rounded-full"></span>
                    خلاصه مالی امروز
                  </div>
                  <button 
                    onClick={() => navigateTo('finance')}
                    className="text-[11px] text-emerald-700 font-bold flex items-center hover:underline cursor-pointer"
                  >
                    دفتر مالی <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2">
                  <div 
                    onClick={() => navigateTo('finance')}
                    className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm flex items-center gap-3 cursor-pointer hover:border-emerald-200"
                  >
                    <div className="w-11 h-11 bg-emerald-50 rounded-2xl flex items-center justify-center text-xl shrink-0">
                      💰
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-slate-800">هزینه امروز: {todayExpense}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">خوراک: ۸۰۰ هزار | دارو: ۴۰۰ هزار تومان</div>
                    </div>
                  </div>

                  <div 
                    onClick={() => navigateTo('finance')}
                    className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm flex items-center gap-3 cursor-pointer hover:border-blue-200"
                  >
                    <div className="w-11 h-11 bg-blue-50 rounded-2xl flex items-center justify-center text-xl shrink-0">
                      📈
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-slate-800">سود تخمینی هر راس: ۲٫۴ م.ت</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">میانگین سود خالص در دوره ۳ ماه اخیر</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: HERD */}
          {activeTab === 'herd' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-gradient-to-br from-white to-emerald-50/50 rounded-2xl p-4 border border-[#d8e6dd] shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-sm font-bold text-[#1b4332] flex items-center gap-1.5">
                    <span>🐑</span> مدیریت و آمار گله
                  </h2>
                  <button
                    onClick={() => setIsAnimalModalOpen(true)}
                    className="text-xs bg-[#2d6a4f] text-white px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> افزودن دستی
                  </button>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  لیست دسته‌بندی دام‌ها. برای افزودن دام کافی است بگویید:
                  <span className="block mt-1 font-semibold text-emerald-800 bg-white/80 p-1.5 rounded-lg border border-emerald-100">
                    «یه بز ماده دو ساله خریدم، تگش ۱۰۲۴»
                  </span>
                </p>
              </div>

              <div>
                <div className="text-xs font-bold text-[#1b4332] flex items-center gap-1.5 mb-2 px-1">
                  <span className="w-1.5 h-3.5 bg-emerald-600 rounded-full"></span>
                  گروه‌های گله
                </div>

                <div className="space-y-2">
                  {herdGroups.map((g) => (
                    <div
                      key={g.id}
                      onClick={() => showToast(`فهرست دام‌های ${g.name} در حال نمایش است`)}
                      className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm flex items-center gap-3 active:scale-[0.98] transition-all cursor-pointer hover:border-emerald-200"
                    >
                      <div className="w-11 h-11 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl shrink-0 border border-slate-100">
                        {g.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xs font-bold text-slate-900">{g.name}</h3>
                          <span className="text-xs font-black text-emerald-700">({g.count} راس)</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{g.desc}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${g.badgeColor}`}>
                        {g.badge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Summary Herd */}
              <div className="bg-emerald-800 text-white p-4 rounded-2xl shadow-sm">
                <div className="text-xs font-bold text-emerald-200 mb-2">توصیه مدیریتی هفته</div>
                <div className="text-xs leading-relaxed text-emerald-50">
                  فصل تلقیح گله گوسفند افشاری فرا رسیده است. پایش روزانه رفتار و دمای بدن میش‌ها را از بخش صوتی با ثبت جملات کوتاه دنبال کنید.
                </div>
              </div>
            </div>
          )}

          {/* TAB: REPRO */}
          {activeTab === 'repro' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-gradient-to-br from-white to-pink-50/40 rounded-2xl p-4 border border-pink-100 shadow-sm">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                  <span>❤️</span> تولیدمثل، فحلی و زایش هوشمند
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  هوش مصنوعی با یادگیری الگوهای فیزیولوژیک هر دام، ۲۴ تا ۴۸ ساعت قبل از آغاز فحلی هشدار می‌دهد تا هیچ فرصتی برای تلقیح از دست نرود.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white p-3 rounded-2xl text-center border border-slate-100 shadow-sm">
                  <div className="text-xl font-black text-orange-600">{heatTodayCount}</div>
                  <div className="text-[11px] text-slate-500 mt-1">فحلی امروز</div>
                </div>
                <div className="bg-white p-3 rounded-2xl text-center border border-slate-100 shadow-sm">
                  <div className="text-xl font-black text-blue-600">{pregnantCount}</div>
                  <div className="text-[11px] text-slate-500 mt-1">آبستن قطعی</div>
                </div>
                <div className="bg-white p-3 rounded-2xl text-center border border-slate-100 shadow-sm">
                  <div className="text-xl font-black text-emerald-600">{birthCount}</div>
                  <div className="text-[11px] text-slate-500 mt-1">زایش امسال</div>
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-[#1b4332] flex items-center gap-1.5 mb-2 px-1">
                  <span className="w-1.5 h-3.5 bg-pink-500 rounded-full"></span>
                  هشدارهای فعال فحلی
                </div>

                <div className="space-y-2">
                  <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm flex items-center gap-3">
                    <div className="w-11 h-11 bg-orange-50 rounded-2xl flex items-center justify-center text-xl shrink-0">
                      🔔
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-slate-900">بز شماره ۲۰۰</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">دوره قبلی: ۱۹ روز پیش | دقت پیش‌بینی: ۸۷٪</div>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-orange-100 text-orange-800">
                      امشب
                    </span>
                  </div>

                  <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm flex items-center gap-3">
                    <div className="w-11 h-11 bg-orange-50 rounded-2xl flex items-center justify-center text-xl shrink-0">
                      🔔
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-slate-900">گوسفند شماره ۴۵</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">دوره قبلی: ۱۷ روز پیش | دقت: ۷۹٪</div>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-orange-100 text-orange-800">
                      فردا صبح
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-[#1b4332] flex items-center gap-1.5 mb-2 px-1">
                  <span className="w-1.5 h-3.5 bg-emerald-600 rounded-full"></span>
                  تلقیح‌های اخیر
                </div>

                <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm flex items-center gap-3">
                  <div className="w-11 h-11 bg-emerald-50 rounded-2xl flex items-center justify-center text-xl shrink-0">
                    💚
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-slate-900">بز ۱۲۰ — تلقیح موفق</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">۵ روز پیش | درصد امیدواری آبستنی: ۹۲٪</div>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                    پایش
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB: HEALTH */}
          {activeTab === 'health' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-gradient-to-br from-white to-red-50/40 rounded-2xl p-4 border border-red-100 shadow-sm">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                  <span>🩺</span> پایش سلامت، واکسیناسیون و درمان
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  با گفتن علائمی مثل <b className="text-slate-700">«گوسفند ۵۶ اسهال و تب داره»</b>، هوش مصنوعی سریعاً بیماری احتمالی و توصیه‌های دامپزشکی اولیه را نمایش می‌دهد.
                </p>
              </div>

              <div>
                <div className="text-xs font-bold text-[#1b4332] flex items-center gap-1.5 mb-2 px-1">
                  <span className="w-1.5 h-3.5 bg-red-600 rounded-full"></span>
                  پرونده‌ها و سوابق اخیر
                </div>

                <div className="space-y-2">
                  {healthRecords.map((hr) => (
                    <div
                      key={hr.id}
                      onClick={() => showToast(`پرونده پزشکی ${hr.title} باز شد`)}
                      className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm flex items-center gap-3 cursor-pointer active:scale-[0.98] transition-transform hover:border-emerald-200"
                    >
                      <div className={`w-11 h-11 ${hr.iconBg} rounded-2xl flex items-center justify-center text-xl shrink-0`}>
                        {hr.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">{hr.title}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{hr.desc}</div>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${hr.badgeColor}`}>
                        {hr.badge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vaccine Calendar Reminder */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm">
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-800">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  یادآور واکسیناسیون پیش رو
                </div>
                <div className="text-xs text-slate-600 bg-amber-50/70 p-2.5 rounded-xl border border-amber-100/80 leading-relaxed">
                  واکسن تب برفکی برای بره‌های پرواری ظرف ۲ هفته آینده پیشنهاد شده است.
                </div>
              </div>
            </div>
          )}

          {/* TAB: FINANCE */}
          {activeTab === 'finance' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-gradient-to-br from-white to-amber-50/40 rounded-2xl p-4 border border-amber-100 shadow-sm">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                  <span>💰</span> مدیریت مالی، هزینه‌ها و سود دامداری
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  بدون نیاز به نوشتن و کاغذ؛ فقط بگویید <b className="text-slate-700">«۱۰ میلیون برای دارو خرج کردم»</b> یا <b className="text-slate-700">«امروز ۴ میلیون شیر فروختم»</b> تا ثبت شود.
                </p>
              </div>

              {/* Monthly Finance Cards */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white p-3 rounded-2xl text-center border border-slate-100 shadow-sm">
                  <div className="text-xl font-black text-red-600">{monthlyExpense}م</div>
                  <div className="text-[11px] text-slate-500 mt-1">هزینه ماه</div>
                </div>
                <div className="bg-white p-3 rounded-2xl text-center border border-slate-100 shadow-sm">
                  <div className="text-xl font-black text-emerald-600">{monthlyIncome}م</div>
                  <div className="text-[11px] text-slate-500 mt-1">درآمد ماه</div>
                </div>
                <div className="bg-white p-3 rounded-2xl text-center border border-slate-100 shadow-sm">
                  <div className="text-xl font-black text-[#1b4332]">
                    {monthlyIncome - monthlyExpense}م
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">سود خالص</div>
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-[#1b4332] flex items-center gap-1.5 mb-2 px-1">
                  <span className="w-1.5 h-3.5 bg-amber-500 rounded-full"></span>
                  آخرین تراکنش‌های ثبت‌شده
                </div>

                <div className="space-y-2">
                  {transactions.map((tr) => (
                    <div
                      key={tr.id}
                      className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm flex items-center gap-3"
                    >
                      <div className={`w-11 h-11 ${tr.iconBg} rounded-2xl flex items-center justify-center text-xl shrink-0`}>
                        {tr.icon}
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-bold text-slate-900">{tr.title}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{tr.desc}</div>
                      </div>
                      <div className="text-left">
                        <span className={`text-xs font-bold ${tr.isIncome ? 'text-emerald-600' : 'text-slate-800'}`}>
                          {tr.isIncome ? `+ ${tr.amount}` : `- ${tr.amount}`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>

        {/* ============ FLOATING VOICE BUTTON (FAB) ============ */}
        <div className="absolute bottom-[66px] left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1 pointer-events-auto">
          <div className="bg-white/95 backdrop-blur-md px-3 py-0.5 rounded-full shadow-md border border-emerald-100 text-[10px] font-bold text-[#1b4332] flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            حرف بزن
          </div>
          <button
            onClick={startVoiceSession}
            className="w-[66px] h-[66px] rounded-full bg-gradient-to-tr from-[#1b4332] to-[#2d6a4f] text-white flex items-center justify-center shadow-[0_10px_25px_rgba(45,106,79,0.5)] border-4 border-[#f8f9f4] active:scale-90 transition-transform cursor-pointer group"
            title="صحبت با دام‌یار"
          >
            <Mic className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* ============ BOTTOM NAVIGATION BAR (All 5 items accessible) ============ */}
        <nav className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 grid grid-cols-5 py-2 px-1 z-20 shadow-lg">
          <button
            onClick={() => navigateTo('home')}
            className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
              activeTab === 'home' ? 'text-[#2d6a4f] font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">خانه</span>
          </button>

          <button
            onClick={() => navigateTo('herd')}
            className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
              activeTab === 'herd' ? 'text-[#2d6a4f] font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Layers className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">گله</span>
          </button>

          <button
            onClick={() => navigateTo('repro')}
            className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
              activeTab === 'repro' ? 'text-[#2d6a4f] font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Heart className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">فحلی</span>
          </button>

          <button
            onClick={() => navigateTo('health')}
            className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
              activeTab === 'health' ? 'text-[#2d6a4f] font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Stethoscope className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">سلامت</span>
          </button>

          <button
            onClick={() => navigateTo('finance')}
            className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
              activeTab === 'finance' ? 'text-[#2d6a4f] font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Coins className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">مالی</span>
          </button>
        </nav>

        {/* ============ VOICE MODAL ============ */}
        {isVoiceOpen && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end animate-in fade-in duration-200">
            <div className="bg-white w-full rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto shadow-2xl border-t border-slate-100 animate-in slide-in-from-bottom duration-300">
              
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> هوش مصنوعی صوتی دام‌یار
                </span>
                <button
                  onClick={closeVoice}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Voice Animated Circle */}
              <div className="text-center py-4">
                <div
                  className={`w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-3xl text-white shadow-xl transition-all ${
                    voiceStatus === 'listening'
                      ? 'bg-gradient-to-tr from-emerald-600 to-emerald-800 animate-pulse ring-8 ring-emerald-500/20'
                      : voiceStatus === 'thinking'
                      ? 'bg-gradient-to-tr from-amber-500 to-orange-600 animate-spin'
                      : 'bg-emerald-600'
                  }`}
                >
                  {voiceStatus === 'listening' && '🎙️'}
                  {voiceStatus === 'thinking' && '🧠'}
                  {voiceStatus === 'result' && '✅'}
                </div>
                <div className="text-sm font-extrabold text-[#1b4332] mb-1">{voiceText}</div>
                <div className="text-xs text-slate-500 px-4">{voiceSub}</div>
              </div>

              {/* Quick simulation chips */}
              <div className="mb-3">
                <div className="text-[11px] font-semibold text-slate-400 text-center mb-2">
                  نمونه دستورات آماده برای تست (روی هرکدام کلیک کنید):
                </div>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  <button
                    onClick={() => handleProcessVoice('یه بز ماده دو ساله خریدم، تگش ۱۰۲۴')}
                    className="bg-[#eef7f1] text-[#1b4332] hover:bg-emerald-200 active:scale-95 text-[11px] px-3 py-1.5 rounded-full border border-emerald-200/80 transition-colors cursor-pointer"
                  >
                    🐑 ثبت دام جدید
                  </button>
                  <button
                    onClick={() => handleProcessVoice('گوسفند ۵۶ امروز اسهال داره، بی‌حاله')}
                    className="bg-[#eef7f1] text-[#1b4332] hover:bg-emerald-200 active:scale-95 text-[11px] px-3 py-1.5 rounded-full border border-emerald-200/80 transition-colors cursor-pointer"
                  >
                    🩺 ثبت بیماری
                  </button>
                  <button
                    onClick={() => handleProcessVoice('بز ۲۰۰ امشب بی‌قراره دنبال نر میگرده')}
                    className="bg-[#eef7f1] text-[#1b4332] hover:bg-emerald-200 active:scale-95 text-[11px] px-3 py-1.5 rounded-full border border-emerald-200/80 transition-colors cursor-pointer"
                  >
                    ❤️ ثبت فحلی
                  </button>
                  <button
                    onClick={() => handleProcessVoice('امروز ۵۰ کیلو یونجه دادم به گله ۳')}
                    className="bg-[#eef7f1] text-[#1b4332] hover:bg-emerald-200 active:scale-95 text-[11px] px-3 py-1.5 rounded-full border border-emerald-200/80 transition-colors cursor-pointer"
                  >
                    📦 ثبت خوراک
                  </button>
                  <button
                    onClick={() => handleProcessVoice('۱۰ میلیون برای دارو خرج کردم')}
                    className="bg-[#eef7f1] text-[#1b4332] hover:bg-emerald-200 active:scale-95 text-[11px] px-3 py-1.5 rounded-full border border-emerald-200/80 transition-colors cursor-pointer"
                  >
                    💰 ثبت هزینه
                  </button>
                </div>
              </div>

              {/* Text Input Option */}
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="یا متن دستور را اینجا بنویسید..."
                  value={customVoiceInput}
                  onChange={(e) => setCustomVoiceInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && customVoiceInput.trim()) {
                      handleProcessVoice(customVoiceInput.trim());
                      setCustomVoiceInput('');
                    }
                  }}
                  className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-500"
                />
                <button
                  onClick={() => {
                    if (customVoiceInput.trim()) {
                      handleProcessVoice(customVoiceInput.trim());
                      setCustomVoiceInput('');
                    }
                  }}
                  className="bg-emerald-700 text-white px-3 py-2 rounded-xl text-xs font-bold active:scale-95 cursor-pointer"
                >
                  ارسال
                </button>
              </div>

              {/* AI Analysis Result Output */}
              {voiceResult && (
                <div className="bg-emerald-50/90 border-r-4 border-emerald-600 rounded-xl p-3 text-xs text-slate-800 space-y-1 mb-3 animate-in fade-in">
                  <div className="font-black text-emerald-900">{voiceResult.title}</div>
                  {voiceResult.lines.map((l, idx) => (
                    <div key={idx} className="text-slate-700 leading-relaxed font-medium">
                      {l}
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={closeVoice}
                className="w-full py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-200 active:scale-98 transition-all cursor-pointer"
              >
                بستن پنجره
              </button>
            </div>
          </div>
        )}

        {/* ============ ADD ANIMAL CONFIRMATION MODAL ============ */}
        {isAnimalModalOpen && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end animate-in fade-in duration-200">
            <div className="bg-white w-full rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto shadow-2xl border-t border-slate-100 animate-in slide-in-from-bottom duration-300">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-sm font-bold text-[#1b4332] flex items-center gap-1.5">
                  <span>🐑</span> ثبت دام جدید در سیستم
                </h3>
                <button
                  onClick={() => setIsAnimalModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                اطلاعات استخراج‌شده از صحبت یا ورود دستی را بررسی و تأیید کنید:
              </p>

              <div className="space-y-2 mb-4">
                <div className="bg-slate-100 rounded-xl px-3.5 py-2 flex items-center gap-2 text-xs">
                  <span className="text-slate-400 shrink-0">🏷️ شماره پلاک/تگ:</span>
                  <input
                    type="text"
                    value={animalForm.tag}
                    onChange={(e) => setAnimalForm({ ...animalForm, tag: e.target.value })}
                    className="flex-1 bg-transparent font-bold text-slate-800 outline-none text-left"
                  />
                </div>

                <div className="bg-slate-100 rounded-xl px-3.5 py-2 flex items-center gap-2 text-xs">
                  <span className="text-slate-400 shrink-0">🐐 نوع و نژاد:</span>
                  <input
                    type="text"
                    value={animalForm.type}
                    onChange={(e) => setAnimalForm({ ...animalForm, type: e.target.value })}
                    className="flex-1 bg-transparent font-bold text-slate-800 outline-none"
                  />
                </div>

                <div className="bg-slate-100 rounded-xl px-3.5 py-2 flex items-center gap-2 text-xs">
                  <span className="text-slate-400 shrink-0">📅 سن / تاریخ تولد:</span>
                  <input
                    type="text"
                    value={animalForm.age}
                    onChange={(e) => setAnimalForm({ ...animalForm, age: e.target.value })}
                    className="flex-1 bg-transparent font-bold text-slate-800 outline-none"
                  />
                </div>

                <div className="bg-slate-100 rounded-xl px-3.5 py-2 flex items-center gap-2 text-xs">
                  <span className="text-slate-400 shrink-0">🏷️ گروه گله:</span>
                  <select
                    value={animalForm.group}
                    onChange={(e) => setAnimalForm({ ...animalForm, group: e.target.value })}
                    className="flex-1 bg-transparent font-bold text-slate-800 outline-none"
                  >
                    {herdGroups.map((g) => (
                      <option key={g.id} value={g.name}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleAddAnimalConfirm}
                  className="flex-1 py-3 bg-[#2d6a4f] text-white font-bold rounded-xl text-xs hover:bg-[#1b4332] active:scale-98 shadow-md cursor-pointer"
                >
                  ✅ تأیید و ذخیره در گله
                </button>
                <button
                  onClick={() => setIsAnimalModalOpen(false)}
                  className="px-4 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl text-xs hover:bg-slate-200 active:scale-98 cursor-pointer"
                >
                  انصراف
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

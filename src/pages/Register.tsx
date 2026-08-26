import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, Camera, User, Mail, Lock, Phone, Check, Sparkles, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { IRAN_CITIES, SPECIALTIES } from '../utils/cities';
import { validateEmail, validatePassword, validatePhone, validateRequired } from '../utils/validation';

export function Register() {
  const [role, setRole] = useState<'photographer' | 'client'>('client');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    city: '',
    bio: '',
    priceRange: { min: 0, max: 0 },
    specialties: [] as string[],
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errors: Record<string, string> = {};
    if (step === 1) {
      const nameResult = validateRequired(formData.name, 'نام');
      if (!nameResult.isValid) errors.name = nameResult.error!;
      const emailResult = validateEmail(formData.email);
      if (!emailResult.isValid) errors.email = emailResult.error!;
      const phoneResult = validatePhone(formData.phone);
      if (!phoneResult.isValid) errors.phone = phoneResult.error!;
    } else {
      const passwordResult = validatePassword(formData.password);
      if (!passwordResult.isValid) errors.password = passwordResult.error!;
      if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'رمز عبور با تکرار آن مطابقت ندارد';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError('');

    const success = await register({
      ...formData,
      role,
      priceRange: role === 'photographer' ? formData.priceRange : undefined,
      specialties: role === 'photographer' ? formData.specialties : undefined,
    });

    if (success) {
      navigate('/');
    } else {
      setError('خطا در ثبت‌نام. ایمیل ممکن است تکراری باشد.');
    }
    setLoading(false);
  };

  const toggleSpecialty = (specialty: string) => {
    setFormData({
      ...formData,
      specialties: formData.specialties.includes(specialty)
        ? formData.specialties.filter(s => s !== specialty)
        : [...formData.specialties, specialty],
    });
  };

  const features = [
    { icon: Camera, title: 'نمونه کار آنلاین', desc: 'پورتفولیوی حرفه‌ای بسازید' },
    { icon: Sparkles, title: 'جستجوی هوشمند', desc: 'مشتریان جدید پیدا کنید' },
    { icon: ArrowUpRight, title: 'درآمد بیشتر', desc: 'پروژه‌های بیشتری بگیرید' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-primary to-blue-600" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary-light rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Camera className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black">لومینو</span>
          </Link>

          <div>
            <h1 className="text-4xl font-black mb-6 leading-tight">
              به جامعه عکاسان
              <br />
              حرفه‌ای بپیوندید
            </h1>
            <p className="text-white/70 text-lg leading-relaxed max-w-md">
              {role === 'photographer'
                ? 'نمونه کار خود را به هزاران مشتری نشان دهید و درآمد کسب کنید.'
                : 'بهترین عکاسان را پیدا کنید و رویدادهای خود را خاطره‌انگیز کنید.'}
            </p>

            <div className="mt-10 space-y-4">
              {features.map((f) => (
                <div key={f.title} className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-4">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <f.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{f.title}</p>
                    <p className="text-white/60 text-xs">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-white/40 text-sm">© ۲۰۲۴ لومینو. تمامی حقوق محفوظ است.</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-surface-alt">
        <div className="w-full max-w-md animate-fade-in-up opacity-0">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center justify-center w-14 h-14 rounded-2xl gradient-primary shadow-lg shadow-secondary/20 mb-4">
              <Camera className="w-7 h-7 text-white" />
            </Link>
          </div>

          {/* Step Progress */}
          <div className="flex items-center gap-3 mb-8">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center flex-1 gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  step >= s
                    ? 'gradient-primary text-white shadow-lg shadow-secondary/30'
                    : 'bg-surface border-2 border-border text-gray-400'
                }`}>
                  {step > s ? <Check className="w-4 h-4" /> : s}
                </div>
                <div className={`flex-1 h-1 rounded-full transition-all duration-500 ${
                  step > s ? 'gradient-primary' : 'bg-border'
                }`} />
              </div>
            ))}
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-black text-primary mb-2">
              {step === 1 ? 'ساخت حساب جدید' : 'تکمیل اطلاعات'}
            </h2>
            <p className="text-text text-sm">
              {step === 1 ? 'اطلاعات پایه خود را وارد کنید' : 'تنظیمات حساب خود را تکمیل کنید'}
            </p>
          </div>

          <div className="bg-surface rounded-3xl p-8 border border-border-light shadow-xl shadow-black/5">
            {step === 1 && (
              <div className="space-y-5">
                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-semibold text-primary mb-3">نوع حساب</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole('client')}
                      className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-300 ${
                        role === 'client'
                          ? 'border-secondary bg-secondary/5 shadow-lg shadow-secondary/10'
                          : 'border-border hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                        role === 'client' ? 'gradient-primary' : 'bg-surface-alt'
                      }`}>
                        <User className={`w-6 h-6 ${role === 'client' ? 'text-white' : 'text-gray-400'}`} />
                      </div>
                      <span className={`font-semibold text-sm ${role === 'client' ? 'text-primary' : 'text-gray-500'}`}>
                        مشتری
                      </span>
                      {role === 'client' && (
                        <p className="text-xs text-text text-center">رزرو عکاس حرفه‌ای</p>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('photographer')}
                      className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-300 ${
                        role === 'photographer'
                          ? 'border-secondary bg-secondary/5 shadow-lg shadow-secondary/10'
                          : 'border-border hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                        role === 'photographer' ? 'gradient-primary' : 'bg-surface-alt'
                      }`}>
                        <Camera className={`w-6 h-6 ${role === 'photographer' ? 'text-white' : 'text-gray-400'}`} />
                      </div>
                      <span className={`font-semibold text-sm ${role === 'photographer' ? 'text-primary' : 'text-gray-500'}`}>
                        عکاس
                      </span>
                      {role === 'photographer' && (
                        <p className="text-xs text-text text-center">نمایش نمونه کار</p>
                      )}
                    </button>
                  </div>
                </div>

                {/* Name */}
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-primary">نام و نام خانوادگی</label>
                  <div className="relative">
                    <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="مثال: علی رضایی"
                      className={`w-full pr-12 pl-5 py-4 rounded-2xl border bg-surface-alt text-primary placeholder-gray-400 transition-all duration-300 focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 ${fieldErrors.name ? 'border-error ring-4 ring-error/10' : 'border-border'}`}
                    />
                  </div>
                  {fieldErrors.name && <p className="text-xs text-error mt-1 flex items-center gap-1">{fieldErrors.name}</p>}
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-primary">ایمیل</label>
                  <div className="relative">
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="example@email.com"
                      className={`w-full pr-12 pl-5 py-4 rounded-2xl border bg-surface-alt text-primary placeholder-gray-400 transition-all duration-300 focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 ${fieldErrors.email ? 'border-error ring-4 ring-error/10' : 'border-border'}`}
                    />
                  </div>
                  {fieldErrors.email && <p className="text-xs text-error mt-1">{fieldErrors.email}</p>}
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-primary">شماره تماس</label>
                  <div className="relative">
                    <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="09123456789"
                      className={`w-full pr-12 pl-5 py-4 rounded-2xl border bg-surface-alt text-primary placeholder-gray-400 transition-all duration-300 focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 ${fieldErrors.phone ? 'border-error ring-4 ring-error/10' : 'border-border'}`}
                    />
                  </div>
                  {fieldErrors.phone && <p className="text-xs text-error mt-1">{fieldErrors.phone}</p>}
                </div>

                <Button type="button" onClick={() => { if (validate()) setStep(2); }} className="w-full" size="lg">
                  ادامه
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </div>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmit}>
                {role === 'photographer' && (
                  <div className="space-y-5 mb-6 pb-6 border-b border-border-light">
                    <div>
                      <label className="block text-sm font-semibold text-primary mb-2.5">شهر فعالیت</label>
                      <div className="grid grid-cols-4 gap-2 max-h-28 overflow-y-auto scrollbar-thin p-1">
                        {IRAN_CITIES.filter(c => c !== 'همه').map((city) => (
                          <button
                            key={city}
                            type="button"
                            onClick={() => setFormData({ ...formData, city })}
                            className={`px-2 py-2 text-xs font-medium rounded-xl border transition-all duration-200 ${
                              formData.city === city
                                ? 'border-secondary bg-secondary/10 text-primary font-semibold'
                                : 'border-border hover:border-gray-300 text-gray-600'
                            }`}
                          >
                            {city}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-primary mb-2.5">تخصص‌ها</label>
                      <div className="flex flex-wrap gap-2">
                        {SPECIALTIES.map((specialty) => (
                          <button
                            key={specialty}
                            type="button"
                            onClick={() => toggleSpecialty(specialty)}
                            className={`px-3.5 py-2 text-xs font-medium rounded-xl border transition-all duration-200 ${
                              formData.specialties.includes(specialty)
                                ? 'border-secondary bg-secondary/10 text-primary font-semibold'
                                : 'border-border hover:border-gray-300 text-gray-600'
                            }`}
                          >
                            {formData.specialties.includes(specialty) && <Check className="w-3 h-3 inline ml-1" />}
                            {specialty}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {role === 'client' && (
                  <div className="mb-6 pb-6 border-b border-border-light">
                    <label className="block text-sm font-semibold text-primary mb-2.5">شهر شما</label>
                    <div className="grid grid-cols-4 gap-2 max-h-28 overflow-y-auto scrollbar-thin p-1">
                      {IRAN_CITIES.filter(c => c !== 'همه').map((city) => (
                        <button
                          key={city}
                          type="button"
                          onClick={() => setFormData({ ...formData, city })}
                          className={`px-2 py-2 text-xs font-medium rounded-xl border transition-all duration-200 ${
                            formData.city === city
                              ? 'border-secondary bg-secondary/10 text-primary font-semibold'
                              : 'border-border hover:border-gray-300 text-gray-600'
                          }`}
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Password */}
                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-primary">رمز عبور</label>
                    <div className="relative">
                      <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="حداقل ۸ کاراکتر"
                        className={`w-full pr-12 pl-12 py-4 rounded-2xl border bg-surface-alt text-primary placeholder-gray-400 transition-all duration-300 focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 ${fieldErrors.password ? 'border-error ring-4 ring-error/10' : 'border-border'}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {fieldErrors.password && <p className="text-xs text-error mt-1">{fieldErrors.password}</p>}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-primary">تکرار رمز عبور</label>
                    <div className="relative">
                      <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        placeholder="رمز عبور را مجدداً وارد کنید"
                        className={`w-full pr-12 pl-5 py-4 rounded-2xl border bg-surface-alt text-primary placeholder-gray-400 transition-all duration-300 focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 ${fieldErrors.confirmPassword ? 'border-error ring-4 ring-error/10' : 'border-border'}`}
                      />
                    </div>
                    {fieldErrors.confirmPassword && <p className="text-xs text-error mt-1">{fieldErrors.confirmPassword}</p>}
                  </div>

                  {error && (
                    <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-error text-sm flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold">!</span>
                      </div>
                      {error}
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <Button type="button" variant="secondary" onClick={() => setStep(1)} className="flex-1">
                      <ArrowLeft className="w-4 h-4 rotate-180" />
                      بازگشت
                    </Button>
                    <Button type="submit" loading={loading} className="flex-1">
                      ثبت‌نام
                      <ArrowUpRight className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-text">
              قبلاً ثبت‌نام کرده‌اید؟{' '}
              <Link to="/login" className="text-secondary hover:text-secondary-dark font-semibold transition-colors">
                وارد شوید
              </Link>
            </p>
          </div>

          <Link
            to="/"
            className="flex items-center justify-center gap-2 mt-6 text-sm text-text hover:text-primary transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            بازگشت به صفحه اصلی
          </Link>
        </div>
      </div>
    </div>
  );
}

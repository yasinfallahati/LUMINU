import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, Camera, Mail, Lock, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { validateEmail, validatePassword } from '../utils/validation';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errors: Record<string, string> = {};
    const emailResult = validateEmail(email);
    if (!emailResult.isValid) errors.email = emailResult.error!;
    const passwordResult = validatePassword(password);
    if (!passwordResult.isValid) errors.password = passwordResult.error!;
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError('');
    const success = await login(email, password);
    if (success) {
      navigate('/');
    } else {
      setError('ایمیل یا رمز عبور اشتباه است');
    }
    setLoading(false);
  };

  const demoAccounts = [
    { email: 'ali@example.com', role: 'عکاس', city: 'تهران' },
    { email: 'mohammad@example.com', role: 'مشتری', city: 'تهران' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary-dark to-blue-600" />
        <div className="absolute inset-0 opacity-[0.03]">
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
              به پلتفرم عکاسی
              <br />
              ایران خوش آمدید
            </h1>
            <p className="text-white/70 text-lg leading-relaxed max-w-md">
              هزاران عکاس حرفه‌ای منتظر همکاری با شما هستند.
              همین الان وارد شوید و شروع کنید.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5">
                <p className="text-3xl font-black">۵۰۰+</p>
                <p className="text-white/60 text-sm mt-1">عکاس فعال</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5">
                <p className="text-3xl font-black">۱۰K+</p>
                <p className="text-white/60 text-sm mt-1">پروژه موفق</p>
              </div>
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

          <div className="mb-8">
            <h2 className="text-2xl font-black text-primary mb-2">ورود به حساب</h2>
            <p className="text-text text-sm">خوش آمدید! برای ادامه وارد شوید.</p>
          </div>

          <div className="bg-surface rounded-3xl p-8 border border-border-light shadow-xl shadow-black/5">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-error text-sm flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold">!</span>
                  </div>
                  {error}
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-sm font-semibold text-primary">ایمیل</label>
                <div className="relative">
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    className={`w-full pr-12 pl-5 py-4 rounded-2xl border bg-surface-alt text-primary placeholder-gray-400 transition-all duration-300 focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 ${fieldErrors.email ? 'border-error ring-4 ring-error/10' : 'border-border'}`}
                  />
                </div>
                {fieldErrors.email && <p className="text-xs text-error mt-1">{fieldErrors.email}</p>}
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-primary">رمز عبور</label>
                  <button type="button" className="text-xs text-secondary hover:text-secondary-dark font-medium transition-colors">
                    فراموشی رمز عبور
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
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

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-secondary focus:ring-secondary" />
                <span className="text-sm text-text">مرا به خاطر بسپار</span>
              </label>

              <Button type="submit" loading={loading} className="w-full" size="lg">
                ورود
                <ArrowUpRight className="w-5 h-5" />
              </Button>
            </form>

            {/* Demo Accounts */}
            <div className="mt-6 pt-6 border-t border-border-light">
              <p className="text-xs text-text text-center mb-3">حساب‌های نمونه (رمز: password123)</p>
              <div className="grid grid-cols-2 gap-2">
                {demoAccounts.map((acc) => (
                  <button
                    key={acc.email}
                    onClick={() => { setEmail(acc.email); setPassword('password123'); }}
                    className="p-3 rounded-xl border border-border hover:border-secondary/30 hover:bg-secondary/5 transition-all text-right"
                  >
                    <p className="text-xs font-medium text-primary truncate">{acc.email}</p>
                    <p className="text-[10px] text-text mt-0.5">{acc.role} • {acc.city}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-text">
              حساب ندارید؟{' '}
              <Link to="/register" className="text-secondary hover:text-secondary-dark font-semibold transition-colors">
                ثبت‌نام کنید
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

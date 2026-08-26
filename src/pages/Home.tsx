import { Link } from 'react-router-dom';
import { Camera, Search, Users, ArrowLeft, Star, Sparkles, MapPin, ArrowUpRight, Heart, Shield, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { PhotographerCard } from '../components/ui/PhotographerCard';

export function Home() {
  const { user } = useAuth();
  const { photographers } = useData();

  const featuredPhotographers = photographers.filter(p => p.role === 'photographer').slice(0, 6);

  const stats = [
    { number: '۵۰۰+', label: 'عکاس حرفه‌ای', icon: Camera },
    { number: '۱۰K+', label: 'پروژه موفق', icon: Heart },
    { number: '۹۸٪', label: 'رضایت مشتری', icon: Star },
    { number: '۳۰+', label: 'شهر ایران', icon: MapPin },
  ];

  const features = [
    {
      icon: Camera,
      title: 'نمونه کار زنده',
      description: 'پورتفولیوی حرفه‌ای با گالری تصاویر تعاملی و نمایش پروژه‌ها به بهترین شکل ممکن',
      color: 'from-violet-500 to-purple-600',
      bgColor: 'bg-violet-50',
    },
    {
      icon: Search,
      title: 'جستجوی هوشمند',
      description: 'پیدا کردن عکاس بر اساس شهر، تخصص، بودجه و امتیاز با فیلترهای پیشرفته',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
    },
    {
      icon: MapPin,
      title: 'نقشه و مکان‌یابی',
      description: 'مشاهده عکاسان نزدیک روی نقشه و انتخاب بر اساس موقعیت جغرافیایی',
      color: 'from-rose-500 to-pink-500',
      bgColor: 'bg-rose-50',
    },
    {
      icon: Users,
      title: 'ارتباط مستقیم',
      description: 'چت و گفتگوی آنلاین، رزرو آسان و سیستم پیشنهاد قیمت هوشمند',
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50',
    },
  ];

  const whyUs = [
    { icon: Shield, title: 'تضمین کیفیت', desc: 'تمام عکاسان تایید شده و حرفه‌ای هستند' },
    { icon: Zap, title: 'رزرو آنلاین', desc: 'بدون نیاز به تماس تلفنی، آنلاین رزرو کنید' },
    { icon: Star, title: 'سیستم امتیازدهی', desc: 'نظرات و امتیازات مشتریان قبلی' },
    { icon: Heart, title: 'پشتیبانی ۲۴/۷', desc: 'تیم پشتیبانی همیشه در دسترس' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[100vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-secondary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

        <div className="relative z-10 container-wide px-6 lg:px-12 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Right side - Content */}
            <div className="order-2 lg:order-1 text-right">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm mb-8 animate-fade-in-up opacity-0">
                <Sparkles className="w-4 h-4" />
                <span className="font-medium">پلتفرم شماره یک عکاسان ایران</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-primary mb-6 leading-[1.15] animate-fade-in-up opacity-0 stagger-1">
                عکاسی حرفه‌ای
                <br />
                <span className="text-gradient">با بهترین‌ها</span>
              </h1>

              <p className="text-lg text-text max-w-xl leading-relaxed mb-10 animate-fade-in-up opacity-0 stagger-2">
                پلتفرم لومینو شما را به بهترین عکاسان ایران متصل می‌کند. از عکاسی عروسی تا تبلیغاتی، هر نوع عکاسی که نیاز دارید اینجا پیدا می‌شود.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up opacity-0 stagger-3">
                {!user ? (
                  <>
                    <Link
                      to="/register"
                      className="btn-primary text-base group"
                    >
                      شروع رایگان
                      <ArrowUpRight className="w-5 h-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </Link>
                    <Link
                      to="/discover"
                      className="btn-ghost text-base group"
                    >
                      <Search className="w-5 h-5" />
                      مشاهده عکاسان
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/discover"
                    className="btn-primary text-base group"
                  >
                    <Search className="w-5 h-5" />
                    یافتن عکاس
                  </Link>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-16 pt-10 border-t border-border animate-fade-in-up opacity-0 stagger-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center sm:text-right group">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-secondary/10 mb-3 group-hover:scale-110 transition-transform">
                      <stat.icon className="w-5 h-5 text-secondary" />
                    </div>
                    <p className="text-2xl font-black text-primary">{stat.number}</p>
                    <p className="text-sm text-text mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Left side - Image grid */}
            <div className="order-1 lg:order-2 animate-fade-in-up opacity-0 stagger-2">
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="rounded-3xl overflow-hidden aspect-[3/4] shadow-2xl shadow-black/10">
                      <img
                        src="https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600&q=80"
                        alt=""
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="rounded-3xl overflow-hidden aspect-square shadow-2xl shadow-black/10">
                      <img
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80"
                        alt=""
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  </div>
                  <div className="space-y-4 mt-8">
                    <div className="rounded-3xl overflow-hidden aspect-square shadow-2xl shadow-black/10">
                      <img
                        src="https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80"
                        alt=""
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="rounded-3xl overflow-hidden aspect-[3/4] shadow-2xl shadow-black/10">
                      <img
                        src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=600&q=80"
                        alt=""
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  </div>
                </div>

                {/* Floating card */}
                <div className="absolute -bottom-6 -right-6 glass rounded-2xl p-4 shadow-2xl animate-float border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-primary text-sm">علی محمدی</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-xs font-semibold">۴.۹</span>
                        <span className="text-xs text-text">۱۲۸ نظر</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -top-4 -left-4 gradient-accent rounded-2xl px-4 py-2 shadow-lg animate-float" style={{ animationDelay: '1s' }}>
                  <p className="text-white text-sm font-bold">۱۰۰٪ تضمین</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 sm:py-28 lg:py-32 bg-surface">
        <div className="container-wide px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              چرا لومینو؟
            </div>
            <h2 className="text-primary mb-4">
              بهترین انتخاب برای عکاسی
            </h2>
            <p className="text-text text-lg">
              ما بهترین عکاسان را با بهترین مشتریان متصل می‌کنیم
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyUs.map((item, index) => (
              <div
                key={item.title}
                className={`text-center p-8 rounded-3xl border border-border-light hover:border-secondary/20 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 bg-surface opacity-0 animate-fade-in-up stagger-${Math.min(index + 1, 4)}`}
              >
                <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-5">
                  <item.icon className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="text-lg font-bold text-primary mb-2">{item.title}</h3>
                <p className="text-text text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding">
        <div className="container-wide px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              امکانات ویژه
            </div>
            <h2 className="text-primary mb-4">
              همه چیز برای عکاسی حرفه‌ای
            </h2>
            <p className="text-text text-lg">
              ابزارهای پیشرفته برای پیدا کردن، رزرو و همکاری با بهترین عکاسان
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className={`group p-8 rounded-3xl border border-border-light hover:border-secondary/20 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 bg-surface opacity-0 animate-fade-in-up stagger-${index + 1}`}
                >
                  <div className={`w-14 h-14 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <div className={`w-8 h-8 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-3">{feature.title}</h3>
                  <p className="text-text leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Photographers */}
      <section className="section-padding bg-surface">
        <div className="container-wide px-6 lg:px-12">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
                <Star className="w-4 h-4" />
                برترین‌ها
              </div>
              <h2 className="text-primary">عکاسان برتر این هفته</h2>
            </div>
            <Link
              to="/discover"
              className="hidden sm:flex items-center gap-2 text-secondary hover:text-secondary-dark font-medium transition-colors group"
            >
              مشاهده همه
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPhotographers.map((photographer, index) => (
              <div key={photographer.id} className={`opacity-0 animate-fade-in-up stagger-${Math.min(index + 1, 4)}`}>
                <PhotographerCard
                  id={photographer.id}
                  name={photographer.name}
                  avatar={photographer.avatar || ''}
                  city={photographer.city || ''}
                  rating={photographer.rating || 0}
                  reviewCount={photographer.reviewCount || 0}
                  specialties={photographer.specialties || []}
                  priceRange={photographer.priceRange}
                  coverImage={
                    index === 0
                      ? 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80'
                      : index === 1
                      ? 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=80'
                      : index === 2
                      ? 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80'
                      : undefined
                  }
                />
              </div>
            ))}
          </div>

          <div className="text-center mt-10 sm:hidden">
            <Link
              to="/discover"
              className="btn-secondary group"
            >
              مشاهده همه عکاسان
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container-wide px-6 lg:px-12">
          <div className="relative overflow-hidden rounded-[2rem] p-12 sm:p-16 text-center" style={{ background: 'linear-gradient(135deg, #111827 0%, #1f2937 50%, #374151 100%)' }}>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-40 h-40 bg-secondary rounded-full blur-3xl" />
              <div className="absolute bottom-10 right-10 w-60 h-60 bg-blue-500 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-6">
                آماده‌اید عکاس بعدی خود را پیدا کنید؟
              </h2>
              <p className="text-white/60 text-lg max-w-xl mx-auto mb-10">
                همین الان ثبت‌نام کنید و به جامعه هزاران عکاس حرفه‌ای بپیوندید
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-primary transition-all duration-300 shadow-lg shadow-secondary/30 hover:shadow-xl hover:shadow-secondary/40 hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)' }}
                >
                  شروع رایگان
                  <ArrowUpRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/discover"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300"
                >
                  <Search className="w-5 h-5" />
                  مشاهده نمونه‌ها
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

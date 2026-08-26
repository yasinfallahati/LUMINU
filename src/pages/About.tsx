import { DocumentTitle } from '../components/DocumentTitle';
import { Card } from '../components/ui/Card';
import { SectionTitle } from '../components/ui/SectionTitle';
import { Button } from '../components/ui/Button';
import { useI18n } from '../i18n/I18nContext';
import { Camera, Shield, Sparkles, Eye, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export function About() {
  const { t } = useI18n();

  const values = [
    {
      icon: Sparkles,
      titleKey: 'about.value1.title',
      textKey: 'about.value1.text',
    },
    {
      icon: Shield,
      titleKey: 'about.value2.title',
      textKey: 'about.value2.text',
    },
    {
      icon: Camera,
      titleKey: 'about.value3.title',
      textKey: 'about.value3.text',
    },
    {
      icon: Eye,
      titleKey: 'about.value4.title',
      textKey: 'about.value4.text',
    },
  ];

  const team = [
    {
      name: 'علی محمدی',
      role: 'بنیان‌گذار و مدیرعامل',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ali',
    },
    {
      name: 'سارا احمدی',
      role: 'مدیر محصول',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sara',
    },
    {
      name: 'رضا کریمی',
      role: 'مدیر فنی',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=reza',
    },
    {
      name: 'مریم حسینی',
      role: 'مدیر بازاریابی',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maryam',
    },
  ];

  const faqs = [
    {
      question: 'لومینو چیست؟',
      answer: 'لومینو پلتفرمی برای ارتباط مستقیم بین عکاسان حرفه‌ای و مشتریانی است که به خدمات عکاسی باکیفیت نیاز دارند.',
    },
    {
      question: 'چگونه عکاس پیدا کنم؟',
      answer: 'از طریق صفحه کشف، می‌توانید عکاسان را بر اساس شهر، تخصص و امتیاز جستجو کنید.',
    },
    {
      question: 'هزینه استفاده از لومینو چقدر است؟',
      answer: 'ثبت‌نام و استفاده از لومینو برای مشتریان رایگان است. عکاسان نیز پس از دریافت پروژه، کمیسیون پرداخت می‌کنند.',
    },
    {
      question: 'چگونه رزرو کنم؟',
      answer: 'پس از انتخاب عکاس، می‌توانید از طریق دکمه رزرو در پروفایل عکاس، درخواست خود را ارسال کنید.',
    },
  ];

  return (
    <div className="min-h-screen">
      <DocumentTitle title={t('about.title')} />

      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1920&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />
        </div>
        <div className="relative z-10 container-narrow text-center px-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">{t('about.title')}</h1>
          <p className="text-lg text-white/80 max-w-xl mx-auto">{t('about.subtitle')}</p>
        </div>
      </section>

      <section className="section-padding container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-primary mb-6">{t('about.mission')}</h2>
            <p className="text-gray-600 leading-relaxed text-lg mb-8">{t('about.missionText')}</p>
            <h2 className="text-3xl font-bold text-primary mb-6">{t('about.vision')}</h2>
            <p className="text-gray-600 leading-relaxed text-lg">{t('about.visionText')}</p>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80"
              alt="Team"
              className="rounded-2xl shadow-xl"
            />
          </div>
        </div>
      </section>

      <section className="section-padding bg-surface">
        <div className="container-wide">
          <SectionTitle title={t('about.values')} align="center" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <Card key={value.titleKey} padding="lg" className="text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-lg font-bold text-primary mb-2">{t(value.titleKey)}</h3>
                <p className="text-gray-600 text-sm">{t(value.textKey)}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding container-wide">
        <SectionTitle title={t('about.team')} align="center" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member) => (
            <Card key={member.name} padding="lg" hover className="text-center">
              <img
                src={member.image}
                alt={member.name}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="font-bold text-primary">{member.name}</h3>
              <p className="text-sm text-gray-500">{member.role}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="section-padding bg-surface">
        <div className="container-wide max-w-3xl">
          <SectionTitle title={t('about.faq')} align="center" />
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} padding="lg">
                <h3 className="font-bold text-primary mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding container-wide">
        <div className="bg-primary rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{t('about.contact')}</h2>
          <p className="text-white/70 max-w-xl mx-auto mb-8">
            {t('about.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-white/80">
              <Mail className="w-5 h-5" />
              <span>info@lumio.ir</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <Phone className="w-5 h-5" />
              <span>۰۲۱-۱۲۳۴۵۶۷۸</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <MapPin className="w-5 h-5" />
              <span>تهران، خیابان ولیعصر</span>
            </div>
          </div>
          <Link to="/register">
            <Button size="lg">{t('home.hero.cta')}</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

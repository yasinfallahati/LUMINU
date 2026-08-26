import { useState } from 'react';
import { User, Bell, Lock, Globe, Shield, Save, Sun, Moon } from 'lucide-react';
import { DocumentTitle } from '../components/DocumentTitle';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Avatar } from '../components/ui/Avatar';
import { SectionTitle } from '../components/ui/SectionTitle';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../i18n/I18nContext';
import { useI18n as useI18nContext } from '../i18n/I18nContext';
import { useTheme } from '../contexts/ThemeContext';
import type { Locale } from '../i18n/translations';

type SettingsTab = 'profile' | 'account' | 'notifications' | 'security' | 'language';

export function Settings() {
  const { t } = useI18n();
  const { locale, setLocale } = useI18nContext();
  const { user, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    city: user?.city || '',
    bio: user?.bio || '',
  });

  const handleSaveProfile = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    updateUser(profileForm);
    setIsSaving(false);
  };

  const tabs = [
    { id: 'profile' as const, label: t('settings.profile'), icon: User },
    { id: 'account' as const, label: t('settings.account'), icon: Shield },
    { id: 'notifications' as const, label: t('settings.notifications'), icon: Bell },
    { id: 'security' as const, label: t('settings.security'), icon: Lock },
    { id: 'language' as const, label: t('settings.language'), icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-surface-alt">
      <DocumentTitle title={t('settings.title')} />

      <div className="bg-white border-b border-border-light">
        <div className="container-wide py-8">
          <SectionTitle title={t('settings.title')} subtitle={t('settings.account')} />
        </div>
      </div>

      <div className="container-wide py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Card padding="lg" hover={false}>
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-secondary/10 text-secondary'
                        : 'text-gray-600 hover:bg-surface-alt'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </Card>
          </div>

          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <Card padding="lg" hover={false}>
                <h2 className="text-xl font-bold text-primary mb-6">{t('settings.profile')}</h2>

                <div className="flex items-center gap-6 mb-8 pb-8 border-b border-border-light">
                  <Avatar src={user?.avatar} alt={user?.name} fallback={user?.name || ''} size="xl" />
                  <div>
                    <Button variant="secondary" size="sm">
                      {t('settings.avatar')}
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">JPG, PNG. حداکثر 2MB</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label={t('settings.name')}
                    value={profileForm.name}
                    onChange={(v) => setProfileForm({ ...profileForm, name: v })}
                  />
                  <Input
                    label={t('settings.email')}
                    type="email"
                    value={profileForm.email}
                    onChange={(v) => setProfileForm({ ...profileForm, email: v })}
                    disabled
                  />
                  <Input
                    label={t('settings.phone')}
                    type="tel"
                    value={profileForm.phone}
                    onChange={(v) => setProfileForm({ ...profileForm, phone: v })}
                  />
                  <Input
                    label={t('settings.city')}
                    value={profileForm.city}
                    onChange={(v) => setProfileForm({ ...profileForm, city: v })}
                  />
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.bio')}</label>
                    <textarea
                      rows={4}
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button onClick={handleSaveProfile} loading={isSaving} icon={<Save className="w-4 h-4" />}>
                    {t('settings.saveChanges')}
                  </Button>
                </div>
              </Card>
            )}

            {activeTab === 'account' && (
              <Card padding="lg" hover={false}>
                <h2 className="text-xl font-bold text-primary mb-6">{t('settings.account')}</h2>
                <div className="space-y-6">
                  <div className="p-4 bg-surface-alt rounded-xl">
                    <h3 className="font-medium text-primary mb-2">نوع حساب</h3>
                    <p className="text-gray-600">
                      {user?.role === 'photographer' ? t('auth.photographer') : t('auth.client')}
                    </p>
                  </div>
                  <div className="p-4 bg-surface-alt rounded-xl">
                    <h3 className="font-medium text-primary mb-2">تاریخ عضویت</h3>
                    <p className="text-gray-600">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fa-IR') : '-'}</p>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === 'notifications' && (
              <Card padding="lg" hover={false}>
                <h2 className="text-xl font-bold text-primary mb-6">{t('settings.notifications')}</h2>
                <div className="space-y-4">
                  {[
                    { id: 'email_booking', label: 'اعلان رزرو جدید ایمیلی', defaultChecked: true },
                    { id: 'email_message', label: 'اعلان پیام جدید ایمیلی', defaultChecked: true },
                    { id: 'push_booking', label: 'اعلان رزرو جدید نوتیفیکیشن', defaultChecked: true },
                    { id: 'push_message', label: 'اعلان پیام جدید نوتیفیکیشن', defaultChecked: false },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-surface-alt rounded-xl">
                      <span className="font-medium text-primary">{item.label}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked={item.defaultChecked}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-secondary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {activeTab === 'security' && (
              <Card padding="lg" hover={false}>
                <h2 className="text-xl font-bold text-primary mb-6">{t('settings.security')}</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-primary mb-4">{t('settings.changePassword')}</h3>
                    <div className="space-y-4 max-w-md">
                      <Input
                        label={t('settings.currentPassword')}
                        type="password"
                        value=""
                        onChange={() => {}}
                      />
                      <Input
                        label={t('settings.newPassword')}
                        type="password"
                        value=""
                        onChange={() => {}}
                      />
                      <Input
                        label={t('settings.confirmPassword')}
                        type="password"
                        value=""
                        onChange={() => {}}
                      />
                      <Button>{t('settings.changePassword')}</Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === 'language' && (
              <Card padding="lg" hover={false}>
                <h2 className="text-xl font-bold text-primary mb-6">{t('settings.language')}</h2>

                <div className="mb-8">
                  <h3 className="font-medium text-primary mb-4">حالت نمایش</h3>
                  <div className="flex gap-3">
                    <button
                      onClick={() => theme === 'dark' && toggleTheme()}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all flex-1 ${
                        theme === 'light'
                          ? 'border-secondary bg-secondary/5'
                          : 'border-border hover:border-gray-300'
                      }`}
                    >
                      <Sun className="w-5 h-5 text-amber-500" />
                      <span className="font-medium text-primary">روشن</span>
                    </button>
                    <button
                      onClick={() => theme === 'light' && toggleTheme()}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all flex-1 ${
                        theme === 'dark'
                          ? 'border-secondary bg-secondary/5'
                          : 'border-border hover:border-gray-300'
                      }`}
                    >
                      <Moon className="w-5 h-5 text-indigo-400" />
                      <span className="font-medium text-primary">تاریک</span>
                    </button>
                  </div>
                </div>

                <h3 className="font-medium text-primary mb-4">زبان</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setLocale('fa' as Locale)}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${
                      locale === 'fa'
                        ? 'border-secondary bg-secondary/5'
                        : 'border-border hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl mb-2 block">🇮🇷</span>
                    <span className="font-medium text-primary">فارسی</span>
                  </button>
                  <button
                    onClick={() => setLocale('en' as Locale)}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${
                      locale === 'en'
                        ? 'border-secondary bg-secondary/5'
                        : 'border-border hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl mb-2 block">🇬🇧</span>
                    <span className="font-medium text-primary">English</span>
                  </button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

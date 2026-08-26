import { useState } from 'react';
import { ChevronRight, ChevronLeft, Clock, Check, X } from 'lucide-react';
import { DocumentTitle } from '../components/DocumentTitle';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SectionTitle } from '../components/ui/SectionTitle';
import { useI18n } from '../i18n/I18nContext';
import { useI18n as useI18nContext } from '../i18n/I18nContext';

const WEEK_DAYS = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];
const TIME_SLOTS = ['۰۸:۰۰', '۰۹:۰۰', '۱۰:۰۰', '۱۱:۰۰', '۱۲:۰۰', '۱۳:۰۰', '۱۴:۰۰', '۱۵:۰۰', '۱۶:۰۰', '۱۷:۰۰', '۱۸:۰۰', '۱۹:۰۰'];

type AvailabilityStatus = 'available' | 'busy' | 'unavailable';

export function Availability() {
  const { t } = useI18n();
  const { dir } = useI18nContext();
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [selectedSlots, setSelectedSlots] = useState<Record<string, AvailabilityStatus>>({});

  const getNextWeekDays = () => {
    const days: Date[] = [];
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + (currentWeekOffset * 7));

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = getNextWeekDays();

  const toggleSlot = (dayIndex: number, timeSlot: string) => {
    const key = `${dayIndex}-${timeSlot}`;
    const currentStatus = selectedSlots[key] || 'unavailable';
    const nextStatus: AvailabilityStatus =
      currentStatus === 'unavailable' ? 'available' :
      currentStatus === 'available' ? 'busy' : 'unavailable';

    setSelectedSlots({ ...selectedSlots, [key]: nextStatus });
  };

  const getStatusColor = (status: AvailabilityStatus | undefined) => {
    switch (status) {
      case 'available': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'busy': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-gray-50 text-gray-400 border-gray-200';
    }
  };

  const NextIcon = dir === 'rtl' ? ChevronLeft : ChevronRight;
  const PrevIcon = dir === 'rtl' ? ChevronRight : ChevronLeft;

  return (
    <div className="min-h-screen bg-surface-alt">
      <DocumentTitle title={t('availability.title')} />

      <div className="bg-white border-b border-border-light">
        <div className="container-wide py-8">
          <SectionTitle title={t('availability.title')} subtitle={t('availability.setAvailability')} />
        </div>
      </div>

      <div className="container-wide py-8">
        <Card padding="lg" hover={false}>
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setCurrentWeekOffset((prev) => prev - 1)}
              className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-surface-alt transition-colors"
            >
              <PrevIcon className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-primary">
              {weekDays[0]?.toLocaleDateString('fa-IR', { month: 'long', year: 'numeric' })}
            </h2>
            <button
              onClick={() => setCurrentWeekOffset((prev) => prev + 1)}
              className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-surface-alt transition-colors"
            >
              <NextIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="grid grid-cols-8 gap-2 mb-2">
                <div className="text-center text-sm font-medium text-gray-500">
                  <Clock className="w-4 h-4 mx-auto mb-1" />
                </div>
                {weekDays.map((day, index) => (
                  <div key={index} className="text-center">
                    <p className="text-sm font-medium text-gray-500">{WEEK_DAYS[index]}</p>
                    <p className="text-xs text-gray-400">
                      {day.toLocaleDateString('fa-IR', { day: 'numeric', month: 'numeric' })}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                {TIME_SLOTS.map((timeSlot) => (
                  <div key={timeSlot} className="grid grid-cols-8 gap-2">
                    <div className="text-center text-sm text-gray-500 py-2">{timeSlot}</div>
                    {weekDays.map((_, dayIndex) => {
                      const key = `${dayIndex}-${timeSlot}`;
                      const status = selectedSlots[key];
                      return (
                        <button
                          key={key}
                          onClick={() => toggleSlot(dayIndex, timeSlot)}
                          className={`py-2 px-1 rounded-lg border text-xs font-medium transition-all ${getStatusColor(status)}`}
                        >
                          {status === 'available' && <Check className="w-3 h-3 mx-auto" />}
                          {status === 'busy' && <Clock className="w-3 h-3 mx-auto" />}
                          {!status && <X className="w-3 h-3 mx-auto" />}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 mt-6 pt-6 border-t border-border-light">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-emerald-100 border border-emerald-200" />
              <span className="text-sm text-gray-600">{t('availability.available')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-amber-100 border border-amber-200" />
              <span className="text-sm text-gray-600">{t('availability.busy')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gray-50 border border-gray-200" />
              <span className="text-sm text-gray-600">{t('availability.unavailable')}</span>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button>{t('common.save')}</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

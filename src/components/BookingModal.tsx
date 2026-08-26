import { useState } from 'react';
import { Calendar, MapPin, DollarSign, MessageSquare } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { validateRequired, validateDate, validateBudget } from '../utils/validation';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  photographerId: string;
  photographerName: string;
}

export function BookingModal({ isOpen, onClose, photographerId, photographerName }: BookingModalProps) {
  const { addBooking } = useData();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    eventDate: '',
    location: '',
    budget: '',
    message: '',
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};

    const dateResult = validateRequired(form.eventDate, 'تاریخ رویداد');
    if (!dateResult.isValid) newErrors.eventDate = dateResult.error!;

    const dateVal = validateDate(form.eventDate);
    if (!dateVal.isValid && form.eventDate) newErrors.eventDate = dateVal.error!;

    const locationResult = validateRequired(form.location, 'مکان رویداد');
    if (!locationResult.isValid) newErrors.location = locationResult.error!;

    const budgetResult = validateRequired(form.budget, 'بودجه');
    if (!budgetResult.isValid) newErrors.budget = budgetResult.error!;

    if (form.budget && Number(form.budget) < 0) {
      newErrors.budget = 'بودجه نمی‌تواند منفی باشد';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !user) return;

    setIsSubmitting(true);
    try {
      await addBooking({
        clientId: user.id,
        photographerId,
        eventDate: form.eventDate,
        location: form.location,
        budget: Number(form.budget),
        message: form.message,
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setForm({ eventDate: '', location: '', budget: '', message: '' });
        onClose();
      }, 2000);
    } catch (err) {
      setErrors({ submit: 'خطا در ارسال درخواست' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setForm({ eventDate: '', location: '', budget: '', message: '' });
    setErrors({});
    setSuccess(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`رزرو ${photographerName}`} size="lg">
      {success ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-primary mb-2">درخواست ارسال شد!</h3>
          <p className="text-text">درخواست رزرو شما با موفقیت ارسال شد.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="تاریخ رویداد"
            type="date"
            value={form.eventDate}
            onChange={(v) => setForm({ ...form, eventDate: v })}
            icon={<Calendar className="w-4 h-4" />}
            error={errors.eventDate}
            required
          />

          <Input
            label="مکان رویداد"
            value={form.location}
            onChange={(v) => setForm({ ...form, location: v })}
            placeholder="مثلاً: تهران، پارک لاله"
            icon={<MapPin className="w-4 h-4" />}
            error={errors.location}
            required
          />

          <Input
            label="بودجه (تومان)"
            type="number"
            value={form.budget}
            onChange={(v) => setForm({ ...form, budget: v })}
            placeholder="مثلاً: 15000000"
            icon={<DollarSign className="w-4 h-4" />}
            error={errors.budget}
            required
          />

          <Input
            label="پیام برای عکاس"
            type="textarea"
            value={form.message}
            onChange={(v) => setForm({ ...form, message: v })}
            placeholder="جزئیات پروژه خود را بنویسید..."
            icon={<MessageSquare className="w-4 h-4" />}
          />

          {errors.submit && (
            <p className="text-sm text-error">{errors.submit}</p>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={isSubmitting} className="flex-1">
              ارسال درخواست رزرو
            </Button>
            <Button variant="secondary" onClick={handleClose} type="button">
              انصراف
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}

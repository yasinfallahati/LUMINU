import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { SectionTitle } from '../components/ui/SectionTitle';

export function ClientDashboard() {
  const { user } = useAuth();
  const { getClientBookings, photographers } = useData();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedPhotographer, setSelectedPhotographer] = useState('');
  const [bookingForm, setBookingForm] = useState({
    eventDate: '',
    location: '',
    budget: '',
    message: '',
  });

  const bookings = getClientBookings(user?.id || '');

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPhotographer || !bookingForm.eventDate || !bookingForm.location || !bookingForm.budget) return;
    await addBooking({
      clientId: user?.id || '',
      photographerId: selectedPhotographer,
      eventDate: bookingForm.eventDate,
      location: bookingForm.location,
      budget: Number(bookingForm.budget),
      message: bookingForm.message,
    });
    setShowBookingForm(false);
    setBookingForm({ eventDate: '', location: '', budget: '', message: '' });
    setSelectedPhotographer('');
  };

  return (
    <div className="min-h-screen bg-surface-alt">
      <div className="bg-primary text-white">
        <div className="container-wide py-14">
          <h1 className="text-3xl font-bold tracking-tight">داشبورد مشتری</h1>
          <p className="text-white/70 mt-1">خوش آمدید، {user?.name}</p>
        </div>
      </div>

      <div className="container-wide py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card padding="lg">
              <div className="flex items-center justify-between mb-6">
                <SectionTitle title="رزروهای من" subtitle={`${bookings.length} رزرو`} />
                <Button onClick={() => setShowBookingForm(!showBookingForm)}>
                  <Plus className="w-4 h-4" />
                  رزرو جدید
                </Button>
              </div>

              {showBookingForm && (
                <form onSubmit={handleBookingSubmit} className="mb-6 p-6 bg-surface-alt rounded-2xl space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-1">
                      انتخاب عکاس
                    </label>
                    <select
                      value={selectedPhotographer}
                      onChange={(e) => setSelectedPhotographer(e.target.value)}
                      required
                      className="w-full px-5 py-3.5 rounded-2xl border border-border bg-surface text-primary focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/5 transition-all duration-300"
                    >
                      <option value="">انتخاب کنید</option>
                      {photographers.map(photographer => (
                        <option key={photographer.id} value={photographer.id}>
                          {photographer.name} - {photographer.city}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-primary mb-1">
                        تاریخ رویداد
                      </label>
                      <input
                        type="date"
                        required
                        value={bookingForm.eventDate}
                        onChange={(e) => setBookingForm({ ...bookingForm, eventDate: e.target.value })}
                        className="w-full px-5 py-3.5 rounded-2xl border border-border bg-surface text-primary focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/5 transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-primary mb-1">
                        بودجه (تومان)
                      </label>
                      <input
                        type="number"
                        required
                        value={bookingForm.budget}
                        onChange={(e) => setBookingForm({ ...bookingForm, budget: e.target.value })}
                        className="w-full px-5 py-3.5 rounded-2xl border border-border bg-surface text-primary focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/5 transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-1">
                      مکان رویداد
                    </label>
                    <input
                      type="text"
                      required
                      value={bookingForm.location}
                      onChange={(e) => setBookingForm({ ...bookingForm, location: e.target.value })}
                      className="w-full px-5 py-3.5 rounded-2xl border border-border bg-surface text-primary focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/5 transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-1">
                      پیام برای عکاس
                    </label>
                    <textarea
                      rows={3}
                      value={bookingForm.message}
                      onChange={(e) => setBookingForm({ ...bookingForm, message: e.target.value })}
                      className="w-full px-5 py-3.5 rounded-2xl border border-border bg-surface text-primary placeholder-gray-400 focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/5 transition-all duration-300 resize-none"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit">ارسال درخواست</Button>
                    <Button variant="secondary" type="button" onClick={() => setShowBookingForm(false)}>
                      لغو
                    </Button>
                  </div>
                </form>
              )}

              {bookings.length === 0 ? (
                <div className="text-center py-14">
                  <Calendar className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                  <p className="text-text">هنوز رزروی ندارید.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => {
                    const photographer = photographers.find(p => p.id === booking.photographerId);
                    return (
                      <Card key={booking.id} padding="lg" hover={false}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            <Avatar src={photographer?.avatar} alt={photographer?.name} fallback={photographer?.name || ''} size="lg" />
                            <div>
                              <h3 className="font-semibold text-primary">
                                {photographer?.name}
                              </h3>
                              <div className="flex items-center text-text text-sm mt-1.5">
                                <Calendar className="w-4 h-4 ml-1.5" />
                                {booking.eventDate}
                              </div>
                              <div className="flex items-center text-text text-sm">
                                <MapPin className="w-4 h-4 ml-1.5" />
                                {booking.location}
                              </div>
                            </div>
                          </div>
                          <Badge
                            variant={
                              booking.status === 'pending' ? 'warning' :
                              booking.status === 'accepted' ? 'success' :
                              booking.status === 'rejected' ? 'error' : 'neutral'
                            }
                          >
                            {booking.status === 'pending' ? 'در انتظار تایید' :
                             booking.status === 'accepted' ? 'تایید شده' :
                             booking.status === 'rejected' ? 'رد شده' : 'تکمیل شده'}
                          </Badge>
                        </div>
                        {booking.message && (
                          <p className="text-text text-sm mt-3.5 pt-3.5 border-t border-border-light">{booking.message}</p>
                        )}
                      </Card>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>

          <div>
            <Card padding="lg">
              <h2 className="text-xl font-bold text-primary mb-5 tracking-tight">عکاسان پیشنهادی</h2>
              <div className="space-y-4">
                {photographers.slice(0, 3).map((photographer) => (
                  <Link
                    key={photographer.id}
                    to={`/photographer/${photographer.id}`}
                    className="flex items-center gap-3.5 p-3.5 rounded-2xl hover:bg-surface-alt transition-colors duration-200"
                  >
                    <Avatar src={photographer.avatar} alt={photographer.name} fallback={photographer.name} size="md" />
                    <div>
                      <h3 className="font-medium text-primary text-sm">{photographer.name}</h3>
                      <p className="text-xs text-text mt-0.5">{photographer.city}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <Link
                to="/discover"
                className="block text-center text-secondary hover:text-secondary-dark mt-5 font-medium text-sm transition-colors"
              >
                مشاهده همه عکاسان
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

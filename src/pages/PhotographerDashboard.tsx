import { useState, useEffect } from 'react';
import { Camera, Plus, Edit2, Save, X, BarChart3, FolderOpen, Calendar, DollarSign, TrendingUp, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { bookingApi } from '../services/api';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { SectionTitle } from '../components/ui/SectionTitle';
import { ImageUploader } from '../components/ImageUploader';
import { formatPrice } from '../utils/format';

export function PhotographerDashboard() {
  const { user, updateUser } = useAuth();
  const { getPhotographerProjects, addProject, getPhotographerBookings, fetchBookings, fetchProjects } = useData();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    city: user?.city || '',
    priceRange: user?.priceRange || { min: 0, max: 0 },
    specialties: user?.specialties || [],
  });
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    images: [] as string[],
    category: 'عکاسی عروسی',
  });

  useEffect(() => {
    fetchBookings();
    fetchProjects();
    bookingApi.getStats().then(({ stats }) => setStats(stats)).catch(() => {});
  }, []);

  const projects = getPhotographerProjects(user?.id || '');
  const bookings = getPhotographerBookings(user?.id || '');

  const handleSaveProfile = () => {
    updateUser(editForm);
    setIsEditing(false);
  };

  const handleAddProject = async () => {
    if (!newProject.title || !newProject.description) return;
    await addProject({
      photographerId: user?.id || '',
      title: newProject.title,
      description: newProject.description,
      images: newProject.images,
      category: newProject.category,
    });
    setNewProject({ title: '', description: '', images: [], category: 'عکاسی عروسی' });
    setShowAddProject(false);
  };

  const overviewStats = [
    { label: 'پروژه‌ها', value: projects.length.toString(), icon: FolderOpen, color: 'text-secondary' },
    { label: 'درخواست‌ها', value: bookings.length.toString(), icon: Calendar, color: 'text-info' },
    { label: 'امتیاز', value: user?.rating?.toFixed(1) || '0.0', icon: BarChart3, color: 'text-warning' },
    { label: 'درآمد کل', value: formatPrice(stats?.totalRevenue || 0), icon: DollarSign, color: 'text-success' },
  ];

  const tabs = [
    { id: 'overview', label: 'نمای کلی', icon: BarChart3 },
    { id: 'stats', label: 'آمار', icon: TrendingUp },
    { id: 'profile', label: 'پروفایل', icon: Edit2 },
    { id: 'projects', label: 'نمونه کارها', icon: FolderOpen },
    { id: 'bookings', label: 'درخواست‌ها', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-surface-alt">
      <div className="bg-primary text-white">
        <div className="container-wide py-14">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
              <Camera className="w-8 h-8 text-secondary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">داشبورد عکاس</h1>
              <p className="text-white/70 mt-1">خوش آمدید، {user?.name}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-10">
            {overviewStats.map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-5">
                <stat.icon className={`w-5 h-5 ${stat.color} mb-3`} />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-white/70 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container-wide py-10">
        <div className="flex gap-2 mb-10 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-7 py-3 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-surface text-gray-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card padding="lg">
              <h3 className="text-lg font-bold text-primary mb-5 tracking-tight">پروژه‌های اخیر</h3>
              {projects.length === 0 ? (
                <p className="text-text">هنوز نمونه کاری آپلود نشده است.</p>
              ) : (
                <div className="space-y-3">
                  {projects.slice(0, 3).map((project) => (
                    <div key={project.id} className="flex items-center gap-3.5 p-3.5 bg-surface-alt rounded-2xl">
                      <img
                        src={project.images[0]}
                        alt={project.title}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-primary text-sm">{project.title}</p>
                        <p className="text-xs text-text mt-0.5">{project.category}</p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-text">
                        <Eye className="w-3.5 h-3.5" />
                        {project.views}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card padding="lg">
              <h3 className="text-lg font-bold text-primary mb-5 tracking-tight">درخواست‌های اخیر</h3>
              {bookings.length === 0 ? (
                <p className="text-text">هنوز درخواستی دریافت نشده است.</p>
              ) : (
                <div className="space-y-3">
                  {bookings.slice(0, 3).map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-3.5 bg-surface-alt rounded-2xl">
                      <div>
                        <p className="font-medium text-primary text-sm">{booking.clientName || 'مشتری'}</p>
                        <p className="text-xs text-text mt-0.5">{booking.eventDate}</p>
                      </div>
                      <Badge
                        variant={
                          booking.status === 'pending' ? 'warning' :
                          booking.status === 'accepted' ? 'success' : 'neutral'
                        }
                        size="sm"
                      >
                        {booking.status === 'pending' ? 'در انتظار' :
                         booking.status === 'accepted' ? 'تایید شده' : booking.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {activeTab === 'stats' && stats && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              <Card padding="lg">
                <p className="text-sm text-text mb-1">کل درخواست‌ها</p>
                <p className="text-3xl font-bold text-primary">{stats.total}</p>
              </Card>
              <Card padding="lg">
                <p className="text-sm text-text mb-1">در انتظار</p>
                <p className="text-3xl font-bold text-warning">{stats.pending}</p>
              </Card>
              <Card padding="lg">
                <p className="text-sm text-text mb-1">تایید شده</p>
                <p className="text-3xl font-bold text-success">{stats.accepted}</p>
              </Card>
              <Card padding="lg">
                <p className="text-sm text-text mb-1">تکمیل شده</p>
                <p className="text-3xl font-bold text-info">{stats.completed}</p>
              </Card>
              <Card padding="lg">
                <p className="text-sm text-text mb-1">رد شده</p>
                <p className="text-3xl font-bold text-error">{stats.rejected}</p>
              </Card>
              <Card padding="lg">
                <p className="text-sm text-text mb-1">درآمد کل</p>
                <p className="text-3xl font-bold text-success">{formatPrice(stats.totalRevenue)}</p>
                <p className="text-xs text-text mt-1">تومان</p>
              </Card>
            </div>

            <Card padding="lg">
              <h3 className="text-lg font-bold text-primary mb-5 tracking-tight">درآمد ماهانه</h3>
              {stats.monthlyRevenue.length === 0 ? (
                <p className="text-text text-center py-8">هنوز درآمدی ثبت نشده است.</p>
              ) : (
                <div className="space-y-4">
                  {stats.monthlyRevenue.map((item: any) => {
                    const maxRevenue = Math.max(...stats.monthlyRevenue.map((m: any) => m.revenue));
                    const percentage = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;

                    return (
                      <div key={item.month} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-primary">{item.month}</span>
                          <span className="text-sm text-text">{formatPrice(item.revenue)} تومان</span>
                        </div>
                        <div className="h-3 bg-surface-alt rounded-full overflow-hidden">
                          <div
                            className="h-full gradient-primary rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <p className="text-xs text-text">{item.count} رزرو تایید شده</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            <Card padding="lg">
              <h3 className="text-lg font-bold text-primary mb-5 tracking-tight">نرخ تبدیل</h3>
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center">
                  <p className="text-4xl font-bold text-success">
                    {stats.total > 0 ? Math.round(((stats.accepted + stats.completed) / stats.total) * 100) : 0}%
                  </p>
                  <p className="text-sm text-text mt-2">نرخ پذیرش</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-info">
                    {stats.accepted + stats.completed}
                  </p>
                  <p className="text-sm text-text mt-2">پروژه موفق</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'profile' && (
          <Card padding="lg" hover={false}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-primary tracking-tight">اطلاعات پروفایل</h2>
              {!isEditing ? (
                <Button variant="ghost" onClick={() => setIsEditing(true)}>
                  <Edit2 className="w-4 h-4" />
                  ویرایش
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={handleSaveProfile}>
                    <Save className="w-4 h-4" />
                    ذخیره
                  </Button>
                  <Button variant="ghost" onClick={() => setIsEditing(false)}>
                    <X className="w-4 h-4" />
                    لغو
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="نام"
                value={editForm.name}
                onChange={(v) => setEditForm({ ...editForm, name: v })}
                disabled={!isEditing}
              />
              <Input
                label="شهر"
                value={editForm.city}
                onChange={(v) => setEditForm({ ...editForm, city: v })}
                disabled={!isEditing}
              />
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-primary mb-1">بیوگرافی</label>
                {isEditing ? (
                  <textarea
                    rows={4}
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    className="w-full px-5 py-4 rounded-2xl border border-border bg-surface text-primary placeholder-gray-400 focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/5 transition-all duration-300 resize-none"
                  />
                ) : (
                  <p className="text-primary leading-relaxed">{user?.bio || 'تعیین نشده'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">حداقل قیمت</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={editForm.priceRange.min}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      priceRange: { ...editForm.priceRange, min: Number(e.target.value) }
                    })}
                    className="w-full px-5 py-4 rounded-2xl border border-border bg-surface text-primary focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/5 transition-all duration-300"
                  />
                ) : (
                  <p className="text-primary">{user?.priceRange?.min?.toLocaleString() || 'تعیین نشده'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">حداکثر قیمت</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={editForm.priceRange.max}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      priceRange: { ...editForm.priceRange, max: Number(e.target.value) }
                    })}
                    className="w-full px-5 py-4 rounded-2xl border border-border bg-surface text-primary focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/5 transition-all duration-300"
                  />
                ) : (
                  <p className="text-primary">{user?.priceRange?.max?.toLocaleString() || 'تعیین نشده'}</p>
                )}
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'projects' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <SectionTitle title="نمونه کارها" subtitle={`${projects.length} پروژه`} />
              <Button onClick={() => setShowAddProject(true)}>
                <Plus className="w-4 h-4" />
                افزودن
              </Button>
            </div>

            {showAddProject && (
              <Card padding="lg" className="mb-6">
                <h3 className="text-lg font-bold text-primary mb-5 tracking-tight">افزودن نمونه کار جدید</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="عنوان"
                    value={newProject.title}
                    onChange={(v) => setNewProject({ ...newProject, title: v })}
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium text-primary mb-1">دسته‌بندی</label>
                    <select
                      value={newProject.category}
                      onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                      className="w-full px-5 py-4 rounded-2xl border border-border bg-surface text-primary focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/5 transition-all duration-300"
                    >
                      <option>عکاسی عروسی</option>
                      <option>عکاسی پرتره</option>
                      <option>عکاسی مد</option>
                      <option>عکاسی طبیعت</option>
                      <option>عکاسی محصول</option>
                      <option>عکاسی رویداد</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-primary mb-1">توضیحات</label>
                    <textarea
                      rows={3}
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      className="w-full px-5 py-4 rounded-2xl border border-border bg-surface text-primary placeholder-gray-400 focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/5 transition-all duration-300 resize-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-primary mb-1">تصاویر</label>
                    <ImageUploader
                      images={newProject.images}
                      onChange={(images) => setNewProject({ ...newProject, images })}
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-5">
                  <Button onClick={handleAddProject}>ذخیره</Button>
                  <Button variant="secondary" onClick={() => setShowAddProject(false)}>لغو</Button>
                </div>
              </Card>
            )}

            {projects.length === 0 ? (
              <Card padding="lg" className="text-center py-14">
                <Camera className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-text">هنوز نمونه کاری آپلود نشده است.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <Card key={project.id} hover padding="none" className="overflow-hidden">
                    <img
                      src={project.images[0]}
                      alt={project.title}
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-6">
                      <h3 className="font-bold text-primary mb-1 tracking-tight">{project.title}</h3>
                      <p className="text-sm text-text line-clamp-2">{project.description}</p>
                      <div className="flex items-center justify-between mt-3">
                        <Badge variant="neutral" size="sm">{project.category}</Badge>
                        <div className="flex items-center gap-3 text-xs text-text">
                          <span>{project.views} بازدید</span>
                          <span>{project.likes} پسند</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'bookings' && (
          <div>
            <SectionTitle title="درخواست‌های رزرو" subtitle={`${bookings.length} درخواست`} />
            {bookings.length === 0 ? (
              <Card padding="lg" className="text-center py-14">
                <p className="text-text">هنوز درخواست رزرو دریافت نشده است.</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <Card key={booking.id} padding="lg" hover={false}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-primary">{booking.clientName || 'مشتری'}</h3>
                        <p className="text-sm text-text mt-1.5">
                          <span className="font-medium">تاریخ:</span> {booking.eventDate}
                        </p>
                        <p className="text-sm text-text">
                          <span className="font-medium">مکان:</span> {booking.location}
                        </p>
                        <p className="text-sm text-text">
                          <span className="font-medium">بودجه:</span> {formatPrice(booking.budget)} تومان
                        </p>
                        {booking.message && (
                          <p className="text-sm text-text mt-2">{booking.message}</p>
                        )}
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
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

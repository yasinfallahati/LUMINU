import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { I18nProvider } from './i18n/I18nContext';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ScrollToTop } from './components/ScrollToTop';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicNavbar } from './components/PublicNavbar';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';

// Lazy loaded pages
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('./pages/Register').then(m => ({ default: m.Register })));
const Discover = lazy(() => import('./pages/Discover').then(m => ({ default: m.Discover })));
const PhotographerProfile = lazy(() => import('./pages/PhotographerProfile').then(m => ({ default: m.PhotographerProfile })));
const PhotographerDashboard = lazy(() => import('./pages/PhotographerDashboard').then(m => ({ default: m.PhotographerDashboard })));
const ClientDashboard = lazy(() => import('./pages/ClientDashboard').then(m => ({ default: m.ClientDashboard })));
const Messages = lazy(() => import('./pages/Messages').then(m => ({ default: m.Messages })));
const Notifications = lazy(() => import('./pages/Notifications').then(m => ({ default: m.Notifications })));
const Jobs = lazy(() => import('./pages/Jobs').then(m => ({ default: m.Jobs })));
const JobDetail = lazy(() => import('./pages/JobDetail').then(m => ({ default: m.JobDetail })));
const Services = lazy(() => import('./pages/Services').then(m => ({ default: m.Services })));
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const Search = lazy(() => import('./pages/Search').then(m => ({ default: m.Search })));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail').then(m => ({ default: m.ProjectDetail })));
const Portfolio = lazy(() => import('./pages/Portfolio').then(m => ({ default: m.Portfolio })));
const Settings = lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })));
const Reviews = lazy(() => import('./pages/Reviews').then(m => ({ default: m.Reviews })));
const Availability = lazy(() => import('./pages/Availability').then(m => ({ default: m.Availability })));
const Proposals = lazy(() => import('./pages/Proposals').then(m => ({ default: m.Proposals })));
const SavedProjects = lazy(() => import('./pages/SavedProjects').then(m => ({ default: m.SavedProjects })));
const Following = lazy(() => import('./pages/Following').then(m => ({ default: m.Following })));
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })));

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center animate-pulse-glow">
          <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
        <p className="text-sm text-text font-medium">در حال بارگذاری...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
      <I18nProvider>
        <AuthProvider>
          <DataProvider>
            <Router>
              <ScrollToTop />
              <div className="min-h-screen bg-surface-alt">
                <Routes>
                  <Route path="/login" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <Login />
                    </Suspense>
                  } />
                  <Route path="/register" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <Register />
                    </Suspense>
                  } />
                  <Route
                    path="/*"
                    element={
                      <>
                        <PublicNavbar />
                        <Sidebar />
                        <main className="flex-1 lg:mr-72 lg:ml-0 min-h-screen pt-20">
                          <Suspense fallback={<LoadingFallback />}>
                            <Routes>
                              <Route path="/" element={<Home />} />
                              <Route path="/discover" element={<Discover />} />
                              <Route path="/search" element={<Search />} />
                              <Route path="/photographer/:id" element={<PhotographerProfile />} />
                              <Route path="/portfolio/:id" element={<Portfolio />} />
                              <Route path="/project/:id" element={<ProjectDetail />} />
                              <Route path="/jobs" element={<Jobs />} />
                              <Route path="/jobs/:id" element={<JobDetail />} />
                              <Route path="/services" element={<Services />} />
                              <Route path="/about" element={<About />} />
                              <Route
                                path="/photographer/dashboard"
                                element={
                                  <ProtectedRoute requiredRole="photographer">
                                    <PhotographerDashboard />
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/client/dashboard"
                                element={
                                  <ProtectedRoute requiredRole="client">
                                    <ClientDashboard />
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/messages"
                                element={
                                  <ProtectedRoute>
                                    <Messages />
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/notifications"
                                element={
                                  <ProtectedRoute>
                                    <Notifications />
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/settings"
                                element={
                                  <ProtectedRoute>
                                    <Settings />
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/reviews"
                                element={
                                  <ProtectedRoute>
                                    <Reviews />
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/availability"
                                element={
                                  <ProtectedRoute requiredRole="photographer">
                                    <Availability />
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/proposals"
                                element={
                                  <ProtectedRoute requiredRole="photographer">
                                    <Proposals />
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/saved-projects"
                                element={
                                  <ProtectedRoute>
                                    <SavedProjects />
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/following"
                                element={
                                  <ProtectedRoute>
                                    <Following />
                                  </ProtectedRoute>
                                }
                              />
                              <Route path="*" element={<NotFound />} />
                            </Routes>
                          </Suspense>
                        </main>
                        <Footer />
                      </>
                    }
                  />
                </Routes>
              </div>
            </Router>
          </DataProvider>
        </AuthProvider>
      </I18nProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

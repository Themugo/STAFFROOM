import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { BrandProvider } from '@/contexts/BrandContext';
import { DepartmentProvider } from '@/contexts/DepartmentContext';
import { OrganizationProvider } from '@/contexts/OrganizationContext';
import { PermissionProvider } from '@/contexts/PermissionContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { WebsiteProvider } from '@/contexts/WebsiteContext';
import { AutomationProvider } from '@/contexts/AutomationContext';
import { KnowledgeProvider } from '@/contexts/KnowledgeContext';
import { BusinessRulesProvider } from '@/contexts/BusinessRulesContext';
import { ToastProvider } from '@/contexts/ToastContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) => {
  if (currentPageName === 'Login' || currentPageName === 'Landing') {
    return <>{children}</>;
  }
  return Layout ? <Layout currentPageName={currentPageName}>{children}</Layout> : <>{children}</>;
};

const AuthenticatedApp = () => {
  const { isAuthenticated, isLoadingAuth, isLoadingPublicSettings, authError } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#F6F9FD]">
        <div className="w-8 h-8 border-4 border-[#DCE6F2] border-t-[#2563EB] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError && authError.type === 'user_not_registered') {
    return <UserNotRegisteredError />;
  }

  // Render the main app routes
  const LandingComponent = Pages.Landing || Pages.Dashboard || (() => null);
  const LoginComponent = Pages.Login || Pages.Dashboard || (() => null);

  return (
    <Routes>
      <Route
        path="/"
        element={
          !isAuthenticated ? (
            <LandingComponent />
          ) : (
            <LayoutWrapper currentPageName={mainPageKey}>
              <MainPage />
            </LayoutWrapper>
          )
        }
      />
      {Object.entries(Pages).map(([path, Page]) => {
        if (!Page) return null;

        const isPublicRoute =
          path === 'Login' ||
          path === 'Landing' ||
          path === 'AboutPage' ||
          path === 'ContactPage' ||
          path === 'PricingPage' ||
          path === 'FeaturesPage' ||
          path === 'BlogPage' ||
          path === 'BlogPostPage' ||
          path === 'PrivacyPage' ||
          path === 'TermsPage';

        if (isPublicRoute) {
          return (
            <Route
              key={path}
              path={`/${path}`}
              element={<Page />}
            />
          );
        }

        return (
          <Route
            key={path}
            path={`/${path}`}
            element={
              !isAuthenticated ? (
                <LoginComponent />
              ) : (
                <LayoutWrapper currentPageName={path}>
                  <Page />
                </LayoutWrapper>
              )
            }
          />
        );
      })}
      {/* Public Route Aliases */}
      {Pages.Login && <Route path="/login" element={<Pages.Login />} />}
      {Pages.AboutPage && <Route path="/about" element={<Pages.AboutPage />} />}
      {Pages.ContactPage && <Route path="/contact" element={<Pages.ContactPage />} />}
      {Pages.PricingPage && <Route path="/pricing" element={<Pages.PricingPage />} />}
      {Pages.FeaturesPage && <Route path="/features" element={<Pages.FeaturesPage />} />}
      {Pages.FeaturesPage && <Route path="/platform" element={<Pages.FeaturesPage />} />}
      {Pages.BlogPage && <Route path="/blog" element={<Pages.BlogPage />} />}
      {Pages.PrivacyPage && <Route path="/privacy" element={<Pages.PrivacyPage />} />}
      {Pages.TermsPage && <Route path="/terms" element={<Pages.TermsPage />} />}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};



function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <NotificationProvider>
          <WebsiteProvider>
            <BrandProvider>
              <AuthProvider>
                <OrganizationProvider>
                  <PermissionProvider>
                    <DepartmentProvider>
                      <AutomationProvider>
                        <KnowledgeProvider>
                          <BusinessRulesProvider>
                            <QueryClientProvider client={queryClientInstance}>
                              <Router>
                                <AuthenticatedApp />
                              </Router>
                              <Toaster />
                            </QueryClientProvider>
                          </BusinessRulesProvider>
                        </KnowledgeProvider>
                      </AutomationProvider>
                    </DepartmentProvider>
                  </PermissionProvider>
                </OrganizationProvider>
              </AuthProvider>
            </BrandProvider>
          </WebsiteProvider>
        </NotificationProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App

import loadingGif from '@/assets/icons/loading.gif';
import Footer from '@/components/layout/footer';
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import MobileWebView from '@/components/mobile-web-view';
import { ScrollArea } from '@/components/ui/scroll-area';
import { isMobileDevice } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Outlet, useLocation } from 'react-router';

function Layout() {
  const location = useLocation();

  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const currentPath = location.pathname;

    const isMainPage = currentPath === '/' || currentPath === '';
    const isOnlyMobilePage =
      currentPath.startsWith('/investments') || currentPath.startsWith('/my-profile');

    if ((isMainPage || isOnlyMobilePage) && isMobileDevice) {
      setIsMobile(false);
    } else if (isMobileDevice) {
      setIsMobile(true);
    }

    setLoading(false);
  }, [location]);

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <img className="w-[30px]" src={loadingGif} alt="loading" />
        </div>
      ) : (
        <>
          {isMobile ? (
            <MobileWebView />
          ) : (
            <div className="md:max-w-[1920px] md:mx-auto md:flex md:gap-3 md:p-3">
              <div
                className={`hidden md:block md:flex-shrink-0 transition-all duration-300 ${
                  sidebarCollapsed ? 'md:w-[72px]' : 'md:w-[168px]'
                }`}
              >
                <Sidebar
                  isCollapsed={sidebarCollapsed}
                  onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                />
              </div>
              <ScrollArea
                id="scroll-area-main"
                className="bg-gray-light h-[calc(100dvh-24px)] rounded-2xl m-3 md:m-0 md:flex-1 flex flex-col gap-3 relative overflow-hidden"
              >
                <div className="relative flex-1 flex flex-col min-h-0">
                  <Header />
                  <div className="pt-3 pb-3 rounded-2xl flex-1 overflow-y-auto overflow-x-hidden min-h-0">
                    <Outlet />
                  </div>
                </div>
                <Footer />
              </ScrollArea>
            </div>
          )}
          <Toaster />
        </>
      )}
    </>
  );
}

export default Layout;

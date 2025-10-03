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
            <>
              <div className="hidden md:block">
                <Sidebar />
              </div>
              <ScrollArea
                id="scroll-area-main"
                className="bg-gray-light h-[calc(100dvh-24px)] rounded-2xl m-3 md:ml-[240px] flex flex-col gap-3 relative"
              >
                <div className="relative">
                  <Header />
                  <div className="pt-20 pb-3 rounded-2xl overflow-hidden">
                    <Outlet />
                  </div>
                </div>
                <Footer />
              </ScrollArea>
            </>
          )}
          <Toaster />
        </>
      )}
    </>
  );
}

export default Layout;

import loadingGif from '@/assets/icons/loading.gif';
import Footer from '@/components/layout/footer';
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Outlet, useLocation } from 'react-router';
import MobileWebView from '../mobile-web-view';

function Layout() {
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;

    // Only main page and pages starting with "investments" should NOT be mobile
    const isMainPage = currentPath === '/' || currentPath === '';
    const isInvestmentsPage = currentPath.startsWith('/investments');

    if (isMainPage || isInvestmentsPage) {
      setIsMobile(false);
    } else {
      setIsMobile(true);
    }

    setLoading(false);
  }, [location.pathname]);

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
              <Sidebar />
              <ScrollArea
                id="scroll-area-main"
                className="bg-gray-light h-[calc(100dvh-24px)] rounded-2xl m-3 ml-[240px] flex flex-col gap-3 relative"
              >
                <div className="relative">
                  <Header />
                  <div className="pt-20 pb-3 rounded-2xl overflow-hidden">
                    <Outlet />
                  </div>
                </div>

                {/* <main className="bg-white h-[calc(100dvh-24px)] overflow-y-auto rounded-2xl m-3 ml-[240px]">
                <Header />
                <Outlet /> */}
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

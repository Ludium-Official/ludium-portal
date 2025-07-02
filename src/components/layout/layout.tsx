import loadingGif from '@/assets/icons/loading.gif';
import Footer from '@/components/layout/footer';
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Outlet } from 'react-router';
import MobileWebView from '../mobile-web-view';

function Layout() {
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor;
    const isMobileDevice = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      userAgent,
    );
    setIsMobile(isMobileDevice);
    setLoading(false);
  }, []);

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
              <main className="bg-gray-light rounded-2xl m-3 ml-[240px] flex flex-col gap-3">
                <div>
                  <Header />
                  <Outlet />
                </div>

                <Footer />
              </main>
            </>
          )}
          <Toaster />
        </>
      )}
    </>
  );
}

export default Layout;

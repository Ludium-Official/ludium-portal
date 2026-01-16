import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/lib/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router";

function Layout() {
  const isMobile = useIsMobile();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  return (
    <>
      <div className="md:max-w-[1920px] md:mx-auto md:flex md:gap-3 md:p-3">
        <div
          className={`hidden md:block md:flex-shrink-0 transition-all duration-300 ${
            sidebarCollapsed ? "md:w-[72px]" : "md:w-[168px]"
          }`}
        >
          <Sidebar
            isCollapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </div>
        <ScrollArea
          id="scroll-area-main"
          className={cn(
            "bg-gray-light h-[calc(100dvh-24px)] rounded-2xl m-3 md:m-0 md:flex-1 flex flex-col gap-3 relative overflow-hidden",
            isMobile && "h-full m-0 rounded-none"
          )}
        >
          <div className="relative flex-1 flex flex-col min-h-0">
            <Header />
            <div
              className={cn(
                "py-2 rounded-2xl flex-1 overflow-y-auto overflow-x-hidden min-h-0",
                isMobile && "p-0 rounded-none"
              )}
            >
              <Outlet />
            </div>
          </div>
          <Footer />
        </ScrollArea>
      </div>
      <Toaster />
    </>
  );
}

export default Layout;

import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router";

function Layout() {
  // const isAuthed = !!localStorage.getItem("idToken");

  return (
    <>
      {/* <Header /> */}
      <Sidebar />
      <main className="bg-white rounded-2xl m-3 ml-[240px]">
        <Header />
        <Outlet />
        <Footer />
      </main>
      <Toaster />
    </>
  );
}

export default Layout;

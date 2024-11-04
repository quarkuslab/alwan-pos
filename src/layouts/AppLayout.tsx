import Header from "@/components/core/Header";
import Sidebar from "@/components/core/Sidebar";
import { Outlet } from "react-router";
import { Fragment } from "react/jsx-runtime";

export default function AppLayout() {
  return (
    <Fragment>
      <Sidebar />
      <Header />
      <main className="pl-80 pt-20 h-screen">
        <Outlet />
      </main>
    </Fragment>
  );
}

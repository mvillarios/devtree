import { useLocation } from "react-router-dom";
import AdminNavigation from "./nav/AdminNavigation";
import HomeNavigation from "./nav/HomeNavigation";
import Logo from "./Logo";

export default function Header() {
  const location = useLocation();
  return (
    <header className="py-5 bg-slate-800">
      <div className="flex flex-col items-center justify-between max-w-5xl mx-auto md:flex-row md:">
        <div className="w-full p-5 lg:p-0 md:w-1/3">
          <Logo />
        </div>
        <nav className="md:w-1/3 md:flex md:justify-end">
          {location.pathname === "/" ? <HomeNavigation /> : <AdminNavigation />}
        </nav>
      </div>
    </header>
  );
}

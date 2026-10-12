import { NavLink, Outlet } from "react-router-dom";
import LogoIMG from "@/assets/logo.png";
import { useAuth } from "@/context/AuthContext"; // chỉnh path nếu khác
import { useNavigate } from "react-router-dom";
import AppBreadcrumb from "@/components/common/breadcrumb/AppBreadcrumb";

const navItems = [
  { to: "/dashboard", icon: "home", label: "Trang chủ" },
  { to: "/dashboard/create", icon: "school", label: "Tạo bài" },
  { to: "/flashcard", icon: "identity_platform", label: "Flashcard" },
  { to: "/practice", icon: "fit_screen", label: "Luyện tập" },
  { to: "/dashboard/test", icon: "mail", label: "Test" },
  { to: "/settings", icon: "settings", label: "Cài đặt" },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="w-full flex h-screen bg-[#F4F4F4]">
      {/* Sidebar */}
      <div className="group/sidebar w-16 md:w-18 hover:w-52 h-[calc(100vh-1rem)] my-auto rounded-lg ml-2 bg-black flex flex-col items-center py-6 gap-1 shrink-0 overflow-hidden transition-[width] delay-200 duration-300 ease-out">
        <img
          src={LogoIMG}
          alt="logo"
          className="w-12 aspect-square object-contain mb-4 shrink-0"
        />

        {/* Nav items - chiếm phần trên */}
        <div className="flex flex-col items-center gap-1 w-full">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `relative w-12 group-hover/sidebar:w-44 h-12 flex items-center rounded-md text-xs shrink-0 transition-all hover:delay-0 delay-200 duration-300 ease-out ${
                  isActive
                    ? "text-white bg-white/10"
                    : "text-zinc-500 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <div className="flex items-center gap-3 pl-3.5 w-full overflow-hidden">
                  <span
                    className={`material-symbols-${
                      isActive ? "rounded" : "outlined"
                    } text-2xl shrink-0`}
                  >
                    {item.icon}
                  </span>
                  <span className="whitespace-nowrap opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200 group-hover/sidebar:delay-150">
                    {item.label}
                  </span>
                </div>
              )}
            </NavLink>
          ))}
        </div>

        {/* Logout - đẩy xuống đáy bằng mt-auto */}
        <button
          onClick={handleLogout}
          className="mt-auto w-12 group-hover/sidebar:w-44 h-12 flex items-center rounded-md text-xs shrink-0 text-zinc-500 hover:bg-white/5 hover:text-red-400 transition-all hover:delay-0 delay-200 duration-300 ease-out"
        >
          <div className="flex items-center gap-3 pl-3.5 w-full overflow-hidden">
            <span className="material-symbols-outlined text-2xl shrink-0">
              logout
            </span>
            <span className="whitespace-nowrap opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200 group-hover/sidebar:delay-150">
              Đăng xuất
            </span>
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="pl-3 flex-1 h-full overflow-y-auto w-full  py-5 relative z-0">
        <div className="absolute top-0 left-20 text-[200px] font-semibold text-zinc-200/40 select-none">
          LEARN
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 right-20 text-[200px] font-semibold text-zinc-200/40 select-none">
          WITH
        </div>
        <div className="absolute bottom-0 left-20 text-[200px] font-semibold text-zinc-200/40 select-none">
          LEXI
        </div>
        <div className="w-full max-w-7xl mx-auto z-1 relative">
          <AppBreadcrumb />
          <Outlet />
        </div>
      </div>
    </div>
  );
}

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import LogoIMG from "@/assets/logo.png";

export default function Login() {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isSignup && !agreed) {
      setError("Bạn cần đồng ý với Điều khoản & Điều kiện");
      return;
    }

    setLoading(true);
    try {
      if (isSignup) {
        await signup(email, password);
      } else {
        await login(email, password);
      }
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Lỗi xác thực");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f4f3fc] px-4">
      <div className="w-full max-w-112.5">
        {!isSignup && (
          <div className="flex flex-col items-center">
            <img src={LogoIMG} alt="logo" className="w-12 aspect-square" />
            <h1 className="text-xl font-bold text-gray-900">Lexi</h1>
          </div>
        )}

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          {isSignup && (
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center">
                <span className="text-white text-2xl font-bold">L</span>
              </div>
            </div>
          )}

          <h2 className="text-xl font-bold text-center text-gray-900">
            {isSignup ? "Bắt đầu hành trình" : "Chào mừng trở lại"}
          </h2>
          {isSignup && (
            <p className="text-sm text-gray-400 text-center mt-1 mb-2">
              Tạo tài khoản để mở khoá tiềm năng ngôn ngữ của bạn.
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {isSignup && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Họ và tên
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Nguyễn Văn A"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-gray-700">
                  Email
                </label>
                {!isSignup && (
                  <a href="#" className="text-xs font-semibold text-gray-900">
                    Quên mật khẩu?
                  </a>
                )}
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  placeholder={
                    isSignup ? "example@email.com" : "example@gmail.com"
                  }
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {isSignup && (
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 w-3.5 h-3.5"
                />
                <p className="text-xs text-gray-500 leading-relaxed">
                  Tôi đồng ý với{" "}
                  <a href="#" className="text-indigo-500 font-medium">
                    Điều khoản &amp; Điều kiện
                  </a>{" "}
                  và{" "}
                  <a href="#" className="text-indigo-500 font-medium">
                    Chính sách bảo mật
                  </a>{" "}
                  của LingoHọc.
                </p>
              </div>
            )}

            {error && <p className="text-red-500 text-xs">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-800 transition disabled:opacity-60"
            >
              {loading
                ? "⏳ Đang xử lý..."
                : isSignup
                  ? "Đăng ký"
                  : "Đăng nhập"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 whitespace-nowrap">
              {isSignup ? "hoặc sử dụng" : "Hoặc tiếp tục với"}
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 border border-gray-200 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50 transition"
            >
              <GoogleIcon />
              Google
            </button>

            {isSignup ? (
              <button
                type="button"
                className="flex items-center justify-center gap-2 border border-gray-200 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50 transition"
              >
                <FacebookIcon />
                Facebook
              </button>
            ) : (
              <button
                type="button"
                className="flex items-center justify-center gap-2 border border-gray-200 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50 transition"
              >
                <AppleIcon />
                Apple
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          {isSignup ? (
            <>
              Bạn đã có tài khoản?{" "}
              <button
                onClick={() => {
                  setIsSignup(false);
                  setError("");
                }}
                className="font-semibold text-gray-900 hover:underline"
              >
                Đăng nhập
              </button>
            </>
          ) : (
            <>
              Chưa có tài khoản?{" "}
              <button
                onClick={() => {
                  setIsSignup(true);
                  setError("");
                }}
                className="font-semibold text-gray-900 hover:underline"
              >
                Đăng ký ngay
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.365 1.43c0 1.14-.41 2.07-1.234 2.81-.823.737-1.78 1.124-2.89 1.041a3.116 3.116 0 0 1-.05-.508c0-1.046.45-2.057 1.243-2.793.792-.738 1.748-1.143 2.882-1.146.04.157.05.396.05.596zM20.4 17.51c-.55 1.27-.82 1.84-1.53 2.96-.99 1.56-2.39 3.5-4.12 3.52-1.54.02-1.93-1-4.02-1-2.08 0-2.52 1-4.05.98-1.73-.02-3.06-1.78-4.05-3.34C-.32 16.78-.6 11.04 1.5 8.13c1.06-1.48 2.94-2.43 4.99-2.45 1.6-.03 2.7 1.07 4.02 1.07 1.32 0 2.18-1.08 4.06-1.08 1.32 0 2.7.74 3.7 2.02-3.25 1.79-2.72 6.46.13 8.82-.32.34-.61.7.91.99z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#1877F2">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.83c0-2.51 1.49-3.9 3.78-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.9h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94z" />
    </svg>
  );
}

import BaseCarousel from "@/components/common/carousel/BaseCarousel";
import AdminIcon1 from "./icons/benifit_1.svg";
import AdminIcon2 from "./icons/benifit_2.svg";
import AdminIcon3 from "./icons/benifit_3.svg";
import { useState, type ReactNode } from "react";
import LogoIMG from "@/assets/logo.png";
import BaseInput from "@/components/common/input/BaseInput";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ISlider {
  label: string;
  desc: string;
  icon: ReactNode;
}

const slides: ISlider[] = [
  {
    label: "Learn Smarter with AI",
    desc: "Instantly generate flashcards and quizzes tailored to any topic and skill level.",
    icon: AdminIcon1,
  },
  {
    label: "Practice Every Skill",
    desc: "Listening, speaking, writing, and dictation — train all four skills in one place.",
    icon: AdminIcon2,
  },
  {
    label: "Track Your Progress",
    desc: "Watch your vocabulary, scores, and learning streaks grow day by day.",
    icon: AdminIcon3,
  },
];

const inputClassProps = {
  inputClass:
    "py-6 focus:border-none border-none shadow-none bg-zinc-100 rounded-[3px] has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-gray-500 has-[[data-slot=input-group-control]:focus-visible]:ring-[1px]",
  lableClass: "text-lg font-normal",
};

export default function Login() {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const resetForm = () => {
    setError("");
    setName("");
    setEmail("");
    setPassword("");
    setAgreed(false);
  };

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
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#1a1c1e] overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[120%] bg-slate-800/20 -rotate-12 skew-x-12 transform"></div>
        <div className="absolute top-[20%] left-[-20%] w-full h-[60%] bg-black/40 -rotate-45 transform border-y border-white/5"></div>
        <div className="absolute -top-20 left-0 w-96 h-96 bg-slate-700/10 rotate-45 transform"></div>
        <div className="absolute inset-0 bg-linear-to-br from-transparent via-black/20 to-black/60"></div>
      </div>
      <div className="relative z-10 bg-white w-full h-full max-h-[90vh] max-w-5xl rounded-4xl flex items-start justify-between p-10 overflow-y-auto">
        <div className="w-1/2">
          <div className="flex items-center justify-start gap-2">
            <img src={LogoIMG} alt="logo" className="w-7 aspect-square" />
            <p className="font-bold text-3xl">Lexi</p>
          </div>

          <h1 className="text-2xl font-medium text-gray-800 mt-5">
            {isSignup ? (
              <>
                Create an account <br /> and start your journey
              </>
            ) : (
              <>
                Welcome back! <br /> Let's get you signed in
              </>
            )}
          </h1>

          <form
            onSubmit={handleSubmit}
            className="mt-10 max-w-xl mx-auto w-full flex flex-col gap-6"
          >
            {isSignup && (
              <BaseInput
                required
                type="text"
                name="name"
                className="text-[16px]! px-5"
                placeholder="Type your full name"
                label="Full Name"
                classProps={inputClassProps}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}

            <BaseInput
              required
              type="email"
              name="email"
              className="text-[16px]! px-5"
              placeholder="Type your email"
              label="Email Address"
              classProps={inputClassProps}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <BaseInput
              required
              name="password"
              className="text-[16px]! px-5"
              label="Password"
              type="password"
              placeholder="****************"
              classProps={inputClassProps}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {isSignup && (
              <label className="flex items-start gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-primary cursor-pointer"
                />
                <span className="text-sm text-gray-600 leading-relaxed">
                  I agree to the{" "}
                  <span className="font-medium text-gray-900">
                    Terms &amp; Conditions
                  </span>{" "}
                  and{" "}
                  <span className="font-medium text-gray-900">
                    Privacy Policy
                  </span>
                  .
                </span>
              </label>
            )}

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex flex-col gap-5">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-[3px] bg-primary text-white py-2 font-medium text-lg cursor-pointer disabled:opacity-60"
              >
                {loading
                  ? "Processing..."
                  : isSignup
                  ? "Sign Up"
                  : "Log In"}
              </button>
            </div>
          </form>

          <div className="text-sm mt-4 flex items-center justify-end">
            {isSignup ? (
              <>
                Đã có tài khoản?{" "}
                <span
                  className="font-medium cursor-pointer ml-1"
                  onClick={() => {
                    setIsSignup(false);
                    resetForm();
                  }}
                >
                  Đăng nhập
                </span>
              </>
            ) : (
              <>
                Chưa có tài khoản?{" "}
                <span
                  className="font-medium cursor-pointer ml-1"
                  onClick={() => {
                    setIsSignup(true);
                    resetForm();
                  }}
                >
                  Đăng ký ngay
                </span>
              </>
            )}
          </div>
        </div>
        <div className="mx-6 w-px self-stretch bg-black/10" />

        <div className="w-1/2">
          <BaseCarousel<ISlider>
            slides={slides}
            slidesPerView={1}
            slidesPerGroup={1}
            arrow={false}
            dotOffset={0}
            dot
            renderItem={(item) => (
              <div className="text-center">
                <img
                  src={item.icon as any}
                  alt="Admin icon"
                  className="mx-auto w-[80%] aspect-square"
                  draggable={false}
                />
                <div className="pt-2 pb-10">
                  <h5 className="text-2xl font-medium text-shadow-sm">
                    {item.label}
                  </h5>
                  <p className="text-gray-700">{item.desc}</p>
                </div>
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
}
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { checkin, getStreakInfo } from "@/lib/streak";
import { StarCheck, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti"; // ✅ thêm

// ✅ hàm bắn pháo hoa — không ảnh hưởng gì layout
const fireConfetti = () => {
  const end = Date.now() + 1500;

  const frame = () => {
    confetti({
      particleCount: 6,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ["#f97316", "#facc15", "#fb923c", "#fff"],
    });
    confetti({
      particleCount: 6,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ["#f97316", "#facc15", "#fb923c", "#fff"],
    });

    if (Date.now() < end) requestAnimationFrame(frame);
  };

  frame();
};

export default function StreakCard() {
  const { user } = useAuth();
  const [streak, setStreak] = useState(0);
  const [longest, setLongest] = useState(0);
  const [checkedInToday, setCheckedInToday] = useState(false);
  const [loading, setLoading] = useState(true);
  const [animating, setAnimating] = useState(false);

  const loadStreak = async () => {
    if (!user) return;
    const info = await getStreakInfo(user.uid);
    setStreak(info.currentStreak);
    setLongest(info.longestStreak);
    setCheckedInToday(info.checkedInToday ?? false);
    setLoading(false);
  };

  useEffect(() => {
    loadStreak();
  }, [user]);

  const handleCheckin = async () => {
    if (!user || checkedInToday) return;
    setAnimating(true);
    const result = await checkin(user.uid);
    setStreak(result.currentStreak);
    setCheckedInToday(true);
    if (result.isNewRecord) setLongest(result.currentStreak);
    fireConfetti(); // ✅ bắn pháo hoa
    setTimeout(() => setAnimating(false), 600);
  };

  if (loading) return null;

  return (
    <>
      <Card className="w-full flex flex-row items-center justify-between aspect-5/2 col-span-2 bg-primary text-white">
        <div className="">
          <h3 className="text-base uppercase text-zinc-400">Streak hiện tại</h3>
          <h1 className="text-2xl font-medium">{streak} ngày 🔥</h1>
          <div className="flex gap-1 mt-2">
            {Array.from({ length: 7 }).map((_, i) => {
              const filled = Math.min(streak, 7);
              const startIndex = 7 - filled;
              const isToday = i === 6;
              const isFilled = i >= startIndex;

              return (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    isToday
                      ? checkedInToday
                        ? "bg-orange-500 shadow-[0_0_6px_rgba(249,115,22,0.7)]"
                        : "border border-orange-500"
                      : isFilled
                        ? "bg-orange-500"
                        : "bg-zinc-700"
                  }`}
                />
              );
            })}
          </div>
          <p className="text-zinc-400 text-xs mt-2">Chuỗi dài nhất: {longest}</p>
        </div>
        {checkedInToday ? (
          <Zap className="text-zinc-500 animate-pulse" size={45} />
        ) : (
          <Button
            className="group relative flex items-center gap-2 px-5 py-2.5 rounded-sm bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold transition-all hover:scale-105 hover:shadow-[0_0_3px_rgba(249,115,22,0.4)] active:scale-95"
            onClick={handleCheckin}
          >
            <StarCheck />
            Checkin
          </Button>
        )}
      </Card>
    </>
  );
}
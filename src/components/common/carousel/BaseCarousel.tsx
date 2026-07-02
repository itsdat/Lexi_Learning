import { useEffect, useRef, useState } from "react";
import { MoveLeft, MoveRight } from "lucide-react";

interface CarouselProps<T> {
  slides: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  slidesPerView?: number;
  slidesPerGroup?: number;
  gap?: number;
  autoPlay?: boolean;
  autoPlayDelay?: number;
  dot?: boolean;
  arrow?: boolean;
  activeIndex?: number;
  dotOffset?: number;
}

export default function BaseCarousel<T>({
  slides,
  renderItem,
  slidesPerView = 1,
  slidesPerGroup = 1,
  gap = 16,
  autoPlay = true,
  autoPlayDelay = 3000,
  dot = true,
  arrow = true,
  activeIndex = 0,
  dotOffset = 20,
}: CarouselProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const timer = useRef<number | null>(null);

  const [current, setCurrent] = useState(activeIndex || 0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [slideWidth, setSlideWidth] = useState<number | null>(null);

  useEffect(() => {
    setCurrent(activeIndex);
  }, [activeIndex]);

  /* ---------- calculate width ---------- */
  useEffect(() => {
    const calc = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.offsetWidth;
      setSlideWidth((w - gap * (slidesPerView - 1)) / slidesPerView);
    };

    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [gap, slidesPerView]);

  const chunkedSlides = Array.from(
    { length: Math.ceil(slides.length / slidesPerGroup) },
    (_, i) => slides.slice(i * slidesPerGroup, (i + 1) * slidesPerGroup)
  );

  /* ---------- helpers ---------- */
  const maxIndex = Math.max(slides.length - slidesPerView, 0);

  const translateX =
    slideWidth != null ? current * slidesPerGroup * (slideWidth + gap) : 0;

  // const next = () => setCurrent((c) => (c >= maxIndex ? 0 : c + 1));
  // const prev = () => setCurrent((c) => (c <= 0 ? maxIndex : c - 1));

  const next = () =>
    setCurrent((c) => (c + slidesPerGroup > maxIndex ? 0 : c + slidesPerGroup));

  const prev = () =>
    setCurrent((c) => (c - slidesPerGroup < 0 ? maxIndex : c - slidesPerGroup));

  /* ---------- autoplay ---------- */
  useEffect(() => {
    if (!autoPlay || dragging) return;

    timer.current = setInterval(next, autoPlayDelay);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [current, autoPlay, autoPlayDelay, dragging]);

  /* ---------- drag ---------- */
  const onStart = (x: number) => {
    setDragging(true);
    startX.current = x;
  };

  const onMove = (x: number) => {
    if (!dragging) return;
    setDragX(x - startX.current);
  };

  const onEnd = () => {
    if (!dragging || slideWidth == null) return;

    const threshold = slideWidth * 0.25;
    if (dragX > threshold) prev();
    else if (dragX < -threshold) next();

    setDragX(0);
    setDragging(false);
  };

  /* ---------- render ---------- */
  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden select-none group"
      onMouseLeave={onEnd}
    >
      <div
        className={`flex ${
          dragging
            ? "transition-none"
            : "transition-transform duration-500 ease-out"
        }`}
        style={{
          gap,
          transform: `translateX(${-translateX + dragX}px)`,
        }}
        onMouseDown={(e) => onStart(e.clientX)}
        onMouseMove={(e) => onMove(e.clientX)}
        onMouseUp={onEnd}
        onTouchStart={(e) => onStart(e.touches[0].clientX)}
        onTouchMove={(e) => onMove(e.touches[0].clientX)}
        onTouchEnd={onEnd}
      >
        {slideWidth != null &&
          chunkedSlides.map((group, i) => {
            const active = i === current;

            return (
              <div
                key={i}
                className={`shrink-0 transition-all duration-500 ${
                  active ? "opacity-100" : ""
                }`}
                style={{ width: slideWidth }}
              >
                {group.map((item, index) => (
                  <div key={index}>{renderItem(item, index)}</div>
                ))}
              </div>
            );
          })}
      </div>
      {arrow && (
        <>
          <button
            disabled={current === 0}
            onClick={prev}
            className="absolute w-12 h-12 rounded-[3px] left-5 top-1/2 -translate-y-1/2 bg-white text-gray-900 cursor-pointer p-2 shadow flex items-center justify-center md:opacity-0 opacity-100 -translate-x-2.5 pointer-events-none transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:pointer-events-auto disabled:brightness-90 disabled:cursor-default"
          >
            <MoveLeft />
          </button>

          <button
            onClick={next}
            className="absolute w-12 h-12 rounded-[3px] right-5 top-1/2 -translate-y-1/2 bg-white text-gray-900 cursor-pointer p-2 shadow flex items-center justify-center md:opacity-0 opacity-100 translate-x-2.5 pointer-events-none transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:pointer-events-auto"
          >
            <MoveRight />
          </button>
        </>
      )}

      {/* dots */}
      {dot && (
        <div
          className="absolute z-1 left-1/2 -translate-x-1/2 flex justify-center gap-2"
          style={{ bottom: dotOffset }}
        >
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${
                current === i
                  ? "bg-primary h-2.5 w-4.5"
                  : "bg-gray-300 h-2.5 w-2.5"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

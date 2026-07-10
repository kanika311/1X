"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiPlay } from "react-icons/fi";

import {
  DEFAULT_VIDEO_SLIDES,
  fetchSiteContent,
  resolveVideoSlides,
  type VideoSliderItem,
} from "@/lib/site-content-api";
import { resolveApiMediaUrl } from "@/lib/media-url";
import { cn } from "@/lib/utils";

type VideoSliderProps = {
  initialSlides?: VideoSliderItem[];
};

function VideoCard({
  item,
  index,
  active,
  onActivate,
}: {
  item: VideoSliderItem;
  index: number;
  active: boolean;
  onActivate: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoSrc = resolveApiMediaUrl(item.videoSrc);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (active) {
      void video.play().catch(() => undefined);
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [active]);

  return (
    <article
      data-slide
      data-index={index}
      className={cn(
        "w-[min(72vw,240px)] shrink-0 snap-center transition-transform duration-300 sm:w-[260px] lg:w-[280px]",
        active ? "scale-100" : "scale-[0.94] opacity-80",
      )}
    >
      <button
        type="button"
        onClick={onActivate}
        className={cn(
          "block w-full overflow-hidden rounded-2xl border bg-white text-left shadow-soft transition-all",
          active
            ? "border-mauve/50 ring-2 ring-mauve/20 shadow-glow"
            : "border-rose-100/90 hover:border-rose-200",
        )}
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-ink">
          <video
            ref={videoRef}
            src={videoSrc}
            className="h-full w-full object-cover"
            muted
            loop
            playsInline
            preload="metadata"
          />
          {!active ? (
            <span className="absolute inset-0 flex items-center justify-center bg-black/25">
              <span className="flex size-11 items-center justify-center rounded-full bg-white/95 text-mauve-deep shadow-soft">
                <FiPlay className="ml-0.5 size-5" />
              </span>
            </span>
          ) : null}
        </div>
        <div className="p-4">
          <h3 className="line-clamp-1 font-serif text-base text-ink sm:text-lg">{item.title}</h3>
          {item.subtitle ? (
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted sm:text-sm">{item.subtitle}</p>
          ) : null}
        </div>
      </button>
    </article>
  );
}

export function VideoSlider({ initialSlides }: VideoSliderProps) {
  const [slides, setSlides] = useState<VideoSliderItem[] | null>(
    initialSlides === undefined ? null : initialSlides,
  );
  const [active, setActive] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialSlides !== undefined) {
      setSlides(initialSlides);
      return;
    }
    fetchSiteContent()
      .then((content) => setSlides(resolveVideoSlides(content)))
      .catch(() => setSlides(DEFAULT_VIDEO_SLIDES));
  }, [initialSlides]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry?.isIntersecting ?? false),
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [slides]);

  const count = slides?.length ?? 0;

  const scrollToIndex = useCallback(
    (index: number) => {
      const track = trackRef.current;
      if (!track || count === 0) return;
      const next = ((index % count) + count) % count;
      const card = track.querySelector<HTMLElement>(`[data-index="${next}"]`);
      if (card) {
        const trackWidth = track.clientWidth;
        const cardWidth = card.offsetWidth;
        const cardLeft = card.offsetLeft;
        const scrollLeft = cardLeft - (trackWidth - cardWidth) / 2;
        track.scrollTo({ left: Math.max(0, scrollLeft), behavior: "smooth" });
      }
      setActive(next);
    },
    [count],
  );

  const goPrev = useCallback(() => scrollToIndex(active - 1), [active, scrollToIndex]);
  const goNext = useCallback(() => scrollToIndex(active + 1), [active, scrollToIndex]);

  useEffect(() => {
    if (count < 2 || !isVisible) return;
    const t = window.setInterval(() => goNext(), 6000);
    return () => window.clearInterval(t);
  }, [count, goNext, isVisible]);

  if (slides === null || count === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8"
    >
      <div className="mb-8 text-center sm:mb-10">
        <p className="eyebrow">Watch & explore</p>
        <h2 className="mt-2 font-serif text-2xl text-ink sm:text-3xl">Stories from 1X</h2>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={goPrev}
          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-rose-100 bg-white text-ink shadow-glow transition hover:border-rose-200 hover:text-mauve-deep sm:size-12"
          aria-label="Previous video"
        >
          <FiChevronLeft className="size-6" />
        </button>

        <div
          ref={trackRef}
          className="flex min-w-0 flex-1 snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-5 [&::-webkit-scrollbar]:hidden"
        >
          {slides.map((item, index) => (
            <VideoCard
              key={`video-slide-${index}`}
              item={item}
              index={index}
              active={index === active}
              onActivate={() => scrollToIndex(index)}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={goNext}
          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-rose-100 bg-white text-ink shadow-glow transition hover:border-rose-200 hover:text-mauve-deep sm:size-12"
          aria-label="Next video"
        >
          <FiChevronRight className="size-6" />
        </button>
      </div>

      <div className="mt-6 flex flex-col items-center gap-2">
        <div className="flex flex-wrap justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={`dot-${index}`}
              type="button"
              onClick={() => scrollToIndex(index)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                index === active ? "w-8 bg-mauve-deep" : "w-2.5 bg-ink/15 hover:bg-ink/35",
              )}
              aria-label={`Go to video ${index + 1}`}
              aria-current={index === active}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

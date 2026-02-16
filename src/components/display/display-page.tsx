import { useState, useEffect } from 'react';
import { useClock } from '@/hooks/use-clock';
import { formatFullDate, formatClock } from '@/lib/date-utils';
import { building } from '@/data';
import { cn } from '@/lib/utils';
import { DisplayBookingsSlide } from './display-bookings-slide';
import { DisplayAnnouncementsSlide } from './display-announcements-slide';
import { DisplayEventsSlide } from './display-events-slide';
import { DisplayBuildingSlide } from './display-building-slide';

const SLIDES = [
  DisplayBookingsSlide,
  DisplayAnnouncementsSlide,
  DisplayEventsSlide,
  DisplayBuildingSlide,
] as const;

const SLIDE_INTERVAL = 10_000;

export function DisplayPage(): React.JSX.Element {
  const now = useClock();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, SLIDE_INTERVAL);
    return () => clearInterval(id);
  }, []);

  const SlideComponent = SLIDES[currentSlide]!;

  return (
    <div className="flex min-h-dvh flex-col bg-gray-900 text-white">
      <div className="flex items-center justify-between px-8 py-6">
        <h1 className="text-3xl font-bold">{building.name}</h1>
        <div className="text-right">
          <p className="text-lg text-white/70">{formatFullDate(now)}</p>
          <p className="text-5xl font-bold tabular-nums">{formatClock(now)}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <SlideComponent />
      </div>

      <div className="flex items-center justify-center gap-3 pb-8">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            className={cn(
              'size-3 rounded-full transition-colors',
              index === currentSlide ? 'bg-hb-accent' : 'bg-white/30',
            )}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

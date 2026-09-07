"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  HandHeart,
  Stethoscope,
  TreePine,
} from "lucide-react";

const slides = [
  {
    title: "Tree Planting Activity",
    date: "Sept 20, 2026 · 6:00 AM",
    location: "Barangay Watershed Area",
    description: "Join residents and staff in planting seedlings for a greener barangay.",
    icon: TreePine,
    image: "https://picsum.photos/seed/brgy-tree-planting/1200/675",
  },
  {
    title: "Ayuda Distribution",
    date: "Sept 24, 2026 · 8:00 AM",
    location: "Barangay Hall Grounds",
    description: "Financial assistance and relief goods for qualified resident households.",
    icon: HandHeart,
    image: "https://picsum.photos/seed/brgy-ayuda/1200/675",
  },
  {
    title: "Free Medical Mission",
    date: "Oct 2, 2026 · 8:00 AM",
    location: "Covered Court",
    description: "Free check-ups, consultations, and medicines for residents.",
    icon: Stethoscope,
    image: "https://picsum.photos/seed/brgy-medical-mission/1200/675",
  },
];

export function EventsCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) {
      return;
    }

    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [paused]);

  function goTo(nextIndex: number) {
    setIndex((nextIndex + slides.length) % slides.length);
  }

  const active = slides[index];
  const Icon = active.icon;

  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-black/8 shadow-sm"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative h-64 p-6 text-white sm:h-72 sm:p-10">
        <Image
          key={active.image}
          src={active.image}
          alt={active.title}
          fill
          priority={index === 0}
          sizes="(min-width: 1024px) 768px, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/25" />

        <Icon className="relative h-10 w-10 text-white/90" />

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-6 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
            Upcoming Community Activity
          </p>
          <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">{active.title}</h2>
          <p className="mt-1 text-sm text-white/85">
            {active.date} · {active.location}
          </p>
          <p className="mt-2 max-w-md text-sm text-white/80">{active.description}</p>
        </div>

        <button
          type="button"
          onClick={() => goTo(index - 1)}
          aria-label="Previous event"
          className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/25 text-white transition-colors hover:bg-black/40"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => goTo(index + 1)}
          aria-label="Next event"
          className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/25 text-white transition-colors hover:bg-black/40"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 bg-white py-3">
        {slides.map((slide, slideIndex) => (
          <button
            key={slide.title}
            type="button"
            onClick={() => goTo(slideIndex)}
            aria-label={`Go to slide ${slideIndex + 1}`}
            className={`h-2 rounded-full transition-all ${
              slideIndex === index ? "w-6 bg-brgy-navy" : "w-2 bg-black/15"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

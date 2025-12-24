"use client";

import { memo } from "react";
import { MapPin, Calendar, Target } from "lucide-react";

interface AboutInfoCardsProps {
  locationLabel: string;
  location: string;
  activeSinceLabel: string;
  activeSince: string;
  objectiveLabel: string;
  objective: string;
}

export const AboutInfoCards = memo(function AboutInfoCards({
  locationLabel,
  location,
  activeSinceLabel,
  activeSince,
  objectiveLabel,
  objective,
}: AboutInfoCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <InfoCard icon={<MapPin size={16} />} label={locationLabel} value={location} />
      <InfoCard icon={<Calendar size={16} />} label={activeSinceLabel} value={activeSince} />
      <InfoCard icon={<Target size={16} />} label={objectiveLabel} value={objective} />
    </div>
  );
});

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoCard({ icon, label, value }: InfoCardProps) {
  return (
    <div
      className="mx-3 rounded-lg bg-color-white p-3"
    >
      <div className="flex items-center gap-2 text-[var(--text-secondary)] mb-1">
        {icon}
        <span className="text-xs uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-[var(--text-primary)] font-medium">{value}</p>
    </div>
  );
}

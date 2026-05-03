import React from 'react';
import { UtensilsCrossed } from 'lucide-react';

export default function Header() {
  return (
    <div className="text-center mb-10">
      <div className="inline-flex items-center justify-center p-4 bg-primary/20 rounded-full mb-4 shadow-[0_0_30px_rgba(245,158,11,0.3)]">
        <UtensilsCrossed className="w-10 h-10 text-primary" />
      </div>
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-primary via-orange-400 to-amber-300 bg-clip-text text-transparent drop-shadow-sm">
        Noodle Vision AI
      </h1>
      <p className="text-muted-foreground text-lg">
        Identify Spaghetti, Ramen, or Udon instantly.
      </p>
    </div>
  );
}

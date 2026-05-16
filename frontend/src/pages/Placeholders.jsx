import React from 'react';
import { FloralDecoration } from '@/components/shared/Illustrations';

const PlaceholderPage = ({ title }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center watercolor-bg">
    <div className="relative mb-8">
      <FloralDecoration className="w-32 h-32 animate-pulse" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-4xl">🌸</span>
      </div>
    </div>
    <h1 className="text-4xl font-serif text-text-primary mb-4">{title}</h1>
    <p className="text-xl text-text-secondary max-w-md font-sans">
      We're carefully cultivating this space for you. This feature is coming soon to your wellness sanctuary.
    </p>
    <div className="mt-8 px-6 py-2 bg-white rounded-full premium-shadow text-coral font-medium">
      Growing Beautifully
    </div>
  </div>
);

export const LogPlaceholder = () => <PlaceholderPage title="Daily Logs" />;
export const CoachPlaceholder = () => <PlaceholderPage title="AI Wellness Coach" />;
export const SeedsPlaceholder = () => <PlaceholderPage title="Seed Cycling Guide" />;
export const CommunityPlaceholder = () => <PlaceholderPage title="Our Community" />;

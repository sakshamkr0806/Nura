import React from 'react';

// --- Decorative Elements ---

export const Heart = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

export const Sparkle = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
  </svg>
);

export const Cloud = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.5,19c-3.037,0-5.5-2.463-5.5-5.5c0-0.138,0.005-0.275,0.015-0.41C10.74,12.44,9.5,10.61,9.5,8.5c0-2.485,2.015-4.5,4.5-4.5 c0.33,0,0.648,0.036,0.954,0.103C15.823,2.83,17.525,2,19.4,2c3.093,0,5.6,2.507,5.6,5.6c0,0.301-0.024,0.596-0.069,0.884 C26.79,9.45,28,11.33,28,13.5c0,3.037-2.463,5.5-5.5,5.5H17.5z" />
  </svg>
);

export const DoodleLine = ({ className }) => (
  <svg viewBox="0 0 100 20" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 15Q25 5 45 15T85 5" strokeDasharray="4 4" />
  </svg>
);

// --- Main Illustrations ---

export const WomanTea = ({ className }) => (
  <svg viewBox="0 0 300 300" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Background Watercolor Blobs */}
    <circle cx="150" cy="150" r="120" fill="url(#grad1)" fillOpacity="0.2" />
    <circle cx="220" cy="100" r="60" fill="#FADADD" fillOpacity="0.3" />
    <defs>
      <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" stopColor="#FFD9C7" />
        <stop offset="100%" stopColor="transparent" />
      </radialGradient>
    </defs>
    
    {/* Artistic Woman Silhouette/Detail */}
    <path d="M120 100C120 80 140 60 160 60C180 60 200 80 200 100V130C200 150 220 180 240 200H80C100 180 120 150 120 130V100Z" fill="#F58E7C" fillOpacity="0.5" />
    <path d="M140 85C140 85 145 80 155 80C165 80 170 85 170 85" stroke="#2F2430" strokeWidth="1" strokeLinecap="round" />
    <path d="M150 140C150 140 165 140 170 155C175 170 165 180 165 180H150V140Z" fill="white" stroke="#6F6460" strokeWidth="1.5" />
    <path d="M155 148C155 148 160 145 163 148" stroke="#F58E7C" strokeWidth="1" />
    
    {/* Hair Waves */}
    <path d="M120 100Q110 110 115 130T105 160" stroke="#2F2430" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    <path d="M200 100Q210 110 205 130T215 160" stroke="#2F2430" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    
    {/* Floating Elements */}
    <circle cx="240" cy="80" r="8" fill="#F5C26B" fillOpacity="0.4" />
    <path d="M60 120L70 110M70 120L60 110" stroke="#F58E7C" strokeWidth="1" />
  </svg>
);

export const CalendarIllustration = ({ className }) => (
  <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="30" width="80" height="70" rx="16" fill="#E9D5FF" fillOpacity="0.2" />
    <rect x="20" y="30" width="80" height="25" rx="16" fill="#E9D5FF" fillOpacity="0.5" />
    <circle cx="40" cy="65" r="6" fill="#F58E7C" />
    <circle cx="60" cy="65" r="6" fill="white" />
    <circle cx="80" cy="65" r="6" fill="white" />
    <circle cx="40" cy="85" r="6" fill="white" />
    <circle cx="60" cy="85" r="6" fill="white" />
    <path d="M100 20C110 20 110 40 100 40" stroke="#FADADD" strokeWidth="3" strokeLinecap="round" />
    <path d="M15 80Q5 80 10 90T20 85" stroke="#F5C26B" strokeWidth="2" />
  </svg>
);

export const LearnIllustration = ({ className }) => (
  <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M30 40C30 35 35 30 40 30H80C85 30 90 35 90 40V90H30V40Z" fill="#FFD9C7" fillOpacity="0.4" />
    <path d="M30 40H90" stroke="#2F2430" strokeWidth="1.5" />
    <path d="M45 55H75M45 65H75M45 75H60" stroke="#6F6460" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
    <circle cx="100" cy="100" r="15" fill="#D8E8D5" fillOpacity="0.5" />
    <path d="M95 95L105 105M105 95L95 105" stroke="#FADADD" strokeWidth="2" />
  </svg>
);

export const SeedsIllustration = ({ className }) => (
  <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M30 60C30 85 50 100 60 100C70 100 90 85 90 60" fill="#F5C26B" fillOpacity="0.2" stroke="#F5C26B" strokeWidth="2" />
    <circle cx="50" cy="50" r="5" fill="#6F6460" opacity="0.6" />
    <circle cx="65" cy="45" r="5" fill="#6F6460" opacity="0.6" />
    <circle cx="75" cy="55" r="5" fill="#6F6460" opacity="0.6" />
    <circle cx="55" cy="65" r="5" fill="#6F6460" opacity="0.6" />
    <path d="M20 30Q60 0 100 30" stroke="#FADADD" strokeWidth="2" strokeDasharray="4 4" />
  </svg>
);

export const CoachIllustration = ({ className }) => (
  <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="35" y="40" width="50" height="45" rx="15" fill="#DCC8FF" fillOpacity="0.3" />
    <circle cx="50" cy="58" r="4" fill="#2F2430" />
    <circle cx="70" cy="58" r="4" fill="#2F2430" />
    <path d="M55 72C55 72 58 75 65 72" stroke="#2F2430" strokeWidth="2" strokeLinecap="round" />
    <path d="M40 30L30 20M80 30L90 20" stroke="#F58E7C" strokeWidth="3" strokeLinecap="round" />
    <circle cx="20" cy="90" r="10" fill="#FFD9C7" fillOpacity="0.5" />
  </svg>
);

export const ReportsIllustration = ({ className }) => (
  <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="30" y="25" width="60" height="75" rx="8" fill="white" stroke="#6F6460" strokeWidth="1.5" />
    <path d="M45 45H75M45 60H75M45 75H65" stroke="#DCC8FF" strokeWidth="4" strokeLinecap="round" />
    <circle cx="100" cy="40" r="12" fill="#FADADD" fillOpacity="0.6" />
    <path d="M95 40H105M100 35V45" stroke="white" strokeWidth="2" />
  </svg>
);

export const CommunityIllustration = ({ className }) => (
  <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="45" cy="55" r="20" fill="#FADADD" fillOpacity="0.7" />
    <circle cx="75" cy="55" r="20" fill="#E9D5FF" fillOpacity="0.7" />
    <circle cx="60" cy="75" r="20" fill="#FFD9C7" fillOpacity="0.7" />
    <path d="M55 40Q60 30 65 40" stroke="#F58E7C" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export const FloralDecoration = ({ className }) => (
  <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M60 100C60 100 40 80 40 50C40 20 60 40 60 40C60 40 80 20 80 50C80 80 60 100 60 100Z" fill="#D8E8D5" fillOpacity="0.5" />
    <circle cx="60" cy="40" r="12" fill="#FADADD" fillOpacity="0.8" />
    <circle cx="60" cy="40" r="4" fill="#F5C26B" />
    <path d="M50 40H70M60 30V50" stroke="white" strokeWidth="1.5" opacity="0.5" />
  </svg>
);


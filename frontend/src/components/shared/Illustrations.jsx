import React from "react";

// ── Flower Logo ──────────────────────────────────────────────
export function FlowerLogo({ className = "w-8 h-8" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(40, 40)">
        <ellipse cx="0" cy="-18" rx="11" ry="18" fill="#F8B6B6" />
        <ellipse
          cx="0"
          cy="-18"
          rx="11"
          ry="18"
          fill="#F8B6B6"
          transform="rotate(60)"
        />
        <ellipse
          cx="0"
          cy="-18"
          rx="11"
          ry="18"
          fill="#F8B6B6"
          transform="rotate(120)"
        />
        <ellipse
          cx="0"
          cy="-18"
          rx="11"
          ry="18"
          fill="#F8B6B6"
          transform="rotate(180)"
        />
        <ellipse
          cx="0"
          cy="-18"
          rx="11"
          ry="18"
          fill="#F8B6B6"
          transform="rotate(240)"
        />
        <ellipse
          cx="0"
          cy="-18"
          rx="11"
          ry="18"
          fill="#F8B6B6"
          transform="rotate(300)"
        />

        <circle cx="0" cy="0" r="7" fill="#F6A58E" />
        <circle cx="0" cy="0" r="3" fill="#FFFBF0" />
      </g>
    </svg>
  );
}

// ── Calm Woman Illustration ──────────────────────────────────
export function CalmWomanIllustration({ className = "w-full h-full" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 380 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Soft background blob */}
      <ellipse
        cx="200"
        cy="230"
        rx="150"
        ry="160"
        fill="#FDEEE8"
        opacity="0.5"
      />
      <ellipse
        cx="240"
        cy="180"
        rx="100"
        ry="90"
        fill="#F3ECF9"
        opacity="0.4"
      />
      {/* Leaves behind */}
      <path
        d="M60 300 Q30 200 90 150 Q100 180 80 280Z"
        fill="#DDEAD7"
        opacity="0.7"
      />
      <path
        d="M320 280 Q360 180 300 140 Q290 170 310 260Z"
        fill="#DDEAD7"
        opacity="0.7"
      />
      <path
        d="M80 350 Q50 280 100 240 Q110 265 95 340Z"
        fill="#BDD7B3"
        opacity="0.6"
      />
      {/* Dress / body */}
      <path
        d="M130 380 Q120 310 160 280 L180 270 L200 275 L220 270 L240 280 Q280 310 250 380Z"
        fill="#F6A58E"
        opacity="0.85"
      />
      {/* Neck */}
      <rect x="182" y="248" width="36" height="32" rx="10" fill="#FDD9C8" />
      {/* Head */}
      <ellipse cx="200" cy="215" rx="55" ry="60" fill="#FDD9C8" />
      {/* Hair */}
      <path
        d="M148 210 Q145 130 200 125 Q255 130 252 210 Q270 260 265 320 Q240 300 235 260 L165 260 Q160 300 135 320 Q130 260 148 210Z"
        fill="#5C3D2E"
      />
      {/* Flower in hair */}
      <circle cx="155" cy="170" r="14" fill="#F8B6B6" opacity="0.9" />
      <circle cx="155" cy="170" r="6" fill="#FAF2EA" />
      <circle cx="245" cy="175" r="10" fill="#CDB4F6" opacity="0.9" />
      <circle cx="245" cy="175" r="4" fill="#FAF2EA" />
      {/* Peaceful closed eyes */}
      <path
        d="M178 218 Q185 222 192 218"
        stroke="#5C3D2E"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M208 218 Q215 222 222 218"
        stroke="#5C3D2E"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Nose */}
      <path
        d="M198 228 Q200 233 202 228"
        stroke="#C4956A"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Smile */}
      <path
        d="M191 240 Q200 246 209 240"
        stroke="#E8956A"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Blush */}
      <ellipse cx="177" cy="232" rx="10" ry="6" fill="#F8B6B6" opacity="0.4" />
      <ellipse cx="223" cy="232" rx="10" ry="6" fill="#F8B6B6" opacity="0.4" />
      {/* Foreground flowers */}
      <circle cx="130" cy="340" r="22" fill="#F8B6B6" opacity="0.75" />
      <circle cx="130" cy="340" r="8" fill="#FAF2EA" />
      <circle cx="270" cy="330" r="18" fill="#CDB4F6" opacity="0.75" />
      <circle cx="270" cy="330" r="7" fill="#FAF2EA" />
      <circle cx="200" cy="365" r="16" fill="#DDEAD7" opacity="0.75" />
      <circle cx="200" cy="365" r="6" fill="#FAF2EA" />
    </svg>
  );
}

// ── Women Supporting Each Other ──────────────────────────────
export function WomenSupportingIllustration({ className = "w-full h-full" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 320 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Glow */}
      <ellipse
        cx="160"
        cy="160"
        rx="130"
        ry="60"
        fill="#F8E4E4"
        opacity="0.4"
      />
      {/* Woman left */}
      <ellipse cx="90" cy="75" rx="22" ry="24" fill="#FDD9C8" />
      <path
        d="M60 100 Q55 90 68 82 L90 78 L112 82 Q125 90 120 100 Q115 140 110 180H70Q65 140 60 100Z"
        fill="#F8B6B6"
        opacity="0.85"
      />
      <path
        d="M68 75 Q65 40 90 38 Q115 40 112 75 Q120 100 115 130 Q100 120 90 118 Q80 120 65 130 Q60 100 68 75Z"
        fill="#4A2E20"
      />
      {/* Woman right */}
      <ellipse cx="230" cy="72" rx="22" ry="24" fill="#ECC9A0" />
      <path
        d="M200 97 Q195 87 208 79 L230 75 L252 79 Q265 87 260 97 Q255 137 250 177H210Q205 137 200 97Z"
        fill="#CDB4F6"
        opacity="0.85"
      />
      <path
        d="M208 72 Q205 37 230 35 Q255 37 252 72 Q260 97 255 127 Q240 117 230 115 Q220 117 205 127 Q200 97 208 72Z"
        fill="#3A2010"
      />
      {/* Hugging arms */}
      <path
        d="M112 110 Q145 125 155 130 Q165 125 200 110"
        stroke="#F6A58E"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
      {/* Hearts */}
      <path
        d="M155 60 C150 52 140 55 140 63 C140 73 155 83 155 83 C155 83 170 73 170 63 C170 55 160 52 155 60Z"
        fill="#F8B6B6"
        opacity="0.8"
      />
      <circle cx="105" cy="50" r="4" fill="#EADCF8" />
      <circle cx="215" cy="48" r="5" fill="#EADCF8" />
    </svg>
  );
}

// ── Tool Icons ───────────────────────────────────────────────
export function CycleTrackerIllustration({ className = "w-12 h-12" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="80" height="80" rx="22" fill="#FFF0ED" />
      <rect
        x="16"
        y="20"
        width="48"
        height="44"
        rx="8"
        fill="white"
        stroke="#F8B6B6"
        strokeWidth="2"
      />
      <rect x="26" y="14" width="6" height="12" rx="3" fill="#F6A58E" />
      <rect x="48" y="14" width="6" height="12" rx="3" fill="#F6A58E" />
      <rect x="16" y="30" width="48" height="2" fill="#F8B6B6" opacity="0.4" />
      <circle cx="30" cy="44" r="4" fill="#F8B6B6" />
      <circle cx="40" cy="44" r="4" fill="#F6A58E" />
      <circle cx="50" cy="44" r="4" fill="#EADCF8" />
      <circle cx="30" cy="55" r="3" fill="#DDEAD7" />
      <circle cx="40" cy="55" r="3" fill="#F8B6B6" />
    </svg>
  );
}

export function SymptomLoggerIllustration({ className = "w-12 h-12" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="80" height="80" rx="22" fill="#F7F3FF" />
      <rect
        x="20"
        y="16"
        width="40"
        height="50"
        rx="8"
        fill="white"
        stroke="#CDB4F6"
        strokeWidth="2"
      />
      <rect
        x="28"
        y="28"
        width="24"
        height="3"
        rx="1.5"
        fill="#CDB4F6"
        opacity="0.6"
      />
      <rect
        x="28"
        y="35"
        width="20"
        height="3"
        rx="1.5"
        fill="#CDB4F6"
        opacity="0.5"
      />
      <rect
        x="28"
        y="42"
        width="16"
        height="3"
        rx="1.5"
        fill="#CDB4F6"
        opacity="0.4"
      />
      <path
        d="M40 22 C36 15 28 17 28 23 C28 30 40 38 40 38 C40 38 52 30 52 23 C52 17 44 15 40 22Z"
        fill="#F8B6B6"
        opacity="0.8"
      />
    </svg>
  );
}

export function InsightsIllustration({ className = "w-12 h-12" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="80" height="80" rx="22" fill="#FFFBF0" />
      <rect x="16" y="50" width="8" height="16" rx="4" fill="#DDEAD7" />
      <rect x="28" y="38" width="8" height="28" rx="4" fill="#F8B6B6" />
      <rect x="40" y="28" width="8" height="38" rx="4" fill="#F6A58E" />
      <rect x="52" y="18" width="8" height="48" rx="4" fill="#CDB4F6" />
      <path
        d="M20 48 L32 36 L44 26 L56 16"
        stroke="#F6A58E"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="3 3"
      />
    </svg>
  );
}

export function RemindersIllustration({ className = "w-12 h-12" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="80" height="80" rx="22" fill="#F0FFF4" />
      <path
        d="M40 16 C28 16 22 26 22 36 L18 56 H62 L58 36 C58 26 52 16 40 16Z"
        fill="#DDEAD7"
        stroke="#BDD7B3"
        strokeWidth="2"
      />
      <rect x="35" y="58" width="10" height="6" rx="3" fill="#BDD7B3" />
      <circle
        cx="40"
        cy="16"
        r="5"
        fill="#F8B6B6"
        stroke="white"
        strokeWidth="2"
      />
      <path
        d="M36 38 L39 41 L45 33"
        stroke="#5A8A4E"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CommunityIllustration({ className = "w-12 h-12" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="80" height="80" rx="22" fill="#FFF5F8" />
      <circle cx="30" cy="34" r="12" fill="#F8B6B6" opacity="0.8" />
      <circle cx="50" cy="34" r="12" fill="#CDB4F6" opacity="0.8" />
      <circle
        cx="40"
        cy="27"
        r="14"
        fill="#FAF2EA"
        stroke="#F6A58E"
        strokeWidth="2"
      />
      <ellipse cx="40" cy="24" rx="6" ry="7" fill="#FDD9C8" />
      <path d="M26 50 Q40 45 54 50 L58 66 H22 Z" fill="#F8B6B6" opacity="0.6" />
    </svg>
  );
}

// ── Daily Care Icons ─────────────────────────────────────────
export function WaterCup({ className = "w-16 h-16" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="40" cy="40" r="36" fill="#E8F4F8" />
      <path
        d="M28 30 L32 62 Q32 66 36 66 H44 Q48 66 48 62 L52 30Z"
        fill="#B8DCE8"
        opacity="0.5"
        stroke="#7CB3D6"
        strokeWidth="2"
      />
      <path
        d="M32 46 L33 60 Q33 63 36 63 H44 Q47 63 47 60 L48 46 Q42 44 32 46Z"
        fill="#7CB3D6"
        opacity="0.7"
      />
      <path
        d="M36 20 Q36 28 42 30"
        stroke="#F6A58E"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="27" cy="38" r="3" fill="#7CB3D6" opacity="0.5" />
      <circle cx="53" cy="34" r="4" fill="#7CB3D6" opacity="0.4" />
    </svg>
  );
}

export function HealthyFoodBowl({ className = "w-16 h-16" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="40" cy="40" r="36" fill="#F2F9F1" />
      <path
        d="M20 40 Q20 62 40 62 Q60 62 60 40Z"
        fill="#FAF2EA"
        stroke="#BDD7B3"
        strokeWidth="2"
      />
      <circle cx="30" cy="35" r="9" fill="#DDEAD7" />
      <circle cx="40" cy="33" r="9" fill="#F8B6B6" />
      <circle cx="50" cy="35" r="8" fill="#F6A58E" />
      <ellipse
        cx="40"
        cy="38"
        rx="5"
        ry="4"
        fill="white"
        stroke="#F6A58E"
        strokeWidth="1.5"
      />
      <path d="M20 42 H60" stroke="#BDD7B3" strokeWidth="1.5" />
    </svg>
  );
}

export function RunningShoes({ className = "w-16 h-16" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="40" cy="40" r="36" fill="#FFF5F2" />
      <path
        d="M18 52 Q22 42 34 40 Q46 38 60 46 Q64 48 62 52 H18Z"
        fill="#F8B6B6"
        stroke="#F6A58E"
        strokeWidth="2"
      />
      <path
        d="M16 52 H64 V56 Q64 60 60 60 H20 Q16 60 16 56Z"
        fill="#FAF2EA"
        stroke="#F8B6B6"
        strokeWidth="1.5"
      />
      <path
        d="M36 32 Q34 38 38 40"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M42 30 Q40 36 44 38"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M30 34 Q26 36 28 40"
        stroke="#F6A58E"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function MoonStars({ className = "w-16 h-16" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="40" cy="40" r="36" fill="#F4F0FA" />
      <path
        d="M48 26 C34 26 26 36 26 46 C26 56 34 64 44 64 C30 64 24 52 24 42 C24 30 34 22 46 22 C47 22 48 22 50 23 C49 24 48 25 48 26Z"
        fill="#EADCF8"
        stroke="#CDB4F6"
        strokeWidth="2"
      />
      <path
        d="M56 36 L58 42 L64 43 L58 46 L60 52 L56 47 L52 52 L54 46 L48 43 L54 42 L56 36Z"
        fill="#FAF2EA"
        stroke="#EADCF8"
        strokeWidth="1"
      />
      <circle cx="30" cy="24" r="3" fill="#CDB4F6" />
      <circle cx="62" cy="20" r="4" fill="#EADCF8" />
      <circle cx="20" cy="48" r="2" fill="#F8B6B6" />
    </svg>
  );
}

// ── Newsletter Assets ────────────────────────────────────────
export function EnvelopeIllustration({ className = "w-24 h-20" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="8"
        y="20"
        width="104"
        height="62"
        rx="12"
        fill="#FAF2EA"
        stroke="#F6A58E"
        strokeWidth="2.5"
      />
      <path
        d="M8 26 L60 56 L112 26"
        stroke="#F6A58E"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 76 L44 50"
        stroke="#F8B6B6"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M106 76 L76 50"
        stroke="#F8B6B6"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="60" cy="70" r="10" fill="#F8B6B6" opacity="0.8" />
      <path
        d="M56 70 Q58 73 64 70"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PottedPlant({ className = "w-16 h-20" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 70 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22 75 L26 104 Q26 108 31 108 H39 Q44 108 44 104 L48 75Z"
        fill="#F6A58E"
        stroke="#E8956A"
        strokeWidth="2"
      />
      <ellipse cx="35" cy="75" rx="14" ry="5" fill="#5C3D2E" />
      <path
        d="M35 75 Q20 45 12 25 Q22 18 30 40 Q32 48 35 55Z"
        fill="#DDEAD7"
        stroke="#BDD7B3"
        strokeWidth="1.5"
      />
      <path
        d="M35 75 Q50 45 58 25 Q48 18 40 40 Q38 48 35 55Z"
        fill="#DDEAD7"
        stroke="#BDD7B3"
        strokeWidth="1.5"
      />
      <path
        d="M35 75 Q35 35 35 10 Q40 14 38 35 Q37 50 35 65Z"
        fill="#BDD7B3"
        stroke="#DDEAD7"
        strokeWidth="1.5"
      />
      <circle cx="31" cy="93" r="2" fill="#FAF2EA" opacity="0.6" />
      <circle cx="39" cy="96" r="1.5" fill="#FAF2EA" opacity="0.6" />
    </svg>
  );
}

// ── Decorative Doodles ───────────────────────────────────────
export function HeartDoodle({ className = "w-6 h-6" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 21C12 21 3 14 3 8.5C3 5.5 5.5 3 8.5 3C10.2 3 11.2 4 12 5C12.8 4 13.8 3 15.5 3C18.5 3 21 5.5 21 8.5C21 14 12 21 12 21Z" />
    </svg>
  );
}

export function FlowerDoodle({ className = "w-8 h-8" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="16" cy="8" rx="5" ry="8" fill="currentColor" opacity="0.6" />
      <ellipse
        cx="16"
        cy="24"
        rx="5"
        ry="8"
        fill="currentColor"
        opacity="0.6"
      />
      <ellipse cx="8" cy="16" rx="8" ry="5" fill="currentColor" opacity="0.6" />
      <ellipse
        cx="24"
        cy="16"
        rx="8"
        ry="5"
        fill="currentColor"
        opacity="0.6"
      />
      <circle cx="16" cy="16" r="5" fill="currentColor" />
    </svg>
  );
}

export function StarDoodle({ className = "w-6 h-6" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2L14.5 9H22L16 13.5L18.5 20.5L12 16L5.5 20.5L8 13.5L2 9H9.5L12 2Z" />
    </svg>
  );
}

export function CloudDoodle({ className = "w-12 h-8" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 28"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10 24C6 24 3 21 3 17C3 13 7 10 11 11C12 8 15 6 19 6C24 6 28 10 28 14C32 14 36 17 36 21C36 25 32 28 28 28H10V24Z" />
    </svg>
  );
}

export function SwirlLine({ className = "w-24 h-6" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 10C20 2 30 18 50 10C70 2 80 18 95 10"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function FloralDecoration({ className = "w-32 h-32" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 100 Q50 60 90 20"
        stroke="#BDD7B3"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="90" cy="20" r="14" fill="#F8B6B6" opacity="0.7" />
      <circle cx="90" cy="20" r="5" fill="#F6A58E" />
      <circle cx="55" cy="58" r="10" fill="#EADCF8" opacity="0.7" />
      <circle cx="55" cy="58" r="4" fill="#CDB4F6" />
      <path
        d="M28 86 Q22 76 32 76 Q32 86 22 88Z"
        fill="#DDEAD7"
        opacity="0.8"
      />
      <path
        d="M62 46 Q56 36 66 36 Q66 46 56 48Z"
        fill="#DDEAD7"
        opacity="0.8"
      />
    </svg>
  );
}

// ── Sketchy Hand-Drawn Doodles ────────────────────────────────
export function SketchyHeart({ className = "w-6 h-6" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20.25S3 14 3 8.5A4.5 4.5 0 0 1 7.5 4c2.25 0 3.75 1.5 4.5 2.5.75-1 2.25-2.5 4.5-2.5a4.5 4.5 0 0 1 4.5 4.5c0 5.5-9 11.75-9 11.75z" />
      <path
        d="M11.8 19.5S3.8 13.5 3.8 8.7A4.2 4.2 0 0 1 8 4.5c1.8 0 3 1.2 3.8 2.2"
        opacity="0.5"
        strokeWidth="1"
      />
    </svg>
  );
}

export function SketchyStar({ className = "w-6 h-6" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2l2.6 5.8 6.4.5-4.8 4.2 1.5 6.3-5.7-3.5-5.7 3.5 1.5-6.3-4.8-4.2 6.4-.5z" />
      <path
        d="M11.8 2.5l2.3 5.4 6 .5-4.5 3.9 1.4 5.9-5.4-3.3-5.4 3.3 1.4-5.9-4.5-3.9 6-.5z"
        opacity="0.5"
        strokeWidth="1"
      />
    </svg>
  );
}

export function SketchyFlower({ className = "w-8 h-8" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 13.5c-1.5-3.5-4.5-3.5-3 0s1.5 3.5 3 0z" />
      <path d="M16 18.5c1.5 3.5 4.5 3.5 3 0s-1.5-3.5-3 0z" />
      <path d="M18.5 16c3.5 1.5 3.5 4.5 0 3s-3.5-1.5 0-3z" />
      <path d="M13.5 16c-3.5-1.5-3.5-4.5 0-3s3.5 1.5 0 3z" />
      <path d="M16 18c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
      <path
        d="M15.8 17.8c.8 0 1.5-.7 1.5-1.5s-.7-1.5-1.5-1.5-1.5.7-1.5 1.5.7 1.5 1.5 1.5z"
        opacity="0.5"
        strokeWidth="1"
      />
    </svg>
  );
}

export function SketchyLeaf({ className = "w-6 h-6" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 20 Q12 18 19 6 Q16 15 4 20 Z" />
      <path d="M4 20 Q11 14 16 9" />
      <path d="M9 16q2-1 3.5-3" opacity="0.7" />
      <path d="M12 13q2.5-1 3.5-3" opacity="0.7" />
      <path d="M4.5 19.5Q12 17.5 18 7" opacity="0.5" strokeWidth="1" />
    </svg>
  );
}

export function SketchyCloud({ className = "w-10 h-7" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 36 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 18A5 5 0 0 1 8 8a6 6 0 0 1 11-2 5 5 0 0 1 9 2 4.5 4.5 0 0 1 0 9 H8z" />
      <path
        d="M8.5 17.5A4.5 4.5 0 0 1 8.5 8.5a5.5 5.5 0 0 1 10-1.8 4.5 4.5 0 0 1 8 1.8 4 4 0 0 1 0 8H8.5"
        opacity="0.5"
        strokeWidth="1"
      />
    </svg>
  );
}

export function SketchySwirl({ className = "w-8 h-6" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 12c4 4 8-8 12-4s4 8 8 0 4-8 4-8" />
      <path
        d="M5 12.5c3.8 3.8 7.6-7.6 11.4-3.8s3.8 7.6 7.6 0 3.8-7.6 3.8-7.6"
        opacity="0.5"
        strokeWidth="1"
      />
    </svg>
  );
}

export function SketchySparkles({ className = "w-6 h-6" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 4q0 6 6 6-6 0-6 6 0-6-6-6 6 0 6-6z" />
      <path
        d="M12.2 4.5q0 5.5 5.5 5.5-5.5 0-5.5 5.5 0-5.5-5.5-5.5 5.5 0 5.5-5.5z"
        opacity="0.5"
        strokeWidth="1"
      />
      <path
        d="M19 15q0 3 3 3-3 0-3 3 0-3-3-3 3 0 3-3z"
        opacity="0.8"
        strokeWidth="1"
      />
      <circle cx="6" cy="6" r="0.8" fill="currentColor" />
    </svg>
  );
}

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

export function DailyChecklistDoodle({ className = "w-full h-full" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="pinkBlob" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FCDAD9" />
          <stop offset="100%" stopColor="#FCDAD9" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="orangeBlob" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FDE3D5" />
          <stop offset="100%" stopColor="#FDE3D5" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="purpleBlob" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#EDE2F5" />
          <stop offset="100%" stopColor="#EDE2F5" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Watercolor Blobs */}
      <circle cx="10" cy="180" r="50" fill="url(#pinkBlob)" opacity="0.8" />
      <circle cx="50" cy="220" r="45" fill="url(#orangeBlob)" opacity="0.7" />
      <circle cx="60" cy="50" r="35" fill="url(#purpleBlob)" opacity="0.8" />
      <circle cx="30" cy="300" r="40" fill="url(#pinkBlob)" opacity="0.6" />

      {/* Hair filled areas for a soft hand-painted look */}
      <path
        d="M -10,-10 
           C 15,30 25,60 15,90 
           C 5,120 30,140 25,170 
           C 20,200 35,220 30,250 
           C 25,280 35,300 25,330 
           C 15,360 10,380 -10,410 Z"
        fill="#8C6239"
        opacity="0.08"
      />

      {/* Hair outlines */}
      <path
        d="M -10,10 C 15,40 25,60 15,100 C 5,140 35,170 20,210 C 10,240 38,280 25,320 C 15,350 5,380 -10,400"
        stroke="#6E4C33"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M -20,30 C 5,60 15,80 5,120 C -5,160 25,190 10,230 C 0,260 28,300 15,340 C 5,370 -5,390 -20,410"
        stroke="#593C26"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M -15,50 C 0,80 10,95 0,135 C -10,175 15,205 0,245 C -10,275 18,315 5,355"
        stroke="#8C6239"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* Stems and Leaves */}
      <path
        d="M 15,100 C 35,110 45,130 50,150 C 55,170 35,190 35,200"
        stroke="#7A8F75"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M 35,200 C 45,210 65,215 68,215"
        stroke="#7A8F75"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M 35,200 C 25,230 20,260 25,285"
        stroke="#7A8F75"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M 35,200 Q 55,180 62,145"
        stroke="#7A8F75"
        strokeWidth="1"
        strokeLinecap="round"
      />

      {/* Leaf 1 */}
      <g transform="translate(45, 120) rotate(-30)">
        <path
          d="M 0,0 C 4,-6 8,-4 10,-2 C 6,2 2,4 0,0"
          fill="#D3E2C6"
          stroke="#687A64"
          strokeWidth="0.8"
        />
      </g>
      {/* Leaf 2 */}
      <g transform="translate(52, 172) rotate(45)">
        <path
          d="M 0,0 C 6,-6 10,-2 12,2 C 6,4 2,4 0,0"
          fill="#D3E2C6"
          stroke="#687A64"
          strokeWidth="0.8"
        />
      </g>
      {/* Leaf 3 */}
      <g transform="translate(30, 240) rotate(-110)">
        <path
          d="M 0,0 C 5,-7 9,-5 11,-1 C 7,3 3,5 0,0"
          fill="#D3E2C6"
          stroke="#687A64"
          strokeWidth="0.8"
        />
      </g>
      {/* Leaf 4 */}
      <g transform="translate(20, 260) rotate(15)">
        <path
          d="M 0,0 C 4,-6 8,-4 10,-2 C 6,2 2,4 0,0"
          fill="#D3E2C6"
          stroke="#687A64"
          strokeWidth="0.8"
        />
      </g>
      {/* Leaf 5 */}
      <g transform="translate(50, 210) rotate(60)">
        <path
          d="M 0,0 C 4,-6 8,-4 10,-2 C 6,2 2,4 0,0"
          fill="#D3E2C6"
          stroke="#687A64"
          strokeWidth="0.8"
        />
      </g>

      {/* Flowers */}
      {/* Flower 1 */}
      <g transform="translate(55, 105)">
        <path
          d="M 0,0 C -5,-12 5,-12 0,0 
             C 12,-5 12,5 0,0 
             C 5,12 -5,12 0,0 
             C -12,5 -12,-5 0,0 
             C -8,-8 -8,8 0,0"
          fill="#F8B6B6"
          stroke="#7A4D4D"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="0"
          cy="0"
          r="2.5"
          fill="#F6D55C"
          stroke="#7A4D4D"
          strokeWidth="0.8"
        />
      </g>

      {/* Flower 2 */}
      <g transform="translate(35, 200) rotate(15)">
        <path
          d="M 0,0 C -6,-15 6,-15 0,0
             C 15,-6 15,6 0,0
             C 6,15 -6,15 0,0
             C -15,6 -15,-6 0,0"
          fill="#FFF4F0"
          stroke="#6E504A"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="0"
          cy="0"
          r="3"
          fill="#E8A382"
          stroke="#6E504A"
          strokeWidth="0.8"
        />
      </g>

      {/* Flower 3 */}
      <g transform="translate(25, 285) rotate(-20)">
        <path
          d="M 0,0 C -5,-12 5,-12 0,0
             C 12,-5 12,5 0,0
             C 5,12 -5,12 0,0
             C -12,5 -12,-5 0,0"
          fill="#FBC7B3"
          stroke="#8C5C50"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="0"
          cy="0"
          r="2.5"
          fill="#FAF0D9"
          stroke="#8C5C50"
          strokeWidth="0.8"
        />
      </g>

      {/* Flower 4 (tiny purple) */}
      <g transform="translate(68, 215) rotate(35)">
        <path
          d="M 0,0 C -3,-8 3,-8 0,0
             C 8,-3 8,3 0,0
             C 3,8 -3,8 0,0
             C -8,3 -8,-3 0,0"
          fill="#E0D2EC"
          stroke="#6A5A7A"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
        <circle
          cx="0"
          cy="0"
          r="1.2"
          fill="#FAF0D9"
          stroke="#6A5A7A"
          strokeWidth="0.6"
        />
      </g>

      {/* Flower 5 (tiny orange) */}
      <g transform="translate(65, 150) rotate(10)">
        <path
          d="M 0,0 C -3,-8 3,-8 0,0
             C 8,-3 8,3 0,0
             C 3,8 -3,8 0,0
             C -8,3 -8,-3 0,0"
          fill="#FCD5C3"
          stroke="#8A6553"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
        <circle
          cx="0"
          cy="0"
          r="1.2"
          fill="#FAF0D9"
          stroke="#8A6553"
          strokeWidth="0.6"
        />
      </g>

      {/* Heart */}
      <g transform="translate(70, 20)">
        <path
          d="M 8,4 C 8,4 6.5,0 4,0 C 1.5,0 0,2 0,5 C 0,9 5,12 8,15 C 11,12 16,9 16,5 C 16,2 14.5,0 12,0 C 9.5,0 8,4 8,4"
          fill="#E8DDF4"
          stroke="#8A6EAA"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 8,5 C 8,5 7,2 4.5,2 C 2.5,2 1.5,3.5 1.5,5.5 C 1.5,8.5 5.5,11.5 8,13.5"
          fill="none"
          stroke="#8A6EAA"
          strokeWidth="0.6"
          opacity="0.5"
          strokeDasharray="1 1"
        />
      </g>

      {/* Cloud */}
      <g transform="translate(72, 60)">
        <path
          d="M 3,8 C 1.5,8 0,6.5 0,5 C 0,3 2,1.5 4,1.5 C 5,0.5 7,0 8.5,0.8 C 10.5,0 12.5,1.2 12.5,3 C 14,3.5 15,4.5 15,5.8 C 15,7.2 13.5,8 12,8 Z"
          fill="#FAF8F6"
          stroke="#9A908A"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 7,8 L 7,12"
          stroke="#9A908A"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </g>

      {/* Dashed trail */}
      <path
        d="M 25,320 Q 50,330 55,345 T 40,375 T 65,390"
        stroke="#B8A490"
        strokeWidth="1"
        strokeDasharray="2 2"
        strokeLinecap="round"
      />

      {/* Butterfly */}
      <g transform="translate(65, 388) rotate(-15) scale(0.7)">
        <line
          x1="0"
          y1="-3"
          x2="0"
          y2="5"
          stroke="#8A7868"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          d="M 0,-1 C 3,-5 7,-3 5,1 C 3,2 1,1 0,1 C -1,1 -3,2 -5,1 C -7,-3 -3,-5 0,-1"
          fill="#FCEBE3"
          stroke="#8A7868"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
        <path
          d="M 0,2 C 2,3 4,6 2,7 C 1,8 0,4 0,2 C 0,2 -1,4 -2,7 C -4,6 -2,3 0,2"
          fill="#FCEBE3"
          stroke="#8A7868"
          strokeWidth="0.6"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

export function CycleDayIllust({ className = "w-12 h-12" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="24" cy="24" r="18" fill="#FFF0ED" opacity="0.8" />
      <path
        d="M15 11V7M33 11V7"
        stroke="#6E4E42"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <rect
        x="10"
        y="10"
        width="28"
        height="28"
        rx="6"
        fill="#FFFFFF"
        stroke="#6E4E42"
        strokeWidth="2"
      />
      <path d="M10 18H38" stroke="#6E4E42" strokeWidth="2" />
      <path
        d="M16 10H32C35 10 37 12 37 15V18H11V15C11 12 13 10 16 10Z"
        fill="#FBC7B3"
        opacity="0.9"
      />
      <path
        d="M24 28 C24 28 22 25 20 25 C18.5 25 17.5 26.2 17.5 27.5 C17.5 30 21 32.5 24 34.5 C27 32.5 30.5 30 30.5 27.5 C30.5 26.2 29.5 25 28 25 C26 25 24 28 24 28Z"
        fill="#F8B6B6"
        stroke="#6E4E42"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="22" r="1" fill="#6E4E42" />
      <circle cx="24" cy="22" r="1" fill="#6E4E42" />
      <circle cx="32" cy="22" r="1" fill="#6E4E42" />
    </svg>
  );
}

export function NextPeriodIllust({ className = "w-12 h-12" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="24" cy="24" r="18" fill="#F7F3FF" opacity="0.8" />
      <path
        d="M24 16.5 C24 16.5 21.5 11 17 11 C12 11 9 15 9 20 C 9 27 19.5 33.5 24 37 C28.5 33.5 39 27 39 20 C39 15 36 11 31 11 C26.5 11 24 16.5 24 16.5Z"
        fill="#D2C0EC"
        stroke="#4E3E5C"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 18 C14 15.5 16 13.5 18 13.5"
        stroke="#FFF"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M37 12Q37 15 40 15Q37 15 37 18Q37 15 34 15Q37 15 37 12Z"
        fill="#F8B6B6"
        stroke="#4E3E5C"
        strokeWidth="1"
      />
      <path
        d="M8 30Q8 32 10 32Q8 32 8 34Q8 32 6 32Q8 32 8 30Z"
        fill="#FFF"
        stroke="#4E3E5C"
        strokeWidth="1"
      />
      <circle
        cx="34"
        cy="28"
        r="1.5"
        fill="#FAF0D9"
        stroke="#4E3E5C"
        strokeWidth="0.8"
      />
    </svg>
  );
}

export function LogStreakIllust({ className = "w-12 h-12" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="24" cy="24" r="18" fill="#FFF5F2" opacity="0.8" />
      <path
        d="M24 9C24 9 32 17 32 25C32 31 28.5 37 24 37C19.5 37 16 31 16 25C16 17 24 9 24 9Z"
        fill="#FFE0A0"
        stroke="#634B28"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24 17C24 17 28 22 28 27C28 31 26 34 24 34C22 34 20 31 20 27C20 22 24 17 24 17Z"
        fill="#FFF0D0"
        stroke="#634B28"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M37 20Q37 22 39 22Q37 22 37 24Q37 22 35 22Q37 22 37 20Z"
        fill="#F8B6B6"
        stroke="#634B28"
        strokeWidth="1"
      />
      <path
        d="M10 16Q10 18 12 18Q10 18 10 20Q10 18 8 18Q10 18 10 16Z"
        fill="#FBC7B3"
        stroke="#634B28"
        strokeWidth="1"
      />
    </svg>
  );
}

export function AvgSleepIllust({ className = "w-12 h-12" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="24" cy="24" r="18" fill="#F3ECF9" opacity="0.8" />
      <path
        d="M27 11C20.5 11 15 16.5 15 23C15 29.5 20.5 35 27 35C29.5 35 32 34 33.5 32.5C27 32.5 22 27.5 22 23C22 18.5 27 13.5 33.5 13.5C32 12 29.5 11 27 11Z"
        fill="#C6DBFC"
        stroke="#3E4A5C"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 23Q20.5 24 22 23"
        stroke="#3E4A5C"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M10 33 C9 33 8.2 32.2 8.2 31.2 C8.2 30.5 8.7 30 9.4 29.8 C9.2 29.2 9.6 28.5 10.3 28.5 C10.8 28.5 11.2 28.8 11.4 29.2 C11.8 28.6 12.6 28.6 13.1 29.1 C13.5 29.5 13.6 30 13.4 30.5 C13.8 30.5 14.2 30.9 14.2 31.4 C14.2 32.3 13.4 33 12.5 33 Z"
        fill="#FFF"
        stroke="#3E4A5C"
        strokeWidth="1.2"
      />
      <circle cx="16" cy="15" r="1" fill="#FAF0D9" />
      <circle cx="34" cy="18" r="0.8" fill="#FFF" />
      <circle cx="24" cy="30" r="1" fill="#FFF" />
    </svg>
  );
}

export function WaterIntakeIllust({ className = "w-12 h-12" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="24" cy="24" r="18" fill="#F0FFF4" opacity="0.8" />
      <path
        d="M24 10C24 10 33 19 33 26C33 31 29 35 24 35C19 35 15 31 15 26C15 19 24 10 24 10Z"
        fill="#BCE6E0"
        stroke="#2E4D48"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 24 C19 21.5 21 19.5 22.5 18.5"
        stroke="#FFF"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <g transform="translate(29, 23) rotate(35)">
        <path
          d="M0 0 Q6 -8 12 -4 Q6 4 0 0 Z"
          fill="#D4EDE6"
          stroke="#2E4D48"
          strokeWidth="1.2"
        />
        <line
          x1="0"
          y1="0"
          x2="10"
          y2="-3"
          stroke="#2E4D48"
          strokeWidth="0.8"
        />
      </g>
    </svg>
  );
}

"use client";

import React from "react";


type Props = { value: number; size?: number };

export default function ScoreCircle({ value, size = 96 }: Props) {
  const radius = 42;
  const stroke = 8;
  const normalized = Math.max(0, Math.min(100, value));
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (normalized / 100) * circumference;

  const color = normalized >= 80 ? "#16a34a" : normalized >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="mx-auto">
      <g transform="translate(50,50)">
        <circle r={radius} stroke="#e6e6e6" strokeWidth={stroke} fill="transparent" />
        <circle
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="transparent"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          transform="rotate(-90)"
        />
        <text x="0" y="6" textAnchor="middle" fontSize="18" fontWeight={700} fill={color}>
          {normalized}
        </text>
      </g>
    </svg>
  );
}

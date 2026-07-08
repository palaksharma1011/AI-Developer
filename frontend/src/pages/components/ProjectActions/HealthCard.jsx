import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../../config/axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";


// ---------------------------------------------------------------------------
// Design tokens — kept identical to the main dashboard
// ---------------------------------------------------------------------------
const C = {
  contribution: "#22D3EE",
  collaboration: "#F472B6",
  focus: "#FBBF24",
  workflow: "#A3E635",
};
const bg = "#000000";
const surface = "#0A0A0A";
const border = "#1A1A1A";

  export default function HealthCard({ emoji, title, value, subtitle, accent }) {
    return (
      <div
        className="rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        style={{
          borderColor: `${accent}35`,
          background: "rgba(255,255,255,0.025)",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl">{emoji}</span>

          <div
            className="h-2.5 w-2.5 rounded-full"
            style={{
              background: accent,
              boxShadow: `0 0 14px ${accent}`,
            }}
          />
        </div>

        <p className="text-xs uppercase tracking-widest text-neutral-500">
          {title}
        </p>

        <h3 className="text-3xl font-bold mt-2" style={{ color: accent }}>
          {value}
        </h3>

        <p className="text-sm text-neutral-400 mt-3 leading-relaxed">
          {subtitle}
        </p>
      </div>
    );
  }



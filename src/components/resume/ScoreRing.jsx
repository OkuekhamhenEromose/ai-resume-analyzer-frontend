import React, { useEffect, useRef, useState } from "react";
import s from "./ScoreRing.module.css";

const COLOR = { strong: "#059669", mid: "#D97706", weak: "#E11D48" };
const LABEL = { strong: "Strong match", mid: "Moderate match", weak: "Needs improvement" };

function tier(score) {
  if (score >= 75) return "strong";
  if (score >= 50) return "mid";
  return "weak";
}

export default function ScoreRing({ score }) {
  const [shown, setShown] = useState(0);
  const raf = useRef(null);

  useEffect(() => {
    setShown(0);
    const start = performance.now();
    const dur = 1100;
    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setShown(Math.round(eased * score));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    }
    const t = setTimeout(() => { raf.current = requestAnimationFrame(tick); }, 60);
    return () => { clearTimeout(t); cancelAnimationFrame(raf.current); };
  }, [score]);

  const t = tier(score);
  const color = COLOR[t];
  const R = 54;
  const circ = 2 * Math.PI * R;
  const filled = circ * (score / 100);
  const offset = circ - filled;

  return (
    <div className={s.wrap}>
      <div className={s.ringWrap}>
        <svg viewBox="0 0 120 120" className={s.svg}>
          <circle cx="60" cy="60" r={R} fill="none" stroke="#F1F5F9" strokeWidth="9" />
          <circle
            cx="60" cy="60" r={R} fill="none"
            stroke={color} strokeWidth="9"
            strokeDasharray={`${filled} ${circ}`}
            strokeDashoffset={0}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
            className={s.arc}
            style={{ "--target-offset": offset, "--circ": circ }}
          />
        </svg>
        <div className={s.center}>
          <span className={s.num} style={{ color }}>{shown}</span>
          <span className={s.denom}>/100</span>
        </div>
      </div>
      <div className={s.label} style={{ color }}>{LABEL[t]}</div>
      <div className={s.sublabel}>ATS Score</div>
    </div>
  );
}

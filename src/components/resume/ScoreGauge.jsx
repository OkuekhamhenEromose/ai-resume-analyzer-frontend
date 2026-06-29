import React, { useEffect, useRef, useState } from "react";
import styles from "./ScoreGauge.module.css";

function scoreColor(score) {
  if (score >= 80) return "#22C55E";
  if (score >= 60) return "#F59E0B";
  return "#EF4444";
}

function scoreLabel(score) {
  if (score >= 80) return "Strong Match";
  if (score >= 60) return "Moderate Match";
  if (score >= 40) return "Weak Match";
  return "Poor Match";
}

export default function ScoreGauge({ score }) {
  const [displayed, setDisplayed] = useState(0);
  const [mounted, setMounted] = useState(false);
  const rafRef = useRef(null);

  useEffect(() => {
    setMounted(false);
    setDisplayed(0);
    const t = setTimeout(() => {
      setMounted(true);
      const start = performance.now();
      const duration = 1200;

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayed(Math.round(eased * score));
        if (progress < 1) rafRef.current = requestAnimationFrame(tick);
      }
      rafRef.current = requestAnimationFrame(tick);
    }, 80);

    return () => {
      clearTimeout(t);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [score]);

  const color = scoreColor(score);
  const label = scoreLabel(score);

  // SVG arc parameters
  const R = 80;
  const cx = 100;
  const cy = 100;
  const circumference = 2 * Math.PI * R;
  // We use 270° of the circle (starting from ~135° / bottom-left going clockwise)
  const arcRatio = 0.75;
  const arcLength = circumference * arcRatio;
  const dashOffset = arcLength * (1 - (mounted ? score : 0) / 100);
  const rotation = 135; // start angle

  return (
    <div className={styles.wrap}>
      <div className={styles.gaugeContainer}>
        {/* Ambient glow behind the gauge */}
        <div
          className={styles.glowRing}
          style={{ "--glow-color": color }}
          aria-hidden
        />

        <svg viewBox="0 0 200 200" className={styles.svg}>
          {/* Background track */}
          <circle
            cx={cx} cy={cy} r={R}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="12"
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset="0"
            strokeLinecap="round"
            transform={`rotate(${rotation} ${cx} ${cy})`}
          />
          {/* Filled arc */}
          <circle
            cx={cx} cy={cy} r={R}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            transform={`rotate(${rotation} ${cx} ${cy})`}
            className={styles.arc}
            style={{ "--arc-color": color }}
          />
        </svg>

        {/* Center text */}
        <div className={styles.center}>
          <span className={styles.number} style={{ color }}>
            {displayed}
          </span>
          <span className={styles.unit}>/100</span>
        </div>
      </div>

      <div className={styles.label} style={{ color }}>
        {label}
      </div>
    </div>
  );
}

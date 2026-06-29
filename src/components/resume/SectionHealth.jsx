import React from "react";
import s from "./SectionHealth.module.css";

const STATUS_META = {
  strong:     { label: "Strong",     color: "var(--emerald-500)", bg: "var(--emerald-50)",  text: "var(--emerald-600)" },
  needs_work: { label: "Needs work", color: "var(--amber-500)",   bg: "var(--amber-50)",    text: "var(--amber-600)" },
  missing:    { label: "Missing",    color: "var(--rose-500)",    bg: "var(--rose-50)",      text: "var(--rose-600)" },
};

export default function SectionHealth({ sections = [] }) {
  if (!sections.length) return null;

  const sorted = [...sections].sort((a, b) => b.score - a.score);

  return (
    <div className={s.wrap}>
      <h3 className={s.title}>Resume Section Review</h3>
      <p className={s.sub}>How each section of your resume was evaluated</p>
      <div className={s.list}>
        {sorted.map((sec) => {
          const meta = STATUS_META[sec.status] ?? STATUS_META.needs_work;
          return (
            <div key={sec.name} className={s.row}>
              <div className={s.rowTop}>
                <div className={s.nameGroup}>
                  <span className={s.sectionName}>{sec.name}</span>
                  <span
                    className={s.statusPill}
                    style={{ background: meta.bg, color: meta.text }}
                  >
                    {meta.label}
                  </span>
                </div>
                <span className={s.scoreNum} style={{ color: meta.color }}>
                  {sec.score}/100
                </span>
              </div>
              <div className={s.barTrack}>
                <div
                  className={s.barFill}
                  style={{
                    "--fill-width": `${sec.score}%`,
                    background: meta.color,
                  }}
                />
              </div>
              <p className={s.comment}>{sec.comment}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

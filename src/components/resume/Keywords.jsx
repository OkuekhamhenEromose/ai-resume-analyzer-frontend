import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import s from "./Keywords.module.css";

export function MatchedKeywords({ keywords = [] }) {
  if (!keywords.length) return null;
  return (
    <KeywordBlock
      title="Matched Keywords"
      sub={`${keywords.length} found in your resume`}
      keywords={keywords}
      variant="emerald"
      Icon={CheckCircle2}
    />
  );
}

export function MissingKeywords({ keywords = [] }) {
  if (!keywords.length) return null;
  return (
    <KeywordBlock
      title="Missing Keywords"
      sub={`${keywords.length} to consider adding`}
      keywords={keywords}
      variant="rose"
      Icon={XCircle}
    />
  );
}

function KeywordBlock({ title, sub, keywords, variant, Icon }) {
  return (
    <div className={`${s.block} ${s[variant]}`}>
      <div className={s.header}>
        <Icon size={15} className={s.icon} />
        <div>
          <h4 className={s.title}>{title}</h4>
          <p className={s.sub}>{sub}</p>
        </div>
      </div>
      <div className={s.chips}>
        {keywords.map((k) => (
          <span key={k} className={`${s.chip} ${s["chip_" + variant]}`}>{k}</span>
        ))}
      </div>
    </div>
  );
}

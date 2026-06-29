import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import styles from "./KeywordList.module.css";

export function MatchedKeywords({ keywords }) {
  if (!keywords?.length) return null;
  return (
    <KeywordSection
      title="Matched Keywords"
      subtitle="Present in your resume"
      keywords={keywords}
      variant="success"
      Icon={CheckCircle2}
    />
  );
}

export function MissingKeywords({ keywords }) {
  if (!keywords?.length) return null;
  return (
    <KeywordSection
      title="Missing Keywords"
      subtitle="Not found — consider adding"
      keywords={keywords}
      variant="danger"
      Icon={XCircle}
    />
  );
}

function KeywordSection({ title, subtitle, keywords, variant, Icon }) {
  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <Icon size={15} className={styles[`icon-${variant}`]} />
        <div>
          <h4 className={styles.title}>{title}</h4>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
      </div>
      <div className={styles.pills}>
        {keywords.map((kw) => (
          <span key={kw} className={`${styles.pill} ${styles[`pill-${variant}`]}`}>
            {kw}
          </span>
        ))}
      </div>
    </div>
  );
}

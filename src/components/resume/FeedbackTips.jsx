import React from "react";
import { Lightbulb } from "lucide-react";
import styles from "./FeedbackTips.module.css";

export default function FeedbackTips({ tips = [] }) {
  if (!tips?.length) return null;
  return (
    <div className={styles.wrap}>
      <h4 className={styles.title}>
        <Lightbulb size={15} className={styles.icon} />
        Top Recommendations
      </h4>
      <ol className={styles.list}>
        {tips.map((tip, i) => (
          <li key={i} className={styles.item}>
            <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
            <p className={styles.text}>{tip}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

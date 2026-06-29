import React from "react";
import { ArrowRight, Wand2 } from "lucide-react";
import styles from "./BulletRewrite.module.css";

export default function BulletRewrite({ weak = [], improved = [] }) {
  if (!weak?.length) return null;
  const pairs = weak.map((w, i) => ({ weak: w, improved: improved[i] ?? "" }));

  return (
    <div className={styles.wrap}>
      <div className={styles.headerRow}>
        <Wand2 size={15} className={styles.headerIcon} />
        <h4 className={styles.headerTitle}>Bullet Point Rewrites</h4>
        <span className={styles.headerBadge}>{pairs.length} improved</span>
      </div>
      <div className={styles.pairs}>
        {pairs.map((p, i) => (
          <div key={i} className={styles.pair}>
            <div className={styles.side + " " + styles.before}>
              <span className={styles.sideLabel}>Before</span>
              <p className={styles.text}>{p.weak}</p>
            </div>
            <ArrowRight size={16} className={styles.arrow} />
            <div className={styles.side + " " + styles.after}>
              <span className={styles.sideLabel}>After</span>
              <p className={styles.text}>{p.improved}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

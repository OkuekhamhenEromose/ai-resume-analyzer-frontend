import React from "react";
import { ArrowRight, Zap } from "lucide-react";
import s from "./BulletRewrites.module.css";

export default function BulletRewrites({ weak = [], improved = [] }) {
  if (!weak.length) return null;
  const pairs = weak.map((w, i) => ({ before: w, after: improved[i] ?? "" }));
  return (
    <div className={s.wrap}>
      <div className={s.header}>
        <Zap size={15} className={s.headerIcon} />
        <h4 className={s.title}>Bullet Point Rewrites</h4>
        <span className={s.count}>{pairs.length} improved</span>
      </div>
      <div className={s.pairs}>
        {pairs.map((p, i) => (
          <div key={i} className={s.pair}>
            <div className={s.side + " " + s.before}>
              <span className={s.sideLabel}>Before</span>
              <p className={s.text}>{p.before}</p>
            </div>
            <ArrowRight size={14} className={s.arrow} />
            <div className={s.side + " " + s.after}>
              <span className={s.sideLabel}>After</span>
              <p className={s.text}>{p.after}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

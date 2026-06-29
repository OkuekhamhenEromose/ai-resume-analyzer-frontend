import React from "react";
import { TrendingUp, AlertCircle } from "lucide-react";
import s from "./StrengthsWeaknesses.module.css";

export default function StrengthsWeaknesses({ strengths = [], weaknesses = [] }) {
  if (!strengths.length && !weaknesses.length) return null;
  return (
    <div className={s.grid}>
      <div className={s.panel}>
        <div className={s.panelHeader}>
          <TrendingUp size={15} className={s.iconEmerald} />
          <h4 className={s.panelTitle}>Strengths</h4>
        </div>
        <ul className={s.list}>
          {strengths.map((item, i) => (
            <li key={i} className={s.item}>
              <span className={s.dotEmerald} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className={s.panel}>
        <div className={s.panelHeader}>
          <AlertCircle size={15} className={s.iconAmber} />
          <h4 className={s.panelTitle}>Areas to Improve</h4>
        </div>
        <ul className={s.list}>
          {weaknesses.map((item, i) => (
            <li key={i} className={s.item}>
              <span className={s.dotAmber} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

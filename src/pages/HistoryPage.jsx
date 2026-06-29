import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, ChevronRight, FileText, Sparkles } from "lucide-react";
import { resumeApi } from "../api/client.js";
import { Badge, Button, Card, Spinner } from "../components/ui/index.jsx";
import ScoreGauge from "../components/resume/ScoreGauge.jsx";
import { MatchedKeywords, MissingKeywords } from "../components/resume/KeywordList.jsx";
import BulletRewrite from "../components/resume/BulletRewrite.jsx";
import FeedbackTips from "../components/resume/FeedbackTips.jsx";
import styles from "./HistoryPage.module.css";

function scoreBadge(score) {
  if (score >= 80) return "success";
  if (score >= 60) return "warning";
  return "danger";
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function HistoryPage() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    resumeApi.history()
      .then(setAnalyses)
      .catch(() => setAnalyses([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className={styles.centered}>
        <Spinner size={36} />
      </div>
    );
  }

  if (!analyses.length) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}><Clock size={32} /></div>
        <h2 className={styles.emptyTitle}>No analyses yet</h2>
        <p className={styles.emptyText}>
          Analyze your first resume to see results here.
        </p>
        <Button variant="accent" onClick={() => navigate("/analyze")}>
          <Sparkles size={15} />
          Analyze a Resume
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>History</h1>
          <p className={styles.pageSubtitle}>{analyses.length} past {analyses.length === 1 ? "analysis" : "analyses"}</p>
        </div>
        <Button variant="accent" size="sm" onClick={() => navigate("/analyze")}>
          <Sparkles size={14} />
          New Analysis
        </Button>
      </div>

      <div className={styles.layout}>
        {/* List */}
        <div className={styles.list}>
          {analyses.map((a) => (
            <button
              key={a.id}
              className={`${styles.listItem} ${selected?.id === a.id ? styles.listItemActive : ""}`}
              onClick={() => setSelected(selected?.id === a.id ? null : a)}
            >
              <div className={styles.listItemLeft}>
                <div className={styles.listScore} data-score={scoreBadge(a.ats_score)}>
                  {a.ats_score}
                </div>
                <div className={styles.listMeta}>
                  <span className={styles.listRole}>{a.job_role || "Resume Analysis"}</span>
                  <span className={styles.listDate}>{formatDate(a.created_at)}</span>
                </div>
              </div>
              <div className={styles.listRight}>
                <Badge variant={scoreBadge(a.ats_score)}>{a.ats_score}/100</Badge>
                <ChevronRight
                  size={15}
                  className={`${styles.chevron} ${selected?.id === a.id ? styles.chevronOpen : ""}`}
                />
              </div>
            </button>
          ))}
        </div>

        {/* Detail panel */}
        {selected && (
          <div className={`${styles.detail} fade-in`}>
            <div className={styles.detailHeader}>
              <h2 className={styles.detailTitle}>{selected.job_role || "Resume Analysis"}</h2>
              <p className={styles.detailDate}>{formatDate(selected.created_at)}</p>
            </div>

            <div className={styles.gaugeWrap}>
              <ScoreGauge score={selected.ats_score} />
              {selected.score_reason && (
                <p className={styles.scoreReason}>{selected.score_reason}</p>
              )}
            </div>

            <div className={styles.panels}>
              <MatchedKeywords keywords={selected.matched_keywords} />
              <MissingKeywords keywords={selected.missing_keywords} />
              <BulletRewrite
                weak={selected.weak_bullets}
                improved={selected.improved_bullets}
              />
              <FeedbackTips tips={selected.top_feedback} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { resumeApi } from "../api/client.js";
import { Alert, Button, Card, Textarea } from "../components/ui/index.jsx";
import ResumeDropzone from "../components/resume/ResumeDropzone.jsx";
import ScoreGauge from "../components/resume/ScoreGauge.jsx";
import { MatchedKeywords, MissingKeywords } from "../components/resume/KeywordList.jsx";
import BulletRewrite from "../components/resume/BulletRewrite.jsx";
import FeedbackTips from "../components/resume/FeedbackTips.jsx";
import { Sparkles, RotateCcw, ChevronDown, ChevronUp, FileSearch } from "lucide-react";
import styles from "./AnalyzePage.module.css";

export default function AnalyzePage() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) { setError("Please upload a resume PDF."); return; }
    if (!jobDescription.trim()) { setError("Job description is required."); return; }
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const res = await resumeApi.analyze(file, jobDescription, jobRole);
      setResult(res);
      setTimeout(() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setFile(null);
    setJobDescription("");
    setJobRole("");
    setResult(null);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className={styles.page}>
      {/* ── Page header ── */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Analyze Resume</h1>
          <p className={styles.pageSubtitle}>
            Upload your resume and a job description — the AI agent scores your match,
            identifies keyword gaps, and rewrites weak bullets.
          </p>
        </div>
      </div>

      {/* ── Upload form ── */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          <Card className={styles.formCard}>
            <h2 className={styles.cardTitle}>
              <span className={styles.stepDot}>1</span>
              Upload Resume PDF
            </h2>
            <ResumeDropzone file={file} onFileChange={setFile} />
          </Card>

          <Card className={styles.formCard}>
            <h2 className={styles.cardTitle}>
              <span className={styles.stepDot}>2</span>
              Paste Job Description
            </h2>
            <div className={styles.inputGroup}>
              <label className={styles.smallLabel}>Job Role <span className={styles.optional}>(optional)</span></label>
              <input
                className={styles.roleInput}
                type="text"
                placeholder="e.g. Senior Frontend Engineer"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
              />
            </div>
            <Textarea
              label="Job Description"
              placeholder="Paste the full job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </Card>
        </div>

        {error && <Alert>{error}</Alert>}

        <div className={styles.formActions}>
          <Button
            type="submit"
            variant="accent"
            size="lg"
            loading={loading}
            disabled={!file || !jobDescription.trim()}
          >
            <Sparkles size={16} />
            {loading ? "Analyzing with AI…" : "Analyze Resume"}
          </Button>
        </div>
      </form>

      {/* ── Loading state ── */}
      {loading && (
        <div className={styles.loadingCard}>
          <div className={styles.loadingOrb} aria-hidden />
          <div className={styles.loadingText}>
            <p className={styles.loadingMain}>AI agent is reviewing your resume…</p>
            <p className={styles.loadingSub}>Comparing against the job description, extracting keywords, scoring match quality</p>
          </div>
        </div>
      )}

      {/* ── Results ── */}
      {result && (
        <div id="results" className={`${styles.results} fade-in`}>
          <div className={styles.resultsHeader}>
            <div>
              <h2 className={styles.resultsTitle}>
                <FileSearch size={20} />
                Analysis Results
              </h2>
              {result.data.score_reason && (
                <p className={styles.scoreReason}>{result.data.score_reason}</p>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <RotateCcw size={14} />
              Analyze another
            </Button>
          </div>

          {/* Score + columns layout */}
          <div className={styles.resultsGrid}>
            {/* Left: score gauge */}
            <div className={styles.scorePanel}>
              <ScoreGauge score={result.data.ats_score} />
              <p className={styles.scorePanelLabel}>ATS Score</p>

              {/* Preview toggle */}
              {result.resume_preview && (
                <div className={styles.previewBox}>
                  <button
                    className={styles.previewToggle}
                    onClick={() => setShowPreview((v) => !v)}
                    type="button"
                  >
                    <span>Resume preview</span>
                    {showPreview ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                  {showPreview && (
                    <pre className={styles.previewText}>{result.resume_preview}…</pre>
                  )}
                </div>
              )}
            </div>

            {/* Right: detail panels */}
            <div className={styles.detailPanels}>
              <MatchedKeywords keywords={result.data.matched_keywords} />
              <MissingKeywords keywords={result.data.missing_keywords} />
              <BulletRewrite
                weak={result.data.weak_bullets}
                improved={result.data.improved_bullets}
              />
              <FeedbackTips tips={result.data.top_feedback} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

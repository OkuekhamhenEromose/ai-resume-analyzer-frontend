import React, { useState } from "react";
import { resumeApi } from "../api/client.js";
import { Alert, Textarea } from "../components/ui/UI.jsx";
import Dropzone from "../components/resume/Dropzone.jsx";
import ScoreRing from "../components/resume/ScoreRing.jsx";
import SectionHealth from "../components/resume/SectionHealth.jsx";
import { MatchedKeywords, MissingKeywords } from "../components/resume/Keywords.jsx";
import BulletRewrites from "../components/resume/BulletRewrites.jsx";
import StrengthsWeaknesses from "../components/resume/StrengthsWeaknesses.jsx";
import RegenModal from "../components/resume/RegenModal.jsx";
import {
  FileText, Sparkles, RotateCcw, RefreshCw,
  Lightbulb, ChevronDown, ChevronUp, Zap
} from "lucide-react";
import s from "./HomePage.module.css";

export default function HomePage() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [analysisId, setAnalysisId] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showRegen, setShowRegen] = useState(false);

  async function handleAnalyze(e) {
    e.preventDefault();
    if (!file) { setError("Please upload a resume PDF."); return; }
    if (!jobDescription.trim()) { setError("Job description is required."); return; }
    setError(""); setResult(null); setAnalysisId(null); setLoading(true);
    try {
      const res = await resumeApi.analyze(file, jobDescription, jobRole);
      setResult(res);
      const history = await resumeApi.history().catch(() => []);
      if (history.length) setAnalysisId(history[0].id);
      setTimeout(() => {
        document.getElementById("results-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setFile(null); setJobDescription(""); setJobRole("");
    setResult(null); setAnalysisId(null); setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const data = result?.data;

  return (
    <>
      <div className={s.page}>

        {/* ══════════════════════════════════════════
            PAGE HEADER — gradient accent bar
        ══════════════════════════════════════════ */}
        <div className={s.pageHeader}>
          <div className={s.pageHeaderInner}>
            <div className={s.headerIcon}>
              <Sparkles size={20} />
            </div>
            <div>
              <h1 className={s.pageTitle}>Resume Analyzer</h1>
              <p className={s.pageSub}>
                Upload your resume · paste a job description · get an instant ATS score,
                section-by-section review, and a rewritten PDF.
              </p>
            </div>
          </div>

          {/* Step indicators */}
          <div className={s.stepTrack}>
            {["Upload Resume", "Add Job Details", "Get AI Analysis"].map((label, i) => (
              <div key={i} className={s.stepItem}>
                <div className={s.stepBubble}>{i + 1}</div>
                <span className={s.stepLabel}>{label}</span>
                {i < 2 && <div className={s.stepLine} />}
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════
            MAIN SPLIT LAYOUT
        ══════════════════════════════════════════ */}
        <div className={s.split}>

          {/* ── LEFT PANEL ── */}
          <aside className={s.leftPanel}>

            {/* Upload card */}
            <div className={s.panelCard}>
              <div className={s.cardHeader}>
                <div className={s.cardStepDot}>1</div>
                <h2 className={s.cardTitle}>Upload Resume</h2>
              </div>
              <Dropzone file={file} onChange={setFile} disabled={loading} />
            </div>

            {/* Job details card */}
            <div className={s.panelCard}>
              <div className={s.cardHeader}>
                <div className={s.cardStepDot}>2</div>
                <h2 className={s.cardTitle}>Job Details</h2>
              </div>

              <div className={s.roleField}>
                <label className={s.fieldLabel}>
                  Job Title
                  <span className={s.opt}>optional</span>
                </label>
                <input
                  className={s.roleInput}
                  type="text"
                  placeholder="e.g. Senior Frontend Engineer"
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className={s.textareaWrap}>
                <label className={s.fieldLabel}>
                  Job Description
                  <span className={s.required}>required</span>
                </label>
                <textarea
                  className={s.textarea}
                  placeholder="Paste the full job description here…"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  disabled={loading}
                  rows={7}
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className={s.errorBox}>
                <span className={s.errorDot} />
                {error}
              </div>
            )}

            {/* Actions */}
            <div className={s.actions}>
              {result && (
                <button className={s.resetBtn} onClick={handleReset}>
                  <RotateCcw size={14} />
                  Start over
                </button>
              )}
              <button
                className={s.analyzeBtn}
                onClick={handleAnalyze}
                disabled={loading || !file || !jobDescription.trim()}
              >
                {loading ? (
                  <span className={s.btnSpinner} />
                ) : (
                  <Sparkles size={16} />
                )}
                <span>{loading ? "Analyzing…" : "Analyze Resume"}</span>
              </button>
            </div>

            {/* Loading hint */}
            {loading && (
              <div className={s.loadingHint}>
                <span className={s.loadingPulse} />
                <p>AI is reviewing every section against the job description…</p>
              </div>
            )}
          </aside>

          {/* ── RIGHT PANEL ── */}
          <main className={s.rightPanel} id="results-panel">

            {/* Empty state */}
            {!result && !loading && (
              <div className={s.emptyState}>
                <div className={s.emptyRing}>
                  <FileText size={28} />
                </div>
                <h3 className={s.emptyTitle}>Your analysis will appear here</h3>
                <p className={s.emptySub}>
                  Complete both steps on the left, then click
                  <strong> Analyze Resume</strong> to get your AI score.
                </p>
                <div className={s.emptyFeatures}>
                  {["ATS Score", "Section Review", "Keyword Gaps", "Bullet Rewrites", "PDF Regeneration"].map((f) => (
                    <span key={f} className={s.emptyFeaturePill}>{f}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Loading state */}
            {loading && (
              <div className={s.loadingState}>
                <div className={s.loadingOrb}>
                  <div className={s.loadingOrb1} />
                  <div className={s.loadingOrb2} />
                  <Sparkles size={22} className={s.loadingIcon} />
                </div>
                <h3 className={s.loadingTitle}>Analyzing your resume…</h3>
                <div className={s.loadingSteps}>
                  {["Reading resume content", "Comparing to job description", "Scoring each section", "Generating recommendations"].map((step, i) => (
                    <div key={i} className={s.loadingStep} style={{ animationDelay: `${i * 0.4}s` }}>
                      <span className={s.loadingStepDot} style={{ animationDelay: `${i * 0.4}s` }} />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Results */}
            {result && data && (
              <div className={`${s.results} anim-fade-up`}>

                {/* ── Score banner ── */}
                <div className={s.scoreBanner}>
                  <div className={s.scoreBannerBg} aria-hidden />
                  <div className={s.scoreBannerContent}>
                    <ScoreRing score={data.ats_score} />
                    <div className={s.scoreMeta}>
                      <div className={s.scoreTagRow}>
                        <span className={s.seniorityTag}>{data.seniority_level} level</span>
                        {jobRole && <span className={s.roleTag}>{jobRole}</span>}
                      </div>
                      <h3 className={s.scoreHeading}>ATS Analysis Complete</h3>
                      <p className={s.scoreReason}>{data.score_reason}</p>

                      {result.resume_preview && (
                        <div className={s.previewBox}>
                          <button
                            className={s.previewToggle}
                            onClick={() => setShowPreview((v) => !v)}
                          >
                            <FileText size={13} />
                            Resume preview
                            {showPreview ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                          </button>
                          {showPreview && (
                            <pre className={s.previewText}>{result.resume_preview}…</pre>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* ── Section health ── */}
                {data.section_health?.length > 0 && (
                  <div className={s.resultCard}>
                    <div className={s.resultCardHeader}>
                      <div className={s.resultCardHeaderLine} />
                      <h3 className={s.resultCardTitle}>Section Review</h3>
                    </div>
                    <SectionHealth sections={data.section_health} />
                  </div>
                )}

                {/* ── Strengths & Weaknesses ── */}
                <div className={s.resultCard}>
                  <div className={s.resultCardHeader}>
                    <div className={s.resultCardHeaderLine} />
                    <h3 className={s.resultCardTitle}>Strengths & Areas to Improve</h3>
                  </div>
                  <StrengthsWeaknesses strengths={data.strengths} weaknesses={data.weaknesses} />
                </div>

                {/* ── Keywords ── */}
                <div className={s.resultCard}>
                  <div className={s.resultCardHeader}>
                    <div className={s.resultCardHeaderLine} />
                    <h3 className={s.resultCardTitle}>Keyword Analysis</h3>
                  </div>
                  <div className={s.kwGrid}>
                    <MatchedKeywords keywords={data.matched_keywords} />
                    <MissingKeywords keywords={data.missing_keywords} />
                  </div>
                </div>

                {/* ── Bullet Rewrites ── */}
                {data.weak_bullets?.length > 0 && (
                  <div className={s.resultCard}>
                    <div className={s.resultCardHeader}>
                      <div className={s.resultCardHeaderLine} />
                      <h3 className={s.resultCardTitle}>Bullet Point Rewrites</h3>
                    </div>
                    <BulletRewrites weak={data.weak_bullets} improved={data.improved_bullets} />
                  </div>
                )}

                {/* ── Top Feedback ── */}
                {data.top_feedback?.length > 0 && (
                  <div className={s.feedbackCard}>
                    <div className={s.feedbackBg} aria-hidden />
                    <div className={s.feedbackInner}>
                      <div className={s.feedbackHeader}>
                        <Lightbulb size={16} className={s.feedbackIcon} />
                        <h4 className={s.feedbackTitle}>Top Recommendations</h4>
                      </div>
                      <ol className={s.feedbackList}>
                        {data.top_feedback.map((tip, i) => (
                          <li key={i} className={s.feedbackItem}>
                            <span className={s.feedbackNum}>{i + 1}</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                )}

                {/* ── Regenerate CTA ── */}
                <div className={s.regenCta}>
                  <div className={s.regenCtaBg} aria-hidden />
                  <div className={s.regenCtaContent}>
                    <div className={s.regenCtaLeft}>
                      <div className={s.regenCtaIcon}>
                        <Zap size={20} />
                      </div>
                      <div>
                        <h3 className={s.regenTitle}>Ready to apply all these fixes?</h3>
                        <p className={s.regenSub}>
                          Regenerate a fully improved resume — every gap corrected, every bullet
                          rewritten — then download it as a PDF.
                        </p>
                      </div>
                    </div>
                    <button
                      className={s.regenBtn}
                      onClick={() => setShowRegen(true)}
                    >
                      <RefreshCw size={15} />
                      Regenerate Resume
                    </button>
                  </div>
                </div>

              </div>
            )}
          </main>
        </div>
      </div>

      {showRegen && (
        <RegenModal
          analysisId={analysisId}
          jobRole={jobRole}
          jobDescription={jobDescription}
          onClose={() => setShowRegen(false)}
        />
      )}
    </>
  );
}
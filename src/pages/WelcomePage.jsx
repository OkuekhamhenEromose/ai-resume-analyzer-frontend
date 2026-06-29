import React from "react";
import { useNavigate } from "react-router-dom";
import s from "./WelcomePage.module.css";

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className={s.page}>
      {/* ── Left — hero image ── */}
      <div className={s.imagePanel}>
        <img
          src="/hero-resume.jpg" onError={(e) => { if (!e.target.src.includes("svg")) e.target.src = "/welcome2.png"; }}
          alt="Professional reviewing a resume"
          className={s.heroImage}
        />
        {/*
          Save your hero image to:
            ai-resume-analyzer-frontend/public/hero-resume.jpg

          Recommended: a high-quality photo of someone reviewing a document,
          working at a desk, or in a professional setting.
          Ideal size: 1200 × 1600 px (portrait), min 800 × 1000 px.

          Free sources:
            • https://unsplash.com/s/photos/resume-professional
            • https://www.pexels.com/search/resume/
          Download any photo and rename it to hero-resume.jpg
        */}
        <div className={s.imageOverlay} aria-hidden />
        <div className={s.imageBadge}>
          <span className={s.badgeDot} />
          AI-powered · Instant results
        </div>
      </div>

      {/* ── Right — intro copy ── */}
      <div className={s.contentPanel}>
        {/* Gradient background blobs */}
        <div className={s.blob1} aria-hidden />
        <div className={s.blob2} aria-hidden />
        <div className={s.blob3} aria-hidden />

        <div className={s.content}>
          {/* Brand */}
          <div className={s.brand}>
            <div className={s.brandMark}>R</div>
            <span className={s.brandName}>ResumeIQ</span>
          </div>

          {/* Headline */}
          <h1 className={s.headline}>
            Land your dream job with an
            <span className={s.headlineAccent}> AI-powered</span> resume
          </h1>

          {/* Subtext */}
          <p className={s.body}>
            ResumeIQ analyzes your resume against any job description in
            seconds — scoring your ATS match, identifying keyword gaps,
            reviewing every section, and rewriting weak bullet points with
            measurable impact.
          </p>

          {/* Feature list */}
          <ul className={s.features}>
            {[
              { icon: "📊", text: "Instant ATS score with detailed reasoning" },
              { icon: "🔍", text: "Section-by-section health review" },
              { icon: "🎯", text: "Matched & missing keyword analysis" },
              { icon: "✨", text: "AI bullet rewrites with metrics" },
              { icon: "📄", text: "Full resume regeneration — download as PDF" },
            ].map(({ icon, text }) => (
              <li key={text} className={s.featureItem}>
                <span className={s.featureIcon}>{icon}</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>

          {/* CTA buttons */}
          <div className={s.actions}>
            <button
              className={s.ctaPrimary}
              onClick={() => navigate("/register")}
            >
              Get started free
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
            <button
              className={s.ctaSecondary}
              onClick={() => navigate("/login")}
            >
              Log in
            </button>
          </div>

          {/* Social proof */}
          <p className={s.trust}>
            Free to use · No credit card required · Powered by Google Gemini
          </p>
        </div>
      </div>
    </div>
  );
}

import React, { useRef, useState } from "react";
import { X, Download, RefreshCw } from "lucide-react";
import { resumeApi } from "../../api/client.js";
import { Button, Spinner } from "../ui/UI.jsx";
import s from "./RegenModal.module.css";

export default function RegenModal({ analysisId, jobRole, jobDescription, onClose }) {
  const [phase, setPhase] = useState("idle"); // idle | loading | done | error
  const [html, setHtml] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const frameRef = useRef(null);

  async function generate() {
    setPhase("loading");
    setErrMsg("");
    try {
      const res = await resumeApi.regenerate(analysisId, jobRole, jobDescription);
      setHtml(res.html);
      setPhase("done");
    } catch (e) {
      setErrMsg(e.message);
      setPhase("error");
    }
  }

  function downloadPdf() {
    // Open the HTML in a new window and trigger the browser's print dialog
    // (browser "Save as PDF" gives clean A4 output)
    const win = window.open("", "_blank");
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 400);
  }

  return (
    <div className={s.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={s.modal}>
        {/* Header */}
        <div className={s.modalHeader}>
          <div>
            <h2 className={s.modalTitle}>Regenerated Resume</h2>
            <p className={s.modalSub}>AI-rewritten to address every gap found in the analysis</p>
          </div>
          <button className={s.closeBtn} onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>

        {/* Body */}
        <div className={s.body}>
          {phase === "idle" && (
            <div className={s.idleState}>
              <div className={s.idleIcon}>
                <RefreshCw size={28} />
              </div>
              <h3 className={s.idleTitle}>Ready to regenerate</h3>
              <p className={s.idleSub}>
                The AI will rewrite your entire resume, fixing weak sections,
                adding missing keywords, and improving every bullet point with metrics.
              </p>
              <Button size="lg" onClick={generate}>
                <RefreshCw size={15} />
                Generate new resume
              </Button>
            </div>
          )}

          {phase === "loading" && (
            <div className={s.loadingState}>
              <Spinner size={40} />
              <p className={s.loadingText}>Rewriting your resume…</p>
              <p className={s.loadingSub}>Incorporating feedback, keywords, and stronger bullets</p>
            </div>
          )}

          {phase === "error" && (
            <div className={s.errorState}>
              <p className={s.errorText}>{errMsg}</p>
              <Button variant="secondary" onClick={generate}>Try again</Button>
            </div>
          )}

          {phase === "done" && (
            <div className={s.doneState}>
              <iframe
                ref={frameRef}
                srcDoc={html}
                title="Regenerated Resume"
                className={s.frame}
                sandbox="allow-same-origin"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        {phase === "done" && (
          <div className={s.footer}>
            <p className={s.footerNote}>
              Click "Download as PDF" then choose "Save as PDF" in the print dialog.
            </p>
            <div className={s.footerActions}>
              <Button variant="secondary" size="sm" onClick={generate}>
                <RefreshCw size={13} /> Regenerate again
              </Button>
              <Button size="md" onClick={downloadPdf}>
                <Download size={14} /> Download as PDF
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

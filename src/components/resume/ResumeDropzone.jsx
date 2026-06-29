import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, Upload, X } from "lucide-react";
import styles from "./ResumeDropzone.module.css";

export default function ResumeDropzone({ file, onFileChange }) {
  const onDrop = useCallback((accepted) => {
    if (accepted[0]) onFileChange(accepted[0]);
  }, [onFileChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  });

  if (file) {
    return (
      <div className={styles.filePreview}>
        <FileText size={22} className={styles.fileIcon} />
        <div className={styles.fileInfo}>
          <span className={styles.fileName}>{file.name}</span>
          <span className={styles.fileSize}>{(file.size / 1024).toFixed(1)} KB</span>
        </div>
        <button
          type="button"
          className={styles.removeBtn}
          onClick={() => onFileChange(null)}
          aria-label="Remove file"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`${styles.zone} ${isDragActive ? styles.zoneActive : ""}`}
    >
      <input {...getInputProps()} />
      <div className={styles.zoneInner}>
        <div className={styles.uploadIcon}>
          <Upload size={24} />
        </div>
        <p className={styles.zoneText}>
          {isDragActive ? "Drop your resume here" : "Drag & drop your resume PDF"}
        </p>
        <p className={styles.zoneSub}>or <span className={styles.browse}>browse to choose</span> · max 5 MB</p>
      </div>
    </div>
  );
}

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, Upload, X } from "lucide-react";
import s from "./Dropzone.module.css";

export default function Dropzone({ file, onChange, disabled }) {
  const onDrop = useCallback((accepted) => {
    if (accepted[0]) onChange(accepted[0]);
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, disabled,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1, maxSize: 5 * 1024 * 1024,
  });

  if (file) {
    return (
      <div className={s.preview}>
        <FileText size={20} className={s.fileIcon} />
        <div className={s.fileInfo}>
          <span className={s.fileName}>{file.name}</span>
          <span className={s.fileSize}>{(file.size / 1024).toFixed(0)} KB · PDF</span>
        </div>
        <button type="button" className={s.remove} onClick={() => onChange(null)} aria-label="Remove">
          <X size={15} />
        </button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`${s.zone} ${isDragActive ? s.active : ""} ${disabled ? s.disabled : ""}`}
    >
      <input {...getInputProps()} />
      <div className={s.inner}>
        <div className={s.icon}>
          <Upload size={22} />
        </div>
        <p className={s.heading}>{isDragActive ? "Drop PDF here" : "Drag & drop your resume"}</p>
        <p className={s.sub}>or <span className={s.browse}>browse to choose</span> · PDF only · max 5 MB</p>
      </div>
    </div>
  );
}

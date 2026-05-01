/** Extract proctoring payload from interview-feedback row shape (flat or nested). */
export function getProctoringFromFeedback(feedbackRoot) {
  if (!feedbackRoot || typeof feedbackRoot !== "object") return null;
  const p =
    feedbackRoot.proctoring ??
    feedbackRoot.feedback?.proctoring ??
    null;
  if (!p || typeof p !== "object") return null;
  return p;
}

export function proctoringAlertTotal(p) {
  if (!p) return 0;
  return (
    (p.noFaceCount || 0) +
    (p.multipleFaceCount || 0) +
    (p.cellPhoneCount || 0) +
    (p.prohibitedObjectCount || 0)
  );
}

const TYPE_LABELS = {
  noFace: "Face not visible",
  multipleFace: "Multiple faces",
  cellPhone: "Cell phone",
  prohibitedObject: "Prohibited object",
};

export function proctoringTypeLabel(type) {
  return TYPE_LABELS[type] || type || "Unknown";
}

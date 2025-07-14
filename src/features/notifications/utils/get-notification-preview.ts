export function getNotificationPreview(
  content: string,
  maxLength = 80,
  locale = "en",
) {
  if (content.length <= maxLength) return content;
  if (typeof Intl !== "undefined" && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter(locale, { granularity: "word" });
    const segments = segmenter.segment(content);
    let truncated = "";
    let length = 0;
    for (const { segment } of segments) {
      if (length + segment.length > maxLength) break;
      truncated += segment;
      length += segment.length;
    }
    return truncated + "...";
  }
  return content.slice(0, maxLength) + "...";
}

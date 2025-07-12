export function getNotificationPreview(content: string, maxLength = 80) {
  if (content.length <= maxLength) return content;
  return content.slice(0, maxLength) + "...";
}

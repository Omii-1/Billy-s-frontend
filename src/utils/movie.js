export const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const formatDuration = (minutes) => {
  if (!minutes || minutes < 0) return "Invalid duration";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours} Hour ${mins} Min`;
};
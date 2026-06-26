
export function cleanTitle(title) {
  if (!title) return "";

  return title
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[^\w\s-]/g, "");
}

export function createSlug(title) {
  return cleanTitle(title)
    .toLowerCase()
    .replace(/\s+/g, "-");
}

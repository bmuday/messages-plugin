const TRACKING_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "fbclid",
  "gclid",
  "msclkid",
  "ref",
  "source",
  "campaign_id",
  "_ga",
  "_gid",
  "_gl",
  "mc_cid",
  "mc_eid"
];
function normalizeUrl(url) {
  try {
    const urlObj = new URL(url);
    if (urlObj.protocol === "http:" && !urlObj.hostname.includes("localhost")) {
      urlObj.protocol = "https:";
    }
    urlObj.hostname = urlObj.hostname.toLowerCase();
    const searchParams = new URLSearchParams(urlObj.search);
    TRACKING_PARAMS.forEach((param) => searchParams.delete(param));
    const sortedParams = new URLSearchParams(
      [...searchParams.entries()].sort((a, b) => a[0].localeCompare(b[0]))
    );
    urlObj.search = sortedParams.toString();
    if (urlObj.hash && !urlObj.hash.match(/^#[!/]/)) {
      urlObj.hash = "";
    }
    if (urlObj.pathname !== "/" && urlObj.pathname.endsWith("/")) {
      urlObj.pathname = urlObj.pathname.slice(0, -1);
    }
    return urlObj.toString();
  } catch (error) {
    console.error("Failed to normalize URL:", error);
    return url;
  }
}
async function hashString(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}
async function hashUrl(url) {
  const normalized = normalizeUrl(url);
  return await hashString(normalized);
}
function extractDomain(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (error) {
    console.error("Failed to extract domain:", error);
    return "";
  }
}
export {
  extractDomain as e,
  hashUrl as h,
  normalizeUrl as n
};

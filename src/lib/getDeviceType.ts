export function getDeviceType(): "mobile" | "tablet" | "desktop" | "unknown" {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent || navigator.vendor;

  // Tablet
  if (/iPad|Tablet|PlayBook|Silk|(Android(?!.*Mobile))/.test(ua)) {
    return "tablet";
  }
  // Mobile
  if (
    /Mobi|Android|iPhone|iPod|BlackBerry|Opera Mini|IEMobile|WPDesktop/.test(ua)
  ) {
    return "mobile";
  }
  // Desktop
  if (/Windows|Macintosh|Linux|X11/.test(ua)) {
    return "desktop";
  }
  return "unknown";
}





//browser type
export function getBrowserType(userAgent: string): string {
  userAgent = userAgent || "";
  if (/firefox\/\d+/i.test(userAgent)) {
    return "Firefox";
  } else if (/edg\/\d+/i.test(userAgent)) {
    return "Edge";
  } else if (/opr\/\d+/i.test(userAgent)) {
    return "Opera";
  } else if (/chrome\/\d+/i.test(userAgent)) {
    return "Chrome";
  } else if (
    /safari\/\d+/i.test(userAgent) &&
    !/chrome|chromium|crios|opr\//i.test(userAgent)
  ) {
    return "Safari";
  } else {
    const match = userAgent.match(/([a-zA-Z]+)\/[\d.]+/g);
    if (match && match.length > 0) {
      // Try to pick a non-generic one, skipping obvious platform tokens, etc.
      const skip = [
        "Mozilla",
        "AppleWebKit",
        "Gecko",
        "Version",
        "Mobile",
        "Safari",
        "Chrome",
        "Edge",
        "OPR",
        "Edg",
      ];
      for (const m of match) {
        const name = m.split("/")[0];
        if (!skip.includes(name)) {
          return name;
        }
      }
    }
    return "Other";
  }
}

import React, { useEffect } from "react";

// Minimal AdSense banner wrapper. Loads the AdSense script on first render
// and attempts to render a responsive banner. Falls back to a simple placeholder
// if the script is unavailable.
export default function AdSenseBanner() {
  // Ad-free mode (future feature)
  const adFree = typeof window !== "undefined" && Boolean(window.PAPERCLIP_AD_FREE);
  // Offline state: keep layout space but render nothing to avoid errors
  const offline = typeof navigator !== "undefined" && !navigator.onLine;
  useEffect(() => {
    // Load Google AdSense script once if not already loaded
    if (typeof window === "undefined") return;
    const hasScript = Boolean(document.querySelector("script[src=\"https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js\"]"));
    if (!hasScript) {
      const s = document.createElement("script");
      s.async = true;
      s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
      document.head.appendChild(s);
    }
    // Push a new ad request if possible
    try {
      // eslint-disable-next-line no-undef
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // Silently ignore if Ads script isn't ready yet
    }
  }, []);

  // The actual ad unit. In production this will render a real AdSense unit if the
  // external script is loaded and allowed by Google's policy.
  return (
    <div className="adsense-banner" style={{ width: "100%", textAlign: "center", padding: "12px 0" }}>
      {(!offline && !adFree) ? (
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "100%", height: 90 }}
          data-ad-client="ca-pub-0000000000000000"
          data-ad-slot="0000000000"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      ) : (
        // Offline or ad-free: preserve layout space without rendering an ad
        <div style={{ width: "100%", height: 90 }} />
      )}
    </div>
  );
}

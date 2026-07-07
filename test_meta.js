var http = require("http");
var pages = [
  "/health/bmi-calculator-advanced",
  "/health/heart-rate-zones-calculator",
  "/health/VO2-max-calculator",
  "/finance/compound-interest-calculator",
  "/health/one-rep-max-calculator"
];
var remaining = pages.length;
pages.forEach(function(page) {
  http.get("http://localhost:3000" + page, function(res) {
    var d = "";
    res.on("data", function(c) { d += c; });
    res.on("end", function() {
      var canMatch = d.match(/rel="canonical"[^>]*href="([^"]+)"/);
      var ogMatch = d.match(/property="og:url"[^>]*content="([^"]+)"/);
      var twMatch = d.match(/name="twitter:title"[^>]*content="([^"]+)"/);
      console.log("Page: " + page);
      console.log("  Canonical: " + (canMatch ? canMatch[1] : "NOT FOUND"));
      console.log("  OG URL:    " + (ogMatch ? ogMatch[1] : "NOT FOUND"));
      console.log("  Twitter:   " + (twMatch ? twMatch[1] : "NOT FOUND"));
      remaining--;
      if (remaining === 0) process.exit(0);
    });
  }).on("error", function(e) {
    console.log("Error: " + e.message);
    remaining--;
    if (remaining === 0) process.exit(1);
  });
});

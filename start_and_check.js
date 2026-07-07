var { spawn } = require("child_process");
var http = require("http");

var server = spawn("npx.cmd", ["next", "dev", "-p", "3000"], {
  cwd: "C:/Users/store one/Documents/CALC/website",
  stdio: ["ignore", "pipe", "pipe"],
  shell: true
});

var started = false;
server.stdout.on("data", function(d) {
  var text = d.toString();
  console.log(text.substring(0, 100));
  if (text.includes("Local:") && !started) {
    started = true;
    console.log("--- Server started, waiting 3s ---");
    setTimeout(function() {
      http.get("http://localhost:3000/health/bmi-calculator-advanced", function(res) {
        var data = "";
        res.on("data", function(c) { data += c; });
        res.on("end", function() {
          var m = data.match(/rel="canonical"[^>]*href="([^"]+)"/);
          console.log("--- RESULT ---");
          console.log("Canonical: " + (m ? m[1] : "NOT FOUND"));
          server.kill();
          process.exit(0);
        });
      }).on("error", function(e) {
        console.log("HTTP Error: " + e.message);
        server.kill();
        process.exit(1);
      });
    }, 3000);
  }
});

server.stderr.on("data", function(d) {
  console.log("ERR: " + d.toString().substring(0, 200));
});

setTimeout(function() {
  if (!started) {
    console.log("Server failed to start within 45s");
    server.kill();
    process.exit(1);
  }
}, 45000);
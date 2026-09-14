const fs = require("fs");
const path = require("path");
const dir = "C:\\Users\\store one\\Pictures\\calculatora\\MpB2M28jkJJIYqVynKKb\\Fichiers multiples\\src\\components\\hub-calculators\\biology";

const files = fs.readdirSync(dir).filter(f => f.endsWith(".ts") && f !== "index.ts");

// Generic extras pattern to replace
const genericPattern = /\s*,\s*extras:\s*\[\s*\{[^}]*"Measurement note"[^}]*\}[^}]*\{[^}]*"Clinical context"[^}]*\}[^}]*\{[^}]*"WHO reference"[^}]*\}\s*\]/s;

// Helper: get extras for a calculator (slug-based)
function getBiologyExtras(slug) {
  return {
    "bmi-calculator": [
      { label: "Biological Context", value: "BMI correlates with body fat percentage and is a screening tool for weight-related health risks across populations." },
      { label: "Typical Values", value: "Healthy BMI: 18.5–24.9. Overweight: 25–29.9. Obese: =30. Athletes may read high-BMI due to muscle, not fat." },
      { label: "Measurement Notes", value: "Height without shoes. Weight at consistent time of day. BMI does not distinguish fat from muscle." },
      { label: "Related Concepts", value: "Waist-to-hip ratio, body fat percentage, BMR, lean body mass." },
      { label: "Applications", value: "Clinical screening for weight categories, population health studies."
      }
    ],
  };
}

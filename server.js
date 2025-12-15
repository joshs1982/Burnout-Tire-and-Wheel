import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/rates", async (req, res) => {
  const { zip, packages } = req.body;

  if (!zip || !packages) {
    return res.status(400).json({ error: "Missing data" });
  }

  // 🔴 TEMP PLACEHOLDER (replace with real APIs later)
  let totalWeight = packages.reduce((s, p) => s + p.weight, 0);

  res.json({
    usps: (totalWeight * 0.85).toFixed(2),
    fedex: (totalWeight * 1.10).toFixed(2),
    ups: (totalWeight * 1.00).toFixed(2)
  });
});

app.listen(3000, () => {
  console.log("Shipping API running");
});

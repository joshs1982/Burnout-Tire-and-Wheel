import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Shipping API
app.post('/api/shipping', (req, res) => {
  const { zip, items } = req.body;

  if (!items || items.length === 0) {
    return res.json({ usps: "0.00", ups: "0.00", fedex: "0.00" });
  }

  // Calculate total weight
  const totalWeight = items.reduce((sum, item) => sum + (item.weight || 0) * (item.qty || 1), 0);

  // Example shipping formulas
  const usps = (5 + totalWeight * 1.5).toFixed(2);
  const ups = (10 + totalWeight * 2).toFixed(2);
  const fedex = (12 + totalWeight * 2.5).toFixed(2);

  res.json({ usps, ups, fedex });
});

app.listen(PORT, () => console.log(`Shipping server running on http://localhost:${PORT}`));

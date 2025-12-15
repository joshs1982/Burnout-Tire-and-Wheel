// server.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// POST /api/shipping
app.post('/api/shipping', (req, res) => {
  const { zip, items } = req.body;

  if (!zip || !items) return res.status(400).json({ error: 'Missing data' });

  // Dummy calculation: $5 + $0.5 per lb per item
  const totalWeight = items.reduce((sum, i) => sum + i.weight * i.qty, 0);
  const rates = {
    usps: (5 + totalWeight * 0.5).toFixed(2),
    ups: (7 + totalWeight * 0.55).toFixed(2),
    fedex: (6 + totalWeight * 0.6).toFixed(2)
  };

  res.json(rates);
});

app.listen(3000, () => console.log('Shipping API running on port 3000'));

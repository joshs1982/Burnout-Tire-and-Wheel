import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post('/api/shipping', (req, res) => {
  try {
    const { zip, items } = req.body;

    if (!zip || !items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Invalid data' });
    }

    console.log('Shipping request received:', { zip, items });

    // Simple calculation: base + weight factor
    const totalWeight = items.reduce((sum, i) => sum + (i.weight || 0) * (i.qty || 1), 0);
    const rates = {
      usps: (10 + totalWeight * 1.5).toFixed(2),
      ups: (12 + totalWeight * 2).toFixed(2),
      fedex: (14 + totalWeight * 2.5).toFixed(2)
    };

    res.json(rates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Shipping API error' });
  }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

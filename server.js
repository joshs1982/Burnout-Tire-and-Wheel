import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Dummy shipping calculation for testing
function calculateShipping(items, zip) {
  // total weight
  const totalWeight = items.reduce((sum, item) => sum + item.weight * item.qty, 0);
  
  // Simple dummy rates
  return {
    usps: (5 + totalWeight * 0.5).toFixed(2),
    ups: (7 + totalWeight * 0.7).toFixed(2),
    fedex: (6 + totalWeight * 0.6).toFixed(2)
  };
}

app.post('/api/shipping', (req, res) => {
  try {
    const { items, zip } = req.body;
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Invalid items array' });
    }
    const rates = calculateShipping(items, zip);
    res.json(rates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

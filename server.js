import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

// Enable CORS so your frontend can fetch
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Shipping endpoint
app.post('/api/shipping', async (req, res) => {
  try {
    const { zip, items } = req.body;

    if (!zip || !items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    console.log('Shipping request received:');
    console.log('ZIP:', zip);
    console.log('Items:', items);

    // TEMP: Fake shipping rates (replace with real API later)
    const shippingRates = {
      usps: 10.00 + calculateWeight(items) * 1.5,
      ups: 12.50 + calculateWeight(items) * 2.0,
      fedex: 15.75 + calculateWeight(items) * 2.5
    };

    res.json(shippingRates);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Shipping API error' });
  }
});

// Helper to calculate total weight
function calculateWeight(items) {
  return items.reduce((sum, i) => sum + (i.weight || 0) * (i.qty || 1), 0);
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});



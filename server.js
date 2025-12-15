import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/rates", async (req, res) => {
  const { zip, packages } = req.body;
  if (!zip || !packages) return res.status(400).json({ error: "Missing data" });

  try {
    // Aggregate weight & dimensions for example purposes
    const totalWeight = packages.reduce((s, p) => s + p.weight, 0);

    // 1️⃣ USPS Rate (XML API)
    const uspsResponse = await axios.get("https://secure.shippingapis.com/ShippingAPI.dll", {
      params: {
        API: "RateV4",
        XML: `<RateV4Request USERID="${process.env.USPS_USERID}">
                <Revision>2</Revision>
                <Package ID="1ST">
                  <Service>PRIORITY</Service>
                  <ZipOrigination>72076</ZipOrigination>
                  <ZipDestination>${zip}</ZipDestination>
                  <Pounds>${totalWeight}</Pounds>
                  <Ounces>0</Ounces>
                  <Container>VARIABLE</Container>
                  <Size>REGULAR</Size>
                </Package>
              </RateV4Request>`
      }
    });

    // 2️⃣ UPS Rate (JSON API example placeholder)
    const upsResponse = { rate: totalWeight * 1.0 }; // replace with real API call

    // 3️⃣ FedEx Rate (JSON API example placeholder)
    const fedexResponse = { rate: totalWeight * 1.1 }; // replace with real API call

    res.json({
      usps: uspsResponse.data, // you would parse XML to get the amount
      ups: upsResponse.rate.toFixed(2),
      fedex: fedexResponse.rate.toFixed(2)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching rates" });
  }
});

app.listen(3000, () => console.log("Shipping API running on port 3000"));
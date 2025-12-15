import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import xml2js from "xml2js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/rates", async (req, res) => {
  const { zip, packages } = req.body;
  if (!zip || !packages) return res.status(400).json({ error: "Missing data" });

  try {
    const totalWeight = packages.reduce((s, p) => s + p.weight, 0);

    // USPS Rate
    const uspsXML = `<RateV4Request USERID="${process.env.USPS_USERID}">
      <Revision>2</Revision>
      <Package ID="1ST">
        <Service>PRIORITY</Service>
        <ZipOrigination>72076</ZipOrigination>
        <ZipDestination>${zip}</ZipDestination>
        <Pounds>${Math.floor(totalWeight)}</Pounds>
        <Ounces>${((totalWeight % 1) * 16).toFixed(1)}</Ounces>
        <Container>VARIABLE</Container>
        <Size>REGULAR</Size>
      </Package>
    </RateV4Request>`;

    const uspsResponse = await axios.get("https://secure.shippingapis.com/ShippingAPI.dll", {
      params: { API: "RateV4", XML: uspsXML }
    });

    const uspsData = await xml2js.parseStringPromise(uspsResponse.data);
    const uspsRate = parseFloat(
      uspsData?.RateV4Response?.Package?.[0]?.Postage?.[0]?.Rate?.[0] || 0
    );

    // UPS & FedEx placeholders
    const upsRate = totalWeight * 1.2;
    const fedexRate = totalWeight * 1.3;

    res.json({
      usps: uspsRate,
      ups: upsRate.toFixed(2),
      fedex: fedexRate.toFixed(2)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching rates" });
  }
});

app.listen(3000, () => console.log("Shipping API running on port 3000"));

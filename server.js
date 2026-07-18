import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import path from "path";

dotenv.config({ path: ".env.local" });

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("."));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.post("/analyze", async (req, res) => {

  try {

    const {
      year,
      make,
      model,
      trim,
      mileage,
      price,
      url
    } = req.body;

    const prompt = `
You are CarTruth AI, an expert vehicle inspector.

Analyze this vehicle.

Vehicle Information

Year: ${year}
Make: ${make}
Model: ${model}
Trim: ${trim}
Mileage: ${mileage}
Seller Price: $${price}

Listing URL:
${url || "None"}

If a listing URL exists:
- Read the listing if possible.
- Mention missing information.
- Use it to improve your recommendation.

Return ONLY this format:

🚗 Vehicle
Year Make Model Trim

⭐ CarTruth Score
0-100

✅ Recommendation

💰 Fair Market Value

💵 Seller Price

📈 Price Difference

🔧 Estimated Annual Repairs

⚠️ Common Problems

🔍 Things To Check

👍 Pros

👎 Cons

💬 Final Verdict

Keep it short and easy to read.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({
      text: response.text
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Gemini request failed."
    });

  }

});

app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "index.html"));
});

app.listen(3000, () => {
  console.log("🚗 CarTruth running!");
  console.log("http://localhost:3000");
});
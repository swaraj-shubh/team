// utils/verifyId.js
import axios from "axios";

export const verifyIdCard = async (imageUrl, expectedName) => {
  try {
    // FETCH IMAGE → BASE64
    const img = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const base64 = Buffer.from(img.data).toString("base64");

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const MODEL = "gemini-2.5-flash-image"; // ✔ Available model

    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    // PROMPT → Extract ONLY Name
    const payload = {
      contents: [
        {
          parts: [
            {
              text:
                "Extract ONLY the student's full name from this ID card. " +
                "Return strictly this JSON format: {\"name\": \"...\"}. No explanation."
            },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: base64,
              },
            },
          ],
        },
      ],
    };

    const res = await axios.post(url, payload, {
      headers: { "Content-Type": "application/json" },
    });

    let text = res.data.candidates[0].content.parts[0].text;
    console.log("OCR RAW RESPONSE:", text);
    // REMOVE MARKDOWN
    text = text.replace(/```json|```/g, "").trim();

    let extracted;
    try {
      extracted = JSON.parse(text);
    } catch (e) {
      return { success: false, error: "JSON_PARSE_ERROR", raw: text };
    }

    const extractedName = extracted.name?.toLowerCase() || "";
    const nameMatch = extractedName.includes(expectedName.toLowerCase());

    return {
      success: nameMatch,
      extractedName,
      nameMatch,
    };

  } catch (err) {
    console.error("Gemini OCR ERROR:", err.message);
    return { success: false, error: true };
  }
};

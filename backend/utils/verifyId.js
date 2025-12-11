import vision from "@google-cloud/vision";

export const verifyIdCard = async (imageUrl, expectedName, expectedUsn) => {
  try {
    console.log("🔍 Running Google OCR on:", imageUrl);

    const client = new vision.ImageAnnotatorClient();

    const [result] = await client.textDetection(imageUrl);
    const detections = result.textAnnotations;

    if (!detections || detections.length === 0) {
      return { success: false, error: true, extractedText: "" };
    }

    const extractedText = detections[0].description.toLowerCase();

    const nameMatch = extractedText.includes(expectedName.toLowerCase());
    const usnMatch = extractedText.includes(expectedUsn.toLowerCase());

    return {
      success: nameMatch && usnMatch,
      nameMatch,
      usnMatch,
      extractedText,
    };
  } catch (err) {
    console.error("GOOGLE OCR ERROR:", err.message);
    return { success: false, error: true };
  }
};

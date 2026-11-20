// Sends a prompt to Google's Gemini API and returns the text reply
async function generateText(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-3.5-flash";

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing in .env");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || `Gemini request failed (${response.status})`);
  }

  return data.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || "";
}

module.exports = { generateText };
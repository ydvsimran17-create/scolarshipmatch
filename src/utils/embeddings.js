const { pipeline } = require("@xenova/transformers");

let embedder = null;

// Loads the model once and reuses it (avoids reloading on every call)
async function getEmbedder() {
  if (!embedder) {
    console.log("[embeddings] Loading model (first run downloads ~90MB, please wait)...");
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    console.log("[embeddings] Model ready.");
  }
  return embedder;
}

// Converts text into an embedding (array of numbers)
async function getEmbedding(text) {
  const model = await getEmbedder();
  const output = await model(text, { pooling: "mean", normalize: true });
  return Array.from(output.data);
}

// Compares two embeddings — returns a score between -1 and 1 (higher = more similar)
function cosineSimilarity(vecA, vecB) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

module.exports = { getEmbedding, cosineSimilarity };
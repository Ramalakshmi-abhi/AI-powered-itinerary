const fs = require('fs');
const path = require('path');
const ApiError = require('../utils/ApiError');

/**
 * Extract text from a file using OCR (Tesseract) or PDF parsing
 * @param {string|Buffer} fileInput - Absolute path or Buffer of the file
 * @param {string} mimeType - MIME type of the file
 * @returns {Promise<{text: string, wordCount: number, confidence: number}>}
 */
const extractTextFromFile = async (fileInput, mimeType) => {
  try {
    if (mimeType === 'application/pdf') {
      return await extractFromPdf(fileInput);
    } else if (mimeType.startsWith('image/')) {
      return await extractFromImage(fileInput);
    } else {
      throw new ApiError(400, `Unsupported file type for text extraction: ${mimeType}`);
    }
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, `Text extraction failed: ${error.message}`);
  }
};

/**
 * Extract text from a PDF file using pdf-parse
 * @param {string|Buffer} fileInput
 * @returns {Promise<{text: string, wordCount: number, confidence: number}>}
 */
const extractFromPdf = async (fileInput) => {
  const pdfParse = require('pdf-parse');
  const buffer = Buffer.isBuffer(fileInput) ? fileInput : fs.readFileSync(fileInput);
  let data;
  try {
    data = await pdfParse(buffer);
  } catch (err) {
    console.warn('⚠️ pdf-parse first attempt failed, retrying with a buffer copy:', err.message);
    try {
      const bufferCopy = Buffer.from(buffer);
      data = await pdfParse(bufferCopy);
    } catch (retryErr) {
      throw new Error(`PDF parsing failed: ${retryErr.message}`);
    }
  }
  const text = data.text || '';
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return {
    text: text.trim(),
    wordCount,
    confidence: 100, // PDF parsing is deterministic
  };
};

/**
 * Extract text from an image file using Tesseract.js
 * @param {string|Buffer} fileInput
 * @returns {Promise<{text: string, wordCount: number, confidence: number}>}
 */
const extractFromImage = async (fileInput) => {
  const { createWorker } = require('tesseract.js');
  const worker = await createWorker('eng');
  try {
    const result = await worker.recognize(fileInput);
    const text = result.data.text || '';
    const confidence = result.data.confidence || 0;
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    return {
      text: text.trim(),
      wordCount,
      confidence: Math.round(confidence),
    };
  } finally {
    await worker.terminate();
  }
};

module.exports = { extractTextFromFile };

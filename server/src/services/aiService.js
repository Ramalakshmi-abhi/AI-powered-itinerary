const OpenAI = require('openai');
const ApiError = require('../utils/ApiError');

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || 'dummy-key-for-dev-runs',
  baseURL: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:5173',
    'X-Title': 'AI Travel Planner',
  },
});

const MODEL = process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-001';

/**
 * Parse JSON from AI response, stripping markdown code fences if present
 * @param {string} content
 * @returns {Object}
 */
const parseJsonResponse = (content) => {
  let cleaned = content.trim();
  // Strip markdown code fences
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '');
  return JSON.parse(cleaned);
};

/**
 * Extract structured travel data from raw OCR/parsed text
 * @param {string} rawText - Raw text extracted from travel documents
 * @returns {Promise<Object>} Structured travel data
 */
const extractStructuredData = async (rawText) => {
  try {
    const response = await client.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content:
            'You are a travel document parser. Extract structured travel information from the following text. Return a JSON object with these fields: flights (array), hotels (array), trains (array), buses (array), destination, startDate, endDate. Each flight should have: airline, flightNumber, departureAirport, arrivalAirport, departureTime, arrivalTime, date. Each hotel: hotelName, address, checkIn, checkOut, confirmationNumber. Return ONLY valid JSON, no markdown.',
        },
        {
          role: 'user',
          content: rawText,
        },
      ],
      temperature: 0.1,
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new ApiError(500, 'AI returned empty response during data extraction');
    }

    return parseJsonResponse(content);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    console.error('AI extraction error:', error.message);
    throw new ApiError(500, `Failed to extract structured data: ${error.message}`);
  }
};

/**
 * Generate a detailed day-by-day itinerary from structured booking data
 * @param {Object} structuredData - Parsed travel booking data
 * @param {Object} userPreferences - Optional user preferences
 * @returns {Promise<Object>} Generated itinerary
 */
const generateItinerary = async (structuredData, userPreferences = {}) => {
  try {
    const systemPrompt = `You are an expert travel planner. Generate a detailed day-by-day travel itinerary based on the provided booking information. Return a JSON object with these exact fields:
{
  "title": "Trip title",
  "destination": "Main destination",
  "aiSummary": "Brief trip overview paragraph",
  "itineraryDays": [
    {
      "dayNumber": 1,
      "date": "YYYY-MM-DD",
      "morning": { "activities": ["..."], "notes": "..." },
      "afternoon": { "activities": ["..."], "notes": "..." },
      "evening": { "activities": ["..."], "notes": "..." },
      "transport": "Transport details",
      "meals": { "breakfast": "suggestion", "lunch": "suggestion", "dinner": "suggestion" },
      "estimatedExpense": "$XX-XX",
      "notes": "Additional notes"
    }
  ],
  "recommendations": {
    "restaurants": ["..."],
    "attractions": ["..."],
    "packingTips": ["..."],
    "weatherInfo": "...",
    "emergencyContacts": ["Local emergency: 911"],
    "localTransport": "...",
    "estimatedBudget": "..."
  }
}
Return ONLY valid JSON.`;

    const userContent = JSON.stringify({
      bookingData: structuredData,
      preferences: userPreferences,
    });

    const response = await client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new ApiError(500, 'AI returned empty response during itinerary generation');
    }

    return parseJsonResponse(content);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    console.error('AI itinerary generation error:', error.message);
    throw new ApiError(500, `Failed to generate itinerary: ${error.message}`);
  }
};

/**
 * Chat with the AI about a specific itinerary
 * @param {Object} itinerary - The full itinerary document
 * @param {string} userMessage - User's question or message
 * @returns {Promise<string>} AI text response
 */
const chatWithItinerary = async (itinerary, userMessage) => {
  try {
    const systemPrompt = `You are a helpful travel assistant. The user is asking about their travel itinerary. 
Answer their questions based on the itinerary data provided. Be concise, friendly, and helpful. 
If they ask for recommendations or changes, provide thoughtful suggestions.`;

    const itineraryContext = `Here is the user's itinerary:
Title: ${itinerary.title}
Destination: ${itinerary.destination}
Summary: ${itinerary.aiSummary}
Days: ${JSON.stringify(itinerary.itineraryDays, null, 2)}
Recommendations: ${JSON.stringify(itinerary.recommendations, null, 2)}
Flights: ${JSON.stringify(itinerary.flights, null, 2)}
Hotels: ${JSON.stringify(itinerary.hotels, null, 2)}`;

    const response = await client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: itineraryContext },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.8,
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new ApiError(500, 'AI returned empty response during chat');
    }

    return content;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    console.error('AI chat error:', error.message);
    throw new ApiError(500, `Failed to process chat message: ${error.message}`);
  }
};

module.exports = { extractStructuredData, generateItinerary, chatWithItinerary };

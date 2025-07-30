import dotenv from 'dotenv';

// Load environment variables from .env.local file
dotenv.config({ path: '.env.local' });

/**
 * Configuration object for the Airtable API
 * @typedef {Object} AirtableConfig
 * @property {string} apiKey - The Airtable API key
 * @property {string} baseId - The Airtable base ID
 * @property {string} tableName - The name of the table containing calorie data
 */

/**
 * Response object for calorie data
 * @typedef {Object} CalorieResponse
 * @property {number} caloriesLeftToday - The number of calories remaining for today (negative means over limit)
 */

/**
 * Error response object
 * @typedef {Object} ErrorResponse
 * @property {string} error - Error message
 * @property {string} [details] - Additional error details
 */

/**
 * Validates that all required environment variables are present
 * @returns {AirtableConfig} The validated configuration object
 * @throws {Error} If any required environment variable is missing
 */
function validateEnvironmentVariables() {
  const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_NAME } = process.env;
  
  const missing = [];
  if (!AIRTABLE_API_KEY) missing.push('AIRTABLE_API_KEY');
  if (!AIRTABLE_BASE_ID) missing.push('AIRTABLE_BASE_ID');
  if (!AIRTABLE_TABLE_NAME) missing.push('AIRTABLE_TABLE_NAME');
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  return {
    apiKey: AIRTABLE_API_KEY,
    baseId: AIRTABLE_BASE_ID,
    tableName: AIRTABLE_TABLE_NAME
  };
}

/**
 * Formats a date object to YYYY-MM-DD string format
 * @param {Date} date - The date to format
 * @returns {string} The formatted date string
 */
function formatDateToString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Constructs the Airtable API URL with proper filtering
 * @param {AirtableConfig} config - The Airtable configuration
 * @param {string} dateString - The date string to filter by (YYYY-MM-DD format)
 * @returns {string} The complete Airtable API URL
 */
function buildAirtableUrl(config, dateString) {
  const filter = encodeURIComponent(`IS_SAME({Date}, '${dateString}', 'day')`);
  return `https://api.airtable.com/v0/${config.baseId}/${config.tableName}?filterByFormula=${filter}`;
}

/**
 * Fetches calorie data from Airtable for the specified date
 * @param {AirtableConfig} config - The Airtable configuration
 * @param {string} url - The Airtable API URL
 * @returns {Promise<Object>} The Airtable API response data
 * @throws {Error} If the API request fails
 */
async function fetchCalorieDataFromAirtable(config, url) {
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`Airtable API request failed: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  
  if (!data.records) {
    throw new Error('Invalid response format from Airtable API');
  }
  
  return data;
}

/**
 * Processes the raw calorie data from Airtable
 * @param {Object} airtableData - The raw data from Airtable API
 * @returns {number} The processed calories left for today
 */
function processCalorieData(airtableData) {
  const recordCount = airtableData.records?.length || 0;
  console.log(`Found ${recordCount} record(s) for today`);
  
  if (recordCount === 0) {
    console.log('No calorie data found for today, returning 0');
    return 0;
  }
  
  const caloriesLeftRaw = airtableData.records[0]?.fields?.["Calories left today"];
  
  if (typeof caloriesLeftRaw !== 'number') {
    console.log('Invalid calorie data format, returning 0');
    return 0;
  }
  
  // Convert to positive number (negative means calories consumed over limit)
  return -Math.round(caloriesLeftRaw);
}

/**
 * Main API handler function for the calories endpoint
 * Fetches daily calorie data from Airtable and returns it as JSON
 * 
 * @param {import('http').IncomingMessage} req - The HTTP request object
 * @param {import('http').ServerResponse} res - The HTTP response object
 * @returns {Promise<void>}
 */
export default async function handler(req, res) {
  // Set CORS headers for cross-origin requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Only allow GET requests
  if (req.method !== 'GET') {
    res.status(405).json({ 
      error: 'Method not allowed',
      details: 'This endpoint only supports GET requests'
    });
    return;
  }
  
  try {
    // Validate environment variables
    const config = validateEnvironmentVariables();
    
    // Get today's date
    const today = new Date();
    const todayString = formatDateToString(today);
    console.log(`Fetching calorie data for date: ${todayString}`);
    
    // Build API URL
    const url = buildAirtableUrl(config, todayString);
    console.log(`Airtable API URL: ${url}`);
    
    // Fetch data from Airtable
    const airtableData = await fetchCalorieDataFromAirtable(config, url);
    
    // Process the calorie data
    const caloriesLeftToday = processCalorieData(airtableData);
    
    // Return successful response
    res.status(200).json({ 
      caloriesLeftToday,
      date: todayString,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('API Error:', error.message);
    console.error('Stack trace:', error.stack);
    
    // Determine appropriate error response
    if (error.message.includes('Missing required environment variables')) {
      res.status(500).json({ 
        error: 'Server configuration error',
        details: 'Missing required environment variables'
      });
    } else if (error.message.includes('Airtable API request failed')) {
      res.status(502).json({ 
        error: 'External service error',
        details: 'Failed to fetch data from Airtable'
      });
    } else {
      res.status(500).json({ 
        error: 'Internal server error',
        details: 'An unexpected error occurred while processing your request'
      });
    }
  }
}
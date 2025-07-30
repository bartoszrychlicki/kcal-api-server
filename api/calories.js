import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

/**
 * Airtable API configuration constants
 * @constant {Object}
 */
const AIRTABLE_CONFIG = {
  BASE_URL: 'https://api.airtable.com/v0',
  REQUIRED_ENV_VARS: ['AIRTABLE_API_KEY', 'AIRTABLE_BASE_ID', 'AIRTABLE_TABLE_NAME']
}

/**
 * Validates that all required environment variables are present
 * @throws {Error} If any required environment variable is missing
 * @returns {Object} Object containing validated environment variables
 */
function validateEnvironment() {
  const missingVars = AIRTABLE_CONFIG.REQUIRED_ENV_VARS.filter(
    varName => !process.env[varName]
  )
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`)
  }
  
  return {
    apiKey: process.env.AIRTABLE_API_KEY,
    baseId: process.env.AIRTABLE_BASE_ID,
    tableName: process.env.AIRTABLE_TABLE_NAME
  }
}

/**
 * Formats a date object to YYYY-MM-DD format
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
 */
function formatDateToYYYYMMDD(date) {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  
  return `${year}-${month}-${day}`
}

/**
 * Builds the Airtable API URL with filter for today's date
 * @param {string} baseId - Airtable base ID
 * @param {string} tableName - Airtable table name
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @returns {string} Complete API URL with filter
 */
function buildAirtableUrl(baseId, tableName, dateString) {
  const filter = `filterByFormula=IS_SAME({Date}, '${dateString}', 'day')`
  return `${AIRTABLE_CONFIG.BASE_URL}/${baseId}/${tableName}?${filter}`
}

/**
 * Fetches calorie data from Airtable
 * @param {string} url - Airtable API URL
 * @param {string} apiKey - Airtable API key
 * @returns {Promise<Object>} Airtable response data
 */
async function fetchCaloriesFromAirtable(url, apiKey) {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`
    }
  })
  
  if (!response.ok) {
    throw new Error(`Airtable API error: ${response.status} ${response.statusText}`)
  }
  
  return response.json()
}

/**
 * Extracts and processes calories from Airtable response
 * @param {Object} data - Airtable API response data
 * @returns {number} Processed calories left today value
 */
function extractCaloriesFromData(data) {
  // Check if we have any records for today
  if (!data?.records || data.records.length === 0) {
    console.log('No calorie records found for today')
    return 0
  }
  
  // Extract the "Calories left today" field from the first record
  const caloriesLeftTodayRaw = data.records[0]?.fields?.["Calories left today"] || 0
  
  // Convert to positive integer (negating the value as per original logic)
  return -Math.round(caloriesLeftTodayRaw)
}

/**
 * Main API handler for the calories endpoint
 * 
 * This endpoint fetches today's calorie data from Airtable and returns it as JSON.
 * It's designed to be used by various clients including Apple Watch widgets.
 * 
 * @param {Object} req - Vercel request object
 * @param {Object} res - Vercel response object
 * @returns {Promise<void>}
 * 
 * @example
 * // Response format:
 * // Success: { "caloriesLeftToday": 1500 }
 * // Error: { "error": "Error message", "details": "..." }
 */
export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      error: 'Method not allowed', 
      details: 'Only GET requests are supported' 
    })
  }
  
  try {
    // Validate environment configuration
    const { apiKey, baseId, tableName } = validateEnvironment()
    
    // Get today's date in YYYY-MM-DD format
    const today = formatDateToYYYYMMDD(new Date())
    console.log(`Fetching calories for date: ${today}`)
    
    // Build API URL
    const url = buildAirtableUrl(baseId, tableName, today)
    console.log(`API URL: ${url}`)
    
    // Fetch data from Airtable
    console.log('Fetching data from Airtable...')
    const data = await fetchCaloriesFromAirtable(url, apiKey)
    
    // Log record count for debugging
    console.log(`Records found: ${data.records?.length || 0}`)
    
    // Extract and process calories
    const caloriesLeftToday = extractCaloriesFromData(data)
    
    // Return successful response
    res.status(200).json({ 
      caloriesLeftToday,
      date: today,
      recordsFound: data.records?.length || 0
    })
    
  } catch (error) {
    // Log the full error for debugging
    console.error('Error in calories handler:', error)
    
    // Determine appropriate error response
    if (error.message.includes('Missing required environment variables')) {
      res.status(500).json({ 
        error: 'Configuration error', 
        details: 'Server is not properly configured' 
      })
    } else if (error.message.includes('Airtable API error')) {
      res.status(502).json({ 
        error: 'External service error', 
        details: 'Failed to fetch data from Airtable' 
      })
    } else {
      res.status(500).json({ 
        error: 'Internal server error', 
        details: 'An unexpected error occurred' 
      })
    }
  }
}
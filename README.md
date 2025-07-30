# 🍎 Calories API Server

A lightweight, serverless API built for Vercel that fetches daily calorie data from Airtable and serves it as JSON. Perfect for integrating with Apple Watch widgets, mobile apps, or any health tracking application.

## 📋 Table of Contents

- [Features](#-features)
- [API Reference](#-api-reference)
- [Setup & Installation](#-setup--installation)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Development](#-development)
- [Error Handling](#-error-handling)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

- **Serverless Architecture**: Deployed on Vercel for automatic scaling and global distribution
- **Airtable Integration**: Seamlessly connects to your Airtable base for calorie tracking
- **CORS Enabled**: Ready for cross-origin requests from web applications
- **Comprehensive Error Handling**: Detailed error responses with appropriate HTTP status codes
- **Type Safety**: Full JSDoc documentation for better development experience
- **Environment Validation**: Automatic validation of required configuration variables
- **Timezone Aware**: Properly handles date calculations for accurate daily tracking

## 🚀 API Reference

### GET `/api/calories`

Retrieves the calorie data for the current day.

#### Response Format

**Success Response (200 OK):**
```json
{
  "caloriesLeftToday": 1250,
  "date": "2024-01-15",
  "timestamp": "2024-01-15T14:30:45.123Z"
}
```

**Error Response (4xx/5xx):**
```json
{
  "error": "Error type description",
  "details": "Detailed error message"
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `caloriesLeftToday` | `number` | Calories remaining for today (negative indicates over daily limit) |
| `date` | `string` | Date in YYYY-MM-DD format |
| `timestamp` | `string` | ISO timestamp of when the response was generated |

#### HTTP Status Codes

| Code | Description |
|------|-------------|
| `200` | Success - Calorie data retrieved successfully |
| `405` | Method Not Allowed - Only GET requests are supported |
| `500` | Internal Server Error - Configuration or processing error |
| `502` | Bad Gateway - Airtable API unavailable or returned invalid data |

## 🛠 Setup & Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Airtable account with a base containing calorie data
- Vercel account (for deployment)

### Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/bartoszrychlicki/kcal-api-server.git
   cd kcal-api-server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure environment variables** (see [Environment Variables](#-environment-variables) section)

5. **Start development server:**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000/api/calories`

## 🔧 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Airtable Configuration
AIRTABLE_API_KEY=your_airtable_api_key_here
AIRTABLE_BASE_ID=your_base_id_here
AIRTABLE_TABLE_NAME=your_table_name_here
```

### Getting Airtable Credentials

1. **API Key**: 
   - Go to [Airtable Account Settings](https://airtable.com/account)
   - Navigate to "API" section
   - Generate a personal access token with `data.records:read` scope

2. **Base ID**: 
   - Open your Airtable base
   - Go to "Help" → "API documentation"
   - Find your base ID in the introduction section

3. **Table Name**: 
   - Use the exact name of your table containing calorie data
   - The table should have a "Date" field and "Calories left today" field

### Required Airtable Schema

Your Airtable table should contain at least these fields:

| Field Name | Type | Description |
|------------|------|-------------|
| `Date` | Date | The date for the calorie entry |
| `Calories left today` | Number | Remaining calories (negative if over limit) |

## 🚀 Deployment

### Deploy to Vercel

1. **Using Vercel CLI:**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Using GitHub Integration:**
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy automatically on push to main branch

3. **Environment Variables in Vercel:**
   - Go to your project settings in Vercel dashboard
   - Add the same environment variables from `.env.local`
   - Redeploy to apply changes

### Custom Domain (Optional)

Add a custom domain in your Vercel project settings for a professional API endpoint.

## 💻 Development

### Project Structure

```
kcal-api-server/
├── api/
│   └── calories.js          # Main API endpoint
├── .env.local              # Environment variables (not in git)
├── .gitignore             # Git ignore rules
├── package.json           # Project dependencies and scripts
├── README.md             # This file
└── vercel.json           # Vercel configuration (optional)
```

### Code Architecture

The API is built with a modular approach:

- **Environment Validation**: Ensures all required variables are present
- **Date Handling**: Robust date formatting for consistent queries
- **URL Construction**: Proper encoding of Airtable filter parameters
- **Data Fetching**: HTTP client with error handling
- **Data Processing**: Transformation of raw Airtable data
- **Response Handling**: Consistent JSON responses with proper status codes

### Adding New Features

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes following the existing code style
3. Add JSDoc documentation for new functions
4. Test locally with `npm run dev`
5. Submit pull request

## 🚨 Error Handling

The API provides detailed error responses to help with debugging:

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "Missing required environment variables" | `.env.local` not configured | Add missing environment variables |
| "Airtable API request failed" | Invalid credentials or base ID | Verify Airtable configuration |
| "Invalid response format from Airtable API" | Unexpected API response | Check Airtable table structure |
| "Method not allowed" | Non-GET request | Use GET method only |

### Debugging Tips

1. Check Vercel function logs for detailed error messages
2. Verify Airtable permissions and API key validity
3. Ensure table and field names match exactly
4. Test Airtable API directly using their documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

Please ensure your code follows the existing style and includes proper JSDoc documentation.

## 📄 License

This project is licensed under the ISC License. See the LICENSE file for details.

## 🔗 Links

- [Airtable API Documentation](https://airtable.com/developers/web/api/introduction)
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Repository](https://github.com/bartoszrychlicki/kcal-api-server)

---

Made with ❤️ for health tracking enthusiasts

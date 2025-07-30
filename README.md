# Calories API Server

A simple API endpoint hosted on Vercel that fetches daily calorie data from Airtable and returns it as JSON. Perfect for use with Apple Watch widgets or any client application that needs to track daily calorie information.

## 🚀 Features

- **Simple REST API**: Single GET endpoint for fetching calorie data
- **Airtable Integration**: Seamlessly connects to your Airtable base
- **Date-based Filtering**: Automatically fetches data for the current day
- **Error Handling**: Comprehensive error handling with meaningful error messages
- **Environment Validation**: Validates required configuration before processing requests
- **Vercel Optimized**: Designed for serverless deployment on Vercel

## 📋 Prerequisites

- Node.js 14.x or higher
- An Airtable account with:
  - API key
  - A base containing calorie tracking data
  - A table with `Date` and `Calories left today` fields
- A Vercel account (for deployment)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/bartoszrychlicki/kcal-api-server.git
cd kcal-api-server
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Edit `.env.local` and add your Airtable credentials:
```env
AIRTABLE_API_KEY=your_airtable_api_key
AIRTABLE_BASE_ID=your_base_id
AIRTABLE_TABLE_NAME=your_table_name
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `AIRTABLE_API_KEY` | Your Airtable API key (found in Account settings) | Yes |
| `AIRTABLE_BASE_ID` | Your Airtable base ID (format: appXXXXXXXXXXXXXX) | Yes |
| `AIRTABLE_TABLE_NAME` | Name of the table containing calorie data | Yes |

### Airtable Table Structure

Your Airtable table should have the following fields:
- **Date**: Date field for tracking entries
- **Calories left today**: Number field containing the calorie value

## 🔗 API Documentation

### Endpoint

```
GET /api/calories
```

### Response Format

#### Success Response (200 OK)
```json
{
  "caloriesLeftToday": 1500,
  "date": "2024-01-15",
  "recordsFound": 1
}
```

#### Error Responses

**405 Method Not Allowed**
```json
{
  "error": "Method not allowed",
  "details": "Only GET requests are supported"
}
```

**500 Configuration Error**
```json
{
  "error": "Configuration error",
  "details": "Server is not properly configured"
}
```

**502 External Service Error**
```json
{
  "error": "External service error",
  "details": "Failed to fetch data from Airtable"
}
```

## 🚀 Deployment

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard:
   - Go to your project settings
   - Navigate to Environment Variables
   - Add `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID`, and `AIRTABLE_TABLE_NAME`

### Local Development

Run the development server:
```bash
vercel dev
```

The API will be available at `http://localhost:3000/api/calories`

## 📱 Usage Examples

### JavaScript/TypeScript
```javascript
const response = await fetch('https://your-app.vercel.app/api/calories');
const data = await response.json();
console.log(`Calories left today: ${data.caloriesLeftToday}`);
```

### cURL
```bash
curl https://your-app.vercel.app/api/calories
```

### Apple Watch Widget (Scriptable)
```javascript
const url = "https://your-app.vercel.app/api/calories";
const req = new Request(url);
const res = await req.loadJSON();

const widget = new ListWidget();
widget.addText(`Calories: ${res.caloriesLeftToday}`);
Script.setWidget(widget);
```

## 🧪 Testing

To test the API locally:

1. Start the development server:
```bash
vercel dev
```

2. Make a test request:
```bash
curl http://localhost:3000/api/calories
```

## 📝 Notes

- The API automatically filters for today's date using the server's timezone
- If no records are found for today, the API returns 0 calories
- The original calorie value from Airtable is negated and rounded to the nearest integer
- All dates are handled in YYYY-MM-DD format

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🐛 Issues

If you encounter any issues or have questions, please [open an issue](https://github.com/bartoszrychlicki/kcal-api-server/issues).

## 👨‍💻 Author

Created and maintained by Bartosz Rychlicki

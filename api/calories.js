import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

export default async function handler(req, res) {
    const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_NAME } = process.env
  
    const todayObj = new Date();
    const day = String(todayObj.getDate()).padStart(2, '0');
    const month = String(todayObj.getMonth() + 1).padStart(2, '0');
    const year = todayObj.getFullYear();
    const today = `${year}-${month}-${day}`; // YYYY-MM-DD
    const filter = `filterByFormula=IS_SAME({Date}, '${today}', 'day')`;
    console.log(today);
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}?${filter}`
    console.log(url);
    console.log('start');
    try {
      const airtableRes = await fetch(url, {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`
        }
      })
  
      const data = await airtableRes.json()
      console.log('Liczba rekordów:', data.records?.length)
      const caloriesLeftTodayRaw = data?.records?.[0]?.fields?.["Calories left today"] || 0;
      const caloriesLeftToday = -Math.round(caloriesLeftTodayRaw);

      res.status(200).json({ caloriesLeftToday })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Failed to fetch calories' })
    }
  }
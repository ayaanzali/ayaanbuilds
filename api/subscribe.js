export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  
  if (!process.env.AIRTABLE_TOKEN) {
    console.error('AIRTABLE_TOKEN is not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }
  
  try {
    const response = await fetch('https://api.airtable.com/v0/appcUBjWxqFfID2U4/Table%201', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fields: { email } })
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Airtable API error:', response.status, errorData);
      return res.status(response.status).json({ error: 'Failed to submit to Airtable' });
    }
    
    const data = await response.json();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error submitting to Airtable:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


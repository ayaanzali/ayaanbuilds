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
    // Get base ID and table ID from environment variables, or use defaults
    const baseId = process.env.AIRTABLE_BASE_ID || 'appcUBjWxqFflD2U4';
    const tableId = process.env.AIRTABLE_TABLE_ID || 'Table%201';
    
    const response = await fetch(`https://api.airtable.com/v0/${baseId}/${tableId}`, {
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
      console.error('Base ID:', baseId, 'Table ID:', tableId);
      return res.status(response.status).json({ error: 'Failed to submit to Airtable', details: errorData });
    }
    
    const data = await response.json();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error submitting to Airtable:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { email } = req.body;
  
  await fetch('https://api.airtable.com/v0/appcUBjWxqFfID2U4/Table%201', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.AIRTABLE_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ fields: { email } })
  });
  
  res.status(200).json({ success: true });
}


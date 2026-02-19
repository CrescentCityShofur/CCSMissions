import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { pickup, dropoff, bridgeType, date, time } = req.body;
  const GOOGLE_KEY = process.env.GOOGLE_MAPS_API_KEY;

  try {
    const gURL = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(pickup)}&destinations=${encodeURIComponent(dropoff)}&key=${GOOGLE_KEY}`;
    const gRes = await axios.get(gURL);
    const data = gRes.data.rows[0].elements[0];
    if (data.status !== 'OK') return res.status(400).json({ error: 'Invalid route' });

    const mi = data.distance.value / 1609.34;
    const min = data.duration.value / 60;

    const isAirport = (a) => {
        const addr = a.toLowerCase();
        return addr.includes('msy') || addr.includes('airport') || addr.includes('louis armstrong');
    };

    let subtotal = 0;
    if (isAirport(dropoff)) subtotal = 45;
    else if (isAirport(pickup)) subtotal = 65;
    else if (bridgeType === 'charter') subtotal = 130;
    else if (bridgeType === 'tour' || mi > 30) subtotal = (mi * 1.31) + (min * 1.42);
    else {
      subtotal = 7 + (mi * 1.30) + (min * 0.50);
      if (subtotal < 15) subtotal = 15;
    }

    const hour = parseInt(time.split(':')[0]);
    const nightSurcharge = (hour >= 22 || hour < 5) ? 10 : 0;
    const finalTotal = (subtotal * 1.10) + nightSurcharge;

    res.status(200).json({ price: finalTotal.toFixed(2), mi: mi.toFixed(1) });
  } catch (err) { res.status(500).json({ error: 'Internal Error' }); }
}

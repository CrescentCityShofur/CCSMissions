const axios = require('axios');

export default async function handler(req, res) {
    const { origin, destination, startTime } = req.query;

    const isToMSY = destination.toLowerCase().includes("msy");
    const isFromMSY = origin.toLowerCase().includes("msy");
    let basePrice = 0;

    if (isToMSY || isFromMSY) {
        basePrice = isToMSY ? 45 : 65; // CCS Airport Flat Rates
    } else {
        const googleRes = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${process.env.GOOGLE_MAPS_API_KEY}`);
        const dist = googleRes.data.rows[0].elements[0].distance.value / 1609.34;
        const time = googleRes.data.rows[0].elements[0].duration.value / 60;

        basePrice = 7 + (1.30 * dist) + (0.50 * time);
        if (basePrice < 15) basePrice = 15; // The CCS Floor
    }

    const stewardship = basePrice * 0.10; // 10% Regional Growth Fund
    const nightOps = (parseInt(startTime) >= 22) ? 10 : 0;
    
    res.status(200).json({ total: (basePrice + stewardship + nightOps).toFixed(2) });
}

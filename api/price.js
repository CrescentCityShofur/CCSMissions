const axios = require('axios');

export default async function handler(req, res) {
    const { origin, destination, startTime } = req.query;

    try {
        // Robust MSY detection for both name and code
        const isToMSY = destination.toLowerCase().match(/msy|louis armstrong/);
        const isFromMSY = origin.toLowerCase().match(/msy|louis armstrong/);
        
        let basePrice = 0;

        if (isToMSY || isFromMSY) {
            basePrice = isToMSY ? 45 : 65; 
        } else {
            // Added encoding to prevent crashes on spaces/commas
            const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
            const googleRes = await axios.get(url);
            
            const dist = googleRes.data.rows[0].elements[0].distance.value / 1609.34;
            const time = googleRes.data.rows[0].elements[0].duration.value / 60;

            // Local Bridge: $7 base + $1.30/mi + $0.50/min
            basePrice = 7 + (1.30 * dist) + (0.50 * time);
            if (basePrice < 15) basePrice = 15; // The CCS Floor
        }

        const stewardship = basePrice * 0.10; // 10% Regional Growth Fund
        const nightOps = (parseInt(startTime) >= 22) ? 10 : 0; // Night-Ops
        
        const finalTotal = (basePrice + stewardship + nightOps).toFixed(2);
        res.status(200).json({ total: finalTotal });

    } catch (error) {
        // Prevents the "Black Screen" by sending a fallback error
        res.status(500).json({ error: "Logistics calculation failed" });
    }
}

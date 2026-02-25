import axios from 'axios';

export default async function handler(req, res) {
    // 1. Mandatory Handshake Check
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { pickup, dropoff, bridgeType, time } = req.body;

    try {
        // 2. Identify Airport Missions
        const isToMSY = dropoff.toLowerCase().match(/msy|louis armstrong/);
        const isFromMSY = pickup.toLowerCase().match(/msy|louis armstrong/);
        
        let basePrice = 0;
        let distanceMiles = 0;

        // 3. Logic: Charter vs. Airport vs. Local
        if (bridgeType === 'charter') {
            basePrice = 130.00; 
        } 
        else if (isToMSY || isFromMSY) {
            basePrice = isToMSY ? 45 : 65; 
        } 
        else {
            // Google Distance Matrix Call
            const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(pickup)}&destinations=${encodeURIComponent(dropoff)}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
            const googleRes = await axios.get(url);
            
            distanceMiles = googleRes.data.rows[0].elements[0].distance.value / 1609.34;
            const durationMins = googleRes.data.rows[0].elements[0].duration.value / 60;

            if (distanceMiles > 30 || bridgeType === 'tour') {
                basePrice = (1.31 * distanceMiles) + (1.42 * durationMins);
            } else {
                basePrice = 7 + (1.30 * distanceMiles) + (0.50 * durationMins);
                if (basePrice < 15) basePrice = 15;
            }
        }

        // 4. Night-Ops & Stewardship Growth Fund
        const hour = time ? parseInt(time.split(':')[0]) : 12;
        const nightSurcharge = (hour >= 22 || hour < 5) ? 10 : 0;
        
        const subtotal = basePrice + nightSurcharge;
        const totalWithFund = (subtotal * 1.10).toFixed(2); 

        // 5. Success Response
        res.status(200).json({ price: totalWithFund, mi: distanceMiles.toFixed(1) });

    } catch (error) {
        res.status(500).json({ error: "Logistics calculation failed" });
    }
}

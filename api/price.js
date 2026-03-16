import axios from 'axios';

export default async function handler(req, res) {
    // 1. Mandatory Handshake Check
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { pickup, dropoff, bridgeType, time } = req.body;

    try {
        // 2. Identify Airport Missions (highest priority)
        const isToMSY = dropoff.toLowerCase().match(/msy|louis armstrong/);
        const isFromMSY = pickup.toLowerCase().match(/msy|louis armstrong/);
        const isAirportRun = isToMSY || isFromMSY;

        let basePrice = 0;
        let distanceMiles = 0;

        // Airport flat-rate: $45 total (includes 10% growth fund)
        if (isAirportRun) {
            basePrice = 45.00;
            distanceMiles = 0;  // No calc needed—avoids 0.0 bug
        }
        // Charter override
        else if (bridgeType === 'charter') {
            basePrice = 130.00;
        }
        // Local / Tour — use Google Distance Matrix
        else {
            const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(pickup)}&destinations=${encodeURIComponent(dropoff)}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
            const googleRes = await axios.get(url);
            
            const element = googleRes.data.rows[0].elements[0];
            if (element.status !== 'OK') {
                throw new Error('Google Maps failed');
            }

            distanceMiles = element.distance.value / 1609.34;
            const durationMins = element.duration.value / 60;

            if (distanceMiles > 30 || bridgeType === 'tour') {
                basePrice = (1.31 * distanceMiles) + (1.42 * durationMins);
            } else {
                basePrice = 7 + (1.30 * distanceMiles) + (0.50 * durationMins);
                if (basePrice < 15) basePrice = 15;
            }
        }

        // 3. Night-Ops & Stewardship Growth Fund
        const hour = time ? parseInt(time.split(':')[0]) : 12;
        const nightSurcharge = (hour >= 22 || hour < 5) ? 10 : 0;
        
        const subtotal = basePrice + nightSurcharge;
        const totalWithFund = (subtotal * 1.10).toFixed(2); 

        // 4. Success Response
        res.status(200).json({ 
            price: totalWithFund, 
            mi: distanceMiles.toFixed(1),
            note: isAirportRun ? "Flat airport rate: $45 incl. 10% growth fund" : ""
        });

    } catc

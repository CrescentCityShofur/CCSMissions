import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { pickup, dropoff, bridgeType, time } = req.body;

    try {
        const isToMSY = dropoff.toLowerCase().match(/msy|louis armstrong/);
        const isFromMSY = pickup.toLowerCase().match(/msy|louis armstrong/);
        const isAirportRun = isToMSY || isFromMSY;

        let basePrice = 0;
        let distanceMiles = 0;

        if (isAirportRun) {
            basePrice = 40.91;  // $40.91 base → $45 after 10% growth fund
            distanceMiles = 0;
        } else if (bridgeType === 'charter') {
            basePrice = 130.00;
        } else {
            const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(pickup)}&destinations=${encodeURIComponent(dropoff)}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
            const googleRes = await axios.get(url);
            
            const element = googleRes.data.rows[0].elements[0];
            if (element.status !== 'OK') {
                throw new Error(`Google Maps failed: ${element.status}`);
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

        const hour = time ? parseInt(time.split(':')[0]) : 12;
        const nightSurcharge = (hour >= 22 || hour < 5) ? 10 : 0;
        
        const subtotal = basePrice + nightSurcharge;
        const totalWithFund = (subtotal * 1.10).toFixed(2);

        res.status(200).json({ 
            price: totalWithFund, 
            mi: distanceMiles.toFixed(1),
            note: isAirportRun ? "Flat airport rate: $45 incl. 10% growth fund" : ""
        });

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: "Logistics calculation failed" });
    }
}

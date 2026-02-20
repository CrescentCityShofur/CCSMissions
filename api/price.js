import axios from 'axios';

export default async function handler(req, res) {
    // Only allow the "Fuel the Mission" handshake
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method not allowed" });
    }

    // Capture the stakeholder's logistics data
    const { pickup, dropoff, bridgeType, time } = req.body;

    try {
        const isToMSY = dropoff.toLowerCase().match(/msy|louis armstrong/);
        const isFromMSY = pickup.toLowerCase().match(/msy|louis armstrong/);
        
        let basePrice = 0;
        let distanceMiles = 0;

        // 1. Charter Bridge: $65/hour (2-hr min deposit = $130)
        if (bridgeType === 'charter') {
            basePrice = 130.00; 
        } 
        // 2. Airport Flat Rates: $45 to / $65 from
        else if (isToMSY || isFromMSY) {
            basePrice = isToMSY ? 45 : 65; 
        } 
        // 3. Local vs. Tour Bridge Logistics
        else {
            const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(pickup)}&destinations=${encodeURIComponent(dropoff)}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
            const googleRes = await axios.get(url);
            
            // Convert meters to miles and seconds to minutes
            distanceMiles = googleRes.data.rows[0].elements[0].distance.value / 1609.34;
            const durationMins = googleRes.data.rows[0].elements[0].duration.value / 60;

            // Trigger Tour Bridge if distance > 30 miles
            if (distanceMiles > 30 || bridgeType === 'tour') {
                basePrice = (1.31 * distanceMiles) + (1.42 * durationMins);
            } else {
                // Local Bridge: $7 + $1.30/mi + $0.50/min ($15 floor)
                basePrice = 7 + (1.30 * distanceMiles) + (0.50 * durationMins);
                if (basePrice < 15) basePrice = 15;
            }
        }

        // 4. Global Variables: Night-Ops ($10) & 10% Stewardship
        const hour = time ? parseInt(time.split(':')[0]) : 12;
        const nightSurcharge = (hour >= 22 || hour < 5) ? 10 : 0;
        
        const subtotal = basePrice + nightSurcharge;
        const totalWithFund = (subtotal * 1.10).toFixed(2); // 10% Growth Fund

        res.status(200).json({ price: totalWithFund, mi: distanceMiles.toFixed(1) });

    } catch (error) {
        // Log the failure in Vercel for diagnostics
        res.status(500).json({ error: "Logistics calculation failed" });
    }
}

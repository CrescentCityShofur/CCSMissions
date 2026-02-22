import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { pickup, dropoff, bridgeType, time } = req.body;

    try {
        [span_3](start_span)// MSY Logic: Destination = $45, Pickup = $65[span_3](end_span)
        const isToMSY = dropoff.toLowerCase().match(/msy|louis armstrong/);
        const isFromMSY = pickup.toLowerCase().match(/msy|louis armstrong/);
        
        let basePrice = 0;
        let distanceMiles = 0;

        [span_4](start_span)// 1. Charter Bridge: $65/hour (2-hr min deposit = $130)[span_4](end_span)
        if (bridgeType === 'charter') {
            basePrice = 130.00;
        } 
        // 2. Airport Flat Rates (Only if not a longer Tour Bridge)
        else if ((isToMSY || isFromMSY) && bridgeType !== 'tour') {
            basePrice = isToMSY ? 45 : 65; 
        } 
        // 3. Distance-based Logistics (Local & Tour)
        else {
            const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(pickup)}&destinations=${encodeURIComponent(dropoff)}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
            const googleRes = await axios.get(url);
            
            const element = googleRes.data.rows[0].elements[0];
            distanceMiles = element.distance.value / 1609.34;
            const durationMins = element.duration.value / 60;

            [span_5](start_span)// Trigger Tour Bridge if distance > 30 miles[span_5](end_span)
            if (distanceMiles > 30 || bridgeType === 'tour') {
                basePrice = (1.31 * distanceMiles) + (1.42 * durationMins);
            } else {
                [span_6](start_span)// Local Bridge: $7 base + $1.30/mi + $0.50/min ($15 floor)[span_6](end_span)
                basePrice = 7 + (1.30 * distanceMiles) + (0.50 * durationMins);
                if (basePrice < 15) basePrice = 15;
            }
        }

        [span_7](start_span)// 4. Night-Ops ($10)[span_7](end_span)
        const hour = time ? parseInt(time.split(':')[0]) : 12;
        const nightSurcharge = (hour >= 22 || hour < 5) ? 10 : 0;

        [span_8](start_span)// 5. Regional Growth Fund (10%)[span_8](end_span)
        const subtotal = basePrice + nightSurcharge;
        const totalWithFund = (subtotal * 1.10).toFixed(2);

        res.status(200).json({ 
            price: totalWithFund, 
            mi: distanceMiles.toFixed(1) 
        });

    } catch (error) {
        console.error("Logistics Error:", error);
        res.status(500).json({ error: "Logistics calculation failed" });
    }
}

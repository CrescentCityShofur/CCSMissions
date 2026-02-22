import axios from 'axios';

export default async function handler(req, res) {
    [span_2](start_span)if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });[span_2](end_span)

    [span_3](start_span)const { pickup, dropoff, bridgeType, time } = req.body;[span_3](end_span)

    try {
        [span_4](start_span)// Logic for MSY/Airport: $45 Destination, $65 Pickup[span_4](end_span)
        [span_5](start_span)const isToMSY = dropoff.toLowerCase().match(/msy|louis armstrong/);[span_5](end_span)
        [span_6](start_span)const isFromMSY = pickup.toLowerCase().match(/msy|louis armstrong/);[span_6](end_span)
        
        let basePrice = 0;
        let distanceMiles = 0;

        if (bridgeType === 'charter') {
            basePrice = 130.00; [span_7](start_span)// 2-hr min deposit[span_7](end_span)
        } 
        else if ((isToMSY || isFromMSY) && bridgeType !== 'tour') {
            basePrice = isToMSY ? [span_8](start_span)45 : 65;[span_8](end_span)
        } 
        else {
            [span_9](start_span)const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(pickup)}&destinations=${encodeURIComponent(dropoff)}&key=${process.env.GOOGLE_MAPS_API_KEY}`;[span_9](end_span)
            [span_10](start_span)const googleRes = await axios.get(url);[span_10](end_span)
            
            const element = googleRes.data.rows[0].elements[0];
            [span_11](start_span)distanceMiles = element.distance.value / 1609.34;[span_11](end_span)
            [span_12](start_span)const durationMins = element.duration.value / 60;[span_12](end_span)

            if (distanceMiles > 30 || bridgeType === 'tour') {
                [span_13](start_span)// Tour Bridge: $1.31/mi + $1.42/min[span_13](end_span)
                basePrice = (1.31 * distanceMiles) + (1.42 * durationMins);
            } else {
                [span_14](start_span)// Local Bridge: $7 + $1.30/mi + $0.50/min ($15 floor)[span_14](end_span)
                basePrice = 7 + (1.30 * distanceMiles) + (0.50 * durationMins);
                [span_15](start_span)if (basePrice < 15) basePrice = 15;[span_15](end_span)
            }
        }

        [span_16](start_span)// Night-Ops: $10 after 22:00[span_16](end_span)
        [span_17](start_span)const hour = time ? parseInt(time.split(':')[0]) : 12;[span_17](end_span)
        const nightSurcharge = (hour >= 22 || hour < 5) ? [span_18](start_span)10 : 0;[span_18](end_span)

        [span_19](start_span)// 10% Regional Growth Fund[span_19](end_span)
        [span_20](start_span)const subtotal = basePrice + nightSurcharge;[span_20](end_span)
        [span_21](start_span)const totalWithFund = (subtotal * 1.10).toFixed(2);[span_21](end_span)

        [span_22](start_span)res.status(200).json({ price: totalWithFund, mi: distanceMiles.toFixed(1) });[span_22](end_span)
    } catch (error) {
        [span_23](start_span)res.status(500).json({ error: "Logistics failed" });[span_23](end_span)
    }
}

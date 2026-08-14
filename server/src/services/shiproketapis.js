const axios = require("axios");

exports.getshippingcharg = async (data) => {
    const pickupPincode = process.env.PICKUP_PINCODE;



    const url = "https://apiv2.shiprocket.in/v1/external/courier/serviceability";

    const response = await axios.get(url, {
        params: {
            pickup_postcode: pickupPincode,
            delivery_postcode: data.pincode,
            weight: Number(data.weight),
            cod: Number(data.cod),
            length: Number(data.length),
            breadth: Number(data.breadth),
            height: Number(data.height)
        },
        headers: {
            Authorization: `Bearer ${process.env.SHIPROCKET_TOKEN}`
        }
    });
    return response.data;

}
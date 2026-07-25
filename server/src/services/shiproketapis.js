const axios = require("axios");

exports.getshippingcharg = async (pincode, cod, weight) => {

    const pickupPincode = process.env.PICKUP_PINCODE;

    
    const url = "https://apiv2.shiprocket.in/v1/external/courier/serviceability";

    const response = await axios.get(url, {
        params: {
            pickup_postcode: pickupPincode,
            delivery_postcode: pincode,
            weight: weight,
            cod: cod,
            length: 20,
            breadth: 15,
            height: 2
        },
        headers: {
            Authorization: `Bearer ${process.env.SHIPROCKET_TOKEN}`
        }
    });
    return response.data;

}
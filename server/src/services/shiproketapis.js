const axios = require("axios");
const { data, body } = require("framer-motion/client");

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


exports.CreatOrderINShiproket = async (data) => {
    const url = "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc";

    const response = await axios.post(
        url,
        data,
        {
            headers: {
                Authorization: `Bearer ${process.env.SHIPROCKET_TOKEN}`,
                "Content-Type": "application/json"
            }
        }
    );
    return response.data;
}


exports.AssignCourierAndAWB = async(data)=>{
   const url = "https://apiv2.shiprocket.in/v1/external/courier/assign/awb";

    const response = await axios.post(
        url,
        data,
        {
            headers: {
                Authorization: `Bearer ${process.env.SHIPROCKET_TOKEN}`,
                "Content-Type": "application/json"
            }
        }
    );
    return response.data;
}
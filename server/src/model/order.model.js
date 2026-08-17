const mongoose = require("mongoose");

const orderSchema =  mongoose.Schema(
    {
        orderNumber: {
            type: String,
            unique: true,
            index: true,
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },

        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },

                variantId: {
                    type: mongoose.Schema.Types.ObjectId,
                    default: null,
                },
                name: String,
                size: String,
                color: String,
                quantity: {
                    type: Number,
                    required: true,
                },

                price: {
                    type: Number,
                    required: true,
                },

                total: {
                    type: Number,
                    required: true,
                },
            },
        ],

        shippingAddress: {
            addressline: String,
            landmark: String,
            city: String,
            state: String,
            postalCode: String,
        },

        subtotal: {
            type: Number,
            required: true,
        },

        discount: {
            type: Number,
            default: 0,
        },
        couponId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"coupons",
            default:null
        },

        shippingCharge: {
            type: Number,
            default: 0,
        },

        totalAmount: {
            type: Number,
            required: true,
        },

        payment: {
            method: {
                type: String,
                enum:['cod','online'],
                default: "online",
            },
            status: {
                type: String,
                enum: ["pending", "paid", "failed", "refunded"],
                default: "paid",
            },

            orderId: String,
            paymentId: String,
        },

        status: {
            type: String,
            enum: [
                "pending",
                "accepted",
                "processing",
                "shipped",
                "out_for_delivery",
                "delivered",
                "cancelled",
            ],
            default: "pending",
        },

        shoprocketOrderId: {
            type: String,
            default: null,
        },

        trackingNumber: {
            type: String,
            default: null,
        },

        trackingUrl: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("orders", orderSchema);
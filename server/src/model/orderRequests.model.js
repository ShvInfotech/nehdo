const mongoose = require("mongoose");

const orderRequestsSchema = new mongoose.Schema(
    {
        // Main Order
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "orders",
            required: true,
            index: true,
        },

        // Customer
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },

        // cancel / return / rto
        type: {
            type: String,
            enum: ["cancel", "return", "rto"],
            required: true,
        },

        // Who started this action
        initiatedBy: {
            type: String,
            enum: ["customer", "admin", "courier", "system"],
            required: true,
        },

        // Customer / Courier reason
        reason: {
            type: String,
            default: null,
        },


        // Action process status
        status: {
            type: String,
            enum: [
                "requested",
                "approved",
                "rejected",
                "processing",
                "completed",
            ],
            default: "requested",
        },

        // Refund information
        refund: {
            isRequired: {
                type: Boolean,
                default: false,
            },

            provider: {
                type: String,
                enum: [
                    "razorpay",
                    "upi",
                    "bank_transfer",
                    "manual",
                ],
                default: null,
            },

            // Razorpay original payment ID
            paymentId: {
                type: String,
                default: null,
            },

            // Razorpay refund ID / UPI reference
            refundId: {
                type: String,
                default: null,
            },

            amount: {
                type: Number,
                default: 0,
            },
            status: {
                type: String,
                enum: [
                    "not_required",
                    "pending",
                    "processing",
                    "processed",
                    "failed",
                ],
                default: "not_required",
            },

            refundedAt: {
                type: Date,
                default: null,
            },

            bankDetails: {
                holderName: {
                    type: String,
                    default: null
                },
                accountNumber: {
                    type: String,
                    default: null
                },
                ifscCode: {
                    type: String,
                    default: null
                },
            }
        },


        order: {

            status: {
                type: String,
                enum:[null,"RETURN PENDING"],
                default:null
            },
            shiprocketOrderId: {
                type: String,
                default: null,
            },

            shiprocketShipmentId: {
                type: String,
                default: null,
            },

            trackingNumber: {
                type: String,
                default: null,
            },
            deliveredAt: {
            type: Date,
            default: null,
        },
        },


        completedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("orderRequests", orderRequestsSchema);
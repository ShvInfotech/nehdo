const mongoose = require("mongoose");

const magicCheckoutSchema = new mongoose.Schema(
    {
        orderId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        receipt: {
            type: String,
            default: null,
            index: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            default: null,
        },
        cartIds: {
            type: [mongoose.Schema.Types.ObjectId],
            default: [],
        },
        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products",
                    required: true,
                },
                variantId: {
                    type: mongoose.Schema.Types.ObjectId,
                    default: null,
                },
                sku: {
                    type: String,
                    default: "",
                },
                name: {
                    type: String,
                    default: "",
                },
                size: {
                    type: String,
                    default: "",
                },
                color: {
                    type: String,
                    default: "",
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                price: {
                    type: Number,
                    required: true,
                },
                total: {
                    type: Number,
                    required: true,
                },
                image: {
                    type: String,
                    default: "",
                },
                weight: {
                    type: Number,
                    default: 0.5,
                },
                dimensions: {
                    length: { type: Number, default: 0.5 },
                    width: { type: Number, default: 0.5 },
                    height: { type: Number, default: 0.5 },
                },
                HSCode: {
                    type: String,
                    default: "",
                },
            },
        ],
        subtotal: {
            type: Number,
            required: true,
            default: 0,
        },
        discount: {
            type: Number,
            default: 0,
        },
        couponId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "coupons",
            default: null,
        },
        couponCode: {
            type: String,
            default: null,
        },
        shippingFee: {
            type: Number,
            default: 0, // In Rupees
        },
        codFee: {
            type: Number,
            default: 0, // In Rupees
        },
        totalPayable: {
            type: Number,
            required: true,
            default: 0, // In Rupees
        },
        customer: {
            name: { type: String, default: "" },
            contact: { type: String, default: "" },
            email: { type: String, default: "" },
        },
        address: {
            addressline: { type: String, default: "" },
            landmark: { type: String, default: "" },
            city: { type: String, default: "" },
            state: { type: String, default: "" },
            postalCode: { type: String, default: "" },
            contact: { type: String, default: "" },
            email: { type: String, default: "" },
            name: { type: String, default: "" },
        },
        serviceable: {
            type: Boolean,
            default: false,
        },
        codServiceable: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            enum: ["created", "processing", "completed", "cancelled"],
            default: "created",
        },
        completedOrderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "orders",
            default: null,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// Expire records after 24 hours (86400 seconds)
magicCheckoutSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model("magiccheckouts", magicCheckoutSchema);

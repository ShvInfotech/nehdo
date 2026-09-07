const mongoose = require("mongoose");

const promoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Banner title is required"],
            trim: true,
        },

        description: {
            type: String,
            default: "",
            trim: true,
        },

        status: {
            type: String,
            enum: ["Active", "Inactive", "Scheduled"],
            default: "Active",
        },

        startDate: {
            type: Date,
            default: null,
        },

        endDate: {
            type: Date,
            default: null,
        },


    },
    {
        versionKey: false,
        timestamps: true,
    }
);




module.exports = mongoose.model("promos", promoSchema);

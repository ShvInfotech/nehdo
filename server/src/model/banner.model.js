const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Banner title is required"],
            trim: true,
        },

        subtitle: {
            type: String,
            default: "",
            trim: true,
        },

        desktopImage: {
            type: String,
            required: [true, "Desktop image is required"],
        },

        mobileImage: {
            type: String,
            default: "",
        },


        ctaButtonText: {
            type: String,
            default: "",
            trim: true,
        },

        productSku: {
            type: String,
            default: "",
            trim: true,
        },

        placement: {
            type: String,
            enum: ["Hero Slider", "Promotional Strip"],
            required: true,
            default: "Promotional Strip",
        },

        priority: {
            type: Number,
            default: 0,
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

        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);


// Hero Slider validation
bannerSchema.pre("validate", function () {

    if (this.placement === "Hero Slider") {

        // CTA Hero Slider mate nathi
        this.ctaButtonText = "";

        if (!this.productSku || !this.productSku.trim()) {
            throw new Error(
                "Product SKU is required for Hero Slider"
            );
        }
    }


    if (this.placement === "Promotional Strip") {

        // Product SKU Promotional Strip mate nathi
        this.productSku = "";
    }
});


module.exports = mongoose.model("Banners", bannerSchema);

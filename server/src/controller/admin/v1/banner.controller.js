const { DeleteImage } = require('../../../helper/helper');
const { CustomeError } = require('../../../middleware/globelError');
const bannerModel = require('../../../model/banner.model');

exports.AddBanner = async (req, res, next) => {
    try {
        console.log("BODY:", req.body);
        console.log("FILES:", req.files);

        const {
            title,
            subtitle,
            ctaButtonText,
            productSku,
            placement,
            priority,
            status,
            startDate,
            endDate,
        } = req.body;

        // =========================
        // Validation
        // =========================

        if (!title || !title.trim()) {
            return (next(CustomeError(400, "Banner title is required")))
        }

        if (!placement) {
            return (next(CustomeError(400, "Placement is required")))


        }

        // Desktop image required
        if (
            !req.files?.desktopImage ||
            req.files.desktopImage.length === 0
        ) {
            return (next(CustomeError(400, "Desktop image is required")))


        }

        // Hero Slider mate SKU required
        if (
            placement === "Hero Slider" &&
            (!productSku || !productSku.trim())
        ) {
            return (next(CustomeError(400, "Product SKU is required for Hero Slider")))
        }

        // =========================
        // Get Uploaded Files
        // =========================

        const desktopImageFile =
            req.files?.desktopImage?.[0] || null;

        const mobileImageFile =
            req.files?.mobileImage?.[0] || null;

        // =========================
        // Create Image URLs
        // =========================

        const desktopImageUrl = desktopImageFile
            ? `/uploads/${desktopImageFile.fieldname}/${desktopImageFile.filename}`
            : "";

        const mobileImageUrl = mobileImageFile
            ? `/uploads/${mobileImageFile.fieldname}/${mobileImageFile.filename}`
            : "";

        // =========================
        // Create Banner
        // =========================

        const banner = await bannerModel.create({
            title: title.trim(),

            subtitle: subtitle?.trim() || "",

            desktopImage: desktopImageUrl,

            // Mobile image optional
            mobileImage: mobileImageUrl,

            // Promotional Strip
            ctaButtonText:
                placement === "Promotional Strip"
                    ? ctaButtonText?.trim() || ""
                    : "",

            // Hero Slider
            productSku:
                placement === "Hero Slider"
                    ? productSku?.trim() || ""
                    : "",

            placement,

            priority: Number(priority) || 0,

            status: status || "Active",

            startDate: startDate
                ? new Date(startDate)
                : null,

            endDate: endDate
                ? new Date(endDate)
                : null,
        });

        return res.status(201).json({
            success: true,
            message: "Banner added successfully",
            banner,
        });

    } catch (error) {
        return next(error);
    }
};



exports.GetBanner = async (req, res, next) => {
    try {
        const banners = await bannerModel.find({
            isDeleted: false,
        });

        const baseUrl = `${req.protocol}://${req.get("host")}`;

        const formattedBanners = banners.map((banner) => {
            const bannerObj = banner.toObject();

            return {
                ...bannerObj,

                desktopImage: bannerObj.desktopImage
                    ? `${baseUrl}${bannerObj.desktopImage}`
                    : "",

                mobileImage: bannerObj.mobileImage
                    ? `${baseUrl}${bannerObj.mobileImage}`
                    : "",
            };
        });

        return res.status(200).json({
            success: true,
            message: "get Banners",
            banners: formattedBanners,
        });

    } catch (error) {
        return next(error);
    }
};


exports.UpdateBanner = async (req, res, next) => {
    try {
        const { id } = req.params;

        // ==========================================
        // FIND BANNER
        // ==========================================

        const banner = await bannerModel.findById(id);

        if (!banner) {
            return res.status(404).json({
                success: false,
                message: "Banner not found",
            });
        }


        // ==========================================
        // BODY DATA
        // ==========================================

        const {
            title,
            subtitle,
            ctaButtonText,
            productSku,
            placement,
            priority,
            status,
            startDate,
            endDate,
        } = req.body;


        // ==========================================
        // BASIC VALIDATION
        // ==========================================

        if (!title?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Banner title is required",
            });
        }


        // ==========================================
        // HERO SLIDER VALIDATION
        // ==========================================

        if (
            placement === "Hero Slider" &&
            !productSku?.trim()
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Product SKU is required for Hero Slider",
            });
        }


        // ==========================================
        // DATE VALIDATION
        // ==========================================

        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);

            if (
                Number.isNaN(start.getTime()) ||
                Number.isNaN(end.getTime())
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid start or end date",
                });
            }

            if (end <= start) {
                return res.status(400).json({
                    success: false,
                    message:
                        "End date must be greater than start date",
                });
            }
        }


        // ==========================================
        // UPDATE NORMAL FIELDS
        // ==========================================

        banner.title = title.trim();

        banner.subtitle = subtitle?.trim() || "";

        banner.placement = placement;

        banner.priority = Number(priority || 0);

        banner.status = status;

        banner.startDate = startDate
            ? new Date(startDate)
            : null;

        banner.endDate = endDate
            ? new Date(endDate)
            : null;


        // ==========================================
        // PROMOTIONAL STRIP
        // ==========================================

        if (placement === "Promotional Strip") {
            banner.ctaButtonText =
                ctaButtonText?.trim() || "";

            banner.productSku = "";
        }


        // ==========================================
        // HERO SLIDER
        // ==========================================

        if (placement === "Hero Slider") {
            banner.productSku =
                productSku?.trim() || "";

            banner.ctaButtonText = "";
        }


        // ==========================================
        // DESKTOP IMAGE UPDATE
        // ==========================================

        const desktopFile =
            req.files?.desktopImage?.[0];

        if (desktopFile) {

            // Delete OLD desktop image first
            if (banner.desktopImage) {
                DeleteImage(banner.desktopImage);
            }

            // Save NEW desktop image path
            banner.desktopImage =
                `/uploads/${desktopFile.fieldname}/${desktopFile.filename}`;
        }


        // ==========================================
        // MOBILE IMAGE UPDATE
        // ==========================================

        const mobileFile =
            req.files?.mobileImage?.[0];

        if (mobileFile) {

            // Delete OLD mobile image first
            if (banner.mobileImage) {
                DeleteImage(banner.mobileImage);
            }

            // Save NEW mobile image path
            banner.mobileImage =
                `/uploads/${mobileFile.fieldname}/${mobileFile.filename}`;
        }


        // ==========================================
        // SAVE UPDATED BANNER
        // ==========================================

        const updatedBanner =
            await banner.save();


        // ==========================================
        // SUCCESS RESPONSE
        // ==========================================

        return res.status(200).json({
            success: true,
            message:
                "Banner updated successfully",
            banner: updatedBanner,
        });

    } catch (error) {

        console.error(
            "UPDATE BANNER ERROR:",
            error
        );

        return next(error);
    }
};
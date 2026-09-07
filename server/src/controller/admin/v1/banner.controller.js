const bannerModel = require('../../../model/banner.model');
const promoModel = require('../../../model/promo.model')
const { DeleteImage } = require('../../../helper/helper');
const { CustomeError } = require('../../../middleware/globelError');

exports.AddBanner = async (req, res, next) => {
    try {

        const { title, subtitle, ctaButtonText, productSku, placement, priority, status, startDate, endDate } = req.body || {};


        if (!title || !title.trim()) {
            return (next(CustomeError(400, "Banner title is required")))
        }

        if (!placement) {
            return (next(CustomeError(400, "Placement is required")))
        }

        if (!req.files?.desktopImage || req.files.desktopImage.length === 0) {
            return (next(CustomeError(400, "Desktop image is required")))
        }

        if (placement === "Hero Slider" && (!productSku || !productSku.trim())) {
            return (next(CustomeError(400, "Product SKU is required for Hero Slider")))
        }


        const desktopImageFile = req.files?.desktopImage?.[0] || null;

        const mobileImageFile = req.files?.mobileImage?.[0] || null;


        const desktopImageUrl = desktopImageFile ? `/uploads/${desktopImageFile.fieldname}/${desktopImageFile.filename}` : "";

        const mobileImageUrl = mobileImageFile ? `/uploads/${mobileImageFile.fieldname}/${mobileImageFile.filename}` : "";


        const banner = await bannerModel.create({
            title: title.trim(),
            subtitle: subtitle?.trim() || "",
            desktopImage: desktopImageUrl,
            mobileImage: mobileImageUrl,
            ctaButtonText: placement === "Promotional Strip" ? ctaButtonText?.trim() || "" : "",
            productSku: placement === "Hero Slider" ? productSku?.trim() || "" : "",
            placement,
            priority: Number(priority) || 0,
            status: status || "Active",
            startDate: startDate ? new Date(startDate) : null,
            endDate: endDate ? new Date(endDate) : null,
        });

        return res.status(201).json({ success: true, message: "Banner added successfully", banner });
    } catch (error) {
        return next(error);
    }
};



exports.GetBanner = async (req, res, next) => {
    try {
        const banners = await bannerModel.find({ isDeleted: false });

        const baseUrl = `${req.protocol}://${req.get("host")}`;

        const formattedBanners = banners.map((banner) => {
            const bannerObj = banner.toObject();

            return {
                ...bannerObj,
                desktopImage: bannerObj.desktopImage ? `${baseUrl}${bannerObj.desktopImage}` : "",
                mobileImage: bannerObj.mobileImage ? `${baseUrl}${bannerObj.mobileImage}` : "",
            };
        });

        return res.status(200).json({ success: true, message: "get Banners", banners: formattedBanners });

    } catch (error) {
        return next(error);
    }
};


exports.UpdateBanner = async (req, res, next) => {
    try {
        const { id } = req.params;

        const banner = await bannerModel.findById(id);

        if (!banner) {
            return next(CustomeError(404, "Banner not found"))
        }

        const { title, subtitle, ctaButtonText, productSku, placement, priority, status, startDate, endDate } = req.body;

        if (!title?.trim()) {
            return next(CustomeError(400, "Banner title is required"))
        }

        if (placement === "Hero Slider" && !productSku?.trim()) {
            return next(CustomeError(400, "Product SKU is required for Hero Slider"))
        }



        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);

            if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
                return next(CustomeError(400, "Invalid start or end date"))
            }

            if (end <= start) {
                return next(CustomeError(400, "End date must be greater than start date"))
            }
        }

        banner.title = title.trim();
        banner.subtitle = subtitle?.trim() || "";
        banner.placement = placement;
        banner.priority = Number(priority || 0);
        banner.status = status;
        banner.startDate = startDate ? new Date(startDate) : null;
        banner.endDate = endDate ? new Date(endDate) : null;

        if (placement === "Promotional Strip") {
            banner.ctaButtonText = ctaButtonText?.trim() || "";
            banner.productSku = "";
        }


        if (placement === "Hero Slider") {
            banner.productSku = productSku?.trim() || "";
            banner.ctaButtonText = "";
        }



        const desktopFile = req.files?.desktopImage?.[0];
        if (desktopFile) {
            if (banner.desktopImage) {
                DeleteImage(banner.desktopImage);
            }
            banner.desktopImage = `/uploads/${desktopFile.fieldname}/${desktopFile.filename}`;
        }

        const mobileFile = req.files?.mobileImage?.[0];

        if (mobileFile) {
            if (banner.mobileImage) {
                DeleteImage(banner.mobileImage);
            }

            banner.mobileImage = `/uploads/${mobileFile.fieldname}/${mobileFile.filename}`;
        }



        const updatedBanner = await banner.save();


        return res.status(200).json({ success: true, message: "Banner updated successfully", banner: updatedBanner });

    } catch (error) {

        console.error(
            "UPDATE BANNER ERROR:",
            error
        );

        return next(error);
    }
};



exports.DeleteBanner = async (req, res, next) => {
    try {
        const id = req.params.id

        const banner = await bannerModel.findById(id)


        if (banner.desktopImage) {
            DeleteImage(banner.desktopImage)
        }

        if (banner.mobileImage) {
            DeleteImage(banner.mobileImage)
        }

        await bannerModel.findByIdAndDelete(id)

        return res.status(200).json({ success: true, message: "banner delete successfully" })
    } catch (error) {
        return next(error)
    }
}



exports.AddPromo = async (req, res, next) => {
    try {

        if (!req.body?.title) {
            return next(CustomeError(422, "title is required"))
        }

        if (!req.body?.description) {
            return next(CustomeError(422, "title is description"))
        }

        let promoData = {
            title: req.body?.title,
            description: req.body?.description,
            startDate: req.body?.startDate,
            endDate: req.body?.endDate,
        }

        if (req.body?.startDate) {
            promoData.status = "Scheduled"
        }


        const promo = await promoModel.create(promoData)

        return res.status(200).json({ success: true, message: "promo added successfully", promo })

    } catch (error) {
        return next(error)
    }
}




exports.GetPromo = async (req, res, next) => {
    try {
        const promos = await promoModel.find()

        return res.status(200).json({ success: true, message: "get promo successfully", promos })
    } catch (error) {
        return next(error)
    }
}


exports.UpdatePromo = async (req, res, next) => {
    try {
        const id = req.params.id

        const promo = await promoModel.findByIdAndUpdate(id, { ...req.body })

        return res.status(200).json({ success: true, message: "promo update successfully", promo })
    } catch (error) {
        return next(error)
    }
}


exports.DeletePromo = async (req, res, next) => {
    try {
        const id = req.params.id

        await promoModel.findByIdAndDelete(id)

        return res.status(200).json({ success: true, message: "promo delete successfully" })

    } catch (error) {
        return next(error)
    }
}


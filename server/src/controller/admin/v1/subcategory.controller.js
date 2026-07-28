const mongoose = require('mongoose')
const { CustomeError } = require('../../../middleware/globelError')
const subcategoryModel = require('../../../model/subcategory.model')
const { DeleteImage } = require('../../../helper/helper')

exports.AddSubCategory = async (req, res, next) => {
    try {

        if (!req.body?.name) {
            return next(CustomeError(422, "name is required"))
        }

        if (!req.body?.categoryId) {
            return next(CustomeError(422, "categoryid is required"))
        }

        if (!mongoose.isValidObjectId(req.body.categoryId)) {
            return next(CustomeError(422, "categoryid is invalid"))
        }

        const existsubcategory = await subcategoryModel.findOne({ categoryId: req.body.categoryId, name: req.body.name })
        if (existsubcategory) {
            return next(CustomeError(409, "subcategory already exist"))
        }
        let subcategorylogo = ''
        if (req.file) {
            subcategorylogo = `/uploads/${req.file.fieldname}/${req.file.filename}`
        }
        let subcategory = await subcategoryModel.find()

        subcategory = await subcategoryModel.create({ ...req.body, logo: subcategorylogo, displayOrder: subcategory.length + 1 })
        if (subcategory.logo) {
            subcategory.logo = `http://${process.env.HOST}:${process.env.PORT}${subcategory.logo}`;
        }
        return res.status(200).json({ success: true, message: 'sub-category added successfully', subcategory })


    } catch (error) {
        return next(error)
    }
}


exports.GetSubCategory = async (req, res, next) => {
    try {
        // const subcategories = await subcategoryModel.find().select({ createdAt: 0, updatedAt: 0 })

        const subcategories = await subcategoryModel.aggregate([
    {
        $lookup: {
            from: "categories",
            localField: "categoryId",
            foreignField: "_id",
            as: "category"
        }
    },
    {
        $unwind: "$category"
    },
    {
        $project: {
            createdAt: 0,
            updatedAt: 0,
            "category.createdAt": 0,
            "category.updatedAt": 0
        }
    },
    {
        $addFields: {
            categoryName: "$category.name",
            categoryId: "$category._id",

            logo: {$cond: [{$or: [{ $eq: ["$logo", null] },{ $eq: ["$logo", ""] }]},"",{$concat: [`http://${process.env.HOST}:${process.env.PORT}`,"$logo"]}]}
        }
    },
    {
        $project: {
            category: 0
        }
    }
]);
        return res.status(200).json({ success: true, message: 'sub-categories get successfully', subcategories })
    } catch (error) {
        return next(error)
    }
}


exports.UpdateSubcategory = async (req, res, next) => {
    try {
        const id = req.params.id
        if (!mongoose.isValidObjectId(id)) {
            return next(CustomeError(422, 'category id invalid'))
        }

        let subcategory = await subcategoryModel.findById(id)
        if (!subcategory) {
            return next(CustomeError(404, 'subcategory not found'))
        }


        if (req.body.name !== subcategory.name || req.body?.categoryId !== subcategory.categoryId.toString()) {

            const existsubcategory = await subcategoryModel.findOne({ categoryId: req.body.categoryId, name: req.body.name })
            if (existsubcategory) {
                return next(CustomeError(409, "subcategory already exist"))
            }
        }

        let subcategorylogo = subcategory.logo
        if (req.file) {
            if (subcategorylogo !== '') {
                DeleteImage(subcategorylogo)
            }

            subcategorylogo = `/uploads/${req.file.fieldname}/${req.file.filename}`
        }
        if (req.body?.displayOrder) {
            await subcategoryModel.findOneAndUpdate({ displayOrder: req.body.displayOrder }, { displayOrder: subcategory.displayOrder }, { returnDocument: 'after' })
        }
        subcategory = await subcategoryModel.findByIdAndUpdate(id, { ...req.body, logo: subcategorylogo }, { returnDocument: 'after' }).select({ createdAt: 0, updatedAt: 0 })
        if (subcategory.logo) {
            subcategory.logo = `http://${process.env.HOST}:${process.env.PORT}${subcategory.logo}`;
        }
        return res.status(200).json({ success: true, message: 'sub-category update successfully', subcategory })

    } catch (error) {
        return next(error)
    }
}
const mongoose = require('mongoose')
const { CustomeError } = require('../../../middleware/globelError')
const categoryModel = require('../../../model/category.model')
const { DeleteImage } = require('../../../helper/helper')

exports.AddCategory = async (req, res, next) => {
    try {

        if (!req.body?.name) {
            return next(CustomeError(422, "name is required"))
        }

        console.log(req.file)
        let categorylogo = ''
        if (req.file) {
            categorylogo = `/uploads/${req.file.fieldname}/${req.file.filename}`
        }
        let category = await categoryModel.find()

        category = await categoryModel.create({ ...req.body, logo: categorylogo, displayOrder: category.length + 1 })

        return res.status(200).json({ success: true, message: 'category added successfully', category })


    } catch (error) {
        return next(error)
    }
}


exports.GetCategory = async (req, res, next) => {
    try {
        const categories = await categoryModel.find().select({ createdAt: 0, updatedAt: 0 })

        return res.status(200).json({ success: true, message: 'categories get successfully', categories })
    } catch (error) {
        return next(error)
    }
}


exports.Updatecategory = async (req, res, next) => {
    try {
        const id = req.params.id
        if (!mongoose.isValidObjectId(id)) {
            return next(CustomeError(422, 'category id invalid'))
        }

        let category = await categoryModel.findById(id)
        if (!category) {
            return next(CustomeError(404, 'category not found'))
        }

        let categorylogo = category.logo
        if (req.file) {
            if (categorylogo !== '') {
                DeleteImage(categorylogo)
            }

            categorylogo = `/uploads/${req.file.fieldname}/${req.file.filename}`
        }
        if (req.body?.displayOrder) {
            await categoryModel.findOneAndUpdate({ displayOrder: req.body.displayOrder }, { displayOrder: category.displayOrder }, { returnDocument: 'after' })
        }
        category = await categoryModel.findByIdAndUpdate(id, { ...req.body, logo: categorylogo }, { returnDocument: 'after' }).select({ createdAt: 0, updatedAt: 0 })
        return res.status(200).json({ success: true, message: 'category update successfully', category })

    } catch (error) {
        return next(error)
    }
}
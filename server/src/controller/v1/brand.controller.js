const mongoose = require('mongoose')
const { CustomeError } = require('../../middleware/globelError')
const brandModel = require('../../model/brand.model')
const { DeleteImage } = require('../../helper/helper')

exports.AddBrand = async (req, res, next) => {
    try {
       

        if (!req.body?.name) {
            return next(CustomeError(422, "name is required"))
        }

        let brandlogo = ''
        if (req.file) {
            brandlogo = `/uploads/${req.file.fieldname}/${req.file.filename}`
        }

        const brand = await brandModel.create({ ...req.body, logo: brandlogo })

        return res.status(200).json({ success: true, message: 'brand added successfully', brand })
    } catch (error) {
        return next(error)
    }
}


exports.GetBrand = async (req, res, next) => {
    try {
        const brand = await brandModel.find().select({ createdAt: 0, updatedAt: 0 })
        return res.status(200).json({ success: true, message: 'brand get successfully', brand })
    } catch (error) {
        return next(error)
    }
}

exports.UpdateBrand = async (req, res, next) => {
    try {
        const id = req.params.id
        if (!mongoose.isValidObjectId(id)) {
            return next(CustomeError(422, 'brand id invalid'))
        }
        let brand = await brandModel.findById(id)
        if (!brand) {
            return next(CustomeError(404, 'brand not found'))
        }
        let brandlogo = brand.logo
        if (req.file) {
            if (brandlogo !== '') {
                DeleteImage(brandlogo)
            }

            brandlogo = `/uploads/${req.file.fieldname}/${req.file.filename}`
        }

        brand = await brandModel.findByIdAndUpdate(id, { ...req.body, logo: brandlogo }, { returnDocument: 'after' }).select({ createdAt: 0, updatedAt: 0 })
        return res.status(200).json({ success: true, message: 'brand update successfully', brand })

    } catch (error) {
        return next(error)
    }
}

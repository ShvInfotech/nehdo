const crypto = require("crypto");
const path = require('path')
const fs = require('fs')


exports.DeleteImage = (filepath) => {
    try {
        const deletepath = path.join(__dirname, "..", filepath)
        if (fs.existsSync(deletepath)) {
            fs.unlinkSync(deletepath)
        }
    } catch (error) {
        console.log("image delete error:", error)
    }

}

exports.generateSKU = () => {
    return `SKU-${crypto.randomUUID().replace(/-/g, "").substring(0, 10).toUpperCase()}`;
}

exports.generateBarcode = () => {
    return Date.now().toString() + Math.floor(Math.random() * 1000);
}

exports.generateSlug = (productName) => {
    return (
        productName
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "") +
        "-" +
        Date.now()
    );
};




exports.razorpay_signature = (razorpay_order_id, razorpay_payment_id) => {
    return crypto.createHmac("sha256", process.env.RAZORPAY_API_SECRET).update(razorpay_order_id + "|" + razorpay_payment_id).digest("hex");
}



// coupon function

const checkUserCouponEligibility = (coupon) => {
    let userEligibility = false
    if (coupon.couponUser == "AllUser") {
        userEligibility = true
        return userEligibility
    }
    if (coupon.couponUser == "FirstOrder") {
        userEligibility = false
        return userEligibility
    }

    if (coupon.couponUser == "specificCustomer") {
        userEligibility = false
        return userEligibility
    }


}

const checkProductCouponEligibility = (coupon, carts) => {
    let productEligibility = false

    if (coupon.apply == "allProduct") {
        // const productsku = product.sku
        const productSkus = carts.map(cart => cart.product.sku);
        const couponskus = coupon.excludeSku

        let matchProduct = productSkus.filter(sku =>
            !couponskus.includes(sku)
        );
        return matchProduct
    }

    if (coupon.apply == "specificProduct") {
        const productsku = carts.map(cart => cart.product.sku)
        const couponskus = coupon.productSku 

        let matchProduct = productsku.filter(sku =>
            couponskus.includes(sku)
        );
        return matchProduct
    }

    // if(coupon.apply =="specificCategory"){
    //        // add categoryIds filtaring
    //          sku array
    // }

}

const matchProduct = (sku, carts) => {
    console.log(sku)
    const matchproducts = carts.filter((cart) => {
        return sku.includes(cart.product.sku)
    })

    return matchproducts
}

const GetVariants = (products) => {
    const variants = []
    products.forEach((product) => {
        product.variant.variant.forEach((v) => {
            if (v.name === `${product.color}/${product.size}`) {
                variants.push(v)
            }
        })
    })

    return variants
}
const checkPurchaseCouponEligibility = (minimumprice, productprice) => {
    let purchaseEligibility = false
    if (minimumprice >= productprice) {
        return purchaseEligibility
    } else {
        purchaseEligibility = true
        return purchaseEligibility
    }
}


exports.PercentageCoupenapplay =  (coupon, carts) => {

    const userEligibility = checkUserCouponEligibility(coupon)
    if (!userEligibility) {
        return { success: false, message: "coupon not apply this user" }
    }


    const matchsku = checkProductCouponEligibility(coupon, carts)

    if (!matchsku.length) {
        return { success: false, message: "coupon not apply this product" }
    }

    const mproducts = matchProduct(matchsku, carts)
    if (!mproducts.length) {
        return { success: false, message: "coupon not apply this products" }
    }


    const variants = GetVariants(mproducts)


    if (!variants.length) {
        return { success: false, message: "varinat not found" }
    }

    const totalPrice = variants.reduce((total, variant) => {
        return total + (variant.price || 0);
    }, 0);


    const purchaseEligibility = checkPurchaseCouponEligibility(coupon.minimumPurchase, totalPrice)
    if (!purchaseEligibility) {
        return { success: false, message: `minimum purches Rs:${coupon.minimumPurchase}` }

    }

    const discount = Math.round((totalPrice * coupon.discountValue) / 100);
    if (discount > coupon.maximumDiscount) {
        return { success: true, message: "total discount", discount: coupon.maximumDiscount }

    }
    return { success: true, message: "total discount", discount,couponId:coupon._id }
}


exports.CartDiscountCoupenapplay = (coupon,carts) =>{
const userEligibility = checkUserCouponEligibility(coupon)
    if (!userEligibility) {
        return { success: false, message: "coupon not apply this user" }
    }


    const matchsku = checkProductCouponEligibility(coupon, carts)

    if (!matchsku.length) {
        return { success: false, message: "coupon not apply this product" }
    }

    const mproducts = matchProduct(matchsku, carts)
    if (!mproducts.length) {
        return { success: false, message: "coupon not apply this products" }
    }


    const variants = GetVariants(mproducts)


    if (!variants.length) {
        return { success: false, message: "varinat not found" }
    }

    const totalPrice = variants.reduce((total, variant) => {
        return total + (variant.price || 0);
    }, 0);


    const purchaseEligibility = checkPurchaseCouponEligibility(coupon.minimumPurchase, totalPrice)
    if (!purchaseEligibility) {
        return { success: false, message: `minimum purches Rs:${coupon.minimumPurchase}` }

    }

    const discount =  coupon.discountValue
   
    return { success: true, message: "total discount", discount,couponId:coupon._id }
}











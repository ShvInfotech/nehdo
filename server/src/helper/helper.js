const { randomUUID } = require("crypto");
const path = require('path')
const fs = require('fs')


exports.DeleteImage = (filepath)=>{
    try {
        const deletepath = path.join(__dirname,"..",filepath)
       if(fs.existsSync(deletepath)){
        fs.unlinkSync(deletepath)
       }
    } catch (error) {
        console.log("image delete error:",error)
    }
     
}




exports.generateSKU = () => {
    return `SKU-${randomUUID().replace(/-/g, "").substring(0, 10).toUpperCase()}`;
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




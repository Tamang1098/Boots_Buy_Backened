const Brand = require('../../models/Brand');

// Create a new category
exports.createBrand = async (req, res) => {
    try {
        const filename = req.file?.path
        console.log(req.body)
        const brand = new Brand({ brandname: req.body.brandname, filepath: filename });
        await brand.save();
        return res.status(201).json({
            success: true,
            message: "Created",
            data: brand
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

exports.getAllBrands = async (req, res) => {
    try {
        const brands = await Brand.find();
        return res.json({ success: true, data: brands, message: "All brand" });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Get single category by ID
exports.getBrandById = async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id);
        if (!brand) return res.status(404).json({ success: false, message: 'Brand not found' });
        return res.json({ success: true, data: brand, message: "One brand" });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Update a category
exports.updateBrand = async (req, res) => {
    try {
        const brand = await Brand.findByIdAndUpdate(
            req.params.id,
            { name: req.body.name },
            { new: true }
        );
        if (!category) return res.status(404).json({ success: false, message: 'Brand not found' });
        return res.json({ success: true, data: brand, message: "Updated" });
    } catch (err) {
        return res.status(500).json({ error: "Server Error" });
    }
};

// Delete a category
exports.deleteBrand = async (req, res) => {
    try {
        const result = await Brand.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ success: false, message: 'Brand not found' });
        return res.json({ success: true, message: 'Brand deleted' });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};
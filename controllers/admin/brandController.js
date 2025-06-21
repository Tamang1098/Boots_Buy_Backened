const Brand = require('../../models/Brand');

exports.createBrand = async (req, res) => {
  try {
    const filename = req.file?.path.replace(/\\/g, '/'); // Replace backslashes for Windows paths
    const brand = new Brand({ brandname: req.body.brandname, filepath: filename });
    await brand.save();
    res.status(201).json({
      success: true,
      message: 'Brand created',
      data: brand
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find();
    res.json({ success: true, data: brands, message: 'All brands' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) return res.status(404).json({ success: false, message: 'Brand not found' });
    res.json({ success: true, data: brand, message: 'One brand' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.updateBrand = async (req, res) => {
  try {
    const updateData = { brandname: req.body.brandname };
    if (req.file) {
      updateData.filepath = req.file.path.replace(/\\/g, '/');
    }

    const brand = await Brand.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!brand) return res.status(404).json({ success: false, message: 'Brand not found' });

    res.json({ success: true, data: brand, message: 'Brand updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.deleteBrand = async (req, res) => {
  try {
    const result = await Brand.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ success: false, message: 'Brand not found' });
    res.json({ success: true, message: 'Brand deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

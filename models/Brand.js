const mongoose = require("mongoose")

const BrandSchema = new mongoose.Schema({
  brandname: { type: String, required: true, unique: true },
  filepath: { type: String }
});

module.exports = mongoose.model('Brand', BrandSchema);
const mongoose =require('mongoose');

const medicineSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    category: {
        type: String,
    },
    barcode: {
        type: String,
    },
    location: {
        type: [Object],
        required: true,
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },

})
var medicineData=mongoose.model('medicine',medicineSchema);
module.exports= medicineData;

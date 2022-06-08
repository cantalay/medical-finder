const mongoose =require('mongoose');

const medicineCategorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    categoryType: {
        type: String,
        required: true,
        index: true,
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },

})
var medicineData=mongoose.model('category',medicineCategorySchema);
module.exports= medicineData;

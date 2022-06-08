const mongoose =require('mongoose');

const drugsSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true,
    },
    barcode: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },

})
var sampleData=mongoose.model('sample-drug',drugsSchema);
module.exports= sampleData;

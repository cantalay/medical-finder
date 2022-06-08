const mongoose = require('mongoose');
const MedicineCategory = require('../model/medicineCategory');

const mongoBackupService = require('../service/mongoBackupService')
const SampleDrugModel = require('../model/drugs');

async function generateSampleDrugDB() {

    let count = SampleDrugModel.count({}, function (err, count) {
        console.log(count)
        if (count < 20000) {

            mongoBackupService.restoreLocalfile2Mongo().then(function (response) {
                console.log(response)
                console.log("BACKUP SERVICE SUCCESSFULLY FINISHED")
            }).catch(function (err) {
                console.log(err)
                console.log("BACKUP SERVICE NOT COMPLETED")
            })
        } else {
            console.log("SAMPLE DRUG SERVICE ALREADY INITIALIZED")
        }
    })
}

module.exports.generateSampleDrugDB = generateSampleDrugDB();

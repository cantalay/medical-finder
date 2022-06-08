const express = require('express');
const mongoose = require('mongoose');
// const schelduler = require('node-cron');
// const mongoBackupService = require('./service/mongoBackupService')

const cors = require('cors');

const app = express();
app.use(cors({
    origin: 'http://localhost:3000'
}));
const port = 9000;
// const url = "mongodb://localhost:27017/medic-collection";
const url = "mongodb://medicdb:27017/medic-collection";

mongoose.connect(url).then(function () {
    console.log("CONNECTION SUCCESS");
    const sampleDrugsDB = require('./service/mongoSampleDrugService')
    sampleDrugsDB.generateSampleDrugDB.catch(error => console.log(error));
}).catch(error => console.log(error));
const con = mongoose.connection;
app.use(express.json());
try {
    con.on('open', () => {
        console.log('DB connection successfully started');
    })
} catch (error) {
    console.log("Error: " + error);
}

const medicineRouter = require("./router/medicineRouter");
app.use('/medic', medicineRouter)

app.listen(port, () => {
    console.log('Medicine-finder Application Successfully Started.');
})



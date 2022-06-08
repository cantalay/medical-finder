
const mongoBackup = require('mongodb-snapshot')
const fileSystem = require('fs');
const {parse} = require("nodemon/lib/cli");
const MedicineModel = require('../model/medicine.js');

// async function dumpMongo2Localfile() {
//
//     const mongo_connector = new mongoBackup.MongoDBDuplexConnector({
//         connection: {
//             uri: 'mongodb://localhost:27017',
//             dbname: 'medic-collection',
//         },
//     });
//     // let fileList = fileSystem.readdirSync('./backups/')
//     // if (fileList.length >= 5){
//     //     fileList.sort((a, b) => parseInt(a.split('.')[0]) - parseInt(b.split('.')[0]));
//     //     fileSystem.unlinkSync('./backups/'+fileList[0])
//     // }
//     const localfile_connector = new mongoBackup.LocalFileSystemDuplexConnector({
//         connection: {
//             path: './backups/'+Date.now()+'.tar',
//         },
//
//     });
//
//     const transferer = new mongoBackup.MongoTransferer({
//         source: mongo_connector,
//         targets: [localfile_connector],
//     });
//
//     for await (const { total, write } of transferer) {
//         console.log(`remaining bytes to write: ${total - write}`);
//     }
// }


async function restoreLocalfile2Mongo() {
    let fileList = fileSystem.readdirSync('./backups/')
    let path = ''
    if (fileList.length >0){
        // await MedicineModel.collection.drop();
        fileList.sort((a, b) => parseInt(b.split('.')[0]) - parseInt(a.split('.')[0]));
        path = './backups/1635593121670.tar'
        const mongo_connector = new mongoBackup.MongoDBDuplexConnector({
            connection: {
                uri: `mongodb://medicdb:27017`,
                dbname: 'medic-collection',
            },
        });

        const localfile_connector = new mongoBackup.LocalFileSystemDuplexConnector({
            connection: {
                path: path,
            },
        });

        const transferer = new mongoBackup.MongoTransferer({
            source: localfile_connector,
            targets: [mongo_connector],
        });

        for await (const { total, write } of transferer) {
            console.log(`remaining bytes to write: ${total - write}`);
        }
    }
}

// module.exports.dumpMongo2Localfile = dumpMongo2Localfile;
module.exports.restoreLocalfile2Mongo = restoreLocalfile2Mongo;
const express = require('express');
const mongoose = require('mongoose');


const MedicineModel = require('../model/medicine.js');
const SampleDrugModel = require('../model/drugs');
const MedicineCategory = require('../model/medicineCategory');

const router = express.Router();

const getAllMedicine = async (req, res) => {
    let perPage = parseInt(req.body.perPage)
    const page = parseInt(req.body.page) - 1
    const searchText = req.body.searchText
    const locationName = req.body.locationName
    const locationCode = req.body.locationCode
    if (perPage === -1){
        perPage = null
    }
    let query = {}

    if (searchText.length > 0){
        query["name"] = {"$regex": searchText, "$options": "i"}
    }
    if (locationName != null){
        query['location.locationName'] = locationName
    }
    if (locationCode != null){
        query['location.locationNo'] = {"$regex": locationCode, "$options": "i"}
    }

    try {
        let medicineCount = null
        let medicineData = null

            medicineCount = await MedicineModel.count(query)
            medicineData = await MedicineModel.find(query).limit(perPage).skip(perPage*page).sort({name:'asc'});

        // if (searchText === 'undefined'){
        //     medicineCount = await MedicineModel.count()
        //     medicineData = await MedicineModel.find().limit(perPage).skip(perPage*page).sort({name:'asc'});
        // }else{
        //     medicineCount = await MedicineModel.count({name: {"$regex": searchText, "$options": "i"}, "location.locationName":{$in: ["Sepetler", "Depo Rafı"]}})
        //     medicineData = await MedicineModel.find({name: {"$regex": searchText, "$options": "i"}, "location.locationName":{$in: ["Sepetler", "Depo Rafı"]} }).limit(perPage).skip(perPage*page).sort({name:'asc'});
        // }
        if (medicineData.length !== 0) {
            res.status(200).json({medicList: medicineData, count: medicineCount});
        } else {
            res.status(204).json({status: 'Uygun İlaç Bulunamadı.'})
        }

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const getMedicine = async (req, res) => {
    const barcode = req.params.barcode;

    try {
        const medic = await MedicineModel.findOne({barcode: barcode});
        if (medic != null) {
            res.status(200).json(medic);
        } else {
            res.status(404).json({'status': 'Medicine not found.'})
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const getMedicineWithID = async (req, res) => {
    const id = req.params.id;

    try {
        const medic = await MedicineModel.findOne({_id: id});
        if (medic != null) {
            res.status(200).json(medic);
        } else {
            res.status(404).json({'status': 'Medicine not found.'})
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const createMedicine = async (req, res) => {
    let barcode = 0;
    let category = ""
    console.log(req.body.barcode)
    if (req.body.barcode !== "") {
        barcode = req.body.barcode
    } else {
        barcode = "Barkod bilgisi yok"
    }
    if (req.body.category !== ""){
        category = req.body.category
    }else {
        category = 'Kategori bilgisi yok'
    }
    const newMedic = new MedicineModel({
        name: req.body.name,
        category: category,
        barcode: barcode,
        location: req.body.location

    })
    try {
        let isExistMedic = await MedicineModel.findOne({name: req.body.name})
        if (isExistMedic != null){
            res.status(409).json({status: "Bu ilaç daha önce kayıt edilmiş. Farklı bir isim giriniz."});
        }
        await newMedic.save().then(function (){
            console.log("MEDIC CREATED")
        });

        res.status(201).json(newMedic);

    } catch (error) {
        res.status(409).json({status: "İlaç oluşturulurken hata oluştu, lütfen tekrar deneyiniz."});
    }

}

const updateMedicine = async (req, res) => {
    const id = req.params.id;
    let barcode = ""
    let category = ""
    if (req.body.barcode !== "") {
        barcode = req.body.barcode
    } else {
        barcode = "Barkod bilgisi yok"
    }
    if (req.body.category !== ""){
        category = req.body.category
    }else {
        category = 'Kategori bilgisi yok'
    }
    try {
        const updateMedic = await MedicineModel.findOneAndUpdate({
                _id: id,
            },
            {
                name: req.body.name,
                category: category,
                location: req.body.location,
                barcode: barcode,
            }
        )
        res.status(202).json({name: req.body.name});

    } catch (error) {
        res.status(401).json({message: error.message});
    }

}

const deleteMedicine = async (req, res) => {
    const id = req.params.id;

    try {
        MedicineModel.findByIdAndRemove(id, function (err, docs) {
            if (err) {
                res.status(409).json({status: "İlaç silinemedi, lütfen tekrar deneyiniz."});
            } else {
                if (docs != null) {
                    res.status(203).json({status: docs.barcode + " Medicine successfully removed."});
                } else {
                    res.status(409).json({status: "İlaç silinemedi, lütfen tekrar deneyiniz."});
                }
            }
        })


    } catch (error) {
        res.status(402).json({message: error.message});
    }
}

const deleteDrugs = async (req, res) => {
    const idList = req.body.idList

    try {
        MedicineModel.deleteMany({_id: idList}, function (err, docs) {
            if (err) {
                res.status(400).json({status: "İlaç silme işlemi gerçekleştirilemedi. Tekrar deneyiniz."});
            } else {
                if (docs != null) {
                    if (docs.deletedCount === 0)
                        res.status(409).json({status: "İlaç bilgileri eksik veya yanlış. Silme işlemi gerçekleştirilemedi."});
                    else
                        res.status(203).json({status: docs.deletedCount + " İlaç başarıyla silindi."});
                } else {
                    res.status(409).json({status: "İlaç zaten silinmiş. Tekrar deneyiniz."});
                }
            }
        })


    } catch (error) {
        res.status(402).json({message: error.message});
    }
}
const searchMedicine = async (req, res) => {
    const searchText = req.params.searchText

    try {
        const searchedMedic = await MedicineModel.find({name: {"$regex": searchText, "$options": "i"}})
        if (searchedMedic.length === 0) {
            res.status(204).json({status: "Kayıtlı ilaç bulunamadı. Kaydetmek için 'Yeni Ekle' butonunu kullanınız."});
        } else {
            res.status(200).json({medic: searchedMedic});
        }
    } catch (error) {
        res.status(402).json({message: error.message});
    }
}

const searchDrugs = async (req, res) => {
    const searchText = req.params.searchText
    try {
        const searchedMedic = await SampleDrugModel.find({name: {"$regex": searchText, "$options": "i"}}).limit(30)
        if (searchedMedic.length === 0) {
            res.status(204).json({status: "Kayıtlı örnek ilaç bulunamadı."});
        } else {
            res.status(200).json({medic: searchedMedic});
        }
    } catch (error) {
        res.status(402).json({message: error.message});
    }
}

const getCategories = async (req, res) => {
    const categoryType = req.params.categoryType
    try {
        const categories = await MedicineCategory.find({categoryType: categoryType})
        if (categories.length === 0) {
            res.status(204).json({status: "Kayıtlı kategori bulunamadı. Kaydetmek için ekle butonuna basınız."});
        } else {
            res.status(200).json({categories: categories});
        }
    } catch (error) {
        res.status(402).json({message: error.message});
    }
}

const createCategory = async (req, res) => {
    const categoryType = req.body.categoryType
    const categoryName = req.body.categoryName
    try {
        const category = await MedicineCategory.find({name: categoryName, categoryType: categoryType})
        if (category.length == 0) {
            const newCategory = new MedicineCategory({
                name: categoryName,
                categoryType: categoryType
            })
            try {
                await newCategory.save();

                res.status(201).json(newCategory);

            } catch (error) {
                res.status(409).json({status: "Yüklenirken sorun oluştu, Tekrar Deneyiniz"});
            }
        } else {
            res.status(409).json({status: "Kategori eklenemedi, Sistemde benzer bir kayıt mevcut."});
        }
    } catch (error) {
        res.status(402).json({message: error.message});
    }
}
const searchGroup = async (req, res) => {
    const searchText = req.params.searchText
    try {
        const searchedMedic = await MedicineCategory.find({name: {"$regex": searchText, "$options": "i"}, categoryType: "group"}).limit(50)
        if (searchedMedic.length === 0) {
            res.status(204).json({status: "No category found."});
        } else {
            res.status(200).json({categories: searchedMedic});
        }
    } catch (error) {
        res.status(402).json({message: error.message});
    }
}
const searchLocation = async (req, res) => {
    let searchText = req.body.searchText
    if (searchText != null){
        try {
            const searchedMedic = await MedicineCategory.find({name: {"$regex": searchText, "$options": "i"}, categoryType: "location"}).limit(50)
            if (searchedMedic.length === 0) {
                res.status(204).json({status: "No location found."});
            } else {
                res.status(200).json({locations: searchedMedic});
            }
        } catch (error) {
            res.status(402).json({message: error.message});
        }
    }else {
        res.status(204).json({status: "No location found."});
    }

}

const deleteCategory = async (req, res) => {
    const id = req.params.categoryID
    try {
        let test = await MedicineCategory.find({_id: id})
        MedicineCategory.deleteOne({_id: id}, function (err, docs) {
            if (err) {
                res.status(400).json({status: "Document delete operation failed."});
            } else {
                if (docs != null) {
                    if (docs.deletedCount === 0)
                        res.status(409).json({status: "İlaç bilgileri eksik veya yanlış. Silme işlemi gerçekleştirilemedi."});
                    else
                        res.status(203).json({status: true});
                } else {
                    res.status(400).json({status: "Medicine not found or already deleted."});
                }
            }
        })


    } catch (error) {
        res.status(402).json({message: error.message});
    }
}


module.exports.getAllMedicine = getAllMedicine;
module.exports.createMedicine = createMedicine;
module.exports.getMedicine = getMedicine;
module.exports.updateMedicine = updateMedicine;
module.exports.getMedicineWithID = getMedicineWithID;
module.exports.deleteMedicine = deleteMedicine;
module.exports.searchMedicine = searchMedicine;
module.exports.searchDrugs = searchDrugs;
module.exports.deleteDrugs = deleteDrugs;
module.exports.getCategories = getCategories;
module.exports.createCategory = createCategory;
module.exports.searchGroup = searchGroup;
module.exports.searchLocation = searchLocation;
module.exports.deleteCategory = deleteCategory;
const express = require("express");
const  medicineController = require("../controller/medicineController");

const router = express.Router();

router.post('/getMedics', medicineController.getAllMedicine);
router.get('/:barcode', medicineController.getMedicine);
router.get('/id/:id', medicineController.getMedicineWithID);
router.post('/createMedic', medicineController.createMedicine);
router.put('/:id', medicineController.updateMedicine);
router.delete('/:id', medicineController.deleteMedicine);
router.get('/search/:searchText?', medicineController.searchMedicine);
router.get('/sample/:searchText?', medicineController.searchDrugs);
router.post('/deleteDrugs/', medicineController.deleteDrugs);
router.get('/getCategories/:categoryType', medicineController.getCategories);
router.post('/createCategory', medicineController.createCategory);
router.get('/searchGroup/:searchText?', medicineController.searchGroup);
router.post('/searchLocation', medicineController.searchLocation);
router.delete('/deleteCategory/:categoryID', medicineController.deleteCategory);

module.exports=router;
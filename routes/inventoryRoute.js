// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/classification-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by detail view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

router.get("/", utilities.checkUserRole, utilities.handleErrors(invController.buildByManagementId));

router.get("/addclassification", utilities.checkUserRole, utilities.handleErrors(invController.buildByAddClassification));

router.get("/addinventory", utilities.checkUserRole, utilities.handleErrors(invController.buildByAddInventory));

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

router.get("/edit/:inventory_id", utilities.checkUserRole, utilities.handleErrors(invController.editInventoryView))

router.get("/delete/:inventory_id", utilities.checkUserRole, utilities.handleErrors(invController.buildByDelete))

router.post(
    "/addclassification", utilities.checkUserRole, 
    regValidate.classificationRules(),
    regValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
);

router.post(
    "/addinventory", utilities.checkUserRole, 
    regValidate.inventoryRules(),
    regValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
)

router.post("/update/", utilities.checkUserRole, 
regValidate.inventoryRules(),
    regValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory))

router.post("/delete/", utilities.checkUserRole, 
utilities.handleErrors(invController.deleteInventory))


module.exports = router;
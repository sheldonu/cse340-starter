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

router.get("/", utilities.handleErrors(invController.buildByManagementId));

router.get("/addclassification", utilities.handleErrors(invController.buildByAddClassification));

router.post(
    "/addclassification", regValidate.classificationRules(),
    regValidate.checkClassificationData,
    (req, res) => {
        res.status(200).send('classification check progress')
    }
)

module.exports = router;
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const invModel = require("../models/inventory-model")

validate.classificationRules = () => {
    return [
        body("classification_name")
            .matches(/^[A-Za-z0-9_]+$/)
            .custom(async (classification_name) => {
                const classificationExists = await invModel.checkExistingClassification(classification_name)
                if (classificationExists){
                  throw new Error("Email exists. Please log in or use different email")
                }
              })
            .withMessage('Classification name must contain only alphanumeric characters and underscores.'),
    ]
}

validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("./inventory/addclassification", {
        errors,
        title: "Add New Classification",
        nav,
        classification_name,
      })
      return
    }
    next()
  }

module.exports = validate
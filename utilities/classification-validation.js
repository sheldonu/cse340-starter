const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

validate.classificationRules = () => {
  return [
    // name is required and must be string
    body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .isAlpha()
      .withMessage("Provide a correct classification name."),
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

  validate.inventoryRules = () => {
    return [
      body("inv_make")
        .trim()
        .isLength({ min: 1 })
        .isAlpha()
        .withMessage("Provide correct make of vehicle."),
  
      body("inv_model")
        .trim()
        .isLength({ min: 1 })
        .isAlpha()
        .withMessage("Provide correct model of vehicle."),
  
      body("inv_year")
        .trim()
        .isLength({ min: 4, max: 4 })
        .isNumeric()
        .withMessage("Provide 4 digits for the year value."),
  
      body("inv_description")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Description is required."),
  
      body("inv_image")
        .trim()
        .isLength({
          min: 6,
        })
        .matches(/\.(jpg|jpeg|png|webp)$/)
        .withMessage("A vehicle image path is required and must be an image."),
  
      body("inv_thumbnail")
        .trim()
        .isLength({
          min: 6,
        })
        .matches(/\.(jpg|jpeg|png|webp)$/)
        .withMessage("A vehicle thumbnail path is required and must be an image."),
  
      body("inv_price")
        .trim()
        .matches(/^\d+(\.\d{1,2})?$/)
        .withMessage("Price must be a valid decimal or integer value.")
        .isFloat({ min: 0 })
        .withMessage("Price must be a positive number."),
  
      body("inv_miles")
        .trim()
        .isInt({ min: 0 })
        .withMessage("Miles must be a non-negative integer.")
        .matches(/^\d+$/)
        .withMessage("Miles must contain only digits."),
  
      body("inv_color")
        .trim()
        .isLength({ min: 1 })
        .isAlpha()
        .withMessage("Color is required.")
    ];
  };

validate.checkInventoryData = async (req, res, next) => {
    const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      let list = await utilities.buildClassificationList();
      res.render("./inventory/addinventory", {
        errors,
        title: "Add New Vehicle",
        nav,
        list,
        classification_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
      })
      return
    }
    next()
}

module.exports = validate
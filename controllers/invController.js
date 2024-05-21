const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory item detail view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inventory_id = req.params.inventoryId
  const data = await invModel.getDataByInventoryId(inventory_id)
  console.log(data);
  const grid = await utilities.buildInventoryGrid(data)
  let nav = await utilities.getNav()
  const carYear = data[0].inv_year
  const carMake = data[0].inv_make
  const carModel = data[0].inv_model
  res.render("./inventory/vehicle", {
    title: carYear + " " + carMake + " " + carModel,
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.buildByManagementId = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Build add-classification view
 * ************************** */
invCont.buildByAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  req.flash("notice", "This is a flash message.")
  res.render("./inventory/addclassification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}

invCont.addClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body
  const insertResult = await invModel.addClassification(classification_name)

  if (insertResult) {
    nav = await utilities.getNav()
    req.flash("notice", `The ${insertResult.classification_name} classification was successfully added.`)
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    })
  }
}

module.exports = invCont
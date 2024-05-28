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
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    classificationSelect,
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
    res.status(501).render("inventory/addclassification", {
      title: "Add New Classification",
      nav,
      errors: null,
    })
  }
}

invCont.buildByAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let list = await utilities.buildClassificationList()
  req.flash("notice", "This is a flash message.")
  res.render("./inventory/addinventory", {
    title: "Add New Vehicle",
    nav,
    list,
    errors: null,
  })
}

invCont.addInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
    const insertResult = await invModel.addInventory(
      classification_id, 
      inv_make, 
      inv_model, 
      inv_year, 
      inv_description, 
      inv_image, inv_thumbnail, 
      inv_price, 
      inv_miles, 
      inv_color
    )

    if (insertResult) {
      nav = await utilities.getNav()
      req.flash("notice", `The Inventory was successfully added.`)
      res.status(201).render("inventory/management", {
        title: "Vehicle Management",
        nav,
        errors: null,
      })
    } else {
      req.flash("notice", "Sorry, the insert failed.")
      let list = await utilities.buildClassificationList()
      res.status(501).render("inventory/addinventory", {
        title: "Add New Vehicle",
        nav,
        list,
        errors: null,
      })
    }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 * Build the Edit Inventory View
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {

  const inv_id = parseInt(req.params.inventory_id)

  let nav = await utilities.getNav()

  const itemData = await invModel.getDataByInventoryId(inv_id)

  const classificationSelect = await utilities.buildClassificationList(itemData[0].classification_id)

  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`

  res.render("./inventory/editinventory", {

    title: "Edit " + itemName,

    nav,

    classificationSelect: classificationSelect,

    errors: null,

    inv_id: itemData[0].inv_id,

    inv_make: itemData[0].inv_make,

    inv_model: itemData[0].inv_model,

    inv_year: itemData[0].inv_year,

    inv_description: itemData[0].inv_description,

    inv_image: itemData[0].inv_image,

    inv_thumbnail: itemData[0].inv_thumbnail,

    inv_price: itemData[0].inv_price,

    inv_miles: itemData[0].inv_miles,

    inv_color: itemData[0].inv_color,

  })

}

invCont.addInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
    const insertResult = await invModel.addInventory(
      classification_id, 
      inv_make, 
      inv_model, 
      inv_year, 
      inv_description, 
      inv_image, inv_thumbnail, 
      inv_price, 
      inv_miles, 
      inv_color
    )

    if (insertResult) {
      nav = await utilities.getNav()
      req.flash("notice", `The Inventory was successfully added.`)
      res.status(201).render("inventory/management", {
        title: "Vehicle Management",
        nav,
        errors: null,
      })
    } else {
      req.flash("notice", "Sorry, the insert failed.")
      let list = await utilities.buildClassificationList()
      res.status(501).render("inventory/addinventory", {
        title: "Add New Vehicle",
        nav,
        list,
        errors: null,
      })
    }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/editinventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

module.exports = invCont
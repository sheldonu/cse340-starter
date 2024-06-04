const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')

router.get("/login", utilities.handleErrors(accountController.buildLogin))

router.get("/register", utilities.handleErrors(accountController.buildRegister))

router.get("/update/:accountId", utilities.checkUserRole, utilities.handleErrors(accountController.updateAccountView));

router.post("/update", regValidate.accountUpdateRules(), regValidate.checkAccountUpdateData, utilities.handleErrors(accountController.updateAccount));

router.post('/update-password', regValidate.passwordUpdateRules(), regValidate.checkPasswordUpdateData, utilities.handleErrors(accountController.updatePassword));

router.get("/feedback", utilities.handleErrors(accountController.renderFeedbackForm));

router.post("/feedback", utilities.handleErrors(accountController.addFeedback));

router.get("/view-feedback/:account_id", utilities.handleErrors(accountController.viewFeedback));

router.get("/logout", (req, res) => {
  res.clearCookie("jwt")
  req.flash("notice", "You have successfully logged out.")
  res.redirect("/account/login")
})


router.post("/register", regValidate.registationRules(),
regValidate.checkRegData,
utilities.handleErrors(accountController.registerAccount))

// Process the login attempt
router.post(
    "/login", 
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
  )

router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement))

module.exports = router
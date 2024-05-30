const utilities = require("../utilities/")


async function triggerError(req, res, next) {
    let nav = await utilities.getNav()
    const title = 'Server Error';
    
    res.status(500).render('errors/error', {
      title,
      nav
    });
  };

module.exports = { triggerError }
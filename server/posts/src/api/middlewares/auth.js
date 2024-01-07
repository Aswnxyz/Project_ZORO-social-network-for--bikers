const {ValidateSignature} = require("../../utils")
module.exports = async (req, res, next) => {
  try {
    const isAuthorised = await ValidateSignature(req);
    if (isAuthorised) {
      return next();
    }
    res.json({ message: "not authorised to access resources" });
  } catch (error) {
    console.log(error);
  }
};

const { ValidateSignature } = require("../../utils");
const { AuthorizeError } = require("../../utils/errors/app-errors");

module.exports = async (req, res, next) => {
  try {
    const isAuthorised = await ValidateSignature(req);
    if (isAuthorised) {
      return next();
    }
    throw new AuthorizeError("not authorised to access resources") ;
  } catch (error) {
    next(error);
  }
};

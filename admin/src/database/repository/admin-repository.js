const {AdminModel}= require("../models")


class AdminRepository {
  async findAdmin( email) {
    const existingAdmin = await AdminModel.findOne({ email});
    return existingAdmin;
  }
}

module.exports = AdminRepository
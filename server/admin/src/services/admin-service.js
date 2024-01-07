const { NotFoundError } = require("../../../users/src/utils/errors/app-errors");
const { AdminRepository } = require("../database");
const { ValidatePassword, GenerateSignature } = require("../utils");
const { RPCRequest } = require("../utils");
const { ValidationError } = require("../utils/errors/app-errors");

class AdminService {
  constructor() {
    this.repositiory = new AdminRepository();
  }
  async signIn(res, adminInputs) {
    const { email, password } = adminInputs;
    const admin = await this.repositiory.findAdmin(email);
    

    if (!admin)
      throw new NotFoundError("admin not found with provided email id!");

    const validPassword = await ValidatePassword(
      password,
      admin.password,
      "$2b$10$hJwZdKD6hyiliHAMLhatS."
    );
    if (!validPassword) throw new ValidationError("password does not match!");
    const token = await GenerateSignature(res, {
      email: admin.email,
      _id: admin._id,
    });

    return { id: admin._id, token };
  }

  async getUsers() {
    // Perform RPC call
    const usersResponse = await RPCRequest("USERS_RPC", {
      type: "GET_USERS",
    });

    if (usersResponse) {
      return usersResponse;
    }
    return {};
  }

  async handleBlock(_id, type) {
    //Perform RPC call
    const usersResponse = await RPCRequest("USERS_RPC", {
      type: "HANDLE_BLOCK",
      data: { _id, type },
    });
    if (usersResponse) {
      return usersResponse;
    }
  }

  async getPosts({ currentPage, postsPerPage }) {
    //Perform RPC call
    const postsResponse = await RPCRequest("POSTS_RPC", {
      type: "GET_POSTS",
      data:{page:currentPage,perPage:postsPerPage}
    });

    if (postsResponse) {
      return postsResponse;
    }
    return {};
  }

  async handlePostBlock({postId}){
    const postsResponse = await RPCRequest("POSTS_RPC",{
      type:"HANDLE_BLOCK",
      data:{postId}
    });
    if(postsResponse){
      return postsResponse
    }
  }
}

module.exports = AdminService;

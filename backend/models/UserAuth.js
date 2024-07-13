const client = require("../config/db");
const BaseModel = require("./BaseModel");

class UserAuth extends BaseModel {
  index = "user-auth";
  constructor() {
    super();
  }

  async findByUserId(userId) {
    return await this.list({
      query: {
        match: { userId },
      },
    });
  }

  async findByEmailClientAndUserId(emailClient, userId) {
    return await this.single({
      query: {
        bool: {
          must: [{ match: { emailClient } }, { match: { userId } }],
        },
      },
    });
  }
}

module.exports = UserAuth;

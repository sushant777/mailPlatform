const client = require("../config/db");
const BaseModel = require("./BaseModel");

class UserEmail extends BaseModel {
  index = "user-email";
  constructor() {
    super();
  }

  async findByUserId(userId) {
    return await this.list({
      query: {
        match: { userId },
      },
      sort: [{ on: { order: "desc" } }],
    });
  }

  async findByMailId(mailId) {
    return await this.single({
      query: {
        match: { mailId },
      },
    });
  }

  async findByMailIdAndUserId(mailId, userId) {
    return await this.single({
      query: {
        bool: {
          must: [{ match: { mailId } }, { match: { userId } }],
        },
      },
    });
  }
}

module.exports = UserEmail;

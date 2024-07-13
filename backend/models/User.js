const bcrypt = require("bcryptjs");
const client = require("../config/db");
const BaseModel = require("./BaseModel");

class User extends BaseModel {
  index = "users";
  constructor() {
    super();
  }

  async save(input) {
    if (input.hasOwnProperty("password")) {
      input.password = await bcrypt.hash(input.password, 10);
    }

    let data = await client.index({
      index: this.index,
      body: {
        username: input.username,
        password: input.password,
      },
    });

    if (data) {
      return data.body._id;
    } else {
      return false;
    }
  }

  async findByUsername(username) {
    return await this.single({
      query: {
        match: { username },
      },
    });
  }
}

module.exports = User;

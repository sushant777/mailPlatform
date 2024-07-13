require("dotenv").config();
const User = require("../models/User");
const UserAuth = require("../models/UserAuth");
const OutlookService = require("../service/OutlookService");

exports.profile = async (req, res) => {
  const user = await new User().findByUsername(res.username);
  user.auths = await new UserAuth().findByUserId(user.id);

  for (let i = 0; i < user.auths.length; i++) {
    const auth = user.auths[i];
    if (auth.emailClient == "outlook") {
      try {
        auth.userInfo = await new OutlookService(auth).getUserDetails();
      } catch (error) {
        throw error;
      }
    }
  }

  return res.json(user);
};

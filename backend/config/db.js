require("dotenv").config();

const { Client } = require("@elastic/elasticsearch");

const client = new Client({
  node: process.env.ELASTICSEARCH_NODE, // Use the environment variable
});

ensureIndexExists = async (index) => {
  const indexExists = await client.indices.exists({ index });
  if (!indexExists.body) {
    await client.indices.create({ index });
    console.log(`Index ${index} created.`);
  } else {
    console.log(`Index ${index} already exists.`);
  }
};

ensureIndexExists("users");
ensureIndexExists("user-auth");
ensureIndexExists("user-email");

module.exports = client;

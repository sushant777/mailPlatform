const client = require("../config/db");

class BaseModel {
  constructor() {}

  async delete(id) {
    return await client.delete({
      index: this.index,
      id: id,
    });
  }

  async update(docId, data) {
    return await client.update({
      index: this.index,
      id: docId,
      body: {
        doc: data,
      },
    });
  }

  async save(input) {
    let data = await client.index({
      index: this.index,
      body: input,
    });
    if (data) {
      return data.body._id;
    } else {
      return false;
    }
  }

  async list(
    inputBody = {
      query: {
        match_all: {},
      },
    }
  ) {
    const { body } = await client.search({
      index: this.index,
      body: inputBody,
    });

    return body.hits.hits.map((hit) => {
      return {
        ...hit._source,
        _id: hit._id,
        id: hit._id,
      };
    });
  }

  async single(
    inputBody = {
      query: {
        match_all: {},
      },
    }
  ) {
    const { body } = await client.search({
      index: this.index,
      body: inputBody,
    });

    if (body.hits.hits[0]?._source) {
      return {
        ...body.hits.hits[0]?._source,
        id: body.hits.hits[0]._id,
      };
    } else {
      return false;
    }
  }
}

module.exports = BaseModel;

const db = require("../../data/dbConfig");

//get icin getAll
function getAll() {
  return db("users");
}

function getById(user_id) {
  return db("users").where("id", user_id).first();
}

function getBy(filter) {
  return db("users").where(filter).first();
}

async function create(user) {
  const insertedUser = await db("users").insert(user);
  return getById(insertedUser[0]);
}

module.exports = {
  getAll,
  create,
  getBy,
};
//post icin create

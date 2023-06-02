const db = require("../../data/dbConfig");

//get icin getAll
function getAll() {
  return db("users");
}

function getById(user_id) {
  return db("users").where("id", user_id).first();
}

async function create(user) {
  const insertedUser = await db("users").insert(user);
  return getById(insertedUser[0]);
}

module.exports = {
  getAll,
  create,
};
//post icin create

const neo4j = require("neo4j-driver");
const USER = "Application";
const PASSWORD = "app123";
const URI = "neo4j://localhost";
const DB = "neo4j";
const driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));

// const neo4j = window.neo4j;
// const neo4jUri = process.env.NEO4J_URI;
// const neo4jVersion = process.env.NEO4J_VERSION;
// let database = process.env.NEO4J_DATABASE;

const getMemory = (id) => {
  const session = driver.session({ database: DB });
  return session
    .run("MATCH(m:Memory) WHERE ID(m)=$searchId return m LIMIT 1", {
      searchId: parseInt(id),
    })
    .then((result) => {
      return result.records && result.records.length > 0
        ? result.records[0].get(0).properties
        : null;
    })
    .finally(() => session.close());
};

/**
  title - string
  date - dd/mm/yyyy
  people - array [People]
*/
//TODO - Create new relationship for each person added
const createMemory = (title, date, people) => {
  const session = driver.session({ database: DB });
  return session
    .run("CREATE (m:Memory {title:$title, date:$date}) return m", {
      title: title,
      date: date,
    })
    .finally(() => session.close());
};

/**
  Submit new object
  title - string
  date - dd/mm/yyyy
  people - array [People]
*/
//TODO - Create new relationship for each person added
const editMemory = (id, memory, people) => {
  const session = driver.session({ database: DB });
  return session
    .run("MATCH (m:Memory) SET m={$memory} WHEN ID(m)=$id) return m", {
      id: id,
      memory: memory,
    })
    .finally(() => session.close());
};

/**
 *    * @public
 * @param {Object} param
 * @param {string} param.defaultAccessMode=WRITE - The access mode of this session, allowed values are {@link READ} and {@link WRITE}.
 * @param {string|string[]} param.bookmarks - The initial reference or references to some previous transactions. Value is optional and
 * absence indicates that the bookmarks do not exist or are unknown.
 * @param {string} param.database - The database this session will operate on.
 * @returns {RxSession} new reactive session.
 *
 */
const deleteMemory = (id) => {
  const session = driver.session({ database: DB });
  return session
    .run("MATCH (m:Memory) WHERE ID(m)=$id LIMIT 1 DETACH DELETE m", {
      id: id,
    })
    .finally(() => session.close());
};

/**
  List all Memories
*/
const listAllMemories = () => {
  //Set cache header
  const session = driver.session({ database: DB });
  return session
    .run("MATCH (m:Memory) return m")
    .then((result) => {
      return result.records.map((record) => {
        return Object.assign(record.get(0).properties, {
          id: record.get(0).identity.low,
        });
      });
    })
    .finally(() => session.close());
};

module.exports = {
  getMemory,
  createMemory,
  listAllMemories,
  editMemory,
  deleteMemory,
};

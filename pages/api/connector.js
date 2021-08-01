const neo4j = require("neo4j-driver");
const USER = "Application";
const PASSWORD = "app123";
const URI = "neo4j://localhost";
const DB = "neo4j";
const driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));

//TODO create constraints on types in db, ERROR THAT DB IS NOT SET

// const neo4j = window.neo4j;
// const neo4jUri = process.env.NEO4J_URI;
// const neo4jVersion = process.env.NEO4J_VERSION;
// let database = process.env.NEO4J_DATABASE;

/**Closes driver connection. Cleanup task */
exports.forceConnectionClose = () => {
  console.log("Closing DB Driver");
  driver.close();
};

/**
 * Get memory item from graph database.
 * Get Memory item using unique id.
 * @public
 * @param {Integer} id - The Id of the memory to retrieve/
 * @returns {Promise} A promise of the
 */
exports.getMemory = (id) => {
  const session = driver.session({ database: DB });
  return session
    .run("MATCH(m:Memory) WHERE ID(m)=$searchId return m LIMIT 1", {
      searchId: neo4j.int(id),
    })
    .then((result) => {
      return result.records[0] && result.records[0].length > 0
        ? result.records[0].get(0).properties
        : null;
    })
    .finally(() => session.close());
};

/**
 * Create memory item in graph database.
 * Memory is created by storing title and date. Person that share the memeory are created if not existing and linked.
 *
 * @public
 * @param {string} title - The title of the memory to be recorded.
 * @param {DateTime} date - The date of the memory to be recorded.
 * @param {Array} people - A group of people who which this memory is shared.
 * @returns {Promise} A promise of get operation.
 */
exports.createMemory = (title, date, people) => {
  const session = driver.session({ database: DB });
  return session
    .run(
      "CREATE (m:Memory{title:$title,date:$date}) WITH m UNWIND $people AS people MERGE(p:Person{name:people}) MERGE((m)-[:SHARED]-(p)) return count(*)",
      { people: people, title: title, date: date }
    )
    .then((result) => {
      console.log(`Created ${result.records[0].length} nodes+relationships`);
      return result.records[0].length > 0;
    })
    .catch((error) => {
      console.error(error);
      throw error;
    })
    .finally(() => session.close());
};

/**
 * Edit memory item in graph database.
 * Memory is edit by replacing entire object with memory. Delete link with people will be manual. Ability to add otherwise.
 *
 * @public
 * @param {neo4j.Integer} id - The id of the memory to create.
 * @param {JSON} memory - The json of the memory item. Trust the FE on the model.
 * @param {Array} people - A group of people who which this memory is shared with.
 * @returns {Promise} A promise to edit memory.
 */
exports.editMemory = (id, memory, people) => {
  //todo fetch all in list -> do union and remove all not in the intersection. create all that do not exist.
  //WARNING - this will not do a diff

  const session = driver.session({ database: DB });
  //TODO make sure payload contains id outside of memory json.
  return session
    .run(
      "MATCH(m:Memory) WHERE ID(m)=$id SET m=$memory WITH m UNWIND $people AS people MERGE(p:Person{name:people}) WITH p MERGE(m)-[:SHARED]->(p) return count(*)",
      {
        id: neo4j.int(id),
        memory: memory,
        people: people,
      }
    )
    .then((result) => {
      console.log(`Edited ${result.records[0].length} nodes+relationships`);
    })
    .catch((error) => {
      console.error(error);
      throw error;
    })
    .finally(() => session.close());
};
/**
 * Deletes memory from db.
 * @public
 * @param {neo4j.Integer} id - The id of the memory to delete.
 * @returns {Promise} A promise to delete memory.
 */
exports.deleteMemory = (id) => {
  const session = driver.session({ database: DB });
  return session
    .run("MATCH (m:Memory) WHERE ID(m)=$id WITH m LIMIT 1 DETACH DELETE m", {
      id: neo4j.int(id),
    })
    .then(() => {
      console.log(`Memory with id ${id} deleted`);
    })
    .catch((error) => {
      throw new Error(`Failed to delete memory with id ${id}.`);
    })
    .finally(() => session.close());
};

/**
 * Lists all memories from the db.
 * //TODO:  Pagination should be a thing based on date parameter passed.
 * @public
 * @param {boolean} includePeople - Flag which when enable adds people with relationships.
 * @returns {Promise} Promise to return entire dataset
 */
exports.listAllMemories = (includePeople = false) => {
  let query;
  if (includePeople) {
    query =
      "MATCH (m:Memory)-[r:SHARED]->(p:Person) WITH m,r,p ORDER BY m.date DESC return m,r,p ";
  } else {
    query = "MATCH (m:Memory) return m ORDER BY m.date DESC";
  }
  const session = driver.session({ database: DB });
  return session
    .run(query)
    .then((result) => {
      if (result.records.length <= 0) {
        Promise.reject();
      }
      output = {};
      result.records.forEach((record) => {
        /*Includes relationships with people */
        const memId = record.get(0).identity.low
        if (includePeople) {
          const recordObject = record.toObject();
          /*Get relationship */
          const relationship = recordObject["r"];
          /* If object exists add to existing item*/
          /* Move to || operation*/
          if (!(memId in output)) {
            /*Create new memory*/
            output[memId] = Object.assign(recordObject["m"].properties, {
              id: memId,
              types: recordObject["m"].labels,
            });
          }

          /* Append person to people array in memory object */
          const person = Object.assign(recordObject["p"].properties, {
            id: recordObject["p"].identity.low,
            connection: relationship,
            types: recordObject["p"].labels,
          });
          /* Create new if not set */
          if(output[memId]["people"]){
            output[memId]["people"].push(person)
          } else{
            output[memId]["people"] = [person]
          }
        } else {
          /* Only expecting memory */
          output[memId] = Object.assign(
            record.get(0).properties,
            {
              id: memId,
              types: record.get(0).labels,
            }
          );
        }
      });
      return output;
    })
    .finally(() => session.close());
};


/**
 * Gets a person from the database based on the unique name provided.
 * @public
 * @param {string} name - Name of the person to get.
 * @returns {Promise} Promise to return person.
 */
exports.getPersonByName = (name) => {
  const session = driver.session({ database: DB });
  return session
    .run("MATCH(p:Person) WHERE p.name=$name return p LIMIT 1", {
      name: name,
    })
    .then((result) => {
      if(result.records[0] && result.records[0].length > 0){
        const record = result.records[0].toObject()['p']
        return Object.assign(record.properties, {
          id: record.identity.low,
          types: record.labels,
        });
      }
      else{
        Promise.reject();
      }
    })
    .finally(() => session.close());
};


/**
 * Edits an existing person from the database.
 * @public
 * @param {Object} person - Person object to store in db. Trusts the FE.
 * @returns {Promise} Promise to add person.
 */
exports.editPerson = (person) => {
  const session = driver.session({ database: DB });
  return session
    .run("MATCH (p:Person {name:'Joao2'}) SET p={name:'Joao2'} return p LIMIT 1", {
      person: person
    })
    .then((result) => {
      if(result.records[0] && result.records[0].length > 0){
        const record = result.records[0].toObject()['p']
        return Object.assign(record.properties, {
          id: record.identity.low,
          types: record.labels,
        });
      }
      else{
        Promise.reject();
      }
    })
    .finally(() => session.close());
};

/**
 * Deletes person from db.
 * @public
 * @param {neo4j.Integer} id - The id of the person to delete.
 * @returns {Promise} A promise to delete person.
 */
exports.deletePerson = (name) => {
  const session = driver.session({ database: DB });
  return session
    .run("MATCH (p:Person{name=$name}) LIMIT 1 DETACH DELETE p", {
      name: name,
    })
    .then(()=>console.log(`Person with ${name} deleted.`))
    .catch(()=>console.error(`Person with ${name} not deleted.`))
    .finally(() => session.close());
};
/**
 * Lists all people in the db.
 * @public
 * @param {neo4j.Integer} id - The id of the person to delete.
 * @returns {Promise} A promise to delete person.
 */
exports.listAllPeople = () => {
  //Set cache header
  const session = driver.session({ database: DB });
  return session
    .run("MATCH (p:Person) return p")
    .then((result) => {
      return result.records.map((record) => {
        return Object.assign(record.get(0).properties, {
          id: record.get(0).identity.low,
          types: record.get(0).labels,
        });
      });
    })
    .finally(() => session.close());};

/* Close connection on exit. */
function exitHandler(options, exitCode) {
  if (options.cleanup) console.log("clean");
  if (exitCode || exitCode === 0) console.log(exitCode);
  if (options.exit) process.exit();
}

//do something when app is closing
process.on("exit", exitHandler.bind(null, { cleanup: true }));

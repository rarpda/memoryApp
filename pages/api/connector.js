const neo4j = require('neo4j-driver')
const USER = 'Application';
const PASSWORD = 'app123';
const URI =   'neo4j://localhost'
const DB = 'neo4j'
const driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD))

// const neo4j = window.neo4j;
// const neo4jUri = process.env.NEO4J_URI;
// const neo4jVersion = process.env.NEO4J_VERSION;
// let database = process.env.NEO4J_DATABASE;


const getMemory = (id) =>{
  const session = driver.session({database:DB})
  return session.run('MATCH(m:Memory) WHERE ID(m) = $searchId return m LIMIT 1',{searchId:parseInt(id)})
  .then(result=> result.records.length ? result.records[0].properties : undefined)
  .finally(()=> session.close())
}

/**
  title - string
  date - dd/mm/yyyy
  people - array [People]
*/
//TODO - Create new relationship for each person added
const createMemory = (title, date, people) => {
  const session = driver.session({database:DB})
  return session.run('CREATE (m:Memory {title:$title, date:$date}) return m', {title: title, date:date})
  .finally(()=> session.close())
}

/**
  List all Memories
*/
const listAllMemories = () => {
    //Set cache header
    const session = driver.session({database:DB})
    return session.run('MATCH (m:Memory) return m')
    .then(result=>result.records.map(record=> record.get(0).properties))
    .finally(()=> session.close())
}

module.exports = {
  getMemory,
  createMemory,
  listAllMemories
};

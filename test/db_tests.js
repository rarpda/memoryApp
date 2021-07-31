const assert = require("assert");
let should = require("chai").should;
const db_connector = require("../pages/api/connector");

describe("Database", function () {
  describe.skip("#createMemory", function () {
    it("should resolve and create memory and people", function () {
      return db_connector.createMemory("Test Memory", "10/06/1994", [
        "Ricardo2",
        "Joao2",
      ]);
    });

    it("should only create new memory and link existing people", function () {});
  });

  describe.skip("#getMemory", function () {
    it("should resolve and get a memory", function () {
      return db_connector.getMemory(30).then((data) => {
        assert.notStrictEqual(data, null);
      });
    });
    it("not should resolve as memory does not exist", function () {
      return db_connector.getMemory(10000000).then((data) => {
        assert.strictEqual(data, null);
      });
    });
  });
  describe.skip("#editMemory", function () {
    it("should resolve and get a memory", function () {
      return db_connector.editMemory(
        30,
        { title: "Edit title", date: "06/10/1991" },
        ["Joao2", "Ricardo3"]
      );
    });
    it("not should resolve as memory does not exist", function () {
      assert.rejects(db_connector.getMemory(10000000));
    });
  });
  describe.skip("#deleteMemory", function () {
    it("should reject as it memory id does not exist", function () {
      assert.rejects(db_connector.deleteMemory(1000000));
    });
    it.skip("should delete memory", function () {
      //TODO need to insert data with known id beforehand to run this test.
      return db_connector.deleteMemory(31);
    });
  });

  describe.skip("#describeAllMemories", function () {
    it("should resolve and list all memories in the db.", function () {
      return db_connector.listAllMemories().then((data) => {
        assert.notStrictEqual(Object.keys(data).length, 0);
      });
    });
    it("should resolve and list all memories in the db as well as relationships to people", function () {
      return db_connector.listAllMemories(true).then((data) => {
        assert.notStrictEqual(Object.keys(data).length, 0);
      });
    });
  });
});

describe.skip("#getPersonByname", function () {
  it("should resolve and get Joao2 from db.", function () {
    return db_connector.getPersonByName("Joao2").then((person) => {
      console.log(person)
      assert.strictEqual(person["name"], "Joao2");
    });
  });
  it("should not resolve as name will not exist.", function () {
    assert.rejects(db_connector.getPersonByName("fake123"));
  });
});

describe.skip("#editPerson", function () {
  it("should resolve and edit existing person in the db.", function () {
    return db_connector.editPerson({name:"Joao2"}).then((person) => {
      assert.strictEqual(person["name"], "Joao2");
    });
  });

  it("should not resolve as name will not exist.", function () {
    assert.rejects(db_connector.editPerson("fake123"));
  });
});

describe.skip("#deletePerson", function () {
  it("should resolve and delete existing person in the db.", function () {
    return db_connector.deletePerson("Joao2");
  });

  it("should not delete as name will not exist.", function () {
    assert.rejects(db_connector.deletePerson("fake123"));
  });
});

describe("#listAllPeople", function () {
  it("should resolve and list all people.", function () {
    return db_connector.listAllPeople().then((data)=>{
      assert.notStrictEqual(data.length,0)
    });
  });
});

after(() => {
  /*Cleanup */
  db_connector.forceConnectionClose();
});

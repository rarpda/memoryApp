// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
//const db = require('./db-controller/connector.js')
import { getMemory, editMemory, deleteMemory } from "../connector.js";

function errorHandling(error) {
  console.error("[id]: " + error);
  res.status(500).end();
}

export default function (req, res) {
  const id = parseInt(req.query.id);
  /* Check ID */
  if (typeof id !== "number") {
    res.status(400).end(); //MALFORMED REQUESTS
  }
  switch (req.method) {
    case "GET":
      /*Input validation of id*/
      return getMemory(id).then((result) => {
        result ? res.status(200).json(result) : res.status(404).end();
      }, errorHandling);
    case "PATCH":
      return editMemory(id, req.body.memory, req.body.people).then((result) => {
        result ? res.status(202).json(result) : res.status(404).end();
      }, errorHandling);
    case "DELETE":
      return deleteMemory(id).then((result) => {
        result ? res.status(202).json(result) : res.status(404).end();
      }, errorHandling);
    default:
      console.error(`Not supporting HTTP verb ${req.method}`);
      res.status(405).end();
      break;
  }
}

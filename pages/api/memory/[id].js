// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
//const db = require('./db-controller/connector.js')
import { getMemory } from "../connector.js";

export default function (req, res) {
  const id = parseInt(req.query.id);
  /* Check ID */
  if (typeof id !== "number") {
    res.status(400).end(); //MALFORMED REQUESTS
  }
  switch (req.method) {
    case "GET":
      /*Input validation of id*/
      return getMemory(id)
        .then((result) => {
          result ? res.status(200).json(result) : res.status(404).end();
        })
        .catch((error) => {
          console.error("[id]: "+error)
          res.status(500).end();
        });
    case "PATCH":
      return editMemory(id, req.body.memeory, req.body.people)
        .then((result) => {
          result ? res.status(202).json(result) : res.status(404).end();
        })
        .catch((error) => {
          console.error("[id]: "+error)
          res.status(500).end();
        });
    case "DELETE":
      return deleteMemory(id)
        .then((result) => {
          result ? res.status(202).json(result) : res.status(404).end();
        })
        .catch((error) => {
          console.error("[id]: "+error)
          res.status(500).end();
        });
      break;
    default:
      console.error("Malformed request.")
      res.status(400).end(); //MALFORMED REQUESTS
      break;
  }
}

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
//const db = require('./db-controller/connector.js')
import { listAllPeople, createPerson } from "./connector.js";

export default function (req, res) {
  switch (req.method) {
    case "GET":
      return listAllPeople()
        .then((result) => res.status(200).json(result))
        .catch((error) => {
          console.error(error);
          res.status(500).end(error);
        });
      break;
    case "POST":
      return createPerson(JSON.parse(req.body))
        .then((result) => {
          if (result) return res.status(200).json(result);
          return res.status(400).json(result);
        })
        .catch((error) => {
          console.error(error);
          return res.status(500).end(error);
        });
      break;
    default:
      console.error(`Not supporting HTTP verb ${req.method}`);
      res.status(405).end();
      break;
  }
  return;
}

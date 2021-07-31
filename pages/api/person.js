// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
//const db = require('./db-controller/connector.js')
import { listAllPeople } from "./connector.js";

export default function (req, res) {
  switch (req.method) {
    case "GET":
      listAllPeople()
        .then((result) => res.status(200).json(result))
        .catch((error) => {
          console.error(error);
          res.status(500).end(error);
        });
      break;
    default:
      console.error(`Not supporting HTTP verb ${req.method}`);
      res.status(405).end();
      break;
  }
}

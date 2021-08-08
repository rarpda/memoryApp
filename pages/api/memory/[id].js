// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
//const db = require('./db-controller/connector.js')
import { getMemory, editMemory, deleteMemory } from "../connector.js";
const fs = require("fs");
var formidable = require("formidable"),
  http = require("http"),
  util = require("util");

export const config = {
  api: {
    bodyParser: false,
  },
};
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
      const form = new formidable.IncomingForm();
      form.uploadDir = "./public/images";
      form.keepExtensions = true;
      form.allowEmptyFiles = false;
      form.parse(req, async function (err, fields, files) {
        if (err) return res.status(400).end();
        /* If there's a file then we overwrite it. Otherwise keep the same */
        let memory;
        if(files){
          memory = Object.assign(fields, {
            filepath: files["imageUpload"].path.replace("/public",""),
          });
        } else{
          memory = fields;
        }

        let people;
        if(memory["people"]) {
          people = memory["people"];
          delete memory["people"];
        }
        return editMemory(id,memory, people)
          .then((outcome) => {
            if(outcome) return res.status(202).end()
            return res.status(400).end()
          })
          .catch((error) => {
            console.error(error);
            res.status(404).end(error);
          });
      });
    case "DELETE":
      return deleteMemory(id).then((result) => {
        console.log(result)
        return result ? res.status(202).json(result) : res.status(404).end();
      }, errorHandling);
    default:
      console.error(`Not supporting HTTP verb ${req.method}`);
      res.status(405).end();
      break;
  }
}

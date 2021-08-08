// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
//const db = require('./db-controller/connector.js')
import { listAllMemories, createMemory } from "./connector.js";
// const multer = require("multer");
// var upload = multer({ dest: "public/images" });
const fs = require("fs");
var formidable = require("formidable"),
  http = require("http"),
  util = require("util");

export const config = {
  api: {
    bodyParser: false,
  },
};
// const post = async (req, res) => {
//   const form = new formidable.IncomingForm();
//   console.log("dasdasd")
//   // form.uploadDir = ".~/public/images";
//   form.keepExtensions = true;
//   form.parse(req, async function (err, fields, files) {
//     console.log("dasdas222", err)
//     if(err) return res.status(400).end();
//     // await saveFile(files.file);
//     console.log(fields,files)
//     return res.status(201).send("");
//   });
// };

export default async function (req, res) {
  switch (req.method) {
    case "GET":
      return listAllMemories(
        (req.query.includePeople ? req.query.includePeople.trim() : false) ===
          "true"
      )
        .then((result) => res.status(200).json(result))
        .catch((error) => {
          console.error(error);
          res.status(500).end(error);
        });
      break;
    case "POST":
      const form = new formidable.IncomingForm();
      form.uploadDir = "./public/images";
      form.keepExtensions = true;
      form.allowEmptyFiles = false;
      console.log("submitted")
      return form.parse(req, async function (err, fields, files) {
        if (err) return res.status(400).end();
        let memory;
        if(files){
          memory = Object.assign(fields, {
            filepath: files["imageUpload"].path.replace("public",""),
          });
        }
        else{
          memory =fields;
        }

        let people;
        if(memory["people"]) {
          people = memory["people"];
          delete memory["people"];
        }
        return createMemory(memory, people)
          .then((outcome) => {
            if(outcome) return res.status(201).end()
            return res.status(400).end()
          })
          .catch((error) => {
            console.error(error);
            return res.status(500).end();
          });
      });
      break;
    default:
      console.error(`Not supporting HTTP verb ${req.method}`);
      res.status(405).end();
      return;
      break;
  }
}

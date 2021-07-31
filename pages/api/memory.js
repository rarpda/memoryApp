// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
//const db = require('./db-controller/connector.js')
import {listAllMemories, createMemory} from "./connector.js"

export default function (req, res) {
  switch(req.method) {
    case 'GET':
      return listAllMemories((req.query.includePeople?req.query.includePeople.trim():false)==="true")
      .then(result=> res.status(200).json(result))
      .catch(error=>{
        console.error(error)
        res.status(500).end(error)
      })
      break;
    case 'POST':
      const title = req.body.title;
      const date = req.body.date;
      const people = req.body.People;

      return createMemory(title,date,people).then(()=> res.status(201).json(result))
      .catch(error=>{
        console.error(error)
        res.status(500).end(error)
      })
    default:
      console.error(`Not supporting HTTP verb ${req.method}`);
      res.status(405).end();
      break;
  }
}

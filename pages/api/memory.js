// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
//const db = require('./db-controller/connector.js')
import {listAllMemories, createMemory} from "./connector.js"

export default function (req, res) {
  switch(req.method) {
    case 'GET':
      return listAllMemories()
      .then(result=> res.status(200).json(result))
      .catch(error=>{
        console.log(error)
        res.status(500).end(error)
      })
      break;
    case 'POST':
      const title = req.body.title;
      const date = req.body.date;
      const people = req.body.People;

      return createMemory(title,date,people).then(()=> res.status(200).json(result))
      .catch(error=>{
        console.log(error)
        res.status(500).end(error)
      })
      break;
    default:
      console.error('Error')
        res.status(400).json({ message: `User with id: ${id} not found.` })
      break;
  }
}

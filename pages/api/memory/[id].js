// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
//const db = require('./db-controller/connector.js')
import {getMemory} from "../connector.js"

export default function (req, res) {
  const id = req.query.id;
  /*Input validation of id*/
   return getMemory(id).then((result)=>{
     result || result.length > 0 ? res.status(200).json(result) : res.status(404)
   }).catch(error=> {
     console.error(error)
     res.status(400)
   })
}

// export default function memoryHandler({ query: { id } }, res) {
//     console.log(id)
//     res.status(404).json({ message: `User with id: ${id} not found.` })
// }

import { useState,useEffect } from 'react'
import sidebarStyle from "../styles/Sidebar.module.css";
import Form from './Form';

export default function Sidebar({nodeToDisplay}) {
  let peopleDisplay;
  // On user click on a node - get information based on id. 
  if (nodeToDisplay && nodeToDisplay[1] && nodeToDisplay[1]['types'][0] === "Memory"){
    peopleDisplay = nodeToDisplay[1]['people'].map(element => {
      //TODO - add link
      `<a href="">${element['name']}</a>`
    });
  }
  else{
    //TODO implement - person view
    return (<h1>Memory View</h1>);
  }

  const [editFormVisible,setFormVisibility] = useState(false)

  function deleteButtonHandler(){
      //Display alert? 
      if(confirm("Are you sure you want to delete")){
        //
        fetch(`/api/memory/${nodeToDisplay[0]}`,{method:"DELETE"}).then(()=>{
          //Banner - memory deleted!
        }).catch(error=>{
          console.error(error)
          //TODO Banner memory could not be deleted
        })
      }
      else{
        console.log("User cancelled click")
      }
  }

  // Url for person - will trigger fetch.
  console.log(nodeToDisplay[1]['filepath'])
  return (
    <div className="sidebar">
      <h1>Memory View</h1>
      <h2>{nodeToDisplay[1]['title']}</h2>
      <p>{nodeToDisplay[1]['date']}</p>
      <p>{}</p>
      {nodeToDisplay[1]['filepath'] && <img src={nodeToDisplay[1]['filepath']}/>}
      {peopleDisplay?peopleDisplay:"<p>Memory not shared with people</p>"}
      <hr/>
      <p><i>ID:{nodeToDisplay[0]}</i></p>
      <button onClick={()=>setFormVisibility(!editFormVisible)}>Edit Memory</button>
      {/* Set color to red and alert user to get confirmation */}
      <button className={sidebarStyle.deleteButton} onClick={deleteButtonHandler}>Delete Memory</button>
      {editFormVisible && <Form setFormVisibility={setFormVisibility} nodeToEdit={nodeToDisplay}></Form>}
    </div>
  )
}

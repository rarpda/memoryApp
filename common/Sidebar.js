import { useState,useEffect } from 'react'

export default function Sidebar({nodeToDisplay}) {
  console.log(nodeToDisplay)
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

  // Url for person - will trigger fetch.

  return (
    <div className="sidebar">
      <h1>Memory View</h1>
      <h2>{nodeToDisplay[1]['title']}</h2>
      <p>{nodeToDisplay[1]['date']}</p>
      <img src="" />
      {peopleDisplay?peopleDisplay:"<p>Memory not shared with people</p>"}
      <hr/>
      <p><i>ID:{nodeToDisplay[0]}</i></p>
      <button>Edit Memory</button>
        {/* Title */}
        {/* Date */}
        {/* Description TODO */}
        {/* Photo TODO */}
        {/* People as hyperlink to get people info TODO */}
        {/* Edit memory option */}
    </div>
  )
}

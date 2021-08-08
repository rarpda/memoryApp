import { useState } from "react";
import common from "./Common.module.css";
import Form
 from "./Form";
export default function Header() {

  const [addFormVisible, setAddForm] = useState(true) 

  return (
    <header className={common.header}>
        {/* Name in the middle */}
        <h1 className={common.h1}>Memory Map</h1>
        {/* onClick toggle form overlay */}
        <button className={common.button} onClick={()=>setAddForm(!addFormVisible)}>Add memory</button>
        {addFormVisible && <Form setFormVisibility={setAddForm}></Form>}
      </header>
  );
}

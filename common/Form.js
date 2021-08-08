import { useState, useEffect } from "react";
import styles from "../styles/Form.module.css";

export default function Form({ setFormVisibility, nodeToEdit }) {
  const [people, setPeople] = useState(null);

  //Always fetch people data
  useEffect(() => {
    const data = fetch("http://localhost:3000/api/person")
      .then((res) => res.json())
      .then((data) => setPeople(data));
  }, []);

  function saveToLocalStorage(event) {
    event.preventDefault();
    const formData = new FormData(document.forms.memoryForm);
    for (let value of formData.entries()) {
      localStorage.setItem(value[0], value[1]);
      console.log(value);
    }
    const people = formData.getAll("people");
    let dataOutput = JSON.stringify(people);
    localStorage.setItem("people", dataOutput);
    localStorage.removeItem("imageUpload");
  }

  //TODO - verify submission and prepare payload
  function handleSubmit(event) {
    const formData = new FormData(document.forms.memoryForm);
    console.log(formData);
    if (nodeToEdit) {
      //Hide visibility and banner
      //Patch to ID
      fetch("/api/memory/" + nodeToEdit[0], {
        method: "PATCH",
        body: formData,
      }).then((res) => {
        if (!res.ok) {
          //Failed to edit memory
        } else {
          console.log("Memory edited");
          //Set visibility to false
          //Banner
        }
      });
    } else {
      fetch("/api/memory", { method: "POST", body: formData }).then((res) => {
        if (!res.ok) {
          //Failed to add memory
          localStorage.clear();
          setFormVisibility(false);
        } else {
          console.log("Memory created!");
          //Set visibility to false
          //Banner~
        }
      });
      //POSt to memory
    }

    //Prevent redirect -> look into this without jquery but consider jquery for short term
    event.preventDefault();
  }

  let image, setImage;
  if (nodeToEdit) {
    //Edit mode
    console.log(nodeToEdit[1]);
    console.log(getValueFromStorage("date"));
    if (nodeToEdit[1]["filepath"]) {
      [image, setImage] = useState(nodeToEdit[1]["filepath"]);
    }
    else{
      [image, setImage] = useState(null);
    }
  } else {
    [image, setImage] = useState(null);
  }

  console.log("asdsd");
  let peopleSelect;
  if (people) {
    //ISSUe with what happens if people is not laoded
    let peopleProcessed;
    if (nodeToEdit) {
      peopleProcessed = nodeToEdit[1]["people"].map((e) => e["name"]);
    } else {
      const peopleStored = getValueFromStorage("people");
      peopleProcessed = peopleStored ? JSON.parse(peopleStored) : [];
    }

    peopleSelect = people.map((person) => {
      if (peopleProcessed.includes(person["name"])) {
        return (
          <option key={person["name"]} value={person["name"]} selected>
            {person["name"]}
          </option>
        );
      }

      return (
        <option key={person["name"]} value={person["name"]}>
          {person["name"]}
        </option>
      );
    });
  }
  function imageUpload(event) {
    //Update state of image
    let oFiles = event.target.files;
    if (["image/png", "image/jpeg"].includes(oFiles[0].type)) {
      //Accept and preview
      setImage(URL.createObjectURL(oFiles[0]));
    } else {
      //TODO Display error to user - Banner
      setImage(null);
      event.preventDefault();
    }
  }

  function getValueFromStorage(label) {
    return localStorage.getItem(label) || "";
  }
  function addPerson() {
    let personName = window.prompt("Enter new person to add");
    if (personName) {
      fetch("/api/person", { method: "POST", body: JSON.stringify({ name: personName }) })
        .then((res) => {
          //Banner
          if (res.ok) {
            console.log("Created");
            const data = fetch("http://localhost:3000/api/person")
            .then((res) => res.json())
            .then((data) => setPeople(data));

            if (nodeToEdit) {
              nodeToEdit[1]["people"].push({"name":personName});
            } else {
              const peopleStored = getValueFromStorage("people");
              localStorage.setItem(Object.assign(JSON.parse(peopleStored),{"name":personName}))
            }
          } else {
            console.log("Error");
          }
        })
        .catch(() => console.error(error));
    }
  }

  

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        {/* <modal id="addForm" hidden>
        </modal> */}
        <form
          id="memoryForm"
          className={styles.form}
          onSubmit={handleSubmit}
          method="POST"
          action="/api/memory"
          rel="noopener"
          enctype="multipart/form-data"
        >
          <label htmlFor="title">Title of memory</label>
          <input
            defaultValue={
              nodeToEdit ? nodeToEdit[1]["title"] : getValueFromStorage("title")
            }
            name="title"
            type="text"
            required
          />
          <label htmlFor="date">Date of event</label>
          <input
            name="date"
            type="date"
            defaultValue={
              nodeToEdit ? nodeToEdit[1]["date"] : getValueFromStorage("date")
            }
            required
          />
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            defaultValue={
              nodeToEdit
                ? nodeToEdit[1]["description"]
                : getValueFromStorage("description")
            }
            required
          />
          <label>Who was this memory shared with?</label>
          {/* TODO Add option to add new people and update list   */}
          {peopleSelect ? (
            <select name="people" multiple={true}>
              {peopleSelect}
            </select>
          ) : (
            <input></input>
          )}
          {/* TODO do something like AWS does to separate and highlight new inputs */}
          <buttton type="button" onClick={addPerson}>Click to add person</buttton>
          <label>A photo is always nice!</label>
          <input
            type="file"
            onChange={imageUpload}
            name="imageUpload"
            accept="image/*"
          />
          {image && <img src={image} />}
          {/* Preview image  */}
          {/* TODO disable or hide one of these buttons for edit option */}
          <div className={styles.buttonGrid}>
            <button type="submit">Submit</button>
            {nodeToEdit ? null : (
              <button type="button" onClick={saveToLocalStorage}>
                Save
              </button>
            )}
            {nodeToEdit ? null : (
              <button type="reset" onClick={() => localStorage.clear()}>
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                // if (!nodeToEdit) localStorage.clear();
                setFormVisibility(false);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

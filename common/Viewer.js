import React, { useRef, useEffect } from "react";
import useSWR from "swr";

// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

// function onHoverListener(event){
//   //Chec if it's hover a node if so find node it's on and highlight
//   // if it leaves a node it should remove highlight
// }


//todo ref - for list of data
//add x,y position
function Viewer({ windowDimensions }) {
  const canvasRef = useRef(null);
  let includePeople = true;
  //Our first draw
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, error } = useSWR(
    `/api/memory?includePeople=${includePeople}`,
    fetcher,
    { refreshInterval: 1000000 }
  );
  const offset = 100;
  let items;
  if (data) {
    items = Object.entries(data).map((memory, i) => {
      return Object.assign(memory, {
        x: i * offset + 50,
        y: offset + 100,
        radius: 15,
      });
    });
  }

  function isNodeCheck(x, y, r) {
    //Get closest node
    let smallestDistance;
    let node;
    // while(typeof node === "undefined"){
    items.forEach((element) => {
      0;
      let distance = Math.sqrt((element.x - x) ** 2 + (element.y - y) ** 2);
      if (
        typeof smallestDistance === "undefined" ||
        distance < smallestDistance
      ) {
        if (distance <= r) {
          //New smaller node
          smallestDistance = distance;
          node = element;
          return node;
        } else {
          if (element[1].people) {
            element[1].people.forEach((person) => {
              let distance = Math.sqrt(
                (person.x - x) ** 2 + (person.y - y) ** 2
              );
              if (distance <= r) {
                //New smaller node
                smallestDistance = distance;
                node = person;
                return node;
              }
            });
          }
        }
      }
    });
    // }
    return node;
  }
  let highlightNode;
  function onClick(event) {
    //Check if clicking on node.
    //if so update sidebar with info
    // isNodeCheck(x.y)
    //x,y must be relative to canvas
    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    // console.log(
    let context = canvasRef.current.getContext("2d");
    // .getImageData(x, y, 1, 1).data
    // );
    //TODO check canvas for empty
    console.log("x: " + x + " y: " + y);
    let newNode = isNodeCheck(x, y, 15);
    if (newNode) {
      if (newNode !== highlightNode) {
        console.log(highlightNode)
        if (highlightNode) {
          /*Remove highlight */
          context.beginPath();
          context.strokeStyle  = "rgb(0,0,255)"; //blue
          context.arc(highlightNode.x, highlightNode.y, 20, 0, 2 * Math.PI);
          context.lineWidth = 5;
          context.stroke();
          context.closePath();
        }

        /*highlight new*/
        highlightNode = newNode;
        context.beginPath();
        context.strokeStyle  = "rgb(0,155,155)"; //red
        context.arc(highlightNode.x, highlightNode.y, 20, 0, 2 * Math.PI);
        context.lineWidth = 5;
        context.stroke();
        context.closePath();
        //Update sidebar
      }
    } else {
      console.log("missed",highlightNode)
      if (highlightNode) {
        /* Ignore -- look at relationshio later */
        context.beginPath();
        context.strokeStyle  = "rgb(0,0,255)"; //red
        context.arc(highlightNode.x, highlightNode.y, 20, 0, 2 * Math.PI);
        context.lineWidth = 6;
        context.stroke();
        context.closePath();
      }
      highlightNode=null;
    }
    // https://stackoverflow.com/questions/55677/how-do-i-get-the-coordinates-of-a-mouse-click-on-a-canvas-element
  }

  // TODO
  /* On click display info in the side bar*/
  /* Zoom in-zoom out*/
  /* Click and drag */
  let coords = {};
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    console.log("cahnge in efect")
    if (items) {
      items.forEach((memory) => {
        if (includePeople) {
          if (memory[1]["people"]) {
            //If people are enabled and array is returned draw them!
            //Have equal spacing
            const equalSpace = (2 * Math.PI) / memory[1]["people"].length;
            memory[1]["people"].forEach((element, index) => {
              /* Calculate coordinates for centre x and y of people circle */
              let radius = 50;
              let x =
                radius * Math.cos(equalSpace * (index + 1) - Math.PI / 2) +
                memory.x;
              let y =
                radius * Math.sin(equalSpace * (index + 1) - Math.PI / 2) +
                memory.y;
              /* Draw line between centres then fill circle for people*/
              context.beginPath();
              context.globalCompositeOperation = "destination-over";
              context.moveTo(memory.x, memory.y);
              context.lineTo(x, y);
              context.stroke();
              context.restore();
              context.closePath();
              context.globalCompositeOperation = "source-over";
              context.fillStyle = "rgb(0,255,0)"; //green
              context.fill(context.arc(x, y, 15, 0, 2 * Math.PI));
              context.fillStyle = "rgb(255,255,255)"; //white
              context.textAlign = "center";
              context.fillText(element["name"], x, y + 3);
              element["x"] = x;
              element["y"] = y;
            });
          }
        }
        //Draw circle for memory
        context.beginPath();
        context.fillStyle = "rgb(255,0,0)"; //red
        context.fill(context.arc(memory.x, memory.y, 15, 0, 2 * Math.PI));
        context.closePath();
        context.fillStyle = "rgb(255,255,255)"; //white
        context.textAlign = "center";
        context.fillText(memory[1]["title"], memory.x, memory.y + 3);
      });
    }
  }, [items]);
  // WARNING Note: You should not use fetch() to call an API route in getServerSideProps. Instead, directly import the logic used inside your API route. You may need to slightly refactor your code for this approach.
  //   if (error) return <div>failed to load</div>;
  //   if (!data) return <div>loading...</div>;

  return (
    <canvas ref={canvasRef} onMouseMove={onClick} height="1000px" width="1000px" />
  );
}

export default Viewer;

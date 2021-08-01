import React, { useRef, useEffect } from "react";
import useSWR from "swr";

//todo ref - for list of data
//add x,y position
function Viewer() {
  const canvasRef = useRef(null);
  let includePeople = true;
  //Our first draw
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, error } = useSWR(
    `/api/memory?includePeople=${includePeople}`,
    fetcher
  );
  const offset = 75;
  let items;
  if (data) {
    items = Object.entries(data).map((memory, i) => {
      return Object.assign(memory, {
        x: (i + 1) * offset,
        y: offset,
      });
    });
  }

  // TODO
  /* Set color depending on type*/
  /* Draw relationship */
  /* Hover highlight */
  /* On click display info in the side bar*/
  /* Zoom in-zoom out*/
  /* Click and drag */

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (items) {
      //   items.forEach((memory) => {
      //Draw memory then
      // context.beginPath();
      items.forEach((memory) => {
        console.log(memory);
        //Create center points, draw line to them
        if (includePeople) {
          if (memory[1]["people"]) {
            const equalSpace = (2 * Math.PI) / memory[1]["people"].length;
            memory[1]["people"].forEach((element, index) => {
              context.beginPath();
              context.moveTo(memory.x, memory.y);
              let radius = 50;
              let x =
                radius * Math.cos(equalSpace * (index + 1) - Math.PI / 2) +
                memory.x;
              let y =
                radius * Math.sin(equalSpace * (index + 1) - Math.PI / 2) +
                memory.y;
              context.lineTo(x, y);
              context.fillStyle = "rgb(0,255,0)";
              context.stroke();
              context.closePath();
              context.fill(context.arc(x, y, 15, 0, 2 * Math.PI));
            });

            context.beginPath();
            context.fillStyle = "rgb(255,0,0)";
            context.fill(context.arc(memory.x, memory.y, 15, 0, 2 * Math.PI));
            context.closePath();
          } else {
            //ERROR
          }
        }
      });
    }
    // To impletement
    // Click, Drag (to move), hover (highlight)
  }, [items]);
  // WARNING Note: You should not use fetch() to call an API route in getServerSideProps. Instead, directly import the logic used inside your API route. You may need to slightly refactor your code for this approach.
  //   if (error) return <div>failed to load</div>;
  //   if (!data) return <div>loading...</div>;
  return <canvas ref={canvasRef} />;
}

export default Viewer;

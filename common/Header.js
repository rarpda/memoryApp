import common from "./Common.module.css";

export default function Header() {
  return (
    <header className={common.header}>
      {/* <header> */}
        {/* Name in the middle */}
        <h1 className={common.h1}>Memory Map</h1>
        {/* onClick toggle form overlay */}
        <button className={common.button}>Add memory</button>
      {/* </header> */}
    </header>
  );
}

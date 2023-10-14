import React from "react";
import { Routes, Route } from "react-router";
import Landing from "./components/Landing";
import AddImages from "./components/AddImages";
import DisplayImages from "./components/DisplayImages";
import DisplayBuckets from "./components/DisplayBuckets";
import { useState } from "react";
  

function AvailabeRoutes(){


    const [file, setFile] = useState(null);

    return (
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/addImages" element={<AddImages file={file} setFile={setFile}/>} />
          <Route path="/displayImages" element={<DisplayImages file={file} setFile={setFile}/>} />
          <Route path="/displayBuckets" element={<DisplayBuckets/>}/>
        </Routes>
      );
}

  export default AvailabeRoutes;
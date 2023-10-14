import React from "react";
import "./App.css";
import Layout from "./components/style/Layout";
import AvailabeRoutes from "./Routes";
import "@progress/kendo-theme-default/dist/all.css"; 

import "./assets/styles/bootstrap.css";
import "./assets/styles/bootstrap.overrides.css";
import "./assets/styles/main.scss";


function App() {

  
    return (
          <Layout>
            <AvailabeRoutes />
          </Layout>
    );

  
}

export default App;
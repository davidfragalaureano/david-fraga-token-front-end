import React from "react";
import ReactDOM from "react-dom";
import { Token } from "./components/Token";
import contractInfo from "./contract.json";

// We import bootstrap here, but you can remove if you want
import '@fortawesome/fontawesome-free/css/all.min.css'; 
import'bootstrap-css-only/css/bootstrap.min.css'; 
import'mdbreact/dist/css/mdb.css';

// This is the entry point of your application, but it just renders the Dapp
// react component. All of the logic is contained in it.

ReactDOM.render(
  <React.StrictMode>
    <Token contractAddress={contractInfo.address}/>
  </React.StrictMode>,
  document.getElementById("root")
);
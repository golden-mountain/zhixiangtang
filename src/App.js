import React, { Component } from "react";
// import logo from "./logo.svg";

import PTXLayout from "./components/Layout";
import TreeParser from "./components/TreeParser";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.data = {};
    this.yaml = require("./yaml/yuanguan.yaml");
  }

  render() {
    return (
      <PTXLayout>
        <TreeParser yaml={this.yaml} />
      </PTXLayout>
    );
  }
}

export default App;

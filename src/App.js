import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import "antd/dist/antd.css";
import { Layout } from "antd";

import TreeParser from "./components/TreeParser";

const { Header } = Layout;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.data = {};
    this.yaml = require("./yaml/yuanguan.yaml");
  }

  render() {
    return (
      <Layout>
        <Header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">至香堂演示代码</h1>
        </Header>
        <TreeParser yaml={this.yaml} />
      </Layout>
    );
  }
}

export default App;

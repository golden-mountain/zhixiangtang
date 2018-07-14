import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
// const YAML = require("yamljs");
import YAML from "yamljs";
import { Treebeard } from "react-treebeard";

// parse YAML string
// const nativeObject = YAML.parse(yamlString);

// Generate YAML
// const yamlString = YAML.stringify(nativeObject, 4);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.data = {};
    this.onToggle = this.onToggle.bind(this);
  }

  onToggle(node, toggled) {
    console.log(node, toggled);
    if (this.state.cursor) {
      this.setState({ cursor: { active: false } });
      // this.state.cursor.active = false;
    }
    node.active = true;
    if (node.children) {
      node.toggled = toggled;
    }
    this.setState({ cursor: node });
  }

  componentWillMount() {
    // Load yaml file using YAML.load
    // const nativeObject = YAML.load("yaml/test.yml");

    // const nativeObject = YAML.load("yaml/test.yml");
    let yaml = require("./yaml/yuanguan.yaml");
    // const entries = {
    //   名: "ming",
    //   又: "you",
    //   字: "zi",
    //   号: "hao",
    //   讳: "wei",
    //   址: "zi",
    //   坟: "hun",
    //   殁: "mo",
    //   殀: "yao",
    //   妻: "qi",
    //   子: "zhi",
    //   父: "fu",
    //   学: "xue",
    //   事: "shi",
    //   祧: "tiao",
    //   夫: "fu",
    //   母: "mu",
    //   生: "sheng",
    //   能: "neng",
    //   原: "yuan",
    //   女: "nv",
    //   嫁: "jia"
    // };
    // for (let entry of Object.entries(entries)) {
    //   yaml = yaml.replace(new RegExp(entry[0] + ":", "g"), entry[1] + ":");
    // }
    // console.log(yaml);
    const formatData = (data, myParent = "") => {
      // return data;
      let d = [];
      let parent = "";
      data.forEach(element => {
        let newData = {};
        if (element["子"]) {
          parent = "子:";
          newData["children"] = formatData(element["子"], parent);
          newData["toggled"] = false;
        } else if (element["妻"]) {
          parent = "妻:";
          newData["children"] = formatData(element["妻"], parent);
          newData["toggled"] = false;
        }
        newData["name"] = myParent + element["名"] || "未知姓名";
        d.push(newData);
      });
      return d;
    };

    const nativeObject = YAML.parse(yaml);
    const myData = formatData(nativeObject);
    // const data = {};
    this.data["name"] = "至香堂";
    this.data["toggled"] = true;
    this.data["children"] = myData;
    // this.setState({ data });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">至香堂演示代码</h1>
        </header>
        <Treebeard data={this.data} onToggle={this.onToggle} />
      </div>
    );
  }
}

export default App;

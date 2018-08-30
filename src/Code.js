import React, { Component } from "react";
// import logo from "./logo.svg";
import PTXLayout from "./components/Layout";
import MonacoEditor from "react-monaco-editor";

import YAML from "yamljs";
import "antd/dist/antd.css";

import { cloneDeep } from "lodash";
import dateCaculators from "./library/dateCaculator";

const { translateDate } = dateCaculators;

class Code extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "李"
    };
    this.data = {};
    this.onToggle = this.onToggle.bind(this);
    this.yaml = require("./yaml/yuanguan.yaml");
  }

  onToggle(node, toggled) {
    // console.log(node, toggled);
    if (this.state.cursor) {
      this.setState({ cursor: { active: false } });
      // this.state.cursor.active = false;
    }
    node.active = true;
    if (node.children) {
      node.toggled = toggled;
    }
    this.setState({ cursor: node });
    // console.log("node....", node);
  }

  renderNode() {
    if (this.state.cursor) {
      for (let node in this.state.cursor) {
      }
    }
  }

  componentWillMount() {
    const formatData = data => {
      let d = [];
      data.forEach(element => {
        let newData = element;
        if (element["子"]) {
          newData["children"] = formatData(element["子"]);
          newData["toggled"] = false;
        }

        newData["name"] = element["名"] || "未知姓名";
        d.push(newData);
      });
      return d;
    };

    this.nativeObject = YAML.parse(this.yaml);
    const myData = formatData(this.nativeObject);
    this.data["name"] = "文辉堂";
    this.data["toggled"] = true;
    this.data["children"] = myData;
  }

  getCode() {
    const excludes = ["toggled", "children", "name", "active"];
    const tidyData = data =>
      (data ? data.replace(/[[(](.*?)[\])]/, "$1") : data);

    const createPersonLang = (element, variableName, level) => {
      excludes.forEach(key => {
        if (element[key] !== undefined) {
          delete element[key];
        }
      });
      // const json = JSON.stringify(element);
      let valuePairs = [`level: ${level}`];
      Object.entries(element).forEach(entry => {
        if (!Array.isArray(entry[1])) {
          let key = tidyData(entry[0]);
          let value = tidyData(entry[1]);
          if (key === "生") {
            const seconds = new Date(translateDate(value)).getTime() || 0;
            valuePairs.push("日:" + seconds);
          }
          if (key === "殁") {
            const seconds = new Date(translateDate(value)).getTime() || 0;
            valuePairs.push("死:" + seconds);
          }
          valuePairs.push(key + ': "' + value + '"');
        }
      });
      let json = "{" + valuePairs.join(", ") + "}";
      let createPerson = `CREATE (${variableName}:Person:${this.state.firstName}${json})`;
      // console.log(createPerson);
      return createPerson;
    };

    const formatData = (data, person = "", level = 0) => {
      let d = [], relation = [];
      data.forEach((element, index) => {
        let name = tidyData(element["名"]);
        let variableName = name + "_" + index;

        if (person) {
          variableName = person + "_" + variableName;
          let createRelation = `CREATE (${variableName})-[:RELATION{role: 'son'}]->(${tidyData(person)})`;
          relation.push(createRelation);
        }

        let createPerson = createPersonLang(element, variableName, level);
        d.push(createPerson);

        if (element["子"]) {
          level++;
          // console.log("level", level, "name:", variableName);
          const sub = formatData(element["子"], variableName, level);
          d = d.concat(sub);
          delete element["子"];
          delete element["children"];
        }

        if (element["妻"]) {
          element["妻"].forEach((w, i) => {
            let wifeName = variableName + "_妻_" + tidyData(w["名"]) + "_" + i;
            let createRelation = `CREATE (${wifeName})-[:RELATION{role: 'wife'}]->(${variableName})`;
            relation.push(createRelation);
            let createPerson = createPersonLang(w, wifeName, level);
            d.push(createPerson);
          });
          delete element["妻"];
        }

        if (element["女"]) {
          element["女"].forEach((w, i) => {
            let daughterName =
              variableName + "_女_" + tidyData(w["名"]) + "_" + i;
            let createRelation = `CREATE (${daughterName})-[:RELATION{role: 'daughter'}]->(${variableName})`;
            relation.push(createRelation);
            let createPerson = createPersonLang(w, daughterName, level);
            d.push(createPerson);
          });
          delete element["女"];
        }
      });
      d = d.concat(relation);
      return d;
    };
    const clonedObject = cloneDeep(this.nativeObject);
    const flattedObject = formatData(clonedObject);
    return flattedObject.join("\n");
  }

  render() {
    const options = {
      selectOnLineNumbers: true,
      acceptSuggestionOnCommitCharacter: true,
      autoIndent: true,
      automaticLayout: true,
      dragAndDrop: true,
      folding: true,
      foldingStrategy: "auto",
      highlightActiveIndentGuide: true,
      mouseWheelZoom: true,
      multiCursorModifier: "ctrlCmd"
    };
    return (
      <PTXLayout>
        <MonacoEditor
          width="100%"
          height={750}
          language="sql"
          theme="vs-dark"
          value={this.getCode()}
          options={options}
        />
      </PTXLayout>
    );
  }
}

export default Code;

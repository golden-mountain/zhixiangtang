import React, { Component } from "react";

// import { Table } from "antd";
import { Row, Col } from "antd";
// import YAML from "yamljs";

import MonacoEditor from "react-monaco-editor";

import TreeParser from "./components/TreeParser";
import PTXLayout from "./components/Layout";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMsg: "",
      code: `-
  名: xx
  字: xx
  号: xx
`
    };
  }

  editorDidMount(editor, monaco) {
    console.log("editorDidMount", editor);
    editor.focus();
  }

  onChange(newValue, e) {
    console.log("onChange", typeof newValue, e);
    //this.state.code = newValue;
    if (typeof newValue === "string") {
      try {
        this.setState({ code: newValue });
      } catch (e) {
        console.log("error parsed", e);
      }
    }
  }

  onTipClose() {
    this.setState({
      errorMsg: ""
    });
  }

  render() {
    const options = {
      selectOnLineNumbers: true
    };
    return (
      <PTXLayout>
        <Row>
          <Col span={8}>
            <MonacoEditor
              width="95%"
              height={700}
              language="yaml"
              theme="vs-dark"
              value={this.state.code}
              options={options}
              onChange={this.onChange.bind(this)}
              editorDidMount={this.onChange.bind(this)}
            />
          </Col>
          <Col span={16}>
            <TreeParser yaml={this.state.code} />
          </Col>
        </Row>
      </PTXLayout>
    );
  }
}

export default App;

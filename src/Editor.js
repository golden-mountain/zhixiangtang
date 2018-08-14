import React, { Component } from "react";

// import { Table } from "antd";
import { Row, Col, Spin, TreeSelect, Button, Icon } from "antd";
// import YAML from "yamljs";

import MonacoEditor from "react-monaco-editor";

import TreeParser from "./components/TreeParser";
import PTXLayout from "./components/Layout";

const treeData = [
  {
    title: "Node1",
    value: "0-0",
    key: "0-0",
    children: [
      {
        title: "Child Node1",
        value: "0-0-1",
        key: "0-0-1"
      },
      {
        title: "Child Node2",
        value: "0-0-2",
        key: "0-0-2"
      }
    ]
  },
  {
    title: "Node2",
    value: "0-1",
    key: "0-1"
  }
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      errorMsg: "",
      currentKey: "",
      autoSaving: false,
      codeChanged: false,
      code: `-
  名: 先知
  号: 先知不觉
  子:
    -
      名: 后觉
`
    };
  }

  onTreeChange(value) {
    console.log(value);
    this.setState({ value });
  }

  onTreeSearch() {}

  editorDidMount(editor, monaco) {
    // console.log("editorDidMount", editor);
    editor.focus();
    editor.onDidChangeCursorPosition(e => {
      const model = editor.getModel();
      const content = model.getLineContent(e.position.lineNumber).trim();
      // console.log("cursor changed", e.position.lineNumber, content);
      if (content[0] === "名") {
        this.setState({
          currentKey: content.substr(content.indexOf(":") + 1)
        });
      }
    });
  }

  onEditorChange(newValue, e) {
    // console.log("onChange", newValue);
    //this.state.code = newValue;
    if (typeof newValue === "string") {
      try {
        this.setState({ code: newValue, codeChanged: true });
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
        <Row className="ptx-tree-selector">
          <Col span={20}>
            <TreeSelect
              style={{ width: 300 }}
              value={this.state.value}
              dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
              treeData={treeData}
              placeholder="选择我编辑过的项目"
              treeDefaultExpandAll={false}
              onChange={this.onTreeChange.bind(this)}
              searchPlaceholder="输入名字搜索"
              showSearch
              allowClear
              onSearch={this.onTreeSearch.bind(this)}
            />
          </Col>
          <Col span={4} style={{ textAlign: "right" }}>
            <Button disabled={!this.state.codeChanged}>保存</Button>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <MonacoEditor
              width="95%"
              height={700}
              language="yaml"
              theme="vs-dark"
              value={this.state.code}
              options={options}
              onChange={this.onEditorChange.bind(this)}
              editorDidMount={this.editorDidMount.bind(this)}
            />
            {this.state.autoSaving
              ? <div className="ptx-editor-save">
                  <Spin />
                  <label>正在自动保存</label>
                </div>
              : null}
          </Col>
          <Col span={16}>
            <TreeParser
              yaml={this.state.code}
              currentKey={this.state.currentKey}
            />
          </Col>
        </Row>
      </PTXLayout>
    );
  }
}

export default App;

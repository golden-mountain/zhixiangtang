import React, { Component } from "react";

// import { Table } from "antd";
import { Row, Col, Spin, Button, Icon, Input, AutoComplete } from "antd";
// import YAML from "yamljs";

import MonacoEditor from "react-monaco-editor";

import TreeParser from "./components/TreeParser";
import PTXLayout from "./components/Layout";
const Option = AutoComplete.Option;
const OptGroup = AutoComplete.OptGroup;

const dataSource = [
  {
    title: "会金",
    children: [
      {
        title: "良系",
        count: 10000
      },
      {
        title: "良俊",
        count: 10600
      }
    ]
  },
  {
    title: "会铝",
    children: [
      {
        title: "良思",
        count: 60100
      },
      {
        title: "良田",
        count: 30010
      }
    ]
  },
  {
    title: "统壬",
    children: [
      {
        title: "会针",
        count: 100000
      }
    ]
  }
];

function renderTitle(title) {
  return (
    <span>
      {title}
      <a
        style={{ float: "right" }}
        href="https://www.google.com/search?q=antd"
        target="_blank"
        rel="noopener noreferrer"
      >
        100个子孙
      </a>
    </span>
  );
}
const autoCompleteOptions = dataSource.map(group => (
  <OptGroup key={group.title} label={renderTitle(group.title)}>
    {group.children.map(opt => (
      <Option key={opt.title} value={opt.title}>
        {opt.title}
        <span className="certain-search-item-count">
          {opt.count}
          个子孙
        </span>
      </Option>
    ))}
  </OptGroup>
));

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      errorMsg: "",
      currentKey: "",
      autoSaving: false,
      searchKey: "",
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

  onTreeSearch(value) {
    console.log("search key", value);
    this.setState({ searchKey: value });
  }

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

  save() {}

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
          <Col span={6}>
            <AutoComplete
              className="certain-category-search"
              dropdownClassName="certain-category-search-dropdown"
              dropdownMatchSelectWidth={false}
              dropdownStyle={{ width: 300 }}
              size="large"
              style={{ width: "100%" }}
              dataSource={autoCompleteOptions}
              placeholder="input here"
              optionLabelProp="value"
              onSearch={this.onTreeSearch.bind(this)}
            >
              <Input
                suffix={
                  <Icon type="search" className="certain-category-icon" />
                }
              />
            </AutoComplete>
          </Col>
          <Col span={2}>
            <Button type="primary" size="large" onClick={this.save.bind(this)}>
              保存
            </Button>
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
            {this.state.autoSaving ? (
              <div className="ptx-editor-save">
                <Spin />
                <label>正在自动保存</label>
              </div>
            ) : null}
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

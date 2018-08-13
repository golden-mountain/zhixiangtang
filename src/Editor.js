import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import "antd/dist/antd.css";

// import { Table } from "antd";
import { Layout } from "antd";
import MonacoEditor from "react-monaco-editor";

const { Header, Sider, Content } = Layout;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    console.log("onChange", newValue, e);
  }

  render() {
    const code = this.state.code;
    const options = {
      selectOnLineNumbers: true
    };
    return (
      <Layout>
        <Header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">编辑器</h1>
        </Header>
        <Layout>
          <Sider width={400} />
          <Content>
            <MonacoEditor
              width="800"
              height="600"
              language="yaml"
              theme="vs-dark"
              value={code}
              options={options}
              onChange={this.onChange.bind(this)}
              editorDidMount={this.onChange.bind(this)}
            />
          </Content>
        </Layout>

      </Layout>
    );
  }
}

export default App;

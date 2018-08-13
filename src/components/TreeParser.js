import React, { Component } from "react";
import YAML from "yamljs";
import { Treebeard } from "react-treebeard";
import { Table, Layout, notification } from "antd";
import dateCaculators from "../library/dateCaculator";

const { Sider, Content } = Layout;
const { translateDate } = dateCaculators;

// const decorators = {
//   Loading: props => {
//     return <div style={props.style}>loading...</div>;
//   },
//   Toggle: props => {
//     return (
//       <div style={props.style}>
//         <svg height={props.height} width={props.width} />
//       </div>
//     );
//   },
//   Header: props => {
//     return <div style={props.style}>{props.node.name}</div>;
//   },
//   Container: props => {
//     return (
//       <div>
//         <props.decorators.Toggle />
//         <props.decorators.Header />
//       </div>
//     );
//   }
// };

class TreeParser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cursor: null,
      dataSource: [],
      errorMsg: "",
      data: null
    };
    // this.data = {};
  }

  onToggle(node, toggled) {
    if (this.state.cursor) {
      this.setState({ cursor: { active: false } });
    }
    node.active = true;
    if (node.children) {
      node.toggled = toggled;
    }
    const dataSource = this.getDataSource(node);
    this.setState({ cursor: node, dataSource });
  }

  getDataSource(cursor) {
    let dataSource = [];

    if (cursor) {
      const excludes = ["toggled", "children", "name", "active"];
      let dateFields = ["生", "殁"];

      Object.entries(cursor).forEach((entry, index) => {
        if (!excludes.includes(entry[0])) {
          if (!Array.isArray(entry[1])) {
            let v = entry[1];
            if (dateFields.indexOf(entry[0]) > -1) {
              // console.log(entry[0]);
              v = translateDate(entry[1]) + "(" + entry[1] + ")";
              // console.log(v);
            }
            dataSource.push({
              key: index,
              name: entry[0],
              value: v
            });
          } else if (entry[0] !== "子") {
            const children = entry[1];
            let str = "";
            children.forEach((elm, index) => {
              str += ++index + ": [";
              Object.entries(elm).forEach(e => {
                let v = e[1];
                if (dateFields.indexOf(e[0]) > -1) {
                  v = translateDate(e[1]) + "(" + e[1] + ")";
                }
                str += e[0] + ":" + v + " ";
              });
              str += " ]  ";
            });

            dataSource.push({
              key: index,
              name: entry[0],
              value: str
            });
          }
        }
      });
    }
    return dataSource;
  }

  formatData(data) {
    let d = [];
    data.forEach(element => {
      let newData = element;
      if (element["子"]) {
        newData["children"] = this.formatData(element["子"]);
        newData["toggled"] = false;
      }

      newData["name"] = element["名"] || "未知姓名";
      d.push(newData);
    });
    return d;
  }

  loadData(yaml) {
    let data = {};
    try {
      this.nativeObject = YAML.parse(yaml);
      const myData = this.formatData(this.nativeObject);
      data["children"] = myData;
      data["name"] = "我的谱";
      data["toggled"] = true;
    } catch (e) {
      console.log(e);
      notification.open({
        placement: "bottomLeft",
        key: "editerror",
        message: "编辑出错了",
        description: "您输入的信息格式错误，请仔细检查"
      });
    }
    this.setState({ data });
  }

  componentWillReceiveProps(nextProps) {
    // console.log(nextProps);
    this.loadData(nextProps.yaml);
  }

  componentWillMount() {
    this.loadData(this.props.yaml);
  }

  render() {
    const columns = [
      {
        title: "字段",
        dataIndex: "name",
        key: "name"
      },
      {
        title: "值",
        dataIndex: "value",
        key: "value"
      }
    ];
    return (
      <Layout>
        <Sider width={400}>
          <Treebeard
            data={this.state.data}
            onToggle={this.onToggle.bind(this)}
          />
        </Sider>
        <Content>
          <Table columns={columns} dataSource={this.state.dataSource} />
        </Content>
      </Layout>
    );
  }
}

export default TreeParser;

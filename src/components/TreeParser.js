import React, { Component } from "react";
import YAML from "yamljs";
import { Treebeard } from "react-treebeard";
import { Table } from "antd";
import { Layout } from "antd";
import dateCaculators from "../library/dateCaculator";

const { Sider, Content } = Layout;
const { translateDate } = dateCaculators;

class TreeParser extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.data = {};
  }

  onToggle(node, toggled) {
    if (this.state.cursor) {
      this.setState({ cursor: { active: false } });
    }
    node.active = true;
    if (node.children) {
      node.toggled = toggled;
    }
    this.setState({ cursor: node });
  }

  getDataSource() {
    let dataSource = [];

    if (this.state.cursor) {
      const excludes = ["toggled", "children", "name", "active"];
      let dateFields = ["生", "殁"];

      Object.entries(this.state.cursor).forEach((entry, index) => {
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

  componentWillMount() {
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

    this.nativeObject = YAML.parse(this.props.yaml);
    const myData = formatData(this.nativeObject);
    this.data["name"] = "我的谱";
    this.data["toggled"] = true;
    this.data["children"] = myData;
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
          <Treebeard data={this.data} onToggle={this.onToggle.bind(this)} />
        </Sider>
        <Content>
          <Table columns={columns} dataSource={this.getDataSource()} />
        </Content>
      </Layout>
    );
  }
}

export default TreeParser;

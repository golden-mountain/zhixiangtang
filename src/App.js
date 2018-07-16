import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
// const YAML = require("yamljs");
import YAML from "yamljs";
import { Treebeard } from "react-treebeard";
import "antd/dist/antd.css";

import { cn } from "nzh";
import { Table } from "antd";
import { Layout } from "antd";

// import { pickBy } from "lodash";

const { Header, Sider, Content } = Layout;

function cacGanZhi(year) {
  const gs = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];

  const zs = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

  let gan = year % 10 - 3, zhi = year % 12 - 3;
  gan = gan > 0 ? gan : gan + 10;
  zhi = zhi > 0 ? zhi : zhi + 12;

  return gs[gan - 1] + zs[zhi - 1];
}

function transChineseNumber(num) {
  return cn.decodeS(num.replace("初", "").replace("正", "一"));
}

function caculateYear(year) {
  const map = {
    洪武: 1368,
    建文: 1399,
    永乐: 1402,
    洪熙: 1425,
    宣德: 1426,
    正统: 1436,
    景泰: 1450,
    天顺: 1457,
    成化: 1465,
    弘治: 1488,
    正德: 1506,
    嘉清: 1522,
    隆庆: 1567,
    万历: 1573,
    泰昌: 1620,
    天启: 1621,
    崇祯: 1628,
    顺治: 1644,
    康熙: 1661,
    雍正: 1722,
    乾隆: 1735,
    嘉庆: 1795,
    道光: 1820,
    咸丰: 1850,
    同治: 1861,
    光绪: 1875,
    宣统: 1908,
    民国: 1912,
    共和: 1949
  };

  const ganzhi = [
    "甲子",
    "乙丑",
    "丙寅",
    "丁卯",
    "戊辰",
    "己巳",
    "庚午",
    "辛未",
    "壬申",
    "癸酉",
    "甲戌",
    "乙亥",
    "丙子",
    "丁丑",
    "戊寅",
    "己卯",
    "庚辰",
    "辛巳",
    "壬午",
    "癸未",
    "甲申",
    "乙酉",
    "丙戌",
    "丁亥",
    "戊子",
    "己丑",
    "庚寅",
    "辛卯",
    "壬辰",
    "癸巳",
    "甲午",
    "乙未",
    "丙申",
    "丁酉",
    "戊戌",
    "己亥",
    "庚子",
    "辛丑",
    "壬寅",
    "癸卯",
    "甲辰",
    "乙巳",
    "丙午",
    "丁未",
    "戊申",
    "己酉",
    "庚戌",
    "辛亥",
    "壬子",
    "癸丑",
    "甲寅",
    "乙卯",
    "丙辰",
    "丁巳",
    "戊午",
    "己未",
    "庚申",
    "辛酉",
    "壬戌",
    "癸亥"
  ];

  let yearStart = 0, yearName = "", originIndex = 0, pos = 0, nianHao = "";
  Object.entries(map).forEach(entry => {
    pos = year.indexOf(entry[0]);
    if (pos > -1) {
      nianHao = entry[0];
      yearStart = entry[1];
      yearName = cacGanZhi(yearStart);
      originIndex = ganzhi.indexOf(yearName);
      return yearStart;
    }
  });

  let ganzhiCurrent = "", currentIndex = -1;
  Object.entries(ganzhi).forEach(entry => {
    if (year.indexOf(entry[1]) > -1) {
      currentIndex = entry[0];
      return currentIndex;
    }
  });

  if (currentIndex === -1) {
    let cnYear = year.slice(
      year.indexOf(nianHao) + nianHao.length,
      year.indexOf("年")
    );
    return yearStart + transChineseNumber(cnYear);
  } else {
    let yearGap = currentIndex - originIndex;
    return yearStart + (yearGap >= 0 ? yearGap : yearGap + 60);
  }
}

function cacMonth(date) {
  const month = date.slice(date.indexOf("年") + 1, date.indexOf("月"));

  return transChineseNumber(month);
}

function cacDay(date) {
  const day = date.slice(date.indexOf("月") + 1, date.indexOf("日"));

  return transChineseNumber(day);
}

function cacHour(date) {
  const hour = date.slice(date.indexOf("日") + 1, date.indexOf("时"));
  const zs = {
    子: "23:00-1:00",
    丑: "1:00-3:00",
    寅: "3:00-5:00",
    卯: "5:00-7:00",
    辰: "7:00-9:00",
    巳: "9:00-11:00",
    午: "11:00-13:00",
    未: "13:00-15:00",
    申: "15:00-17:00",
    酉: "17:00-19:00",
    戌: "19:00-21:00",
    亥: "21:00-23:00"
  };
  return zs[hour];
}

function translateDate(date) {
  return (
    caculateYear(date) +
    "/" +
    cacMonth(date) +
    "/" +
    cacDay(date) +
    " " +
    cacHour(date)
  );
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.data = {};
    this.onToggle = this.onToggle.bind(this);
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

    const nativeObject = YAML.parse(yaml);
    const myData = formatData(nativeObject);
    this.data["name"] = "文辉堂";
    this.data["toggled"] = true;
    this.data["children"] = myData;
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
          } else if (entry[0] != "子") {
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
    // console.log(dataSource);
    return dataSource;
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
        <Header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">至香堂演示代码</h1>
        </Header>
        <Layout>
          <Sider width={400}>
            <Treebeard data={this.data} onToggle={this.onToggle} />
          </Sider>
          <Content>
            <Table columns={columns} dataSource={this.getDataSource()} />
          </Content>
        </Layout>

      </Layout>
    );
  }
}

export default App;

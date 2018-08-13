import React, { Component } from "react";
import { Layout, Menu, Breadcrumb } from "antd";

const { Header, Content, Footer } = Layout;

class PTXLayout extends Component {
  render() {
    return (
      <Layout>
        <Header className="header">
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["2"]}
            style={{ lineHeight: "64px" }}
          >
            <Menu.Item key="1">首页</Menu.Item>
            <Menu.Item key="2">族谱</Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: "0 50px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>谱天下</Breadcrumb.Item>
            <Breadcrumb.Item>编辑</Breadcrumb.Item>
          </Breadcrumb>
          {this.props.children}
        </Content>
        <Footer style={{ textAlign: "center" }}>
          谱天下 ©2018 Created by Pu Tian Xia Corp
        </Footer>
      </Layout>
    );
  }
}

export default PTXLayout;

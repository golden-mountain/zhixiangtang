import React, { Component } from "react";
import { Layout, Menu, Breadcrumb } from "antd";
import { Link } from "react-router";

const { Header, Content, Footer } = Layout;

class PTXLayout extends Component {
  state = {
    current: "mail"
  };

  handleClick = e => {
    console.log("click ", e);
    this.setState({
      current: e.key
    });
  };

  render() {
    return (
      <Layout>
        <Header className="header">
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["1"]}
            style={{ lineHeight: "64px" }}
            onClick={this.handleClick}
            selectedKeys={[this.state.current]}
          >
            <Menu.Item key="1">
              <Link to="/">首页</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/editor">族谱</Link>
            </Menu.Item>
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

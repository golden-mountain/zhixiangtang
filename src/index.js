import React from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import "./styles/index.css";
import App from "./App";
import Editor from "./Editor";
import Code from "./Code";
import { Router, Route, IndexRoute, hashHistory } from "react-router";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={App} />
    </Route>
    <Route path="editor" component={Editor} />
    <Route path="code" component={Code} />
  </Router>,
  document.getElementById("root")
);
registerServiceWorker();

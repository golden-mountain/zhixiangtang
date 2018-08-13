import React from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import "./index.css";
import App from "./App";
import Editor from "./Editor";
import { Router, Route, IndexRoute, hashHistory } from "react-router";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={App} />
    </Route>
    <Route path="editor" component={Editor} />
  </Router>,
  document.getElementById("root")
);
registerServiceWorker();

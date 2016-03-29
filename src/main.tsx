/// <reference path="../typings/browser.d.ts" />
import "./scss/main.scss";
import "material-design-icons";
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as _ from "lodash";
import { App } from "./components/app";

function main(userbox: Element)
{
    var body = document.createElement("div");
    document.body.appendChild(body);
    body.className = `emes-root`;

    ReactDOM.render(<App userbox={userbox}/>, body);
}

main(document.querySelectorAll("div.userbox")[0]);

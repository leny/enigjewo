/* leny/enigjewo
 *
 * /src/app.js - Main entry point
 *
 * coded by leny@BeCode
 * started at 01/02/2021
 */

import {render} from "react-dom";

import "bulma";
import "core/sentry";

import Root from "./containers/root";

render(<Root />, document.querySelector("#app"));

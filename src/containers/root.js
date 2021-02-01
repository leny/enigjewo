/* leny/enigjewo
 *
 * /src/containers/root.js - Container: root
 *
 * coded by leny@BeCode
 * started at 01/02/2021
 */

import React from "react";

import Hello from "../components/commons/hello";

const RootContainer = () => {
    const name = "Enigjewo";

    return (
        <section className={"section"}>
            <div className={"container"}>
                <Hello name={name} primary />
            </div>
        </section>
    );
};

export default RootContainer;

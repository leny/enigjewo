/* leny/enigjewo
 *
 * /src/containers/root.js - Container: root
 *
 * coded by leny@BeCode
 * started at 01/02/2021
 */

import React, {useState} from "react";

import Hello from "../components/commons/hello";
import Button from "../components/commons/button";

const RootContainer = () => {
    const [name, setName] = useState("World");

    return (
        <section className={"section"}>
            <div className={"container"}>
                <Hello name={name} primary />
                <div>
                    <Button
                        label={"Who am I?"}
                        onClick={() => setName("Enigjewo")}
                    />
                </div>
            </div>
        </section>
    );
};

export default RootContainer;

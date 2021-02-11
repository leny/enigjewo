/* leny/enigjewo
 *
 * /src/components/game/loading.js - Game Component: loading
 *
 * coded by leny@BeCode
 * started at 11/02/2021
 */

import classnames from "classnames";

import Loading from "components/commons/loading";

const GameLoading = () => (
    <div className={classnames("columns", "is-centered")}>
        <div className={classnames("column", "is-two-thirds", "section")}>
            <div className={"card"}>
                <header
                    className={classnames(
                        "card-header",
                        "has-background-info",
                    )}>
                    <span
                        className={classnames(
                            "card-header-title",
                            "has-text-white",
                        )}>
                        {"Loading…"}
                    </span>
                </header>
                <div
                    className={classnames(
                        "card-content",
                        "py-5",
                        "has-text-centered",
                    )}>
                    <Loading variant={"info"} size={"large"} />
                </div>
            </div>
        </div>
    </div>
);

export default GameLoading;

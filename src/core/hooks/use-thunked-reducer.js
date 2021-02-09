/* leny/enigjewo
 *
 * /src/core/hooks/use-thunked-reducer.js - Custom hook: useThunkedReducer
 *
 * coded by leny@BeCode
 * started at 03/02/2021
 */

import {useReducer, useMemo} from "react";

export const useThunkedReducer = (...props) => {
    const [state, dispatch] = useReducer(...props);
    const thunkedDispatch = useMemo(
        () => action => {
            if (typeof action === "function") {
                action(thunkedDispatch);
            } else {
                dispatch(action);
            }
        },
        [dispatch],
    );

    return [state, thunkedDispatch];
};

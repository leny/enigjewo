/* leny/enigjewo
 *
 * /src/core/sentry.js - Sentry configuration
 *
 * coded by leny@BeCode
 * started at 14/02/2021
 */

import {SENTRY_DSN, USE_SENTRY} from "core/constants";
import * as Sentry from "@sentry/react";

if (USE_SENTRY) {
    Sentry.init({
        dsn: SENTRY_DSN,
    });
}

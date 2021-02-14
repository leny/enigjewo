/* leny/enigjewo
 *
 * /src/core/sentry.js - Sentry configuration
 *
 * coded by leny@BeCode
 * started at 14/02/2021
 */

import {SENTRY_DSN, USE_SENTRY} from "core/constants";
import * as Sentry from "@sentry/react";
import {Integrations} from "@sentry/tracing";

if (USE_SENTRY) {
    Sentry.init({
        dsn: SENTRY_DSN,
        integrations: [new Integrations.BrowserTracing()],
        tracesSampleRate: 0.1,
    });
}

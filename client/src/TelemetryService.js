import {ApplicationInsights, DistributedTracingModes} from '@microsoft/applicationinsights-web';
import {ReactPlugin} from '@microsoft/applicationinsights-react-js';

let reactPlugin = null;
let appInsights = null;

/**
 * Create the App Insights Telemetry Service
 * @return {{reactPlugin: ReactPlugin, appInsights: Object, initialize: Function}} - Object
 */
const createTelemetryService = () => {

    /**
     * Initialize the Application Insights class
     * @param {string} instrumentationKey - Application Insights Instrumentation Key
     * @param {Object} browserHistory - client's browser history, supplied by the withRouter HOC
     * @return {void}
     */
    const initialize = (instrumentationKey, browserHistory) => {
        if (!browserHistory) {
            throw new Error('Could not initialize Telemetry Service');
        }
        if (!instrumentationKey) {
            throw new Error('Instrumentation key not provided in ./src/telemetry-provider.jsx')
        }

        reactPlugin = new ReactPlugin();

        appInsights = new ApplicationInsights({
            config: {
                instrumentationKey: instrumentationKey,
                maxBatchInterval: 0,
                disableFetchTracking: false,
                distributedTracingMode: DistributedTracingModes.W3C,
                extensions: [reactPlugin],
                extensionConfig: {
                    [reactPlugin.identifier]: {
                        history: browserHistory
                    }
                }
            }
        });

        appInsights.loadAppInsights();

        //var telemetryInitializer = (envelope) => {
        //    // patch span as spanId (although not yet supported)
        //    envelope.tags["ai.operation.spanId"] = appInsights.context.telemetryTrace.spanID;
        //}

        var telemetryTraceContextInitializer = (envelope) => {
            const telemetryTraceContext = appInsights.context?.telemetryTrace;
            if (telemetryTraceContext !== undefined) {
                envelope.baseData = envelope.baseData ?? {};
                envelope.baseData.properties = envelope.baseData.properties ?? {};
                envelope.baseData.properties.TraceId = telemetryTraceContext.traceID ?? '';
                envelope.baseData.properties.SpanId = telemetryTraceContext.spanID ?? '';
                envelope.baseData.properties.ParentId = telemetryTraceContext.parentID ?? '';
            }
        }
        appInsights.addTelemetryInitializer(telemetryTraceContextInitializer);
    };

    return {reactPlugin, appInsights, initialize};
};

export const ai = createTelemetryService();
export const getAppInsights = () => appInsights;

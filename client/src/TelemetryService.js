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

        var telemetryTraceContextInitializer = (envelope) => {
            const telemetryTraceContext = appInsights.context?.telemetryTrace;
            if (telemetryTraceContext !== undefined) {
                // Add trace properties in the same format used by Microsoft.Extensions.Logging
                if (envelope.name === 'Microsoft.ApplicationInsights.{0}.RemoteDependency') {
                    envelope.baseData = envelope.baseData ?? {};
                    envelope.baseData.properties = envelope.baseData.properties ?? {};
                    envelope.baseData.properties.TraceId = telemetryTraceContext.traceID ?? '';
                    // For AppDependency, parentID is the parent and the span need to be parsed from ID
                    envelope.baseData.properties.SpanId = envelope.baseData.id?.slice(-17, -1) ?? '';
                    envelope.baseData.properties.ParentId = telemetryTraceContext.parentID ?? '';    
                } else {
                    envelope.baseData = envelope.baseData ?? {};
                    envelope.baseData.properties = envelope.baseData.properties ?? {};
                    envelope.baseData.properties.TraceId = telemetryTraceContext.traceID ?? '';
                    // AppInsights treats traces as children of the current span, so stores 
                    // current span-id in the parentID field.
                    // The startSpan() function then stores parent-id in the previousParentID field.
                    envelope.baseData.properties.SpanId = telemetryTraceContext.parentID ?? '';
                    envelope.baseData.properties.ParentId = telemetryTraceContext.previousParentID ?? '';    
                }
            }
        }
        appInsights.addTelemetryInitializer(telemetryTraceContextInitializer);
    };

    return {reactPlugin, appInsights, initialize};
};

export const ai = createTelemetryService();
export const getAppInsights = () => appInsights;

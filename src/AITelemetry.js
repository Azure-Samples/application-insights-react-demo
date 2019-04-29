import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { ReactPlugin } from '@microsoft/applicationinsights-react-js';

class AITelemetry {

    constructor() {
        this.reactPlugin = new ReactPlugin();
    }

    initialize(reactPluginConfig) {
        let INSTRUMENTATION_KEY = '4a795cb3-5b9e-4428-8777-0441b7ae7dc8'; // Enter your instrumentation key here
        
        this.appInsights = new ApplicationInsights({
            config: {
                instrumentationKey: INSTRUMENTATION_KEY,
                maxBatchInterval: 0,
                disableFetchTracking: false,
                extensions: [this.reactPlugin],
                extensionConfig: {
                    [this.reactPlugin.identifier]: reactPluginConfig
                }
            }
        });
        this.appInsights.loadAppInsights();
    }
}

export let ai = new AITelemetry();
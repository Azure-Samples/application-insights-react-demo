import React from 'react';
import { withAITracking } from '@microsoft/applicationinsights-react-js';
import { ai } from './TelemetryService';

class TestComponent extends React.Component {

    render() {
        return (
            <div className="App">
                Test Component
          </div>
        ); 
    }
}

export default withAITracking(ai.reactPlugin, TestComponent, "prrt");

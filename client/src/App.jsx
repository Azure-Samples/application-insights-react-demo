/*global globalConfig*/
import React, { useState } from 'react';
import {BrowserRouter, Link, Route} from 'react-router-dom';
import {SeverityLevel, Util, ITraceTelemetry} from '@microsoft/applicationinsights-web';
import {TelemetryTrace} from '@microsoft/applicationinsights-properties-js';
import './App.css';
import { getAppInsights } from './TelemetryService';
import TelemetryProvider from './telemetry-provider';
import { Initialization } from '@microsoft/applicationinsights-web/dist-esm/Initialization';

const instrumentationKey = globalConfig.ApplicationInsights.InstrumentationKey;

const Home = () => (
    <div>
        <h2>Home Page</h2>
    </div>
);

const About = () => (
    <div>
        <h2>About Page</h2>
    </div>
);

const Header = () => (
    <ul>
        <li>
            <Link to="/">Home</Link>
        </li>
        <li>
            <Link to="/about">About</Link>
        </li>
    </ul>
);

const TableData = (props) => !props.forecasts 
    ? null
    : props.forecasts.map((forecast, index) =>
        (
            <tr key={forecast.date}>
                <td>{forecast.date}</td>
                <td>{forecast.temperatureC}</td>
                <td>{forecast.summary}</td>
            </tr>
        )
    );

const App = () => {
    const categoryName = 'Demo.Client.App';

    const [appInsights, setAppInsights] = useState();

    const [state, setState] = useState({ 
        counter: 0,
        forecasts: []
    });

    function initAppInsights(){
        if (! appInsights) {
            console.log('Init appInsights');
            const newAppInsights = getAppInsights();
            setAppInsights(newAppInsights);
        }
    }

    function startActivity(operationName, parentActivity) {
        const traceId = parentActivity !== undefined ? parentActivity.traceID : Util.generateW3CId();
        const parentId = parentActivity !== undefined ? parentActivity.spanID : '0000000000000000';
        const telementryTraceContext = new TelemetryTrace(traceId, parentId, operationName);

        // patch in the span ID for this operation
        const spanId = Util.generateW3CId().substring(0, 16);
        telementryTraceContext.spanID = spanId;
        // until spanId is actually supported, overwrite name
        telementryTraceContext.name = spanId;

        // set the context
        appInsights.context.telemetryTrace = telementryTraceContext;
        return telementryTraceContext;
    }

    function addCategory(properties) {
        properties.CategoryName = categoryName;
        return properties;
    }

    function addTraceContext(properties) {
        properties.TraceId = appInsights.context.telemetryTrace.traceID;
        properties.SpanId = appInsights.context.telemetryTrace.spanID;
        properties.ParentId = appInsights.context.telemetryTrace.parentID;
        return properties;
    }

    function trackException() {
        appInsights.trackException({ error: new Error('some error'), severityLevel: SeverityLevel.Error });
    }

    function trackTrace() {
        console.log(`traceID=${appInsights.context.telemetryTrace.traceID}, parentID=${appInsights.context.telemetryTrace.parentID}`)
        appInsights.trackTrace({ message: 'some trace', severityLevel: SeverityLevel.Information });
    }

    function trackEvent() {
        appInsights.trackEvent({ name: 'some event' });
    }

    function throwError() {
        let foo = {
            field: { bar: 'value' }
        };

        // This will crash the app; the error will show up in the Azure Portal
        return foo.fielld.bar;
    }

    function ajaxRequest() {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://httpbin.org/status/200');
        xhr.send();
    }

    function fetchRequest() {
        fetch('https://httpbin.org/status/200');
    }

    function increaseCounter() {
        startActivity('increaseCounter');
        console.log(`traceID=${appInsights.context.telemetryTrace.traceID}, spanId=${appInsights.context.telemetryTrace.spanID}, parentID=${appInsights.context.telemetryTrace.parentID}`)

        const properties = addTraceContext(addCategory({}));
        appInsights.trackTrace({ message: `Counter increase called`, severityLevel: SeverityLevel.Information, properties });

        const newCounter = state.counter + 1;
        setState({ ...state, counter: newCounter });

        afterIncreaseCounter();
    }

    function afterIncreaseCounter() {
        // Child activity (child span)
        startActivity('afterIncreaseCounter', appInsights.context.telemetryTrace);
        console.log(`traceID=${appInsights.context.telemetryTrace.traceID}, spanId=${appInsights.context.telemetryTrace.spanID}, parentID=${appInsights.context.telemetryTrace.parentID}`)

        const properties = addTraceContext(addCategory({ counter: state.counter }));
        appInsights.trackTrace({ message: `Counter increased to ${state.counter}`, 
            severityLevel: SeverityLevel.Information, properties });
    }

    function callServer() {
        startActivity('callServer');
        console.log(`traceID=${appInsights.context.telemetryTrace.traceID}, spanId=${appInsights.context.telemetryTrace.spanID}, parentID=${appInsights.context.telemetryTrace.parentID}`)

        const properties = addTraceContext(addCategory({}));
        appInsights.trackTrace({ message: 'CLIENT: Fetching weather forecast', severityLevel: SeverityLevel.Information, properties });
        fetch('weatherforecast')
            .then(response =>
                response.ok
                    ? response.json()
                    : Promise.reject(`API error: ${response.statusText}`)
            )
            .then(data => {
                const properties = addTraceContext(addCategory({ forecastCount: data.length }));
                appInsights.trackTrace({ message: `CLIENT: Weather forecast received with ${data.length} items`, 
                    severityLevel: SeverityLevel.Information, properties });
                setState({ ...state, forecasts: data })
            });
    }

    function trackSequence() {
        console.log('trackSequence')

        startActivity('trackSequence');
        console.log(`traceID=${appInsights.context.telemetryTrace.traceID}, spanId=${appInsights.context.telemetryTrace.spanID}, parentID=${appInsights.context.telemetryTrace.parentID}`)

        // ITraceTelemetry
        const trace1 = { message: '1. trackSequence', severityLevel: SeverityLevel.Information, properties: { prop1: 'Prop 1' }};
        const customProperties1 = { custom1: 'Custom 1' };
        appInsights.trackTrace(trace1, customProperties1);

        appInsights.startTrackPage('2. Page');
        appInsights.startTrackEvent('3. Event');

        // IPageViewTelemetry
        const pageView4 = { name: '4. Page', uri: 'http://localhost/4', refUri: 'http://localhost/4ref', pageType: 'type4', isLoggedIn: false, properties: { duration: 4, prop4: 'Prop 4' } }
        const customProperties4 = { custom4: 'Custom 4' };
        appInsights.trackPageView(pageView4, customProperties4);

        // IEventTelemetry
        const event5 = { name: '5. event', properties: { prop5: 'Prop 5' }};
        const customProperties5 = { custom5: 'Custom 5' };
        appInsights.trackEvent(event5, customProperties5);

        // IExceptionTelementry
        const exception6 = { id: '6. exception', exception: new Error('Error 6'), severityLevel: SeverityLevel.Error, properties: { prop6: 'Prop 6' }};
        const customProperties6 = { custom6: 'Custom 6' };
        appInsights.trackException(exception6, customProperties6);

        // IMetricTelemetry
        const metric7 = { name: '7. metric', average: 7, sampleCount: 17, min: 3.5, max: 14, properties: { prop7: 'Prop 7' }};
        const customProperties7 = { custom7: 'Custom 7' };
        appInsights.trackMetric(metric7, customProperties7);

        const trace8 = { message: '8. trace', severityLevel: SeverityLevel.Warning, properties: { prop8: 'Prop 8' }};
        const customProperties8 = { custom1: 'Custom 8' };
        appInsights.trackTrace(trace8, customProperties8);

        fetch('weatherforecast')
        .then(response =>
            response.ok
                ? response.json()
                : Promise.reject(`API error: ${response.statusText}`)
        )
        .then(data => {
            appInsights.trackTrace({ message: '8(b): fetch completed', severityLevel: SeverityLevel.Information, properties: { prop8b: 'Prop 8(b)' }});
            setState({ ...state, forecasts: data })
        });

        const trace9 = { message: '9. after fetch', severityLevel: SeverityLevel.Information, properties: { prop9: 'Prop 9' }};
        appInsights.trackTrace(trace9);

        const properties3x = { stopProp3: 'Stop Prop 3' }
        const measurements3x = { measure3x: 3 }
        appInsights.stopTrackEvent('3. Event', properties3x, measurements3x);

        const customProperties2x = { stopCustom2: 'Stop Custom 2' };
        appInsights.stopTrackPage('2. Page', 'http://localhost/stop2', customProperties2x);

        const trace99 = { message: '99. end trackSequence', severityLevel: SeverityLevel.Information, properties: { prop99: 'Prop 99' }};
        const customProperties99 = { custom99: 'Custom 99' };
        appInsights.trackTrace(trace99, customProperties99);
    }

    return (
      <BrowserRouter>
        <TelemetryProvider instrumentationKey={instrumentationKey} after={() => { initAppInsights() }}>
          <div >
            <Header />
            <Route exact path="/" component={Home} />
            <Route path="/about" component={About} />
          </div>
          <div className="App">
            <button onClick={trackException}>Track Exception</button>
            <button onClick={trackEvent}>Track Event</button>
            <button onClick={trackTrace}>Track Trace</button>
            <button onClick={throwError}>Autocollect an Error</button>
            <button onClick={ajaxRequest}>Autocollect a Dependency (XMLHttpRequest)</button>
            <button onClick={fetchRequest}>Autocollect a dependency (Fetch)</button>
            <button onClick={increaseCounter}>Increase counter</button>
            <button onClick={callServer}>Call server</button>
            <button onClick={trackSequence}>Track sequence</button>
          </div>
          <div>
            <span>Counter: {state.counter}</span>
          </div>
          <div>
            <table className='table table-striped' aria-labelledby="tabelLabel">
              <thead>
                <tr>
                    <th>Date</th>
                    <th>Temp. (C)</th>
                    <th>Summary</th>
                </tr>
              </thead>
              <tbody>
                <TableData forecasts={state.forecasts} />
              </tbody>
            </table>
          </div>
        </TelemetryProvider>
      </BrowserRouter>
    );
};

export default App;

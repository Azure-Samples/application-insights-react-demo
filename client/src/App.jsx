/*global globalConfig*/
import React, { useState } from 'react';
import {BrowserRouter, Link, Route} from 'react-router-dom';
import {SeverityLevel, Util} from '@microsoft/applicationinsights-web';
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
        // start new trace
        const traceId = Util.generateW3CId();
        const spanId = Util.generateW3CId().substring(0, 16);
        appInsights.context.telemetryTrace = new TelemetryTrace(traceId, '0000000000000000', spanId)
        console.log(`traceID=${appInsights.context.telemetryTrace.traceID}, name=${appInsights.context.telemetryTrace.name}, parentID=${appInsights.context.telemetryTrace.parentID}`)

        const newCounter = state.counter + 1;
        setState({ ...state, counter: newCounter });
        let properties = { counter: newCounter };
        appInsights.trackTrace({ message: `Counter increased to ${newCounter}`, 
            severityLevel: SeverityLevel.Information, properties });
    }

    function callServer() {
        // start new trace
        const traceId = Util.generateW3CId();
        const spanId = Util.generateW3CId().substring(0, 16);
        appInsights.context.telemetryTrace = new TelemetryTrace(traceId, '0000000000000000', spanId)
        console.log(`traceID=${appInsights.context.telemetryTrace.traceID}, name=${appInsights.context.telemetryTrace.name}, parentID=${appInsights.context.telemetryTrace.parentID}`)

        appInsights.trackTrace({ message: 'CLIENT: Fetching weather forecast', severityLevel: SeverityLevel.Information });
        fetch('weatherforecast')
            .then(response =>
                response.ok
                    ? response.json()
                    : Promise.reject(`API error: ${response.statusText}`)
            )
            .then(data => {
                const properties = { forecastCount: data.length }
                appInsights.trackTrace({ message: `CLIENT: Weather forecast received with ${data.length} items`, 
                    severityLevel: SeverityLevel.Information, properties });
                setState({ ...state, forecasts: data })
            });
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

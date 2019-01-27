import React from 'react';
import { SeverityLevel } from '@microsoft/applicationinsights-web';
import { ReactAI, withAITracking } from "react-appinsights";
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import './App.css';

const history = createBrowserHistory()
let INSTRUMENTATION_KEY = '4a795cb3-5b9e-4428-8777-0441b7ae7dc8'; // Enter your instrumentation key here

ReactAI.initialize({
  instrumentationKey: INSTRUMENTATION_KEY,
  maxBatchInterval: 0,
  history: history 
});
var appInsights = ReactAI.rootInstance;

class App extends React.Component {

  trackException() {
    appInsights.trackException({error: new Error('some error'), severityLevel: SeverityLevel.Error});
  }

  trackTrace() {
    appInsights.trackTrace({message: 'some trace', severityLevel: SeverityLevel.Information});
  }

  trackEvent() {
    appInsights.trackEvent({name: 'some event'});
  }

  throwError() {
    // This will crash the app; the error will show up in the Azure Portal
    let foo = window['a']['b'];
    console.log(foo);
  }

  ajaxRequest() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://httpbin.org/status/200');
    xhr.send();
  }

  render() {
    return (
      <Router history={history}>
        <div className="App">
          <button onClick={this.trackException}>Track Exception</button>
          <button onClick={this.trackEvent}>Track Event</button>
          <button onClick={this.trackTrace}>Track Trace</button>
          <button onClick={this.throwError}>Autocollect an Error</button>
          <button onClick={this.ajaxRequest}>Autocollect a request</button>
        </div>
      </Router>
    );
  }
}

export default withAITracking(App);

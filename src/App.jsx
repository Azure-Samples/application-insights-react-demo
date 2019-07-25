import React from 'react';
import { SeverityLevel } from '@microsoft/applicationinsights-web';
import { Router, Route, Link } from "react-router-dom";
import TestComponent from './TestComponent';
import './App.css';
import { createBrowserHistory } from "history";
import { ai } from './TelemetryService';

const history = createBrowserHistory({ basename: '' });
ai.initialize({ history: history });

class App extends React.Component {

  trackException() {
    ai.appInsights.trackException({ error: new Error('some error'), severityLevel: SeverityLevel.Error });
  }

  trackTrace() {
    ai.appInsights.trackTrace({ message: 'some trace', severityLevel: SeverityLevel.Information });
  }

  trackEvent() {
    ai.appInsights.trackEvent({ name: 'some event' });
  }

  throwError() {
    let foo = {
      field: { bar: 'value' }
    };
    
    // This will crash the app; the error will show up in the Azure Portal
    return foo.fielld.bar;
  }

  ajaxRequest() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://httpbin.org/status/200');
    xhr.send();
  }

  fetchRequest() {
    fetch('https://httpbin.org/status/200');
  }

  render() {
    return (<Router history={history}>
      <div >
        <Header />
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
      </div>
      <div className="App">
        <button onClick={this.trackException}>Track Exception</button>
        <button onClick={this.trackEvent}>Track Event</button>
        <button onClick={this.trackTrace}>Track Trace</button>
        <button onClick={this.throwError}>Autocollect an Error</button>
        <button onClick={this.ajaxRequest}>Autocollect a Dependency (XMLHttpRequest)</button>
        <button onClick={this.fetchRequest}>Autocollect a dependency (Fetch)</button>
      </div>
    </Router>
    );
  }
}

class Home extends React.Component {
  render() {
    return <div>
      <h2>Home Page</h2>
      <TestComponent />
    </div>;
  }
}


class About extends React.Component {
  render() {
    return <div>
      <h2>About Page</h2>
      <TestComponent />
    </div>;
  }
}

class Header extends React.Component {
  render() {
    return (
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
      </ul >
    );
  }
}

export default App;

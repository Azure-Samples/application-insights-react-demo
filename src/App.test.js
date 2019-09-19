import React from 'react';
import ReactDOM from 'react-dom';
import {act} from 'react-dom/test-utils';
import App from './App';

jest.mock('@microsoft/applicationinsights-react-js', () => ({
  withAITracking: (reactPlugin, Component) => (Component),
}));

it('renders without crashing', () => {
  const div = document.createElement('div');
  act(() => {
    ReactDOM.render(<App />, div);
  });
  ReactDOM.unmountComponentAtNode(div);
});

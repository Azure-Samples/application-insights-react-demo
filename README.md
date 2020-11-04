---
page_type: sample
languages:
- javascript
- html
products:
- azure
description: "Microsoft Application Insights JavaScript SDK Sample"
urlFragment: application-insights-react-demo
---

# Microsoft Application Insights JavaScript SDK Sample
[![Build Status](https://travis-ci.org/Azure-Samples/application-insights-react-demo.svg?branch=master)](https://travis-ci.org/Azure-Samples/application-insights-react-demo)

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).


## Infrastructure

Pre-requisites:

* PowerShell, https://github.com/PowerShell/PowerShell
* Azure CLI, https://docs.microsoft.com/en-us/cli/azure

To create a Log Analytics Workspace and linked Application Insights instance,
run the following with the subscription where to create the resources.

```
az login
./infrastructure/Deploy-Infrastructure.ps1 'YOUR-AZURE-SUBSCRIPTION' 'demo'
```

The scripts will output the Instrumentation Key needed for the apps.


## Client App

Pre-requisites:

* Node.js

Update the `client/src/App.jsx` file with your Instrumentation Key.

In the project directory, you can run:

### `npm install --prefix client`

Installs dependencies. You can also use `yarn install`.

### `npm start --prefix client`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.


## Server App

Pre-requisites:

* Dotnet Core 3.1 or higher

Update the `server/Demo.Api/appsettings.json` file with your Instrumentation Key.

To start the server:

```
dotnet run --project server/Demo.Api
```

## View Results


## Other Scripts

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

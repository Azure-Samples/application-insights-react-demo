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

The following commands will create a Log Analytics Workspace and linked 
Application Insights instance in your default subscription. (You can also
pass in a different subscription if you want.)

```
az login
$defaultSubscription = (az account show | ConvertFrom-Json).id
./infrastructure/deploy-infrastructure.ps1 $defaultSubscription demo
```

The scripts will output the Instrumentation Key needed for the apps.

By default the scripts will create resources in WestUS in a resource group
named 'aird-demo' (this can be changed in the variables). Azure CLI commands
are (mostly) idempotent, so you can re-run the scripts as needed.


## Client App

Most of the functionality can be demonstrated with just the client.

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

Log in to Azure Portal, https://portal.azure.com/

Open the Log Analytics workspace that was created. The default will be under
Home > Resource groups > aird-demo > aird-demo-logs

Select General > Logs from the left. Dismiss the Queries popup to get to an empty editor.

Note that you may have to wait a bit for logs to be injested and appear in the workspace.

To see the events corresponding to the buttons in the sample app, you can use the following query:

```
union App*
| where TimeGenerated  > ago(1h)
| sort by TimeGenerated desc
| project TimeGenerated, Type, SeverityLevel, Name, Message, ExceptionType, DependencyType, OperationName, OperationId, ParentId, SessionId, UserId, ClientType, Id
```

You can also look at each individual type (table) of log entry, with the default columns for each type showing the relevant information.

```
AppExceptions
| where TimeGenerated  > ago(1h)
| sort by TimeGenerated desc
```

If you are looking at traces, you can exclude the Microsoft auto-generate ones:

```
AppTraces
| where TimeGenerated  > ago(1h) and Properties.CategoryName !startswith "Microsoft"
| sort by TimeGenerated desc
```

As well as the button events (AppDependencies, AppEvents, AppExceptions, AppTraces), you can also query automatically collected metrics (AppPageViews, AppBrowserTimings):

```
AppPageViews
| where TimeGenerated  > ago(1h)
| sort by TimeGenerated desc
```


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

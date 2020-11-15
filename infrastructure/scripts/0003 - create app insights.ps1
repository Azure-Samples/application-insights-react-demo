#!/usr/bin/env pwsh
Write-Verbose "Creating app insights"
az extension add -n application-insights

$ai = az monitor app-insights component create `
  --app $AppInsightsName `
  --subscription $SubscriptionId `
  -g $ResourceGroup `
  --location $Location `
  --workspace $LogAnalyticsWorkspaceName | ConvertFrom-Json

# copy the key into another variable, to ensure the property is dereferenced when passing to
# the az command line
$aiKey = $ai.instrumentationKey

Write-Verbose "Client App Instrumentation key: $aiKey"

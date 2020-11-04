#!/usr/bin/env pwsh
Write-Verbose "Creating log analytics workspace"

az monitor log-analytics workspace create `
  --subscription $SubscriptionId `
  --resource-group $ResourceGroup `
  -l $Location `
  --workspace-name $LogAnalyticsWorkspaceName

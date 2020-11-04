#!/usr/bin/env pwsh

az group create `
  -g $ResourceGroup `
  -l $Location `
  --subscription $SubscriptionId

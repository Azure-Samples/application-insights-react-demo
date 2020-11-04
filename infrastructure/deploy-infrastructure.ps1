#!/usr/bin/env pwsh
[CmdletBinding()]
param (
    [Parameter(Mandatory=$true)]
    [string]$SubscriptionId,
    [string]$EnvironmentName = 'demo'
)

# Pre-requisites:
#
# Running these scripts requires the following to be installed:
# * PowerShell, https://github.com/PowerShell/PowerShell
# * Azure CLI, https://docs.microsoft.com/en-us/cli/azure
#
# You also need to run `az login` to authenticate
#
# To see messages, set verbose preference before running:
#   $VerbosePreference = 'Continue'
#   ./Deploy-Infrastructure.ps1 'dev'

$ErrorActionPreference="Stop"

$global:SubscriptionId = $SubscriptionId

# Call the utils script to initialize all the azure resource names etc
. "$PSScriptRoot\set-variables.ps1"
Set-Variables $EnvironmentName

Get-ChildItem "$PSScriptRoot/scripts" -Filter '*.ps1' `
    | ForEach-Object { Write-Verbose "Running $($_.Name)"; & $_.FullName; }

Write-Verbose "Deployment Complete"
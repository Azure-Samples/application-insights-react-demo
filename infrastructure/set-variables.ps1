function Set-Variables
{
  [CmdletBinding()]
  param([parameter(Mandatory)][string]$EnvironmentName)

  if ($EnvironmentName -eq "demo")
  {
    $global:Location = 'westus'
    $global:ResourceGroup='aird-demo'
    $global:LogAnalyticsWorkspaceName='aird-demo-logs'
    $global:AppInsightsName='aird-demo-app-insights'
  }
  else
  {
    Write-Error "Unrecognized environment name, cannot infer other variable values"
  }
}

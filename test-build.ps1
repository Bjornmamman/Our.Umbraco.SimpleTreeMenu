# Local test build of the library across all target frameworks.
#
# Lets you test different versions without creating a release
# tag or pushing anything to NuGet.
#
# Examples:
#   ./test-build.ps1 -Version 4.3.0   # exercises the pre-v5 (content) packing path
#   ./test-build.ps1 -Version 5.0.0   # exercises the v5+ (static web assets) path
#   ./test-build.ps1 -Version 5.0.0 -Framework net8.0   # single framework only

[CmdletBinding()]
param(
	[Parameter(Mandatory = $true)]
	[string]$Version,

	[string]$Framework,

	[string]$Config = 'release',

	[string]$LibraryFolder = './src/TreeMenu',

	[string]$Output = './Output'
)

$ErrorActionPreference = 'Stop'

# Mirror the version-based TFM split in the csproj:
#   v4 (AngularJS) -> net472-net8.0 (Umbraco 8-13)
#   v5 (Lit)       -> net9.0-net10.0 (Umbraco 16+)
$versionCore = ($Version -split '[-+]', 2)[0]

try {
	$parsedVersion = [version]$versionCore
}
catch {
	throw "Version '$Version' is not valid. Expected a version such as '5.0.0' or '5.0.0-beta'."
}

$isLowerThanV5 = $parsedVersion -lt [version]'5.0.0'
$versionFrameworks = if ($isLowerThanV5) {
	@('net472', 'net5.0', 'net6.0', 'net7.0', 'net8.0')
} else {
	@('net9.0', 'net10.0')
}

if ($Framework) {
	if ($versionFrameworks -notcontains $Framework) {
		Write-Error "Framework '$Framework' is not valid for version $Version. Valid values: $($versionFrameworks -join ', ')"
	}
	$frameworks = @($Framework)
}
else {
	$frameworks = $versionFrameworks
}

Write-Host "Building $Version ($(if ($isLowerThanV5) { 'pre-v5 AngularJS content packaging' } else { 'v5+ Lit static web assets packaging' })) for $($frameworks -join ', ')" -ForegroundColor Cyan

$failed = @()

# Validate that each target framework builds. A NuGet package is a single artifact
# containing ALL TFMs plus the Lit static web assets, so we pack once below rather
# than per-TFM (a single-TFM pack runs an inner build, which neither triggers the
# Lit client build nor collects the static web assets).
foreach ($tfm in $frameworks) {
	Write-Host "`n=== build $tfm ===" -ForegroundColor Cyan
	dotnet build $LibraryFolder -c $Config -f $tfm /p:version=$Version
	if ($LASTEXITCODE -ne 0) { $failed += $tfm }
}

if ($failed.Count -eq 0) {
	Write-Host "`n=== pack (all frameworks) ===" -ForegroundColor Cyan
	dotnet pack $LibraryFolder -c $Config -o "$Output/$Version" /p:version=$Version
	if ($LASTEXITCODE -ne 0) { $failed += 'pack' }
}

Write-Host ''
if ($failed.Count -gt 0) {
	Write-Host "FAILED: $($failed -join ', ')" -ForegroundColor Red
	exit 1
}

Write-Host "Built successfully. Package in $Output/$Version" -ForegroundColor Green

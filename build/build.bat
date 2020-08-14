::dotnet pack ..\src\TreeMenu.sln -o "..\release" -c release -p:Version=0.4
nuget pack package.nuspec -OutputDirectory ".\build" -Version 1.0
umbpack pack .\package.xml -o "..\release" -v 1.0
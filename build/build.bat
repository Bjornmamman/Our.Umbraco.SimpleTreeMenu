::dotnet pack ..\src\TreeMenu.sln -o "..\release" -c release -p:Version=0.4
nuget pack package.nuspec -OutputDirectory ".\build" -Version 0.4
umbpack pack .\package.xml -o "..\release" -v 0.4
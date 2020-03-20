cd SchedulemateClient
invoke-expression 'cmd /c start powershell -Command { npm run watch }' 
Start-Sleep -Seconds 5
cd ..\SchedulemateServer
node server.js

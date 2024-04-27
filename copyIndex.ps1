# Copy src\404.html to 404.html
Copy-Item -Path "src\404.html" -Destination "build\404.html" -Force
Write-Output "src\404.html was copied to build\404.html"

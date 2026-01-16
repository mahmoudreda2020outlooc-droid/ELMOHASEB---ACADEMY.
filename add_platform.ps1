$Endpoint = "https://fra.cloud.appwrite.io/v1"
$ProjectID = "69662d2200214465b1d3"
$APIKey = "standard_fa9eb14506d4d0792498385393220a1f90f5f4749a0772c06f1c7e51fc48a4e90eb07260afc70482f616955038649a3b3ae0f3bbdc08dec5090bb8057fb51b672b1d3767ca9349af5817c238dff09a61a669b164562829bdb896d9b94222c902d810bf17b6c2b288af3ac16a624d51d4e0634b09f7e01685cbd844b5651e7aab"

$Headers = @{
    "Content-Type"       = "application/json"
    "X-Appwrite-Project" = $ProjectID
    "X-Appwrite-Key"     = $APIKey
}

Write-Host "Attempting to add localhost platform..." -ForegroundColor Cyan

$body = @{
    type     = "web"
    name     = "Localhost Auto"
    hostname = "localhost"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$Endpoint/projects/$ProjectID/platforms" -Method Post -Headers $Headers -Body $body
    Write-Host "SUCCESS: Added localhost platform." -ForegroundColor Green
}
catch {
    $err = $_.Exception.Message
    if ($err -match "409") {
        Write-Host "INFO: Platform already exists (Conflict 409). This is good." -ForegroundColor Yellow
    }
    else {
        Write-Host "FAILED: $err" -ForegroundColor Red
    }
}

$Endpoint = "https://fra.cloud.appwrite.io/v1"
$ProjectID = "69662d2200214465b1d3"
$DatabaseID = "MainDatabase"
$CollectionID = "security_logs"
$APIKey = "standard_fa9eb14506d4d0792498385393220a1f90f5f4749a0772c06f1c7e51fc48a4e90eb07260afc70482f616955038649a3b3ae0f3bbdc08dec5090bb8057fb51b672b1d3767ca9349af5817c238dff09a61a669b164562829bdb896d9b94222c902d810bf17b6c2b288af3ac16a624d51d4e0634b09f7e01685cbd844b5651e7aab"

$Headers = @{
    "Content-Type"       = "application/json"
    "X-Appwrite-Project" = $ProjectID
    "X-Appwrite-Key"     = $APIKey
}

Write-Host "Connecting to Appwrite..."

$body = @{
    documentId = "TEST_SERVER_LOG"
    data       = @{
        userId    = "SYSTEM_ADMIN"
        action    = "SERVER_TEST"
        details   = "Verifying database connection from PowerShell"
        timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    }
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$Endpoint/databases/$DatabaseID/collections/$CollectionID/documents" -Method Post -Headers $Headers -Body $body
    Write-Host "✅ SUCCESS: Log written to database." -ForegroundColor Green
    Write-Host "Document ID: $($response.'$id')"
}
catch {
    Write-Host "❌ FAILED" -ForegroundColor Red
    Write-Host $_.Exception.Message
}

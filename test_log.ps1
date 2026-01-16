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

Write-Host "Testing Connection to Appwrite Database..." -ForegroundColor Cyan

# 1. Create a dummy log document
$logData = @{
    documentId = [Guid]::NewGuid().ToString().Replace("-", "").Substring(0, 20)
    data       = @{
        userId    = "TEST_USER_PS1"
        action    = "POWERSHELL_TEST"
        details   = "Testing direct connection bypassing browser"
        timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss")
    }
} | ConvertTo-Json -Depth 5

try {
    Write-Host "Sending Log Entry..." -NoNewline
    $response = Invoke-RestMethod -Uri "$Endpoint/databases/$DatabaseID/collections/$CollectionID/documents" -Method Post -Headers $Headers -Body $logData
    
    Write-Host " SUCCESS! [Green]" -ForegroundColor Green
    Write-Host "Log Created with ID: $($response.'$id')" -ForegroundColor Gray
    Write-Host "`n--------------------------------------------------"
    Write-Host "✅ الخلاصة:" -ForegroundColor Yellow
    Write-Host "قاعدة البيانات شغالة 100% وبتستقبل المخالفات." -ForegroundColor Green
    Write-Host "المشكلة الحالية هي إن المتصفح (Browser) هو اللي رافض يبعت بسبب طريقة فتح الملف." 
    Write-Host "لازم تستخدم Live Server."
    Write-Host "--------------------------------------------------" -ForegroundColor Gray

    # Pause
    Read-Host "Press Enter to exit..."
}
catch {
    Write-Host " FAILED! [Red]" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Message -match "404") {
        Write-Host "Hint: Collection ID or Database ID might be wrong." -ForegroundColor Gray
    }
    Read-Host "Press Enter to exit..."
}

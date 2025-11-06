# ============================================
# IYOMEAFRICA | FANTASYSLOT DEPLOY SCRIPT
# by Yumsie MarieClaire Iyome
# ============================================

# Header
Clear-Host
Write-Host ""
Write-Host "🚀 Launching FantasySlot Firebase Deployment..." -ForegroundColor Green
Write-Host "Powered by IYOMETV | IYOMEAFRICA" -ForegroundColor Cyan
Write-Host "==============================================="

# Step 1: Move to project directory
$projectPath = "C:\Users\Yumsie\Desktop\YUMSIE_IYOME_CINEMATIC_UNIVERSE_PACK_FINAL_MASTER_BY_YUMSIE_IYOME\FantasySlot"
Set-Location $projectPath
Write-Host "`n📂 Current Directory: $projectPath" -ForegroundColor Yellow

# Step 2: Open VS Code
Write-Host "`n🧠 Opening Visual Studio Code..." -ForegroundColor Cyan
Start-Process code .

# Step 3: Firebase Login (optional)
Write-Host "`n🔐 Checking Firebase Login..."
firebase login

# Step 4: Show animated progress bar during deployment
Write-Host "`n🔥 Deploying to Firebase Hosting..." -ForegroundColor Yellow
for ($i = 0; $i -le 100; $i += 2) {
    Write-Progress -Activity "Uploading Files to Firebase..." -Status "$i% Complete" -PercentComplete $i
    Start-Sleep -Milliseconds 100
}

# Step 5: Deploy command
firebase deploy

# Step 6: Success Animation
for ($i = 0; $i -lt 3; $i++) {
    Write-Host "✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨" -ForegroundColor Green
    Start-Sleep -Milliseconds 200
}

# Step 7: Play a short beep sound (Success)
[console]::beep(880,500)
[console]::beep(988,500)
[console]::beep(1047,500)

# Step 8: Final Message
Write-Host "`n✅ FantasySlot successfully deployed!" -ForegroundColor Green
Write-Host "🌍 Visit your live URL on Firebase Hosting" -ForegroundColor Cyan
Write-Host "==============================================="
Pause

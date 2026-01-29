# GitHub에 자동으로 푸시하는 PowerShell 스크립트

$GITHUB_USERNAME = Read-Host "GitHub 사용자명 입력"
$REPO_NAME = "timetable"
$GITHUB_TOKEN = Read-Host "GitHub 개인용 액세스 토큰(PAT) 입력" -AsSecureString

# 평문으로 변환
$token = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [System.Runtime.InteropServices.Marshal]::SecureStringToCoTaskMemUnicode($GITHUB_TOKEN)
)

# 원격 저장소 URL (HTTPS with token)
$REMOTE_URL = "https://$($GITHUB_USERNAME):$($token)@github.com/$($GITHUB_USERNAME)/$($REPO_NAME).git"

# Git 설정
Write-Host "✓ 파일들을 스테이징합니다..."
git add .

Write-Host "✓ 변경사항을 커밋합니다..."
$commit_message = Read-Host "커밋 메시지 입력 (기본값: 시간표 업데이트)"
if ([string]::IsNullOrWhiteSpace($commit_message)) {
    $commit_message = "시간표 업데이트"
}
git commit -m $commit_message

Write-Host "✓ 원격 저장소를 설정합니다..."
git remote remove origin 2>$null
git remote add origin $REMOTE_URL

Write-Host "✓ GitHub에 푸시합니다..."
git push -u origin main

Write-Host "`n✅ 완료! 시간표가 GitHub에 업로드되었습니다."

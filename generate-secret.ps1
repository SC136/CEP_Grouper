# Generate a secure secret for NextAuth
# Run this script with: ./generate-secret.ps1

$randomBytes = [byte[]]::new(32)
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($randomBytes)
$base64Secret = [Convert]::ToBase64String($randomBytes)

Write-Output ""
Write-Output "Your secure NEXTAUTH_SECRET:"
Write-Output "------------------------"
Write-Output $base64Secret
Write-Output "------------------------"
Write-Output ""
Write-Output "Copy this value into your .env.production file for the NEXTAUTH_SECRET variable."
Write-Output ""

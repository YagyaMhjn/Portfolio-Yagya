param (
    [string]$msg = "Update portfolio codebase"
)
git add .
git commit -m "$msg"
git push -u origin main
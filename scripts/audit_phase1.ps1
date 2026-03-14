# Constitutional Audit Script — Phase 1
# Checks phase1/backend/ for forbidden LLM imports.
# Run before every commit and before Phase 2 begins.
# Expected result: NO output = PASS

Write-Host "Auditing Phase 1 for LLM imports..." -ForegroundColor Cyan

$results = Get-ChildItem -Path "phase1/backend" -Recurse -Filter "*.py" |
  Select-String -Pattern "anthropic|openai|langchain|litellm"

if ($results) {
    Write-Host "CONSTITUTIONAL VIOLATION DETECTED!" -ForegroundColor Red
    Write-Host "The following files contain forbidden LLM imports:" -ForegroundColor Red
    $results | ForEach-Object {
        Write-Host "  $($_.Filename):$($_.LineNumber) — $($_.Line.Trim())" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "Action required: Remove all LLM imports from phase1/backend/." -ForegroundColor Red
    Write-Host "Phase 1 must have ZERO LLM API calls (GIAIC Hackathon IV rule)." -ForegroundColor Red
    exit 1
} else {
    Write-Host "AUDIT PASSED — Zero LLM imports found in phase1/backend/" -ForegroundColor Green
    Write-Host "Constitutional Principle I: SATISFIED" -ForegroundColor Green
    exit 0
}

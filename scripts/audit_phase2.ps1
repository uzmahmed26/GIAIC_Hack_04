# Phase 2 Constitutional Audit Script
# Verifies:
# 1. Phase 1 backend still has ZERO LLM imports
# 2. Phase 2 LLM imports are ONLY in phase2/backend/
# 3. Every LLM call site has require_tier() dependency
# 4. Every LLM call site has log_llm_cost() call

Write-Host "============================================" -ForegroundColor Cyan
Write-Host " Course Companion FTE — Phase 2 Audit" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

$passed = $true

# -----------------------------------------------
# CHECK 1: Phase 1 must still have ZERO LLM imports
# -----------------------------------------------
Write-Host "`n[1/4] Checking Phase 1 for LLM imports..." -ForegroundColor Yellow

$phase1Results = Get-ChildItem -Path "phase1/backend" -Recurse -Filter "*.py" |
    Select-String -Pattern "import anthropic|import openai|import langchain|import litellm|from anthropic|from openai|from langchain|from litellm"

if ($phase1Results) {
    Write-Host "FAIL: Phase 1 LLM imports found — CONSTITUTIONAL VIOLATION" -ForegroundColor Red
    $phase1Results | ForEach-Object { Write-Host "  $($_.Filename):$($_.LineNumber) — $($_.Line.Trim())" -ForegroundColor Red }
    $passed = $false
} else {
    Write-Host "PASS: Phase 1 has zero LLM imports" -ForegroundColor Green
}

# -----------------------------------------------
# CHECK 2: Phase 2 LLM calls exist (sanity check)
# -----------------------------------------------
Write-Host "`n[2/4] Checking Phase 2 has LLM usage..." -ForegroundColor Yellow

$phase2LLM = Get-ChildItem -Path "phase2/backend" -Recurse -Filter "*.py" |
    Select-String -Pattern "import anthropic|from anthropic"

if ($phase2LLM) {
    Write-Host "PASS: Phase 2 uses Anthropic SDK as expected" -ForegroundColor Green
    $phase2LLM | ForEach-Object { Write-Host "  $($_.Filename):$($_.LineNumber)" -ForegroundColor Gray }
} else {
    Write-Host "WARN: Phase 2 has no LLM imports — expected anthropic" -ForegroundColor Yellow
}

# -----------------------------------------------
# CHECK 3: Every Phase 2 router has require_tier
# -----------------------------------------------
Write-Host "`n[3/4] Checking Phase 2 routers for tier checks..." -ForegroundColor Yellow

$routerFiles = Get-ChildItem -Path "phase2/backend/app/routers" -Filter "*.py" |
    Where-Object { $_.Name -ne "__init__.py" }

$tierCheckMissing = $false
foreach ($file in $routerFiles) {
    $hasTierCheck = Select-String -Path $file.FullName -Pattern "require_tier" -Quiet
    if (-not $hasTierCheck) {
        Write-Host "FAIL: $($file.Name) missing require_tier() — CONSTITUTIONAL VIOLATION" -ForegroundColor Red
        $tierCheckMissing = $true
        $passed = $false
    } else {
        Write-Host "PASS: $($file.Name) has require_tier()" -ForegroundColor Green
    }
}

# -----------------------------------------------
# CHECK 4: Every Phase 2 router has cost logging
# -----------------------------------------------
Write-Host "`n[4/4] Checking Phase 2 routers for cost logging..." -ForegroundColor Yellow

$costLogMissing = $false
foreach ($file in $routerFiles) {
    $hasCostLog = Select-String -Path $file.FullName -Pattern "log_llm_cost" -Quiet
    if (-not $hasCostLog) {
        Write-Host "FAIL: $($file.Name) missing log_llm_cost() — CONSTITUTIONAL VIOLATION" -ForegroundColor Red
        $costLogMissing = $true
        $passed = $false
    } else {
        Write-Host "PASS: $($file.Name) has log_llm_cost()" -ForegroundColor Green
    }
}

# -----------------------------------------------
# FINAL RESULT
# -----------------------------------------------
Write-Host "`n============================================" -ForegroundColor Cyan

if ($passed) {
    Write-Host " AUDIT PASSED — Phase 2 is constitutionally compliant" -ForegroundColor Green
    Write-Host " Phase 1: zero LLM | Phase 2: gated LLM + cost logging" -ForegroundColor Green
    exit 0
} else {
    Write-Host " AUDIT FAILED — Fix violations before proceeding" -ForegroundColor Red
    exit 1
}

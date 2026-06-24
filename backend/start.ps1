param(
    [ValidateSet("neon", "h2")]
    [string]$Profile = "neon"
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

function Import-DotEnv {
    param([string]$Path)

    foreach ($Line in Get-Content -LiteralPath $Path) {
        $Trimmed = $Line.Trim()

        if ([string]::IsNullOrWhiteSpace($Trimmed) -or $Trimmed.StartsWith("#")) {
            continue
        }

        $Parts = $Trimmed -split "=", 2
        if ($Parts.Count -ne 2) {
            throw "Linea invalida en .env: $Line"
        }

        $Name = $Parts[0].Trim()
        $Value = $Parts[1].Trim()

        if ($Name -notmatch "^[A-Za-z_][A-Za-z0-9_]*$") {
            throw "Nombre de variable invalido en .env: $Name"
        }

        if (($Value.StartsWith('"') -and $Value.EndsWith('"')) -or ($Value.StartsWith("'") -and $Value.EndsWith("'"))) {
            $Value = $Value.Substring(1, $Value.Length - 2)
        }

        [Environment]::SetEnvironmentVariable($Name, $Value, "Process")
    }
}

function Get-MissingEnvVars {
    param([string[]]$Names)

    return $Names | Where-Object { [string]::IsNullOrWhiteSpace([Environment]::GetEnvironmentVariable($_, "Process")) }
}

function Assert-JwtSecretKey {
    try {
        $JwtKeyBytes = [Convert]::FromBase64String($env:JWT_SECRET_KEY)
    } catch {
        throw "JWT_SECRET_KEY debe estar en Base64. Revisa backend\.env.example para generar una clave valida."
    }

    if ($JwtKeyBytes.Length -lt 32) {
        throw "JWT_SECRET_KEY debe tener al menos 32 bytes despues de decodificar Base64."
    }
}

if ($Profile -eq "h2") {
    $env:SPRING_PROFILES_ACTIVE = "h2"
    Write-Host "Iniciando backend con H2 en memoria..."
} else {
    $EnvFile = Join-Path $ScriptDir ".env"
    if (-not (Test-Path -LiteralPath $EnvFile)) {
        throw "No se encontro backend\.env. Copia backend\.env.example como backend\.env y completa las credenciales."
    }

    Import-DotEnv -Path $EnvFile

    $Missing = Get-MissingEnvVars -Names @(
        "DATABASE_URL",
        "DATABASE_USERNAME",
        "DATABASE_PASSWORD",
        "JWT_SECRET_KEY"
    )

    if ($Missing.Count -gt 0) {
        throw "Faltan variables en backend\.env: $($Missing -join ', ')"
    }

    Assert-JwtSecretKey

    if ([string]::IsNullOrWhiteSpace($env:JWT_EXPIRATION)) {
        $env:JWT_EXPIRATION = "86400000"
    }

    $env:SPRING_PROFILES_ACTIVE = $null
    Write-Host "Iniciando backend con Neon..."
}

& "$ScriptDir\mvnw.cmd" spring-boot:run
exit $LASTEXITCODE

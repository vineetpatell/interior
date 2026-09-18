$file = 'F:\Clients\interior\src\components\home\DoorJourney.tsx'
$lines = [System.IO.File]::ReadAllLines($file, [System.Text.UTF8Encoding]::new($true))
$total = $lines.Length
Write-Output "Total lines: $total"

$markerIdx = -1
for ($i = 0; $i -lt $total; $i++) {
    if ($lines[$i] -match 'export function DoorJourney') {
        $markerIdx = $i
        Write-Output "Marker at line $($i+1)"
        break
    }
}
if ($markerIdx -lt 0) { exit 1 }

Write-Output "--- TAIL FROM 499 ---"
$lines[498..($total-1)] | ForEach-Object { Write-Output $_; Write-Output '---' }

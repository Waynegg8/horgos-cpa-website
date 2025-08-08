$ErrorActionPreference = 'Stop'

$root = 'content'
$dirs = @('articles','videos','faq','downloads')
foreach ($d in $dirs) {
  New-Item -ItemType Directory -Path (Join-Path $root $d) -Force | Out-Null
}

function Write-Utf8([string]$path, [string]$text) {
  $enc = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($path, $text, $enc)
}

function DateMinus([int]$days) {
  return (Get-Date).AddDays(-$days).ToString('yyyy-MM-dd')
}

$img = '/uploads/images/general/general-default.jpg'

# Articles (20)
$articleCategories = @('startup-guide','tax-planning','accounting-basics','legal-updates')
$articleSeries = @('company-setup','tax-optimization')
$articleTags = @('稅務','會計','創業','法規')
for ($i = 1; $i -le 20; $i++) {
  $category = $articleCategories[($i-1) % $articleCategories.Count]
  $title = "範例文章 $i - $category"
  $date = DateMinus $i
  $tag = $articleTags[($i-1) % $articleTags.Count]
  $useSeries = $i -le 12
  $series = if ($useSeries) { $articleSeries[($i-1) % $articleSeries.Count] } else { '' }
  $seriesOrder = if ($useSeries) { (($i-1) % 10) + 1 } else { $null }
  $frontLines = @(
    '---',
    "title: $title",
    "date: $date",
    "category: $category",
    "tags: [$tag]",
    "image: $img",
    "summary: 這是範例文章，用於測試列表、搜尋與分頁等功能。"
  )
  if ($useSeries) { $frontLines += "series: $series"; $frontLines += "series_order: $seriesOrder" }
  $frontLines += '---'
  $front = ($frontLines -join "`n") + "`n`n"
  $body = @"
# $title

本篇為測試用內容，段落一。這裡放入數段敘述文字以模擬真實文章內容，方便檢視排版與目錄呈現。

## 小節 A
提供更多段落與行內元素，測試摘要擷取與卡片顯示一致性。

## 小節 B
搭配標籤與分類：$category；系列：$series。
"@
  Write-Utf8 (Join-Path $root "articles/sample-$i.md") ($front + $body)
}

# Videos (20)
$videoCategories = @('popular','tutorials','case-studies','legal-explanation')
$videoSeries = @('startup-series','tax-series')
for ($i = 1; $i -le 20; $i++) {
  $category = $videoCategories[($i-1) % $videoCategories.Count]
  $title = "範例影片 $i - $category"
  $date = DateMinus ($i + 30)
  $thumbnail = $img
  $duration = ('0{0}:3{1}' -f (($i%6)+1), ($i%10))
  $useSeries = $i -le 12
  $series = if ($useSeries) { $videoSeries[($i-1) % $videoSeries.Count] } else { '' }
  $seriesOrder = if ($useSeries) { (($i-1) % 10) + 1 } else { $null }
  $frontLines = @(
    '---',
    "title: $title",
    "date: $date",
    "category: $category",
    "thumbnail: $thumbnail",
    "duration: $duration",
    "summary: 這是範例影片，用於測試影片列表與分頁、系列導航等功能。"
  )
  if ($useSeries) { $frontLines += "series: $series"; $frontLines += "series_order: $seriesOrder" }
  $frontLines += '---'
  $front = ($frontLines -join "`n") + "`n`n"
  $body = @"
這是範例影片，用於測試影片列表與分頁、系列導航等功能。

- 重點一：說明影片的教學或示範內容。
- 重點二：說明與系列或分類的關聯。
"@
  Write-Utf8 (Join-Path $root "videos/sample-$i.md") ($front + $body)
}

# FAQ (20)
$faqCategories = @('startup','tax','accounting','others')
for ($i = 1; $i -le 20; $i++) {
  $category = $faqCategories[($i-1) % $faqCategories.Count]
  $title = "範例問題 $i - $category"
  $date = DateMinus ($i + 60)
  $useSeries = $i -le 8
  $series = if ($useSeries) { 'faq-starter' } else { '' }
  $seriesOrder = if ($useSeries) { (($i-1) % 8) + 1 } else { $null }
  $frontLines = @(
    '---',
    "title: $title",
    "date: $date",
    "category: $category",
    "summary: 這是一則常見問題的範例，用於測試列表與分頁功能。"
  )
  if ($useSeries) { $frontLines += "series: $series"; $frontLines += "series_order: $seriesOrder" }
  $frontLines += '---'
  $front = ($frontLines -join "`n") + "`n`n"
  $body = @"
**問題：** $title？

**解答：** 這是測試用的解答範例，描述處理流程與注意事項，協助檢視卡片與排版。
"@
  Write-Utf8 (Join-Path $root "faq/sample-$i.md") ($front + $body)
}

# Downloads (20)
$dlCategories = @('templates','forms','checklists','regulations')
$filetypes = @('pdf','docx','xlsx','zip')
for ($i = 1; $i -le 20; $i++) {
  $category = $dlCategories[($i-1) % $dlCategories.Count]
  $title = "範例下載 $i - $category"
  $date = DateMinus ($i + 90)
  $filetype = $filetypes[($i-1) % $filetypes.Count]
  $filesize = ('{0}.{1}MB' -f (($i%5)+1), ($i%9))
  $frontLines = @(
    '---',
    "title: $title",
    "date: $date",
    "category: $category",
    "filetype: $filetype",
    "filesize: $filesize",
    "image: $img",
    "summary: 這是範例下載項目，用於測試下載列表與分頁功能。",
    '---'
  )
  $front = ($frontLines -join "`n") + "`n`n"
  $body = @"
請在此放置檔案說明、使用方式與注意事項。此項目用於測試列表顯示與分類篩選。
"@
  Write-Utf8 (Join-Path $root "downloads/sample-$i.md") ($front + $body)
}

Write-Host 'Sample content generated.'


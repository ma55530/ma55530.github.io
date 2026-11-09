-- ```{.pixel-grid} code blocks: a grid of numbers drawn as shaded cells.
-- Each cell gets as much ink as its value, so readers see the picture,
-- and the numbers stay readable on top.
--
--   ```{.pixel-grid}            numbers split by spaces, 0..255 (e.g. MNIST pixels)
--   ```{.pixel-grid max="9"}    one digit per cell, 0..9 (e.g. a spectrogram row)
--   index="true"                row and column numbers (from 0) around the grid
--   alt="..."                   text for screen readers

local function cell(v, maxv)
  local a = math.min(v, maxv) / maxv
  local class = (v == 0) and ' class="z"' or ((a > .4) and ' class="hi"' or '')
  return string.format('<span%s style="--v:%.3f">%d</span>', class, a, v)
end

function CodeBlock(el)
  if not el.classes:includes('pixel-grid') then return nil end
  if not quarto.doc.is_format('html') then return nil end

  local maxv = tonumber(el.attributes['max']) or 255
  local pattern = (maxv < 10) and '%d' or '%d+'   -- single digits: every character is a cell

  local rows, cols = {}, 0
  for line in el.text:gmatch('[^\n]+') do
    line = line:gsub('\\n%s*$', '')          -- ignore a literal "\n" at the end of a row
    local row = {}
    for n in line:gmatch(pattern) do table.insert(row, tonumber(n)) end
    if #row > 0 then
      table.insert(rows, row)
      cols = math.max(cols, #row)
    end
  end
  if #rows == 0 then return nil end

  local label = el.attributes['alt'] or string.format('%d by %d grid of values', #rows, cols)
  local index = el.attributes['index'] == 'true'
  local classes = (maxv < 10) and 'pixel-grid digits' or 'pixel-grid'
  if index then classes = classes .. ' indexed' end
  local out = { string.format('<div class="%s" style="--cols:%d" role="img" aria-label="%s">',
    classes, index and cols + 1 or cols, (label:gsub('"', '&quot;'))) }
  if index then
    table.insert(out, '<span class="ix"></span>')
    for i = 0, cols - 1 do table.insert(out, string.format('<span class="ix">%d</span>', i)) end
  end
  for r, row in ipairs(rows) do
    if index then table.insert(out, string.format('<span class="ix">%d</span>', r - 1)) end
    for i = 1, cols do table.insert(out, cell(row[i] or 0, maxv)) end
  end
  table.insert(out, '</div>')
  return pandoc.RawBlock('html', table.concat(out))
end

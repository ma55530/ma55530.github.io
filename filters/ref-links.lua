-- Plain links to a reference, like [ICL](#ref-brown2020...), act like real citations:
-- the link gets the hover popup, and the paper is added to References (no nocite needed).

local keys = {}

local function link(el)
  local key = el.target:match('^#ref%-(.+)$')
  if not key then return nil end
  table.insert(keys, key)
  el.attributes['role'] = 'doc-biblioref'
  -- Quarto's popup script reads the keys from data-cites on the parent element.
  return pandoc.Span({ el }, pandoc.Attr('', { 'citation' }, { { 'data-cites', key } }))
end

local function add_nocite(doc)
  if #keys == 0 then return nil end
  local cites = {}
  for _, key in ipairs(keys) do
    table.insert(cites, pandoc.Cite({ pandoc.Str('@' .. key) }, { pandoc.Citation(key, 'NormalCitation') }))
  end
  local list = { pandoc.MetaInlines(cites) }
  if doc.meta.nocite then table.insert(list, 1, doc.meta.nocite) end
  doc.meta.nocite = pandoc.MetaList(list)
  return doc
end

return {
  { Link = link },
  { Pandoc = add_nocite },
}

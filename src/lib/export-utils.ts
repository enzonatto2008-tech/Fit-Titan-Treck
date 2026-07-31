export function downloadCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
  ].join('\n')

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function downloadJSON(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function printData(title: string) {
  const win = window.open('', '_blank', 'width=800,height=600')
  if (!win) return
  win.document.write(`<html><head><title>${title}</title></head><body>`)
  win.document.write(document.querySelector('[data-export-content]')?.innerHTML || '')
  win.document.write('</body></html>')
  win.document.close()
  setTimeout(() => win.print(), 250)
}

export function downloadExcel(filename: string, headers: string[], rows: (string | number)[][]) {
  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="UTF-8"></head><body><table border="1"><thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></body></html>`
  const blob = new Blob(['\ufeff' + html], { type: 'application/vnd.ms-excel' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function downloadPDF(
  title: string,
  sections: { heading: string; headers: string[]; rows: (string | number)[][] }[],
) {
  const win = window.open('', '_blank', 'width=900,height=700')
  if (!win) return
  const tablesHtml = sections
    .map(
      (s) =>
        `<h2 style="color:#7c3aed;margin-top:24px;">${s.heading}</h2><table style="width:100%;border-collapse:collapse;font-size:12px;"><thead><tr>${s.headers.map((h) => `<th style="border:1px solid #ddd;padding:6px;background:#f3f0ff;text-align:left;">${h}</th>`).join('')}</tr></thead><tbody>${s.rows.map((r) => `<tr>${r.map((c) => `<td style="border:1px solid #ddd;padding:6px;">${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`,
    )
    .join('')
  win.document.write(
    `<html><head><title>${title}</title><style>body{font-family:Arial,sans-serif;padding:20px}h1{color:#7c3aed}h2{font-size:16px}</style></head><body><h1>${title}</h1><p style="color:#666;font-size:12px">Gerado em ${new Date().toLocaleString('pt-BR')}</p>${tablesHtml}</body></html>`,
  )
  win.document.close()
  setTimeout(() => win.print(), 500)
}

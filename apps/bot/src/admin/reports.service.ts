import * as path from 'path'
import * as fs from 'fs'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import * as ExcelJS from 'exceljs'
import {
  Document, Packer, Paragraph, Table, TableRow, TableCell,
  TextRun, HeadingLevel, WidthType, ShadingType,
} from 'docx'

// ── pdfmake setup (0.3.x Node.js API) ───────────────────
// eslint-disable-next-line @typescript-eslint/no-require-imports
const PdfPrinter = require('pdfmake/js/Printer').default
// eslint-disable-next-line @typescript-eslint/no-require-imports
const URLResolver = require('pdfmake/js/URLResolver').default
// eslint-disable-next-line @typescript-eslint/no-require-imports
const vfs = require('pdfmake/js/virtual-fs').default

const pdfDir = path.dirname(require.resolve('pdfmake/package.json'))
const fontsDir = path.join(pdfDir, 'fonts', 'Roboto')

for (const f of ['Roboto-Regular.ttf', 'Roboto-Medium.ttf', 'Roboto-Italic.ttf', 'Roboto-MediumItalic.ttf']) {
  vfs.writeFileSync(path.join(fontsDir, f), fs.readFileSync(path.join(fontsDir, f)))
}

const printer = new PdfPrinter(
  {
    Roboto: {
      normal:      path.join(fontsDir, 'Roboto-Regular.ttf'),
      bold:        path.join(fontsDir, 'Roboto-Medium.ttf'),
      italics:     path.join(fontsDir, 'Roboto-Italic.ttf'),
      bolditalics: path.join(fontsDir, 'Roboto-MediumItalic.ttf'),
    },
  },
  vfs,
  new URLResolver(vfs),
)

// ── Constants ────────────────────────────────────────────

const STATUS_RU: Record<string, string> = {
  PENDING: 'Ожидает', PAID: 'Оплачен', DELIVERED: 'Выдан', CANCELLED: 'Отменён',
}

const CATEGORY_RU: Record<string, string> = {
  GAMES: 'Игры', SOFTWARE: 'ПО', SUBSCRIPTIONS: 'Подписки',
}

export type ReportFormat = 'excel' | 'pdf' | 'word'
export type ReportType   = 'sales' | 'products' | 'users'

export interface ReportResult {
  buffer:      Buffer
  filename:    string
  contentType: string
}

// ── Service ──────────────────────────────────────────────

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async generate(type: ReportType, format: ReportFormat): Promise<ReportResult> {
    const date = new Date().toISOString().slice(0, 10)
    const ext = format === 'excel' ? 'xlsx' : format === 'word' ? 'docx' : 'pdf'
    const contentType =
      format === 'excel' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' :
      format === 'word'  ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' :
      'application/pdf'

    const buffer =
      type === 'sales'    ? await this.sales(format) :
      type === 'products' ? await this.products(format) :
                            await this.users(format)

    return { buffer, filename: `${type}-report-${date}.${ext}`, contentType }
  }

  // ── Sales ────────────────────────────────────────────

  private async fetchOrders() {
    const rows = await this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user:  { select: { username: true, telegramId: true } },
        items: { include: { product: { select: { name: true } } } },
      },
    })
    return rows.map((o) => ({
      id:       o.id,
      user:     o.user.username ? `@${o.user.username}` : o.user.telegramId.toString(),
      products: o.items.map((i) => i.product.name).join(', '),
      total:    Number(o.total),
      status:   STATUS_RU[o.status] ?? o.status,
      date:     new Date(o.createdAt).toLocaleDateString('ru'),
    }))
  }

  private async sales(format: ReportFormat): Promise<Buffer> {
    const rows = await this.fetchOrders()
    if (format === 'excel') return this.salesExcel(rows)
    if (format === 'word')  return this.salesWord(rows)
    return this.salesPdf(rows)
  }

  private async salesExcel(rows: Awaited<ReturnType<ReportsService['fetchOrders']>>): Promise<Buffer> {
    const wb = new ExcelJS.Workbook()
    wb.creator = 'Nullex Admin'
    const ws = wb.addWorksheet('Продажи')

    ws.columns = [
      { header: 'ID',           key: 'id',       width: 8  },
      { header: 'Пользователь', key: 'user',     width: 22 },
      { header: 'Товары',       key: 'products', width: 36 },
      { header: 'Сумма',        key: 'total',    width: 12 },
      { header: 'Статус',       key: 'status',   width: 14 },
      { header: 'Дата',         key: 'date',     width: 14 },
    ]

    const hRow = ws.getRow(1)
    hRow.font   = { bold: true, color: { argb: 'FFFFFFFF' } }
    hRow.fill   = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F6EF7' } }
    hRow.height = 20

    rows.forEach((r, i) => {
      const row = ws.addRow(r)
      row.getCell('total').numFmt = '$#,##0.00'
      if (i % 2 === 1) row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0F4FF' } }
    })

    ws.autoFilter = { from: 'A1', to: 'F1' }
    return Buffer.from(await wb.xlsx.writeBuffer())
  }

  private async salesWord(rows: Awaited<ReturnType<ReportsService['fetchOrders']>>): Promise<Buffer> {
    const COLS = ['ID', 'Пользователь', 'Товары', 'Сумма', 'Статус', 'Дата']
    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({ text: 'Отчёт по продажам', heading: HeadingLevel.HEADING_1 }),
          new Paragraph({ children: [new TextRun({ text: `Сформирован: ${new Date().toLocaleDateString('ru')}`, size: 22 })] }),
          new Paragraph({}),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                tableHeader: true,
                children: COLS.map((text) => new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text, bold: true, color: 'FFFFFF' })] })],
                  shading:  { type: ShadingType.SOLID, fill: '4F6EF7' },
                })),
              }),
              ...rows.map((r) =>
                new TableRow({
                  children: [
                    `#${r.id}`, r.user, r.products, `$${r.total.toFixed(2)}`, r.status, r.date,
                  ].map((text) => new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text, size: 20 })] })],
                  })),
                })
              ),
            ],
          }),
        ],
      }],
    })
    return Packer.toBuffer(doc)
  }

  private async salesPdf(rows: Awaited<ReturnType<ReportsService['fetchOrders']>>): Promise<Buffer> {
    const headerRow = ['ID', 'Пользователь', 'Товары', 'Сумма', 'Статус', 'Дата'].map((t) => ({
      text: t, bold: true, fillColor: '#4F6EF7', color: '#FFFFFF', fontSize: 8,
    }))
    const dataRows = rows.map((r, i) =>
      [`#${r.id}`, r.user, r.products, `$${r.total.toFixed(2)}`, r.status, r.date].map((text) => ({
        text, fontSize: 8, fillColor: i % 2 === 0 ? '#FFFFFF' : '#F0F4FF',
      }))
    )
    return this.toPdf({
      pageOrientation: 'landscape',
      content: [
        { text: 'Отчёт по продажам', style: 'h1' },
        { text: `Сформирован: ${new Date().toLocaleDateString('ru')}`, margin: [0, 0, 0, 12] },
        {
          table: { headerRows: 1, widths: ['auto', '*', '*', 'auto', 'auto', 'auto'], body: [headerRow, ...dataRows] },
          layout: 'lightHorizontalLines',
        },
      ],
      styles:       { h1: { fontSize: 18, bold: true, margin: [0, 0, 0, 8] } },
      defaultStyle: { font: 'Roboto', fontSize: 9 },
    })
  }

  // ── Products ─────────────────────────────────────────

  private async fetchProducts() {
    const rows = await this.prisma.product.findMany({ orderBy: { id: 'asc' } })
    return rows.map((p) => ({
      id:       p.id,
      name:     p.name,
      category: CATEGORY_RU[p.category] ?? p.category,
      price:    Number(p.price),
      stock:    p.stock,
    }))
  }

  private async products(format: ReportFormat): Promise<Buffer> {
    const rows = await this.fetchProducts()
    if (format === 'excel') return this.productsExcel(rows)
    if (format === 'word')  return this.productsWord(rows)
    return this.productsPdf(rows)
  }

  private async productsExcel(rows: Awaited<ReturnType<ReportsService['fetchProducts']>>): Promise<Buffer> {
    const wb = new ExcelJS.Workbook()
    wb.creator = 'Nullex Admin'
    const ws = wb.addWorksheet('Товары')

    ws.columns = [
      { header: 'ID',         key: 'id',       width: 8  },
      { header: 'Название',   key: 'name',     width: 30 },
      { header: 'Категория',  key: 'category', width: 16 },
      { header: 'Цена',       key: 'price',    width: 12 },
      { header: 'Остаток',    key: 'stock',    width: 10 },
    ]

    const hRow = ws.getRow(1)
    hRow.font   = { bold: true, color: { argb: 'FFFFFFFF' } }
    hRow.fill   = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF9B5CF6' } }
    hRow.height = 20

    rows.forEach((r, i) => {
      const row = ws.addRow(r)
      row.getCell('price').numFmt = '$#,##0.00'
      if (i % 2 === 1) row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F0FF' } }
    })

    ws.autoFilter = { from: 'A1', to: 'E1' }
    return Buffer.from(await wb.xlsx.writeBuffer())
  }

  private async productsWord(rows: Awaited<ReturnType<ReportsService['fetchProducts']>>): Promise<Buffer> {
    const COLS = ['ID', 'Название', 'Категория', 'Цена', 'Остаток']
    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({ text: 'Отчёт по товарам', heading: HeadingLevel.HEADING_1 }),
          new Paragraph({ children: [new TextRun({ text: `Сформирован: ${new Date().toLocaleDateString('ru')}`, size: 22 })] }),
          new Paragraph({}),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                tableHeader: true,
                children: COLS.map((text) => new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text, bold: true, color: 'FFFFFF' })] })],
                  shading:  { type: ShadingType.SOLID, fill: '9B5CF6' },
                })),
              }),
              ...rows.map((r) =>
                new TableRow({
                  children: [
                    `#${r.id}`, r.name, r.category, `$${r.price.toFixed(2)}`, String(r.stock),
                  ].map((text) => new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text, size: 20 })] })],
                  })),
                })
              ),
            ],
          }),
        ],
      }],
    })
    return Packer.toBuffer(doc)
  }

  private async productsPdf(rows: Awaited<ReturnType<ReportsService['fetchProducts']>>): Promise<Buffer> {
    const headerRow = ['ID', 'Название', 'Категория', 'Цена', 'Остаток'].map((t) => ({
      text: t, bold: true, fillColor: '#9B5CF6', color: '#FFFFFF', fontSize: 8,
    }))
    const dataRows = rows.map((r, i) =>
      [`#${r.id}`, r.name, r.category, `$${r.price.toFixed(2)}`, String(r.stock)].map((text) => ({
        text, fontSize: 9, fillColor: i % 2 === 0 ? '#FFFFFF' : '#F5F0FF',
      }))
    )
    return this.toPdf({
      content: [
        { text: 'Отчёт по товарам', style: 'h1' },
        { text: `Сформирован: ${new Date().toLocaleDateString('ru')}`, margin: [0, 0, 0, 12] },
        {
          table: { headerRows: 1, widths: ['auto', '*', 'auto', 'auto', 'auto'], body: [headerRow, ...dataRows] },
          layout: 'lightHorizontalLines',
        },
      ],
      styles:       { h1: { fontSize: 18, bold: true, margin: [0, 0, 0, 8] } },
      defaultStyle: { font: 'Roboto', fontSize: 9 },
    })
  }

  // ── Users ─────────────────────────────────────────────

  private async fetchUsers() {
    const rows = await this.prisma.user.findMany({
      orderBy: { id: 'asc' },
      select: { id: true, telegramId: true, username: true, balance: true, createdAt: true, _count: { select: { orders: true } } },
    })
    return rows.map((u) => ({
      id:         u.id,
      telegramId: u.telegramId.toString(),
      username:   u.username ?? '—',
      balance:    Number(u.balance),
      orders:     u._count.orders,
      date:       new Date(u.createdAt).toLocaleDateString('ru'),
    }))
  }

  private async users(format: ReportFormat): Promise<Buffer> {
    const rows = await this.fetchUsers()
    if (format === 'excel') return this.usersExcel(rows)
    if (format === 'word')  return this.usersWord(rows)
    return this.usersPdf(rows)
  }

  private async usersExcel(rows: Awaited<ReturnType<ReportsService['fetchUsers']>>): Promise<Buffer> {
    const wb = new ExcelJS.Workbook()
    wb.creator = 'Nullex Admin'
    const ws = wb.addWorksheet('Пользователи')

    ws.columns = [
      { header: 'ID',          key: 'id',         width: 8  },
      { header: 'Telegram ID', key: 'telegramId',  width: 18 },
      { header: 'Username',    key: 'username',    width: 20 },
      { header: 'Баланс',      key: 'balance',     width: 12 },
      { header: 'Заказы',      key: 'orders',      width: 10 },
      { header: 'Дата',        key: 'date',        width: 14 },
    ]

    const hRow = ws.getRow(1)
    hRow.font   = { bold: true, color: { argb: 'FFFFFFFF' } }
    hRow.fill   = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFA8FF3E' } }
    hRow.height = 20
    ws.getRow(1).font = { bold: true, color: { argb: 'FF0D0D14' } }

    rows.forEach((r, i) => {
      const row = ws.addRow(r)
      row.getCell('balance').numFmt = '$#,##0.00'
      if (i % 2 === 1) row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0FFF0' } }
    })

    ws.autoFilter = { from: 'A1', to: 'F1' }
    return Buffer.from(await wb.xlsx.writeBuffer())
  }

  private async usersWord(rows: Awaited<ReturnType<ReportsService['fetchUsers']>>): Promise<Buffer> {
    const COLS = ['ID', 'Telegram ID', 'Username', 'Баланс', 'Заказы', 'Дата']
    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({ text: 'Отчёт по пользователям', heading: HeadingLevel.HEADING_1 }),
          new Paragraph({ children: [new TextRun({ text: `Сформирован: ${new Date().toLocaleDateString('ru')}`, size: 22 })] }),
          new Paragraph({}),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                tableHeader: true,
                children: COLS.map((text) => new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text, bold: true, color: '0D0D14' })] })],
                  shading:  { type: ShadingType.SOLID, fill: 'A8FF3E' },
                })),
              }),
              ...rows.map((r) =>
                new TableRow({
                  children: [
                    `#${r.id}`, r.telegramId, r.username, `$${r.balance.toFixed(2)}`, String(r.orders), r.date,
                  ].map((text) => new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text, size: 20 })] })],
                  })),
                })
              ),
            ],
          }),
        ],
      }],
    })
    return Packer.toBuffer(doc)
  }

  private async usersPdf(rows: Awaited<ReturnType<ReportsService['fetchUsers']>>): Promise<Buffer> {
    const headerRow = ['ID', 'Telegram ID', 'Username', 'Баланс', 'Заказы', 'Дата'].map((t) => ({
      text: t, bold: true, fillColor: '#A8FF3E', color: '#0D0D14', fontSize: 8,
    }))
    const dataRows = rows.map((r, i) =>
      [`#${r.id}`, r.telegramId, r.username, `$${r.balance.toFixed(2)}`, String(r.orders), r.date].map((text) => ({
        text, fontSize: 9, fillColor: i % 2 === 0 ? '#FFFFFF' : '#F0FFF0',
      }))
    )
    return this.toPdf({
      pageOrientation: 'landscape',
      content: [
        { text: 'Отчёт по пользователям', style: 'h1' },
        { text: `Сформирован: ${new Date().toLocaleDateString('ru')}`, margin: [0, 0, 0, 12] },
        {
          table: { headerRows: 1, widths: ['auto', 'auto', '*', 'auto', 'auto', 'auto'], body: [headerRow, ...dataRows] },
          layout: 'lightHorizontalLines',
        },
      ],
      styles:       { h1: { fontSize: 18, bold: true, margin: [0, 0, 0, 8] } },
      defaultStyle: { font: 'Roboto', fontSize: 9 },
    })
  }

  // ── PDF helper ───────────────────────────────────────

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async toPdf(docDef: any): Promise<Buffer> {
    const doc = await printer.createPdfKitDocument(docDef)
    return new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = []
      doc.on('data',  (c: Buffer) => chunks.push(c))
      doc.on('end',   () => resolve(Buffer.concat(chunks)))
      doc.on('error', reject)
      doc.end()
    })
  }
}

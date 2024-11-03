interface ReceiptItem {
  name: string;
  qty: number;
  uom: string;
  price: number;
  value: number;
}

export interface ReceiptData {
  companyName: string;
  companyAddress: string;
  trn: string;
  contactInfo: string;
  orderNo: string;
  orderDate: string;
  customerName: string;
  customerNumber: string;
  items: ReceiptItem[];
  advance: number;
  termsAndConditions: string[];
}

export class ReceiptFormatter {
  private readonly width: number = 48;

  constructor(private readonly data: ReceiptData) { }

  private get divider(): string {
    return '-'.repeat(this.width);
  }

  private center(text: string): string {
    const padding = Math.max(0, this.width - text.length);
    const leftPad = Math.floor(padding / 2);
    return ' '.repeat(leftPad) + text;
  }

  private formatTableRow(
    item: string,
    qty: string,
    uom: string,
    price: string,
    value: string
  ): string {
    return `${item}\n${qty.padStart(8)} ${uom.padStart(4)} ${price.padStart(8)} ${value.padStart(10)}`;
  }

  private formatNumber(num: number, decimals: number = 2): string {
    return num.toFixed(decimals);
  }

  private wrapText(text: string): string[] {
    return text.match(new RegExp(`.{1,${this.width}}`, 'g')) || [text];
  }

  private getHeader(): string[] {
    return [
      this.center('Service Order'),
      this.divider,
      this.center(this.data.companyName),
      this.center('L.L.C'),
      `TRN: ${this.data.trn}`,
      this.data.companyAddress,
      this.data.contactInfo,
      this.divider,
      'OrderNo:',
      this.data.orderNo,
      `Order Date:${this.data.orderDate}`,
      'Customer Details:',
      this.data.customerName,
      this.data.customerNumber,
      this.divider,
      'Item         Qty UOM  Price      Value',
      this.divider
    ];
  }

  private getItems(): string[] {
    return this.data.items.map(item =>
      this.formatTableRow(
        item.name,
        this.formatNumber(item.qty),
        item.uom,
        this.formatNumber(item.price),
        this.formatNumber(item.value)
      )
    );
  }

  private getTotal(): number {
    return this.data.items.reduce((sum, item) => sum + item.value, 0);
  }

  private getFooter(): string[] {
    return [
      this.divider,
      `Total${' '.repeat(34)}${this.formatNumber(this.getTotal())}`,
      this.divider,
      `Advance: AED ${this.formatNumber(this.data.advance)}`,
      this.divider,
      'Thanks! Please visit again',
      'Terms & Conditions:',
      ...this.data.termsAndConditions.flatMap(term => this.wrapText(term)),
      this.divider
    ];
  }

  public format(): string {
    const receiptParts = [
      ...this.getHeader(),
      ...this.getItems(),
      ...this.getFooter()
    ];

    return receiptParts.join('\n');
  }
}
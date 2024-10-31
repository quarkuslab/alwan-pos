import PrinterService from "./services/printer.service";

export default function App() {
  async function print() {
    await PrinterService.print({
      companyName: 'Alwan Alqarya Exhibition Organizing 1',
      companyAddress: 'Cultural Gate, Global Village-0',
      trn: '100434055800003',
      contactInfo: 'Mobile: PH:+97155936166/+97152619395',
      orderNo: '285240326330135',
      orderDate: '26-Mar-2024 07:41 PM',
      customerName: 'ali muhammed',
      customerNumber: '6269427',
      items: [
        {
          name: 'Wheel Chair',
          qty: 1.0,
          uom: 'NOS',
          price: 10.0,
          value: 10.0
        }
      ],
      advance: 100.0,
      termsAndConditions: [
        '1.Shopping Trolley AED 10/HR and AED 50/Unit Limited.',
        '2.Baby Cart Single AED 15/HR and AED 75/Unit Limited.',
        '3.Baby Cart Double AED 25/HR and AED 100/Unit Limited.',
        '4.Wheel Chair AED 10/HR.',
        '5.Electric Wheel Chair 50 10/HR and AED 200/Unlimited.',
        '6.Electric Scooter AED 50/HR and AED 250/Unit Limited.',
        '7.Maximum Grace Period is 15 Minutes.'
      ]
    });
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <button className="bg-black text-white px-12 py-4 rounded-md" onClick={print}>
        Print Test
      </button>
    </div>
  );
}
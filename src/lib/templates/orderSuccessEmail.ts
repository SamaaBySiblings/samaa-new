// lib/templates/orderSuccessEmail.ts
export function orderSuccessTemplate({
  customer,
  items,
  total,
  method,
}: {
  customer: { name: string };
  items: { name: string; quantity: number; price: number }[];
  total: number;
  method: string;
}) {
  const rows = items
    .map(
      (item) => `
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 8px 0;">${item.name}</td>
          <td align="center">${item.quantity}</td>
          <td align="right">₹${item.price * item.quantity}</td>
        </tr>`
    )
    .join("");

  return `
    <div style="font-family: 'Segoe UI', sans-serif; padding: 24px; color: #111; max-width: 600px; margin: auto;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://res.cloudinary.com/db5c7s6lw/image/upload/v1752922285/logo_uuodpa.jpg" alt="SAMAA Logo" width="80" />
        <h2 style="margin-top: 10px;">🕯️ Thank you for your order, ${customer.name}!</h2>
      </div>

      <p>Here's a summary of your purchase:</p>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 20px;">
        <thead>
          <tr style="font-weight: bold; border-bottom: 2px solid #333;">
            <th align="left">Item</th>
            <th align="center">Qty</th>
            <th align="right">Price</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
        <tfoot>
          <tr style="border-top: 2px solid #000;">
            <td colspan="2" align="right" style="padding-top: 10px;">Total</td>
            <td align="right" style="padding-top: 10px;">₹${total}</td>
          </tr>
        </tfoot>
      </table>

      <p style="margin-top: 16px;">Payment Method: <strong>${method}</strong></p>
      <p>Your invoice is attached to this email.</p>

      <p style="margin-top: 40px;">Warm regards,<br />Team SAMAA</p>
    </div>
  `;
}

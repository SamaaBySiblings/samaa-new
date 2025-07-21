export function orderFailureTemplate({
  customer,
  reason,
}: {
  customer: { name: string };
  reason: string;
}) {
  return `
    <div style="font-family: 'Segoe UI', sans-serif; color: #000; padding: 24px; max-width: 600px; margin: auto;">
      <div style="text-align: center;">
        <img src="https://yourdomain.com/images/logo.png" alt="SAMAA Logo" style="width: 100px; margin-bottom: 20px;" />
        <h2>⚠️ Trouble Completing Your Order</h2>
      </div>
  
      <p>Hi ${customer.name},</p>
      <p>We noticed that your recent checkout attempt on SAMAA wasn't completed.</p>
  
      <p><strong>Reason:</strong> ${reason}</p>
  
      <p>Your cart is safe, and you can complete your order anytime from your saved cart.</p>
  
      <p style="margin-top: 40px;">With care,<br />Team SAMAA</p>
    </div>
    `;
}

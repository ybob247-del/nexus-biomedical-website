import { useEffect } from 'react';
import brand from '../config/brand';

/**
 * Refund policy for the consumer brand's one-time purchase.
 *
 * Card networks and Stripe expect a site that sells to state its refund terms
 * plainly. Kept short and in plain language on purpose.
 */
export default function RefundPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `Refund Policy — ${brand.name}`;
  }, []);

  const { priceLabel } = brand.offer;

  return (
    <main className="nii-legal">
      <h1>Refund Policy</h1>
      <p className="nii-legal-updated">Last updated September 16, 2026</p>

      <h2>What you are buying</h2>
      <p>
        The Appointment Prep Kit is a one-time digital purchase of {priceLabel} (US). It is not a
        subscription, and you will not be charged again. You get access to your full results and a
        printable PDF right after payment.
      </p>

      <h2>14-day refund</h2>
      <p>
        If the kit did not help you, email{' '}
        <a href={`mailto:${brand.supportEmail}?subject=Refund request`}>{brand.supportEmail}</a>{' '}
        within 14 days of your purchase and ask for a refund. Include the email address you used at
        checkout. You do not need to give a reason.
      </p>
      <p>
        We refund the full amount to the card or payment method you used. Refunds are usually sent
        within 3 business days of your request, and your bank may take a further 5 to 10 business
        days to show them.
      </p>

      <h2>Duplicate or mistaken charges</h2>
      <p>
        If you were charged twice or charged in error, email us at any time and we will refund the
        extra charge.
      </p>

      <h2>Questions</h2>
      <p>
        Email <a href={`mailto:${brand.supportEmail}`}>{brand.supportEmail}</a>. {brand.name} is a
        brand of {brand.legalName}.
      </p>
    </main>
  );
}

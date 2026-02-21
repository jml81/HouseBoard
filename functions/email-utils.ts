interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  apiKey: string;
  from?: string;
}

export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  const { to, subject, html, apiKey, from = 'HouseBoard <noreply@houseboard.antesto.fi>' } = options;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to: [to], subject, html }),
  });

  return response.ok;
}

export function buildResetEmailHtml(resetUrl: string, userName: string): string {
  return `<!DOCTYPE html>
<html lang="fi">
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #1a1a2e;">HouseBoard — Salasanan palautus</h2>
  <p>Hei ${userName},</p>
  <p>Saimme pyynnön salasanasi palauttamiseksi. Klikkaa alla olevaa painiketta asettaaksesi uuden salasanan:</p>
  <p style="text-align: center; margin: 30px 0;">
    <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Aseta uusi salasana</a>
  </p>
  <p>Jos et pyytänyt salasanan palautusta, voit jättää tämän viestin huomiotta.</p>
  <p>Linkki on voimassa <strong>1 tunnin</strong>.</p>
  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
  <p style="color: #6b7280; font-size: 12px;">HouseBoard — Taloyhtiön digitaalinen ilmoitustaulu</p>
</body>
</html>`;
}

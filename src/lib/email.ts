// Markeer als server-only code — mag nooit op de client worden uitgevoerd
"use server";
// Importeer de Resend SDK voor het versturen van e-mails
import { Resend } from "resend";

// Maak een Resend client instantie aan met de API sleutel uit omgevingsvariabelen
const resend = new Resend(process.env.RESEND_API_KEY);

// Verstuur een e-mail via de Resend service
// to: het ontvangers e-mailadres
// from: het afzenders object met naam en e-mail
// subject: de e-mail onderwerpregel
// data: de formuliergegevens van de bezoeker (naam, e-mail, bericht)
async function sendEmail(
  to: string,
  from: { email: string; name: string },
  subject: string,
  data: { email: string; name: string; message: string }
) {
  try {
    // Valideer dat alle verplichte velden aanwezig zijn
    if (!to || !from.email || !from.name || !subject || !data.email || !data.name || !data.message) {
      throw new Error("All fields are required");
    }

    // Verstuur de e-mail via de Resend API
    const { data: result, error } = await resend.emails.send({
      from: `${from.name} <${from.email}>`,  // Opgemaakt afzendersadres
      to: [to],                               // Lijst met ontvangers
      subject: subject,
      // HTML e-mailtemplate met gestileerde opmaak
      html: `
      <!DOCTYPE html>
      <html lang="nl">
        <head>
          <meta charset="utf-8">
          <title>lucamanuel.nl</title>
          <meta name="description" content="lucamanuel.nl">
          <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            /* Hoofdcontainer met maximale breedte en afgeronde hoeken */
            .container {
              max-width: 600px;
              margin: 20px auto;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            /* Koptekst sectie met afscheider */
            .header {
              text-align: center;
              padding-bottom: 20px;
              border-bottom: 1px solid #dddddd;
            }
            .header h3 {
              margin: 0;
              color: #333333;
            }
            /* Hoofdinhoud van de e-mail */
            .content {
              font-size: 16px;
              line-height: 1.6;
              color: #333333;
            }
            .content p {
              margin: 0 0 10px;
            }
            /* Voettekst met afscheider */
            .footer {
              text-align: center;
              padding-top: 20px;
              border-top: 1px solid #dddddd;
              font-size: 12px;
              color: #777777;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <!-- E-mail koptekst met naam en e-mail van de afzender -->
            <div class="header">
              <h3>Je hebt een nieuwe e-mail van ${data.name}</h3>
              <p>Hun e-mailadres is: ✉️${data.email}</p>
            </div>
            <!-- Berichtinhoud -->
            <div class="content">
              <p><strong>Bericht:</strong></p>
              <p>${data.message}</p>
            </div>
            <!-- E-mail voettekst -->
            <div class="footer">
              <p>lucamanuel.nl</p>
            </div>
          </div>
        </body>
      </html>`,
    });

    // Geef een fout terug als de Resend API een fout retourneert
    if (error) {
      return { data: null, error: error.message };
    }

    // Geef een succesbericht terug als de e-mail is verstuurd
    return { data: "Email sent successfully!", error: null };
  } catch (error) {
    // Vang alle onverwachte fouten op en geef een foutbericht terug
    const errorMessage = error instanceof Error ? error.message : "Error sending email";
    return { data: null, error: errorMessage };
  }
}

// Exporteer de sendEmail functie voor gebruik in andere modules
export { sendEmail };

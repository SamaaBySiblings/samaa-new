import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Set credentials with refresh token
oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const calendar = google.calendar({ version: "v3", auth: oauth2Client });

async function sendWhatsAppNotification(appointmentData: any) {
  const whatsappNumber = "919997100445"; // Remove + and spaces

  // Using Twilio WhatsApp API
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER; // Your Twilio WhatsApp number

  const message = `
🗓️ New Appointment Booked!

Name: ${appointmentData.name}
Email: ${appointmentData.email}
Phone: ${appointmentData.phone}
Date: ${appointmentData.date}
Time: ${appointmentData.time}
Message: ${appointmentData.message || "N/A"}

Google Meet Link: ${appointmentData.meetLink}
  `.trim();

  try {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(`${accountSid}:${authToken}`).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          From: fromNumber ?? "",
          To: `whatsapp:+${whatsappNumber}`,
          Body: message,
        }),
      }
    );

    if (!response.ok) {
      console.error("WhatsApp notification failed:", await response.text());
    }
  } catch (error) {
    console.error("Error sending WhatsApp notification:", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, date, time, message } = body;

    // Parse date and time
    const [hours, minutes] = time
      .match(/(\d+):(\d+)/)!
      .slice(1)
      .map(Number);
    const isPM = time.includes("PM");
    const hour24 =
      isPM && hours !== 12 ? hours + 12 : hours === 12 && !isPM ? 0 : hours;

    const startDateTime = new Date(date);
    startDateTime.setHours(hour24, minutes, 0, 0);

    const endDateTime = new Date(startDateTime);
    endDateTime.setMinutes(endDateTime.getMinutes() + 30); // 30-minute appointment

    // Create Google Calendar event with Google Meet
    const event = {
      summary: `Fragrance Consultation - ${name}`,
      description: `
Appointment Details:
- Name: ${name}
- Email: ${email}
- Phone: ${phone}
- Message: ${message || "N/A"}

This is a virtual fragrance consultation appointment.
      `.trim(),
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: "Asia/Kolkata",
      },
      attendees: [
        { email: email },
        { email: "support@samaabysiblings.com" }, // Your business email
      ],
      conferenceData: {
        createRequest: {
          requestId: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 }, // 1 day before
          { method: "popup", minutes: 30 }, // 30 minutes before
        ],
      },
    };

    const calendarResponse = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
      conferenceDataVersion: 1,
      sendUpdates: "all", // Send email invites to attendees
    });

    const meetLink =
      calendarResponse.data.conferenceData?.entryPoints?.[0]?.uri ||
      calendarResponse.data.htmlLink;

    // Send WhatsApp notification to owner
    await sendWhatsAppNotification({
      name,
      email,
      phone,
      date,
      time,
      message,
      meetLink,
    });

    return NextResponse.json({
      success: true,
      message: "Appointment booked successfully",
      meetLink,
      eventId: calendarResponse.data.id,
    });
  } catch (error) {
    console.error("Error booking appointment:", error);
    return NextResponse.json(
      {
        error: "Failed to book appointment",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

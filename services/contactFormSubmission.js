import { sendEmail } from "./sendEmail.js";

 async function HandleContactForm(req, res) {
  try {
    const { name, email, phone, message } = req.body;

    await sendEmail({
      to: process.env.APP_GMAIL,
      subject: `New Contact Message from ${name}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    return res.status(200).json({ success: true, message: "Message sent successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to send message" });
  }
}
export default HandleContactForm
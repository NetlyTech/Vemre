//     import nodemailer from 'nodemailer';
// import { NextRequest, NextResponse } from 'next/server';

// export async function POST(request: NextRequest) {
//   try {
//     const { name, email, phone, message } = await request.json();

//     if (!name || !email || !message) {
//       console.log('Validation failed: Missing required fields');
//       return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
//     }

//     const port = Number(process.env.SMTP_PORT);
//     const secure = port === 465;

//     console.log('SMTP Config:', {
//       host: process.env.SMTP_HOST,
//       port,
//       user: process.env.SMTP_USER,
//       secure,
//     });

// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: 465,
//   secure: true,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// });

//     // Verify connection configuration
//     await transporter.verify();
//     console.log('SMTP server is ready to take messages');

//     const mailOptions = {
//       from: `"${name}" <${process.env.SMTP_USER}>`,
//       replyTo: email,
//       to: process.env.CONTACT_EMAIL,
//       subject: `New Contact Message from ${name}`,
//       text: `
//         Name: ${name}
//         Email: ${email}
//         Phone: ${phone || 'N/A'}
//         Message:
//         ${message}
//       `,
//     };

//     console.log('Sending email with options:', mailOptions);

//     await transporter.sendMail(mailOptions);

//     console.log('Email sent successfully');

//     return NextResponse.json({ message: 'Email sent successfully' });
//   } catch (error) {
//     console.error('Email sending error:', error);
//     return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
//   }
// }


   // app/api/contact/route.ts
  //  import { NextRequest, NextResponse } from 'next/server';
  //  import sgMail from '@sendgrid/mail';

  //  // Set SendGrid API key from env
  //  sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

  //  export async function POST(request: NextRequest) {
  //    try {
  //      // Parse the form data from the request body
  //      const body = await request.json();
  //      const { name, email, phone, message } = body;

  //      // Validate required fields (basic check)
  //      if (!name || !email || !message) {
  //        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  //      }

  //      // Email content
  //      const msg = {
  //        to: process.env.YOUR_EMAIL,  // Your verified email (where messages go)
  //        from: process.env.YOUR_EMAIL,  // Must be a verified sender in SendGrid
  //        subject: `New Contact Form Submission from ${name}`,
  //        text: `
  //          Name: ${name}
  //          Email: ${email}
  //          Phone: ${phone || 'Not provided'}
  //          Message: ${message}
  //        `,
  //        html: `
  //          <h3>New Contact Form Submission</h3>
  //          <p><strong>Name:</strong> ${name}</p>
  //          <p><strong>Email:</strong> ${email}</p>
  //          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
  //          <p><strong>Message:</strong> ${message}</p>
  //        `,
  //      };

  //      // Send the email
  //      await sgMail.send(msg);

  //      return NextResponse.json({ success: true }, { status: 200 });
  //    } catch (error) {
  //      console.error('SendGrid Error:', error);  // Log for debugging
  //      let errorMessage = 'Failed to send email';
  //      if (error instanceof Error) {
  //        if (error.message.includes('Unauthorized')) {
  //          errorMessage = 'Invalid SendGrid API key';
  //        } else if (error.message.includes('sender')) {
  //          errorMessage = 'Sender email not verified in SendGrid';
  //        }
  //      }
  //      return NextResponse.json({ error: errorMessage }, { status: 500 });
  //    }
  //  }

     // app/api/contact/route.ts
   import { NextRequest, NextResponse } from 'next/server';
   import { Resend } from 'resend';  // Correct import for the 'resend' package

   // Initialize Resend with API key from env
   const resend = new Resend(process.env.RESEND_API_KEY!);

   export async function POST(request: NextRequest) {
     try {
       // Parse the form data from the request body
       const body = await request.json();
       const { name, email, phone, message } = body;

       // Validate required fields (basic check)
       if (!name || !email || !message) {
         return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
       }

       // Send the email
       const data = await resend.emails.send({
         from: process.env.YOUR_EMAIL!,  // Your email (e.g., aremuenterpriseltd@vemre.com)
         to: process.env.YOUR_EMAIL!,    // Where to receive (same as from, or change to another)
         subject: `New Contact Form Submission from ${name}`,
         text: `
           Name: ${name}
           Email: ${email}
           Phone: ${phone || 'Not provided'}
           Message: ${message}
         `,
         html: `
           <h3>New Contact Form Submission</h3>
           <p><strong>Name:</strong> ${name}</p>
           <p><strong>Email:</strong> ${email}</p>
           <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
           <p><strong>Message:</strong> ${message}</p>
         `,
       });

       if (data.data) {
         return NextResponse.json({ success: true }, { status: 200 });
       } else {
         throw new Error('Resend send failed');
       }
     } catch (error) {
       console.error('Resend Error:', error);  // Log for debugging
       let errorMessage = 'Failed to send email';
       if (error instanceof Error) {
         if (error.message.includes('Unauthorized')) {
           errorMessage = 'Invalid Resend API key';
         } else if (error.message.includes('domain')) {
           errorMessage = 'Sender domain not verified (check Resend dashboard)';
         }
       }
       return NextResponse.json({ error: errorMessage }, { status: 500 });
     }
   }
   
   
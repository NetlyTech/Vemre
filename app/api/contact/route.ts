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
   
   
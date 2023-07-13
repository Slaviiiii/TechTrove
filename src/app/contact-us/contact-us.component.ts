import { Component } from '@angular/core';
import * as nodemailer from 'nodemailer';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent {
  async sendEmail() {
    try {
      const host = process.env['EMAIL_HOST'] || '';
      const port = parseInt(process.env['EMAIL_PORT'] || '0'); 
      const secure = process.env['EMAIL_SECURE'] === 'true'; 
      const user = process.env['EMAIL_USER'] || '';
      const pass = process.env['EMAIL_PASSWORD'] || '';

      const transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
          user,
          pass
        }
      });
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
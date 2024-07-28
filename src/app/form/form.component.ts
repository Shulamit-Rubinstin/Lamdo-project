
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; // הוסף כאן
import { SignatureComponent } from '../signature/signature.component'
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';
import { DateFormatPipe } from '../date-format.pipe';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule, SignatureComponent, DateFormatPipe],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent implements OnInit {
  public updateForm!: FormGroup;
  @ViewChild('formContainer') formContainer!: ElementRef;
  pdfFile: jsPDF | null = null;
  constructor(private fb: FormBuilder) { }
  ngOnInit(): void {
    this.updateForm = this.fb.group({
      institutionName: ['', [Validators.required]],
      institutionSergeant: ['', [Validators.required]],
      permission: ['', [Validators.required]],
      fromKosher: ['', [Validators.required]],
      toKosher: ['רבני העיר בני ברק הרב לנדא והרב רוזנבלט', [Validators.required]],
      fullName: ['', [Validators.required]],
      class: ['', [Validators.required]],
      parentsName: ['', [Validators.required]],
      permissionF: ['', [Validators.required]],
      toKosherF: ['', [Validators.required]],
      institutionNameF: ['', [Validators.required]],
      fromKosherF: ['', [Validators.required]],
      date: [new Date(), [Validators.required]],
    });
  }

  generatePDF(): void {
    const sendButton = document.querySelector('button[type="button"]');
    const pdfWidth = 210; // specify width in mm (A4 size)
    const pdfHeight = 297; // specify height in mm (A4 size)
    const imageQuality = 0.4; // adjust the image quality as needed (0.0 - 1.0)

    if (sendButton) {
      sendButton.classList.add('hidden'); // Add a CSS class to hide the button
    }

    html2canvas(this.formContainer.nativeElement, { scale: 2 }).then((canvas: any) => {
      if (sendButton) {
        sendButton.classList.remove('hidden'); // Remove the hidden class to show the button back
      }

      const imgData = canvas.toDataURL('image/jpeg', imageQuality);
      const pdf = new jsPDF('p', 'mm', [pdfWidth, pdfHeight]);
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

      const pdfBlob = pdf.output('blob');

      pdf.save('document.pdf');
      this.sendMail();

    });
  }
  sendMail() {
    if (this.pdfFile) {
      console.log("in mail!!!")
      const reader = new FileReader();
      reader.onload = () => {
        const base64File = reader.result?.toString().split(',')[1];
        const templateParams = {
          to_email: 'r0533147262@gmail.com',
          subject: 'Test Subject',
          message: 'Test Body',
          attachments: [
            {
              name: 'document.pdf',
              data: base64File,
            },
          ],
        };
        emailjs.send('service_w69f64v', 'template_828xdaa', { content: base64File }, '4_U5BxpQyvCU_USyQ')
          .then((response: EmailJSResponseStatus) => {
            console.log("Mail sent successfully!", response.status, response.text);
          }).catch((error) => {
            console.error("Failed to send mail:", error);
          });
      };
      //  reader.readAsDataURL(this.pdfFile);
    } else {
      alert('Please generate the PDF before sending.');
    }
  }
}


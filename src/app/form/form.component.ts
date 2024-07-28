
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
  imports: [ReactiveFormsModule, SignatureComponent,DateFormatPipe],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent implements OnInit {
  public updateForm!: FormGroup;
  @ViewChild('formContainer') formContainer!: ElementRef;
  pdfFile: File | null = null;
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
  if (sendButton) {
    sendButton.classList.add('hidden'); // Add a CSS class to hide the butto
    }
    html2canvas(this.formContainer.nativeElement).then((canvas: any) => {
      if (sendButton) {
        sendButton.classList.remove('hidden'); // Remove the hidden class to show the button back
       }
      // Convert the canvas to a data URL
      const imgData = canvas.toDataURL('image/png');

      // Set the width and height of the PDF to match the canvas
      const pdf = new jsPDF('p', 'mm', [canvas.width, canvas.height]);
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      this.sendMail()
      // Save the PDF
      pdf.save('document.pdf');
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
          attachment: base64File
        };
        emailjs.send('service_w69f64v', 'template_828xdaa', templateParams, '4_U5BxpQyvCU_USyQ')
          .then((response: EmailJSResponseStatus) => {
            console.log("Mail sent successfully!", response.status, response.text);
          }).catch((error) => {
            console.error("Failed to send mail:", error);
          });
      };
      reader.readAsDataURL(this.pdfFile);
    } else {
      alert('Please generate the PDF before sending.');
    }
  }
}


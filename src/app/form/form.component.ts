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

      this.convertBlobToBase64(pdfBlob).then(base64PDF => {
        this.sendEmail(base64PDF);
      });
    });
  }

  public convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  public sendEmail(base64PDF: string) {
    console.log('Sending email...');
    const templateParams = {
      pdfBase64String: base64PDF
    };
    emailjs.send("service_sslvwl8","template_d7ffwxm",{
      pdf: base64PDF,
      },'WYEy2hfn7R_lvrv4e',)
      .then(
        (response) => {
          console.log('SUCCESS!', response.status, response.text, templateParams);
        },
        (error) => {
          console.log('FAILED...', error);
        }
      );
  }
}
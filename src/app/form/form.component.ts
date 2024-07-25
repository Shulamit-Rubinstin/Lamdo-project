
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; // הוסף כאן
import { SignatureComponent } from '../signature/signature.component'

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';
@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule, SignatureComponent],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent implements OnInit {
  public updateForm!: FormGroup;
  @ViewChild('formContainer') formContainer!: ElementRef;
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
      date: [Date, [Validators.required]],
    });
  }
  generatePDF() {
    const sendButton = document.getElementById('formContainer')!;
    if (sendButton) {
      sendButton.classList.add('hidden');
    }
    const options = {
      useCORS: true,
      logging: true,
      willReadFrequently: true
    };
    html2canvas(this.formContainer.nativeElement, options).then((canvas: any) => {
      if (sendButton) {
        sendButton.classList.remove('hidden');
      }
      const imgData = canvas.toDataURL('image/jpeg', 0.3);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      const pdfBlob = pdf.output('blob');

      this.sendEmail(pdfBlob);
    });
  }
  public sendEmail(pdfBlob: Blob) {
    console.log('Sending email...');


    const pdfFile = new File([pdfBlob], 'form_data.pdf', { type: 'application/pdf' });
    const templateParams = {
      service_id: 'service_w69f64v',
      template_id: 'template_828xdaa',
      user_id: '4_U5BxpQyvCU_USyQ',
      attachment: pdfFile
    };

    emailjs
      .send('service_w69f64v', 'template_828xdaa', templateParams, {
        publicKey: '4_U5BxpQyvCU_USyQ',
      }
      )
      .then(
        (response) => {
          console.log('SUCCESS!', response.status, response.text, templateParams);
        },
        (error) => {
          console.log('FAILED...', error);
        },
      );
  }
}


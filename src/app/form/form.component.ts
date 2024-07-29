import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // הוסף כאן
import { SignatureComponent } from '../signature/signature.component'
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';
import { DateFormatPipe } from '../date-format.pipe';
import { SuccessMessageComponent } from '../success-message/success-message.component';
@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SignatureComponent, DateFormatPipe, SuccessMessageComponent],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent implements OnInit {
  public updateForm!: FormGroup;
  @ViewChild('formContainer') formContainer!: ElementRef;
  pdfFile: jsPDF | null = null;
  showSuccessMessage = false;
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

  //   generatePDF(): void {
  //     const sendButton = document.querySelector('button[type="button"]');
  //     const pdfWidth = 210; // specify width in mm (A4 size)
  //     const pdfHeight = 297; // specify height in mm (A4 size)
  //     const imageQuality = 0.4; // adjust the image quality as needed (0.0 - 1.0)

  //     if (sendButton) {
  //       sendButton.classList.add('hidden'); // Add a CSS class to hide the button
  //     }

  //     html2canvas(this.formContainer.nativeElement, { scale: 2 }).then((canvas: any) => {
  //       if (sendButton) {
  //         sendButton.classList.remove('hidden'); // Remove the hidden class to show the button back
  //       }

  //       const imgData = canvas.toDataURL('image/jpeg', imageQuality);
  //       const pdf = new jsPDF('p', 'mm');
  //       pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

  //       const pdfBlob = pdf.output('blob');
  // pdf.save('g.pdf');
  //       // this.convertBlobToBase64(pdfBlob).then(base64PDF => {
  //       //   this.sendEmail(base64PDF);
  //       // });
  //     });
  //   }
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
    this.showSuccessMessage = true;
    emailjs.send("service_sslvwl8", "template_d7ffwxm", {
      pdf: base64PDF,
    }, 'WYEy2hfn7R_lvrv4e',)
      .then(
        (response) => {
          console.log('SUCCESS!', response.status, response.text, templateParams);
          this.showSuccessMessage = true;
        },
        (error) => {
          console.log('FAILED...', error);
        }
      );
  }

  generatePDF(): void {
    const sendButton = document.querySelector('button[type="button"]');
    const pdfWidth = 210; // רוחב PDF במילימטרים (A4)
    const pdfHeight = 297; // גובה PDF במילימטרים (A4)
    const imageQuality = 1.0; // איכות התמונה (1.0 = האיכות הגבוהה ביותר)

    if (sendButton) {
      sendButton.classList.add('hidden'); // הסתרת כפתור השליחה
    }

    const formElement = this.formContainer.nativeElement;

    html2canvas(formElement, {
      scale: 2, // קנה מידה רגיל כדי לשמור על איכות גבוהה
      width: formElement.scrollWidth, // שימוש ברוחב המקורי של האלמנט
      height: formElement.scrollHeight // שימוש בגובה המקורי של האלמנט
    }).then((canvas: HTMLCanvasElement) => {
      if (sendButton) {
        sendButton.classList.remove('hidden'); // הצגת כפתור השליחה מחדש
      }

      const imgData = canvas.toDataURL('image/jpeg', imageQuality);
      const pdf = new jsPDF('p', 'mm', [pdfWidth, pdfHeight]);

      // חישוב יחס רוחב-גובה של התמונה
      const imgProps = pdf.getImageProperties(imgData);
      let imgWidth = pdfWidth; // הגדרת משתנים עם ערכים התחלתיים
      let imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      // אם התמונה גבוהה מדי, מתאימים לגובה של דף ה-PDF
      if (imgHeight > pdfHeight) {
        imgWidth = (imgProps.width * pdfHeight) / imgProps.height;
        imgHeight = pdfHeight;
      }
      const xOffset = (pdfWidth - imgWidth) / 2; // התאמה במרכז לרוחב
      const yOffset = (pdfHeight - imgHeight) / 2; // התאמה במרכז לגובה
      pdf.addImage(imgData, 'JPEG', xOffset, 0, imgWidth, imgHeight);

      pdf.save('d.pdf');


      const pdfBlob = pdf.output('blob');

      // this.convertBlobToBase64(pdfBlob).then(base64PDF => {
      //   this.sendEmail(base64PDF);
      // });
    });
  }

}
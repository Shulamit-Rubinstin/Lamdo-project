import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; // הוסף כאן
import { SignatureComponent } from '../signature/signature.component'

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
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
      toKosher: ['לנדא', [Validators.required]],
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

      // Save the PDF
      pdf.save('document.pdf');
    });
  }
}


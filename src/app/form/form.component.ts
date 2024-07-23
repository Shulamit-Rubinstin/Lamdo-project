import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; // הוסף כאן
import{SignatureComponent}from '../signature/signature.component'
import jsPDF from 'jspdf';
import * as pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';


@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule,SignatureComponent],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent implements OnInit{
  public updateForm!: FormGroup;
  
  constructor(private fb: FormBuilder){ }
  ngOnInit(): void {
    this.updateForm = this.fb.group({
      institutionName: ['', [Validators.required]],
      institutionSergeant:['', [Validators.required]],
      permission:['',[Validators.required]],
      fromKosher:['',[Validators.required]],
      toKosher:['לנדא',[Validators.required]],
      fullName: ['', [Validators.required]],
      class:['', [Validators.required]],
      parentsName:['',[Validators.required]],
      permissionF:['',[Validators.required]],
      toKosherF:['',[Validators.required]],
      institutionNameF:['',[Validators.required]],
      fromKosherF:['',[Validators.required]],
      date:[Date,[Validators.required]],
    });
  }
  
  generatePDF() {
    const docDefinition = {
      content: [
        { text: 'לכבוד: הורי התלמיד/ה', style: 'header' },
        { text: `שם מוסד: ${this.updateForm.get('institutionName')?.value || ''}` },
        { text: `סמל מוסד: ${this.updateForm.get('institutionSergeant')?.value || ''}` },
        { text: `רשות: ${this.updateForm.get('permission')?.value || ''}` },
        { text: `מכשרות: ${this.updateForm.get('fromKosher')?.value || ''}` },
        { text: `לכשרות: ${this.updateForm.get('toKosher')?.value || ''}` },
        { text: `תאריך: ${this.updateForm.get('date')?.value || ''}` },
        { text: 'חתימה: ...' }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          
        }
      }
    };
  
    pdfMake.createPdf(docDefinition).download('form.pdf');
  }
  
}

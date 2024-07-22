import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; // הוסף כאן
@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule],
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
      toKosher:['',[Validators.required]],
      
    });
  }
}

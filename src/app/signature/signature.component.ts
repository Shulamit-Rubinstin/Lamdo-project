import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { SignaturePadModule } from 'ngx-signaturepad';
import { SignaturePad } from 'ngx-signaturepad/signature-pad';

@Component({
  selector: 'app-signature',
  standalone: true,
  imports: [SignaturePadModule],
  templateUrl: './signature.component.html',
  styleUrl: './signature.component.css'
})
export class SignatureComponent implements AfterViewInit {

  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;
  private context!: CanvasRenderingContext2D;
  private isDrawing = false;

  ngAfterViewInit() {
    const canvas = this.canvasElement.nativeElement;
    this.context = canvas.getContext('2d')!;
    this.context.lineWidth = 2;
    this.context.strokeStyle = 'purple';
    // Add event listeners to handle drawing
    canvas.addEventListener('mousedown', (event) => this.startDrawing(event));
    canvas.addEventListener('mouseup', () => this.stopDrawing());
    canvas.addEventListener('mousemove', (event) => this.draw(event));
  }

  private startDrawing(event: MouseEvent) {
    this.isDrawing = true;
    this.context.beginPath();
    this.context.moveTo(event.offsetX, event.offsetY);
  }

  private stopDrawing() {
    this.isDrawing = false;
    this.context.closePath();
  }

  private draw(event: MouseEvent) {
    if (!this.isDrawing) return;
    this.context.lineTo(event.offsetX, event.offsetY);
    this.context.stroke();
  }

  clearCanvas() {
    const canvas = this.canvasElement.nativeElement;
    this.context.clearRect(0, 0, canvas.width, canvas.height);
  }
  saveSignature() {
    const canvas = this.canvasElement.nativeElement;
    const dataURL = canvas.toDataURL();
    window.alert('Signature saved and displayed on screen');
    // Open a new window to display the image
    const newWindow = window.open("", "", "width=600,height=400");
    if (newWindow) {
      newWindow.document.write(`<img src="${dataURL}" alt="Signature" style="width: 100%; height: auto;"/>`);
      newWindow.document.close();
    }
  }
}


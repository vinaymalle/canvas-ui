import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DrawService } from '../services/draw.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements AfterViewInit, OnInit {

  @ViewChild('canvas', { static: true }) private canvas!: ElementRef;
  painting: boolean = false;
  context: CanvasRenderingContext2D | null = null;
  drawingData: { x: number, y: number }[] = [];
  color: string = '#127bdc';

  constructor(private router: Router, private drawService: DrawService) { }

  async ngAfterViewInit() {
    this.bindEventListeners(this.canvas.nativeElement);
    this.setupCanvas(this.canvas.nativeElement);
  }

  async ngOnInit() {
    this.getPreviousData().then(() => {
      this.redraw();
    });

    this.drawService.getData().subscribe((data: any) => {
      if (Array.isArray(data)) {
        this.erase();
        return;
      }
      this.makeVisible(data.x, data.y, true);
    })

    this.drawService.getColor().subscribe((data: string) => {
      this.color = data;
    })
  }

  setupCanvas(canvas: HTMLCanvasElement): void {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.context = canvas.getContext('2d');
  }

  bindEventListeners(canvas: HTMLCanvasElement): void {
    canvas.addEventListener('mousedown', (e) => this.startPainting(e));
    canvas.addEventListener('mouseup', (e) => this.stopPainting(e));
    canvas.addEventListener('mousemove', (e) => this.draw(e));
    window.addEventListener('resize', () => this.handleResize(canvas));
  }

  handleResize(canvas: HTMLCanvasElement): void {
    this.setupCanvas(canvas);
    this.redraw();
  }

  startPainting(e: MouseEvent): void {
    if (this.context) {
      this.painting = true;
      this.draw(e);
    }
  }

  stopPainting(e: MouseEvent): void {
    if (this.context) {
      this.painting = false;
      this.context.beginPath();
    }
  }

  draw(e: MouseEvent): void {

    if (!this.painting || !this.context) {
      return;
    }

    const canvasRect = this.canvas.nativeElement.getBoundingClientRect();
    const offsetX = e.clientX - canvasRect.left;
    const offsetY = e.clientY - canvasRect.top;

    this.context.lineWidth = 5;
    this.context.lineCap = 'round';

    this.makeVisible(offsetX, offsetY);
    this.drawService.newData({ x: offsetX, y: offsetY });
  }

  makeVisible(offsetX: any, offsetY: any, asyncData = false) {

    if (!asyncData && !this.painting || !this.context) {
      return;
    }

    this.context.strokeStyle = this.color;

    this.context.lineTo(offsetX, offsetY);
    this.context.stroke();
    this.context.beginPath();
    this.context.moveTo(offsetX, offsetY);
    this.addPoint(offsetX, offsetY);
  }

  redraw(): void {
    if (!this.context) {
      return;
    }

    this.context.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    this.context.lineWidth = 5;
    this.context.lineCap = 'round';

    for (let i = 1; i < this.drawingData.length; i++) {
      const startPoint = this.drawingData[i - 1];
      const endPoint = this.drawingData[i];
      this.context.beginPath();
      this.context.moveTo(startPoint.x, startPoint.y);
      this.context.lineTo(endPoint.x, endPoint.y);
      this.context.stroke();
    }
  }

  addPoint(x: number, y: number): void {
    this.drawingData.push({ x, y });
  }

  logout(): void {
    localStorage.clear();
    this.drawService.closeConnection();
    this.router.navigateByUrl('auth');
  }

  getPreviousData() {
    return new Promise((resolve, reject) => {
      this.drawService.getDrawing().subscribe((result: any) => {
        this.drawingData = [...result.rawData];
        resolve('');
      })
    })
  }

  erase() {
    if (this.context) {
      this.context.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
      this.drawingData = [];
    }
  }

  asyncErase() {
    this.drawService.newData([]);
    this.erase();
  }

  changeColor(event: any) {
    this.drawService.changeColor(event);
  }

  save(): void {
    this.drawService.saveDrawing(this.drawingData).subscribe((result: any) => {
    })
  }
}

import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { take, filter, Observable, defer } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @Output() photoCaptured: EventEmitter<Blob> = new EventEmitter()
  @ViewChild('cameraSpan') cameraSpan: ElementRef<HTMLSpanElement> | undefined
  @ViewChild('fileInput') fileInput!: ElementRef
  @ViewChild('cameraFileInput') cameraFileInput!: ElementRef
  image: Blob | undefined
  imageSrc: SafeUrl | undefined

  isOpen = false

  constructor(
    private _sanitizer: DomSanitizer
  ) {}

  /**
   * check if permission has granted and click to input to have opened camera immediately
   */
  ngOnInit(): void {

  }

  openCamera() {
    // this.checkPermission()
    //   .pipe(
    //     take(1),
    //     filter((hasPermission) => hasPermission)
    //   )
    //   .subscribe(() => {
    //     document.getElementById('cameraFileInput')?.click();
    //   })

    navigator.mediaDevices
    .getUserMedia({ video: true })
    .then(() => {
      // setTimeout(() => {
        // const cameraFileInput = document.getElementById('cameraFileInput') as HTMLInputElement
        const cameraFileInput = this.cameraFileInput.nativeElement as HTMLInputElement
        cameraFileInput.value = ''
        cameraFileInput.click()
      // }, 0)
    })
    .catch((error) => {
      console.log('==========================')
      console.log('==========================')
      console.log('==========================')
      console.log(error)
      // const msg = this._translate.instant('msg.permission-denied')
      // this._notifier.danger(msg, msg, 5000)
    })
  }

  protected onFileSelected(event: Event): void {
    this.onCapture(event)
  }

  openGallery() {
    this.fileInput.nativeElement.click()
  }

  onCapture(event: Event): void {
    const target: HTMLInputElement = event.target as HTMLInputElement

    this.image = target.files ? target.files[0] : undefined

    if (!this.image) {
      console.log('No img')
    } else {
      this.imageSrc = this._sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.image))
      this.photoCaptured.emit(this.image)
      // this.imageSrc = undefined
    }
  }

  /**
   * check if permission was granted
   * @private
   */
  private checkPermission(): Observable<boolean> {
    return defer(async () =>
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(() => {
          return true
        })
        .catch(() => {
          console.log('Error')

          return false
        })
    )
  }
}

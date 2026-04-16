import { CommonModule } from '@angular/common';
import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {

  protected readonly title = signal('Fintastics_2k25');

  deferredPrompt: any = null;
  showInstallButton = false;

  ngOnInit() {
    window.addEventListener('beforeinstallprompt', (event: any) => {
      console.log('PWA install event fired ✅'); // 👈 DEBUG
      event.preventDefault();
      this.deferredPrompt = event;
      this.showInstallButton = true;
    });
  }

  installApp() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();

      this.deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User installed app');
        } else {
          console.log('User dismissed install');
        }
        this.deferredPrompt = null;
        this.showInstallButton = false;
      });
    }
  }
}
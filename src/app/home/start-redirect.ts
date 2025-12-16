import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

function isTrue(v: any): boolean {
  return v === true || v === 'true' || v === 1 || v === '1';
}

@Component({
  selector: 'app-start-redirect',
  standalone: true,
  template: ``,
})
export class StartRedirect implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    const permStr = localStorage.getItem('permissions');
    if (!permStr) {
      this.router.navigate(['/admin/login']);
      return;
    }

    let permissions: any[] = [];
    try {
      permissions = JSON.parse(permStr);
    } catch {
      this.router.navigate(['/admin/login']);
      return;
    }

    // Pick first allowed submenu path (ignore parent.checked)
let target: string | null = null;

for (const parent of permissions) {
  const subs = Array.isArray(parent.subtitle) ? parent.subtitle : [];
  for (const s of subs) {
    if (isTrue(s?.checked) && typeof s?.path === 'string') {
      target = s.path;
      break;
    }
  }
  if (target) break;
}

this.router.navigateByUrl(target ?? '/admin/login');

  }
}

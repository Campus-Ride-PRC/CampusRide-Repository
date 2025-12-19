import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "./auth.service";

@Injectable({
    providedIn: 'root'
})
export class RedirectService {

    constructor(
        private router: Router,
        private authService: AuthService
    ){}

    redirect(from: string, to: string) {
        console.log('RedirectService - from:', from, 'to:', to);
        
        if(from === to) {
            console.log('RedirectService - Skipping redirect, from === to');
            return;
        }

        switch(to) {
            case 'home':
                this.router.navigate(['/home']);
                break;
            case 'drives':
                this.router.navigate(['/add-drive']);
                break;
            case 'my-bookings':
                this.router.navigate(['/my-bookings']);
                break;
            case 'my-rides':
                this.router.navigate(['/my-rides']);
                break;
            case 'driver-requests':
                this.router.navigate(['/driver-requests']);
                break;
            case 'settings':
                // TODO: Navigate to settings page when implemented
                console.log('Settings feature coming soon');
                break;
            case 'profile':
                this.router.navigate(['/profile']);
                break;
            case 'communities':
                this.router.navigate(['/communities']);
                break;
            case 'logout':
                this.logout();
                break;
        }
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/welcome']);
    }
}
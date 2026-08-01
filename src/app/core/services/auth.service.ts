import { inject, Injectable, signal } from '@angular/core';
import { Auth, authState, user } from '@angular/fire/auth';
import { browserLocalPersistence, setPersistence, signInWithEmailAndPassword, signOut, User, UserCredential } from 'firebase/auth';
import { map, take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly auth = inject(Auth);

    private readonly ADMIN_EMAILS = [
        'kusurait@gmail.com',
        'radikalimovmisr2016@gmail.com',
        'umarbaygullin096@gmail.com',
    ];

    private readonly _isAdmin = signal<boolean>(false);
    readonly isAdmin = this._isAdmin.asReadonly();

    constructor() {
        this.listenAuthState();
    }

    private listenAuthState(): void {
        user(this.auth).subscribe((currentUser) => {
            this._isAdmin.set(this.isAdminEmail(currentUser));
        });
    }

    private isAdminEmail(currentUser: User | null): boolean {
        if (!currentUser?.email) return false;

        const cleanEmail = currentUser.email.trim().toLowerCase();
        return this.ADMIN_EMAILS.map(e => e.trim().toLowerCase()).includes(cleanEmail);
    }

    canActivateAdmin() {
        return authState(this.auth).pipe(
            take(1),
            map((currentUser) => this.isAdminEmail(currentUser))
        );
    }

    async login(email: string, password: string): Promise<UserCredential> {
        await setPersistence(this.auth, browserLocalPersistence);
        return await signInWithEmailAndPassword(this.auth, email.trim().toLowerCase(), password);
    }

    // Добавьте публичный метод проверки email для удобства
    public isUserAdmin(currentUser: User | null): boolean {
        return this.isAdminEmail(currentUser);
    }

    async logout(): Promise<void> {
        await signOut(this.auth);
    }

    async checkIsAdminNow(): Promise<boolean> {
        const currentUser = this.auth.currentUser;
        return this.isAdminEmail(currentUser);
    }
}
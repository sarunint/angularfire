import { Inject, Injectable, NgZone, Optional, PLATFORM_ID } from '@angular/core';
import { FirebaseOptions } from '@firebase/app-types';
import { FirebaseAuth, User } from '@firebase/auth-types';
import { FirebaseAppConfig, FirebaseAppName, FirebaseZoneScheduler, _firebaseAppFactory } from 'angularfire2';
import { Observable, from as observableFrom, of as observableOf } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class AngularFireAuth {

  /**
   * Firebase Auth instance
   */
  public readonly auth: FirebaseAuth;

  /**
   * Observable of authentication state; as of 4.0 this is only triggered via sign-in/out
   */
  public readonly authState: Observable<User|null>;

  /**
   * Observable of the signed-in user's ID token; which includes sign-in, sign-out, and token refresh events
   */
  public readonly idToken: Observable<string|null>;

  constructor(
    @Inject(FirebaseAppConfig) config:FirebaseOptions,
    @Optional() @Inject(FirebaseAppName) name:string,
    @Inject(PLATFORM_ID) platformId: Object,
    private zone: NgZone
  ) {
    const scheduler = new FirebaseZoneScheduler(zone, platformId);
    this.auth = zone.runOutsideAngular(() => {
      const app = _firebaseAppFactory(config, name);
      return app.auth();
    });

    this.authState = scheduler.keepUnstableUntilFirst(
      scheduler.runOutsideAngular(
        new Observable(subscriber => {
          const unsubscribe = this.auth.onAuthStateChanged(subscriber);
          return { unsubscribe };
        })
      )
    );

    this.idToken = scheduler.keepUnstableUntilFirst<User | null>(
      scheduler.runOutsideAngular(
        new Observable(subscriber => {
          const unsubscribe = this.auth.onIdTokenChanged(subscriber);
          return { unsubscribe };
        })
      )
    ).pipe(switchMap((user: User | null) => {
      return user ? observableFrom(user.getIdToken()) : observableOf(null)
    }));

  }

}

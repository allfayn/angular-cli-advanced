import { Injectable } from '@angular/core';
import { NgServiceWorker } from '@angular/service-worker';

@Injectable()
export class ServiceWorkerService {

  private swScope = './';
  private swUrl = './worker-basic.min.js';

  constructor(public sw: NgServiceWorker) {
  }

  // for notification testing use https://web-push-codelab.appspot.com/
  public initNotification() {
    this.logging();
    this.checkServiceWorker().then( reg => {
      if (!reg.active) {
        return this.installWorker();
      }
      return reg.reg;
    }).then(r => this.subscribeToPush()).then(s => this.registerForPush());
  }

  logging() {
    this.sw.log().subscribe(message => console.log(message));
  }

  checkServiceWorker(): Promise<any> {

    return navigator['serviceWorker']
      .getRegistration(this.swScope)
      .then(reg => {
        return {
          scope: reg.scope,
          active: !!reg.active,
          installing: !!reg.installing,
          waiting: !!reg.waiting,
          reg: reg
        };
      })
      // .then(value => JSON.stringify(value))
      .then(value => {
        console.log(value);
        return value;
      });
  }

  forceUpdate(): void {

    this
      .sw
      .checkForUpdate()
      .subscribe(res => {
        console.log(JSON.stringify(res));
      });

  }

  pingCompanion(): void {

    this
      .sw
      .ping()
      .subscribe(undefined, undefined, () => {
        console.log('pong');
      });

  }

  loadCacheKeys(): void {
    const caches = window['caches'];
    caches.keys().then(keys => console.log(JSON.stringify(keys)));
  }

  installWorker(): Promise<void | ServiceWorkerRegistration> {

    return navigator['serviceWorker']
      .register(this.swUrl, {scope: this.swScope})
      .then(registration => {

        console.log('Service Worker registered. Registration: ', registration);

        return registration;

      })

      .catch(error => {
        console.log('There was a problem with the Service Worker', error);
      });
  }

  uninstallWorker(): Promise<void> {

    return navigator['serviceWorker']
      .getRegistration(this.swScope)
      .then(registration => {

        registration.unregister().then(function (boolean) {

          console.log(boolean ? 'Service Worker unregister is successful' : 'Service Worker unregister is unsuccessful');

        });

      })
      .catch(error => {
        console.log(error);
      });

  }

  subscribeToPush(): Promise<void> {

    function urlBase64ToUint8Array(base64String) {
      const padding = '='.repeat((4 - base64String.length % 4) % 4);
      const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);
      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    }

    const vapidPublicKey = 'BCThRlgA9-tKdLeNJuSO2_FZpJ7z6-KT7mygWSCyVlB6oJiML89jmt8u4muEfgCsebtvoGqVHcmuXiHDu0wqWLs';
    const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

    return navigator['serviceWorker']
      .getRegistration(this.swScope)
      .then(registration => {

        return registration.pushManager
          .subscribe({userVisibleOnly: true, applicationServerKey: convertedVapidKey})
          .then(function (subscription) {
            console.log('Subscription', JSON.stringify(subscription));
          });

      })
      .catch(error => {
        console.log(error);
      });

  }

  unsubscribeFromPush(): Promise<void> {

    return navigator['serviceWorker']
      .getRegistration(this.swScope)
      .then(registration => {

        registration.pushManager.getSubscription().then(function (subscription) {
          subscription.unsubscribe().then(success => {
            console.log('Unsubscription successful', success);
          }).catch(error => {
            console.log('Unsubscription failed', error);
          });
        });

      })
      .catch(error => {
        console.log(error);
      });

  }

  registerForPush(): void {
    this
      .sw
      .registerForPush()
      .subscribe(handler => {
        console.log(JSON.stringify({
          url: handler.url,
          key: handler.key(),
          auth: handler.auth()
        }));
      });

    this
      .sw
      .push
      .map(value => JSON.stringify(value))
      .subscribe(value => {
        console.log(value);
      });


  }

}

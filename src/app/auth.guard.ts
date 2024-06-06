import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  let token = localStorage.getItem("token");
  const router = inject(Router);

  if(token){
    debugger
    router.navigateByUrl('dashboard');
    return false;
  }
  return true;
};

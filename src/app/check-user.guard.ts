import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const checkUserGuard: CanActivateFn = (route, state) => {
  let token = localStorage.getItem("token");
  const router = inject(Router);

  if(!token){
    router.navigateByUrl('auth')
    return false
  }
  return true;
};

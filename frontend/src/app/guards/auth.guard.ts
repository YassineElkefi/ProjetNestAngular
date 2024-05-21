import { Inject, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';


export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const cookieService = inject(CookieService);

  if (cookieService.get("user")){
    
    return true;
  }else{
    router.navigate(['/auth/login']);
    return false;
  }
}
;

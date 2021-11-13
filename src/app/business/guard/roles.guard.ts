import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable, of } from 'rxjs';
import {AuthService} from "../../auth/service/auth.service";
import {catchError, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class RolesGuard implements CanActivate {
  constructor(
    private authService: AuthService, // сервис аутентификации
    private router: Router// для навигации, перенаправления на другие страницы
  )
  { }
  /*
  Метод автоматически вызывается каждый раз при переходе по URI, связанному с route (если данный класс указан для этого route).
  Возвращается true - осуществляется переход, false - переход запрещен.
 */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // route - параметр, который хранит значение - по какому URL хотим перейти
    // 1. Залогинен ли вообще пользователь
    // 2. Есть ли у него соотв. роли

    if (this.authService.isLoggedIn) { // если пользователь уже залогинен
      // если у пользователя есть права на эту страницу - вернется true и произойдет переход на запрошенный url
      return this.userHasRequiredRole(this.authService.currentUser.getValue().roleSet, route.data.allowedRoles);
    }
    // Пытаемся провести автоматическую аутентификацию.
    // Если в браузере был сохранен jwt-кук, он будет отправлен на backend и пользователь автоматически залогинится

    // отправляем запрос для получения пользователя (т.к. пользователь не хранится локально, это небезопасно)
    // при каждом обновлении страницы - нужно получить заново пользователя из backend
    return this.authService.autoLogin().pipe( // не путать pipe из angular и pipe из rxjs
      map(result => {
        if (result) {

          const user = result; // получаем пользователя из JSON
          // сохраняем пользователя в сервис, чтобы далее можно было получать пользователя оттуда
          this.authService.currentUser.next(user);

          // индикатор, что пользователь успешно залогинился
          this.authService.isLoggedIn = true;


          // если у пользователя есть права на эту страницу - вернется true и произойдет переход на запрошенный url
          return this.userHasRequiredRole(user.roleSet, route.data.allowedRoles);

        } else { // если пользователь неавторизован - отправить его на главную стр.
          this.authService.onNavigate();
          // this.router.navigateByUrl(''); // корень сайта (главная страница)
          return false; // не переходить по запрошенному url
        }
      }),
      catchError((err) => {
        console.log(err);
        this.authService.onNavigate();
        // this.router.navigateByUrl(''); // корень сайта (главная страница)
        return of(false); // не переходить по запрошенному url
      })
    );
    return true;
  }
  /* проверяет пересечение ролей из 2-х списков

userRoles - роли пользователя
allowedRoles - роли для доступа к URI

*/
  private userHasRequiredRole(userRoles: Array<any>, allowedRoles: Array<string>): boolean {

    for (const r of allowedRoles) {
      if (userRoles.find(e => e.name === r)) {
        return true; // если совпала хотя бы одна найденная запись
      }
    }

    this.router.navigate(['/access-denied']); // если нет доступа - отправляем на страницу access-denied
    return false; // нужная роль не найдена
  }
}

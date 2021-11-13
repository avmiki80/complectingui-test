import {Inject, Injectable, InjectionToken} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

export const AUTH_URL_TOKEN = new InjectionToken<string>('url');
export const LOGIN_URL_TOKEN = new InjectionToken<string>('login url');

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn: boolean;
  currentUser = new BehaviorSubject<User>(null); // текущий залогиненный пользователь (по умолчанию null)
  constructor(
    private httpClient: HttpClient,
    @Inject(AUTH_URL_TOKEN) private url,
    @Inject(LOGIN_URL_TOKEN) private loginUrl,
    private router: Router
  ) {
  }
  public logout(): void{
    this.currentUser.next(null); // обнудение текущего пользователя
    this.isLoggedIn = false; // указываем что пользователь разлогинился
    // чтоб удалить кук с флагом httpOnly - нужно попросить об этом сервер, т.к. клиент не имеет доступ к куку
    this.httpClient.post<any>(this.url + '/logout', null).subscribe();
    this.onNavigate();
    // this.router.navigate(['']); // переход на страницу с бизнес данными
  }
  // авто логин пользователя (если есть в куках JWT - от бекенда вернется статус 200 и текущий пользователь)
  public autoLogin(): Observable<User> {
    return this.httpClient.post<User>(this.url + '/auto', null); // ничего не передаем (пустое тело)
  }
  public onNavigate(): void{
    window.open(this.loginUrl);
  }
}
/*
Классы (объекты) для запросов и их результатов, которые автоматически будут преобразовываться в JSON.
Это аналог entity классов из backend проекта (в упрощенном виде)
Должны совпадать по полям с entity-классами backend!!! (иначе не будет правильно отрабатывать автом. упаковка и распаковка JSON)
*/

// пользователь - хранит свои данные
export class User {
  id: number; // обязательное поле, по нему определяется пользователь
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  patronymicName: string;
  // unit: Unit;
  description: string;
  // activity: boolean;
  password: string; // не передается с сервера (только от клиента к серверу, например при обновлении пароля)
  roleSet: Array<Role>; // USER, ADMIN, MODERATOR
}
// роль пользователя
export class Role {
  id: number;
  name: string;
  viewName: string;
  description: string;

  constructor(id: number, name: string, viewName?: string, description?: string) {
    this.id = id;
    this.name = name;
    this.viewName = viewName;
    this.description = description;
  }
}


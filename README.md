# CRM React

Фронтенд CRM-система на React с ролевым разграничением доступа (admin/user) и JWT-аутентификацией

## Стек

- **[React 19](https://react.dev/)** + **[TypeScript](https://www.typescriptlang.org/)** — UI и типизация
- **[Vite](https://vite.dev/)** — сборка и dev-сервер
- **[Redux Toolkit](https://redux-toolkit.js.org/)** + **[RTK Query](https://redux-toolkit.js.org/rtk-query/overview)** — состояние приложения и работа с API
- **[React Router](https://reactrouter.com/)** (v7) — маршрутизация, включая защищённые роуты
- **[Axios](https://axios-http.com/)** — HTTP-клиент с interceptor'ами для refresh-токена
- **[ESLint](https://eslint.org/)** (+ `eslint-plugin-boundaries`) — контроль архитектурных границ между слоями

## Архитектура

Проект организован по принципам **Feature-Sliced Design**:

```
src/
├── app/            # инициализация приложения: роутер, store, layouts
│   ├── layouts/     # AdminLayout, UserLayout
│   ├── router/      # RequireRole, RootRedirect
│   └── store/       # Redux store, типизированные хуки
├── entities/       # бизнес-сущности
│   ├── session/     # логика сессии (login/logout)
│   └── user/        # модель пользователя, селекторы, API
├── pages/          # страницы (login, logout, 404)
└── shared/         # переиспользуемый код без бизнес-логики
    ├── api/         # axios-инстанс, базовый query для RTK Query
    └── config/      # константы (роуты и т.п.)
```

Импорты между слоями выполняются через абсолютные пути с префиксом `src/*` (настроено в [tsconfig.app.json](tsconfig.app.json)).

## Аутентификация и роли

- После логина access-токен хранится в памяти ([`api-instance.ts`](src/shared/api/api-instance.ts)), при получении `401` axios автоматически дёргает `/auth/refresh` и повторяет запрос.
- Пользователь имеет роль `admin` или `user` ([`user-types.ts`](src/entities/user/model/user-types.ts)).
- `RequireRole` перенаправляет неавторизованных на `/login`, а пользователей с неподходящей ролью — на корень.
- `RootRedirect` направляет авторизованного пользователя в `/admin` или `/app` в зависимости от роли.

## Быстрый старт

```bash
npm install
```

Создайте `.env` в корне проекта (см. [.env](.env) как пример):

```
VITE_API_URL=http://localhost:5000
```

Запуск dev-сервера:

```bash
npm run dev
```

## Скрипты

| Команда           | Назначение                                  |
| ----------------- | ------------------------------------------- |
| `npm run dev`     | запуск дев-сервера Vite с HMR               |
| `npm run build`   | проверка типов (`tsc -b`) и продакшн-сборка |
| `npm run preview` | локальный просмотр production-сборки        |
| `npm run lint`    | проверка кода ESLint                        |

## Статус проекта

Проект находится на ранней стадии: реализованы аутентификация, ролевая маршрутизация и базовый layout для admin/user. Основной функционал CRM (сущности, экраны, формы) ещё предстоит добавить.

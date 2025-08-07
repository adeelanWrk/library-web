# LibraryWeb
# 📚 library-web

ระบบเว็บแอปพลิเคชัน Angular สำหรับจัดการข้อมูล (Data Management Web App)  
พัฒนาโดยใช้ Angular 20 พร้อม AG Grid Community, Angular Material, และการจัดการข้อมูลขั้นสูงทั้งฝั่ง Client และ Server

---

## 📂 โครงสร้างโปรเจกต์
```plaintext
src/
└── app/
└── features/
├── authors/
│ ├── components/
│ │ ├── author-dropdown/
│ │ └── authors-grid-page/
│ ├── models/
│ ├── pages/
│ └── services/
├── books/
│ ├── components/
│ │ ├── ag-extension-components/
│ │ ├── book-list/
│ │ ├── book-table/
│ │ ├── history-track/
│ │ └── text-to-table/
│ │ └── text-to-table-dialog/
│ ├── models/
│ ├── pages/
│ │ ├── books-grid-page/
│ │ ├── books-overview-mui/
│ │ └── books-overview-page/
│ └── services/
└── core/
├── alert/
└── Pagination/
└── pagination.component/

## 🧠 แนวคิดการออกแบบ

- โครงสร้างแบบ **feature-first** (authors, books, core)
- แยก `components`, `services`, และ `models` ภายในแต่ละ feature อย่างชัดเจน
- ใช้ reusable component เช่น `PaginationComponent` หรือ `alert`  ใน `core`
- ใช้ lazy-loaded routing สำหรับ pages ต่าง ๆ เพื่อเพิ่ม performance



---

## 🧰 Tech Stack

| Stack | รายละเอียด |
|-------|------------|
| **Framework** | Angular 20 |
| **UI Library** | Angular Material, @ng-select/ng-select, SweetAlert2 |
| **Data Grid** | AG Grid (Community Edition) |
| **Reactive** | RxJS 7.8 |
| **Export** | file-saver |
| **Style** | Tailwind  |

---

## ✨ จุดเด่นของโปรเจกต์

### ✅ 1. Custom Server-Side Filter

มีการ **เขียนฟีเจอร์ filter ฝั่งเซิร์ฟเวอร์เอง** (server-side filtering) โดยใช้ AG Grid Community Edition ซึ่งไม่รองรับ built-in server-side filtering โดยตรง  
👉 เขียน logic ดักจับ filter model และส่งไป backend เองเพื่อประมวลผล

### 🚀 2. Lazy Loading / Infinite Scroll

ใช้ AG Grid แบบ `infinite row model` เพื่อ Render ข้อมูลแบบ **lazy loading**
ช่วยลดเวลาในการ render หน้า HTML 

### 🔍 3. Client-Side Filtering

รองรับการหน้า full filter Client-Side

---

## ⚙️ วิธีติดตั้ง

```bash
git clone <repository-url>
cd library-web
npm install
ng serve



















This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.1.1.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

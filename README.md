# PCC SD Portal Web Application

## Installation

```bash
  # Install libraries dependencies
  $ npm install
```

### Tools

- [Node.js](https://nodejs.org/en/blog/release/v16.16.0) - version 16.16.0
- [Angular CLI](https://www.npmjs.com/package/@angular/cli/v/14.2.0) - version 14.2.0

### Extension for VSCode

- EsLint
- Prettier
- Angular Language Service
- Error Lens
- Tailwind CSS IntelliSense
- Headwind
- Inline fold

## Running the application

```bash
  # Run the application
  $ npm start
```

## Build the application

```bash
  # Build the application for production
  $ npm run build:prod

  # Build the application for development
  $ npm run build:dev
```

## Commit format

### โครงสร้าง Commit Message

```bash
<type>[optional scope]: <subject>
```

### ประเภทของ Type Commit

- build: เมื่อปรับปรุง build config หรือ development tools (เช่น: เกี่ยวข้องกับ npm หรือการเพิ่ม dependencies)
- feat: เมื่อเพิ่มคุณสมบัติใหม่ (feature)
- chore: เมื่อมีการเปลี่ยนแปลงค่า Ignore หรือค่า Settings ที่ไม่กระทบกับ Code โดยตรง (เช่นที่: .gitignore หรือ .prettierrc)
- fix: เมื่อแก้ไขข้อผิดพลาด (bug fix)
- docs: เมื่อเพิ่มหรือแก้ไขเอกสาร (documentation)
- refactor: เมื่อเปลี่ยนแปลงโค้ดที่ไม่ได้แก้ไขข้อผิดพลาด (bug fix) หรือเพิ่มคุณสมบัติ (feature)
- perf: เมื่อปรับปรุงโค้ดที่เป็นการปรับปรุงประสิทธิภาพ (performance)
- style: เมื่อเปลี่ยนแปลงโค้ดที่เป็นการปรับปรุงรูปแบบโค้ด (formatting, missing semi colons, …)
- test: เมื่อเพิ่มโค้ดทดสอบ (test) หรือแก้ไขโค้ดทดสอบที่มีอยู่

### ตัวอย่าง Commit Message

```bash
  $ feat: add new feature

  $ fix: fix bug

  $ docs(readme): update readme
```

อ่านเพิ่มเติมได้ที่ [Conventional Commits](https://www.conventionalcommits.org/th/v1.0.0/)

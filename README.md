# 📚 Jawad Shelf — Personal Study Library

> **Jawad Shelf** is a personal study library made by me for **Myself** to keep university course materials organized in one place.
>
> 🌐 **Live Demo:** [jawadshelf.netlify.app](https://jawadshelf.netlify.app/)

---

## ✨ Features

* 📚 Organize materials by course
* 📄 Support PDF, PPTX, DOCX, HTML & Images
* 🌐 Open interactive study guides
* 🗂️ Simple folder-based organization
* 🔄 Automatically update materials

---

## 🚀 Clone & Run

Clone the repository:

```bash
git clone https://github.com/Tahsin-Jawad/JawadShelf.git
cd JawadShelf
```

Install dependencies:

```bash
npm install
```

Sync the study materials:

```bash
node scripts/generate-materials.js
```

Start the app:

```bash
npm run dev
```

Then open:

```text
http://localhost:5173
```

---

## 📁 Add New Materials

Create a course folder inside:

```text
public/materials/
```

Use this structure:

```text
CSE 345/
├── Chapters/
│   ├── chapter_1.pdf
│   └── lecture_2.pptx
└── Others/
    ├── guide.html
    └── diagram.png
```

* **`Chapters/`** → PDF, PPTX, DOCX
* **`Others/`** → HTML, Images, other files

> ⚠️ Avoid special characters like `& # % ?` in file and folder names. Use `_` or `-` instead.

---

## 🔄 Update & Deploy

After adding, removing, renaming, or changing materials:

### 1. Update the manifest

```bash
node scripts/generate-materials.js
```

### 2. Get the latest GitHub changes

```bash
git pull origin main
```

### 3. Push your changes

```bash
git add .
git commit -m "Added new materials"
git push origin main
```

Netlify will automatically update the live website after the changes are pushed to GitHub.

> ⚠️ If `git push` is rejected and you know you need to replace the remote version:
>
> ```bash
> git push origin main --force
> ```
>
> Use `--force` carefully because it can overwrite remote changes.

---

## 🧩 Customize for Yourself

If you clone this project for your own study library:

1. Change **`Jawad Shelf`** to your preferred name in the app files.
2. Update the page title in `index.html`.
3. Replace the materials inside `public/materials/` with your own courses.

---

## 🛠️ Main Commands

| Command                              | Purpose                   |
| ------------------------------------ | ------------------------- |
| `npm install`                        | Install dependencies      |
| `node scripts/generate-materials.js` | Update materials          |
| `npm run dev`                        | Run locally               |
| `npm run build`                      | Build for production      |
| `git pull origin main`               | Get latest GitHub changes |
| `git push origin main`               | Upload changes to GitHub  |

---

> **Study smarter. Keep everything in one place.**

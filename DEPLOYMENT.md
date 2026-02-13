# 🚀 Student OS - Deployment Guide

## Quick Deployment to GitHub Pages

### Step 1: Prepare Your Files

You have received a folder called `student-os` with the following structure:

```
student-os/
├── index.html
├── style.css
├── README.md
└── js/
    ├── main.js
    ├── data.js
    ├── state.js
    ├── persistence.js
    ├── dashboard.js
    ├── courseDetail.js
    └── ui.js
```

### Step 2: Create a GitHub Repository

1. Go to [github.com](https://github.com)
2. Click the "+" icon in the top right → "New repository"
3. Enter a repository name (e.g., `student-os` or `academic-dashboard`)
4. Choose "Public" (required for free GitHub Pages)
5. **DO NOT** initialize with README, .gitignore, or license
6. Click "Create repository"

### Step 3: Upload Files to GitHub

**Option A: Using Git Command Line**

```bash
# Navigate to your student-os folder
cd student-os

# Initialize git repository
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - Student OS Dashboard"

# Add GitHub as remote (replace with your URL)
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push to GitHub
git push -u origin main
```

**Option B: Using GitHub Desktop**

1. Download [GitHub Desktop](https://desktop.github.com)
2. File → Add Local Repository → Choose `student-os` folder
3. Click "Publish repository" button
4. Select your repository name and click "Publish Repository"

**Option C: Upload Files Directly on GitHub**

1. On your repository page, click "uploading an existing file"
2. Drag and drop ALL files and folders from `student-os`
3. Scroll down and click "Commit changes"

### Step 4: Enable GitHub Pages

1. On your repository page, click "Settings" (top menu)
2. In the left sidebar, click "Pages"
3. Under "Source", select:
   - Branch: `main`
   - Folder: `/ (root)`
4. Click "Save"
5. Wait 1-2 minutes for deployment
6. Your site URL will appear at the top of the Pages settings:
   ```
   https://YOUR_USERNAME.github.io/YOUR_REPO/
   ```

### Step 5: Access Your Dashboard

1. Click the URL or visit it in your browser
2. Bookmark it for quick access
3. Start using your academic dashboard!

---

## ✏️ Customizing Your Schedule

Open `js/data.js` and modify the `SCHEDULE_DATA` object with your courses.

After making changes:
```bash
git add js/data.js
git commit -m "Updated course schedule"
git push
```

GitHub Pages will automatically rebuild in 1-2 minutes.

---

## 🎨 Theme Customization

Edit `style.css` to change colors. Look for the `:root` section at the top and modify CSS variables like:
- `--color-accent` for accent color
- `--color-bg-primary` for background
- `--color-text-primary` for text

---

## 📱 Mobile Access

Add to home screen on iOS/Android for an app-like experience!

---

**Your academic dashboard is now live and ready to use! 🎓**

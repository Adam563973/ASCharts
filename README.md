# ASCharts 1.5.0

**A calmer, more personal Class Charts experience.**

ASCharts is a lightweight browser extension that customises the appearance and day-to-day usability of [Class Charts](https://www.classcharts.com/). It adds a command palette, theme controls, accessibility options, navigation helpers, local profile customisation, settings backup, and optional confetti celebrations.

ASCharts is an independent community project. It is **not affiliated with, endorsed by, or supported by Class Charts or Tes**. It does not replace Class Charts, provide school-account credentials, or bypass the site's sign-in or access controls.

> **Version:** `1.5.0`  
> **Extension format:** Chromium-style Manifest V3 content-script extension  
> **Build step:** None required  
> **Package manager:** None required

---

## Contents

- [Features](#features)
- [Keyboard shortcuts](#keyboard-shortcuts)
- [Installation](#installation)
  - [Install from a GitHub repository with GitHub CLI](#install-from-a-github-repository-with-github-cli)
  - [Install from the ASCharts ZIP archive](#install-from-the-ascharts-zip-archive)
  - [Load the extension in your browser](#load-the-extension-in-your-browser)
- [Using ASCharts](#using-ascharts)
- [Settings guide](#settings-guide)
- [Project structure](#project-structure)
- [Development and testing](#development-and-testing)
- [GitHub CLI and Git workflow](#github-cli-and-git-workflow)
- [Privacy and data storage](#privacy-and-data-storage)
- [Troubleshooting](#troubleshooting)
- [Known limitations](#known-limitations)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### Appearance and themes

- **Light, dark, and system themes.** System mode follows the browser/device colour-scheme preference.
- **Custom accent colours.** Choose from the built-in palette or enter a custom hexadecimal colour.
- **Adjustable corners.** Choose sharp, balanced, or rounded controls and cards.
- **Content density.** Switch between comfortable spacing and a compact layout.
- **Background styles.** Choose the default, soft, or flat page background.
- **Header branding.** Optionally replace Class Charts wording in the header and page title with the ASCharts wordmark.

### Layout and navigation

- Narrow, default, or wide sidebar.
- Compact sidebar spacing and a one-click hide/show control.
- Optional page and card entrance transitions.
- Optional card hover lift.
- Refined homework detail-card presentation.
- Optional scroll-progress line and floating **Back to top** button.
- Updated navigation icons and selected-page styling.
- A searchable command palette for pages, settings, and common actions.

### Accessibility and readability

- Small, default, or large interface text.
- Comfortable reading mode for longer homework, announcement, and message text.
- High-contrast styling for clearer borders and text.
- Configurable animation speed.
- Reduce Motion option for a calmer interface. It also disables the confetti celebration.
- Keyboard-accessible controls and shortcuts for common actions.

These options are visual aids, not a guarantee that every Class Charts page meets a particular accessibility standard. The website's own markup and behaviour still affect the result.

### Local profile customisation

- Set a display name shown on the profile card in this browser.
- Choose a custom profile avatar for this browser.
- Restore the original display name or avatar at any time.

These changes are local presentation preferences. The display name does **not** rename the school account or change the name stored by the school.

### Productivity and quality-of-life tools

- **Command palette:** find pages, settings, and common actions without hunting through menus.
- **Keyboard shortcut sheet:** press `?` to view the shortcut reference.
- **Quick navigation:** jump to Behaviour, Announcements, Homework, Detentions, Timetable, or Messages.
- **Copy page link:** copy the current page URL from the command palette.
- **Copy supported code values:** eligible short alphanumeric code values on supported dialogs can be copied by clicking or keyboard activation.
- **Settings export/import:** back up preferences to a JSON file and restore them later.
- **Confirmation toasts:** brief on-screen messages after many settings changes and actions.

### Optional detention-free celebration

When enabled, ASCharts can display a confetti effect when the Detentions page confirms there are no detentions. The feature is **off by default**. You can configure the intensity and duration, and optionally enable a short chime. Reduce Motion disables the celebration.

The celebration is a visual effect only. It does not change, remove, or report any school records.

### Small interface refinements

The extension also includes targeted polish for supported Class Charts elements, including announcement and positive-point presentation, the date-of-birth dialog associated with “My Code”, the report-concern confirmation flow, and some homework navigation behaviour. These enhancements depend on the page structure used by the current Class Charts site and may need updates if the website changes.

---

## Keyboard shortcuts

Shortcuts are handled by the extension on supported Class Charts pages. When a shortcut is intended for navigation, avoid using it while typing into a text field.

| Shortcut | Action | Notes |
|---|---|---|
| `Ctrl + K` / `⌘ + K` | Open or close the command palette | Works on Windows/Linux and macOS. |
| `Alt + Shift + S` | Open or close ASCharts settings | Opens the settings panel. |
| `Alt + Shift + 1` | Go to Behaviour | Requires **Quick navigation shortcuts** to be enabled. |
| `Alt + Shift + 2` | Go to Announcements | Requires **Quick navigation shortcuts** to be enabled. |
| `Alt + Shift + 3` | Go to Homework | Requires **Quick navigation shortcuts** to be enabled. |
| `Alt + Shift + 4` | Go to Detentions | Requires **Quick navigation shortcuts** to be enabled. |
| `Alt + Shift + 5` | Go to Timetable | Requires **Quick navigation shortcuts** to be enabled. |
| `Alt + Shift + 6` | Go to Messages | Requires **Quick navigation shortcuts** to be enabled. |
| `Alt + Shift + F` | Toggle the sidebar | Available independently of the optional page-navigation setting. |
| `Alt + Shift + L` | Toggle light/dark theme | Switches between light and dark mode. |
| `Alt + Shift + D` | Toggle compact/comfortable density | Switches the content spacing. |
| `?` | Show keyboard shortcuts | Press when focus is not in an editable field. |
| `Esc` | Close the active panel | For example, the palette or shortcut sheet. |

The command palette also supports the **Up/Down arrow keys** to move through results and **Enter** to open the selected item. Use `Esc` to close it.

Quick navigation shortcuts can be turned on or off in **Settings → Features → Productivity**. The command palette and shortcut sheet remain available regardless of that setting.

---

## Installation

There is no compilation step. The extension's `manifest.json`, JavaScript files, and CSS files are loaded directly by the browser.

### Install from a GitHub repository with GitHub CLI

These commands assume the project has been published to GitHub. Replace `OWNER/REPOSITORY` with the actual GitHub owner and repository name. The supplied ZIP archive does not identify a canonical GitHub URL, so no owner or repository address is assumed here.

#### 1. Install Git and GitHub CLI

- Install **Git**: <https://git-scm.com/downloads>
- Install **GitHub CLI (`gh`)**: <https://cli.github.com/>
- GitHub CLI manual: <https://cli.github.com/manual/>

Check that they are available:

```bash
git --version
gh --version
```

#### 2. Sign in to GitHub

```bash
gh auth login
gh auth status
```

Follow the prompts and choose the GitHub host and sign-in method appropriate for your account. Public repositories can usually be cloned without signing in, but authentication is needed for many repository-management operations and private repositories.

#### 3. Clone the repository

```bash
gh repo clone OWNER/REPOSITORY
cd REPOSITORY
```

For a custom local directory name:

```bash
gh repo clone OWNER/REPOSITORY ASCharts
cd ASCharts
```

GitHub CLI's `gh repo clone` command is documented at <https://cli.github.com/manual/gh_repo_clone>.

If you prefer standard Git, or do not want to install GitHub CLI, use the repository's HTTPS URL instead:

```bash
git clone https://github.com/OWNER/REPOSITORY.git
cd REPOSITORY
```

**Important:** replace the placeholders with the real URL. A clone is available only after a Git repository exists on GitHub. Downloading the ZIP is not the same as cloning: a ZIP normally does not contain the Git history, branches, or remotes.

### Install from the ASCharts ZIP archive

If you received `ASCharts-1.5.0.zip` directly, you can install that source archive without Git or GitHub CLI.

**Windows PowerShell** (run from the folder containing the ZIP):

```powershell
Expand-Archive -Path .\ASCharts-1.5.0.zip -DestinationPath .\ASCharts-1.5.0
```

**macOS / Linux:**

```bash
unzip ASCharts-1.5.0.zip -d ASCharts-1.5.0
```

The extracted directory should contain `manifest.json` along with the `.js` and `.css` files. Select the directory that directly contains `manifest.json` when loading the extension, not a parent directory that contains several unrelated files.

### Load the extension in your browser

The following steps describe a manual, developer-mode installation. They are useful when installing from a source ZIP or a local clone.

1. Extract the archive or clone the repository.
2. Open your browser's extension-management page:
   - **Google Chrome:** enter `chrome://extensions` in the address bar.
   - **Microsoft Edge:** enter `edge://extensions`.
   - **Brave:** enter `brave://extensions`.
3. Turn on **Developer mode**.
4. Select **Load unpacked**.
5. Choose the extracted ASCharts project directory, the one containing `manifest.json`.
6. Open or reload Class Charts at <https://www.classcharts.com/>.
7. Open the ASCharts settings panel and adjust the appearance and features to suit you.

The manifest registers content scripts for `classcharts.com` and its subdomains. The extension does not provide a separate toolbar popup or background page in this version; its controls are added to supported Class Charts pages.

### Updating a manually installed copy

1. Make a backup of your preferences from **ASCharts Settings → Data → Export settings** if you want to keep a portable copy.
2. Download or clone the updated project into a directory.
3. Open the extension-management page and use the extension's **Reload** control, or remove the old unpacked entry and load the updated directory.
4. Refresh Class Charts.

When updating an unpacked extension, keep track of which directory the browser has loaded. Replacing files in some other folder will not update the version currently being used by the browser.

---

## Using ASCharts

### Open the command palette

Press `Ctrl + K` on Windows/Linux or `⌘ + K` on macOS. Start typing to filter available pages, settings panels, and actions. Select a result with the arrow keys and press `Enter`, or click the result.

Common actions include changing the theme, toggling sidebar visibility, changing content density, reducing motion, opening a settings category, showing the shortcut list, celebrating, copying the current page link, and exporting settings.

### Open settings

Press `Alt + Shift + S`, or select a settings action from the command palette. The settings panel is organised into seven sections: **Appearance**, **Layout**, **Accessibility**, **Profile**, **Features**, **Data**, and **About**.

Most visual changes apply immediately. If a preference does not seem to apply, refresh the Class Charts page and check the relevant option again.

### Back up or transfer settings

1. Open **Settings → Data & backup**.
2. Choose **Export settings** to download `ascharts-settings.json`.
3. On the other browser or installation, open the same section and choose **Import settings**.
4. Select the JSON backup file.

An import restores recognised ASCharts preference keys. Unknown keys are ignored, and malformed files are rejected. Export files can contain your custom display name and the avatar data stored with your preferences, so keep the file private if those details are personal.

### Reset preferences

Open **Settings → Data & backup → Reset all settings** and confirm the prompt. This clears ASCharts preferences from the current site storage and restores default behaviour. The reset cannot be undone unless you have a backup file.

Resetting ASCharts does not reset your Class Charts account or change records held by your school.

---

## Settings guide

### Appearance

| Option | What it changes |
|---|---|
| Theme | Light, dark, or follow the system preference. |
| Accent colour | Built-in accent swatches or a custom hexadecimal colour. |
| Corner radius | Sharp, balanced, or rounded UI elements. |
| Content density | Comfortable or compact spacing. |
| Background | Default, soft, or flat background treatment. |

The available preset accent colours are navy, blue, purple, green, red, orange, pink, and teal. The custom colour control accepts a six-digit hexadecimal value, with or without a leading `#`.

### Layout

| Option | What it changes |
|---|---|
| Sidebar width | Narrow, default, or wide. |
| Compact sidebar | Reduces navigation-item spacing. |
| Hide sidebar | Collapses the navigation rail; use the toolbar toggle to show it again. |
| Page transitions | Adds entrance animations to supported pages and cards. |
| Card hover lift | Adds a small hover movement to supported cards. |
| Refined homework card | Adjusts spacing and typography in homework details. |
| Scroll progress bar | Shows reading progress beneath the header. |
| Back to top button | Adds a floating return-to-top control after scrolling. |
| Replace Class Charts branding | Uses ASCharts branding in supported header text and the document title. |

### Accessibility

| Option | What it changes |
|---|---|
| Font size | Small, default, or large interface text. |
| Comfortable reading | Increases line spacing in supported text-heavy areas. |
| High contrast | Strengthens borders and text contrast. |
| Animation speed | Off, slow, normal, or fast transitions. |
| Reduce motion | Suppresses larger motion effects and turns off the celebration. |

### Profile

- **Profile picture:** pick an image file for the local profile card. The image is resized to fit within 128 by 128 pixels and stored as JPEG data in the browser's site storage.
- **Display name:** enter a local display name of up to 40 characters. Leave it blank or restore the original value to show the site's name again.

The controls affect how the profile card looks in this browser. They do not change account details in the school's Class Charts system.

### Features

| Option | What it changes |
|---|---|
| Detention-free celebration | Enables or disables the confetti effect on a qualifying Detentions page. Off by default. |
| Confetti intensity | Light, medium, or full effect. |
| Confetti duration | Configurable from 2 to 8 seconds. |
| Celebration sound | Enables a short three-note chime. Off by default. |
| Quick navigation shortcuts | Enables or disables the `Alt + Shift + 1–6` page shortcuts. |
| Toast duration | Sets confirmation toast duration to 2, 3, or 5 seconds. |

### Data & backup

- Export ASCharts settings to JSON.
- Import recognised settings from a JSON backup.
- View the approximate storage used by ASCharts preference values.
- Reset all ASCharts settings to their defaults after confirmation.

### About

Shows the ASCharts version, a brief version 1.5 summary, and the independent-project notice. The version chip and other parts of the UI include small Easter eggs.

---

## Project structure

The archive is intentionally simple: the source files are at the project root, and there is no bundler configuration.

| File | Responsibility |
|---|---|
| `manifest.json` | Manifest V3 metadata, Class Charts URL matches, and content-script/style registration. |
| `core.js` | Shared preference store, defaults, theme engine, accent colour calculations, toast/confirmation UI, and public `window.ASCharts` helper API. |
| `content.js` | Applies header theming and optional ASCharts branding/page-title replacement. |
| `sidebar.js` | Sidebar icons and state, width/visibility handling, selected navigation state, page/card motion, scroll progress, and Back to top. |
| `pages.js` | Small enhancements to supported page content, announcements, and eligible code-copy interactions. |
| `settings.js` | Settings centre, tabs and controls, profile personalisation, import/export/reset, and About panel. |
| `concern-modal.js` | Adds a confirmation step before supported report-concern submissions and adjusts specific concern-page navigation elements. |
| `mycode-modal.js` | Adds styling and accessibility hooks to the supported My Code/date-of-birth dialog and date picker. |
| `features.js` | Local display name, a targeted homework-navigation fix, optional page shortcuts, and detention-free celebration. |
| `palette.js` | Command palette, shortcut cheat-sheet, quick actions, and small Easter eggs. |
| `style.css` | Base styling for ASCharts components. |
| `theme.css` | Theme and page-level visual overrides. |
| `settings.css` | Styling for the settings centre and related dialogs. |

The manifest currently declares these scripts in order: `core.js`, `content.js`, `sidebar.js`, `pages.js`, `settings.js`, `concern-modal.js`, `mycode-modal.js`, `features.js`, and `palette.js`. The stylesheets are `style.css`, `theme.css`, and `settings.css`.

---

## Development and testing

### Requirements

For normal use, you only need a browser that supports the extension format and a working Class Charts page. For source development, a text editor is sufficient. Git is recommended for version control; Node.js is optional if you want to run JavaScript syntax checks from the terminal.

There is no `package.json`, lockfile, build script, external library installation, or automated test suite in the supplied archive.

### Make a local change

1. Keep a clean copy of the original project or create a Git branch.
2. Edit the relevant `.js` or `.css` file.
3. Open the extension-management page and reload the unpacked extension.
4. Refresh Class Charts to rerun the content scripts.
5. Test both light and dark themes, relevant settings toggles, and the page or dialog your change affects.
6. Check the browser developer console for runtime errors.

Since the extension modifies a third-party site's DOM, prefer narrow selectors and make changes resilient to missing elements. Class Charts can render parts of its interface asynchronously, so a feature may need to tolerate elements appearing after the initial page load.

### Optional syntax checks

Run these from the project root if Node.js and Python are installed:

```bash
# Check each JavaScript file for syntax errors.
for file in *.js; do
  node --check "$file" || exit 1
done

# Validate the extension manifest as JSON.
python -m json.tool manifest.json > /dev/null
```

These commands check syntax and JSON validity only; they do not exercise the extension in a browser or prove that every page enhancement works.

### Suggested manual test checklist

- The extension loads without a manifest error.
- The theme switches between light, dark, and system modes.
- Accent colours, radius, density, and background style update the page.
- Sidebar width and visibility work and the toggle remains usable.
- The command palette opens with `Ctrl/⌘ + K`, filters results, activates selected items, and closes with `Esc`.
- Settings open through `Alt + Shift + S` and settings import/export works with a JSON backup.
- Optional `Alt + Shift + 1–6` shortcuts work when enabled and stop working when disabled.
- Reduce Motion and animation speed settings have the expected effect.
- The local display name and avatar survive a page refresh, and clearing them restores the original profile presentation.
- The report-concern confirmation can be cancelled without submitting and confirmed when intended.
- The detention-free celebration remains off unless enabled and does not appear when Reduce Motion is enabled.
- The browser console has no new errors on the supported pages.

---

## GitHub CLI and Git workflow

This section covers both maintaining an existing GitHub repository and publishing the supplied source archive as a new repository.

### Useful GitHub CLI commands

```bash
# Check GitHub CLI authentication
gh auth status

# Show repository information in the terminal
gh repo view OWNER/REPOSITORY

# Open a repository in the browser
gh repo view OWNER/REPOSITORY --web

# Clone the repository locally
gh repo clone OWNER/REPOSITORY

# Fork a repository and clone your fork
gh repo fork OWNER/REPOSITORY --clone

# List open issues for a repository
gh issue list --repo OWNER/REPOSITORY

# View recent pull requests
gh pr list --repo OWNER/REPOSITORY
```

Replace `OWNER/REPOSITORY` in each command. See the [GitHub CLI manual](https://cli.github.com/manual/) for all supported commands and options.

### Create a branch and submit a change

From a local clone:

```bash
# Start from the default branch and get its latest changes
git switch main
git pull --ff-only

# Create a feature branch
git switch -c feature/describe-your-change

# Edit files, then review the change
git status
git diff

# Stage and commit
git add core.js settings.js
git commit -m "Describe the change"

# Publish the branch
git push -u origin feature/describe-your-change

# Create a pull request
gh pr create --fill
```

Change the file list in `git add` to match your actual changes. Do not commit generated personal settings exports, browser profile data, access tokens, or other private information.

### Publish the supplied ZIP as a new GitHub repository

The supplied source ZIP has the project files but does not include Git history or a Git remote. If you own the code and want to create a new repository from it, extract it first and run the following inside the directory containing `manifest.json`.

```bash
# Initialise local version control
git init -b main
git add .
git commit -m "Initial commit: ASCharts 1.5.0"

# Sign in if needed
gh auth login

# Create a PRIVATE GitHub repository and push the local branch
gh repo create ASCharts --private --source=. --remote=origin --push
```

To create a public repository instead, replace `--private` with `--public`. Confirm the intended visibility before running the command. GitHub repository names must be available under your account or organisation, and you need permission to create repositories there.

After publishing, obtain the actual repository identifier from GitHub. Other people can then clone it with:

```bash
gh repo clone OWNER/ASCharts
```

If the repository already exists, **do not** run the new-repository command above. Add or inspect the existing remote instead:

```bash
git remote -v
git remote add origin https://github.com/OWNER/ASCharts.git
# Only add the remote if one does not already exist.
git push -u origin main
```

The last push assumes the remote repository is ready to receive this local branch and that its initial history can be pushed cleanly. If Git reports unrelated histories or rejected updates, inspect the remote and reconcile the histories rather than force-pushing blindly.

---

## Privacy and data storage

The following notes describe the source files in this archive, not a third-party security audit.

- **Permissions:** `manifest.json` does not declare browser API permissions or separate host permissions. It registers content scripts and CSS for `classcharts.com` and its subdomains.
- **Preferences:** ASCharts saves settings using browser `localStorage` with the `ascharts-` prefix on the Class Charts site origin. This means settings are associated with that browser profile and site origin; they do not automatically synchronise to another browser or device.
- **Celebration state:** a small last-celebration timestamp is stored in `sessionStorage` to avoid repeatedly triggering the effect in the same session.
- **Profile picture:** the selected image is resized and saved as a data URL in local site storage. It is not uploaded by the ASCharts source code in this archive.
- **Display name:** the custom name is a local visual override and does not change the school account name.
- **Backup file:** the JSON export contains recognised ASCharts settings that have values saved. Treat it as personal data if you use a custom name or avatar.
- **Network activity:** the JavaScript files in this archive do not contain `fetch`, `XMLHttpRequest`, or WebSocket calls for sending ASCharts settings to a separate service. Class Charts itself continues to use its normal website requests.
- **Clipboard:** certain features request clipboard writes only when you activate actions such as copying a page URL or a supported code.

If you did not obtain the source from a trusted maintainer, inspect it before installing. Browser extensions can affect pages on which their content scripts run, and this README is not a substitute for reviewing the source code.

---

## Troubleshooting

### The extension does not appear to load

- Open `chrome://extensions`, `edge://extensions`, or `brave://extensions` and read any error shown for ASCharts.
- Ensure **Developer mode** is enabled if loading an unpacked copy.
- Select the directory that contains `manifest.json` directly.
- Check that the archive extracted completely and that all JavaScript and CSS files listed in the manifest are present.

### Nothing changes on Class Charts

- Confirm the address bar is on `classcharts.com` or a supported subdomain.
- Refresh the page after enabling or reloading the extension.
- Check that the extension is enabled in the browser.
- Open developer tools and inspect the Console for errors.
- Remember that some features target the desktop Class Charts layout and may not appear on every page or screen size.

### The command palette or a shortcut does not work

- Try `Ctrl + K` on Windows/Linux or `⌘ + K` on macOS.
- Press `?` outside any text field to open the shortcut sheet.
- Make sure another extension or browser/OS shortcut is not intercepting the key combination.
- `Alt + Shift + 1–6` requires **Quick navigation shortcuts** to be enabled in Settings → Features.
- The shortcut handler deliberately avoids page-jump shortcuts while an editable control has focus.

### A setting seems to reset

- Settings are stored per browser profile and site origin; another profile or browser will not automatically share them.
- Use **Settings → Data → Export settings** before clearing browser site data.
- Import your backup with **Settings → Data → Import settings**.
- Clearing Class Charts site data or local storage can remove ASCharts preferences too.

### Importing a backup fails

- Select the JSON file exported by ASCharts.
- Make sure the file has not been truncated or manually edited into invalid JSON.
- If the file contains no recognised ASCharts setting keys, the import is rejected.
- Export a fresh backup from the source installation if possible.

### A visual feature stops working after a Class Charts update

ASCharts relies on DOM selectors and class names used by the site. If Class Charts changes its markup or rendering behaviour, a selector may no longer match. Record the affected page, browser version, console error, and steps to reproduce it before filing an issue. Avoid sharing student information, login details, or screenshots containing personal records in public reports.

### The profile picture or settings do not transfer automatically

This is expected. Use the JSON export/import workflow. The settings file is local to you, so do not post it in an issue or attach it to a public pull request.

---

## Known limitations

- This is a **page-enhancement extension**, not a standalone replacement for Class Charts.
- The extension is built around Class Charts' current desktop DOM structure and may not apply consistently to every mobile layout, page, or site variant.
- Internal website changes can require maintenance of selectors and visual overrides.
- The supplied archive contains no automated browser tests, packaging pipeline, or CI configuration.
- A JSON backup transfers preferences, not website data, account details, navigation history, or the extension's Git history.
- The extension does not provide a separate toolbar popup, background worker, or remote account-sync service in this version.
- The source archive does not include a canonical GitHub repository URL or a `LICENSE` file.

---

## Contributing

Contributions are most useful when they are small, reproducible, and tested against an actual Class Charts page.

1. Fork or clone the repository.
2. Create a descriptive branch.
3. Explain the issue and the expected behaviour before changing code.
4. Keep selectors narrow and account for elements that may load asynchronously.
5. Test the change in the browser and run the syntax checks where practical.
6. Include clear reproduction steps in the pull request.
7. Do not include personal Class Charts records, account data, avatar exports, or credentials in commits, screenshots, logs, or issue reports.

For behavioural changes, describe which browser and Class Charts page were tested. For style-only changes, check both light and dark themes and the reduced-motion setting where relevant.

---

## License

No `LICENSE` file is included in the supplied archive, so this README does not assign a license or grant additional redistribution rights. Before publishing the repository or accepting external contributions, add the license that the project owner intends to use and make sure it accurately reflects ownership of the code and assets.

---

## Useful links

- [Class Charts](https://www.classcharts.com/)
- [GitHub CLI installation](https://cli.github.com/)
- [GitHub CLI manual](https://cli.github.com/manual/)
- [`gh repo clone` reference](https://cli.github.com/manual/gh_repo_clone)
- [Git installation](https://git-scm.com/downloads)

# Personal Expense Tracker

A responsive client-side expense tracker built with HTML, CSS, and JavaScript for the practical assignment.

## Files
- `index.html` — page structure and form/table controls
- `style.css` — responsive layout and visual styling
- `script.js` — validation, transaction calculations, filtering, deletion, and localStorage

## Run locally
1. Extract the ZIP file.
2. Open `index.html` in a web browser. For a smoother development workflow, you can also open the folder in VS Code and use the Live Server extension.
3. Add transactions and refresh the page to test browser storage.

## Test data from the practical
| Type | Description | Category | Amount (LKR) |
|---|---|---|---:|
| Income | Monthly Allowance | Allowance | 25,000 |
| Expense | Lunch | Food | 800 |
| Expense | Bus Fare | Transport | 250 |
| Income | Part-time Work | Salary | 5,000 |

Expected totals: Income LKR 30,000.00; Expenses LKR 1,050.00; Balance LKR 28,950.00.

## Deploy with GitHub Pages
1. Create a public GitHub repository named `personal-expense-tracker`.
2. Upload `index.html`, `style.css`, and `script.js` (README is optional).
3. Open **Settings → Pages**.
4. Under build/deployment, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
5. Wait for the deployment to finish and open the URL shown in the Pages section.
6. Test add, delete, filter, search, and refresh. Submit both the repository URL and hosted URL.

## Important
This app stores transactions in the browser's `localStorage`; it does not use a backend or sync between devices. Clearing browser site data may remove the saved transactions.

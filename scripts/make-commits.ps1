$ErrorActionPreference = "Stop"
$env:GIT_AUTHOR_NAME = "Niloy Paul"
$env:GIT_COMMITTER_NAME = "Niloy Paul"
$env:GIT_AUTHOR_EMAIL = "niloypaul81@gmail.com"
$env:GIT_COMMITTER_EMAIL = "niloypaul81@gmail.com"

Set-Location "C:\Users\Niloy\.gemini\antigravity-ide\scratch\ticketbari-client"

function Commit-Files($message, [string[]]$files) {
    git add @files
    git commit -m $message
}

if (-not (Test-Path .git)) { git init }

# 1
Commit-Files "chore: scaffold Next.js 15 project with Tailwind and ESLint" @(
    "package.json", "package-lock.json", "next.config.js", "tailwind.config.js",
    "postcss.config.js", "jsconfig.json", ".gitignore", "README.md"
)

# 2
Commit-Files "feat: add root layout, providers, and global styles" @(
    "src/app/layout.jsx", "src/app/providers.jsx", "src/app/globals.css"
)

# 3
Commit-Files "feat: configure Better Auth server and API catch-all route" @(
    "src/lib/auth.js", "src/app/api/auth/[...all]/route.js"
)

# 4
Commit-Files "feat: add auth client and ImgBB upload helper" @(
    "src/lib/auth-client.js", "src/lib/imgbb.js"
)

# 5
Commit-Files "feat: add secure axios hook with JWT header injection" @(
    "src/hooks/useAxiosSecure.js"
)

# 6
Commit-Files "feat: add Navbar and Footer site chrome" @(
    "src/components/Footer.jsx"
)

# 7
Commit-Files "feat: add main layout and static About/Contact pages" @(
    "src/app/(main)/layout.jsx",
    "src/app/(main)/about/page.jsx",
    "src/app/(main)/contact/page.jsx"
)

# 8
Commit-Files "feat: add homepage hero slider with featured tickets" @(
    "src/app/(main)/page.jsx"
)

# 9
Commit-Files "feat: add TicketCard and All Tickets listing with filters" @(
    "src/components/TicketCard.jsx", "src/app/(main)/tickets/page.jsx"
)

# 10
Commit-Files "feat: add ticket detail page with Book Now confirmation modal" @(
    "src/app/(main)/tickets/[id]/page.jsx"
)

# 11
Commit-Files "feat: add login and register pages with credential forms" @(
    "src/app/(auth)/login/page.jsx",
    "src/app/(auth)/register/page.jsx",
    "src/app/(auth)/layout.jsx"
)

# 12
Commit-Files "feat: add shared AuthShell layout for auth pages" @(
    "src/components/auth/AuthShell.jsx"
)

# 13
Commit-Files "feat: add dashboard shell with sidebar navigation" @(
    "src/components/dashboard/Sidebar.jsx"
)

# 14
Commit-Files "feat: add RoleGuard and per-role dashboard layouts" @(
    "src/components/dashboard/RoleGuard.jsx",
    "src/app/dashboard/layout.jsx",
    "src/app/dashboard/page.jsx",
    "src/app/dashboard/admin/layout.jsx",
    "src/app/dashboard/vendor/layout.jsx",
    "src/app/dashboard/user/layout.jsx"
)

# 15
Commit-Files "feat: add user dashboard pages for bookings, transactions, and profile" @(
    "src/app/dashboard/user/my-bookings/page.jsx",
    "src/app/dashboard/user/transactions/page.jsx",
    "src/app/dashboard/user/profile/page.jsx"
)

# 16
Commit-Files "feat: add vendor ticket management and booking request pages" @(
    "src/app/dashboard/vendor/add-ticket/page.jsx",
    "src/app/dashboard/vendor/update-ticket/[id]/page.jsx",
    "src/app/dashboard/vendor/my-tickets/page.jsx",
    "src/app/dashboard/vendor/requested-bookings/page.jsx"
)

# 17
Commit-Files "feat: add vendor revenue chart and profile pages" @(
    "src/app/dashboard/vendor/revenue/page.jsx",
    "src/app/dashboard/vendor/profile/page.jsx"
)

# 18
Commit-Files "feat: add admin manage users and manage tickets pages" @(
    "src/app/dashboard/admin/manage-users/page.jsx",
    "src/app/dashboard/admin/manage-tickets/page.jsx",
    "src/app/dashboard/admin/profile/page.jsx"
)

# 19
Commit-Files "feat: add admin advertise toggle with custom switch component" @(
    "src/app/dashboard/admin/advertise/page.jsx"
)

# 20
Commit-Files "fix: improve navbar mobile drawer and user dropdown styling" @(
    "src/components/Navbar.jsx"
)

# 21
Commit-Files "fix: persist auth session on reload and redirect after register to home" @(
    "src/context/AuthContext.jsx"
)

# 22
Commit-Files "feat: add shared UI helpers and not-found page" @(
    "src/components/LoadingSpinner.jsx",
    "src/components/CountdownTimer.jsx",
    "src/components/dashboard/ProfileCard.jsx",
    "src/app/not-found.jsx"
)

Write-Host "Client commits: $(git rev-list --count HEAD)"
git log --oneline

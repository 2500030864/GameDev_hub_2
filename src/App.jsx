import "./App.css";
import React, { createContext, useContext, useMemo, useState } from "react";
import {
  Link,
  NavLink,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  Gamepad2,
  Search,
  Menu,
  X,
  ArrowUpRight,
  Heart,
  Code2,
  Sparkles,
  Users,
  BookOpen,
  LogOut,
  LayoutDashboard,
  AlertCircle,
  Plus,
  Trash2,
  CalendarDays,
  Trophy,
  ShieldCheck,
  Clock,
  Pencil,
  UsersRound,
} from "lucide-react";

const AuthContext = createContext(null);

const USER_KEY = "gdh_user";
const USERS_KEY = "gdh_users";
const SAVED_KEY = "gdh_saved_games";
const PROJECTS_KEY = "gdh_projects";
const COMPETITIONS_KEY = "gdh_competitions";
const REGISTRATIONS_KEY = "gdh_registrations";

const ADMIN_EMAIL = "admin@gamedevhub.local";
const ADMIN_PASSWORD = "Admin123!";

const games = [
  {
    id: 1,
    title: "Neon Horizon",
    genre: "Action",
    subtitle: "Adventure",
    rating: 4.9,
    tag: "FEATURED",
    tone: "violet",
    image:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1000&q=85",
    description: "Explore a glowing cyberpunk city full of hidden stories.",
  },
  {
    id: 2,
    title: "Wildlands: Echoes",
    genre: "Adventure",
    subtitle: "Open World",
    rating: 4.8,
    tag: "TRENDING",
    tone: "green",
    image:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=85",
    description: "A vast wilderness with secrets waiting beyond the horizon.",
  },
  {
    id: 3,
    title: "Velocity Zero",
    genre: "Racing",
    subtitle: "Sports",
    rating: 4.7,
    tag: "NEW RELEASE",
    tone: "orange",
    image:
      "https://images.unsplash.com/photo-1493711662062-fa541akw3?auto=format&fit=crop&w=1000&q=85",
    description: "Push your reflexes to the limit in high-speed races.",
  },
  {
    id: 4,
    title: "Last Light",
    genre: "Horror",
    subtitle: "Survival",
    rating: 4.6,
    tag: "INDIE PICK",
    tone: "blue",
    image:
      "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=85",
    description: "Stay alert, conserve your resources, and find a way out.",
  },
  {
    id: 5,
    title: "Pixel Raiders",
    genre: "Indie",
    subtitle: "Platformer",
    rating: 4.8,
    tag: "COMMUNITY",
    tone: "pink",
    image:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=85",
    description: "A nostalgic pixel adventure with a modern twist.",
  },
  {
    id: 6,
    title: "Deep Space",
    genre: "Strategy",
    subtitle: "Sci-fi",
    rating: 4.5,
    tag: "EDITOR'S PICK",
    tone: "cyan",
    image:
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1000&q=85",
    description: "Build, explore, and lead your fleet across the galaxy.",
  },
];

const categories = [
  "All Games",
  "Action",
  "Adventure",
  "Racing",
  "Horror",
  "Indie",
  "Strategy",
];

const studios = [
  {
    name: "Pixel Forge Studio",
    detail: "Indie games · 12 projects",
    initials: "PF",
    tone: "lavender",
  },
  {
    name: "Nova Interactive",
    detail: "Action & sci-fi · 8 projects",
    initials: "NI",
    tone: "mint",
  },
  {
    name: "Tiny Giant Games",
    detail: "Casual & platformers · 16 projects",
    initials: "TG",
    tone: "peach",
  },
];

const resources = [
  {
    icon: Code2,
    title: "Getting started with game dev",
    text: "A practical roadmap from your first idea to a playable prototype.",
    type: "GUIDE",
  },
  {
    icon: Gamepad2,
    title: "Choose your game engine",
    text: "Compare popular tools and pick the right engine for your goals.",
    type: "TOOLS",
  },
  {
    icon: Users,
    title: "Build your first dev team",
    text: "Find collaborators, define roles, and ship your first project.",
    type: "COMMUNITY",
  },
];

function readJSON(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function useAuth() {
  return useContext(AuthContext);
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readJSON(USER_KEY, null));

  const login = (userData) => {
    saveJSON(USER_KEY, userData);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, login, logout }),
    [user]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  return user ? (
    children
  ) : (
    <Navigate
      to="/login"
      replace
      state={{ from: location.pathname }}
    />
  );
}

function AdminRoute({ children }) {
  const { user } = useAuth();

  return user?.role === "admin" ? (
    children
  ) : (
    <Navigate to="/dashboard" replace />
  );
}

function PublicOnly({ children }) {
  const { user } = useAuth();

  return user ? (
    <Navigate
      to={user.role === "admin" ? "/admin" : "/dashboard"}
      replace
    />
  ) : (
    children
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route
          path="/login"
          element={
            <PublicOnly>
              <AuthPage mode="login" />
            </PublicOnly>
          }
        />

        <Route
          path="/signup"
          element={
            <PublicOnly>
              <AuthPage mode="signup" />
            </PublicOnly>
          }
        />

        <Route
          path="/games"
          element={
            <SitePage>
              <ExplorePage />
            </SitePage>
          }
        />

        <Route
          path="/developers"
          element={
            <SitePage>
              <DevelopersPage />
            </SitePage>
          }
        />

        <Route
          path="/resources"
          element={
            <SitePage>
              <ResourcesPage />
            </SitePage>
          }
        />

        <Route
          path="/competitions"
          element={
            <SitePage>
              <CompetitionsPage />
            </SitePage>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <DashboardPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/saved"
          element={
            <ProtectedRoute>
              <AppLayout>
                <SavedPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-projects"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ProjectsPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ProfilePage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-registrations"
          element={
            <ProtectedRoute>
              <AppLayout>
                <MyRegistrationsPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AppLayout>
                  <AdminDashboardPage />
                </AppLayout>
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/competitions"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AppLayout>
                  <AdminCompetitionsPage />
                </AppLayout>
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AppLayout>
                  <AdminUsersPage />
                </AppLayout>
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </AuthProvider>
  );
}

function Brand({ compact = false }) {
  return (
    <Link
      className={`brand ${compact ? "brand-compact" : ""}`}
      to="/"
    >
      <span className="brand-mark">
        <Gamepad2 size={22} />
      </span>

      <span>
        GameDev<span className="brand-accent">Hub</span>
        <small>PLAY. CREATE. CONNECT.</small>
      </span>
    </Link>
  );
}

function PublicHeader() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  return (
    <header className="topbar">
      <Brand />

      <nav className={`nav-links ${open ? "nav-open" : ""}`}>
        <NavLink to="/" end onClick={() => setOpen(false)}>
          Home
        </NavLink>

        <NavLink to="/games" onClick={() => setOpen(false)}>
          Explore Games
        </NavLink>

        <NavLink to="/developers" onClick={() => setOpen(false)}>
          Developers
        </NavLink>

        <NavLink to="/resources" onClick={() => setOpen(false)}>
          Resources
        </NavLink>

        <NavLink to="/competitions" onClick={() => setOpen(false)}>
          Competitions
        </NavLink>

        <div className="mobile-nav-actions">
          {user ? (
            <Link className="button button-primary" to="/dashboard">
              Dashboard
            </Link>
          ) : (
            <>
              <Link className="button button-quiet" to="/login">
                Log in
              </Link>

              <Link className="button button-primary" to="/signup">
                Join community <ArrowUpRight size={15} />
              </Link>
            </>
          )}
        </div>
      </nav>

      <div className="nav-actions">
        {user ? (
          <Link
            className="button button-primary"
            to={user.role === "admin" ? "/admin" : "/dashboard"}
          >
            Dashboard <ArrowUpRight size={15} />
          </Link>
        ) : (
          <>
            <Link className="login-button" to="/login">
              Log in
            </Link>

            <Link className="button button-primary" to="/signup">
              Join community <ArrowUpRight size={15} />
            </Link>
          </>
        )}
      </div>

      <button
        className="menu-toggle"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        {open ? <X /> : <Menu />}
      </button>
    </header>
  );
}

function SitePage({ children }) {
  return (
    <>
      <PublicHeader />
      {children}
      <PublicFooter />
    </>
  );
}

function PublicFooter() {
  return (
    <footer className="footer section-wrap">
      <Brand compact />

      <p>Built for the love of games. © 2026 GameDev Hub.</p>

      <div className="footer-links">
        <Link to="/games">Explore</Link>
        <Link to="/developers">Creators</Link>
        <Link to="/resources">Resources</Link>
        <Link to="/competitions">Competitions</Link>
      </div>
    </footer>
  );
}

function LandingPage() {
  const [saved, setSaved] = useState(() =>
    readJSON(SAVED_KEY, [])
  );
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Games");

  const shown = games
    .filter(
      (game) =>
        (category === "All Games" ||
          game.genre === category ||
          game.subtitle === category) &&
        `${game.title} ${game.genre} ${game.subtitle}`
          .toLowerCase()
          .includes(search.toLowerCase())
    )
    .slice(0, 6);

  const toggle = (id) => {
    const next = saved.includes(id)
      ? saved.filter((item) => item !== id)
      : [...saved, id];

    setSaved(next);
    saveJSON(SAVED_KEY, next);
  };

  return (
    <>
      <PublicHeader />

      <main>
        <section className="hero section-wrap" id="home">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              THE NEXT LEVEL STARTS HERE
            </div>

            <h1>
              Where games
              <br />
              meet <span>great ideas.</span>
            </h1>

            <p className="hero-description">
              Discover unforgettable games, connect with the minds
              behind them, and find the tools to bring your own worlds
              to life.
            </p>

            <div className="hero-actions">
              <Link
                className="button button-primary button-large"
                to="/games"
              >
                Explore games <ArrowUpRight size={17} />
              </Link>

              <Link
                className="button button-secondary button-large"
                to="/resources"
              >
                <Code2 size={16} /> Start creating
              </Link>
            </div>

            <div className="hero-proof">
              <div className="avatar-stack">
                <span>J</span>
                <span>M</span>
                <span>A</span>
                <span>+</span>
              </div>

              <div>
                <strong>12k+ creators</strong>
                <small>building the future of play</small>
              </div>
            </div>
          </div>

          <div className="hero-art">
            <div className="art-glow" />

            <img
              src={games[0].image}
              alt="Gaming landscape"
              className="hero-image"
            />

            <div className="hero-floating-card">
              <span className="floating-icon">
                <Trophy size={20} />
              </span>

              <div>
                <strong>Community spotlight</strong>
                <small>Discover something new</small>
              </div>
            </div>
          </div>
        </section>

        <section className="section-wrap featured-section">
          <div className="section-heading">
            <div>
              <div className="section-kicker">DISCOVER YOUR NEXT ADVENTURE</div>
              <h2>
                Games worth <span>playing.</span>
              </h2>
            </div>

            <Link className="text-link" to="/games">
              View all games <ArrowUpRight size={15} />
            </Link>
          </div>

          <div className="game-controls">
            <div className="category-tabs">
              {categories.map((item) => (
                <button
                  key={item}
                  className={`category-tab ${
                    category === item ? "selected" : ""
                  }`}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            <label className="search-box">
              <Search size={17} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search games..."
              />
            </label>
          </div>

          <div className="games-grid">
            {shown.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                saved={saved.includes(game.id)}
                onSave={() => toggle(game.id)}
              />
            ))}
          </div>

          {shown.length === 0 && (
            <div className="empty-state">
              <Search />
              <h3>No games found</h3>
              <p>Try another title or category.</p>
            </div>
          )}
        </section>

        <section className="section-wrap creator-banner">
          <div className="creator-orb">
            <Users size={34} />
          </div>

          <div className="creator-copy">
            <div className="section-kicker">YOUR NEXT CHAPTER</div>
            <h2>
              Ready to <span>create?</span>
            </h2>
            <p>
              Organize your projects, connect with creators, and join
              community competitions.
            </p>
          </div>

          <Link className="button button-primary" to="/signup">
            Join community <ArrowUpRight size={17} />
          </Link>
        </section>

        <section className="section-wrap featured-section">
          <div className="section-heading">
            <div>
              <div className="section-kicker">COMPETE WITH THE COMMUNITY</div>
              <h2>
                Enter the <span>arena.</span>
              </h2>
            </div>

            <Link className="text-link" to="/competitions">
              Browse competitions <ArrowUpRight size={15} />
            </Link>
          </div>

          <p className="page-intro">
            Discover upcoming gaming tournaments and creative game jams.
          </p>
        </section>
      </main>

      <PublicFooter />
    </>
  );
}

function GameCard({ game, saved, onSave }) {
  return (
    <article className="game-card">
      <div className="game-image-wrap">
        <img src={game.image} alt={game.title} className="game-image" />

        <span className={`game-tag ${game.tone}`}>{game.tag}</span>

        <button
          className={`save-button ${saved ? "is-saved" : ""}`}
          onClick={onSave}
          aria-label={saved ? "Remove saved game" : "Save game"}
        >
          <Heart size={18} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="game-card-body">
        <div className="game-card-top">
          <span>{game.genre}</span>
          <span className="game-rating">★ {game.rating}</span>
        </div>

        <h3>{game.title}</h3>
        <p>{game.description}</p>

        <div className="game-card-footer">
          <span>{game.subtitle}</span>
          <ArrowUpRight size={17} />
        </div>
      </div>
    </article>
  );
}

function AuthPage({ mode }) {
  const isSignup = mode === "signup";
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (event) => {
    event.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    if (
      !isSignup &&
      normalizedEmail === ADMIN_EMAIL &&
      password === ADMIN_PASSWORD
    ) {
      const admin = {
        id: "admin",
        name: "Administrator",
        email: ADMIN_EMAIL,
        role: "admin",
        joinedAt: new Date().toISOString(),
      };

      login(admin);
      navigate("/admin");
      return;
    }

    const users = readJSON(USERS_KEY, []);

    if (isSignup) {
      if (name.trim().length < 2) {
        setError("Your name must contain at least 2 characters.");
        return;
      }

      if (password.length < 6) {
        setError("Password must contain at least 6 characters.");
        return;
      }

      if (users.some((user) => user.email === normalizedEmail)) {
        setError("An account with this email already exists.");
        return;
      }

      const newUser = {
        id: `USER-${Date.now()}`,
        name: name.trim(),
        email: normalizedEmail,
        password,
        role: "user",
        joinedAt: new Date().toISOString(),
      };

      saveJSON(USERS_KEY, [...users, newUser]);

      login({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: "user",
        joinedAt: newUser.joinedAt,
      });

      navigate("/dashboard");
      return;
    }

    const existingUser = users.find(
      (user) =>
        user.email === normalizedEmail &&
        user.password === password
    );

    if (!existingUser) {
      setError(
        "Invalid login details. Check your email and password."
      );
      return;
    }

    login({
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      role: existingUser.role || "user",
      joinedAt: existingUser.joinedAt,
    });

    const destination = location.state?.from;

    navigate(
      existingUser.role === "admin"
        ? "/admin"
        : destination || "/dashboard"
    );
  };

  return (
    <div className="auth-page">
      <div className="auth-brand">
        <Brand />
      </div>

      <div className="auth-panel">
        <div className="section-kicker">
          {isSignup ? "JOIN THE COMMUNITY" : "WELCOME BACK"}
        </div>

        <h1>
          {isSignup ? "Create your account." : "Welcome back."}
        </h1>

        <p className="page-intro">
          {isSignup
            ? "Start your game development journey with GameDev Hub."
            : "Sign in to access your creator dashboard."}
        </p>

        {error && (
          <div className="form-alert error">
            <AlertCircle size={17} />
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={submit}>
          {isSignup && (
            <label>
              Full name
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your name"
                required
              />
            </label>
          )}

          <label>
            Email address
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
            />
          </label>

          <button className="button button-primary auth-submit" type="submit">
            {isSignup ? "Create account" : "Log in"}
            <ArrowUpRight size={17} />
          </button>
        </form>

        {!isSignup && (
          <div className="auth-demo-info">
            <ShieldCheck size={18} />
            <p>
              Demo admin: <strong>{ADMIN_EMAIL}</strong>
              <br />
              Password: <strong>{ADMIN_PASSWORD}</strong>
            </p>
          </div>
        )}

        <p className="auth-switch">
          {isSignup ? "Already have an account?" : "New to GameDev Hub?"}{" "}
          <Link to={isSignup ? "/login" : "/signup"}>
            {isSignup ? "Log in" : "Create account"}
          </Link>
        </p>
      </div>
    </div>
  );
}

function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const admin = user?.role === "admin";

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Brand compact />

        <div className="sidebar-user">
          <span className="profile-avatar">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </span>

          <div>
            <strong>{user?.name}</strong>
            <small>{admin ? "Administrator" : "Community creator"}</small>
          </div>
        </div>

        <div className="sidebar-label">WORKSPACE</div>

        <nav className="sidebar-nav">
          {admin ? (
            <>
              <NavLink to="/admin" end>
                <LayoutDashboard size={18} />
                Admin dashboard
              </NavLink>

              <NavLink to="/admin/competitions">
                <Trophy size={18} />
                Competitions
              </NavLink>

              <NavLink to="/admin/users">
                <UsersRound size={18} />
                Manage users
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/dashboard">
                <LayoutDashboard size={18} />
                Dashboard
              </NavLink>

              <NavLink to="/my-projects">
                <Code2 size={18} />
                My projects
              </NavLink>

              <NavLink to="/saved">
                <Heart size={18} />
                Saved games
              </NavLink>

              <NavLink to="/my-registrations">
                <Trophy size={18} />
                My registrations
              </NavLink>

              <NavLink to="/profile">
                <Users size={18} />
                My profile
              </NavLink>
            </>
          )}
        </nav>

        <div className="sidebar-label">DISCOVER</div>

        <nav className="sidebar-nav">
          <NavLink to="/games">
            <Gamepad2 size={18} />
            Explore games
          </NavLink>

          <NavLink to="/competitions">
            <Trophy size={18} />
            Competitions
          </NavLink>

          <NavLink to="/resources">
            <BookOpen size={18} />
            Resources
          </NavLink>
        </nav>

        <div className="sidebar-bottom">
          <button
            className="sidebar-logout"
            onClick={() => {
              logout();
              navigate("/");
            }}
          >
            <LogOut size={18} />
            Log out
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div>
            <span className="dashboard-top-label">GAMEDEV HUB</span>
            <p>Play. Create. Connect.</p>
          </div>

          <Link to="/profile" className="topbar-profile">
            <span className="profile-avatar">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </span>
            <span>{user?.name}</span>
          </Link>
        </header>

        <div className="dashboard-content">{children}</div>
      </main>
    </div>
  );
}

function DashboardPage() {
  const { user } = useAuth();
  const saved = readJSON(SAVED_KEY, []);
  const projects = readJSON(PROJECTS_KEY, []);
  const registrations = readJSON(REGISTRATIONS_KEY, []);

  const myRegistrations = registrations.filter(
    (registration) => registration.userId === user?.id
  );

  return (
    <>
      <div className="dashboard-welcome">
        <div>
          <div className="section-kicker">YOUR CREATOR WORKSPACE</div>

          <h1>
            Welcome, <span>{user?.name?.split(" ")[0] || "Creator"}.</span>
          </h1>

          <p>
            Keep your projects moving and discover your next gaming
            challenge.
          </p>
        </div>

        <Link className="button button-primary" to="/competitions">
          Find competitions <ArrowUpRight size={16} />
        </Link>
      </div>

      <div className="stats-grid">
        <StatCard
          icon={<Heart />}
          label="Saved games"
          value={saved.length}
        />

        <StatCard
          icon={<Code2 />}
          label="My projects"
          value={projects.length}
        />

        <StatCard
          icon={<Trophy />}
          label="Registrations"
          value={myRegistrations.length}
        />
      </div>

      <section className="dashboard-section">
        <div className="dash-section-heading">
          <div>
            <h2>Quick actions</h2>
            <p>Jump back into your workspace.</p>
          </div>
        </div>

        <div className="quick-links">
          <Link to="/my-projects">
            <Code2 />
            <span>
              <strong>Manage projects</strong>
              <small>Track your game development ideas.</small>
            </span>
            <ArrowUpRight />
          </Link>

          <Link to="/saved">
            <Heart />
            <span>
              <strong>Saved games</strong>
              <small>Return to your favorite games.</small>
            </span>
            <ArrowUpRight />
          </Link>

          <Link to="/my-registrations">
            <Trophy />
            <span>
              <strong>My competitions</strong>
              <small>View your competition registrations.</small>
            </span>
            <ArrowUpRight />
          </Link>
        </div>
      </section>
    </>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <article className="stat-card panel">
      <span className="stat-icon">{icon}</span>
      <span className="stat-label">{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function ExplorePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Games");
  const [saved, setSaved] = useState(() =>
    readJSON(SAVED_KEY, [])
  );

  const shown = games.filter(
    (game) =>
      (category === "All Games" ||
        game.genre === category ||
        game.subtitle === category) &&
      `${game.title} ${game.genre} ${game.subtitle}`
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const toggle = (id) => {
    const next = saved.includes(id)
      ? saved.filter((item) => item !== id)
      : [...saved, id];

    setSaved(next);
    saveJSON(SAVED_KEY, next);
  };

  return (
    <div className="public-inner section-wrap page-space">
      <div className="section-kicker">FIND YOUR NEXT FAVORITE</div>

      <h1 className="page-title">
        Explore <span>games.</span>
      </h1>

      <p className="page-intro">
        Browse community picks, indie gems, and new worlds to discover.
      </p>

      <div className="game-controls">
        <div className="category-tabs">
          {categories.map((item) => (
            <button
              key={item}
              className={`category-tab ${
                category === item ? "selected" : ""
              }`}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <label className="search-box">
          <Search size={17} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search games..."
          />
        </label>
      </div>

      <div className="games-grid">
        {shown.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            saved={saved.includes(game.id)}
            onSave={() => toggle(game.id)}
          />
        ))}
      </div>

      {shown.length === 0 && (
        <div className="empty-state">
          <Search />
          <h3>No games found</h3>
          <p>Try another title or category.</p>
        </div>
      )}
    </div>
  );
}

function DevelopersPage() {
  return (
    <div className="public-inner section-wrap page-space">
      <div className="section-kicker">THE PEOPLE BEHIND THE PLAY</div>

      <h1 className="page-title">
        Meet the <span>creators.</span>
      </h1>

      <p className="page-intro">
        Meet studios and teams inspiring the game development community.
      </p>

      <div className="studio-directory">
        {studios.map((studio, index) => (
          <article className="studio-row" key={studio.name}>
            <div className={`developer-avatar large ${studio.tone}`}>
              {studio.initials}
            </div>

            <div className="studio-row-main">
              <h2>{studio.name}</h2>
              <p>{studio.detail}</p>
              <span className="studio-badge">Community studio</span>
            </div>

            <span className="studio-number">
              {String(index + 1).padStart(2, "0")}
            </span>
          </article>
        ))}
      </div>

      <div className="creator-banner">
        <div className="creator-orb">
          <Users size={34} />
        </div>

        <div className="creator-copy">
          <div className="section-kicker">YOUR TURN</div>
          <h2>
            Build your <span>studio story.</span>
          </h2>
          <p>Create an account and organize your game ideas.</p>
        </div>

        <Link className="button button-primary" to="/signup">
          Join community <ArrowUpRight size={17} />
        </Link>
      </div>
    </div>
  );
}

function ResourcesPage() {
  return (
    <div className="public-inner section-wrap page-space">
      <div className="section-kicker">LEVEL UP YOUR CRAFT</div>

      <h1 className="page-title">
        Creator <span>resources.</span>
      </h1>

      <p className="page-intro">
        Starter guides and ideas to help turn your game concept into
        something playable.
      </p>

      <div className="resource-grid">
        {resources.map(({ icon: Icon, title, text, type }) => (
          <article className="resource-card" key={title}>
            <span className="resource-icon">
              <Icon size={22} />
            </span>

            <span className="resource-type">{type}</span>

            <h2>{title}</h2>
            <p>{text}</p>

            <button
              className="text-link"
              onClick={() =>
                alert(
                  "This resource is a starter placeholder. You can expand it into a full guide."
                )
              }
            >
              Open resource <ArrowUpRight size={15} />
            </button>
          </article>
        ))}
      </div>

      <div className="resource-note">
        <Sparkles />

        <div>
          <strong>Tip for your first project</strong>
          <p>
            Start small: make one core mechanic fun before adding levels,
            art, and extra features.
          </p>
        </div>
      </div>
    </div>
  );
}

function SavedPage() {
  const [saved, setSaved] = useState(() =>
    readJSON(SAVED_KEY, [])
  );

  const items = games.filter((game) => saved.includes(game.id));

  const remove = (id) => {
    const next = saved.filter((item) => item !== id);
    setSaved(next);
    saveJSON(SAVED_KEY, next);
  };

  return (
    <>
      <div className="dashboard-welcome">
        <div>
          <div className="section-kicker">YOUR COLLECTION</div>
          <h1>
            Saved <span>games.</span>
          </h1>
          <p>Your personal list of games worth coming back to.</p>
        </div>

        <Link className="button button-secondary" to="/games">
          Explore games <ArrowUpRight size={16} />
        </Link>
      </div>

      {items.length ? (
        <div className="games-grid dashboard-games">
          {items.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              saved
              onSave={() => remove(game.id)}
            />
          ))}
        </div>
      ) : (
        <div className="empty-panel">
          <Heart size={30} />
          <h2>No saved games yet</h2>
          <p>Tap the heart on a game card to save it.</p>

          <Link className="button button-primary" to="/games">
            Explore games <ArrowUpRight size={16} />
          </Link>
        </div>
      )}
    </>
  );
}

function ProjectsPage() {
  const [projects, setProjects] = useState(() =>
    readJSON(PROJECTS_KEY, [])
  );
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stage, setStage] = useState("Planning");
  const [error, setError] = useState("");

  const add = (event) => {
    event.preventDefault();

    if (title.trim().length < 2) {
      setError("Project title must be at least 2 characters.");
      return;
    }

    const next = [
      {
        id: Date.now(),
        title: title.trim(),
        description: description.trim(),
        stage,
        createdAt: new Date().toISOString(),
      },
      ...projects,
    ];

    setProjects(next);
    saveJSON(PROJECTS_KEY, next);
    setTitle("");
    setDescription("");
    setStage("Planning");
    setError("");
  };

  const remove = (id) => {
    const next = projects.filter((project) => project.id !== id);
    setProjects(next);
    saveJSON(PROJECTS_KEY, next);
  };

  return (
    <>
      <div className="dashboard-welcome">
        <div>
          <div className="section-kicker">YOUR WORK IN PROGRESS</div>
          <h1>
            My <span>projects.</span>
          </h1>
          <p>Keep your game concepts and development plans organized.</p>
        </div>
      </div>

      <div className="project-layout">
        <form className="project-form panel" onSubmit={add}>
          <h2>
            <Plus size={18} /> Add a project
          </h2>

          <p>Capture the next idea you want to build.</p>

          {error && (
            <div className="form-alert error">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <label>
            Project name
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Cosmic Quest"
              required
            />
          </label>

          <label>
            Short description
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What is your game about?"
              rows="4"
            />
          </label>

          <label>
            Current stage
            <select
              value={stage}
              onChange={(event) => setStage(event.target.value)}
            >
              <option>Planning</option>
              <option>In development</option>
              <option>Testing</option>
              <option>Completed</option>
            </select>
          </label>

          <button className="button button-primary" type="submit">
            Save project <Plus size={16} />
          </button>
        </form>

        <div className="project-list">
          <div className="dash-section-heading">
            <div>
              <h2>Your projects</h2>
              <p>{projects.length} project(s) saved in this browser</p>
            </div>
          </div>

          {projects.length ? (
            projects.map((project) => (
              <article className="project-card panel" key={project.id}>
                <div className="project-card-top">
                  <span className="project-symbol">
                    <Gamepad2 size={20} />
                  </span>

                  <span
                    className={`stage-badge ${project.stage
                      .toLowerCase()
                      .replaceAll(" ", "-")}`}
                  >
                    {project.stage}
                  </span>

                  <button
                    className="icon-button danger"
                    onClick={() => remove(project.id)}
                    aria-label={`Delete ${project.title}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <h3>{project.title}</h3>
                <p>{project.description || "No description added yet."}</p>

                <small>
                  Created{" "}
                  {new Date(project.createdAt).toLocaleDateString()}
                </small>
              </article>
            ))
          ) : (
            <div className="empty-panel">
              <Code2 size={28} />
              <h2>Your first idea starts here</h2>
              <p>Add a project using the form to start tracking your work.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <div className="dashboard-welcome">
        <div>
          <div className="section-kicker">YOUR ACCOUNT</div>
          <h1>
            Creator <span>profile.</span>
          </h1>
          <p>Manage your local GameDev Hub profile.</p>
        </div>
      </div>

      <div className="profile-panel panel">
        <div className="profile-hero">
          <span className="profile-big-avatar">
            {user?.name?.[0]?.toUpperCase() || "G"}
          </span>

          <div>
            <h2>{user?.name}</h2>
            <p>{user?.email}</p>
            <span className="studio-badge">
              {user?.role === "admin" ? "Administrator" : "Community creator"}
            </span>
          </div>
        </div>

        <div className="profile-stats">
          <div>
            <strong>{readJSON(SAVED_KEY, []).length}</strong>
            <span>Saved games</span>
          </div>

          <div>
            <strong>{readJSON(PROJECTS_KEY, []).length}</strong>
            <span>Projects</span>
          </div>

          <div>
            <strong>
              {user?.joinedAt
                ? new Date(user.joinedAt).toLocaleDateString()
                : "—"}
            </strong>
            <span>Joined</span>
          </div>
        </div>

        <div className="profile-warning">
          <AlertCircle size={18} />
          <p>
            This demo stores account details in your browser's local
            storage. It is not a production authentication system.
          </p>
        </div>

        <button
          className="button button-secondary"
          onClick={() => {
            logout();
            navigate("/");
          }}
        >
          <LogOut size={16} /> Log out
        </button>
      </div>
    </>
  );
}

/* ---------------- COMPETITION DATA ---------------- */

const starterCompetitions = [
  {
    id: "GDH-OPEN-001",
    name: "Neon Arena Championship",
    game: "Valorant",
    date: "2026-12-12",
    time: "18:00",
    deadline: "2026-12-10",
    prize: "₹10,000",
    maxParticipants: 32,
    description: "A community esports showdown.",
    status: "Open",
    createdBy: "admin",
  },
  {
    id: "GDH-OPEN-002",
    name: "Indie Game Jam",
    game: "Game development",
    date: "2026-12-20",
    time: "10:00",
    deadline: "2026-12-18",
    prize: "Featured showcase",
    maxParticipants: 50,
    description: "Build a playable prototype with the community.",
    status: "Open",
    createdBy: "admin",
  },
];

function getCompetitions() {
  const stored = readJSON(COMPETITIONS_KEY, null);

  if (stored) {
    return stored;
  }

  saveJSON(COMPETITIONS_KEY, starterCompetitions);
  return starterCompetitions;
}

function getRegistrations() {
  return readJSON(REGISTRATIONS_KEY, []);
}

function competitionCount(competitionId) {
  return getRegistrations().filter(
    (registration) => registration.competitionId === competitionId
  ).length;
}

function CompetitionCard({
  competition,
  user,
  onRegister,
  registered,
}) {
  const count = competitionCount(competition.id);
  const full = count >= Number(competition.maxParticipants);
  const today = new Date().toISOString().slice(0, 10);
  const deadlinePassed = competition.deadline < today;
  const closed =
    competition.status !== "Open" || deadlinePassed || full;

  return (
    <article className="competition-card panel">
      <div className="competition-card-top">
        <span className="competition-icon">
          <Trophy size={22} />
        </span>

        <span
          className={`competition-status ${
            closed ? "closed" : "open"
          }`}
        >
          {competition.status !== "Open"
            ? competition.status
            : deadlinePassed
              ? "Registration closed"
              : full
                ? "Full"
                : "Open"}
        </span>
      </div>

      <h2>{competition.name}</h2>
      <p>{competition.description || "Join this community competition."}</p>

      <div className="competition-meta">
        <span>
          <Gamepad2 size={16} /> {competition.game}
        </span>

        <span>
          <CalendarDays size={16} /> {competition.date}
        </span>

        <span>
          <Clock size={16} /> {competition.time}
        </span>
      </div>

      <div className="competition-prize">
        <span>Prize / reward</span>
        <strong>{competition.prize || "Community recognition"}</strong>
      </div>

      <div className="competition-progress">
        <div>
          <span>Participants</span>
          <strong>
            {count} / {competition.maxParticipants}
          </strong>
        </div>

        <div className="progress-track">
          <span
            style={{
              width: `${
                Math.min(
                  100,
                  (count / Math.max(1, competition.maxParticipants)) * 100
                )
              }%`,
            }}
          />
        </div>
      </div>

      <div className="competition-deadline">
        Registration deadline: {competition.deadline}
      </div>

      {registered ? (
        <button className="button button-secondary full-width" disabled>
          Already registered
        </button>
      ) : (
        <button
          className="button button-primary full-width"
          onClick={() => onRegister(competition)}
          disabled={!user || closed}
          title={!user ? "Log in to register" : ""}
        >
          {!user
            ? "Log in to register"
            : closed
              ? "Registration unavailable"
              : "Register now"}
          <ArrowUpRight size={16} />
        </button>
      )}
    </article>
  );
}

function CompetitionsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [competitions, setCompetitions] = useState(() =>
    getCompetitions()
  );

  const [registrations, setRegistrations] = useState(() =>
    getRegistrations()
  );

  const [search, setSearch] = useState("");

  const register = (competition) => {
    if (!user) {
      navigate("/login");
      return;
    }

    const today = new Date().toISOString().slice(0, 10);

    if (competition.status !== "Open") {
      alert("This competition is not open for registration.");
      return;
    }

    if (competition.deadline < today) {
      alert("The registration deadline has passed.");
      return;
    }

    const current = getRegistrations();

    if (
      current.some(
        (registration) =>
          registration.userId === user.id &&
          registration.competitionId === competition.id
      )
    ) {
      alert("You are already registered for this competition.");
      return;
    }

    if (
      current.filter(
        (registration) =>
          registration.competitionId === competition.id
      ).length >= Number(competition.maxParticipants)
    ) {
      alert("This competition is full.");
      return;
    }

    const newRegistration = {
      id: `REG-${Date.now()}`,
      competitionId: competition.id,
      competitionName: competition.name,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      registeredAt: new Date().toISOString(),
      status: "Registered",
    };

    const next = [...current, newRegistration];

    saveJSON(REGISTRATIONS_KEY, next);
    setRegistrations(next);
    setCompetitions(getCompetitions());

    alert("Registration successful!");
  };

  const shown = competitions.filter((competition) =>
    `${competition.name} ${competition.game} ${competition.description}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="public-inner section-wrap page-space">
      <div className="section-kicker">PLAY. COMPETE. WIN.</div>

      <h1 className="page-title">
        Gaming <span>competitions.</span>
      </h1>

      <p className="page-intro">
        Find tournaments, join game jams, and compete with the GameDev
        Hub community.
      </p>

      <div className="competition-toolbar">
        <label className="search-box">
          <Search size={17} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search competitions..."
          />
        </label>

        {user?.role === "admin" && (
          <Link
            to="/admin/competitions"
            className="button button-primary"
          >
            <Plus size={16} /> Manage competitions
          </Link>
        )}

        {user && user.role !== "admin" && (
          <Link
            to="/my-registrations"
            className="button button-secondary"
          >
            My registrations
          </Link>
        )}
      </div>

      <div className="competition-grid">
        {shown.map((competition) => (
          <CompetitionCard
            key={competition.id}
            competition={competition}
            user={user}
            registered={registrations.some(
              (registration) =>
                registration.userId === user?.id &&
                registration.competitionId === competition.id
            )}
            onRegister={register}
          />
        ))}
      </div>

      {shown.length === 0 && (
        <div className="empty-panel">
          <Trophy size={30} />
          <h2>No competitions found</h2>
          <p>Try searching for another competition or game.</p>
        </div>
      )}
    </div>
  );
}

function MyRegistrationsPage() {
  const { user } = useAuth();

  const [registrations, setRegistrations] = useState(() =>
    getRegistrations()
  );

  const mine = registrations.filter(
    (registration) => registration.userId === user?.id
  );

  const cancelRegistration = (id) => {
    if (!window.confirm("Cancel this competition registration?")) {
      return;
    }

    const next = registrations.filter(
      (registration) => registration.id !== id
    );

    saveJSON(REGISTRATIONS_KEY, next);
    setRegistrations(next);
  };

  return (
    <>
      <div className="dashboard-welcome">
        <div>
          <div className="section-kicker">YOUR COMPETITIONS</div>

          <h1>
            My <span>registrations.</span>
          </h1>

          <p>View and manage the competitions you have joined.</p>
        </div>

        <Link
          className="button button-primary"
          to="/competitions"
        >
          Browse competitions <ArrowUpRight size={16} />
        </Link>
      </div>

      {mine.length ? (
        <div className="registration-list">
          {mine.map((registration) => (
            <article
              className="registration-card panel"
              key={registration.id}
            >
              <span className="competition-icon">
                <Trophy size={22} />
              </span>

              <div className="registration-main">
                <h3>{registration.competitionName}</h3>

                <p>
                  Registration ID: <strong>{registration.id}</strong>
                </p>

                <small>
                  Registered{" "}
                  {new Date(
                    registration.registeredAt
                  ).toLocaleString()}
                </small>

                <span className="competition-status open">
                  {registration.status}
                </span>
              </div>

              <button
                className="button button-secondary"
                onClick={() => cancelRegistration(registration.id)}
              >
                Cancel registration
              </button>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-panel">
          <Trophy size={30} />
          <h2>No registrations yet</h2>
          <p>Join a competition to see it listed here.</p>

          <Link className="button button-primary" to="/competitions">
            Explore competitions
          </Link>
        </div>
      )}
    </>
  );
}

/* ---------------- ADMIN DASHBOARD ---------------- */

function AdminDashboardPage() {
  const competitions = getCompetitions();
  const registrations = getRegistrations();
  const users = readJSON(USERS_KEY, []);

  return (
    <>
      <div className="dashboard-welcome">
        <div>
          <div className="section-kicker">ADMINISTRATION</div>

          <h1>
            Admin <span>dashboard.</span>
          </h1>

          <p>Manage competitions and review community activity.</p>
        </div>

        <span className="admin-badge">
          <ShieldCheck size={16} /> Administrator
        </span>
      </div>

      <div className="stats-grid">
        <StatCard
          icon={<Trophy />}
          label="Competitions"
          value={competitions.length}
        />

        <StatCard
          icon={<Users />}
          label="Registered users"
          value={users.length}
        />

        <StatCard
          icon={<CalendarDays />}
          label="Registrations"
          value={registrations.length}
        />
      </div>

      <section className="dashboard-section">
        <div className="dash-section-heading">
          <div>
            <h2>Admin tools</h2>
            <p>Manage the GameDev Hub platform.</p>
          </div>
        </div>

        <div className="admin-tool-grid">
          <Link
            className="admin-tool-card panel"
            to="/admin/competitions"
          >
            <span className="stat-icon">
              <Trophy />
            </span>

            <h3>Manage competitions</h3>
            <p>Create, edit, and remove competitions.</p>

            <span className="text-link">
              Open manager <ArrowUpRight size={15} />
            </span>
          </Link>

          <Link className="admin-tool-card panel" to="/admin/users">
            <span className="stat-icon">
              <UsersRound />
            </span>

            <h3>Manage users</h3>
            <p>View registered community accounts.</p>

            <span className="text-link">
              Open user directory <ArrowUpRight size={15} />
            </span>
          </Link>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="dash-section-heading">
          <div>
            <h2>Recent registrations</h2>
            <p>Latest competition sign-ups.</p>
          </div>
        </div>

        {registrations.length ? (
          <div className="admin-table-wrap panel">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Competition</th>
                  <th>Registration ID</th>
                </tr>
              </thead>

              <tbody>
                {[...registrations]
                  .reverse()
                  .slice(0, 8)
                  .map((registration) => (
                    <tr key={registration.id}>
                      <td>{registration.userName}</td>
                      <td>{registration.competitionName}</td>
                      <td>{registration.id}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-panel">
            <Users size={28} />
            <h2>No registrations yet</h2>
            <p>New competition registrations will appear here.</p>
          </div>
        )}
      </section>
    </>
  );
}

function AdminCompetitionsPage() {
  const [competitions, setCompetitions] = useState(() =>
    getCompetitions()
  );

  const emptyForm = {
    name: "",
    game: "",
    date: "",
    time: "18:00",
    deadline: "",
    prize: "",
    maxParticipants: 32,
    description: "",
    status: "Open",
  };

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const updateField = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
  };

  const submit = (event) => {
    event.preventDefault();
    setError("");

    if (
      !form.name.trim() ||
      !form.game.trim() ||
      !form.date ||
      !form.deadline
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (form.deadline > form.date) {
      setError(
        "The registration deadline cannot be after the competition date."
      );
      return;
    }

    if (Number(form.maxParticipants) < 1) {
      setError("Maximum participants must be at least 1.");
      return;
    }

    let next;

    if (editingId) {
      next = competitions.map((competition) =>
        competition.id === editingId
          ? {
              ...competition,
              ...form,
              name: form.name.trim(),
              game: form.game.trim(),
              maxParticipants: Number(form.maxParticipants),
            }
          : competition
      );
    } else {
      const newCompetition = {
        ...form,
        id: `GDH-${Date.now()}`,
        name: form.name.trim(),
        game: form.game.trim(),
        maxParticipants: Number(form.maxParticipants),
        createdBy: "admin",
      };

      next = [newCompetition, ...competitions];
    }

    saveJSON(COMPETITIONS_KEY, next);
    setCompetitions(next);
    resetForm();
  };

  const edit = (competition) => {
    setEditingId(competition.id);

    setForm({
      name: competition.name,
      game: competition.game,
      date: competition.date,
      time: competition.time,
      deadline: competition.deadline,
      prize: competition.prize || "",
      maxParticipants: competition.maxParticipants,
      description: competition.description || "",
      status: competition.status || "Open",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = (id) => {
    if (!window.confirm("Delete this competition?")) {
      return;
    }

    const next = competitions.filter(
      (competition) => competition.id !== id
    );

    saveJSON(COMPETITIONS_KEY, next);
    setCompetitions(next);

    if (editingId === id) {
      resetForm();
    }
  };

  return (
    <>
      <div className="dashboard-welcome">
        <div>
          <div className="section-kicker">ADMINISTRATION</div>

          <h1>
            Competition <span>manager.</span>
          </h1>

          <p>Create schedules and manage competition details.</p>
        </div>

        <Link className="button button-secondary" to="/admin">
          <LayoutDashboard size={16} /> Dashboard
        </Link>
      </div>

      <div className="admin-editor-layout">
        <form className="project-form panel" onSubmit={submit}>
          <h2>
            {editingId ? <Pencil size={18} /> : <Plus size={18} />}
            {editingId ? "Edit competition" : "Create competition"}
          </h2>

          <p>Enter the details for your competition.</p>

          {error && (
            <div className="form-alert error">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <label>
            Competition name
            <input
              name="name"
              value={form.name}
              onChange={updateField}
              placeholder="e.g. Summer Game Championship"
              required
            />
          </label>

          <label>
            Game or event
            <input
              name="game"
              value={form.game}
              onChange={updateField}
              placeholder="e.g. Valorant or Game Jam"
              required
            />
          </label>

          <div className="form-two-columns">
            <label>
              Competition date
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={updateField}
                required
              />
            </label>

            <label>
              Start time
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={updateField}
                required
              />
            </label>
          </div>

          <label>
            Registration deadline
            <input
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={updateField}
              required
            />
          </label>

          <div className="form-two-columns">
            <label>
              Prize or reward
              <input
                name="prize"
                value={form.prize}
                onChange={updateField}
                placeholder="e.g. ₹5,000"
              />
            </label>

            <label>
              Maximum participants
              <input
                type="number"
                min="1"
                name="maxParticipants"
                value={form.maxParticipants}
                onChange={updateField}
                required
              />
            </label>
          </div>

          <label>
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={updateField}
              placeholder="Describe the competition..."
              rows="4"
            />
          </label>

          <label>
            Status
            <select
              name="status"
              value={form.status}
              onChange={updateField}
            >
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
              <option value="Completed">Completed</option>
            </select>
          </label>

          <div className="form-button-row">
            <button className="button button-primary" type="submit">
              {editingId ? "Save changes" : "Create competition"}
              {editingId ? <Pencil size={16} /> : <Plus size={16} />}
            </button>

            {editingId && (
              <button
                className="button button-secondary"
                type="button"
                onClick={resetForm}
              >
                Cancel edit
              </button>
            )}
          </div>
        </form>

        <section className="admin-competition-list">
          <div className="dash-section-heading">
            <div>
              <h2>All competitions</h2>
              <p>{competitions.length} competition(s)</p>
            </div>
          </div>

          {competitions.length ? (
            competitions.map((competition) => (
              <article
                className="admin-competition-item panel"
                key={competition.id}
              >
                <div className="admin-competition-heading">
                  <span className="competition-icon">
                    <Trophy size={20} />
                  </span>

                  <span
                    className={`competition-status ${
                      competition.status === "Open" ? "open" : "closed"
                    }`}
                  >
                    {competition.status}
                  </span>
                </div>

                <h3>{competition.name}</h3>

                <p>{competition.game}</p>

                <div className="admin-competition-details">
                  <span>
                    <CalendarDays size={15} />
                    {competition.date}
                  </span>

                  <span>
                    <Users size={15} />
                    {competitionCount(competition.id)} /{" "}
                    {competition.maxParticipants}
                  </span>
                </div>

                <div className="admin-item-actions">
                  <button
                    className="button button-secondary"
                    onClick={() => edit(competition)}
                  >
                    <Pencil size={15} /> Edit
                  </button>

                  <button
                    className="button button-danger"
                    onClick={() => remove(competition.id)}
                  >
                    <Trash2 size={15} /> Delete
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="empty-panel">
              <Trophy size={28} />
              <h2>No competitions created</h2>
              <p>Use the form to create your first competition.</p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

function AdminUsersPage() {
  const users = readJSON(USERS_KEY, []);
  const registrations = getRegistrations();

  return (
    <>
      <div className="dashboard-welcome">
        <div>
          <div className="section-kicker">ADMINISTRATION</div>

          <h1>
            Community <span>users.</span>
          </h1>

          <p>View the accounts registered in this browser.</p>
        </div>

        <Link className="button button-secondary" to="/admin">
          <LayoutDashboard size={16} /> Dashboard
        </Link>
      </div>

      <div className="stats-grid">
        <StatCard
          icon={<Users />}
          label="Total users"
          value={users.length}
        />

        <StatCard
          icon={<Trophy />}
          label="Total registrations"
          value={registrations.length}
        />
      </div>

      <div className="admin-table-wrap panel">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Registrations</th>
              <th>Joined</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>

                <td>
                  <span className="user-role-badge">
                    {user.role || "user"}
                  </span>
                </td>

                <td>
                  {
                    registrations.filter(
                      (registration) => registration.userId === user.id
                    ).length
                  }
                </td>

                <td>
                  {user.joinedAt
                    ? new Date(user.joinedAt).toLocaleDateString()
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="empty-panel">
            <UsersRound size={28} />
            <h2>No users registered</h2>
            <p>New accounts will appear here after signup.</p>
          </div>
        )}
      </div>
    </>
  );
}
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Pencil,
  UserRound,
  BookOpen,
  PanelsTopLeft,
  Clapperboard,
  Shapes,
  Image,
  Mic,
  FolderOpen,
  Library,
  Plus,
  Search,
  ArrowUpRight,
  ArrowRight,
  ChevronDown,
  Sun,
  Moon,
  Sparkles,
  X,
  Send,
  Check,
  Menu,
  Heart,
  HelpCircle,
} from "lucide-react";
import { Cartoon, Spark } from "../components/cartoon";
import { Sketchpad } from "../components/sketchpad";
import {
  CharacterWorkspace,
  StoryWorkspace,
  ComicWorkspace,
  LabWorkspace,
  AnimationWorkspace,
  SceneWorkspace,
  VoiceWorkspace,
  AssetWorkspace,
  ProjectWorkspace,
  ProjectCard,
  initialCharacters,
  initialProjects,
  type Project,
} from "../components/workspaces";
import { useLocal } from "../hooks/use-local";
const sections = [
  { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
  { id: "sketch", name: "Sketch Studio", icon: Pencil },
  { id: "characters", name: "Character Creator", icon: UserRound },
  { id: "story", name: "Story Studio", icon: BookOpen },
  { id: "comic", name: "Comic Creator", icon: PanelsTopLeft },
  { id: "lab", name: "Rubber Hose Lab", icon: Shapes },
  { id: "animation", name: "Animation Studio", icon: Clapperboard },
  { id: "scene", name: "Scene Builder", icon: Image },
  { id: "voice", name: "Voice & Dialogue", icon: Mic },
  { id: "assets", name: "Asset Library", icon: Library },
  { id: "projects", name: "Project Manager", icon: FolderOpen },
];
const descriptions: Record<string, string> = {
  sketch: "A blank page, a curious mind, and endless possibilities.",
  characters: "Meet the little personalities at the heart of your world.",
  story: "Turn a spark of an idea into a story worth telling.",
  comic: "One panel at a time. One wonderful little adventure.",
  lab: "Classic charm. Bendy limbs. A personality all their own.",
  animation: "A little movement makes a whole world come alive.",
  scene: "Build a world your characters can get lost in.",
  voice: "Every character has something to say.",
  assets: "All your creative treasures, together in one place.",
  projects: "Big dreams, little projects. Keep them all together.",
};
export default function Studio() {
  const [page, setPage] = useState(() => window.location.hash.slice(1) || "dashboard");
  const [theme, setTheme] = useLocal("heather-theme", "light");
  const [characters, setCharacters] = useLocal("heather-characters", initialCharacters);
  const [projects, setProjects] = useLocal("heather-projects", initialProjects);
  const [modal, setModal] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("Character");
  const [toast, setToast] = useState("");
  const [copilot, setCopilot] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [search, setSearch] = useState("");
  const [menu, setMenu] = useState(false);
  const [help, setHelp] = useState(false);
  useEffect(() => {
    const hash = () => setPage(window.location.hash.slice(1) || "dashboard");
    window.addEventListener("hashchange", hash);
    return () => window.removeEventListener("hashchange", hash);
  }, []);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 4000);
    return () => clearTimeout(timer);
  }, [toast]);
  function go(id: string) {
    setPage(id);
    window.location.hash = id;
    setMenu(false);
    setSearch("");
  }
  function open(p: Project) {
    go(
      (
        {
          Character: "characters",
          Comic: "comic",
          Animation: "animation",
          Story: "story",
          Sketch: "sketch",
        } as Record<string, string>
      )[p.type] || "projects",
    );
    setToast(
      `Opened ${p.type.toLowerCase()} workspace. Projects are concept entries in this prototype.`,
    );
  }
  function create(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const p = {
      id: crypto.randomUUID(),
      name: name.trim(),
      type,
      color: ["sage", "peach", "lavender"][projects.length % 3]!,
      date: "Just created",
    };
    setProjects([p, ...projects]);
    setModal(false);
    setName("");
    go("projects");
    setToast("Project added to your studio.");
  }
  const active = sections.find((s) => s.id === page) || sections[0]!;
  return (
    <div className={`studio ${theme === "dark" ? "dark" : ""}`}>
      <aside className={`sidebar ${menu ? "mobile-open" : ""}`}>
        <button className="brand" onClick={() => go("dashboard")}>
          <div className="brand-mark">
            <Pencil size={23} />
            <Spark className="brand-spark" />
          </div>
          <div>
            <b>Heather’s</b>
            <span>RUBBER HOSE STUDIO</span>
          </div>
        </button>
        <button className="studio-select" onClick={() => go("projects")}>
          <div className="tiny-avatar">H</div>
          <span>
            Heather’s workspace<small>Your little creative universe</small>
          </span>
          <ChevronDown size={14} />
        </button>
        <span className="nav-label">YOUR STUDIO</span>
        <nav>
          {sections.slice(0, 9).map(({ id, name, icon: Icon }, i) => (
            <button
              key={id}
              className={`nav-item ${page === id ? "active" : ""} ${i === 5 ? "nav-separator" : ""}`}
              onClick={() => go(id)}
            >
              <Icon size={18} />
              <span>{name}</span>
              {id === "lab" && <span className="mini-spark">✦</span>}
            </button>
          ))}
          <span className="nav-label library-label">KEEP IT TOGETHER</span>
          {sections.slice(9).map(({ id, name, icon: Icon }) => (
            <button
              key={id}
              className={`nav-item ${page === id ? "active" : ""}`}
              onClick={() => go(id)}
            >
              <Icon size={18} />
              <span>{name}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <Sparkles size={19} />
            <b>A little help. A lot of magic.</b>
            <p>Meet Inky, your creative sidekick.</p>
            <button onClick={() => setCopilot(true)}>
              Say hello to Inky <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="sidebar-footer">
            <button onClick={() => setHelp(true)}>
              <HelpCircle size={17} /> Studio guide
            </button>
            <button
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
            </button>
          </div>
          <div className="user-profile">
            <div className="user-avatar">H</div>
            <span>
              <b>Heather</b>
              <small>Dreamer. Maker. Storyteller.</small>
            </span>
            <Heart size={15} />
          </div>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumbs">
            <button
              className="mobile-menu"
              aria-label="Open navigation"
              onClick={() => setMenu(!menu)}
            >
              <Menu size={20} />
            </button>
            <span>Your studio</span>
            <span>/</span>
            <b>{active.name}</b>
          </div>
          <div className="header-tools">
            <div className="global-search">
              <Search size={16} />
              <input
                aria-label="Search your studio"
                placeholder="Find a little something…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <kbd>⌕</kbd>
              {search && (
                <div className="search-results">
                  {sections
                    .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
                    .map((s) => (
                      <button key={s.id} onClick={() => go(s.id)}>
                        {s.name}
                        <ArrowRight size={14} />
                      </button>
                    ))}
                  {projects
                    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
                    .map((p) => (
                      <button key={p.id} onClick={() => open(p)}>
                        {p.name}
                        <span>{p.type}</span>
                      </button>
                    ))}
                  {!sections.some((s) => s.name.toLowerCase().includes(search.toLowerCase())) &&
                    !projects.some((p) => p.name.toLowerCase().includes(search.toLowerCase())) && (
                      <p>No matches. Try “sketch” or “Milo”.</p>
                    )}
                </div>
              )}
            </div>
            <span className="local-saved">
              <span className="status-dot" /> Saved locally
            </span>
            <button
              className="header-avatar"
              onClick={() => setHelp(true)}
              aria-label="Workspace information"
            >
              H
            </button>
          </div>
        </header>
        <main>
          {page === "dashboard" ? (
            <>
              <div className="welcome-heading">
                <div>
                  <span className="eyebrow">A LITTLE IMAGINATION GOES A LONG WAY</span>
                  <h1>
                    Welcome to your happy place, Heather<span className="inline-star">✦</span>
                  </h1>
                  <p>Where your characters find their feet, and your stories find their wings.</p>
                </div>
                <button className="button primary" onClick={() => setModal(true)}>
                  <Plus size={17} /> New project
                </button>
              </div>
              <section className="hero-card">
                <div className="hero-copy">
                  <span className="hero-eyebrow">
                    <span /> MADE FOR YOUR IMAGINATION
                  </span>
                  <h2 lang="cy">
                    Mae'r dyfodol yng ngafael y rhai sy'n credu ym mhrydferthwch eu breuddwydion
                  </h2>
                  <p lang="cy">Nawr mae eich rhai chi wrth flaenau eich bysedd.</p>
                  <button className="button ink" onClick={() => go("sketch")}>
                    Let’s make a little magic <ArrowRight size={16} />
                  </button>
                  <span className="hero-footnote">
                    A blank canvas. An entire universe of possibilities.
                  </span>
                </div>
                <div className="hero-art">
                  <span className="orbit orbit-one" />
                  <span className="orbit orbit-two" />
                  <Spark className="hero-spark one" />
                  <Spark className="hero-spark two" />
                  <span className="doodle-note">
                    big dreams,
                    <br />
                    little characters.
                  </span>
                  <Cartoon className="hero-cat" />
                  <Cartoon kind="rabbit" className="hero-rabbit" />
                  <svg className="doodle-arrow" width="80" height="70" viewBox="0 0 80 70">
                    <path
                      d="M10 5 Q65 0 60 52 L46 39 M60 52 L71 38"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  <span className="art-ground" />
                </div>
              </section>
              <section className="quick-start">
                <button onClick={() => go("sketch")}>
                  <span className="quick-icon gold">
                    <Pencil size={23} />
                  </span>
                  <span>
                    <b>Make your first mark</b>
                    <small>A sketch is where it all begins.</small>
                  </span>
                  <ArrowUpRight size={19} />
                </button>
                <button onClick={() => go("characters")}>
                  <span className="quick-icon peach">
                    <UserRound size={23} />
                  </span>
                  <span>
                    <b>Meet a new character</b>
                    <small>A little personality, a lot of possibility.</small>
                  </span>
                  <ArrowUpRight size={19} />
                </button>
                <button onClick={() => go("story")}>
                  <span className="quick-icon sage">
                    <BookOpen size={23} />
                  </span>
                  <span>
                    <b>Dream up a story</b>
                    <small>Once upon an extraordinary idea…</small>
                  </span>
                  <ArrowUpRight size={19} />
                </button>
              </section>
              <div className="dashboard-lower">
                <div className="project-shelf">
                  <div className="section-heading">
                    <div>
                      <h2>Pick up where you left off</h2>
                      <p>Your worlds are right here, waiting for you.</p>
                    </div>
                    <button className="text-button" onClick={() => go("projects")}>
                      All projects <ArrowRight size={15} />
                    </button>
                  </div>
                  <div className="project-grid">
                    {projects.slice(0, 3).map((p) => (
                      <ProjectCard key={p.id} project={p} onClick={() => open(p)} />
                    ))}
                  </div>
                  <div className="studio-stats">
                    <span>
                      <b>{projects.length}</b> little worlds in the making
                    </span>
                    <span>
                      <b>{characters.length}</b> characters with a story to tell
                    </span>
                    <span>
                      <Heart size={14} /> Made with imagination
                    </span>
                  </div>
                </div>
                <aside className="inspiration-card">
                  <div className="section-heading">
                    <span className="eyebrow">A SPARK OF INSPIRATION</span>
                    <Sparkles size={16} />
                  </div>
                  <span className="quote-mark">“</span>
                  <h3>What if your character’s biggest flaw became their greatest adventure?</h3>
                  <p>Small quirks make unforgettable characters.</p>
                  <button className="text-button" onClick={() => go("characters")}>
                    Explore your characters <ArrowRight size={15} />
                  </button>
                  <span className="inspiration-flower">✳</span>
                </aside>
              </div>
              <div className="bottom-note">
                <span>YOUR IMAGINATION. YOUR WORLD. YOUR STUDIO.</span>
                <span>Start small. Dream wonderfully.</span>
              </div>
            </>
          ) : (
            <>
              <div className="workspace-heading">
                <div>
                  <span className="eyebrow">HEATHER’S CREATIVE UNIVERSE</span>
                  <h1>{active.name}</h1>
                  <p>{descriptions[page]}</p>
                </div>
                <span className="tag">Interactive prototype</span>
              </div>
              {page === "sketch" ? (
                <Sketchpad notify={setToast} />
              ) : page === "characters" ? (
                <CharacterWorkspace
                  characters={characters}
                  setCharacters={setCharacters}
                  notify={setToast}
                />
              ) : page === "story" ? (
                <StoryWorkspace characters={characters} notify={setToast} />
              ) : page === "comic" ? (
                <ComicWorkspace notify={setToast} />
              ) : page === "lab" ? (
                <LabWorkspace />
              ) : page === "animation" ? (
                <AnimationWorkspace />
              ) : page === "scene" ? (
                <SceneWorkspace />
              ) : page === "voice" ? (
                <VoiceWorkspace notify={setToast} />
              ) : page === "assets" ? (
                <AssetWorkspace notify={setToast} />
              ) : (
                <ProjectWorkspace
                  projects={projects}
                  onOpen={open}
                  onNew={() => setModal(true)}
                  notify={setToast}
                />
              )}
            </>
          )}
        </main>
      </div>
      <button className="copilot-fab" onClick={() => setCopilot(!copilot)}>
        <span className="inky-eye">●</span>
        <span>A little help from Inky</span>
        <Sparkles size={16} />
      </button>
      {toast && (
        <output className="toast">
          <Check size={18} />
          {toast}
          <button aria-label="Dismiss notification" onClick={() => setToast("")}>
            <X size={15} />
          </button>
        </output>
      )}
      {modal && (
        <div className="modal-backdrop">
          <form className="modal paper" onSubmit={create}>
            <button
              className="modal-close"
              aria-label="Close"
              type="button"
              onClick={() => setModal(false)}
            >
              <X size={20} />
            </button>
            <span className="eyebrow">THE START OF SOMETHING WONDERFUL</span>
            <h2>Make room for a new dream.</h2>
            <p className="muted">
              A project entry keeps your idea in the studio shelf. Workspaces share one local draft
              in this prototype.
            </p>
            <label>
              Project name
              <input
                aria-label="Project name"
                required
                placeholder="A little midnight adventure…"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label>
              What are you making?
              <select value={type} onChange={(e) => setType(e.target.value)}>
                {["Character", "Comic", "Animation", "Story", "Sketch"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
            <button className="button primary" type="submit">
              <Plus size={16} /> Create project
            </button>
          </form>
        </div>
      )}
      {copilot && (
        <aside className="copilot-panel paper">
          <div className="section-heading">
            <div>
              <span className="eyebrow">YOUR CREATIVE SIDEKICK</span>
              <h3>Hello, I’m Inky.</h3>
            </div>
            <button aria-label="Close Inky" onClick={() => setCopilot(false)}>
              <X size={20} />
            </button>
          </div>
          <span className="tag">Preview · AI not connected</span>
          <p>
            I’m here to make the blank page a little less blank. For now, explore these starter
            prompts — live conversation is coming later.
          </p>
          <div className="copilot-messages">
            {messages.length === 0 ? (
              <>
                {[
                  "Give my character a surprising secret",
                  "Help me start a midnight adventure",
                  "How do I plan a simple walk cycle?",
                ].map((p) => (
                  <button key={p} className="prompt-chip" onClick={() => setPrompt(p)}>
                    {p}
                    <ArrowUpRight size={14} />
                  </button>
                ))}
              </>
            ) : (
              messages.map((m, i) => (
                <div key={i} className={`message ${m.role}`}>
                  {m.text}
                </div>
              ))
            )}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!prompt.trim()) return;
              setMessages([
                ...messages,
                { role: "user", text: prompt },
                {
                  role: "assistant",
                  text: "This is a preview, not a live AI response. A useful place to start: give your character one clear goal, one small fear, and one surprising habit. Try writing these in the Character Creator, then build a scene where they collide.",
                },
              ]);
              setPrompt("");
            }}
          >
            <input
              aria-label="Message Inky"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Tell Inky your idea…"
            />
            <button aria-label="Send preview prompt">
              <Send size={17} />
            </button>
          </form>
        </aside>
      )}
      {help && (
        <div className="modal-backdrop">
          <div className="modal paper">
            <button className="modal-close" aria-label="Close guide" onClick={() => setHelp(false)}>
              <X size={20} />
            </button>
            <span className="eyebrow">WELCOME TO YOUR STUDIO</span>
            <h2>A home for your imagination.</h2>
            <p>
              Draw in Sketch Studio, build your cast, write stories, and lay out comics. Changes
              save automatically in this browser.
            </p>
            <p>
              Project entries organize ideas; workspaces currently share a local draft. AI,
              generated voices, and advanced animation are clearly labeled previews.
            </p>
            <p>
              Use Project Manager → Export studio backup to keep a copy. There are no accounts or
              cloud sync yet.
            </p>
            <button className="button primary" onClick={() => setHelp(false)}>
              Let’s create <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

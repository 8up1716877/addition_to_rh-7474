import { useState } from "react";
import {
  Plus,
  ArrowRight,
  Save,
  Download,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  Upload,
  Search,
  Volume2,
  Sparkles,
} from "lucide-react";
import { Cartoon } from "./cartoon";
import { ColorPalettes } from "./color-palettes";
import { useLocal, download } from "../hooks/use-local";
export type Character = {
  id: string;
  name: string;
  nickname: string;
  species: string;
  age: string;
  occupation: string;
  alignment: string;
  personality: string;
  traits: string;
  goals: string;
  fears: string;
  notes: string;
  paletteId?: string;
  signatureColor?: string;
};
export type Project = { id: string; name: string; type: string; color: string; date: string };
export const initialCharacters: Character[] = [
  {
    id: "milo",
    name: "Milo the Cat",
    nickname: "Milo",
    species: "Cat",
    age: "Young at heart",
    occupation: "Accidental adventurer",
    alignment: "Chaotic good",
    personality: "A curious optimist",
    traits: "Curious, clumsy, kind-hearted",
    goals: "Find the courage to follow the music.",
    fears: "Being left behind",
    notes: "A little cat with big dreams and an even bigger pair of shoes.",
  },
  {
    id: "ruby",
    name: "Ruby Rabbit",
    nickname: "Ruby",
    species: "Rabbit",
    age: "23",
    occupation: "Jazz singer",
    alignment: "Neutral good",
    personality: "The confident dreamer",
    traits: "Witty, warm, adventurous",
    goals: "Play the grandest stage in town.",
    fears: "Losing her voice",
    notes: "Every adventure needs a little rhythm.",
  },
];
export const initialProjects: Project[] = [
  { id: "moon", name: "Moonlight Mischief", type: "Comic", color: "sage", date: "Sample project" },
  { id: "milo", name: "Meet Milo", type: "Character", color: "peach", date: "Sample project" },
  {
    id: "bounce",
    name: "A little bounce",
    type: "Animation",
    color: "lavender",
    date: "Sample project",
  },
];
export function PreviewNote({ children }: { children?: React.ReactNode }) {
  return (
    <div className="preview-note">
      <span className="tag">
        <Sparkles size={12} /> AI preview · not connected
      </span>
      <p>
        {children ||
          "Explore the workflow here. Live AI generation will be available when a provider is connected."}
      </p>
    </div>
  );
}
export function CharacterWorkspace({
  characters,
  setCharacters,
  notify,
}: {
  characters: Character[];
  setCharacters: (v: Character[]) => void;
  notify: (s: string) => void;
}) {
  const [id, setId] = useState(characters[0]?.id || "");
  const [tab, setTab] = useState("Profile");
  const selected = characters.find((c) => c.id === id) || characters[0];
  function update(field: keyof Character, value: string) {
    setCharacters(characters.map((c) => (c.id === selected?.id ? { ...c, [field]: value } : c)));
  }
  return (
    <div className="character-layout">
      <aside className="paper roster">
        <div className="section-heading">
          <h3>Your cast</h3>
          <button
            aria-label="New character"
            onClick={() => {
              const c: Character = {
                id: crypto.randomUUID(),
                name: "Untitled character",
                nickname: "",
                species: "Cat",
                age: "",
                occupation: "",
                alignment: "",
                personality: "",
                traits: "",
                goals: "",
                fears: "",
                notes: "",
              };
              setCharacters([...characters, c]);
              setId(c.id);
            }}
          >
            <Plus size={18} />
          </button>
        </div>
        {characters.map((c) => (
          <button
            key={c.id}
            className={`cast-item ${selected?.id === c.id ? "active" : ""}`}
            onClick={() => setId(c.id)}
          >
            <div className="cast-avatar">
              <Cartoon kind={c.species === "Rabbit" ? "rabbit" : "cat"} />
            </div>
            <span>
              <b>{c.name}</b>
              <small>
                {c.species} · {c.personality || "A story waiting to happen"}
              </small>
            </span>
          </button>
        ))}
        <p className="muted">Your characters are saved as you go.</p>
      </aside>
      {selected && (
        <div className="paper profile-editor">
          <div className="profile-banner">
            <div>
              <span className="eyebrow">CHARACTER NO. {characters.indexOf(selected) + 1}</span>
              <h2>{selected.name}</h2>
              <p>{selected.notes || "Every great story starts with someone."}</p>
            </div>
            <Cartoon kind={selected.species === "Rabbit" ? "rabbit" : "cat"} />
          </div>
          <div className="tabs">
            {["Profile", "Personality", "Visuals"].map((t) => (
              <button className={tab === t ? "active" : ""} onClick={() => setTab(t)} key={t}>
                {t}
              </button>
            ))}
          </div>
          {tab === "Profile" ? (
            <div className="form-grid">
              {(
                [
                  "name",
                  "nickname",
                  "species",
                  "age",
                  "occupation",
                  "alignment",
                  "personality",
                  "notes",
                ] as const
              ).map((f) => (
                <label key={f}>
                  {f === "personality"
                    ? "Personality type"
                    : f.charAt(0).toUpperCase() + f.slice(1)}
                  <input
                    aria-label={f}
                    value={selected[f]}
                    onChange={(e) => update(f, e.target.value)}
                  />
                </label>
              ))}
            </div>
          ) : tab === "Personality" ? (
            <div className="form-grid">
              {(["traits", "goals", "fears", "notes"] as const).map((f) => (
                <label key={f}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                  <textarea
                    aria-label={f}
                    value={selected[f]}
                    onChange={(e) => update(f, e.target.value)}
                    rows={4}
                  />
                </label>
              ))}
              <PreviewNote>
                “Expand Character” will add motivations, relationships and emotional depth. This
                prototype saves the personality you write yourself.
              </PreviewNote>
            </div>
          ) : (
            <div className="visual-profile">
              <Cartoon kind={selected.species === "Rabbit" ? "rabbit" : "cat"} />
              <div>
                <h3>Signature palette</h3>
                <ColorPalettes
                  paletteId={selected.paletteId || "classic"}
                  onPaletteChange={(id) => update("paletteId", id)}
                  color={selected.signatureColor || "#292920"}
                  onColorChange={(hex) => update("signatureColor", hex)}
                />
                <p className="palette-help">
                  Choose a palette and a signature color for this character. Both save with their
                  profile; sample artwork stays unchanged.
                </p>
                <p>
                  This is an illustrative sample design. Import your own artwork in the Asset
                  Library.
                </p>
              </div>
            </div>
          )}
          <div className="editor-footer">
            <span>
              <span className="status-dot" /> Saved in this browser
            </span>
            <button
              className="button"
              onClick={() => {
                download(`${selected.name}.json`, JSON.stringify(selected, null, 2));
                notify("Character profile exported");
              }}
            >
              <Download size={15} /> Export profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export function StoryWorkspace({
  characters,
  notify,
}: {
  characters: Character[];
  notify: (s: string) => void;
}) {
  const [stories, setStories] = useLocal("heather-stories", [
    {
      id: "1",
      title: "Moonlight Mischief",
      chapter: "Chapter 1 · The midnight melody",
      body: "The town was asleep. Well, almost.\n\nMilo followed a curious little tune through the cobbled streets, his oversized shoes tapping out a rhythm of their own. Somewhere beyond the old theater, someone was playing his favorite song.\n\n“Just one little peek,” he whispered.\n\nAnd that was how the adventure began.",
      lore: "A sleepy seaside town where music comes alive after midnight.",
    },
  ]);
  const [id, setId] = useState(stories[0]?.id);
  const [tab, setTab] = useState("Writing");
  const story = stories.find((s) => s.id === id) || stories[0]!;
  function update(f: string, v: string) {
    setStories(stories.map((s) => (s.id === story.id ? { ...s, [f]: v } : s)));
  }
  return (
    <div className="story-layout">
      <aside className="paper">
        <div className="section-heading">
          <h3>Your stories</h3>
          <button
            aria-label="Add story"
            onClick={() => {
              const s = {
                id: crypto.randomUUID(),
                title: "Untitled story",
                chapter: "Chapter 1",
                body: "",
                lore: "",
              };
              setStories([...stories, s]);
              setId(s.id);
            }}
          >
            <Plus size={18} />
          </button>
        </div>
        {stories.map((s) => (
          <button
            className={`story-link ${story.id === s.id ? "active" : ""}`}
            onClick={() => setId(s.id)}
            key={s.id}
          >
            {s.title}
            <small>{s.chapter}</small>
          </button>
        ))}
        <hr />
        <span className="eyebrow">THE CAST</span>
        {characters.map((c) => (
          <p key={c.id}>{c.name}</p>
        ))}
      </aside>
      <div className="paper writing-paper">
        <div className="tabs">
          {["Writing", "World & lore", "Relationships"].map((t) => (
            <button key={t} className={tab === t ? "active" : ""} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </div>
        {tab === "Writing" ? (
          <>
            <input
              aria-label="Story title"
              className="story-title"
              value={story.title}
              onChange={(e) => update("title", e.target.value)}
            />
            <input
              aria-label="Chapter heading"
              className="chapter-title"
              value={story.chapter}
              onChange={(e) => update("chapter", e.target.value)}
            />
            <textarea
              aria-label="Story text"
              className="story-body"
              value={story.body}
              onChange={(e) => update("body", e.target.value)}
              placeholder="Once upon a little adventure…"
            />
            <div className="editor-footer">
              <span>
                {story.body.trim() ? story.body.trim().split(/\s+/).length : 0} words · Saved
                locally
              </span>
              <button
                onClick={() => {
                  download(
                    `${story.title}.txt`,
                    `${story.title}\n${story.chapter}\n\n${story.body}`,
                    "text/plain",
                  );
                  notify("Story exported");
                }}
              >
                <Download size={16} /> Export text
              </button>
            </div>
          </>
        ) : tab === "World & lore" ? (
          <div className="padded">
            <h2>A world of your own</h2>
            <textarea
              aria-label="World and lore"
              rows={12}
              value={story.lore}
              onChange={(e) => update("lore", e.target.value)}
              placeholder="Places, rules, history, little mysteries…"
            />
          </div>
        ) : (
          <div className="padded">
            <h2>Every connection tells a story</h2>
            <RelationshipMap characters={characters} />
          </div>
        )}
      </div>
    </div>
  );
}
function RelationshipMap({ characters }: { characters: Character[] }) {
  const [relations, setRelations] = useLocal<Record<string, string>>("heather-relationships", {});
  return (
    <div className="relationship-map">
      {characters.slice(1).map((c) => (
        <div className="relationship" key={c.id}>
          <b>{characters[0]?.name}</b>
          <div>
            <span>↔</span>
            <select
              aria-label={`Relationship to ${c.name}`}
              value={relations[c.id] || "Friends"}
              onChange={(e) => setRelations({ ...relations, [c.id]: e.target.value })}
            >
              {["Friends", "Enemies", "Family", "Romance", "Rivals", "Mentors"].map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
          <b>{c.name}</b>
        </div>
      ))}
      {characters.length < 2 && <p>Add another character to build a connection.</p>}
    </div>
  );
}
export function ComicWorkspace({ notify }: { notify: (s: string) => void }) {
  const [panels, setPanels] = useLocal("heather-comic", [
    { id: "1", text: "Did you hear that?", kind: "cat", caption: "Somewhere after midnight…" },
    { id: "2", text: "Follow the music!", kind: "rabbit", caption: "" },
    { id: "3", text: "What could possibly go wrong?", kind: "cat", caption: "To be continued." },
  ]);
  const [selected, setSelected] = useState(panels[0]?.id);
  const panel = panels.find((p) => p.id === selected);
  const [drag, setDrag] = useState("");
  function patch(f: string, v: string) {
    setPanels(panels.map((p) => (p.id === selected ? { ...p, [f]: v } : p)));
  }
  function exportComic() {
    const esc = (s: string) =>
      s.replace(
        /[&<>"']/g,
        (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]!,
      );
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${panels.length * 380}" height="400"><rect width="100%" height="100%" fill="#fffdf8"/>${panels.map((p, i) => `<g transform="translate(${i * 380 + 10},10)"><rect width="360" height="380" rx="10" fill="#edbd55" stroke="#292920" stroke-width="4"/><text x="20" y="40" font-family="serif" font-size="18">${esc(p.caption)}</text><text x="20" y="100" font-family="sans-serif" font-size="18">${esc(p.text)}</text><text x="20" y="340" font-family="sans-serif" font-size="16">Panel ${i + 1} · ${esc(p.kind)}</text></g>`).join("")}</svg>`;
    const img = new Image();
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = panels.length * 380;
      canvas.height = 400;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const a = document.createElement("a");
      a.download = "comic-storyboard.png";
      a.href = canvas.toDataURL();
      a.click();
      URL.revokeObjectURL(url);
      notify("Text storyboard exported as PNG; sample character art is not included.");
    };
    img.src = url;
  }
  return (
    <>
      <div className="workspace-toolbar">
        <span>{panels.length} panels · drag to rearrange</span>
        <div>
          <button
            className="button"
            onClick={() => {
              const p = {
                id: crypto.randomUUID(),
                text: "Your dialogue here…",
                kind: "cat",
                caption: "",
              };
              setPanels([...panels, p]);
              setSelected(p.id);
            }}
          >
            <Plus size={16} /> Add panel
          </button>
          <button className="button primary" onClick={exportComic}>
            <Download size={16} /> Export storyboard
          </button>
        </div>
      </div>
      <div className="comic-layout">
        <div className="comic-page">
          {panels.map((p, i) => (
            <button
              draggable
              onDragStart={() => setDrag(p.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                const from = panels.findIndex((v) => v.id === drag);
                if (from < 0) return;
                const updated = [...panels];
                const [item] = updated.splice(from, 1);
                updated.splice(i, 0, item!);
                setPanels(updated);
              }}
              key={p.id}
              className={`comic-panel ${selected === p.id ? "active" : ""}`}
              onClick={() => setSelected(p.id)}
            >
              <span className="panel-number">
                <GripVertical size={13} /> {i + 1}
              </span>
              {p.caption && <span className="caption">{p.caption}</span>}
              <span className="speech-bubble">{p.text}</span>
              <Cartoon kind={p.kind === "rabbit" ? "rabbit" : "cat"} />
            </button>
          ))}
        </div>
        <aside className="paper tool-panel">
          <h3>Panel details</h3>
          {panel && (
            <>
              <label>
                Speech bubble
                <textarea
                  aria-label="Speech bubble"
                  rows={3}
                  value={panel.text}
                  onChange={(e) => patch("text", e.target.value)}
                />
              </label>
              <label>
                Narration
                <input
                  aria-label="Narration"
                  value={panel.caption}
                  onChange={(e) => patch("caption", e.target.value)}
                />
              </label>
              <label>
                Sample character
                <select value={panel.kind} onChange={(e) => patch("kind", e.target.value)}>
                  <option value="cat">Milo the Cat</option>
                  <option value="rabbit">Ruby Rabbit</option>
                </select>
              </label>
              <button
                className="button"
                disabled={panels.length < 2}
                onClick={() => {
                  const next = panels.filter((p) => p.id !== selected);
                  setPanels(next);
                  setSelected(next[0]?.id);
                }}
              >
                Remove panel
              </button>
            </>
          )}
          <PreviewNote>
            AI scene ideas, dialogue and pacing recommendations are preview features.
          </PreviewNote>
          <small className="muted">
            PNG export creates a text storyboard. Full illustrated PNG, JPG and PDF exports are
            planned.
          </small>
        </aside>
      </div>
    </>
  );
}
export function LabWorkspace() {
  const [style, setStyle] = useState("Classic Rubber Hose");
  const [kind, setKind] = useState<"cat" | "rabbit" | "flower">("cat");
  const [pose, setPose] = useState("Idle");
  return (
    <div className="lab-layout">
      <div className={`lab-stage ${style === "Black & White" ? "monochrome" : ""}`}>
        <span className="eyebrow">THE CHARACTER LAB · ILLUSTRATIVE PREVIEW</span>
        <Cartoon kind={kind} dancing={pose !== "Idle"} />
        <div className="stage-label">
          {kind === "cat" ? "Milo" : kind === "rabbit" ? "Ruby" : "Sunny"} · {pose} preview
        </div>
      </div>
      <aside className="paper tool-panel">
        <h3>A little vintage magic</h3>
        <p className="muted">Explore the look before making it your own.</p>
        <label>
          Design direction
          <select value={style} onChange={(e) => setStyle(e.target.value)}>
            {[
              "Classic Rubber Hose",
              "Fleischer Inspired",
              "Vintage Cartoon",
              "Black & White",
              "Modern Rubber Hose",
              "Toon Style",
            ].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label>
          Sample character
          <select value={kind} onChange={(e) => setKind(e.target.value as typeof kind)}>
            <option value="cat">Cat</option>
            <option value="rabbit">Rabbit</option>
            <option value="flower">Flower</option>
          </select>
        </label>
        <label>
          Motion preview
          <select value={pose} onChange={(e) => setPose(e.target.value)}>
            {["Idle", "Dancing", "Bouncing"].map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </label>
        <PreviewNote>
          Settings explore the workflow; these are hand-drawn sample characters, not AI-generated
          images. Walk cycles and expression sheet generation are planned.
        </PreviewNote>
      </aside>
    </div>
  );
}
export function AnimationWorkspace() {
  const [playing, setPlaying] = useState(false);
  const [frame, setFrame] = useState(0);
  const [fps, setFps] = useState(12);
  const [frames, setFrames] = useLocal("heather-frames", [0, 1, 2, 3, 4, 5, 6, 7]);
  const [mode, setMode] = useState("Rubber Hose");
  const [bounce, setBounce] = useState(35);
  return (
    <>
      <div className="workspace-toolbar">
        <span className="tag">Illustrative motion preview · not an animation editor</span>
        <label className="inline-label">
          Mode
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            {["Rubber Hose", "Frame-by-Frame", "Tween"].map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="animation-stage">
        <div
          style={{
            transform: `translateY(${-Math.sin((frame / 8) * Math.PI * 2) * bounce}px)`,
            animationDuration: `${12 / fps}s`,
          }}
          className={playing ? "animated-mascot" : ""}
        >
          <Cartoon />
        </div>
        <div className="stage-label">{mode} · sample bounce motion</div>
      </div>
      <div className="paper timeline">
        <div className="section-heading">
          <div className="play-controls">
            <button aria-label="Previous frame" onClick={() => setFrame(Math.max(0, frame - 1))}>
              <ChevronLeft size={18} />
            </button>
            <button
              className="play-button"
              aria-label={playing ? "Pause" : "Play"}
              onClick={() => setPlaying(!playing)}
            >
              {playing ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <button aria-label="Next frame" onClick={() => setFrame((frame + 1) % frames.length)}>
              <ChevronRight size={18} />
            </button>
            <span>
              Frame {frame + 1} / {frames.length}
            </span>
          </div>
          <label className="inline-label">
            {fps} FPS
            <input
              aria-label="Frames per second"
              type="range"
              min="6"
              max="24"
              value={fps}
              onChange={(e) => setFps(+e.target.value)}
            />
          </label>
          <button onClick={() => setFrames([...frames, frames.length])}>
            <Plus size={16} /> Add keyframe
          </button>
        </div>
        <div className="frames">
          {frames.map((f, i) => (
            <button
              key={f}
              className={frame === i ? "active" : ""}
              onClick={() => {
                setPlaying(false);
                setFrame(i);
              }}
            >
              <Cartoon />
              <span>{String(i + 1).padStart(2, "0")}</span>
            </button>
          ))}
        </div>
        <label className="inline-label">
          Bounce amount
          <input
            type="range"
            min="0"
            max="65"
            aria-label="Bounce amount"
            value={bounce}
            onChange={(e) => setBounce(+e.target.value)}
          />
          {bounce}%
        </label>
      </div>
      <PreviewNote>
        Playback demonstrates a CSS bounce using a sample character. Editable drawn frames, AI
        motion, limb bending and animation exports are not connected.
      </PreviewNote>
    </>
  );
}
export function SceneWorkspace() {
  const [bg, setBg] = useLocal("heather-scene-bg", "Moonlit town");
  const [props, setProps] = useLocal("heather-scene-props", ["Street lamp"]);
  const [light, setLight] = useLocal("heather-scene-light", 75);
  const [guides, setGuides] = useState(false);
  return (
    <div className="lab-layout">
      <div
        className={`scene-stage ${bg === "Sunny meadow" ? "meadow" : ""} ${bg === "The old theater" ? "theater" : ""}`}
        style={{ filter: `brightness(${0.5 + light / 100})` }}
      >
        <div className="scene-moon" />
        <div className="scene-buildings">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} style={{ height: `${80 + (n % 3) * 40}px` }}>
              <i />
              <i />
              <i />
              <i />
            </div>
          ))}
        </div>
        {props.includes("Street lamp") && <div className="streetlamp" />}
        {props.includes("Wooden crate") && <div className="scene-crate">×</div>}
        {props.includes("Little cloud") && <div className="scene-cloud" />}
        <Cartoon />
        {guides && <div className="perspective-guides" />}
        <span className="stage-label">{bg} · scene concept</span>
      </div>
      <aside className="paper tool-panel">
        <h3>Set the scene</h3>
        <label>
          Background
          <select value={bg} onChange={(e) => setBg(e.target.value)}>
            {["Moonlit town", "Sunny meadow", "The old theater"].map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </label>
        <label>
          Lighting · {light}%
          <input
            type="range"
            min="10"
            max="100"
            aria-label="Lighting"
            value={light}
            onChange={(e) => setLight(+e.target.value)}
          />
        </label>
        <h4>Object layers</h4>
        {["Street lamp", "Wooden crate", "Little cloud"].map((p) => (
          <label className="checkbox-label" key={p}>
            <input
              type="checkbox"
              aria-label={p}
              checked={props.includes(p)}
              onChange={() =>
                setProps(props.includes(p) ? props.filter((v) => v !== p) : [...props, p])
              }
            />
            {p}
          </label>
        ))}
        <label className="checkbox-label">
          <input
            type="checkbox"
            aria-label="Perspective guides"
            checked={guides}
            onChange={() => setGuides(!guides)}
          />
          Perspective guides
        </label>
        <p className="muted">
          Scene settings save locally. Backgrounds and props are illustrative samples.
        </p>
      </aside>
    </div>
  );
}
export function VoiceWorkspace({ notify }: { notify: (s: string) => void }) {
  const [script, setScript] = useLocal(
    "heather-voice-script",
    "Milo: Just one little peek. What could possibly go wrong?\nRuby: Come on, Milo. The night is still young!",
  );
  const [voice, setVoice] = useState("Warm & curious");
  return (
    <div className="story-layout">
      <div className="paper padded">
        <span className="eyebrow">VOICE & DIALOGUE</span>
        <h2>Give your story a voice.</h2>
        <p className="muted">Write dialogue, explore a voice direction and prepare your script.</p>
        <label>
          Dialogue script
          <textarea
            aria-label="Dialogue script"
            rows={12}
            value={script}
            onChange={(e) => setScript(e.target.value)}
          />
        </label>
        <button
          className="button"
          onClick={() => {
            download("dialogue-script.txt", script, "text/plain");
            notify("Dialogue script exported");
          }}
        >
          <Download size={16} /> Export script
        </button>
      </div>
      <aside className="paper tool-panel">
        <Volume2 size={30} />
        <h3>Find their sound</h3>
        <label>
          Voice direction
          <select value={voice} onChange={(e) => setVoice(e.target.value)}>
            {["Warm & curious", "Cheerful & bouncy", "Low & mysterious", "Theatrical & witty"].map(
              (v) => (
                <option key={v}>{v}</option>
              ),
            )}
          </select>
        </label>
        <button className="button" disabled>
          <Play size={16} /> Voice playback · coming later
        </button>
        <PreviewNote>
          Voice generation and lip-sync are not connected. You can write, save and export your
          dialogue in this prototype.
        </PreviewNote>
      </aside>
    </div>
  );
}
export type Asset = { id: string; name: string; type: string; url: string; tags: string };
export function AssetWorkspace({ notify }: { notify: (s: string) => void }) {
  const [assets, setAssets] = useLocal<Asset[]>("heather-assets", []);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All assets");
  function upload(files: FileList | null) {
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (file.size > 2 * 1024 * 1024) {
        notify("Please choose files smaller than 2 MB for local storage.");
        return;
      }
      if (!file.type.startsWith("image/")) {
        notify("This prototype imports images only.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () =>
        setAssets((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            name: file.name,
            type: "Imported images",
            url: String(reader.result),
            tags: "imported",
          },
        ]);
      reader.readAsDataURL(file);
    });
  }
  return (
    <>
      <div className="workspace-toolbar">
        <div className="search-field">
          <Search size={17} />
          <input
            aria-label="Search assets"
            placeholder="Search names or tags…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <label className="button primary">
          <Upload size={16} /> Import images
          <input
            aria-label="Import images"
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => upload(e.target.files)}
          />
        </label>
      </div>
      <div className="tabs">
        {["All assets", "Characters", "Props", "Backgrounds", "Imported images"].map((t) => (
          <button key={t} className={filter === t ? "active" : ""} onClick={() => setFilter(t)}>
            {t}
          </button>
        ))}
      </div>
      <div className="asset-grid">
        {filter === "All assets" || filter === "Characters"
          ? ["cat", "rabbit", "flower"]
              .filter((k) => !search || k.includes(search.toLowerCase()))
              .map((k) => (
                <div className="paper asset-card" key={k}>
                  <div className="sage">
                    <Cartoon kind={k as "cat"} />
                  </div>
                  <h3>
                    {k === "cat" ? "Milo the Cat" : k === "rabbit" ? "Ruby Rabbit" : "Sunny Flower"}
                  </h3>
                  <span className="tag">Sample character</span>
                </div>
              ))
          : null}
        {assets
          .filter(
            (a) =>
              (filter === "All assets" || filter === a.type) &&
              `${a.name} ${a.tags}`.toLowerCase().includes(search.toLowerCase()),
          )
          .map((a) => (
            <div className="paper asset-card" key={a.id}>
              <img src={a.url} alt={a.name} />
              <input
                aria-label="Asset name"
                value={a.name}
                onChange={(e) =>
                  setAssets(assets.map((v) => (v.id === a.id ? { ...v, name: e.target.value } : v)))
                }
              />
              <input
                aria-label="Asset tags"
                value={a.tags}
                placeholder="Tags, separated by commas"
                onChange={(e) =>
                  setAssets(assets.map((v) => (v.id === a.id ? { ...v, tags: e.target.value } : v)))
                }
              />
              <select
                aria-label="Asset category"
                value={a.type}
                onChange={(e) =>
                  setAssets(assets.map((v) => (v.id === a.id ? { ...v, type: e.target.value } : v)))
                }
              >
                {["Imported images", "Characters", "Props", "Backgrounds"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
          ))}
      </div>
      {assets.length === 0 && (
        <div className="empty-note">
          <Upload size={24} />
          <h3>A home for all your little treasures.</h3>
          <p>
            Import images up to 2 MB. Assets stay in this browser — export a project backup to keep
            a copy.
          </p>
        </div>
      )}
    </>
  );
}
export function ProjectWorkspace({
  projects,
  onOpen,
  onNew,
  notify,
}: {
  projects: Project[];
  onOpen: (p: Project) => void;
  onNew: () => void;
  notify: (s: string) => void;
}) {
  const [search, setSearch] = useState("");
  return (
    <>
      <div className="workspace-toolbar">
        <div className="search-field">
          <Search size={17} />
          <input
            aria-label="Search projects"
            placeholder="Find a project…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div>
          <button
            className="button"
            onClick={() => {
              const backup: Record<string, unknown> = {};
              Object.keys(localStorage)
                .filter((k) => k.startsWith("heather-"))
                .forEach((k) => {
                  try {
                    backup[k] = JSON.parse(localStorage.getItem(k)!);
                  } catch {}
                });
              download("heathers-studio-backup.json", JSON.stringify(backup, null, 2));
              notify("Studio backup exported");
            }}
          >
            <Download size={16} /> Export studio backup
          </button>
          <button className="button primary" onClick={onNew}>
            <Plus size={16} /> New project
          </button>
        </div>
      </div>
      <div className="project-grid">
        {projects
          .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
          .map((p) => (
            <ProjectCard key={p.id} project={p} onClick={() => onOpen(p)} />
          ))}
      </div>
      <div className="empty-note">
        <Save size={24} />
        <h3>Your ideas have a home here.</h3>
        <p>
          This prototype saves to your browser, not the cloud. Export a studio backup to keep your
          work safe.
        </p>
      </div>
    </>
  );
}
export function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  return (
    <button className="project-card" onClick={onClick}>
      <div className={`project-art ${project.color}`}>
        {project.type === "Comic" ? (
          <div className="mini-comic">
            <div>
              <Cartoon />
            </div>
            <div>
              <Cartoon kind="rabbit" />
            </div>
            <span>AFTER HOURS</span>
          </div>
        ) : project.type === "Animation" ? (
          <>
            <div className="motion-lines" />
            <Cartoon dancing />
          </>
        ) : (
          <>
            <div className="art-ring" />
            <Cartoon kind={project.type === "Story" ? "rabbit" : "cat"} />
          </>
        )}
        <span className="project-type">{project.type}</span>
        <span className="open-project">
          <ArrowRight size={18} />
        </span>
      </div>
      <div className="project-info">
        <h3>{project.name}</h3>
        <span>{project.date}</span>
        <span className="project-dots">···</span>
      </div>
    </button>
  );
}

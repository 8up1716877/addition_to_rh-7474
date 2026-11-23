import { useRef, useState, useEffect } from "react";
import {
  Pencil,
  PenTool,
  Eraser,
  Undo2,
  Redo2,
  Download,
  Plus,
  Eye,
  EyeOff,
  Minus,
  MousePointer2,
  Square,
  Circle,
  Hand,
  PaintBucket,
} from "lucide-react";
import { useLocal } from "../hooks/use-local";
type Point = { x: number; y: number };
type Stroke = { points: Point[]; color: string; width: number; tool: string; layer: number };
export function Sketchpad({ notify }: { notify: (s: string) => void }) {
  const [strokes, setStrokes] = useLocal<Stroke[]>("heather-sketch", []);
  const [layers, setLayers] = useLocal("heather-layers", [
    { name: "Ink & details", visible: true },
    { name: "Rough sketch", visible: true },
  ]);
  const [layer, setLayer] = useState(0);
  const [tool, setTool] = useState("pencil");
  const [color, setColor] = useState("#292920");
  const [width, setWidth] = useState(4);
  const [zoom, setZoom] = useState(100);
  const [redo, setRedo] = useState<Stroke[]>([]);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const canvas = useRef<HTMLCanvasElement>(null);
  const current = useRef<Stroke | null>(null);
  const panStart = useRef<Point | null>(null);
  const [tick, setTick] = useState(0);
  function paint(ctx: CanvasRenderingContext2D, s: Stroke) {
    if (!s.points.length) return;
    ctx.strokeStyle = s.color;
    ctx.fillStyle = s.color;
    ctx.lineWidth = s.width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalCompositeOperation = s.tool === "eraser" ? "destination-out" : "source-over";
    const a = s.points[0]!,
      b = s.points.at(-1)!;
    ctx.beginPath();
    if (s.tool === "rectangle") ctx.rect(a.x, a.y, b.x - a.x, b.y - a.y);
    else if (s.tool === "circle")
      ctx.ellipse(
        (a.x + b.x) / 2,
        (a.y + b.y) / 2,
        Math.abs(b.x - a.x) / 2,
        Math.abs(b.y - a.y) / 2,
        0,
        0,
        Math.PI * 2,
      );
    else if (s.tool === "fill") {
      ctx.fillRect(0, 0, 1200, 800);
      return;
    } else {
      ctx.moveTo(a.x, a.y);
      s.points.forEach((p) => ctx.lineTo(p.x, p.y));
      if (s.points.length === 1) ctx.lineTo(a.x + 0.1, a.y + 0.1);
    }
    ctx.stroke();
  }
  useEffect(() => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, 1200, 800);
    [...layers].reverse().forEach((_, reverse) => {
      const i = layers.length - 1 - reverse;
      if (layers[i]?.visible) {
        strokes.filter((s) => s.layer === i).forEach((s) => paint(ctx, s));
        if (current.current?.layer === i) paint(ctx, current.current);
      }
    });
    ctx.globalCompositeOperation = "source-over";
  }, [strokes, layers, tick]);
  function point(e: React.PointerEvent) {
    const r = canvas.current!.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) * 1200) / r.width,
      y: ((e.clientY - r.top) * 800) / r.height,
    };
  }
  return (
    <div className="sketch-layout">
      <div className="drawing-area">
        <div className="canvas-top">
          <span>
            <span className="status-dot" /> Sketchbook No. 01
          </span>
          <span>Saved in this browser</span>
          <button
            onClick={() => {
              const output = document.createElement("canvas");
              output.width = 1200;
              output.height = 800;
              const ctx = output.getContext("2d")!;
              ctx.fillStyle = "#fffdf8";
              ctx.fillRect(0, 0, 1200, 800);
              ctx.drawImage(canvas.current!, 0, 0);
              const a = document.createElement("a");
              a.download = "heather-sketch.png";
              a.href = output.toDataURL();
              a.click();
              notify("Sketch exported as PNG");
            }}
          >
            <Download size={15} /> Export PNG
          </button>
        </div>
        <div className="drawing-tools">
          {[
            { id: "pencil", Icon: Pencil },
            { id: "ink", Icon: PenTool },
            { id: "eraser", Icon: Eraser },
            { id: "rectangle", Icon: Square },
            { id: "circle", Icon: Circle },
            { id: "fill", Icon: PaintBucket },
            { id: "pan", Icon: Hand },
          ].map(({ id, Icon }) => (
            <button
              title={id === "fill" ? "Fill entire canvas" : id}
              aria-label={id}
              className={tool === id ? "selected" : ""}
              key={id}
              onClick={() => setTool(id)}
            >
              <Icon size={20} />
            </button>
          ))}
          <span />
          <button
            aria-label="Undo"
            onClick={() => {
              const last = strokes.at(-1);
              if (last) {
                setRedo([...redo, last]);
                setStrokes(strokes.slice(0, -1));
              }
            }}
          >
            <Undo2 size={20} />
          </button>
          <button
            aria-label="Redo"
            onClick={() => {
              const last = redo.at(-1);
              if (last) {
                setStrokes([...strokes, last]);
                setRedo(redo.slice(0, -1));
              }
            }}
          >
            <Redo2 size={20} />
          </button>
        </div>
        <div className="canvas-viewport">
          <canvas
 aria-label="Drawing canvas"
            ref={canvas}
            width={1200}
            height={800}
            style={{
              width: `${zoom}%`,
              transform: `translate(${pan.x}px,${pan.y}px)`,
              cursor: tool === "pan" ? "grab" : "crosshair",
            }}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              if (tool === "pan") {
                panStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
                return;
              }
              current.current = {
                points: [point(e)],
                color,
                width: tool === "ink" ? width * 1.5 : tool === "eraser" ? width * 5 : width,
                tool,
                layer,
              };
              setTick((t) => t + 1);
            }}
            onPointerMove={(e) => {
              if (panStart.current) {
                setPan({ x: e.clientX - panStart.current.x, y: e.clientY - panStart.current.y });
                return;
              }
              if (current.current) {
                current.current.points.push(point(e));
                setTick((t) => t + 1);
              }
            }}
            onPointerUp={() => {
              if (current.current) {
                setStrokes([...strokes, current.current]);
                current.current = null;
                setRedo([]);
              }
              panStart.current = null;
            }}
            onPointerCancel={() => {
              current.current = null;
              panStart.current = null;
              setTick((t) => t + 1);
            }}
          />
          {strokes.length === 0 && (
            <div className="canvas-hint">
              <Pencil size={28} />
              <p>A little line. A big possibility.</p>
              <span>Pick a brush and make your first mark.</span>
            </div>
          )}
        </div>
        <div className="canvas-bottom">
          <span>
            <MousePointer2 size={14} />{" "}
            {tool === "fill" ? "Fill paints the whole canvas" : `Drawing on ${layers[layer]?.name}`}
          </span>
          <div>
            <button aria-label="Zoom out" onClick={() => setZoom(Math.max(25, zoom - 25))}>
              <Minus size={16} />
            </button>
            {zoom}%
            <button aria-label="Zoom in" onClick={() => setZoom(Math.min(250, zoom + 25))}>
              <Plus size={16} />
            </button>
            <button
              onClick={() => {
                setZoom(100);
                setPan({ x: 0, y: 0 });
              }}
            >
              Reset view
            </button>
          </div>
        </div>
      </div>
      <aside className="paper tool-panel">
        <h3>Make your mark</h3>
        <label>
          Brush size <b>{width}px</b>
          <input
            aria-label="Brush size" type="range"
            min="1"
            max="30"
            value={width}
            onChange={(e) => setWidth(+e.target.value)}
          />
        </label>
        <label>
          Ink color
          <input aria-label="Ink color" type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        </label>
        <div className="swatches">
          {["#292920", "#ca795c", "#edbd55", "#7e9279", "#819bb5", "#ffffff"].map((c) => (
            <button
              aria-label={`Use ${c}`}
              style={{ background: c }}
              key={c}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
        <hr />
        <div className="section-heading">
          <h3>Layers</h3>
          <button
            aria-label="Add layer"
            onClick={() => {
              setLayers([...layers, { name: `Layer ${layers.length + 1}`, visible: true }]);
              setLayer(layers.length);
            }}
          >
            <Plus size={17} />
          </button>
        </div>
        {layers.map((l, i) => (
          <div className={`layer-row ${layer === i ? "active" : ""}`} key={i}>
            <button onClick={() => setLayer(i)}>{l.name}</button>
            <button
              aria-label={`Toggle ${l.name}`}
              onClick={() =>
                setLayers(layers.map((v, j) => (j === i ? { ...v, visible: !v.visible } : v)))
              }
            >
              {l.visible ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>
        ))}
        <div className="preview-note">
          <b>A helping hand</b>
          <p>AI sketch feedback and reference generation are planned for the connected studio.</p>
          <span className="tag">AI preview · not connected</span>
        </div>
      </aside>
    </div>
  );
}

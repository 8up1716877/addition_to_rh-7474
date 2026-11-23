export const colorPalettes = [
  {
    id: "classic",
    name: "Classic",
    colors: [
      { name: "Ink", hex: "#292920" },
      { name: "Paper", hex: "#FFFDF8" },
      { name: "Gold", hex: "#EDBD55" },
      { name: "Terracotta", hex: "#CA795C" },
      { name: "Sage", hex: "#7E9279" },
      { name: "Blue", hex: "#819BB5" },
      { name: "Deep red", hex: "#8F4540" },
      { name: "White", hex: "#FFFFFF" },
    ],
  },
  {
    id: "neutral",
    name: "Neutral",
    colors: [
      { name: "Ivory", hex: "#F6F1E7" },
      { name: "Oat", hex: "#E5DCCB" },
      { name: "Sand", hex: "#D2BFA5" },
      { name: "Taupe", hex: "#ADA08F" },
      { name: "Stone", hex: "#8E8B83" },
      { name: "Cocoa", hex: "#806A58" },
      { name: "Slate", hex: "#61676B" },
      { name: "Charcoal", hex: "#373A36" },
    ],
  },
  {
    id: "pastel",
    name: "Pastel",
    colors: [
      { name: "Blush", hex: "#F2C6CE" },
      { name: "Peach", hex: "#F5D0B5" },
      { name: "Butter", hex: "#F5E6AC" },
      { name: "Mint", hex: "#C5E2D1" },
      { name: "Sky", hex: "#C6DEF1" },
      { name: "Lilac", hex: "#D8C9EE" },
      { name: "Rose", hex: "#E8BED9" },
      { name: "Seafoam", hex: "#BDDEDD" },
    ],
  },
];

export function ColorPalettes({
  paletteId,
  onPaletteChange,
  color,
  onColorChange,
}: {
  paletteId: string;
  onPaletteChange: (id: string) => void;
  color: string;
  onColorChange: (hex: string) => void;
}) {
  const palette = colorPalettes.find((p) => p.id === paletteId) || colorPalettes[0]!;
  const selected = palette.colors.find((c) => c.hex.toLowerCase() === color.toLowerCase());
  return (
    <section className="color-palettes" aria-label="Color palettes">
      <div className="palette-tabs" aria-label="Choose a color palette">
        {colorPalettes.map((p) => (
          <button
            type="button"
            key={p.id}
            aria-pressed={palette.id === p.id}
            className={palette.id === p.id ? "active" : ""}
            onClick={() => onPaletteChange(p.id)}
          >
            {p.name}
          </button>
        ))}
      </div>
      <div className="palette-swatches">
        {palette.colors.map((c) => (
          <button
            type="button"
            key={c.hex}
            aria-label={`${c.name} ${c.hex}`}
            title={`${c.name} · ${c.hex}`}
            aria-pressed={color.toLowerCase() === c.hex.toLowerCase()}
            className={color.toLowerCase() === c.hex.toLowerCase() ? "active" : ""}
            style={{ backgroundColor: c.hex }}
            onClick={() => onColorChange(c.hex)}
          />
        ))}
      </div>
      <div className="palette-color-label">
        <span>{selected?.name || "Custom color"}</span>
        <code>{color.toUpperCase()}</code>
      </div>
    </section>
  );
}

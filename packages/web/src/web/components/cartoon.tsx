type Props = { kind?: "cat" | "rabbit" | "flower"; className?: string; dancing?: boolean };
export function Cartoon({ kind = "cat", className = "", dancing = false }: Props) {
  return (
    <svg
      viewBox="0 0 260 280"
      className={`cartoon ${className} ${dancing ? "dancing" : ""}`}
      aria-label={`Vintage ${kind} cartoon`}
    >
      <g stroke="#292920" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="130" cy="260" rx="71" ry="8" fill="#292920" opacity=".12" stroke="none" />
        <path d="M111 197 Q106 226 91 244 M144 197 Q146 222 165 244" fill="none" strokeWidth="13" />
        <path
          d="M88 237 Q64 233 63 246 Q62 260 104 252 L109 239Z M156 239 Q182 231 194 247 Q199 260 158 253 L151 242Z"
          fill="#fffdf6"
        />
        <path d="M94 154 Q66 159 54 133 M161 154 Q180 162 198 133" fill="none" strokeWidth="12" />
        <path
          d="M53 140 Q37 133 40 120 Q42 112 49 120 Q40 99 48 97 Q53 97 61 117 Q61 99 67 103 Q75 112 69 127 Q67 137 53 140Z M197 140 Q218 135 217 122 Q215 114 208 120 Q218 100 210 98 Q204 98 198 116 Q195 101 190 106 Q184 115 188 128Z"
          fill="#fffdf6"
        />
        <path d="M98 140 Q90 166 100 201 Q128 215 156 201 Q166 167 154 142Z" fill="#292920" />
        <path
          d="M99 181 Q127 190 157 182 L156 202 Q129 213 100 200Z"
          fill={kind === "rabbit" ? "#ca795c" : "#edbd55"}
        />
        <circle cx="119" cy="194" r="3" fill="#fffdf6" stroke="none" />
        <circle cx="139" cy="194" r="3" fill="#fffdf6" stroke="none" />
        {kind === "cat" ? (
          <>
            <path d="M86 81 L82 29 L115 52 M143 51 L177 29 L172 87" fill="#292920" />
            <path
              d="M88 62 L88 41 L102 58 M156 58 L171 41 L167 64"
              fill="#ca795c"
              strokeWidth="2"
            />
          </>
        ) : kind === "rabbit" ? (
          <>
            <path
              d="M103 66 Q64 -7 87 6 Q120 19 123 61 M138 63 Q139 -1 158 7 Q179 24 158 77"
              fill="#fffdf6"
            />
            <path d="M101 45 Q81 8 89 16 M151 49 Q159 13 155 18" stroke="#ca795c" strokeWidth="8" />
          </>
        ) : (
          <g fill="#edbd55">
            {[0, 60, 120, 180, 240, 300].map((a) => (
              <ellipse key={a} cx="130" cy="48" rx="23" ry="34" transform={`rotate(${a} 130 92)`} />
            ))}
          </g>
        )}
        <ellipse cx="130" cy="100" rx="51" ry="49" fill={kind === "cat" ? "#292920" : "#fffdf6"} />
        <path
          d="M91 102 Q95 63 114 72 Q126 76 129 105 Q132 69 149 73 Q168 77 169 106 Q184 142 130 147 Q78 142 91 102Z"
          fill="#fffdf6"
          strokeWidth="3"
        />
        <ellipse cx="112" cy="97" rx="10" ry="18" fill="#292920" stroke="none" />
        <ellipse cx="146" cy="97" rx="10" ry="18" fill="#292920" stroke="none" />
        <path d="M106 81 L115 87 L106 90 M140 81 L149 87 L140 90" fill="#fffdf6" stroke="none" />
        <ellipse cx="129" cy="115" rx="12" ry="8" fill="#292920" />
        <path d="M108 125 Q129 148 153 124" fill="none" strokeWidth="3" />
        <path d="M121 134 Q130 132 140 135" stroke="#ca795c" strokeWidth="4" />
        {kind === "cat" && (
          <>
            <path
              d="M90 115 L71 111 M90 123 L70 127 M169 115 L190 110 M169 123 L190 128"
              strokeWidth="2"
            />
          </>
        )}
      </g>
    </svg>
  );
}
export function Spark({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="30" height="38" viewBox="0 0 30 38" fill="none">
      <path d="M15 0 Q16 18 30 19 Q16 20 15 38 Q14 20 0 19 Q14 18 15 0Z" fill="currentColor" />
    </svg>
  );
}

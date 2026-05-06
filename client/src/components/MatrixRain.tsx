import { useEffect, useRef } from "react";

const CODE_CHARS = [
  "const", "let", "var", "function", "return", "if", "else", "for", "while",
  "class", "import", "export", "async", "await", "try", "catch", "new",
  "this", "null", "true", "false", "=>", "===", "!==", "&&", "||",
  "{", "}", "(", ")", "[", "]", ";", ":", ".",
  "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
  "a", "b", "c", "d", "e", "f", "A", "B", "C", "D", "E", "F",
  "0x", "ff", "00", "parseInt", "map", "filter", "reduce",
  "useState", "useEffect", "onClick", "render", "setState",
  "console.log", "fetch", "then", "catch", "Promise",
  "query", "mutation", "schema", "model", "type", "interface",
  "npm", "git", "push", "pull", "merge", "deploy",
  "<div>", "</div>", "<span>", "className",
  "SELECT", "FROM", "WHERE", "INSERT", "UPDATE", "DELETE",
  "http://", "https://", "localhost", "3000", "API",
  "token", "auth", "hash", "encrypt", "decode",
  "pixel", "render", "buffer", "socket", "stream",
];

const COLORS = [
  "#ff1e1e",   // red
  "#ff4444",   // light red
  "#ff6b35",   // orange-red
  "#c89632",   // gold
  "#daa520",   // dark gold
  "#f59e0b",   // amber
  "#e8a030",   // warm amber
  "#ff3030",   // bright red
  "#cc2020",   // dark red
  "#b8860b",   // dark goldenrod
];

interface Column {
  x: number;
  y: number;
  speed: number;
  chars: string[];
  color: string;
  opacity: number;
  fontSize: number;
}

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let columns: Column[] = [];

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
      initColumns();
    }

    function initColumns() {
      columns = [];
      const colCount = Math.floor(canvas!.width / 18);
      for (let i = 0; i < colCount; i++) {
        columns.push(createColumn(i * 18, true));
      }
    }

    function createColumn(x: number, randomY: boolean): Column {
      const charCount = 3 + Math.floor(Math.random() * 8);
      const chars: string[] = [];
      for (let j = 0; j < charCount; j++) {
        chars.push(CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]);
      }
      return {
        x,
        y: randomY ? -Math.random() * canvas!.height * 2 : -Math.random() * 200,
        speed: 0.3 + Math.random() * 1.2,
        chars,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        opacity: 0.06 + Math.random() * 0.18,
        fontSize: 10 + Math.floor(Math.random() * 4),
      };
    }

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      for (const col of columns) {
        ctx!.font = `${col.fontSize}px "Courier New", monospace`;

        for (let i = 0; i < col.chars.length; i++) {
          const charY = col.y + i * (col.fontSize + 4);

          if (charY < -50 || charY > canvas!.height + 50) continue;

          const fadeRatio = i / col.chars.length;
          const charOpacity = col.opacity * (1 - fadeRatio * 0.6);

          if (i === 0) {
            ctx!.globalAlpha = Math.min(charOpacity * 2.5, 0.5);
            ctx!.fillStyle = "#fff";
          } else {
            ctx!.globalAlpha = charOpacity;
            ctx!.fillStyle = col.color;
          }

          ctx!.fillText(col.chars[i], col.x, charY);
        }

        col.y += col.speed;

        if (col.y > canvas!.height + 100) {
          Object.assign(col, createColumn(col.x, false));
        }
      }

      ctx!.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}

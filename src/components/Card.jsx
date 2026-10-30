// A .card that tracks the pointer so the CSS spotlight can follow it.
function onPointerMove(event) {
  if (!window.matchMedia("(hover: hover)").matches) return;
  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();
  card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
  card.style.setProperty("--my", `${event.clientY - rect.top}px`);
}

export default function Card({ as: Tag = "article", className = "", children, ...props }) {
  return (
    <Tag className={`card ${className}`.trim()} onPointerMove={onPointerMove} {...props}>
      {children}
    </Tag>
  );
}

import { useRef, useState } from 'react';

export default function SpotlightCard({ children, style, className, glowColor = 'rgba(99,102,241,0.12)', ...rest }) {
  const cardRef = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0, visible: false });

  function onMouseMove(e) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top, visible: true });
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={() => setPos(p => ({ ...p, visible: false }))}
      className={className}
      style={{ position: 'relative', overflow: 'hidden', ...style }}
      {...rest}
    >
      {pos.visible && (
        <div
          style={{
            position: 'absolute',
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
            left: pos.x - 160,
            top:  pos.y - 160,
            pointerEvents: 'none',
            zIndex: 0,
            transition: 'opacity .2s',
          }}
        />
      )}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}

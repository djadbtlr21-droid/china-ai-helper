export default function Lantern({ size = 80 }) {
  return (
    <div style={{
      display: 'inline-block',
      animation: 'swing 2.5s ease-in-out infinite',
      filter: 'drop-shadow(0 0 20px rgba(196,30,58,0.6))',
      animationName: 'swing'
    }}>
      <div style={{
        width: size * 0.75, height: size,
        borderRadius: '50%',
        background: 'radial-gradient(ellipse at 35% 30%, #FF8888, #C41E3A, #6B0000)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 30px rgba(196,30,58,0.6), inset 0 0 20px rgba(0,0,0,0.3)',
        position: 'relative'
      }}>
        <span style={{
          fontFamily: 'Noto Serif KR, serif',
          color: 'rgba(255,220,80,0.95)',
          fontSize: size * 0.35,
          fontWeight: 700
        }}>福</span>
      </div>
    </div>
  );
}

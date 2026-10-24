import { ImageResponse } from 'next/og';

export const alt = 'TopImkon — Imkoniyatlar to‘p. O‘zingnikini top.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 84, background: '#f7f9fb', color: '#10233f' }}>
        <div style={{ display: 'flex', fontSize: 34, fontWeight: 700, color: '#16a36a' }}>TOPIMKON</div>
        <div style={{ marginTop: 26, fontSize: 70, fontWeight: 800, lineHeight: 1.1 }}>Imkoniyatlar to‘p.</div>
        <div style={{ fontSize: 70, fontWeight: 800, lineHeight: 1.1, color: '#16a36a' }}>O‘zingnikini top.</div>
        <div style={{ marginTop: 32, fontSize: 28, color: '#566579' }}>Grant · Stipendiya · Stajirovka · Kurs · Konkurs</div>
      </div>
    ),
    { ...size },
  );
}

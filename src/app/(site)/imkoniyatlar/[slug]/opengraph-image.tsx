import { ImageResponse } from 'next/og';
import { getBySlug } from '@/lib/opportunities';

export const alt = 'TopImkon imkoniyati';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

type Props = { params: { slug: string } };

export default async function OpportunityOpenGraphImage({ params }: Props) {
  const item = await getBySlug(params.slug);
  const title = item?.title || 'TopImkon imkoniyati';
  const org = item?.org || 'Grant · Stipendiya · Stajirovka';
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 76, background: '#f7f9fb', color: '#10233f' }}>
        <div style={{ display: 'flex', fontSize: 30, fontWeight: 700, color: '#16a36a' }}>TOPIMKON</div>
        <div style={{ display: 'flex', marginTop: 32, fontSize: 58, fontWeight: 800, lineHeight: 1.14, overflow: 'hidden' }}>{title.slice(0, 110)}</div>
        <div style={{ display: 'flex', marginTop: 24, fontSize: 28, color: '#566579' }}>{org.slice(0, 100)}</div>
        <div style={{ display: 'flex', marginTop: 38, fontSize: 23, color: '#0f744c' }}>Rasmiy manba va deadline — TopImkon’da</div>
      </div>
    ),
    { ...size },
  );
}

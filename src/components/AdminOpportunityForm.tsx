import { saveOpportunity } from '@/app/actions/admin';
import type { Opportunity } from '@/lib/types';

type Translation = { locale: string; title: string; summary: string; description: string };
type Props = {
  item?: Opportunity | null;
  fields?: string[];
  degrees?: string[];
  translations?: Translation[];
  error?: string;
};

const inputClass = 'mt-1 w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20';
const labelClass = 'block text-sm font-semibold text-ink';

export function AdminOpportunityForm({ item, fields = [], degrees = [], translations = [], error }: Props) {
  const ru = translations.find((x) => x.locale === 'ru');
  const en = translations.find((x) => x.locale === 'en');
  return (
    <form action={saveOpportunity} className="space-y-6">
      {item && <input type="hidden" name="id" value={item.id} />}
      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      <section className="card space-y-4 p-5">
        <h2 className="text-lg font-bold">Asosiy ma’lumotlar (o‘zbekcha)</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelClass}>Slug <input className={inputClass} name="slug" required pattern="[a-z0-9]+(-[a-z0-9]+)*" defaultValue={item?.slug} /></label>
          <label className={labelClass}>Tashkilot <input className={inputClass} name="org" required maxLength={180} defaultValue={item?.org} /></label>
          <label className={labelClass}>Sarlavha <input className={inputClass} name="title" required maxLength={180} defaultValue={item?.title} /></label>
          <label className={labelClass}>Davlat / hudud <input className={inputClass} name="country" required defaultValue={item?.country} /></label>
          <label className={labelClass}>Tur
            <select className={inputClass} name="type" defaultValue={item?.type ?? 'scholarship'}>{[['scholarship','Stipendiya'],['grant','Grant'],['internship','Stajirovka'],['course','Kurs'],['exchange','Almashinuv'],['competition','Konkurs']].map(([v,l])=><option key={v} value={v}>{l}</option>)}</select>
          </label>
          <label className={labelClass}>Format
            <select className={inputClass} name="format" defaultValue={item?.format ?? 'online'}>{[['onsite','Joyida'],['online','Onlayn'],['hybrid','Aralash']].map(([v,l])=><option key={v} value={v}>{l}</option>)}</select>
          </label>
          <label className={labelClass}>Moliyalashtirish
            <select className={inputClass} name="funding" defaultValue={item?.funding ?? 'full'}>{[['full','To‘liq'],['partial','Qisman'],['paid','Haq to‘lanadi'],['none','Yo‘q']].map(([v,l])=><option key={v} value={v}>{l}</option>)}</select>
          </label>
          <label className={labelClass}>Talab qilinadigan til <input className={inputClass} name="language" required defaultValue={item?.language ?? 'en'} placeholder="en, uz, ru" /></label>
          <label className={labelClass}>Til darajasi
            <select className={inputClass} name="level" defaultValue={item?.level ?? 'none'}>{['none','A2','B1','B2','C1','C2'].map((x)=><option key={x}>{x}</option>)}</select>
          </label>
          <label className={labelClass}>Ariza to‘lovi (USD) <input className={inputClass} name="fee" type="number" min="0" step="0.01" required defaultValue={item?.fee ?? 0} /></label>
          <label className={labelClass}>Deadline (bo‘sh = doimiy) <input className={inputClass} name="deadline" type="date" defaultValue={item?.deadline ?? ''} /></label>
          <label className={labelClass}>Holat
            <select className={inputClass} name="status" defaultValue={item?.status ?? 'draft'}>{[['draft','Qoralama'],['published','Ochiq'],['archived','Arxivlangan']].map(([v,l])=><option key={v} value={v}>{l}</option>)}</select>
          </label>
        </div>
        <label className={labelClass}>Qisqa mazmun <textarea className={inputClass} name="summary" required rows={3} maxLength={500} defaultValue={item?.summary} /></label>
        <label className={labelClass}>To‘liq tavsif <textarea className={inputClass} name="description" rows={5} defaultValue={item?.description} /></label>
        <label className={labelClass}>Kimlar topshira oladi? <textarea className={inputClass} name="eligibility" rows={4} defaultValue={item?.eligibility} /></label>
        <label className={labelClass}>Qanday topshiriladi? <textarea className={inputClass} name="how_to_apply" rows={4} defaultValue={item?.how_to_apply} /></label>
        <label className={labelClass}>Rasmiy manba URL <input className={inputClass} name="source_url" type="url" required defaultValue={item?.source_url} /></label>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="featured" defaultChecked={item?.featured ?? false} /> Tavsiya etilgan</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="for_uzbekistan" defaultChecked={item?.for_uzbekistan ?? false} /> O‘zbekistonliklar uchun</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="is_sample" defaultChecked={item?.is_sample ?? false} /> Namuna yozuv</label>
        </div>
      </section>
      <section className="card space-y-4 p-5">
        <h2 className="text-lg font-bold">Moslik mezonlari</h2>
        <p className="text-sm text-muted">Kodlarni vergul bilan ajrating. Darajalar: bachelor, master, phd. Sohalar uchun loyihadagi mavjud field kodlaridan foydalaning.</p>
        <label className={labelClass}>Soha kodlari <input className={inputClass} name="fields" defaultValue={fields.join(', ')} placeholder="technology, business" /></label>
        <label className={labelClass}>Darajalar <input className={inputClass} name="degrees" defaultValue={degrees.join(', ')} placeholder="bachelor, master" /></label>
      </section>
      <section className="card space-y-4 p-5">
        <h2 className="text-lg font-bold">Tarjimalar</h2>
        <p className="text-sm text-muted">Tarjima sarlavhasi yoki qisqa mazmuni kiritilmasa, o‘zbekcha matn vaqtinchalik ishlatiladi.</p>
        <h3 className="font-semibold">Русский</h3>
        <label className={labelClass}>Заголовок <input className={inputClass} name="ru_title" defaultValue={ru?.title} /></label>
        <label className={labelClass}>Краткое описание <textarea className={inputClass} name="ru_summary" rows={2} defaultValue={ru?.summary} /></label>
        <label className={labelClass}>Описание <textarea className={inputClass} name="ru_description" rows={3} defaultValue={ru?.description} /></label>
        <h3 className="font-semibold">English</h3>
        <label className={labelClass}>Title <input className={inputClass} name="en_title" defaultValue={en?.title} /></label>
        <label className={labelClass}>Summary <textarea className={inputClass} name="en_summary" rows={2} defaultValue={en?.summary} /></label>
        <label className={labelClass}>Description <textarea className={inputClass} name="en_description" rows={3} defaultValue={en?.description} /></label>
      </section>
      <button className="btn-primary" type="submit">{item ? 'O‘zgarishlarni saqlash' : 'Imkoniyat yaratish'}</button>
    </form>
  );
}

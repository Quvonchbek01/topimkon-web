// Oddiy GET forma: JavaScript'siz ham ishlaydi, natija URL'da (?q=...) turadi.
export function SearchBar({ defaultValue = '' }: { defaultValue?: string }) {
  return (
    <form action="/imkoniyatlar" role="search" className="flex gap-2">
      <label htmlFor="q" className="sr-only">Imkoniyat qidirish</label>
      <input
        id="q"
        name="q"
        type="search"
        defaultValue={defaultValue}
        maxLength={80}
        placeholder="Stipendiya, stajirovka, davlat yoki tashkilot..."
        className="input"
      />
      <button type="submit" className="btn-primary shrink-0">Qidirish</button>
    </form>
  );
}

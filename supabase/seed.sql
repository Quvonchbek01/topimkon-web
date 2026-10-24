-- =====================================================================
-- TopImkon — seed.sql  (schema.sql'dan KEYIN ishga tushiring)
--
-- !!! MUHIM OGOHLANTIRISH !!!
-- 1) Deadline'lar HAQIQIY EMAS. Ular "bugundan N kun keyin" deb yozilgan,
--    shunda sayt sinov paytida hech qachon "muddati o‘tgan" bo‘lib qolmaydi.
--    Haqiqiy sanalarni admin panelda (5-bosqich) rasmiy saytdan tekshirib kiriting.
-- 2) is_sample = true bo‘lgan yozuvlar NAMUNA: ular uydirma/umumlashtirilgan.
--    Ularning havolasi haqiqiy tashkilotning bosh sahifasi yoki example.org.
--    Sayt ularni "Namuna" deb belgilashi kerak (2-bosqichda qilinadi).
-- 3) is_sample = false bo‘lganlar haqiqiy dasturlar, lekin matnlar qisqa va umumiy.
--    last_verified_at = NULL: hali birortasi qo‘lda tekshirilmagan.
--    Moliyalash turi, til darajasi va havolalarni rasmiy saytdan tekshiring.
-- =====================================================================

insert into public.opportunities
  (slug, title, org, country, type, format, funding, language, level, fee, deadline,
   summary, description, eligibility, how_to_apply, source_url,
   for_uzbekistan, is_sample, featured, status)
values
-- ---------- Prototipdagi 6 ta (sanalari yangilandi) ----------
('erasmus-mundus-joint-masters', 'Erasmus Mundus qo‘shma magistratura dasturlari', 'Yevropa Komissiyasi',
 'Yevropa (bir nechta davlat)', 'scholarship', 'onsite', 'full', 'en', 'B2', 0, current_date + 75,
 'Yevropaning bir nechta universitetida o‘qiladigan, to‘liq moliyalashtiriladigan magistratura dasturlari.',
 'Talaba bir necha Yevropa davlatida o‘qib, qo‘shma diplom oladi. Har dastur o‘z arizasini qabul qiladi.',
 'Bakalavr darajasi, ingliz tili bilimi. Aniq shartlar har bir dastur sahifasida.',
 'Dasturni tanlang, o‘sha dasturning rasmiy sahifasidagi ko‘rsatma bo‘yicha onlayn ariza topshiring.',
 'https://erasmus-plus.ec.europa.eu', true, false, true, 'published'),

('mit-research-internship-namuna', 'MIT tadqiqot stajirovkasi (namuna)', 'MIT',
 'AQSH', 'internship', 'onsite', 'paid', 'en', 'B2', 0, current_date + 29,
 'Universitet talabalari uchun tadqiqot stajirovkasi imkoniyati. NAMUNA yozuv.',
 'Bu yozuv prototipdan olingan namuna. Haqiqiy dastur nomi va shartlari rasmiy saytda.',
 'Namuna: bakalavr yoki magistratura talabasi, ingliz tili B2.',
 'Rasmiy saytdagi ko‘rsatmani o‘qing.',
 'https://www.mit.edu', true, true, true, 'published'),

('turkiye-burslari', 'Türkiye Burslari (Turkiya hukumati stipendiyasi)', 'Türkiye Burslari',
 'Turkiya', 'scholarship', 'onsite', 'full', 'en', 'B1', 0, current_date + 121,
 'Xorijiy talabalar uchun Turkiya hukumatining to‘liq moliyalashtiriladigan stipendiyasi.',
 'Bakalavr, magistratura va doktorantura uchun. Turk tili kursi ham dasturga kirishi mumkin.',
 'O‘zbekiston fuqarolari ariza topshira oladi. Yosh va o‘rtacha ball talablari bor.',
 'Rasmiy portalda hisob oching va onlayn ariza to‘ldiring.',
 'https://turkiyeburslari.gov.tr', true, false, true, 'published'),

('google-student-swe-internship-namuna', 'Google talabalar dasturiy ta‘minot stajirovkasi (namuna)', 'Google',
 'AQSH', 'internship', 'onsite', 'paid', 'en', 'B2', 0, current_date + 54,
 'Talabalar uchun dasturiy ta‘minot muhandisligi stajirovkasi. NAMUNA yozuv.',
 'Prototipdan olingan namuna. Haqiqiy shartlar va muddatlar Google karyera sahifasida.',
 'Namuna: dasturlash bo‘yicha asosiy bilim, ingliz tili B2.',
 'Google karyera sahifasi orqali ariza topshiriladi.',
 'https://careers.google.com', false, true, false, 'published'),

('young-leaders-programme-namuna', 'Yosh yetakchilar dasturi (namuna)', 'Youth Leadership Network (namuna)',
 'Germaniya', 'grant', 'onsite', 'partial', 'en', 'B1', 0, current_date + 19,
 'Yosh mutaxassislar uchun yetakchilikni rivojlantirish dasturi. UYDIRMA namuna yozuv.',
 'Bu tashkilot va dastur prototipdagi namuna; haqiqiy dastur emas.',
 'Namuna: bakalavr yoki magistratura, ingliz tili B1.',
 'Namuna: havola mavjud emas.',
 'https://example.org/namuna', false, true, false, 'published'),

('digital-economy-short-course-namuna', 'Raqamli iqtisodiyot qisqa kursi (namuna)', 'International Digital Academy (namuna)',
 'Turkiya', 'course', 'online', 'partial', 'en', 'B1', 0, current_date + 6,
 'Raqamli iqtisodiyotga amaliy yondashuvli onlayn qisqa kurs. UYDIRMA namuna yozuv.',
 'Bu kurs prototipdagi namuna; haqiqiy emas.',
 'Namuna: iqtisodiyot yoki texnologiya yo‘nalishi talabalari.',
 'Namuna: havola mavjud emas.',
 'https://example.org/namuna', true, true, false, 'published'),

-- ---------- Yangi 8 ta ----------
('chevening-scholarships', 'Chevening stipendiyasi', 'Buyuk Britaniya hukumati (Chevening)',
 'Buyuk Britaniya', 'scholarship', 'onsite', 'full', 'en', 'B2', 0, current_date + 45,
 'Buyuk Britaniyada bir yillik magistratura uchun hukumat stipendiyasi.',
 'Yetakchilik salohiyatiga ega mutaxassislar uchun. Rasmiy sayt o‘zbek fuqarolari uchun ham ochiq.',
 'Bakalavr darajasi va belgilangan ish tajribasi talab etiladi. Aniq muddat va shartlar rasmiy saytda.',
 'Rasmiy saytda onlayn ariza to‘ldiring.',
 'https://www.chevening.org', true, false, true, 'published'),

('daad-scholarships', 'DAAD stipendiyalari (Germaniya)', 'DAAD',
 'Germaniya', 'scholarship', 'onsite', 'full', 'en', 'B2', 0, current_date + 30,
 'Germaniyada magistratura va doktorantura uchun DAAD stipendiya dasturlari.',
 'DAAD turli dasturlar taklif qiladi; har birining talablari alohida.',
 'Dasturga qarab farq qiladi. Rasmiy stipendiya ma‘lumotlar bazasidan o‘zingizga mosini tanlang.',
 'DAAD portali orqali ariza topshiriladi.',
 'https://www.daad.de', true, false, false, 'published'),

('gks-korea-scholarship', 'Global Korea Scholarship (GKS)', 'Koreya Respublikasi hukumati',
 'Janubiy Koreya', 'scholarship', 'onsite', 'full', 'en', 'B1', 0, current_date + 60,
 'Janubiy Koreyada bakalavr, magistratura va doktorantura uchun hukumat stipendiyasi.',
 'Koreys tili tayyorlov kursi dasturga kiritilishi mumkin.',
 'Yosh va o‘rtacha ball cheklovlari bor. Aniq shartlar rasmiy saytda.',
 'Ariza Koreya elchixonasi yoki universitet orqali topshiriladi; rasmiy saytdan tekshiring.',
 'https://www.studyinkorea.go.kr', true, false, false, 'published'),

('stipendium-hungaricum', 'Stipendium Hungaricum (Vengriya)', 'Vengriya hukumati',
 'Vengriya', 'scholarship', 'onsite', 'full', 'en', 'B2', 0, current_date + 85,
 'Vengriya universitetlarida o‘qish uchun hukumat stipendiya dasturi.',
 'Bakalavr, magistratura va doktorantura darajalari uchun mavjud.',
 'Hamkor mamlakat fuqarolari uchun. O‘zbekiston ishtirok etishini rasmiy saytdan tasdiqlang.',
 'Rasmiy portalda onlayn ariza topshiriladi.',
 'https://stipendiumhungaricum.hu', true, false, false, 'published'),

('eyuf-el-yurt-umidi', 'El-yurt umidi jamg‘armasi — xorijda o‘qish dasturi', 'El-yurt umidi jamg‘armasi',
 'O‘zbekiston', 'scholarship', 'onsite', 'full', 'en', 'B2', 0, null,
 'O‘zbekiston yoshlarining xorijiy universitetlarda o‘qishini moliyalashtirish dasturi.',
 'Qabul turlari va qoplanadigan xarajatlar jamg‘arma e‘lon qilgan tartibga qarab o‘zgaradi.',
 'O‘zbekiston fuqarolari uchun. Aniq talablar va majburiyatlar jamg‘arma saytida.',
 'Jamg‘armaning rasmiy saytida e‘lon qilingan tartib bo‘yicha.',
 'https://eyuf.uz', true, false, true, 'published'),

('fulbright-foreign-student-uzbekistan', 'Fulbright Foreign Student dasturi (O‘zbekiston)', 'AQSH Davlat departamenti (Fulbright)',
 'AQSH', 'scholarship', 'onsite', 'full', 'en', 'B2', 0, current_date + 40,
 'AQSHda magistratura yoki tadqiqot uchun Fulbright dasturi, O‘zbekiston nomzodlari uchun.',
 'Dastur muddati va yo‘nalishlari yil sayin o‘zgarishi mumkin.',
 'Bakalavr darajasi va ingliz tili talab etiladi. Aniq shartlar rasmiy saytda.',
 'AQSHning O‘zbekistondagi elchixonasi saytidagi ko‘rsatma bo‘yicha.',
 'https://uz.usembassy.gov', true, false, false, 'published'),

('it-park-yoshlar-hakatoni-namuna', 'IT Park yoshlar hakatoni (namuna)', 'IT Park Uzbekistan (namuna)',
 'O‘zbekiston', 'competition', 'hybrid', 'none', 'uz', 'none', 0, current_date + 14,
 'Yosh dasturchilar uchun jamoaviy hakaton. NAMUNA yozuv.',
 'Bu yozuv namuna; aniq tadbir emas. Haqiqiy tadbirlar IT Park saytida e‘lon qilinadi.',
 'Namuna: 17 yoshdan katta talabalar.',
 'Namuna: haqiqiy ro‘yxatdan o‘tish tashkilot saytida.',
 'https://it-park.uz', true, true, false, 'published'),

('erasmus-plus-talaba-almashinuvi-icm', 'Erasmus+ talabalar almashinuvi (kredit mobilligi)', 'Erasmus+ dasturi',
 'Yevropa', 'exchange', 'onsite', 'partial', 'en', 'B2', 0, null,
 'Hamkor Yevropa universitetida bir semestr yoki bir yil o‘qish imkoniyati.',
 'Ariza odatda o‘z universitetingizning xalqaro bo‘limi orqali yuboriladi.',
 'Universitetingiz Erasmus+ hamkori bo‘lishi kerak. Muddat universitetga qarab farq qiladi.',
 'Universitetingizning xalqaro aloqalar bo‘limiga murojaat qiling.',
 'https://erasmus-plus.ec.europa.eu', true, false, false, 'published');

-- Soha va daraja bog‘lanishlari (slug bo‘yicha)
with m(slug, fields, degrees) as (values
  ('erasmus-mundus-joint-masters',          array['digital_economy','business','technology'], array['master']),
  ('mit-research-internship-namuna',        array['technology','research'],                  array['bachelor','master']),
  ('turkiye-burslari',                      array['digital_economy','business','technology'], array['bachelor','master','phd']),
  ('google-student-swe-internship-namuna',  array['technology','software'],                  array['bachelor','master']),
  ('young-leaders-programme-namuna',        array['leadership','business'],                  array['bachelor','master']),
  ('digital-economy-short-course-namuna',   array['digital_economy','technology'],           array['bachelor','master']),
  ('chevening-scholarships',                array['business','leadership','economics'],      array['master']),
  ('daad-scholarships',                     array['economics','technology','research'],      array['master','phd']),
  ('gks-korea-scholarship',                 array['technology','business','economics'],     array['bachelor','master','phd']),
  ('stipendium-hungaricum',                 array['economics','business','technology'],     array['bachelor','master','phd']),
  ('eyuf-el-yurt-umidi',                    array['economics','business','technology'],     array['bachelor','master']),
  ('fulbright-foreign-student-uzbekistan',  array['economics','research','leadership'],     array['master']),
  ('it-park-yoshlar-hakatoni-namuna',       array['technology','software'],                  array['bachelor','master']),
  ('erasmus-plus-talaba-almashinuvi-icm',   array['economics','business'],                   array['bachelor','master'])
),
ins_fields as (
  insert into public.opportunity_fields (opportunity_id, field)
  select o.id, f from m join public.opportunities o on o.slug = m.slug, unnest(m.fields) as f
  returning 1
)
insert into public.opportunity_degrees (opportunity_id, degree)
select o.id, d from m join public.opportunities o on o.slug = m.slug, unnest(m.degrees) as d;

-- Seeddan keyin: nashr etilganlarni tekshirish uchun
-- select slug, deadline, status, is_sample from public.opportunities order by deadline nulls last;

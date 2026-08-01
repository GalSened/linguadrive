/* LinguaDrive — Spanish curriculum. Hebrew UI, Spanish learning content. */
'use strict';
var CONTENT_ES = {

units: [
  { n: 1, he: 'הבסיס שמחזיק הכול', icon: '🧱' },
  { n: 2, he: 'שגרה והווה', icon: '☀️' },
  { n: 3, he: 'מספרים, זמן ואוכל', icon: '🕐' },
  { n: 4, he: 'לדבר על העבר', icon: '⏪' },
  { n: 5, he: 'עתיד, נסיעות ונימוס', icon: '✈️' },
  { n: 6, he: 'הרמה הבאה', icon: '🚀' }
],

lessons: [

/* ---------------- S1 ---------------- */
{ id: 's1', unit: 1, icon: '👋', en: 'Ser & Presentarse', he: 'הפועל להיות (ser) והיכרות',
  goal: 'בסוף השיעור תוכל להציג את עצמך בספרדית: שם, מוצא, מקצוע.',
  grammar: [
    { t: 'ser — להיות (מי אתה באמת)',
      p: 'הפועל ser מתאר זהות קבועה: מי אתה, מאיפה, מה המקצוע. ההטיות: yo soy (אני), tú eres (אתה), él/ella es (הוא/היא), nosotros somos (אנחנו), ellos son (הם). בספרדית אפשר להשמיט את המילה "אני" - הפועל כבר אומר הכול: Soy Dani = אני דני.',
      ex: [ ["Soy de Israel.", "אני מישראל."], ["Eres muy amable.", "אתה מאוד אדיב."], ["Ella es doctora.", "היא רופאה."] ] },
    { t: 'איך קוראים לך',
      p: 'Me llamo... = קוראים לי (מילולית: אני קורא לעצמי). ¿Cómo te llamas? = איך קוראים לך? ותשובה מנומסת להיכרות: Mucho gusto = נעים מאוד.',
      ex: [ ["Me llamo David.", "קוראים לי דויד."], ["¿Cómo te llamas?", "איך קוראים לך?"], ["Mucho gusto.", "נעים מאוד."] ] },
    { t: 'שלילה: פשוט שמים no',
      p: 'הכי קל בעולם: מוסיפים no לפני הפועל. No soy de aquí = אני לא מכאן. אין מילות עזר, אין שינויים.',
      ex: [ ["No soy de aquí.", "אני לא מכאן."], ["Él no es mi hermano.", "הוא לא אח שלי."], ["No somos turistas.", "אנחנו לא תיירים."] ] }
  ],
  vocab: [
    { en: 'hola', he: 'שלום', t: 'אוֹלָה', ex: 'Hola, ¿qué tal?' },
    { en: 'me llamo', he: 'קוראים לי', t: 'מֶה יָאמוֹ', ex: 'Me llamo Ana.' },
    { en: 'soy', he: 'אני (הנני)', t: 'סוֹי', ex: 'Soy de Israel.' },
    { en: 'eres', he: 'אתה (הנך)', t: 'אֶרֶס', ex: 'Eres muy simpático.' },
    { en: 'es', he: 'הוא/היא (הינו)', t: 'אֶס', ex: 'Ella es mi amiga.' },
    { en: 'de', he: 'מ- (ממקום)', t: 'דֶה', ex: 'Soy de Tel Aviv.' },
    { en: 'amigo', he: 'חבר', t: 'אָמִיגוֹ', ex: 'Es mi amigo.' },
    { en: 'familia', he: 'משפחה', t: 'פָמִילְיָה', ex: 'Mi familia es grande.' },
    { en: 'mucho gusto', he: 'נעים מאוד', t: 'מוּצ\'וֹ גוּסְטוֹ', ex: 'Mucho gusto, señora.' },
    { en: 'sí', he: 'כן', t: 'סִי', ex: 'Sí, claro.' },
    { en: 'no', he: 'לא', t: 'נוֹ', ex: 'No, gracias.' },
    { en: 'y', he: 'ו- (וגם)', t: 'אִי', ex: 'Tú y yo.' }
  ],
  sentences: [
    ["Hola, me llamo David.", "שלום, קוראים לי דויד."],
    ["Soy de Israel.", "אני מישראל."],
    ["Mucho gusto.", "נעים מאוד."],
    ["¿Cómo te llamas?", "איך קוראים לך?"],
    ["Ella es mi amiga.", "היא חברה שלי."],
    ["Somos una familia grande.", "אנחנו משפחה גדולה."],
    ["Él es de Madrid.", "הוא ממדריד."],
    ["No soy turista.", "אני לא תייר."],
    ["Eres muy amable.", "אתה מאוד אדיב."],
    ["Es un día bonito.", "זה יום יפה."]
  ],
  quiz: [
    { q: 'Yo ___ de Israel.', o: ['es', 'soy', 'eres', 'son'], a: 1, ex: 'אני = soy.' },
    { q: 'Ella ___ doctora.', o: ['soy', 'eres', 'es', 'somos'], a: 2, ex: 'הוא/היא = es.' },
    { q: '"קוראים לי דנה":', o: ['Me llamo Dana.', 'Yo llamo Dana.', 'Mi nombre Dana es.', 'Llamo me Dana.'], a: 0, ex: 'Me llamo + שם.' },
    { q: 'שלילה בספרדית:', o: ['מוסיפים not אחרי הפועל', 'מוסיפים no לפני הפועל', 'הופכים את הסדר', 'מוסיפים don\'t'], a: 1, ex: 'no לפני הפועל: No soy.' },
    { q: 'Nosotros ___ amigos.', o: ['son', 'es', 'somos', 'soy'], a: 2, ex: 'אנחנו = somos.' },
    { q: '"נעים מאוד":', o: ['Buen día', 'Mucho gusto', 'Por favor', 'De nada'], a: 1, ex: 'בהיכרות אומרים Mucho gusto.' }
  ],
  dialogue: { title: 'היכרות ראשונה', intro: 'אתה פוגש שכן חדש דובר ספרדית. אתה B.',
    turns: [
      { s: 'A', en: "¡Hola! Me llamo Carmen. Soy tu nueva vecina.", he: 'שלום! קוראים לי כרמן. אני השכנה החדשה שלך.' },
      { s: 'B', en: "¡Hola Carmen! Mucho gusto. Me llamo Dani.", he: 'שלום כרמן! נעים מאוד. קוראים לי דני.' },
      { s: 'A', en: "Mucho gusto, Dani. ¿De dónde eres?", he: 'נעים מאוד, דני. מאיפה אתה?' },
      { s: 'B', en: "Soy de Haifa. ¿Y tú?", he: 'אני מחיפה. ואת?' },
      { s: 'A', en: "Soy de Barcelona. Es una ciudad muy bonita.", he: 'אני מברצלונה. זו עיר מאוד יפה.' },
      { s: 'B', en: "¡Sí! Barcelona es fantástica.", he: 'כן! ברצלונה פנטסטית.' },
      { s: 'A', en: "Bueno, hasta luego, Dani.", he: 'טוב, להתראות, דני.' },
      { s: 'B', en: "Hasta luego. ¡Buen día!", he: 'להתראות. שיהיה יום טוב!' }
    ] }
},

/* ---------------- S2 ---------------- */
{ id: 's2', unit: 1, icon: '❓', en: 'Estar & Preguntas', he: 'estar, שאלות: איפה ואיך',
  goal: 'בסוף השיעור תדע לשאול איפה ואיך, ותבין את ההבדל בין ser ל-estar.',
  grammar: [
    { t: 'estar — להיות (איפה ואיך אתה עכשיו)',
      p: 'בספרדית יש שני פעלי "להיות". estar מתאר מצב זמני ומיקום: estoy (אני), estás (אתה), está (הוא/היא), estamos (אנחנו), están (הם). ¿Cómo estás? = מה שלומך? Estoy bien = אני בסדר.',
      ex: [ ["¿Cómo estás?", "מה שלומך?"], ["Estoy muy bien, gracias.", "שלומי טוב מאוד, תודה."], ["El banco está cerca.", "הבנק קרוב."] ] },
    { t: 'הכלל הפשוט: ser מול estar',
      p: 'ser = מה שאתה (זהות, מוצא, מקצוע - קבוע). estar = איך ואיפה אתה (מצב רוח, מיקום - זמני). Soy israelí (זהות) אבל Estoy cansado (עייף עכשיו).',
      ex: [ ["Soy israelí.", "אני ישראלי. (זהות)"], ["Estoy cansado.", "אני עייף. (מצב)"], ["Madrid está en España.", "מדריד נמצאת בספרד. (מיקום)"] ] },
    { t: 'מילות שאלה',
      p: '¿Qué? (מה), ¿Dónde? (איפה), ¿Quién? (מי), ¿Cómo? (איך), ¿Cuándo? (מתי), ¿Por qué? (למה). שים לב לסימן השאלה ההפוך ¿ בתחילת שאלה - זו החתימה של הספרדית.',
      ex: [ ["¿Dónde está el baño?", "איפה השירותים?"], ["¿Qué es esto?", "מה זה?"], ["¿Quién es él?", "מי הוא?"] ] }
  ],
  vocab: [
    { en: 'qué', he: 'מה', t: 'קֶה', ex: '¿Qué es esto?' },
    { en: 'dónde', he: 'איפה', t: 'דוֹנְדֶה', ex: '¿Dónde estás?' },
    { en: 'quién', he: 'מי', t: 'קְיֶן', ex: '¿Quién es ella?' },
    { en: 'cómo', he: 'איך', t: 'קוֹמוֹ', ex: '¿Cómo estás?' },
    { en: 'cuándo', he: 'מתי', t: 'קוּאָנְדוֹ', ex: '¿Cuándo es la fiesta?' },
    { en: 'por qué', he: 'למה', t: 'פּוֹר קֶה', ex: '¿Por qué no?' },
    { en: 'estoy', he: 'אני (נמצא/מרגיש)', t: 'אֶסְטוֹי', ex: 'Estoy en casa.' },
    { en: 'estás', he: 'אתה (נמצא/מרגיש)', t: 'אֶסְטָאס', ex: '¿Dónde estás?' },
    { en: 'está', he: 'הוא/היא (נמצא)', t: 'אֶסְטָה', ex: 'El café está caliente.' },
    { en: 'bien', he: 'טוב, בסדר', t: 'בְּיֶן', ex: 'Estoy bien.' },
    { en: 'aquí', he: 'כאן', t: 'אָקִי', ex: 'Estamos aquí.' },
    { en: 'cansado', he: 'עייף', t: 'קַנְסָאדוֹ', ex: 'Estoy un poco cansado.' }
  ],
  sentences: [
    ["¿Cómo estás?", "מה שלומך?"],
    ["Estoy muy bien, gracias.", "שלומי טוב מאוד, תודה."],
    ["¿Dónde está el baño?", "איפה השירותים?"],
    ["Está aquí, a la derecha.", "זה כאן, מימין."],
    ["¿De dónde eres?", "מאיפה אתה?"],
    ["Estoy un poco cansado.", "אני קצת עייף."],
    ["¿Quién es esa mujer?", "מי האישה ההיא?"],
    ["¿Dónde está el hotel?", "איפה המלון?"],
    ["El café está muy caliente.", "הקפה מאוד חם."],
    ["¿Por qué estás aquí?", "למה אתה כאן?"]
  ],
  quiz: [
    { q: '¿Cómo ___? - Muy bien.', o: ['eres', 'estás', 'es', 'soy'], a: 1, ex: 'מה שלומך = ¿Cómo estás?' },
    { q: 'מיקום מקבל תמיד:', o: ['ser', 'estar', 'tener', 'hay'], a: 1, ex: 'איפה משהו נמצא = estar.' },
    { q: 'Yo ___ cansado.', o: ['soy', 'es', 'estoy', 'eres'], a: 2, ex: 'מצב זמני (עייף) = estoy.' },
    { q: 'Yo ___ israelí.', o: ['estoy', 'soy', 'está', 'estás'], a: 1, ex: 'זהות = ser: soy.' },
    { q: '"איפה המלון?":', o: ['¿Dónde es el hotel?', '¿Dónde está el hotel?', '¿Qué está el hotel?', '¿Cómo es hotel?'], a: 1, ex: 'מיקום = está.' },
    { q: '"למה" בספרדית:', o: ['porque', 'por qué', 'para', 'cuándo'], a: 1, ex: '¿Por qué? = למה. (porque במילה אחת = כי)' }
  ],
  dialogue: { title: 'שיחת בוקר', intro: 'מכר פוגש אותך ברחוב. אתה B.',
    turns: [
      { s: 'A', en: "¡Buenos días! ¿Cómo estás?", he: 'בוקר טוב! מה שלומך?' },
      { s: 'B', en: "¡Buenos días! Estoy muy bien, ¿y tú?", he: 'בוקר טוב! שלומי מצוין, ואתה?' },
      { s: 'A', en: "Bien, gracias. ¿Dónde está tu familia?", he: 'טוב, תודה. איפה המשפחה שלך?' },
      { s: 'B', en: "Están en casa. Yo voy al mercado.", he: 'הם בבית. אני הולך לשוק.' },
      { s: 'A', en: "¡Qué bien! El mercado está cerca de aquí.", he: 'איזה יופי! השוק קרוב לכאן.' },
      { s: 'B', en: "Sí, está a cinco minutos.", he: 'כן, הוא במרחק חמש דקות.' },
      { s: 'A', en: "Perfecto. ¡Hasta luego!", he: 'מושלם. להתראות!' },
      { s: 'B', en: "¡Hasta luego! ¡Buen día!", he: 'להתראות! יום טוב!' }
    ] }
},

/* ---------------- S3 ---------------- */
{ id: 's3', unit: 1, icon: '🏠', en: 'Hay, El & La', he: 'יש (hay) וזכר/נקבה',
  goal: 'בסוף השיעור תוכל לומר מה יש ומה אין, ולהשתמש נכון ב-el/la.',
  grammar: [
    { t: 'המילה הכי שימושית: hay',
      p: 'hay = יש (וגם "יש?" בשאלה). מילה אחת ליחיד ולרבים: Hay un banco = יש בנק. Hay dos bancos = יש שני בנקים. אין = No hay.',
      ex: [ ["Hay un banco aquí.", "יש כאן בנק."], ["Hay dos habitaciones.", "יש שני חדרים."], ["No hay problema.", "אין בעיה."] ] },
    { t: 'לכל מילה יש מין',
      p: 'בדיוק כמו בעברית! מילים שנגמרות ב-o הן בדרך כלל זכר: el libro (הספר). מילים ב-a הן נקבה: la casa (הבית). "ה-" הידיעה: el (זכר), la (נקבה). "איזשהו": un / una.',
      ex: [ ["el libro, la casa", "הספר, הבית"], ["un café, una mesa", "קפה אחד, שולחן אחד"], ["El coche es nuevo.", "המכונית חדשה."] ] },
    { t: 'רבים: מוסיפים s',
      p: 'כמו באנגלית - מוסיפים s: libro ← libros. וה"ה-" משתנה: los (זכר רבים), las (נקבה רבים): los libros, las casas.',
      ex: [ ["los libros", "הספרים"], ["las llaves", "המפתחות"], ["Hay muchos coches.", "יש הרבה מכוניות."] ] }
  ],
  vocab: [
    { en: 'hay', he: 'יש', t: 'אָיי', ex: 'Hay un problema.' },
    { en: 'la casa', he: 'הבית', t: 'לָה קָאסָה', ex: 'La casa es grande.' },
    { en: 'la habitación', he: 'החדר', t: 'לָה אָבִיטָסְיוֹן', ex: 'Hay tres habitaciones.' },
    { en: 'la cocina', he: 'המטבח', t: 'לָה קוֹסִינָה', ex: 'La cocina es nueva.' },
    { en: 'la mesa', he: 'השולחן', t: 'לָה מֶסָה', ex: 'La mesa está aquí.' },
    { en: 'la silla', he: 'הכיסא', t: 'לָה סִייָה', ex: 'Hay cuatro sillas.' },
    { en: 'la puerta', he: 'הדלת', t: 'לָה פּוּאֶרְטָה', ex: 'La puerta está abierta.' },
    { en: 'la calle', he: 'הרחוב', t: 'לָה קָאיֶה', ex: 'Hay un café en la calle.' },
    { en: 'la tienda', he: 'החנות', t: 'לָה טְיֶנְדָה', ex: 'La tienda está cerrada.' },
    { en: 'el coche', he: 'המכונית', t: 'אֶל קוֹצֶ\'ה', ex: 'El coche es rojo.' },
    { en: 'cerca', he: 'קרוב', t: 'סֶרְקָה', ex: 'El banco está cerca.' },
    { en: 'mucho', he: 'הרבה', t: 'מוּצ\'וֹ', ex: 'Hay mucha gente.' }
  ],
  sentences: [
    ["Hay una cocina grande en la casa.", "יש מטבח גדול בבית."],
    ["Hay dos habitaciones.", "יש שני חדרים."],
    ["Hay un supermercado cerca de mi casa.", "יש סופרמרקט ליד הבית שלי."],
    ["No hay aparcamiento en esta calle.", "אין חניה ברחוב הזה."],
    ["¿Hay un banco por aquí?", "יש בנק באזור?"],
    ["Sí, hay uno en la esquina.", "כן, יש אחד בפינה."],
    ["Hay muchos coches hoy.", "יש הרבה מכוניות היום."],
    ["Hay un problema con el coche.", "יש בעיה עם המכונית."],
    ["No hay leche en la nevera.", "אין חלב במקרר."],
    ["La tienda está abierta.", "החנות פתוחה."]
  ],
  quiz: [
    { q: '"יש שני חדרים":', o: ['Hay dos habitaciones.', 'Están dos habitaciones.', 'Son dos habitaciones.', 'Hays habitaciones dos.'], a: 0, ex: 'hay אחד ליחיד ולרבים.' },
    { q: '___ casa (הבית):', o: ['El', 'La', 'Los', 'Un'], a: 1, ex: 'casa נגמרת ב-a = נקבה = la.' },
    { q: '___ libro (הספר):', o: ['La', 'Las', 'El', 'Una'], a: 2, ex: 'libro נגמר ב-o = זכר = el.' },
    { q: '"אין בעיה":', o: ['Hay no problema.', 'No hay problema.', 'Problema no hay es.', 'No es problema hay.'], a: 1, ex: 'No hay + שם עצם.' },
    { q: 'רבים של la silla:', o: ['la sillas', 'los sillas', 'las sillas', 'el sillos'], a: 2, ex: 'נקבה רבים: las sillas.' },
    { q: '"יש כאן בית מרקחת?":', o: ['¿Hay una farmacia aquí?', '¿Está farmacia aquí?', '¿Es una farmacia aquí?', '¿Tiene farmacia aquí?'], a: 0, ex: 'שאלת קיום: ¿Hay...?' }
  ],
  dialogue: { title: 'הדירה החדשה', intro: 'חבר שואל על הדירה החדשה שלך. אתה B.',
    turns: [
      { s: 'A', en: "¿Qué tal el apartamento nuevo?", he: 'איך הדירה החדשה?' },
      { s: 'B', en: "¡Es fantástico! Hay tres habitaciones y una cocina grande.", he: 'פנטסטית! יש שלושה חדרים ומטבח גדול.' },
      { s: 'A', en: "¡Qué bien! ¿Hay balcón?", he: 'איזה יופי! יש מרפסת?' },
      { s: 'B', en: "Sí, hay un balcón pequeño con vista al mar.", he: 'כן, יש מרפסת קטנה עם נוף לים.' },
      { s: 'A', en: "¿Y hay aparcamiento?", he: 'ויש חניה?' },
      { s: 'B', en: "No, no hay. Pero hay una estación de autobús cerca.", he: 'לא, אין. אבל יש תחנת אוטובוס קרוב.' },
      { s: 'A', en: "¿Hay restaurantes buenos en la zona?", he: 'יש מסעדות טובות באזור?' },
      { s: 'B', en: "¡Sí! Hay dos restaurantes excelentes en mi calle.", he: 'כן! יש שתי מסעדות מצוינות ברחוב שלי.' }
    ] }
},

/* ---------------- S4 ---------------- */
{ id: 's4', unit: 2, icon: '🌅', en: 'Verbos -AR', he: 'הווה: פעלים שנגמרים ב-ar',
  goal: 'בסוף השיעור תוכל לתאר את שגרת היום שלך עם משפחת הפעלים הגדולה ביותר.',
  grammar: [
    { t: 'המשפחה הגדולה: פעלי ar',
      p: 'רוב הפעלים בספרדית נגמרים ב-ar: hablar (לדבר), trabajar (לעבוד), comprar (לקנות). מורידים את ar ומוסיפים סיומת לפי הגוף: hablo (אני מדבר), hablas (אתה), habla (הוא), hablamos (אנחנו), hablan (הם).',
      ex: [ ["Hablo un poco de español.", "אני מדבר קצת ספרדית."], ["Trabajo en Tel Aviv.", "אני עובד בתל אביב."], ["Ella compra pan cada día.", "היא קונה לחם כל יום."] ] },
    { t: 'הסיומת אומרת מי',
      p: 'בגלל שהסיומת ייחודית לכל גוף, לא צריך לומר "אני/אתה": Trabajo = אני עובד. Trabajas = אתה עובד. ההברה המוטעמת: לפני האחרונה - TRA-ba-jo... בעצם tra-BA-jo.',
      ex: [ ["Compro fruta en el mercado.", "אני קונה פירות בשוק."], ["¿Trabajas mañana?", "אתה עובד מחר?"], ["Cenamos a las ocho.", "אנחנו אוכלים ערב בשמונה."] ] },
    { t: 'מילות תדירות',
      p: 'siempre (תמיד), normalmente (בדרך כלל), a veces (לפעמים), nunca (אף פעם), cada día (כל יום), todos los días (בכל הימים).',
      ex: [ ["Siempre desayuno en casa.", "אני תמיד אוכל בוקר בבית."], ["A veces camino al trabajo.", "לפעמים אני הולך ברגל לעבודה."], ["Nunca trabajo los sábados.", "אני אף פעם לא עובד בשבתות."] ] }
  ],
  vocab: [
    { en: 'hablar', he: 'לדבר', t: 'אַבְּלָאר', ex: 'Hablo hebreo y español.' },
    { en: 'trabajar', he: 'לעבוד', t: 'טְרָבָּחָאר', ex: 'Trabajo en una oficina.' },
    { en: 'comprar', he: 'לקנות', t: 'קוֹמְפְּרָאר', ex: 'Compro fruta fresca.' },
    { en: 'desayunar', he: 'לאכול ארוחת בוקר', t: 'דֶסָאיוּנָאר', ex: 'Desayuno a las siete.' },
    { en: 'cenar', he: 'לאכול ארוחת ערב', t: 'סֶנָאר', ex: 'Cenamos juntos.' },
    { en: 'caminar', he: 'ללכת ברגל', t: 'קָמִינָאר', ex: 'Camino por la playa.' },
    { en: 'escuchar', he: 'להקשיב', t: 'אֶסְקוּצָ\'אר', ex: 'Escucho música.' },
    { en: 'descansar', he: 'לנוח', t: 'דֶסְקַנְסָאר', ex: 'Descanso el sábado.' },
    { en: 'siempre', he: 'תמיד', t: 'סְיֶמְפְּרֶה', ex: 'Siempre llego temprano.' },
    { en: 'a veces', he: 'לפעמים', t: 'אָה בֶּסֶס', ex: 'A veces cocino yo.' },
    { en: 'nunca', he: 'אף פעם לא', t: 'נוּנְקָה', ex: 'Nunca fumo.' },
    { en: 'cada día', he: 'כל יום', t: 'קָאדָה דִיָה', ex: 'Camino cada día.' }
  ],
  sentences: [
    ["Hablo un poco de español.", "אני מדבר קצת ספרדית."],
    ["Trabajo cada día en Tel Aviv.", "אני עובד כל יום בתל אביב."],
    ["Desayuno a las siete de la mañana.", "אני אוכל ארוחת בוקר בשבע בבוקר."],
    ["Mi mujer trabaja desde casa.", "אשתי עובדת מהבית."],
    ["Compramos fruta en el mercado.", "אנחנו קונים פירות בשוק."],
    ["Cenamos a las ocho.", "אנחנו אוכלים ארוחת ערב בשמונה."],
    ["Siempre escucho música en el coche.", "אני תמיד מקשיב למוזיקה באוטו."],
    ["A veces camino por la playa.", "לפעמים אני הולך על החוף."],
    ["Nunca trabajo los sábados.", "אני אף פעם לא עובד בשבתות."],
    ["Descansamos el fin de semana.", "אנחנו נחים בסוף השבוע."]
  ],
  quiz: [
    { q: 'Yo ___ en un banco. (trabajar)', o: ['trabaja', 'trabajo', 'trabajas', 'trabajan'], a: 1, ex: 'אני = סיומת o: trabajo.' },
    { q: 'Ella ___ español. (hablar)', o: ['hablo', 'hablas', 'habla', 'hablamos'], a: 2, ex: 'הוא/היא = סיומת a: habla.' },
    { q: 'Nosotros ___ a las ocho. (cenar)', o: ['cena', 'cenan', 'ceno', 'cenamos'], a: 3, ex: 'אנחנו = amos: cenamos.' },
    { q: '"אני תמיד קם מוקדם" - איפה siempre?', o: ['בסוף המשפט בלבד', 'לפני הפועל', 'אחרי הפועל בלבד', 'אין מילה כזאת'], a: 1, ex: 'Siempre + פועל: Siempre desayuno...' },
    { q: '¿___ mañana? (אתה עובד מחר?)', o: ['Trabajo', 'Trabaja', 'Trabajas', 'Trabajamos'], a: 2, ex: 'אתה = סיומת as: trabajas.' },
    { q: '"אף פעם" בספרדית:', o: ['siempre', 'a veces', 'nunca', 'cada'], a: 2, ex: 'nunca = אף פעם. Nunca fumo.' }
  ],
  dialogue: { title: 'שגרת בוקר', intro: 'קולגה מתעניין בשגרה שלך. אתה B.',
    turns: [
      { s: 'A', en: "Siempre llegas temprano. ¿A qué hora te levantas?", he: 'אתה תמיד מגיע מוקדם. באיזו שעה אתה קם?' },
      { s: 'B', en: "Me levanto a las seis. Me gustan las mañanas tranquilas.", he: 'אני קם בשש. אני אוהב בקרים שקטים.' },
      { s: 'A', en: "¡A las seis! ¿Y qué haces tan temprano?", he: 'בשש! ומה אתה עושה כל כך מוקדם?' },
      { s: 'B', en: "Tomo café, escucho las noticias y camino un poco.", he: 'אני שותה קפה, מקשיב לחדשות והולך קצת ברגל.' },
      { s: 'A', en: "Muy bien. ¿Desayunas en casa?", he: 'יפה מאוד. אתה אוכל ארוחת בוקר בבית?' },
      { s: 'B', en: "Normalmente sí. Mi mujer prepara un desayuno excelente.", he: 'בדרך כלל כן. אשתי מכינה ארוחת בוקר מצוינת.' },
      { s: 'A', en: "¡Qué suerte! Yo nunca desayuno.", he: 'איזה מזל! אני אף פעם לא אוכל בוקר.' },
      { s: 'B', en: "¡Eso no es sano! El desayuno es importante.", he: 'זה לא בריא! ארוחת הבוקר חשובה.' }
    ] }
},

/* ---------------- S5 ---------------- */
{ id: 's5', unit: 2, icon: '🙋', en: 'Verbos -ER / -IR', he: 'הווה: פעלי er ו-ir, שלילה ושאלות',
  goal: 'בסוף השיעור תשלים את ההווה: לאכול, לשתות, לגור - ולשאול ולשלול הכול.',
  grammar: [
    { t: 'שתי המשפחות הנוספות',
      p: 'פעלי er: comer (לאכול), beber (לשתות), leer (לקרוא) - הסיומות: como, comes, come, comemos, comen. פעלי ir: vivir (לגור), escribir (לכתוב) - כמעט זהה: vivo, vives, vive, vivimos, viven.',
      ex: [ ["Como mucha ensalada.", "אני אוכל הרבה סלט."], ["¿Dónde vives?", "איפה אתה גר?"], ["Bebemos café por la mañana.", "אנחנו שותים קפה בבוקר."] ] },
    { t: 'שאלה = אינטונציה בלבד',
      p: 'חדשות מעולות לדוברי עברית: שאלה בספרדית זה בדיוק כמו בעברית - אותו משפט עם אינטונציה של שאלה: ¿Comes carne? = אתה אוכל בשר? בלי do, בלי היפוך סדר.',
      ex: [ ["¿Comes carne?", "אתה אוכל בשר?"], ["¿Vives en la ciudad?", "אתה גר בעיר?"], ["¿Entiendes?", "אתה מבין?"] ] },
    { t: 'משפטי ההצלה',
      p: 'No entiendo = אני לא מבין. No sé = אני לא יודע. ¿Puedes repetir? = אתה יכול לחזור? Más despacio, por favor = יותר לאט, בבקשה. ארבעת המשפטים שפותחים כל שיחה.',
      ex: [ ["No entiendo.", "אני לא מבין."], ["Más despacio, por favor.", "יותר לאט, בבקשה."], ["¿Puedes repetir?", "אתה יכול לחזור על זה?"] ] }
  ],
  vocab: [
    { en: 'comer', he: 'לאכול', t: 'קוֹמֶר', ex: 'Como a las dos.' },
    { en: 'beber', he: 'לשתות', t: 'בֶּבֶּר', ex: 'Bebo mucha agua.' },
    { en: 'vivir', he: 'לגור', t: 'בִּיבִיר', ex: 'Vivo en Israel.' },
    { en: 'leer', he: 'לקרוא', t: 'לֶאֶר', ex: 'Leo el periódico.' },
    { en: 'entender', he: 'להבין', t: 'אֶנְטֶנְדֶר', ex: 'No entiendo.' },
    { en: 'saber', he: 'לדעת', t: 'סָאבֶּר', ex: 'No sé.' },
    { en: 'aprender', he: 'ללמוד', t: 'אַפְּרֶנְדֶר', ex: 'Aprendo español.' },
    { en: 'repetir', he: 'לחזור על', t: 'רֶפֶּטִיר', ex: '¿Puedes repetir?' },
    { en: 'despacio', he: 'לאט', t: 'דֶסְפָּאסְיוֹ', ex: 'Más despacio, por favor.' },
    { en: 'otra vez', he: 'שוב, עוד פעם', t: 'אוֹטְרָה בֶּס', ex: 'Otra vez, por favor.' },
    { en: 'un poco', he: 'קצת', t: 'אוּן פּוֹקוֹ', ex: 'Hablo un poco.' },
    { en: 'gracias', he: 'תודה', t: 'גְרָאסְיָאס', ex: 'Muchas gracias.' }
  ],
  sentences: [
    ["¿Hablas español?", "אתה מדבר ספרדית?"],
    ["Sí, pero hablo despacio.", "כן, אבל אני מדבר לאט."],
    ["No entiendo.", "אני לא מבין."],
    ["¿Puedes repetir, por favor?", "אתה יכול לחזור, בבקשה?"],
    ["Más despacio, por favor.", "יותר לאט, בבקשה."],
    ["No sé esta palabra.", "אני לא מכיר את המילה הזאת."],
    ["¿Dónde vives?", "איפה אתה גר?"],
    ["Vivo cerca del mar.", "אני גר קרוב לים."],
    ["Aprendo español en el coche.", "אני לומד ספרדית באוטו."],
    ["¿Qué comes normalmente?", "מה אתה אוכל בדרך כלל?"]
  ],
  quiz: [
    { q: 'Yo ___ en Haifa. (vivir)', o: ['vive', 'vivo', 'vives', 'viven'], a: 1, ex: 'אני = vivo.' },
    { q: '¿Tú ___ carne? (comer)', o: ['como', 'come', 'comes', 'comemos'], a: 2, ex: 'אתה = comes.' },
    { q: '"אני לא מבין":', o: ['No entiendo.', 'Entiendo no.', 'No entender.', 'Yo no entender.'], a: 0, ex: 'No + הפועל המוטה: No entiendo.' },
    { q: 'שאלה בספרדית נוצרת על ידי:', o: ['הוספת do', 'היפוך סדר חובה', 'אינטונציה (וסימני ¿?)', 'הוספת ka'], a: 2, ex: 'כמו בעברית - רק אינטונציה.' },
    { q: '"יותר לאט בבקשה":', o: ['Más rápido, por favor.', 'Más despacio, por favor.', 'Menos despacio.', 'Muy lento tú.'], a: 1, ex: 'más despacio = יותר לאט.' },
    { q: 'Nosotros ___ mucha agua. (beber)', o: ['bebo', 'beben', 'bebemos', 'bebes'], a: 2, ex: 'אנחנו = bebemos.' }
  ],
  dialogue: { title: 'לא הבנתי - ולא נורא', intro: 'דובר ספרדית מהיר מדבר איתך בטלפון. אתה B - ואתה שולט בקצב.',
    turns: [
      { s: 'A', en: "Hola, soy Marcos de la compañía de seguros, llamo por la renovación de su póliza.", he: 'שלום, אני מרקוס מחברת הביטוח, אני מתקשר לגבי חידוש הפוליסה.' },
      { s: 'B', en: "Hola Marcos. Perdón, no entiendo. Más despacio, por favor.", he: 'שלום מרקוס. סליחה, אני לא מבין. יותר לאט, בבקשה.' },
      { s: 'A', en: "Claro. Su seguro del coche termina este mes.", he: 'בטח. ביטוח הרכב שלך מסתיים החודש.' },
      { s: 'B', en: "Ahora entiendo. ¿Qué necesita de mí?", he: 'עכשיו אני מבין. מה אתה צריך ממני?' },
      { s: 'A', en: "¿Quiere renovar el seguro?", he: 'אתה רוצה לחדש את הביטוח?' },
      { s: 'B', en: "No sé. ¿El precio cambia?", he: 'אני לא יודע. המחיר משתנה?' },
      { s: 'A', en: "No, es el mismo precio.", he: 'לא, זה אותו מחיר.' },
      { s: 'B', en: "Bien. Un email, por favor. Y gracias por su paciencia.", he: 'טוב. מייל, בבקשה. ותודה על הסבלנות.' }
    ] }
},

/* ---------------- S6 ---------------- */
{ id: 's6', unit: 2, icon: '🔑', en: 'Tener, Ir, Querer, Poder', he: 'ארבעת פעלי המפתח',
  goal: 'בסוף השיעור תשלוט בארבעת הפעלים שמופיעים כמעט בכל משפט בספרדית.',
  grammar: [
    { t: 'tener — יש לי (וגם הגיל!)',
      p: 'tengo (יש לי), tienes (יש לך), tiene (יש לו). ובספרדית הגיל הוא "שייך לך": Tengo 50 años = אני בן 50 (מילולית: יש לי 50 שנים). וגם: tengo hambre (אני רעב), tengo sed (צמא), tengo frío (קר לי).',
      ex: [ ["Tengo dos hijos.", "יש לי שני ילדים."], ["Tengo cincuenta años.", "אני בן חמישים."], ["Tengo hambre.", "אני רעב."] ] },
    { t: 'ir — ללכת (והדרך לעתיד)',
      p: 'voy (אני הולך), vas, va, vamos, van. תמיד עם a: Voy a casa = אני הולך הביתה. Vamos = בוא נלך / קדימה!',
      ex: [ ["Voy al trabajo.", "אני הולך לעבודה."], ["¿Vas al mercado?", "אתה הולך לשוק?"], ["¡Vamos a la playa!", "בואו נלך לים!"] ] },
    { t: 'querer ו-poder — לרצות ולהיות מסוגל',
      p: 'Quiero = אני רוצה. Quiero un café = אני רוצה קפה. Quiero + פועל: Quiero aprender = אני רוצה ללמוד. Puedo = אני יכול. ¿Puedes...? = אתה יכול...?',
      ex: [ ["Quiero un café, por favor.", "אני רוצה קפה, בבקשה."], ["Quiero aprender español.", "אני רוצה ללמוד ספרדית."], ["¿Puedes ayudarme?", "אתה יכול לעזור לי?"] ] }
  ],
  vocab: [
    { en: 'tengo', he: 'יש לי', t: 'טֶנְגוֹ', ex: 'Tengo tres hijos.' },
    { en: 'tienes', he: 'יש לך', t: 'טְיֶנֶס', ex: '¿Tienes tiempo?' },
    { en: 'tiene', he: 'יש לו/לה', t: 'טְיֶנֶה', ex: 'Ella tiene un coche.' },
    { en: 'voy', he: 'אני הולך', t: 'בּוֹי', ex: 'Voy a casa.' },
    { en: 'vamos', he: 'אנחנו הולכים / קדימה', t: 'בָּאמוֹס', ex: '¡Vamos!' },
    { en: 'quiero', he: 'אני רוצה', t: 'קְיֶרוֹ', ex: 'Quiero agua.' },
    { en: 'quieres', he: 'אתה רוצה', t: 'קְיֶרֶס', ex: '¿Quieres café?' },
    { en: 'puedo', he: 'אני יכול', t: 'פּוּאֶדוֹ', ex: '¿Puedo entrar?' },
    { en: 'puedes', he: 'אתה יכול', t: 'פּוּאֶדֶס', ex: '¿Puedes ayudarme?' },
    { en: 'los años', he: 'שנים (גיל)', t: 'לוֹס אָנְיוֹס', ex: 'Tengo 40 años.' },
    { en: 'el hambre', he: 'רעב', t: 'אֶל אָמְבְּרֶה', ex: 'Tengo hambre.' },
    { en: 'el tiempo', he: 'זמן', t: 'אֶל טְיֶמְפּוֹ', ex: 'No tengo tiempo.' }
  ],
  sentences: [
    ["Tengo dos hijos y tres nietos.", "יש לי שני ילדים ושלושה נכדים."],
    ["Tengo cincuenta y tres años.", "אני בן חמישים ושלוש."],
    ["Tengo hambre. ¿Vamos a comer?", "אני רעב. הולכים לאכול?"],
    ["Voy al trabajo en coche.", "אני נוסע לעבודה באוטו."],
    ["¿Quieres un café?", "אתה רוצה קפה?"],
    ["Quiero aprender español.", "אני רוצה ללמוד ספרדית."],
    ["¿Puedes ayudarme, por favor?", "אתה יכול לעזור לי, בבקשה?"],
    ["No puedo hablar ahora.", "אני לא יכול לדבר עכשיו."],
    ["No tengo tiempo hoy.", "אין לי זמן היום."],
    ["Vamos a la playa el sábado.", "אנחנו הולכים לים בשבת."]
  ],
  quiz: [
    { q: '"אני בן 60" בספרדית:', o: ['Soy 60 años.', 'Tengo 60 años.', 'Estoy 60 años.', 'Hay 60 años.'], a: 1, ex: 'גיל עם tener: Tengo 60 años.' },
    { q: '"אני רעב":', o: ['Soy hambre.', 'Estoy hambre.', 'Tengo hambre.', 'Hay hambre.'], a: 2, ex: 'רעב/צמא/קור - עם tener.' },
    { q: 'Yo ___ al mercado.', o: ['va', 'vas', 'voy', 'vamos'], a: 2, ex: 'אני הולך = voy.' },
    { q: '"אני רוצה ללמוד":', o: ['Quiero aprender.', 'Quiero aprendo.', 'Aprender quiero yo.', 'Quiero a aprender.'], a: 0, ex: 'quiero + שם פועל: Quiero aprender.' },
    { q: '¿___ ayudarme? (אתה יכול לעזור לי?)', o: ['Puedo', 'Puede', 'Puedes', 'Podemos'], a: 2, ex: 'אתה = puedes.' },
    { q: 'Ella ___ tres hijos.', o: ['tengo', 'tienes', 'tiene', 'tienen'], a: 2, ex: 'יש לה = tiene.' }
  ],
  dialogue: { title: 'הפסקת צהריים', intro: 'קולגה מציע לצאת לאכול. אתה B.',
    turns: [
      { s: 'A', en: "¡Tengo mucha hambre! ¿Quieres comer algo?", he: 'אני מאוד רעב! אתה רוצה לאכול משהו?' },
      { s: 'B', en: "¡Sí! Yo también tengo hambre. ¿Adónde vamos?", he: 'כן! גם אני רעב. לאן הולכים?' },
      { s: 'A', en: "Hay un restaurante nuevo cerca. ¿Puedes caminar cinco minutos?", he: 'יש מסעדה חדשה קרוב. אתה יכול ללכת חמש דקות?' },
      { s: 'B', en: "Claro que puedo. ¿Qué tipo de comida tienen?", he: 'ברור שאני יכול. איזה סוג אוכל יש להם?' },
      { s: 'A', en: "Comida española. Las tapas son excelentes.", he: 'אוכל ספרדי. הטאפאס מצוינות.' },
      { s: 'B', en: "¡Perfecto! Quiero probar las tapas.", he: 'מושלם! אני רוצה לטעום את הטאפאס.' },
      { s: 'A', en: "¿Tienes tiempo? Es la una y media.", he: 'יש לך זמן? השעה אחת וחצי.' },
      { s: 'B', en: "Sí, tengo una hora. ¡Vamos!", he: 'כן, יש לי שעה. קדימה!' }
    ] }
},

/* ---------------- S7 ---------------- */
{ id: 's7', unit: 3, icon: '🔢', en: 'Números y Hora', he: 'מספרים, שעות וימים',
  goal: 'בסוף השיעור תוכל לומר שעות, מחירים וגיל - ולהבין אותם בשמיעה.',
  grammar: [
    { t: 'המספרים - קריאים בדיוק כמו שכתובים',
      p: 'הספרדית פונטית: uno, dos, tres, cuatro, cinco, seis, siete, ocho, nueve, diez. 11-15 מיוחדים: once, doce, trece, catorce, quince. מ-16: dieciséis (עשר-ושש). עשרות: veinte, treinta, cuarenta, cincuenta... וחיבור עם y: treinta y cinco = 35.',
      ex: [ ["veinte, treinta, cuarenta", "20, 30, 40"], ["cincuenta y tres", "53"], ["cien", "100"] ] },
    { t: 'מה השעה',
      p: '¿Qué hora es? = מה השעה? התשובה עם ser: Es la una (אחת - יחיד!), Son las dos/tres... (מ-2 ומעלה). וחצי: y media. ורבע: y cuarto. Son las siete y media = שבע וחצי.',
      ex: [ ["¿Qué hora es?", "מה השעה?"], ["Son las siete y media.", "השעה שבע וחצי."], ["Es la una y cuarto.", "השעה אחת ורבע."] ] },
    { t: 'ימים ומחירים',
      p: 'הימים: lunes (שני), martes, miércoles, jueves, viernes, sábado, domingo (ראשון). שים לב - השבוע הספרדי מתחיל ביום שני! מחיר: ¿Cuánto cuesta? = כמה זה עולה? Cuesta veinte euros.',
      ex: [ ["¿Cuánto cuesta?", "כמה זה עולה?"], ["Cuesta cincuenta euros.", "זה עולה חמישים אירו."], ["La reunión es el martes.", "הפגישה ביום שלישי."] ] }
  ],
  vocab: [
    { en: 'uno, dos, tres, cuatro, cinco', he: '1 עד 5', t: 'אוּנוֹ, דוֹס, טְרֶס, קוּאָטְרוֹ, סִינְקוֹ', ex: 'Tengo tres hijos.' },
    { en: 'seis, siete, ocho, nueve, diez', he: '6 עד 10', t: 'סֵייס, סְיֶטֶה, אוֹצ\'וֹ, נוּאֶבֶה, דְיֶס', ex: 'El bus llega a las diez.' },
    { en: 'once, doce, quince', he: '11, 12, 15', t: 'אוֹנְסֶה, דוֹסֶה, קִינְסֶה', ex: 'Comemos a las doce.' },
    { en: 'veinte, treinta, cuarenta', he: '20, 30, 40', t: 'בֵּיינְטֶה, טְרֵיינְטָה, קוּאָרֶנְטָה', ex: 'Tengo cuarenta años.' },
    { en: 'cincuenta, sesenta, cien', he: '50, 60, 100', t: 'סִינְקוּאֶנְטָה, סֶסֶנְטָה, סְיֶן', ex: 'Cuesta cien euros.' },
    { en: '¿qué hora es?', he: 'מה השעה?', t: 'קֶה אוֹרָה אֶס', ex: '¿Qué hora es? Son las tres.' },
    { en: 'y media', he: 'וחצי', t: 'אִי מֶדְיָה', ex: 'Son las ocho y media.' },
    { en: 'y cuarto', he: 'ורבע', t: 'אִי קוּאַרְטוֹ', ex: 'Es la una y cuarto.' },
    { en: 'lunes, martes, miércoles', he: 'שני, שלישי, רביעי', t: 'לוּנֶס, מַרְטֶס, מְיֶרְקוֹלֶס', ex: 'Trabajo el lunes.' },
    { en: 'jueves, viernes', he: 'חמישי, שישי', t: 'חוּאֶבֶס, בְּיֶרְנֶס', ex: 'La cena es el viernes.' },
    { en: 'sábado, domingo', he: 'שבת, ראשון', t: 'סָאבָּדוֹ, דוֹמִינְגוֹ', ex: 'Descanso el sábado.' },
    { en: '¿cuánto cuesta?', he: 'כמה זה עולה?', t: 'קוּאָנְטוֹ קוּאֶסְטָה', ex: '¿Cuánto cuesta el café?' }
  ],
  sentences: [
    ["Son las siete y media.", "השעה שבע וחצי."],
    ["La reunión es a las diez.", "הפגישה בשעה עשר."],
    ["Me levanto a las seis y cuarto.", "אני קם בשש ורבע."],
    ["La tienda abre a las nueve.", "החנות נפתחת בתשע."],
    ["¿Cuánto cuesta esto?", "כמה זה עולה?"],
    ["Cuesta cuarenta euros.", "זה עולה ארבעים אירו."],
    ["Hoy es jueves.", "היום יום חמישי."],
    ["Mi cumpleaños es en octubre.", "יום ההולדת שלי באוקטובר."],
    ["El vuelo es a las once y veinte.", "הטיסה באחת עשרה ועשרים."],
    ["Tengo cincuenta y tres años.", "אני בן חמישים ושלוש."]
  ],
  quiz: [
    { q: '7:30 בספרדית:', o: ['Son las siete y media.', 'Es siete treinta.', 'Son siete y mitad.', 'Las siete media son.'], a: 0, ex: 'Son las + שעה + y media.' },
    { q: 'המספר 15:', o: ['cincuenta', 'cinco', 'quince', 'diecicinco'], a: 2, ex: '15 = quince (מיוחד), 50 = cincuenta.' },
    { q: '35 בספרדית:', o: ['tres y cinco', 'treinta y cinco', 'treinta cinco y', 'cincotreinta'], a: 1, ex: 'עשרות + y + יחידות.' },
    { q: 'יום רביעי:', o: ['martes', 'jueves', 'miércoles', 'viernes'], a: 2, ex: 'miércoles = רביעי.' },
    { q: '"השעה אחת" (13:00):', o: ['Son las una.', 'Es la una.', 'Son la una.', 'Es las unas.'], a: 1, ex: 'רק לשעה אחת: Es la una (יחיד).' },
    { q: '"כמה זה עולה?":', o: ['¿Cuánto cuesta?', '¿Qué precio tú?', '¿Cómo cuesta?', '¿Dónde cuesta?'], a: 0, ex: '¿Cuánto cuesta? - שאלת הקניות.' }
  ],
  dialogue: { title: 'קביעת תור', intro: 'אתה מתקשר לקבוע תור לרופא שיניים. אתה B.',
    turns: [
      { s: 'A', en: "Buenos días, clínica del doctor Ruiz. ¿En qué puedo ayudarle?", he: 'בוקר טוב, המרפאה של ד"ר רואיס. במה אפשר לעזור?' },
      { s: 'B', en: "Buenos días. Necesito una cita, por favor.", he: 'בוקר טוב. אני צריך תור, בבקשה.' },
      { s: 'A', en: "Claro. ¿El miércoles a las tres y media está bien?", he: 'בטח. יום רביעי בשלוש וחצי בסדר?' },
      { s: 'B', en: "El miércoles no puedo. ¿Tiene el jueves?", he: 'ברביעי אני לא יכול. יש לכם חמישי?' },
      { s: 'A', en: "Sí, el jueves a las diez y cuarto.", he: 'כן, חמישי בעשר ורבע.' },
      { s: 'B', en: "Las diez y cuarto es perfecto. ¿Cuánto cuesta la revisión?", he: 'עשר ורבע זה מושלם. כמה עולה הבדיקה?' },
      { s: 'A', en: "Cuesta sesenta euros.", he: 'זה עולה שישים אירו.' },
      { s: 'B', en: "Muy bien. Gracias, ¡hasta el jueves!", he: 'מצוין. תודה, נתראה בחמישי!' }
    ] }
},

/* ---------------- S8 ---------------- */
{ id: 's8', unit: 3, icon: '🍽️', en: 'En el Restaurante', he: 'במסעדה: להזמין כמו מקומי',
  goal: 'בסוף השיעור תוכל להזמין אוכל, לבקש שינויים ולבקש חשבון - בביטחון.',
  grammar: [
    { t: 'המילה שפותחת הכול: quisiera',
      p: 'Quiero = אני רוצה (בסדר). Quisiera = הייתי רוצה (מנומס ואלגנטי). Quisiera la paella, por favor. אפשרות נוספת: Para mí... = בשבילי: Para mí, el pescado.',
      ex: [ ["Quisiera la paella, por favor.", "הייתי רוצה את הפאייה, בבקשה."], ["Para mí, el pescado.", "בשבילי, הדג."], ["¿Me trae la carta, por favor?", "תביא לי את התפריט, בבקשה?"] ] },
    { t: 'לבקש שינויים',
      p: 'sin = בלי. con = עם. en vez de = במקום. Sin cebolla = בלי בצל. שאלות חשובות: ¿Es picante? = זה חריף? ¿Qué me recomienda? = מה אתה ממליץ?',
      ex: [ ["Sin cebolla, por favor.", "בלי בצל, בבקשה."], ["Ensalada en vez de patatas.", "סלט במקום תפוחי אדמה."], ["¿Qué me recomienda?", "מה אתה ממליץ לי?"] ] },
    { t: 'סוף הארוחה',
      p: 'La cuenta, por favor = חשבון, בבקשה. Estaba delicioso / buenísimo = היה טעים. ¿Aceptan tarjeta? = מקבלים כרטיס? בספרד הטיפ לא חובה - עיגול קטן מספיק.',
      ex: [ ["La cuenta, por favor.", "חשבון, בבקשה."], ["Estaba buenísimo.", "היה מעולה."], ["¿Aceptan tarjeta?", "אתם מקבלים כרטיס?"] ] }
  ],
  vocab: [
    { en: 'la carta', he: 'התפריט', t: 'לָה קַרְטָה', ex: 'La carta, por favor.' },
    { en: 'quisiera', he: 'הייתי רוצה', t: 'קִיסְיֶרָה', ex: 'Quisiera un café.' },
    { en: 'el agua', he: 'המים', t: 'אֶל אָגוּאָה', ex: 'Un agua, por favor.' },
    { en: 'el pollo', he: 'העוף', t: 'אֶל פּוֹיוֹ', ex: 'El pollo está rico.' },
    { en: 'el pescado', he: 'הדג', t: 'אֶל פֶּסְקָאדוֹ', ex: 'El pescado es fresco.' },
    { en: 'la ensalada', he: 'הסלט', t: 'לָה אֶנְסָלָאדָה', ex: 'Una ensalada grande.' },
    { en: 'sin', he: 'בלי', t: 'סִין', ex: 'Café sin azúcar.' },
    { en: 'rico', he: 'טעים', t: 'רִיקוֹ', ex: '¡Qué rico!' },
    { en: 'la cuenta', he: 'החשבון', t: 'לָה קוּאֶנְטָה', ex: 'La cuenta, por favor.' },
    { en: 'picante', he: 'חריף', t: 'פִּיקַנְטֶה', ex: '¿Es picante?' },
    { en: 'la mesa', he: 'השולחן', t: 'לָה מֶסָה', ex: 'Una mesa para dos.' },
    { en: 'alérgico', he: 'אלרגי', t: 'אָלֶרְחִיקוֹ', ex: 'Soy alérgico a las nueces.' }
  ],
  sentences: [
    ["Una mesa para dos, por favor.", "שולחן לשניים, בבקשה."],
    ["¿Me trae la carta?", "תביא לי את התפריט?"],
    ["Quisiera el pollo, por favor.", "הייתי רוצה את העוף, בבקשה."],
    ["Sin cebolla, por favor.", "בלי בצל, בבקשה."],
    ["¿El pescado es fresco?", "הדג טרי?"],
    ["Soy alérgico a las nueces.", "אני אלרגי לאגוזים."],
    ["¿Nos trae más agua?", "תביא לנו עוד מים?"],
    ["Todo estaba buenísimo.", "הכול היה מעולה."],
    ["La cuenta, por favor.", "חשבון, בבקשה."],
    ["¿Aceptan tarjeta?", "אתם מקבלים כרטיס?"]
  ],
  quiz: [
    { q: 'הדרך המנומסת להזמין:', o: ['Dame pollo.', 'Quiero pollo ya.', 'Quisiera el pollo, por favor.', '¡Pollo!'], a: 2, ex: 'Quisiera + por favor = נימוס מלא.' },
    { q: '"בלי סוכר":', o: ['con azúcar', 'sin azúcar', 'no azúcar es', 'menos de azúcar'], a: 1, ex: 'sin = בלי.' },
    { q: 'איך מבקשים חשבון?', o: ['El dinero, por favor.', 'La cuenta, por favor.', 'El papel, por favor.', 'La lista, por favor.'], a: 1, ex: 'la cuenta = החשבון.' },
    { q: '"מה אתה ממליץ לי?":', o: ['¿Qué me recomienda?', '¿Qué tú dices?', '¿Cómo recomiendas?', '¿Dónde recomienda?'], a: 0, ex: '¿Qué me recomienda? - שאלת הזהב במסעדה.' },
    { q: '"אני אלרגי לאגוזים":', o: ['Soy alérgico a las nueces.', 'Tengo alérgico nueces.', 'Estoy nueces alérgico.', 'Las nueces son alérgicas.'], a: 0, ex: 'Soy alérgico a + הדבר.' },
    { q: '"בשבילי, הדג":', o: ['Por mí, el pescado.', 'Para mí, el pescado.', 'A mí es pescado.', 'Mi pescado para.'], a: 1, ex: 'Para mí = בשבילי (בהזמנה).' }
  ],
  dialogue: { title: 'ערב במסעדה ספרדית', intro: 'מלצר לוקח את ההזמנה שלך. אתה B.',
    turns: [
      { s: 'A', en: "¡Buenas noches! ¿Están listos para pedir?", he: 'ערב טוב! מוכנים להזמין?' },
      { s: 'B', en: "Sí. Quisiera el pescado a la plancha, por favor.", he: 'כן. הייתי רוצה את הדג על הפלנצ׳ה, בבקשה.' },
      { s: 'A', en: "Excelente elección. Viene con patatas o arroz.", he: 'בחירה מצוינת. זה מגיע עם תפוחי אדמה או אורז.' },
      { s: 'B', en: "¿Es posible una ensalada en vez de patatas?", he: 'אפשר סלט במקום תפוחי אדמה?' },
      { s: 'A', en: "Claro que sí. ¿Y para beber?", he: 'ברור שכן. ומה לשתות?' },
      { s: 'B', en: "Agua con gas, por favor. ¿El pescado es picante?", he: 'מים מוגזים, בבקשה. הדג חריף?' },
      { s: 'A', en: "No, no es picante para nada.", he: 'לא, הוא בכלל לא חריף.' },
      { s: 'B', en: "Perfecto. Eso es todo, muchas gracias.", he: 'מושלם. זה הכול, תודה רבה.' }
    ] }
},

/* ---------------- S9 ---------------- */
{ id: 's9', unit: 4, icon: '📼', en: 'Pretérito -AR', he: 'עבר: פעלי ar',
  goal: 'בסוף השיעור תוכל לספר מה עשית אתמול ובסוף השבוע.',
  grammar: [
    { t: 'הסיומות של האתמול',
      p: 'לפעלי ar בעבר: hablé (דיברתי), hablaste (דיברת), habló (הוא דיבר), hablamos (דיברנו), hablaron (הם דיברו). שים לב לסימן ההטעמה: hablé - ההטעמה בסוף!',
      ex: [ ["Trabajé hasta tarde ayer.", "עבדתי עד מאוחר אתמול."], ["Ella me llamó dos veces.", "היא התקשרה אליי פעמיים."], ["Compramos fruta en el mercado.", "קנינו פירות בשוק."] ] },
    { t: 'hablo מול habló - עולם של הבדל',
      p: 'ההטעמה משנה זמן! hablo (הטעמה בהתחלה) = אני מדבר. habló (הטעמה בסוף) = הוא דיבר. compro = אני קונה, compró = הוא קנה. תן לסימן ´ להוביל את הקול שלך.',
      ex: [ ["Hablo con mi hijo. (עכשיו)", "אני מדבר עם הבן שלי."], ["Habló con su hijo. (אתמול)", "הוא דיבר עם הבן שלו."], ["Ayer compró pan.", "אתמול הוא קנה לחם."] ] },
    { t: 'מילות זמן של עבר',
      p: 'ayer (אתמול), anoche (אמש), la semana pasada (בשבוע שעבר), hace dos días (לפני יומיים), el año pasado (בשנה שעברה).',
      ex: [ ["Te llamé ayer.", "התקשרתי אליך אתמול."], ["Anoche cenamos fuera.", "אמש אכלנו בחוץ."], ["Hace dos años compramos la casa.", "לפני שנתיים קנינו את הבית."] ] }
  ],
  vocab: [
    { en: 'ayer', he: 'אתמול', t: 'אָיֶיר', ex: 'Ayer trabajé mucho.' },
    { en: 'anoche', he: 'אמש', t: 'אָנוֹצֶ\'ה', ex: 'Anoche cenamos tarde.' },
    { en: 'la semana pasada', he: 'בשבוע שעבר', t: 'לָה סֶמָאנָה פָּסָאדָה', ex: 'Llegamos la semana pasada.' },
    { en: 'hace', he: 'לפני (זמן)', t: 'אָסֶה', ex: 'Hace dos horas.' },
    { en: 'trabajé', he: 'עבדתי', t: 'טְרָבָּחֶה', ex: 'Trabajé todo el día.' },
    { en: 'hablé', he: 'דיברתי', t: 'אַבְּלֶה', ex: 'Hablé con mi hija.' },
    { en: 'compré', he: 'קניתי', t: 'קוֹמְפְּרֶה', ex: 'Compré pan y queso.' },
    { en: 'llamé', he: 'התקשרתי', t: 'יָאמֶה', ex: 'Te llamé anoche.' },
    { en: 'cociné', he: 'בישלתי', t: 'קוֹסִינֶה', ex: 'Cociné para todos.' },
    { en: 'visité', he: 'ביקרתי', t: 'בִּיסִיטֶה', ex: 'Visité a mis padres.' },
    { en: 'caminé', he: 'הלכתי ברגל', t: 'קָמִינֶה', ex: 'Caminé por la playa.' },
    { en: 'terminé', he: 'סיימתי', t: 'טֶרְמִינֶה', ex: 'Terminé el libro.' }
  ],
  sentences: [
    ["Ayer trabajé hasta tarde.", "אתמול עבדתי עד מאוחר."],
    ["Anoche cenamos en un restaurante.", "אמש אכלנו ערב במסעדה."],
    ["Ella me llamó esta mañana.", "היא התקשרה אליי הבוקר."],
    ["Los niños jugaron en el parque.", "הילדים שיחקו בפארק."],
    ["Cociné para toda la familia.", "בישלתי לכל המשפחה."],
    ["Visitamos a mis padres el sábado.", "ביקרנו את ההורים שלי בשבת."],
    ["Caminé por la playa esta mañana.", "הלכתי על החוף הבוקר."],
    ["Terminé de trabajar a las seis.", "סיימתי לעבוד בשש."],
    ["Compré fruta en el mercado.", "קניתי פירות בשוק."],
    ["Empecé a aprender español hace un mes.", "התחלתי ללמוד ספרדית לפני חודש."]
  ],
  quiz: [
    { q: 'Yo ___ mucho ayer. (trabajar)', o: ['trabajo', 'trabajé', 'trabaja', 'trabajaste'], a: 1, ex: 'עבר, אני = trabajé.' },
    { q: 'Ella me ___ anoche. (llamar)', o: ['llama', 'llamé', 'llamó', 'llamas'], a: 2, ex: 'עבר, היא = llamó (הטעמה בסוף).' },
    { q: 'ההבדל בין hablo ל-habló:', o: ['אין הבדל', 'זמן: הווה מול עבר', 'גוף: אני מול אתה', 'רבים מול יחיד'], a: 1, ex: 'hablo = אני מדבר, habló = הוא דיבר.' },
    { q: '"לפני שלוש שנים":', o: ['antes tres años', 'hace tres años', 'tres años hace', 'pasado tres años'], a: 1, ex: 'hace + זמן = לפני.' },
    { q: 'Nosotros ___ fruta. (comprar, עבר)', o: ['compramos', 'compraron', 'compré', 'compras'], a: 0, ex: 'קנינו = compramos.' },
    { q: '"אמש" בספרדית:', o: ['ayer', 'anoche', 'mañana', 'tarde'], a: 1, ex: 'anoche = אמש, אתמול בלילה.' }
  ],
  dialogue: { title: 'איך היה סוף השבוע?', intro: 'קולגה שואל על סוף השבוע. אתה B.',
    turns: [
      { s: 'A', en: "¡Buenos días! ¿Qué tal el fin de semana?", he: 'בוקר טוב! איך היה סוף השבוע?' },
      { s: 'B', en: "¡Genial! Visitamos a mi hermano en el norte.", he: 'מעולה! ביקרנו את אח שלי בצפון.' },
      { s: 'A', en: "¡Qué bien! ¿Qué hicieron allí?", he: 'איזה יופי! מה עשיתם שם?' },
      { s: 'B', en: "Caminamos por las montañas y cocinamos juntos.", he: 'טיילנו בהרים ובישלנו ביחד.' },
      { s: 'A', en: "Suena perfecto. ¿Y el tiempo?", he: 'נשמע מושלם. ומזג האוויר?' },
      { s: 'B', en: "Fantástico. Pasamos todo el día fuera.", he: 'פנטסטי. בילינו את כל היום בחוץ.' },
      { s: 'A', en: "Yo me quedé en casa todo el fin de semana.", he: 'אני נשארתי בבית כל הסופ"ש.' },
      { s: 'B', en: "¡A veces eso es exactamente lo que necesitas!", he: 'לפעמים זה בדיוק מה שצריך!' }
    ] }
},

/* ---------------- S10 ---------------- */
{ id: 's10', unit: 4, icon: '🎬', en: 'Pretérito: Irregulares', he: 'עבר: er/ir והחריגים הגדולים',
  goal: 'בסוף השיעור תשלוט בפעלים החריגים שמופיעים בכל סיפור.',
  grammar: [
    { t: 'פעלי er ו-ir בעבר',
      p: 'סיומות משותפות: comí (אכלתי), comiste, comió, comimos, comieron. vivir: viví, viviste, vivió... קל וצפוי.',
      ex: [ ["Comí demasiado.", "אכלתי יותר מדי."], ["Ella vivió en Madrid.", "היא גרה במדריד."], ["Bebimos un vino excelente.", "שתינו יין מצוין."] ] },
    { t: 'הכוכבים החריגים',
      p: 'ir (ללכת) והפלא: fui (הלכתי) - וגם "הייתי"! fue = הוא הלך / זה היה. hacer: hice (עשיתי), hizo. tener: tuve (היה לי). estar: estuve. ver: vi (ראיתי), vio.',
      ex: [ ["Fui al médico.", "הלכתי לרופא."], ["Fue un día perfecto.", "זה היה יום מושלם."], ["¿Qué hiciste ayer?", "מה עשית אתמול?"] ] },
    { t: 'שישה שתלמד בעל פה',
      p: 'fui (הלכתי/הייתי), hice (עשיתי), tuve (היה לי), estuve (הייתי ב-, שהיתי), vi (ראיתי), dije (אמרתי). אלה חוזרים בכל שיחה על העבר.',
      ex: [ ["Tuve un día muy ocupado.", "היה לי יום מאוד עמוס."], ["Vi a tus padres ayer.", "ראיתי את ההורים שלך אתמול."], ["Estuve en casa toda la tarde.", "הייתי בבית כל אחר הצהריים."] ] }
  ],
  vocab: [
    { en: 'fui', he: 'הלכתי / הייתי', t: 'פוּאִי', ex: 'Fui al mercado.' },
    { en: 'fue', he: 'הוא הלך / זה היה', t: 'פוּאֶה', ex: 'Fue un buen día.' },
    { en: 'hice', he: 'עשיתי', t: 'אִיסֶה', ex: 'Hice la cena.' },
    { en: 'tuve', he: 'היה לי', t: 'טוּבֶה', ex: 'Tuve una reunión.' },
    { en: 'estuve', he: 'הייתי (במקום/מצב)', t: 'אֶסְטוּבֶה', ex: 'Estuve en casa.' },
    { en: 'vi', he: 'ראיתי', t: 'בִּי', ex: 'Vi la película.' },
    { en: 'dije', he: 'אמרתי', t: 'דִיחֶה', ex: 'Dije la verdad.' },
    { en: 'comí', he: 'אכלתי', t: 'קוֹמִי', ex: 'Comí paella.' },
    { en: 'bebí', he: 'שתיתי', t: 'בֶּבִּי', ex: 'Bebí mucha agua.' },
    { en: 'salí', he: 'יצאתי', t: 'סָלִי', ex: 'Salí con amigos.' },
    { en: 'llegué', he: 'הגעתי', t: 'יֶגֶה', ex: 'Llegué tarde.' },
    { en: 'conocí', he: 'הכרתי (לראשונה)', t: 'קוֹנוֹסִי', ex: 'Conocí a una persona interesante.' }
  ],
  sentences: [
    ["Fui al mercado esta mañana.", "הלכתי לשוק הבוקר."],
    ["Vimos a nuestros amigos el viernes.", "ראינו את החברים שלנו בשישי."],
    ["Tuve un día muy ocupado.", "היה לי יום מאוד עמוס."],
    ["Hice una cena increíble.", "הכנתי ארוחת ערב מדהימה."],
    ["¡Comimos demasiado!", "אכלנו יותר מדי!"],
    ["Estuve dos horas en el coche.", "הייתי שעתיים באוטו."],
    ["Salí de casa a las siete.", "יצאתי מהבית בשבע."],
    ["Llegué tarde a la reunión.", "הגעתי מאוחר לפגישה."],
    ["Vinieron a visitarnos.", "הם באו לבקר אותנו."],
    ["Fue un día perfecto.", "זה היה יום מושלם."]
  ],
  quiz: [
    { q: 'העבר של voy (אני הולך):', o: ['fui', 'iba', 'fue', 'voy'], a: 0, ex: 'ir בעבר: fui.' },
    { q: 'Yo ___ una película anoche. (ver)', o: ['veo', 'vio', 'vi', 'ves'], a: 2, ex: 'ראיתי = vi.' },
    { q: '"זה היה יום יפה":', o: ['Es un día bonito.', 'Fue un día bonito.', 'Era ser bonito.', 'Fui un día bonito.'], a: 1, ex: 'זה היה = fue.' },
    { q: '¿Qué ___ ayer? (מה עשית?)', o: ['haces', 'hizo', 'hiciste', 'hice'], a: 2, ex: 'עשית = hiciste.' },
    { q: 'Yo ___ paella. (comer, עבר)', o: ['comí', 'comió', 'como', 'comiste'], a: 0, ex: 'אכלתי = comí.' },
    { q: '"היה לי יום עמוס":', o: ['Tengo un día ocupado.', 'Tuve un día ocupado.', 'Fui un día ocupado.', 'Hice un día ocupado.'], a: 1, ex: 'היה לי = tuve.' }
  ],
  dialogue: { title: 'מה עשית אתמול?', intro: 'חבר מתקשר לשמוע מה נשמע. אתה B.',
    turns: [
      { s: 'A', en: "¡Hola! Te llamé ayer, pero no contestaste.", he: 'היי! התקשרתי אליך אתמול, אבל לא ענית.' },
      { s: 'B', en: "¡Perdón! Tuve un día de locos. Fui a Jerusalén y volví.", he: 'סליחה! היה לי יום מטורף. נסעתי לירושלים וחזרתי.' },
      { s: 'A', en: "¡Vaya! ¿Por qué fuiste?", he: 'וואו! למה נסעת?' },
      { s: 'B', en: "Mi hija recibió un apartamento nuevo. Le llevamos unos muebles.", he: 'הבת שלי קיבלה דירה חדשה. הבאנו לה רהיטים.' },
      { s: 'A', en: "¡Qué buena noticia! ¿Cómo es el apartamento?", he: 'איזה חדשות טובות! איך הדירה?' },
      { s: 'B', en: "Precioso. Vimos toda la ciudad desde su ventana.", he: 'יפהפייה. ראינו את כל העיר מהחלון שלה.' },
      { s: 'A', en: "Increíble. ¿Llegaste tarde a casa?", he: 'מדהים. הגעת מאוחר הביתה?' },
      { s: 'B', en: "Muy tarde. Pero fue un día perfecto.", he: 'מאוד מאוחר. אבל זה היה יום מושלם.' }
    ] }
},

/* ---------------- S11 ---------------- */
{ id: 's11', unit: 4, icon: '📖', en: 'Contar una Historia', he: 'לספר סיפור: מילות רצף',
  goal: 'בסוף השיעור תוכל לספר סיפור שלם עם התחלה, אמצע וסוף.',
  grammar: [
    { t: 'השלד של כל סיפור',
      p: 'primero (קודם), luego (אז), después (אחר כך), de repente (פתאום), al final (בסוף), por suerte (למזל). עם שש המילים האלה כל רצף אירועים הופך לסיפור.',
      ex: [ ["Primero fui al banco.", "קודם הלכתי לבנק."], ["Luego comí con un amigo.", "אז אכלתי עם חבר."], ["De repente, empezó a llover.", "פתאום התחיל לרדת גשם."] ] },
    { t: 'שאלות על העבר',
      p: 'בלי מילות עזר - רק הפועל בעבר: ¿Qué hiciste? = מה עשית? ¿Adónde fuiste? = לאן הלכת? ¿Qué pasó? = מה קרה? (השאלה החשובה בכל דרמה).',
      ex: [ ["¿Qué pasó?", "מה קרה?"], ["¿Adónde fuiste?", "לאן הלכת?"], ["¿Dormiste bien?", "ישנת טוב?"] ] },
    { t: 'תגובות של מאזין טוב',
      p: '¿En serio? (ברצינות?), ¡No me digas! (מה אתה אומר!), ¿Y luego qué? (ואז מה?), ¡Qué suerte! (איזה מזל!), ¡Qué pena! (איזה באסה!).',
      ex: [ ["¿En serio? ¿Qué pasó?", "ברצינות? מה קרה?"], ["¡No me digas!", "מה אתה אומר!"], ["¿Y luego qué?", "ואז מה?"] ] }
  ],
  vocab: [
    { en: 'primero', he: 'קודם, ראשית', t: 'פְּרִימֶרוֹ', ex: 'Primero, desayuné.' },
    { en: 'luego', he: 'אז, אחר כך', t: 'לוּאֶגוֹ', ex: 'Luego fui al trabajo.' },
    { en: 'después', he: 'אחרי זה', t: 'דֶסְפּוּאֶס', ex: 'Después comimos.' },
    { en: 'de repente', he: 'פתאום', t: 'דֶה רֶפֶּנְטֶה', ex: 'De repente, llovió.' },
    { en: 'al final', he: 'בסוף', t: 'אַל פִינָאל', ex: 'Al final, todo salió bien.' },
    { en: 'por suerte', he: 'למזל', t: 'פּוֹר סוּאֶרְטֶה', ex: 'Por suerte, nadie se hizo daño.' },
    { en: 'pasó', he: 'קרה', t: 'פָּסוֹ', ex: '¿Qué pasó?' },
    { en: 'perdí', he: 'איבדתי', t: 'פֶּרְדִי', ex: 'Perdí las llaves.' },
    { en: 'encontré', he: 'מצאתי', t: 'אֶנְקוֹנְטְרֶה', ex: '¡Las encontré!' },
    { en: 'olvidé', he: 'שכחתי', t: 'אוֹלְבִּידֶה', ex: 'Olvidé el teléfono.' },
    { en: 'la historia', he: 'הסיפור', t: 'לָה אִיסְטוֹרְיָה', ex: 'Es una historia divertida.' },
    { en: '¿en serio?', he: 'ברצינות?', t: 'אֶן סֶרְיוֹ', ex: '¿En serio? ¡No me digas!' }
  ],
  sentences: [
    ["¿Dormiste bien?", "ישנת טוב?"],
    ["¿Qué hiciste ayer?", "מה עשית אתמול?"],
    ["Primero, fui al médico.", "קודם הלכתי לרופא."],
    ["Luego, tomé un café con un amigo.", "אחר כך שתיתי קפה עם חבר."],
    ["De repente, empezó a llover.", "פתאום התחיל לרדת גשם."],
    ["Olvidé el paraguas en casa.", "שכחתי את המטרייה בבית."],
    ["Por suerte, mi amigo me llevó a casa.", "למזלי, החבר שלי הסיע אותי הביתה."],
    ["Perdí las llaves la semana pasada.", "איבדתי את המפתחות בשבוע שעבר."],
    ["Al final, las encontré en el abrigo.", "בסוף מצאתי אותם במעיל."],
    ["¡No vas a creer lo que pasó!", "לא תאמין מה קרה!"]
  ],
  quiz: [
    { q: '"מה קרה?":', o: ['¿Qué pasa?', '¿Qué pasó?', '¿Qué es pasar?', '¿Cómo pasó qué?'], a: 1, ex: '¿Qué pasó? - בעבר.' },
    { q: '"פתאום" בספרדית:', o: ['al final', 'primero', 'de repente', 'a veces'], a: 2, ex: 'de repente = פתאום.' },
    { q: 'סדר נכון לסיפור:', o: ['luego, primero, al final', 'primero, luego, al final', 'al final, luego, primero', 'primero, al final, luego'], a: 1, ex: 'קודם, אז, בסוף.' },
    { q: '"לאן הלכת?":', o: ['¿Adónde fuiste?', '¿Dónde vas?', '¿Adónde fui?', '¿Qué fuiste?'], a: 0, ex: '¿Adónde fuiste? - עבר, אתה.' },
    { q: '"למזל":', o: ['por suerte', 'de pena', 'con final', 'a la vez'], a: 0, ex: 'por suerte = למזל.' },
    { q: 'תגובה נלהבת לסיפור:', o: ['No entiendo.', '¡No me digas!', 'La cuenta.', 'Más despacio.'], a: 1, ex: '¡No me digas! = מה אתה אומר!' }
  ],
  dialogue: { title: 'הסיפור על המפתחות', intro: 'אתה מספר לחבר מה קרה לך אתמול. אתה B.',
    turns: [
      { s: 'A', en: "Pareces cansado. ¿Qué pasó ayer?", he: 'אתה נראה עייף. מה קרה אתמול?' },
      { s: 'B', en: "¡Qué día! Primero, perdí las llaves del coche.", he: 'איזה יום! קודם כול, איבדתי את מפתחות האוטו.' },
      { s: 'A', en: "¡No me digas! ¿Dónde buscaste?", he: 'מה אתה אומר! איפה חיפשת?' },
      { s: 'B', en: "¡Por todas partes! Luego llamé a mi mujer, pero no contestó.", he: 'בכל מקום! אז התקשרתי לאשתי, אבל היא לא ענתה.' },
      { s: 'A', en: "¿Y qué hiciste?", he: 'ומה עשית?' },
      { s: 'B', en: "Tomé un taxi al trabajo. Después, mi mujer me llamó.", he: 'לקחתי מונית לעבודה. אחרי זה, אשתי התקשרה אליי.' },
      { s: 'A', en: "¿Y? ¿Encontró las llaves?", he: 'ו...? היא מצאה את המפתחות?' },
      { s: 'B', en: "¡Sí! Al final, las encontró... ¡en la lavadora!", he: 'כן! בסוף היא מצאה אותם... במכונת הכביסה!' }
    ] }
},

/* ---------------- S12 ---------------- */
{ id: 's12', unit: 5, icon: '🔮', en: 'El Futuro: Ir a', he: 'עתיד: תוכניות עם ir a',
  goal: 'בסוף השיעור תוכל לדבר על תוכניות ולתכנן בקול רם.',
  grammar: [
    { t: 'הנוסחה הפשוטה: voy a + פועל',
      p: 'העתיד המדובר בספרדית: הטיה של ir + a + שם פועל. Voy a viajar = אני הולך לטייל / אטייל. Vamos a comer = אנחנו הולכים לאכול. זה מכסה 90 אחוז מהשיחות על העתיד.',
      ex: [ ["Voy a visitar a mi hijo el viernes.", "אני הולך לבקר את הבן שלי בשישי."], ["Vamos a vender el coche.", "אנחנו הולכים למכור את האוטו."], ["Ella va a empezar un trabajo nuevo.", "היא עומדת להתחיל עבודה חדשה."] ] },
    { t: 'מילות עתיד',
      p: 'mañana (מחר), la próxima semana (בשבוע הבא), el mes que viene (בחודש הבא), pronto (בקרוב), este fin de semana (בסופ"ש הזה).',
      ex: [ ["Mañana voy a descansar.", "מחר אני הולך לנוח."], ["Pronto vamos a viajar.", "בקרוב אנחנו נוסעים לטייל."], ["El mes que viene empiezo un curso.", "בחודש הבא אני מתחיל קורס."] ] },
    { t: 'הבטחות וניחושים קטנים',
      p: 'להבטחה מהירה אפשר גם הווה: Te llamo mañana = אתקשר אליך מחר (מילולית: אני מתקשר). ולתחזית: Va a llover = הולך לרדת גשם. Todo va a salir bien = הכול יסתדר.',
      ex: [ ["Te llamo mañana.", "אתקשר אליך מחר."], ["Va a llover.", "הולך לרדת גשם."], ["Todo va a salir bien.", "הכול יסתדר."] ] }
  ],
  vocab: [
    { en: 'mañana', he: 'מחר / בוקר', t: 'מָנְיָאנָה', ex: 'Hasta mañana.' },
    { en: 'la próxima semana', he: 'בשבוע הבא', t: 'לָה פְּרוֹקְסִימָה סֶמָאנָה', ex: 'La fiesta es la próxima semana.' },
    { en: 'pronto', he: 'בקרוב', t: 'פְּרוֹנְטוֹ', ex: 'Hasta pronto.' },
    { en: 'el plan', he: 'התוכנית', t: 'אֶל פְּלָאן', ex: '¿Cuál es el plan?' },
    { en: 'el viaje', he: 'הטיול, הנסיעה', t: 'אֶל בְּיָאחֶה', ex: 'Planeamos un viaje.' },
    { en: 'voy a', he: 'אני הולך ל-', t: 'בּוֹי אָה', ex: 'Voy a descansar.' },
    { en: 'vamos a', he: 'אנחנו הולכים ל-', t: 'בָּאמוֹס אָה', ex: 'Vamos a viajar.' },
    { en: 'quizás', he: 'אולי', t: 'קִיסָאס', ex: 'Quizás vamos al cine.' },
    { en: 'seguro', he: 'בטוח', t: 'סֶגוּרוֹ', ex: 'Seguro que sí.' },
    { en: 'el fin de semana', he: 'סוף השבוע', t: 'אֶל פִין דֶה סֶמָאנָה', ex: '¡Buen fin de semana!' },
    { en: 'descansar', he: 'לנוח', t: 'דֶסְקַנְסָאר', ex: 'Voy a descansar.' },
    { en: 'salir', he: 'לצאת', t: 'סָלִיר', ex: 'Vamos a salir esta noche.' }
  ],
  sentences: [
    ["Voy a visitar a mi familia el sábado.", "אני הולך לבקר את המשפחה בשבת."],
    ["Vamos a viajar el mes que viene.", "אנחנו נוסעים לטייל בחודש הבא."],
    ["Te llamo en cinco minutos.", "אחזור אליך בעוד חמש דקות."],
    ["No te preocupes, todo va a salir bien.", "אל תדאג, הכול יסתדר."],
    ["¿Qué vas a hacer este fin de semana?", "מה אתה הולך לעשות בסוף השבוע?"],
    ["Quizás va a llover mañana.", "אולי ירד גשם מחר."],
    ["Voy a descansar un poco.", "אני הולך לנוח קצת."],
    ["Ella va a empezar un trabajo nuevo.", "היא עומדת להתחיל עבודה חדשה."],
    ["Vas a amar este lugar.", "אתה תאהב את המקום הזה."],
    ["Nos vemos la próxima semana.", "נתראה בשבוע הבא."]
  ],
  quiz: [
    { q: '"אני הולך לנוח":', o: ['Voy descansar.', 'Voy a descansar.', 'Voy a descanso.', 'A descansar voy yo.'], a: 1, ex: 'voy + a + שם פועל.' },
    { q: 'Nosotros ___ a viajar.', o: ['voy', 'va', 'vamos', 'van'], a: 2, ex: 'אנחנו = vamos a.' },
    { q: '"הולך לרדת גשם":', o: ['Va a llover.', 'Llueve va.', 'Ir a llover.', 'Va llover a.'], a: 0, ex: 'Va a llover - תחזית.' },
    { q: '"בשבוע הבא":', o: ['la semana pasada', 'la próxima semana', 'cada semana', 'una semana'], a: 1, ex: 'próxima = הבאה.' },
    { q: 'Ella ___ a empezar un curso.', o: ['voy', 'vas', 'va', 'vamos'], a: 2, ex: 'היא = va a.' },
    { q: '"הכול יסתדר":', o: ['Todo va a salir bien.', 'Todo sale fue bien.', 'Bien va todo salir.', 'Todo es bien va.'], a: 0, ex: 'משפט ההרגעה הלאומי של ספרד.' }
  ],
  dialogue: { title: 'תוכניות לסוף השבוע', intro: 'שכן שואל על התוכניות שלך. אתה B.',
    turns: [
      { s: 'A', en: "¿Tienes planes para el fin de semana?", he: 'יש לך תוכניות לסוף השבוע?' },
      { s: 'B', en: "¡Sí! Vamos a viajar al norte el viernes.", he: 'כן! אנחנו נוסעים צפונה בשישי.' },
      { s: 'A', en: "¡Qué bien! ¿Dónde vais a dormir?", he: 'איזה יופי! איפה אתם הולכים לישון?' },
      { s: 'B', en: "En un hotel pequeño cerca del lago.", he: 'במלון קטן ליד האגם.' },
      { s: 'A', en: "Suena precioso. El tiempo va a ser perfecto.", he: 'נשמע מקסים. מזג האוויר הולך להיות מושלם.' },
      { s: 'B', en: "¡Eso espero! ¿Y tú? ¿Qué vas a hacer?", he: 'אני מקווה! ואתה? מה אתה הולך לעשות?' },
      { s: 'A', en: "Nada especial. Quizás voy a visitar a mi madre.", he: 'שום דבר מיוחד. אולי אבקר את אמא שלי.' },
      { s: 'B', en: "Muy bien. ¡Te voy a traer queso del norte!", he: 'יפה מאוד. אביא לך גבינה מהצפון!' }
    ] }
},

/* ---------------- S13 ---------------- */
{ id: 's13', unit: 5, icon: '✈️', en: 'Español para Viajar', he: 'ספרדית לנסיעות: שדה תעופה ומלון',
  goal: 'בסוף השיעור תוכל לעבור צ׳ק-אין, להתמצא ולהסתדר במלון.',
  grammar: [
    { t: 'לשאול איך מגיעים',
      p: '¿Cómo llego a...? = איך אני מגיע ל...? התשובות: todo recto (ישר), a la derecha (ימינה), a la izquierda (שמאלה), al lado de (ליד), en la esquina (בפינה).',
      ex: [ ["¿Cómo llego a la estación?", "איך אני מגיע לתחנה?"], ["Todo recto y a la derecha.", "ישר ואז ימינה."], ["Está al lado del banco.", "זה ליד הבנק."] ] },
    { t: 'בשדה התעופה',
      p: 'el vuelo = הטיסה. la puerta de embarque = שער העלייה. la maleta = המזוודה. la tarjeta de embarque = כרטיס העלייה. con retraso = באיחור. a tiempo = בזמן.',
      ex: [ ["Aquí está mi pasaporte.", "הנה הדרכון שלי."], ["¿Cuál es la puerta?", "מה השער?"], ["¿El vuelo sale a tiempo?", "הטיסה יוצאת בזמן?"] ] },
    { t: 'במלון',
      p: 'Tengo una reserva = יש לי הזמנה. a nombre de... = על שם... ¿El desayuno está incluido? = ארוחת הבוקר כלולה? La llave no funciona = המפתח לא עובד.',
      ex: [ ["Tengo una reserva a nombre de Cohen.", "יש לי הזמנה על שם כהן."], ["¿A qué hora es la salida?", "באיזו שעה העזיבה?"], ["¿El desayuno está incluido?", "ארוחת הבוקר כלולה?"] ] }
  ],
  vocab: [
    { en: 'el pasaporte', he: 'הדרכון', t: 'אֶל פָּסָפּוֹרְטֶה', ex: 'Aquí está mi pasaporte.' },
    { en: 'el vuelo', he: 'הטיסה', t: 'אֶל בּוּאֶלוֹ', ex: 'El vuelo sale a las doce.' },
    { en: 'la maleta', he: 'המזוודה', t: 'לָה מָלֶטָה', ex: 'Mi maleta es azul.' },
    { en: 'la reserva', he: 'ההזמנה', t: 'לָה רֶסֶרְבָּה', ex: 'Tengo una reserva.' },
    { en: 'todo recto', he: 'ישר', t: 'טוֹדוֹ רֶקְטוֹ', ex: 'Siga todo recto.' },
    { en: 'a la derecha', he: 'ימינה', t: 'אָה לָה דֶרֶצָ\'ה', ex: 'Gire a la derecha.' },
    { en: 'a la izquierda', he: 'שמאלה', t: 'אָה לָה אִיסְקְיֶרְדָה', ex: 'El hotel está a la izquierda.' },
    { en: 'lejos', he: 'רחוק', t: 'לֶחוֹס', ex: '¿Está lejos de aquí?' },
    { en: 'el billete', he: 'הכרטיס', t: 'אֶל בִּייֶטֶה', ex: 'Dos billetes, por favor.' },
    { en: 'incluido', he: 'כלול', t: 'אִינְקְלוּאִידוֹ', ex: 'El desayuno está incluido.' },
    { en: 'la llave', he: 'המפתח', t: 'לָה יָאבֶה', ex: 'La llave de la habitación.' },
    { en: 'la ayuda', he: 'העזרה', t: 'לָה אָיוּדָה', ex: '¿Me puede ayudar?' }
  ],
  sentences: [
    ["Perdone, ¿cómo llego a la puerta B7?", "סליחה, איך אני מגיע לשער B7?"],
    ["Siga todo recto y gire a la izquierda.", "המשך ישר ופנה שמאלה."],
    ["¿El vuelo sale a tiempo?", "הטיסה יוצאת בזמן?"],
    ["Tengo una reserva a nombre de Cohen.", "יש לי הזמנה על שם כהן."],
    ["¿A qué hora es el desayuno?", "באיזו שעה ארוחת הבוקר?"],
    ["La llave no funciona.", "המפתח לא עובד."],
    ["¿Dónde puedo encontrar un taxi?", "איפה אפשר למצוא מונית?"],
    ["¿Cuánto cuesta un billete al centro?", "כמה עולה כרטיס למרכז?"],
    ["¿Está lejos de aquí?", "זה רחוק מכאן?"],
    ["¿Me puede ayudar con la maleta?", "אפשר לעזור לי עם המזוודה?"]
  ],
  quiz: [
    { q: '"איך אני מגיע לתחנה?":', o: ['¿Cómo llego a la estación?', '¿Dónde es llegar estación?', '¿Qué llega la estación?', '¿Cuándo estación llego?'], a: 0, ex: '¿Cómo llego a + מקום?' },
    { q: '"פנה ימינה":', o: ['a la izquierda', 'todo recto', 'a la derecha', 'al lado'], a: 2, ex: 'derecha = ימין.' },
    { q: 'המזוודה:', o: ['el bolso', 'la maleta', 'el paquete', 'la caja'], a: 1, ex: 'la maleta = מזוודה.' },
    { q: '"יש לי הזמנה":', o: ['Tengo una reserva.', 'Soy una reserva.', 'Hay mi reserva.', 'Estoy reservado yo.'], a: 0, ex: 'Tengo una reserva - משפט הזהב במלון.' },
    { q: '"ארוחת הבוקר כלולה?":', o: ['¿El desayuno incluye?', '¿El desayuno está incluido?', '¿Incluido es desayuno?', '¿Hay desayuno incluir?'], a: 1, ex: '¿Está incluido?' },
    { q: 'הטיסה באיחור. El vuelo sale ___', o: ['a tiempo', 'con retraso', 'temprano', 'ahora'], a: 1, ex: 'con retraso = באיחור.' }
  ],
  dialogue: { title: 'צ׳ק-אין במלון במדריד', intro: 'הגעת למלון אחרי טיסה ארוכה. אתה B.',
    turns: [
      { s: 'A', en: "¡Buenas noches, bienvenido! ¿En qué puedo ayudarle?", he: 'ערב טוב, ברוך הבא! במה אפשר לעזור?' },
      { s: 'B', en: "Buenas noches. Tengo una reserva a nombre de Cohen.", he: 'ערב טוב. יש לי הזמנה על שם כהן.' },
      { s: 'A', en: "Sí, aquí está. Una habitación doble para tres noches.", he: 'כן, הנה היא. חדר זוגי לשלושה לילות.' },
      { s: 'B', en: "Correcto. ¿El desayuno está incluido?", he: 'נכון. ארוחת הבוקר כלולה?' },
      { s: 'A', en: "Sí, de siete a diez, en la primera planta.", he: 'כן, משבע עד עשר, בקומה הראשונה.' },
      { s: 'B', en: "Perfecto. ¿Y a qué hora es la salida?", he: 'מושלם. ובאיזו שעה העזיבה?' },
      { s: 'A', en: "La salida es a las once. Aquí tiene su llave, habitación 304.", he: 'העזיבה באחת עשרה. הנה המפתח, חדר 304.' },
      { s: 'B', en: "Muchas gracias. ¡Buenas noches!", he: 'תודה רבה. לילה טוב!' }
    ] }
},

/* ---------------- S14 ---------------- */
{ id: 's14', unit: 5, icon: '🤝', en: 'Cortesía', he: 'בקשות בנימוס: podría, perdone',
  goal: 'בסוף השיעור תדע לבקש, להציע ולהתנצל - כמו ג׳נטלמן ספרדי.',
  grammar: [
    { t: 'סולם הנימוס',
      p: '¿Puedes...? = אתה יכול? (חברי). ¿Puede...? = אתם/אדוני יכול? (מנומס). ¿Podría...? = האם תוכל? (הכי מנומס). ותמיד: por favor.',
      ex: [ ["¿Puedes abrir la ventana?", "אתה יכול לפתוח את החלון?"], ["¿Puede hablar más despacio?", "תוכל לדבר יותר לאט?"], ["¿Podría ayudarme, por favor?", "האם תוכל לעזור לי, בבקשה?"] ] },
    { t: 'להציע ולהגיש',
      p: '¿Quiere...? = תרצה? (מנומס). Aquí tiene = בבקשה (כשנותנים משהו). Con mucho gusto = בשמחה רבה.',
      ex: [ ["¿Quiere un café?", "תרצה קפה?"], ["Aquí tiene.", "בבקשה, קח."], ["Con mucho gusto.", "בשמחה רבה."] ] },
    { t: 'Perdone מול Lo siento',
      p: 'Perdone (או Disculpe) = סליחה לפני שמפריעים. Lo siento = אני מצטער (אחרי שמשהו קרה). De nada = על לא דבר. No pasa nada = הכול בסדר, לא קרה כלום.',
      ex: [ ["Perdone, ¿dónde está el ascensor?", "סליחה, איפה המעלית?"], ["Lo siento, llego tarde.", "מצטער, אני מאחר."], ["No pasa nada.", "שום דבר לא קרה."] ] }
  ],
  vocab: [
    { en: 'por favor', he: 'בבקשה (בבקשות)', t: 'פּוֹר פָבוֹר', ex: 'Un café, por favor.' },
    { en: 'podría', he: 'האם תוכל', t: 'פּוֹדְרִיָה', ex: '¿Podría repetir?' },
    { en: 'quiere', he: 'תרצה (מנומס)', t: 'קְיֶרֶה', ex: '¿Quiere agua?' },
    { en: 'perdone', he: 'סליחה (לפני)', t: 'פֶּרְדוֹנֶה', ex: 'Perdone, ¿está libre?' },
    { en: 'lo siento', he: 'אני מצטער', t: 'לוֹ סְיֶנְטוֹ', ex: 'Lo siento mucho.' },
    { en: 'de nada', he: 'על לא דבר', t: 'דֶה נָאדָה', ex: 'Gracias. — De nada.' },
    { en: 'no pasa nada', he: 'לא קרה כלום', t: 'נוֹ פָּאסָה נָאדָה', ex: 'Tranquilo, no pasa nada.' },
    { en: 'claro', he: 'ברור, כמובן', t: 'קְלָארוֹ', ex: '¡Claro que sí!' },
    { en: 'un momento', he: 'רגע אחד', t: 'אוּן מוֹמֶנְטוֹ', ex: 'Un momento, por favor.' },
    { en: 'el favor', he: 'הטובה', t: 'אֶל פָבוֹר', ex: '¿Me haces un favor?' },
    { en: 'amable', he: 'אדיב', t: 'אָמָאבְּלֶה', ex: 'Es usted muy amable.' },
    { en: 'aquí tiene', he: 'בבקשה (הנה)', t: 'אָקִי טְיֶנֶה', ex: 'Aquí tiene su llave.' }
  ],
  sentences: [
    ["¿Podría ayudarme, por favor?", "האם תוכל לעזור לי, בבקשה?"],
    ["¿Puede hablar más despacio?", "תוכל לדבר יותר לאט?"],
    ["¿Quiere algo de beber?", "תרצה משהו לשתות?"],
    ["Perdone, ¿está libre este asiento?", "סליחה, המקום הזה פנוי?"],
    ["Lo siento, no le escuché.", "סליחה, לא שמעתי אותך."],
    ["¿Me hace un favor?", "תעשה לי טובה?"],
    ["Le ayudo con las bolsas.", "אני אעזור לך עם התיקים."],
    ["Muchas gracias por su ayuda.", "תודה רבה על העזרה."],
    ["De nada, con mucho gusto.", "על לא דבר, בשמחה."],
    ["Un momento, por favor.", "רק רגע, בבקשה."]
  ],
  quiz: [
    { q: 'הבקשה הכי מנומסת:', o: ['¡Abre la ventana!', '¿Abres?', '¿Podría abrir la ventana, por favor?', 'Ventana. Ahora.'], a: 2, ex: 'Podría + por favor = נימוס מלא.' },
    { q: 'להציע קפה בנימוס:', o: ['¿Café tú?', '¿Quiere un café?', '¿Das café?', '¿Café es?'], a: 1, ex: '¿Quiere...? = הצעה מנומסת.' },
    { q: 'לפני שמפריעים אומרים:', o: ['Lo siento', 'Perdone', 'De nada', 'Adiós'], a: 1, ex: 'Perdone לפני, Lo siento אחרי.' },
    { q: 'עונים ל-Gracias:', o: ['De nada.', 'Sí mucho.', 'Yo también.', 'Claro tú.'], a: 0, ex: 'De nada = על לא דבר.' },
    { q: '"מצטער שאיחרתי":', o: ['Perdone tarde.', 'Lo siento, llego tarde.', 'Tarde soy siento.', 'De nada tarde.'], a: 1, ex: 'Lo siento - התנצלות.' },
    { q: '"לא קרה כלום" (זה בסדר):', o: ['No hay de qué pasar.', 'No pasa nada.', 'Nada es pasado.', 'Pasa que no.'], a: 1, ex: 'No pasa nada - משפט הרוגע הספרדי.' }
  ],
  dialogue: { title: 'עזרה ברחוב', intro: 'תיירת מבקשת ממך עזרה - והפעם אתה זה שעוזר. אתה B.',
    turns: [
      { s: 'A', en: "Perdone, ¿podría ayudarme? Estoy un poco perdida.", he: 'סליחה, תוכל לעזור לי? קצת הלכתי לאיבוד.' },
      { s: 'B', en: "¡Claro que sí! ¿Adónde quiere ir?", he: 'בטח! לאן את רוצה להגיע?' },
      { s: 'A', en: "Busco el mercado del Carmelo.", he: 'אני מחפשת את שוק הכרמל.' },
      { s: 'B', en: "No hay problema. Siga todo recto y gire a la derecha en la segunda calle.", he: 'אין בעיה. ישר ואז ימינה ברחוב השני.' },
      { s: 'A', en: "Todo recto y luego a la derecha. ¿Está lejos?", he: 'ישר ואז ימינה. זה רחוק?' },
      { s: 'B', en: "Para nada, unos cinco minutos a pie.", he: 'ממש לא, בערך חמש דקות ברגל.' },
      { s: 'A', en: "¡Muchísimas gracias! Es usted muy amable.", he: 'תודה רבה לך! אתה מאוד אדיב.' },
      { s: 'B', en: "De nada. ¡Disfrute del mercado!", he: 'על לא דבר. תיהני בשוק!' }
    ] }
},

/* ---------------- S15 ---------------- */
{ id: 's15', unit: 6, icon: '🩺', en: 'Consejos y el Médico', he: 'עצות וחובות: אצל הרופא',
  goal: 'בסוף השיעור תוכל לתת עצה ולתאר לרופא מה כואב לך.',
  grammar: [
    { t: 'עצה: deberías',
      p: 'Deberías = כדאי לך. Deberías descansar = כדאי לך לנוח. No deberías = לא כדאי לך. אחרי deberías - שם פועל.',
      ex: [ ["Deberías beber más agua.", "כדאי לך לשתות יותר מים."], ["No deberías trabajar tanto.", "לא כדאי לך לעבוד כל כך הרבה."], ["¿Debería llamar al médico?", "כדאי שאתקשר לרופא?"] ] },
    { t: 'חובה: tener que / hay que',
      p: 'Tengo que = אני חייב: Tengo que irme = אני חייב ללכת. hay que = צריך (באופן כללי, לכולם): Hay que descansar = צריך לנוח.',
      ex: [ ["Tengo que tomar una pastilla cada día.", "אני צריך לקחת כדור כל יום."], ["Tienes que descansar esta semana.", "אתה חייב לנוח השבוע."], ["Hay que beber mucha agua.", "צריך לשתות הרבה מים."] ] },
    { t: 'אצל הרופא: me duele',
      p: 'Me duele = כואב לי: Me duele la cabeza = כואב לי הראש. Me duele la espalda = הגב. ברבים: Me duelen las piernas. וגם: Tengo fiebre = יש לי חום. No me encuentro bien = אני לא מרגיש טוב.',
      ex: [ ["Me duele la cabeza.", "כואב לי הראש."], ["Me duele la espalda.", "כואב לי הגב."], ["No me encuentro bien.", "אני לא מרגיש טוב."] ] }
  ],
  vocab: [
    { en: 'deberías', he: 'כדאי לך', t: 'דֶבֶּרִיָאס', ex: 'Deberías dormir más.' },
    { en: 'tengo que', he: 'אני חייב', t: 'טֶנְגוֹ קֶה', ex: 'Tengo que irme.' },
    { en: 'hay que', he: 'צריך (כללי)', t: 'אָיי קֶה', ex: 'Hay que comer bien.' },
    { en: 'el médico', he: 'הרופא', t: 'אֶל מֶדִיקוֹ', ex: 'Necesito ver al médico.' },
    { en: 'la pastilla', he: 'הכדור (תרופה)', t: 'לָה פַּסְטִייָה', ex: 'Una pastilla dos veces al día.' },
    { en: 'me duele', he: 'כואב לי', t: 'מֶה דוּאֶלֶה', ex: 'Me duele la rodilla.' },
    { en: 'la cabeza', he: 'הראש', t: 'לָה קָבֶּסָה', ex: 'Me duele la cabeza.' },
    { en: 'la espalda', he: 'הגב', t: 'לָה אֶסְפַּלְדָה', ex: 'Me duele la espalda.' },
    { en: 'la fiebre', he: 'החום', t: 'לָה פְיֶבְּרֶה', ex: 'El niño tiene fiebre.' },
    { en: 'la farmacia', he: 'בית המרקחת', t: 'לָה פַרְמָסְיָה', ex: '¿Hay una farmacia cerca?' },
    { en: 'descansar', he: 'לנוח', t: 'דֶסְקַנְסָאר', ex: 'Deberías descansar hoy.' },
    { en: 'sano', he: 'בריא', t: 'סָאנוֹ', ex: 'Caminar es sano.' }
  ],
  sentences: [
    ["No me encuentro bien hoy.", "אני לא מרגיש טוב היום."],
    ["Me duele la espalda.", "כואב לי הגב."],
    ["Me duele la cabeza.", "כואב לי הראש."],
    ["Tengo que ir al médico.", "אני צריך ללכת לרופא."],
    ["Deberías descansar unos días.", "כדאי לך לנוח כמה ימים."],
    ["Tome esta pastilla dos veces al día.", "קח את הכדור הזה פעמיים ביום."],
    ["¿Tengo que hacer un análisis de sangre?", "אני צריך לעשות בדיקת דם?"],
    ["No deberías tomar café por la noche.", "לא כדאי לך לשתות קפה בלילה."],
    ["¿Dónde está la farmacia más cercana?", "איפה בית המרקחת הקרוב?"],
    ["Me encuentro mucho mejor, gracias.", "אני מרגיש הרבה יותר טוב, תודה."]
  ],
  quiz: [
    { q: 'עצה ידידותית: ___ dormir más.', o: ['Tienes', 'Deberías', 'Hay', 'Eres'], a: 1, ex: 'עצה = deberías.' },
    { q: '"אני חייב ללכת":', o: ['Tengo que irme.', 'Debería que voy.', 'Hay que yo voy.', 'Soy que ir.'], a: 0, ex: 'tengo que + שם פועל.' },
    { q: '"כואב לי הראש":', o: ['Mi cabeza es dolor.', 'Me duele la cabeza.', 'Duelo mi cabeza.', 'La cabeza me es duele.'], a: 1, ex: 'Me duele + האיבר.' },
    { q: '"יש לי חום":', o: ['Soy fiebre.', 'Estoy fiebre.', 'Tengo fiebre.', 'Hay fiebre en mí.'], a: 2, ex: 'חום עם tener: Tengo fiebre.' },
    { q: '"צריך לשתות מים" (כללי):', o: ['Hay que beber agua.', 'Tengo beber agua.', 'Debes que agua.', 'Es que beber agua.'], a: 0, ex: 'hay que = צריך, לכולם.' },
    { q: 'אחרי deberías הפועל:', o: ['מוטה לפי גוף', 'בשם הפועל', 'בעבר', 'עם que'], a: 1, ex: 'deberías + שם פועל: deberías descansar.' }
  ],
  dialogue: { title: 'ביקור אצל הרופאה', intro: 'אתה מתאר לרופאה מה מציק לך. אתה B.',
    turns: [
      { s: 'A', en: "Buenos días. ¿Qué le pasa?", he: 'בוקר טוב. מה קרה לך?' },
      { s: 'B', en: "Buenos días, doctora. Me duele la cabeza y también la espalda.", he: 'בוקר טוב, דוקטור. כואב לי הראש וגם הגב.' },
      { s: 'A', en: "Entiendo. ¿Tiene fiebre?", he: 'הבנתי. יש לך חום?' },
      { s: 'B', en: "No, pero estoy muy cansado todo el tiempo.", he: 'לא, אבל אני מאוד עייף כל הזמן.' },
      { s: 'A', en: "¿Duerme bien? ¿Cuántas horas por noche?", he: 'אתה ישן טוב? כמה שעות בלילה?' },
      { s: 'B', en: "No mucho. Quizás cinco horas. Trabajo demasiado.", he: 'לא ממש. אולי חמש שעות. אני עובד יותר מדי.' },
      { s: 'A', en: "Ese es el problema. Debería dormir siete horas y tiene que descansar más.", he: 'זאת הבעיה. כדאי לך לישון שבע שעות ואתה חייב לנוח יותר.' },
      { s: 'B', en: "Tiene razón. Lo voy a intentar. ¿Necesito algún análisis?", he: 'את צודקת. אנסה. אני צריך בדיקות?' }
    ] }
},

/* ---------------- S16 ---------------- */
{ id: 's16', unit: 6, icon: '🌍', en: '¿Alguna vez has...?', he: 'ניסיון חיים: he estado, has probado',
  goal: 'בסוף השיעור תוכל לדבר על חוויות: איפה היית ומה ניסית בחיים.',
  grammar: [
    { t: 'הזמן של החוויות',
      p: 'he/has/ha + פועל בצורת ado/ido: He estado en Italia = הייתי באיטליה (מתישהו). he hablado, he comido, he vivido. חריגים חשובים: hecho (עשיתי), visto (ראיתי), dicho (אמרתי).',
      ex: [ ["He estado en Italia dos veces.", "הייתי באיטליה פעמיים."], ["Ella ha visto esta película.", "היא ראתה את הסרט הזה."], ["Hemos probado ese restaurante.", "ניסינו את המסעדה ההיא."] ] },
    { t: 'שאלת הקסם: ¿Alguna vez has...?',
      p: '¿Alguna vez has estado en...? = האם אי פעם היית ב...? תשובות: Sí, he estado. / No, nunca. פותחת כל שיחה.',
      ex: [ ["¿Alguna vez has estado en Madrid?", "היית פעם במדריד?"], ["¿Has probado la paella?", "ניסית פעם פאייה?"], ["No, nunca.", "לא, אף פעם."] ] },
    { t: 'מתי חוזרים לעבר הרגיל',
      p: 'אם אומרים מתי בדיוק - עבר פשוט: He estado en Roma (חוויה), אבל: Estuve en Roma en 2019 (עם תאריך). עוד מילים שימושיות: ya = כבר, todavía no = עדיין לא.',
      ex: [ ["He visitado París.", "ביקרתי בפריז. (מתישהו)"], ["Visité París el año pasado.", "ביקרתי בפריז בשנה שעברה."], ["Todavía no he terminado.", "עדיין לא סיימתי."] ] }
  ],
  vocab: [
    { en: 'alguna vez', he: 'אי פעם', t: 'אַלְגוּנָה בֶּס', ex: '¿Alguna vez has volado?' },
    { en: 'nunca', he: 'אף פעם', t: 'נוּנְקָה', ex: 'Nunca he estado allí.' },
    { en: 'he estado', he: 'הייתי', t: 'אֶה אֶסְטָאדוֹ', ex: 'He estado en Grecia.' },
    { en: 'he visto', he: 'ראיתי', t: 'אֶה בִּיסְטוֹ', ex: 'He visto esa película.' },
    { en: 'he hecho', he: 'עשיתי', t: 'אֶה אֶצ\'וֹ', ex: 'He hecho mi parte.' },
    { en: 'has probado', he: 'ניסית/טעמת', t: 'אָס פְּרוֹבָּאדוֹ', ex: '¿Has probado el gazpacho?' },
    { en: 'ya', he: 'כבר', t: 'יָה', ex: 'Ya he comido.' },
    { en: 'todavía no', he: 'עדיין לא', t: 'טוֹדָבִיָה נוֹ', ex: 'Todavía no he terminado.' },
    { en: 'dos veces', he: 'פעמיים', t: 'דוֹס בֶּסֶס', ex: 'He estado allí dos veces.' },
    { en: 'el extranjero', he: 'חו"ל', t: 'אֶל אֶקְסְטְרַנְחֶרוֹ', ex: '¿Has vivido en el extranjero?' },
    { en: 'la experiencia', he: 'החוויה', t: 'לָה אֶקְספֶּרְיֶנְסְיָה', ex: 'Fue una gran experiencia.' },
    { en: 'una vez', he: 'פעם אחת', t: 'אוּנָה בֶּס', ex: 'Lo probé una vez.' }
  ],
  sentences: [
    ["¿Alguna vez has estado en España?", "היית פעם בספרד?"],
    ["Sí, he estado allí dos veces.", "כן, הייתי שם פעמיים."],
    ["Nunca he probado el gazpacho.", "אף פעם לא טעמתי גספצ׳ו."],
    ["Ella ha visto esta película tres veces.", "היא ראתה את הסרט הזה שלוש פעמים."],
    ["Ya hemos comido, gracias.", "כבר אכלנו, תודה."],
    ["Todavía no he terminado el libro.", "עוד לא סיימתי את הספר."],
    ["¿Has probado el restaurante nuevo?", "ניסית את המסעדה החדשה?"],
    ["He vivido aquí veinte años.", "אני גר כאן עשרים שנה."],
    ["Nunca ha volado en avión.", "הוא מעולם לא טס במטוס."],
    ["Ha sido un día maravilloso.", "זה היה יום נפלא."]
  ],
  quiz: [
    { q: '¿Alguna vez ___ estado en Madrid?', o: ['ha', 'has', 'he', 'hemos'], a: 1, ex: 'אתה = has estado.' },
    { q: 'Yo he ___ esa película. (ver)', o: ['visto', 'veído', 'vi', 'ver'], a: 0, ex: 'ver ← visto (חריג).' },
    { q: '"אף פעם לא ניסיתי":', o: ['Nunca he probado.', 'He nunca probado.', 'No probado nunca he.', 'Probé nunca.'], a: 0, ex: 'Nunca + he + פועל ado/ido.' },
    { q: 'איזה משפט דורש עבר פשוט?', o: ['הייתי שם מתישהו', 'ביקרתי שם ב-2020', 'ראיתי את הסרט הזה', 'טעמתי פאייה פעם'], a: 1, ex: 'זמן מדויק = עבר פשוט: Visité en 2020.' },
    { q: 'Ella ___ estado en París.', o: ['he', 'has', 'ha', 'han'], a: 2, ex: 'היא = ha.' },
    { q: '"עדיין לא סיימתי":', o: ['Ya he terminado.', 'Todavía no he terminado.', 'Nunca terminé ya.', 'No terminado todavía soy.'], a: 1, ex: 'todavía no + he + terminado.' }
  ],
  dialogue: { title: 'שיחת טיולים', intro: 'שיחה עם מכר על טיולים בעולם. אתה B.',
    turns: [
      { s: 'A', en: "¿Alguna vez has estado en España?", he: 'היית פעם בספרד?' },
      { s: 'B', en: "Sí, he estado dos veces. ¿Y tú?", he: 'כן, הייתי פעמיים. ואתה?' },
      { s: 'A', en: "No, nunca. Pero siempre he querido ir.", he: 'לא, אף פעם. אבל תמיד רציתי לנסוע.' },
      { s: 'B', en: "¡Tienes que ir! Nunca he comido mejor en mi vida.", he: 'אתה חייב לנסוע! מעולם לא אכלתי טוב יותר בחיי.' },
      { s: 'A', en: "¿Qué ciudad te gustó más?", he: 'איזו עיר אהבת הכי הרבה?' },
      { s: 'B', en: "Sevilla. Estuvimos allí en 2023 y fue increíble.", he: 'סביליה. היינו שם ב-2023 וזה היה מדהים.' },
      { s: 'A', en: "¿Has probado la paella auténtica?", he: 'טעמת פאייה אותנטית?' },
      { s: 'B', en: "¡Claro! Y ahora no puedo comer paella en Israel.", he: 'ברור! ועכשיו אני לא מסוגל לאכול פאייה בארץ.' }
    ] }
},

/* ---------------- S17 ---------------- */
{ id: 's17', unit: 6, icon: '💼', en: 'Si... y Charla', he: 'משפטי תנאי ושיחת חולין',
  goal: 'בסוף השיעור תוכל לדבר על אפשרויות (אם... אז...) ולנהל סמול טוק ספרדי אמיתי.',
  grammar: [
    { t: 'תנאי: Si + הווה',
      p: 'אם יקרה X, יקרה Y: Si llueve, nos quedamos en casa (אם ירד גשם, נישאר בבית). אפשר הווה+הווה או הווה+עתיד: Si tengo tiempo, te voy a llamar. שים לב: si (אם) בלי סימן הטעמה; sí (כן) עם.',
      ex: [ ["Si llueve, nos quedamos en casa.", "אם ירד גשם, נישאר בבית."], ["Si vienes temprano, preparo café.", "אם תבוא מוקדם, אכין קפה."], ["Si tengo tiempo, te llamo.", "אם יהיה לי זמן, אתקשר."] ] },
    { t: 'סמול טוק: הפתיחות',
      p: '¿Qué tal? = מה נשמע? (הפתיח הלאומי). ¿Qué tal el fin de semana? = איך היה הסופ"ש? ¡Qué buen tiempo hace! = איזה מזג אוויר נהדר! ¿Cómo está la familia? = מה שלום המשפחה?',
      ex: [ ["¿Qué tal el fin de semana?", "איך היה סוף השבוע?"], ["¡Qué buen tiempo hace hoy!", "איזה מזג אוויר טוב היום!"], ["¿Cómo está la familia?", "מה שלום המשפחה?"] ] },
    { t: 'להמשיך ולסיים יפה',
      p: '¡Suena genial! = נשמע מעולה! Cuéntame más = ספר לי עוד. Por cierto = דרך אגב. לסיום: Me alegro de verte = שמחתי לראות אותך. Saludos a la familia = ד"ש למשפחה.',
      ex: [ ["¡Suena genial!", "נשמע מעולה!"], ["Por cierto, ¿cómo está tu hijo?", "דרך אגב, מה שלום הבן שלך?"], ["Me alegro de verte.", "שמחתי לראות אותך."] ] }
  ],
  vocab: [
    { en: 'si', he: 'אם', t: 'סִי', ex: 'Si quieres, vamos.' },
    { en: '¿qué tal?', he: 'מה נשמע?', t: 'קֶה טָאל', ex: '¿Qué tal todo?' },
    { en: 'el tiempo', he: 'מזג האוויר / זמן', t: 'אֶל טְיֶמְפּוֹ', ex: 'Hace buen tiempo.' },
    { en: 'suena', he: 'נשמע', t: 'סוּאֶנָה', ex: 'Suena interesante.' },
    { en: 'las noticias', he: 'החדשות', t: 'לָאס נוֹטִיסְיָאס', ex: '¿Viste las noticias?' },
    { en: 'las vacaciones', he: 'החופשה', t: 'לָאס בָּקָסְיוֹנֶס', ex: '¡Necesitamos vacaciones!' },
    { en: 'los nietos', he: 'הנכדים', t: 'לוֹס נְיֶטוֹס', ex: 'Los nietos crecen rápido.' },
    { en: 'la jubilación', he: 'הפנסיה', t: 'לָה חוּבִּילָסְיוֹן', ex: 'Disfruta de la jubilación.' },
    { en: 'por cierto', he: 'דרך אגב', t: 'פּוֹר סְיֶרְטוֹ', ex: 'Por cierto, ¿qué hora es?' },
    { en: 'me alegro', he: 'אני שמח', t: 'מֶה אָלֶגְרוֹ', ex: 'Me alegro de verte.' },
    { en: 'los saludos', he: 'ד"ש', t: 'לוֹס סָלוּדוֹס', ex: 'Saludos a tu mujer.' },
    { en: 'genial', he: 'מעולה', t: 'חֶנְיָאל', ex: '¡Suena genial!' }
  ],
  sentences: [
    ["Si llueve, nos quedamos en casa.", "אם ירד גשם, נישאר בבית."],
    ["Si tienes tiempo, llámame.", "אם יש לך זמן, תתקשר אליי."],
    ["¿Qué tal el fin de semana?", "איך היה סוף השבוע?"],
    ["Genial, vimos a los nietos.", "מעולה, ראינו את הנכדים."],
    ["¡Qué buen tiempo hace hoy!", "איזה מזג אוויר נהדר היום!"],
    ["¡Eso suena maravilloso!", "זה נשמע נפלא!"],
    ["Por cierto, ¿cómo está tu hijo?", "דרך אגב, מה שלום הבן שלך?"],
    ["Si lo veo, le doy saludos.", "אם אראה אותו, אמסור ד\"ש."],
    ["Me alegro mucho de verte.", "אני מאוד שמח לראות אותך."],
    ["¡Hablamos pronto!", "נדבר בקרוב!"]
  ],
  quiz: [
    { q: 'Si ___, nos quedamos en casa. (llover)', o: ['lloverá', 'llueve', 'llovió', 'lloviendo'], a: 1, ex: 'אחרי si - הווה: llueve.' },
    { q: 'הפתיח הספרדי הקלאסי:', o: ['¿Cuánto ganas?', '¿Qué tal?', '¿Dónde vives exactamente?', '¡Dame noticias!'], a: 1, ex: '¿Qué tal? פותח כל שיחה.' },
    { q: '"נשמע מעולה":', o: ['Suena genial.', 'Sonar bueno.', 'Es sonido bien.', 'Genial suenas tú.'], a: 0, ex: 'Suena genial / Suena bien.' },
    { q: '"דרך אגב":', o: ['por favor', 'por cierto', 'por suerte', 'por la calle'], a: 1, ex: 'por cierto = דרך אגב.' },
    { q: 'ההבדל בין si ל-sí:', o: ['אין הבדל', 'si=אם, sí=כן', 'si=כן, sí=אם', 'שניהם שאלה'], a: 1, ex: 'הסימן ´ הופך "אם" ל"כן".' },
    { q: 'סיום שיחה חם:', o: ['Vete ya.', 'Fin de hablar.', 'Me alegro de verte.', 'Terminado tú.'], a: 2, ex: 'Me alegro de verte - סיום חם ומנומס.' }
  ],
  dialogue: { title: 'סמול טוק במעלית', intro: 'שכן מהבניין פוגש אותך במעלית. אתה B.',
    turns: [
      { s: 'A', en: "¡Buenos días! Qué buen tiempo hace, ¿verdad?", he: 'בוקר טוב! איזה מזג אוויר נהדר, נכון?' },
      { s: 'B', en: "¡Buenos días! Sí, es perfecto. ¿Qué tal el fin de semana?", he: 'בוקר טוב! כן, מושלם. איך היה סוף השבוע?' },
      { s: 'A', en: "Maravilloso, visitamos a nuestra hija en el sur.", he: 'נפלא, ביקרנו את הבת שלנו בדרום.' },
      { s: 'B', en: "¡Suena genial! ¿Cómo está ella?", he: 'נשמע מעולה! מה שלומה?' },
      { s: 'A', en: "Muy bien. ¿Y vosotros? ¿Planes para las fiestas?", he: 'טוב מאוד. ואתם? תוכניות לחגים?' },
      { s: 'B', en: "Si hace buen tiempo, vamos a viajar al norte.", he: 'אם יהיה מזג אוויר טוב, ניסע צפונה.' },
      { s: 'A', en: "¡Qué bien! Bueno, esta es mi planta.", he: 'איזה יופי! טוב, זאת הקומה שלי.' },
      { s: 'B', en: "Me alegro de verte. ¡Saludos a la familia!", he: 'שמחתי לראות אותך. ד"ש למשפחה!' }
    ] }
}
],

/* ============ קליניקת הגייה לדוברי עברית ============ */
clinic: [
{ id: 'rr', icon: '🐕', title: 'ה-RR המתגלגלת', sub: 'perro, carro, arriba',
  why: 'ה-ר העברית יושבת בגרון. ה-R הספרדית - ובמיוחד RR הכפולה - מתגלגלת בקצה הלשון. pero (אבל) מול perro (כלב) - ההבדל הוא רק הגלגול.',
  tip: 'הצמד את קצה הלשון לחך מאחורי השיניים ותן לאוויר להרעיד אותה: טְרְרְר. תרגיל: אמור "בּוּטֶר-בּוּטֶר-בּוּטֶר" מהר - הלשון כבר במקום הנכון.',
  pairs: [ ['pero', 'perro'], ['caro', 'carro'], ['coro', 'corro'], ['para', 'parra'], ['cero', 'cerro'], ['moro', 'morro'] ],
  sentences: [ "El perro corre rápido.", "Un carro rojo.", "Arriba las manos.", "El ferrocarril es largo.", "Roberto y Rosa corren." ] },

{ id: 'nya', icon: '✨', title: 'האות ñ', sub: 'España, señor, año',
  why: 'ñ היא ני רכה - כמו במילה "בניין". טעות בה משנה משמעות לגמרי: año (שנה) בלי ה-ñ הופכת למילה אחרת לגמרי - ולא מנומסת. שווה לתרגל.',
  tip: 'אמור נ ו-י ביחד כהברה אחת: אַנְיוֹ. הלשון נצמדת רחב לחך. תרגיל: תגיד "בַּנְיָן" ותרגיש איפה הלשון - זה בדיוק המקום.',
  pairs: [ ['sueno', 'sueño'], ['pena', 'peña'], ['campana', 'campaña'], ['una', 'uña'], ['cana', 'caña'], ['mono', 'moño'] ],
  sentences: [ "El niño es pequeño.", "El señor es de España.", "Feliz año nuevo.", "Mañana por la mañana.", "La señora Muñoz enseña español." ] },

{ id: 'jota', icon: '🎁', title: 'J ו-G = ח שלנו!', sub: 'jamón, gente, trabajo',
  why: 'כאן יש לך יתרון ענק על כל העולם: הצליל של J (וגם G לפני e או i) הוא בדיוק ח עברית! אמריקאים סובלים - אתה כבר יודע.',
  tip: 'פשוט תגיד ח: jamón = חָמוֹן. gente = חֶנְטֶה. José = חוֹסֶה. הדבר היחיד להיזהר ממנו: G לפני a, o, u היא ג רגילה: gato = גָאטוֹ.',
  pairs: [ ['jamón', 'gamón'], ['gente', 'gato'], ['jota', 'gota'], ['giro', 'gorro'], ['rojo', 'trago'], ['jugo', 'gustо'] ],
  sentences: [ "El jamón de Jaén es genial.", "La gente trabaja junta.", "José juega los jueves.", "El general es inteligente.", "Mi hijo es genial." ] },

{ id: 'll', icon: '🌧️', title: 'll ו-y = י', sub: 'llamo, calle, playa',
  why: 'שתי L ביחד הן לא ל כפולה - הן צליל י (ובחלק מדרום אמריקה כמעט ג׳). me llamo = מֶה יָאמוֹ, לא מֶה לָאמוֹ.',
  tip: 'כל ll קרא כמו י: calle = קָאיֶה, ella = אֶיָה. אותו דבר עם y בתוך מילה: playa = פְּלָאיָה, mayo = מָאיוֹ.',
  pairs: [ ['loro', 'lloro'], ['lave', 'llave'], ['leno', 'lleno'], ['lama', 'llama'], ['poyo', 'polo'], ['calle', 'cale'] ],
  sentences: [ "Me llamo Guillermo.", "La calle está llena.", "Ella llega a la playa.", "Las llaves amarillas.", "Llueve en mayo." ] },

{ id: 'bv', icon: '🐄', title: 'B ו-V - אותו צליל', sub: 'vaca = baca',
  why: 'הפתעה משחררת: בספרדית B ו-V נשמעות בדיוק אותו דבר! vino ו-bino היו נשמעים זהים. אין את ה-V האנגלית עם שיניים על שפה.',
  tip: 'שתיהן ב רכה: השפתיים כמעט נסגרות, בלי שיניים בכלל. vaca = בָּאקָה. vivir = בִּיבִיר. אם תגיד V אנגלית - יבינו אותך, אבל תישמע זר.',
  pairs: [ ['vaca', 'baca'], ['vino', 'bino'], ['tuvo', 'tubo'], ['votar', 'botar'], ['vello', 'bello'], ['vaya', 'baya'] ],
  sentences: [ "Bebo un vaso de vino blanco.", "Vivo en Valencia.", "El bebé bebe.", "Vamos a ver a Víctor.", "Es un buen viaje." ] },

{ id: 'vowels', icon: '🎯', title: 'תנועות נקיות', sub: 'no = נוֹ (לא נוֹאוּ)',
  why: 'באנגלית התנועות זולגות: no נשמע נוֹאוּ. בספרדית יש בדיוק 5 תנועות, קצרות ונקיות כמו בעברית: a e i o u - בלי זליגה, בלי דיפתונג.',
  tip: 'חתוך כל תנועה קצר ונקי: no = נוֹ. de = דֶה. me = מֶה. te = טֶה. como = קוֹמוֹ. תחשוב שאתה מדבר עברית עם מילים ספרדיות - זה כמעט מדויק.',
  pairs: [ ['no', 'nou'], ['de', 'dei'], ['me', 'mei'], ['lo', 'lou'], ['se', 'sei'], ['tu', 'tiu'] ],
  sentences: [ "No me lo de.", "Como en casa.", "Te lo digo yo.", "Es de metal.", "Lo pone en la mesa." ] },

{ id: 'stress', icon: '🥁', title: 'הטעמה: הסימן ´ מנצח', sub: 'hablo מול habló',
  why: 'ההטעמה בספרדית היא דקדוק: hablo = אני מדבר, habló = הוא דיבר. papa = תפוח אדמה, papá = אבא. טעות הטעמה משנה משמעות וזמן.',
  tip: 'שני כללים מכסים הכול: מילה שנגמרת בתנועה, n או s - ההטעמה לפני אחרונה (HA-blo, CA-sa). כל השאר - בסוף. סימן ´ שובר כל כלל: ההטעמה איפה שהוא.',
  pairs: [ ['hablo', 'habló'], ['papa', 'papá'], ['esta', 'está'], ['canto', 'cantó'], ['compro', 'compró'], ['llamo', 'llamó'] ],
  sentences: [ "Hablo español.", "Ayer habló con papá.", "Está en esta casa.", "El teléfono está aquí.", "María estudió inglés." ] }
],

/* ============ משפטי עידוד ============ */
praise: [ "¡Excelente!", "¡Perfecto!", "¡Muy bien!", "¡Genial!", "¡Bravo!", "¡Fantástico!", "¡Estupendo!", "¡Exacto!" ],
praiseHe: [ "מצוין!", "מושלם!", "כל הכבוד!", "נהדר!", "בדיוק!", "יפה מאוד!", "עבודה טובה!", "מעולה!" ],
almostHe: [ "כמעט! הקשב ונסה שוב", "קרוב מאוד! עוד ניסיון", "לא רע בכלל! שמע שוב" ],
retryHe: [ "בוא נשמע את זה שוב", "לא נורא, מקשיבים שוב", "עוד פעם אחת ביחד" ]
};

if (typeof module !== 'undefined' && module.exports) module.exports = CONTENT_ES;

/* English Drive — curriculum content. Hebrew UI, English learning content. */
'use strict';
var CONTENT_EN = {

units: [
  { n: 1, he: 'הבסיס שמחזיק הכול', icon: '🧱' },
  { n: 2, he: 'שגרה והווה', icon: '☀️' },
  { n: 3, he: 'מספרים, זמן ואוכל', icon: '🕐' },
  { n: 4, he: 'לדבר על העבר', icon: '⏪' },
  { n: 5, he: 'עתיד, נסיעות ונימוס', icon: '✈️' },
  { n: 6, he: 'הרמה הבאה', icon: '🚀' }
],

lessons: [

/* ---------------- L1 ---------------- */
{ id: 'l1', unit: 1, icon: '👋', en: 'The Verb "To Be"', he: 'הפועל להיות: am / is / are',
  goal: 'בסוף השיעור תוכל להציג את עצמך: מי אתה, מאיפה אתה ומה אתה מרגיש.',
  grammar: [
    { t: 'הפועל שלא קיים בעברית',
      p: 'בעברית אומרים "אני עייף" - שתי מילים. באנגלית חייבים מילת קישור באמצע: I am tired. המילה הזאת היא הפועל to be (להיות), והיא משתנה לפי מי מדבר: I am, you are, he is.',
      ex: [ ["I am tired.", "אני עייף."], ["You are right.", "אתה צודק."], ["She is a doctor.", "היא רופאה."] ] },
    { t: 'שלוש צורות בלבד',
      p: 'am הולך רק עם I. is הולך עם יחיד: he, she, it. are הולך עם כל השאר: you, we, they. בדיבור מקצרים: I am הופך ל-I\'m, he is הופך ל-he\'s, they are הופך ל-they\'re.',
      ex: [ ["I'm from Israel.", "אני מישראל."], ["He's my friend.", "הוא חבר שלי."], ["We're happy.", "אנחנו שמחים."], ["They're at home.", "הם בבית."] ] },
    { t: 'שלילה: מוסיפים not',
      p: 'כדי לשלול, מוסיפים not אחרי הפועל: I am not, she is not. בדיבור: isn\'t, aren\'t.',
      ex: [ ["I'm not hungry.", "אני לא רעב."], ["She isn't here.", "היא לא כאן."], ["We aren't ready.", "אנחנו לא מוכנים."] ] }
  ],
  vocab: [
    { en: 'hello', he: 'שלום', t: 'הֶלוֹאוּ', ex: 'Hello, my name is Dan.' },
    { en: 'name', he: 'שם', t: 'נֵיים', ex: 'My name is Rina.' },
    { en: 'from', he: 'מ- (ממקום)', t: 'פְרוֹם', ex: 'I am from Israel.' },
    { en: 'happy', he: 'שמח', t: 'הֶפִּי', ex: 'I am happy today.' },
    { en: 'tired', he: 'עייף', t: 'טַאיֶרְד', ex: 'You are tired.' },
    { en: 'hungry', he: 'רעב', t: 'הַאנְגְרִי', ex: 'He is hungry.' },
    { en: 'friend', he: 'חבר', t: 'פְרֶנְד', ex: 'She is my friend.' },
    { en: 'family', he: 'משפחה', t: 'פֶמִילִי', ex: 'My family is big.' },
    { en: 'house', he: 'בית', t: 'הַאוּס', ex: 'The house is small.' },
    { en: 'here', he: 'כאן', t: 'הִיר', ex: 'We are here.' },
    { en: 'today', he: 'היום', t: 'טוּדֵיי', ex: 'Today is a good day.' },
    { en: 'good', he: 'טוב', t: 'גוּד', ex: 'The coffee is good.' }
  ],
  sentences: [
    ["My name is David.", "השם שלי דויד."],
    ["I am from Israel.", "אני מישראל."],
    ["I am happy to meet you.", "אני שמח לפגוש אותך."],
    ["She is my friend.", "היא חברה שלי."],
    ["He is at home today.", "הוא בבית היום."],
    ["We are a big family.", "אנחנו משפחה גדולה."],
    ["The coffee is very good.", "הקפה טוב מאוד."],
    ["I am a little tired.", "אני קצת עייף."],
    ["They are not here.", "הם לא כאן."],
    ["It is a beautiful day.", "זה יום יפה."]
  ],
  quiz: [
    { q: 'I ___ from Tel Aviv.', o: ['is', 'am', 'are', 'be'], a: 1, ex: 'עם I תמיד am.' },
    { q: 'She ___ my sister.', o: ['am', 'are', 'is', 'be'], a: 2, ex: 'יחיד (he/she/it) מקבל is.' },
    { q: 'They ___ happy.', o: ['is', 'am', 'are', 'be'], a: 2, ex: 'רבים (we/you/they) מקבל are.' },
    { q: 'איך מקצרים את: We are late?', o: ["We're late", "Were late", "We's late", "We'am late"], a: 0, ex: 'we are = we\'re.' },
    { q: 'He ___ hungry. (שלילה)', o: ["am not", "isn't", "aren't", "not"], a: 1, ex: 'he is not = he isn\'t.' },
    { q: '"אני לא עייף" באנגלית:', o: ["I no tired.", "I am not tired.", "I not am tired.", "Am not tired."], a: 1, ex: 'הסדר: I + am + not + תואר.' }
  ],
  dialogue: { title: 'פגישה ראשונה', intro: 'אתה פוגש שכנה חדשה. אתה מדבר בתור B.',
    turns: [
      { s: 'A', en: "Hello! I'm Rachel. I'm your new neighbor.", he: 'שלום! אני רייצ\'ל. אני השכנה החדשה שלך.' },
      { s: 'B', en: "Hi Rachel! Nice to meet you. My name is Danny.", he: 'היי רייצ\'ל! נעים מאוד. השם שלי דני.' },
      { s: 'A', en: "Nice to meet you too. Where are you from?", he: 'נעים מאוד גם לי. מאיפה אתה?' },
      { s: 'B', en: "I am from Haifa. And you?", he: 'אני מחיפה. ואת?' },
      { s: 'A', en: "I'm from Jerusalem. This is a nice building.", he: 'אני מירושלים. זה בניין נחמד.' },
      { s: 'B', en: "Yes, it is. The neighbors are very friendly.", he: 'כן, נכון. השכנים מאוד ידידותיים.' },
      { s: 'A', en: "Great! See you soon.", he: 'מעולה! נתראה בקרוב.' },
      { s: 'B', en: "See you! Have a good day.", he: 'נתראה! שיהיה לך יום טוב.' }
    ] }
},

/* ---------------- L2 ---------------- */
{ id: 'l2', unit: 1, icon: '❓', en: 'Questions with "To Be"', he: 'שאלות: Are you...? Where is...?',
  goal: 'בסוף השיעור תוכל לשאול ולענות על שאלות בסיסיות: מי, מה, איפה.',
  grammar: [
    { t: 'שאלת כן/לא: מחליפים סדר',
      p: 'בעברית שואלים עם אינטונציה: "אתה עייף?". באנגלית הופכים את הסדר: הפועל קופץ להתחלה. You are tired הופך ל-Are you tired?',
      ex: [ ["Are you tired?", "אתה עייף?"], ["Is she home?", "היא בבית?"], ["Are they from Israel?", "הם מישראל?"] ] },
    { t: 'תשובות קצרות',
      p: 'באנגלית לא עונים רק Yes או No - מוסיפים תשובה קצרה: Yes, I am. / No, I\'m not. זה נשמע הרבה יותר טבעי ומנומס.',
      ex: [ ["Yes, I am.", "כן (אני כן)."], ["No, she isn't.", "לא (היא לא)."], ["Yes, they are.", "כן (הם כן)."] ] },
    { t: 'מילות שאלה: Wh',
      p: 'מילת השאלה באה ראשונה, ואחריה הפועל: What (מה), Where (איפה), Who (מי), How (איך), When (מתי), Why (למה).',
      ex: [ ["Where are you?", "איפה אתה?"], ["What is this?", "מה זה?"], ["Who is he?", "מי הוא?"], ["How are you?", "מה שלומך?"] ] }
  ],
  vocab: [
    { en: 'what', he: 'מה', t: 'ווֹט', ex: 'What is your name?' },
    { en: 'where', he: 'איפה', t: 'ווֶר', ex: 'Where are you from?' },
    { en: 'who', he: 'מי', t: 'הוּ', ex: 'Who is that man?' },
    { en: 'how', he: 'איך', t: 'הַאוּ', ex: 'How are you?' },
    { en: 'when', he: 'מתי', t: 'ווֶן', ex: 'When is the meeting?' },
    { en: 'why', he: 'למה', t: 'ווַאי', ex: 'Why are you sad?' },
    { en: 'this', he: 'זה (קרוב)', t: 'דִיס', ex: 'This is my car.' },
    { en: 'that', he: 'ההוא (רחוק)', t: 'דֶאט', ex: 'That is my house.' },
    { en: 'question', he: 'שאלה', t: 'קְוֶוסְצֶ\'ן', ex: 'Good question!' },
    { en: 'answer', he: 'תשובה', t: 'אֶנְסֶר', ex: 'The answer is yes.' },
    { en: 'sure', he: 'בטוח', t: 'שוּר', ex: 'Are you sure?' },
    { en: 'of course', he: 'כמובן', t: 'אוֹף קוֹרְס', ex: 'Of course I am!' }
  ],
  sentences: [
    ["How are you today?", "מה שלומך היום?"],
    ["Where are you from?", "מאיפה אתה?"],
    ["What is your name?", "מה השם שלך?"],
    ["Are you hungry?", "אתה רעב?"],
    ["Yes, I am very hungry.", "כן, אני מאוד רעב."],
    ["Is this your car?", "זה האוטו שלך?"],
    ["No, it is not my car.", "לא, זה לא האוטו שלי."],
    ["Who is that woman?", "מי האישה ההיא?"],
    ["Why are you here?", "למה אתה כאן?"],
    ["When is the party?", "מתי המסיבה?"]
  ],
  quiz: [
    { q: '___ you from Haifa?', o: ['Is', 'Am', 'Are', 'Be'], a: 2, ex: 'you מקבל are, ובשאלה הוא קופץ להתחלה.' },
    { q: '___ is your name?', o: ['Who', 'What', 'Where', 'How'], a: 1, ex: 'שואלים על שם עם What.' },
    { q: '"איפה הם?" באנגלית:', o: ['Where they are?', 'Where are they?', 'Where is they?', 'They are where?'], a: 1, ex: 'מילת שאלה, ואז הפועל, ואז הנושא.' },
    { q: 'Is she a teacher? - תשובה חיובית:', o: ['Yes, she are.', 'Yes, is.', 'Yes, she is.', 'Yes, her is.'], a: 2, ex: 'תשובה קצרה: Yes, she is.' },
    { q: '___ is the meeting? At 10:00.', o: ['Where', 'Who', 'When', 'What'], a: 2, ex: 'התשובה היא שעה, אז שואלים מתי - When.' },
    { q: 'Are you tired? - "לא":', o: ["No, I amn't.", "No, I'm not.", "No, I not.", "Not I am."], a: 1, ex: 'ל-am אין קיצור שלילה. אומרים I\'m not.' }
  ],
  dialogue: { title: 'שיחה בבית קפה', intro: 'מישהו מזהה אותך בבית קפה. אתה B.',
    turns: [
      { s: 'A', en: "Excuse me, are you Danny Cohen?", he: 'סליחה, אתה דני כהן?' },
      { s: 'B', en: "Yes, I am. And who are you?", he: 'כן. ומי אתה?' },
      { s: 'A', en: "I'm Michael, from the old office. How are you?", he: 'אני מיכאל, מהמשרד הישן. מה שלומך?' },
      { s: 'B', en: "Michael! I'm great, thank you. How are you?", he: 'מיכאל! שלומי מצוין, תודה. מה שלומך?' },
      { s: 'A', en: "I'm fine. Is this your family?", he: 'אני בסדר. זאת המשפחה שלך?' },
      { s: 'B', en: "Yes, this is my wife and this is my son.", he: 'כן, זאת אשתי וזה הבן שלי.' },
      { s: 'A', en: "Wonderful! It's so good to see you.", he: 'נפלא! כל כך טוב לראות אותך.' },
      { s: 'B', en: "Good to see you too. Have a great day!", he: 'טוב לראות גם אותך. שיהיה לך יום נהדר!' }
    ] }
},

/* ---------------- L3 ---------------- */
{ id: 'l3', unit: 1, icon: '🏠', en: 'There is / There are', he: 'יש ואין: there is / there are',
  goal: 'בסוף השיעור תוכל לתאר מה יש ומה אין - בבית, ברחוב, בכל מקום.',
  grammar: [
    { t: 'איך אומרים "יש"',
      p: 'המילה "יש" באנגלית היא שתי מילים: There is ליחיד, There are לרבים. There is a bank here = יש כאן בנק.',
      ex: [ ["There is a bank here.", "יש כאן בנק."], ["There are two rooms.", "יש שני חדרים."], ["There is milk in the fridge.", "יש חלב במקרר."] ] },
    { t: 'אין = There is no',
      p: 'שלילה: There is no... או There isn\'t a... לרבים: There are no...',
      ex: [ ["There is no sugar.", "אין סוכר."], ["There are no parking spots.", "אין מקומות חניה."], ["There isn't a problem.", "אין בעיה."] ] },
    { t: 'a לעומת the',
      p: 'a זה "איזשהו" - דבר לא מסוים או חדש בשיחה: a car (איזושהי מכונית). the זה "ה-" הידיעה - דבר מסוים שכבר מכירים: the car (המכונית). לפני צליל תנועה a הופך ל-an: an apple.',
      ex: [ ["There is a car outside.", "יש מכונית בחוץ."], ["The car is red.", "המכונית אדומה."], ["I want an apple.", "אני רוצה תפוח."] ] }
  ],
  vocab: [
    { en: 'room', he: 'חדר', t: 'רוּם', ex: 'There are three rooms.' },
    { en: 'kitchen', he: 'מטבח', t: 'קִיצֶ\'ן', ex: 'The kitchen is big.' },
    { en: 'table', he: 'שולחן', t: 'טֵייבֶּל', ex: 'There is a table here.' },
    { en: 'chair', he: 'כיסא', t: 'צֶ\'ר', ex: 'There are four chairs.' },
    { en: 'window', he: 'חלון', t: 'ווִינְדוֹאוּ', ex: 'Open the window, please.' },
    { en: 'door', he: 'דלת', t: 'דוֹר', ex: 'The door is open.' },
    { en: 'street', he: 'רחוב', t: 'סְטְרִיט', ex: 'There is a cafe on the street.' },
    { en: 'store', he: 'חנות', t: 'סְטוֹר', ex: 'The store is closed.' },
    { en: 'near', he: 'ליד, קרוב', t: 'נִיר', ex: 'The bank is near my house.' },
    { en: 'problem', he: 'בעיה', t: 'פְּרוֹבְּלֶם', ex: 'There is no problem.' },
    { en: 'a lot of', he: 'הרבה', t: 'אֶ לוֹט אוֹף', ex: 'There are a lot of people.' },
    { en: 'parking', he: 'חניה', t: 'פַּרְקִינְג', ex: 'There is no parking here.' }
  ],
  sentences: [
    ["There is a big kitchen in the house.", "יש מטבח גדול בבית."],
    ["There are two bedrooms.", "יש שני חדרי שינה."],
    ["There is a supermarket near my house.", "יש סופרמרקט ליד הבית שלי."],
    ["There is no parking on this street.", "אין חניה ברחוב הזה."],
    ["Is there a bank here?", "יש כאן בנק?"],
    ["Yes, there is one on the corner.", "כן, יש אחד בפינה."],
    ["There are a lot of cars today.", "יש הרבה מכוניות היום."],
    ["There is a problem with the car.", "יש בעיה עם האוטו."],
    ["There isn't any milk in the fridge.", "אין בכלל חלב במקרר."],
    ["The store is open, but there are no people.", "החנות פתוחה, אבל אין אנשים."]
  ],
  quiz: [
    { q: 'There ___ two chairs in the room.', o: ['is', 'are', 'am', 'be'], a: 1, ex: 'שני כיסאות = רבים = are.' },
    { q: 'There ___ a problem.', o: ['are', 'am', 'is', 'be'], a: 2, ex: 'בעיה אחת = יחיד = is.' },
    { q: '"אין סוכר" באנגלית:', o: ['There is no sugar.', 'No is sugar.', 'There no sugar.', 'Is no sugar.'], a: 0, ex: 'There is no + שם עצם.' },
    { q: 'I want ___ apple.', o: ['a', 'an', 'the', '-'], a: 1, ex: 'לפני צליל תנועה (a,e,i,o,u) משתמשים ב-an.' },
    { q: '___ car outside is mine.', o: ['A', 'An', 'The', 'There'], a: 2, ex: 'מכונית מסוימת שמדברים עליה = the.' },
    { q: '"יש כאן בית מרקחת?" באנגלית:', o: ['There is a pharmacy here?', 'Is there a pharmacy here?', 'Is a pharmacy there here?', 'A pharmacy is here?'], a: 1, ex: 'בשאלה: Is there...?' }
  ],
  dialogue: { title: 'דירה חדשה', intro: 'חבר מתעניין בדירה החדשה שלך. אתה B.',
    turns: [
      { s: 'A', en: "So, how is the new apartment?", he: 'נו, איך הדירה החדשה?' },
      { s: 'B', en: "It's great! There are three rooms and a big kitchen.", he: 'היא מעולה! יש שלושה חדרים ומטבח גדול.' },
      { s: 'A', en: "Nice! Is there a balcony?", he: 'יפה! יש מרפסת?' },
      { s: 'B', en: "Yes, there is a small balcony with a view.", he: 'כן, יש מרפסת קטנה עם נוף.' },
      { s: 'A', en: "What about parking?", he: 'מה לגבי חניה?' },
      { s: 'B', en: "There is no parking, but there is a bus station near the house.", he: 'אין חניה, אבל יש תחנת אוטובוס ליד הבית.' },
      { s: 'A', en: "Are there good restaurants in the area?", he: 'יש מסעדות טובות באזור?' },
      { s: 'B', en: "Yes, there are two excellent restaurants on my street!", he: 'כן, יש שתי מסעדות מצוינות ברחוב שלי!' }
    ] }
},

/* ---------------- L4 ---------------- */
{ id: 'l4', unit: 2, icon: '🌅', en: 'Present Simple', he: 'הווה פשוט: שגרת היום',
  goal: 'בסוף השיעור תוכל לתאר את שגרת היום שלך: מה אתה עושה כל יום.',
  grammar: [
    { t: 'הזמן של ההרגלים',
      p: 'הווה פשוט מתאר דברים שקורים באופן קבוע: כל יום, בדרך כלל, תמיד. הפועל נשאר בצורת הבסיס: I work, you drink, we live.',
      ex: [ ["I work in Tel Aviv.", "אני עובד בתל אביב."], ["We drink coffee every morning.", "אנחנו שותים קפה כל בוקר."], ["They live in Haifa.", "הם גרים בחיפה."] ] },
    { t: 'הכלל הכי חשוב באנגלית: s לגוף שלישי',
      p: 'עם he, she, it מוסיפים s לפועל: He works. She drinks. זו הטעות הכי נפוצה של דוברי עברית - אל תשכח את ה-s! פעלים שנגמרים ב-o, ch, sh מקבלים es: goes, watches.',
      ex: [ ["He works at a bank.", "הוא עובד בבנק."], ["She drinks tea.", "היא שותה תה."], ["My son goes to school.", "הבן שלי הולך לבית ספר."] ] },
    { t: 'מילות תדירות',
      p: 'always (תמיד), usually (בדרך כלל), sometimes (לפעמים), never (אף פעם). המיקום: לפני הפועל. I always drink coffee.',
      ex: [ ["I always get up at six.", "אני תמיד קם בשש."], ["She usually walks to work.", "היא בדרך כלל הולכת ברגל לעבודה."], ["We never eat late.", "אנחנו אף פעם לא אוכלים מאוחר."] ] }
  ],
  vocab: [
    { en: 'get up', he: 'לקום', t: 'גֶט אַפּ', ex: 'I get up at seven.' },
    { en: 'eat', he: 'לאכול', t: 'אִיט', ex: 'We eat breakfast together.' },
    { en: 'drink', he: 'לשתות', t: 'דְרִינְק', ex: 'He drinks coffee.' },
    { en: 'work', he: 'לעבוד / עבודה', t: 'ווֹרְק', ex: 'She works from home.' },
    { en: 'drive', he: 'לנהוג', t: 'דְרַייב', ex: 'I drive to work every day.' },
    { en: 'sleep', he: 'לישון', t: 'סְלִיפּ', ex: 'The baby sleeps a lot.' },
    { en: 'watch', he: 'לצפות', t: 'ווֹץ\'', ex: 'We watch the news at night.' },
    { en: 'read', he: 'לקרוא', t: 'רִיד', ex: 'He reads before bed.' },
    { en: 'always', he: 'תמיד', t: 'אוֹלְוֵויז', ex: 'I always lock the door.' },
    { en: 'usually', he: 'בדרך כלל', t: 'יוּזֶ\'ואָלִי', ex: 'I usually cook dinner.' },
    { en: 'sometimes', he: 'לפעמים', t: 'סַאמְטַיימְז', ex: 'Sometimes we walk on the beach.' },
    { en: 'never', he: 'אף פעם לא', t: 'נֶבֶר', ex: 'He never eats meat.' }
  ],
  sentences: [
    ["I get up at six in the morning.", "אני קם בשש בבוקר."],
    ["I drink two cups of coffee.", "אני שותה שתי כוסות קפה."],
    ["I drive to work every day.", "אני נוסע לעבודה כל יום."],
    ["My wife works from home.", "אשתי עובדת מהבית."],
    ["She usually cooks dinner.", "היא בדרך כלל מבשלת ארוחת ערב."],
    ["We eat dinner at seven.", "אנחנו אוכלים ארוחת ערב בשבע."],
    ["My son plays football on Fridays.", "הבן שלי משחק כדורגל בימי שישי."],
    ["I sometimes read before bed.", "אני לפעמים קורא לפני השינה."],
    ["We always visit family on Saturday.", "אנחנו תמיד מבקרים משפחה בשבת."],
    ["He never drinks coffee at night.", "הוא אף פעם לא שותה קפה בלילה."]
  ],
  quiz: [
    { q: 'She ___ in a hospital.', o: ['work', 'works', 'working', 'is work'], a: 1, ex: 'גוף שלישי יחיד (she) מקבל s.' },
    { q: 'I ___ coffee every morning.', o: ['drinks', 'drinking', 'drink', 'am drink'], a: 2, ex: 'עם I הפועל נשאר בסיסי: drink.' },
    { q: 'My son ___ to school by bus.', o: ['go', 'gos', 'goes', 'going'], a: 2, ex: 'go מקבל es: goes.' },
    { q: '"אני תמיד קם מוקדם":', o: ['I get up always early.', 'Always I get up early.', 'I always get up early.', 'I get always up early.'], a: 2, ex: 'מילת תדירות באה לפני הפועל.' },
    { q: 'We ___ TV in the evening.', o: ['watches', 'watch', 'watching', 'are watch'], a: 1, ex: 'we לא מקבל s.' },
    { q: 'איזה משפט נכון?', o: ['He drink tea.', 'He drinks tea.', 'He drinking tea.', 'He is drink tea.'], a: 1, ex: 'he + פועל עם s.' }
  ],
  dialogue: { title: 'שגרת בוקר', intro: 'קולגה שואל על השגרה שלך. אתה B.',
    turns: [
      { s: 'A', en: "You always come early. What time do you get up?", he: 'אתה תמיד מגיע מוקדם. באיזו שעה אתה קם?' },
      { s: 'B', en: "I get up at six. I like quiet mornings.", he: 'אני קם בשש. אני אוהב בקרים שקטים.' },
      { s: 'A', en: "Six! And what do you do so early?", he: 'שש! ומה אתה עושה כל כך מוקדם?' },
      { s: 'B', en: "I drink coffee, I read the news, and I walk the dog.", he: 'אני שותה קפה, קורא חדשות ומטייל עם הכלב.' },
      { s: 'A', en: "Nice. Do you eat breakfast at home?", he: 'יפה. אתה אוכל ארוחת בוקר בבית?' },
      { s: 'B', en: "Usually yes. My wife makes great omelets.", he: 'בדרך כלל כן. אשתי מכינה חביתות מעולות.' },
      { s: 'A', en: "Lucky you! I never eat before work.", he: 'מזל שיש לך! אני אף פעם לא אוכל לפני העבודה.' },
      { s: 'B', en: "That's not healthy! Breakfast is important.", he: 'זה לא בריא! ארוחת בוקר חשובה.' }
    ] }
},

/* ---------------- L5 ---------------- */
{ id: 'l5', unit: 2, icon: '🙋', en: 'Do / Does', he: 'שאלות ושלילה: do / does',
  goal: 'בסוף השיעור תוכל לשאול "אתה...?" ולומר "אני לא..." על כל פעולה.',
  grammar: [
    { t: 'העוזר הקטן: do',
      p: 'כדי לשאול או לשלול בהווה פשוט, צריך מילת עזר: do (עם I, you, we, they) או does (עם he, she, it). Do you work here? = אתה עובד כאן?',
      ex: [ ["Do you speak English?", "אתה מדבר אנגלית?"], ["Does she live here?", "היא גרה כאן?"], ["Do they have kids?", "יש להם ילדים?"] ] },
    { t: 'כשיש does, ה-s נעלמת',
      p: 'שים לב: He works, אבל בשאלה Does he work? ה-s עברה מהפועל אל does. אותו דבר בשלילה: He doesn\'t work.',
      ex: [ ["Does he work on Fridays?", "הוא עובד בימי שישי?"], ["She doesn't eat meat.", "היא לא אוכלת בשר."], ["It doesn't matter.", "זה לא משנה."] ] },
    { t: 'שלילה: don\'t / doesn\'t',
      p: 'I don\'t know = אני לא יודע. משפט המפתח של כל לומד! don\'t = do not, doesn\'t = does not.',
      ex: [ ["I don't know.", "אני לא יודע."], ["I don't understand.", "אני לא מבין."], ["We don't have time.", "אין לנו זמן."] ] }
  ],
  vocab: [
    { en: 'speak', he: 'לדבר', t: 'סְפִּיק', ex: 'Do you speak English?' },
    { en: 'understand', he: 'להבין', t: 'אַנְדֶרְסְטֶנְד', ex: 'I understand you.' },
    { en: 'know', he: 'לדעת', t: 'נוֹאוּ', ex: 'I know the answer.' },
    { en: 'like', he: 'לאהוב, לחבב', t: 'לַייק', ex: 'I like this song.' },
    { en: 'want', he: 'לרצות', t: 'ווֹנְט', ex: 'Do you want coffee?' },
    { en: 'need', he: 'להזדקק', t: 'נִיד', ex: 'I need help.' },
    { en: 'have', he: 'יש ל-', t: 'הֶב', ex: 'I have two kids.' },
    { en: 'live', he: 'לגור', t: 'לִיב', ex: 'Where do you live?' },
    { en: 'remember', he: 'לזכור', t: 'רִימֶמְבֶּר', ex: "I don't remember his name." },
    { en: 'think', he: 'לחשוב', t: 'תִ\'ינְק', ex: 'I think it is a good idea.' },
    { en: 'again', he: 'שוב', t: 'אֶגֶן', ex: 'Say it again, please.' },
    { en: 'slowly', he: 'לאט', t: 'סְלוֹאוּלִי', ex: 'Please speak slowly.' }
  ],
  sentences: [
    ["Do you speak English?", "אתה מדבר אנגלית?"],
    ["Yes, but please speak slowly.", "כן, אבל בבקשה דבר לאט."],
    ["I don't understand.", "אני לא מבין."],
    ["Can you say it again?", "אתה יכול להגיד את זה שוב?"],
    ["I don't know this word.", "אני לא מכיר את המילה הזאת."],
    ["Do you live in the city?", "אתה גר בעיר?"],
    ["Does your wife work here?", "אשתך עובדת כאן?"],
    ["No, she doesn't work here.", "לא, היא לא עובדת כאן."],
    ["What do you do?", "במה אתה עוסק?"],
    ["I don't remember, sorry.", "אני לא זוכר, סליחה."]
  ],
  quiz: [
    { q: '___ you like fish?', o: ['Does', 'Do', 'Are', 'Is'], a: 1, ex: 'עם you משתמשים ב-Do.' },
    { q: '___ he work here?', o: ['Do', 'Is', 'Does', 'Are'], a: 2, ex: 'עם he משתמשים ב-Does.' },
    { q: 'Does she ___ meat?', o: ['eats', 'eating', 'eat', 'ate'], a: 2, ex: 'אחרי does הפועל חוזר לצורת הבסיס - בלי s.' },
    { q: '"אני לא מבין":', o: ["I not understand.", "I don't understand.", "I doesn't understand.", "I am not understand."], a: 1, ex: 'I + don\'t + פועל.' },
    { q: 'She ___ have a car.', o: ["don't", "isn't", "doesn't", "not"], a: 2, ex: 'she מקבלת doesn\'t.' },
    { q: '"איפה אתה גר?":', o: ['Where you live?', 'Where do you live?', 'Where does you live?', 'Where are you live?'], a: 1, ex: 'מילת שאלה + do + נושא + פועל.' }
  ],
  dialogue: { title: 'לא הבנתי - ולא נורא', intro: 'דובר אנגלית מהיר מדבר איתך בטלפון. אתה B - ואתה שולט בשיחה.',
    turns: [
      { s: 'A', en: "Hi, this is Mark from the insurance company, I'm calling about your policy renewal.", he: 'היי, זה מארק מחברת הביטוח, אני מתקשר לגבי חידוש הפוליסה שלך.' },
      { s: 'B', en: "Hello Mark. I'm sorry, I don't understand. Please speak slowly.", he: 'שלום מארק. סליחה, אני לא מבין. בבקשה דבר לאט.' },
      { s: 'A', en: "Of course. Your car insurance ends this month.", he: 'כמובן. ביטוח הרכב שלך מסתיים החודש.' },
      { s: 'B', en: "OK, now I understand. What do you need from me?", he: 'אוקיי, עכשיו אני מבין. מה אתה צריך ממני?' },
      { s: 'A', en: "Do you want to renew it?", he: 'אתה רוצה לחדש אותו?' },
      { s: 'B', en: "I don't know. Does the price change?", he: 'אני לא יודע. המחיר משתנה?' },
      { s: 'A', en: "No, it stays the same.", he: 'לא, הוא נשאר אותו דבר.' },
      { s: 'B', en: "Good. Please send me an email, and thank you for your patience.", he: 'טוב. בבקשה שלח לי מייל, ותודה על הסבלנות.' }
    ] }
},

/* ---------------- L6 ---------------- */
{ id: 'l6', unit: 2, icon: '🏃', en: 'Present Continuous', he: 'הווה ממושך: מה קורה עכשיו',
  goal: 'בסוף השיעור תוכל לתאר מה קורה ברגע זה, ולהבדיל בין "עכשיו" ל"תמיד".',
  grammar: [
    { t: 'am/is/are + פועל עם ing',
      p: 'כשמשהו קורה ממש עכשיו, משתמשים ב-to be ועוד פועל עם סיומת ing: I am driving = אני נוהג (ברגע זה).',
      ex: [ ["I am driving now.", "אני נוהג עכשיו."], ["She is talking on the phone.", "היא מדברת בטלפון."], ["They are waiting outside.", "הם מחכים בחוץ."] ] },
    { t: 'עכשיו מול תמיד',
      p: 'ההבדל החשוב: I drive to work (כל יום, הרגל) לעומת I am driving (ברגע זה ממש). בעברית שתיהן "אני נוהג" - באנגלית אלה שני זמנים שונים.',
      ex: [ ["I drink coffee every day.", "אני שותה קפה כל יום. (הרגל)"], ["I am drinking coffee now.", "אני שותה קפה עכשיו. (ברגע זה)"], ["He works at a bank, but today he is working from home.", "הוא עובד בבנק, אבל היום הוא עובד מהבית."] ] },
    { t: 'שאלות',
      p: 'הופכים סדר כמו עם to be: Are you listening? = אתה מקשיב? What are you doing? = מה אתה עושה?',
      ex: [ ["What are you doing?", "מה אתה עושה?"], ["Are you listening to me?", "אתה מקשיב לי?"], ["Where are you going?", "לאן אתה הולך?"] ] }
  ],
  vocab: [
    { en: 'now', he: 'עכשיו', t: 'נַאוּ', ex: 'I am busy now.' },
    { en: 'doing', he: 'עושה', t: 'דוּאִינְג', ex: 'What are you doing?' },
    { en: 'going', he: 'הולך', t: 'גוֹאִינְג', ex: 'I am going home.' },
    { en: 'coming', he: 'בא', t: 'קַאמִינְג', ex: 'She is coming soon.' },
    { en: 'waiting', he: 'מחכה', t: 'ווֵייטִינְג', ex: 'We are waiting for you.' },
    { en: 'talking', he: 'מדבר', t: 'טוֹקִינְג', ex: 'He is talking on the phone.' },
    { en: 'listening', he: 'מקשיב', t: 'לִיסֶנִינְג', ex: 'I am listening to music.' },
    { en: 'looking for', he: 'מחפש', t: 'לוּקִינְג פוֹר', ex: 'I am looking for my keys.' },
    { en: 'raining', he: 'יורד גשם', t: 'רֵיינִינְג', ex: 'It is raining outside.' },
    { en: 'busy', he: 'עסוק', t: 'בִּיזִי', ex: 'Sorry, I am busy right now.' },
    { en: 'right now', he: 'ממש עכשיו', t: 'רַייט נַאוּ', ex: 'I am driving right now.' },
    { en: 'moment', he: 'רגע', t: 'מוֹמֶנְט', ex: 'One moment, please.' }
  ],
  sentences: [
    ["I am driving right now.", "אני נוהג ממש עכשיו."],
    ["Can I call you back?", "אני יכול לחזור אליך?"],
    ["What are you doing?", "מה אתה עושה?"],
    ["I am waiting for the doctor.", "אני מחכה לרופא."],
    ["She is talking on the phone.", "היא מדברת בטלפון."],
    ["The kids are playing outside.", "הילדים משחקים בחוץ."],
    ["It is raining in Tel Aviv.", "יורד גשם בתל אביב."],
    ["I am looking for a parking spot.", "אני מחפש מקום חניה."],
    ["We are coming in ten minutes.", "אנחנו מגיעים בעוד עשר דקות."],
    ["He is not listening to me.", "הוא לא מקשיב לי."]
  ],
  quiz: [
    { q: 'Quiet! The baby ___ sleeping.', o: ['are', 'am', 'is', 'be'], a: 2, ex: 'the baby = יחיד = is sleeping.' },
    { q: 'I ___ for the bus now.', o: ['wait', 'am waiting', 'waiting', 'waits'], a: 1, ex: 'עכשיו = am + waiting.' },
    { q: 'What ___ you doing?', o: ['is', 'do', 'are', 'does'], a: 2, ex: 'you מקבל are.' },
    { q: 'איזה משפט מתאר הרגל (לא עכשיו)?', o: ['I am drinking tea.', 'I drink tea every morning.', 'I am driving now.', 'She is cooking.'], a: 1, ex: 'every morning = הרגל = הווה פשוט.' },
    { q: 'He ___ from home today.', o: ['work', 'works', 'is working', 'working'], a: 2, ex: 'today = חריגה זמנית = הווה ממושך.' },
    { q: '"יורד גשם":', o: ['It rains now.', 'It is raining.', 'Rain is.', 'It raining.'], a: 1, ex: 'מזג אוויר ברגע זה: It is raining.' }
  ],
  dialogue: { title: 'שיחה תוך כדי נסיעה', intro: 'אשתך מתקשרת בזמן שאתה נוהג. אתה B (בדיבורית, כמובן).',
    turns: [
      { s: 'A', en: "Hi honey, where are you?", he: 'היי מותק, איפה אתה?' },
      { s: 'B', en: "Hi! I am driving home right now.", he: 'היי! אני נוסע הביתה ממש עכשיו.' },
      { s: 'A', en: "Great. Are you passing the supermarket?", he: 'מעולה. אתה עובר ליד הסופר?' },
      { s: 'B', en: "Yes, I am. Do you need something?", he: 'כן. את צריכה משהו?' },
      { s: 'A', en: "We need milk and bread. The kids are eating everything!", he: 'אנחנו צריכים חלב ולחם. הילדים אוכלים הכול!' },
      { s: 'B', en: "No problem. I am stopping at the store.", he: 'אין בעיה. אני עוצר בחנות.' },
      { s: 'A', en: "Thank you! Dinner is almost ready.", he: 'תודה! ארוחת הערב כמעט מוכנה.' },
      { s: 'B', en: "Perfect, I am very hungry. See you soon!", he: 'מושלם, אני מאוד רעב. נתראה עוד מעט!' }
    ] }
},

/* ---------------- L7 ---------------- */
{ id: 'l7', unit: 3, icon: '🔢', en: 'Numbers, Time & Dates', he: 'מספרים, שעות ותאריכים',
  goal: 'בסוף השיעור תוכל להגיד שעות, מחירים ותאריכים - ולהבין אותם בשמיעה.',
  grammar: [
    { t: 'המלכודת: 13 מול 30',
      p: 'thirteen (13) מול thirty (30) - ההבדל בהטעמה: thir-TEEN בסוף, THIR-ty בהתחלה. אותו דבר: fourteen/forty, fifteen/fifty. גם דוברי אנגלית מתבלבלים בטלפון!',
      ex: [ ["thirteen, thirty", "13, 30"], ["fifteen, fifty", "15, 50"], ["My son is nineteen, not ninety!", "הבן שלי בן 19, לא 90!"] ] },
    { t: 'שעות: פשוט לומר את המספרים',
      p: 'הדרך הקלה: 7:30 = seven thirty. 8:15 = eight fifteen. שעה עגולה: o\'clock: ten o\'clock. חצי שעה אפשר גם: half past seven (7:30).',
      ex: [ ["It's seven thirty.", "השעה שבע וחצי."], ["The meeting is at ten o'clock.", "הפגישה בעשר."], ["I get up at a quarter past six.", "אני קם ברבע אחרי שש."] ] },
    { t: 'מחירים ותאריכים',
      p: 'מחיר: twenty shekels, או באנגלית אמריקאית: $19.99 = nineteen ninety-nine. תאריך: May fifth (חמישי במאי) - החודש ואז מספר סודר: first, second, third, fourth, fifth.',
      ex: [ ["It costs fifty shekels.", "זה עולה חמישים שקל."], ["My birthday is on March third.", "יום ההולדת שלי בשלישי במרץ."], ["Today is Tuesday, July first.", "היום יום שלישי, אחד ביולי."] ] }
  ],
  vocab: [
    { en: 'one, two, three, four, five', he: '1 עד 5', t: 'ווָאן, טוּ, תְ\'רִי, פוֹר, פַייב', ex: 'I have three kids.' },
    { en: 'six, seven, eight, nine, ten', he: '6 עד 10', t: 'סִיקְס, סֶבֶן, אֵייט, נַיין, טֶן', ex: 'The bus comes at ten.' },
    { en: 'eleven, twelve', he: '11, 12', t: 'אִילֶבֶן, טְוֶולְב', ex: 'Lunch is at twelve.' },
    { en: 'twenty, thirty, forty', he: '20, 30, 40', t: 'טְוֶונְטִי, תֶ\'רְטִי, פוֹרְטִי', ex: 'I am forty years old.' },
    { en: 'fifty, sixty, seventy', he: '50, 60, 70', t: 'פִיפְטִי, סִיקְסְטִי, סֶבֶנְטִי', ex: 'It costs seventy shekels.' },
    { en: 'eighty, ninety, hundred', he: '80, 90, 100', t: 'אֵייטִי, נַיינְטִי, הַאנְדְרֶד', ex: 'One hundred percent!' },
    { en: "o'clock", he: 'בשעה עגולה', t: 'אוֹקְלוֹק', ex: 'It is nine o\'clock.' },
    { en: 'half past', he: 'וחצי', t: 'הַאף פֶּסְט', ex: 'It is half past eight.' },
    { en: 'quarter', he: 'רבע', t: 'קְווֹרְטֶר', ex: 'A quarter past five.' },
    { en: 'Sunday, Monday, Tuesday', he: 'ראשון, שני, שלישי', t: 'סַאנְדֵיי, מַאנְדֵיי, טְיוּזְדֵיי', ex: 'The week starts on Sunday.' },
    { en: 'Wednesday, Thursday', he: 'רביעי, חמישי', t: 'ווֶנְזְדֵיי, תֶ\'רְזְדֵיי', ex: 'The meeting is on Wednesday.' },
    { en: 'Friday, Saturday', he: 'שישי, שבת', t: 'פְרַיידֵיי, סֶטֶרְדֵיי', ex: 'We rest on Saturday.' }
  ],
  sentences: [
    ["It is half past seven.", "השעה שבע וחצי."],
    ["The meeting is at ten o'clock.", "הפגישה בשעה עשר."],
    ["I get up at six fifteen.", "אני קם בשש ורבע."],
    ["The store opens at nine.", "החנות נפתחת בתשע."],
    ["It costs forty shekels.", "זה עולה ארבעים שקל."],
    ["My number is zero five four, three three zero, one two one two.", "המספר שלי 054-330-1212."],
    ["Today is Thursday.", "היום יום חמישי."],
    ["My birthday is in October.", "יום ההולדת שלי באוקטובר."],
    ["The flight is at eleven forty.", "הטיסה באחת עשרה ארבעים."],
    ["I am fifty three years old.", "אני בן חמישים ושלוש."]
  ],
  quiz: [
    { q: '7:30 באנגלית:', o: ['seven thirteen', 'seven thirty', 'thirty seven', 'seven three'], a: 1, ex: 'שבע וחצי = seven thirty.' },
    { q: 'המספר 15:', o: ['fifty', 'five', 'fifteen', 'fivety'], a: 2, ex: '15 = fifteen (הטעמה בסוף), 50 = fifty.' },
    { q: '"הפגישה בתשע":', o: ['The meeting is nine.', 'The meeting is at nine.', 'The meeting is on nine.', 'The meeting is in nine.'], a: 1, ex: 'שעות מקבלות at.' },
    { q: 'יום רביעי:', o: ['Thursday', 'Tuesday', 'Wednesday', 'Saturday'], a: 2, ex: 'Wednesday. ה-d הראשונה כמעט לא נשמעת: ווֶנְזְדֵיי.' },
    { q: '90 באנגלית:', o: ['nineteen', 'ninety', 'ninteen', 'ninehundred'], a: 1, ex: '90 = ninety, 19 = nineteen.' },
    { q: '"ההולדת שלי בחמישה במאי":', o: ['My birthday is on May five.', 'My birthday is on May fifth.', 'My birthday is on fifth May.', 'My birthday is May in fifth.'], a: 1, ex: 'תאריך: חודש + מספר סודר (fifth).' }
  ],
  dialogue: { title: 'קביעת תור', intro: 'אתה מתקשר לקבוע תור לרופא שיניים. אתה B.',
    turns: [
      { s: 'A', en: "Good morning, Dr. Miller's office. How can I help you?", he: 'בוקר טוב, המרפאה של ד"ר מילר. איך אפשר לעזור?' },
      { s: 'B', en: "Good morning. I need an appointment, please.", he: 'בוקר טוב. אני צריך תור, בבקשה.' },
      { s: 'A', en: "Sure. Is Wednesday at three thirty OK?", he: 'בטח. יום רביעי בשלוש וחצי בסדר?' },
      { s: 'B', en: "Wednesday is not good for me. Do you have Thursday?", he: 'רביעי לא טוב לי. יש לכם חמישי?' },
      { s: 'A', en: "Yes, Thursday at a quarter past ten.", he: 'כן, חמישי ברבע אחרי עשר.' },
      { s: 'B', en: "Ten fifteen is perfect. How much is a checkup?", he: 'עשר ורבע זה מושלם. כמה עולה בדיקה?' },
      { s: 'A', en: "It's two hundred and fifty shekels.", he: 'זה מאתיים חמישים שקל.' },
      { s: 'B', en: "OK, great. Thank you, see you on Thursday!", he: 'אוקיי, מצוין. תודה, נתראה בחמישי!' }
    ] }
},

/* ---------------- L8 ---------------- */
{ id: 'l8', unit: 3, icon: '🍽️', en: 'At the Restaurant', he: 'במסעדה: להזמין כמו מקומי',
  goal: 'בסוף השיעור תוכל להזמין אוכל, לבקש שינויים ולבקש חשבון - בביטחון.',
  grammar: [
    { t: 'המשפט שפותח הכול: I would like',
      p: 'I want נשמע קצת ילדותי. המבוגרים אומרים: I would like... (הייתי רוצה) או בקיצור: I\'d like. עוד יותר טבעי: Can I have...? / Could I get...?',
      ex: [ ["I'd like the fish, please.", "אני אקח את הדג, בבקשה."], ["Can I have a glass of water?", "אפשר כוס מים?"], ["Could I get the menu?", "אפשר לקבל את התפריט?"] ] },
    { t: 'לבקש שינויים בלי מבוכה',
      p: 'without = בלי. instead of = במקום. on the side = בצד. אלה שלוש המילים שהופכות כל מנה למה שאתה באמת רוצה.',
      ex: [ ["Without onions, please.", "בלי בצל, בבקשה."], ["Salad instead of fries.", "סלט במקום צ'יפס."], ["The sauce on the side, please.", "הרוטב בצד, בבקשה."] ] },
    { t: 'סוף הארוחה',
      p: 'The check, please = חשבון בבקשה (באנגלית בריטית: the bill). Is service included? = האם השירות כלול? Everything was delicious = הכול היה טעים.',
      ex: [ ["The check, please.", "חשבון, בבקשה."], ["Everything was delicious.", "הכול היה טעים."], ["Do you take credit cards?", "אתם מקבלים כרטיסי אשראי?"] ] }
  ],
  vocab: [
    { en: 'menu', he: 'תפריט', t: 'מֶנְיוּ', ex: 'Can I see the menu?' },
    { en: 'order', he: 'להזמין / הזמנה', t: 'אוֹרְדֶר', ex: 'Are you ready to order?' },
    { en: 'water', he: 'מים', t: 'ווֹטֶר', ex: 'A glass of water, please.' },
    { en: 'chicken', he: 'עוף', t: 'צִ\'יקֶן', ex: 'I would like the chicken.' },
    { en: 'fish', he: 'דג', t: 'פִיש', ex: 'The fish is very fresh.' },
    { en: 'salad', he: 'סלט', t: 'סֶלֶד', ex: 'A big salad, please.' },
    { en: 'without', he: 'בלי', t: 'ווִידַ\'אוּט', ex: 'Coffee without sugar.' },
    { en: 'delicious', he: 'טעים', t: 'דִילִישֶס', ex: 'The soup is delicious.' },
    { en: 'check', he: 'חשבון', t: 'צֶ\'ק', ex: 'The check, please.' },
    { en: 'tip', he: 'טיפ, תשר', t: 'טִיפּ', ex: 'The tip is not included.' },
    { en: 'spicy', he: 'חריף', t: 'סְפַּייסִי', ex: 'Is it spicy?' },
    { en: 'allergic', he: 'אלרגי', t: 'אֶלֶרְגִ\'יק', ex: 'I am allergic to nuts.' }
  ],
  sentences: [
    ["A table for two, please.", "שולחן לשניים, בבקשה."],
    ["Can I see the menu?", "אפשר לראות את התפריט?"],
    ["I would like the chicken, please.", "אני אקח את העוף, בבקשה."],
    ["Without onions, please.", "בלי בצל, בבקשה."],
    ["Is the fish fresh?", "הדג טרי?"],
    ["I am allergic to nuts.", "אני אלרגי לאגוזים."],
    ["Can we have more water?", "אפשר עוד מים?"],
    ["Everything was delicious.", "הכול היה טעים."],
    ["The check, please.", "חשבון, בבקשה."],
    ["Do you take credit cards?", "אתם מקבלים אשראי?"]
  ],
  quiz: [
    { q: 'הדרך המנומסת להזמין:', o: ['Give me chicken.', 'I want chicken now.', "I'd like the chicken, please.", 'Chicken!'], a: 2, ex: "I'd like = הייתי רוצה. מנומס ובוגר." },
    { q: '"בלי סוכר":', o: ['no with sugar', 'without sugar', 'not sugar', 'sugar no'], a: 1, ex: 'without = בלי.' },
    { q: '"אפשר כוס מים?":', o: ['Can I have a glass of water?', 'I can water?', 'Give water glass?', 'Water me please?'], a: 0, ex: 'Can I have...? = הדרך הטבעית לבקש.' },
    { q: 'איך מבקשים חשבון?', o: ['The money, please.', 'The check, please.', 'The pay, please.', 'The list, please.'], a: 1, ex: 'check (אמריקאי) או bill (בריטי).' },
    { q: '"אני אלרגי לאגוזים":', o: ['I am allergic to nuts.', 'I allergic nuts.', 'Nuts are allergic to me.', 'I am allergy nuts.'], a: 0, ex: 'allergic to + הדבר.' },
    { q: '"סלט במקום צ\'יפס":', o: ['Salad no fries.', 'Salad instead of fries.', 'Salad from fries.', 'Fries change salad.'], a: 1, ex: 'instead of = במקום.' }
  ],
  dialogue: { title: 'ערב במסעדה', intro: 'מלצר לוקח את ההזמנה שלך. אתה B.',
    turns: [
      { s: 'A', en: "Good evening! Are you ready to order?", he: 'ערב טוב! מוכנים להזמין?' },
      { s: 'B', en: "Yes. I'd like the grilled fish, please.", he: 'כן. אני אקח את הדג בגריל, בבקשה.' },
      { s: 'A', en: "Excellent choice. It comes with fries or rice.", he: 'בחירה מצוינת. זה מגיע עם צ\'יפס או אורז.' },
      { s: 'B', en: "A salad instead of fries, is that possible?", he: 'סלט במקום צ\'יפס, זה אפשרי?' },
      { s: 'A', en: "Of course. Anything to drink?", he: 'כמובן. משהו לשתות?' },
      { s: 'B', en: "Sparkling water, please. And is the fish spicy?", he: 'מים מוגזים, בבקשה. והדג חריף?' },
      { s: 'A', en: "No, it's not spicy at all.", he: 'לא, הוא בכלל לא חריף.' },
      { s: 'B', en: "Perfect. That's all, thank you very much.", he: 'מושלם. זה הכול, תודה רבה.' }
    ] }
},

/* ---------------- L9 ---------------- */
{ id: 'l9', unit: 4, icon: '📼', en: 'Past Simple: Regular Verbs', he: 'עבר פשוט: פעלים רגילים',
  goal: 'בסוף השיעור תוכל לספר מה עשית אתמול ובסוף השבוע.',
  grammar: [
    { t: 'הנוסחה: פועל + ed',
      p: 'רוב הפעלים מקבלים ed בעבר: work הופך ל-worked, play ל-played. והבשורה הטובה: בעבר אין s לגוף שלישי! I worked, she worked - אותה צורה לכולם.',
      ex: [ ["I worked late yesterday.", "עבדתי מאוחר אתמול."], ["She called me twice.", "היא התקשרה אליי פעמיים."], ["We watched a movie.", "צפינו בסרט."] ] },
    { t: 'איך ה-ed נשמעת',
      p: 'שלוש דרכים: אחרי צליל רך - d (played = פְּלֵייד). אחרי צליל קשה כמו k, p, s - t (worked = ווֹרְקְט). אחרי t או d - id (wanted = ווֹנְטִיד). אל תגיד "וורקד" - זה workt!',
      ex: [ ["played", "פְּלֵייד"], ["worked", "ווֹרְקְט"], ["wanted", "ווֹנְטִיד"] ] },
    { t: 'מילות זמן של עבר',
      p: 'yesterday (אתמול), last week (בשבוע שעבר), two days ago (לפני יומיים), this morning (הבוקר). המילה ago באה אחרי הזמן: three years ago.',
      ex: [ ["I called you yesterday.", "התקשרתי אליך אתמול."], ["We moved here five years ago.", "עברנו לכאן לפני חמש שנים."], ["She worked there last year.", "היא עבדה שם בשנה שעברה."] ] }
  ],
  vocab: [
    { en: 'yesterday', he: 'אתמול', t: 'יֶסְטֶרְדֵיי', ex: 'Yesterday was a long day.' },
    { en: 'last week', he: 'בשבוע שעבר', t: 'לֶסְט ווִיק', ex: 'We met last week.' },
    { en: 'ago', he: 'לפני (זמן)', t: 'אֶגוֹאוּ', ex: 'Two hours ago.' },
    { en: 'worked', he: 'עבד', t: 'ווֹרְקְט', ex: 'I worked all day.' },
    { en: 'played', he: 'שיחק', t: 'פְּלֵייד', ex: 'The kids played outside.' },
    { en: 'called', he: 'התקשר', t: 'קוֹלְד', ex: 'She called me yesterday.' },
    { en: 'watched', he: 'צפה', t: 'ווֹצְ\'ט', ex: 'We watched the game.' },
    { en: 'cooked', he: 'בישל', t: 'קוּקְט', ex: 'He cooked dinner.' },
    { en: 'visited', he: 'ביקר', t: 'ווִיזִיטִיד', ex: 'We visited my parents.' },
    { en: 'walked', he: 'הלך ברגל', t: 'ווֹקְט', ex: 'I walked on the beach.' },
    { en: 'stayed', he: 'נשאר', t: 'סְטֵייד', ex: 'We stayed at home.' },
    { en: 'finished', he: 'סיים', t: 'פִינִישְט', ex: 'I finished the book.' }
  ],
  sentences: [
    ["I worked late yesterday.", "עבדתי מאוחר אתמול."],
    ["We watched a movie last night.", "צפינו בסרט אתמול בלילה."],
    ["She called me this morning.", "היא התקשרה אליי הבוקר."],
    ["The kids played in the park.", "הילדים שיחקו בפארק."],
    ["I cooked dinner for the family.", "בישלתי ארוחת ערב למשפחה."],
    ["We visited my parents on Saturday.", "ביקרנו את ההורים שלי בשבת."],
    ["I walked on the beach this morning.", "הלכתי על החוף הבוקר."],
    ["He finished work at six.", "הוא סיים לעבוד בשש."],
    ["We stayed at home all weekend.", "נשארנו בבית כל סוף השבוע."],
    ["I started to learn English a month ago.", "התחלתי ללמוד אנגלית לפני חודש."]
  ],
  quiz: [
    { q: 'I ___ TV last night.', o: ['watch', 'watches', 'watched', 'watching'], a: 2, ex: 'last night = עבר = watched.' },
    { q: 'She ___ me an hour ago.', o: ['calls', 'called', 'call', 'calling'], a: 1, ex: 'ago = עבר.' },
    { q: 'בעבר, עם she הפועל:', o: ['מקבל s', 'מקבל ed בלבד', 'מקבל ing', 'לא משתנה'], a: 1, ex: 'בעבר אין s לגוף שלישי - רק ed לכולם.' },
    { q: 'איך נשמע worked?', o: ['ווֹרְקִיד', 'ווֹרְקְד', 'ווֹרְקְט', 'ווֹרְקֶן'], a: 2, ex: 'אחרי k, ה-ed נשמעת כמו t.' },
    { q: '"לפני שלוש שנים":', o: ['before three years', 'three years ago', 'ago three years', 'three years before'], a: 1, ex: 'ago באה אחרי משך הזמן.' },
    { q: 'We ___ at a nice hotel.', o: ['stayed', 'stay', 'staying', 'stays'], a: 0, ex: 'stay + ed = stayed.' }
  ],
  dialogue: { title: 'איך היה סוף השבוע?', intro: 'קולגה שואל על סוף השבוע. אתה B.',
    turns: [
      { s: 'A', en: "Good morning! How was your weekend?", he: 'בוקר טוב! איך היה סוף השבוע?' },
      { s: 'B', en: "It was great! We visited my brother in the north.", he: 'היה מעולה! ביקרנו את אח שלי בצפון.' },
      { s: 'A', en: "Nice! What did you do there?", he: 'יפה! מה עשיתם שם?' },
      { s: 'B', en: "We walked in the mountains and cooked together.", he: 'טיילנו בהרים ובישלנו ביחד.' },
      { s: 'A', en: "Sounds perfect. Was the weather good?", he: 'נשמע מושלם. מזג האוויר היה טוב?' },
      { s: 'B', en: "Yes, it was beautiful. We stayed outside all day.", he: 'כן, היה יפהפה. נשארנו בחוץ כל היום.' },
      { s: 'A', en: "I stayed home and watched TV all weekend.", he: 'אני נשארתי בבית וצפיתי בטלוויזיה כל הסופ"ש.' },
      { s: 'B', en: "Sometimes that is exactly what you need!", he: 'לפעמים זה בדיוק מה שצריך!' }
    ] }
},

/* ---------------- L10 ---------------- */
{ id: 'l10', unit: 4, icon: '🎬', en: 'Past Simple: Irregular Verbs', he: 'עבר: הפעלים החריגים החשובים',
  goal: 'בסוף השיעור תשלוט ב-12 הפעלים החריגים שמופיעים בכל שיחה.',
  grammar: [
    { t: 'הפעלים שלא מצייתים לחוקים',
      p: 'הפעלים הכי נפוצים באנגלית הם חריגים - אין ed, יש צורה מיוחדת: go הופך ל-went, see ל-saw, eat ל-ate. אין קיצור דרך: לומדים אותם בעל פה. החדשות הטובות: הם מעטים והם חוזרים כל הזמן.',
      ex: [ ["I went to the doctor.", "הלכתי לרופא."], ["We saw a great movie.", "ראינו סרט מעולה."], ["She ate at the new restaurant.", "היא אכלה במסעדה החדשה."] ] },
    { t: 'was / were: העבר של to be',
      p: 'am/is הופכים ל-was. are הופך ל-were. I was tired = הייתי עייף. They were here = הם היו כאן.',
      ex: [ ["I was very tired.", "הייתי מאוד עייף."], ["The food was delicious.", "האוכל היה טעים."], ["They were at the beach.", "הם היו בים."] ] },
    { t: 'שנים עשר החריגים הגדולים',
      p: 'go-went, see-saw, eat-ate, have-had, do-did, get-got, come-came, take-took, make-made, say-said, buy-bought, drive-drove. אלה 80 אחוז מהשיחות שלך.',
      ex: [ ["I had a good day.", "היה לי יום טוב."], ["He said hello.", "הוא אמר שלום."], ["We bought a new car.", "קנינו מכונית חדשה."] ] }
  ],
  vocab: [
    { en: 'went', he: 'הלך (עבר)', t: 'ווֶנְט', ex: 'I went home early.' },
    { en: 'saw', he: 'ראה', t: 'סוֹ', ex: 'I saw your message.' },
    { en: 'ate', he: 'אכל', t: 'אֵייט', ex: 'We ate lunch together.' },
    { en: 'had', he: 'היה ל-', t: 'הֶד', ex: 'I had a meeting.' },
    { en: 'did', he: 'עשה', t: 'דִיד', ex: 'She did a great job.' },
    { en: 'got', he: 'קיבל', t: 'גוֹט', ex: 'I got your email.' },
    { en: 'came', he: 'בא', t: 'קֵיים', ex: 'He came late.' },
    { en: 'took', he: 'לקח', t: 'טוּק', ex: 'She took the bus.' },
    { en: 'made', he: 'הכין, עשה', t: 'מֵייד', ex: 'I made coffee.' },
    { en: 'said', he: 'אמר', t: 'סֶד', ex: 'He said yes!' },
    { en: 'bought', he: 'קנה', t: 'בּוֹט', ex: 'We bought fruit at the market.' },
    { en: 'drove', he: 'נהג', t: 'דְרוֹאוּב', ex: 'I drove to Jerusalem.' }
  ],
  sentences: [
    ["I went to the market this morning.", "הלכתי לשוק הבוקר."],
    ["We saw our friends on Friday.", "ראינו את החברים שלנו בשישי."],
    ["I had a very busy day.", "היה לי יום מאוד עמוס."],
    ["She made an amazing dinner.", "היא הכינה ארוחת ערב מדהימה."],
    ["We ate too much!", "אכלנו יותר מדי!"],
    ["I drove two hours to get there.", "נהגתי שעתיים כדי להגיע לשם."],
    ["He took the kids to school.", "הוא לקח את הילדים לבית הספר."],
    ["I got a message from the bank.", "קיבלתי הודעה מהבנק."],
    ["They came to visit us.", "הם באו לבקר אותנו."],
    ["The weather was perfect yesterday.", "מזג האוויר היה מושלם אתמול."]
  ],
  quiz: [
    { q: 'העבר של go:', o: ['goed', 'went', 'gone', 'going'], a: 1, ex: 'go - went. חריג נפוץ מאוד.' },
    { q: 'I ___ a good movie last night.', o: ['see', 'seed', 'saw', 'seen'], a: 2, ex: 'see - saw.' },
    { q: 'They ___ at home yesterday.', o: ['was', 'is', 'were', 'are'], a: 2, ex: 'they מקבל were בעבר.' },
    { q: 'She ___ dinner for everyone.', o: ['maked', 'make', 'made', 'makes'], a: 2, ex: 'make - made.' },
    { q: 'העבר של buy:', o: ['buyed', 'bought', 'buy', 'boughted'], a: 1, ex: 'buy - bought (בּוֹט).' },
    { q: 'I ___ tired after the trip.', o: ['were', 'am', 'was', 'be'], a: 2, ex: 'I מקבל was בעבר.' }
  ],
  dialogue: { title: 'מה עשית אתמול?', intro: 'חבר מתקשר לשמוע מה נשמע. אתה B.',
    turns: [
      { s: 'A', en: "Hey! I called you yesterday, but you didn't answer.", he: 'היי! התקשרתי אליך אתמול, אבל לא ענית.' },
      { s: 'B', en: "Sorry! I had a crazy day. I drove to Jerusalem and back.", he: 'סליחה! היה לי יום מטורף. נסעתי לירושלים וחזרה.' },
      { s: 'A', en: "Wow, why did you go there?", he: 'וואו, למה נסעת לשם?' },
      { s: 'B', en: "My daughter got a new apartment. We took her some furniture.", he: 'הבת שלי קיבלה דירה חדשה. לקחנו לה רהיטים.' },
      { s: 'A', en: "That's wonderful news! How is the apartment?", he: 'אלה חדשות נפלאות! איך הדירה?' },
      { s: 'B', en: "Beautiful. We saw the whole city from her window.", he: 'יפהפייה. ראינו את כל העיר מהחלון שלה.' },
      { s: 'A', en: "Amazing. So you came home late?", he: 'מדהים. אז חזרת הביתה מאוחר?' },
      { s: 'B', en: "Very late. But it was a perfect day.", he: 'מאוד מאוחר. אבל זה היה יום מושלם.' }
    ] }
},

/* ---------------- L11 ---------------- */
{ id: 'l11', unit: 4, icon: '📖', en: 'Telling a Story', he: 'לספר סיפור: שאלות בעבר ומילות רצף',
  goal: 'בסוף השיעור תוכל לספר סיפור שלם עם התחלה, אמצע וסוף - ולשאול על העבר.',
  grammar: [
    { t: 'שאלות בעבר: did',
      p: 'שאלה בעבר משתמשת ב-did לכולם, והפועל חוזר לצורת הבסיס: Did you see? (לא Did you saw). שלילה: didn\'t + פועל בסיסי: I didn\'t go.',
      ex: [ ["Did you sleep well?", "ישנת טוב?"], ["Where did you go?", "לאן הלכת?"], ["I didn't hear the phone.", "לא שמעתי את הטלפון."] ] },
    { t: 'מילות רצף: השלד של כל סיפור',
      p: 'First (קודם), then (אז), after that (אחרי זה), finally (לבסוף), suddenly (פתאום). עם חמש המילים האלה כל רצף אירועים הופך לסיפור.',
      ex: [ ["First, I drove to the bank.", "קודם נסעתי לבנק."], ["Then I met a friend.", "אז פגשתי חבר."], ["Suddenly, it started to rain.", "פתאום התחיל לרדת גשם."] ] },
    { t: 'תגובות של מאזין טוב',
      p: 'כשמישהו מספר לך סיפור: Really? (באמת?), What happened? (מה קרה?), And then what? (ואז מה?), No way! (אין מצב!).',
      ex: [ ["Really? What happened?", "באמת? מה קרה?"], ["And then what?", "ואז מה?"], ["No way!", "אין מצב!"] ] }
  ],
  vocab: [
    { en: 'first', he: 'קודם, ראשית', t: 'פֶרְסְט', ex: 'First, we packed the car.' },
    { en: 'then', he: 'אז, אחר כך', t: 'דֶ\'ן', ex: 'Then we drove north.' },
    { en: 'after that', he: 'אחרי זה', t: 'אֶפְטֶר דֶ\'ט', ex: 'After that, we ate lunch.' },
    { en: 'finally', he: 'לבסוף', t: 'פַיינֶלִי', ex: 'Finally, we got home.' },
    { en: 'suddenly', he: 'פתאום', t: 'סַאדֶנְלִי', ex: 'Suddenly, the phone rang.' },
    { en: 'happened', he: 'קרה', t: 'הֶפֶּנְד', ex: 'What happened?' },
    { en: 'story', he: 'סיפור', t: 'סְטוֹרִי', ex: 'That is a funny story.' },
    { en: 'lost', he: 'איבד / אבוד', t: 'לוֹסְט', ex: 'I lost my keys.' },
    { en: 'found', he: 'מצא', t: 'פַאוּנְד', ex: 'I found them in the car!' },
    { en: 'forgot', he: 'שכח', t: 'פוֹרְגוֹט', ex: 'I forgot my phone at home.' },
    { en: 'met', he: 'פגש', t: 'מֶט', ex: 'I met an old friend.' },
    { en: 'luckily', he: 'למזלי', t: 'לַאקִילִי', ex: 'Luckily, nobody was hurt.' }
  ],
  sentences: [
    ["Did you sleep well?", "ישנת טוב?"],
    ["What did you do yesterday?", "מה עשית אתמול?"],
    ["First, I went to the doctor.", "קודם הלכתי לרופא."],
    ["Then I met a friend for coffee.", "אחר כך נפגשתי עם חבר לקפה."],
    ["Suddenly, it started to rain.", "פתאום התחיל לרדת גשם."],
    ["I forgot my umbrella at home.", "שכחתי את המטרייה בבית."],
    ["Luckily, my friend drove me home.", "למזלי, החבר שלי הסיע אותי הביתה."],
    ["I lost my keys last week.", "איבדתי את המפתחות בשבוע שעבר."],
    ["Finally, I found them in my coat.", "לבסוף מצאתי אותם במעיל."],
    ["You will not believe what happened!", "לא תאמין מה קרה!"]
  ],
  quiz: [
    { q: '___ you see the game?', o: ['Do', 'Did', 'Was', 'Were'], a: 1, ex: 'שאלה בעבר: Did.' },
    { q: 'Did you ___ to the party?', o: ['went', 'go', 'goes', 'going'], a: 1, ex: 'אחרי did הפועל חוזר לבסיס: go.' },
    { q: 'I ___ hear the phone.', o: ["don't", "didn't", "wasn't", "am not"], a: 1, ex: 'שלילה בעבר: didn\'t.' },
    { q: '"פתאום" באנגלית:', o: ['finally', 'firstly', 'suddenly', 'usually'], a: 2, ex: 'suddenly = פתאום.' },
    { q: 'סדר נכון לסיפור:', o: ['Then, First, Finally', 'First, Then, Finally', 'Finally, Then, First', 'First, Finally, Then'], a: 1, ex: 'קודם, אז, לבסוף.' },
    { q: '"מה קרה?":', o: ['What happen?', 'What did happened?', 'What happened?', 'What was happen?'], a: 2, ex: 'What happened? - בלי did כשהשאלה על הנושא עצמו.' }
  ],
  dialogue: { title: 'הסיפור על המפתחות', intro: 'אתה מספר לחבר מה קרה לך אתמול. אתה B.',
    turns: [
      { s: 'A', en: "You look tired. What happened yesterday?", he: 'אתה נראה עייף. מה קרה אתמול?' },
      { s: 'B', en: "What a day! First, I lost my car keys.", he: 'איזה יום! קודם כול, איבדתי את מפתחות האוטו.' },
      { s: 'A', en: "Oh no! Where did you look?", he: 'אוי לא! איפה חיפשת?' },
      { s: 'B', en: "Everywhere! Then I called my wife, but she didn't answer.", he: 'בכל מקום! אז התקשרתי לאשתי, אבל היא לא ענתה.' },
      { s: 'A', en: "So what did you do?", he: 'אז מה עשית?' },
      { s: 'B', en: "I took a taxi to work. After that, my wife called back.", he: 'לקחתי מונית לעבודה. אחרי זה, אשתי חזרה אליי.' },
      { s: 'A', en: "And? Did she find the keys?", he: 'ו...? היא מצאה את המפתחות?' },
      { s: 'B', en: "Yes! Finally, she found them in the washing machine!", he: 'כן! בסוף היא מצאה אותם במכונת הכביסה!' }
    ] }
},

/* ---------------- L12 ---------------- */
{ id: 'l12', unit: 5, icon: '🔮', en: 'Future: Going to & Will', he: 'עתיד: תוכניות והבטחות',
  goal: 'בסוף השיעור תוכל לדבר על תוכניות, תחזיות והחלטות של הרגע.',
  grammar: [
    { t: 'תוכנית קיימת: going to',
      p: 'כשכבר החלטת ותכננת: I am going to visit my son = אני מתכוון לבקר את הבן שלי. הנוסחה: to be + going to + פועל.',
      ex: [ ["I am going to visit my son on Friday.", "אני מתכוון לבקר את הבן שלי בשישי."], ["We are going to sell the car.", "אנחנו מתכוונים למכור את האוטו."], ["She is going to start a new job.", "היא עומדת להתחיל עבודה חדשה."] ] },
    { t: 'החלטה של הרגע והבטחה: will',
      p: 'כשמחליטים עכשיו, תוך כדי דיבור: I will help you = אני אעזור לך. קיצור: I\'ll. שלילה: won\'t. גם להבטחות ותחזיות: It will be fine = יהיה בסדר.',
      ex: [ ["I'll call you tomorrow.", "אתקשר אליך מחר."], ["Don't worry, it will be fine.", "אל תדאג, יהיה בסדר."], ["I won't forget.", "אני לא אשכח."] ] },
    { t: 'ההבדל בקצרה',
      p: 'going to = תוכנית שכבר קיימת בראש. will = החלטה ספונטנית, הבטחה או ניחוש. בספק? going to לתוכניות, will לכל השאר.',
      ex: [ ["We are going to fly to Greece in May.", "אנחנו טסים ליוון במאי. (מתוכנן)"], ["I'm tired. I'll go to sleep.", "אני עייף. אלך לישון. (החלטה עכשיו)"], ["I think it will rain.", "אני חושב שירד גשם. (ניחוש)"] ] }
  ],
  vocab: [
    { en: 'tomorrow', he: 'מחר', t: 'טוּמוֹרוֹאוּ', ex: 'See you tomorrow!' },
    { en: 'next week', he: 'בשבוע הבא', t: 'נֶקְסְט ווִיק', ex: 'The party is next week.' },
    { en: 'soon', he: 'בקרוב', t: 'סוּן', ex: 'I will be there soon.' },
    { en: 'plan', he: 'תוכנית / לתכנן', t: 'פְּלֶן', ex: 'What is the plan?' },
    { en: 'trip', he: 'טיול, נסיעה', t: 'טְרִיפּ', ex: 'We are planning a trip.' },
    { en: 'promise', he: 'להבטיח', t: 'פְּרוֹמִיס', ex: 'I promise to call.' },
    { en: 'probably', he: 'כנראה', t: 'פְּרוֹבֶּבְּלִי', ex: 'It will probably rain.' },
    { en: 'maybe', he: 'אולי', t: 'מֵייבִּי', ex: 'Maybe we will go out.' },
    { en: 'retire', he: 'לצאת לפנסיה', t: 'רִיטַייר', ex: 'He is going to retire next year.' },
    { en: 'move', he: 'לעבור דירה', t: 'מוּב', ex: 'They are going to move to Haifa.' },
    { en: 'weekend', he: 'סוף שבוע', t: 'ווִיקֶנְד', ex: 'Have a nice weekend!' },
    { en: 'worry', he: 'לדאוג', t: 'ווֹרִי', ex: "Don't worry about it." }
  ],
  sentences: [
    ["I am going to visit my family on Saturday.", "אני מתכוון לבקר את המשפחה בשבת."],
    ["We are going to travel next month.", "אנחנו מתכוונים לטייל בחודש הבא."],
    ["I'll call you back in five minutes.", "אחזור אליך בעוד חמש דקות."],
    ["Don't worry, everything will be fine.", "אל תדאג, הכול יהיה בסדר."],
    ["What are you going to do this weekend?", "מה אתה מתכוון לעשות בסוף השבוע?"],
    ["It will probably rain tomorrow.", "כנראה ירד גשם מחר."],
    ["I promise I won't be late.", "אני מבטיח שלא אאחר."],
    ["She is going to start a new job soon.", "היא עומדת להתחיל עבודה חדשה בקרוב."],
    ["I think you will love this place.", "אני חושב שתאהב את המקום הזה."],
    ["We will see you next week.", "נתראה בשבוע הבא."]
  ],
  quiz: [
    { q: 'תוכנית קיימת: We ___ move next year.', o: ['will', 'are going to', 'going', 'moves'], a: 1, ex: 'תוכנית מתוכננת = going to.' },
    { q: 'הטלפון מצלצל! I ___ answer it.', o: ["am going to", "'ll", 'going to', 'will going'], a: 1, ex: 'החלטה של הרגע = will (I\'ll).' },
    { q: 'קיצור של will not:', o: ["willn't", "won't", "don't will", "not'll"], a: 1, ex: "will not = won't (ווֹאוּנְט)." },
    { q: 'I think it ___ rain tomorrow.', o: ['is going', 'will', 'wills', 'going to'], a: 1, ex: 'ניחוש עם I think = will.' },
    { q: '"אני מבטיח שאתקשר":', o: ['I promise I call.', 'I promise I will call.', 'I promise I calling.', 'I promise I am call.'], a: 1, ex: 'הבטחה = will.' },
    { q: 'She ___ going to retire.', o: ['is', 'are', 'will', 'do'], a: 0, ex: 'she + is + going to.' }
  ],
  dialogue: { title: 'תוכניות לסוף השבוע', intro: 'שכן שואל על התוכניות שלך. אתה B.',
    turns: [
      { s: 'A', en: "Any plans for the weekend?", he: 'יש תוכניות לסוף השבוע?' },
      { s: 'B', en: "Yes! We are going to drive up north on Friday.", he: 'כן! אנחנו מתכוונים לנסוע צפונה בשישי.' },
      { s: 'A', en: "Nice! Where are you going to stay?", he: 'יפה! איפה אתם מתכוונים ללון?' },
      { s: 'B', en: "In a small hotel near the Kinneret.", he: 'במלון קטן ליד הכנרת.' },
      { s: 'A', en: "Sounds lovely. The weather will be perfect.", he: 'נשמע מקסים. מזג האוויר יהיה מושלם.' },
      { s: 'B', en: "I hope so! What about you? What are you going to do?", he: 'אני מקווה! ומה איתך? מה אתה מתכוון לעשות?' },
      { s: 'A', en: "Nothing special. Maybe I'll visit my mother.", he: 'שום דבר מיוחד. אולי אבקר את אמא שלי.' },
      { s: 'B', en: "That's nice. I'll bring you some good cheese from the north!", he: 'זה נחמד. אביא לך גבינה טובה מהצפון!' }
    ] }
},

/* ---------------- L13 ---------------- */
{ id: 'l13', unit: 5, icon: '✈️', en: 'Travel English', he: 'אנגלית לנסיעות: שדה תעופה ומלון',
  goal: 'בסוף השיעור תוכל לעבור צ׳ק-אין, להתמצא בשדה תעופה ולהסתדר במלון.',
  grammar: [
    { t: 'לשאול איך מגיעים',
      p: 'המשפט החשוב ביותר בחו"ל: How do I get to...? = איך אני מגיע ל...? והתשובות: go straight (לך ישר), turn right (פנה ימינה), turn left (פנה שמאלה), it\'s on the left (זה משמאל).',
      ex: [ ["How do I get to the train station?", "איך אני מגיע לתחנת הרכבת?"], ["Go straight and turn right.", "לך ישר ופנה ימינה."], ["It's next to the bank.", "זה ליד הבנק."] ] },
    { t: 'בשדה התעופה',
      p: 'boarding pass = כרטיס עלייה למטוס. gate = שער. luggage / baggage = מזוודות. carry-on = תיק עלייה. delayed = טיסה מתעכבת. on time = בזמן.',
      ex: [ ["Here is my passport and boarding pass.", "הנה הדרכון וכרטיס העלייה שלי."], ["Which gate is it?", "איזה שער זה?"], ["Is the flight on time?", "הטיסה בזמן?"] ] },
    { t: 'במלון',
      p: 'I have a reservation = יש לי הזמנה. check in / check out = קבלת חדר / עזיבה. The key doesn\'t work = המפתח לא עובד. Is breakfast included? = ארוחת בוקר כלולה?',
      ex: [ ["I have a reservation under Cohen.", "יש לי הזמנה על שם כהן."], ["What time is checkout?", "באיזו שעה העזיבה?"], ["Is breakfast included?", "ארוחת בוקר כלולה?"] ] }
  ],
  vocab: [
    { en: 'passport', he: 'דרכון', t: 'פֶּסְפּוֹרְט', ex: 'Here is my passport.' },
    { en: 'flight', he: 'טיסה', t: 'פְלַייט', ex: 'The flight is at noon.' },
    { en: 'gate', he: 'שער (בשדה"ת)', t: 'גֵייט', ex: 'The gate is B7.' },
    { en: 'luggage', he: 'מזוודות', t: 'לַאגִידְג\'', ex: 'My luggage is heavy.' },
    { en: 'reservation', he: 'הזמנה (מקום)', t: 'רֶזֶרְבֵיישֶן', ex: 'I have a reservation.' },
    { en: 'straight', he: 'ישר', t: 'סְטְרֵייט', ex: 'Go straight ahead.' },
    { en: 'turn right', he: 'פנה ימינה', t: 'טֶרְן רַייט', ex: 'Turn right at the corner.' },
    { en: 'turn left', he: 'פנה שמאלה', t: 'טֶרְן לֶפְט', ex: 'Turn left after the bank.' },
    { en: 'far', he: 'רחוק', t: 'פַאר', ex: 'Is it far from here?' },
    { en: 'ticket', he: 'כרטיס', t: 'טִיקֶט', ex: 'Two tickets, please.' },
    { en: 'included', he: 'כלול', t: 'אִינְקְלוּדִיד', ex: 'Breakfast is included.' },
    { en: 'help', he: 'עזרה / לעזור', t: 'הֶלְפּ', ex: 'Can you help me, please?' }
  ],
  sentences: [
    ["Excuse me, how do I get to gate B7?", "סליחה, איך אני מגיע לשער B7?"],
    ["Go straight and turn left.", "לך ישר ופנה שמאלה."],
    ["Is the flight on time?", "הטיסה בזמן?"],
    ["I have a reservation under Cohen.", "יש לי הזמנה על שם כהן."],
    ["What time is breakfast?", "באיזו שעה ארוחת הבוקר?"],
    ["The key doesn't work.", "המפתח לא עובד."],
    ["Can I have a late checkout?", "אפשר עזיבה מאוחרת?"],
    ["Where can I find a taxi?", "איפה אפשר למצוא מונית?"],
    ["How much is a ticket to the city center?", "כמה עולה כרטיס למרכז העיר?"],
    ["Is it far from here?", "זה רחוק מכאן?"]
  ],
  quiz: [
    { q: '"איך אני מגיע לתחנה?":', o: ['How I get to the station?', 'How do I get to the station?', 'How get I the station?', 'Where I go station?'], a: 1, ex: 'How do I get to + מקום.' },
    { q: '"פנה ימינה":', o: ['go right turn', 'turn right', 'right turn go', 'to the right turn'], a: 1, ex: 'turn right / turn left.' },
    { q: 'מזוודות באנגלית:', o: ['bags house', 'luggage', 'carriage', 'package'], a: 1, ex: 'luggage או baggage.' },
    { q: '"יש לי הזמנה":', o: ['I have a reservation.', 'I am a reservation.', 'I make reserve.', 'Me reservation.'], a: 0, ex: 'I have a reservation - משפט הזהב במלון.' },
    { q: '"ארוחת בוקר כלולה?":', o: ['Breakfast is include?', 'Is breakfast included?', 'Does breakfast include?', 'Breakfast including?'], a: 1, ex: 'Is ... included?' },
    { q: 'הטיסה מתעכבת. The flight is ___', o: ['on time', 'early', 'delayed', 'arrived'], a: 2, ex: 'delayed = מתעכבת.' }
  ],
  dialogue: { title: 'צ׳ק-אין במלון', intro: 'הגעת למלון בחו"ל אחרי טיסה ארוכה. אתה B.',
    turns: [
      { s: 'A', en: "Good evening, welcome! How can I help you?", he: 'ערב טוב, ברוכים הבאים! איך אפשר לעזור?' },
      { s: 'B', en: "Good evening. I have a reservation under Cohen.", he: 'ערב טוב. יש לי הזמנה על שם כהן.' },
      { s: 'A', en: "Yes, here it is. A double room for three nights.", he: 'כן, הנה היא. חדר זוגי לשלושה לילות.' },
      { s: 'B', en: "That's right. Is breakfast included?", he: 'נכון. ארוחת בוקר כלולה?' },
      { s: 'A', en: "Yes, from seven to ten, on the first floor.", he: 'כן, משבע עד עשר, בקומה הראשונה.' },
      { s: 'B', en: "Great. And what time is checkout?", he: 'מעולה. ובאיזו שעה העזיבה?' },
      { s: 'A', en: "Checkout is at eleven. Here is your key, room 304.", he: 'העזיבה באחת עשרה. הנה המפתח, חדר 304.' },
      { s: 'B', en: "Thank you very much. Have a good night!", he: 'תודה רבה. לילה טוב!' }
    ] }
},

/* ---------------- L14 ---------------- */
{ id: 'l14', unit: 5, icon: '🤝', en: 'Polite Requests', he: 'בקשות בנימוס: could, would, sorry',
  goal: 'בסוף השיעור תדע לבקש, להציע ולהתנצל - בלי להישמע גס או מבולבל.',
  grammar: [
    { t: 'סולם הנימוס',
      p: 'Can you...? = בסדר גמור. Could you...? = מנומס יותר. Would you mind...? = הכי מנומס. ותמיד לסיים ב-please. Could you help me, please?',
      ex: [ ["Can you open the window?", "אתה יכול לפתוח את החלון?"], ["Could you speak slowly, please?", "תוכל לדבר לאט, בבקשה?"], ["Would you mind waiting a moment?", "אכפת לך לחכות רגע?"] ] },
    { t: 'להציע ולהזמין',
      p: 'Would you like...? = תרצה...? (הצעה מנומסת). Let me help you = תן לי לעזור לך. Here you go = בבקשה (כשנותנים משהו).',
      ex: [ ["Would you like some coffee?", "תרצה קפה?"], ["Let me help you with that.", "תן לי לעזור לך עם זה."], ["Here you go.", "בבקשה, קח."] ] },
    { t: 'Sorry לעומת Excuse me',
      p: 'Excuse me = סליחה לפני שמפריעים (למשוך תשומת לב). Sorry = סליחה אחרי שמשהו קרה (התנצלות). I\'m so sorry = אני ממש מצטער. No problem = אין בעיה.',
      ex: [ ["Excuse me, where is the elevator?", "סליחה, איפה המעלית?"], ["Sorry, I'm late.", "סליחה שאיחרתי."], ["No problem at all.", "אין שום בעיה."] ] }
  ],
  vocab: [
    { en: 'please', he: 'בבקשה (בבקשות)', t: 'פְּלִיז', ex: 'One coffee, please.' },
    { en: 'could you', he: 'תוכל...?', t: 'קוּד יוּ', ex: 'Could you repeat that?' },
    { en: 'would you like', he: 'תרצה...?', t: 'ווּד יוּ לַייק', ex: 'Would you like some tea?' },
    { en: 'excuse me', he: 'סליחה (לפני)', t: 'אֶקְסְקְיוּז מִי', ex: 'Excuse me, is this seat free?' },
    { en: 'sorry', he: 'מצטער', t: 'סוֹרִי', ex: 'Sorry I am late.' },
    { en: 'thank you', he: 'תודה', t: 'תֶ\'נְק יוּ', ex: 'Thank you so much!' },
    { en: 'you are welcome', he: 'על לא דבר', t: 'יוּ אַר ווֶלְקַם', ex: 'You are welcome!' },
    { en: 'no problem', he: 'אין בעיה', t: 'נוֹאוּ פְּרוֹבְּלֶם', ex: 'No problem at all.' },
    { en: 'of course', he: 'כמובן', t: 'אוֹף קוֹרְס', ex: 'Of course I can help.' },
    { en: 'moment', he: 'רגע', t: 'מוֹמֶנְט', ex: 'Just a moment, please.' },
    { en: 'favor', he: 'טובה', t: 'פֵייבוֹר', ex: 'Can you do me a favor?' },
    { en: 'certainly', he: 'בהחלט', t: 'סֶרְטֶנְלִי', ex: 'Certainly, sir.' }
  ],
  sentences: [
    ["Could you help me, please?", "תוכל לעזור לי, בבקשה?"],
    ["Could you speak more slowly?", "תוכל לדבר יותר לאט?"],
    ["Would you like something to drink?", "תרצה משהו לשתות?"],
    ["Excuse me, is this seat free?", "סליחה, המקום הזה פנוי?"],
    ["Sorry, I didn't hear you.", "סליחה, לא שמעתי אותך."],
    ["Can you do me a favor?", "אתה יכול לעשות לי טובה?"],
    ["Let me help you with the bags.", "תן לי לעזור לך עם התיקים."],
    ["Thank you so much for your help.", "תודה רבה על העזרה."],
    ["You are welcome!", "על לא דבר!"],
    ["Just a moment, please.", "רק רגע, בבקשה."]
  ],
  quiz: [
    { q: 'הבקשה הכי מנומסת:', o: ['Open the window.', 'Can you open?', 'Could you open the window, please?', 'Window open now.'], a: 2, ex: 'Could + please = נימוס מלא.' },
    { q: 'להציע קפה למישהו:', o: ['You want coffee?', 'Would you like some coffee?', 'Coffee you like?', 'Do you coffee?'], a: 1, ex: 'Would you like...? = הצעה מנומסת.' },
    { q: 'לפני שמפריעים למישהו אומרים:', o: ['Sorry', 'Excuse me', 'Hello you', 'Attention'], a: 1, ex: 'Excuse me לפני, Sorry אחרי.' },
    { q: 'מישהו אומר Thank you. אתה עונה:', o: ["You're welcome.", 'Me too.', 'Yes thanks.', 'I know.'], a: 0, ex: "You're welcome = על לא דבר." },
    { q: '"סליחה שאיחרתי":', o: ["Excuse me I late.", "Sorry I'm late.", "I late sorry.", "Late am I, sorry."], a: 1, ex: "Sorry I'm late - התנצלות על משהו שקרה." },
    { q: '"אכפת לך לחכות רגע?":', o: ['Would you mind waiting a moment?', 'You mind wait?', 'Do you mind to waiting?', 'Would you wait mind?'], a: 0, ex: 'Would you mind + פועל עם ing.' }
  ],
  dialogue: { title: 'עזרה ברחוב', intro: 'תייר מבקש ממך עזרה - והפעם אתה זה שעוזר. אתה B.',
    turns: [
      { s: 'A', en: "Excuse me, could you help me? I'm a little lost.", he: 'סליחה, תוכל לעזור לי? קצת הלכתי לאיבוד.' },
      { s: 'B', en: "Of course! Where would you like to go?", he: 'כמובן! לאן תרצה להגיע?' },
      { s: 'A', en: "I'm looking for the Carmel Market.", he: 'אני מחפש את שוק הכרמל.' },
      { s: 'B', en: "No problem. Go straight and turn right at the second street.", he: 'אין בעיה. לך ישר ופנה ימינה ברחוב השני.' },
      { s: 'A', en: "Straight, then right. Is it far?", he: 'ישר, ואז ימינה. זה רחוק?' },
      { s: 'B', en: "Not at all, about five minutes on foot.", he: 'ממש לא, בערך חמש דקות ברגל.' },
      { s: 'A', en: "Thank you so much! You are very kind.", he: 'תודה רבה לך! אתה מאוד אדיב.' },
      { s: 'B', en: "You're welcome. Enjoy the market!", he: 'על לא דבר. תיהנה בשוק!' }
    ] }
},

/* ---------------- L15 ---------------- */
{ id: 'l15', unit: 6, icon: '🩺', en: 'Should, Have to, Must', he: 'עצות וחובות: אצל הרופא',
  goal: 'בסוף השיעור תוכל לתת ולקבל עצות, ולתאר לרופא מה כואב לך.',
  grammar: [
    { t: 'עצה: should',
      p: 'should = כדאי, רצוי. You should rest = כדאי לך לנוח. שלילה: shouldn\'t = לא כדאי. אחרי should הפועל תמיד בצורת בסיס.',
      ex: [ ["You should drink more water.", "כדאי לך לשתות יותר מים."], ["You shouldn't work so hard.", "לא כדאי לך לעבוד כל כך קשה."], ["Should I call a doctor?", "כדאי שאתקשר לרופא?"] ] },
    { t: 'חובה: have to / must',
      p: 'have to = צריך, חייב (הכי נפוץ בדיבור): I have to go = אני חייב ללכת. עם he/she: has to. must = חייב (חזק, רשמי): You must take this medicine.',
      ex: [ ["I have to take medicine every day.", "אני צריך לקחת תרופה כל יום."], ["She has to rest this week.", "היא חייבת לנוח השבוע."], ["You must see a doctor.", "אתה חייב ללכת לרופא."] ] },
    { t: 'אצל הרופא: לתאר כאב',
      p: 'It hurts = זה כואב. My back hurts = הגב שלי כואב. I have a headache = יש לי כאב ראש. I feel dizzy = אני מרגיש סחרחורת. I have a fever = יש לי חום.',
      ex: [ ["My back hurts.", "הגב שלי כואב."], ["I have a headache.", "יש לי כאב ראש."], ["I don't feel well.", "אני לא מרגיש טוב."] ] }
  ],
  vocab: [
    { en: 'should', he: 'כדאי, רצוי', t: 'שוּד', ex: 'You should sleep more.' },
    { en: 'have to', he: 'צריך, חייב', t: 'הֶב טוּ', ex: 'I have to go now.' },
    { en: 'must', he: 'חייב (חזק)', t: 'מַאסְט', ex: 'You must stop smoking.' },
    { en: 'doctor', he: 'רופא', t: 'דוֹקְטוֹר', ex: 'I need to see a doctor.' },
    { en: 'medicine', he: 'תרופה', t: 'מֶדִיסִין', ex: 'Take the medicine twice a day.' },
    { en: 'hurts', he: 'כואב', t: 'הֶרְטְס', ex: 'My knee hurts.' },
    { en: 'headache', he: 'כאב ראש', t: 'הֶדֵייק', ex: 'I have a bad headache.' },
    { en: 'fever', he: 'חום', t: 'פִיבֶר', ex: 'The baby has a fever.' },
    { en: 'blood test', he: 'בדיקת דם', t: 'בְּלַאד טֶסְט', ex: 'You need a blood test.' },
    { en: 'pharmacy', he: 'בית מרקחת', t: 'פַרְמֶסִי', ex: 'Is there a pharmacy near here?' },
    { en: 'rest', he: 'לנוח / מנוחה', t: 'רֶסְט', ex: 'You should rest today.' },
    { en: 'healthy', he: 'בריא', t: 'הֶלְתִ\'י', ex: 'Walking is healthy.' }
  ],
  sentences: [
    ["I don't feel well today.", "אני לא מרגיש טוב היום."],
    ["My back hurts.", "הגב שלי כואב."],
    ["I have a headache.", "יש לי כאב ראש."],
    ["I have to see a doctor.", "אני צריך ללכת לרופא."],
    ["You should rest for a few days.", "כדאי לך לנוח כמה ימים."],
    ["Take this medicine twice a day.", "קח את התרופה פעמיים ביום."],
    ["Do I have to do a blood test?", "אני צריך לעשות בדיקת דם?"],
    ["You shouldn't drink coffee at night.", "לא כדאי לך לשתות קפה בלילה."],
    ["Where is the nearest pharmacy?", "איפה בית המרקחת הקרוב?"],
    ["I feel much better, thank you.", "אני מרגיש הרבה יותר טוב, תודה."]
  ],
  quiz: [
    { q: 'עצה ידידותית: You ___ sleep more.', o: ['must to', 'should', 'have', 'do'], a: 1, ex: 'עצה = should.' },
    { q: 'I ___ take medicine every morning. (חובה)', o: ['should', 'have to', 'am', 'can'], a: 1, ex: 'חובה יומיומית = have to.' },
    { q: 'She ___ to rest.', o: ['have', 'must', 'has', 'should'], a: 2, ex: 'עם she: has to.' },
    { q: '"הגב שלי כואב":', o: ['My back is hurt.', 'My back hurts.', 'I hurt back.', 'Back my hurts.'], a: 1, ex: 'האיבר + hurts.' },
    { q: '"יש לי חום":', o: ['I am fever.', 'I have a fever.', 'Fever is me.', 'I fever have.'], a: 1, ex: 'I have a fever / a headache.' },
    { q: 'אחרי should הפועל:', o: ['מקבל to', 'מקבל ing', 'בצורת בסיס', 'מקבל ed'], a: 2, ex: 'should + פועל בסיסי: should rest.' }
  ],
  dialogue: { title: 'ביקור אצל הרופאה', intro: 'אתה מתאר לרופאה מה מציק לך. אתה B.',
    turns: [
      { s: 'A', en: "Good morning. What seems to be the problem?", he: 'בוקר טוב. מה הבעיה?' },
      { s: 'B', en: "Good morning, doctor. I have a headache and my back hurts.", he: 'בוקר טוב, דוקטור. יש לי כאב ראש והגב שלי כואב.' },
      { s: 'A', en: "I see. Do you have a fever?", he: 'הבנתי. יש לך חום?' },
      { s: 'B', en: "No, but I feel very tired all the time.", he: 'לא, אבל אני מרגיש מאוד עייף כל הזמן.' },
      { s: 'A', en: "Do you sleep well? How many hours a night?", he: 'אתה ישן טוב? כמה שעות בלילה?' },
      { s: 'B', en: "Not really. Maybe five hours. I work a lot.", he: 'לא ממש. אולי חמש שעות. אני עובד הרבה.' },
      { s: 'A', en: "That's the problem. You should sleep seven hours, and you have to rest more.", he: 'זאת הבעיה. כדאי לך לישון שבע שעות, ואתה חייב לנוח יותר.' },
      { s: 'B', en: "You're right. I'll try. Do I need any tests?", he: 'את צודקת. אנסה. אני צריך בדיקות?' }
    ] }
},

/* ---------------- L16 ---------------- */
{ id: 'l16', unit: 6, icon: '🌍', en: 'Present Perfect', he: 'ניסיון חיים: Have you ever...?',
  goal: 'בסוף השיעור תוכל לדבר על חוויות: איפה היית, מה עשית בחיים - בלי לציין מתי.',
  grammar: [
    { t: 'הזמן של החוויות',
      p: 'כשחשוב מה קרה ולא מתי: have/has + פועל בצורה שלישית. I have been to Italy = הייתי באיטליה (מתישהו). זה הזמן של סיכום חיים: ראיתי, ניסיתי, ביקרתי.',
      ex: [ ["I have been to Italy twice.", "הייתי באיטליה פעמיים."], ["She has seen this movie.", "היא ראתה את הסרט הזה."], ["We have tried that restaurant.", "ניסינו את המסעדה ההיא."] ] },
    { t: 'השאלה הכי טובה לשיחה: Have you ever',
      p: 'Have you ever...? = האם אי פעם...? זו שאלת קסם לכל שיחה. Have you ever been to Eilat? תשובות: Yes, I have. / No, I haven\'t. / No, never.',
      ex: [ ["Have you ever been to London?", "היית פעם בלונדון?"], ["Have you ever tried sushi?", "ניסית פעם סושי?"], ["No, I never have. / No, never.", "לא, אף פעם."] ] },
    { t: 'מתי לא משתמשים בזה',
      p: 'אם אומרים מתי בדיוק - חוזרים לעבר פשוט: I have been to Rome (חוויה), אבל: I was in Rome in 2019 (עם תאריך). ההבחנה הזאת היא סימן היכר של דובר טוב.',
      ex: [ ["I have visited Paris.", "ביקרתי בפריז. (מתישהו)"], ["I visited Paris last year.", "ביקרתי בפריז בשנה שעברה. (מתי - עבר פשוט)"], ["He has never flown before.", "הוא מעולם לא טס."] ] }
  ],
  vocab: [
    { en: 'ever', he: 'אי פעם', t: 'אֶבֶר', ex: 'Have you ever seen snow?' },
    { en: 'never', he: 'אף פעם, מעולם לא', t: 'נֶבֶר', ex: 'I have never been there.' },
    { en: 'been', he: 'היה (צורה שלישית)', t: 'בִּין', ex: 'I have been to Greece.' },
    { en: 'seen', he: 'ראה (צורה שלישית)', t: 'סִין', ex: 'I have seen that movie.' },
    { en: 'done', he: 'עשה (צורה שלישית)', t: 'דַאן', ex: 'I have done my part.' },
    { en: 'tried', he: 'ניסה', t: 'טְרַייד', ex: 'Have you tried the cake?' },
    { en: 'already', he: 'כבר', t: 'אוֹלְרֶדִי', ex: 'I have already eaten.' },
    { en: 'yet', he: 'עדיין (בשאלה/שלילה)', t: 'יֶט', ex: 'I have not finished yet.' },
    { en: 'twice', he: 'פעמיים', t: 'טְוַוייס', ex: 'I have been there twice.' },
    { en: 'abroad', he: 'בחו"ל', t: 'אֶבְּרוֹד', ex: 'Have you ever lived abroad?' },
    { en: 'experience', he: 'חוויה, ניסיון', t: 'אֶקְסְפִּירִיאֶנְס', ex: 'It was a great experience.' },
    { en: 'once', he: 'פעם אחת', t: 'ווַאנְס', ex: 'I tried it once.' }
  ],
  sentences: [
    ["Have you ever been to the United States?", "היית פעם בארצות הברית?"],
    ["Yes, I have been there twice.", "כן, הייתי שם פעמיים."],
    ["I have never tried sushi.", "אף פעם לא ניסיתי סושי."],
    ["She has seen this movie three times.", "היא ראתה את הסרט הזה שלוש פעמים."],
    ["We have already eaten, thank you.", "כבר אכלנו, תודה."],
    ["I haven't finished the book yet.", "עוד לא סיימתי את הספר."],
    ["Have you tried the new restaurant?", "ניסית את המסעדה החדשה?"],
    ["I have lived here for twenty years.", "אני גר כאן עשרים שנה."],
    ["He has never flown before.", "הוא מעולם לא טס."],
    ["It has been a wonderful day.", "זה היה יום נפלא."]
  ],
  quiz: [
    { q: '___ you ever been to Eilat?', o: ['Did', 'Have', 'Do', 'Are'], a: 1, ex: 'חוויות = Have you ever...' },
    { q: 'I have ___ this movie.', o: ['see', 'saw', 'seen', 'seeing'], a: 2, ex: 'אחרי have: צורה שלישית - seen.' },
    { q: '"אף פעם לא ניסיתי":', o: ['I never tried have.', 'I have never tried.', 'I not have tried.', 'Never I tried have.'], a: 1, ex: 'have + never + פועל שלישי.' },
    { q: 'איזה משפט דורש עבר פשוט (לא Perfect)?', o: ['הייתי שם מתישהו', 'ביקרתי שם ב-2020', 'ראיתי את הסרט הזה', 'ניסיתי סושי פעם'], a: 1, ex: 'זמן מדויק (2020) = עבר פשוט: I visited in 2020.' },
    { q: 'She ___ been to Paris.', o: ['have', 'has', 'is', 'was'], a: 1, ex: 'she מקבלת has.' },
    { q: '"עוד לא סיימתי":', o: ["I didn't finish already.", "I haven't finished yet.", "I don't finished.", "I am not finish yet."], a: 1, ex: "haven't + פועל שלישי + yet." }
  ],
  dialogue: { title: 'שיחת טיולים', intro: 'שיחה עם מכר על טיולים בעולם. אתה B.',
    turns: [
      { s: 'A', en: "Have you ever been to Italy?", he: 'היית פעם באיטליה?' },
      { s: 'B', en: "Yes, I have. I have been there twice. Have you?", he: 'כן. הייתי שם פעמיים. ואתה?' },
      { s: 'A', en: "No, never. But I have always wanted to go.", he: 'לא, אף פעם. אבל תמיד רציתי לנסוע.' },
      { s: 'B', en: "You should go! I have never eaten better food.", he: 'אתה חייב לנסוע! מעולם לא אכלתי אוכל טוב יותר.' },
      { s: 'A', en: "Which city did you like the most?", he: 'איזו עיר אהבת הכי הרבה?' },
      { s: 'B', en: "Rome. We visited it in 2023 and it was amazing.", he: 'רומא. ביקרנו בה ב-2023 וזה היה מדהים.' },
      { s: 'A', en: "Have you tried real Italian pizza?", he: 'ניסית פיצה איטלקית אמיתית?' },
      { s: 'B', en: "Of course! And now I can't eat pizza in Israel anymore.", he: 'ברור! ועכשיו אני כבר לא מסוגל לאכול פיצה בארץ.' }
    ] }
},

/* ---------------- L17 ---------------- */
{ id: 'l17', unit: 6, icon: '💼', en: 'If... & Small Talk', he: 'משפטי תנאי ושיחת חולין',
  goal: 'בסוף השיעור תוכל לדבר על אפשרויות (אם... אז...) ולנהל סמול טוק אמיתי.',
  grammar: [
    { t: 'תנאי עתידי: If + הווה, will',
      p: 'אם יקרה X, יקרה Y: If it rains, we will stay home. שים לב: אחרי if משתמשים בהווה, לא בעתיד! לא אומרים If it will rain.',
      ex: [ ["If it rains, we will stay home.", "אם ירד גשם, נישאר בבית."], ["If you come early, I will make coffee.", "אם תבוא מוקדם, אכין קפה."], ["If I have time, I will call you.", "אם יהיה לי זמן, אתקשר אליך."] ] },
    { t: 'סמול טוק: הפתיחות',
      p: 'שיחת חולין מתחילה קטן: How was your weekend? (איך היה הסופ"ש), Beautiful day, isn\'t it? (יום יפה, נכון?), How is the family? (מה שלום המשפחה). המטרה: לא מידע, אלא חיבור.',
      ex: [ ["How was your weekend?", "איך היה סוף השבוע?"], ["Beautiful day, isn't it?", "יום יפה, נכון?"], ["How is the family?", "מה שלום המשפחה?"] ] },
    { t: 'להמשיך ולסיים שיחה יפה',
      p: 'להמשיך: That sounds great (נשמע נהדר), Tell me more (ספר לי עוד). לסיים בנימוס: It was nice talking to you (היה נעים לדבר איתך), Say hi to the family (תמסור ד"ש למשפחה).',
      ex: [ ["That sounds great!", "נשמע נהדר!"], ["It was nice talking to you.", "היה נעים לדבר איתך."], ["Say hi to your wife.", "תמסור ד\"ש לאשתך."] ] }
  ],
  vocab: [
    { en: 'if', he: 'אם', t: 'אִיף', ex: 'If you want, we can go.' },
    { en: 'weekend', he: 'סוף שבוע', t: 'ווִיקֶנְד', ex: 'How was your weekend?' },
    { en: 'weather', he: 'מזג אוויר', t: 'ווֶדֶ\'ר', ex: 'The weather is great today.' },
    { en: 'sounds', he: 'נשמע', t: 'סַאוּנְדְז', ex: 'That sounds interesting.' },
    { en: 'news', he: 'חדשות', t: 'נְיוּז', ex: 'Did you hear the news?' },
    { en: 'busy', he: 'עסוק', t: 'בִּיזִי', ex: 'It was a busy week.' },
    { en: 'vacation', he: 'חופשה', t: 'ווֵקֵיישֶן', ex: 'We need a vacation!' },
    { en: 'grandchildren', he: 'נכדים', t: 'גְרֶנְדְצִ\'ילְדְרֶן', ex: 'The grandchildren are growing fast.' },
    { en: 'retirement', he: 'פנסיה', t: 'רִיטַיירְמֶנְט', ex: 'He is enjoying retirement.' },
    { en: 'hobby', he: 'תחביב', t: 'הוֹבִּי', ex: 'Cooking is my hobby.' },
    { en: 'actually', he: 'למעשה, בעצם', t: 'אֶקְצֶ\'ואָלִי', ex: 'Actually, I love this song.' },
    { en: 'by the way', he: 'דרך אגב', t: 'בַּיי דֶ\'ה ווֵיי', ex: 'By the way, how is your son?' }
  ],
  sentences: [
    ["If it rains, we will stay home.", "אם ירד גשם, נישאר בבית."],
    ["If you have time, call me.", "אם יש לך זמן, תתקשר אליי."],
    ["How was your weekend?", "איך היה סוף השבוע שלך?"],
    ["It was great, we saw the grandchildren.", "היה נהדר, ראינו את הנכדים."],
    ["Beautiful weather today, isn't it?", "מזג אוויר יפהפה היום, נכון?"],
    ["That sounds wonderful!", "זה נשמע נפלא!"],
    ["By the way, how is your son?", "דרך אגב, מה שלום הבן שלך?"],
    ["If I see him, I will say hi.", "אם אראה אותו, אמסור ד\"ש."],
    ["It was nice talking to you.", "היה נעים לדבר איתך."],
    ["Let's talk again soon.", "בוא נדבר שוב בקרוב."]
  ],
  quiz: [
    { q: 'If it ___, we will stay home.', o: ['will rain', 'rains', 'rained', 'raining'], a: 1, ex: 'אחרי if - הווה: rains.' },
    { q: 'If you come, I ___ make dinner.', o: ['will', 'do', 'am', 'was'], a: 0, ex: 'בחלק השני: will.' },
    { q: 'פתיחת סמול טוק טובה:', o: ['How much money do you make?', 'How was your weekend?', 'Why are you fat?', 'Give me news.'], a: 1, ex: 'שאלה קלה ופתוחה על הסופ"ש.' },
    { q: '"נשמע נהדר":', o: ['Sounds it great.', 'That sounds great.', 'Great sound that.', 'It sound greats.'], a: 1, ex: 'That sounds great.' },
    { q: '"דרך אגב":', o: ['on the way', 'by the way', 'in the way', 'at the way'], a: 1, ex: 'by the way = דרך אגב.' },
    { q: 'סיום שיחה מנומס:', o: ['Go now.', 'Finish talk.', 'It was nice talking to you.', 'Enough words.'], a: 2, ex: 'It was nice talking to you - סיום חם ומנומס.' }
  ],
  dialogue: { title: 'סמול טוק במעלית', intro: 'שכן מהבניין פוגש אותך במעלית. אתה B.',
    turns: [
      { s: 'A', en: "Good morning! Beautiful day, isn't it?", he: 'בוקר טוב! יום יפה, נכון?' },
      { s: 'B', en: "Good morning! Yes, it's perfect. How was your weekend?", he: 'בוקר טוב! כן, מושלם. איך היה סוף השבוע שלך?' },
      { s: 'A', en: "Wonderful, we visited our daughter in the south.", he: 'נפלא, ביקרנו את הבת שלנו בדרום.' },
      { s: 'B', en: "That sounds great! How is she doing?", he: 'נשמע נהדר! מה שלומה?' },
      { s: 'A', en: "Very well. And you? Any plans for the holiday?", he: 'טוב מאוד. ואתה? תוכניות לחג?' },
      { s: 'B', en: "If the weather is good, we will drive to the Galilee.", he: 'אם מזג האוויר יהיה טוב, ניסע לגליל.' },
      { s: 'A', en: "Lovely! Well, this is my floor.", he: 'מקסים! טוב, זאת הקומה שלי.' },
      { s: 'B', en: "It was nice talking to you. Say hi to the family!", he: 'היה נעים לדבר איתך. תמסור ד\"ש למשפחה!' }
    ] }
}
],

/* ============ קליניקת הגייה לדוברי עברית ============ */
clinic: [
{ id: 'th', icon: '👅', title: 'הצליל TH', sub: 'think, three, mother',
  why: 'הצליל th לא קיים בעברית, ולכן דוברי עברית מחליפים אותו ב-ס או ב-ז: sink במקום think. זו הטעות המזוהה ביותר עם מבטא ישראלי.',
  tip: 'שים את קצה הלשון בעדינות בין השיניים ונשוף אוויר. הלשון חייבת לצאת החוצה - תרגיש אוויר על הלשון. th רכה (the, mother) - אותו דבר עם קול.',
  pairs: [ ['think', 'sink'], ['three', 'tree'], ['thank', 'sank'], ['mouth', 'mouse'], ['path', 'pass'], ['bath', 'bus'] ],
  sentences: [ "I think about it.", "Thank you very much.", "My birthday is on Thursday.", "This is my mother.", "Three things to remember." ] },

{ id: 'iy', icon: '🚢', title: 'i קצר מול ee ארוך', sub: 'ship / sheep',
  why: 'בעברית יש רק חיריק אחד. באנגלית יש שני צלילים: i קצר ורפוי (ship, sit) ו-ee ארוך ומתוח (sheep, seat). ההחלפה ביניהם משנה משמעות - ולפעמים מביכה.',
  tip: 'ל-ee ארוך: מתח את השפתיים לחיוך רחב ומשוך את הצליל - שִׁייייפ. ל-i קצר: פה רפוי, צליל קצר בין חיריק לסגול - כמעט שֶׁפּ.',
  pairs: [ ['sheep', 'ship'], ['leave', 'live'], ['seat', 'sit'], ['eat', 'it'], ['feel', 'fill'], ['heat', 'hit'] ],
  sentences: [ "Please sit in this seat.", "I live near the sea.", "I need to leave now.", "Eat it, it is good.", "I feel like I need to fill the form." ] },

{ id: 'wv', icon: '🍷', title: 'W מול V', sub: 'wine / vine',
  why: 'בעברית ו׳ מבוצעת כמו V. באנגלית W הוא צליל אחר לגמרי - בלי שיניים בכלל. Israelis אומרים very well כמו wery vell.',
  tip: 'ל-W: עגל את השפתיים כאילו אתה אומר "אוּ" ואז פתח - שום מגע של שיניים בשפה. ל-V: שיניים עליונות נוגעות בשפה התחתונה עם רטט.',
  pairs: [ ['wine', 'vine'], ['west', 'vest'], ['wet', 'vet'], ['worse', 'verse'], ['while', 'vile'], ['wow', 'vow'] ],
  sentences: [ "We went west.", "Very well, thank you.", "The weather was wet and windy.", "I want to visit the village.", "Wow, what a view!" ] },

{ id: 'ae', icon: '🛏️', title: 'a פתוחה מול e', sub: 'bad / bed',
  why: 'הצליל a של man, bad הוא בין פתח לסגול - והוא לא קיים בעברית. דוברי עברית אומרים bed גם כשהם מתכוונים ל-bad.',
  tip: 'ל-a הפתוחה (bad): פתח את הפה גדול, הלסת יורדת למטה, כמו אצל רופא שיניים - בֶּאָד. ל-e (bed): פה חצי סגור, סגול רגיל.',
  pairs: [ ['bad', 'bed'], ['man', 'men'], ['sad', 'said'], ['pan', 'pen'], ['bag', 'beg'], ['and', 'end'] ],
  sentences: [ "The man is on the bed.", "I said it is not sad.", "The bag is at the end.", "Ten men ran to the van.", "That was a bad answer." ] },

{ id: 'r', icon: '🦁', title: 'ה-R האמריקאית', sub: 'car, right, work',
  why: 'ה-ר העברית מבוצעת בגרון. ה-R האנגלית מבוצעת עם הלשון מקופלת לאחור - בלי רטט ובלי גרון.',
  tip: 'קפל את קצה הלשון מעט לאחור, כמעט נוגע בחך - אבל לא נוגע! - והשמע צליל עמוק. תרגול: תגיד אֶר ארוך - errrr - עד שהצליל מתייצב.',
  pairs: [ ['right', 'light'], ['red', 'led'], ['rock', 'lock'], ['road', 'load'], ['rice', 'lice'], ['pray', 'play'] ],
  sentences: [ "The red car turned right.", "I drive to work every morning.", "Read the road signs.", "Sorry, wrong number.", "Her brother works here." ] },

{ id: 'ed', icon: '🔚', title: 'סיומת ed-', sub: 'worked = וורקט',
  why: 'רוב הלומדים מבטאים כל ed כהברה נוספת: וורקֶד. בפועל, ברוב המקרים ה-e בכלל לא נשמעת.',
  tip: 'שלושה כללים: אחרי צליל קשה (k, p, s, sh, ch) אומרים ט: worked = ווֹרְקְט. אחרי צליל רך אומרים ד: played = פְּלֵייד. רק אחרי t או d מוסיפים הברה: wanted = ווֹנְטִיד.',
  pairs: [ ['worked', 'wanted'], ['stopped', 'started'], ['washed', 'needed'], ['liked', 'visited'], ['played', 'painted'], ['called', 'counted'] ],
  sentences: [ "I worked and then stopped.", "She called and asked about you.", "We watched TV and talked.", "He wanted to visit.", "I finished and walked home." ] },

{ id: 'stress', icon: '🥁', title: 'הטעמה במילים', sub: 'HOtel? הפוך: hoTEL',
  why: 'בעברית ההטעמה כמעט תמיד בסוף המילה. באנגלית כל מילה עם ההטעמה שלה - וטעות בהטעמה מקשה על ההבנה יותר מכל מבטא.',
  tip: 'הקשב איפה ההברה החזקה ותן לה יותר אורך ועוצמה: hoTEL, PROblem, deVELopment, imPORtant, TAxi, comPUter. שאר ההברות - קצרות וחלשות.',
  pairs: [ ['hoTEL', 'HOtel'], ['PROblem', 'proBLEM'], ['imPORtant', 'importANT'], ['comPUter', 'computER'], ['TAxi', 'taXI'], ['deVELopment', 'developMENT'] ],
  sentences: [ "There is a problem with the hotel.", "It is very important.", "My computer is new.", "I need a taxi to the airport.", "The development took a year." ] }
],

/* ============ משפטי עידוד ============ */
praise: [ "Excellent!", "Perfect!", "Great job!", "Wonderful!", "You got it!", "Beautiful!", "Very good!", "Amazing!" ],
praiseHe: [ "מצוין!", "מושלם!", "כל הכבוד!", "נהדר!", "בדיוק!", "יפה מאוד!", "עבודה טובה!", "מעולה!" ],
almostHe: [ "כמעט! הקשב ונסה שוב", "קרוב מאוד! עוד ניסיון", "לא רע בכלל! שמע שוב" ],
retryHe: [ "בוא נשמע את זה שוב", "לא נורא, מקשיבים שוב", "עוד פעם אחת ביחד" ]
};

if (typeof module !== 'undefined' && module.exports) module.exports = CONTENT_EN;

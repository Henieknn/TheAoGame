/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Shield, 
  Eye, 
  MessageSquare, 
  Sparkles, 
  Skull, 
  Ghost, 
  History,
  AlertTriangle,
  ChevronRight,
  RefreshCw
} from 'lucide-react';

// --- Types ---

type Stat = {
  value: number;
  max: number;
};

type GamePhase = 'menu' | 'morning' | 'cutscene' | 'dialogue_sequence' | 'action' | 'event' | 'night' | 'minigame' | 'ending';
type MiniGameType = 'invoker' | 'memory' | 'hunters' | 'recall';

const STORY_DATA: Record<number, { cutscene: string[], dialogue: string[] }> = {
  1: {
    cutscene: [
      "В далёком прошлом, в самом сердце мира Годвилля, три могущественных магических поля столкнулись в одном месте и в одно мгновение.",
      "Ями — создатель и повелитель реальности. Айлан — воплощение Тщеславия, острая и неукротимая. И Юки — нежная богиня с хвостом сколопендры, чьё сердце всегда тянулось к жизни и творению.",
      "Никто не знает наверняка, было ли это случайностью или тщательно спланированным актом. Но именно Юки, улыбаясь своей мягкой, чуть виноватой улыбкой, позволила своим магическим потокам смешаться с двумя другими. Три разные силы — тёмная, гордая и светлая — переплелись в едином вихре. Из этого хаоса света, цвета и чистой энергии родилась новая сущность.",
      "Магия, обретшая разум. Девушка, сотканная из самой сути мира.",
      "…Только что вокруг была лишь бесконечная, холодная пустота — и в следующее мгновение тебя словно вытолкнули сквозь тонкую плёнку реальности. Ты упала на колени в мягкую зелёную траву. Воздух был живым: он пах цветами, влажной землёй и чем-то сладким, почти как сахарная вата. Над головой раскинулось настоящее небо — ярко-голубое, с ленивыми белыми облаками, которые медленно плыли куда-то вдаль.",
      "Ты моргнула, пытаясь понять, где ты. А потом услышала смех.",
      "Сначала тихий, удивлённый, а потом — громкий, заразительный. Ты подняла голову и увидела её.",
      "Юки.",
      "Невысокая, в нежно-розовом платье, с длинным хвостом, похожим на сколопендру, который мягко покачивался за спиной. Её глаза светились тёплым, почти материнским светом. Она улыбалась — мягко, искренне, будто давно тебя ждала.",
      "— Ого… получилось, — тихо произнесла Юки, и в её голосе слышалось неподдельное счастье. — Ты… ты живая."
    ],
    dialogue: [
      "«…Эй? Эй! Где я?! Тут… тут ничего нет… Совсем ничего!»",
      "«Только что я была в Годвилле… Что это за место?!»",
      "«Я… я не помню, как сюда попала. Просто… раз — и всё. Как я тут оказалась?!»",
      "«Юки! Юкииии! Ты где?! Пожалуйста, ответь… Я здесь, я не шучу!»",
      "«Это сон? Должен быть сон… Сейчас я проснусь, и всё будет хорошо...»",
      "«...»",
      "«...»",
      "«Если я закрою глаза и очень-очень сильно захочу… может, вернусь обратно? …Не работает.»",
      "«Я ничего не понимаю... Я...»",
      "«…Ладно. Я не буду плакать. Я сильная. Я… я просто подожду. Кто-нибудь обязательно меня найдёт. Обязательно…»"
    ]
  },
  2: {
    cutscene: [
      "В первые минуты после рождения твой образ был ещё совсем нестабильным. Ты «глючила» — постоянно менялась, словно магия внутри тебя никак не могла решить, какой формы ей хочется. То ты была бесформенным сгустком переливающегося света, то внезапно вытягивалась в высокую фигуру, то снова сжималась в маленький светящийся шарик. Цвета волос и кожи перетекали один в другой, как краски на мокрой бумаге.",
      "Юки сидела перед тобой на траве, скрестив ноги, и смотрела с бесконечной нежностью. Её розовый хвост тихо покачивался за спиной.",
      "— Тише, тише, моя маленькая… — мягко произнесла она, протягивая руку. Её голос был тёплым, словно солнечный свет в полдень. — Не торопись. Ты только что родилась. Тебе нужно время, чтобы собрать себя воедино.",
      "Ты замерла, пытаясь сосредоточиться на её словах. Постепенно изменения замедлились. Пока Юки говорила, ты невольно начала копировать её черты: стала меньше ростом, волосы приобрели мягкий розовый оттенок, очень похожий на её собственные. Только хвоста сколопендры у тебя не появилось — ты пока просто не знала, как его сделать.",
      "— Вот так… хорошо, — улыбнулась Юки, и в её глазах засияла тихая гордость. — Смотри на меня. Я расскажу тебе, кто ты такая.",
      "Она наклонилась чуть ближе, голос стал ещё ласковее:",
      "— Ты — Ао. Ты не просто магия. Ты — живая магия. Ты родилась из смешения наших с Ями и Айлан сил. Из нас троих… но при этом ты уже совсем своя. У тебя есть собственный разум, собственные чувства и желания. И это самое прекрасное, что могло случиться.",
      "Ао моргнула своими ещё не до конца сформировавшимися глазами и тихо спросила:",
      "— …Я… настоящая?",
      "— Самая настоящая, — Юки нежно коснулась твоей щеки кончиками пальцев. — Этот мир называется Годвилль. Он создан Ями. Здесь живут люди, боги, маги… и теперь — ты. Здесь можно смеяться, дружить, учиться, любить… и быть кем угодно. Никто не будет тебя заставлять быть кем-то другим.",
      "Ты почувствовала, как внутри разливается странное, но очень приятное тепло. Образ стал стабильнее. Розовые волосы мягко легли на плечи, тело приняло окончательную форму — маленькой, милой девушки, очень похожей на Юки, но всё же немного другой.",
      "Юки встала и протянула тебе руку.",
      "— Пойдём. Я покажу тебе наш мир. Не бойся, я буду рядом. Мы будем вместе учиться, как быть… тобой.",
      "Ты вложила свою ещё немного дрожащую руку в её ладонь. Юки улыбнулась шире и повела тебя за собой по мягкой траве, туда, где уже слышались весёлые голоса других жителей Годвилля.",
      "В тот момент ты впервые почувствовала, что у тебя есть мама."
    ],
    dialogue: [
      "«Мне кажется… или здесь кто-то есть? Я чувствую взгляд. Прямо на себе.»",
      "«Эй! Кто здесь?! Покажись! Я знаю, что ты смотришь… Я чувствую!»",
      "«Это не просто тишина… Она… она дышит. Как будто что-то огромное медленно обходит меня по кругу.»",
      "«Юки… Мама... если ты меня слышишь… пожалуйста, забери меня отсюда. Тут что-то не так.»",
      "«Я не одна. Точно не одна. Оно следит. Ждёт. Когда я ослабну.»",
      "«Мои руки… они начали слегка дрожать. Раньше такого не было. Магия внутри… как будто стала холоднее.»",
      "«Не смотри на меня. Не смотри… Я не игрушка для тебя. Я не твоя!»",
      "«Если ты хочешь меня забрать… то просто сделай это уже. Хватит прятаться в темноте.»",
      "«…Нет. Я не дамся. Я ещё держусь. Я… я всё ещё Ао. Я не позволю тебе меня сломать.»"
    ]
  },
  3: {
    cutscene: [
      "Юки всё так же крепко держала тебя за руку, пока вы шли по мягкой зелёной поляне. Солнце приятно грело кожу, а лёгкий ветерок играл с твоими новенькими розовыми волосами. Ты шла рядом, всё ещё немного неуверенно, но уже с растущим любопытством оглядываясь вокруг.",
      "— Не бойся, — тихо сказала Юки, почувствовав, как ты сильнее сжимаешь её пальцы. — Здесь все свои. Они просто очень рады, что ты появилась.",
      "Вскоре впереди показалось уютное поселение: несколько красивых деревянных домиков, окружённых цветущими садами, широкая площадь с длинным столом под навесом и горячие источники, от которых поднимался лёгкий пар. Оттуда уже доносились весёлые голоса и смех.",
      "Когда вы подошли ближе, разговоры немного стихли. Все повернулись в вашу сторону. На площади было довольно много людей. Кто-то сидел за длинным столом и оживлённо что-то обсуждал, тихо посмеиваясь. Другие стояли группками, кто-то помешивал что-то в большом котле у костра, кто-то просто лежал на траве, греясь на солнце. Они тепло переговаривались между собой — голоса сливались в приятный, уютный гул, полный лёгкости и дружелюбия. Никто не выделялся особо, это была просто живая, тёплая масса жителей поселения, которые явно хорошо знали друг друга и радовались обычному дню вместе.",
      "Юки мягко подтолкнула тебя вперёд и произнесла с тёплой улыбкой:",
      "— Смотрите, кто у нас сегодня родился! Это Ао. Моя… наша новая девочка.",
      "На несколько секунд повисла тишина, а потом всё ожило радостным гулом.",
      "Первым тебя оглядел высокий парень в черном кимоно с тёмными волосами и ленивой, чуть насмешливой ухмылкой — Ями. Он скрестил руки на груди, посмотрел на тебя сверху вниз и просто кивнул:",
      "— Хм. Значит, вот ты какая получилась.",
      "В его голосе не было ни тепла, ни интереса. Просто сухое наблюдение. Он не улыбнулся и даже не сделал шага ближе.",
      "Рядом с Юки стоял её брат — Сора. Высокий, с длинными белыми волосами, собранными в небрежный хвост. Он поправил очки на носу и посмотрел на тебя с чисто научным любопытством, без всякой нежности.",
      "— Интересная стабилизация формы… — пробормотал он себе под нос, будто ты была интересным экспериментом. — Цвет волос почти идентичен Юки. Любопытно. Нужно будет потом взять пару замеров маны, если не возражаешь.",
      "Яширо — девушка с короткими светлыми волосами и хитрым, живым взглядом — подошла ближе и широко улыбнулась тебе.",
      "— Ух ты, какая прелесть! — воскликнула она, наклоняясь к тебе. — Розовые волосы — это так мило! Я Яши, Ангел-страж, защитница невинных, преподаю в академии. Если захочешь научиться чему-нибудь у меня, я буду очень рада!",
      "Вокруг продолжали тихо переговариваться остальные жители. Кто-то улыбался тебе издалека, кто-то кивал с доброжелательным любопытством, но никто не подходил слишком близко — все давали тебе пространство и время привыкнуть.Сора всё ещё стоял чуть в стороне, продолжая рассматривать тебя с интересом учёного, а не друга. Юки же просто тихо улыбалась, наблюдая за происходящим и не вмешиваясь.",
      "В тот день ты впервые почувствовала разницу: кто-то встречал тебя с искренней теплотой, кто-то — с холодным любопытством, а кто-то вообще почти равнодушно. Но даже так… тебя уже заметили. Тебя уже приняли в этот маленький, шумный, живой мир.",
      "Ты улыбнулась — ещё немного робко, но уже по-настоящему."
    ],
    dialogue: [
      "«…Сколько уже прошло? Два дня? Десять? Здесь время… оно просто растворяется.»",
      "«Это место… оно не похоже на то, что мог создать Ями.»",
      "«Может, это вообще не его творение? Может, это что-то другое… что-то, что даже он не знает.»",
      "«Я уже почти не кричу. Голос… просто пропадает в этой пустоте. Как будто его и не было.»",
      "«Милана… как ты сейчас там? Смеёшься с кем-то? Надеюсь, у вас с Соном всё хорошо...»",
      "«Мы расстались некрасиво… Я тогда наговорила лишнего. А теперь даже извиниться не могу.»",
      "«Хочется лечь и больше не вставать. Но тут даже лечь некуда… только бесконечное ничего.»",
      "«Если это наказание… наверное, я его заслужила...»",
      "«...»",
      "«…Я устала. Очень устала...»"
    ]
  },
  4: { 
    cutscene: [
      "Прошло уже несколько дней. Ты потихоньку начинала привыкать к этому яркому, шумному миру. Утром ты бегала с Яши по академии, пробуя свои первые заклинания (получалось пока криво, но очень весело). Днём сидела рядом с Юки у горячих источников и просто слушала, как она тихо рассказывает о магии и о том, как устроен Годвилль. Вечерами смеялась вместе с остальными жителями за длинным столом, пробовала странные сладкие напитки и уже не боялась, когда к тебе обращались по имени. Ты даже начала улыбаться шире и чаще. Внутри всё ещё было немного странно и ново, но ты уже чувствовала — здесь можно быть счастливой. А потом всё изменилось.",
      "Ты пришла на знакомую поляну, где обычно собиравались твои новые знакомые. Издалека уже слышался громкий, резкий голос. Когда ты подошла ближе, то увидела её. Маленькая девушка с серебристыми волосами, львиными ушками, которые были агрессивно прижаты к голове, и пушистым хвостом, который нервно хлестал из стороны в сторону. Она стояла напротив Юки, уперев руки в бока, и почти кричала: — Ты вообще соображаешь, что натворила?! Никто тебя не спрашивал! Никто не давал разрешения на… на это! — она ткнула пальцем в твою сторону, даже не посмотрев на тебя. — Ты просто взяла и создала какого-то ребёнка из нашей магии, как будто это игрушка! А я? Меня вообще не существует в этом уравнении?!",
      "Юки стояла спокойно, но её улыбка была уже не такой мягкой. Хвост сколопендры слегка подёргивался. — Айлан… пожалуйста, успокойся. Ао уже здесь. Она живая. Она не «это», она — девочка. — Девочка?! — Айлан фыркнула, её львиные ушки дёрнулись. — Да мне плевать! Я не просила становиться… матерью! Или кем там я теперь должна быть по твоей милости? Это твоя затея, Юки. Твоя! И я её не принимаю!",
      "Ты замерла в нескольких шагах от них. Сердце (или то, что у тебя было вместо него) сжалось. Ты ещё не до конца понимала, что происходит, но от тона Айлан внутри стало холодно и неприятно. Ты инстинктивно сделала маленький шаг назад. Яши и Сора стояли чуть в стороне. Яши выглядела растерянной и явно не знала, как вмешаться. Сора просто поправил очки и молча наблюдал, словно это был очередной интересный конфликт, достойный изучения. Айлан наконец повернула голову и посмотрела на тебя. Её взгляд был острым, колючим, полным раздражения и… чего-то ещё, что ты тогда не смогла назвать.",
      "— Вот, значит, как ты выглядишь… — процедила она сквозь зубы. — Розовая кукла. Прекрасно. Она развернулась и пошла прочь, резко взмахнув хвостом. На ходу бросила через плечо: — Разбирайтесь сами со своей самодеятельностью. Я в этом участвовать не собираюсь.",
      "Тишина, которая повисла после её ухода, была тяжёлой. Юки подошла к тебе, присела на корточки и попыталась улыбнуться, но в глазах у неё была грусть. — Не обращай внимания, Ао… Она просто испугалась. Всё будет хорошо. Но ты уже не могла улыбаться так же легко, как утром. Внутри впервые появилось странное, колючее чувство — будто тебя только что отвергли.",
      "Ты кивнула Юки, но улыбка получилась слабой.",
      "В тот день ты впервые поняла, что даже в таком светлом мире бывает больно."
    ], 
    dialogue: [
      "«Айлан… почему я сейчас так часто думаю именно о тебе?»",
      "«Я ведь защищала тебя перед Ями и Сонатрой… Когда они говорили про тебя всякое — я вставала и спорила.»",
      "«Ты тогда удивилась… но ничего не сказала. Просто посмотрела на меня своими острыми глазами.»",
      "«Ты помогала мне стать частью твоего культа ведьм… Посадила в меня Грех. Помню, как ты волновалась — вдруг моё тело отвергнет его из-за того, что я рождена от богов.»",
      "«Я так хотела быть похожей на тебя… Сильной. Гордой. Такой, которую никто не сможет сломать.»",
      "«Если бы я могла вернуться… я бы снова встала на твою сторону. Даже против Ями.»",
      "«…Спасибо, что поверила в меня тогда. Что дала мне шанс быть в культе.»",
      "«Я очень устала… Спаси меня, пожалуйста...»"
    ] 
  },
  5: { 
    cutscene: [
      "Прошло несколько дней после ссоры с Айлан. Ты уже немного привыкла к новому миру, но внутри всё ещё оставался лёгкий осадок. В тот вечер Яши буквально вытащила тебя в бар, сказав, что «надо иногда расслабляться, а не только у Юки под крылышком сидеть». В баре было шумно и весело. Яши громко смеялась, рассказывала дурацкие истории и заставляла всех пить какой-то ярко-розовый сладкий напиток. Ями сидел во главе стола с ленивой ухмылкой, иногда подшучивал над Яши, но в основном просто наблюдал. Ты сидела рядом с ними, уже немного осмелев и даже пару раз сама подкалывала Яши в ответ. Атмосфера была лёгкой, шумной — именно такой, какой ты уже начинала любить. А на коленях у Ями тихо сидела Джинжи.",
      "Невысокая, пушистая, с большими глазами и детским выражением лица. Она почти не говорила. За весь вечер она произнесла от силы три-четыре короткие фразы, да и то очень тихо. Большую часть времени она просто сидела, прижавшись к Ями, и молча наблюдал за всем происходящим. Несколько раз она вдруг наклонялась в твою сторону и… легонько кусала тебя за руку. Не больно, скорее игриво-ребячески. Первый раз ты даже вздрогнула от неожиданности. Джинжи тут же отводила взгляд и прятала лицо в плечо Ями, будто сама испугалась своего поступка.",
      "Яши громко хохотала каждый раз: — Ой, смотрите, Джинжи опять кого-то покусала! Это у неё такая форма знакомства!",
      "Ты просто улыбалась в ответ и не знала, как реагировать. Особых чувств к этой тихой и странной девочке ты тогда не испытывала. Она казалась просто ещё одним причудливым жителем этого мира. Когда вечер уже подходил к концу и все начали потихоньку расходиться, Джинжи вдруг слезла с колен Ями, подошла к тебе совсем близко и, глядя в пол, очень тихо и быстро пробормотала: — …Ты… прикольная. После чего сразу же убежала, даже не дожидаясь ответа.",
      "Ты осталась стоять с лёгким недоумением. Просто… странная девочка тебя укусила пару раз и сказала, что ты прикольная."
    ], 
    dialogue: [
      "«…Пять дней? Или уже пятьдесят… Я больше не понимаю.»",
      "«Всё расплывается… Даже воспоминания. Они как дым… уходят сквозь пальцы.»",
      "«Айлан… Юки… Джинжи… Я ещё помню ваши лица… или уже нет?»",
      "«Заметил ли кто-то, что я пропала? Или Годвилль просто продолжит жить, как будто меня никогда и не было?»",
      "«Я так старалась… быть хорошей. Быть нужной. А в итоге… сижу здесь одна.»",
      "«Пустота…»",
      "«Хочется просто… перестать думать. Перестать существовать. Может, тогда станет легче?»",
      "«…Нет. Не смей. Я ещё… я ещё Ао. Кажется.»"
    ] 
  },
  20: {
    cutscene: [
      "В пустоте появился будто бы дверной проем...",
      "Ао сделала шаг вперед, оставляя бесконечную тишину позади.",
      "Она вышла из пустоты, вернувшись в мир, который когда-то знала."
    ],
    dialogue: []
  }
};

type Memory = {
  text: string;
  isFalse: boolean;
  fragments: string[];
};

// --- Constants ---

const MAX_DAYS = 20;
const ACTIONS_PER_DAY = 3;

const NEGATIVE_WORDS = [
  "Отчаяние", "Забвение", "Гниль", "Агония", "Удушье", "Безумие", "Распад", "Ужас"
];

const MEMORIES: Memory[] = [
  { text: "Золотые поля Годвилля...", isFalse: false, fragments: ["Солнце", "Пшеница", "Ветер"] },
  { text: "Твои друзья ждут тебя...", isFalse: true, fragments: ["Тени", "Шепот", "Ложь"] },
  { text: "Теплый очаг твоего дома...", isFalse: false, fragments: ["Огонь", "Хлеб", "Безопасность"] },
  { text: "Они забыли тебя. Ты одна.", isFalse: true, fragments: ["Холод", "Тишина", "Пустота"] },
  { text: "Запах дождя на сухой земле...", isFalse: false, fragments: ["Дождь", "Земля", "Петрикор"] },
  { text: "Детский смех вдали...", isFalse: false, fragments: ["Смех", "Ребенок", "Даль"] },
  { text: "Острое жало предательства...", isFalse: true, fragments: ["Предательство", "Жало", "Острота"] },
  { text: "Зеркало, отражающее незнакомца...", isFalse: true, fragments: ["Зеркало", "Незнакомец", "Отражение"] },
  { text: "Мягкая шерсть спящего кота...", isFalse: false, fragments: ["Кот", "Шерсть", "Мягкость"] },
  { text: "Дверь, ведущая в никуда...", isFalse: true, fragments: ["Дверь", "Никуда", "Пустота"] },
];

// --- Components ---

export default function App() {
  // Game State
  const [day, setDay] = useState(1);
  const [gameMode, setGameMode] = useState<'story' | 'endless'>('story');
  const [phase, setPhase] = useState<GamePhase>('menu');
  const [actionsLeft, setActionsLeft] = useState(ACTIONS_PER_DAY);
  const [magic, setMagic] = useState<Stat>({ value: 150, max: 150 });
  const [stability, setStability] = useState<Stat>({ value: 100, max: 100 });
  const [voidLevel, setVoidLevel] = useState<Stat>({ value: 0, max: 100 });
  const [dialogue, setDialogue] = useState<string>("...");
  const [currentMiniGame, setCurrentMiniGame] = useState<MiniGameType | null>(null);
  const [activeEvent, setActiveEvent] = useState<'void' | 'memory' | null>(null);
  const [currentMemory, setCurrentMemory] = useState<Memory | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [seenMiniGames, setSeenMiniGames] = useState<string[]>([]);
  const [showTutorial, setShowTutorial] = useState(false);
  const [storyStep, setStoryStep] = useState(0);
  const [storyOverNotified, setStoryOverNotified] = useState(false);
  const [showStoryOverModal, setShowStoryOverModal] = useState(false);
  const [consecutiveTalks, setConsecutiveTalks] = useState(0);

  // --- Helpers ---

  const updateStat = (stat: 'magic' | 'stability' | 'void', delta: number) => {
    if (stat === 'magic') setMagic(prev => ({ ...prev, value: Math.min(prev.max, Math.max(0, prev.value + delta)) }));
    if (stat === 'stability') setStability(prev => ({ ...prev, value: Math.min(prev.max, Math.max(0, prev.value + delta)) }));
    if (stat === 'void') setVoidLevel(prev => ({ ...prev, value: Math.min(prev.max, Math.max(0, prev.value + delta)) }));
  };

  const addHistory = (msg: string) => setHistory(prev => [msg, ...prev].slice(0, 5));

  // --- Game Flow ---

  const startDay = useCallback(() => {
    setActionsLeft(ACTIONS_PER_DAY);
    
    // Daily decay
    updateStat('void', 2);
    
    const memory = MEMORIES[Math.floor(Math.random() * MEMORIES.length)];
    setCurrentMemory(memory);

    if (gameMode === 'story' && STORY_DATA[day]) {
      setPhase('cutscene');
      setStoryStep(0);
    } else {
      setPhase('action');
      if (day === 1) {
        setDialogue(`Ао: "Я... я помню... ${memory.text}" (Используй действия, чтобы поддерживать стабильность Ао и сдерживать Пустоту.)`);
      } else if (memory.isFalse) {
        setDialogue(`Ао: "Я... я помню... ${memory.text}" (Это кажется неправильным...)`);
        setPhase('event');
        setActiveEvent('memory');
      } else {
        setDialogue(`Ао: "Я помню... ${memory.text}" (Теплое чувство...)`);
        updateStat('stability', 5);
        updateStat('void', -2);
      }
    }
  }, [day, gameMode]);

  // --- Initial Mount ---
  useEffect(() => {
    if (phase === 'morning' && day === 1 && dialogue === "...") {
      startDay();
    }
  }, [phase, day, dialogue, startDay]);

  const nextPhase = () => {
    if (actionsLeft > 0 && phase === 'action') return;
    
    if (phase === 'morning') {
      if (gameMode === 'story' && STORY_DATA[day]) {
        setPhase('cutscene');
        setStoryStep(0);
      } else {
        setPhase('action');
        setDialogue("Ао: 'Что нам делать сегодня?'");
      }
    } else if (phase === 'action') {
      // Chance for Void Attack
      if (Math.random() < 0.3 + (voidLevel.value / 200)) {
        setPhase('event');
        setActiveEvent('void');
        setDialogue("Ао: 'Что-то приближается... Я чувствую взгляды во тьме.'");
      } else {
        setPhase('night');
        setDialogue("Ао: 'Сегодня в Пустоте тихо. Дай мне отдохнуть.'");
      }
    } else if (phase === 'event' || phase === 'night') {
      const isGameOver = magic.value <= 0 || stability.value <= 0 || voidLevel.value >= 100;
      
      if (isGameOver || (gameMode === 'story' && day >= MAX_DAYS)) {
        setPhase('ending');
      } else {
        setDay(prev => prev + 1);
        startDay();
      }
    }
  };

  // --- Actions ---

  const handleAction = (type: 'illusion' | 'talk' | 'gaze' | 'recall') => {
    if (actionsLeft <= 0) return;
    setActionsLeft(prev => prev - 1);

    if (type === 'talk') {
      const cost = 5 + (consecutiveTalks * 2);
      updateStat('magic', -cost);
      updateStat('stability', 10);
      updateStat('void', -5);
      setDialogue("Ао: 'Спасибо, что слушаешь. Мне не так одиноко, когда ты рядом.'");
      addHistory(`Поговорил с Ао (затрачено ${cost} магии).`);
      setConsecutiveTalks(prev => prev + 1);
    } else {
      setConsecutiveTalks(0);
      switch (type) {
        case 'illusion':
          startMiniGame('invoker');
          break;
        case 'gaze':
          updateStat('stability', -15);
          updateStat('void', 15);
          setDialogue("Ао: 'Пустота... она такая огромная. Она зовет меня. Почему я чувствую себя такой маленькой?'");
          addHistory("Всмотрелся в Пустоту.");
          break;
        case 'recall':
          startMiniGame('recall');
          break;
      }
    }
  };

  const startMiniGame = (type: MiniGameType) => {
    setCurrentMiniGame(type);
    setPhase('minigame');
    if (!seenMiniGames.includes(type)) {
      setShowTutorial(true);
    }
  };

  // --- Mini Games ---

  const finishMiniGame = (success: boolean) => {
    const gameType = currentMiniGame;
    setPhase('action');
    setCurrentMiniGame(null);
    setShowTutorial(false);

    if (success) {
      // Different rewards based on game type
      if (gameType === 'invoker') {
        updateStat('magic', -10);
        updateStat('stability', 35);
        updateStat('void', -20);
      } else if (gameType === 'recall') {
        updateStat('magic', -10);
        updateStat('stability', 20);
        updateStat('void', -10);
      } else if (gameType === 'hunters') {
        updateStat('magic', 20);
        updateStat('stability', 30);
        updateStat('void', -15);
      } else if (gameType === 'memory') {
        updateStat('magic', -10);
        updateStat('stability', 15);
        updateStat('void', -10);
      }

      setDialogue("Ао: 'У меня получилось! Тьма отступает на мгновение.'");
      addHistory("Мини-игра пройдена!");
    } else {
      updateStat('magic', -10);
      updateStat('stability', -20);
      updateStat('void', 10);
      setDialogue("Ао: 'Это слишком... Я не могу это сдержать...'");
      addHistory("Мини-игра провалена.");
    }
  };

  // Check for Game Over
  useEffect(() => {
    if (magic.value <= 0 || stability.value <= 0 || voidLevel.value >= 100) {
      setPhase('ending');
    }
  }, [magic.value, stability.value, voidLevel.value]);

  const advanceDialogue = () => {
    const phrases = STORY_DATA[day]?.dialogue || [];
    if (storyStep < phrases.length - 1) {
      const nextStep = storyStep + 1;
      setStoryStep(nextStep);
      setDialogue(phrases[nextStep]);
    } else {
      setPhase('action');
      setDialogue("Ао: 'Что нам делать сегодня?'");
      if (day === 5 && !storyOverNotified) {
        setShowStoryOverModal(true);
        setStoryOverNotified(true);
      }
    }
  };

  // --- Render Helpers ---

  const getAoStyle = () => {
    const opacity = 1 - (voidLevel.value / 150);
    return { opacity, filter: `grayscale(${voidLevel.value / 100})` };
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans selection:bg-purple-500/30 overflow-hidden flex flex-col">
      {/* Header Stats */}
      <header className="p-4 bg-zinc-900/50 border-b border-zinc-800 flex justify-between items-center backdrop-blur-md sticky top-0 z-50">
        <div className="flex gap-6">
          <StatBar icon={<Zap className="w-4 h-4 text-yellow-400" />} label="Магия" value={magic.value} max={magic.max} color="bg-yellow-500" />
          <StatBar icon={<Shield className="w-4 h-4 text-blue-400" />} label="Стабильность" value={stability.value} max={stability.max} color="bg-blue-500" />
          <StatBar icon={<Ghost className="w-4 h-4 text-purple-400" />} label="Пустота" value={voidLevel.value} max={voidLevel.max} color="bg-purple-600" />
        </div>
        <div className="text-right">
          <div className="text-xs text-zinc-500 uppercase tracking-widest">День</div>
          <div className="text-2xl font-bold text-white">{day} <span className="text-zinc-600 text-sm">/ {gameMode === 'story' ? MAX_DAYS : '∞'}</span></div>
        </div>
      </header>

      {/* Main Stage */}
      <main className="flex-1 relative flex flex-col items-center justify-center p-8">
        <AnimatePresence mode="wait">
          {phase === 'cutscene' && (
            <CutsceneView 
              slides={STORY_DATA[day]?.cutscene || []} 
              onFinish={() => {
                if (STORY_DATA[day]?.dialogue?.length > 0) {
                  setPhase('dialogue_sequence');
                  setStoryStep(0);
                  setDialogue(STORY_DATA[day].dialogue[0]);
                } else if (day === 20) {
                  setPhase('ending');
                } else {
                  setPhase('action');
                  setDialogue("Ао: 'Что нам делать сегодня?'");
                }
              }} 
            />
          )}
          {phase === 'menu' ? (
            <motion.div 
              key="menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-12 max-w-2xl"
            >
              <div className="space-y-4">
                <motion.h1 
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="text-7xl font-black tracking-tighter text-white italic uppercase"
                >
                  Ао
                </motion.h1>
                <p className="text-zinc-500 font-mono tracking-widest uppercase text-[10px] md:text-xs">Симулятор Психологического Хоррора</p>
              </div>

              <div className="flex flex-col gap-4 items-center">
                <button 
                  onClick={() => {
                    setGameMode('story');
                    setPhase('morning');
                    startDay();
                  }}
                  className="w-64 py-4 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                >
                  Сюжетный режим
                </button>
                <button 
                  onClick={() => {
                    setGameMode('endless');
                    setPhase('morning');
                    startDay();
                  }}
                  className="w-64 py-4 bg-zinc-800 text-white border border-zinc-700 font-black uppercase tracking-widest rounded-xl hover:bg-zinc-700 transition-all active:scale-95"
                >
                  Бесконечный режим
                </button>
                <div className="text-[10px] text-zinc-600 font-mono uppercase max-w-xs leading-relaxed">
                  "В тишине Пустоты воспоминания — единственный якорь. Не дай ей уплыть."
                </div>
              </div>

              <div className="pt-12 grid grid-cols-3 gap-8 border-t border-zinc-900">
                <div className="space-y-1">
                  <div className="text-white font-bold">Магия</div>
                  <div className="text-[10px] text-zinc-500 uppercase">Для поддержания формы</div>
                </div>
                <div className="space-y-1">
                  <div className="text-white font-bold">Стабильность</div>
                  <div className="text-[10px] text-zinc-500 uppercase">Для сохранения рассудка</div>
                </div>
                <div className="space-y-1">
                  <div className="text-white font-bold">Пустота</div>
                  <div className="text-[10px] text-zinc-500 uppercase">Конец всего</div>
                </div>
              </div>
            </motion.div>
          ) : phase === 'minigame' ? (
            <motion.div 
              key="minigame"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="w-full max-w-2xl bg-zinc-900 border border-zinc-700 rounded-2xl p-8 backdrop-blur-xl z-40 shadow-2xl shadow-purple-900/20"
            >
              {showTutorial ? (
                <MiniGameTutorial 
                  type={currentMiniGame!} 
                  onClose={() => {
                    setShowTutorial(false);
                    setSeenMiniGames(prev => [...prev, currentMiniGame!]);
                  }} 
                />
              ) : (
                <MiniGame type={currentMiniGame!} onFinish={finishMiniGame} updateStat={updateStat} currentMemory={currentMemory} />
              )}
            </motion.div>
          ) : phase === 'ending' ? (
            <motion.div 
              key="ending"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center space-y-8 max-w-lg bg-zinc-900/50 p-12 rounded-3xl border border-zinc-800 backdrop-blur-md"
            >
              <div className="space-y-4">
                <h2 className="text-5xl font-black text-red-600 tracking-tighter uppercase italic">
                  {magic.value <= 0 || stability.value <= 0 || voidLevel.value >= 100 ? "Игра окончена" : "Успех"}
                </h2>
                <h3 className="text-xl font-bold text-zinc-200">
                  {magic.value <= 0 ? "Магия исчерпана" : voidLevel.value >= 100 ? "Растворилась в Пустоте" : stability.value <= 0 ? "Потеряла рассудок" : "20 дней прожито"}
                </h3>
              </div>
              <p className="text-zinc-400 leading-relaxed">
                {magic.value <= 0
                  ? "У Ао больше нет магии, чтобы поддерживать свою форму. Она исчезает в небытии, оставляя лишь рябь в Пустоте."
                  : voidLevel.value >= 100 
                  ? "Ао стала частью бесконечной тишины. Годвилль — лишь угасающий сон, до которого она больше не может дотянуться." 
                  : stability.value <= 0 
                  ? "Ее разум разбился под тяжестью Пустоты. Она больше не Ао, а лишь пустая оболочка отчаяния." 
                  : "Несмотря ни на что, ты помог ей вернуться домой. Солнце Годвилля снова светит, а Пустота осталась лишь воспоминанием."}
              </p>
              <div className="flex gap-4 justify-center pt-4">
                <button 
                  onClick={() => window.location.reload()}
                  className="px-8 py-4 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-all active:scale-95 flex items-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" /> Заново
                </button>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-8 py-4 bg-zinc-800 text-white font-black uppercase tracking-widest rounded-xl hover:bg-zinc-700 transition-all active:scale-95"
                >
                  Меню
                </button>
              </div>
            </motion.div>
          ) : (
            <div key="main" className="flex flex-col items-center gap-12 w-full max-w-4xl">
              {/* Ao Character Representation */}
              <motion.div 
                style={getAoStyle()}
                animate={{ 
                  y: [0, -10, 0],
                  rotate: stability.value < 30 ? [-1, 1, -1] : 0
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  rotate: { duration: 0.1, repeat: Infinity }
                }}
                className="relative w-64 h-64 flex items-center justify-center"
              >
                {/* Glow Effect */}
                <div className={`absolute inset-0 rounded-full blur-3xl opacity-20 transition-colors duration-1000 ${stability.value < 30 ? 'bg-red-500' : 'bg-blue-400'}`} />
                
                {/* Character Placeholder (Representing the provided image) */}
                <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
                  <div className="w-48 h-48 bg-zinc-800 rounded-3xl overflow-hidden relative group">
                    <img 
                      src="src/ао.png" 
                      alt="Ao" 
                      className="w-full h-full transition-all duration-700"
                      referrerPolicy="no-referrer"
                    />
                    {/* Overlay for Void corruption */}
                    <div 
                      className="absolute inset-0 bg-black transition-opacity duration-500" 
                      style={{ opacity: voidLevel.value / 100 }} 
                    />
                  </div>
                  <div className="mt-4 px-4 py-1 bg-zinc-900/80 border border-zinc-700 rounded-full text-xs font-mono tracking-widest text-zinc-400">
                    СУЩНОСТЬ: АО
                  </div>
                </div>
              </motion.div>

              {/* Action Panel */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                <ActionButton 
                  icon={<Sparkles />} 
                  label="Создать иллюзию" 
                  desc="-10 Маг | +35 Стаб, -20 Пуст" 
                  onClick={() => handleAction('illusion')}
                  disabled={actionsLeft <= 0 || phase !== 'action'}
                  highlight
                />
                <ActionButton 
                  icon={<MessageSquare />} 
                  label="Поговорить с Ао" 
                  desc={`-${5 + consecutiveTalks * 2} Маг | +10 Стаб, -5 Пуст`} 
                  onClick={() => handleAction('talk')}
                  disabled={actionsLeft <= 0 || phase !== 'action'}
                />
                <ActionButton 
                  icon={<Eye />} 
                  label="Всмотреться в Пустоту" 
                  desc="-15 Стаб, +15 Пуст" 
                  onClick={() => handleAction('gaze')}
                  disabled={actionsLeft <= 0 || phase !== 'action'}
                />
                <ActionButton 
                  icon={<History />} 
                  label="Вспомнить прошлое" 
                  desc="-10 Маг | +20 Стаб, -10 Пуст" 
                  onClick={() => handleAction('recall')}
                  disabled={actionsLeft <= 0 || phase !== 'action'}
                  highlight
                />
              </div>
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer: Dialogue & Controls */}
      <footer className="p-6 bg-zinc-900/80 border-t border-zinc-800 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-6 items-end">
          <div className="flex-1 space-y-2">
            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em]">Журнал диалогов</div>
            <div className="bg-black/40 border border-zinc-800 rounded-xl p-4 min-h-[80px] flex items-center italic text-zinc-300 leading-relaxed relative group transition-all hover:border-zinc-700"
              onClick={phase === 'dialogue_sequence' ? advanceDialogue : undefined}
              style={{ cursor: phase === 'dialogue_sequence' ? 'pointer' : 'default' }}
            >
              {dialogue}
              {phase === 'dialogue_sequence' && (
                <motion.div 
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute right-4 bottom-4"
                >
                  <ChevronRight className="w-4 h-4 text-zinc-500" />
                </motion.div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col gap-3 w-full md:w-auto">
            <div className="flex justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-widest px-1">
              <span>Действия</span>
              <span>{actionsLeft} / {ACTIONS_PER_DAY}</span>
            </div>
            <button 
              onClick={nextPhase}
              disabled={(actionsLeft > 0 && phase === 'action') || phase === 'minigame' || phase === 'dialogue_sequence' || phase === 'cutscene'}
              className={`px-8 py-4 rounded-xl font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2 ${
                (actionsLeft > 0 && phase === 'action') || phase === 'minigame' || phase === 'dialogue_sequence' || phase === 'cutscene'
                ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' 
                : 'bg-white text-black hover:bg-zinc-200 shadow-[0_0_20px_rgba(255,255,255,0.1)]'
              }`}
            >
              Далее <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </footer>

      {/* History Sidebar (Desktop only) */}
      <div className="hidden lg:block fixed left-6 top-24 w-48 space-y-4">
        <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2">
          <History className="w-3 h-3" /> Последние события
        </div>
        <div className="space-y-2">
          {history.map((h, i) => (
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              key={i} 
              className="text-xs text-zinc-400 border-l border-zinc-800 pl-3 py-1"
            >
              {h}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Event Overlay */}
      <AnimatePresence>
        {phase === 'event' && activeEvent === 'void' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-red-950/20 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-zinc-900 border border-red-900/50 p-8 rounded-3xl max-w-md w-full text-center space-y-6 shadow-2xl shadow-red-900/20"
            >
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-red-500">Атака Пустоты!</h3>
                <p className="text-zinc-400 italic">"Тени сгущаются. Они хотят забрать то, что от меня осталось."</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => {
                    startMiniGame('hunters');
                  }}
                  className="p-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-colors"
                >
                  Сопротивляться
                </button>
                <button 
                  onClick={() => {
                    updateStat('stability', -20);
                    updateStat('void', 15);
                    setPhase('night');
                    setDialogue("Ао: 'Я... я не смогла сражаться. Все болит.'");
                  }}
                  className="p-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-xl transition-colors"
                >
                  Игнорировать
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {phase === 'event' && activeEvent === 'memory' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-blue-950/20 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-zinc-900 border border-blue-900/50 p-8 rounded-3xl max-w-md w-full text-center space-y-6 shadow-2xl shadow-blue-900/20"
            >
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto">
                <History className="w-8 h-8 text-blue-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-blue-500">Ложное воспоминание</h3>
                <p className="text-zinc-400 italic">"{currentMemory?.text}" (Это воспоминание искажено...)</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => {
                    startMiniGame('memory');
                  }}
                  className="p-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors"
                >
                  Восстановить (-10 Магии)
                </button>
                <button 
                  onClick={() => {
                    updateStat('stability', -10);
                    updateStat('void', 10);
                    setPhase('morning');
                    setDialogue("Ао: 'Я... я не могу вспомнить ясно. Все так запутано.'");
                  }}
                  className="p-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-xl transition-colors"
                >
                  Игнорировать
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Story Over Modal */}
      <AnimatePresence>
        {showStoryOverModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-zinc-900 border border-zinc-700 p-8 rounded-3xl max-w-md text-center space-y-6 shadow-2xl"
            >
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="text-blue-400 w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">Обновление сюжета</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  На данный момент это пока весь сюжет. Вы можете продолжать играть дальше просто ради челленджа и механик!
                </p>
              </div>
              <button 
                onClick={() => setShowStoryOverModal(false)}
                className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-all"
              >
                Понятно
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CutsceneView({ slides, onFinish }: { slides: string[], onFinish: () => void }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center p-12"
    >
      <button 
        onClick={onFinish}
        className="absolute top-8 right-8 text-zinc-600 hover:text-white text-xs uppercase tracking-[0.3em] font-mono transition-colors"
      >
        Пропустить
      </button>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl text-center space-y-12"
        >
          <p className="text-xl md:text-2xl text-zinc-300 leading-relaxed font-serif italic">
            {slides[currentSlide]}
          </p>
          
          <button 
            onClick={() => {
              if (currentSlide < slides.length - 1) {
                setCurrentSlide(prev => prev + 1);
              } else {
                onFinish();
              }
            }}
            className="px-8 py-3 border border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-500 transition-all text-xs uppercase tracking-[0.4em] font-mono"
          >
            {currentSlide < slides.length - 1 ? "Следующий фрагмент" : "Войти в Пустоту"}
          </button>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-12 flex gap-2">
        {slides.map((_, i) => (
          <div 
            key={i} 
            className={`h-1 transition-all duration-500 ${i === currentSlide ? 'w-8 bg-white' : 'w-2 bg-zinc-800'}`} 
          />
        ))}
      </div>
    </motion.div>
  );
}

// --- Subcomponents ---

function StatBar({ icon, label, value, max, color }: { icon: React.ReactNode, label: string, value: number, max: number, color: string }) {
  const percentage = (value / max) * 100;
  return (
    <div className="space-y-1.5 w-32 md:w-40">
      <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
        <div className="flex items-center gap-1.5">{icon} {label}</div>
        <span>{Math.round(value)}</span>
      </div>
      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className={`h-full ${color} shadow-[0_0_8px_rgba(0,0,0,0.5)]`}
        />
      </div>
    </div>
  );
}

function ActionButton({ icon, label, desc, onClick, disabled, highlight }: { icon: React.ReactNode, label: string, desc: string, onClick: () => void, disabled?: boolean, highlight?: boolean }) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`group relative p-4 rounded-2xl border transition-all flex flex-col items-center text-center gap-2 active:scale-95 ${
        disabled 
        ? "bg-zinc-900/30 border-zinc-800 opacity-40 cursor-not-allowed" 
        : highlight
        ? "bg-purple-600/10 border-purple-500/50 hover:bg-purple-600/20 hover:border-purple-400"
        : "bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700"
      }`}
    >
      <div className={`p-3 rounded-xl transition-colors ${highlight ? 'bg-purple-500/20 text-purple-400' : 'bg-zinc-800 text-zinc-400 group-hover:text-white'}`}>
        {icon}
      </div>
      <div className="space-y-0.5">
        <div className="text-sm font-bold">{label}</div>
        <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-tighter">{desc}</div>
      </div>
    </button>
  );
}

// --- Custom Hooks ---

function useMovement(initialPos: { x: number, y: number }, speed: number = 2) {
  const [pos, setPos] = useState(initialPos);
  const keys = React.useRef<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => keys.current.add(e.key);
    const handleKeyUp = (e: KeyboardEvent) => keys.current.delete(e.key);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    let frameId: number;
    const loop = () => {
      setPos(prev => {
        let { x, y } = prev;
        if (keys.current.has('ArrowUp')) y = Math.max(0, y - speed);
        if (keys.current.has('ArrowDown')) y = Math.min(100, y + speed);
        if (keys.current.has('ArrowLeft')) x = Math.max(0, x - speed);
        if (keys.current.has('ArrowRight')) x = Math.min(100, x + speed);
        return { x, y };
      });
      frameId = requestAnimationFrame(loop);
    };
    frameId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(frameId);
    };
  }, [speed]);

  return pos;
}

// --- Mini Games Implementation ---

function MiniGameTutorial({ type, onClose }: { type: MiniGameType, onClose: () => void }) {
  const tutorials: Record<MiniGameType, { title: string, icon: React.ReactNode, steps: string[] }> = {
    invoker: {
      title: "Создание иллюзии",
      icon: <Sparkles className="w-8 h-8 text-purple-400" />,
      steps: [
        "Сотвори 10 элементов за 6 секунд.",
        "Используй Q (Огонь), W (Свет), E (Тень).",
        "Неправильные элементы сбрасывают последовательность."
      ]
    },
    recall: {
      title: "Вспомнить прошлое",
      icon: <History className="w-8 h-8 text-blue-400" />,
      steps: [
        "Выбери 3 правильных фрагмента утреннего воспоминания.",
        "Избегай негативных слов и ложных фрагментов.",
        "Ошибки вредят Стабильности и усиливают Пустоту."
      ]
    },
    hunters: {
      title: "Сопротивление Пустоте",
      icon: <Ghost className="w-8 h-8 text-red-500" />,
      steps: [
        "Продержись 15 секунд.",
        "Избегай красных зон предупреждения.",
        "Используй стрелки для перемещения.",
        "Успех дает +20 Магии."
      ]
    },
    memory: {
      title: "Восстановление памяти",
      icon: <History className="w-8 h-8 text-blue-400" />,
      steps: [
        "Поймай 5 зеленых слов.",
        "Избегай красных слов.",
        "Используй стрелки для перемещения."
      ]
    }
  };

  const t = tutorials[type];

  return (
    <div className="space-y-8 text-center py-4">
      <div className="space-y-4">
        <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto border border-zinc-700">
          {t.icon}
        </div>
        <h2 className="text-3xl font-black uppercase italic tracking-tighter">{t.title}</h2>
      </div>
      
      <div className="space-y-3 text-left max-w-xs mx-auto">
        {t.steps.map((step, i) => (
          <div key={i} className="flex gap-3 items-start text-zinc-400">
            <div className="w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
              {i + 1}
            </div>
            <p className="text-sm leading-tight">{step}</p>
          </div>
        ))}
      </div>

      <button 
        onClick={onClose}
        className="w-full py-4 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-all active:scale-95"
      >
        Я готов
      </button>
    </div>
  );
}

function MiniGame({ type, onFinish, updateStat, currentMemory }: { type: MiniGameType, onFinish: (success: boolean) => void, updateStat: (stat: 'magic' | 'stability' | 'void', delta: number) => void, currentMemory: Memory | null }) {
  if (type === 'invoker') return <InvokerGame onFinish={onFinish} />;
  if (type === 'memory') return <UndertaleWordGame onFinish={onFinish} updateStat={updateStat} />;
  if (type === 'hunters') return <UndertaleDodgeGame onFinish={onFinish} updateStat={updateStat} />;
  if (type === 'recall') return <RecallPastGame onFinish={onFinish} updateStat={updateStat} currentMemory={currentMemory} />;
  return null;
}

const INVOKER_ELEMENTS = ["Огонь", "Свет", "Тень"];
const INVOKER_KEY_MAP: Record<string, string> = { 
  'KeyQ': 'Огонь', 
  'KeyW': 'Свет', 
  'KeyE': 'Тень',
  'q': 'Огонь',
  'w': 'Свет',
  'e': 'Тень',
  'й': 'Огонь',
  'ц': 'Свет',
  'у': 'Тень'
};

function InvokerGame({ onFinish }: { onFinish: (success: boolean) => void }) {
  const [sequence, setSequence] = useState<string[]>([]);
  const [target, setTarget] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(6);
  
  useEffect(() => {
    const newTarget = Array.from({ length: 10 }, () => INVOKER_ELEMENTS[Math.floor(Math.random() * INVOKER_ELEMENTS.length)]);
    setTarget(newTarget);
    window.focus();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 0.1));
    }, 100);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      onFinish(false);
    }
  }, [timeLeft, onFinish]);

  const addElement = useCallback((el: string) => {
    setSequence(prev => {
      if (prev.length >= 10) return prev;
      if (el !== target[prev.length]) {
        return [];
      }
      return [...prev, el];
    });
  }, [target]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check both code (layout independent) and key (for fallback/specifics)
      const element = INVOKER_KEY_MAP[e.code] || INVOKER_KEY_MAP[e.key.toLowerCase()];
      if (element) {
        addElement(element);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [addElement]);

  useEffect(() => {
    if (sequence.length === 10 && target.length === 10 && sequence.length > 0) {
      onFinish(true);
    }
  }, [sequence, target, onFinish]);

  const getElementColor = (el: string) => {
    if (el === "Огонь") return "text-orange-500";
    if (el === "Свет") return "text-yellow-400";
    return "text-purple-500";
  };

  return (
    <div className="space-y-8 text-center">
      <div className="space-y-4">
        <div className="flex justify-between items-center px-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="text-purple-400" /> Создание иллюзии
          </h3>
          <div className="text-xl font-mono text-red-500 font-bold">{timeLeft.toFixed(1)}с</div>
        </div>
        
        <div className="bg-black/40 p-4 rounded-xl border border-zinc-800">
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">Целевая последовательность</div>
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 font-black italic uppercase text-sm">
            {target.map((t, i) => (
              <span key={i} className={`${getElementColor(t)} ${i < sequence.length ? 'opacity-30' : 'opacity-100'}`}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2 min-h-[60px]">
        {target.map((t, i) => {
          const isFilled = i < sequence.length;
          const isCurrent = i === sequence.length;
          return (
            <motion.div 
              key={i}
              animate={isCurrent ? { scale: [1, 1.2, 1] } : { scale: 1 }}
              transition={isCurrent ? { repeat: Infinity, duration: 1 } : {}}
              className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center text-[10px] font-bold transition-all ${
                isFilled 
                ? t === "Огонь" ? "bg-orange-500/20 border-orange-500 text-orange-500" : 
                  t === "Свет" ? "bg-yellow-500/20 border-yellow-400 text-yellow-400" : 
                  "bg-purple-500/20 border-purple-500 text-purple-500"
                : isCurrent 
                ? "border-white/50 bg-white/5 text-white"
                : "border-zinc-800 bg-zinc-900/50 text-zinc-700"
              }`}
            >
              {isFilled ? "✓" : ""}
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <button onClick={() => addElement("Огонь")} className="group p-4 bg-orange-950/30 border border-orange-900/50 rounded-xl hover:bg-orange-900/50 text-orange-400 font-bold flex flex-col items-center">
          <span>Огонь</span>
          <span className="text-[10px] text-orange-700 group-hover:text-orange-500">Q</span>
        </button>
        <button onClick={() => addElement("Свет")} className="group p-4 bg-yellow-950/30 border border-yellow-900/50 rounded-xl hover:bg-yellow-900/50 text-yellow-400 font-bold flex flex-col items-center">
          <span>Свет</span>
          <span className="text-[10px] text-yellow-700 group-hover:text-yellow-500">W</span>
        </button>
        <button onClick={() => addElement("Тень")} className="group p-4 bg-purple-950/30 border border-purple-900/50 rounded-xl hover:bg-purple-900/50 text-purple-400 font-bold flex flex-col items-center">
          <span>Тень</span>
          <span className="text-[10px] text-purple-700 group-hover:text-purple-500">E</span>
        </button>
      </div>
    </div>
  );
}

function RecallPastGame({ onFinish, updateStat, currentMemory }: { onFinish: (success: boolean) => void, updateStat: (stat: 'magic' | 'stability' | 'void', delta: number) => void, currentMemory: Memory | null }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  
  useEffect(() => {
    if (!currentMemory) return;
    
    // Correct fragments
    const correct = currentMemory.fragments;
    
    // Incorrect fragments from other memories
    const otherFragments = MEMORIES
      .filter(m => m.text !== currentMemory.text)
      .flatMap(m => m.fragments);
    
    // Mix with negative words
    const allIncorrect = [...otherFragments, ...NEGATIVE_WORDS];
    
    // Pick 7 random incorrect ones
    const shuffledIncorrect = [...allIncorrect].sort(() => Math.random() - 0.5).slice(0, 7);
    
    // Combine and shuffle
    const finalOptions = [...correct, ...shuffledIncorrect].sort(() => Math.random() - 0.5);
    setOptions(finalOptions);
  }, [currentMemory]);

  const handleSelect = (word: string) => {
    if (selected.includes(word)) return;
    
    const isCorrect = currentMemory?.fragments.includes(word);
    
    if (isCorrect) {
      const newSelected = [...selected, word];
      setSelected(newSelected);
      if (newSelected.length === 3) {
        setTimeout(() => onFinish(true), 500);
      }
    } else {
      updateStat('stability', -5);
      updateStat('void', 5);
      // Visual feedback for mistake? Maybe shake?
    }
  };

  return (
    <div className="space-y-8 text-center">
      <div className="space-y-2">
        <h3 className="text-xl font-bold flex items-center justify-center gap-2">
          <History className="text-blue-400" /> Вспомнить прошлое
        </h3>
        <p className="text-zinc-500 text-sm italic">"Выбери фрагменты, которые кажутся... правильными."</p>
      </div>

      <div className="bg-black/40 p-6 rounded-2xl border border-zinc-800 min-h-[100px] flex items-center justify-center italic text-zinc-300">
        {currentMemory?.text}
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {options.map((word, i) => {
          const isSelected = selected.includes(word);
          return (
            <motion.button
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(word)}
              disabled={isSelected}
              className={`px-4 py-2 rounded-xl border transition-all font-medium ${
                isSelected 
                ? "bg-blue-500/20 border-blue-500 text-blue-400 cursor-default"
                : "bg-zinc-900 border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-white"
              }`}
            >
              {word}
            </motion.button>
          );
        })}
      </div>

      <div className="flex justify-center gap-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className={`w-3 h-3 rounded-full border ${i < selected.length ? 'bg-blue-500 border-blue-400' : 'bg-zinc-800 border-zinc-700'}`} />
        ))}
      </div>
    </div>
  );
}

// --- Undertale Style Games ---

function UndertaleDodgeGame({ onFinish, updateStat }: { onFinish: (success: boolean) => void, updateStat: (stat: 'magic' | 'stability' | 'void', delta: number) => void }) {
  const pos = useMovement({ x: 50, y: 50 }, 1.5);
  const posRef = React.useRef(pos);
  const [attacks, setAttacks] = useState<{ id: number, type: 'hand' | 'beam', orientation: 'v' | 'h', position: number, active: boolean, warning: boolean }[]>([]);
  const [timeLeft, setTimeLeft] = useState(15);
  const ATTACK_WIDTH = 25; // Percentage of the field

  useEffect(() => {
    posRef.current = pos;
  }, [pos]);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(prev => Math.max(0, prev - 1)), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      onFinish(true);
    }
  }, [timeLeft, onFinish]);

  useEffect(() => {
    const interval = setInterval(() => {
      const orientation = Math.random() > 0.5 ? 'v' : 'h';
      let position;
      
      // 40% chance to target player
      if (Math.random() < 0.4) {
        position = orientation === 'v' ? posRef.current.x : posRef.current.y;
      } else {
        position = Math.random() * 80 + 10; // Random position from 10% to 90%
      }

      const id = Date.now();
      setAttacks(prev => [...prev, { id, type: Math.random() > 0.5 ? 'hand' : 'beam', orientation, position, active: false, warning: true }]);
      
      setTimeout(() => {
        setAttacks(prev => prev.map(a => a.id === id ? { ...a, warning: false, active: true } : a));
      }, 800);

      setTimeout(() => {
        setAttacks(prev => prev.filter(a => a.id !== id));
      }, 1600);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Collision detection
  useEffect(() => {
    const activeAttacks = attacks.filter(a => a.active);
    for (const attack of activeAttacks) {
      let hit = false;
      const halfWidth = ATTACK_WIDTH / 2;
      
      if (attack.orientation === 'v') {
        // Vertical beam: check X position
        if (pos.x > attack.position - halfWidth && pos.x < attack.position + halfWidth) hit = true;
      } else {
        // Horizontal beam: check Y position
        if (pos.y > attack.position - halfWidth && pos.y < attack.position + halfWidth) hit = true;
      }
      
      if (hit) {
        updateStat('magic', -1); // Rapid damage
        updateStat('void', 0.5);
      }
    }
  }, [pos, attacks, updateStat]);

  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-between items-center text-zinc-500 font-mono">
        <span>Сопротивляйся!</span>
        <span>{timeLeft}с</span>
      </div>
      <div className="relative w-64 h-64 bg-black border-4 border-white mx-auto overflow-hidden">
        {/* Player */}
        <motion.div 
          animate={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          transition={{ type: "tween", ease: "linear", duration: 0 }}
          className="absolute w-4 h-4 bg-red-500 rounded-sm -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_red] z-20"
        />
        
        {/* Attacks */}
        {attacks.map(a => (
          <React.Fragment key={a.id}>
            {a.warning && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{ duration: 0.2, repeat: 4 }}
                style={{
                  left: a.orientation === 'v' ? `${a.position - ATTACK_WIDTH/2}%` : '0',
                  top: a.orientation === 'h' ? `${a.position - ATTACK_WIDTH/2}%` : '0',
                  width: a.orientation === 'v' ? `${ATTACK_WIDTH}%` : '100%',
                  height: a.orientation === 'h' ? `${ATTACK_WIDTH}%` : '100%',
                }}
                className="absolute bg-red-500/30 border border-red-500 flex items-center justify-center"
              >
                <span className="text-red-500 font-black text-xl">!</span>
              </motion.div>
            )}
            {a.active && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  left: a.orientation === 'v' ? `${a.position - ATTACK_WIDTH/2}%` : '0',
                  top: a.orientation === 'h' ? `${a.position - ATTACK_WIDTH/2}%` : '0',
                  width: a.orientation === 'v' ? `${ATTACK_WIDTH}%` : '100%',
                  height: a.orientation === 'h' ? `${ATTACK_WIDTH}%` : '100%',
                }}
                className="absolute bg-white/90 backdrop-blur-sm z-10"
              >
                <div className="w-full h-full flex items-center justify-center overflow-hidden">
                  {a.type === 'hand' ? <Ghost className="text-black w-6 h-6" /> : <Zap className="text-black w-6 h-6" />}
                </div>
              </motion.div>
            )}
          </React.Fragment>
        ))}
      </div>
      <p className="text-xs text-zinc-500 italic">Используй стрелки для перемещения. Избегай белых зон.</p>
    </div>
  );
}

function UndertaleWordGame({ onFinish, updateStat }: { onFinish: (success: boolean) => void, updateStat: (stat: 'magic' | 'stability' | 'void', delta: number) => void }) {
  const pos = useMovement({ x: 50, y: 50 }, 1.5);
  const [words, setWords] = useState<{ id: number, text: string, type: 'good' | 'bad', x: number, y: number }[]>([]);
  const [score, setScore] = useState(0);
  const targetScore = 5;
  const [timeLeft, setTimeLeft] = useState(20);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(prev => Math.max(0, prev - 1)), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      onFinish(score >= targetScore);
    }
  }, [timeLeft, score, onFinish]);

  useEffect(() => {
    if (score >= targetScore) {
      onFinish(true);
    }
  }, [score, onFinish]);

  useEffect(() => {
    const interval = setInterval(() => {
      const isGood = Math.random() > 0.7;
      const goodWords = ["Надежда", "Свет", "Друг", "Тепло", "Годвилль"];
      const badWords = ["Одиночество", "Пустота", "Тишина", "Потеря", "Забвение"];
      const text = isGood ? goodWords[Math.floor(Math.random() * goodWords.length)] : badWords[Math.floor(Math.random() * badWords.length)];
      
      setWords(prev => [...prev, { 
        id: Date.now(), 
        text, 
        type: isGood ? 'good' : 'bad', 
        x: Math.random() * 90 + 5, 
        y: -10 
      }]);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const moveInterval = setInterval(() => {
      setWords(prev => prev.map(w => ({ ...w, y: w.y + 2 })).filter(w => w.y < 110));
    }, 50);
    return () => clearInterval(moveInterval);
  }, []);

  // Collision detection
  useEffect(() => {
    for (const word of words) {
      const dx = Math.abs(word.x - pos.x);
      const dy = Math.abs(word.y - pos.y);
      if (dx < 6 && dy < 6) {
        if (word.type === 'good') {
          setScore(s => s + 1);
          setWords(prev => prev.filter(w => w.id !== word.id));
        } else {
          updateStat('magic', -5);
          updateStat('void', 10);
          setWords(prev => prev.filter(w => w.id !== word.id));
        }
      }
    }
  }, [pos, words, updateStat]);

  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-between items-center text-zinc-500 font-mono">
        <span>Лови добрые слова!</span>
        <span>{score}/{targetScore}</span>
      </div>
      <div className="relative w-64 h-64 bg-black border-4 border-white mx-auto overflow-hidden">
        {/* Player */}
        <motion.div 
          animate={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          transition={{ type: "tween", ease: "linear", duration: 0 }}
          className="absolute w-4 h-4 bg-green-500 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_green] z-20"
        />
        
        {/* Words */}
        {words.map(w => (
          <motion.div 
            key={w.id}
            style={{ left: `${w.x}%`, top: `${w.y}%` }}
            className={`absolute -translate-x-1/2 text-[10px] font-bold px-2 py-0.5 rounded border z-10 ${
              w.type === 'good' ? 'text-green-400 border-green-500 bg-green-900/20' : 'text-red-400 border-red-500 bg-red-900/20'
            }`}
          >
            {w.text}
          </motion.div>
        ))}
      </div>
      <p className="text-xs text-zinc-500 italic">Лови ЗЕЛЕНЫЕ слова. Избегай КРАСНЫХ слов.</p>
    </div>
  );
}

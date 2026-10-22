const STORAGE_KEY = "japaneseVocabStudy:v2";
const SETTINGS_KEY = "japaneseVocabSettings:v1";
const LEGACY_STORAGE_KEY = "japaneseVocabStudy:v1";
const todayKey = new Date().toISOString().slice(0, 10);
const DEFAULT_QUESTION_COUNT = 10;
const SEARCH_RESULTS_SCOPE = "__search_results__";
const CATEGORY_LABELS = {
  "학교/직업": "학교/직업 관련",
  문화: "문화 관련",
  "날짜/시간": "날짜/시간 관련",
  "생활 관련": "그 외 생활 관련",
  "장소/위치": "장소 및 위치 관련",
  "장소 및 위치": "장소 및 위치 관련",
  형용사: "な 형용사",
  "나 형용사": "な 형용사",
  "나 형용사 반대어": "な 형용사 반대어"
};
const CATEGORY_ORDER = [
  "교통수단",
  "학교/직업 관련",
  "문화 관련",
  "날짜/시간 관련",
  "그 외 생활 관련",
  "사람 관련",
  "장소 및 위치 관련",
  "な 형용사 반대어",
  "な 형용사",
  "색",
  "맛",
  "반대어",
  "날씨",
  "기타",
  "동사"
];
const GENERAL_CATEGORIES = CATEGORY_ORDER.slice(0, 7);
const ADJECTIVE_CATEGORY_GROUPS = [
  { title: "な 형용사", japaneseTitle: "な形容詞", categories: ["な 형용사 반대어", "な 형용사"] },
  { title: "い 형용사", japaneseTitle: "い形容詞", categories: ["색", "맛", "반대어", "날씨", "기타"] }
];
const TRAILING_CATEGORIES = ["동사"];
const OPPOSITE_COLUMN_LAYOUTS = {
  "な 형용사 반대어": { total: 6, firstColumn: 3 },
  "い 형용사 반대어": { total: 20, firstColumn: 10 },
  반대어: { total: 20, firstColumn: 10 }
};
const OPPOSITE_PAIR_PHOTO_ORDER = new Map(
  [
    "w-066:w-067",
    "w-068:w-069",
    "w-070:w-071",
    "w-072:w-073",
    "w-074:w-075",
    "w-076:w-077",
    "w-236:w-240",
    "w-241:w-242",
    "w-243:w-244",
    "w-247:w-248",
    "w-249:w-250",
    "w-251:w-252",
    "w-253:w-254",
    "w-255:w-256",
    "w-257:w-258",
    "w-259:w-260",
    "w-261:w-262",
    "w-245:w-246",
    "w-263:w-264",
    "w-265:w-266",
    "w-267:w-268",
    "w-269:w-270",
    "w-271:w-272",
    "w-273:w-274",
    "w-275:w-276",
    "w-277:w-278"
  ].map((key, index) => [key, index])
);
const NA_ADJECTIVE_ORDER = new Map(
  [
    "w-078",
    "w-089",
    "w-100",
    "w-079",
    "w-090",
    "w-101",
    "w-080",
    "w-091",
    "w-102",
    "w-081",
    "w-092",
    "w-103",
    "w-082",
    "w-093",
    "w-104",
    "w-083",
    "w-094",
    "w-105",
    "w-084",
    "w-095",
    "w-106",
    "w-085",
    "w-096",
    "w-107",
    "w-086",
    "w-097",
    "w-108",
    "w-087",
    "w-098",
    "w-109",
    "w-088",
    "w-099",
    "w-110"
  ].map((id, index) => [id, index])
);
const VERB_COLUMN_WORD_IDS = {
  "original-left": Array.from({ length: 16 }, (_, index) => `w-${String(304 + index).padStart(3, "0")}`),
  "original-right": Array.from({ length: 16 }, (_, index) => `w-${String(320 + index).padStart(3, "0")}`),
  "photo-left": [
    "w-336", "w-337", "w-338", "w-307", "w-339", "w-340", "w-341", "w-342", "w-343", "w-344",
    "w-345", "w-309", "w-304", "w-346", "w-347", "w-348", "w-349", "w-350", "w-351", "w-352",
    "w-353", "w-354", "w-355", "w-312", "w-356", "w-357", "w-358", "w-359", "w-326", "w-360",
    "w-308", "w-361", "w-362", "w-363", "w-414", "w-415", "w-416", "w-417", "w-327", "w-418"
  ],
  "photo-middle": [
    "w-364", "w-324", "w-365", "w-366", "w-367", "w-311", "w-368", "w-369", "w-370", "w-371",
    "w-372", "w-373", "w-374", "w-375", "w-376", "w-377", "w-378", "w-323", "w-379", "w-322",
    "w-315", "w-380", "w-317", "w-381", "w-382", "w-383", "w-384", "w-385", "w-316", "w-386",
    "w-387", "w-388", null, "w-314", "w-419", "w-420", "w-421", "w-422", "w-423", "w-424"
  ],
  "photo-right": [
    "w-389", "w-313", "w-310", "w-390", "w-391", "w-392", "w-393", "w-394", "w-395", null,
    null, "w-396", "w-397", "w-305", "w-398", "w-399", "w-400", "w-401", "w-402", null,
    "w-403", "w-404", "w-405", "w-406", null, "w-407", "w-408", "w-409", null, "w-410",
    "w-411", "w-412", null, "w-413", "w-425", "w-426", null, "w-325", "w-427", null
  ],
  "photo2-left": [
    "w-428", "w-429", "w-430", "w-431", "w-328", "w-439", "w-440", "w-441", "w-447", "w-448",
    "w-449", "w-450", "w-451", "w-452", "w-462", "w-463", "w-464", "w-465", "w-466"
  ],
  "photo2-middle": [
    "w-432", "w-433", "w-434", "w-332", null, "w-442", "w-443", "w-444", "w-453", "w-454",
    "w-331", "w-455", "w-456", null, "w-467", "w-468", "w-469", "w-330", "w-470"
  ],
  "photo2-right": [
    "w-435", "w-436", "w-437", "w-438", null, "w-445", "w-446", null, "w-457", "w-458",
    "w-459", "w-460", "w-461", null, "w-471", "w-472", "w-473", "w-329", "w-474"
  ],
  "photo3-left": ["w-334"],
  "photo3-middle": ["w-335"],
  "photo3-right": [null],
  "photo-exception-left": ["w-320", "w-475", "w-476"],
  "photo-exception-middle": ["w-319", "w-477", "w-478"],
  "photo-exception-right": ["w-479", "w-480", "w-481"],
  "transitivity-left-intransitive": [
    "w-337", "w-319", "w-384", "w-386", "w-396", "w-389", "w-482", "w-470", "w-485", "w-438"
  ],
  "transitivity-left-transitive": [
    "w-428", "w-436", "w-467", "w-464", "w-333", "w-432", "w-483", "w-484", "w-357", "w-344"
  ],
  "transitivity-right-intransitive": [
    "w-351", "w-321", "w-315", "w-372", "w-487", "w-406", "w-440", "w-456", "w-383", "w-437"
  ],
  "transitivity-right-transitive": [
    "w-447", "w-435", "w-449", "w-486", "w-488", "w-461", "w-348", "w-353", "w-489", "w-343"
  ]
};
const PHOTO_VERB_COLUMNS = ["photo-left", "photo-middle", "photo-right"];
const PHOTO_2_VERB_COLUMNS = ["photo2-left", "photo2-middle", "photo2-right"];
const PHOTO_3_VERB_COLUMNS = ["photo3-left", "photo3-middle", "photo3-right"];
const PHOTO_EXCEPTION_VERB_COLUMNS = [
  "photo-exception-left",
  "photo-exception-middle",
  "photo-exception-right"
];
const TRANSITIVITY_VERB_COLUMNS = [
  "transitivity-left-intransitive",
  "transitivity-left-transitive",
  "transitivity-right-intransitive",
  "transitivity-right-transitive"
];
const PHOTO_VERB_COLUMN_GROUPS = [
  { scope: "photo-1-grid", columns: PHOTO_VERB_COLUMNS },
  { scope: "photo-2-grid", columns: PHOTO_2_VERB_COLUMNS },
  { scope: "photo-3-grid", columns: PHOTO_3_VERB_COLUMNS },
  { scope: "photo-exception-grid", columns: PHOTO_EXCEPTION_VERB_COLUMNS },
  { scope: "transitivity-grid", columns: TRANSITIVITY_VERB_COLUMNS }
];
const VERB_LAYOUTS = [
  { title: "기존 동사", columns: ["original-left", "original-right"], className: "verb-word-grid" },
  {
    title: "1그룹 동사",
    columns: PHOTO_VERB_COLUMNS,
    className: "verb-word-grid verb-word-grid-three"
  },
  {
    title: "2그룹 동사",
    columns: PHOTO_2_VERB_COLUMNS,
    className: "verb-word-grid verb-word-grid-three"
  },
  {
    title: "3그룹 동사",
    columns: PHOTO_3_VERB_COLUMNS,
    className: "verb-word-grid verb-word-grid-three"
  },
  {
    title: "예외 1그룹 동사",
    columns: PHOTO_EXCEPTION_VERB_COLUMNS,
    className: "verb-word-grid verb-word-grid-three"
  },
  {
    title: "자동사 · 타동사",
    columns: TRANSITIVITY_VERB_COLUMNS,
    columnLabels: ["자동사", "타동사 · ～を", "자동사", "타동사 · ～を"],
    className: "verb-word-grid verb-word-grid-four"
  }
];
function getVerbRowOrder(columns) {
  return Array.from(
    { length: Math.max(...columns.map((column) => VERB_COLUMN_WORD_IDS[column].length)) },
    (_, rowIndex) => columns.map((column) => VERB_COLUMN_WORD_IDS[column][rowIndex])
  )
    .flat()
    .filter(Boolean);
}

const PHOTO_VERB_ROW_ORDERS = new Map(
  PHOTO_VERB_COLUMN_GROUPS.map(({ scope, columns }) => [scope, getVerbRowOrder(columns)])
);
const PHOTO_VERB_ROW_ORDER = PHOTO_VERB_ROW_ORDERS.get("photo-1-grid");
const VERB_CARD_SEQUENCE = [
  ...VERB_COLUMN_WORD_IDS["original-left"],
  ...VERB_COLUMN_WORD_IDS["original-right"],
  ...PHOTO_VERB_COLUMN_GROUPS.flatMap(({ scope }) => PHOTO_VERB_ROW_ORDERS.get(scope))
];
const VERB_CARD_ORDER = VERB_CARD_SEQUENCE.filter(
  (id, index) => VERB_CARD_SEQUENCE.lastIndexOf(id) === index
);
const VERB_CARD_ORDER_INDEX = new Map(VERB_CARD_ORDER.map((id, index) => [id, index]));

const state = {
  filter: "all",
  category: "all",
  search: "",
  searchTerms: [],
  limit: "",
  showReading: false,
  quizQuestionCount: DEFAULT_QUESTION_COUNT,
  writingQuestionCount: DEFAULT_QUESTION_COUNT,
  oppositeQuestionCount: DEFAULT_QUESTION_COUNT,
  oppositeShowKorean: false,
  kanjiShowKorean: false,
  kanjiWritingPromptMode: "hiragana",
  kanjiWritingPromptDragging: false,
  kanjiStrokeOrderVisible: false,
  kanjiWordSelection: null,
  oppositePairSelection: null,
  selectedIds: [],
  selectedOnly: false,
  practiceQuestionCountScope: null,
  lastSelectedId: null,
  lastSelectedCategory: null,
  lastOppositePairKey: null,
  lastOppositePairGroup: null,
  lastKanjiWordId: null,
  lastKanjiWordCategory: null,
  cardIndex: 0,
  flipped: false,
  keepFlipped: false,
  quiz: {
    questions: [],
    index: 0,
    score: 0,
    answered: false,
    results: []
  },
  writing: {
    questions: [],
    index: 0,
    score: 0,
    answered: false,
    results: []
  },
  opposite: {
    mode: "study",
    pairs: [],
    pairIndex: 0,
    questions: [],
    index: 0,
    score: 0,
    answered: false,
    selectedChoiceId: null,
    results: []
  },
  kanji: {
    mode: "groups",
    groups: [],
    groupIndex: 0,
    questions: [],
    index: 0,
    score: 0,
    answered: false,
    results: []
  },
  kanjiWriting: {
    questions: [],
    index: 0,
    score: 0,
    phase: "drawing",
    results: [],
    strokes: [],
    drawingDataUrl: "",
    pointerId: null
  },
  kanjiTracing: {
    words: [],
    index: 0,
    completed: false,
    strokes: [],
    pointerId: null
  },
  retry: {
    kind: null,
    title: "",
    questions: [],
    index: 0,
    results: [],
    answered: false,
    selectedChoiceIndex: null
  },
  review: {
    quiz: null,
    writing: null,
    opposite: null,
    kanjiReading: null,
    kanjiWriting: null
  },
  study: {
    knownIds: [],
    hardIds: [],
    daily: {}
  }
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));
let allWordsCache = null;
let wordsByIdCache = null;
let wordSearchDataCache = null;
let searchScoreCache = new Map();
let searchScoreCacheKey = "";

function getDefaultWords() {
  return Array.isArray(window.defaultWords) ? window.defaultWords : [];
}

function getAllWords() {
  if (allWordsCache) return allWordsCache;

  allWordsCache = sortWordsByWordbookOrder(
    getDefaultWords().map((word) => ({
      ...word,
      tag: getDisplayTag(word.tag)
    }))
  );
  wordsByIdCache = new Map(allWordsCache.map((word) => [word.id, word]));
  wordSearchDataCache = new Map(
    allWordsCache.map((word) => {
      const headwordFields = [word.kanji].map(normalizeSearchText).filter(Boolean);
      const readingFields = unique(
        [word.hiragana, ...(Array.isArray(word.answers) ? word.answers : [])]
          .map(normalizeSearchText)
          .filter(Boolean)
      );
      const secondaryFields = unique(
        [word.meaning, word.prompt || "", ...getWordCategories(word)]
          .map(normalizeSearchText)
          .filter(Boolean)
      );
      const tokens = unique(
        [...headwordFields, ...readingFields, ...secondaryFields].flatMap(splitSearchTokens)
      );
      return [word.id, { headwordFields, readingFields, secondaryFields, tokens }];
    })
  );
  return allWordsCache;
}

function getWordById(id) {
  getAllWords();
  return wordsByIdCache.get(id);
}

function unique(items) {
  return [...new Set(items)];
}

function getDisplayTag(tag) {
  return CATEGORY_LABELS[tag] || tag || "기타";
}

function getWordCategories(word) {
  return unique([word?.tag, ...(Array.isArray(word?.extraTags) ? word.extraTags.map(getDisplayTag) : [])].filter(Boolean));
}

function getCategoryIndex(tag) {
  const index = CATEGORY_ORDER.indexOf(tag);
  return index === -1 ? CATEGORY_ORDER.length : index;
}

function getNumericWordId(id) {
  const number = Number.parseInt(String(id || "").replace(/\D/g, ""), 10);
  return Number.isFinite(number) ? number : Number.MAX_SAFE_INTEGER;
}

function getWordOrderIndex(word) {
  if (word.tag === "な 형용사") {
    return NA_ADJECTIVE_ORDER.get(word.id) ?? getNumericWordId(word.id);
  }
  if (word.tag === "동사") {
    return VERB_CARD_ORDER_INDEX.get(word.id) ?? getNumericWordId(word.id);
  }
  return getNumericWordId(word.id);
}

function sortWordsByWordbookOrder(words) {
  return [...words].sort((a, b) => {
    const categoryDiff = getCategoryIndex(a.tag) - getCategoryIndex(b.tag);
    if (categoryDiff) return categoryDiff;
    return getWordOrderIndex(a) - getWordOrderIndex(b);
  });
}

function getOrderedCategories(words = getAllWords()) {
  const categories = unique(words.flatMap(getWordCategories).filter(Boolean));
  return categories.sort((a, b) => getCategoryIndex(a) - getCategoryIndex(b));
}

function sanitizeQuestionCount(value) {
  const count = Number.parseInt(value, 10);
  return Number.isFinite(count) && count > 0 ? count : DEFAULT_QUESTION_COUNT;
}

function getPracticeQuestionCountScope() {
  if (!state.selectedOnly || !state.selectedIds.length) return "all";
  return `selected:${[...state.selectedIds].sort().join(",")}`;
}

function syncPracticeQuestionCountsToSelection() {
  const scope = getPracticeQuestionCountScope();
  if (state.practiceQuestionCountScope === scope) return false;

  const count = state.selectedOnly ? state.selectedIds.length : DEFAULT_QUESTION_COUNT;
  state.quizQuestionCount = count;
  state.writingQuestionCount = count;
  state.practiceQuestionCountScope = scope;
  return true;
}

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function normalizeSearchText(value) {
  return String(value || "")
    .normalize("NFKC")
    .trim()
    .toLowerCase()
    .replace(/[ァ-ヶ]/g, (character) => String.fromCharCode(character.charCodeAt(0) - 0x60));
}

function splitSearchTokens(value) {
  return normalizeSearchText(value)
    .split(/[\s/／,，、;；:：·・()[\]{}（）［］｛｝]+/u)
    .filter(Boolean);
}

function normalizeAnswer(value) {
  return normalize(value).replace(/\s+/g, "");
}

function escapeHtml(value) {
  const element = document.createElement("div");
  element.textContent = String(value ?? "");
  return element.innerHTML;
}

function sanitizeStudy() {
  state.study.knownIds = unique(state.study.knownIds).filter((id) => getWordById(id));
  state.study.hardIds = unique(state.study.hardIds).filter((id) => getWordById(id));

  Object.keys(state.study.daily).forEach((key) => {
    state.study.daily[key] = unique(state.study.daily[key]).filter((id) => getWordById(id));
  });
}

function sanitizeSettings() {
  state.selectedIds = unique(state.selectedIds).filter((id) => getWordById(id));
  state.quizQuestionCount = sanitizeQuestionCount(state.quizQuestionCount);
  state.writingQuestionCount = sanitizeQuestionCount(state.writingQuestionCount);
  state.oppositeQuestionCount = sanitizeQuestionCount(state.oppositeQuestionCount);
  if (!["hiragana", "korean", "both"].includes(state.kanjiWritingPromptMode)) {
    state.kanjiWritingPromptMode = "hiragana";
  }
  if (state.oppositePairSelection !== null) {
    const validPairKeys = new Set(getAllOppositePairs().map(getOppositePairKey));
    state.oppositePairSelection = unique(state.oppositePairSelection).filter((key) => validPairKeys.has(key));
  }
  if (state.kanjiWordSelection !== null) {
    state.kanjiWordSelection = unique(state.kanjiWordSelection).filter((id) => {
      const word = getWordById(id);
      return word && getKanjiCharacters(word.kanji).length > 0;
    });
  }
  if (!state.selectedIds.length) {
    state.selectedOnly = false;
  }
  if (state.lastSelectedId && !getWordById(state.lastSelectedId)) {
    state.lastSelectedId = null;
    state.lastSelectedCategory = null;
  }
}

function loadStudy() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return;

  try {
    const parsed = JSON.parse(saved);
    state.study = {
      knownIds: Array.isArray(parsed.knownIds) ? parsed.knownIds : [],
      hardIds: Array.isArray(parsed.hardIds) ? parsed.hardIds : [],
      daily: parsed.daily && typeof parsed.daily === "object" ? parsed.daily : {}
    };
    sanitizeStudy();
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function loadSettings() {
  const saved = localStorage.getItem(SETTINGS_KEY);
  if (!saved) return;

  try {
    const parsed = JSON.parse(saved);
    state.showReading = Boolean(parsed.showReading);
    state.keepFlipped = Boolean(parsed.keepFlipped);
    state.flipped = state.keepFlipped;
    state.quizQuestionCount = sanitizeQuestionCount(parsed.quizQuestionCount);
    state.writingQuestionCount = sanitizeQuestionCount(parsed.writingQuestionCount);
    state.oppositeQuestionCount = sanitizeQuestionCount(parsed.oppositeQuestionCount);
    state.oppositeShowKorean = Boolean(parsed.oppositeShowKorean);
    state.kanjiShowKorean = Boolean(parsed.kanjiShowKorean);
    state.kanjiWritingPromptMode = parsed.kanjiWritingPromptMode || "hiragana";
    state.kanjiStrokeOrderVisible = Boolean(parsed.kanjiStrokeOrderVisible);
    state.kanjiWordSelection = Array.isArray(parsed.kanjiWordSelection) ? parsed.kanjiWordSelection : null;
    state.oppositePairSelection = Array.isArray(parsed.oppositePairSelection) ? parsed.oppositePairSelection : null;
    state.selectedIds = Array.isArray(parsed.selectedIds) ? parsed.selectedIds : [];
    state.selectedOnly = Boolean(parsed.selectedOnly);
    state.practiceQuestionCountScope =
      typeof parsed.practiceQuestionCountScope === "string" ? parsed.practiceQuestionCountScope : null;
    sanitizeSettings();
  } catch {
    localStorage.removeItem(SETTINGS_KEY);
  }
}

function saveStudy() {
  sanitizeStudy();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.study));
  renderStats();
}

function saveSettings() {
  sanitizeSettings();
  localStorage.setItem(
    SETTINGS_KEY,
    JSON.stringify({
      showReading: state.showReading,
      keepFlipped: state.keepFlipped,
      quizQuestionCount: state.quizQuestionCount,
      writingQuestionCount: state.writingQuestionCount,
      oppositeQuestionCount: state.oppositeQuestionCount,
      oppositeShowKorean: state.oppositeShowKorean,
      kanjiShowKorean: state.kanjiShowKorean,
      kanjiWritingPromptMode: state.kanjiWritingPromptMode,
      kanjiStrokeOrderVisible: state.kanjiStrokeOrderVisible,
      kanjiWordSelection: state.kanjiWordSelection,
      oppositePairSelection: state.oppositePairSelection,
      selectedIds: state.selectedIds,
      selectedOnly: state.selectedOnly,
      practiceQuestionCountScope: state.practiceQuestionCountScope
    })
  );
}

function isKnown(id) {
  return state.study.knownIds.includes(id);
}

function isHard(id) {
  return state.study.hardIds.includes(id);
}

function isSelected(id) {
  return state.selectedIds.includes(id);
}

function getOppositeWord(word) {
  return word?.oppositeId ? getWordById(word.oppositeId) : null;
}

function getAllOppositePairs() {
  const allWords = getAllWords();
  const pairedIds = new Set();
  const pairs = [];

  allWords.forEach((word) => {
    const opposite = getOppositeWord(word);
    if (!opposite || pairedIds.has(word.id) || pairedIds.has(opposite.id)) return;

    pairs.push({ left: word, right: opposite });
    pairedIds.add(word.id);
    pairedIds.add(opposite.id);
  });

  return pairs.sort((a, b) => getOppositePairOrder(a) - getOppositePairOrder(b));
}

function getOppositePairKey(pair) {
  return [pair.left.id, pair.right.id].sort().join(":");
}

function getOppositePairOrder(pair) {
  return OPPOSITE_PAIR_PHOTO_ORDER.get(getOppositePairKey(pair)) ?? Number.MAX_SAFE_INTEGER;
}

function getOppositePairs() {
  const allPairs = getAllOppositePairs();
  if (Array.isArray(state.oppositePairSelection)) {
    const selectedPairKeys = new Set(state.oppositePairSelection);
    return allPairs.filter((pair) => selectedPairKeys.has(getOppositePairKey(pair)));
  }

  const scopeWords = state.selectedOnly ? getSelectedWords() : getPickerWords();
  const scopeIds = new Set(scopeWords.map((word) => word.id));
  return allPairs.filter((pair) => scopeIds.has(pair.left.id) || scopeIds.has(pair.right.id));
}

function getAllOppositeWords() {
  return getAllWords().filter((word) => Boolean(word.oppositeId));
}

function formatOppositeWord(word) {
  return word ? `${word.kanji} (${word.hiragana}) · ${word.meaning}` : "";
}

function getPracticePrompt(word) {
  return word?.prompt || word?.meaning || "";
}

function getAcceptedAnswers(word) {
  return unique([word?.kanji, word?.hiragana, ...(Array.isArray(word?.answers) ? word.answers : [])].filter(Boolean));
}

function formatAcceptedAnswers(word) {
  return getAcceptedAnswers(word).join(" / ");
}

function formatAnswerFeedback(correct, expected) {
  return `${correct ? "정답입니다." : "오답입니다."} 정답: ${expected}`;
}

function getKanjiCharacters(value) {
  return unique(String(value || "").match(/\p{Script=Han}/gu) || []);
}

function getAllKanjiWords() {
  return getAllWords().filter((word) => getKanjiCharacters(word.kanji).length > 0);
}

function getKanjiStudyWords() {
  const kanjiWords = getAllKanjiWords();
  if (Array.isArray(state.kanjiWordSelection)) {
    const selectedIds = new Set(state.kanjiWordSelection);
    return kanjiWords.filter((word) => selectedIds.has(word.id));
  }
  const deckIds = new Set(getDeck().map((word) => word.id));
  return kanjiWords.filter((word) => deckIds.has(word.id));
}

function getKanjiGroups() {
  const allKanjiWords = getAllKanjiWords();

  return getKanjiStudyWords().map((selectedWord) => {
    const characters = getKanjiCharacters(selectedWord.kanji);
    return {
      word: selectedWord,
      characters,
      words: allKanjiWords.filter((word) =>
        getKanjiCharacters(word.kanji).some((character) => characters.includes(character))
      )
    };
  });
}

function getKanjiReadingAnswers(word) {
  const readings = [word?.hiragana, ...(Array.isArray(word?.answers) ? word.answers : [])]
    .filter((answer) => answer && getKanjiCharacters(answer).length === 0)
    .flatMap((answer) => String(answer).split(/[\/・]/));
  return unique(readings.map((answer) => answer.trim()).filter(Boolean));
}

function formatKanjiReadingAnswers(word) {
  return getKanjiReadingAnswers(word).join(" / ");
}

function getKanjiScopeLabel() {
  if (Array.isArray(state.kanjiWordSelection)) {
    return `직접 선택한 단어 ${state.kanjiWordSelection.length}개에서 추출 · 관련 단어는 전체 단어장`;
  }
  if (state.selectedOnly) return `선택 단어 ${getDeck().length}개에서 추출 · 관련 단어는 전체 단어장`;
  if (state.category !== "all") return `${state.category}에서 추출 · 관련 단어는 전체 단어장`;
  return "현재 학습 범위에서 추출 · 관련 단어는 전체 단어장";
}

function getSearchFieldScore(field, term, baseScore) {
  if (field === term) return baseScore;
  if (field.startsWith(term)) return baseScore + 100 + (field.length - term.length) / 100;
  const matchIndex = field.indexOf(term);
  return matchIndex === -1
    ? Number.POSITIVE_INFINITY
    : baseScore + 300 + matchIndex * 10 + (field.length - term.length) / 100;
}

function getSearchTermScore(searchData, term) {
  const headwordScore = Math.min(
    ...searchData.headwordFields.map((field) => getSearchFieldScore(field, term, 0))
  );
  const readingScore = Math.min(
    ...searchData.readingFields.map((field) => getSearchFieldScore(field, term, 5))
  );
  const tokenScore = Math.min(
    ...searchData.tokens.map((field) => getSearchFieldScore(field, term, 20))
  );
  const secondaryScore = Math.min(
    ...searchData.secondaryFields.map((field) => getSearchFieldScore(field, term, 40))
  );
  return Math.min(headwordScore, readingScore, tokenScore, secondaryScore);
}

function getSearchScore(word) {
  if (!state.searchTerms.length) return 0;
  getAllWords();

  const cacheKey = state.searchTerms.join("\u0000");
  if (cacheKey !== searchScoreCacheKey) {
    searchScoreCacheKey = cacheKey;
    searchScoreCache = new Map();
  }
  if (searchScoreCache.has(word.id)) return searchScoreCache.get(word.id);

  const searchData = wordSearchDataCache.get(word.id);
  const termScores = state.searchTerms.map((term) => getSearchTermScore(searchData, term));
  const score = termScores.every(Number.isFinite)
    ? Math.max(...termScores) * 1000 + termScores.reduce((sum, termScore) => sum + termScore, 0)
    : Number.POSITIVE_INFINITY;
  searchScoreCache.set(word.id, score);
  return score;
}

function matchesSearch(word) {
  return Number.isFinite(getSearchScore(word));
}

function matchesStudyFilters(word) {
  if (!matchesSearch(word)) return false;
  if (state.category !== "all" && !getWordCategories(word).includes(state.category)) return false;
  if (state.filter === "learning") return !isKnown(word.id);
  if (state.filter === "hard") return isHard(word.id);
  if (state.filter === "known") return isKnown(word.id);
  return true;
}

function getPickerWords() {
  const words = getAllWords().filter(matchesStudyFilters);
  if (!state.searchTerms.length) return words;

  return words
    .map((word, originalIndex) => ({ word, originalIndex, score: getSearchScore(word) }))
    .sort((a, b) => a.score - b.score || a.originalIndex - b.originalIndex)
    .map(({ word }) => word);
}

function getSelectedWords() {
  const selected = new Set(state.selectedIds);
  return getAllWords().filter((word) => selected.has(word.id));
}

function getDeck() {
  const filtered = state.selectedOnly ? getSelectedWords() : getPickerWords();
  const amount = Number.parseInt(state.limit, 10);
  return !state.selectedOnly && Number.isFinite(amount) && amount > 0 ? filtered.slice(0, amount) : filtered;
}

function clampCardIndex(deck) {
  if (!deck.length) {
    state.cardIndex = 0;
    return;
  }
  if (state.cardIndex < 0) state.cardIndex = deck.length - 1;
  if (state.cardIndex >= deck.length) state.cardIndex = 0;
}

function getCurrentWord() {
  const deck = getDeck();
  clampCardIndex(deck);
  return deck[state.cardIndex] || null;
}

function markStudied(id) {
  if (!state.study.daily[todayKey]) state.study.daily[todayKey] = [];
  state.study.daily[todayKey] = unique([...state.study.daily[todayKey], id]);
}

function renderCategoryFilter() {
  const select = $("#categoryFilter");
  const categories = getOrderedCategories();

  select.textContent = "";
  select.add(new Option("전체 묶음", "all"));
  GENERAL_CATEGORIES.filter((category) => categories.includes(category)).forEach((category) => {
    select.add(new Option(category, category));
  });
  ADJECTIVE_CATEGORY_GROUPS.forEach((group) => {
    const groupCategories = group.categories.filter((category) => categories.includes(category));
    if (!groupCategories.length) return;

    const optionGroup = document.createElement("optgroup");
    optionGroup.label = group.title;
    groupCategories.forEach((category) => optionGroup.append(new Option(category, category)));
    select.append(optionGroup);
  });
  TRAILING_CATEGORIES.filter((category) => categories.includes(category)).forEach((category) => {
    select.add(new Option(category, category));
  });

  if (state.category !== "all" && !categories.includes(state.category)) {
    state.category = "all";
  }
  select.value = state.category;
}

function renderStats() {
  const words = getAllWords();
  $("#totalWords").textContent = words.length;
  $("#knownWords").textContent = state.study.knownIds.filter((id) => getWordById(id)).length;
  $("#hardWords").textContent = state.study.hardIds.filter((id) => getWordById(id)).length;
  $("#todayStudied").textContent = (state.study.daily[todayKey] || []).filter((id) => getWordById(id)).length;
}

function renderCard() {
  const deck = getDeck();
  clampCardIndex(deck);
  const word = deck[state.cardIndex];
  const hasWord = Boolean(word);
  const opposite = getOppositeWord(word);
  const statusLabel = state.selectedOnly ? "선택 단어" : $("#deckFilter").selectedOptions[0]?.textContent || "전체 단어";
  const categoryLabel = state.selectedOnly || state.category === "all" ? "" : ` · ${state.category}`;

  $("#deckLabel").textContent = `${statusLabel}${categoryLabel}`;
  $("#cardCount").textContent = hasWord ? `${state.cardIndex + 1} / ${deck.length}` : "0 / 0";
  $("#cardSide").textContent = state.flipped ? "뒷면" : "앞면";
  $("#cardWord").textContent = word?.kanji || "단어 없음";
  $("#cardReading").textContent = word?.hiragana || "필터를 바꿔보세요";
  $("#cardMeaning").textContent = word?.meaning || "";
  $("#cardTag").textContent = opposite
    ? `${word.tag} · 반대: ${opposite.kanji} (${opposite.hiragana}) ${opposite.meaning}`
    : word?.tag || "";

  const card = $("#flashcard");
  card.disabled = !hasWord;
  card.classList.toggle("flipped", state.flipped);
  card.classList.toggle("show-reading", state.showReading);
  card.classList.toggle("known", hasWord && isKnown(word.id));
  card.classList.toggle("hard", hasWord && isHard(word.id));

  const readingToggle = $("#readingToggle");
  readingToggle.textContent = state.showReading ? "히라가나 숨김" : "히라가나 표시";
  readingToggle.setAttribute("aria-pressed", String(state.showReading));
  readingToggle.classList.toggle("active", state.showReading);
  $("#cardLimitInput").disabled = state.selectedOnly;

  const keepFlipped = $("#keepFlipped");
  const flipLockControl = $("#flipLockControl");
  keepFlipped.checked = state.keepFlipped;
  keepFlipped.disabled = !hasWord;
  flipLockControl.classList.toggle("active", state.keepFlipped);
  flipLockControl.classList.toggle("disabled", !hasWord);
  flipLockControl.setAttribute("aria-disabled", String(!hasWord));

  ["prevCard", "hardCard", "knowCard", "nextCard"].forEach((id) => {
    $(`#${id}`).disabled = !hasWord;
  });
}

function renderMiniWordButton(word, extraClass = "", selectionCategory = word.tag || "", selectionColumn = "") {
  return `
    <button class="mini-word-button ${extraClass} ${isSelected(word.id) ? "selected" : ""}" type="button" data-select-id="${word.id}" data-selection-category="${escapeHtml(selectionCategory)}" data-selection-column="${escapeHtml(selectionColumn)}" aria-pressed="${isSelected(word.id)}">
      <strong lang="ja">${escapeHtml(word.kanji)}</strong>
      <span lang="ja">${escapeHtml(word.hiragana)}</span>
      <em>${escapeHtml(word.meaning)}</em>
      ${word.verbGroup ? `<small class="verb-group-badge">${word.verbGroup}그룹</small>` : ""}
    </button>
  `;
}

function renderSearchResults(words) {
  return `
    <section class="mini-word-section search-results-section" aria-label="검색 결과">
      <div class="mini-group-head">
        <label class="category-select">
          <input type="checkbox" data-category-select="${SEARCH_RESULTS_SCOPE}" aria-label="검색 결과 전체 선택" />
          <h3>검색 결과</h3>
        </label>
        <span class="mini-group-count">${words.length}개</span>
      </div>
      <div class="mini-word-grid">
        ${words.map((word) => renderMiniWordButton(word, "search-result-word", SEARCH_RESULTS_SCOPE)).join("")}
      </div>
    </section>
  `;
}

function renderVerbLayouts(words, renderButton) {
  const wordsById = new Map(words.map((word) => [word.id, word]));
  const renderCell = (column, rowIndex) => {
    const wordId = VERB_COLUMN_WORD_IDS[column][rowIndex];
    if (!wordId) return '<div class="verb-word-placeholder" aria-hidden="true"></div>';
    const word = wordsById.get(wordId);
    return word ? renderButton(word, column) : '<div class="verb-word-placeholder" aria-hidden="true"></div>';
  };

  return VERB_LAYOUTS.map(
    (layout) => {
      const rowCount = Math.max(...layout.columns.map((column) => VERB_COLUMN_WORD_IDS[column].length));
      const cells = Array.from({ length: rowCount }, (_, rowIndex) =>
        layout.columns.map((column) => renderCell(column, rowIndex)).join("")
      ).join("");
      const columnLabels = (layout.columnLabels || [])
        .map((label) => `<div class="verb-column-label">${escapeHtml(label)}</div>`)
        .join("");
      return `
        <section class="verb-list-block" aria-label="${escapeHtml(layout.title)}">
          <h4>${escapeHtml(layout.title)}</h4>
          <div class="${layout.className}">${columnLabels}${cells}</div>
        </section>
      `;
    }
  ).join("");
}

function renderVerbWordGrid(words, category) {
  return renderVerbLayouts(words, (word, column) => renderMiniWordButton(word, "verb-word", category, column));
}

function getVerbSelectionWords(words, selectionColumn) {
  const wordsById = new Map(words.map((word) => [word.id, word]));
  const columnGroup = PHOTO_VERB_COLUMN_GROUPS.find(({ columns }) => columns.includes(selectionColumn));
  const orderedIds = columnGroup
    ? PHOTO_VERB_ROW_ORDERS.get(columnGroup.scope)
    : VERB_COLUMN_WORD_IDS[selectionColumn];
  return orderedIds.map((wordId) => wordsById.get(wordId)).filter(Boolean);
}

function getVerbSelectionScope(selectionColumn) {
  return PHOTO_VERB_COLUMN_GROUPS.find(({ columns }) => columns.includes(selectionColumn))?.scope || selectionColumn;
}

function renderOppositeWordGrid(words, category) {
  const visibleIds = new Set(words.map((word) => word.id));
  const renderedIds = new Set();
  const pairItems = words
    .map((word, originalIndex) => {
      if (renderedIds.has(word.id)) return "";

      const opposite = getOppositeWord(word);
      if (opposite && visibleIds.has(opposite.id)) {
        renderedIds.add(word.id);
        renderedIds.add(opposite.id);

        const pair = { left: word, right: opposite };
        return {
          order: getOppositePairOrder(pair),
          html: `
            <div class="opposite-pair">
              ${renderMiniWordButton(word, "opposite-word", category)}
              <span class="opposite-arrow" aria-label="반대">⇔</span>
              ${renderMiniWordButton(opposite, "opposite-word", category)}
            </div>
          `
        };
      }

      renderedIds.add(word.id);
      return {
        order: Number.MAX_SAFE_INTEGER - words.length + originalIndex,
        html: renderMiniWordButton(word, "", category)
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.order - b.order)
    .map((item) => item.html);
  const columnBreak = getOppositeColumnBreak(category, pairItems.length);
  const columns = [pairItems.slice(0, columnBreak), pairItems.slice(columnBreak)];

  return `
    <div class="opposite-pair-grid">
      ${columns.map((items) => `<div class="opposite-pair-column">${items.join("")}</div>`).join("")}
    </div>
  `;
}

function renderWordbookCategory(category, words) {
  const groupWords = words.filter((word) => getWordCategories(word).includes(category));
  if (!groupWords.length) return "";

  return `
    <section class="mini-word-section" aria-label="${escapeHtml(category)}">
      <div class="mini-group-head">
        <label class="category-select">
          <input type="checkbox" data-category-select="${escapeHtml(category)}" aria-label="${escapeHtml(category)} 전체 선택" />
          <h3>${escapeHtml(category)}</h3>
        </label>
        <span class="mini-group-count">${groupWords.length}개</span>
      </div>
      ${
        category === "동사"
          ? renderVerbWordGrid(groupWords, category)
          : category.includes("반대어")
          ? renderOppositeWordGrid(groupWords, category)
          : `<div class="mini-word-grid">${groupWords.map((word) => renderMiniWordButton(word, "", category)).join("")}</div>`
      }
    </section>
  `;
}

function renderAdjectiveGroup(group, words) {
  const visibleCategories = group.categories.filter((category) =>
    words.some((word) => getWordCategories(word).includes(category))
  );
  if (!visibleCategories.length) return "";

  const groupWordCount = new Set(
    words.filter((word) => visibleCategories.some((category) => getWordCategories(word).includes(category))).map((word) => word.id)
  ).size;

  return `
    <section class="adjective-word-group" aria-label="${escapeHtml(group.title)}">
      <div class="adjective-group-head">
        <div>
          <span>ADJECTIVE</span>
          <h2><b lang="ja">${escapeHtml(group.japaneseTitle)}</b><em>${escapeHtml(group.title)}</em></h2>
        </div>
        <strong>${groupWordCount}개</strong>
      </div>
      <div class="adjective-subgroups">
        ${visibleCategories.map((category) => renderWordbookCategory(category, words)).join("")}
      </div>
    </section>
  `;
}

function renderMiniWordbook() {
  const words = getPickerWords();
  const selectedCount = state.selectedIds.length;

  $("#selectionCount").textContent = state.selectedOnly && selectedCount ? `${selectedCount}개 학습 중` : `${selectedCount}개 선택`;
  $("#studySelected").disabled = selectedCount === 0;
  $("#studySelected").classList.toggle("active", state.selectedOnly);
  $("#studyAll").disabled = !state.selectedOnly;
  $("#clearSelection").disabled = selectedCount === 0;

  if (!words.length) {
    $("#miniWordbook").innerHTML = `
      <div class="empty-state">
        조건에 맞는 단어가 없습니다.
      </div>
    `;
    return;
  }

  $("#miniWordbook").innerHTML = state.searchTerms.length
    ? renderSearchResults(words)
    : [
        ...GENERAL_CATEGORIES.map((category) => renderWordbookCategory(category, words)),
        ...ADJECTIVE_CATEGORY_GROUPS.map((group) => renderAdjectiveGroup(group, words)),
        ...TRAILING_CATEGORIES.map((category) => renderWordbookCategory(category, words))
      ].join("");

  $$("[data-category-select]").forEach((checkbox) => {
    const category = checkbox.dataset.categorySelect;
    const groupWords = category === SEARCH_RESULTS_SCOPE
      ? words
      : words.filter((word) => getWordCategories(word).includes(category));
    const selectedCount = groupWords.filter((word) => isSelected(word.id)).length;

    checkbox.checked = selectedCount > 0 && selectedCount === groupWords.length;
    checkbox.indeterminate = selectedCount > 0 && selectedCount < groupWords.length;
  });
}

function renderWordList() {
  const deck = getDeck();
  $("#listCount").textContent = `${deck.length}개`;
  $("#wordbookLaunchCount").textContent = `${deck.length}개`;
  $("#oppositeLaunchCount").textContent = `${getOppositePairs().length}쌍`;
  $("#kanjiLaunchCount").textContent = `${getKanjiStudyWords().length}개`;
}

function createReviewResult(word, userAnswer, correct, type) {
  return {
    wordId: word.id,
    kanji: word.kanji,
    hiragana: word.hiragana,
    meaning: word.meaning,
    prompt: getPracticePrompt(word),
    answers: Array.isArray(word.answers) ? [...word.answers] : [],
    tag: word.tag || "기타",
    userAnswer,
    correct,
    type
  };
}

function createOppositeReviewResult(question, selectedWord, correct) {
  return {
    wordId: question.promptWord.id,
    kanji: question.promptWord.kanji,
    hiragana: question.promptWord.hiragana,
    meaning: question.promptWord.meaning,
    prompt: `${formatOppositeWord(question.promptWord)}의 반대말`,
    expected: formatOppositeWord(question.answer),
    userAnswer: formatOppositeWord(selectedWord),
    correct,
    type: "opposite"
  };
}

function createKanjiReadingReviewResult(word, userAnswer, correct) {
  return {
    ...createReviewResult(word, userAnswer, correct, "kanji-reading"),
    prompt: `${word.kanji} 읽기`,
    expected: formatKanjiReadingAnswers(word)
  };
}

function createReviewSession(title, score, total, results) {
  return {
    title,
    score,
    total,
    results: [...results]
  };
}

function renderReviewResult(result) {
  const status = result.correct ? "정답" : "오답";
  if (result.type === "kanjiWriting") {
    return `
      <article class="review-row kanji-writing-review-row ${result.correct ? "correct" : "wrong"}">
        <span class="review-badge">${status}</span>
        <div class="kanji-writing-comparison review-comparison">
          <section class="kanji-comparison-side">
            <span>내가 쓴 답</span>
            <img src="${escapeHtml(result.drawingDataUrl)}" alt="${escapeHtml(result.hiragana)} 필기 제출 답안" />
          </section>
          <section class="kanji-comparison-side answer">
            <span>정답</span>
            <strong lang="ja">${escapeHtml(result.kanji)}</strong>
            <small lang="ja">${escapeHtml(result.hiragana)}</small>
          </section>
        </div>
      </article>
    `;
  }
  const prompt = result.prompt || result.meaning;
  const expected = result.expected || (result.type === "writing" ? formatAcceptedAnswers(result) : prompt);

  return `
    <article class="review-row ${result.correct ? "correct" : "wrong"}">
      <div class="review-word">
        <strong lang="ja">${escapeHtml(result.kanji)}</strong>
        <span lang="ja">${escapeHtml(result.hiragana)}</span>
        <em>${escapeHtml(result.meaning)}</em>
      </div>
      <div class="review-answer">
        <span class="review-badge">${status}</span>
        <span>문제: ${escapeHtml(prompt)}</span>
        <span>내 답: ${escapeHtml(result.userAnswer || "빈 답")}</span>
        <span>정답: ${escapeHtml(expected)}</span>
      </div>
    </article>
  `;
}

function renderReviewSession(session) {
  const wrongCount = session.results.filter((result) => !result.correct).length;

  return `
    <section class="review-session">
      <div class="review-session-head">
        <h3>${escapeHtml(session.title)}</h3>
        <span>${session.score} / ${session.total} · 오답 ${wrongCount}</span>
      </div>
      <div class="review-items">
        ${session.results.map(renderReviewResult).join("")}
      </div>
    </section>
  `;
}

function renderReviewNote() {
  const sessions = [
    state.review.quiz,
    state.review.writing,
    state.review.opposite,
    state.review.kanjiReading,
    state.review.kanjiWriting
  ].filter(Boolean);

  if (!sessions.length) {
    $("#reviewSummary").textContent = "결과 없음";
    $("#reviewList").innerHTML = `
      <div class="empty-state">
        퀴즈, 쓰기, 반의어, 한자 읽기 또는 한자 쓰기를 끝내면 결과가 여기에 표시됩니다.
      </div>
    `;
    return;
  }

  const total = sessions.reduce((sum, session) => sum + session.total, 0);
  const score = sessions.reduce((sum, session) => sum + session.score, 0);
  const wrong = sessions.reduce(
    (sum, session) => sum + session.results.filter((result) => !result.correct).length,
    0
  );

  $("#reviewSummary").textContent = `${score} / ${total} · 오답 ${wrong}`;
  $("#reviewList").innerHTML = sessions.map(renderReviewSession).join("");
}

function getRetryReviewSession(kind) {
  return {
    quiz: state.review.quiz,
    writing: state.review.writing,
    opposite: state.review.opposite,
    kanjiReading: state.review.kanjiReading
  }[kind];
}

function buildRetryQuestion(result, kind) {
  const word = getWordById(result.wordId);
  if (!word) return null;

  if (kind === "quiz") {
    const correctChoice = getPracticePrompt(word);
    const distractors = shuffle(getAllWords().filter((candidate) => candidate.id !== word.id))
      .map(getPracticePrompt)
      .filter((choice, index, choices) => choice !== correctChoice && choices.indexOf(choice) === index)
      .slice(0, 3);
    return { kind, word, choices: shuffle([correctChoice, ...distractors]), correctValue: correctChoice };
  }

  if (kind === "opposite") {
    const answer = getOppositeWord(word);
    if (!answer) return null;
    const distractors = shuffle(getAllOppositeWords().filter((candidate) => candidate.id !== word.id && candidate.id !== answer.id))
      .filter((candidate, index, choices) => choices.findIndex((item) => item.id === candidate.id) === index)
      .slice(0, 3);
    return { kind, word, answer, choices: shuffle([answer, ...distractors]), correctValue: answer.id };
  }

  if (kind === "kanjiReading") {
    return { kind, word, answers: getKanjiReadingAnswers(word), expected: formatKanjiReadingAnswers(word) };
  }

  return { kind: "writing", word, answers: getAcceptedAnswers(word), expected: formatAcceptedAnswers(word) };
}

function startRetryRound(kind, sourceResults) {
  state.retry.kind = kind;
  state.retry.questions = shuffle(sourceResults)
    .map((result) => buildRetryQuestion(result, kind))
    .filter(Boolean);
  state.retry.index = 0;
  state.retry.results = [];
  state.retry.answered = false;
  state.retry.selectedChoiceIndex = null;
  renderRetryQuestion();
}

function openRetryModal(kind) {
  const session = getRetryReviewSession(kind);
  if (!session) return;
  state.retry.title = `${session.title} 오답 다시 풀기`;
  $("#retryDialogTitle").textContent = state.retry.title;
  $("#retryModal").hidden = false;
  startRetryRound(kind, session.results.filter((result) => !result.correct));
  $("#closeRetry").focus();
}

function closeRetryModal() {
  const modal = $("#retryModal");
  if (modal.hidden) return;
  modal.hidden = true;
}

function renderRetryChoice(choice, index, kind) {
  if (kind === "opposite") {
    return `
      <button class="retry-choice-button" type="button" data-retry-choice-index="${index}">
        <kbd>${index + 1}</kbd>
        <strong lang="ja">${escapeHtml(choice.kanji)}</strong>
        <span lang="ja">${escapeHtml(choice.hiragana)}</span>
        ${state.oppositeShowKorean ? `<em>${escapeHtml(choice.meaning)}</em>` : ""}
      </button>
    `;
  }

  return `
    <button class="retry-choice-button" type="button" data-retry-choice-index="${index}">
      <kbd>${index + 1}</kbd>
      <strong>${escapeHtml(choice)}</strong>
    </button>
  `;
}

function renderRetryQuestion() {
  const retry = state.retry;
  const question = retry.questions[retry.index];
  const choiceGrid = $("#retryChoiceGrid");
  const textForm = $("#retryTextForm");
  const textInput = $("#retryTextInput");
  const textSubmit = $("#retryTextSubmit");
  $("#retryResults").hidden = true;
  $("#retryActions").hidden = true;
  $("#retryFeedback").textContent = "";
  $("#retryFeedback").className = "helper-text";
  $("#retryNext").hidden = true;

  if (!question) {
    renderRetryResults();
    return;
  }

  $("#retryProgress").textContent = `${retry.index + 1} / ${retry.questions.length}`;
  choiceGrid.innerHTML = "";
  textForm.hidden = true;
  textInput.disabled = false;
  textSubmit.disabled = false;
  textSubmit.textContent = "확인";

  if (question.kind === "quiz") {
    $("#retryPromptLabel").textContent = "뜻을 고르세요.";
    $("#retryPrompt").innerHTML = `
      <strong lang="ja">${escapeHtml(question.word.kanji)}</strong>
      <span lang="ja">${escapeHtml(question.word.hiragana)}</span>
    `;
    choiceGrid.innerHTML = question.choices
      .map((choice, index) => renderRetryChoice(choice, index, question.kind))
      .join("");
    return;
  }

  if (question.kind === "opposite") {
    $("#retryPromptLabel").textContent = "반대말을 고르세요.";
    $("#retryPrompt").innerHTML = `
      <strong lang="ja">${escapeHtml(question.word.kanji)}</strong>
      <span lang="ja">${escapeHtml(question.word.hiragana)}</span>
      ${state.oppositeShowKorean ? `<em>${escapeHtml(question.word.meaning)}</em>` : ""}
    `;
    choiceGrid.innerHTML = question.choices
      .map((choice, index) => renderRetryChoice(choice, index, question.kind))
      .join("");
    return;
  }

  textForm.hidden = false;
  textInput.value = "";
  textInput.placeholder = question.kind === "kanjiReading" ? "히라가나 입력" : "일본어 입력";
  if (question.kind === "kanjiReading") {
    $("#retryPromptLabel").textContent = "한자의 읽는 법을 입력하세요.";
    $("#retryPrompt").innerHTML = `
      <strong lang="ja">${escapeHtml(question.word.kanji)}</strong>
      ${state.kanjiShowKorean ? `<em>${escapeHtml(question.word.meaning)}</em>` : ""}
    `;
  } else {
    $("#retryPromptLabel").textContent = "일본어로 쓰세요.";
    $("#retryPrompt").innerHTML = `<strong>${escapeHtml(getPracticePrompt(question.word))}</strong>`;
  }
  window.setTimeout(() => textInput.focus(), 0);
}

function createRetryResult(question, userAnswer, correct) {
  const prompt =
    question.kind === "opposite"
      ? `${formatOppositeWord(question.word)}의 반대말`
      : question.kind === "kanjiReading"
        ? `${question.word.kanji} 읽기`
        : question.kind === "writing"
          ? getPracticePrompt(question.word)
          : `${question.word.kanji} (${question.word.hiragana})`;
  const expected =
    question.kind === "opposite"
      ? formatOppositeWord(question.answer)
      : question.kind === "quiz"
        ? question.correctValue
        : question.expected;

  return {
    wordId: question.word.id,
    kanji: question.word.kanji,
    hiragana: question.word.hiragana,
    meaning: question.word.meaning,
    prompt,
    expected,
    userAnswer,
    correct,
    type: `retry-${question.kind}`
  };
}

function storeRetryResult(result) {
  state.retry.results.push(result);
  state.retry.answered = true;
}

function advanceRetryQuestion() {
  if (!state.retry.answered) return;
  state.retry.index += 1;
  state.retry.answered = false;
  state.retry.selectedChoiceIndex = null;
  renderRetryQuestion();
}

function answerRetryChoice(choiceIndex) {
  const question = state.retry.questions[state.retry.index];
  if (!question || !Array.isArray(question.choices) || state.retry.answered) return;
  const choice = question.choices[choiceIndex];
  if (choice === undefined) return;
  const value = question.kind === "opposite" ? choice.id : choice;
  const label = question.kind === "opposite" ? formatOppositeWord(choice) : choice;
  const result = createRetryResult(question, label, value === question.correctValue);
  state.retry.selectedChoiceIndex = choiceIndex;
  storeRetryResult(result);

  $$(".retry-choice-button").forEach((button) => {
    const index = Number(button.dataset.retryChoiceIndex);
    const candidate = question.choices[index];
    const candidateValue = question.kind === "opposite" ? candidate.id : candidate;
    button.classList.toggle("correct", candidateValue === question.correctValue);
    button.classList.toggle("wrong", index === choiceIndex && !result.correct);
    button.disabled = true;
  });
  $("#retryFeedback").textContent = formatAnswerFeedback(result.correct, result.expected);
  $("#retryFeedback").className = `helper-text ${result.correct ? "correct" : "wrong"}`;
  $("#retryNext").hidden = false;
  $("#retryNext").focus();
}

function answerRetryText(event) {
  event.preventDefault();
  const question = state.retry.questions[state.retry.index];
  if (!question || !Array.isArray(question.answers)) return;
  if (state.retry.answered) {
    advanceRetryQuestion();
    return;
  }
  const input = $("#retryTextInput");
  const submitButton = $("#retryTextSubmit");
  const userAnswer = input.value.trim();
  const typed = normalizeAnswer(userAnswer);
  if (!typed) {
    $("#retryFeedback").textContent = "답을 입력하세요.";
    input.focus();
    return;
  }
  const correct = question.answers.map(normalizeAnswer).includes(typed);
  const result = createRetryResult(question, userAnswer, correct);
  storeRetryResult(result);
  input.disabled = true;
  $("#retryFeedback").textContent = formatAnswerFeedback(correct, result.expected);
  $("#retryFeedback").className = `helper-text ${correct ? "correct" : "wrong"}`;
  submitButton.textContent = "다음";
  submitButton.focus();
}

function renderRetryResults() {
  const retry = state.retry;
  const total = retry.results.length;
  const score = retry.results.filter((result) => result.correct).length;
  const wrongResults = retry.results.filter((result) => !result.correct);
  $("#retryProgress").textContent = total ? `${total} / ${total}` : "0 / 0";
  $("#retryPromptLabel").textContent = "";
  $("#retryPrompt").innerHTML = `
    <div class="retry-complete">
      <strong>${total ? `${total}문제 중 ${score}개 정답` : "다시 풀 오답이 없습니다."}</strong>
      <span>${total ? "이번 재시험 결과입니다." : "모든 문제를 맞혔습니다."}</span>
    </div>
  `;
  $("#retryChoiceGrid").innerHTML = "";
  $("#retryTextForm").hidden = true;
  $("#retryFeedback").textContent = "";
  $("#retryFeedback").className = "helper-text";
  $("#retryNext").hidden = true;
  $("#retryResults").hidden = total === 0;
  $("#retryResults").innerHTML = retry.results.map(renderReviewResult).join("");
  $("#retryActions").hidden = false;
  $("#retryAgain").hidden = wrongResults.length === 0;
  $("#retryAgain").textContent = `이번 오답 ${wrongResults.length}개 다시`;
}

function retryWrongAgain() {
  const wrongResults = state.retry.results.filter((result) => !result.correct);
  if (!wrongResults.length) return;
  startRetryRound(state.retry.kind, wrongResults);
}

function handleRetryKeyboard(event) {
  if ($("#retryModal").hidden) return false;
  const question = state.retry.questions[state.retry.index];
  const activeTag = document.activeElement?.tagName?.toLowerCase();
  if (activeTag === "input") return true;
  if (!state.retry.answered && question?.choices && /^[1-4]$/.test(event.key)) {
    event.preventDefault();
    $(`[data-retry-choice-index="${Number(event.key) - 1}"]`)?.click();
    return true;
  }
  if (state.retry.answered && question?.choices && event.key === "Enter") {
    event.preventDefault();
    advanceRetryQuestion();
  }
  return true;
}

function renderAll() {
  renderCard();
  renderStats();
  renderMiniWordbook();
  renderWordList();
  renderReviewNote();
}

function moveCard(direction) {
  const deck = getDeck();
  if (!deck.length) return;

  state.cardIndex = (state.cardIndex + direction + deck.length) % deck.length;
  state.flipped = state.keepFlipped;
  renderCard();
}

function flipCard() {
  if (!getCurrentWord()) return;
  state.flipped = !state.flipped;
  if (!state.flipped && state.keepFlipped) {
    state.keepFlipped = false;
    saveSettings();
  }
  renderCard();
}

function setKeepFlipped(enabled) {
  state.keepFlipped = enabled;
  state.flipped = enabled;
  saveSettings();
  renderCard();
}

function advanceAfterMark(previousIndex) {
  const deck = getDeck();
  if (!deck.length) {
    state.cardIndex = 0;
  } else if (state.selectedOnly || state.filter === "all") {
    state.cardIndex = (previousIndex + 1) % deck.length;
  } else {
    state.cardIndex = Math.min(previousIndex, deck.length - 1);
  }
  state.flipped = state.keepFlipped;
  renderAll();
}

function markKnown(id = getCurrentWord()?.id) {
  if (!id) return;
  const previousIndex = state.cardIndex;
  state.study.knownIds = unique([...state.study.knownIds, id]);
  state.study.hardIds = state.study.hardIds.filter((wordId) => wordId !== id);
  markStudied(id);
  saveStudy();
  advanceAfterMark(previousIndex);
}

function markHard(id = getCurrentWord()?.id) {
  if (!id) return;
  const previousIndex = state.cardIndex;
  state.study.hardIds = unique([...state.study.hardIds, id]);
  state.study.knownIds = state.study.knownIds.filter((wordId) => wordId !== id);
  markStudied(id);
  saveStudy();
  advanceAfterMark(previousIndex);
}

function toggleKnown(id) {
  if (isKnown(id)) {
    state.study.knownIds = state.study.knownIds.filter((wordId) => wordId !== id);
  } else {
    state.study.knownIds = unique([...state.study.knownIds, id]);
    state.study.hardIds = state.study.hardIds.filter((wordId) => wordId !== id);
    markStudied(id);
  }
  saveStudy();
  renderAll();
}

function toggleHard(id) {
  if (isHard(id)) {
    state.study.hardIds = state.study.hardIds.filter((wordId) => wordId !== id);
  } else {
    state.study.hardIds = unique([...state.study.hardIds, id]);
    state.study.knownIds = state.study.knownIds.filter((wordId) => wordId !== id);
    markStudied(id);
  }
  saveStudy();
  renderAll();
}

function focusWord(id) {
  const deck = getDeck();
  const index = deck.findIndex((word) => word.id === id);
  if (index === -1) return;

  state.cardIndex = index;
  state.flipped = state.keepFlipped;
  window.scrollTo({ top: 0, behavior: "smooth" });
  renderCard();
}

function selectWord(id, extendRange = false, selectionCategory = null, selectionColumn = "") {
  let words = selectionCategory && selectionCategory !== SEARCH_RESULTS_SCOPE
    ? getPickerWords().filter((word) => getWordCategories(word).includes(selectionCategory))
    : getPickerWords();
  if (selectionCategory === "동사" && selectionColumn && VERB_COLUMN_WORD_IDS[selectionColumn]) {
    words = getVerbSelectionWords(words, selectionColumn);
  }
  const selectionScope = selectionCategory === "동사" ? getVerbSelectionScope(selectionColumn) : selectionColumn;
  const selectionGroup = `${selectionCategory || "all"}:${selectionScope}`;
  const currentIndex = words.findIndex((word) => word.id === id);
  const lastIndex = words.findIndex((word) => word.id === state.lastSelectedId);
  const canExtendRange =
    extendRange &&
    Boolean(selectionCategory) &&
    state.lastSelectedCategory === selectionGroup &&
    currentIndex !== -1 &&
    lastIndex !== -1;

  if (canExtendRange) {
    const start = Math.min(currentIndex, lastIndex);
    const end = Math.max(currentIndex, lastIndex);
    const rangeIds = words.slice(start, end + 1).map((word) => word.id);
    state.selectedIds = unique([...state.selectedIds, ...rangeIds]);
  } else if (isSelected(id)) {
    state.selectedIds = state.selectedIds.filter((wordId) => wordId !== id);
  } else {
    state.selectedIds = unique([...state.selectedIds, id]);
  }

  state.lastSelectedId = id;
  state.lastSelectedCategory = selectionGroup;
  state.selectedOnly = state.selectedIds.length > 0;
  syncPracticeQuestionCountsToSelection();
  saveSettings();
  renderAll();
  buildQuiz();
  buildWritingQuiz();
  buildOppositeLearning();
}

function selectCategory(category) {
  const words = category === SEARCH_RESULTS_SCOPE
    ? getPickerWords()
    : getPickerWords().filter((word) => getWordCategories(word).includes(category));
  if (!words.length) return;

  const categoryIds = words.map((word) => word.id);
  const categoryIdSet = new Set(categoryIds);
  const allSelected = categoryIds.every((id) => isSelected(id));

  state.selectedIds = allSelected
    ? state.selectedIds.filter((id) => !categoryIdSet.has(id))
    : unique([...state.selectedIds, ...categoryIds]);
  state.lastSelectedId = allSelected ? null : categoryIds[categoryIds.length - 1];
  state.lastSelectedCategory = allSelected ? null : category;
  state.selectedOnly = state.selectedIds.length > 0;
  syncPracticeQuestionCountsToSelection();
  saveSettings();
  renderAll();
  buildQuiz();
  buildWritingQuiz();
  buildOppositeLearning();
}

function studySelectedWords() {
  if (!state.selectedIds.length) return;
  state.selectedOnly = true;
  state.cardIndex = 0;
  state.flipped = state.keepFlipped;
  syncPracticeQuestionCountsToSelection();
  saveSettings();
  renderAll();
  buildQuiz();
  buildWritingQuiz();
  buildOppositeLearning();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function studyAllWords() {
  state.selectedOnly = false;
  state.cardIndex = 0;
  state.flipped = state.keepFlipped;
  syncPracticeQuestionCountsToSelection();
  saveSettings();
  renderAll();
  buildQuiz();
  buildWritingQuiz();
  buildOppositeLearning();
}

function clearSelection() {
  state.selectedIds = [];
  state.selectedOnly = false;
  state.lastSelectedId = null;
  state.lastSelectedCategory = null;
  syncPracticeQuestionCountsToSelection();
  saveSettings();
  renderAll();
  buildQuiz();
  buildWritingQuiz();
  buildOppositeLearning();
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function buildQuestionWords(deck, count) {
  if (!deck.length) return [];

  const questions = [];
  while (questions.length < count) {
    const remaining = count - questions.length;
    questions.push(...shuffle(deck).slice(0, remaining));
  }

  return questions;
}

function getOppositePairGroup(pair) {
  const categories = [...getWordCategories(pair.left), ...getWordCategories(pair.right)];
  return categories.includes("な 형용사 반대어") ? "な 형용사 반대어" : "い 형용사 반대어";
}

function getOppositeColumnBreak(group, itemCount) {
  const layout = OPPOSITE_COLUMN_LAYOUTS[group];
  return layout && itemCount === layout.total ? layout.firstColumn : Math.ceil(itemCount / 2);
}

function renderOppositePairOption(pair, selectedPairKeys) {
  const key = getOppositePairKey(pair);
  return `
    <label class="opposite-pair-option">
      <input type="checkbox" data-opposite-pair-key="${escapeHtml(key)}" ${selectedPairKeys.has(key) ? "checked" : ""} />
      <span class="opposite-picker-word">
        <strong lang="ja">${escapeHtml(pair.left.kanji)}</strong>
        <small lang="ja">${escapeHtml(pair.left.hiragana)}</small>
      </span>
      <b aria-label="반대">⇔</b>
      <span class="opposite-picker-word">
        <strong lang="ja">${escapeHtml(pair.right.kanji)}</strong>
        <small lang="ja">${escapeHtml(pair.right.hiragana)}</small>
      </span>
    </label>
  `;
}

function getOppositeRangeLabel() {
  if (Array.isArray(state.oppositePairSelection)) return "직접 선택";
  if (state.selectedOnly) return "단어장 선택";
  if (state.category !== "all") return state.category;
  if (state.filter !== "all" || state.search) return "현재 학습 범위";
  return "전체";
}

function renderOppositePairPicker() {
  const allPairs = getAllOppositePairs();
  const activePairs = getOppositePairs();
  const activePairKeys = new Set(activePairs.map(getOppositePairKey));
  const groups = ["な 형용사 반대어", "い 형용사 반대어"];

  $("#oppositeRangeSummary").textContent = `${getOppositeRangeLabel()} · ${activePairs.length}쌍`;
  $("#oppositePickerCount").textContent = `${activePairs.length}쌍 선택`;
  $("#useWordbookOppositePairs").classList.toggle("active", state.oppositePairSelection === null);

  $("#oppositePairPicker").innerHTML = groups
    .map((group) => {
      const groupPairs = allPairs.filter((pair) => getOppositePairGroup(pair) === group);
      const selectedCount = groupPairs.filter((pair) => activePairKeys.has(getOppositePairKey(pair))).length;
      const columnBreak = getOppositeColumnBreak(group, groupPairs.length);
      const columns = [groupPairs.slice(0, columnBreak), groupPairs.slice(columnBreak)];
      return `
        <section class="opposite-picker-group" aria-label="${escapeHtml(group)}">
          <div class="opposite-picker-group-head">
            <h3>${escapeHtml(group)}</h3>
            <span>${selectedCount} / ${groupPairs.length}</span>
          </div>
          <div class="opposite-pair-picker-grid">
            ${columns
              .map(
                (columnPairs) => `
                  <div class="opposite-picker-column">
                    ${columnPairs.map((pair) => renderOppositePairOption(pair, activePairKeys)).join("")}
                  </div>
                `
              )
              .join("")}
          </div>
        </section>
      `;
    })
    .join("");
}

function setOppositePairSelection(pairKeys) {
  state.oppositePairSelection = pairKeys === null ? null : unique(pairKeys);
  saveSettings();
  renderWordList();
  buildOppositeLearning();
}

function toggleOppositePairSelection(key, checked, extendRange = false) {
  const allPairs = getAllOppositePairs();
  const currentPair = allPairs.find((pair) => getOppositePairKey(pair) === key);
  if (!currentPair) return;

  const currentGroup = getOppositePairGroup(currentPair);
  const selectedPairKeys = new Set(
    Array.isArray(state.oppositePairSelection)
      ? state.oppositePairSelection
      : getOppositePairs().map(getOppositePairKey)
  );

  if (extendRange && state.lastOppositePairGroup === currentGroup && state.lastOppositePairKey) {
    const groupPairKeys = allPairs
      .filter((pair) => getOppositePairGroup(pair) === currentGroup)
      .map(getOppositePairKey);
    const currentIndex = groupPairKeys.indexOf(key);
    const lastIndex = groupPairKeys.indexOf(state.lastOppositePairKey);

    if (currentIndex !== -1 && lastIndex !== -1) {
      const start = Math.min(currentIndex, lastIndex);
      const end = Math.max(currentIndex, lastIndex);
      groupPairKeys.slice(start, end + 1).forEach((pairKey) => {
        if (checked) selectedPairKeys.add(pairKey);
        else selectedPairKeys.delete(pairKey);
      });
    }
  } else if (checked) {
    selectedPairKeys.add(key);
  } else {
    selectedPairKeys.delete(key);
  }

  state.lastOppositePairKey = key;
  state.lastOppositePairGroup = currentGroup;
  setOppositePairSelection([...selectedPairKeys]);
}

function toggleOppositePicker() {
  const picker = $("#oppositePicker");
  picker.hidden = !picker.hidden;
  $("#toggleOppositePicker").textContent = picker.hidden ? "선택" : "닫기";
  $("#toggleOppositePicker").setAttribute("aria-expanded", String(!picker.hidden));
}

function renderOppositeStudyWord(word, showMeaning = true) {
  return `
    <div class="opposite-study-word">
      <strong lang="ja">${escapeHtml(word.kanji)}</strong>
      <span lang="ja">${escapeHtml(word.hiragana)}</span>
      ${showMeaning ? `<em>${escapeHtml(word.meaning)}</em>` : ""}
    </div>
  `;
}

function renderOppositeStudy() {
  const pairs = state.opposite.pairs;
  if (state.opposite.pairIndex >= pairs.length) state.opposite.pairIndex = 0;
  const pair = pairs[state.opposite.pairIndex];
  const scopeText = state.selectedOnly
    ? "선택 단어 기준"
    : state.category === "all"
      ? "전체 반의어"
      : state.category;

  $("#oppositeScopeLabel").textContent = scopeText;
  $("#oppositePairProgress").textContent = pair ? `${state.opposite.pairIndex + 1} / ${pairs.length}` : "0 / 0";
  $("#prevOppositePair").disabled = !pair;
  $("#nextOppositePair").disabled = !pair;
  $("#startOppositeQuiz").disabled = !pair;

  if (!pair) {
    $("#oppositeStudyPair").innerHTML = `
      <div class="empty-state">
        현재 학습 범위에 반의어 쌍이 없습니다.<br />단어장에서 반의어 한쪽을 선택하거나 학습 범위를 바꿔보세요.
      </div>
    `;
    return;
  }

  $("#oppositeStudyPair").innerHTML = `
    ${renderOppositeStudyWord(pair.left)}
    <span class="opposite-study-arrow" aria-label="반대">⇔</span>
    ${renderOppositeStudyWord(pair.right)}
  `;
}

function moveOppositePair(direction) {
  const pairs = state.opposite.pairs;
  if (!pairs.length) return;
  state.opposite.pairIndex = (state.opposite.pairIndex + direction + pairs.length) % pairs.length;
  renderOppositeStudy();
}

function buildOppositeQuiz() {
  const pairs = state.opposite.pairs;
  const questionPairs = buildQuestionWords(pairs, state.oppositeQuestionCount);
  const choicePool = getAllOppositeWords();
  const questions = questionPairs.map((pair) => {
    const reverse = Math.random() < 0.5;
    const promptWord = reverse ? pair.right : pair.left;
    const answer = reverse ? pair.left : pair.right;
    const usedLabels = new Set([formatOppositeWord(answer)]);
    const distractors = [];

    shuffle(choicePool).forEach((candidate) => {
      const label = formatOppositeWord(candidate);
      if (candidate.id === promptWord.id || candidate.id === answer.id || usedLabels.has(label) || distractors.length >= 3) return;
      distractors.push(candidate);
      usedLabels.add(label);
    });

    return {
      promptWord,
      answer,
      choices: shuffle([answer, ...distractors])
    };
  });

  state.opposite.questions = questions;
  state.opposite.index = 0;
  state.opposite.score = 0;
  state.opposite.answered = false;
  state.opposite.selectedChoiceId = null;
  state.opposite.results = [];
  renderOppositeQuiz();
}

function renderOppositeQuizChoice(word, index, showMeaning) {
  return `
    <button class="opposite-choice-button" type="button" data-opposite-choice-index="${index}" data-opposite-choice-id="${word.id}">
      <kbd>${index + 1}</kbd>
      <strong lang="ja">${escapeHtml(word.kanji)}</strong>
      <span lang="ja">${escapeHtml(word.hiragana)}</span>
      ${showMeaning ? `<em>${escapeHtml(word.meaning)}</em>` : ""}
    </button>
  `;
}

function renderOppositeQuiz() {
  const opposite = state.opposite;
  const question = opposite.questions[opposite.index];
  const nextButton = $("#oppositeNext");
  const koreanToggle = $("#oppositeKoreanToggle");
  koreanToggle.textContent = state.oppositeShowKorean ? "한글 ON" : "한글 OFF";
  koreanToggle.setAttribute("aria-pressed", String(state.oppositeShowKorean));
  koreanToggle.classList.toggle("active", state.oppositeShowKorean);
  nextButton.hidden = true;
  nextButton.textContent = "다음 문제";

  if (!question) {
    koreanToggle.disabled = true;
    setQuestionProgress("opposite", "0 / 0");
    $("#oppositeQuestion").innerHTML = `<div class="empty-state">현재 학습 범위에 반의어 쌍이 없습니다.</div>`;
    $("#oppositeChoiceGrid").innerHTML = "";
    $("#oppositeFeedback").textContent = "";
    $("#oppositeFeedback").className = "helper-text";
    return;
  }

  koreanToggle.disabled = false;
  setQuestionProgress("opposite", `${opposite.index + 1} / ${opposite.questions.length}`);
  $("#oppositeQuestion").innerHTML = renderOppositeStudyWord(question.promptWord, state.oppositeShowKorean);
  $("#oppositeChoiceGrid").innerHTML = question.choices
    .map((word, index) => renderOppositeQuizChoice(word, index, state.oppositeShowKorean))
    .join("");

  const selectedWord = question.choices.find((word) => word.id === opposite.selectedChoiceId);
  if (opposite.answered && selectedWord) {
    const correct = selectedWord.id === question.answer.id;
    $$(".opposite-choice-button").forEach((button) => {
      const choiceId = button.dataset.oppositeChoiceId;
      button.classList.toggle("correct", choiceId === question.answer.id);
      button.classList.toggle("wrong", choiceId === selectedWord.id && !correct);
      button.disabled = true;
    });
    $("#oppositeFeedback").textContent = formatAnswerFeedback(correct, formatOppositeWord(question.answer));
    $("#oppositeFeedback").className = `helper-text ${correct ? "correct" : "wrong"}`;
    nextButton.hidden = false;
    nextButton.focus();
    return;
  }

  $("#oppositeFeedback").textContent = `점수 ${opposite.score}`;
  $("#oppositeFeedback").className = "helper-text";
}

function answerOppositeQuiz(choiceIndex) {
  const opposite = state.opposite;
  const question = opposite.questions[opposite.index];
  if (!question || opposite.answered) return;

  const selectedWord = question.choices[choiceIndex];
  if (!selectedWord) return;

  opposite.answered = true;
  opposite.selectedChoiceId = selectedWord.id;
  const correct = selectedWord.id === question.answer.id;
  if (correct) {
    opposite.score += 1;
    markStudied(question.promptWord.id);
    markStudied(question.answer.id);
  }
  opposite.results.push(createOppositeReviewResult(question, selectedWord, correct));

  $$(".opposite-choice-button").forEach((button) => {
    const choiceId = button.dataset.oppositeChoiceId;
    button.classList.toggle("correct", choiceId === question.answer.id);
    button.classList.toggle("wrong", choiceId === selectedWord.id && !correct);
    button.disabled = true;
  });

  const feedback = $("#oppositeFeedback");
  feedback.textContent = formatAnswerFeedback(correct, formatOppositeWord(question.answer));
  feedback.className = `helper-text ${correct ? "correct" : "wrong"}`;
  $("#oppositeNext").hidden = false;
  $("#oppositeNext").focus();
  saveStudy();
}

function advanceOppositeQuiz() {
  const opposite = state.opposite;
  if (!opposite.answered) return;

  opposite.index += 1;
  opposite.answered = false;
  opposite.selectedChoiceId = null;
  if (opposite.index >= opposite.questions.length) {
    setQuestionProgress("opposite", `${opposite.questions.length} / ${opposite.questions.length}`);
    $("#oppositeQuestion").innerHTML = `
      <div class="opposite-complete">
        <button class="completion-summary" type="button" data-retry-kind="opposite">
          완료: ${opposite.questions.length}문제 중 ${opposite.score}개 정답
        </button>
        <span>결과는 아래 오답노트에 저장되었습니다.</span>
      </div>
    `;
    $("#oppositeChoiceGrid").innerHTML = "";
    $("#oppositeFeedback").textContent = "새 문제를 누르면 다시 시작합니다.";
    $("#oppositeFeedback").className = "helper-text";
    $("#oppositeNext").hidden = true;
    $("#oppositeKoreanToggle").disabled = true;
    state.review.opposite = createReviewSession(
      "반의어 퀴즈",
      opposite.score,
      opposite.questions.length,
      opposite.results
    );
    renderReviewNote();
    return;
  }

  renderOppositeQuiz();
}

function toggleOppositeKorean() {
  state.oppositeShowKorean = !state.oppositeShowKorean;
  saveSettings();
  renderOppositeQuiz();
}

function handleOppositeKeyboard(event) {
  if ($("#oppositeModal").hidden) return false;

  const activeTag = document.activeElement?.tagName?.toLowerCase();
  if (["input", "select", "textarea"].includes(activeTag)) return false;
  if (state.opposite.mode !== "quiz") return true;

  if (!state.opposite.answered && /^[1-4]$/.test(event.key)) {
    event.preventDefault();
    const choiceIndex = Number(event.key) - 1;
    $(`[data-opposite-choice-index="${choiceIndex}"]`)?.click();
    return true;
  }

  if (state.opposite.answered && event.key === "Enter") {
    event.preventDefault();
    $("#oppositeNext").click();
    return true;
  }

  return true;
}

function setOppositeMode(mode) {
  state.opposite.mode = mode === "quiz" ? "quiz" : "study";
  const isQuiz = state.opposite.mode === "quiz";

  $("#oppositeStudyPane").hidden = isQuiz;
  $("#oppositeQuizPane").hidden = !isQuiz;
  $("#oppositeStudyTab").classList.toggle("active", !isQuiz);
  $("#oppositeQuizTab").classList.toggle("active", isQuiz);
  $("#oppositeStudyTab").setAttribute("aria-selected", String(!isQuiz));
  $("#oppositeQuizTab").setAttribute("aria-selected", String(isQuiz));

  if (isQuiz) renderOppositeQuiz();
  else renderOppositeStudy();
}

function buildOppositeLearning() {
  state.opposite.pairs = getOppositePairs();
  state.opposite.pairIndex = 0;
  renderOppositePairPicker();
  renderOppositeStudy();
  buildOppositeQuiz();
  setOppositeMode(state.opposite.mode);
}

function renderKanjiMiniWordButton(
  word,
  selectedIds,
  extraClass = "",
  selectionCategory = word.tag || "",
  selectionColumn = ""
) {
  const hasKanji = getKanjiCharacters(word.kanji).length > 0;
  const selected = hasKanji && selectedIds.has(word.id);
  return `
    <button class="mini-word-button ${extraClass} ${selected ? "selected" : ""} ${hasKanji ? "" : "kanji-unavailable"}" type="button" data-kanji-word-id="${word.id}" data-kanji-word-category="${escapeHtml(selectionCategory)}" data-kanji-word-column="${escapeHtml(selectionColumn)}" aria-pressed="${selected}" ${hasKanji ? "" : 'disabled title="교재에서 히라가나로 표기된 단어"'}>
      <strong lang="ja">${escapeHtml(word.kanji)}</strong>
      <span lang="ja">${escapeHtml(word.hiragana)}</span>
      <em>${escapeHtml(word.meaning)}</em>
      ${hasKanji ? "" : '<small class="kanji-script-note">히라가나 표기</small>'}
      ${word.verbGroup ? `<small class="verb-group-badge">${word.verbGroup}그룹</small>` : ""}
    </button>
  `;
}

function renderKanjiVerbWordGrid(words, category, selectedIds) {
  return renderVerbLayouts(words, (word, column) =>
    renderKanjiMiniWordButton(word, selectedIds, "verb-word", category, column)
  );
}

function renderKanjiOppositeWordGrid(words, category, selectedIds) {
  const visibleIds = new Set(words.map((word) => word.id));
  const renderedIds = new Set();
  const pairItems = words
    .map((word, originalIndex) => {
      if (renderedIds.has(word.id)) return "";
      const opposite = getOppositeWord(word);
      if (opposite && visibleIds.has(opposite.id)) {
        renderedIds.add(word.id);
        renderedIds.add(opposite.id);
        const pair = { left: word, right: opposite };
        return {
          order: getOppositePairOrder(pair),
          html: `
            <div class="opposite-pair">
              ${renderKanjiMiniWordButton(word, selectedIds, "opposite-word", category)}
              <span class="opposite-arrow" aria-label="반대">⇔</span>
              ${renderKanjiMiniWordButton(opposite, selectedIds, "opposite-word", category)}
            </div>
          `
        };
      }

      renderedIds.add(word.id);
      return {
        order: Number.MAX_SAFE_INTEGER - words.length + originalIndex,
        html: renderKanjiMiniWordButton(word, selectedIds, "", category)
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.order - b.order)
    .map((item) => item.html);
  const columnBreak = getOppositeColumnBreak(category, pairItems.length);
  const columns = [pairItems.slice(0, columnBreak), pairItems.slice(columnBreak)];

  return `
    <div class="opposite-pair-grid">
      ${columns.map((items) => `<div class="opposite-pair-column">${items.join("")}</div>`).join("")}
    </div>
  `;
}

function renderKanjiWordbookCategory(category, words, selectedIds) {
  const groupWords = words.filter((word) => getWordCategories(word).includes(category));
  if (!groupWords.length) return "";
  return `
    <section class="mini-word-section" aria-label="${escapeHtml(category)}">
      <div class="mini-group-head">
        <label class="category-select">
          <input type="checkbox" data-kanji-category-select="${escapeHtml(category)}" aria-label="${escapeHtml(category)} 전체 선택" />
          <h3>${escapeHtml(category)}</h3>
        </label>
        <span class="mini-group-count">${groupWords.length}개</span>
      </div>
      ${
        category === "동사"
          ? renderKanjiVerbWordGrid(groupWords, category, selectedIds)
          : category.includes("반대어")
            ? renderKanjiOppositeWordGrid(groupWords, category, selectedIds)
            : `<div class="mini-word-grid">${groupWords
                .map((word) => renderKanjiMiniWordButton(word, selectedIds, "", category))
                .join("")}</div>`
      }
    </section>
  `;
}

function renderKanjiAdjectiveGroup(group, words, selectedIds) {
  const visibleCategories = group.categories.filter((category) =>
    words.some((word) => getWordCategories(word).includes(category))
  );
  if (!visibleCategories.length) return "";
  const groupWordCount = new Set(
    words.filter((word) => visibleCategories.some((category) => getWordCategories(word).includes(category))).map((word) => word.id)
  ).size;
  return `
    <section class="adjective-word-group" aria-label="${escapeHtml(group.title)}">
      <div class="adjective-group-head">
        <div>
          <span>ADJECTIVE</span>
          <h2><b lang="ja">${escapeHtml(group.japaneseTitle)}</b><em>${escapeHtml(group.title)}</em></h2>
        </div>
        <strong>${groupWordCount}개</strong>
      </div>
      <div class="adjective-subgroups">
        ${visibleCategories.map((category) => renderKanjiWordbookCategory(category, words, selectedIds)).join("")}
      </div>
    </section>
  `;
}

function renderKanjiWordPicker() {
  const words = getAllWords();
  const kanjiWords = getAllKanjiWords();
  const activeWords = getKanjiStudyWords();
  const selectedIds = new Set(activeWords.map((word) => word.id));
  const isDirectSelection = Array.isArray(state.kanjiWordSelection);

  $("#kanjiRangeSummary").textContent = `${isDirectSelection ? "직접 선택" : "단어장 범위"} · ${activeWords.length}개`;
  $("#kanjiPickerCount").textContent = `${activeWords.length}개 선택`;
  $("#useWordbookKanjiWords").classList.toggle("active", !isDirectSelection);
  $("#selectAllKanjiWords").classList.toggle("active", isDirectSelection && activeWords.length === kanjiWords.length);
  $("#clearKanjiWords").classList.toggle("active", isDirectSelection && activeWords.length === 0);

  $("#kanjiWordPicker").innerHTML = [
    ...GENERAL_CATEGORIES.map((category) => renderKanjiWordbookCategory(category, words, selectedIds)),
    ...ADJECTIVE_CATEGORY_GROUPS.map((group) => renderKanjiAdjectiveGroup(group, words, selectedIds)),
    ...TRAILING_CATEGORIES.map((category) => renderKanjiWordbookCategory(category, words, selectedIds))
  ].join("");

  $$('[data-kanji-category-select]').forEach((checkbox) => {
    const categoryWords = kanjiWords.filter((word) =>
      getWordCategories(word).includes(checkbox.dataset.kanjiCategorySelect)
    );
    const selectedCount = categoryWords.filter((word) => selectedIds.has(word.id)).length;
    checkbox.checked = selectedCount > 0 && selectedCount === categoryWords.length;
    checkbox.indeterminate = selectedCount > 0 && selectedCount < categoryWords.length;
    checkbox.disabled = categoryWords.length === 0;
  });
}

function setKanjiWordSelection(selection) {
  state.kanjiWordSelection = selection === null ? null : unique(selection);
  saveSettings();
  state.kanji.groups = getKanjiGroups();
  state.kanji.groupIndex = 0;
  renderKanjiWordPicker();
  renderKanjiGroupStudy();
  buildKanjiReadingQuiz();
  buildKanjiWritingQuiz();
  buildKanjiTracing();
  setKanjiMode(state.kanji.mode);
  renderWordList();
}

function toggleKanjiWordSelection(id, checked, extendRange = false, category = "", selectionColumn = "") {
  const allWords = getAllKanjiWords();
  const selectedIds = new Set(
    Array.isArray(state.kanjiWordSelection) ? state.kanjiWordSelection : getKanjiStudyWords().map((word) => word.id)
  );
  let categoryWords = allWords.filter((word) => getWordCategories(word).includes(category));
  if (category === "동사" && selectionColumn && VERB_COLUMN_WORD_IDS[selectionColumn]) {
    categoryWords = getVerbSelectionWords(categoryWords, selectionColumn);
  }
  const selectionScope = category === "동사" ? getVerbSelectionScope(selectionColumn) : selectionColumn;
  const selectionGroup = `${category}:${selectionScope}`;

  if (extendRange && state.lastKanjiWordCategory === selectionGroup && state.lastKanjiWordId) {
    const currentIndex = categoryWords.findIndex((word) => word.id === id);
    const lastIndex = categoryWords.findIndex((word) => word.id === state.lastKanjiWordId);
    if (currentIndex !== -1 && lastIndex !== -1) {
      const start = Math.min(currentIndex, lastIndex);
      const end = Math.max(currentIndex, lastIndex);
      categoryWords.slice(start, end + 1).forEach((word) => {
        if (checked) selectedIds.add(word.id);
        else selectedIds.delete(word.id);
      });
    }
  } else if (checked) {
    selectedIds.add(id);
  } else {
    selectedIds.delete(id);
  }

  state.lastKanjiWordId = id;
  state.lastKanjiWordCategory = selectionGroup;
  setKanjiWordSelection([...selectedIds]);
}

function selectKanjiWordCategory(category) {
  const categoryWords = getAllKanjiWords().filter((word) => getWordCategories(word).includes(category));
  const selectedIds = new Set(
    Array.isArray(state.kanjiWordSelection) ? state.kanjiWordSelection : getKanjiStudyWords().map((word) => word.id)
  );
  const allSelected = categoryWords.every((word) => selectedIds.has(word.id));
  categoryWords.forEach((word) => {
    if (allSelected) selectedIds.delete(word.id);
    else selectedIds.add(word.id);
  });
  state.lastKanjiWordId = null;
  state.lastKanjiWordCategory = null;
  setKanjiWordSelection([...selectedIds]);
}

function toggleKanjiPicker() {
  const picker = $("#kanjiPicker");
  picker.hidden = !picker.hidden;
  $("#toggleKanjiPicker").textContent = picker.hidden ? "선택" : "닫기";
  $("#toggleKanjiPicker").setAttribute("aria-expanded", String(!picker.hidden));
}

function renderKanjiRubyWord(word) {
  return `
    <article class="kanji-related-word">
      <ruby lang="ja">
        <strong>${escapeHtml(word.kanji)}</strong>
        <rt>${escapeHtml(word.hiragana)}</rt>
      </ruby>
      <span>${escapeHtml(word.meaning)}</span>
    </article>
  `;
}

function renderKanjiGroupStudy() {
  const groups = state.kanji.groups;
  if (state.kanji.groupIndex >= groups.length) state.kanji.groupIndex = 0;
  const group = groups[state.kanji.groupIndex];
  const hasGroup = Boolean(group);

  $("#kanjiGroupProgress").textContent = hasGroup ? `${state.kanji.groupIndex + 1} / ${groups.length}` : "0 / 0";
  $("#kanjiScopeLabel").textContent = getKanjiScopeLabel();
  $("#prevKanjiGroup").disabled = !hasGroup;
  $("#nextKanjiGroup").disabled = !hasGroup;

  if (!group) {
    $("#kanjiGroupCard").innerHTML = `
      <div class="empty-state">현재 학습 범위에 한자가 포함된 단어가 없습니다.</div>
    `;
    return;
  }

  const sharedKanji = group.characters.join("·");
  $("#kanjiGroupCard").innerHTML = `
    <div class="kanji-focus-word">
      <ruby lang="ja">
        <strong>${escapeHtml(group.word.kanji)}</strong>
        <rt>${escapeHtml(group.word.hiragana)}</rt>
      </ruby>
      <span>${escapeHtml(group.word.meaning)}</span>
    </div>
    <div class="kanji-group-meta">공통 한자 ${escapeHtml(sharedKanji)} · 관련 단어 ${group.words.length}개</div>
    <div class="kanji-related-grid">
      ${group.words.map(renderKanjiRubyWord).join("")}
    </div>
  `;
}

function moveKanjiGroup(direction) {
  const groups = state.kanji.groups;
  if (!groups.length) return;
  state.kanji.groupIndex = (state.kanji.groupIndex + direction + groups.length) % groups.length;
  renderKanjiGroupStudy();
}

function buildKanjiReadingQuiz() {
  const questions = shuffle(getKanjiStudyWords());
  state.kanji.questions = questions;
  state.kanji.index = 0;
  state.kanji.score = 0;
  state.kanji.answered = false;
  state.kanji.results = [];
  renderKanjiReadingQuiz();
}

function renderKanjiReadingQuiz() {
  const kanji = state.kanji;
  const question = kanji.questions[kanji.index];
  const input = $("#kanjiReadingInput");
  const submitButton = $("#kanjiReadingSubmit");
  const feedback = $("#kanjiReadingFeedback");
  const koreanToggle = $("#kanjiKoreanToggle");
  koreanToggle.textContent = state.kanjiShowKorean ? "한글 ON" : "한글 OFF";
  koreanToggle.setAttribute("aria-pressed", String(state.kanjiShowKorean));
  koreanToggle.classList.toggle("active", state.kanjiShowKorean);

  if (!question) {
    koreanToggle.disabled = true;
    $("#kanjiReadingProgress").textContent = "0 / 0";
    $("#kanjiReadingQuestion").innerHTML = `<div class="empty-state">현재 학습 범위에 한자가 포함된 단어가 없습니다.</div>`;
    feedback.textContent = "";
    feedback.className = "helper-text";
    input.value = "";
    input.disabled = true;
    submitButton.disabled = true;
    submitButton.textContent = "확인";
    return;
  }

  koreanToggle.disabled = false;
  $("#kanjiReadingProgress").textContent = `${kanji.index + 1} / ${kanji.questions.length}`;
  $("#kanjiReadingQuestion").innerHTML = `
    <strong lang="ja">${escapeHtml(question.kanji)}</strong>
    ${state.kanjiShowKorean ? `<span>${escapeHtml(question.meaning)}</span>` : ""}
  `;
  feedback.textContent = `점수 ${kanji.score}`;
  feedback.className = "helper-text";
  input.value = "";
  input.disabled = false;
  submitButton.disabled = false;
  submitButton.textContent = "확인";
}

function answerKanjiReading(event) {
  event.preventDefault();
  const kanji = state.kanji;
  const question = kanji.questions[kanji.index];
  if (!question) return;

  if (kanji.answered) {
    advanceKanjiReadingQuestion();
    return;
  }

  const input = $("#kanjiReadingInput");
  const submitButton = $("#kanjiReadingSubmit");
  const feedback = $("#kanjiReadingFeedback");
  const userAnswer = input.value.trim();
  const typed = normalizeAnswer(userAnswer);
  if (!typed) {
    feedback.textContent = "히라가나를 입력하세요.";
    feedback.className = "helper-text";
    input.focus();
    return;
  }

  kanji.answered = true;
  input.disabled = true;
  const correct = getKanjiReadingAnswers(question).map(normalizeAnswer).includes(typed);
  if (correct) {
    kanji.score += 1;
    markStudied(question.id);
  }
  kanji.results.push(createKanjiReadingReviewResult(question, userAnswer, correct));
  feedback.textContent = formatAnswerFeedback(correct, formatKanjiReadingAnswers(question));
  feedback.className = `helper-text ${correct ? "correct" : "wrong"}`;
  submitButton.textContent = "다음";
  submitButton.disabled = false;
  submitButton.focus();
  saveStudy();
}

function toggleKanjiKorean() {
  state.kanjiShowKorean = !state.kanjiShowKorean;
  saveSettings();
  [$("#kanjiKoreanToggle"), $("#kanjiTracingKoreanToggle")].forEach((koreanToggle) => {
      koreanToggle.textContent = state.kanjiShowKorean ? "한글 ON" : "한글 OFF";
      koreanToggle.setAttribute("aria-pressed", String(state.kanjiShowKorean));
      koreanToggle.classList.toggle("active", state.kanjiShowKorean);
  });

  const question = state.kanji.questions[state.kanji.index];
  if (question) {
    $("#kanjiReadingQuestion").innerHTML = `
      <strong lang="ja">${escapeHtml(question.kanji)}</strong>
      ${state.kanjiShowKorean ? `<span>${escapeHtml(question.meaning)}</span>` : ""}
    `;
  }
  const tracingWord = state.kanjiTracing.words[state.kanjiTracing.index];
  if (tracingWord && !state.kanjiTracing.completed) renderKanjiTracingQuestion(tracingWord);
}

function advanceKanjiReadingQuestion() {
  const kanji = state.kanji;
  const input = $("#kanjiReadingInput");
  const submitButton = $("#kanjiReadingSubmit");
  const feedback = $("#kanjiReadingFeedback");

  kanji.index += 1;
  kanji.answered = false;
  if (kanji.index >= kanji.questions.length) {
    $("#kanjiReadingProgress").textContent = `${kanji.questions.length} / ${kanji.questions.length}`;
    $("#kanjiReadingQuestion").innerHTML = `
      <div class="opposite-complete">
        <button class="completion-summary" type="button" data-retry-kind="kanjiReading">
          완료: ${kanji.questions.length}문제 중 ${kanji.score}개 정답
        </button>
        <span>결과는 아래 오답노트에 저장되었습니다.</span>
      </div>
    `;
    feedback.textContent = "새 문제를 누르면 다시 시작합니다.";
    feedback.className = "helper-text";
    input.value = "";
    input.disabled = true;
    submitButton.disabled = true;
    submitButton.textContent = "확인";
    $("#kanjiKoreanToggle").disabled = true;
    state.review.kanjiReading = createReviewSession(
      "한자 읽기",
      kanji.score,
      kanji.questions.length,
      kanji.results
    );
    renderReviewNote();
    return;
  }

  renderKanjiReadingQuiz();
  input.focus();
}

function getKanjiWritingPoint(event) {
  const rect = $("#kanjiWritingCanvas").getBoundingClientRect();
  return {
    x: Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)),
    y: Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height))
  };
}

function updateKanjiWritingTools() {
  const canEdit = state.kanjiWriting.phase === "drawing" && Boolean(state.kanjiWriting.questions[state.kanjiWriting.index]);
  const hasStrokes = state.kanjiWriting.strokes.length > 0;
  $("#undoKanjiStroke").disabled = !canEdit || !hasStrokes;
  $("#clearKanjiCanvas").disabled = !canEdit || !hasStrokes;
  $("#submitKanjiWriting").disabled = !canEdit || !hasStrokes;
}

function redrawKanjiWritingCanvas() {
  const canvas = $("#kanjiWritingCanvas");
  if (!canvas || canvas.hidden) return;
  const rect = canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return;

  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.max(1, Math.round(rect.width * pixelRatio));
  const height = Math.max(1, Math.round(rect.height * pixelRatio));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  const context = canvas.getContext("2d");
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  context.clearRect(0, 0, rect.width, rect.height);
  context.strokeStyle = "#20242d";
  context.fillStyle = "#20242d";
  context.lineWidth = 8;
  context.lineCap = "round";
  context.lineJoin = "round";

  state.kanjiWriting.strokes.forEach((stroke) => {
    if (!stroke.length) return;
    if (stroke.length === 1) {
      context.beginPath();
      context.arc(stroke[0].x * rect.width, stroke[0].y * rect.height, 4, 0, Math.PI * 2);
      context.fill();
      return;
    }
    context.beginPath();
    context.moveTo(stroke[0].x * rect.width, stroke[0].y * rect.height);
    stroke.slice(1).forEach((point) => context.lineTo(point.x * rect.width, point.y * rect.height));
    context.stroke();
  });
  updateKanjiWritingTools();
}

function resizeKanjiWritingCanvas() {
  if (state.kanji.mode !== "writing" || state.kanjiWriting.phase !== "drawing") return;
  redrawKanjiWritingCanvas();
}

function startKanjiWritingStroke(event) {
  if (state.kanjiWriting.phase !== "drawing" || !state.kanjiWriting.questions[state.kanjiWriting.index]) return;
  if (event.pointerType === "mouse" && event.button !== 0) return;
  event.preventDefault();
  const canvas = $("#kanjiWritingCanvas");
  state.kanjiWriting.pointerId = event.pointerId;
  state.kanjiWriting.strokes.push([getKanjiWritingPoint(event)]);
  canvas.setPointerCapture?.(event.pointerId);
  redrawKanjiWritingCanvas();
}

function moveKanjiWritingStroke(event) {
  if (state.kanjiWriting.pointerId !== event.pointerId || state.kanjiWriting.phase !== "drawing") return;
  event.preventDefault();
  const stroke = state.kanjiWriting.strokes[state.kanjiWriting.strokes.length - 1];
  if (!stroke) return;
  const pointerEvents = event.getCoalescedEvents?.() || [event];
  pointerEvents.forEach((pointerEvent) => stroke.push(getKanjiWritingPoint(pointerEvent)));
  redrawKanjiWritingCanvas();
}

function endKanjiWritingStroke(event) {
  if (state.kanjiWriting.pointerId !== event.pointerId) return;
  state.kanjiWriting.pointerId = null;
  const canvas = $("#kanjiWritingCanvas");
  if (canvas.hasPointerCapture?.(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
  redrawKanjiWritingCanvas();
}

function undoKanjiWritingStroke() {
  if (state.kanjiWriting.phase !== "drawing") return;
  state.kanjiWriting.strokes.pop();
  redrawKanjiWritingCanvas();
}

function clearKanjiWritingCanvas() {
  if (state.kanjiWriting.phase !== "drawing") return;
  state.kanjiWriting.strokes = [];
  redrawKanjiWritingCanvas();
}

function captureKanjiWritingCanvas() {
  const canvas = $("#kanjiWritingCanvas");
  const exportCanvas = document.createElement("canvas");
  exportCanvas.width = 720;
  exportCanvas.height = Math.max(1, Math.round(exportCanvas.width * (canvas.height / canvas.width)));
  const context = exportCanvas.getContext("2d");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
  context.drawImage(canvas, 0, 0, exportCanvas.width, exportCanvas.height);
  return exportCanvas.toDataURL("image/png");
}

function updateKanjiWritingPromptControl(disabled = false) {
  const control = $("#kanjiWritingPromptMode");
  control.dataset.mode = state.kanjiWritingPromptMode;
  $$('[data-writing-prompt-mode]').forEach((button) => {
    const selected = button.dataset.writingPromptMode === state.kanjiWritingPromptMode;
    button.setAttribute("aria-checked", String(selected));
    button.disabled = disabled;
  });
}

function setKanjiWritingPromptMode(mode) {
  if (!["hiragana", "korean", "both"].includes(mode)) return;
  const changed = state.kanjiWritingPromptMode !== mode;
  state.kanjiWritingPromptMode = mode;
  if (changed) saveSettings();
  updateKanjiWritingPromptControl();
  const question = state.kanjiWriting.questions[state.kanjiWriting.index];
  if (question) renderKanjiWritingPrompt(question);
}

function getKanjiWritingPromptModeAt(clientX) {
  const rect = $("#kanjiWritingPromptMode").getBoundingClientRect();
  const ratio = Math.max(0, Math.min(0.999, (clientX - rect.left) / rect.width));
  return ["hiragana", "korean", "both"][Math.floor(ratio * 3)];
}

function startKanjiWritingPromptDrag(event) {
  if (event.pointerType === "mouse" && event.button !== 0) return;
  const control = $("#kanjiWritingPromptMode");
  if (event.target.closest("button")?.disabled) return;
  event.preventDefault();
  state.kanjiWritingPromptDragging = true;
  control.setPointerCapture?.(event.pointerId);
  setKanjiWritingPromptMode(getKanjiWritingPromptModeAt(event.clientX));
}

function moveKanjiWritingPromptDrag(event) {
  if (!state.kanjiWritingPromptDragging) return;
  event.preventDefault();
  setKanjiWritingPromptMode(getKanjiWritingPromptModeAt(event.clientX));
}

function endKanjiWritingPromptDrag(event) {
  if (!state.kanjiWritingPromptDragging) return;
  state.kanjiWritingPromptDragging = false;
  const control = $("#kanjiWritingPromptMode");
  if (control.hasPointerCapture?.(event.pointerId)) control.releasePointerCapture(event.pointerId);
}

function renderKanjiWritingPrompt(question) {
  const showHiragana = state.kanjiWritingPromptMode !== "korean";
  const showKorean = state.kanjiWritingPromptMode !== "hiragana";
  $("#kanjiWritingQuestion").innerHTML = `
    ${showHiragana ? `<strong lang="ja">${escapeHtml(question.hiragana)}</strong>` : ""}
    ${showKorean ? `<span class="kanji-writing-korean-prompt">${escapeHtml(question.meaning)}</span>` : ""}
  `;
}

function renderKanjiWritingComparison(question) {
  $("#kanjiWritingComparison").innerHTML = `
    <section class="kanji-comparison-side">
      <span>내가 쓴 답</span>
      <img src="${escapeHtml(state.kanjiWriting.drawingDataUrl)}" alt="제출한 필기 답안" />
    </section>
    <section class="kanji-comparison-side answer">
      <span>정답</span>
      <strong lang="ja">${escapeHtml(question.kanji)}</strong>
      <small lang="ja">${escapeHtml(question.hiragana)}</small>
    </section>
  `;
}

function renderKanjiWritingQuiz() {
  const writing = state.kanjiWriting;
  const question = writing.questions[writing.index];
  updateKanjiWritingPromptControl(!question || writing.phase === "complete");

  if (!question) {
    if (writing.phase === "complete" && writing.questions.length) {
      finishKanjiWritingQuiz();
      return;
    }
    $("#kanjiWritingProgress").textContent = "0 / 0";
    $("#kanjiWritingQuestion").innerHTML = `<div class="empty-state">현재 학습 범위에 한자가 포함된 단어가 없습니다.</div>`;
    $("#kanjiWritingPad").hidden = true;
    $("#kanjiWritingComparison").hidden = true;
    $("#kanjiSelfGrade").hidden = true;
    $("#nextKanjiWriting").hidden = true;
    $("#kanjiWritingFeedback").textContent = "";
    return;
  }

  $("#kanjiWritingProgress").textContent = `${writing.index + 1} / ${writing.questions.length}`;
  renderKanjiWritingPrompt(question);
  const isDrawing = writing.phase === "drawing";
  $("#kanjiWritingPad").hidden = !isDrawing;
  $("#kanjiWritingComparison").hidden = isDrawing;
  $("#kanjiSelfGrade").hidden = isDrawing;
  $("#nextKanjiWriting").hidden = writing.phase !== "answered";

  if (isDrawing) {
    $("#kanjiWritingFeedback").textContent = "마우스나 터치로 쓴 뒤 정답을 제출하세요.";
    $("#kanjiWritingFeedback").className = "helper-text";
    window.requestAnimationFrame(redrawKanjiWritingCanvas);
    return;
  }

  renderKanjiWritingComparison(question);
  const graded = writing.phase === "answered";
  const latestResult = graded ? writing.results[writing.results.length - 1] : null;
  const correctButton = $("#gradeKanjiCorrect");
  const wrongButton = $("#gradeKanjiWrong");
  correctButton.disabled = graded;
  wrongButton.disabled = graded;
  correctButton.classList.toggle("selected", Boolean(latestResult?.correct));
  wrongButton.classList.toggle("selected", Boolean(latestResult && !latestResult.correct));
  correctButton.setAttribute("aria-pressed", String(Boolean(latestResult?.correct)));
  wrongButton.setAttribute("aria-pressed", String(Boolean(latestResult && !latestResult.correct)));
  $("#kanjiSelfGrade").classList.toggle("graded", graded);
  if (!graded) {
    $("#kanjiWritingFeedback").textContent = "왼쪽 필기와 오른쪽 정답을 비교해 채점하세요.";
    $("#kanjiWritingFeedback").className = "helper-text";
  }
}

function buildKanjiWritingQuiz() {
  state.kanjiWriting.questions = shuffle(getKanjiStudyWords());
  state.kanjiWriting.index = 0;
  state.kanjiWriting.score = 0;
  state.kanjiWriting.phase = "drawing";
  state.kanjiWriting.results = [];
  state.kanjiWriting.strokes = [];
  state.kanjiWriting.drawingDataUrl = "";
  state.kanjiWriting.pointerId = null;
  renderKanjiWritingQuiz();
}

function submitKanjiWriting() {
  const writing = state.kanjiWriting;
  if (writing.phase !== "drawing" || !writing.questions[writing.index]) return;
  if (!writing.strokes.length) {
    $("#kanjiWritingFeedback").textContent = "필기판에 답을 먼저 쓰세요.";
    $("#kanjiWritingFeedback").className = "helper-text wrong";
    return;
  }
  writing.drawingDataUrl = captureKanjiWritingCanvas();
  writing.phase = "grading";
  renderKanjiWritingQuiz();
}

function gradeKanjiWriting(correct) {
  const writing = state.kanjiWriting;
  const question = writing.questions[writing.index];
  if (!question || writing.phase !== "grading") return;
  writing.phase = "answered";
  if (correct) {
    writing.score += 1;
    markStudied(question.id);
  }
  writing.results.push({
    type: "kanjiWriting",
    wordId: question.id,
    kanji: question.kanji,
    hiragana: question.hiragana,
    meaning: question.meaning,
    prompt: question.hiragana,
    expected: question.kanji,
    userAnswer: "필기 답안",
    drawingDataUrl: writing.drawingDataUrl,
    correct
  });
  $("#kanjiWritingFeedback").textContent = correct ? "정답으로 기록했습니다." : "오답으로 기록했습니다.";
  $("#kanjiWritingFeedback").className = `helper-text ${correct ? "correct" : "wrong"}`;
  saveStudy();
  renderKanjiWritingQuiz();
  $("#nextKanjiWriting").focus();
}

function finishKanjiWritingQuiz() {
  const writing = state.kanjiWriting;
  writing.phase = "complete";
  $("#kanjiWritingProgress").textContent = `${writing.questions.length} / ${writing.questions.length}`;
  $("#kanjiWritingQuestion").innerHTML = `
    <div class="opposite-complete">
      <strong>완료: ${writing.questions.length}문제 중 ${writing.score}개 정답</strong>
      <span>필기 답안과 정답 비교 결과가 아래 오답노트에 저장되었습니다.</span>
    </div>
  `;
  $("#kanjiWritingPad").hidden = true;
  $("#kanjiWritingComparison").hidden = true;
  $("#kanjiSelfGrade").hidden = true;
  $("#nextKanjiWriting").hidden = true;
  updateKanjiWritingPromptControl(true);
  $("#kanjiWritingFeedback").textContent = "새 문제를 누르면 다시 시작합니다.";
  $("#kanjiWritingFeedback").className = "helper-text";
  state.review.kanjiWriting = createReviewSession(
    "한자 쓰기",
    writing.score,
    writing.questions.length,
    writing.results
  );
  renderReviewNote();
}

function advanceKanjiWritingQuestion() {
  const writing = state.kanjiWriting;
  if (writing.phase !== "answered") return;
  writing.index += 1;
  writing.phase = "drawing";
  writing.strokes = [];
  writing.drawingDataUrl = "";
  writing.pointerId = null;
  if (writing.index >= writing.questions.length) {
    finishKanjiWritingQuiz();
    return;
  }
  renderKanjiWritingQuiz();
}

function getKanjiTracingPoint(event) {
  const rect = $("#kanjiTracingCanvas").getBoundingClientRect();
  return {
    x: Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)),
    y: Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height))
  };
}

function updateKanjiTracingTools() {
  const tracing = state.kanjiTracing;
  const hasWord = Boolean(tracing.words[tracing.index]) && !tracing.completed;
  const hasStrokes = tracing.strokes.length > 0;
  $("#prevKanjiTracing").disabled = !hasWord || tracing.index === 0;
  $("#undoKanjiTracingStroke").disabled = !hasWord || !hasStrokes;
  $("#clearKanjiTracingCanvas").disabled = !hasWord || !hasStrokes;
  $("#nextKanjiTracing").disabled = !hasWord;
}

function drawKanjiTracingTemplate(context, rect, word) {
  context.save();
  context.fillStyle = "#d2d7df";
  context.textAlign = "center";
  context.textBaseline = "middle";
  let fontSize = Math.max(36, rect.height * 0.62);
  context.font = `900 ${fontSize}px "Noto Sans JP", serif`;
  const maxWidth = rect.width * 0.88;
  const measuredWidth = context.measureText(word.kanji).width;
  if (measuredWidth > maxWidth) {
    fontSize *= maxWidth / measuredWidth;
    context.font = `900 ${fontSize}px "Noto Sans JP", serif`;
  }
  context.fillText(word.kanji, rect.width / 2, rect.height / 2);
  context.restore();
}

function redrawKanjiTracingCanvas() {
  const canvas = $("#kanjiTracingCanvas");
  const tracing = state.kanjiTracing;
  const word = tracing.words[tracing.index];
  if (!canvas || !word || tracing.completed) return;
  const rect = canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return;

  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.max(1, Math.round(rect.width * pixelRatio));
  const height = Math.max(1, Math.round(rect.height * pixelRatio));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  const context = canvas.getContext("2d");
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  context.clearRect(0, 0, rect.width, rect.height);
  drawKanjiTracingTemplate(context, rect, word);
  context.strokeStyle = "#20242d";
  context.fillStyle = "#20242d";
  context.lineWidth = 8;
  context.lineCap = "round";
  context.lineJoin = "round";

  tracing.strokes.forEach((stroke) => {
    if (!stroke.length) return;
    if (stroke.length === 1) {
      context.beginPath();
      context.arc(stroke[0].x * rect.width, stroke[0].y * rect.height, 4, 0, Math.PI * 2);
      context.fill();
      return;
    }
    context.beginPath();
    context.moveTo(stroke[0].x * rect.width, stroke[0].y * rect.height);
    stroke.slice(1).forEach((point) => context.lineTo(point.x * rect.width, point.y * rect.height));
    context.stroke();
  });
  $("#kanjiTracingFeedback").textContent = tracing.strokes.length
    ? `${tracing.strokes.length}획 작성 중`
    : "회색 글자를 따라 쓰세요.";
  updateKanjiTracingTools();
}

function resizeKanjiTracingCanvas() {
  if (state.kanji.mode !== "tracing" || state.kanjiTracing.completed) return;
  redrawKanjiTracingCanvas();
}

function startKanjiTracingStroke(event) {
  const tracing = state.kanjiTracing;
  if (tracing.completed || !tracing.words[tracing.index]) return;
  if (event.pointerType === "mouse" && event.button !== 0) return;
  event.preventDefault();
  const canvas = $("#kanjiTracingCanvas");
  tracing.pointerId = event.pointerId;
  tracing.strokes.push([getKanjiTracingPoint(event)]);
  canvas.setPointerCapture?.(event.pointerId);
  redrawKanjiTracingCanvas();
}

function moveKanjiTracingStroke(event) {
  const tracing = state.kanjiTracing;
  if (tracing.pointerId !== event.pointerId || tracing.completed) return;
  event.preventDefault();
  const stroke = tracing.strokes[tracing.strokes.length - 1];
  if (!stroke) return;
  const pointerEvents = event.getCoalescedEvents?.() || [event];
  pointerEvents.forEach((pointerEvent) => stroke.push(getKanjiTracingPoint(pointerEvent)));
  redrawKanjiTracingCanvas();
}

function endKanjiTracingStroke(event) {
  if (state.kanjiTracing.pointerId !== event.pointerId) return;
  state.kanjiTracing.pointerId = null;
  const canvas = $("#kanjiTracingCanvas");
  if (canvas.hasPointerCapture?.(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
  redrawKanjiTracingCanvas();
}

function undoKanjiTracingStroke() {
  if (state.kanjiTracing.completed) return;
  state.kanjiTracing.strokes.pop();
  redrawKanjiTracingCanvas();
}

function clearKanjiTracingCanvas() {
  if (state.kanjiTracing.completed) return;
  state.kanjiTracing.strokes = [];
  redrawKanjiTracingCanvas();
}

function renderKanjiTracingQuestion(word) {
  $("#kanjiTracingQuestion").innerHTML = `
    <strong lang="ja">${escapeHtml(word.hiragana)}</strong>
    ${state.kanjiShowKorean ? `<span>${escapeHtml(word.meaning)}</span>` : ""}
  `;
}

function getKanjiVgFileName(character) {
  return `${character.codePointAt(0).toString(16).padStart(5, "0")}.svg`;
}

function renderKanjiStrokeOrder(word) {
  const panel = $("#kanjiStrokeOrder");
  const toggle = $("#kanjiStrokeOrderToggle");
  const hasActiveWord = Boolean(word) && !state.kanjiTracing.completed;

  toggle.disabled = !hasActiveWord;
  toggle.textContent = state.kanjiStrokeOrderVisible ? "획순 ON" : "획순 OFF";
  toggle.setAttribute("aria-pressed", String(state.kanjiStrokeOrderVisible));
  toggle.classList.toggle("active", state.kanjiStrokeOrderVisible);

  if (!hasActiveWord || !state.kanjiStrokeOrderVisible) {
    panel.hidden = true;
    panel.innerHTML = "";
    return;
  }

  panel.innerHTML = getKanjiCharacters(word.kanji)
    .map(
      (character) => `
        <figure class="kanji-stroke-item">
          <img src="./assets/kanjivg/${getKanjiVgFileName(character)}" alt="${escapeHtml(character)} 획순도" />
          <figcaption lang="ja">${escapeHtml(character)}</figcaption>
        </figure>
      `
    )
    .join("");
  panel.hidden = false;
}

function toggleKanjiStrokeOrder() {
  if ($("#kanjiStrokeOrderToggle").disabled) return;
  state.kanjiStrokeOrderVisible = !state.kanjiStrokeOrderVisible;
  saveSettings();
  renderKanjiStrokeOrder(state.kanjiTracing.words[state.kanjiTracing.index]);
}

function renderKanjiTracing() {
  const tracing = state.kanjiTracing;
  const word = tracing.words[tracing.index];
  const koreanToggle = $("#kanjiTracingKoreanToggle");
  koreanToggle.textContent = state.kanjiShowKorean ? "한글 ON" : "한글 OFF";
  koreanToggle.setAttribute("aria-pressed", String(state.kanjiShowKorean));
  koreanToggle.classList.toggle("active", state.kanjiShowKorean);
  renderKanjiStrokeOrder(word);

  if (!word) {
    koreanToggle.disabled = true;
    $("#kanjiTracingProgress").textContent = "0 / 0";
    $("#kanjiTracingQuestion").innerHTML = `<div class="empty-state">현재 학습 범위에 한자가 포함된 단어가 없습니다.</div>`;
    $("#kanjiTracingPad").hidden = true;
    $("#kanjiTracingFeedback").textContent = "";
    return;
  }

  koreanToggle.disabled = tracing.completed;
  if (tracing.completed) {
    $("#kanjiTracingProgress").textContent = `${tracing.words.length} / ${tracing.words.length}`;
    $("#kanjiTracingQuestion").innerHTML = `
      <div class="opposite-complete">
        <strong>따라쓰기 완료</strong>
        <span>${tracing.words.length}개 단어를 모두 확인했습니다.</span>
      </div>
    `;
    $("#kanjiTracingPad").hidden = true;
    $("#kanjiTracingFeedback").textContent = "새 연습을 누르면 다시 시작합니다.";
    return;
  }

  $("#kanjiTracingProgress").textContent = `${tracing.index + 1} / ${tracing.words.length}`;
  renderKanjiTracingQuestion(word);
  $("#kanjiTracingPad").hidden = false;
  $("#nextKanjiTracing").textContent = tracing.index === tracing.words.length - 1 ? "완료" : "다음";
  $("#kanjiTracingFeedback").textContent = tracing.strokes.length ? `${tracing.strokes.length}획 작성 중` : "회색 글자를 따라 쓰세요.";
  updateKanjiTracingTools();
  window.requestAnimationFrame(redrawKanjiTracingCanvas);
}

function buildKanjiTracing() {
  state.kanjiTracing.words = shuffle(getKanjiStudyWords());
  state.kanjiTracing.index = 0;
  state.kanjiTracing.completed = false;
  state.kanjiTracing.strokes = [];
  state.kanjiTracing.pointerId = null;
  renderKanjiTracing();
}

function moveKanjiTracing(direction) {
  const tracing = state.kanjiTracing;
  if (!tracing.words.length) return;
  if (tracing.completed && direction < 0) {
    tracing.completed = false;
    tracing.index = tracing.words.length - 1;
    tracing.strokes = [];
    renderKanjiTracing();
    return;
  }
  if (tracing.completed) return;

  const currentWord = tracing.words[tracing.index];
  if (direction > 0 && tracing.strokes.length) {
    markStudied(currentWord.id);
    saveStudy();
  }
  if (direction > 0 && tracing.index === tracing.words.length - 1) {
    tracing.completed = true;
  } else {
    tracing.index = Math.max(0, Math.min(tracing.words.length - 1, tracing.index + direction));
  }
  tracing.strokes = [];
  tracing.pointerId = null;
  renderKanjiTracing();
}

function setKanjiMode(mode) {
  state.kanji.mode = ["reading", "writing", "tracing"].includes(mode) ? mode : "groups";
  const isReading = state.kanji.mode === "reading";
  const isWriting = state.kanji.mode === "writing";
  const isTracing = state.kanji.mode === "tracing";
  const isGroups = !isReading && !isWriting && !isTracing;
  $("#kanjiGroupPane").hidden = !isGroups;
  $("#kanjiReadingPane").hidden = !isReading;
  $("#kanjiWritingPane").hidden = !isWriting;
  $("#kanjiTracingPane").hidden = !isTracing;
  $("#kanjiGroupTab").classList.toggle("active", isGroups);
  $("#kanjiReadingTab").classList.toggle("active", isReading);
  $("#kanjiWritingTab").classList.toggle("active", isWriting);
  $("#kanjiTracingTab").classList.toggle("active", isTracing);
  $("#kanjiGroupTab").setAttribute("aria-selected", String(isGroups));
  $("#kanjiReadingTab").setAttribute("aria-selected", String(isReading));
  $("#kanjiWritingTab").setAttribute("aria-selected", String(isWriting));
  $("#kanjiTracingTab").setAttribute("aria-selected", String(isTracing));
  if (isReading) renderKanjiReadingQuiz();
  else if (isWriting) renderKanjiWritingQuiz();
  else if (isTracing) renderKanjiTracing();
  else renderKanjiGroupStudy();
}

function buildKanjiLearning() {
  state.kanji.groups = getKanjiGroups();
  state.kanji.groupIndex = 0;
  renderKanjiWordPicker();
  renderKanjiGroupStudy();
  buildKanjiReadingQuiz();
  buildKanjiWritingQuiz();
  buildKanjiTracing();
  setKanjiMode(state.kanji.mode);
}

function setQuestionProgress(kind, text) {
  const config = {
    quiz: { button: $("#quizProgress"), label: "뜻 맞히기" },
    writing: { button: $("#writingProgress"), label: "일본어 쓰기" },
    opposite: { button: $("#oppositeProgress"), label: "반의어 퀴즈" }
  }[kind];
  const { button, label } = config;

  button.textContent = text;
  button.title = "문제 수 설정";
  button.setAttribute("aria-label", `${label} 문제 수 설정: ${text}`);
}

function buildQuiz() {
  const deck = getDeck();
  const questionWords = buildQuestionWords(deck, state.quizQuestionCount);
  const questions = questionWords.map((answer) => {
    const correctChoice = getPracticePrompt(answer);
    const distractors = shuffle(getAllWords().filter((word) => word.id !== answer.id))
      .map(getPracticePrompt)
      .filter((choice, index, choices) => choice !== correctChoice && choices.indexOf(choice) === index)
      .slice(0, 3);

    return {
      answer,
      choices: shuffle([correctChoice, ...distractors])
    };
  });

  state.quiz = {
    questions,
    index: 0,
    score: 0,
    answered: false,
    results: []
  };
  renderQuiz();
}

function renderQuiz() {
  const quiz = state.quiz;
  const question = quiz.questions[quiz.index];

  if (!question) {
    setQuestionProgress("quiz", "0 / 0");
    $("#quizQuestion").textContent = "조건에 맞는 단어가 없습니다.";
    $("#choiceGrid").innerHTML = "";
    $("#quizFeedback").textContent = "";
    return;
  }

  setQuestionProgress("quiz", `${quiz.index + 1} / ${quiz.questions.length}`);
  $("#quizQuestion").textContent = `${question.answer.kanji} (${question.answer.hiragana})`;
  $("#choiceGrid").innerHTML = question.choices
    .map(
      (choice, index) => `
        <button class="choice-button" type="button" data-choice-index="${index}">
          ${escapeHtml(choice)}
        </button>
      `
    )
    .join("");
  $("#quizFeedback").textContent = `점수 ${quiz.score}`;
}

function answerQuiz(choiceIndex) {
  const quiz = state.quiz;
  const question = quiz.questions[quiz.index];
  if (!question || quiz.answered) return;

  quiz.answered = true;
  const choice = question.choices[choiceIndex];
  const correctChoice = getPracticePrompt(question.answer);
  const correct = choice === correctChoice;
  if (correct) {
    quiz.score += 1;
    markStudied(question.answer.id);
  }
  quiz.results.push(createReviewResult(question.answer, choice, correct, "quiz"));

  $$(".choice-button").forEach((button) => {
    const value = question.choices[Number(button.dataset.choiceIndex)];
    button.classList.toggle("correct", value === correctChoice);
    button.classList.toggle("wrong", value === choice && !correct);
  });
  $("#quizFeedback").textContent = formatAnswerFeedback(correct, correctChoice);
  saveStudy();

  window.setTimeout(() => {
    quiz.index += 1;
    quiz.answered = false;
    if (quiz.index >= quiz.questions.length) {
      setQuestionProgress("quiz", `${quiz.questions.length} / ${quiz.questions.length}`);
      $("#quizQuestion").innerHTML = `
        <button class="completion-summary" type="button" data-retry-kind="quiz">
          완료: ${quiz.questions.length}문제 중 ${quiz.score}개 정답
        </button>
      `;
      $("#choiceGrid").innerHTML = "";
      $("#quizFeedback").textContent = "새 문제를 누르면 다시 시작합니다.";
      state.review.quiz = createReviewSession("뜻 맞히기", quiz.score, quiz.questions.length, quiz.results);
      renderReviewNote();
      return;
    }
    renderQuiz();
  }, 850);
}

function buildWritingQuiz() {
  const deck = getDeck();
  const questions = buildQuestionWords(deck, state.writingQuestionCount);

  state.writing = {
    questions,
    index: 0,
    score: 0,
    answered: false,
    results: []
  };
  renderWritingQuiz();
}

function renderWritingQuiz() {
  const writing = state.writing;
  const question = writing.questions[writing.index];
  const input = $("#writingInput");
  const submitButton = $("#writingSubmit");
  const feedback = $("#writingFeedback");

  if (!question) {
    setQuestionProgress("writing", "0 / 0");
    $("#writingPrompt").textContent = "조건에 맞는 단어가 없습니다.";
    feedback.textContent = "";
    feedback.className = "helper-text";
    input.value = "";
    input.disabled = true;
    submitButton.disabled = true;
    submitButton.textContent = "확인";
    return;
  }

  setQuestionProgress("writing", `${writing.index + 1} / ${writing.questions.length}`);
  $("#writingPrompt").textContent = getPracticePrompt(question);
  feedback.textContent = `점수 ${writing.score}`;
  feedback.className = "helper-text";
  input.value = "";
  input.disabled = false;
  submitButton.disabled = false;
  submitButton.textContent = "확인";
}

function answerWriting(event) {
  event.preventDefault();

  const writing = state.writing;
  const question = writing.questions[writing.index];
  if (!question) return;

  if (writing.answered) {
    advanceWritingQuestion();
    return;
  }

  const input = $("#writingInput");
  const submitButton = $("#writingSubmit");
  const feedback = $("#writingFeedback");
  const userAnswer = input.value.trim();
  const typed = normalizeAnswer(input.value);
  if (!typed) {
    feedback.textContent = "일본어를 입력하세요.";
    feedback.className = "helper-text";
    input.focus();
    return;
  }

  writing.answered = true;
  input.disabled = true;

  const answers = getAcceptedAnswers(question).map(normalizeAnswer);
  const correct = answers.includes(typed);
  if (correct) {
    writing.score += 1;
    markStudied(question.id);
  }
  writing.results.push(createReviewResult(question, userAnswer, correct, "writing"));

  feedback.textContent = formatAnswerFeedback(correct, formatAcceptedAnswers(question));
  feedback.className = `helper-text ${correct ? "correct" : "wrong"}`;
  submitButton.textContent = "다음";
  submitButton.disabled = false;
  submitButton.focus();
  saveStudy();
}

function advanceWritingQuestion() {
  const writing = state.writing;
  const input = $("#writingInput");
  const submitButton = $("#writingSubmit");
  const feedback = $("#writingFeedback");

  writing.index += 1;
  writing.answered = false;
  if (writing.index >= writing.questions.length) {
    setQuestionProgress("writing", `${writing.questions.length} / ${writing.questions.length}`);
    $("#writingPrompt").innerHTML = `
      <button class="completion-summary" type="button" data-retry-kind="writing">
        완료: ${writing.questions.length}문제 중 ${writing.score}개 정답
      </button>
    `;
    feedback.textContent = "새 문제를 누르면 다시 시작합니다.";
    feedback.className = "helper-text";
    input.value = "";
    input.disabled = true;
    submitButton.disabled = true;
    submitButton.textContent = "확인";
    state.review.writing = createReviewSession("일본어 쓰기", writing.score, writing.questions.length, writing.results);
    renderReviewNote();
    return;
  }

  renderWritingQuiz();
  input.focus();
}

function getQuestionCountElements(kind) {
  return {
    button: $(`#${kind}Progress`),
    form: $(`#${kind}CountForm`),
    input: $(`#${kind}CountInput`)
  };
}

function closeQuestionCountPopover(kind) {
  const { button, form } = getQuestionCountElements(kind);
  form.hidden = true;
  button.setAttribute("aria-expanded", "false");
}

function closeQuestionCountPopovers(exceptKind = null) {
  ["quiz", "writing", "opposite"].forEach((kind) => {
    if (kind !== exceptKind) closeQuestionCountPopover(kind);
  });
}

function openQuestionCountPopover(kind) {
  const { button, form, input } = getQuestionCountElements(kind);
  const count = {
    quiz: state.quizQuestionCount,
    writing: state.writingQuestionCount,
    opposite: state.oppositeQuestionCount
  }[kind];

  closeQuestionCountPopovers(kind);
  form.hidden = false;
  button.setAttribute("aria-expanded", "true");
  input.value = count;
  window.setTimeout(() => {
    input.focus();
    input.select();
  }, 0);
}

function toggleQuestionCountPopover(kind) {
  const { form } = getQuestionCountElements(kind);
  if (form.hidden) {
    openQuestionCountPopover(kind);
  } else {
    closeQuestionCountPopover(kind);
  }
}

function applyQuestionCount(kind, value) {
  const count = sanitizeQuestionCount(value);

  if (kind === "quiz") {
    state.quizQuestionCount = count;
    saveSettings();
    closeQuestionCountPopover(kind);
    buildQuiz();
    return;
  }

  if (kind === "opposite") {
    state.oppositeQuestionCount = count;
    saveSettings();
    closeQuestionCountPopover(kind);
    buildOppositeQuiz();
    return;
  }

  state.writingQuestionCount = count;
  saveSettings();
  closeQuestionCountPopover(kind);
  buildWritingQuiz();
}

function openWordbookModal() {
  $("#wordbookModal").hidden = false;
  $("#closeWordbook").focus();
}

function closeWordbookModal() {
  const modal = $("#wordbookModal");
  if (modal.hidden) return;
  modal.hidden = true;
  $("#openWordbook").focus();
}

function openOppositeModal() {
  $("#oppositeModal").hidden = false;
  buildOppositeLearning();
  $("#closeOpposite").focus();
}

function closeOppositeModal() {
  const modal = $("#oppositeModal");
  if (modal.hidden) return;
  closeQuestionCountPopover("opposite");
  $("#oppositePicker").hidden = true;
  $("#toggleOppositePicker").textContent = "선택";
  $("#toggleOppositePicker").setAttribute("aria-expanded", "false");
  modal.hidden = true;
  $("#openOpposite").focus();
}

function openKanjiModal() {
  $("#kanjiModal").hidden = false;
  buildKanjiLearning();
  $("#closeKanji").focus();
}

function closeKanjiModal() {
  const modal = $("#kanjiModal");
  if (modal.hidden) return;
  $("#kanjiPicker").hidden = true;
  $("#toggleKanjiPicker").textContent = "선택";
  $("#toggleKanjiPicker").setAttribute("aria-expanded", "false");
  modal.hidden = true;
  $("#openKanji").focus();
}

function resetStudy() {
  const ok = window.confirm("외움/헷갈림/오늘 학습 기록을 초기화할까요?");
  if (!ok) return;

  state.study.knownIds = [];
  state.study.hardIds = [];
  state.study.daily = {};
  state.review.quiz = null;
  state.review.writing = null;
  state.review.opposite = null;
  state.review.kanjiReading = null;
  state.review.kanjiWriting = null;
  state.cardIndex = 0;
  state.flipped = state.keepFlipped;
  saveStudy();
  renderAll();
  buildQuiz();
  buildWritingQuiz();
  buildOppositeLearning();
}

function resetDeckView() {
  state.cardIndex = 0;
  state.flipped = state.keepFlipped;
  renderCard();
  renderMiniWordbook();
  renderWordList();
  buildQuiz();
  buildWritingQuiz();
  buildOppositeLearning();
}

function applySearch(value) {
  const search = normalizeSearchText(value);
  if (search === state.search) return;

  state.search = search;
  state.searchTerms = search.split(/\s+/u).filter(Boolean);
  resetDeckView();
}

function bindEvents() {
  $("#flashcard").addEventListener("click", flipCard);
  $("#keepFlipped").addEventListener("change", (event) => setKeepFlipped(event.target.checked));
  $("#prevCard").addEventListener("click", () => moveCard(-1));
  $("#nextCard").addEventListener("click", () => moveCard(1));
  $("#knowCard").addEventListener("click", () => markKnown());
  $("#hardCard").addEventListener("click", () => markHard());
  $("#resetStudy").addEventListener("click", resetStudy);
  $("#newQuiz").addEventListener("click", buildQuiz);
  $("#newWriting").addEventListener("click", buildWritingQuiz);
  $("#newOppositeQuiz").addEventListener("click", buildOppositeQuiz);
  $("#newKanjiReading").addEventListener("click", buildKanjiReadingQuiz);
  $("#newKanjiWriting").addEventListener("click", buildKanjiWritingQuiz);
  $("#newKanjiTracing").addEventListener("click", buildKanjiTracing);
  $("#kanjiKoreanToggle").addEventListener("click", toggleKanjiKorean);
  $("#kanjiTracingKoreanToggle").addEventListener("click", toggleKanjiKorean);
  $("#kanjiStrokeOrderToggle").addEventListener("click", toggleKanjiStrokeOrder);
  const kanjiWritingPromptMode = $("#kanjiWritingPromptMode");
  kanjiWritingPromptMode.addEventListener("pointerdown", startKanjiWritingPromptDrag);
  kanjiWritingPromptMode.addEventListener("pointermove", moveKanjiWritingPromptDrag);
  kanjiWritingPromptMode.addEventListener("pointerup", endKanjiWritingPromptDrag);
  kanjiWritingPromptMode.addEventListener("pointercancel", endKanjiWritingPromptDrag);
  $$('[data-writing-prompt-mode]').forEach((button) => {
    button.addEventListener("click", () => setKanjiWritingPromptMode(button.dataset.writingPromptMode));
  });
  $("#writingForm").addEventListener("submit", answerWriting);
  $("#kanjiReadingForm").addEventListener("submit", answerKanjiReading);
  const kanjiWritingCanvas = $("#kanjiWritingCanvas");
  kanjiWritingCanvas.addEventListener("pointerdown", startKanjiWritingStroke);
  kanjiWritingCanvas.addEventListener("pointermove", moveKanjiWritingStroke);
  kanjiWritingCanvas.addEventListener("pointerup", endKanjiWritingStroke);
  kanjiWritingCanvas.addEventListener("pointercancel", endKanjiWritingStroke);
  $("#undoKanjiStroke").addEventListener("click", undoKanjiWritingStroke);
  $("#clearKanjiCanvas").addEventListener("click", clearKanjiWritingCanvas);
  $("#submitKanjiWriting").addEventListener("click", submitKanjiWriting);
  $("#gradeKanjiCorrect").addEventListener("click", () => gradeKanjiWriting(true));
  $("#gradeKanjiWrong").addEventListener("click", () => gradeKanjiWriting(false));
  $("#nextKanjiWriting").addEventListener("click", advanceKanjiWritingQuestion);
  window.addEventListener("resize", resizeKanjiWritingCanvas);
  const kanjiTracingCanvas = $("#kanjiTracingCanvas");
  kanjiTracingCanvas.addEventListener("pointerdown", startKanjiTracingStroke);
  kanjiTracingCanvas.addEventListener("pointermove", moveKanjiTracingStroke);
  kanjiTracingCanvas.addEventListener("pointerup", endKanjiTracingStroke);
  kanjiTracingCanvas.addEventListener("pointercancel", endKanjiTracingStroke);
  $("#prevKanjiTracing").addEventListener("click", () => moveKanjiTracing(-1));
  $("#undoKanjiTracingStroke").addEventListener("click", undoKanjiTracingStroke);
  $("#clearKanjiTracingCanvas").addEventListener("click", clearKanjiTracingCanvas);
  $("#nextKanjiTracing").addEventListener("click", () => moveKanjiTracing(1));
  window.addEventListener("resize", resizeKanjiTracingCanvas);
  $("#retryTextForm").addEventListener("submit", answerRetryText);
  $("#openWordbook").addEventListener("click", openWordbookModal);
  $("#closeWordbook").addEventListener("click", closeWordbookModal);
  $("#wordbookModal").addEventListener("click", (event) => {
    if (event.target.id === "wordbookModal") closeWordbookModal();
  });
  $("#openOpposite").addEventListener("click", openOppositeModal);
  $("#closeOpposite").addEventListener("click", closeOppositeModal);
  $("#oppositeModal").addEventListener("click", (event) => {
    if (event.target.id === "oppositeModal") closeOppositeModal();
  });
  $("#openKanji").addEventListener("click", openKanjiModal);
  $("#closeKanji").addEventListener("click", closeKanjiModal);
  $("#kanjiModal").addEventListener("click", (event) => {
    if (event.target.id === "kanjiModal") closeKanjiModal();
  });
  $("#closeRetry").addEventListener("click", closeRetryModal);
  $("#finishRetry").addEventListener("click", closeRetryModal);
  $("#retryAgain").addEventListener("click", retryWrongAgain);
  $("#retryNext").addEventListener("click", advanceRetryQuestion);
  $("#retryModal").addEventListener("click", (event) => {
    if (event.target.id === "retryModal") closeRetryModal();
  });
  $("#retryChoiceGrid").addEventListener("click", (event) => {
    const button = event.target.closest("[data-retry-choice-index]");
    if (!button) return;
    answerRetryChoice(Number(button.dataset.retryChoiceIndex));
  });
  $$('[data-kanji-mode]').forEach((button) => {
    button.addEventListener("click", () => setKanjiMode(button.dataset.kanjiMode));
  });
  $("#prevKanjiGroup").addEventListener("click", () => moveKanjiGroup(-1));
  $("#nextKanjiGroup").addEventListener("click", () => moveKanjiGroup(1));
  $("#toggleKanjiPicker").addEventListener("click", toggleKanjiPicker);
  $("#selectAllKanjiWords").addEventListener("click", () => {
    state.lastKanjiWordId = null;
    state.lastKanjiWordCategory = null;
    setKanjiWordSelection(getAllKanjiWords().map((word) => word.id));
  });
  $("#useWordbookKanjiWords").addEventListener("click", () => {
    state.lastKanjiWordId = null;
    state.lastKanjiWordCategory = null;
    setKanjiWordSelection(null);
  });
  $("#clearKanjiWords").addEventListener("click", () => {
    state.lastKanjiWordId = null;
    state.lastKanjiWordCategory = null;
    setKanjiWordSelection([]);
  });
  $("#kanjiWordPicker").addEventListener("click", (event) => {
    const button = event.target.closest("[data-kanji-word-id]");
    if (!button) return;
    toggleKanjiWordSelection(
      button.dataset.kanjiWordId,
      button.getAttribute("aria-pressed") !== "true",
      event.shiftKey,
      button.dataset.kanjiWordCategory,
      button.dataset.kanjiWordColumn
    );
  });
  $("#kanjiWordPicker").addEventListener("change", (event) => {
    const checkbox = event.target.closest("[data-kanji-category-select]");
    if (!checkbox) return;
    selectKanjiWordCategory(checkbox.dataset.kanjiCategorySelect);
  });
  $$("[data-opposite-mode]").forEach((button) => {
    button.addEventListener("click", () => setOppositeMode(button.dataset.oppositeMode));
  });
  $("#prevOppositePair").addEventListener("click", () => moveOppositePair(-1));
  $("#nextOppositePair").addEventListener("click", () => moveOppositePair(1));
  $("#startOppositeQuiz").addEventListener("click", () => {
    buildOppositeQuiz();
    setOppositeMode("quiz");
  });
  $("#oppositeNext").addEventListener("click", advanceOppositeQuiz);
  $("#oppositeKoreanToggle").addEventListener("click", toggleOppositeKorean);
  $("#toggleOppositePicker").addEventListener("click", toggleOppositePicker);
  $("#selectAllOppositePairs").addEventListener("click", () => {
    state.lastOppositePairKey = null;
    state.lastOppositePairGroup = null;
    setOppositePairSelection(getAllOppositePairs().map(getOppositePairKey));
  });
  $("#useWordbookOppositePairs").addEventListener("click", () => {
    state.lastOppositePairKey = null;
    state.lastOppositePairGroup = null;
    setOppositePairSelection(null);
  });
  $("#clearOppositePairs").addEventListener("click", () => {
    state.lastOppositePairKey = null;
    state.lastOppositePairGroup = null;
    setOppositePairSelection([]);
  });
  $("#oppositePairPicker").addEventListener("click", (event) => {
    const checkbox = event.target.closest("[data-opposite-pair-key]");
    if (!checkbox) return;
    toggleOppositePairSelection(checkbox.dataset.oppositePairKey, checkbox.checked, event.shiftKey);
  });
  $("#quizProgress").addEventListener("click", () => toggleQuestionCountPopover("quiz"));
  $("#writingProgress").addEventListener("click", () => toggleQuestionCountPopover("writing"));
  $("#oppositeProgress").addEventListener("click", () => toggleQuestionCountPopover("opposite"));
  $("#quizCountForm").addEventListener("submit", (event) => {
    event.preventDefault();
    applyQuestionCount("quiz", $("#quizCountInput").value);
  });
  $("#writingCountForm").addEventListener("submit", (event) => {
    event.preventDefault();
    applyQuestionCount("writing", $("#writingCountInput").value);
  });
  $("#oppositeCountForm").addEventListener("submit", (event) => {
    event.preventDefault();
    applyQuestionCount("opposite", $("#oppositeCountInput").value);
  });
  $("#studySelected").addEventListener("click", studySelectedWords);
  $("#studyAll").addEventListener("click", studyAllWords);
  $("#clearSelection").addEventListener("click", clearSelection);
  $("#readingToggle").addEventListener("click", () => {
    state.showReading = !state.showReading;
    saveSettings();
    renderCard();
  });

  $("#deckFilter").addEventListener("change", (event) => {
    state.filter = event.target.value;
    resetDeckView();
  });

  $("#categoryFilter").addEventListener("change", (event) => {
    state.category = event.target.value;
    resetDeckView();
  });

  $("#cardLimitInput").addEventListener("input", (event) => {
    state.limit = event.target.value;
    resetDeckView();
  });

  const searchInput = $("#searchInput");
  let searchTimer = null;
  let searchComposing = false;
  let searchSelectAllActive = false;
  let searchSelectionRevision = 0;
  let searchClearRevision = 0;
  let searchClearActive = false;
  let searchModifierReleasedAt = Number.NEGATIVE_INFINITY;
  const scheduleSearch = (value, immediate = false) => {
    window.clearTimeout(searchTimer);
    if (immediate) {
      applySearch(value);
      return;
    }
    searchTimer = window.setTimeout(() => applySearch(value), 60);
  };

  const hasEntireSearchSelection = () =>
    searchInput.value.length > 0 &&
    searchInput.selectionStart === 0 &&
    searchInput.selectionEnd === searchInput.value.length;

  const releaseSearchSelection = () => {
    searchSelectAllActive = false;
    searchSelectionRevision += 1;
  };

  const cancelPendingSearchClear = () => {
    if (!searchClearActive) return;
    searchClearActive = false;
    searchClearRevision += 1;
  };

  const selectEntireSearchInput = (revision = searchSelectionRevision) => {
    if (!searchSelectAllActive || revision !== searchSelectionRevision) return;
    searchInput.setSelectionRange(0, searchInput.value.length, "forward");
  };

  const keepEntireSearchSelection = () => {
    searchSelectAllActive = true;
    const revision = ++searchSelectionRevision;
    selectEntireSearchInput(revision);
    window.queueMicrotask(() => selectEntireSearchInput(revision));
    window.requestAnimationFrame(() => selectEntireSearchInput(revision));
  };

  const clearSelectedSearchInput = (event) => {
    if (event?.cancelable) event.preventDefault();
    event?.stopPropagation();

    releaseSearchSelection();
    window.clearTimeout(searchTimer);
    const revision = ++searchClearRevision;
    searchClearActive = true;
    const wasComposing = searchComposing || Boolean(event?.isComposing);
    searchComposing = false;

    const keepSearchCleared = (restoreFocus = false) => {
      if (revision !== searchClearRevision) return;
      searchInput.value = "";
      if (restoreFocus && document.activeElement !== searchInput) {
        searchInput.focus({ preventScroll: true });
      }
      if (document.activeElement === searchInput) searchInput.setSelectionRange(0, 0);
      applySearch("");
    };

    if (wasComposing) searchInput.blur();
    keepSearchCleared(wasComposing);
    window.queueMicrotask(() => keepSearchCleared(wasComposing));
    window.requestAnimationFrame(() => {
      keepSearchCleared(wasComposing);
      window.requestAnimationFrame(() => {
        if (revision !== searchClearRevision) return;
        keepSearchCleared(wasComposing);
        searchClearActive = false;
      });
    });
  };

  const isSearchSelectAllShortcut = (event) => {
    const isAKey = event.code === "KeyA" || event.key.toLowerCase() === "a";
    const modifierWasJustReleased =
      event.type === "keyup" && performance.now() - searchModifierReleasedAt < 180;
    return isAKey && (event.ctrlKey || event.metaKey || modifierWasJustReleased);
  };

  const trackSearchModifier = (event) => {
    if (["Control", "Meta"].includes(event.key)) {
      searchModifierReleasedAt =
        event.type === "keyup" ? performance.now() : Number.NEGATIVE_INFINITY;
      return;
    }
    if (event.type === "keydown") searchModifierReleasedAt = Number.NEGATIVE_INFINITY;
  };

  const handleSearchSelectAll = (event) => {
    if (!isSearchSelectAllShortcut(event)) return;

    event.preventDefault();
    event.stopPropagation();
    window.clearTimeout(searchTimer);
    keepEntireSearchSelection();
  };

  const handleSearchSelectionKey = (event) => {
    const isEraseKey = event.key === "Backspace" || event.key === "Delete";
    if (isEraseKey && (searchSelectAllActive || hasEntireSearchSelection())) {
      clearSelectedSearchInput(event);
      return;
    }

    if (
      !isSearchSelectAllShortcut(event) &&
      !["Control", "Shift", "Alt", "Meta"].includes(event.key)
    ) releaseSearchSelection();
  };

  searchInput.addEventListener("keydown", trackSearchModifier, true);
  searchInput.addEventListener("keyup", trackSearchModifier, true);
  searchInput.addEventListener("keydown", handleSearchSelectAll, true);
  searchInput.addEventListener("keydown", handleSearchSelectionKey, true);
  searchInput.addEventListener("keyup", handleSearchSelectAll, true);
  searchInput.addEventListener("pointerdown", () => {
    releaseSearchSelection();
  });
  searchInput.addEventListener("beforeinput", (event) => {
    const inputType = event.inputType || "";
    const isEraseInput = inputType.startsWith("delete");
    if (isEraseInput && (searchSelectAllActive || hasEntireSearchSelection())) {
      clearSelectedSearchInput(event);
      return;
    }

    if (inputType.startsWith("insert")) cancelPendingSearchClear();
    if (searchSelectAllActive && inputType.startsWith("insert")) {
      selectEntireSearchInput();
    }
  });
  searchInput.addEventListener("compositionstart", () => {
    cancelPendingSearchClear();
    if (!searchComposing) releaseSearchSelection();
    searchComposing = true;
    window.clearTimeout(searchTimer);
  });
  searchInput.addEventListener("compositionupdate", () => {
    scheduleSearch(searchInput.value);
  });
  searchInput.addEventListener("compositionend", (event) => {
    searchComposing = false;
    if (searchClearActive) {
      searchInput.value = "";
      scheduleSearch("", true);
      return;
    }
    if (searchSelectAllActive) keepEntireSearchSelection();
    scheduleSearch(event.currentTarget.value);
  });
  searchInput.addEventListener("input", (event) => {
    if (searchClearActive) {
      searchInput.value = "";
      scheduleSearch("", true);
      return;
    }

    const isCompositionInput =
      searchComposing ||
      event.isComposing ||
      event.inputType === "insertCompositionText" ||
      event.inputType === "insertFromComposition";
    if (!(searchSelectAllActive && isCompositionInput)) releaseSearchSelection();
    scheduleSearch(event.currentTarget.value, event.currentTarget.value === "");
  });
  searchInput.addEventListener("blur", (event) => {
    if (searchClearActive) return;
    releaseSearchSelection();
    scheduleSearch(event.currentTarget.value, true);
  });

  $("#cardSearchForm").addEventListener("submit", (event) => {
    event.preventDefault();
    scheduleSearch(searchInput.value, true);
    searchInput.blur();
  });

  $("#miniWordbook").addEventListener("click", (event) => {
    const button = event.target.closest("[data-select-id]");
    if (!button) return;
    selectWord(
      button.dataset.selectId,
      event.shiftKey,
      button.dataset.selectionCategory,
      button.dataset.selectionColumn
    );
  });

  $("#miniWordbook").addEventListener("change", (event) => {
    const checkbox = event.target.closest("[data-category-select]");
    if (!checkbox) return;
    selectCategory(checkbox.dataset.categorySelect);
  });

  $("#choiceGrid").addEventListener("click", (event) => {
    const button = event.target.closest("[data-choice-index]");
    if (!button) return;
    answerQuiz(Number(button.dataset.choiceIndex));
  });

  $("#oppositeChoiceGrid").addEventListener("click", (event) => {
    const button = event.target.closest("[data-opposite-choice-index]");
    if (!button) return;
    answerOppositeQuiz(Number(button.dataset.oppositeChoiceIndex));
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".question-count")) closeQuestionCountPopovers();
    const retryButton = event.target.closest("[data-retry-kind]");
    if (retryButton) openRetryModal(retryButton.dataset.retryKind);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (!$("#retryModal").hidden) {
        closeRetryModal();
        return;
      }
      closeQuestionCountPopovers();
      closeWordbookModal();
      closeOppositeModal();
      closeKanjiModal();
      return;
    }

    if (handleRetryKeyboard(event)) return;
    if (handleOppositeKeyboard(event)) return;

    if (!$("#kanjiModal").hidden) {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (state.kanji.mode === "writing" && event.key === "Enter" && activeTag !== "button") {
        event.preventDefault();
        if (state.kanjiWriting.phase === "drawing") submitKanjiWriting();
        else if (state.kanjiWriting.phase === "answered") advanceKanjiWritingQuestion();
      }
      if (state.kanji.mode === "tracing" && activeTag !== "button") {
        if (event.key === "Enter" || event.key === "ArrowRight") {
          event.preventDefault();
          moveKanjiTracing(1);
        } else if (event.key === "ArrowLeft") {
          event.preventDefault();
          moveKanjiTracing(-1);
        } else if (event.ctrlKey && event.key.toLowerCase() === "z") {
          event.preventDefault();
          undoKanjiTracingStroke();
        }
      }
      return;
    }

    const activeTag = document.activeElement?.tagName?.toLowerCase();
    if (["input", "select", "textarea", "button"].includes(activeTag)) return;

    if (event.key === " ") {
      event.preventDefault();
      flipCard();
    }
    if (event.key === "ArrowRight") moveCard(1);
    if (event.key === "ArrowLeft") moveCard(-1);
    if (event.key === "Enter") markKnown();
    if (event.key.toLowerCase() === "h") markHard();
  });
}

function init() {
  localStorage.removeItem(LEGACY_STORAGE_KEY);
  loadStudy();
  loadSettings();
  if (syncPracticeQuestionCountsToSelection()) saveSettings();
  renderCategoryFilter();
  bindEvents();
  renderAll();
  buildQuiz();
  buildWritingQuiz();
  buildOppositeLearning();
}

init();

if ("serviceWorker" in navigator && window.location.protocol !== "file:") {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch((error) => {
      console.warn("오프라인 학습 준비에 실패했습니다.", error);
    });
  });
}

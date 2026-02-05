/**
 * Word Lists for Solo Mode
 * Common English and Mongolian words for the guessing game
 */

// English word lists by length
const EN_WORDS = {
  4: [
    "ABLE", "ACID", "AGED", "ALSO", "AREA", "ARMY", "AWAY", "BABY", "BACK", "BALL",
    "BAND", "BANK", "BASE", "BATH", "BEAR", "BEAT", "BEEN", "BEER", "BELL", "BELT",
    "BEST", "BILL", "BIRD", "BLOW", "BLUE", "BOAT", "BODY", "BOMB", "BOND", "BONE",
    "BOOK", "BOOM", "BORN", "BOSS", "BOTH", "BOWL", "BULK", "BURN", "BUSH", "BUSY",
    "CAFE", "CAGE", "CAKE", "CALL", "CALM", "CAME", "CAMP", "CARD", "CARE", "CASE",
    "CASH", "CAST", "CELL", "CHAT", "CHIP", "CITY", "CLUB", "COAL", "COAT", "CODE",
    "COLD", "COME", "COOL", "COPE", "COPY", "CORE", "CORN", "COST", "CREW", "CROP",
    "DARK", "DATA", "DATE", "DAWN", "DAYS", "DEAD", "DEAL", "DEAN", "DEAR", "DEBT",
    "DEEP", "DESK", "DIAL", "DICK", "DIET", "DISC", "DISK", "DOES", "DONE", "DOOR",
    "DOSE", "DOWN", "DRAW", "DREW", "DROP", "DRUG", "DRUM", "DUAL", "DUCK", "DUKE",
    "DUST", "DUTY", "EACH", "EARN", "EASE", "EAST", "EASY", "EDGE", "ELSE", "EVEN",
    "EVER", "EVIL", "EXIT", "FACE", "FACT", "FAIL", "FAIR", "FALL", "FARM", "FAST",
    "FATE", "FEAR", "FEED", "FEEL", "FEET", "FELL", "FELT", "FILE", "FILL", "FILM",
    "FIND", "FINE", "FIRE", "FIRM", "FISH", "FIVE", "FLAT", "FLED", "FLOW", "FOLK",
    "FOOD", "FOOT", "FORD", "FORM", "FORT", "FOUR", "FREE", "FROM", "FUEL", "FULL",
    "FUND", "GAIN", "GAME", "GATE", "GAVE", "GEAR", "GENE", "GIFT", "GIRL", "GIVE",
    "GLAD", "GOAL", "GOES", "GOLD", "GOLF", "GONE", "GOOD", "GRAY", "GREW", "GREY",
    "GROW", "GULF", "HAIR", "HALF", "HALL", "HAND", "HANG", "HARD", "HARM", "HATE",
    "HAVE", "HEAD", "HEAR", "HEAT", "HELD", "HELL", "HELP", "HERE", "HERO", "HIGH",
    "HILL", "HIRE", "HOLD", "HOLE", "HOLY", "HOME", "HOPE", "HOST", "HOUR", "HUGE",
    "HUNG", "HUNT", "HURT", "IDEA", "INCH", "INTO", "IRON", "ITEM", "JACK", "JANE",
    "JEAN", "JOHN", "JOIN", "JUMP", "JURY", "JUST", "KEEN", "KEEP", "KENT", "KEPT",
    "KICK", "KILL", "KIND", "KING", "KNEE", "KNEW", "KNOW", "LACK", "LADY", "LAID",
    "LAKE", "LAND", "LANE", "LAST", "LATE", "LEAD", "LEFT", "LESS", "LIFE", "LIFT",
    "LIKE", "LINE", "LINK", "LIST", "LIVE", "LOAD", "LOAN", "LOCK", "LONG", "LOOK",
    "LORD", "LOSE", "LOSS", "LOST", "LOVE", "LUCK", "MADE", "MAIL", "MAIN", "MAKE",
    "MALE", "MANY", "MARK", "MASS", "MATE", "MATT", "MEAL", "MEAN", "MEAT", "MEET",
    "MERE", "MIKE", "MILE", "MILK", "MILL", "MIND", "MINE", "MISS", "MODE", "MOOD",
    "MOON", "MORE", "MOST", "MOVE", "MUCH", "MUST", "NAME", "NAVY", "NEAR", "NECK",
    "NEED", "NEWS", "NEXT", "NICE", "NICK", "NINE", "NONE", "NOSE", "NOTE", "OKAY"
  ],
  5: [
    "ABOUT", "ABOVE", "ABUSE", "ADMIT", "ADOPT", "ADULT", "AFTER", "AGAIN", "AGENT", "AGREE",
    "AHEAD", "ALARM", "ALBUM", "ALERT", "ALIKE", "ALIVE", "ALLOW", "ALONE", "ALONG", "ALTER",
    "ANGEL", "ANGER", "ANGLE", "ANGRY", "APART", "APPLE", "APPLY", "ARENA", "ARGUE", "ARISE",
    "ARRAY", "ASIDE", "ASSET", "AUDIO", "AVOID", "AWARD", "AWARE", "BADLY", "BAKER", "BASES",
    "BASIC", "BASIS", "BEACH", "BEGAN", "BEGIN", "BEING", "BELOW", "BENCH", "BILLY", "BIRTH",
    "BLACK", "BLAME", "BLANK", "BLIND", "BLOCK", "BLOOD", "BOARD", "BOOST", "BOOTH", "BOUND",
    "BRAIN", "BRAND", "BREAD", "BREAK", "BREED", "BRIEF", "BRING", "BROAD", "BROKE", "BROWN",
    "BUILD", "BUILT", "BUYER", "CABLE", "CALIF", "CARRY", "CATCH", "CAUSE", "CHAIN", "CHAIR",
    "CHAOS", "CHARM", "CHART", "CHASE", "CHEAP", "CHECK", "CHEST", "CHIEF", "CHILD", "CHINA",
    "CHOSE", "CIVIL", "CLAIM", "CLASS", "CLEAN", "CLEAR", "CLICK", "CLOCK", "CLOSE", "COACH",
    "COAST", "COULD", "COUNT", "COURT", "COVER", "CRACK", "CRAFT", "CRASH", "CRAZY", "CREAM",
    "CRIME", "CROSS", "CROWD", "CROWN", "CRUDE", "CYCLE", "DAILY", "DANCE", "DATED", "DEALT",
    "DEATH", "DEBUT", "DELAY", "DEPTH", "DOING", "DOUBT", "DOZEN", "DRAFT", "DRAMA", "DRANK",
    "DRAWN", "DREAM", "DRESS", "DRILL", "DRINK", "DRIVE", "DROVE", "DYING", "EAGER", "EARLY",
    "EARTH", "EIGHT", "ELITE", "EMPTY", "ENEMY", "ENJOY", "ENTER", "ENTRY", "EQUAL", "ERROR",
    "EVENT", "EVERY", "EXACT", "EXIST", "EXTRA", "FAITH", "FALSE", "FAULT", "FENCE", "FIBER",
    "FIELD", "FIFTH", "FIFTY", "FIGHT", "FINAL", "FIRST", "FIXED", "FLASH", "FLEET", "FLOOR",
    "FLUID", "FOCUS", "FORCE", "FORTH", "FORTY", "FORUM", "FOUND", "FRAME", "FRANK", "FRAUD",
    "FRESH", "FRONT", "FRUIT", "FULLY", "FUNNY", "GIANT", "GIVEN", "GLASS", "GLOBE", "GOING",
    "GRACE", "GRADE", "GRAIN", "GRAND", "GRANT", "GRASS", "GRAVE", "GREAT", "GREEN", "GROSS",
    "GROUP", "GROWN", "GUARD", "GUESS", "GUEST", "GUIDE", "HAPPY", "HARRY", "HEART", "HEAVY",
    "HENCE", "HENRY", "HORSE", "HOTEL", "HOUSE", "HUMAN", "IDEAL", "IMAGE", "INDEX", "INNER",
    "INPUT", "ISSUE", "JAPAN", "JIMMY", "JOINT", "JONES", "JUDGE", "KNOWN", "LABEL", "LARGE",
    "LASER", "LATER", "LAUGH", "LAYER", "LEARN", "LEAST", "LEAVE", "LEGAL", "LEMON", "LEVEL",
    "LEWIS", "LIGHT", "LIMIT", "LINKS", "LIVES", "LOCAL", "LOGIC", "LOOSE", "LOWER", "LUCKY",
    "LUNCH", "LYING", "MAGIC", "MAJOR", "MAKER", "MARCH", "MARIA", "MATCH", "MAYBE", "MAYOR",
    "MEANT", "MEDIA", "METAL", "MIGHT", "MINOR", "MINUS", "MIXED", "MODEL", "MONEY", "MONTH",
    "MORAL", "MOTOR", "MOUNT", "MOUSE", "MOUTH", "MOVIE", "MUSIC", "NEEDS", "NEVER", "NEWLY",
    "NIGHT", "NOISE", "NORTH", "NOTED", "NOVEL", "NURSE", "OCCUR", "OCEAN", "OFFER", "OFTEN",
    "ORDER", "OTHER", "OUGHT", "PAINT", "PANEL", "PAPER", "PARTY", "PEACE", "PETER", "PHASE"
  ],
  6: [
    "ACCEPT", "ACCESS", "ACROSS", "ACTING", "ACTION", "ACTIVE", "ACTUAL", "ADVICE", "ADVISE", "AFFECT",
    "AFFORD", "AFRAID", "AGENCY", "AGENDA", "ALMOST", "ALWAYS", "AMOUNT", "ANIMAL", "ANNUAL", "ANSWER",
    "ANYONE", "ANYWAY", "APPEAL", "APPEAR", "AROUND", "ARRIVE", "ARTIST", "ASPECT", "ASSESS", "ASSIGN",
    "ASSIST", "ASSUME", "ATTACK", "ATTEND", "AUGUST", "AUTHOR", "AVENUE", "BACKED", "BARELY", "BARREL",
    "BATTLE", "BEAUTY", "BECAME", "BECOME", "BEFORE", "BEHALF", "BEHIND", "BELIEF", "BELONG", "BERLIN",
    "BETTER", "BEYOND", "BISHOP", "BORDER", "BOTTLE", "BOTTOM", "BOUGHT", "BRANCH", "BREACH", "BREAST",
    "BREATH", "BRIDGE", "BRIGHT", "BRING", "BROKEN", "BRONZE", "BUDGET", "BUNDLE", "BURDEN", "BUREAU",
    "BUTTON", "CAMERA", "CANCER", "CANNOT", "CARBON", "CAREER", "CASTLE", "CASUAL", "CAUGHT", "CENTER",
    "CENTRE", "CENTURY", "CHAIN", "CHANCE", "CHANGE", "CHARGE", "CHOICE", "CHOOSE", "CHOSEN", "CHURCH",
    "CIRCLE", "CLIENT", "CLOSED", "CLOSER", "COFFEE", "COLUMN", "COMBAT", "COMING", "COMMON", "COMPLY",
    "COPPER", "CORNER", "COSTLY", "COUNTY", "COUPLE", "COURSE", "COVERS", "CREATE", "CREDIT", "CRISIS",
    "CUSTOM", "DAMAGE", "DANGER", "DEALER", "DEBATE", "DECADE", "DECIDE", "DEFEAT", "DEFEND", "DEFINE",
    "DEGREE", "DEMAND", "DEPEND", "DEPUTY", "DESERT", "DESIGN", "DESIRE", "DETAIL", "DETECT", "DEVICE",
    "DIFFER", "DINNER", "DIRECT", "DOCTOR", "DOLLAR", "DOMAIN", "DOUBLE", "DRIVEN", "DRIVER", "DURING",
    "EASILY", "EATING", "EDITOR", "EFFECT", "EFFORT", "EIGHTH", "EITHER", "EMERGE", "EMPIRE", "EMPLOY",
    "ENABLE", "ENDING", "ENERGY", "ENGAGE", "ENGINE", "ENOUGH", "ENSURE", "ENTIRE", "ENTITY", "EQUITY",
    "ESCAPE", "ESTATE", "ETHNIC", "EUROPE", "EVENTS", "EXCEED", "EXCEPT", "EXCESS", "EXPAND", "EXPECT",
    "EXPERT", "EXPORT", "EXTEND", "EXTENT", "FABRIC", "FACIAL", "FACTOR", "FAILED", "FAIRLY", "FALLEN",
    "FAMILY", "FAMOUS", "FATHER", "FELLOW", "FEMALE", "FIGURE", "FILING", "FINGER", "FINISH", "FISCAL",
    "FLIGHT", "FLYING", "FOLLOW", "FORCED", "FOREST", "FORGET", "FORMAL", "FORMAT", "FORMER", "FOSTER",
    "FOUGHT", "FOURTH", "FRANCE", "FRENCH", "FRIEND", "FUTURE", "GARDEN", "GATHER", "GENDER", "般AL",
    "GENTLE", "GERMAN", "GLOBAL", "GOLDEN", "GROUND", "GROWTH", "GUILTY", "HANDED", "HANDLE", "HAPPEN",
    "HARDLY", "HEADED", "HEALTH", "HEAVEN", "HEIGHT", "HIDDEN", "HOLDER", "HONEST", "IMPACT", "IMPORT",
    "INCOME", "INDEED", "INDOOR", "INDUSTRY", "INFANT", "INFORM", "INITIAL", "INJURY", "INSIDE", "INTEND",
    "INTENT", "INVEST", "ISLAND", "ITSELF", "JERSEY", "JOSEPH", "JUNIOR", "KILLED", "LABOUR", "LATEST",
    "LATTER", "LAUNCH", "LAWYER", "LEADER", "LEAGUE", "LEAVES", "LEGACY", "LENGTH", "LESSON", "LETTER",
    "LIGHTS", "LIKELY", "LINKED", "LIQUID", "LISTEN", "LITTLE", "LIVING", "LOSING", "LOWEST", "LUXURY",
    "MAINLY", "MAKING", "MANAGE", "MANNER", "MANUAL", "MARGIN", "MARINE", "MARKED", "MARKET", "MARTIN",
    "MASTER", "MATTER", "MATURE", "MEDIUM", "MEMBER", "MEMORY", "MENTAL", "MERELY", "MERGED", "METHOD"
  ]
};

// Mongolian word lists by length (Cyrillic alphabet)
const MN_WORDS = {
  4: [
    "АМЬД", "АЯГА", "БАГШ", "БАГА", "БАЯР", "БОДЬ", "БӨМБӨРЦӨГ", "БУУДАЙ", "ГАДАА", "ГАДНА",
    "ГАРАА", "ГЭГЭЭ", "ГЭМГҮЙ", "ГЭРЭЛ", "ДАВС", "ДАЛД", "ДАРГА", "ДАРС", "ДАЯА", "ДЭЭД",
    "ДЭЭШ", "ДОЛОО", "ДОРНО", "ДОТОР", "ДУРСГАЛ", "ДҮРЭМ", "ДҮҮРЭГ", "ДҮҮРЭН", "ДЭВСГЭР", "ДЭЛХИЙ",
    "ЁСОО", "ЖАГСААЛ", "ЖААЛ", "ЖИЖИГ", "ЖОЛОО", "ЖОРОО", "ЗААХ", "ЗАВСАР", "ЗАГАС", "ЗАХИА",
    "ЗӨВТГӨӨ", "ЗОЧИН", "ЗУРАГ", "ЗУРХАЙ", "ЗҮРХ", "ИДЭВХ", "ИДЭХ", "ИРГЭН", "ИРЭХ", "ИЙМЭРХҮҮ",
    "МАЛГАЙ", "МАНДАХ", "МАРТАХ", "МӨНГӨ", "МЭДЭХ", "НАМАР", "НАРАН", "НИЙГЭМ", "НИЙТ", "НИСЭХ",
    "НОХОЙ", "НОХОР", "НЭВТРЭХ", "НЭРЭЭ", "НЭХЭХ", "ӨГӨХ", "ӨДӨР", "ӨЛСӨХ", "ӨМНӨ", "ӨНГӨ",
    "ӨРГӨХ", "ӨРӨӨ", "ӨРТӨӨ", "ӨСӨХ", "ӨШӨӨ", "ОРОН", "ОРОХ", "ОРШУУЛАХ", "ОХИН", "ОЧИХ",
    "СААД", "САЙН", "САНАА", "САХИЛ", "САЯ", "СЭТГЭЛ", "ТАВАН", "ТАВИХ", "ТАЙЗ", "ТАМИР",
    "ТАРХИ", "ТАХЬ", "ТОГТОО", "ТОЛЬ", "ТОНОГ", "ТӨЛӨВ", "ТӨРӨХ", "ТУСАХ", "ТУУХ", "ТЭВЭР",
    "УВДИС", "УГААХ", "УДАХ", "УДИРДАХ", "УЗЭХ", "УЛААН", "УЛИРАЛ", "УНШАА", "УРАГ", "УРЬД",
    "УСАН", "УТГА", "УХААН", "ҮГЭЭ", "ҮДЭШ", "ҮЗЭХ", "ҮЛЭМЖ", "ҮНЭН", "ҮНЭТ", "ҮРГЭЛЖ",
    "ҮСЭГ", "ҮҮРЭГ", "ХААНА", "ХАЙХ", "ХАЛАХ", "ХАМАА", "ХАМТ", "ХАНАА", "ХАРАХ", "ХАШАА",
    "ХИЧЭЭЛ", "ХӨГЖИМ", "ХӨДӨӨ", "ХӨЛС", "ХОНОХ", "ХОРОО", "ХӨРӨНГӨ", "ХОТЫН", "ХУВЬ", "ХҮЙТЭН",
    "ХҮМҮҮС", "ХҮНДЭТ", "ХҮНСЭ", "ХҮРЭХ", "ХҮСЭЛ", "ХЭВЛЭХ", "ХЭЛЭХ", "ХЭМЖЭЭ", "ХЭРЭГ", "ХЭСЭГ",
    "ЦАГАА", "ЦАГДАА", "ЦАЙЗ", "ЦАМЦ", "ЦАСАН", "ЦАЦАХ", "ЦАХИМ", "ЦАШ", "ЦАХИЛГААН", "ЦОГЦОО",
    "ЦОХИХ", "ЦЭВЭР", "ЦЭРГИЙН", "ЦЭЭЖ", "ШАГНАЛ", "ШАЛГАХ", "ШАЛТГААН", "ШАТАХ", "ШИЙДВЭР", "ШӨНӨ",
    "ШУДАРГА", "ШУЛУУН", "ШҮЛЭГ", "ШҮҮХ", "ЭГНЭЭ", "ЭДЛЭХ", "ЭЕРЭГ", "ЭЗЭН", "ЭЛДЭВ", "ЭЛСЭХ",
    "ЭМНЭЛЭГ", "ЭМЭЭЛ", "ЭНЭ", "ЭРГЭХ", "ЭРДЭМ", "ЭРҮҮЛ", "ЭХЛЭХ", "ЭЦЭГ", "ЯДУУ", "ЯВАХ",
    "ЯВДАЛ", "ЯРУУ", "ЯРИХ", "ЯСАА", "ЮМАА", "ЮУНАА", "ЯАГААД", "ЯАСАН", "ЯМАР", "ЯЛГАА"
  ],
  5: [
    "АГААР", "АЙМАГ", "АЛБАА", "АМЖИЛТ", "АМЬТАН", "АНХААР", "АРГАА", "АЯЛАЛ", "БАГАЖ", "БААТАР",
    "БАТАЛГАА", "БАЯЖУУЛАХ", "БАРАА", "БАРИА", "БАРИМТ", "БАРУУН", "БАТЛАХ", "БИЧИГ", "БОДЛОГО", "БОЛОВСРОЛ",
    "БҮТЭЭЛ", "ГАЗАР", "ГАДААД", "ГАРААА", "ГЭРЭЭ", "ДАРАА", "ДАХИН", "ДҮРЭМ", "ДЭЛГҮҮР", "ЖАРГАЛ",
    "ЗАВСАР", "ЗАГВАР", "ЗАДГАЙ", "ЗАЛУУ", "ЗАХИРГАА", "ЗОРИЛГО", "ЗУРАГ", "ЗҮТГЭХ", "ИЖИЛ", "ИРГЭН",
    "МАНДАХ", "МӨНГӨ", "МЭДЭЭ", "НАЙРАА", "НАМАР", "НИЙГЭМ", "НӨХӨР", "НЭГДЭЛ", "НЭМЭХ", "ӨВЛИЙН",
    "ӨГӨГДӨЛ", "ӨДГӨӨ", "ӨМНӨД", "ӨНДӨР", "ӨНӨӨДӨР", "ӨРГӨН", "ӨРӨӨНД", "ӨӨРӨӨ", "ОРЛОГО", "ОРОЛЦОО",
    "ОРШИН", "ОХИН", "САЙХАН", "САЙШААЛ", "САНАЛ", "САНХҮҮ", "СУРГУУЛЬ", "СЭТГЭЛ", "ТАВАА", "ТАЛАА",
    "ТАРХИ", "ТАСАЛБАР", "ТОГТООЛ", "ТОЛГОЙ", "ТООЦОО", "ТӨЛӨВ", "ТӨРӨӨ", "ТҮВШИН", "ТУЛГА", "ТҮҮХ",
    "УДИРДАХ", "УЛААН", "УЛИРАЛ", "УНШИХ", "УРЛАГ", "УТГАА", "УХААН", "ҮГҮЙД", "ҮЗЭСГЭЛЭН", "ҮЛГЭР",
    "ҮНЭЛЭХ", "ҮРГЭЛЖ", "ҮҮРЭГ", "ХАЙЛТ", "ХАМГИЙН", "ХАРАХ", "ХАШАА", "ХИЧЭЭЛ", "ХӨГЖИЛ", "ХӨДӨЛМӨР",
    "ХОНОГ", "ХӨРӨНГӨ", "ХОТОО", "ХУВЬЦАА", "ХҮМҮҮС", "ХҮНДЭТГЭЛ", "ХҮРЭХ", "ХҮСЭЛТ", "ХЭВЛЭЛ", "ХЭЛБЭР",
    "ХЭМЖЭЭ", "ХЭРЭГ", "ХЭСЭГ", "ЦАГААН", "ЦАХИМ", "ЦОГЦОЛБОР", "ЦЭВЭР", "ШАГНАЛ", "ШАЛГАХ", "ШИЛЖИХ",
    "ШИЙДВЭР", "ШИНЖЛЭХ", "ШУДАРГА", "ШҮҮХ", "ЭДИЙН", "ЭЕЛДЭГ", "ЭЕРЭГ", "ЭЗЭМШИХ", "ЭЛДЭВ", "ЭМНЭЛЭГ",
    "ЭРДЭМ", "ЭРҮҮЛ", "ЭРЭЛТ", "ЭХЛЭХ", "ЭЦСИЙН", "ЯВДАЛ", "ЯЛГАА", "ЯРУУ", "ЯРИЛЦАХ"
  ],
  6: [
    "АГУУЛАХ", "АЙМШИГТ", "АЛБАНЫ", "АМЖИЛТАЙ", "АМЬДРАЛ", "АНХААРАХ", "АЮУЛТАЙ", "БААТАРЛАГ", "БАГИЙН", "БАТАЛГАА",
    "БАЯЛАГ", "БИЧГИЙН", "БОЛОВСОН", "БҮРТГЭЛ", "БҮТЭЭЛЧ", "ГАЗРЫН", "ГАДААД", "ГИШҮҮН", "ДАХИН", "ДЭЛГҮҮР",
    "ДЭМЖИХ", "ЖАРГАЛ", "ЗАХИРГАА", "ЗОЧЛОХ", "ЗОРИЛГО", "ЗУРААЧ", "ИРГЭНИЙ", "МЭДЭЭЛЭЛ", "НАЙМАН", "НИЙГМИЙН",
    "НӨХӨРЛӨХ", "ӨВЛИЙН", "ӨМНӨДӨД", "ӨНӨӨДӨР", "ӨӨРЧЛӨХ", "ОРШУУЛГА", "ОРОЛЦОО", "САНХҮҮГИЙН", "СУРАГЧ", "СУРГУУЛЬ",
    "ТАСАЛБАР", "ТОГТООЛ", "ТОЛГОЙ", "ТООЦОО", "ТӨЛӨВЛӨГӨӨ", "ТӨСӨӨЛӨХ", "ТҮВШИН", "ТУЛГАХ", "ТҮҮХЭН", "УДИРДАХ",
    "УНШИХ", "УРЛАГИЙН", "УТАСНЫ", "УХААГҮЙ", "ҮЙЛДВЭР", "ҮЗЭСГЭЛЭН", "ҮНЭЛГЭЭ", "ҮРГЭЛЖ", "ҮҮРЭГТЭЙ", "ХАЙЛТ",
    "ХАМГИЙН", "ХАМТРАН", "ХАРИЛЦАА", "ХАШААНД", "ХИЧЭЭЛ", "ХӨГЖЛИЙН", "ХӨДӨЛМӨР", "ХӨРӨНГӨ", "ХУВЬЦАА", "ХҮМҮҮСИЙН",
    "ХҮНДЭТГЭЛ", "ХҮСЭЛТ", "ХЭВЛЭЛИЙН", "ХЭМЖЭЭ", "ЦАГААН", "ЦАХИЛГААН", "ЦЭВЭРЛЭХ", "ШАЛГАЛТ", "ШИЛЖИХ", "ШИЙДВЭР",
    "ШИНЖЛЭХ", "ШУДАРГА", "ШҮҮХИЙН", "ЭДИЙН", "ЭЕЛДЭГ", "ЭМНЭЛЭГ", "ЭРДЭМТЭН", "ЭРҮҮЛИЙН", "ЭХЛЭЛ", "ЯВДЛЫН"
  ]
};

// Get random word from the appropriate list
const getRandomWord = (length, language) => {
  const wordList = language === "MN" ? MN_WORDS[length] : EN_WORDS[length];

  if (!wordList || wordList.length === 0) {
    // Fallback to random letters if no word list available
    const alphabet = language === "MN"
      ? "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯӨҮ"
      : "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    let secret = "";
    for (let i = 0; i < length; i++) {
      secret += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }
    return secret;
  }

  const randomIndex = Math.floor(Math.random() * wordList.length);
  return wordList[randomIndex];
};

module.exports = {
  EN_WORDS,
  MN_WORDS,
  getRandomWord,
};

#!/usr/bin/env bash
set -euo pipefail

ROOT="${1:-.}"
cd "$ROOT"

APP_FILE=$(find src -maxdepth 3 -type f \( -name 'App.jsx' -o -name 'App.js' -o -name 'App.tsx' -o -name 'App.ts' \) | head -n 1)
CSS_FILE=$(find src -maxdepth 3 -type f \( -name 'presentation.css' -o -name 'App.css' -o -name 'index.css' \) | head -n 1)

[ -n "$APP_FILE" ] || { echo "❌ App file not found"; exit 1; }
[ -n "$CSS_FILE" ] || { echo "❌ CSS file not found"; exit 1; }

STAMP=$(date +%Y%m%d-%H%M%S)
cp "$APP_FILE" "${APP_FILE}.bak-${STAMP}"
cp "$CSS_FILE" "${CSS_FILE}.bak-${STAMP}"

python3 - "$APP_FILE" "$CSS_FILE" <<'PY'
from pathlib import Path
import re
import sys

app_path = Path(sys.argv[1])
css_path = Path(sys.argv[2])

app = app_path.read_text(encoding='utf-8')
css = css_path.read_text(encoding='utf-8')

# -------------------------------------------------------------------
# Add media entries if they do not already exist
# -------------------------------------------------------------------
media_anchor = "  mutqinPng: '/branding/mutqin-logo.png',\n"
media_lines = [
    "  visionBefore: '/presentation/visualization-before.jpg',\n",
    "  visionAfter: '/presentation/visualization-after.jpg',\n",
    "  reactLogo: '/tech/react.svg',\n",
    "  flutterLogo: '/tech/flutter.svg',\n",
    "  laravelLogo: '/tech/laravel.svg',\n",
    "  mysqlLogo: '/tech/mysql.svg',\n",
]

if media_anchor in app:
    insert_block = ""
    for line in media_lines:
        key = line.split(":")[0].strip()
        if f"{key}:" not in app:
            insert_block += line
    if insert_block:
        app = app.replace(media_anchor, media_anchor + insert_block, 1)

# -------------------------------------------------------------------
# Replace only slides 13-19 functions (from AiVision to end)
# -------------------------------------------------------------------
replacement = r"""
function AiVision() {
  return (
    <Slide className="ai-vision-v5">
      <div className="ai-vision-v5__copy anim-rise">
        <Eyebrow>AI Visualization & Context-Aware Assistant</Eyebrow>
        <h2>قبل التنفيذ…<br />رؤية بصرية أوضح للقرار</h2>
        <p>
          نعرض الصورة الحقيقية قبل الإكساء، ثم تصورًا مرئيًا نهائيًا من النظام نفسه،
          مع لقطة سريعة عن دور المساعد الذكي في دعم الفهم واتخاذ القرار.
        </p>
        <div className="ai-vision-v5__chips">
          <span>Before → After</span>
          <span>Visualization</span>
          <span>AI Assistant</span>
        </div>
      </div>

      <div className="ai-vision-v5__stage anim-fade">
        <div className="vision-compare">
          <SafeImage
            src={media.visionBefore}
            alt="Before"
            className="vision-compare__image"
            fallbackClass="fallback-room"
          />
          <div className="vision-compare__after">
            <SafeImage
              src={media.visionAfter}
              alt="After"
              className="vision-compare__image"
              fallbackClass="fallback-finished"
            />
          </div>

          <span className="vision-compare__tag vision-compare__tag--before">BEFORE</span>
          <span className="vision-compare__tag vision-compare__tag--after">AI VISUALIZATION</span>
          <div className="vision-compare__handle" aria-hidden="true" />
        </div>

        <div className="ai-bubble">
          <small dir="ltr">Assistant Insight</small>
          <b>تصور بصري + شرح سياقي سريع</b>
          <p>فكرة أوضح للمالك والمهندس: النتيجة المتوقعة، المواد، والانطباع العام.</p>
        </div>
      </div>
    </Slide>
  )
}

function Nfr() {
  const nodes = [
    'Performance',
    'Security',
    'Reliability',
    'Maintainability',
    'Reusability',
    'Scalability',
  ]

  const practices = [
    'Queues',
    'RBAC',
    'Transactions',
    'Service Layer',
    'Shared Services',
    'Modular Design',
  ]

  return (
    <Slide className="nfr-v5">
      <div className="nfr-v5__copy anim-rise">
        <Eyebrow>Non-Functional Requirements</Eyebrow>
        <h2>الجودة ليست شعارًا…<br />بل قرارات تصميم</h2>
        <p>
          ركزنا على الأداء، الأمان، الاعتمادية، قابلية الصيانة وإعادة الاستخدام
          من خلال بنية واضحة واختيارات تقنية قابلة للتوسع.
        </p>
      </div>

      <div className="nfr-v5__orbit anim-fade">
        <div className="nfr-v5__core">Quality</div>
        {nodes.map((node, index) => (
          <div
            key={node}
            className={`nfr-v5__node nfr-v5__node--${index + 1}`}
            dir="ltr"
          >
            {node}
          </div>
        ))}
      </div>

      <div className="nfr-v5__practices" dir="ltr">
        {practices.map((item) => <span key={item}>{item}</span>)}
      </div>
    </Slide>
  )
}

function Process() {
  const sprints = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8']
  const releases = ['Foundation', 'Operations', 'AI & Testing']

  return (
    <Slide className="process-v5">
      <div className="process-v5__visual anim-fade">
        <SafeImage
          src={media.team}
          alt="جلسة تخطيط الفريق"
          className="process-v5__image"
          fallbackClass="fallback-team"
        />
        <div className="process-v5__overlay" />
      </div>

      <div className="process-v5__copy anim-rise">
        <Eyebrow>Agile Process Model</Eyebrow>
        <h2>بناء تدريجي…<br />وتسليمات متتابعة</h2>

        <div className="process-v5__sprints" dir="ltr">
          {sprints.map((item) => <span key={item}>{item}</span>)}
        </div>

        <div className="process-v5__releases" dir="ltr">
          {releases.map((item) => <b key={item}>{item}</b>)}
        </div>
      </div>
    </Slide>
  )
}

function Architecture() {
  const clients = [
    [media.reactLogo, 'React Web', 'Dashboard'],
    [media.flutterLogo, 'Flutter Assistant', 'Field App'],
    [media.flutterLogo, 'Flutter Owner', 'Owner App'],
  ]

  return (
    <Slide className="architecture-v5">
      <div className="architecture-v5__copy anim-rise">
        <Eyebrow>Client–Server Architecture</Eyebrow>
        <h2>ثلاث واجهات أمامية…<br />ومنظومة خلفية واحدة</h2>
      </div>

      <div className="architecture-v5__board anim-fade" dir="ltr">
        <div className="architecture-v5__clients">
          {clients.map(([src, title, sub]) => (
            <article key={title} className="tech-tile">
              <SafeImage src={src} alt={title} className="tech-tile__logo" />
              <div>
                <b>{title}</b>
                <span>{sub}</span>
              </div>
            </article>
          ))}
        </div>

        <div className="architecture-v5__api">
          <small>HTTPS / JSON</small>
          <strong>REST API</strong>
        </div>

        <div className="architecture-v5__backend">
          <article className="backend-tile">
            <SafeImage src={media.laravelLogo} alt="Laravel" className="tech-tile__logo" />
            <div>
              <b>Laravel</b>
              <span>Application Layer</span>
            </div>
          </article>

          <article className="backend-tile backend-tile--stack">
            <div className="backend-stack__pill">Controllers</div>
            <div className="backend-stack__pill">Services</div>
            <div className="backend-stack__pill">Models</div>
          </article>

          <article className="backend-tile">
            <SafeImage src={media.mysqlLogo} alt="MySQL" className="tech-tile__logo" />
            <div>
              <b>MySQL</b>
              <span>Data Layer</span>
            </div>
          </article>
        </div>
      </div>

      <div className="architecture-v5__stats" dir="ltr">
        <span>32 Entities</span>
        <span>30 Services</span>
        <span>~124 Endpoints</span>
      </div>
    </Slide>
  )
}

function Challenges() {
  const items = [
    [
      'جمع المتطلبات',
      'Requirements Elicitation',
      media.team,
      'صعوبة تحويل خبرات المجال غير الموثقة إلى متطلبات دقيقة قابلة للتنفيذ.',
    ],
    [
      'اختلاف القياس',
      'Measurement Strategies',
      media.blueprint,
      'كل بند في الإكساء يحتاج طريقة قياس مختلفة، لذلك صممنا محركًا متعدد الاستراتيجيات.',
    ],
    [
      'ثبات مخرجات AI',
      'AI Reliability',
      media.inspection,
      'فرضنا بنية مخرجات واضحة وتحققًا برمجيًا قبل اعتماد النتيجة أو عرضها.',
    ],
  ]

  return (
    <Slide className="challenges-v5">
      <div className="challenges-v5__copy anim-rise">
        <Eyebrow>Challenges</Eyebrow>
        <h2>ثلاثة تحديات صنعت<br />جوهر النظام</h2>
      </div>

      <div className="challenges-v5__grid">
        {items.map(([ar, en, img, desc], index) => (
          <article
            key={en}
            className="challenge-card-v5 anim-fade"
            style={{ animationDelay: `${index * 140}ms` }}
          >
            <SafeImage
              src={img}
              alt={ar}
              className="challenge-card-v5__image"
              fallbackClass="fallback-inspection"
            />
            <div className="challenge-card-v5__overlay" />
            <div className="challenge-card-v5__content">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <small dir="ltr">{en}</small>
              <b>{ar}</b>
              <p>{desc}</p>
            </div>
          </article>
        ))}
      </div>
    </Slide>
  )
}

function Testing() {
  const examples = [
    'Role Authorization',
    'Invalid Approval Guard',
    'Start Project Preconditions',
  ]

  return (
    <Slide className="testing-v5">
      <div className="testing-v5__number anim-rise" dir="ltr">
        <strong>35</strong>
        <span>Documented Test Cases</span>
      </div>

      <div className="testing-v5__copy anim-rise">
        <Eyebrow>Testing Phase</Eyebrow>
        <h2>الاختبار لم يكن خطوة أخيرة…<br />بل طبقة ثقة</h2>

        <div className="testing-v5__levels" dir="ltr">
          <article>
            <b>Unit</b>
            <span>Services & Core Logic</span>
          </article>
          <article>
            <b>Integration</b>
            <span>Frontends ↔ API</span>
          </article>
          <article>
            <b>Black-Box</b>
            <span>Real User Flows</span>
          </article>
        </div>
      </div>

      <div className="testing-v5__examples" dir="ltr">
        {examples.map((item) => <span key={item}>{item}</span>)}
      </div>
    </Slide>
  )
}

function Closing() {
  const outcomes = [
    ['الإنجاز', 'موثّق ومعتمد'],
    ['المواد', 'تقدير مدعوم بالبيانات'],
    ['الموازنة', 'متابعة أثناء التنفيذ'],
    ['الجودة', 'قرار مدعوم بالذكاء الاصطناعي'],
  ]

  return (
    <Slide className="closing-v5">
      <SafeImage
        src={media.finished}
        alt="مشروع مكتمل"
        className="closing-v5__bg"
        fallbackClass="fallback-finished"
      />
      <div className="closing-v5__scrim" />

      <div className="closing-v5__content anim-rise">
        <MutqinLogo className="closing-v5__logo" />
        <Eyebrow>Conclusion</Eyebrow>
        <h2>من خبرة متفرقة…<br />إلى قرار مؤسسي قابل للقياس</h2>

        <div className="closing-v5__grid">
          {outcomes.map(([title, value]) => (
            <article key={title}>
              <b>{title}</b>
              <span>{value}</span>
            </article>
          ))}
        </div>

        <p className="closing-v5__thanks">شكراً لإصغائكم</p>
      </div>
    </Slide>
  )
}
"""

pattern = re.compile(r"function AiVision\(\)\s*\{.*\Z", re.S)
if not pattern.search(app):
    raise SystemExit("❌ Could not find function AiVision() to replace. Send me App file name/content if your structure is different.")

app = pattern.sub(replacement.strip() + "\n", app)
app_path.write_text(app, encoding='utf-8')

# -------------------------------------------------------------------
# Append or replace scoped CSS block
# -------------------------------------------------------------------
block = r"""
/* === slides 13-19 polish start === */
.slide .anim-rise,
.slide .anim-fade {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity .65s ease, transform .65s ease;
}
.slide.is-active .anim-rise,
.slide.is-active .anim-fade {
  opacity: 1;
  transform: none;
}

.ai-vision-v5,
.nfr-v5,
.process-v5,
.architecture-v5,
.challenges-v5,
.testing-v5,
.closing-v5 {
  position: relative;
  overflow: hidden;
}

.ai-vision-v5 {
  display: grid;
  grid-template-columns: minmax(320px, 1.05fr) minmax(420px, 1.2fr);
  gap: clamp(1.5rem, 2.4vw, 3rem);
  align-items: center;
  padding: clamp(2.5rem, 4vw, 4rem);
}

.ai-vision-v5__copy h2,
.nfr-v5__copy h2,
.process-v5__copy h2,
.architecture-v5__copy h2,
.challenges-v5__copy h2,
.testing-v5__copy h2,
.closing-v5__content h2 {
  font-size: clamp(2.4rem, 5vw, 5.1rem);
  line-height: 1.08;
  margin: .2rem 0 1rem;
}

.ai-vision-v5__copy p,
.nfr-v5__copy p,
.process-v5__copy p,
.testing-v5__copy p {
  max-width: 44ch;
  color: rgba(28, 38, 36, .72);
  font-size: clamp(.98rem, 1.3vw, 1.18rem);
  line-height: 1.9;
}

.ai-vision-v5__chips,
.architecture-v5__stats,
.testing-v5__examples,
.nfr-v5__practices {
  display: flex;
  flex-wrap: wrap;
  gap: .7rem;
  margin-top: 1rem;
}

.ai-vision-v5__chips span,
.architecture-v5__stats span,
.testing-v5__examples span,
.nfr-v5__practices span {
  padding: .72rem 1rem;
  border-radius: 999px;
  background: rgba(255,255,255,.86);
  border: 1px solid rgba(28,38,36,.08);
  box-shadow: 0 14px 30px rgba(28,38,36,.06);
  font-size: .78rem;
  font-weight: 900;
  color: var(--ink);
}

.ai-vision-v5__stage {
  position: relative;
}

.vision-compare {
  position: relative;
  aspect-ratio: 1.2 / 1;
  min-height: 380px;
  border-radius: 30px;
  overflow: hidden;
  box-shadow: 0 26px 64px rgba(28,38,36,.12);
  background: #ddd6c8;
}

.vision-compare__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.vision-compare__after {
  position: absolute;
  inset: 0;
  width: 58%;
  overflow: hidden;
  animation: visionReveal 5s ease-in-out infinite alternate;
}

.vision-compare__tag {
  position: absolute;
  top: 18px;
  padding: .55rem .8rem;
  border-radius: 999px;
  font-size: .7rem;
  font-weight: 900;
  letter-spacing: .08em;
  background: rgba(17,25,23,.82);
  color: #fff;
  z-index: 3;
}
.vision-compare__tag--before { left: 18px; }
.vision-compare__tag--after {
  right: 18px;
  background: rgba(201,154,70,.95);
  color: var(--ink);
}

.vision-compare__handle {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 58%;
  width: 4px;
  background: #fff;
  box-shadow: 0 0 0 1px rgba(17,25,23,.1);
  animation: visionHandle 5s ease-in-out infinite alternate;
}
.vision-compare__handle::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 12px 30px rgba(17,25,23,.18);
}

.ai-bubble {
  position: absolute;
  right: -12px;
  bottom: 18px;
  max-width: 260px;
  padding: 1rem 1rem 1.05rem;
  border-radius: 24px;
  background: rgba(255,253,250,.92);
  border: 1px solid rgba(28,38,36,.08);
  box-shadow: 0 18px 40px rgba(28,38,36,.08);
  backdrop-filter: blur(10px);
}
.ai-bubble small {
  display: block;
  color: var(--gold);
  font-weight: 900;
  letter-spacing: .08em;
  margin-bottom: .35rem;
}
.ai-bubble b {
  display: block;
  margin-bottom: .35rem;
  font-size: 1.03rem;
}
.ai-bubble p {
  margin: 0;
  color: rgba(28,38,36,.72);
  line-height: 1.7;
  font-size: .9rem;
}

.nfr-v5 {
  padding: clamp(2.5rem, 4vw, 4rem);
}
.nfr-v5__copy {
  max-width: 48ch;
}
.nfr-v5__orbit {
  position: relative;
  height: min(54vh, 520px);
  margin-top: 1.5rem;
}
.nfr-v5__core {
  position: absolute;
  left: 50%;
  top: 52%;
  transform: translate(-50%, -50%);
  width: 170px;
  height: 170px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--ink);
  color: #fff;
  font-size: 1.2rem;
  font-weight: 900;
  box-shadow: 0 20px 50px rgba(17,25,23,.16);
}
.nfr-v5__orbit::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 52%;
  transform: translate(-50%, -50%);
  width: min(60vw, 640px);
  height: min(60vw, 640px);
  border-radius: 50%;
  border: 1px dashed rgba(28,38,36,.14);
}
.nfr-v5__node {
  position: absolute;
  left: 50%;
  top: 52%;
  padding: .85rem 1.1rem;
  border-radius: 999px;
  background: rgba(255,255,255,.92);
  border: 1px solid rgba(28,38,36,.08);
  font-weight: 900;
  box-shadow: 0 12px 30px rgba(28,38,36,.06);
}
.nfr-v5__node--1 { transform: translate(-50%, -245px); }
.nfr-v5__node--2 { transform: translate(160px, -145px); }
.nfr-v5__node--3 { transform: translate(180px, 82px); }
.nfr-v5__node--4 { transform: translate(-50%, 210px); }
.nfr-v5__node--5 { transform: translate(-310px, 90px); }
.nfr-v5__node--6 { transform: translate(-285px, -145px); }

.process-v5 {
  display: grid;
  grid-template-columns: 1.02fr 1fr;
  gap: clamp(1.5rem, 2.4vw, 3rem);
  padding: clamp(2.5rem, 4vw, 4rem);
  align-items: stretch;
}
.process-v5__visual {
  position: relative;
  border-radius: 32px;
  overflow: hidden;
  box-shadow: 0 22px 60px rgba(28,38,36,.12);
  min-height: 480px;
}
.process-v5__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.process-v5__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(0deg, rgba(17,25,23,.68), rgba(17,25,23,.16));
}
.process-v5__copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.process-v5__sprints {
  display: grid;
  grid-template-columns: repeat(4, minmax(88px, 1fr));
  gap: .8rem;
  margin-top: 1.4rem;
}
.process-v5__sprints span {
  padding: 1rem 1.1rem;
  border-radius: 18px;
  background: rgba(255,255,255,.86);
  border: 1px solid rgba(28,38,36,.08);
  font-size: 1rem;
  font-weight: 900;
  text-align: center;
  box-shadow: 0 12px 28px rgba(28,38,36,.06);
}
.process-v5__releases {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: .8rem;
  margin-top: 1rem;
}
.process-v5__releases b {
  padding: 1rem 1rem;
  border-radius: 18px;
  background: var(--ink);
  color: #fff;
  text-align: center;
  font-size: .85rem;
  letter-spacing: .03em;
}

.architecture-v5 {
  padding: clamp(2.5rem, 4vw, 4rem);
}
.architecture-v5__board {
  display: grid;
  grid-template-columns: 1fr 180px 1fr;
  gap: 1.1rem;
  align-items: center;
  margin-top: 2rem;
}
.architecture-v5__clients,
.architecture-v5__backend {
  display: grid;
  gap: .9rem;
}
.tech-tile,
.backend-tile {
  display: flex;
  align-items: center;
  gap: .9rem;
  padding: 1rem 1.1rem;
  border-radius: 24px;
  background: rgba(255,255,255,.88);
  border: 1px solid rgba(28,38,36,.08);
  box-shadow: 0 14px 34px rgba(28,38,36,.06);
}
.backend-tile--stack {
  justify-content: center;
  flex-wrap: wrap;
}
.tech-tile__logo {
  width: 52px;
  height: 52px;
  object-fit: contain;
  flex: none;
}
.tech-tile b,
.backend-tile b {
  display: block;
  font-size: 1rem;
}
.tech-tile span,
.backend-tile span {
  display: block;
  color: rgba(28,38,36,.62);
  font-size: .78rem;
  font-weight: 800;
}
.architecture-v5__api {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 180px;
  border-radius: 28px;
  background: linear-gradient(135deg, var(--gold-soft), var(--gold));
  color: var(--ink);
  box-shadow: 0 18px 44px rgba(201,154,70,.24);
}
.architecture-v5__api small {
  font-weight: 900;
  letter-spacing: .08em;
}
.architecture-v5__api strong {
  font-size: 1.45rem;
  margin-top: .35rem;
}
.backend-stack__pill {
  padding: .45rem .75rem;
  border-radius: 999px;
  background: rgba(17,25,23,.06);
  font-size: .72rem;
  font-weight: 900;
}

.challenges-v5 {
  padding: clamp(2.5rem, 4vw, 4rem);
}
.challenges-v5__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}
.challenge-card-v5 {
  position: relative;
  min-height: 410px;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 22px 60px rgba(28,38,36,.12);
}
.challenge-card-v5__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.challenge-card-v5__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(17,25,23,.16), rgba(17,25,23,.86));
}
.challenge-card-v5__content {
  position: absolute;
  inset: auto 0 0 0;
  padding: 1.2rem 1.2rem 1.35rem;
  color: #fff;
}
.challenge-card-v5__content span {
  display: inline-flex;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  background: rgba(201,154,70,.95);
  color: var(--ink);
  font-weight: 900;
  margin-bottom: .65rem;
}
.challenge-card-v5__content small {
  display: block;
  opacity: .74;
  font-size: .78rem;
  font-weight: 900;
  letter-spacing: .05em;
}
.challenge-card-v5__content b {
  display: block;
  font-size: 1.55rem;
  margin: .2rem 0 .35rem;
}
.challenge-card-v5__content p {
  margin: 0;
  line-height: 1.8;
  color: rgba(255,255,255,.84);
  font-size: .95rem;
}

.testing-v5 {
  padding: clamp(2.5rem, 4vw, 4rem);
}
.testing-v5__number strong {
  display: block;
  font-size: clamp(7rem, 18vw, 14rem);
  line-height: .8;
  color: var(--gold);
  letter-spacing: -.08em;
}
.testing-v5__number span {
  display: block;
  font-size: .85rem;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: rgba(28,38,36,.58);
  font-weight: 900;
}
.testing-v5__copy {
  margin-top: 1rem;
}
.testing-v5__levels {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  margin-top: 1.4rem;
}
.testing-v5__levels article {
  padding: 1.15rem 1rem;
  border-radius: 24px;
  background: rgba(255,255,255,.88);
  border: 1px solid rgba(28,38,36,.08);
  box-shadow: 0 14px 34px rgba(28,38,36,.06);
}
.testing-v5__levels b {
  display: block;
  font-size: 1.15rem;
  margin-bottom: .35rem;
}
.testing-v5__levels span {
  display: block;
  color: rgba(28,38,36,.62);
  font-size: .86rem;
  font-weight: 800;
}
.testing-v5__examples {
  margin-top: 1rem;
}

.closing-v5 {
  padding: 0;
  display: grid;
  place-items: center;
}
.closing-v5__bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.closing-v5__scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(17,25,23,.74), rgba(17,25,23,.74));
}
.closing-v5__content {
  position: relative;
  z-index: 1;
  width: min(1080px, 88vw);
  text-align: center;
  color: #fff;
  padding: 4rem 0;
}
.closing-v5__logo .mutqin-logo {
  width: 88px;
  height: 88px;
  margin: 0 auto 1rem;
}
.closing-v5__content .eyebrow {
  color: rgba(255,255,255,.7);
}
.closing-v5__content h2 {
  color: #fff;
  margin-bottom: 1.6rem;
}
.closing-v5__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
  margin: 1.5rem 0 1.2rem;
}
.closing-v5__grid article {
  padding: 1.05rem;
  border-radius: 22px;
  background: rgba(255,255,255,.10);
  border: 1px solid rgba(255,255,255,.14);
  backdrop-filter: blur(10px);
}
.closing-v5__grid b {
  display: block;
  font-size: 1.05rem;
  margin-bottom: .25rem;
}
.closing-v5__grid span {
  display: block;
  color: rgba(255,255,255,.78);
  font-size: .88rem;
  line-height: 1.7;
}
.closing-v5__thanks {
  font-size: 1.1rem;
  font-weight: 900;
  color: var(--gold-soft);
}

@keyframes visionReveal {
  0% { width: 32%; }
  50% { width: 58%; }
  100% { width: 76%; }
}
@keyframes visionHandle {
  0% { left: 32%; }
  50% { left: 58%; }
  100% { left: 76%; }
}

@media (max-width: 1100px) {
  .ai-vision-v5,
  .process-v5,
  .architecture-v5__board {
    grid-template-columns: 1fr;
  }

  .architecture-v5__api {
    min-height: 120px;
  }

  .challenges-v5__grid,
  .testing-v5__levels,
  .closing-v5__grid {
    grid-template-columns: 1fr 1fr;
  }

  .nfr-v5__node--1 { transform: translate(-50%, -195px); }
  .nfr-v5__node--2 { transform: translate(125px, -108px); }
  .nfr-v5__node--3 { transform: translate(145px, 62px); }
  .nfr-v5__node--4 { transform: translate(-50%, 175px); }
  .nfr-v5__node--5 { transform: translate(-245px, 70px); }
  .nfr-v5__node--6 { transform: translate(-220px, -108px); }
}

@media (max-width: 720px) {
  .ai-vision-v5,
  .nfr-v5,
  .process-v5,
  .architecture-v5,
  .challenges-v5,
  .testing-v5 {
    padding: 1.5rem;
  }

  .vision-compare { min-height: 280px; }
  .ai-bubble {
    position: static;
    margin-top: 1rem;
    max-width: none;
  }

  .process-v5__sprints {
    grid-template-columns: repeat(2, 1fr);
  }

  .process-v5__releases,
  .challenges-v5__grid,
  .testing-v5__levels,
  .closing-v5__grid {
    grid-template-columns: 1fr;
  }

  .nfr-v5__orbit {
    height: 540px;
  }
  .nfr-v5__orbit::before {
    width: 92vw;
    height: 92vw;
    max-width: 360px;
    max-height: 360px;
  }
  .nfr-v5__core {
    width: 120px;
    height: 120px;
    font-size: 1rem;
  }
  .nfr-v5__node {
    font-size: .72rem;
    padding: .7rem .85rem;
  }
  .nfr-v5__node--1 { transform: translate(-50%, -180px); }
  .nfr-v5__node--2 { transform: translate(86px, -104px); }
  .nfr-v5__node--3 { transform: translate(95px, 42px); }
  .nfr-v5__node--4 { transform: translate(-50%, 150px); }
  .nfr-v5__node--5 { transform: translate(-180px, 42px); }
  .nfr-v5__node--6 { transform: translate(-170px, -104px); }

  .architecture-v5__board {
    margin-top: 1.2rem;
  }

  .testing-v5__number strong {
    font-size: 5.5rem;
  }

  .closing-v5__content {
    width: min(92vw, 92vw);
    padding: 3rem 0;
  }
}
/* === slides 13-19 polish end === */
"""

start_marker = "/* === slides 13-19 polish start === */"
end_marker = "/* === slides 13-19 polish end === */"

if start_marker in css and end_marker in css:
    css = re.sub(
        re.escape(start_marker) + r".*?" + re.escape(end_marker),
        block.strip(),
        css,
        flags=re.S,
    )
else:
    css += "\n" + block

css_path.write_text(css, encoding='utf-8')

print(f"✅ Patched: {app_path}")
print(f"✅ Patched: {css_path}")
PY

echo
echo "✅ Done. Backups created."
echo "   App: $APP_FILE.bak-$STAMP"
echo "   CSS: $CSS_FILE.bak-$STAMP"
echo
echo "Now run:"
echo "  npm run dev"

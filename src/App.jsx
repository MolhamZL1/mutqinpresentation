import { useEffect, useMemo, useRef, useState } from 'react'

const media = {
  unfinished: '/presentation/unfinished-room.jpg',
  blueprint: '/presentation/blueprint.jpg',
  inspection: '/presentation/site-inspection.jpg',
  materials: '/presentation/materials.jpg',
  finished: '/presentation/finished-room.jpg',
  team: '/presentation/team-planning.jpg',
  university: '/branding/damascus-university-logo.png',
  universitySvg: '/branding/damascus-university-logo.svg',
  mutqin: '/branding/mutqin-logo.svg',
  mutqinPng: '/branding/mutqin-logo.png',
  visionBefore: '/presentation/visualization-before.jpg',
  visionAfter: '/presentation/visualization-after.jpg',
  reactLogo: '/tech/react.svg',
  flutterLogo: '/tech/flutter.svg',
  laravelLogo: '/tech/laravel.svg',
  mysqlLogo: '/tech/mysql.svg',
  web: '/product/web-dashboard.png',
  assistant: '/product/assistant-mobile.jpg',
  owner: '/product/owner-mobile.jpg',
}

const sections = [
  { k: 'cover', section: 'مُتقِن', en: 'Opening' },
  { k: 'why', section: 'سبب الاختيار', en: 'Why this project?' },
  { k: 'questions', section: 'الأسئلة الأربعة', en: 'Four questions' },
  { k: 'overview', section: 'نظرة عامة', en: 'System overview' },
  { k: 'requirements', section: 'جمع المتطلبات', en: 'Requirements elicitation' },
  { k: 'gap', section: 'الفجوة', en: 'Specialized gap' },
  { k: 'lifecycle', section: 'دورة الحياة', en: 'Project lifecycle' },
  { k: 'approval', section: 'اعتماد الإنجاز', en: 'Verified progress' },
  { k: 'strategy', section: 'حساب الإنجاز', en: 'Multi-strategy engine' },
  { k: 'estimation', section: 'التقدير', en: 'Parametric estimation' },
  { k: 'cost', section: 'الكلفة', en: 'Cost control' },
  { k: 'ai-inspection', section: 'الفحص البصري', en: 'AI visual inspection' },
  { k: 'ai-vision', section: 'التصور والمساعد', en: 'AI visualization & assistant' },
  { k: 'nfr', section: 'المتطلبات غير الوظيفية', en: 'Non-functional requirements' },
  { k: 'process', section: 'نموذج العمل', en: 'Agile process' },
  { k: 'architecture', section: 'البنية المعمارية', en: 'Architecture' },
  { k: 'challenges', section: 'التحديات', en: 'Challenges' },
  { k: 'testing', section: 'الاختبار', en: 'Testing phase' },
  { k: 'closing', section: 'الخاتمة', en: 'Conclusion' },
]

function useSlideNavigation(total) {
  const [index, setIndex] = useState(0)
  const touchStart = useRef(null)
  const wheelLock = useRef(false)

  const goTo = (value) => setIndex(Math.max(0, Math.min(total - 1, value)))
  const next = () => goTo(index + 1)
  const prev = () => goTo(index - 1)

  useEffect(() => {
    const onKey = (event) => {
      const key = event.key.toLowerCase()
      if (['arrowright', 'arrowdown', ' ', 'pagedown'].includes(key)) {
        event.preventDefault(); next()
      }
      if (['arrowleft', 'arrowup', 'pageup'].includes(key)) {
        event.preventDefault(); prev()
      }
      if (key === 'home') goTo(0)
      if (key === 'end') goTo(total - 1)
      if (key === 'f') {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen?.()
        else document.exitFullscreen?.()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, total])

  useEffect(() => {
    const onWheel = (event) => {
      if (Math.abs(event.deltaY) < 40 || wheelLock.current) return
      wheelLock.current = true
      event.deltaY > 0 ? next() : prev()
      window.setTimeout(() => { wheelLock.current = false }, 680)
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    return () => window.removeEventListener('wheel', onWheel)
  }, [index])

  const swipeHandlers = {
    onTouchStart: (event) => { touchStart.current = event.touches[0]?.clientX ?? null },
    onTouchEnd: (event) => {
      if (touchStart.current === null) return
      const diff = touchStart.current - (event.changedTouches[0]?.clientX ?? touchStart.current)
      if (Math.abs(diff) > 56) diff > 0 ? next() : prev()
      touchStart.current = null
    },
  }

  return { index, goTo, next, prev, swipeHandlers }
}

export default function App() {
  const { index, goTo, next, prev, swipeHandlers } = useSlideNavigation(sections.length)
  const current = sections[index]
  const progress = ((index + 1) / sections.length) * 100


  useEffect(() => {
    const slideElements = Array.from(document.querySelectorAll('.slides > .slide'))

    slideElements.forEach((slide, slideIndex) => {
      const isActive = slideIndex === index
      slide.classList.toggle('is-active', isActive)

      if (isActive) {
        slide.setAttribute('data-activated', String(Date.now()))
      }
    })
  }, [index])

  return (
    <main className="deck" dir="rtl" {...swipeHandlers}>
      <div className="soft-grid" />
      <Header current={current} index={index} total={sections.length} progress={progress} />
      <div className="slides" style={{ transform: `translateX(${index * 100}vw)` }}>
        <Cover />
        <Problem />
        <Questions />
        <Overview />
        <Requirements />
        <SystemsGap />
        <Lifecycle />
        <VerifiedProgress />
        <Strategy />
        <Estimation />
        <CostControl />
        <AiInspection />
        <AiVision />
        <Nfr />
        <Process />
        <Architecture />
        <Challenges />
        <Testing />
        <Closing />
      </div>
      <Controls index={index} total={sections.length} goTo={goTo} next={next} prev={prev} />
    </main>
  )
}

function Header({ current, index, total, progress }) {
  return (
    <header className="topbar">
      <div className="progress"><i style={{ width: `${progress}%` }} /></div>
      <div className="topbar__section">
        <span>{String(index + 1).padStart(2, '0')}</span>
        <b>{current.section}</b>
        <small>{current.en}</small>
      </div>
      <div className="counter">{index + 1}/{total}</div>
    </header>
  )
}

function Controls({ index, total, goTo, next, prev }) {
  return (
    <nav className="controls" aria-label="Slide navigation">
      <button type="button" onClick={prev} disabled={index === 0}>‹</button>
      <div className="dots">
        {Array.from({ length: total }).map((_, i) => (
          <button key={i} type="button" className={i === index ? 'active' : ''} onClick={() => goTo(i)} aria-label={`slide ${i + 1}`} />
        ))}
      </div>
      <button type="button" onClick={next} disabled={index === total - 1}>›</button>
    </nav>
  )
}

function Slide({ className = '', children }) {
  return <section className={`slide ${className}`}>{children}</section>
}

function SafeImage({ src, alt = '', className = '', fallbackClass = '' }) {
  const [failed, setFailed] = useState(false)
  if (failed) return <div className={`image-fallback ${fallbackClass}`} aria-hidden="true" />
  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} draggable="false" />
}

function UniversityLogo() {
  return (
    <picture>
      <source srcSet={media.universitySvg} type="image/svg+xml" />
      <SafeImage src={media.university} alt="جامعة دمشق" className="uni-logo" />
    </picture>
  )
}

function MutqinLogo({ className = '' }) {
  return (
    <picture className={`mutqin-logo-picture ${className}`}>
      <source srcSet="/branding/mutqin-logo.svg" type="image/svg+xml" />
      <img src="/branding/mutqin-logo.png" alt="متقن" className="mutqin-logo" />
    </picture>
  )
}

function Eyebrow({ children }) {
  return <p className="eyebrow">{children}</p>
}

function BigTitle({ ar, en, compact = false }) {
  return (
    <div className={compact ? 'title title--compact' : 'title'}>
      <h2>{ar}</h2>
      {en ? <p dir="ltr">{en}</p> : null}
    </div>
  )
}

function Cover() {
  return (
    <Slide className="cover cover-v4">
      <div className="cover-v4__center">
        <MutqinLogo className="cover-v4__logo" />
        <p className="cover-v4__subtitle" dir="ltr">
          AI-Powered Finishing & Construction Operations
        </p>

        <div className="cover-v4__people">
          حسام زينه · ملهم الشيخ علي · وئام سالم · عبد الرحمن السعدي · عمار حمود
        </div>

        <div className="cover-v4__meta">
          جامعة دمشق · كلية الهندسة المعلوماتية
        </div>
      </div>
    </Slide>
  )
}

function Problem() {
  return (
    <Slide className="problem-v4">
      <div className="problem-v4__visual">
        <SafeImage
          src={media.unfinished}
          className="problem-v4__image"
          fallbackClass="fallback-room"
          alt="شقة قيد التشطيب"
        />
        <div className="problem-v4__photo-tag">شقة قيد التشطيب</div>
      </div>

      <div className="problem-v4__copy">
        <div className="problem-v4__number" dir="ltr">60%</div>
        <Eyebrow>من أين جاء هذا الرقم؟</Eyebrow>
        <h2>نسبة إنجاز<br />بلا دليل موثّق</h2>
        <p>تقدير شخصي لا يمكن للشركة أو المالك التحقق منه.</p>
      </div>
    </Slide>
  )
}

function Questions() {
  const items = [
    ['Progress', 'ما نسبة الإنجاز اليوم؟'],
    ['Materials', 'كم نحتاج من مواد؟'],
    ['Budget', 'هل تجاوزنا الموازنة؟'],
    ['Quality', 'من تحقق من الجودة؟'],
  ]
  return (
    <Slide className="questions">
      <BigTitle ar="أربعة أسئلة" en="Four questions shaped the product" />
      <div className="question-grid">
        {items.map(([en, ar], idx) => <QuestionCard key={en} idx={idx + 1} en={en} ar={ar} />)}
      </div>
    </Slide>
  )
}

function QuestionCard({ idx, en, ar }) {
  return (
    <article className="q-card">
      <b>{String(idx).padStart(2, '0')}</b>
      <span dir="ltr">{en}</span>
      <h3>{ar}</h3>
    </article>
  )
}

function Overview() {
  return (
    <Slide className="overview-v6">
      <div className="overview-v6__copy anim-rise">
        <Eyebrow>System Overview</Eyebrow>
        <h2>منصة واحدة<br />لثلاث تجارب استخدام....</h2>
        
      </div>

      <div className="overview-v6__mockups anim-fade" dir="ltr">
        <div className="ipad-mockup">
          <div className="ipad-mockup__bar">
            <span />
            <b>Web Dashboard</b>
          </div>
          <div className="ipad-mockup__screen">
            <SafeImage src={media.web} alt="Web dashboard" className="mockup-image" fallbackClass="fallback-ui" />
          </div>
        </div>

        <div className="phone-mockup phone-mockup--assistant">
          <div className="phone-mockup__speaker" />
          <div className="phone-mockup__screen">
            <SafeImage src={media.assistant} alt="Assistant app" className="mockup-image" fallbackClass="fallback-ui" />
          </div>
          <b>Assistant</b>
        </div>

        <div className="phone-mockup phone-mockup--owner">
          <div className="phone-mockup__speaker" />
          <div className="phone-mockup__screen">
            <SafeImage src={media.owner} alt="Owner app" className="mockup-image" fallbackClass="fallback-ui" />
          </div>
          <b>Owner</b>
        </div>
      </div>
    </Slide>
  )
}

function Device({ type, src, label }) {
  return (
    <div className={`device ${type}`}>
      <div className="device__screen"><SafeImage src={src} fallbackClass="fallback-ui" /></div>
      <strong dir="ltr">{label}</strong>
    </div>
  )
}

function Requirements() {
  return (
    <Slide className="requirements split-photo">
      <div className="split-photo__visual">
        <SafeImage src={media.team} className="full-photo" fallbackClass="fallback-team" />
      </div>
      <div className="split-photo__content">
        <Eyebrow>Requirements Elicitation</Eyebrow>
        <BigTitle ar="المتطلبات من أرض الواقع" en="Interviews · Field Visits · Related Work" compact />
        <div className="chips">
          <span>زيارات ميدانية</span><span>مقابلات</span><span>Procore</span><span>Buildertrend</span><span>SAP</span><span>Autodesk</span>
        </div>
      </div>
    </Slide>
  )
}

function SystemsGap() {
  const platforms = ['Procore', 'Buildertrend', 'SAP', 'Autodesk']
  const localTerms = ['الملبن', 'السواد والبياض', 'أجور الورش', 'بنود الإكساء']

  return (
    <Slide className="gap-v4">
      <div className="gap-v4__heading">
        <Eyebrow>Specialized Gap</Eyebrow>
        <h2>المشكلة ليست غياب الأدوات<br />بل غياب التخصص</h2>
      </div>

      <div className="gap-v4__board">
        <article className="gap-v4__column">
          <span dir="ltr">Global Construction Platforms</span>
          <div className="gap-v4__items" dir="ltr">
            {platforms.map((item) => <b key={item}>{item}</b>)}
          </div>
        </article>

        <div className="gap-v4__neq" aria-hidden="true">≠</div>

        <article className="gap-v4__column gap-v4__column--local">
          <span>Finishing Domain</span>
          <div className="gap-v4__items">
            {localTerms.map((item) => <b key={item}>{item}</b>)}
          </div>
        </article>
      </div>
    </Slide>
  )
}

function Lifecycle() {
  const steps = ['Create', 'Plan', 'Execute', 'Verify', 'Deliver']
  return (
    <Slide className="lifecycle">
      <BigTitle ar="دورة حياة الإكساء" en="From project setup to delivery" />
      <div className="life-line">
        {steps.map((s, i) => <div className="life-step" key={s}><i>{String(i + 1).padStart(2, '0')}</i><b dir="ltr">{s}</b></div>)}
      </div>
      <div className="life-orbit"><span /><span /><span /></div>
    </Slide>
  )
}

function VerifiedProgress() {
  const flow = ['Field Reporting', 'Progress Request', 'Engineering Review', 'Verified Progress']
  return (
    <Slide className="verified">
      <div className="copy-col">
        <Eyebrow>Approval Workflow</Eyebrow>
        <BigTitle ar="الإنجاز لا يُحتسب قبل الاعتماد" en="Field ≠ Verified" compact />
      </div>
      <div className="flow">
        {flow.map((item, i) => <FlowNode key={item} label={item} index={i + 1} />)}
      </div>
    </Slide>
  )
}

function FlowNode({ label, index }) {
  return <div className="flow-node"><span>{String(index).padStart(2, '0')}</span><b dir="ltr">{label}</b></div>
}

function Strategy() {
  const items = [
    ['Area', 'مساحة'],
    ['Count', 'عدد'],
    ['Spaces', 'فراغات'],
    ['Weights', 'أوزان'],
  ]

  return (
    <Slide className="strategy-v4">
      <div className="strategy-v4__visual">
        <SafeImage
          src={media.blueprint}
          className="strategy-v4__image"
          fallbackClass="fallback-materials"
          alt="مخطط هندسي"
        />
        <div className="strategy-v4__visual-copy">
          <span dir="ltr">Work Item</span>
          <b>لكل بند طريقة قياس تناسب طبيعته</b>
        </div>
      </div>

      <div className="strategy-v4__copy">
        <Eyebrow>Multi-Strategy Progress Engine</Eyebrow>
        <h2>محرك إنجاز<br />متعدد الاستراتيجيات</h2>
        <div className="strategy-v4__grid">
          {items.map(([en, ar]) => (
            <article key={en}>
              <b dir="ltr">{en}</b>
              <span>{ar}</span>
            </article>
          ))}
        </div>
      </div>
    </Slide>
  )
}

function Estimation() {
  return (
    <Slide className="estimation-v4">
      <div className="estimation-v4__photo">
        <SafeImage
          src={media.materials}
          className="estimation-v4__image"
          fallbackClass="fallback-materials"
          alt="مواد الإكساء"
        />
        <div className="estimation-v4__photo-label">Historical Data</div>
      </div>

      <div className="estimation-v4__copy">
        <Eyebrow>Parametric Estimation</Eyebrow>
        <h2>من مشروع سابق<br />إلى تقدير جديد</h2>

        <div className="estimation-v4__flow" dir="ltr">
          <span>Past Project</span>
          <i>→</i>
          <span>Normalization</span>
          <i>→</i>
          <span>New Estimate</span>
        </div>

        <p>المقياس يتغيّر حسب المادة: جدران، سيراميك، دهان، وغيرها.</p>
      </div>
    </Slide>
  )
}

function CostControl() {
  return (
    <Slide className="cost-v4">
      <div className="cost-v4__heading">
        <Eyebrow>Real-Time Cost Control</Eyebrow>
        <h2>نعرف الانحراف<br />أثناء التنفيذ</h2>
        <p dir="ltr">Estimated Cost vs Actual Cost</p>
      </div>

      <div className="cost-v4__board">
        <div className="cost-v4__legend" dir="ltr">
          <span className="estimated">Estimated Cost</span>
          <span className="actual">Actual Cost</span>
        </div>

        <svg viewBox="0 0 760 330" aria-label="Estimated versus actual cost">
          <path className="cost-v4__grid" d="M55 270 H710 M55 205 H710 M55 140 H710 M55 75 H710" />
          <path className="cost-v4__estimated" d="M70 272 C180 247 272 220 370 192 C485 158 594 126 690 92" />
          <path className="cost-v4__actual" d="M70 278 C175 265 275 235 370 215 C485 190 585 143 690 70" />
          <circle className="cost-v4__dot" cx="690" cy="70" r="8" />
        </svg>

        <div className="cost-v4__message">
          تجاوز الموازنة يظهر قبل أن ينتهي المشروع.
        </div>
      </div>
    </Slide>
  )
}

function AiInspection() {
  return (
    <Slide className="inspection-v4">
      <div className="inspection-v4__photo">
        <SafeImage
          src={media.inspection}
          className="inspection-v4__image"
          fallbackClass="fallback-inspection"
          alt="فحص تنفيذ أعمال الإكساء"
        />
        <div className="inspection-v4__scan">
          <i />
          <span className="inspection-v4__pin a" />
          <span className="inspection-v4__pin b" />
          <span className="inspection-v4__pin c" />
        </div>
      </div>

      <div className="inspection-v4__copy">
        <Eyebrow>AI Visual Inspection</Eyebrow>
        <h2>يدعم قرار المهندس<br />ولا يستبدله</h2>
        <div className="inspection-v4__labels" dir="ltr">
          <span>Confirmed</span>
          <span>Potential</span>
          <span>Not Verifiable</span>
        </div>
        <p>النظام يفرّق بين ما يظهر بالصورة وما لا يمكن التحقق منه بصريًا.</p>
      </div>
    </Slide>
  )
}

function AiVision() {
  return (
    <Slide className="ai-vision-v5">
      <div className="ai-vision-v5__copy anim-rise">
        <Eyebrow>AI Visualization & Context-Aware Assistant</Eyebrow>
        <h2>قبل التنفيذ…<br />رؤية بصرية أوضح للقرار</h2>
       
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

       
      </div>
    </Slide>
  )
}

function Nfr() {
  const items = [
    ['Performance', 'Queues', 'عمليات ثقيلة خارج مسار الطلب المباشر'],
    ['Security', 'Sanctum · RBAC', 'صلاحيات واضحة حسب الدور'],
    ['Reliability', 'Transactions', 'حماية العمليات الحرجة من التناقض'],
    ['Maintainability', 'Service Layer', 'منطق العمل معزول وقابل للاختبار'],
    ['Reusability', 'Shared Services', 'خدمات مشتركة بين أكثر من مسار'],
    ['Scalability', 'Modular Design', 'بنية قابلة للتوسع دون تضخيم الكود'],
  ]

  return (
    <Slide className="nfr-v6">
      <div className="nfr-v6__copy anim-rise">
        <Eyebrow>Non-Functional Requirements</Eyebrow>
        <h2>جودة النظام<br />تحققت بقرارات معمارية</h2>
      
      </div>

      <div className="nfr-v6__grid anim-fade" dir="ltr">
        {items.map(([title, tech, desc], index) => (
          <article key={title} className="nfr-v6__card" style={{ '--i': index }}>
            <div className="nfr-v6__icon">{String(index + 1).padStart(2, '0')}</div>
            <b>{title}</b>
            <span>{tech}</span>
            
          </article>
        ))}
      </div>
    </Slide>
  )
}

function Process() {
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
    ['Requirements', 'خبرة ميدانية غير موثقة'],
    ['Measurement', 'طرق قياس مختلفة'],
    ['AI Reliability', 'مخرجات غير ثابتة'],
  ]

  return (
    <Slide className="challenges challenges-stable">
      <BigTitle ar="العوائق والتحديات" en="Three hard problems" />

      <div className="challenge-grid challenge-grid-stable">
        {items.map(([en, ar], index) => (
          <article key={en} className="challenge-stable-card">
            <span>{String(index + 1).padStart(2, '0')}</span>
            <b dir="ltr">{en}</b>
            <p>{ar}</p>
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
        <h2>الاختبار و طبقة الثقة</h2>

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

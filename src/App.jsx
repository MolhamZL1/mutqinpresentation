import { useEffect, useMemo, useRef, useState } from 'react'

const asset = (path) => `${import.meta.env.BASE_URL}${path}`

const media = {
  unfinished: asset('presentation/unfinished-room.jpg'),
  blueprint: asset('presentation/blueprint.jpg'),
  inspection: asset('presentation/site-inspection.jpg'),
  materials: asset('presentation/materials.jpg'),
  finished: asset('presentation/finished-room.jpg'),
  team: asset('presentation/team-planning.jpg'),
  university: asset('branding/damascus-university-logo.png'),
  universitySvg: asset('branding/damascus-university-logo.svg'),
  mutqin: asset('branding/mutqin-logo.svg'),
  mutqinPng: asset('branding/mutqin-logo.png'),
  visionBefore: asset('presentation/visualization-before.jpg'),
  visionAfter: asset('presentation/visualization-after.jpg'),
  reactLogo: asset('tech/react.svg'),
  flutterLogo: asset('tech/flutter.svg'),
  laravelLogo: asset('tech/laravel.svg'),
  mysqlLogo: asset('tech/mysql.svg'),
  web: asset('product/web-dashboard.png'),
  assistant: asset('product/assistant-mobile.jpg'),
  owner: asset('product/owner-mobile.jpg'),
  tahady: asset('presentation/tahady.jpeg'),
  materialsest: asset('presentation/materialsest.jpg'),
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
  { k: 'ai-inspection', section: 'الفحص البصري', en: 'AI visual inspection', dark: true },
  { k: 'ai-vision', section: 'التصور البصري', en: 'AI visualization' },
  { k: 'ai-assistant', section: 'المساعد الذكي', en: 'Context-aware assistant' },
  { k: 'nfr', section: 'المتطلبات غير الوظيفية', en: 'Non-functional requirements' },
  { k: 'process', section: 'نموذج العمل', en: 'Agile process' },
  { k: 'architecture', section: 'البنية المعمارية', en: 'Architecture' },
  { k: 'challenges', section: 'التحديات', en: 'Challenges', dark: true },
  { k: 'testing', section: 'الاختبار', en: 'Testing phase' },
  { k: 'closing', section: 'الخاتمة', en: 'Conclusion', dark: true },
]

function useSlideNavigation(total, interceptors) {
  const [index, setIndex] = useState(12)
  const touchStart = useRef(null)
  const wheelLock = useRef(false)

  const goTo = (value) => setIndex(Math.max(0, Math.min(total - 1, value)))
  const next = () => {
    const step = interceptors?.current?.[index]
    if (step?.next?.()) return
    goTo(index + 1)
  }
  const prev = () => {
    const step = interceptors?.current?.[index]
    if (step?.prev?.()) return
    goTo(index - 1)
  }

  useEffect(() => {
    const onKey = (event) => {
      const key = event.key.toLowerCase()
      if (['arrowleft', 'arrowdown', ' ', 'pagedown'].includes(key)) {
        event.preventDefault(); next()
      }
      if (['arrowright', 'arrowup', 'pageup'].includes(key)) {
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

const challengesIndex = sections.findIndex((item) => item.k === 'challenges')

export default function App() {
  const interceptors = useRef({})
  const { index, goTo, next, prev, swipeHandlers } = useSlideNavigation(sections.length, interceptors)
  const [challengeStep, setChallengeStep] = useState(0)

  interceptors.current[challengesIndex] = {
    next: () => {
      if (challengeStep >= 3) return false
      setChallengeStep(challengeStep + 1)
      return true
    },
    prev: () => {
      if (challengeStep <= 0) return false
      setChallengeStep(challengeStep - 1)
      return true
    },
  }

  useEffect(() => {
    if (index !== challengesIndex) setChallengeStep(0)
  }, [index])

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

  const isInteractive = (target) => target.closest('button, a, input, textarea, select, .controls, .topbar')

  const handleClick = (event) => {
    if (isInteractive(event.target)) return
    next()
  }
  const handleContextMenu = (event) => {
    if (isInteractive(event.target)) return
    event.preventDefault()
    prev()
  }

  return (
    <main className="deck" dir="rtl" onClick={handleClick} onContextMenu={handleContextMenu} {...swipeHandlers}>
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
        <AiAssistant />
        <Nfr />
        <Process />
        <Architecture />
        <Challenges step={challengeStep} />
        <Testing />
        <Closing />
      </div>
      <Controls index={index} total={sections.length} goTo={goTo} next={next} prev={prev} />
    </main>
  )
}

function Header({ current, index, total, progress }) {
  return (
    <header className={`topbar${current.dark ? ' topbar--dark' : ''}`}>
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
  return <SafeImage src={media.university} alt="جامعة دمشق" className="cover-v4__university" />
}

function MutqinLogo({ className = '' }) {
  return (
    <picture className={`mutqin-logo-picture ${className}`}>
      <source srcSet={media.mutqin} type="image/svg+xml" />
      <img src={media.mutqinPng} alt="متقن" className="mutqin-logo" />
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
        <h1 className="cover-v4__wordmark">مُتقِن</h1>
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
    <Slide className="problem-v5">
      <div className="problem-v5__copy">
        <Eyebrow>من أين جاء هذا الرقم؟</Eyebrow>

        <div className="problem-v5__gauge">
          <svg viewBox="0 0 120 120" aria-hidden="true">
            <circle className="problem-v5__track" cx="60" cy="60" r="52" />
            <circle className="problem-v5__value" cx="60" cy="60" r="52" />
          </svg>
          <div className="problem-v5__reading">
            <strong dir="ltr">60<i>%</i></strong>
          </div>
        </div>

        <h2>نسبة إنجاز<br />بلا دليل موثّق</h2>
        <p>تقدير شخصي لا يمكن للشركة أو المالك التحقق منه.</p>

        <div className="problem-v5__note">
          <span aria-hidden="true"><IconAlert /></span>
          <b>لا صورة، لا قياس، لا اعتماد</b>
        </div>
      </div>

      <div className="problem-v5__visual">
        <SafeImage
          src={media.unfinished}
          className="problem-v5__image"
          fallbackClass="fallback-room"
          alt="شقة قيد التشطيب"
        />
        <span className="problem-v5__tag">شقة قيد التشطيب</span>
      </div>
    </Slide>
  )
}

function IconAlert() {
  return (
    <svg {...iconProps}>
      <path d="M24 8 43 41H5L24 8Z" />
      <path d="M24 20v10M24 35.5h.02" />
    </svg>
  )
}

function Questions() {
  const items = [
    { en: 'Progress', ar: 'ما نسبة الإنجاز اليوم؟', icon: <IconProgress /> },
    { en: 'Materials', ar: 'كم نحتاج من مواد؟', icon: <IconMaterials /> },
    { en: 'Budget', ar: 'هل تجاوزنا الموازنة؟', icon: <IconBudget /> },
    { en: 'Quality', ar: 'من تحقق من الجودة؟', icon: <IconQuality /> },
  ]
  return (
    <Slide className="questions">
      <BigTitle ar="أربعة أسئلة" en="Four questions shaped the product" />
      <div className="question-row">
        {items.map((item, idx) => (
          <article className="q-item" key={item.en}>
            <span className="q-item__icon" aria-hidden="true">{item.icon}</span>
            <b dir="ltr">{String(idx + 1).padStart(2, '0')}</b>
            <h3>{item.ar}</h3>
            <span className="q-item__en" dir="ltr">{item.en}</span>
          </article>
        ))}
      </div>
    </Slide>
  )
}

const iconProps = {
  viewBox: '0 0 48 48',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

function IconProgress() {
  return (
    <svg {...iconProps}>
      <path d="M8 40V26M18.7 40V17M29.3 40V29M40 40V10" />
      <path d="M5 44h38" strokeWidth="1.4" opacity=".45" />
      <circle cx="40" cy="10" r="3.6" fill="currentColor" stroke="none" opacity=".22" />
    </svg>
  )
}

function IconMaterials() {
  return (
    <svg {...iconProps}>
      <path d="M24 5 42 14.5v19L24 43 6 33.5v-19L24 5Z" />
      <path d="M6 14.5 24 24l18-9.5M24 24v19" opacity=".55" />
      <path d="M15 9.8 33 19.3" opacity=".35" strokeWidth="1.4" />
    </svg>
  )
}

function IconBudget() {
  return (
    <svg {...iconProps}>
      <path d="M6 16.5C6 13.5 8.4 11 11.4 11h25.2C39.6 11 42 13.5 42 16.5v15c0 3-2.4 5.5-5.4 5.5H11.4C8.4 37 6 34.5 6 31.5v-15Z" />
      <path d="M42 21h-8.4a3 3 0 0 0 0 6H42" />
      <path d="M12 11l16-5.6a3 3 0 0 1 4 2.8V11" opacity=".5" />
    </svg>
  )
}

function IconQuality() {
  return (
    <svg {...iconProps}>
      <path d="M24 4.5 40 10v13.5C40 33 33.2 40.7 24 43.5 14.8 40.7 8 33 8 23.5V10l16-5.5Z" />
      <path d="m17.5 23.5 5 5 9.5-10" />
    </svg>
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
  const methods = [
    { icon: <IconVisit />, title: 'زيارات ميدانية', sub: 'مواقع إكساء قيد التنفيذ' },
    { icon: <IconInterview />, title: 'مقابلات', sub: 'مهندسون، مقاولون، مالكون' },
    { icon: <IconBenchmark />, title: 'دراسة أنظمة مشابهة', sub: 'Procore · Buildertrend · SAP · Autodesk' },
  ]

  return (
    <Slide className="requirements-v6">
      <div className="requirements-v6__copy">
        <Eyebrow>Requirements Elicitation</Eyebrow>
        <h2>المتطلبات<br />من أرض الواقع</h2>

        <div className="requirements-v6__methods">
          {methods.map((m) => (
            <article key={m.title}>
              <span className="requirements-v6__icon" aria-hidden="true">{m.icon}</span>
              <div>
                <b>{m.title}</b>
                <span>{m.sub}</span>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="requirements-v6__visual">
        <SafeImage src={media.team} className="requirements-v6__image" fallbackClass="fallback-team" alt="زيارة ميدانية" />
        <span className="requirements-v6__tag">زيارة ميدانية لموقع إكساء</span>
      </div>
    </Slide>
  )
}

function IconVisit() {
  return (
    <svg {...iconProps}>
      <path d="M24 43s13-11 13-21a13 13 0 1 0-26 0c0 10 13 21 13 21Z" />
      <circle cx="24" cy="21" r="5" />
    </svg>
  )
}

function IconInterview() {
  return (
    <svg {...iconProps}>
      <path d="M6 14a5 5 0 0 1 5-5h16a5 5 0 0 1 5 5v9a5 5 0 0 1-5 5H16l-10 7V14Z" />
      <path d="M36 17h1a5 5 0 0 1 5 5v9a5 5 0 0 1-5 5h-2v6l-7-6" opacity=".55" />
    </svg>
  )
}

function IconBenchmark() {
  return (
    <svg {...iconProps}>
      <path d="M24 5 42 14 24 23 6 14 24 5Z" />
      <path d="m6 24 18 9 18-9" opacity=".6" />
      <path d="m6 34 18 9 18-9" opacity=".35" />
    </svg>
  )
}

function SystemsGap() {
  const platforms = ['Procore', 'Buildertrend', 'SAP', 'Autodesk']
  const localTerms = [
    { label: 'الملبن', icon: <IconFrame /> },
    { label: 'السواد والبياض', icon: <IconPlaster /> },
    { label: 'أجور الورش', icon: <IconWage /> },
    { label: 'بنود الإكساء', icon: <IconItems /> },
  ]

  return (
    <Slide className="gap-v7">
      <div className="gap-v7__heading">
        <Eyebrow>Specialized Gap</Eyebrow>
        <h2>غياب التخصص<br />لا غياب الأدوات</h2>
      </div>

      <div className="gap-v7__board">
        <div className="gap-v7__side gap-v7__side--global">
          {platforms.map((name) => (
            <article key={name}>
              <span aria-hidden="true"><IconGlobe /></span>
              <b dir="ltr">{name}</b>
            </article>
          ))}
        </div>

        <div className="gap-v7__gap" aria-hidden="true">
          <i />
          <span>الفجوة</span>
          <i />
        </div>

        <div className="gap-v7__side gap-v7__side--local">
          {localTerms.map((item) => (
            <article key={item.label}>
              <span aria-hidden="true">{item.icon}</span>
              <b>{item.label}</b>
            </article>
          ))}
        </div>
      </div>
    </Slide>
  )
}

function IconFrame() {
  return (
    <svg {...iconProps}>
      <rect x="8" y="6" width="32" height="36" rx="3" />
      <rect x="15" y="13" width="18" height="22" rx="2" opacity=".55" />
      <path d="M30 24h.02" />
    </svg>
  )
}

function IconPlaster() {
  return (
    <svg {...iconProps}>
      <path d="M6 30 24 12l8 8-18 18-8-2-2-6Z" />
      <path d="m28 8 12 12" opacity=".55" />
      <path d="M12 42h30" opacity=".4" />
    </svg>
  )
}

function IconWage() {
  return (
    <svg {...iconProps}>
      <circle cx="24" cy="24" r="15" />
      <path d="M24 15v18M19.5 20h9M19.5 28h9" opacity=".7" />
    </svg>
  )
}

function IconItems() {
  return (
    <svg {...iconProps}>
      <rect x="9" y="7" width="30" height="34" rx="5" />
      <path d="m16 19 3 3 6-6M16 31l3 3 6-6" />
      <path d="M29 19h4M29 31h4" opacity=".5" />
    </svg>
  )
}

function IconGlobe() {
  return (
    <svg {...iconProps}>
      <circle cx="24" cy="24" r="18" />
      <path d="M6 24h36" opacity=".6" />
      <path d="M24 6c5 5.5 7.5 11.5 7.5 18S29 36.5 24 42c-5-5.5-7.5-11.5-7.5-18S19 11.5 24 6Z" />
    </svg>
  )
}

function IconDomain() {
  return (
    <svg {...iconProps}>
      <path d="M8 42V19l16-11 16 11v23" />
      <path d="M18 42V28h12v14" />
      <path d="M4 42h40" opacity=".5" />
    </svg>
  )
}

function Lifecycle() {
  const steps = [
    { en: 'Create', ar: 'إنشاء المشروع', icon: <IconCreate /> },
    { en: 'Plan', ar: 'تخطيط البنود', icon: <IconPlan /> },
    { en: 'Execute', ar: 'التنفيذ الميداني', icon: <IconExecute /> },
    { en: 'Verify', ar: 'اعتماد الإنجاز', icon: <IconVerify /> },
    { en: 'Deliver', ar: 'التسليم', icon: <IconDeliver /> },
  ]
  return (
    <Slide className="lifecycle">
      <BigTitle ar="دورة حياة الإكساء" en="From project setup to delivery" />
      <div className="life-flow">
        <span className="life-flow__rail" aria-hidden="true"><i /></span>
        {steps.map((step, i) => (
          <div className="life-node" key={step.en}>
            <span className="life-node__badge" aria-hidden="true">
              <span className="life-node__icon">{step.icon}</span>
              <b dir="ltr">{String(i + 1).padStart(2, '0')}</b>
            </span>
            <strong dir="ltr">{step.en}</strong>
            <span className="life-node__ar">{step.ar}</span>
          </div>
        ))}
      </div>
      <div className="life-orbit"><span /><span /><span /></div>
    </Slide>
  )
}

function IconCreate() {
  return (
    <svg {...iconProps}>
      <path d="M12 6h15l9 9v27H12V6Z" />
      <path d="M27 6v9h9" opacity=".55" />
      <path d="M24 23v12M18 29h12" />
    </svg>
  )
}

function IconPlan() {
  return (
    <svg {...iconProps}>
      <rect x="6" y="10" width="36" height="32" rx="5" />
      <path d="M6 20h36M16 5v9M32 5v9" opacity=".6" />
      <path d="M13 28h13M13 35h8" />
    </svg>
  )
}

function IconExecute() {
  return (
    <svg {...iconProps}>
      <path d="M27.5 6.5 41.5 20.5 36 26l-14-14 5.5-5.5Z" />
      <path d="m24.5 14.5 9 9" opacity=".5" />
      <path d="M20 20 6.5 33.5a4 4 0 0 0 0 5.7l2.3 2.3a4 4 0 0 0 5.7 0L28 28" />
    </svg>
  )
}

function IconVerify() {
  return (
    <svg {...iconProps}>
      <path d="M17 8h-4a4 4 0 0 0-4 4v26a4 4 0 0 0 4 4h22a4 4 0 0 0 4-4V12a4 4 0 0 0-4-4h-4" />
      <rect x="17" y="4.5" width="14" height="7.5" rx="3" opacity=".6" />
      <path d="m17.5 27 4.5 4.5L31 22" />
    </svg>
  )
}

function IconDeliver() {
  return (
    <svg {...iconProps}>
      <path d="M6 22 24 8l18 14" />
      <path d="M11 25v14a2 2 0 0 0 2 2h22a2 2 0 0 0 2-2V25" opacity=".6" />
      <path d="m18.5 31.5 4 4L30 28" />
    </svg>
  )
}

function VerifiedProgress() {
  const flow = [
    { en: 'Field Reporting', ar: 'تقرير ميداني من المنفّذ', icon: <IconReport /> },
    { en: 'Progress Request', ar: 'طلب احتساب إنجاز', icon: <IconRequest /> },
    { en: 'Engineering Review', ar: 'مراجعة المهندس المسؤول', icon: <IconReview /> },
    { en: 'Verified Progress', ar: 'إنجاز معتمد ويدخل الحسابات', icon: <IconSeal />, final: true },
  ]

  return (
    <Slide className="approval-v6">
      <div className="approval-v6__copy">
        <Eyebrow>Approval Workflow</Eyebrow>
        <h2>الإنجاز لا يُحتسب<br />قبل الاعتماد</h2>
        <p>ما يُسجَّل في الموقع يبقى طلبًا حتى يعتمده المهندس.</p>

        <div className="approval-v6__legend">
          <span className="approval-v6__legend-item is-field">ميداني</span>
          <b>≠</b>
          <span className="approval-v6__legend-item is-verified">معتمد</span>
        </div>
      </div>

      <div className="approval-v6__pipeline">
        <span className="approval-v6__rail" aria-hidden="true"><i /></span>
        {flow.map((step, i) => (
          <article key={step.en} className={`approval-v6__step${step.final ? ' is-final' : ''}`}>
            <span className="approval-v6__icon" aria-hidden="true">{step.icon}</span>
            <div className="approval-v6__label">
              <i dir="ltr">{String(i + 1).padStart(2, '0')}</i>
              <b dir="ltr">{step.en}</b>
              <span>{step.ar}</span>
            </div>
          </article>
        ))}
      </div>
    </Slide>
  )
}

function IconReport() {
  return (
    <svg {...iconProps}>
      <rect x="13" y="4" width="22" height="40" rx="5" />
      <path d="M20 12h8" opacity=".6" />
      <path d="M24 33v-11M20 26l4-4 4 4" />
    </svg>
  )
}

function IconRequest() {
  return (
    <svg {...iconProps}>
      <path d="M12 8h16l8 8v24a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2Z" />
      <path d="M28 8v8h8" opacity=".55" />
      <path d="M17 30h14M26 25l5 5-5 5" />
    </svg>
  )
}

function IconReview() {
  return (
    <svg {...iconProps}>
      <path d="M17 7h-4a4 4 0 0 0-4 4v29a4 4 0 0 0 4 4h22a4 4 0 0 0 4-4V11a4 4 0 0 0-4-4h-4" />
      <rect x="17" y="3.5" width="14" height="7.5" rx="3" opacity=".55" />
      <circle cx="22" cy="27" r="6.5" />
      <path d="m27 32 5 5" />
    </svg>
  )
}

function IconSeal() {
  return (
    <svg {...iconProps}>
      <path d="M24 4l5 3.6 6.1-.6 1.9 5.9 5 3.6-2.4 5.7 2.4 5.7-5 3.6-1.9 5.9-6.1-.6L24 40l-5-3.6-6.1.6-1.9-5.9-5-3.6 2.4-5.7L6 16.5l5-3.6L12.9 7l6.1.6L24 4Z" />
      <path d="m18 22 4.5 4.5L31 18" />
    </svg>
  )
}

function Strategy() {
  const items = [
    { en: 'Area', ar: 'مساحة', ex: 'دهان وبياض', icon: <IconArea /> },
    { en: 'Count', ar: 'عدد', ex: 'أبواب ونوافذ', icon: <IconCount /> },
    { en: 'Spaces', ar: 'فراغات', ex: 'غرف مكتملة', icon: <IconSpaces /> },
    { en: 'Weights', ar: 'أوزان', ex: 'بنود مركّبة', icon: <IconWeights /> },
  ]

  return (
    <Slide className="strategy-v6">
      <div className="strategy-v6__copy">
        <Eyebrow>Multi-Strategy Progress Engine</Eyebrow>
        <h2>لكل بند<br />طريقة قياس تناسبه</h2>

        <div className="strategy-v6__grid">
          {items.map((item) => (
            <article key={item.en}>
              <span className="strategy-v6__icon" aria-hidden="true">{item.icon}</span>
              <div>
                <b dir="ltr">{item.en}</b>
                <span>{item.ar} · {item.ex}</span>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="strategy-v6__visual">
        <SafeImage
          src={media.blueprint}
          className="strategy-v6__image"
          fallbackClass="fallback-materials"
          alt="مخطط هندسي"
        />
        <span className="strategy-v6__tag">Work Item · بند تنفيذي</span>
      </div>
    </Slide>
  )
}

function IconArea() {
  return (
    <svg {...iconProps}>
      <rect x="7" y="7" width="34" height="34" rx="4" />
      <path d="m14 34 20-20" opacity=".6" />
      <path d="M14 22v12h12" />
    </svg>
  )
}

function IconCount() {
  return (
    <svg {...iconProps}>
      <path d="M20 13h21M20 24h21M20 35h21" />
      <path d="M9 10h3v9M8 27h6l-6 8h6" opacity=".8" />
    </svg>
  )
}

function IconSpaces() {
  return (
    <svg {...iconProps}>
      <rect x="6" y="6" width="36" height="36" rx="4" />
      <path d="M6 24h18V6M24 24h18M24 32h18" opacity=".65" />
    </svg>
  )
}

function IconWeights() {
  return (
    <svg {...iconProps}>
      <path d="M24 9v30M12 43h24" />
      <path d="M8 20h32" opacity=".55" />
      <path d="M14 20 8 32h12L14 20ZM34 20l-6 12h12l-6-12Z" />
      <circle cx="24" cy="9" r="3" />
    </svg>
  )
}

function Estimation() {
  const steps = [
    { en: 'Past Project', ar: 'كميات فعلية من مشروع منفّذ', icon: <IconHistory /> },
    { en: 'Normalization', ar: 'تطبيع حسب المساحة ونوع المادة', icon: <IconNormalize /> },
    { en: 'New Estimate', ar: 'تقدير مواد للمشروع الجديد', icon: <IconEstimate /> },
  ]

  return (
    <Slide className="estimation-v6">
      <div className="estimation-v6__heading">
        <Eyebrow>Parametric Estimation</Eyebrow>
        <h2>من مشروع سابق إلى تقدير جديد</h2>
      </div>

      <div className="estimation-v6__flow">
        <span className="estimation-v6__rail" aria-hidden="true"><i /></span>
        {steps.map((step, i) => (
          <article key={step.en}>
            <span className="estimation-v6__icon" aria-hidden="true">{step.icon}</span>
            <i dir="ltr">{String(i + 1).padStart(2, '0')}</i>
            <b dir="ltr">{step.en}</b>
            <p>{step.ar}</p>
          </article>
        ))}
      </div>

      <div className="estimation-v6__strip">
        <SafeImage
          src={media.materialsest}
          className="estimation-v6__image"
          fallbackClass="fallback-materials"
          alt="مواد الإكساء"
        />
        <span>المقياس يتغيّر حسب المادة: جدران، سيراميك، دهان</span>
      </div>
    </Slide>
  )
}

function IconHistory() {
  return (
    <svg {...iconProps}>
      <path d="M8 24a16 16 0 1 0 4.7-11.3" />
      <path d="M8 8v9h9" />
      <path d="M24 16v9l6 4" />
    </svg>
  )
}

function IconNormalize() {
  return (
    <svg {...iconProps}>
      <path d="M12 6v36M24 6v36M36 6v36" opacity=".45" />
      <circle cx="12" cy="17" r="4" />
      <circle cx="24" cy="30" r="4" />
      <circle cx="36" cy="21" r="4" />
    </svg>
  )
}

function IconEstimate() {
  return (
    <svg {...iconProps}>
      <rect x="9" y="5" width="30" height="38" rx="5" />
      <path d="M16 14h16" opacity=".6" />
      <path d="M16 24h5M27 24h5M16 33h5M27 33h5" />
    </svg>
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
  const points = [
    { icon: <IconCamera />, title: 'صورة للغرفة قبل التنفيذ', sub: 'من هاتف المنفّذ أو المالك' },
    { icon: <IconPalette />, title: 'اختيار نمط الإكساء', sub: 'ألوان ومواد مقترحة' },
    { icon: <IconEye />, title: 'معاينة قبل القرار', sub: 'اتفاق أوضح مع المالك' },
  ]

  return (
    <Slide className="vision-v7">
      <div className="vision-v7__copy">
        <Eyebrow>AI Visualization</Eyebrow>
        <h2>قبل التنفيذ…<br />رؤية بصرية أوضح للقرار</h2>

        <div className="vision-v7__points">
          {points.map((point, i) => (
            <article key={point.title} style={{ '--i': i }}>
              <span className="vision-v7__icon" aria-hidden="true">{point.icon}</span>
              <div>
                <b>{point.title}</b>
                <span>{point.sub}</span>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="vision-v7__stage">
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

function AiAssistant() {
  const chat = [
    { from: 'user', text: 'كم بقي من بنود الإكساء في الطابق الثاني؟' },
    { from: 'bot', text: 'بقي بندان: دهان الغرف (%40) وتركيب الأبواب (%0).' },
    { from: 'user', text: 'وهل تجاوزنا موازنة السيراميك؟' },
    { from: 'bot', text: 'لا، الصرف الحالي %86 من الموازنة المخصصة.' },
  ]
  const points = [
    { icon: <IconContext />, title: 'يقرأ سياق المشروع', sub: 'بنود، إنجاز، تكاليف' },
    { icon: <IconChat />, title: 'سؤال بلغة طبيعية', sub: 'بدل التنقل بين الشاشات' },
    { icon: <IconGuard />, title: 'ضمن صلاحيات المستخدم', sub: 'لا يتجاوز دور صاحب السؤال' },
  ]

  return (
    <Slide className="assistant-v7">
      <div className="assistant-v7__copy">
        <Eyebrow>Context-Aware Assistant</Eyebrow>
        <h2>مساعد يفهم<br />سياق المشروع</h2>

        <div className="assistant-v7__points">
          {points.map((point, i) => (
            <article key={point.title} style={{ '--i': i }}>
              <span className="assistant-v7__icon" aria-hidden="true">{point.icon}</span>
              <div>
                <b>{point.title}</b>
                <span>{point.sub}</span>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="assistant-v7__chat">
        <header>
          <span className="assistant-v7__avatar" aria-hidden="true"><IconChat /></span>
          <div>
            <b dir="ltr">Mutqin Assistant</b>
            <span>متصل بمشروع «برج الياسمين»</span>
          </div>
        </header>

        <div className="assistant-v7__messages">
          {chat.map((message, i) => (
            <p key={message.text} className={`is-${message.from}`} style={{ '--i': i }}>{message.text}</p>
          ))}
          <span className="assistant-v7__typing" aria-hidden="true"><i /><i /><i /></span>
        </div>
      </div>
    </Slide>
  )
}

function IconCamera() {
  return (
    <svg {...iconProps}>
      <path d="M6 16a4 4 0 0 1 4-4h5l3-5h12l3 5h5a4 4 0 0 1 4 4v18a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V16Z" />
      <circle cx="24" cy="25" r="8" />
    </svg>
  )
}

function IconPalette() {
  return (
    <svg {...iconProps}>
      <path d="M24 6c10 0 18 7.2 18 16 0 5-4 8-8 8h-3a4 4 0 0 0-3 6.6c1 1.4.2 3.4-1.6 3.4C15.5 40 6 32.5 6 22 6 13.2 14 6 24 6Z" />
      <path d="M15 20h.02M21 15h.02M29 15h.02M34 21h.02" />
    </svg>
  )
}

function IconEye() {
  return (
    <svg {...iconProps}>
      <path d="M4 24s7-12 20-12 20 12 20 12-7 12-20 12S4 24 4 24Z" />
      <circle cx="24" cy="24" r="6" />
    </svg>
  )
}

function IconContext() {
  return (
    <svg {...iconProps}>
      <rect x="6" y="8" width="36" height="32" rx="5" />
      <path d="M6 18h36" opacity=".55" />
      <path d="M13 26h10M13 33h16" />
      <circle cx="33" cy="27" r="4.5" />
    </svg>
  )
}

function IconChat() {
  return (
    <svg {...iconProps}>
      <path d="M6 13a5 5 0 0 1 5-5h26a5 5 0 0 1 5 5v16a5 5 0 0 1-5 5H20l-14 8V13Z" />
      <path d="M16 21h.02M24 21h.02M32 21h.02" />
    </svg>
  )
}

function IconGuard() {
  return (
    <svg {...iconProps}>
      <path d="M24 5 39 10v11c0 9.4-6.3 16.7-15 19-8.7-2.3-15-9.6-15-19V10l15-5Z" />
      <path d="m17.5 24 4.5 4.5L31 20" />
    </svg>
  )
}

function Nfr() {
  const items = [
    { en: 'Performance', tech: 'Queues', ar: 'العمليات الثقيلة خارج مسار الطلب', icon: <IconBolt /> },
    { en: 'Security', tech: 'Sanctum · RBAC', ar: 'صلاحيات واضحة حسب الدور', icon: <IconShieldLock /> },
    { en: 'Reliability', tech: 'Transactions', ar: 'حماية العمليات الحرجة من التناقض', icon: <IconReliability /> },
    { en: 'Maintainability', tech: 'Service Layer', ar: 'منطق العمل معزول وقابل للاختبار', icon: <IconLayers /> },
    { en: 'Reusability', tech: 'Shared Services', ar: 'خدمات مشتركة بين أكثر من مسار', icon: <IconReuse /> },
    { en: 'Scalability', tech: 'Modular Design', ar: 'بنية قابلة للتوسع دون تضخيم الكود', icon: <IconScale /> },
  ]

  return (
    <Slide className="nfr-v7">
      <div className="nfr-v7__heading">
        <Eyebrow>Non-Functional Requirements</Eyebrow>
        <h2>جودة النظام تحققت بقرارات معمارية</h2>
      </div>

      <div className="nfr-v7__grid">
        {items.map((item, index) => (
          <article key={item.en} style={{ '--i': index }}>
            <span className="nfr-v7__icon" aria-hidden="true">{item.icon}</span>
            <div>
              <b dir="ltr">{item.en}</b>
              <span className="nfr-v7__tech" dir="ltr">{item.tech}</span>
              <p>{item.ar}</p>
            </div>
          </article>
        ))}
      </div>
    </Slide>
  )
}

function IconBolt() {
  return (
    <svg {...iconProps}>
      <path d="M27 4 11 27h11l-3 17 17-24H25l2-16Z" />
    </svg>
  )
}

function IconShieldLock() {
  return (
    <svg {...iconProps}>
      <path d="M24 4 40 9v13c0 10-6.8 17.8-16 20.6C14.8 39.8 8 32 8 22V9l16-5Z" />
      <rect x="18" y="21" width="12" height="10" rx="2.5" />
      <path d="M21 21v-3a3 3 0 0 1 6 0v3" opacity=".6" />
    </svg>
  )
}

function IconReliability() {
  return (
    <svg {...iconProps}>
      <ellipse cx="24" cy="11" rx="15" ry="6" />
      <path d="M9 11v13c0 3.3 6.7 6 15 6s15-2.7 15-6V11" opacity=".6" />
      <path d="M9 24v13c0 3.3 6.7 6 15 6" opacity=".4" />
      <path d="m30 36 4.5 4.5L43 32" />
    </svg>
  )
}

function IconLayers() {
  return (
    <svg {...iconProps}>
      <path d="M24 5 42 14 24 23 6 14 24 5Z" />
      <path d="m6 24 18 9 18-9" opacity=".6" />
      <path d="m6 34 18 9 18-9" opacity=".35" />
    </svg>
  )
}

function IconReuse() {
  return (
    <svg {...iconProps}>
      <path d="M12 18a13 13 0 0 1 22-5l5 5" />
      <path d="M39 8v10H29" />
      <path d="M36 30a13 13 0 0 1-22 5l-5-5" />
      <path d="M9 40V30h10" />
    </svg>
  )
}

function IconScale() {
  return (
    <svg {...iconProps}>
      <rect x="6" y="6" width="14" height="14" rx="3" />
      <rect x="28" y="28" width="14" height="14" rx="3" />
      <path d="M20 13h9a5 5 0 0 1 5 5v9" opacity=".6" />
      <path d="M28 34h-9a5 5 0 0 1-5-5v-9" opacity=".6" />
    </svg>
  )
}

function Process() {
  const phases = ['تخطيط', 'تنفيذ', 'مراجعة', 'تسليم']
  const releases = [
    { en: 'Foundation', ar: 'المشاريع والبنود والصلاحيات', icon: <IconFoundation /> },
    { en: 'Operations', ar: 'الإنجاز والاعتماد والتكاليف', icon: <IconOperations /> },
    { en: 'AI & Testing', ar: 'الفحص البصري وتغطية الاختبارات', icon: <IconAiTest /> },
  ]

  return (
    <Slide className="process-v8">
      <div className="process-v8__copy">
        <Eyebrow>Agile · Sprints</Eyebrow>
        <h2>بناء تدريجي…<br />وتسليمات متتابعة</h2>

        <div className="process-v8__releases">
          {releases.map((item, i) => (
            <article key={item.en} style={{ '--i': i }}>
              <span className="process-v8__icon" aria-hidden="true">{item.icon}</span>
              <div>
                <i dir="ltr">Release {String(i + 1).padStart(2, '0')}</i>
                <b dir="ltr">{item.en}</b>
                <span>{item.ar}</span>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="process-v8__loop">
        <svg viewBox="0 0 200 200" aria-hidden="true">
          <circle className="process-v8__ring" cx="100" cy="100" r="78" />
          <circle className="process-v8__arc" cx="100" cy="100" r="78" />
        </svg>

        <span className="process-v8__orbit" aria-hidden="true"><i /></span>

        <div className="process-v8__center">
          <b dir="ltr">Sprint</b>
          <span>دورة قصيرة متكررة</span>
        </div>

        {phases.map((phase, i) => (
          <span key={phase} className={`process-v8__phase process-v8__phase--${i + 1}`} style={{ '--i': i }}>
            {phase}
          </span>
        ))}
      </div>
    </Slide>
  )
}

function IconFoundation() {
  return (
    <svg {...iconProps}>
      <path d="M6 18 24 8l18 10-18 10L6 18Z" />
      <path d="M6 30l18 10 18-10" opacity=".55" />
      <path d="M13 22v9M35 22v9" opacity=".4" />
    </svg>
  )
}

function IconOperations() {
  return (
    <svg {...iconProps}>
      <circle cx="24" cy="24" r="7" />
      <path d="M24 4v6M24 38v6M4 24h6M38 24h6M10 10l4.5 4.5M33.5 33.5 38 38M38 10l-4.5 4.5M14.5 33.5 10 38" />
    </svg>
  )
}

function IconAiTest() {
  return (
    <svg {...iconProps}>
      <rect x="10" y="12" width="28" height="24" rx="7" />
      <path d="M24 4v8M18 23h.02M30 23h.02" />
      <path d="m18.5 30 3.5 3.5 7-7" />
    </svg>
  )
}

function Architecture() {
  const clients = [
    { logo: media.reactLogo, name: 'React Web', role: 'Dashboard', y: 74 },
    { logo: media.flutterLogo, name: 'Flutter Assistant', role: 'Field App', y: 214 },
    { logo: media.flutterLogo, name: 'Flutter Owner', role: 'Owner App', y: 354 },
  ]
  const server = [
    { logo: media.laravelLogo, name: 'Laravel', role: 'Application Layer', y: 74 },
    { logo: media.mysqlLogo, name: 'MySQL', role: 'Data Layer', y: 354 },
  ]

  return (
    <Slide className="arch-v6">
      <div className="arch-v6__copy">
        <Eyebrow>Client–Server Architecture</Eyebrow>
         </div>

      <svg className="arch-v6__diagram" viewBox="0 0 1000 460" role="img" aria-label="Architecture diagram">
        <g className="arch-v6__wires">
          {clients.map((c) => <path key={c.name} d={`M148 ${c.y} H330 V220`} />)}
          <path d="M330 220 H392" />
          <path d="M608 220 H670" />
          {server.map((n) => <path key={n.name} d={`M670 220 V${n.y} H852`} />)}
        </g>
        <g className="arch-v6__flow">
          {clients.map((c) => <path key={c.name} d={`M148 ${c.y} H330 V220 H392`} />)}
          {server.map((n) => <path key={n.name} d={`M608 220 H670 V${n.y} H852`} />)}
        </g>

        {clients.map((c, i) => (
          <g className="arch-v6__node" key={c.name} style={{ animationDelay: `${0.35 + i * 0.12}s` }}>
            <circle cx="114" cy={c.y} r="34" />
            <image href={c.logo} x="90" y={c.y - 24} width="48" height="48" />
            <text className="arch-v6__name" x="114" y={c.y + 60}>{c.name}</text>
            <text className="arch-v6__role" x="114" y={c.y + 80}>{c.role}</text>
          </g>
        ))}

        <g className="arch-v6__hub" style={{ animationDelay: '.2s' }}>
          <rect x="392" y="166" width="216" height="108" rx="26" />
          <text className="arch-v6__hub-small" x="500" y="200">HTTPS / JSON</text>
          <text className="arch-v6__hub-title" x="500" y="238">REST API</text>
        </g>

        {server.map((n, i) => (
          <g className="arch-v6__node" key={n.name} style={{ animationDelay: `${0.75 + i * 0.12}s` }}>
            <circle cx="886" cy={n.y} r="34" />
            <image href={n.logo} x="862" y={n.y - 24} width="48" height="48" />
            <text className="arch-v6__name" x="886" y={n.y + 60}>{n.name}</text>
            <text className="arch-v6__role" x="886" y={n.y + 80}>{n.role}</text>
          </g>
        ))}

        <g className="arch-v6__layers" style={{ animationDelay: '1s' }}>
          <text x="886" y="200">Controllers</text>
          <text x="886" y="224">Services</text>
          <text x="886" y="248">Models</text>
        </g>
      </svg>

      <div className="arch-v6__stats" dir="ltr">
        <div><strong>32</strong><span>Entities</span></div>
        <div><strong>30</strong><span>Services</span></div>
        <div><strong>124</strong><span>Endpoints</span></div>
      </div>
    </Slide>
  )
}

function Challenges({ step = 0 }) {
  const items = [
    {
      en: 'Requirements',
      problem: 'خبرة ميدانية غير موثّقة',
      answer: 'مقابلات وزيارات حوّلت المعرفة إلى متطلبات مكتوبة',
      icon: <IconRequirements />,
    },
    {
      en: 'Measurement',
      problem: 'كل بند يُقاس بطريقة مختلفة',
      answer: 'محرك متعدد الاستراتيجيات لحساب نسبة الإنجاز',
      icon: <IconMeasure />,
    },
    {
      en: 'AI Reliability',
      problem: 'مخرجات الذكاء الاصطناعي غير ثابتة',
      answer: 'أداة دعم قرار… القرار النهائي للمهندس',
      icon: <IconAiRisk />,
    },
  ]

  return (
    <Slide className="challenges-v8">
      <SafeImage
        src={media.tahady}
        className="challenges-v8__bg"
        fallbackClass="fallback-room"
        alt="موقع عمل"
      />
      <div className="challenges-v8__scrim" />

      <div className="challenges-v8__content">
        <div className="challenges-v8__head">
          <p className="eyebrow">Three hard problems</p>
          <h2>العوائق والتحديات</h2>
        </div>

        <div className="challenges-v8__row">
          {items.map((item, i) => (
            <article key={item.en} className={`challenges-v8__item${step > i ? ' is-solved' : ''}`}>
              <span className="challenges-v8__icon" aria-hidden="true">
                {item.icon}
                <i className="challenges-v8__check"><IconCheck /></i>
              </span>

              <i className="challenges-v8__index" dir="ltr">{String(i + 1).padStart(2, '0')}</i>
              <b dir="ltr">{item.en}</b>
              <p className="challenges-v8__problem">{item.problem}</p>

              <div className="challenges-v8__answer">
                <span className="challenges-v8__answer-label">المعالجة</span>
                <p>{item.answer}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="challenges-v8__hint">
          <div className="challenges-v8__dots" aria-hidden="true">
            {[0, 1, 2].map((i) => <i key={i} className={step > i ? 'is-on' : ''} />)}
          </div>
          <span>{step >= 3 ? 'ثلاث معالجات… ثلاث قرارات هندسية' : ''}</span>
        </div>
      </div>
    </Slide>
  )
}

function IconRequirements() {
  return (
    <svg {...iconProps}>
      <path d="M24 43s-14-8.5-14-19.5A8.5 8.5 0 0 1 24 16a8.5 8.5 0 0 1 14 7.5C38 34.5 24 43 24 43Z" opacity=".45" />
      <path d="M24 5v6M13 8.5l3 4.5M35 8.5l-3 4.5" />
      <path d="M19 24.5h10M19 30h6" />
    </svg>
  )
}

function IconMeasure() {
  return (
    <svg {...iconProps}>
      <rect x="4" y="16" width="40" height="16" rx="4" transform="rotate(-8 24 24)" />
      <path d="M13 18.5v6M20 17.5v4M27 16.5v6M34 15.5v4" />
    </svg>
  )
}

function IconAiRisk() {
  return (
    <svg {...iconProps}>
      <rect x="12" y="14" width="24" height="22" rx="6" />
      <path d="M24 6v8M18 24h.02M30 24h.02" />
      <path d="M6 22v6M42 22v6" opacity=".5" />
      <path d="M19 30.5c3.2 2 6.8 2 10 0" opacity=".7" />
    </svg>
  )
}

function Testing() {
  const levels = [
    { en: 'Unit', ar: 'الخدمات والمنطق الأساسي', icon: <IconUnit /> },
    { en: 'Integration', ar: 'الواجهات ↔ الـ API', icon: <IconIntegration /> },
    { en: 'Black-Box', ar: 'مسارات المستخدم الحقيقية', icon: <IconBlackBox /> },
  ]
  const cases = [
    { name: 'Role Authorization', kind: 'pass' },
    { name: 'Invalid Approval Guard', kind: 'block' },
    { name: 'Start Project Preconditions', kind: 'pass' },
    { name: 'Progress Recalculation', kind: 'pass' },
    { name: 'Cost Rollup Accuracy', kind: 'pass' },
  ]

  return (
    <Slide className="testing-v6">
      <div className="testing-v6__copy">
        <Eyebrow>Testing Phase</Eyebrow>
        <h2>الاختبار<br />و طبقة الثقة</h2>
    
        <div className="testing-v6__levels">
          {levels.map((level) => (
            <article key={level.en}>
              <span className="testing-v6__icon" aria-hidden="true">{level.icon}</span>
              <div>
                <b dir="ltr">{level.en}</b>
                <span>{level.ar}</span>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="testing-v6__panel" dir="ltr">
        <header className="testing-v6__panel-head">
          <span className="testing-v6__dots" aria-hidden="true"><i /><i /><i /></span>
          <b>test suite — mutqin</b>
          <span className="testing-v6__badge">35/35</span>
        </header>

        <ul className="testing-v6__cases">
          {cases.map((item) => (
            <li key={item.name} className={`is-${item.kind}`}>
              <span className="testing-v6__check" aria-hidden="true">
                {item.kind === 'block' ? <IconShieldBlock /> : <IconCheck />}
              </span>
              <span className="testing-v6__case-name">{item.name}</span>
              <span className="testing-v6__status">{item.kind === 'block' ? 'BLOCKED' : 'PASS'}</span>
            </li>
          ))}
        </ul>

        <footer className="testing-v6__panel-foot">
          <div className="testing-v6__bar"><i /></div>
          <div className="testing-v6__meta">
            <strong>35</strong>
            <span>documented test cases</span>
          </div>
        </footer>
      </div>
    </Slide>
  )
}

function IconUnit() {
  return (
    <svg {...iconProps}>
      <path d="M19 5h10M22 5v12.5L11 37a5 5 0 0 0 4.3 7.5h17.4A5 5 0 0 0 37 37L26 17.5V5" />
      <path d="M15.5 31h17" opacity=".55" />
    </svg>
  )
}

function IconIntegration() {
  return (
    <svg {...iconProps}>
      <path d="M19 29 29 19" />
      <path d="M25.5 12.5 30 8a9.2 9.2 0 0 1 13 13l-4.5 4.5" />
      <path d="M22.5 35.5 18 40A9.2 9.2 0 0 1 5 27l4.5-4.5" />
    </svg>
  )
}

function IconBlackBox() {
  return (
    <svg {...iconProps}>
      <rect x="5" y="12" width="38" height="24" rx="5" />
      <path d="M13 24h4.5l3 5 5-10 3 5H35" />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path className="draw-path" d="m5 12.5 4.5 4.5L19 7" />
    </svg>
  )
}

function IconShieldBlock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.5 20 5.5v6.2c0 5-3.4 8.9-8 10.3-4.6-1.4-8-5.3-8-10.3V5.5l8-3Z" />
      <path className="draw-path" d="M9 12h6" />
    </svg>
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

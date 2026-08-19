#!/usr/bin/env bash
set -euo pipefail

ROOT="$(pwd)"
SRC="$ROOT/src"

if [ ! -d "$SRC" ]; then
  echo "❌ لازم تكون داخل جذر مشروع hypercore-presentation"
  echo "مثال:"
  echo "cd ~/Desktop/hypercore-presentation"
  exit 1
fi

BACKUP="$ROOT/src-backup-$(date +%H%M%S)"
cp -a "$SRC" "$BACKUP"
echo "✅ Backup created: $(basename "$BACKUP")"

python3 <<'PY'
from pathlib import Path

root = Path.cwd()
slides_path = root / "src" / "slides" / "index.jsx"
css_path = root / "src" / "styles.css"

if not slides_path.exists():
    raise SystemExit("❌ src/slides/index.jsx not found")

if not css_path.exists():
    raise SystemExit("❌ src/styles.css not found")

slides = slides_path.read_text()
css = css_path.read_text()

# ─────────────────────────────
# Inject image data + helper component
# ─────────────────────────────
if "const WEB_MOOD =" not in slides:
    anchor = "const Cube = ({ x = 0, y = 0, s = 1, delay = 0, muted = false }) => ("
    helper = r"""

const WEB_MOOD = {
  hero: [
    {
      src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      alt: 'Abstract technology board',
    },
    {
      src: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
      alt: 'Global digital network',
    },
    {
      src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
      alt: 'Team collaboration',
    },
  ],
  why: [
    {
      src: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1200&q=80',
      alt: 'Software engineering workspace',
    },
    {
      src: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
      alt: 'Server infrastructure',
    },
  ],
  arch: [
    {
      src: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
      alt: 'Cross-platform product design',
    },
    {
      src: 'https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=1200&q=80',
      alt: 'Backend systems and devices',
    },
  ],
  testing: [
    {
      src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      alt: 'Analytics dashboard',
    },
    {
      src: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80',
      alt: 'Code and testing workflow',
    },
  ],
};

const MoodCard = ({ image, index = 0, className = '' }) => (
  <figure
    className={`mood-card ${className}`}
    style={{ '--i': index }}
    aria-hidden="true"
  >
    <img
      src={image.src}
      alt={image.alt}
      loading="eager"
      referrerPolicy="no-referrer"
    />
  </figure>
);

"""
    slides = slides.replace(anchor, helper + "\n" + anchor, 1)

# ─────────────────────────────
# Insert image collage into title slide
# ─────────────────────────────
title_insert = """
      <div className="mood-collage mood-collage--hero" aria-hidden="true">
        {WEB_MOOD.hero.map((image, i) => (
          <MoodCard key={image.src} image={image} index={i} />
        ))}
      </div>
"""
if 'mood-collage mood-collage--hero' not in slides:
    slides = slides.replace(
        '      <div className="title-core">',
        title_insert + '      <div className="title-core">',
        1
    )

# ─────────────────────────────
# Insert mood rail into why slide
# ─────────────────────────────
why_insert = """
      <div className="why-photo-rail" aria-hidden="true">
        {WEB_MOOD.why.map((image, i) => (
          <MoodCard key={image.src} image={image} index={i} className="mood-card--side" />
        ))}
      </div>
"""
if 'why-photo-rail' not in slides:
    slides = slides.replace(
        '      <Caption ar="ليش HyperCore؟" en="WHY" />',
        '      <Caption ar="ليش HyperCore؟" en="WHY" />' + why_insert,
        1
    )

# ─────────────────────────────
# Insert image band into architecture slide
# ─────────────────────────────
arch_insert = """
      <div className="arch-photo-band" aria-hidden="true">
        {WEB_MOOD.arch.map((image, i) => (
          <MoodCard key={image.src} image={image} index={i} className="mood-card--arch" />
        ))}
      </div>
"""
if 'arch-photo-band' not in slides:
    slides = slides.replace(
        '      <Caption ar="البنية المعمارية" en="ARCHITECTURE" />',
        '      <Caption ar="البنية المعمارية" en="ARCHITECTURE" />' + arch_insert,
        1
    )

# ─────────────────────────────
# Insert image stack into testing slide
# ─────────────────────────────
testing_insert = """
      <div className="testing-photo-stack" aria-hidden="true">
        {WEB_MOOD.testing.map((image, i) => (
          <MoodCard key={image.src} image={image} index={i} className="mood-card--test" />
        ))}
      </div>
"""
if 'testing-photo-stack' not in slides:
    slides = slides.replace(
        '      <Caption ar="مرحلة الاختبار" en="TESTING" />',
        '      <Caption ar="مرحلة الاختبار" en="TESTING" />' + testing_insert,
        1
    )

slides_path.write_text(slides)

# ─────────────────────────────
# CSS patch
# ─────────────────────────────
marker = "/* ===== WEB MOOD PATCH ===== */"
if marker in css:
    css = css.split(marker)[0].rstrip() + "\n\n"

css += r'''
/* ===== WEB MOOD PATCH ===== */

.mood-collage,
.why-photo-rail,
.arch-photo-band,
.testing-photo-stack {
  position: absolute;
  z-index: 1;
  pointer-events: none;
}

.mood-collage--hero {
  top: 10.5cqh;
  right: 6.5cqw;
  width: 34cqw;
  display: grid;
  grid-template-columns: 1.08fr .92fr;
  gap: 1.2cqw;
}

.mood-collage--hero .mood-card:nth-child(1) {
  grid-column: 1 / span 2;
  height: 19cqh;
}

.mood-collage--hero .mood-card:nth-child(2),
.mood-collage--hero .mood-card:nth-child(3) {
  height: 14.2cqh;
}

.why-photo-rail {
  left: 6.5cqw;
  top: 13.5cqh;
  display: grid;
  gap: 1.15cqh;
}

.why-photo-rail .mood-card {
  width: 17.5cqw;
  height: 15.5cqh;
}

.arch-photo-band {
  top: 10.5cqh;
  left: 6.2cqw;
  display: flex;
  gap: 1.1cqw;
}

.arch-photo-band .mood-card {
  width: 15.8cqw;
  height: 11.5cqh;
}

.testing-photo-stack {
  top: 13cqh;
  right: 6.4cqw;
  display: grid;
  gap: 1.2cqh;
}

.testing-photo-stack .mood-card {
  width: 18cqw;
  height: 14.4cqh;
}

.mood-card {
  position: relative;
  margin: 0;
  overflow: hidden;
  border-radius: 24px;
  border: 1px solid rgba(31,39,35,.08);
  background: rgba(255,255,255,.78);
  box-shadow: 0 24px 80px rgba(38,30,18,.16);
  opacity: 0;
  transform:
    translateY(28px)
    rotate(calc((var(--i) - 1) * 1.8deg))
    scale(.97);
  will-change: transform, opacity;
}

.mood-card img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  filter: saturate(1.06) contrast(1.02);
  transform: scale(1.02);
}

.mood-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(255,255,255,.08), rgba(0,0,0,.08)),
    linear-gradient(135deg, rgba(255,255,255,.12), transparent 42%);
  z-index: 1;
}

.mood-card::after {
  content: "";
  position: absolute;
  inset: auto 0 0 0;
  height: 34%;
  background: linear-gradient(180deg, transparent, rgba(0,0,0,.22));
  z-index: 1;
}

.slide[data-active="true"] .mood-card {
  animation:
    moodIn .9s calc(.18s + var(--i)*.11s) var(--ease) forwards,
    moodFloat 7s calc(1.15s + var(--i)*.26s) ease-in-out infinite;
}

@keyframes moodIn {
  from {
    opacity: 0;
    transform:
      translateY(28px)
      rotate(calc((var(--i) - 1) * 3deg))
      scale(.96);
  }
  to {
    opacity: .98;
    transform:
      translateY(0)
      rotate(calc((var(--i) - 1) * 1.2deg))
      scale(1);
  }
}

@keyframes moodFloat {
  0%, 100% {
    translate: 0 0;
  }
  50% {
    translate: 0 -6px;
  }
}

/* give room so photos don't collide */
.scene--title .title-core {
  position: relative;
  z-index: 3;
}

.scene--architecture .arch-visual {
  position: absolute;
  left: 20cqw;
  right: 4cqw;
  bottom: 4.5cqh;
  top: 13.8cqh;
  width: auto;
  height: auto;
}

.scene--testing .testing-layout {
  width: 70cqw;
  margin-left: 0;
}

.scene--testing .testing-foot {
  position: absolute;
  left: 7cqw;
  bottom: 7cqh;
}

.scene--why .why-visual {
  left: 27cqw;
  width: 63cqw;
}

.scene--why .why-equation {
  left: 7.5cqw;
  bottom: 8.8cqh;
  right: auto;
}

@media (max-width: 1200px) {
  .mood-collage--hero {
    width: 38cqw;
  }

  .why-photo-rail .mood-card,
  .testing-photo-stack .mood-card {
    width: 19cqw;
  }
}

@media (max-width: 980px), (max-height: 720px) {
  .mood-collage--hero,
  .why-photo-rail,
  .arch-photo-band,
  .testing-photo-stack {
    opacity: .78;
    transform: scale(.92);
    transform-origin: top center;
  }
}
'''

css_path.write_text(css)

print("✅ Added internet mood images")
print("✅ Added hero collage")
print("✅ Added architecture/testing image blocks")
print("✅ Backed up src already")
PY

echo
echo "✅ Done"
echo "شغّل الآن:"
echo "npm run dev"

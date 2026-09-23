/* ============================================================
   Northstar Capital Partners — app.js
   ============================================================
   CONFIGURATION — change these in one place and they propagate
   throughout the site automatically.
   ============================================================ */
const BRAND_NAME     = 'Northstar Capital Partners';
const BRAND_SHORT    = 'Northstar Capital';
const SUCCESS_FEE    = '10%';           // e.g. change to '8%' → updates all copy
const LEAD_WEBHOOK_URL = '';            // ← paste your GHL inbound webhook URL here

/* ============================================================
   ASSESSMENT QUESTIONS
   9 questions across 4 pillars.
   Max points per question = 3.  Grand total = 27 pts.
   Pillar maximums: Entity & Structure 9 | Credit Profile 6 |
                    Financials 9         | Documentation 3
   ============================================================ */
const QUESTIONS = [
  /* ── ENTITY & STRUCTURE (3 questions, max 9 pts) ── */
  {
    id: 'entity_structure',
    pillar: 'Entity & Structure',
    pillarKey: 'entity',
    q: 'How is your business legally registered?',
    options: [
      { label: 'Active LLC or corporation in good standing with the state', points: 3 },
      { label: 'Registered, but filings or state standing need attention',   points: 2 },
      { label: 'Sole proprietor or DBA only',                               points: 1 },
      { label: 'Not formally registered yet',                               points: 0 },
    ],
  },
  {
    id: 'ein_bank',
    pillar: 'Entity & Structure',
    pillarKey: 'entity',
    q: 'Do you have an EIN and a dedicated business bank account?',
    options: [
      { label: 'Yes — EIN issued and a business account used for all revenue',      points: 3 },
      { label: 'Yes — but personal and business funds still flow through one account', points: 2 },
      { label: 'EIN only, no separate business bank account',                        points: 1 },
      { label: 'Neither yet',                                                        points: 0 },
    ],
  },
  {
    id: 'business_age',
    pillar: 'Entity & Structure',
    pillarKey: 'entity',
    q: 'How long has the business been actively operating?',
    options: [
      { label: '2 years or more',                 points: 3 },
      { label: '12 – 24 months',                  points: 2 },
      { label: '6 – 12 months',                   points: 1 },
      { label: 'Under 6 months or pre-revenue',   points: 0 },
    ],
  },

  /* ── CREDIT PROFILE (2 questions, max 6 pts) ── */
  {
    id: 'personal_credit',
    pillar: 'Credit Profile',
    pillarKey: 'credit',
    q: 'Which range best describes your personal credit score?',
    options: [
      { label: '720 or above, with low utilization',           points: 3 },
      { label: '660 – 719',                                    points: 2 },
      { label: '580 – 659',                                    points: 1 },
      { label: 'Below 580, or recent derogatory marks on file', points: 0 },
    ],
  },
  {
    id: 'biz_tradelines',
    pillar: 'Credit Profile',
    pillarKey: 'credit',
    q: 'Does your business have trade lines reporting to D&B, Experian Business, or Equifax Business?',
    options: [
      { label: 'Yes — multiple accounts reporting to all three bureaus', points: 3 },
      { label: 'Yes — one or two accounts reporting to at least one bureau', points: 2 },
      { label: 'We have accounts but nothing is reporting yet',           points: 1 },
      { label: 'No business credit profile established',                  points: 0 },
    ],
  },

  /* ── FINANCIALS (3 questions, max 9 pts) ── */
  {
    id: 'revenue',
    pillar: 'Financials',
    pillarKey: 'financials',
    q: 'What is your average monthly gross revenue over the past six months?',
    options: [
      { label: '$30,000 or more',       points: 3 },
      { label: '$10,000 – $29,999',     points: 2 },
      { label: '$1 – $9,999',           points: 1 },
      { label: 'No revenue yet',        points: 0 },
    ],
  },
  {
    id: 'deposits',
    pillar: 'Financials',
    pillarKey: 'financials',
    q: 'Are your business bank deposits consistent from month to month?',
    options: [
      { label: 'Yes — relatively steady with no major unexplained gaps',          points: 3 },
      { label: 'Mostly — some variation but a clear upward or stable trend',      points: 2 },
      { label: 'Irregular — significant swings or occasional months with nothing', points: 1 },
      { label: 'No business account to track deposits yet',                        points: 0 },
    ],
  },
  {
    id: 'books',
    pillar: 'Financials',
    pillarKey: 'financials',
    q: 'Are your books current and are your last two years of tax returns filed?',
    options: [
      { label: 'Yes — bookkeeping is up to date and both returns are filed', points: 3 },
      { label: 'Bookkeeping is current but one return is still pending',      points: 2 },
      { label: 'Neither is fully current but we are working on it',          points: 1 },
      { label: 'No formal bookkeeping and returns are behind',               points: 0 },
    ],
  },

  /* ── DOCUMENTATION (1 question, max 3 pts) ── */
  {
    id: 'docs',
    pillar: 'Documentation',
    pillarKey: 'docs',
    q: 'Which documents could you produce today if a lender asked?',
    options: [
      { label: 'All of: 3 months bank statements, P&L, balance sheet, tax returns, articles of org. + EIN letter', points: 3 },
      { label: 'Most of the above — missing one or two items',                                                      points: 2 },
      { label: 'Some — bank statements and maybe one other',                                                        points: 1 },
      { label: 'None of the above are ready',                                                                       points: 0 },
    ],
  },
];

/* ============================================================
   SCORING BANDS
   threshold = score / maxScore  (27 pts)
   ============================================================ */
const BANDS = [
  {
    min: 0.80,
    name: 'Funding Ready',
    summary: `Your profile is in strong shape. The priority now is approaching the right funding products in the right sequence so you do not waste inquiries or leave capacity on the table.`,
    recommendations: [
      'Sequence applications so your strongest products are approached first.',
      'Keep utilization low and deposits consistent throughout the application window.',
      'Have your full documentation package assembled before the first application goes out.',
    ],
  },
  {
    min: 0.60,
    name: 'Nearly Ready',
    summary: `You are close. A short list of fixable gaps is standing between you and materially better offers — most can be closed in weeks, not months.`,
    recommendations: [
      'Close the two or three lowest-scoring areas before submitting applications.',
      'Strengthen business trade lines so the credit profile stands on its own.',
      'Tighten bank statement presentation and bring bookkeeping fully current.',
    ],
  },
  {
    min: 0.35,
    name: 'Building',
    summary: `The foundation is partly in place, but applying today would likely produce declines or expensive offers. Focus on entity structure and credit reporting first — those items need time to season.`,
    recommendations: [
      'Completely separate business and personal finances.',
      'Begin reporting business trade lines now so history can age.',
      'Address derogatory items and high utilization on the personal side.',
      'Get bookkeeping current and returns filed.',
    ],
  },
  {
    min: 0,
    name: 'Foundation Stage',
    summary: `Do not apply yet. Submitting now would cost you inquiries and declines without changing the outcome. The good news: foundation work moves fast once you start.`,
    recommendations: [
      'Register the entity properly and verify good standing with your state.',
      'Obtain an EIN and open a dedicated business bank account.',
      'Begin building a business credit profile from zero.',
      'Establish basic bookkeeping and write a clear use-of-funds statement.',
    ],
  },
];

/* ============================================================
   PILLAR DEFINITIONS (for breakdown display)
   ============================================================ */
const PILLARS = [
  { key: 'entity',    label: 'Entity & Structure', max: 9 },
  { key: 'credit',    label: 'Credit Profile',     max: 6 },
  { key: 'financials',label: 'Financials',         max: 9 },
  { key: 'docs',      label: 'Documentation',      max: 3 },
];

const MAX_SCORE = 27; // 9 questions × 3 pts

/* ============================================================
   UTILITY — inject brand/fee tokens into page text
   ============================================================ */
function injectTokens() {
  document.querySelectorAll('[data-brand]').forEach(el => {
    el.textContent = BRAND_NAME;
  });
  document.querySelectorAll('[data-brand-short]').forEach(el => {
    el.textContent = BRAND_SHORT;
  });
  document.querySelectorAll('[data-fee]').forEach(el => {
    el.textContent = SUCCESS_FEE;
  });
}

/* ============================================================
   MOBILE NAV
   ============================================================ */
function initMobileNav() {
  const toggle  = document.getElementById('nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  if (!toggle || !mobileNav) return;

  toggle.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });

  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ============================================================
   SERVICES DROPDOWN (desktop)
   ============================================================ */
function initDropdown() {
  document.querySelectorAll('.nav-drop').forEach(drop => {
    const btn  = drop.querySelector('.nav-drop__btn');
    const menu = drop.querySelector('.nav-drop__menu');
    if (!btn || !menu) return;

    btn.addEventListener('click', e => {
      e.stopPropagation();
      const open = menu.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.nav-drop__menu.open').forEach(m => {
      m.classList.remove('open');
      m.previousElementSibling?.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ============================================================
   MINI-QUIZ (homepage hero preview)
   Clicking any option redirects to the full assessment.
   ============================================================ */
function initMiniQuiz() {
  const shell = document.getElementById('mini-quiz');
  if (!shell) return;

  shell.querySelectorAll('.quiz__opt').forEach(opt => {
    opt.addEventListener('click', () => {
      window.location.href = 'assessment.html';
    });
  });
}

/* ============================================================
   FULL ASSESSMENT QUIZ
   ============================================================ */
function initAssessmentQuiz() {
  const container = document.getElementById('assessment-quiz');
  if (!container) return;

  let currentIdx = 0;
  const answers  = new Array(QUESTIONS.length).fill(null); // points or null

  const totalEl   = container.querySelector('[data-total]');
  const currentEl = container.querySelector('[data-current]');
  const barFill   = container.querySelector('.quiz__bar-fill');

  // Build question screens
  const quizBody = container.querySelector('#quiz-steps');
  if (!quizBody) return;

  QUESTIONS.forEach((q, idx) => {
    const div = document.createElement('div');
    div.className = 'quiz-q' + (idx === 0 ? ' active' : '');
    div.id = `q-${idx}`;

    div.innerHTML = `
      <span class="quiz__pillar">${String(idx + 1).padStart(2,'0')} · ${escHtml(q.pillar)}</span>
      <p class="quiz__text">${escHtml(q.q)}</p>
      <div class="quiz__opts" id="opts-${idx}">
        ${q.options.map((o, oi) => `
          <label class="quiz__opt" data-pts="${o.points}" data-qi="${idx}" data-oi="${oi}">
            <input type="radio" name="q${idx}" value="${oi}" style="display:none">
            <span>${escHtml(o.label)}</span>
          </label>`).join('')}
      </div>
      <div class="quiz__nav">
        <button class="quiz__back" data-back type="button" ${idx === 0 ? 'disabled' : ''}>← Back</button>
        <button class="quiz__next" data-next type="button" disabled>
          ${idx === QUESTIONS.length - 1 ? 'Continue →' : 'Next →'}
        </button>
      </div>
    `;
    quizBody.appendChild(div);
  });

  // Option selection
  quizBody.addEventListener('click', e => {
    const opt = e.target.closest('.quiz__opt');
    if (!opt) return;
    const qi = parseInt(opt.dataset.qi, 10);
    // Deselect siblings
    container.querySelectorAll(`#opts-${qi} .quiz__opt`).forEach(o => o.classList.remove('selected'));
    opt.classList.add('selected');
    answers[qi] = parseInt(opt.dataset.pts, 10);
    // Enable next
    const nextBtn = container.querySelector(`#q-${qi} [data-next]`);
    if (nextBtn) nextBtn.disabled = false;
  });

  // Navigation
  quizBody.addEventListener('click', e => {
    if (e.target.closest('[data-back]')) {
      if (currentIdx > 0) goTo(currentIdx - 1);
      return;
    }
    if (e.target.closest('[data-next]')) {
      if (currentIdx < QUESTIONS.length - 1) {
        goTo(currentIdx + 1);
      } else {
        showLeadForm();
      }
    }
  });

  function goTo(idx) {
    container.querySelector(`#q-${currentIdx}`)?.classList.remove('active');
    currentIdx = idx;
    container.querySelector(`#q-${currentIdx}`)?.classList.add('active');
    updateProgress();
  }

  function updateProgress() {
    if (currentEl) currentEl.textContent = currentIdx + 1;
    if (totalEl)   totalEl.textContent   = QUESTIONS.length;
    if (barFill)   barFill.style.width   = ((currentIdx / QUESTIONS.length) * 100) + '%';
  }

  updateProgress();

  /* ── Lead capture form ── */
  function showLeadForm() {
    quizBody.style.display = 'none';
    const lf = container.querySelector('#lead-form');
    if (lf) lf.style.display = 'block';
    if (barFill) barFill.style.width = '95%';
    if (currentEl) currentEl.textContent = '✓';
  }

  /* ── Lead form submit ── */
  const leadFormEl = container.querySelector('#lead-form form');
  if (leadFormEl) {
    leadFormEl.addEventListener('submit', async e => {
      e.preventDefault();

      const score      = answers.reduce((sum, a) => sum + (a ?? 0), 0);
      const ratio      = score / MAX_SCORE;
      const band       = BANDS.find(b => ratio >= b.min);
      const pillarData = computePillars(answers);

      // Assemble hidden JSON payload
      const payload = {
        brand:          BRAND_NAME,
        full_name:      leadFormEl.querySelector('[name=full_name]')?.value || '',
        email:          leadFormEl.querySelector('[name=email]')?.value || '',
        phone:          leadFormEl.querySelector('[name=phone]')?.value || '',
        business_name:  leadFormEl.querySelector('[name=business_name]')?.value || '',
        score,
        max_score:      MAX_SCORE,
        score_pct:      Math.round(ratio * 100),
        band:           band?.name || '',
        answers:        QUESTIONS.map((q, i) => ({
          id:      q.id,
          pillar:  q.pillar,
          points:  answers[i] ?? 0,
          option:  q.options[answers[i] ?? 0]?.label || '',
        })),
        pillar_breakdown: pillarData,
        submitted_at:   new Date().toISOString(),
      };

      // Store in hidden field
      const hiddenJson = leadFormEl.querySelector('[name=answers_json]');
      if (hiddenJson) hiddenJson.value = JSON.stringify(payload);

      // POST to webhook if configured
      if (LEAD_WEBHOOK_URL) {
        try {
          await fetch(LEAD_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
        } catch (err) {
          console.warn('Webhook delivery failed (results still shown):', err);
        }
      }

      // Show results
      showResults(score, ratio, band, pillarData);
    });
  }

  /* ── Results display ── */
  function showResults(score, ratio, band, pillarData) {
    container.querySelector('#lead-form').style.display = 'none';
    const resultsEl = container.querySelector('#results-panel');
    if (!resultsEl) return;
    resultsEl.style.display = 'block';

    if (barFill) barFill.style.width = '100%';

    const pct = Math.round(ratio * 100);

    // Score + band
    resultsEl.querySelector('.results__pct').textContent  = pct + '%';
    resultsEl.querySelector('.results__band').textContent = band?.name || '';
    resultsEl.querySelector('.results__summary').textContent = band?.summary || '';

    // Recommendations
    const recList = resultsEl.querySelector('.results__rec-list');
    if (recList && band?.recommendations) {
      recList.innerHTML = band.recommendations.map(r =>
        `<li class="results__rec-item">${escHtml(r)}</li>`
      ).join('');
    }

    // Pillar breakdown
    const pillarsEl = resultsEl.querySelector('.pillars');
    if (pillarsEl) {
      pillarsEl.innerHTML = PILLARS.map(p => {
        const earned  = pillarData[p.key] || 0;
        const pctPillar = Math.round((earned / p.max) * 100);
        return `
          <div class="pillar-row">
            <span class="pillar-row__name">${escHtml(p.label)}</span>
            <span class="pillar-row__pct">${pctPillar}%</span>
            <div class="pillar-row__bar">
              <div class="pillar-row__fill" style="width:${pctPillar}%"></div>
            </div>
          </div>`;
      }).join('');
    }

    // CTA blurb
    const ctaEl = resultsEl.querySelector('.results__cta');
    if (ctaEl) {
      ctaEl.innerHTML = `<strong>What's next?</strong> A member of our team will be in touch to walk through your results and map the gaps in priority order. Questions? <a href="contact.html" style="color:var(--emerald);font-weight:600">Contact us directly →</a>`;
    }
  }

  /* ── Pillar score aggregation ── */
  function computePillars(ans) {
    const totals = {};
    PILLARS.forEach(p => totals[p.key] = 0);
    QUESTIONS.forEach((q, i) => {
      totals[q.pillarKey] = (totals[q.pillarKey] || 0) + (ans[i] ?? 0);
    });
    return totals;
  }
}

/* ============================================================
   CONTACT FORM
   ============================================================ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const payload = {
      brand:   BRAND_NAME,
      name:    form.querySelector('[name=name]')?.value     || '',
      email:   form.querySelector('[name=email]')?.value    || '',
      message: form.querySelector('[name=message]')?.value  || '',
      submitted_at: new Date().toISOString(),
    };

    if (LEAD_WEBHOOK_URL) {
      try {
        await fetch(LEAD_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch (err) {
        console.warn('Contact webhook error:', err);
      }
    }

    const successMsg = document.getElementById('contact-success');
    if (successMsg) {
      form.style.display = 'none';
      successMsg.classList.add('show');
    }
  });
}

/* ============================================================
   HELPERS
   ============================================================ */
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  injectTokens();
  initMobileNav();
  initDropdown();
  initMiniQuiz();
  initAssessmentQuiz();
  initContactForm();
});

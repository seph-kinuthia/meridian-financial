import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { ArrowRight, BarChart3, Check, ChevronDown, Download, ExternalLink, FileText, Globe2, Headphones, Menu, Pause, Play, Search, ShieldCheck, SlidersHorizontal, Volume2, VolumeX, X } from 'lucide-react';
import { articles, funds, navigation, pageContent, type NavItem } from './data';

const HERO_VIDEO = '/videos/4319342-hd_1920_1080_30fps.mp4';
const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

function Logo() {
  return <Link to="/" className="logo" aria-label="Enwealth home"><img src={assetUrl('/images/hero/Enwealth-logo-2-1024x266.png')} width={1024} height={266} alt="Enwealth" /></Link>;
}

function Header() {
  const [active, setActive] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  useEffect(() => { setActive(null); setMobile(false); window.scrollTo(0, 0); }, [location.pathname]);
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 16); onScroll(); addEventListener('scroll', onScroll, { passive: true }); return () => removeEventListener('scroll', onScroll); }, []);
  useEffect(() => { const close = (e: KeyboardEvent) => e.key === 'Escape' && (setActive(null), setMobile(false)); addEventListener('keydown', close); return () => removeEventListener('keydown', close); }, []);

  return <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
    <div className="utility"><div className="nav-shell"><span>People. Purpose. Progress.</span><div><Link to="/support">Support</Link><Link to="/support/search"><Search size={13}/> Search</Link></div></div></div>
    <div className="nav-shell nav-main">
      <Logo />
      <nav className="desktop-nav" aria-label="Primary navigation">
        {navigation.map(item => <div className="nav-item" key={item.title} onMouseEnter={() => item.children && setActive(item.title)} onMouseLeave={() => setActive(null)}>
          <NavLink to={item.path} target={item.path.startsWith('http') ? '_blank' : undefined} rel={item.path.startsWith('http') ? 'noreferrer' : undefined} className={({isActive}) => isActive ? 'active' : ''} onFocus={() => item.children && setActive(item.title)} aria-expanded={item.children ? active === item.title : undefined}>{item.title}{item.children && <ChevronDown size={13}/>}</NavLink>
          {item.children && active === item.title && <MegaMenu item={item} close={() => setActive(null)} />}
        </div>)}
      </nav>
      <AccountMenu className="account" />
      <button className="menu-button" onClick={() => setMobile(!mobile)} aria-label="Toggle menu" aria-expanded={mobile}>{mobile ? <X/> : <Menu/>}</button>
    </div>
    {mobile && <MobileNav />}
  </header>;
}

function AccountMenu({ className = '' }: { className?: string }) {
  return <details className={`account-menu ${className}`}>
    <summary className="button button-small button-lime">Manage account <ChevronDown size={14}/></summary>
    <div className="account-dropdown" role="menu">
      <span className="account-label">Customer portals</span>
      <a href="https://portal.enwealth.co.ke/" target="_blank" rel="noreferrer" role="menuitem"><span><b>Pension</b><small>Member benefits and statements</small></span><ExternalLink/></a>
      <a href="https://invest.enwealth.co.ke/" target="_blank" rel="noreferrer" role="menuitem"><span><b>Investment</b><small>Enwealth Capital accounts</small></span><ExternalLink/></a>
      <Link to="/support/contact" role="menuitem"><span><b>Insurance</b><small>Policies and service support</small></span><ArrowRight/></Link>
      <Link to="/investments/impact-debt-fund" role="menuitem"><span><b>Impact Debt Fund</b><small>Fund information and enquiries</small></span><ArrowRight/></Link>
    </div>
  </details>;
}

function MegaMenu({ item, close }: { item: NavItem; close: () => void }) {
  return <div className="mega-wrap"><div className="mega-menu">
    <div className="mega-intro"><span className="eyebrow">Explore</span><h3>{item.title}</h3><p>{item.title === 'Investments' ? 'Purposeful options, clear information and the perspective to choose well.' : `Specialist ${item.title.toLowerCase()} solutions for decisions that matter.`}</p><Link to={item.path} onClick={close}>View overview <ArrowRight size={15}/></Link></div>
    <div className="mega-links">{item.children?.map((child, i) => <div className="mega-link-wrap" key={child.path}><Link to={child.path} target={child.path.startsWith('http') ? '_blank' : undefined} rel={child.path.startsWith('http') ? 'noreferrer' : undefined} onClick={close}><span className="mega-num">0{i+1}</span><span><b>{child.title}</b>{child.description && <small>{child.description}</small>}</span><ArrowRight size={15}/></Link>{child.children && <div className="nested-links">{child.children.map(c => <Link onClick={close} key={c.path} to={c.path} target={c.path.startsWith('http') ? '_blank' : undefined} rel={c.path.startsWith('http') ? 'noreferrer' : undefined}>{c.title}</Link>)}</div>}</div>)}</div>
    <div className="mega-aside"><div className="insight-kicker">Latest perspective</div><div className="mini-graphic"><span/><span/><span/><span/></div><b>How much should go towards pension versus savings?</b><small>Pensions · Enwealth Insights</small><Link to="/insights" onClick={close}>Read insight <ArrowRight size={14}/></Link></div>
  </div></div>;
}

function MobileNav() {
  const [open, setOpen] = useState<string | null>('Individuals');
  return <nav className="mobile-nav" aria-label="Mobile navigation">{navigation.map(item => <div key={item.title} className="mobile-group">
    <div><Link to={item.path} target={item.path.startsWith('http') ? '_blank' : undefined} rel={item.path.startsWith('http') ? 'noreferrer' : undefined}>{item.title}</Link>{item.children && <button onClick={() => setOpen(open === item.title ? null : item.title)} aria-label={`Expand ${item.title}`}><ChevronDown className={open === item.title ? 'rotate' : ''}/></button>}</div>
    {open === item.title && item.children && <div className="mobile-sub">{item.children.map(c => <Link key={c.path} to={c.path} target={c.path.startsWith('http') ? '_blank' : undefined} rel={c.path.startsWith('http') ? 'noreferrer' : undefined}>{c.title}<small>{c.description}</small></Link>)}</div>}
  </div>)}<div className="mobile-actions"><Link to="/support">Support</Link><AccountMenu /></div></nav>;
}

function ButtonLink({ to, children, secondary = false }: { to: string; children: React.ReactNode; secondary?: boolean }) {
  return <Link className={`button ${secondary ? 'button-outline' : 'button-lime'}`} to={to}>{children}<ArrowRight size={16}/></Link>;
}

function SectionHeading({ eyebrow, title, text, action }: { eyebrow: string; title: string; text?: string; action?: React.ReactNode }) {
  return <div className="section-heading"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{text && <p>{text}</p>}</div>{action}</div>;
}

function HeroVisual() {
  return <div className="hero-visual" aria-label="Illustration of a steadily growing investment outlook">
    <div className="orbit orbit-one"/><div className="orbit orbit-two"/>
    <div className="data-card performance"><span>Long-term outlook</span><b>Plan with perspective</b><div className="chart"><svg viewBox="0 0 480 160" role="img"><title>Illustrative growth curve, not actual performance</title><defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c9f34b" stopOpacity=".28"/><stop offset="1" stopColor="#c9f34b" stopOpacity="0"/></linearGradient></defs><path className="area" d="M0 135 C45 130 75 138 112 108 S172 122 215 86 S282 92 320 58 S396 74 480 20 L480 160 L0 160Z"/><path className="line" d="M0 135 C45 130 75 138 112 108 S172 122 215 86 S282 92 320 58 S396 74 480 20"/><g><circle cx="112" cy="108" r="5"/><circle cx="320" cy="58" r="5"/><circle cx="480" cy="20" r="5"/></g></svg></div><div className="chart-meta"><span>Today</span><span>Next horizon</span></div></div>
    <div className="data-card allocation"><span>Portfolio thinking</span><div className="donut"><i/><strong>Balanced<small>Illustrative</small></strong></div><div className="legend"><span><i className="p"/>Growth</span><span><i className="l"/>Income</span><span><i className="n"/>Liquidity</span></div></div>
    <div className="pulse-card"><i/><span>Guided by your goals</span></div>
  </div>;
}

function HeroVideo({ src, label }: { src: string; label?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const v = ref.current;
    if (!v || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    v.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, [src]);

  const togglePlay = () => { const v = ref.current; if (!v) return; v.paused ? v.play() : v.pause(); };
  const toggleMute = () => { const v = ref.current; if (!v) return; v.muted = !v.muted; setMuted(v.muted); };

  return <>
    <video className="hero-video" ref={ref} src={assetUrl(src)} muted loop autoPlay playsInline preload="metadata" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} aria-hidden="true" tabIndex={-1} />
    <div className="video-controls">
      <button type="button" onClick={togglePlay} aria-label={playing ? 'Pause background video' : 'Play background video'}>{playing ? <Pause /> : <Play />}</button>
      <button type="button" onClick={toggleMute} aria-label={muted ? 'Unmute background video' : 'Mute background video'}>{muted ? <VolumeX /> : <Volume2 />}</button>
    </div>
    <span className="sr-only">{label || 'Background video'}</span>
  </>;
}

function HomePage() {
  return <>
    <main id="main">
      <section className="hero has-media"><HeroVideo src={HERO_VIDEO} label="Enwealth brand film"/><div className="container hero-grid"><div className="hero-copy"><span className="eyebrow light">People · Purpose · Progress</span><h1>A lifetime of<br/><em>financial wellbeing.</em></h1><p>Administration, trustee services, consulting, insurance, investments and training—brought together to help people and organisations build a better tomorrow.</p><div className="button-row"><ButtonLink to="/investments">Explore investments</ButtonLink><ButtonLink to="/retirement" secondary>Plan your future</ButtonLink></div><div className="hero-note"><ShieldCheck size={17}/><span>Serving clients across Kenya, Uganda, Mauritius and wider African markets.</span></div></div></div></section>

      <section className="credibility"><div className="container credibility-grid"><div><span className="eyebrow">Enwealth at a glance</span><h2>Built in Africa.<br/>Built for tomorrow.</h2></div><p>Founded in Kenya in 2011, Enwealth has grown into an integrated regional financial-services group.</p><div className="cred-metrics"><div><b>124B+</b><span>KES entrusted to our care<small>Published company figure</small></span></div><div><b>300+</b><span>Corporate clients<small>Across the group</small></span></div><div><b>10+</b><span>African markets reached<small>Regional footprint</small></span></div></div></div></section>

      <section className="section solutions"><div className="container"><SectionHeading eyebrow="Solutions" title="Finance, made more human." text="Different ambitions need different answers. Start where you are."/>
        <div className="solution-grid"><Link to="/individuals" className="solution-panel individuals"><div className="panel-index">01 / Individuals</div><div className="portrait-abstract"><span/><span/><span/></div><div className="panel-copy"><h3>Plan today for the life you want tomorrow.</h3><p>Investing, retirement, protection and financial education organised around your life stage.</p><span>Explore individual solutions <ArrowRight/></span></div></Link>
        <Link to="/organisations" className="solution-panel organisations"><div className="panel-index">02 / Organisations</div><div className="building-abstract"><i/><i/><i/><i/><i/></div><div className="panel-copy"><h3>Better-governed benefits. Better-supported people.</h3><p>Administration, trusteeship, consulting, insurance and training for employers and schemes.</p><span>Explore organisation solutions <ArrowRight/></span></div></Link></div>
      </div></section>

      <section className="section investments-section"><div className="container"><SectionHeading eyebrow="Enwealth Capital" title="Funds built for your next chapter." text="Choose a fund around your investment horizon, income needs and appetite for risk." action={<Link className="text-link" to="/investments/compare-funds">Compare all funds <ArrowRight size={16}/></Link>}/><div className="fund-list">{funds.map((fund, i) => <Link to={`/investments/funds/${fund.slug}`} className={`fund-row ${fund.tone}`} key={fund.slug}><span className="fund-number">0{i+1}</span><span className="fund-name"><b>{fund.name}</b><small>{fund.type}</small></span><span><small>Currency</small>{fund.currency}</span><span><small>Risk profile</small>{fund.risk}</span><span><small>Investment horizon</small>{fund.horizon}</span><ArrowRight/></Link>)}</div><p className="disclaimer">Past performance is not a guide to future performance. Unit prices may fall as well as rise, and capital and returns are not guaranteed.</p></div></section>

      <section className="retirement-story"><div className="container retirement-grid"><div className="retirement-copy"><span className="eyebrow light">Retirement, reimagined</span><h2>A plan for life.<br/><em>Not just a date.</em></h2><p>Your retirement journey changes as you do. Build a plan with the structure to grow and the flexibility to adapt.</p><ButtonLink to="/retirement">Explore retirement planning</ButtonLink></div><div className="journey"><div className="journey-top"><span>Your journey</span><span>Move at your pace</span></div><div className="journey-line"><i/><i/><i/><i/><i/></div><div className="journey-labels"><span><b>Today</b><small>Define</small></span><span><b>Build</b><small>Contribute</small></span><span><b>Grow</b><small>Invest</small></span><span><b>Retire</b><small>Transition</small></span><span><b>Draw</b><small>Live</small></span></div><div className="projection"><div><span>Illustrative planning horizon</span><b>Explore what your future could look like</b></div><BarChart3/><small>No projection is shown until assumptions are provided.</small></div></div></div></section>

      <section className="section wellbeing"><div className="container wellbeing-grid"><div><span className="eyebrow">Financial wellbeing</span><h2>Confidence starts<br/>with understanding.</h2><p>Practical tools and plain-language guidance to help you take control of the everyday—and prepare for the bigger picture.</p><Link className="text-link" to="/individuals/financial-wellbeing">Explore financial wellbeing <ArrowRight/></Link></div><div className="tool-list"><Link to="/individuals/financial-wellbeing"><span><b>01</b><i><BarChart3/></i></span><div><h3>Retirement planner</h3><p>Turn today’s choices into a clearer long-term view.</p></div><ArrowRight/></Link><Link to="/individuals/financial-wellbeing"><span><b>02</b><i><SlidersHorizontal/></i></span><div><h3>Investment explorer</h3><p>Understand which options may fit your goal and horizon.</p></div><ArrowRight/></Link><Link to="/support"><span><b>03</b><i><Headphones/></i></span><div><h3>Talk to a specialist</h3><p>Get considered support for the decision in front of you.</p></div><ArrowRight/></Link></div></div></section>

      <section className="section insights-section"><div className="container"><SectionHeading eyebrow="Perspectives" title="See the bigger picture." text="Timely thinking for long-term financial decisions." action={<Link className="text-link" to="/insights">All insights <ArrowRight/></Link>}/><div className="article-grid">{articles.map((a, i) => <Link className={`article-card article-${i+1}`} to="/insights" key={a.title}><div className="article-art"><span/><span/><span/></div><div className="article-meta"><span>{a.category}</span><span>{a.time}</span></div><h3>{a.title}</h3><div className="article-date">{a.date}<ArrowRight/></div></Link>)}</div></div></section>

      <CTA />
    </main>
  </>;
}

function Breadcrumbs({ items }: { items: string[] }) { return <nav className="breadcrumbs" aria-label="Breadcrumb"><Link to="/">Home</Link>{items.map((x,i) => <span key={x}><b>/</b>{i === items.length-1 ? x : <Link to="#">{x}</Link>}</span>)}</nav>; }

function OverviewPage() {
  const { pathname } = useLocation();
  const parts = pathname.split('/').filter(Boolean);
  const title = parts[parts.length - 1]?.replaceAll('-', ' ') || 'Overview';
  const fallback = { eyebrow:'Enwealth', title:title.replace(/\b\w/g, c => c.toUpperCase()), intro:'[CONTENT REQUIRED]', sectionTitle:'Approved content required.', notice:'No corresponding content was found on the source site for this page.' };
  const content = pageContent[pathname.replace(/\/$/,'') || '/'] || fallback;
  const features = content.features || [];
  return <main id="main"><section className={`page-hero ${content.video || content.heroImage ? 'has-media' : ''}`}>{content.video && <HeroVideo src={content.video.src} label={content.video.title} />}{!content.video && content.heroImage && <img className="hero-image" src={assetUrl(content.heroImage)} alt="" aria-hidden="true" />}<div className="container"><Breadcrumbs items={parts.map(p => p.replaceAll('-', ' '))}/><div className="page-hero-grid"><div><span className="eyebrow light">{content.eyebrow}</span><h1>{content.title}</h1><p>{content.intro}</p><div className="button-row"><ButtonLink to="/support/contact">{content.cta || 'Talk to the team'}</ButtonLink><ButtonLink to="/support" secondary>Get support</ButtonLink></div></div>{!content.video && !content.heroImage && <div className="page-hero-art"><span>EN / 01</span><i/><i/><i/></div>}</div></div></section>
    {content.highlights && <section className="credibility"><div className="container source-highlights">{content.highlights.map((x,i)=><div key={x}><span>0{i+1}</span><b>{x}</b></div>)}</div></section>}
    {(features.length > 0 || content.sectionTitle) && <section className="section"><div className="container"><SectionHeading eyebrow="At a glance" title={content.sectionTitle || 'What you need to know.'} text={content.sectionIntro}/>{features.length > 0 && <div className="benefit-grid">{features.map((feature,i) => <div key={feature.title}><span>0{i+1}</span><h3>{feature.title}</h3><p>{feature.text}</p></div>)}</div>}{content.notice && <p className="content-notice">{content.notice}</p>}</div></section>}
    {content.steps && <section className="process-section"><div className="container"><SectionHeading eyebrow="How it works" title="A clear path forward."/><div className="process-steps">{content.steps.map((step,i) => <div key={step.title}><i>{i+1}</i><b>{step.title}</b><small>{step.text}</small></div>)}</div></div></section>}
    {content.faqs && <section className="section"><div className="container split-info"><div><span className="eyebrow">Common questions</span><h2>Before you begin.</h2></div><div className="accordion-list">{content.faqs.map(item => <details key={item.q}><summary>{item.q}<ChevronDown/></summary><p>{item.a}</p></details>)}</div></div></section>}
    {!content.sectionTitle && content.notice && <section className="section"><div className="container"><p className="content-notice">{content.notice}</p></div></section>}<CTA/></main>;
}

function FundPage() {
  const { slug } = useParams();
  const fund = funds.find(f => f.slug === slug) || funds[0];
  const [range, setRange] = useState('1Y');
  return <main id="main"><section className="fund-hero"><div className="container"><Breadcrumbs items={['Investments','Funds',fund.name]}/><div className="fund-hero-grid"><div><span className="badge">{fund.type}</span><h1>Enwealth {fund.name}<br/><em>Fund</em></h1><p>{fund.objective}</p><div className="button-row"><ButtonLink to="/support/contact">Enquire about this fund</ButtonLink><ButtonLink to="/investments/compare-funds" secondary>Compare funds</ButtonLink></div></div><div className="fund-snapshot"><div className="snapshot-top"><span>Fund snapshot</span><small>Published product terms</small></div><div className="snapshot-main"><span>Minimum initial investment</span><b>{fund.minimum}</b><small>See current application terms before investing</small></div><div className="snapshot-grid"><div><span>Currency</span><b>{fund.currency}</b></div><div><span>Risk</span><b>{fund.risk}</b></div><div><span>Horizon</span><b>{fund.horizon}</b></div><div><span>Liquidity</span><b>{fund.liquidity}</b></div></div></div></div></div></section>
    <section className="section"><div className="container"><SectionHeading eyebrow="Fund approach" title="Know what the fund is designed to do."/><div className="benefit-grid"><div><span>01</span><h3>Objective</h3><p>{fund.objective}</p></div><div><span>02</span><h3>What it invests in</h3><p>{fund.invests}</p></div><div><span>03</span><h3>How returns arise</h3><p>{fund.income}</p></div></div></div></section>
    <section className="section performance-section"><div className="container"><SectionHeading eyebrow="Performance" title="Check the current approved rate." text="Current rates and historical performance are published through the Enwealth customer portal and approved fund materials."/><div className="performance-panel"><div className="performance-controls"><div>{['1M','3M','6M','1Y','3Y','5Y'].map(x => <button className={range === x ? 'active' : ''} onClick={() => setRange(x)} key={x}>{x}</button>)}</div><span>Performance data · {range}</span></div><div className="empty-chart"><div className="grid-lines"/><BarChart3/><b>[CONTENT REQUIRED]</b><small>Connect the approved fund-data source to populate this view.</small></div></div></div></section>
    <section className="facts-section"><div className="container"><SectionHeading eyebrow="Fund facts" title="The detail, made legible."/><div className="facts-grid">{[['Risk classification',fund.risk],['Minimum investment',fund.minimum],['Management fee',fund.fee],['Liquidity',fund.liquidity],['Investment horizon',fund.horizon],['Currency',fund.currency],['Initial / redemption fee','Nil'],['Trustee','Co-operative Bank of Kenya Ltd']].map(([label,value]) => <div key={label}><span>{label}</span><b>{value}</b></div>)}</div><p className="disclaimer">Fund Manager: Old Mutual Investment Group Ltd. Custodian: SBM Bank (Kenya) Ltd. The scheme is offered with the permission of the Capital Markets Authority (Kenya).</p></div></section>
    <section className="section"><div className="container"><SectionHeading eyebrow="Documents" title="Everything you need, in one place."/><div className="document-list">{['Fund factsheet','Information memorandum','Annual report','Financial statements','Terms & conditions'].map(x => <div key={x}><FileText/><span><b>{x}</b><small>Available from the approved fund library</small></span><button aria-label={`Download ${x}`} disabled><Download/></button></div>)}</div><p className="content-notice">Past performance is not a guide to future performance. Unit values and income can fall or rise. Capital and returns are not guaranteed.</p></div></section><CTA/></main>;
}

function ComparePage() {
  const [selected, setSelected] = useState(funds.slice(0,3).map(f => f.slug));
  const shown = funds.filter(f => selected.includes(f.slug));
  const toggle = (slug:string) => setSelected(v => v.includes(slug) ? v.filter(x => x !== slug) : v.length < 4 ? [...v,slug] : v);
  return <main id="main"><section className="subpage-hero"><div className="container"><Breadcrumbs items={['Investments','Compare funds']}/><span className="eyebrow light">Enwealth Capital</span><h1>Compare funds.<br/><em>Choose with context.</em></h1><p>Compare the five sub-funds by objective, risk, horizon, fees and access. Select up to four.</p></div></section><section className="section compare-section"><div className="container"><div className="filter-chips">{funds.map(f => <button key={f.slug} className={selected.includes(f.slug) ? 'selected' : ''} onClick={() => toggle(f.slug)}><span>{selected.includes(f.slug) && <Check/>}</span>{f.name}</button>)}</div><div className="compare-table-wrap"><table className="compare-table"><thead><tr><th>Fund</th>{shown.map(f => <th key={f.slug}><span className={`fund-dot ${f.tone}`}/>{f.name}<Link to={`/investments/funds/${f.slug}`}>View fund <ArrowRight/></Link></th>)}</tr></thead><tbody>{[['Objective','type'],['Currency','currency'],['Risk profile','risk'],['Investment horizon','horizon'],['Management fee','fee'],['Minimum investment','minimum'],['Liquidity','liquidity']].map(([label,key]) => <tr key={key}><th>{label}</th>{shown.map(f => <td key={f.slug}>{f[key as keyof typeof f]}</td>)}</tr>)}</tbody></table></div><p className="disclaimer">Returns are not guaranteed. Choose a fund whose risk profile, liquidity and time horizon fit your needs, and consult a financial adviser if in doubt.</p></div></section><CTA/></main>;
}

function DocumentsPage() {
  const [query,setQuery]=useState('');
  const source = 'https://demo.seraphcyber.co.ke';
  const library = [
    {fund:'Money Market',type:'Fund factsheet',date:'May 2026',href:'/api/media/file/Enwealth-Money-Market-Fund-Fact-Sheet-as-at-May-2026.pdf'},
    {fund:'Dollar Money Market',type:'Fund factsheet',date:'May 2026',href:'/api/media/file/Enwealth-Dollar-Money-Market-Fund-Fact-Sheet-as-at-May-2026.pdf'},
    {fund:'Equity',type:'Fund factsheet',date:'May 2026',href:'/api/media/file/Enwealth-Equity-Fund-Fact-Sheet-as-at-May-2026.pdf'},
    {fund:'Balanced',type:'Fund factsheet',date:'May 2026',href:'/api/media/file/Enwealth-Balance-Fund-Fact-Sheet-as-at-May-2026.pdf'},
    {fund:'Fixed Income',type:'Fund factsheet',date:'May 2026',href:'/api/media/file/Enwealth-Fixed-Income-Fund-May-2026.pdf'},
  ];
  const rows=useMemo(()=>library.filter(x=>`${x.fund} ${x.type}`.toLowerCase().includes(query.toLowerCase())),[query]);
  return <main id="main"><section className="subpage-hero compact"><div className="container"><Breadcrumbs items={['Investments','Fund prices & documents']}/><span className="eyebrow light">Enwealth Capital library</span><h1>Fund documents.</h1><p>Approved factsheets and reporting from the published Enwealth Capital library.</p></div></section><section className="section"><div className="container"><div className="document-toolbar"><label><Search/><span className="sr-only">Search documents</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search by fund or document"/></label><button><SlidersHorizontal/> Filters</button></div><div className="table-wrap"><table className="data-table"><thead><tr><th>Fund</th><th>Document</th><th>Edition</th><th>Status</th><th><span className="sr-only">Action</span></th></tr></thead><tbody>{rows.map(r=><tr key={`${r.fund}${r.type}`}><td><b>{r.fund}</b></td><td>{r.type}</td><td>{r.date}</td><td><span className="status">Published</span></td><td><a href={`${source}${r.href}`} target="_blank" rel="noreferrer" aria-label={`Open ${r.fund} ${r.type}`}><Download/></a></td></tr>)}</tbody></table></div><p className="disclaimer">Fund prices and current rates should be verified through the customer portal or approved daily publications.</p></div></section><CTA/></main>;
}

function InsightsPage(){return <main id="main"><section className="subpage-hero"><div className="container"><Breadcrumbs items={['Insights']}/><span className="eyebrow light">Enwealth Insights</span><h1>Our latest<br/><em>thinking.</em></h1><p>Notes on retirement benefits, investment markets and regulation across the group.</p></div></section><section className="section"><div className="container"><div className="featured-article"><div className="feature-art"><i/><i/><i/></div><div><span className="eyebrow">Research · Enwealth Conversations</span><h2>Saving and investment behaviour among Kenyans.</h2><p>The seventh edition of Enwealth Conversations explores saving and investment behaviour across age groups throughout Kenya.</p><span className="article-info">Research series</span><Link className="text-link" to="/support/contact">Request the research <ArrowRight/></Link></div></div><div className="article-grid lower">{articles.map((a,i)=><article className={`article-card article-${i+1}`} key={a.title}><div className="article-art"><span/><span/><span/></div><div className="article-meta"><span>{a.category}</span><span>{a.time}</span></div><h3>{a.title}</h3><div className="article-date">{a.date}<ArrowRight/></div></article>)}</div></div></section><CTA/></main>}

const galleryItems = [
  { image: '/images/hero/about.jpg', category: 'Partnerships', title: 'Progress begins together', text: 'Building trusted relationships around shared goals and financial wellbeing.' },
  { image: '/images/hero/enwtraining-7-scaled.jpg', category: 'Training', title: 'Knowledge that builds confidence', text: 'Practical learning for trustees, members and people approaching retirement.' },
  { image: '/images/hero/portrait-of-happy-old-male-ethnic-elderly-african-768x432.jpg', category: 'Retirement', title: 'Living retirement with confidence', text: 'Planning for income, wellbeing and greater choice beyond working life.' },
  { image: '/images/hero/savings-900x600.jpg', category: 'Pensions', title: 'Saving with purpose', text: 'Turning consistent contributions into a clearer path towards tomorrow.' },
  { image: '/images/hero/enwinsurance-5-600x403-1.jpg', category: 'Insurance', title: 'Protecting what matters', text: 'Thoughtful protection for people, homes and organisations.' },
  { image: '/images/hero/3.png', category: 'Advisory', title: 'Decisions backed by insight', text: 'Clear analysis and specialist guidance for informed financial decisions.' },
  { image: '/images/hero/smiling-young-african-woman-sitting-with-laptop.jpg', category: 'Digital access', title: 'Your finances, within reach', text: 'Simple digital access that keeps information and support close at hand.' },
  { image: '/images/hero/office-ge674d40ef_1280-1.jpg', category: 'Everyday finance', title: 'Connected to your financial life', text: 'Making it easier to stay informed and engaged wherever you are.' },
  { image: '/images/hero/training-1-1.jpg', category: 'Planning', title: 'Clarity behind every decision', text: 'Bringing information together to support thoughtful financial choices.' },
  { image: '/images/hero/training-3-1.jpg', category: 'Learning', title: 'Ideas made practical', text: 'Sharing specialist knowledge in ways that people can understand and apply.' },
  { image: '/images/hero/umbrella.jpg', category: 'Protection', title: 'Prepared for the unexpected', text: 'Building financial resilience around the moments that cannot be predicted.' },
  { image: '/images/hero/volunteer-helping-elderly-man-to-pay-online-2022-07-28-23-54-33-utc-2.jpg', category: 'Support', title: 'Guidance at every stage', text: 'Human support that helps people navigate important financial moments.' },
];

function GalleryPage(){return <main id="main"><section className="subpage-hero compact gallery-hero has-media"><HeroVideo src="/videos/14933982_3840_2160_30fps.mp4" label="Enwealth gallery background film"/><div className="container"><Breadcrumbs items={['Gallery']}/><span className="eyebrow light">Life at Enwealth</span><h1>Moments that move<br/><em>us forward.</em></h1><p>A visual look at the people, partnerships and purpose behind financial wellbeing.</p></div></section><section className="section gallery-section"><div className="container"><SectionHeading eyebrow="In focus" title="People. Purpose. Progress." text="Explore the work and everyday moments that shape our story."/><div className="gallery-grid">{galleryItems.map((item, index)=><article className="gallery-card" tabIndex={0} key={item.image}><img src={assetUrl(item.image)} alt={item.title} loading={index > 2 ? 'lazy' : 'eager'}/><span className="gallery-tag">{item.category}</span><div className="gallery-overlay"><span>{String(index + 1).padStart(2, '0')}</span><div><h2>{item.title}</h2><p>{item.text}</p></div><ArrowRight aria-hidden="true"/></div></article>)}</div><p className="gallery-hint">Hover over a photograph—or focus it with your keyboard—to discover its story.</p></div></section><CTA/></main>}

function CTA(){return <section className="final-cta"><div className="container"><div><span className="eyebrow light">For a better tomorrow</span><h2>Financial wellbeing,<br/><em>built to last.</em></h2></div><div><p>Tell us what you need and the right Enwealth team will come back to you.</p><div className="button-row"><ButtonLink to="/support/contact">Talk to the team</ButtonLink><ButtonLink to="/investments" secondary>Explore investments</ButtonLink></div></div></div></section>}

function Footer(){return <footer><div className="container"><div className="footer-top"><Logo/><p>Administration, trustee services, consulting, insurance, investments and training across African markets.</p><Link className="button button-lime" to="/support/contact">Start a conversation <ArrowRight/></Link></div><div className="footer-links">{[
    ['Individuals','Retirement','Investments','Protection','Diaspora','Financial wellbeing'],['Organisations','Retirement & benefits','Insurance','Trustee & governance','Advisory','Training'],['Investments','Funds','Compare funds','Prices & documents','Impact debt fund'],['Company','Insights','About','Careers','Foundation','Regulatory information'],['Support','Manage account','Contact','Complaints','FAQs','Search']
  ].map(group=><div key={group[0]}><b>{group[0]}</b>{group.slice(1).map(x=>x === 'Foundation' ? <a key={x} href="https://seed.seraphcyber.com/" target="_blank" rel="noreferrer">{x}</a> : <Link key={x} to={`/${x.toLowerCase().replaceAll(' ','-').replace('&','and')}`}>{x}</Link>)}</div>)}</div><div className="footer-bottom"><span>© 2026 Enwealth Financial Services Limited.</span><div><Link to="/legal">Legal</Link><Link to="/legal/privacy">Privacy</Link><Link to="/legal/terms">Terms</Link><Link to="/about/regulatory-information">Regulatory information</Link></div><span className="region"><Globe2/> Kenya / EN</span></div><p className="footer-disclaimer">Past performance is not a guide to future performance. Unit prices may fall as well as rise, and capital and returns are not guaranteed. Website information does not constitute investment advice.</p></div></footer>}

function App(){return <div className="app"><Header/><Routes><Route path="/" element={<HomePage/>}/><Route path="/investments/compare-funds" element={<ComparePage/>}/><Route path="/investments/fund-prices-and-documents" element={<DocumentsPage/>}/><Route path="/investments/funds/:slug" element={<FundPage/>}/><Route path="/insights" element={<InsightsPage/>}/><Route path="/gallery" element={<GalleryPage/>}/><Route path="*" element={<OverviewPage/>}/></Routes><Footer/></div>}

export default App;

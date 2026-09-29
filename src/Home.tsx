import { useMemo, useState } from 'react'
import { ArrowLeft, Check, Gift, Heart, Menu, MessageCircle, Minus, PackageCheck, Plus, Search, ShoppingBag, Sparkles, Truck, UserRound, X } from 'lucide-react'
import { SiteControls, useLanguage, useSiteSettings } from './siteFeatures'
import './siteExtras.css'

type Category = 'الكل' | 'عطور نسائية' | 'عطور رجالية' | 'عطور شرقية' | 'مجموعات الهدايا'
type Product = { id:number; name:string; line:string; category:Category; price:number; old?:number; image:number; badge?:string; notes:string; size:string }
const products:Product[] = [
  {id:1,name:'أثير الذهب',line:'HALA SIGNATURE',category:'عطور نسائية',price:289,old:360,image:0,badge:'الأكثر مبيعاً',notes:'عنبر دافئ · فانيليا · زهر البرتقال',size:'100 مل'},
  {id:2,name:'عود المساء',line:'THE OUD COLLECTION',category:'عطور شرقية',price:345,image:1,badge:'جديد',notes:'عود أصيل · خشب الصندل · مسك',size:'100 مل'},
  {id:3,name:'ورد حلا',line:'HALA FLORAL',category:'عطور نسائية',price:245,old:310,image:2,notes:'ورد طائفي · ياسمين · مسك أبيض',size:'75 مل'},
  {id:4,name:'سرّ الشرق',line:'ORIENTAL EDITION',category:'عطور رجالية',price:320,image:3,badge:'حصري',notes:'برغموت · باتشولي · أخشاب',size:'100 مل'},
  {id:5,name:'نفحات العنبر',line:'HALA SIGNATURE',category:'عطور شرقية',price:275,image:0,notes:'عنبر · زعفران · فانيليا',size:'75 مل'},
  {id:6,name:'ليالي العود',line:'THE OUD COLLECTION',category:'عطور رجالية',price:385,old:450,image:1,notes:'عود · جلد · توابل دافئة',size:'100 مل'},
  {id:7,name:'همس الزهور',line:'HALA FLORAL',category:'مجموعات الهدايا',price:299,image:2,badge:'هدية مثالية',notes:'ورد · فريزيا · فاكهة ناعمة',size:'مجموعة'},
  {id:8,name:'وهج المسك',line:'ORIENTAL EDITION',category:'مجموعات الهدايا',price:359,image:3,notes:'مسك · أخشاب · حمضيات',size:'مجموعة'},
]
const categories:Category[] = ['الكل','عطور نسائية','عطور رجالية','عطور شرقية','مجموعات الهدايا']
const positions = ['0% 0%','100% 0%','0% 100%','100% 100%']
const money = (n:number) => `${n} د.ل`
export default function Home(){
  const {data,shared,save}=useSiteSettings()
  const [lang,setLang]=useState<'ar'|'en'>('ar')
  useLanguage(lang)
  const items=useMemo(()=>products.map(p=>({...p,name:data.productNames?.[p.id]||p.name,price:data.productPrices?.[p.id]||p.price})),[data])
  const [category,setCategory]=useState<Category>('الكل')
  const [search,setSearch]=useState('')
  const [searchOpen,setSearchOpen]=useState(false)
  const [mobileOpen,setMobileOpen]=useState(false)
  const [cartOpen,setCartOpen]=useState(false)
  const [favorites,setFavorites]=useState<number[]>([])
  const [cart,setCart]=useState<Record<number,number>>({})
  const [selected,setSelected]=useState<Product|null>(null)
  const [accountOpen,setAccountOpen]=useState(false)
  const [email,setEmail]=useState('')
  const [subscribed,setSubscribed]=useState(false)
  const [loginEmail,setLoginEmail]=useState('')
  const [loginDone,setLoginDone]=useState(false)
  const [showFavorites,setShowFavorites]=useState(false)
  const [orderPlaced,setOrderPlaced]=useState(false)
  const visible=useMemo(()=>items.filter(p=>(category==='الكل'||p.category===category)&&(!showFavorites||favorites.includes(p.id))&&(!search||`${p.name} ${p.line} ${p.category} ${p.notes}`.toLowerCase().includes(search.toLowerCase()))),[items,category,search,showFavorites,favorites])
  const count=Object.values(cart).reduce((a,b)=>a+b,0)
  const total=items.reduce((sum,p)=>sum+p.price*(cart[p.id]||0),0)
  const whatsappText=`مرحباً حلا للعطور، أود الاستفسار عن المنتجات في سلتي:\n${items.filter(p=>cart[p.id]>0).map(p=>`• ${p.name} × ${cart[p.id]} — ${money(p.price*cart[p.id])}`).join('\n')}\nالمجموع: ${money(total)}`
  const whatsappUrl=`https://wa.me/?text=${encodeURIComponent(whatsappText)}`
  const scroll=(id:string)=>{document.getElementById(id)?.scrollIntoView({behavior:'smooth'});setMobileOpen(false)}
  const choose=(c:Category)=>{setCategory(c);setShowFavorites(false);setSearch('');scroll('collection')}
  const add=(id:number)=>{setCart(c=>({...c,[id]:(c[id]||0)+1}));setOrderPlaced(false);setSelected(null);setCartOpen(true)}
  const qty=(id:number,delta:number)=>setCart(c=>({...c,[id]:Math.max(0,(c[id]||0)+delta)}))
  const fav=(id:number)=>setFavorites(f=>f.includes(id)?f.filter(x=>x!==id):[...f,id])
  const card=(p:Product)=><article className="product-card" key={p.id}><div className="product-photo" role="button" tabIndex={0} onClick={()=>setSelected(p)} onKeyDown={e=>{if(e.key==='Enter')setSelected(p)}} aria-label={`تفاصيل ${p.name}`}><div className="product-image" style={{backgroundPosition:positions[p.image]}}/>{p.badge&&<span className="product-badge">{p.badge}</span>}<button className={`favorite-button ${favorites.includes(p.id)?'is-favorite':''}`} aria-label="المفضلة" onClick={e=>{e.stopPropagation();fav(p.id)}}><Heart size={19} strokeWidth={1.5} fill={favorites.includes(p.id)?'currentColor':'none'}/></button><button className="quick-add" onClick={e=>{e.stopPropagation();add(p.id)}}>أضيفي للسلة <Plus size={17}/></button></div><div className="product-info"><span className="product-line">{p.line}</span><button className="product-name" onClick={()=>setSelected(p)}>{p.name}</button><div className="product-badges-row"><span className="badge-shipping">🚚 2 Day Shipping</span>{p.old&&<span className="badge-offer">3 for $99 - Mix & Match</span>}</div><div className="product-bottom"><span className="product-price">{p.old?<><span className="sale">{money(p.price)}</span> <del>{money(p.old)}</del></>:money(p.price)}</span><span className="product-size">{p.size}</span></div></div></article>
  return <div className="site" dir={lang==='ar'?'rtl':'ltr'}>
    <SiteControls data={data} shared={shared} save={save} lang={lang} setLang={setLang}/>
    <div className="perfumania-topbar">
      <div className="perfumania-topbar-inner container">
        <span className="unlock">Unlock 5% Off on Your Purchase &gt;&gt;</span>
        <span className="trustpilot">★ ★ ★ ★ ★ 4.7 Excellent on Trustpilot</span>
        <span className="gift">هدية أنيقة مع كل طلب — شحن مجاني فوق ٣٥٠ د.ل <Sparkles size={12}/></span>
      </div>
    </div>
    <header className="header"><div className="header-main container"><div className="header-actions"><button className="icon-button mobile-menu-button" aria-label="القائمة" onClick={()=>setMobileOpen(true)}><Menu size={23}/></button><button className="icon-button" aria-label="بحث" onClick={()=>setSearchOpen(!searchOpen)}><Search size={22}/></button><button className="icon-button desktop-icon" aria-label="حسابي" onClick={()=>setAccountOpen(true)}><UserRound size={21}/></button></div><button className="brand" onClick={()=>{setCategory('الكل');setShowFavorites(false);window.scrollTo({top:0,behavior:'smooth'})}}><span className="brand-name">حلا <span className="brand-flower">✳</span> للعطور</span><span className="brand-sub">HALA PERFUMES</span></button><div className="header-actions left-actions"><button className="icon-button desktop-icon" aria-label="المفضلة" onClick={()=>{setShowFavorites(!showFavorites);setCategory('الكل');scroll('collection')}}><Heart size={22} fill={showFavorites?'currentColor':'none'}/>{favorites.length>0&&<span className="tiny-count">{favorites.length}</span>}</button><button className="icon-button" aria-label="سلة التسوق" onClick={()=>setCartOpen(true)}><ShoppingBag size={22}/><span className="tiny-count">{count}</span></button></div></div><nav className="nav"><div className="nav-inner container"><button onClick={()=>choose('الكل')}>تسوّق الكل</button><button onClick={()=>choose('عطور نسائية')}>عطور نسائية</button><button onClick={()=>choose('عطور رجالية')}>عطور رجالية</button><button onClick={()=>choose('عطور شرقية')}>العطور الشرقية</button><button onClick={()=>choose('مجموعات الهدايا')}>مجموعات الهدايا</button><button onClick={()=>scroll('story')}>قصتنا</button></div></nav>{searchOpen&&<div className="search-panel"><div className="container search-box"><Search size={20}/><input autoFocus placeholder="عن أي عطر تبحث؟" value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'){scroll('collection');setSearchOpen(false)}}}/><button onClick={()=>{setSearchOpen(false);setSearch('')}} aria-label="إغلاق"><X size={20}/></button></div>{search&&<div className="search-hint container"><button onClick={()=>{scroll('collection');setSearchOpen(false)}}>عرض نتائج البحث عن «{search}» <ArrowLeft size={15}/></button></div>}</div>}</header>
    <main><section className="hero"><div className="hero-image"/><div className="hero-content container"><div className="hero-copy"><span className="eyebrow"><span className="eyebrow-line"/> عطور تروي حكايتك</span><h1>{data.heroLine1||'لأن لكل لحظة'}<br/><em>{data.heroLine2||'عطرها الخاص'}</em></h1><p>{data.heroIntro||'اكتشفي عالماً من الروائح الاستثنائية، صُممت لتبقى في الذاكرة وترافق أجمل لحظاتك.'}</p><button className="primary-button" onClick={()=>scroll('collection')}>اكتشفي المجموعة <ArrowLeft size={18}/></button><div className="hero-pagination"><span className="pagination-active"/><span/><span/></div></div></div><div className="hero-vertical">THE ART OF FRAGRANCE · HALA</div></section>
    {/* ===== PERFUMANIA FALL SALE BANNER ===== */}
    <section className="perfumania-fall-sale container">
      <div className="fall-sale-card">
        <div className="fall-sale-text">
          <span className="fall-kicker">ONLINE ONLY</span>
          <h2>Fall Sale</h2>
          <div className="fall-tiers">
            <span><b>$10 Off $125</b> Code: FALLSALE10</span>
            <span><b>$15 Off $175</b> Code: FALLSALE15</span>
            <span><b>$25 Off $225</b> Code: FALLSALE25</span>
          </div>
          <button className="perfumania-btn" onClick={()=>scroll('collection')}>Shop Now</button>
        </div>
        <div className="fall-sale-image"><img src="/images/hero-campaign.png" alt="Fall sale" /></div>
      </div>
    </section>
    <section className="perfumania-deals container">
      <div className="deal-grid">
        <div className="deal-card deal-bogo">
          <div className="deal-content">
            <span className="deal-kicker">IN-STORE AND ONLINE</span>
            <h3>Buy 1, Get 1 50% Off</h3>
            <p>(Mix & Match, Select Styles)</p>
            <button className="deal-link" onClick={()=>scroll('collection')}>Shop Now</button>
          </div>
          <div className="deal-image"><img src="/images/hero-perfume.jpg" alt="Bogo perfume" /></div>
        </div>
        <div className="deal-card deal-3for99">
          <div className="deal-content">
            <span className="deal-kicker">In-Store and Online</span>
            <h3>3 for $99</h3>
            <p>3 Scents for Just $99</p>
            <button className="deal-link" onClick={()=>scroll('collection')}>Shop Now</button>
          </div>
          <div className="deal-image"><img src="/images/perfume-amber.jpg" alt="3 for 99" /></div>
        </div>
        <div className="deal-card deal-2for75">
          <div className="deal-content">
            <span className="deal-kicker">ONLINE ONLY</span>
            <h3>2 FOR $75</h3>
            <p>2 Scents For Just $75</p>
            <button className="deal-link" onClick={()=>scroll('collection')}>Shop Now</button>
          </div>
          <div className="deal-image"><img src="/images/product-grid.png" alt="2 for 75" /></div>
        </div>
        <div className="deal-card deal-new">
          <div className="deal-content">
            <span className="deal-kicker">Just Released!</span>
            <h3>4 Brand New Fragrances</h3>
            <p>Notez Collection — In-Store and Online</p>
            <button className="deal-link" onClick={()=>scroll('collection')}>Shop Now</button>
          </div>
          <div className="deal-image"><img src="/images/hero-campaign.png" alt="New fragrances" /></div>
        </div>
      </div>
    </section>
    <section className="benefits container"><div className="benefit"><Truck size={26}/><div><strong>شحن مجاني</strong><span>للطلبات فوق ٣٥٠ د.ل</span></div></div><div className="benefit"><Gift size={26}/><div><strong>تغليف يليق بهديتك</strong><span>بكل حب، مع كل طلب</span></div></div><div className="benefit"><PackageCheck size={26}/><div><strong>جودة نثق بها</strong><span>عطور أصيلة بعناية فائقة</span></div></div></section>
    <section className="collection section-space container" id="collection"><div className="section-heading"><div><span className="section-kicker">مختارة لكِ بعناية</span><h2>{showFavorites?'عطورك المفضلة':search?'نتائج البحث':'عطور لا تُنسى'}</h2><p>روائح فريدة، تفاصيل ساحرة، وانطباع يدوم.</p></div><button className="text-link" onClick={()=>{setCategory('الكل');setSearch('');setShowFavorites(false)}}>عرض جميع العطور <ArrowLeft size={18}/></button></div><div className="category-tabs" role="tablist">{categories.map(c=><button key={c} role="tab" aria-selected={category===c&&!showFavorites} className={category===c&&!showFavorites?'selected':''} onClick={()=>{setCategory(c);setShowFavorites(false);setSearch('')}}>{c}</button>)}</div>{visible.length?<div className="product-grid">{visible.slice(0,4).map(card)}</div>:<div className="empty-results"><Search size={30}/><h3>{showFavorites?'لم تضيفي أي عطور للمفضلة بعد':'لم نعثر على عطور مطابقة'}</h3><p>{showFavorites?'اضغطي على رمز القلب بجانب عطرك المفضل ليظهر هنا.':'جرّبي البحث بكلمة أخرى أو تصفّحي المجموعة كاملة.'}</p><button className="outlined-button" onClick={()=>{setSearch('');setShowFavorites(false);setCategory('الكل')}}>تصفّح العطور</button></div>}{visible.length>4&&<button className="more-button" onClick={()=>scroll('all-products')}>اكتشفي المزيد من العطور <ArrowLeft size={18}/></button>}</section>
    <section className="story-section" id="story"><div className="story-photo"><img src="/images/editorial-hijab.png" alt="امرأة محجبة تستمتع بعطر حلا"/></div><div className="story-copy"><div className="story-inner"><span className="section-kicker">من القلب إلى الذاكرة</span><h2>{data.storyLine1||'العطر أكثر من'}<br/><em>{data.storyLine2||'مجرد رائحة'}</em></h2><div className="story-rule"/><p>{data.storyIntro||'نؤمن في حلا بأن العطر لغة لا تحتاج إلى كلمات. كل نفحة صُنعت لتلامس روحك، وكل تركيبة تحكي قصة من الأناقة والجمال والتفاصيل التي لا تُنسى.'}</p><button onClick={()=>scroll('all-products')}>اكتشفي عالم حلا <ArrowLeft size={18}/></button></div></div></section>
    <section className="more-products section-space container" id="all-products"><div className="section-heading"><div><span className="section-kicker">اختيارات تستحق الاكتشاف</span><h2>المزيد من حلا</h2><p>لكل ذوق عطر، ولكل عطر حكاية.</p></div></div><div className="product-grid">{items.slice(4).map(card)}</div></section>
    <section className="newsletter"><div className="newsletter-inner container"><div><span className="section-kicker">كوني الأقرب إلى حلا</span><h2>{data.newsletterTitle||'رسائل معطّرة لكِ'}</h2><p>اشتركي لتصلك آخر الإصدارات والعروض الخاصة قبل الجميع.</p></div><form onSubmit={e=>{e.preventDefault();if(email.includes('@'))setSubscribed(true)}}><div className="email-field"><input type="email" required placeholder="بريدك الإلكتروني" value={email} onChange={e=>setEmail(e.target.value)}/><button type="submit" aria-label="اشتركي"><ArrowLeft size={23}/></button></div>{subscribed&&<span className="success-message"><Check size={15}/> شكراً لكِ! أنتِ الآن ضمن عائلة حلا.</span>}</form></div></section></main>
    <footer className="footer"><div className="container footer-grid"><div className="footer-about"><span className="footer-brand">حلا <span>✳</span> للعطور</span><p>عطور تُعبّر عنك، وتُخلّد لحظاتك الجميلة. بكل حب، من حلا إليكِ.</p><span className="footer-english">HALA PERFUMES · MADE TO BE REMEMBERED</span></div><div><h3>استكشفي</h3>{categories.slice(1).map(c=><button key={c} onClick={()=>choose(c)}>{c}</button>)}</div><div><h3>حلا للعطور</h3><button onClick={()=>scroll('story')}>قصتنا</button><button onClick={()=>setAccountOpen(true)}>حسابي</button><button onClick={()=>setCartOpen(true)}>سلة التسوق</button><button onClick={()=>{setShowFavorites(true);scroll('collection')}}>المفضلة</button></div><div><h3>نحن هنا لمساعدتك</h3><p>لديك سؤال عن عطرك القادم؟ يسعدنا مساعدتك في اختيار ما يشبهك.</p><p className="footer-address">{data.address||'طرابلس، ليبيا'}</p><a href={`mailto:${data.contactEmail||'hello@halaperfumes.com'}`}>{data.contactEmail||'hello@halaperfumes.com'}</a></div></div><div className="footer-bottom container"><span>© ٢٠٢٦ حلا للعطور. جميع الحقوق محفوظة.</span><span>صُنع بشغف وحب ♡</span></div></footer>
    {mobileOpen&&<div className="overlay" onClick={()=>setMobileOpen(false)}><aside className="mobile-drawer" onClick={e=>e.stopPropagation()}><div className="drawer-heading"><span className="footer-brand">حلا <span>✳</span> للعطور</span><button onClick={()=>setMobileOpen(false)} aria-label="إغلاق"><X/></button></div><div className="mobile-links">{categories.map(c=><button key={c} onClick={()=>choose(c)}>{c}<ArrowLeft size={18}/></button>)}<button onClick={()=>scroll('story')}>قصتنا <ArrowLeft size={18}/></button><button onClick={()=>{setMobileOpen(false);setAccountOpen(true)}}>حسابي <UserRound size={18}/></button></div></aside></div>}
    {cartOpen&&<div className="overlay" onClick={()=>setCartOpen(false)}><aside className="cart-drawer" onClick={e=>e.stopPropagation()}><div className="drawer-heading"><div><span className="drawer-kicker">تسوّق بكل حب</span><h2>سلة التسوق <span>({count})</span></h2></div><button onClick={()=>setCartOpen(false)} aria-label="إغلاق السلة"><X size={23}/></button></div>{orderPlaced?<div className="cart-empty"><div className="empty-icon"><Check size={36}/></div><h3>شكراً لكِ على طلبك!</h3><p>تم تسجيل طلبك التجريبي بنجاح. عطور حلا في طريقها إليكِ في عالمنا الافتراضي.</p><button className="primary-button" onClick={()=>{setOrderPlaced(false);setCartOpen(false);scroll('collection')}}>تابعي التسوق <ArrowLeft size={18}/></button></div>:count===0?<div className="cart-empty"><div className="empty-icon"><ShoppingBag size={34}/></div><h3>سلتك تنتظر عطرك المفضل</h3><p>اكتشفي مجموعتنا وأضيفي لمستك الخاصة.</p><button className="primary-button" onClick={()=>{setCartOpen(false);scroll('collection')}}>تسوّقي الآن <ArrowLeft size={18}/></button></div>:<><div className="cart-items">{items.filter(p=>cart[p.id]>0).map(p=><div className="cart-item" key={p.id}><div className="cart-item-image" style={{backgroundPosition:positions[p.image]}}/><div className="cart-item-info"><span>{p.line}</span><strong>{p.name}</strong><small>{p.size}</small><div className="quantity"><button onClick={()=>qty(p.id,-1)} aria-label="تقليل الكمية"><Minus size={14}/></button><b>{cart[p.id]}</b><button onClick={()=>qty(p.id,1)} aria-label="زيادة الكمية"><Plus size={14}/></button></div></div><b className="cart-item-price">{money(p.price*cart[p.id])}</b></div>)}</div><div className="cart-summary"><div><span>المجموع</span><strong>{money(total)}</strong></div><p>{total>=350?'رائع! طلبك مؤهل للشحن المجاني.':`أضيفي منتجات بقيمة ${money(350-total)} لتحصلي على شحن مجاني.`}</p><a className="whatsapp-cart-button" href={whatsappUrl} target="_blank" rel="noopener noreferrer"><MessageCircle size={18}/> إرسال السلة عبر واتساب</a><button className="primary-button" onClick={()=>{setCart({});setOrderPlaced(true)}}>إتمام الطلب <ArrowLeft size={18}/></button><small>تجربة تسوق توضيحية — لا يتم تحصيل أي مبلغ.</small></div></>}</aside></div>}
    {selected&&<div className="overlay modal-overlay" onClick={()=>setSelected(null)}><div className="product-modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setSelected(null)} aria-label="إغلاق"><X size={22}/></button><div className="modal-photo" style={{backgroundPosition:positions[selected.image]}}/><div className="modal-details"><span className="section-kicker">{selected.line}</span><h2>{selected.name}</h2><div className="modal-stars">★★★★★ <span>عطر يستحق الاكتشاف</span></div><p>عطر يأخذكِ في رحلة من المشاعر والذكريات، صُنع ليترك أثراً لا يُنسى في كل مكان.</p><div className="modal-meta"><span>النوتات العطرية</span><strong>{selected.notes}</strong></div><div className="modal-meta"><span>الحجم</span><strong>{selected.size}</strong></div><div className="modal-purchase"><strong>{money(selected.price)}</strong><button className="primary-button" onClick={()=>add(selected.id)}>أضيفي للسلة <ShoppingBag size={18}/></button></div></div></div></div>}
    {accountOpen&&<div className="overlay modal-overlay" onClick={()=>setAccountOpen(false)}><div className="account-modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setAccountOpen(false)} aria-label="إغلاق"><X size={22}/></button><span className="account-flower">✳</span><span className="section-kicker">أهلاً بكِ في عالم حلا</span><h2>حسابك في حلا</h2>{loginDone?<><p>شكراً لكِ! تم حفظ بريدك الإلكتروني. يسعدنا وجودك معنا.</p><button className="primary-button" onClick={()=>setAccountOpen(false)}>متابعة التسوق <ArrowLeft size={18}/></button></>:<><p>أدخلي بريدك الإلكتروني للانضمام إلى عائلة حلا ومتابعة جديدنا.</p><form onSubmit={e=>{e.preventDefault();if(loginEmail.includes('@'))setLoginDone(true)}}><input type="email" required placeholder="البريد الإلكتروني" value={loginEmail} onChange={e=>setLoginEmail(e.target.value)}/><button className="primary-button" type="submit">المتابعة <ArrowLeft size={18}/></button></form></>}</div></div>}
  </div>
}

import { useEffect, useState, type FormEvent } from 'react'
import { ArrowLeft, Check, Globe2, Palette, Pencil, X } from 'lucide-react'

export type SiteData = { heroLine1?:string; heroLine2?:string; heroIntro?:string; storyLine1?:string; storyLine2?:string; storyIntro?:string; newsletterTitle?:string; contactEmail?:string; address?:string; productNames?:Record<number,string>; productPrices?:Record<number,number> }
const themes = [
  {id:'heritage',ar:'كلاسيكي',en:'Heritage',color:'#a57c5e'},
  {id:'rose',ar:'وردي',en:'Rose',color:'#bc7889'},
  {id:'ocean',ar:'أزرق',en:'Ocean',color:'#4f8d9d'},
  {id:'sage',ar:'أخضر',en:'Sage',color:'#738c73'},
  {id:'midnight',ar:'ليلي',en:'Midnight',color:'#424b70'},
  {id:'lavender',ar:'بنفسجي',en:'Lavender',color:'#9b80ad'},
]
const translations:Record<string,string> = {
  'هدية أنيقة مع كل طلب — وشحن مجاني للطلبات فوق ٣٥٠ د.ل':'An elegant gift with every order — free shipping over 350 LYD',
  'حلا':'Hala','للعطور':'Perfumes','حلا للعطور':'Hala Perfumes',
  'تسوّق الكل':'Shop all','عطور نسائية':'Women’s perfumes','عطور رجالية':'Men’s perfumes','عطور شرقية':'Oriental perfumes','العطور الشرقية':'Oriental perfumes','مجموعات الهدايا':'Gift sets','قصتنا':'Our story',
  'عطور تروي حكايتك':'Fragrances that tell your story','لأن لكل لحظة':'Every moment has','عطرها الخاص':'its own scent','اكتشفي عالماً من الروائح الاستثنائية، صُممت لتبقى في الذاكرة وترافق أجمل لحظاتك.':'Discover exceptional fragrances made to linger in your memory and accompany your most beautiful moments.','اكتشفي المجموعة':'Explore the collection',
  'شحن مجاني':'Free shipping','للطلبات فوق ٣٥٠ د.ل':'On orders over 350 LYD','تغليف يليق بهديتك':'Beautiful gift wrapping','بكل حب، مع كل طلب':'With love, in every order','جودة نثق بها':'Quality you can trust','عطور أصيلة بعناية فائقة':'Authentic scents, thoughtfully made',
  'مختارة لكِ بعناية':'Thoughtfully selected for you','عطور لا تُنسى':'Unforgettable fragrances','عطورك المفضلة':'Your favorites','نتائج البحث':'Search results','روائح فريدة، تفاصيل ساحرة، وانطباع يدوم.':'Unique scents, enchanting details, and a lasting impression.','عرض جميع العطور':'View all perfumes','الكل':'All',
  'الأكثر مبيعاً':'Bestseller','جديد':'New','حصري':'Exclusive','هدية مثالية':'Perfect gift','أضيفي للسلة':'Add to bag','أثير الذهب':'Golden Aura','عود المساء':'Evening Oud','ورد حلا':'Hala Rose','سرّ الشرق':'Eastern Secret','نفحات العنبر':'Amber Notes','ليالي العود':'Oud Nights','همس الزهور':'Floral Whisper','وهج المسك':'Musk Glow','100 مل':'100 ml','75 مل':'75 ml','مجموعة':'Set',
  'اكتشفي المزيد من العطور':'Discover more fragrances','لم تضيفي أي عطور للمفضلة بعد':'No favorites yet','لم نعثر على عطور مطابقة':'No matching fragrances found','اضغطي على رمز القلب بجانب عطرك المفضل ليظهر هنا.':'Tap the heart on a fragrance to save it here.','جرّبي البحث بكلمة أخرى أو تصفّحي المجموعة كاملة.':'Try another search or browse the full collection.','تصفّح العطور':'Browse perfumes',
  'من القلب إلى الذاكرة':'From the heart to the memory','العطر أكثر من':'Perfume is more than','مجرد رائحة':'just a scent','نؤمن في حلا بأن العطر لغة لا تحتاج إلى كلمات. كل نفحة صُنعت لتلامس روحك، وكل تركيبة تحكي قصة من الأناقة والجمال والتفاصيل التي لا تُنسى.':'At Hala, we believe fragrance is a language without words. Every note is crafted to touch your soul and tell a story of elegance and unforgettable details.','اكتشفي عالم حلا':'Discover Hala',
  'اختيارات تستحق الاكتشاف':'Worth discovering','المزيد من حلا':'More from Hala','لكل ذوق عطر، ولكل عطر حكاية.':'A scent for every taste, a story in every scent.','كوني الأقرب إلى حلا':'Stay close to Hala','رسائل معطّرة لكِ':'Notes from Hala','اشتركي لتصلك آخر الإصدارات والعروض الخاصة قبل الجميع.':'Be the first to hear about new releases and exclusive offers.','شكراً لكِ! أنتِ الآن ضمن عائلة حلا.':'Thank you! You’re part of the Hala family.',
  'عطور تُعبّر عنك، وتُخلّد لحظاتك الجميلة. بكل حب، من حلا إليكِ.':'Fragrances that express you and celebrate your beautiful moments. With love, from Hala.','استكشفي':'Explore','نحن هنا لمساعدتك':'Here to help','لديك سؤال عن عطرك القادم؟ يسعدنا مساعدتك في اختيار ما يشبهك.':'Questions about your next scent? We’d love to help you find the one for you.','حسابي':'My account','سلة التسوق':'Shopping bag','المفضلة':'Favorites','© ٢٠٢٦ حلا للعطور. جميع الحقوق محفوظة.':'© 2026 Hala Perfumes. All rights reserved.','صُنع بشغف وحب ♡':'Made with passion and love ♡',
  'تسوّق بكل حب':'Shop with love','سلتك تنتظر عطرك المفضل':'Your bag awaits your favorite scent','اكتشفي مجموعتنا وأضيفي لمستك الخاصة.':'Explore our collection and find your signature.','تسوّقي الآن':'Shop now','المجموع':'Subtotal','رائع! طلبك مؤهل للشحن المجاني.':'Great! Your order qualifies for free shipping.','إتمام الطلب':'Checkout','تجربة تسوق توضيحية — لا يتم تحصيل أي مبلغ.':'Demo checkout — no payment is collected.','شكراً لكِ على طلبك!':'Thank you for your order!','تم تسجيل طلبك التجريبي بنجاح. عطور حلا في طريقها إليكِ في عالمنا الافتراضي.':'Your demo order has been placed successfully.','تابعي التسوق':'Continue shopping',
  'إرسال السلة عبر واتساب':'Send bag via WhatsApp',
  'عطر يستحق الاكتشاف':'A fragrance worth discovering','عطر يأخذكِ في رحلة من المشاعر والذكريات، صُنع ليترك أثراً لا يُنسى في كل مكان.':'A fragrance made to take you through emotions and memories, leaving a lasting impression.','النوتات العطرية':'Fragrance notes','الحجم':'Size','أهلاً بكِ في عالم حلا':'Welcome to Hala','حسابك في حلا':'Your Hala account','شكراً لكِ! تم حفظ بريدك الإلكتروني. يسعدنا وجودك معنا.':'Thank you! Your email has been saved.','متابعة التسوق':'Continue shopping','أدخلي بريدك الإلكتروني للانضمام إلى عائلة حلا ومتابعة جديدنا.':'Enter your email to join the Hala family and stay updated.','المتابعة':'Continue',
  'عنبر دافئ · فانيليا · زهر البرتقال':'Warm amber · vanilla · orange blossom','عود أصيل · خشب الصندل · مسك':'Oud · sandalwood · musk','ورد طائفي · ياسمين · مسك أبيض':'Taif rose · jasmine · white musk','برغموت · باتشولي · أخشاب':'Bergamot · patchouli · woods','عنبر · زعفران · فانيليا':'Amber · saffron · vanilla','عود · جلد · توابل دافئة':'Oud · leather · warm spices','ورد · فريزيا · فاكهة ناعمة':'Rose · freesia · soft fruits','مسك · أخشاب · حمضيات':'Musk · woods · citrus',
    'طرابلس، ليبيا':'Tripoli, Libya',
  'Unlock 5% Off on Your Purchase >>':'استفيدي من خصم 5% على طلبك >>',
  '4.7 Excellent on Trustpilot':'4.7 ممتاز على Trustpilot',
  'ONLINE ONLY':'أونلاين فقط',
  'IN-STORE AND ONLINE':'في المتجر وأونلاين',
  'In-Store and Online':'في المتجر وأونلاين',
  'IN-STORE':'في المتجر',
  'Fall Sale':'تخفيضات الخريف',
  'Shop Now':'تسوقي الآن',
  'Buy 1, Get 1 50% Off':'اشتري 1 واحصلي على الثاني بنصف السعر',
  '(Mix & Match, Select Styles)':'(امزجي واختاري - تشكيلة مختارة)',
  '3 for $99':'3 بـ 99$',
  '3 Scents for Just $99':'3 عطور بـ 99$ فقط',
  '3 Scents for Just $99 (Mix & Match, Select Styles)':'3 عطور بـ 99$ فقط (تشكيلة مختارة)',
  '2 FOR $75':'2 بـ 75$',
  '2 Scents For Just $75':'عطران بـ 75$ فقط',
  '2 Scents For Just $75 (Mix & Match, Select Styles)':'عطران بـ 75$ فقط (تشكيلة مختارة)',
  'Just Released!':'وصل حديثاً!',
  '4 Brand New Fragrances':'4 عطور جديدة',
  '4 Brand New Fragrances by Notez!':'4 عطور جديدة من Notez!',
  'Notez Collection — In-Store and Online':'مجموعة Notez — في المتجر وأونلاين',
  'In-Store Only Deals':'عروض المتجر فقط',
  '$10 Off $125':'خصم 10$ على 125$',
  '$15 Off $175':'خصم 15$ على 175$',
  '$25 Off $225':'خصم 25$ على 225$',
  'Code: FALLSALE10':'الكود: FALLSALE10',
  'Code: FALLSALE15':'الكود: FALLSALE15',
  'Code: FALLSALE25':'الكود: FALLSALE25',

}
const reverse = Object.fromEntries(Object.entries(translations).map(([a,e])=>[e,a]))
export function useSiteSettings(){
  const [data,setData]=useState<SiteData>({})
  const [shared,setShared]=useState(false)
  useEffect(()=>{let active=true;const load=async()=>{try{const r=await fetch('/api/site',{cache:'no-store'});if(r.ok){const next=await r.json();if(active){setData(next);setShared(true)}}else if(active)setShared(false)}catch{if(active)setShared(false)}};load();const timer=setInterval(load,15000);return()=>{active=false;clearInterval(timer)}},[])
  const save=async(next:SiteData,password:string)=>{const r=await fetch('/api/site',{method:'PUT',headers:{'Content-Type':'application/json',Authorization:`Bearer ${password}`},body:JSON.stringify(next)});if(!r.ok){const error=await r.json().catch(()=>({}));throw new Error(error.error||'Publication failed')}setData(next)}
  return {data,shared,save}
}
export function useLanguage(lang:'ar'|'en'){
  useEffect(()=>{
    document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr'
    const root=document.querySelector('.site');if(!root)return
    root.setAttribute('dir',lang==='ar'?'rtl':'ltr')
    let scheduled=false
    const update=()=>{
      scheduled=false
      const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT)
      let node:Node|null
      while((node=walker.nextNode())){
        if(node.parentElement?.closest('.site-controls,.editor-panel'))continue
        const value=node.nodeValue||'';const trimmed=value.trim();if(!trimmed)continue
        const replacement=lang==='en'?translations[trimmed]:reverse[trimmed]
        if(replacement)node.nodeValue=value.replace(trimmed,replacement)
        if(lang==='en'&&trimmed.includes('د.ل')&&/\d/.test(trimmed))node.nodeValue=(node.nodeValue||'').replace(/د\.ل/g,'LYD')
        if(lang==='ar'&&trimmed.includes('LYD')&&/\d/.test(trimmed))node.nodeValue=(node.nodeValue||'').replace(/LYD/g,'د.ل')
      }
      root.querySelectorAll<HTMLInputElement>('input[placeholder]').forEach(input=>{const p=input.placeholder;const map:Record<string,string>={'عن أي عطر تبحث؟':'Search for a fragrance','بريدك الإلكتروني':'Your email address','البريد الإلكتروني':'Email address'};const back=Object.fromEntries(Object.entries(map).map(([a,e])=>[e,a]));input.placeholder=(lang==='en'?map[p]:back[p])||p})
    }
    const observer=new MutationObserver(()=>{if(!scheduled){scheduled=true;requestAnimationFrame(update)}})
    observer.observe(root,{subtree:true,childList:true,characterData:true})
    update()
    return()=>observer.disconnect()
  },[lang])
}
export function SiteControls({data,shared,save,lang,setLang}:{data:SiteData;shared:boolean;save:(data:SiteData,password:string)=>Promise<void>;lang:'ar'|'en';setLang:(lang:'ar'|'en')=>void}){
  const [theme,setTheme]=useState(()=>localStorage.getItem('hala-theme')||'heritage')
  const [themeOpen,setThemeOpen]=useState(false)
  const [editorOpen,setEditorOpen]=useState(false)
  const [draft,setDraft]=useState<SiteData>(data)
  const [password,setPassword]=useState('')
  const [message,setMessage]=useState('')
  useEffect(()=>{document.documentElement.dataset.theme=theme;localStorage.setItem('hala-theme',theme)},[theme])
  useEffect(()=>setDraft(data),[data])
  const change=(key:keyof SiteData,value:string)=>setDraft(d=>({...d,[key]:value}))
  const publish=async(e:FormEvent)=>{e.preventDefault();setMessage('');try{await save(draft,password);setMessage(lang==='ar'?'تم النشر لجميع الزوار.':'Published for all visitors.')}catch(err){setMessage(err instanceof Error?err.message:'Error')}}
  return <><div className="site-controls"><div className="control-popover-wrap"><button className="control-button" aria-label="Themes" onClick={()=>setThemeOpen(!themeOpen)}><Palette size={17}/><span>{lang==='ar'?'المظهر':'Theme'}</span></button>{themeOpen&&<div className="theme-popover">{themes.map(t=><button key={t.id} className={theme===t.id?'chosen':''} onClick={()=>{setTheme(t.id);setThemeOpen(false)}}><span className="theme-swatch" style={{background:t.color}}/>{lang==='ar'?t.ar:t.en}{theme===t.id&&<Check size={14}/>}</button>)}</div>}</div><button className="control-button" onClick={()=>setLang(lang==='ar'?'en':'ar')} aria-label="Language"><Globe2 size={17}/><span>{lang==='ar'?'English':'العربية'}</span></button><button className="control-button" onClick={()=>{setDraft(data);setEditorOpen(true)}}><Pencil size={16}/><span>{lang==='ar'?'تحرير الموقع':'Edit site'}</span></button></div>
  {editorOpen&&<div className="overlay editor-overlay" onClick={()=>setEditorOpen(false)}><aside className="editor-panel" onClick={e=>e.stopPropagation()} dir={lang==='ar'?'rtl':'ltr'}><div className="editor-top"><div><small>{lang==='ar'?'إدارة المحتوى':'CONTENT MANAGEMENT'}</small><h2>{lang==='ar'?'تعديل بيانات الموقع':'Edit site content'}</h2></div><button aria-label="Close" onClick={()=>setEditorOpen(false)}><X/></button></div><form onSubmit={publish}><div className={`sync-note ${shared?'ready':''}`}>{shared?(lang==='ar'?'متصل بالتخزين المشترك — التعديلات ستظهر على جميع الأجهزة.':'Shared storage connected — changes appear on all devices.'):(lang==='ar'?'التخزين المشترك غير مهيأ. أضف إعدادات Upstash وكلمة مرور المدير إلى بيئة النشر.':'Shared storage is not configured. Add Upstash settings and an admin password to the deployment environment.')}</div><h3>{lang==='ar'?'نصوص الصفحة':'Page text'}</h3>{([['heroLine1','عنوان البداية','Hero heading line 1'],['heroLine2','عنوان النهاية','Hero heading line 2'],['heroIntro','وصف الواجهة','Hero introduction'],['storyLine1','عنوان القصة ١','Story heading 1'],['storyLine2','عنوان القصة ٢','Story heading 2'],['storyIntro','نص القصة','Story copy'],['newsletterTitle','عنوان النشرة','Newsletter heading'],['contactEmail','بريد التواصل','Contact email'],['address','العنوان','Address']] as [keyof SiteData,string,string][]).map(([key,ar,en])=><label key={key}>{lang==='ar'?ar:en}<input value={String(draft[key]||'')} onChange={e=>change(key,e.target.value)} placeholder={key==='address'?'طرابلس، ليبيا':key==='contactEmail'?'hello@halaperfumes.com':''}/></label>)}<h3>{lang==='ar'?'المنتجات والأسعار (د.ل)':'Products & prices (LYD)'}</h3>{Array.from({length:8},(_,i)=><div className="editor-product" key={i}><label>{lang==='ar'?`اسم المنتج ${i+1}`:`Product ${i+1}`}<input value={draft.productNames?.[i+1]||''} onChange={e=>setDraft(d=>({...d,productNames:{...d.productNames,[i+1]:e.target.value}}))}/></label><label>{lang==='ar'?'السعر':'Price'}<input type="number" min="1" value={draft.productPrices?.[i+1]||''} onChange={e=>setDraft(d=>({...d,productPrices:{...d.productPrices,[i+1]:Number(e.target.value)}}))}/></label></div>)}<label>{lang==='ar'?'كلمة مرور المدير':'Admin password'}<input type="password" required value={password} onChange={e=>setPassword(e.target.value)}/></label><button className="primary-button editor-save" type="submit" disabled={!shared}>{lang==='ar'?'نشر التعديلات':'Publish changes'} <ArrowLeft size={17}/></button>{message&&<p className="editor-message">{message}</p>}</form></aside></div>}</>
}

const toggle=document.querySelector('.menu-toggle');const nav=document.querySelector('.main-nav');toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?'×':'☰'});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.textContent='☰'}));document.getElementById('year').textContent=new Date().getFullYear();const lightbox=document.getElementById('lightbox');const lightboxImage=lightbox.querySelector('img');document.querySelectorAll('.photo').forEach(button=>button.addEventListener('click',()=>{lightboxImage.src=button.dataset.full;lightboxImage.alt=button.querySelector('img').alt;const ref=button.dataset.ref;lightbox.querySelector('.lightbox-reference').textContent=ref?'PHOTO REFERENCE: '+ref:'';lightbox.showModal()}));lightbox.querySelector('.lightbox-close').addEventListener('click',()=>lightbox.close());lightbox.addEventListener('click',e=>{if(e.target===lightbox)lightbox.close()});

// Upcoming appearances are read from Chris's published Google Sheets CSV feed.
// Edit the private working spreadsheet; only rows marked PUBLISH should be exposed.
const appearancesFeed='https://docs.google.com/spreadsheets/d/e/2PACX-1vTh4QKl1QTGA6Jlg96AB3ic3TCpNvRC0Ciffwz_dyc5vUt7xJGXO1sr37RtX-msJA/pub?gid=290466325&single=true&output=csv';
const appearancesContainer=document.querySelector('#appearances .appearances-empty');
function appearanceDebug(message){console.info('[Appearances]',message);const status=document.getElementById('appearances-status');if(status)status.textContent=message;}
function parseCSV(text){
  const rows=[];let row=[],cell='',quoted=false;
  for(let i=0;i<text.length;i++){
    const ch=text[i],next=text[i+1];
    if(ch==='"'&&quoted&&next==='"'){cell+='"';i++;}
    else if(ch==='"'){quoted=!quoted;}
    else if(ch===','&&!quoted){row.push(cell);cell='';}
    else if((ch==='\n'||ch==='\r')&&!quoted){if(ch==='\r'&&next==='\n')i++;row.push(cell);if(row.some(v=>v.trim()))rows.push(row);row=[];cell='';}
    else cell+=ch;
  }
  row.push(cell);if(row.some(v=>v.trim()))rows.push(row);
  return rows;
}
function safeDate(value){
  const raw=(value||'').trim();if(!raw)return null;
  let m;
  // ISO date: YYYY-MM-DD.
  if((m=raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/))){
    const year=Number(m[1]),month=Number(m[2]),day=Number(m[3]);
    const d=new Date(year,month-1,day,12);
    return d.getFullYear()===year&&d.getMonth()===month-1&&d.getDate()===day?d:null;
  }
  // Australian/Google Sheets slash date format: D/M/YYYY or DD/MM/YYYY.
  // The sheet is maintained in Australian locale, so day/month is preferred.
  if((m=raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/))){
    const day=Number(m[1]),month=Number(m[2]),year=Number(m[3]);
    const d=new Date(year,month-1,day,12);
    return d.getFullYear()===year&&d.getMonth()===month-1&&d.getDate()===day?d:null;
  }
  // Dotted day-first format, if supplied.
  if((m=raw.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/))){
    const day=Number(m[1]),month=Number(m[2]),year=Number(m[3]);
    const d=new Date(year,month-1,day,12);
    return d.getFullYear()===year&&d.getMonth()===month-1&&d.getDate()===day?d:null;
  }
  const d=new Date(raw);return Number.isNaN(d.getTime())?null:d;
}
function escapeHTML(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function displayDate(start,end){
  const fmt=d=>d.toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});
  if(!start)return '';
  if(!end||start.toDateString()===end.toDateString())return fmt(start);
  if(start.getMonth()===end.getMonth()&&start.getFullYear()===end.getFullYear())return `${start.getDate()}–${fmt(end)}`;
  return `${fmt(start)} – ${fmt(end)}`;
}
async function loadAppearances(){
  if(!appearancesContainer)return;
  try{
    const response=await fetch(appearancesFeed,{cache:'no-store'});
    appearanceDebug('HTTP response '+response.status+' received.');if(!response.ok)throw new Error('HTTP '+response.status+' — feed request failed.');
    const csvText=await response.text();appearanceDebug('Downloaded '+csvText.length+' characters. Preview: '+csvText.slice(0,220).replace(/\s+/g,' '));const rows=parseCSV(csvText);
    if(rows.length<2)throw new Error('CSV parsed but has fewer than 2 rows (header + data).');
    const headers=rows.shift().map(h=>h.replace(/^\uFEFF/,'').trim().toLowerCase().replace(/\s+/g,' '));appearanceDebug('Parsed '+(rows.length)+' data rows. Headers: '+headers.join(' | '));
    const normHeader=h=>String(h||'').toLowerCase().replace(/^\uFEFF/,'').replace(/[^a-z0-9]+/g,' ').trim();
    const normalizedHeaders=headers.map(normHeader);
    const get=(r,...names)=>{const wanted=names.map(normHeader);let i=normalizedHeaders.findIndex(h=>wanted.includes(h));if(i<0)i=normalizedHeaders.findIndex(h=>wanted.some(n=>n&&h.includes(n)));return i<0?'':String(r[i]||'').trim();};
    const today=new Date();today.setHours(0,0,0,0);
    const parsedRows=rows.map((r,index)=>({
      rowNumber:index+2,raw:r,
      status:get(r,'status').replace(/^\uFEFF/,'').trim().toUpperCase(),
      title:get(r,'convention/event','convention','event'),
      startRaw:get(r,'start date','start'),
      endRaw:get(r,'end date','end'),
      start:safeDate(get(r,'start date','start')),
      end:safeDate(get(r,'end date','end')),
      venue:get(r,'venue'),city:get(r,'city'),country:get(r,'country'),
      details:get(r,'what chris is doing','what chris is doing','details','description'),
      url:get(r,'event website','website','url')
    }));
    const rejectReason=e=>{if(e.status!=='PUBLISH')return 'status is '+JSON.stringify(e.status);if(!e.title)return 'event title is blank';if(!e.start)return 'start date could not be parsed: '+JSON.stringify(e.startRaw);if(e.end&&e.end<today)return 'event has already ended';if(e.end&&e.end<e.start)return 'end date is before start date';return 'accepted';};
    const events=parsedRows.filter(e=>rejectReason(e)==='accepted').sort((a,b)=>a.start-b.start);
    appearanceDebug('Feed loaded successfully: '+events.length+' upcoming PUBLISH event(s).');if(!events.length){
      const first=parsedRows[0];const diagnostic=first?(' Diagnostic: '+rows.length+' data row(s); headers=['+headers.join(' | ')+']; first row: status='+JSON.stringify(first.status)+', title='+JSON.stringify(first.title)+', start='+JSON.stringify(first.startRaw)+' ('+(first.start?first.start.toISOString().slice(0,10):'INVALID')+'), end='+JSON.stringify(first.endRaw)+' ('+(first.end?first.end.toISOString().slice(0,10):'INVALID')+'), reason='+rejectReason(first)+'.'):' Diagnostic: no data rows returned.';
      appearanceDebug('Feed loaded successfully: 0 upcoming PUBLISH event(s).'+diagnostic);
      appearancesContainer.innerHTML='<p class="lead">Chris’s next convention appearances will be announced here.</p><p>Check back for event dates, venues and details of where you can meet Chris, have memorabilia signed and share your Star Wars memories.</p><p class="appearance-note">For appearance enquiries, please contact <a href="mailto:chrisparsons1@gmx.com">Chris by email</a>.</p>';
      return;
    }
    appearancesContainer.classList.add('appearances-list');
    appearancesContainer.innerHTML=events.map(e=>{
      const place=[e.venue,e.city,e.country].filter(Boolean).map(escapeHTML).join(' · ');
      const title=escapeHTML(e.title),date=escapeHTML(displayDate(e.start,e.end));
      const details=e.details?`<p>${escapeHTML(e.details)}</p>`:'';
      const venue=place?`<p class="appearance-venue">${place}</p>`:'';
      const link=e.url&&/^https?:\/\//i.test(e.url)?`<a class="text-link" href="${escapeHTML(e.url)}" target="_blank" rel="noopener noreferrer">EVENT DETAILS <span>↗</span></a>`:'';
      return `<article class="appearance-card"><p class="appearance-date">${date}</p><h3>${title}</h3>${venue}${details}${link}</article>`;
    }).join('');
  }catch(error){
    appearanceDebug('Unable to load appearances feed: '+(error&&error.message?error.message:String(error)));console.warn('Appearances feed:',error);
    // Keep the friendly fallback content already in the page if the feed is unavailable.
  }
}
loadAppearances();

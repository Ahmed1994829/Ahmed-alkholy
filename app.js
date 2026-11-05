import { firebaseConfig } from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getAuth, onAuthStateChanged, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, signOut, updateProfile
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  getFirestore, collection, doc, setDoc, getDoc, getDocs, addDoc,
  query, where, orderBy, onSnapshot, serverTimestamp, Timestamp,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const $ = (id) => document.getElementById(id);
const translations = {
 ar:{welcome:"دردشتك، أصدقاؤك، وحالاتك في مكان واحد",language:"اللغة",login:"تسجيل الدخول",register:"حساب جديد",email:"البريد الإلكتروني",password:"كلمة المرور",displayName:"الاسم الظاهر",authNote:"ابدأ محادثاتك بأمان وسهولة.",messenger:"مراسلة خاصة",chats:"المحادثات",people:"الأشخاص",statuses:"الحالات",profile:"ملفي الشخصي",logout:"خروج",privateChat:"رسائلك الخاصة",yourChats:"محادثاتك",chooseChat:"اختر محادثة للبدء",loading:"جارٍ التحميل...",selectConversation:"اختر محادثة",selectConversationHint:"اختر شخصاً من قائمة المحادثات أو ابدأ محادثة جديدة من الأشخاص.",private:"خاصة",writeMessage:"اكتب رسالتك...",send:"إرسال",findPeople:"ابحث عن الأشخاص",findPeopleHint:"ابدأ محادثة باستخدام البريد أو الاسم",searchPeople:"ابحث بالاسم أو البريد الإلكتروني",statusHint:"اكتب حالة قصيرة؛ ستختفي تلقائياً بعد 24 ساعة.",statusPlaceholder:"بماذا تفكر؟",publishStatus:"نشر الحالة",uid:"معرّف المستخدم",saveChanges:"حفظ التغييرات",callsNote:"المكالمات الصوتية: مرحلة تجريبية قادمة، وليست مفعّلة في هذه النسخة.",poweredBy:"يعمل بواسطة Firebase",noChats:"لا توجد محادثات بعد. ابدأ محادثة من تبويب الأشخاص.",noPeople:"لم يتم العثور على أشخاص.",noStatuses:"لا توجد حالات نشطة حالياً.",statusPublished:"تم نشر الحالة لمدة 24 ساعة.",profileSaved:"تم حفظ الملف الشخصي.",messageSent:"تم إرسال الرسالة.",configMissing:"أكمل إعداد firebase-config.js أولاً.",authError:"تعذر إتمام العملية. تحقق من البيانات واتصال الإنترنت.",searchSelf:"هذا حسابك الحالي.",online:"متصل",startChat:"مراسلة",statusBy:"حالة بواسطة",noEmail:"بدون بريد",nameRequired:"اكتب الاسم الظاهر."},
 en:{welcome:"Your chats, friends and statuses in one place",language:"Language",login:"Sign in",register:"Create account",email:"Email address",password:"Password",displayName:"Display name",authNote:"Chat securely and easily.",messenger:"Private messenger",chats:"Chats",people:"People",statuses:"Statuses",profile:"My profile",logout:"Log out",privateChat:"Your private messages",yourChats:"Your chats",chooseChat:"Choose a conversation",loading:"Loading...",selectConversation:"Select a conversation",selectConversationHint:"Choose a chat or start a new one from People.",private:"Private",writeMessage:"Write a message...",send:"Send",findPeople:"Find people",findPeopleHint:"Start a chat using a name or email",searchPeople:"Search name or email",statusHint:"Post a short text status. It expires after 24 hours.",statusPlaceholder:"What’s on your mind?",publishStatus:"Post status",uid:"User ID",saveChanges:"Save changes",callsNote:"Voice calls are planned experimentally and are not enabled in this version.",poweredBy:"Powered by Firebase",noChats:"No chats yet. Start one from People.",noPeople:"No people found.",noStatuses:"No active statuses.",statusPublished:"Status posted for 24 hours.",profileSaved:"Profile saved.",messageSent:"Message sent.",configMissing:"Complete firebase-config.js first.",authError:"Could not complete the action. Check your details and connection.",searchSelf:"This is your account.",online:"Online",startChat:"Message",statusBy:"Status by",noEmail:"No email",nameRequired:"Enter a display name."},
 fr:{welcome:"Vos discussions, amis et statuts au même endroit",language:"Langue",login:"Connexion",register:"Créer un compte",email:"Adresse e-mail",password:"Mot de passe",displayName:"Nom affiché",authNote:"Aucune carte bancaire requise.",messenger:"Messagerie privée",chats:"Discussions",people:"Personnes",statuses:"Statuts",profile:"Mon profil",logout:"Déconnexion",privateChat:"Vos messages privés",yourChats:"Vos discussions",chooseChat:"Choisissez une discussion",loading:"Chargement...",selectConversation:"Choisir une discussion",selectConversationHint:"Choisissez une discussion ou démarrez-en une depuis Personnes.",private:"Privé",writeMessage:"Écrire un message...",send:"Envoyer",findPeople:"Trouver des personnes",findPeopleHint:"Démarrer une discussion avec un nom ou un e-mail",searchPeople:"Rechercher un nom ou un e-mail",statusHint:"Publiez un court statut textuel. Il expire après 24 heures.",statusPlaceholder:"À quoi pensez-vous ?",publishStatus:"Publier",uid:"Identifiant utilisateur",saveChanges:"Enregistrer",callsNote:"Les appels vocaux sont prévus à titre expérimental et ne sont pas activés.",poweredBy:"Propulsé par Firebase",noChats:"Aucune discussion. Commencez depuis Personnes.",noPeople:"Aucun résultat.",noStatuses:"Aucun statut actif.",statusPublished:"Statut publié pour 24 heures.",profileSaved:"Profil enregistré.",messageSent:"Message envoyé.",configMissing:"Complétez d’abord firebase-config.js.",authError:"Action impossible. Vérifiez vos informations et la connexion.",searchSelf:"C’est votre compte.",online:"En ligne",startChat:"Écrire",statusBy:"Statut de",noEmail:"Sans e-mail",nameRequired:"Saisissez un nom."}
};
let lang="ar", mode="login", auth, db, currentUser=null, currentProfile=null, selectedPeer=null, selectedConversationId=null, stopMessages=null, stopChats=null, allPeople=[];
const t=(key)=>translations[lang]?.[key] || translations.ar[key] || key;
const toast=(msg)=>{const el=$("toast");el.textContent=msg;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2800)};
const displayName=(p)=>p?.Name || p?.name || p?.displayName || p?.email || t("noEmail");
const emailOf=(p)=>p?.email || "";
const safeDate=(v)=>v?.toDate ? v.toDate() : (v instanceof Date ? v : null);
function applyLanguage(value){
  lang=value;document.documentElement.lang=lang;document.documentElement.dir=lang==="ar"?"rtl":"ltr";
  document.querySelectorAll("[data-i18n]").forEach(el=>{const k=el.dataset.i18n;if(t(k))el.textContent=t(k)});
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el=>el.placeholder=t(el.dataset.i18nPlaceholder));
  $("authLang").value=lang;$("appLang").value=lang;
  $("authSubmit").textContent=t(mode);
}
function showAuth(){ $("authView").classList.remove("hidden");$("appView").classList.add("hidden"); }
function showApp(){ $("authView").classList.add("hidden");$("appView").classList.remove("hidden"); }
function setMode(next){mode=next;$("loginTab").classList.toggle("active",mode==="login");$("registerTab").classList.toggle("active",mode==="register");$("nameField").classList.toggle("hidden",mode!=="register");$("authSubmit").textContent=t(mode);}
function showView(name){
  document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));
  $(name+"View").classList.add("active");
  document.querySelectorAll(".nav-btn").forEach(b=>b.classList.toggle("active",b.dataset.view===name));
  $("pageTitle").textContent=t(name);$("pageSubtitle").textContent=name==="chats"?t("privateChat"):"";
  if(name==="people")loadPeople();if(name==="statuses")loadStatuses();
}
function getConfigReady(){return firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith("PASTE_") && firebaseConfig.projectId && !firebaseConfig.projectId.startsWith("PASTE_");}
function userDoc(uid){return doc(db,"Users",uid);}
async function ensureProfile(user, nameHint=""){
  const ref=userDoc(user.uid), snap=await getDoc(ref);
  if(!snap.exists()){
    const name=nameHint || user.displayName || user.email?.split("@")[0] || "User";
    await setDoc(ref,{Name:name,name,displayName:name,email:user.email||"",Status:"Online",status:"Online",createdAt:serverTimestamp()});
  }else{
    const d=snap.data(), name=d.Name||d.name||user.displayName||user.email?.split("@")[0]||"User";
    currentProfile={...d,uid:user.uid};
    if(!d.email) await updateDoc(ref,{email:user.email||""});
    return currentProfile;
  }
  const fresh=await getDoc(ref);return {...fresh.data(),uid:user.uid};
}
async function authSubmit(e){
  e.preventDefault();
  if(!getConfigReady()){toast(t("configMissing"));return;}
  const email=$("authEmail").value.trim(), password=$("authPassword").value;
  try{
    if(mode==="register"){
      const name=$("authName").value.trim();if(!name){toast(t("nameRequired"));return;}
      const cred=await createUserWithEmailAndPassword(auth,email,password);
      await updateProfile(cred.user,{displayName:name});
      await ensureProfile(cred.user,name);
    }else{await signInWithEmailAndPassword(auth,email,password);}
  }catch(err){console.error(err);toast(err.code==="auth/weak-password"?"استخدم كلمة مرور من 6 أحرف على الأقل.":t("authError"));}
}
async function onUser(user){
  if(!user){currentUser=null;currentProfile=null;showAuth();return;}
  currentUser=user;
  try{currentProfile=await ensureProfile(user);showApp();renderProfile();startChatList();}
  catch(err){console.error(err);toast(t("authError"));}
}
function renderProfile(){
  const name=displayName(currentProfile);$("sideUserName").textContent=name;$("topAvatar").textContent=name.slice(0,1).toUpperCase();$("profileAvatar").textContent=name.slice(0,1).toUpperCase();
  $("profileName").value=name;$("profileEmail").value=currentUser.email||"";$("profileUid").value=currentUser.uid;
}
async function loadPeople(){
  if(!currentUser)return;
  try{
    const snap=await getDocs(collection(db,"Users"));
    allPeople=snap.docs.map(d=>({uid:d.id,...d.data()})).filter(p=>p.uid===p.uid && p.uid!==currentUser.uid && p.uid!=="Auto-ID");
    renderPeople($("peopleSearch").value);
  }catch(err){console.error(err);$("peopleList").innerHTML=`<div class="empty">${t("authError")}</div>`;}
}
function renderPeople(filter=""){
  const term=filter.toLowerCase();
  const matches=allPeople.filter(p=>(displayName(p)+" "+emailOf(p)+" "+p.uid).toLowerCase().includes(term));
  $("peopleList").innerHTML="";
  if(!matches.length){$("peopleList").innerHTML=`<div class="empty">${t("noPeople")}</div>`;return;}
  matches.forEach(p=>{
    const row=document.createElement("div");row.className="person-row";
    const av=document.createElement("div");av.className="avatar";av.textContent=displayName(p).slice(0,1).toUpperCase();
    const meta=document.createElement("div");meta.className="person-meta";
    const strong=document.createElement("strong");strong.textContent=displayName(p);
    const small=document.createElement("small");small.textContent=emailOf(p);
    const action=document.createElement("span");action.className="row-action";action.textContent=t("startChat");
    meta.append(strong,small);row.append(av,meta,action);row.addEventListener("click",()=>openChat(p));$("peopleList").append(row);
  });
}
function convoId(a,b){return [a,b].sort().join("__");}
async function openChat(peer){
  if(!currentUser)return;if(peer.uid===currentUser.uid){toast(t("searchSelf"));return;}
  selectedPeer=peer;selectedConversationId=convoId(currentUser.uid,peer.uid);
  const ref=doc(db,"Conversations",selectedConversationId), snap=await getDoc(ref);
  if(!snap.exists()) await setDoc(ref,{user1:currentUser.uid,user2:peer.uid,lastMessage:"",updatedAt:serverTimestamp()});
  $("chatEmpty").classList.add("hidden");$("chatActive").classList.remove("hidden");
  $("chatName").textContent=displayName(peer);$("chatEmail").textContent=emailOf(peer);$("chatAvatar").textContent=displayName(peer).slice(0,1).toUpperCase();
  showView("chats");document.querySelectorAll(".person-row").forEach(r=>r.classList.remove("selected"));
  listenMessages();
}
function listenMessages(){
  if(stopMessages)stopMessages();$("messageList").innerHTML="";
  const uid=currentUser.uid, peer=selectedPeer.uid;
  const q1=query(collection(db,"Messages"),where("senderId","==",uid),where("receiverId","==",peer));
  const q2=query(collection(db,"Messages"),where("senderId","==",peer),where("receiverId","==",uid));
  let a=[],b=[];
  const render=()=>{
    const rows=[...a,...b].sort((x,y)=>(safeDate(x.timestamp)?.getTime()||0)-(safeDate(y.timestamp)?.getTime()||0));
    $("messageList").innerHTML="";
    rows.forEach(m=>{
      const bubble=document.createElement("div");bubble.className="bubble"+(m.senderId===uid?" mine":"");
      const body=document.createElement("div");body.textContent=m.message||"";
      const time=document.createElement("time");const date=safeDate(m.timestamp);time.textContent=date?date.toLocaleString():"";
      bubble.append(body,time);$("messageList").append(bubble);
    });
    $("messageList").scrollTop=$("messageList").scrollHeight;
  };
  const unsub1=onSnapshot(q1,s=>{a=s.docs.map(d=>({id:d.id,...d.data()}));render();},err=>console.error(err));
  const unsub2=onSnapshot(q2,s=>{b=s.docs.map(d=>({id:d.id,...d.data()}));render();},err=>{console.error(err);toast("راجع فهارس Firestore إذا طلب إنشاء Index.");});
  stopMessages=()=>{unsub1();unsub2();};
}
async function sendMessage(e){
  e.preventDefault();const message=$("messageInput").value.trim();if(!message||!selectedPeer)return;
  try{
    await addDoc(collection(db,"Messages"),{senderId:currentUser.uid,receiverId:selectedPeer.uid,conversationId:selectedConversationId,message,timestamp:serverTimestamp()});
    await updateDoc(doc(db,"Conversations",selectedConversationId),{lastMessage:message,updatedAt:serverTimestamp()});
    $("messageInput").value="";
  }catch(err){console.error(err);toast(t("authError"));}
}
function startChatList(){
  if(stopChats)stopChats();
  const q=query(collection(db,"Conversations"),where("user1","==",currentUser.uid));
  const q2=query(collection(db,"Conversations"),where("user2","==",currentUser.uid));
  let one=[],two=[];
  const render=async()=>{
    const all=[...one,...two].reduce((acc,c)=>{acc.set(c.id,c);return acc;},new Map());
    $("chatList").innerHTML="";
    const entries=[...all.values()].sort((x,y)=>(safeDate(y.updatedAt)?.getTime()||0)-(safeDate(x.updatedAt)?.getTime()||0));
    if(!entries.length){$("chatList").innerHTML=`<div class="empty">${t("noChats")}</div>`;return;}
    for(const c of entries){
      const peerId=c.user1===currentUser.uid?c.user2:c.user1;
      try{
        const ps=await getDoc(userDoc(peerId));const p={uid:peerId,...(ps.exists()?ps.data():{})};
        const row=document.createElement("div");row.className="person-row"+(selectedPeer?.uid===peerId?" selected":"");
        const av=document.createElement("div");av.className="avatar";av.textContent=displayName(p).slice(0,1).toUpperCase();
        const meta=document.createElement("div");meta.className="person-meta";
        const strong=document.createElement("strong");strong.textContent=displayName(p);
        const small=document.createElement("small");small.textContent=c.lastMessage||emailOf(p);
        meta.append(strong,small);row.append(av,meta);row.onclick=()=>openChat(p);$("chatList").append(row);
      }catch(err){console.warn(err);}
    }
  };
  const u1=onSnapshot(q,s=>{one=s.docs.map(d=>({id:d.id,...d.data()}));render();},console.error);
  const u2=onSnapshot(q2,s=>{two=s.docs.map(d=>({id:d.id,...d.data()}));render();},console.error);
  stopChats=()=>{u1();u2();};
}
async function publishStatus(e){
  e.preventDefault();const text=$("statusInput").value.trim();if(!text)return;
  const expiry=Timestamp.fromDate(new Date(Date.now()+24*60*60*1000));
  try{await updateDoc(userDoc(currentUser.uid),{statusText:text,statusExpiresAt:expiry,statusUpdatedAt:serverTimestamp()});$("statusInput").value="";toast(t("statusPublished"));loadStatuses();}
  catch(err){console.error(err);toast(t("authError"));}
}
async function loadStatuses(){
  try{
    const snap=await getDocs(collection(db,"Users"));const now=Date.now();
    const active=snap.docs.map(d=>({uid:d.id,...d.data()})).filter(p=>p.statusText&&safeDate(p.statusExpiresAt)?.getTime()>now);
    $("statusList").innerHTML="";
    if(!active.length){$("statusList").innerHTML=`<div class="empty">${t("noStatuses")}</div>`;return;}
    active.sort((a,b)=>(safeDate(b.statusUpdatedAt)?.getTime()||0)-(safeDate(a.statusUpdatedAt)?.getTime()||0));
    active.forEach(p=>{const item=document.createElement("article");item.className="status-item";const name=document.createElement("strong");name.textContent=displayName(p);const body=document.createElement("p");body.textContent=p.statusText;const small=document.createElement("small");small.textContent=t("statusBy")+" · "+(safeDate(p.statusUpdatedAt)?.toLocaleString()||"");item.append(name,body,small);$("statusList").append(item);});
  }catch(err){console.error(err);toast(t("authError"));}
}
async function saveProfile(e){
  e.preventDefault();const name=$("profileName").value.trim();if(!name){toast(t("nameRequired"));return;}
  try{await updateProfile(currentUser,{displayName:name});await updateDoc(userDoc(currentUser.uid),{Name:name,name,displayName:name});currentProfile={...currentProfile,Name:name,name,displayName:name};renderProfile();toast(t("profileSaved"));}
  catch(err){console.error(err);toast(t("authError"));}
}
function init(){
  if(!getConfigReady()){showAuth();$("authForm").addEventListener("submit",e=>{e.preventDefault();toast(t("configMissing"));});return;}
  const app=initializeApp(firebaseConfig);auth=getAuth(app);db=getFirestore(app);
  onAuthStateChanged(auth,onUser);
  $("authForm").addEventListener("submit",authSubmit);
  $("loginTab").onclick=()=>setMode("login");$("registerTab").onclick=()=>setMode("register");
  $("authLang").onchange=e=>applyLanguage(e.target.value);$("appLang").onchange=e=>applyLanguage(e.target.value);
  document.querySelectorAll(".nav-btn").forEach(b=>b.onclick=()=>showView(b.dataset.view));
  $("logoutBtn").onclick=()=>signOut(auth);
  $("sendForm").addEventListener("submit",sendMessage);$("peopleSearch").addEventListener("input",e=>renderPeople(e.target.value));
  $("refreshPeople").onclick=loadPeople;$("refreshChats").onclick=startChatList;
  $("statusForm").addEventListener("submit",publishStatus);$("profileForm").addEventListener("submit",saveProfile);
  applyLanguage("ar");setMode("login");
}
init();

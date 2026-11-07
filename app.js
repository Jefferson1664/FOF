const APP_VERSION='0.4.0';
const MISSIONS={
1:{title:'Trévières Offensive',date:'8–10 juin 1944',type:'Offensive',turns:10,vis:'Daylight +0',map:'4 × 3',objective:'Secure Primary and Secondary Objectives and Clear Rows 1 and 2.',pc:['Row 3: B','Row 2: A','Row 1: C'],tactics:'Deliberate Defense',exp:'Line',enemy:'352nd Division, 90th Brigade',special:'LOD between Staging Area and Row 1; LOA top of Row 3.'},
2:{title:'Cerisy Offensive',date:'11–19 juin 1944',type:'Offensive',turns:10,vis:'Daylight +0',map:'4 × 5',objective:'Secure Primary and Secondary Objectives and Clear Rows 1 through 4.',pc:['Row 5: A','Rows 3–4: B','Rows 1–2: C'],tactics:'Hasty Defense',exp:'Line',enemy:'9th Fallschirmjäger Regiment, 3rd Fallschirmjäger Division',special:'LOD between Staging Area and Row 1; LOA top of Row 5.'},
3:{title:'St. Georges d’Elle—Le Parc Defensive',date:'20 juin–10 juillet 1944',type:'Combat Patrols',turns:10,vis:'Moon — Limited Visibility +2 to +5 randomly per patrol',map:'5 × 4',objective:'Move the selected platoon from Row 1 to the Primary Objective in Row 4 and return to Row 1; pass the Route Points and cross the MLR.',pc:['Row 4: A','Rows 3–2: ? (B/C)'],tactics:'Deliberate Defense',exp:'Veteran',enemy:'9th Fallschirmjäger Regiment, 3rd Fallschirmjäger Division',special:'No Staging Area. Same map is reused for Mission 4 in campaign.'},
4:{title:'Hill 192 Offensive',date:'11–12 juillet 1944',type:'Offensive',turns:10,vis:'Daylight +0',map:'5 × 4',objective:'Secure Primary and Secondary Objectives and Clear Rows 2 and 3.',pc:['Row 4: A','Row 3: A','Row 2: B','Row 1: C'],tactics:'Deliberate Defense',exp:'Veteran',enemy:'9th Fallschirmjäger Regiment, 3rd Fallschirmjäger Division',special:'No Staging Area. In campaign, use Mission 3 map; PC markers may be on US-occupied cards.'},
5:{title:'St. Germain d’Elle—La Croix Rouge—Le Soulaire Defensive',date:'13–25 juillet 1944',type:'Combat Patrols',turns:10,vis:'Moon — Limited Visibility +2 to +5 randomly per patrol',map:'6 × 4',objective:'Move the platoon through four Route Points and the Primary Objective, then cross the MLR from Row 2 to Row 1.',pc:['Row 4: A','Rows 3–2: ? (B/C)'],tactics:'Deliberate Defense',exp:'Veteran',enemy:'9th Fallschirmjäger Regiment, 3rd Fallschirmjäger Division',special:'No Staging Area. One patrol with each platoon; same map per patrol.'},
6:{title:'Vire Offensive',date:'26 juillet–7 août 1944',type:'Offensive',turns:10,vis:'Daylight +0',map:'4 × 5',objective:'Secure Primary and Secondary Objectives and Clear Rows 1 through 3 of enemy forces.',pc:['Rows 4–5: ? (A/B)','Row 3: B','Rows 1–2: C'],tactics:'Delay Defense',exp:'Line',enemy:'9th Fallschirmjäger Regiment, 3rd Fallschirmjäger Division',special:'LOD between Staging Area and Row 1; LOA top of Row 5.'},
7:{title:'Tinchebray Offensive',date:'8–16 août 1944',type:'Offensive',turns:10,vis:'Daylight +0',map:'4 × 6',objective:'Secure Primary and Secondary Objectives and Clear Rows 1 through 5.',pc:['Rows 5–6: A','Rows 3–4: B','Rows 1–2: C'],tactics:'Delay Defense',exp:'Green',enemy:'3rd and 5th Fallschirmjäger Divisions',special:'Primary Objective on Row 6; Secondary on Row 5; Attack Position on Row 4.'}
};
const phases=[
['3.1','Friendly Higher HQ Event Phase','À partir du tour 2'],
['3.2','Defensive Missions: Enemy Activity Phase','Pour les missions défensives'],
['3.3','Friendly Command Phase','Activation puis Initiative'],
['3.4','Offensive Missions / Combat Patrols: Enemy Activity Phase','Pour les missions offensives / Combat Patrols'],
['3.5','Mutual Capture & Retreat Phase','Capture puis Retreat'],
['3.6','AT Combat & Vehicle Movement Phase','AT, véhicules et Reaction Fire'],
['3.7','Mutual Combat Phase','Fire Mission Update → Potential Contact → Combat Effects'],
['3.8','Clean Up Phase','Nettoyage et mise à jour']
];
const cmdRows=[['Pinned','−1'],['Green','−1'],['Veteran','+1'],['Under a Cover marker','+1'],['Small Arms (S) VOF','−1'],['Automatic Weapons (A) VOF','−2'],['Heavy Weapons (H), Sniper (S!), Grenade Attack (G!), Incoming! or Air Strike!','−3'],['Current Activity Level: No Contact','+1']];
const pcRows=[['A','Auto','7','5','3'],['B','Auto','5','3','2'],['C','4','3','2','1']];
const LOCATION_ROWS=[['1-4','Front'],['5-6','Left Front'],['7-8','Right Front']];
const CONTACT_DATA={
1:{packages:{1:'Mines!',2:'Incoming!',3:'Sniper!',4:'Mines and HMG Nest',5:'MG Nest',6:'Strong Point',7:'Defensive Position',8:'Pillbox',9:'Mortar Team',10:'FLAK 36 AA Gun',11:'Patrol',12:'Base of Fire'},map:{A:[[1,3],[2,5,3],[4,6],[5,7,6],[7,8],[8,10],[9,11,10]],B:[[1,2,2],[4,5,6],[7,6,8],[9,9],[10,10]],C:[[1,1,2],[3,2,6],[7,3],[8,4],[9,5,10]]}},
2:{packages:{1:'Incoming!',2:'Sniper!',3:'MG Nest',4:'Defensive Position',5:'Strong Point',6:'Defensive Position+',7:'Command Post',8:'Mortar Position',9:'Maneuver',10:'Pillbox',11:'Base of Fire'},map:{A:[[1,3,3],[4,4],[5,5],[6,6],[7,7],[8,8],[9,9],[10,10]],B:[[1,1,3],[4,2],[5,3,8],[9,6,10]],C:[[1,1,3],[4,2,5],[6,3,8],[10,10]]}},
3:{packages:{1:'Mines!',2:'Incoming!',3:'LMG Nest',4:'HMG Nest',5:'Patrol',6:'Illum & LMG',7:'Illum & Patrol',8:'Defensive Position',9:'Strong Point',10:'Pillbox',11:'Maneuver',12:'Mortar Position'},map:{A:[[1,3],[2,4,3],[4,5],[5,8,6],[7,9],[8,10],[9,11],[10,12]],B:[[1,1,2],[3,2,5],[6,3],[7,5],[8,6,9],[10,7]],C:[[1,1,2],[3,2,5],[6,3],[7,5,8],[9,6],[10,7]]}},
4:{packages:{1:'Mines!',2:'Incoming!',3:'LMG Nest',4:'HMG Nest',5:'Patrol',6:'Illum & LMG',7:'Illum & Patrol',8:'Defensive Position',9:'Strong Point',10:'Pillbox',11:'Maneuver',12:'Mortar Position'},map:{A:[[1,4],[2,6,3],[4,7,5],[6,8],[7,9],[8,10,9],[10,11]],B:[[1,1,3],[4,2,6],[7,4,8],[9,6,10]],C:[[1,1,3],[4,2,5],[6,3],[7,4,9],[10,5]]}},
5:{packages:{1:'Mines!',2:'Incoming!',3:'Sniper!',4:'MG Nest',5:'Maneuver',6:'AT Weapons',7:'Defensive Position',8:'Strong Point',9:'Command Post',10:'Heavy Weapons',11:'Mortar Position',12:'Base of Fire'},map:{A:[[1,3],[2,4,3],[4,5],[5,6,6],[7,7],[8,8],[9,9],[10,10]],B:[[1,1,2],[3,2,5],[6,5],[7,6,8],[9,7,10]],C:[[1,1,2],[3,2,5],[6,3],[7,5,8],[9,6],[10,7]]}},
6:{packages:{1:'Mines!',2:'Incoming!',3:'Sniper!',4:'LMG Nest',5:'HMG Nest',6:'Patrol',7:'Mortar Team',8:'AT Weapons',9:'Defensive Position',10:'Maneuver',11:'Heavy Weapons',12:'Base of Fire'},map:{A:[[1,4,2],[3,5],[4,7],[5,8],[6,9,7],[8,10],[9,11,10]],B:[[1,1],[2,2,3],[4,3,5],[6,4,7],[8,7],[9,8,10]],C:[[1,1,3],[4,2,5],[6,3],[7,4,9],[10,6]]}},
7:{packages:{1:'Mines!',2:'Incoming!',3:'Sniper!',4:'LMG Nest',5:'HMG Nest',6:'Patrol',7:'Mortar Team',8:'AT Weapons',9:'Defensive Position',10:'Maneuver',11:'Infantry Gun'},map:{A:[[1,4],[2,5],[3,6],[4,7],[5,8,6],[7,9,8],[9,10],[10,11]],B:[[1,1],[2,2,3],[4,3],[5,4,7],[8,7],[9,8,10]],C:[[1,1,2],[3,2,4],[5,3,6],[7,4,8],[9,6,10]]}}
};
function rangeMatch(r,entry){return r>=entry[0] && r<=entry[entry.length-1];}
function packageFor(mission,pc,r){
  const rows=(CONTACT_DATA[mission]?.map?.[pc]||[]);
  for(const e of rows){if(rangeMatch(r,e)) return {number:e[1],name:CONTACT_DATA[mission].packages[e[1]],range:`${e[0]}${e.length>2?'-'+e[e.length-1]:''}`};}
  return null;
}
let state={screen:'setup',mission:null,turn:1,phase:0,step:0,activity:'No Contact',action:null,history:[]};
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
function render(){document.getElementById('app').innerHTML=state.screen==='setup'?setup():game();}
function setup(){return `<div class="shell"><aside class="side"><div class="brand">GMT / LOCAL TOOL<span>FIELDS OF FIRE</span></div><div class="campaign"><label>Campaign</label><select><option>Normandy — 9th Infantry Regiment</option></select></div><div class="nav"><div class="nav-item active">Nouvelle partie<small>Choisir une mission</small></div></div></aside><main class="content"><div class="setup"><div class="card"><div class="eyebrow">Local Turn Assistant</div><h1>Fields of Fire</h1><p class="sub">Assistant de séquence de jeu — basé sur les documents du projet.</p><div class="field"><label>Campagne</label><select id="camp"><option value="normandy">Normandy — 9th Infantry Regiment</option></select></div><div class="field"><label>Mission / scénario</label><select id="mission">${Object.entries(MISSIONS).map(([k,m])=>`<option value="${k}">Mission ${k} — ${esc(m.title)}</option>`).join('')}</select></div><button class="btn primary" onclick="startGame()">Commencer la partie</button><div class="version-badge">Version ${APP_VERSION}</div><div class="alert">La première version utilise la campagne Normandy et son architecture de missions. Les données de mission sont séparées du moteur afin d'ajouter ensuite les autres campagnes sans modifier le cœur de l'application.</div></div></div></main></div>`}
function game(){const m=MISSIONS[state.mission];const phase=phases[state.phase];return `<div class="shell"><aside class="side"><div class="brand">GMT / LOCAL TOOL<span>FIELDS OF FIRE</span></div><div class="campaign"><label>Campagne</label><div class="pill accent">Normandy</div></div><div class="nav"><div class="nav-item active">${esc(m.title)}<small>Mission ${state.mission}</small></div>${phases.map((p,i)=>`<div class="nav-item ${i===state.phase?'active':''}">${p[0]} ${p[1]}</div>`).join('')}</div></aside><main class="content"><div class="top"><div><div class="eyebrow">Normandy · Mission ${state.mission}</div><h1>${esc(m.title)}</h1><div class="sub">${m.type} · ${m.turns} tours · ${m.vis}</div></div><div class="turnbox">Tour <strong>${state.turn}</strong> / ${m.turns}<div class="progress"><i style="width:${Math.min(100,state.turn/m.turns*100)}%"></i></div></div></div><div class="grid"><section>${stepPanel(m,phase)}</section><aside>${statePanel(m)}${tablesPanel()}</aside></div><div class="footer">Version ${APP_VERSION} · Références principales : Series Rules 3rd Edition, Errata & Clarifications May 10 2025, Normandy Mission Book, Player Aids.</div></main></div>`}
function stepPanel(m,phase){
  let body='';
  if(state.phase===0){body=phase31();}
  else if(state.phase===1){body=phase32();}
  else if(state.phase===2){body=commandStep();}
  else if(state.phase===3){body=phase34();}
  else if(state.phase===4){body=phase35();}
  else if(state.phase===5){body=phase36();}
  else if(state.phase===6){body=contactStep();}
  else if(state.phase===7){body=phase38();}
  return `<div class="card"><div class="step"><div class="kicker">${phase[0]}</div><div class="step-title">${esc(phase[1])}</div><div class="small">Tour ${state.turn}</div></div>${body}<div class="note">${esc(m.special)}</div></div>`;
}
function sequenceDetails(title,lines){return `<div class="details"><div class="side-title">Déroulement précis — ${esc(title)}</div><ol>${lines.map(x=>`<li>${x}</li>`).join('')}</ol></div>`}
function phase31(){return `<p class="instruction"><b>Friendly Higher HQ Event Phase</b> — à partir du tour 2 uniquement. Tu suis la procédure avec le paquet de cartes et appliques l'événement si la condition HQ est présente.</p>${sequenceDetails('3.1 Friendly Higher HQ Event Phase',[
'Cette phase commence au Tour 2 ; au Tour 1, elle est ignorée.',
'Le but est de déterminer si un événement de Friendly Higher HQ se produit pendant ce tour.',
'La procédure officielle utilise une Action Card comme élément aléatoire de la résolution.',
'Le site ne te demande jamais le numéro de cette carte et ne te demande pas de le saisir.',
'Utilise physiquement la carte du paquet et vérifie l’icône radio/HQ indiquée par la règle.',
'Si la condition d’événement est remplie, utilise la Friendly Higher HQ Events Table de la mission/campagne.',
'Les événements de cette table sont obligatoires lorsqu’ils sont déclenchés.',
'Applique ensuite les instructions de la case de l’événement concerné.',
'Les effets propres à la mission doivent être appliqués en plus de la règle générale.',
'Après résolution complète de l’événement, passe à la phase suivante de la séquence.',
'Le site affiche ici les tables utiles ; il ne remplace pas le tirage physique du paquet.',
'Référence moteur : Series Rules 3.1 ; les tables d’événements viennent du livret de campagne concerné.'
])}<div class="decision"><button class="btn primary" onclick="nextStep('3.1 résolue')">Phase résolue →</button></div>`}
function phase32(){return `<p class="instruction"><b>3.2 Defensive Missions: Enemy Activity Phase</b> — cette phase ne s'applique qu'aux missions défensives.</p>${sequenceDetails('3.2 Enemy Activity Phase — missions défensives',[
'Commence par le Enemy Higher HQ Event Segment, à partir du Tour 2.',
'Utilise la procédure d’événement Enemy Higher HQ et la table de la mission.',
'Ensuite, dans le Enemy Activity Check Segment, place les PC markers indiqués par les instructions de mission.',
'Les PC markers sont placés selon les lignes et conditions spécifiées par le scénario.',
'Chaque unité ennemie présente sur la carte est ensuite vérifiée pour son activité.',
'L’ordre des cartes à vérifier est déterminé aléatoirement selon la procédure officielle.',
'Pour chaque carte, utilise l’Enemy Activity Check Hierarchy correspondant au statut des unités.',
'Les unités qui tirent sur une carte sans cible valide reçoivent d’abord un ordre Cease Fire et peuvent ouvrir le feu ailleurs selon la règle.',
'Les effets de l’activité ennemie sont appliqués conformément aux tables et à l’Action Menu.',
'Le Current Activity Level et les marqueurs VOF/PDF doivent être mis à jour lorsqu’une modification de carte l’exige.',
'Une fois toutes les cartes vérifiées, la phase est terminée.',
'Cette phase est sautée pour une mission offensive ou une Combat Patrol ; dans ce cas, on utilise 3.4.'
])}<div class="decision"><button class="btn primary" onclick="nextStep('3.2 résolue')">Phase résolue →</button></div>`}
function commandStep(){return `<p class="instruction"><b>Friendly Command Phase</b> — les ordres circulent dans la chaîne de commandement. Le site affiche les tables de Commands et les limites utiles ; tu utilises physiquement tes Action Cards pour les tirages sans jamais entrer leur numéro.</p>${sequenceDetails('3.3 Friendly Command Phase',[
'Un ordre ne peut être reçu que si l’Originator et le Recipient sont dans la Chain of Command et en communication.',
'L’Activation Segment commence par le BN HQ Impulse.',
'Si le BN HQ est hors carte, il active automatiquement le CO HQ lorsque les conditions de communication sont remplies.',
'Si le BN HQ est sur la carte, il reçoit le maximum de Commands : 6 en Daylight ou 4 en Limited Visibility.',
'Les Commands du BN HQ doivent être utilisés pendant son impulse ; le BN HQ ne sauvegarde pas de Commands.',
'Le CO HQ Impulse suit et permet au CO HQ activé de recevoir ses Commands modifiés.',
'Le PLT HQ/CO Staff Impulse traite ensuite chaque PLT HQ ou CO Staff activé.',
'Les Commands reçus peuvent être dépensés ou sauvegardés dans les limites de Visibility et Experience Level.',
'Après l’Activation Segment vient l’Initiative Segment.',
'Les HQ/Staff non activés peuvent alors recevoir des Initiative Commands selon la procédure appropriée.',
'Les quatre impulses d’initiative sont CO HQ, PLT HQ, CO Staff puis General Initiative.',
'Utilise la Command Draw Modifiers table affichée à droite lorsque tu dois calculer un tirage de Commands.',
'Le site ne te demande aucun numéro de carte : tu tires physiquement la carte et appliques le résultat avec les tables affichées.',
'Après le General Initiative Impulse, passe à la phase Enemy Activity appropriée à la mission.'
])}<div class="table-wrap"><table class="rule-table"><thead><tr><th>Command Draw Modifier</th><th>Mod.</th></tr></thead><tbody>${cmdRows.map(r=>`<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td></tr>`).join('')}</tbody></table></div><div class="decision"><button class="btn primary" onclick="nextStep('3.3 résolue')">Phase résolue →</button></div>`}
function phase34(){return `<p class="instruction"><b>3.4 Offensive Missions / Combat Patrols: Enemy Activity Phase</b> — utilisée pour les missions offensives et les Combat Patrols.</p>${sequenceDetails('3.4 Enemy Activity Phase — offensives / Combat Patrols',[
'Commence par le Enemy Higher HQ Event Segment à partir du Tour 2.',
'Utilise la Enemy Higher HQ Events Table de la mission si la condition d’événement est remplie.',
'Les événements déclenchés sont résolus selon les instructions de leur entrée.',
'Passe ensuite au Enemy Activity Check Segment.',
'Les unités ennemies qui tirent sur des cartes sans cible valide doivent être traitées selon la procédure Cease Fire/Open Fire.',
'Verifie ensuite chaque unité ennemie présente sur la carte pour déterminer son activité.',
'L’ordre des cartes est déterminé aléatoirement.',
'Pour chaque carte, applique l’Enemy Activity Check Hierarchy correspondant au statut de chaque unité.',
'Utilise l’Enemy Activity Check Hierarchy Player Aid comme table principale de résolution.',
'Les ordres ennemis et leurs effets sont ensuite exécutés selon les Action Menus ennemis.',
'Lorsque la carte change, mets à jour Activity Level, VOF et PDF conformément à la règle, sauf pendant 3.7.4.',
'Quand toutes les cartes ont été traitées, passe à 3.5 Mutual Capture & Retreat.'
])}<div class="decision"><button class="btn primary" onclick="nextStep('3.4 résolue')">Phase résolue →</button></div>`}
function phase35(){return `<p class="instruction"><b>3.5 Mutual Capture & Retreat Phase</b> — traite d’abord les captures, puis les retraits.</p>${sequenceDetails('3.5 Mutual Capture & Retreat',[
'Le Capture Segment traite les situations de prisonniers et les unités ennemies vulnérables selon 8.15.',
'Une Paralyzed Team ou Litter Team isolée sur une carte avec des unités d’infanterie adverses non Pinned peut être capturée selon les conditions de la règle.',
'Si le camp ne prend pas de prisonniers, les étapes capturées sont converties en casualties.',
'Si des prisonniers sont pris, les étapes de garde et de prisonniers sont retirées de la partie selon la procédure.',
'Les enemy casualties sur les cartes inoccupées ou occupées par des unités amies sont capturées selon 8.15.1.',
'Les unités ennemies ne capturent pas les casualties américaines.',
'Le Retreat Segment vient immédiatement après le Capture Segment.',
'Commence par vérifier les effets éventuels du CS Gas.',
'Une Unpinned Paralyzed Team sous un VOF marker peut devoir reculer d’une carte.',
'Une Unpinned Litter Team accompagnée d’une Casualty sous VOF peut également devoir reculer.',
'La priorité de choix de la carte de repli tient compte du VOF puis du meilleur Cover & Concealment.',
'En cas d’égalité de Cover & Concealment, le choix est déterminé aléatoirement.',
'Les unités qui reculent sont marquées Exposed conformément à la procédure.',
'Une fois captures et retraits terminés, passe à 3.6.'
])}<div class="decision"><button class="btn primary" onclick="nextStep('3.5 résolue')">Phase résolue →</button></div>`}
function phase36(){return `<p class="instruction"><b>3.6 AT Combat & Vehicle Movement Phase</b> — traite les véhicules et les unités capables de combat antichar avant le Mutual Combat.</p>${sequenceDetails('3.6 AT Combat & Vehicle Movement',[
'Les unités AT-capable activées peuvent effectuer leurs actions de tir.',
'Les véhicules activés peuvent Move, Spot ou Concentrate Fire selon leurs possibilités.',
'Si les deux camps possèdent des unités activées, les actions sont alternées en commençant par l’attaquant.',
'Les actions sont réalisées dans l’ordre prévu par les règles et les éventuelles Mission Special Rules.',
'Les véhicules qui terminent leur action retournent leur marqueur Activated selon la procédure.',
'Le Reaction Fire peut intervenir pendant cette phase lorsqu’il est déclenché.',
'Les règles spécifiques aux véhicules et à l’AT se trouvent dans la section 10 des Series Rules.',
'Utilise le Vehicle and Anti-Tank Weapons Chart pour les valeurs spécifiques des armes et véhicules.',
'Les conditions de visibilité et de ligne de vue doivent être vérifiées avant les tirs.',
'Les effets de tir modifient éventuellement VOF/PDF et donc l’état tactique de la carte.',
'Lorsqu’une carte est modifiée, mets à jour les marqueurs concernés conformément à la règle générale.',
'Après résolution de toutes les actions AT et véhicules, passe au Mutual Combat Phase.',
'Le site affiche ici les tables de référence nécessaires mais ne te demande aucun numéro de carte Action.'
])}<div class="decision"><button class="btn primary" onclick="nextStep('3.6 résolue')">Phase résolue →</button></div>`}
function contactStep(){
  const pc=state.contact?.pc||'A';
  const act=state.activity;
  const row=pcRows.find(r=>r[0]===pc);
  const idx={'No Contact':1,'Contact':2,'Engaged':3,'Heavily Engaged':4}[act];
  const draw=row[idx];
  const auto=draw==='Auto';
  const resolved=state.contact?.resolved;
  let result='';
  if(resolved==='no') result=`<div class="alert"><b>Aucun contact.</b> Retire le PC marker et poursuis la résolution du prochain PC marker conformément à 8.2.4.</div><div class="decision"><button class="btn primary" onclick="finishContact('No Contact')">PC résolu →</button></div>`;
  else if(resolved==='yes') result=packageResolution(pc);
  else result=`<div class="decision"><button class="btn primary" onclick="setContact('yes')">Oui — Contact</button><button class="btn ghost" onclick="setContact('no')">Non — pas de Contact</button></div>`;
  return `<div class="details"><div class="side-title">Déroulement précis — 3.7.2 Potential Contact Evaluation</div><ol>
  <li>Examine chaque carte qui contient à la fois un PC marker et une unité amie.</li>
  <li>Si plusieurs PC markers doivent être résolus, traite les lettres dans l’ordre A, puis B, puis C ; les marqueurs de même lettre sont traités dans un ordre aléatoire.</li>
  <li>Si un marker est sur sa face « ? », révèle-le avant de le résoudre, sauf lorsqu’il sert à marquer une unité ennemie Unspotted.</li>
  <li>Identifie la lettre du PC marker : A représente la menace la plus forte et C la plus faible.</li>
  <li>Regarde le Current Activity Level actuel de la carte/du jeu.</li>
  <li>Utilise la Potential Contact Draw Chart affichée ci-dessous.</li>
  <li>Une valeur « Auto » signifie que le Contact est automatique.</li>
  <li>Une valeur numérique indique combien de cartes Action doivent être tirées physiquement.</li>
  <li>Le site ne te demande jamais le numéro de ces cartes et ne te demande jamais de saisir leur numéro.</li>
  <li>Tu regardes simplement si l’une des cartes tirées contient le mot « Contact » dans sa zone supérieure.</li>
  <li>Si au moins une carte porte « Contact », le Contact est établi ; sinon il n’y a pas de Contact.</li>
  <li>Dans les deux cas, retire le PC marker après sa résolution.</li>
  <li>Si un Contact est établi, utilise ensuite la table German Contact Packages de la mission.</li>
  <li>Le R# du tirage est lu directement sur ta carte physique et sert à repérer le package dans la table affichée ; aucune saisie du numéro de carte n’est nécessaire.</li>
  <li>Utilise ensuite la table Unit Placement pour déterminer la direction de placement.</li>
  <li>Après l’apparition des forces ennemies, mets immédiatement à jour le Current Activity Level lorsque la règle l’impose.</li>
  <li>La résolution d’un PC peut donc modifier la résolution des PC suivants du même segment.</li>
  <li>Quand tous les PC applicables ont été traités, passe au Pinned Recovery Segment.</li>
</ol></div>
<div class="card nested"><div class="step-title" style="font-size:18px">Potential Contact</div><p class="instruction">PC marker <b>${pc}</b> · Current Activity Level <b>${act}</b></p><div class="table-wrap"><table class="rule-table"><thead><tr><th>PC</th><th>No Contact</th><th>Contact</th><th>Engaged</th><th>Heavily Engaged</th></tr></thead><tbody>${pcRows.map(r=>`<tr>${r.map((c,i)=>`<td class="${i===0||r[0]===pc?'hl':''}">${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div><div class="alert"><span class="small">Résultat de la table</span><div class="number">${auto?'AUTO CONTACT':draw+' cartes Action'}</div><div>${auto?'Le Contact est automatique.':'Tire physiquement '+draw+' cartes ; aucune saisie de numéro n’est demandée.'}</div></div>${result}</div>`;
}
function setContact(value){state.contact=state.contact||{};state.contact.resolved=value;render()}
function updatePCContext(v){state.contact={pc:v};render()}
function updateActivity(v){state.activity=v;state.contact=state.contact||{};state.contact.pc=state.contact.pc||'A';render()}
function packageResolution(pc){return `<div class="card nested"><div class="side-title">German Contact Packages — PC ${pc}</div><p class="instruction">Le tirage physique fournit un <b>R# /10</b>. Ne saisis pas le numéro de la carte Action : lis simplement le R# sur la carte et consulte directement la table ci-dessous.</p><div class="table-wrap"><table class="rule-table"><thead><tr><th>Package</th><th>R# PC ${pc}</th><th>Description</th></tr></thead><tbody>${packageTableRows(pc).join('')}</tbody></table></div><div class="side-title" style="margin-top:18px">Unit Placement</div><div class="table-wrap"><table class="rule-table"><thead><tr><th>R#</th><th>Direction</th></tr></thead><tbody>${LOCATION_ROWS.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join('')}</tbody></table></div><div class="alert"><b>Procédure :</b> lis le R# /10 du tirage physique dans la table PC ${pc}, puis lis le R# /8 de placement dans la table Unit Placement. Aucun de ces résultats n’est saisi dans le site.</div><div class="decision"><button class="btn primary" onclick="finishContact('Contact résolu — package/localisation consultés')">Contact résolu →</button></div></div>`}
function packageTableRows(pc){const rows=CONTACT_DATA[state.mission]?.map?.[pc]||[];const used=new Set(rows.map(e=>e[1]));return [...used].sort((a,b)=>a-b).map(n=>{const e=rows.find(x=>x[1]===n);const rr=e.length>2?`${e[0]}–${e[e.length-1]}`:`${e[0]}`;return `<tr><td>${n}</td><td>${rr}/10</td><td>${esc(CONTACT_DATA[state.mission].packages[n]||'Package')}</td></tr>`})}
function phase38(){return `<p class="instruction"><b>3.8 Clean Up Phase</b> — nettoie l’état de la carte, prépare le tour suivant et remet la séquence au début.</p>${sequenceDetails('3.8 Clean Up Phase',[
'Retire les marqueurs Exposed selon la procédure de Clean Up.',
'Récupère et réinitialise les marqueurs de Commands selon les règles du Command Track.',
'Les Commands sauvegardés sont reportés selon les limites de l’Experience Level et de la Visibility.',
'Applique les autres effets de nettoyage indiqués par les règles ou par la mission.',
'Vérifie les marqueurs qui doivent être retirés ou retournés à leur état normal.',
'Le Clean Up est le moment où les effets différés qui doivent être résolus en fin de tour sont traités.',
'La règle générale précise que PDF et VOF ne sont pas mis à jour pendant le Combat Effects Segment ; ils peuvent être ajustés lors du Clean Up.',
'Après le nettoyage, avance le Turn marker d’un tour.',
'Si ce n’était pas le dernier tour, recommence la séquence au début du tour suivant.',
'Si le dernier tour est atteint sans objectifs accomplis, vérifie les règles de Reattempt de la mission.',
'Le site doit conserver le numéro du tour et l’état de la séquence, mais ne nécessite aucune saisie de numéro de carte Action.',
'La progression de la partie reste ainsi centrée sur les tables et décisions réellement nécessaires.'
])}<div class="decision"><button class="btn primary" onclick="nextStep('3.8 résolue')">Terminer le tour →</button></div>`}
function nextStep(note){state.history.unshift(`Tour ${state.turn} · ${note}`);if(state.phase<phases.length-1)state.phase++;else{state.phase=0;state.turn++;}state.action=null;state.contact=null;render()}

function statePanel(m){return `<div class="card side-card"><div class="side-title">État de la partie</div><div class="state-row"><span>Activity Level</span><span class="pill accent">${state.activity}</span></div><div class="state-row"><span>Mission</span><span>${state.mission}</span></div><div class="state-row"><span>Visibilité</span><span>${esc(m.vis)}</span></div><div class="state-row"><span>Tactiques ennemies</span><span>${esc(m.tactics)}</span></div><div class="state-row"><span>Enemy Experience</span><span>${esc(m.exp)}</span></div></div><div class="card side-card"><div class="side-title">Historique</div><div class="log">${state.history.slice(0,8).map(x=>`<div class="log-item">${esc(x)}</div>`).join('')||'<div class="small">Aucune action enregistrée.</div>'}</div></div>`}
function tablesPanel(){return `<div class="card side-card"><div class="side-title">Table disponible</div><h3>Command Draw Modifiers</h3><div class="table-wrap"><table class="rule-table"><thead><tr><th>Condition</th><th>Mod.</th></tr></thead><tbody>${cmdRows.map(r=>`<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td></tr>`).join('')}</tbody></table></div><div class="note">Minimum résultant : 1 si Activated, 0 si Initiative.</div></div><div class="card side-card"><div class="side-title">Potential Contact Draw</div><div class="table-wrap"><table class="rule-table"><thead><tr><th>PC</th><th>No Contact</th><th>Contact</th><th>Engaged</th><th>Heavily</th></tr></thead><tbody>${pcRows.map(r=>`<tr>${r.map((c,i)=>`<td class="${i===0?'hl':''}">${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div>`}
function startGame(){state={screen:'game',mission:Number(document.getElementById('mission').value),turn:1,phase:0,step:0,activity:'No Contact',action:null,history:[]};render()}
render();

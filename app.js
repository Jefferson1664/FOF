const APP_VERSION='0.4.3';
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
const HQ_EVENTS={
1:{columns:['Turns 2-6','Turns 7-10'],rows:[['Situation Report: CO HQ must spend its first 3 Commands to send a report to the battalion.*','1/10','1/10'],['Comm Trouble: BN HQ does not Activate CO HQ this turn. CO HQ must spend its first 2 Commands to re-establish communications.*','2/10','2/10'],['Artillery Displacing: 15th Field Artillery Battalion is unavailable this turn.','3/10','3/10'],['Checking Up: Randomly select 1 higher HQ Staff and place their counter on the same card as the CO HQ. They will remain on the map for 2 turns. BN HQ is now considered to be "on the map" (4.1.1).','4/10','4/10'],['Trouble on the Flank: No unit may move forwards to a new row (one further forward than the current lead US unit) this turn.','5/10','5/10'],['Company on the Flank is Ahead: You must move at least one unit forward to a new row (one further forward than the current lead US unit) this turn to close the gap. (Ignore if already on Row 3).*','6/10','6/10'],['Battalion is Screaming for Action: You must move at least one unit forward to a new row (one further forward than the current lead US unit) with a PC marker this turn. (Ignore if already on Row 3 or no PC markers can be reached).*','7-8/10','7/10'],['Ammo Resupply: Place four of any one type of ammo on any card of your choice on Row 1.','9-10/10','8-10/10']]},
2:{columns:['Turns 2-6','Turns 7-10'],rows:[['Situation Report: CO HQ must spend its first 3 Commands to send a report to the battalion.*','1/10','1/10'],['Comm Trouble: BN HQ does not Activate CO HQ this turn. CO HQ must spend its first 2 Commands to re-establish communications.*','2/10','2/10'],['Artillery Displacing: 15th Field Artillery Battalion is unavailable this turn.','3/10','3/10'],['Checking Up: Randomly select 1 higher HQ Staff and place their counter on the same card as the CO HQ. They will remain on the map for 2 turns. BN HQ is now considered to be “on the map” (4.1.1).','4/10','4/10'],['Trouble on the Flank: No unit may move forwards to a new row (one further forward than the current lead US unit) this turn.','5/10','5/10'],['Company on the Flank is Ahead: You must move at least one unit forward to a new row (one further forward than the current lead US unit) this turn to close the gap. (Ignore if already on Row 5).*','6/10','6/10'],['Battalion is Screaming for Action: You must move at least one unit forward to a new row (one further forward than the current lead US unit) with a PC Marker this turn. (Ignore if already on Row 5 or no PC markers can be reached).*','7-8/10','7/10'],['Ammo Resupply: Place four of any one type of ammo on any card of your choice on Row 1.','9-10/10','8-10/10']]},
3:{columns:['Turns 2-6','Turns 7-10'],rows:[['Comm Trouble: BN HQ does not Activate CO HQ this turn. CO HQ must spend its first 2 Commands to re-establish communications.*','1-2/10','1-3/10'],['Lost in the Dark: Randomly select one unit from the patrol, move it one card in a randomly selected direction, and mark the unit Exposed. If the unit leaves the map boundaries, place a new card and a PC Marker for that Row (or an A marker for Row 5).','3-4/10','4/10'],['Hold up!: No unit may move to an unoccupied card this turn.','5-6/10','5-6/10'],['It’s Raining: Place a Rain marker. Visibility is modified by +2 this turn (Limited Visibility applies - 9.1). Remove at the end of the turn.','7/10','7/10'],['Mortar Platoon Displacing: Battalion Mortar Platoon is unavailable this turn.','8/10','8-9/10'],['CO HQ is Screaming for Action: You must move at least one unit towards the next waypoint this turn. (Ignore if all four waypoints have already been visited).*','9-10/10','10/10']]},
4:{columns:['Turns 2-6','Turns 7-10'],rows:[['Situation Report: CO HQ must spend its first 3 Commands to send a report to the battalion.*','1-2/10','1/10'],['Comm Trouble: BN HQ does not Activate CO HQ this turn. CO HQ must spend its first 2 Commands to re-establish communications.*','3/10','2/10'],['Artillery Displacing: 15th Field Artillery Battalion is unavailable this turn.','4/10','3/10'],['Checking Up: Randomly select 1 higher HQ Staff and place their counter on the same card as the CO HQ. They will remain on the map for 2 turns. BN HQ is now considered to be “on the map” (4.1.1).','5/10','4/10'],['Trouble on the Flank: No unit may move forwards to a new row (one further forward than the current lead US unit) this turn.','6/10','5/10'],['Company on the Flank is Ahead: You must move at least one unit forward to a new row (one further forward than the current lead US unit) this turn to close the gap. (Ignore if already on Row 4).*','7/10','6/10'],['Battalion is Screaming for Action: You must move at least one unit forward to a new row (one further forward than the current lead US unit) with a PC Marker this turn. (Ignore if already on Row 4 or no PC markers can be reached).*','8/10','7/10'],['Rgt Cannon Company Displacing: Regimental Cannon Company is unavailable this turn.','9/10','8/10'],['Mortar Platoon Displacing: Battalion Mortar Platoon is unavailable this turn.','10/10','9/10'],['Ammo Resupply: Place four of any one type of ammo on any card of your choice on Row 1.','-','10/10']]},
5:{columns:['Turns 2-6','Turns 7-10'],rows:[['Comm Trouble: BN HQ does not Activate CO HQ this turn. CO HQ must spend its first 2 Commands to re-establish communications.*','1-2/10','1-3/10'],['Lost in the Dark: Randomly select one unit from the patrol, move it one card in a randomly selected direction, and mark the unit Exposed. If the unit leaves the map boundaries, place a new card and a PC Marker for that Row (or an A marker for Row 5).','3-4/10','4/10'],['Hold up!: No unit may move to an unoccupied card this turn.','5-6/10','5-6/10'],['It’s Raining: Place a Rain marker. Visibility is modified by +2 this turn (Limited Visibility applies - 9.1). Remove at the end of the turn.','7/10','7/10'],['Mortar Platoon Displacing: Battalion Mortar Platoon is unavailable this turn.','8/10','8-9/10'],['CO HQ is Screaming for Action: You must move at least one unit towards the next waypoint this turn. (Ignore if all four waypoints have already been visited).*','9-10/10','10/10']]},
6:{columns:['Turns 2-6','Turns 7-10'],rows:[['Situation Report: CO HQ must spend its first 3 Commands to send a report to the battalion.*','1-2/10','1/10'],['Comm Trouble: BN HQ does not Activate CO HQ this turn. CO HQ must spend its first 2 Commands to re-establish communications.*','3/10','2/10'],['Tank Support: Enter a tank platoon (4 tanks + tank HQ) of M5s on to any cards of your choice on Row 1. Each has 5 ammo.','4/10','3/10'],['Checking Up: Randomly select 1 higher HQ Staff and place their counter on the same card as the CO HQ. They will remain on the map for 2 turns. BN HQ is now considered to be “on the map” (4.1.1).','5/10','4/10'],['Trouble on the Flank: No unit may move forwards to a new row (one further forward than the current lead US unit) this turn.','6/10','5/10'],['Company on the Flank is Ahead: You must move at least one unit forward to a new row (one further forward than the current lead US unit) this turn to close the gap. (Ignore if already on Row 5).*','7/10','6/10'],['Battalion is Screaming for Action: You must move at least one unit forward to a new row (one further forward than the current lead US unit) with a PC Marker this turn. (Ignore if already on Row 5 or no PC markers can be reached).*','8/10','7/10'],['Rgt Cannon Company Displacing: Regimental Cannon Company is unavailable this turn.','9/10','8/10'],['Mortar Platoon Displacing: Battalion Mortar Platoon is unavailable this turn.','10/10','9/10'],['Ammo Resupply: Place four of any one type of ammo on any card of your choice on Row 1.','-','10/10']]},
7:{columns:['Turns 2-6','Turns 7-10'],rows:[['Situation Report: CO HQ must spend its first 3 Commands to send a report to the battalion.*','1-2/10','1/10'],['Comm Trouble: BN HQ does not Activate CO HQ this turn. CO HQ must spend its first 2 Commands to re-establish communications.*','3/10','2/10'],['Tank Support: Enter a tank platoon (4 tanks + tank HQ) of M5s on to any cards of your choice on Row 1. Each has 5 ammo.','4/10','3/10'],['Checking Up: Randomly select 1 higher HQ Staff and place their counter on the same card as the CO HQ. They will remain on the map for 2 turns. BN HQ is now considered to be “on the map” (4.1.1).','5/10','4/10'],['Trouble on the Flank: No unit may move forwards to a new row (one further forward than the current lead US unit) this turn.','6/10','5/10'],['Company on the Flank is Ahead: You must move at least one unit forward to a new row (one further forward than the current lead US unit) this turn to close the gap. (Ignore if already on Row 6).*','7/10','6/10'],['Battalion is Screaming for Action: You must move at least one unit forward to a new row (one further forward than the current lead US unit) with a PC Marker this turn. (Ignore if already on Row 6 or no PC markers can be reached).*','8/10','7/10'],['Artillery Displacing: 15th Field Artillery Battalion is unavailable this turn.','9/10','8/10'],['Mortar Platoon Displacing: Battalion Mortar Platoon is unavailable this turn.','10/10','9/10'],['Ammo Resupply: Place four of any one type of ammo on any card of your choice on Row 1.','-','10/10']]}
};
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
let state={screen:'setup',mission:null,turn:1,phase:0,step:0,activity:'No Contact',action:null,history:[],combatStep:1,contact:null};
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
function render(){document.getElementById('app').innerHTML=state.screen==='setup'?setup():game();}
function setup(){return `<div class="shell"><aside class="side"><div class="brand">GMT / LOCAL TOOL<span>FIELDS OF FIRE</span></div><div class="campaign"><label>Campaign</label><select><option>Normandy — 9th Infantry Regiment</option></select></div><div class="nav"><div class="nav-item active">Nouvelle partie<small>Choisir une mission</small></div></div></aside><main class="content"><div class="setup"><div class="card"><div class="eyebrow">Local Turn Assistant</div><h1>Fields of Fire</h1><p class="sub">Assistant de séquence de jeu — basé sur les documents du projet.</p><div class="field"><label>Campagne</label><select id="camp"><option value="normandy">Normandy — 9th Infantry Regiment</option></select></div><div class="field"><label>Mission / scénario</label><select id="mission">${Object.entries(MISSIONS).map(([k,m])=>`<option value="${k}">Mission ${k} — ${esc(m.title)}</option>`).join('')}</select></div><button class="btn primary" onclick="startGame()">Commencer la partie</button><div class="version-badge">Version ${APP_VERSION}</div><div class="alert">La première version utilise la campagne Normandy et son architecture de missions. Les données de mission sont séparées du moteur afin d'ajouter ensuite les autres campagnes sans modifier le cœur de l'application.</div></div></div></main></div>`}
function game(){const m=MISSIONS[state.mission];const phase=phases[state.phase];return `<div class="shell"><aside class="side"><div class="brand">GMT / LOCAL TOOL<span>FIELDS OF FIRE</span></div><div class="campaign"><label>Campagne</label><div class="pill accent">Normandy</div></div><div class="nav"><div class="nav-item active">${esc(m.title)}<small>Mission ${state.mission}</small></div>${phases.map((p,i)=>`<div class="nav-item ${i===state.phase?'active':''}">${p[0]} ${p[1]}</div>`).join('')}</div></aside><main class="content"><div class="top"><div><div class="eyebrow">Normandy · Mission ${state.mission}</div><h1>${esc(m.title)}</h1><div class="sub">${m.type} · ${m.turns} tours · ${m.vis}</div></div><div class="turnbox">Tour <strong>${state.turn}</strong> / ${m.turns}<div class="progress"><i style="width:${Math.min(100,state.turn/m.turns*100)}%"></i></div></div></div><div class="grid"><section>${stepPanel(m,phase)}</section><aside>${statePanel(m)}</aside></div><div class="footer">Version ${APP_VERSION} · Références principales : Series Rules 3rd Edition, Errata & Clarifications May 10 2025, Normandy Mission Book, Player Aids.</div></main></div>`}
function stepPanel(m,phase){
  let body='';
  if(state.phase===0){body=phase31();}
  else if(state.phase===1){body=phase32();}
  else if(state.phase===2){body=commandStep();}
  else if(state.phase===3){body=phase34();}
  else if(state.phase===4){body=phase35();}
  else if(state.phase===5){body=phase36();}
  else if(state.phase===6){body=mutualCombatStep();}
  else if(state.phase===7){body=phase38();}
  return `<div class="card"><div class="step"><div class="kicker">${phase[0]}</div><div class="step-title">${esc(phase[1])}</div><div class="small">Tour ${state.turn}</div></div>${body}<div class="note">${esc(m.special)}</div></div>`;
}
function sequenceDetails(title,lines){return `<div class="details"><div class="side-title">Déroulement précis — ${esc(title)}</div><ol>${lines.map(x=>`<li>${x}</li>`).join('')}</ol></div>`}
function phase31(){
  const hq=state.hqEvent;
  const table=HQ_EVENTS[state.mission];
  let eventBody='';
  if(hq?.resolved==='yes'){
    eventBody=`<div class="alert"><b>Événement HQ détecté.</b> Utilise le R# de la carte Action physique dans la table de la mission ${state.mission}. Le site ne demande jamais de saisir le numéro de la carte.</div>
    <div class="table-wrap"><table class="rule-table"><thead><tr><th>Friendly Higher HQ Event</th><th>${table.columns[0]}</th><th>${table.columns[1]}</th></tr></thead><tbody>${table.rows.map(r=>`<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td></tr>`).join('')}</tbody></table></div>
    <div class="details"><div class="side-title">Résolution</div><ol><li>Lis le R# directement sur la carte Action que tu viens de tirer.</li><li>Repère ce R# dans la colonne correspondant au tour actuel.</li><li>Applique exactement l'événement indiqué dans la ligne correspondante.</li><li>Si l'événement comporte une condition, une limite ou un gain d'Experience Point, applique-la telle qu'indiquée.</li><li>Lorsque l'événement est entièrement résolu, passe à la phase suivante.</li></ol></div>
    <div class="decision"><button class="btn primary" onclick="resolveHQEvent()">Événement HQ résolu → phase suivante</button></div>`;
  } else if(hq?.resolved==='no'){
    eventBody=`<div class="alert"><b>Aucun événement Friendly Higher HQ.</b> La carte Action ne présente pas l'icône HQ. Passe à la phase suivante.</div><div class="decision"><button class="btn primary" onclick="resolveHQEvent()">Passer à la phase suivante →</button></div>`;
  } else {
    eventBody=`<div class="decision"><button class="btn primary" onclick="setHQEvent('yes')">Oui — icône HQ présente</button><button class="btn ghost" onclick="setHQEvent('no')">Non — pas d'icône HQ</button></div>`;
  }
  return `<p class="instruction"><b>Friendly Higher HQ Event Phase</b> — à partir du Tour 2. Tire physiquement une carte Action et vérifie la présence de l'icône HQ. Si l'icône est présente, la table Friendly Higher HQ Events propre à la mission apparaît automatiquement.</p>${sequenceDetails('3.1 Friendly Higher HQ Event Phase',[
'Cette phase commence au Tour 2 ; au Tour 1, elle est ignorée.',
'Tire une Action Card physiquement ; le site ne demande jamais son numéro.',
'Vérifie si l’icône HQ est présente sur la carte.',
'Si l’icône HQ n’est pas présente, aucun Friendly Higher HQ Event n’est déterminé et tu passes à la phase suivante.',
'Si l’icône HQ est présente, sélectionne « Oui — icône HQ présente » ci-dessous.',
'Le site affiche alors uniquement la Friendly Higher HQ Events Table correspondant à la mission choisie.',
'Lis le R# directement sur la carte physique et utilise la colonne correspondant au tour actuel.',
'Ne saisis ni le numéro de la carte Action ni son R# dans le site.',
'Applique exactement l’événement indiqué par la ligne correspondant au R#.',
'Les événements de mission peuvent différer entre les missions offensives et les Combat Patrols.',
'Les plages de R# peuvent également changer entre les Tours 2-6 et 7-10 ; utilise toujours la bonne colonne.',
'Après résolution complète de l’événement, passe à la phase suivante de la séquence.',
'Le tableau affiché provient du livret de campagne Normandy correspondant à la mission sélectionnée.',
'La règle générale de 3.1 impose le tirage d’une Action Card et la vérification de l’icône HQ avant de déterminer l’événement.'
])}${eventBody}`;
}
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
function mutualCombatStep(){
  if(state.combatStep===1) return phase371();
  if(state.combatStep===2) return contactStep();
  if(state.combatStep===3) return phase373();
  return phase374();
}
function phase371(){return `<p class="instruction"><b>3.7.1 Fire Mission Update Segment</b> — mets à jour les Fire Mission markers avant d'évaluer les Potential Contacts.</p>${sequenceDetails('3.7.1 Fire Mission Update Segment',[
'Cette séquence ouvre le Mutual Combat Phase.',
'Retire les marqueurs Incoming! et Air Strike! existants conformément à la procédure.',
'Retourne les Pending markers sur leur face active lorsque la règle l’impose.',
'Mets à jour le Current Activity Level avant de poursuivre.',
'Cette mise à jour intervient avant le Potential Contact Evaluation Segment.',
'Ne résous pas encore les effets de combat : ils appartiennent au Combat Effects Segment.',
'Le but est de présenter un état de carte correct avant les évaluations de contact.',
'Les marqueurs VOF/PDF déjà présents restent ceux de l’état de jeu jusqu’aux étapes où leur mise à jour est autorisée.',
'Vérifie les éventuelles instructions particulières du scénario avant de continuer.',
'Le site ne demande aucun numéro de carte Action.',
'Lorsque cette mise à jour est terminée, passe à 3.7.2 Potential Contact Evaluation.',
'La table suivante ne doit être utilisée que si la situation de jeu exige une valeur d’Activity Level ou une autre table spécifique.'
])}<div class="decision"><button class="btn primary" onclick="nextCombatStep('3.7.1 résolue')">Passer à 3.7.2 →</button></div>`}
function contactStep(){
  const pc=state.contact?.pc||'A';
  const act=state.activity;
  const row=pcRows.find(r=>r[0]===pc);
  const idx={'No Contact':1,'Contact':2,'Engaged':3,'Heavily Engaged':4}[act];
  const draw=row[idx];
  const auto=draw==='Auto';
  const resolved=state.contact?.resolved;
  let result='';
  if(resolved==='no') result=`<div class="alert"><b>Aucun contact.</b> Retire le PC marker. La résolution de 3.7.2 est terminée.</div><div class="decision"><button class="btn primary" onclick="nextCombatStep('3.7.2 résolue — No Contact')">Passer à 3.7.3 →</button></div>`;
  else if(resolved==='yes') result=packageResolution(pc);
  else result=`<div class="decision"><button class="btn primary" onclick="setContact('yes')">Oui — Contact</button><button class="btn ghost" onclick="setContact('no')">Non — pas de Contact</button></div>`;
  return `<div class="details"><div class="side-title">Déroulement précis — 3.7.2 Potential Contact Evaluation</div><ol>
  <li>Examine chaque carte qui contient à la fois un PC marker et une unité amie.</li>
  <li>Si plusieurs PC markers doivent être résolus, traite les lettres dans l’ordre A, puis B, puis C ; les marqueurs de même lettre sont traités dans un ordre aléatoire.</li>
  <li>Si un marker est sur sa face « ? », révèle-le avant de le résoudre, sauf lorsqu’il sert à marquer une unité ennemie Unspotted.</li>
  <li>Choisis ci-dessous la lettre du PC marker actuellement résolu : A, B ou C.</li>
  <li>Regarde le Current Activity Level actuel.</li>
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
  <li>Quand la résolution du PC considéré est terminée, passe au Pinned Recovery Segment.</li>
</ol></div>
<div class="card nested"><div class="step-title" style="font-size:18px">Potential Contact</div>
<div class="calc"><div class="field"><label>PC marker à résoudre</label><select onchange="updatePCContext(this.value)"><option value="A" ${pc==='A'?'selected':''}>A</option><option value="B" ${pc==='B'?'selected':''}>B</option><option value="C" ${pc==='C'?'selected':''}>C</option></select></div><div class="field"><label>Current Activity Level</label><select onchange="updateActivity(this.value)">${['No Contact','Contact','Engaged','Heavily Engaged'].map(v=>`<option ${act===v?'selected':''}>${v}</option>`).join('')}</select></div></div>
<p class="instruction">PC marker <b>${pc}</b> · Current Activity Level <b>${act}</b></p><div class="table-wrap"><table class="rule-table"><thead><tr><th>PC</th><th>No Contact</th><th>Contact</th><th>Engaged</th><th>Heavily Engaged</th></tr></thead><tbody>${pcRows.map(r=>`<tr>${r.map((c,i)=>`<td class="${r[0]===pc?'hl':''}">${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div><div class="alert"><span class="small">Résultat de la table</span><div class="number">${auto?'AUTO CONTACT':draw+' cartes Action'}</div><div>${auto?'Le Contact est automatique.':'Tire physiquement '+draw+' cartes ; aucune saisie de numéro n’est demandée.'}</div></div>${result}</div>`;
}
function packageResolution(pc){
  const missionData=CONTACT_DATA[state.mission]||{packages:{},map:{}};
  const rows=missionData.map?.[pc]||[];
  const packageRows=[...new Set(rows.map(e=>e[1]))].sort((a,b)=>a-b).map(n=>{
    const entries=rows.filter(e=>e[1]===n);
    const ranges=entries.map(e=>e.length>2?`${e[0]}–${e[e.length-1]}`:`${e[0]}`).join(', ');
    return `<tr><td>${n}</td><td>${esc(ranges)}/10</td><td>${esc(missionData.packages[n]||'Package')}</td></tr>`;
  }).join('');
  const locationRows=LOCATION_ROWS.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join('');
  return `<div class="contact-resolution">
    <div class="alert"><b>Contact établi.</b> Le PC marker ${pc} est résolu. Ne saisis aucun numéro de carte Action.</div>
    <div class="details"><div class="side-title">German Contact Packages — Mission ${state.mission} · PC ${pc}</div>
      <ol>
        <li>Prends la carte Action physique que tu viens de tirer pour déterminer le type de Contact.</li>
        <li>Lis son R# directement sur la carte.</li>
        <li>Repère cette valeur dans la table ci-dessous ; le site ne te demande pas de saisir ce R#.</li>
        <li>Applique le package correspondant à la ligne trouvée.</li>
        <li>Si le package indique des unités, des Mines, du Incoming! ou un autre effet, applique-le selon les règles de la mission.</li>
        <li>Lorsque le placement d'une unité ennemie est requis, utilise ensuite la table Unit Placement.</li>
        <li>Le placement et les effets éventuels sont résolus avant de poursuivre la séquence.</li>
        <li>Après avoir terminé la résolution de ce Contact, retire le PC marker.</li>
        <li>Le Current Activity Level doit être mis à jour immédiatement lorsque l'apparition des forces ennemies l'exige.</li>
        <li>Cette résolution ne demande aucune saisie du numéro de la carte Action.</li>
      </ol>
      <div class="table-wrap"><table class="rule-table"><thead><tr><th>Package</th><th>R#</th><th>Contenu</th></tr></thead><tbody>${packageRows}</tbody></table></div>
    </div>
    <div class="details"><div class="side-title">Unit Placement</div>
      <div class="table-wrap"><table class="rule-table"><thead><tr><th>R#</th><th>Placement</th></tr></thead><tbody>${locationRows}</tbody></table></div>
      <p class="small">Lis le R# de la carte physique et applique la direction correspondante lorsque le package demande un placement.</p>
    </div>
    <div class="decision"><button class="btn primary" onclick="nextCombatStep('3.7.2 résolue — Contact')">Contact résolu → 3.7.3</button></div>
  </div>`;
}
function phase373(){return `<p class="instruction"><b>3.7.3 Pinned Recovery Segment</b> — retire les Pinned markers qui peuvent être retirés avant le Combat Effects Segment.</p>${sequenceDetails('3.7.3 Pinned Recovery Segment',[
'Après le Potential Contact Evaluation Segment, passe au Pinned Recovery Segment.',
'Retire les Pinned markers des unités de véhicule ou d’infanterie qui ne sont pas sous un VOF marker.',
'Les Mines sont également concernées, qu’elles soient activées ou non.',
'Ne retire pas un Pinned marker qui reste soumis à un VOF marker.',
'Cette étape ne demande aucun tirage de carte Action.',
'Vérifie chaque unité concernée avant de modifier son statut.',
'Ne mets pas encore à jour les effets simultanés du Combat Effects Segment.',
'Une fois les récupérations terminées, passe au Combat Effects Segment.',
'Le site ne demande aucune saisie de numéro de carte Action.',
'Cette étape constitue la transition entre l’évaluation des contacts et la résolution des effets de combat.'
])}<div class="decision"><button class="btn primary" onclick="nextCombatStep('3.7.3 résolue')">Passer à 3.7.4 →</button></div>`}
function phase374(){return `<p class="instruction"><b>3.7.4 Combat Effects Segment</b> — résous les effets de combat simultanément, carte par carte, sans mettre à jour PDF/VOF avant le Clean Up.</p>${sequenceDetails('3.7.4 Combat Effects Segment',[
'Les effets de combat sont considérés comme simultanés.',
'Résous chaque carte dans l’ordre de ton choix.',
'Ne mets pas à jour PDF ou VOF pendant ce segment ; attends le Clean Up lorsque la règle l’exige.',
'Pour chaque unité d’infanterie sous un VOF marker, résous les attaques de Flamethrower lorsqu’elles sont applicables.',
'Détermine ensuite le NCM de l’unité concernée.',
'Tire physiquement une carte Action pour déterminer si le feu est efficace lorsque la règle le demande.',
'En cas de Hit, tire la carte nécessaire pour déterminer l’effet du Hit.',
'Applique les effets aux unités et aux marqueurs selon les règles de Combat Effects.',
'Verifie les cas particuliers des unités, armes, véhicules et supports présents sur la carte.',
'Le site ne demande jamais le numéro des cartes Action utilisées pour ces tirages.',
'Quand toutes les cartes ont été résolues, termine 3.7.',
'La séquence suivante est alors 3.8 Clean Up Phase.'
])}<div class="decision"><button class="btn primary" onclick="nextStep('3.7 Mutual Combat résolue')">Passer à 3.8 →</button></div>`}
function nextCombatStep(note){state.history.unshift(`Tour ${state.turn} · ${note}`);state.combatStep++;state.contact=null;render()}
function setHQEvent(value){state.hqEvent=state.hqEvent||{};state.hqEvent.resolved=value;render()}
function resolveHQEvent(){state.hqEvent=null;nextStep('3.1 résolue')}
function setContact(value){state.contact=state.contact||{};state.contact.resolved=value;render()}
function updatePCContext(v){state.contact={pc:v};render()}
function updateActivity(v){state.activity=v;state.contact=state.contact||{};state.contact.pc=state.contact.pc||'A';render()}
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
function nextStep(note){state.history.unshift(`Tour ${state.turn} · ${note}`);if(state.phase<phases.length-1)state.phase++;else{state.phase=0;state.turn++;}state.action=null;state.contact=null;state.hqEvent=null;state.combatStep=1;render()}

function statePanel(m){return `<div class="card side-card"><div class="side-title">État de la partie</div><div class="state-row"><span>Activity Level</span><span class="pill accent">${state.activity}</span></div><div class="state-row"><span>Mission</span><span>${state.mission}</span></div><div class="state-row"><span>Visibilité</span><span>${esc(m.vis)}</span></div><div class="state-row"><span>Tactiques ennemies</span><span>${esc(m.tactics)}</span></div><div class="state-row"><span>Enemy Experience</span><span>${esc(m.exp)}</span></div></div><div class="card side-card"><div class="side-title">Historique</div><div class="log">${state.history.slice(0,8).map(x=>`<div class="log-item">${esc(x)}</div>`).join('')||'<div class="small">Aucune action enregistrée.</div>'}</div></div>`}
function tablesPanel(){return `<div class="card side-card"><div class="side-title">Table disponible</div><h3>Command Draw Modifiers</h3><div class="table-wrap"><table class="rule-table"><thead><tr><th>Condition</th><th>Mod.</th></tr></thead><tbody>${cmdRows.map(r=>`<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td></tr>`).join('')}</tbody></table></div><div class="note">Minimum résultant : 1 si Activated, 0 si Initiative.</div></div><div class="card side-card"><div class="side-title">Potential Contact Draw</div><div class="table-wrap"><table class="rule-table"><thead><tr><th>PC</th><th>No Contact</th><th>Contact</th><th>Engaged</th><th>Heavily</th></tr></thead><tbody>${pcRows.map(r=>`<tr>${r.map((c,i)=>`<td class="${i===0?'hl':''}">${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div>`}
function startGame(){state={screen:'game',mission:Number(document.getElementById('mission').value),turn:1,phase:0,step:0,activity:'No Contact',action:null,history:[],combatStep:1,contact:null,hqEvent:null};render()}
render();

(() => {
  const starterNames = ["Yangan","Pagaran","Salcedo","Fortallio","Abuzo","Ledesma","Arias","Abrio","Intia","Amora","Cabalang","Labial, L.","Gulapo, C.","Naluan","Alaba","Miculob"];
  const $ = id => document.getElementById(id);
  const state = { names: loadNames(), picked: [], history: [], groups: [], groupSize: 4, chosenGroup: -1, music: false, sfx: true, audio: null, musicTimer: null };
  function loadNames(){ try { const saved=JSON.parse(localStorage.getItem("littleForestNames")); if(Array.isArray(saved)) return saved.filter(x=>typeof x==="string"&&x.trim()); } catch(e){} return [...starterNames]; }
  function save(){ try{localStorage.setItem("littleForestNames",JSON.stringify(state.names));localStorage.setItem("littleForestPicked",JSON.stringify(state.picked));}catch(e){} }
  try { const p=JSON.parse(localStorage.getItem("littleForestPicked")||"[]"); if(Array.isArray(p)) state.picked=p; } catch(e){}
  function toast(message){const t=$("toast");t.textContent=message;t.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove("show"),2300);}
  function shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
  function renderRoster(){
    $("studentCount").textContent=state.names.length;$("rosterTotal").textContent=state.names.length;
    $("rosterList").innerHTML="";
    state.names.forEach((name,i)=>{const row=document.createElement("div");row.className="roster-item";
      const dot=document.createElement("span");dot.className="roster-dot";dot.textContent=["✿","🍃","✧","☘"][i%4];
      const label=document.createElement("span");label.className="name";label.textContent=name;
      const mark=document.createElement("span");mark.className="picked-mark";mark.textContent=state.picked.includes(name)?"✓ picked":"";
      const del=document.createElement("button");del.className="remove-student";del.type="button";del.textContent="×";del.title="Remove "+name;del.setAttribute("aria-label","Remove "+name);del.addEventListener("click",()=>{state.names.splice(i,1);state.picked=state.picked.filter(n=>n!==name);save();renderAll();});
      row.append(dot,label,mark,del);$("rosterList").append(row);
    });
  }
  function renderHistory(){const el=$("historyList");el.innerHTML="";if(!state.history.length){el.textContent="Your picks will appear here";return;}state.history.slice(-5).reverse().forEach(n=>{const chip=document.createElement("span");chip.className="history-chip";chip.textContent=n;el.append(chip);});}
  function renderAll(){renderRoster();renderHistory();$("pickBtn").disabled=!state.names.length;}
  function addStudent(){const input=$("newStudent"),name=input.value.trim();if(!name)return toast("Please enter a name first.");if(state.names.some(n=>n.toLowerCase()===name.toLowerCase()))return toast("That name is already on the list.");state.names.push(name);input.value="";save();renderAll();toast(name+" joined the forest!");}
  $("addStudentBtn").addEventListener("click",addStudent);$("newStudent").addEventListener("keydown",e=>{if(e.key==="Enter")addStudent();});
  $("editListBtn").addEventListener("click",()=>{const updated=prompt("Edit the class list — enter one name per line:",state.names.join("\n"));if(updated===null)return;const next=[...new Set(updated.split(/\r?\n/).map(x=>x.trim()).filter(Boolean))];state.names=next;state.picked=state.picked.filter(n=>next.includes(n));save();renderAll();toast("Your class list has been updated.");});
  function resetPicks(){state.picked=[];state.history=[];save();renderAll();$("resultLabel").textContent="THE FOREST IS THINKING...";$("resultName").textContent="Ready?";$("resultSub").textContent="Tap the button to find your chosen one";$("stage")?.classList.remove("winner");toast("A fresh start for everyone!");}
  $("resetDrawBtn").addEventListener("click",resetPicks);$("clearPicksBtn").addEventListener("click",resetPicks);
  function setMode(mode){const individual=mode==="individual";$("individualTab").classList.toggle("selected",individual);$("groupTab").classList.toggle("selected",!individual);$("individualTab").setAttribute("aria-selected",String(individual));$("groupTab").setAttribute("aria-selected",String(!individual));$("individualPanel").classList.toggle("hidden",!individual);$("groupPanel").classList.toggle("hidden",individual);}
  $("individualTab").addEventListener("click",()=>setMode("individual"));$("groupTab").addEventListener("click",()=>setMode("group"));
  function getAudio(){if(!state.audio){const C=window.AudioContext||window.webkitAudioContext;if(!C){toast("Audio is not supported in this browser.");return null;}state.audio=new C();}if(state.audio.state==="suspended")state.audio.resume();return state.audio;}
  function tone(freq,duration,type="sine",volume=.07,delay=0){const a=getAudio();if(!a)return;const o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(.0001,a.currentTime+delay);g.gain.exponentialRampToValueAtTime(volume,a.currentTime+delay+.03);g.gain.exponentialRampToValueAtTime(.0001,a.currentTime+delay+duration);o.connect(g);g.connect(a.destination);o.start(a.currentTime+delay);o.stop(a.currentTime+delay+duration+.04);}
  function chime(){if(!state.sfx)return;tone(660,.35,"sine",.06);tone(880,.5,"sine",.05,.13);tone(1100,.65,"sine",.04,.25);}
  function shuffleSound(){if(!state.sfx)return;[440,554,659,784].forEach((f,i)=>tone(f,.12,"triangle",.025,i*.09));}
  function musicLoop(){if(!state.music)return;const notes=[261.63,329.63,392,329.63,293.66,349.23,440,392];let i=0;state.musicTimer=setInterval(()=>{if(!state.music)return;const f=notes[i++%notes.length];tone(f,1.8,"sine",.012);tone(f/2,2.4,"sine",.009,.04);},1050);}
  function toggleMusic(){state.music=!state.music;$("musicBtn").classList.toggle("active",state.music);$("musicBtn").setAttribute("aria-pressed",String(state.music));$("musicBtn").innerHTML=(state.music?"♫":"♫")+" <span>Music "+(state.music?"On":"Off")+"</span>";if(state.music){getAudio();musicLoop();toast("Forest ambience is playing.");}else{clearInterval(state.musicTimer);toast("Forest music paused.");}}
  $("musicBtn").addEventListener("click",toggleMusic);
  $("sfxBtn").addEventListener("click",()=>{state.sfx=!state.sfx;$("sfxBtn").classList.toggle("active",state.sfx);$("sfxBtn").setAttribute("aria-pressed",String(state.sfx));$("sfxBtn").innerHTML="✧ <span>Sounds "+(state.sfx?"On":"Off")+"</span>";if(state.sfx)chime();});
  function animatePick(){
    if(!state.names.length)return toast("Add some students first.");
    const available=$("noRepeat").checked?state.names.filter(n=>!state.picked.includes(n)):state.names;
    if(!available.length){toast("Everyone has been picked! Reset the draw for a new round.");return;}
    $("pickBtn").disabled=true;$("resultLabel").textContent="A LITTLE MAGIC IS HAPPENING...";$("resultSub").textContent="The forest is choosing";$("individualPanel").classList.add("spinning");shuffleSound();
    let ticks=0;const timer=setInterval(()=>{const candidate=available[Math.floor(Math.random()*available.length)];$("resultName").textContent=candidate;ticks++;if(ticks>17){clearInterval(timer);const winner=available[Math.floor(Math.random()*available.length)];$("resultName").textContent=winner;$("resultLabel").textContent="THE FOREST HAS CHOSEN";$("resultSub").textContent="A little round of applause, please!";$("individualPanel").classList.remove("spinning");$("individualPanel").classList.add("winner");setTimeout(()=>$("individualPanel").classList.remove("winner"),650);if($("noRepeat").checked)state.picked.push(winner);state.history.push(winner);save();renderAll();$("pickBtn").disabled=false;chime();} },95);
  }
  $("pickBtn").addEventListener("click",animatePick);
  $("sizeMinus").addEventListener("click",()=>{state.groupSize=Math.max(2,state.groupSize-1);$("groupSize").textContent=state.groupSize;});
  $("sizePlus").addEventListener("click",()=>{state.groupSize=Math.min(12,state.groupSize+1);$("groupSize").textContent=state.groupSize;});
  function makeGroups(){if(!state.names.length)return toast("Add students before creating groups.");const shuffled=shuffle(state.names);state.groups=[];for(let i=0;i<shuffled.length;i+=state.groupSize)state.groups.push(shuffled.slice(i,i+state.groupSize));state.chosenGroup=-1;renderGroups();toast(state.groups.length+" forest groups created!");}
  function renderGroups(){const grid=$("groupsGrid");grid.innerHTML="";state.groups.forEach((group,i)=>{const tile=document.createElement("div");tile.className="group-tile"+(i===state.chosenGroup?" chosen":"");const title=document.createElement("strong");title.textContent="🌿 Group "+(i+1);const names=document.createElement("span");names.textContent=group.join(" · ");tile.append(title,names);grid.append(tile);});$("groupResultTitle").textContent=state.groups.length?state.groups.length+" little teams":"Groups are waiting";$("groupHint").textContent=state.groups.length?"Ready for a team adventure?":"Create groups, then let the forest choose a team.";}
  $("makeGroupsBtn").addEventListener("click",makeGroups);
  $("shuffleGroupsBtn").addEventListener("click",()=>{if(!state.groups.length)return makeGroups();state.groups=shuffle(state.groups);state.chosenGroup=-1;renderGroups();shuffleSound();toast("The groups have been shuffled.");});
  $("pickGroupBtn").addEventListener("click",()=>{if(!state.groups.length)return toast("Create groups first.");$("pickGroupBtn").disabled=true;shuffleSound();let ticks=0;const timer=setInterval(()=>{const n=Math.floor(Math.random()*state.groups.length);$("groupResultTitle").textContent="Group "+(n+1);ticks++;if(ticks>13){clearInterval(timer);state.chosenGroup=Math.floor(Math.random()*state.groups.length);renderGroups();$("groupResultTitle").textContent="Group "+(state.chosenGroup+1)+" is chosen!";$("groupHint").textContent="The forest has picked this team. Well done!";$("pickGroupBtn").disabled=false;chime();}},100);});
  renderAll();
  if("serviceWorker" in navigator && location.protocol.startsWith("http"))window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(()=>{}));
})();
const tracks=[
 {title:"Stereo Love",artist:"Edward Maya & Vika Jigulina",cover:"fc9551c8975b17062bfb6358d1571398.jpg",audio:"ssstik.io_1793704832640.mp3",note:"Dance-pop dengan nuansa romantis."},
 {title:"Flatline",artist:"Justin Bieber",cover:"04f7249672f66d477d0482f9a37b0415.jpg",audio:"ssstik.io_1793703924272.mp3",note:"Lagu pop tentang hubungan yang sedang berada di titik sulit."},
 {title:"Paparazzi",artist:"Lady Gaga",cover:"2883c00eb19e6af283b2e074f3d8b3f0.jpg",audio:"ssstik.io_1793695580466.mp3",note:"Pop dengan tema ketenaran dan obsesi pada seorang bintang."}
];
const audio=document.getElementById("audio");let current=0,repeat=false,shuffle=false;
const $=id=>document.getElementById(id);
function render(){ $("playlist").innerHTML="";tracks.forEach((t,i)=>{const b=document.createElement("button");b.className="song"+(i===current?" active":"");const img=document.createElement("img");img.className="cover";img.src=t.cover;img.alt="Cover "+t.title;const meta=document.createElement("span");meta.className="meta";const title=document.createElement("b");title.textContent=t.title;const artist=document.createElement("small");artist.textContent=t.artist;meta.append(title,artist);const arrow=document.createElement("span");arrow.className="arrow";arrow.textContent="♪";b.append(img,meta,arrow);b.onclick=()=>select(i);$("playlist").append(b)})}
function select(i){current=i;const t=tracks[i];$("songTitle").textContent=t.title;$("songArtist").textContent=t.artist;$("songNote").textContent=t.note;$("visual").style.backgroundImage=`linear-gradient(#11152b55,#11152b55),url("${t.cover}")`;audio.pause();audio.src=t.audio||"";audio.load();$("status").textContent=t.audio?"Tekan play untuk mendengarkan.":"Audio belum dipasang. Tambahkan file MP3 dan isi nama filenya di script.js."; $("progress").value=0;$("currentTime").textContent="0:00";$("duration").textContent="0:00";render();update()}
function play(){if(!tracks[current].audio){$("status").textContent="Belum ada file MP3 untuk lagu ini. Upload MP3 milikmu ke repository lalu isi nama file di script.js.";return}audio.play().catch(()=>$("status").textContent="Audio tidak bisa diputar. Periksa nama file MP3.")}
function update(){$("play").textContent=audio.paused?"▶":"Ⅱ"}
function next(){let n=shuffle?Math.floor(Math.random()*tracks.length):(current+1)%tracks.length;if(n===current)n=(current+1)%tracks.length;select(n)}
function fmt(s){return Number.isFinite(s)?`${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,"0")}`:"0:00"}
$("play").onclick=()=>audio.paused?play():audio.pause();$("next").onclick=next;$("previous").onclick=()=>select((current-1+tracks.length)%tracks.length);
$("repeat").onclick=e=>{repeat=!repeat;audio.loop=repeat;e.currentTarget.classList.toggle("selected",repeat)};
$("shuffle").onclick=e=>{shuffle=!shuffle;e.currentTarget.classList.toggle("selected",shuffle)};
$("favorite").onclick=e=>e.currentTarget.textContent=e.currentTarget.textContent==="♡"?"♥":"♡";
$("volume").oninput=e=>audio.volume=Number(e.target.value);
$("progress").oninput=e=>{if(Number.isFinite(audio.duration))audio.currentTime=Number(e.target.value)/100*audio.duration};
audio.ontimeupdate=()=>{if(Number.isFinite(audio.duration))$("progress").value=audio.currentTime/audio.duration*100;$("currentTime").textContent=fmt(audio.currentTime);$("duration").textContent=fmt(audio.duration)};
audio.onplay=update;audio.onpause=update;audio.onended=()=>{if(!repeat)next()};audio.volume=.8;$("trackCount").textContent="03 TRACKS";select(0);
                                                                                                                 

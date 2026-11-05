/* iPad mini 2/3 / iOS 12 compatible: ES5 syntax, no build step, no external JS. */
(function () {
  'use strict';
  var $ = function(id){ return document.getElementById(id); };
  var pages = ['home','smarthome','music','photos','settings'];
  var locations = {
    hannover: {name:'Hannover',lat:52.3759,lon:9.7320},
    berlin: {name:'Berlin',lat:52.5200,lon:13.4050},
    hamburg: {name:'Hamburg',lat:53.5511,lon:9.9937},
    munich: {name:'München',lat:48.1351,lon:11.5820}
  };
  var defaults = {theme:'dark', clock:'24', location:'hannover', interval:'10'};
  var data = {};
  var photoUrls = [];
  var photoIndex = 0;
  var slideshowTimer = null;
  function save(k,v){ try {localStorage.setItem('homepanel-'+k,v);}catch(e){} }
  function load(k,fallback){ try { return localStorage.getItem('homepanel-'+k)||fallback; } catch(e){ return fallback; } }
  function setText(id,str){ var el=$(id); if(el){el.textContent=str;} }
  function page(name){
    if(pages.indexOf(name)<0){name='home';}
    var i,el,nav=document.querySelectorAll('.nav-item');
    for(i=0;i<pages.length;i++){el=$('page-'+pages[i]); if(el){el.className='page'+(pages[i]===name?' active':'');}}
    for(i=0;i<nav.length;i++){nav[i].className='nav-item'+(nav[i].getAttribute('data-page')===name?' active':'');}
    if(name==='photos'){startSlideshow();} else {stopSlideshow();}
  }
  function bindNavigation(){
    var nav=document.querySelectorAll('[data-page]'),tiles=document.querySelectorAll('[data-go]'),i;
    for(i=0;i<nav.length;i++){nav[i].onclick=function(){page(this.getAttribute('data-page'));};}
    for(i=0;i<tiles.length;i++){
      tiles[i].onclick=function(){var go=this.getAttribute('data-go');page(go==='calendar'?'settings':go);};
      tiles[i].onkeydown=function(e){e=e||window.event;if(e.keyCode===13||e.keyCode===32){if(e.preventDefault)e.preventDefault();this.click();}};
    }
  }
  function dateText(d,opts){try{return d.toLocaleDateString('de-DE',opts);}catch(e){return d.toLocaleDateString();}}
  function clock(){
    var d=new Date(),h=d.getHours(),m=d.getMinutes(),clockValue='';
    if(data.clock==='12'){clockValue=((h%12)||12)+':'+('0'+m).slice(-2);}else{clockValue=('0'+h).slice(-2)+':'+('0'+m).slice(-2);}
    setText('clock',clockValue);
    setText('top-date',dateText(d,{day:'numeric',month:'short',year:'numeric'}));
    setText('full-date',dateText(d,{weekday:'long',day:'numeric',month:'long',year:'numeric'}));
    setText('greeting',h<11?'MORGEN':h<18?'TAG':'ABEND');
  }
  function weatherDescription(code){
    if(code===0)return ['Klarer Himmel','☀'];
    if(code===1||code===2)return ['Leicht bewölkt','⛅'];
    if(code===3)return ['Bedeckt','☁'];
    if(code===45||code===48)return ['Nebel','☷'];
    if(code>=51&&code<=57)return ['Nieselregen','☂'];
    if(code>=61&&code<=67)return ['Regen','☂'];
    if(code>=71&&code<=77)return ['Schnee','❄'];
    if(code>=80&&code<=82)return ['Regenschauer','☂'];
    if(code>=85&&code<=86)return ['Schneeschauer','❄'];
    if(code>=95)return ['Gewitter','⚡'];
    return ['Wetterdaten','☁'];
  }
  function weatherError(){
    setText('weather-temp','--°');setText('weather-desc','Wetter derzeit nicht verfügbar');setText('weather-range','Bitte WLAN / Verbindung prüfen');setText('weather-pill','OFFLINE');
    setText('connection-status',navigator.onLine===false?'Offline':'Wetter nicht geladen');
  }
  function fetchWeather(){
    var loc=locations[data.location]||locations.hannover;
    setText('weather-city',loc.name);setText('weather-pill','LÄDT');
    var url='https://api.open-meteo.com/v1/forecast?latitude='+loc.lat+'&longitude='+loc.lon+'&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1';
    var xhr=new XMLHttpRequest();
    try{
      xhr.open('GET',url,true);
      xhr.timeout=12000;
      xhr.onreadystatechange=function(){
        if(xhr.readyState!==4)return;
        if(xhr.status>=200&&xhr.status<300){
          try{
            var response=JSON.parse(xhr.responseText),current=response.current,daily=response.daily,info=weatherDescription(current.weather_code);
            setText('weather-temp',Math.round(current.temperature_2m)+'°');
            setText('weather-desc',info[0]);setText('weather-icon',info[1]);
            if(daily&&daily.temperature_2m_max&&daily.temperature_2m_min){setText('weather-range','Max '+Math.round(daily.temperature_2m_max[0])+'°  ·  Min '+Math.round(daily.temperature_2m_min[0])+'°');}
            setText('weather-pill','LIVE');setText('connection-status','Bereit');
          }catch(e){weatherError();}
        }else{weatherError();}
      };
      xhr.onerror=weatherError;xhr.ontimeout=weatherError;xhr.send();
    }catch(e){weatherError();}
  }
  function applySettings(){
    document.body.className=data.theme==='light'?'light':'';
    $('theme-select').value=data.theme;$('time-format').value=data.clock;$('weather-location').value=data.location;
    $('slide-seconds').value=data.interval;clock();setText('weather-city',(locations[data.location]||locations.hannover).name);
  }
  function bindSettings(){
    $('theme-select').onchange=function(){data.theme=this.value;save('theme',data.theme);applySettings();};
    $('time-format').onchange=function(){data.clock=this.value;save('clock',data.clock);clock();};
    $('weather-location').onchange=function(){data.location=this.value;save('location',data.location);fetchWeather();};
    $('slide-seconds').onchange=function(){data.interval=this.value;save('interval',data.interval);startSlideshow();};
    $('reset-settings').onclick=function(){var k;for(k in defaults){if(defaults.hasOwnProperty(k)){data[k]=defaults[k];save(k,data[k]);}}applySettings();fetchWeather();setText('settings-feedback','Einstellungen zurückgesetzt.');};
    $('refresh-weather').onclick=fetchWeather;
  }
  function bindDemoSwitches(){
    var buttons=document.querySelectorAll('[data-device]'),i;
    for(i=0;i<buttons.length;i++){
      buttons[i].onclick=function(){var on=this.className.indexOf('on')<0;this.className='switch'+(on?' on':'');this.setAttribute('aria-pressed',on?'true':'false');};
    }
  }
  function clearPhotoUrls(){
    var i;
    if(window.URL&&URL.revokeObjectURL){for(i=0;i<photoUrls.length;i++){URL.revokeObjectURL(photoUrls[i]);}}
    photoUrls=[];
  }
  function drawPhoto(){
    var img=$('photo-image'),fallback=$('photo-fallback');
    if(photoUrls.length){img.src=photoUrls[photoIndex];img.style.display='block';fallback.style.display='none';setText('photos-state','LOKALE FOTOS · '+(photoIndex+1)+' / '+photoUrls.length);}
    else{img.style.display='none';img.removeAttribute('src');fallback.style.display='block';setText('photos-state','DEMO · BEISPIELMOTIVE');}
  }
  function stepPhoto(delta){if(photoUrls.length){photoIndex=(photoIndex+delta+photoUrls.length)%photoUrls.length;drawPhoto();}}
  function stopSlideshow(){if(slideshowTimer){clearInterval(slideshowTimer);slideshowTimer=null;}}
  function startSlideshow(){stopSlideshow();var interval=parseInt(data.interval,10);if(interval>0&&photoUrls.length>1){slideshowTimer=setInterval(function(){stepPhoto(1);},interval*1000);}}
  function bindPhotos(){
    $('photo-input').onchange=function(){
      var files=this.files,i,url;
      stopSlideshow();clearPhotoUrls();photoIndex=0;
      if(window.URL&&URL.createObjectURL){for(i=0;i<files.length&&i<80;i++){if(files[i].type.indexOf('image/')===0){url=URL.createObjectURL(files[i]);photoUrls.push(url);}}}
      drawPhoto();startSlideshow();
    };
    $('next-photo').onclick=function(){stepPhoto(1);};
    $('previous-photo').onclick=function(){stepPhoto(-1);};
  }
  function init(){
    data={theme:load('theme',defaults.theme),clock:load('clock',defaults.clock),location:load('location',defaults.location),interval:load('interval',defaults.interval)};
    if(!locations[data.location])data.location='hannover';
    if(data.theme!=='dark'&&data.theme!=='light')data.theme='dark';
    bindNavigation();bindSettings();bindDemoSwitches();bindPhotos();applySettings();drawPhoto();page('home');clock();fetchWeather();
    setInterval(clock,10000);setInterval(fetchWeather,15*60*1000);
    window.addEventListener('online',fetchWeather,false);
    window.addEventListener('offline',function(){setText('connection-status','Offline');},false);
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init,false);}else{init();}
}());

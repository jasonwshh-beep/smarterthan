const http=require('http'),fs=require('fs'),path=require('path');
const sets=require('./questions.json');
const PORT=process.env.PORT||3000;
const fresh=()=>({set:0,question:0,revealed:false,screen:'title',version:0,used:{},players:[{name:'Contestant 1',score:0},{name:'Contestant 2',score:0}],finalRevealed:false});
let state=fresh();
const mime={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'application/javascript','.png':'image/png','.json':'application/json'};
function send(res,status,data,type='application/json'){res.writeHead(status,{'Content-Type':type,'Cache-Control':'no-store'});res.end(type==='application/json'?JSON.stringify(data):data);}
http.createServer((req,res)=>{
 const u=new URL(req.url,'http://localhost');
 if(u.pathname==='/api/state'&&req.method==='GET')return send(res,200,{state,sets});
 if(u.pathname==='/api/action'&&req.method==='POST'){
  let body='';req.on('data',c=>{body+=c;if(body.length>10000)req.destroy()});
  req.on('end',()=>{try{
   const x=JSON.parse(body);
   if(process.env.ADMIN_PIN&&x.pin!==process.env.ADMIN_PIN)return send(res,403,{error:'Incorrect admin PIN'});
   const validSet=i=>Number.isInteger(i)&&i>=0&&i<sets.length;
   const validQ=i=>Number.isInteger(i)&&i>=0&&i<sets[state.set].questions.length;
   const goto=(a,b)=>{state.set=a;state.question=b;state.revealed=false;state.screen='question'};
   switch(x.action){
    case 'board':state.screen='board';break;
    case 'set':if(validSet(x.value))goto(x.value,0);break;
    case 'question':if(validQ(x.value))goto(state.set,x.value);break;
    case 'pick':if(validSet(x.set)&&validQ(x.question))goto(x.set,x.question);break;
    case 'next':if(state.question<4)goto(state.set,state.question+1);else if(state.set<sets.length-1)goto(state.set+1,0);else state.screen='board';break;
    case 'previous':if(state.question>0)goto(state.set,state.question-1);else if(state.set>0)goto(state.set-1,4);break;
    case 'reveal':state.revealed=!state.revealed;state.screen='question';if(state.revealed)state.used[state.set+'-'+state.question]=true;break;
    case 'title':state.screen='title';break;
    case 'hide':state.screen='hidden';break;
    case 'show':state.screen='question';break;
    case 'score':if(Number.isInteger(x.player)&&x.player>=0&&x.player<2&&Number.isInteger(x.value)&&Math.abs(x.value)<=10000)state.players[x.player].score+=x.value;break;
    case 'names':if(Array.isArray(x.value)&&x.value.length===2)state.players.forEach((p,i)=>p.name=String(x.value[i]).trim().slice(0,28)||('Contestant '+(i+1)));break;
    case 'final':state.screen='final';state.finalRevealed=false;break;
    case 'finalReveal':state.screen='final';state.finalRevealed=!state.finalRevealed;break;
    case 'reset':{const v=state.version;state=fresh();state.version=v;break;}
    default:return send(res,400,{error:'Unknown action'});
   }
   state.version++;send(res,200,{state});
  }catch(e){send(res,400,{error:'Invalid request'});}});return;
 }
 const route=u.pathname==='/'?'/admin.html':u.pathname==='/admin'?'/admin.html':u.pathname==='/overlay'?'/overlay.html':u.pathname;
 const target=path.resolve(__dirname,'public','.'+route);
 if(!target.startsWith(path.resolve(__dirname,'public')+path.sep))return send(res,403,'Forbidden','text/plain');
 fs.readFile(target,(e,data)=>e?send(res,404,'Not found','text/plain'):send(res,200,data,mime[path.extname(target)]||'application/octet-stream'));
}).listen(PORT,'0.0.0.0',()=>console.log('Quiz running on port '+PORT));

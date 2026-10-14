const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const store=new Map(), app={innerHTML:''};
const toast={textContent:'',classList:{add(){},remove(){}}};
const context=vm.createContext({
 window:{LVL_ART:{},scrollTo(){},addEventListener(){}},
 document:{documentElement:{style:{setProperty(){}}},getElementById(id){return id==='app'?app:id==='toast'?toast:null;},querySelectorAll(){return []}},
 location:{protocol:'file:'},navigator:{},localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)},
 setTimeout(){return 0},clearTimeout(){},console
});
for(const f of ['art-1.js','art-2.js','art-3.js','art-4.js','art-5-heroes.js','art-5-foes.js','game.js']){
  assert.ok(fs.existsSync(f),`Arquivo ausente: ${f}`);
  vm.runInContext(fs.readFileSync(f,'utf8'),context,{filename:f});
}
const art=context.window.LVL_ART;
assert.equal(Object.keys(art).filter(k=>/^h\d+$/.test(k)).length,20);
assert.equal(Object.keys(art).filter(k=>/^v\d+$/.test(k)).length,20);
const mapped=Array.from(vm.runInContext('GUARDIAN_PORTRAIT_IDS',context));
assert.equal(mapped.length,20);assert.equal(new Set(mapped).size,20);
const actual=['M','M','F','F','M','M','F','M','F','F','F','M','M','M','M','M','F','M','F','F'];
const portraits=['M','M','F','F','M','F','F','F','F','M','F','M','F','M','M','M','M','F','M','M'];
mapped.forEach((id,i)=>{assert.equal(portraits[+id.slice(1)],actual[i],`Genero visual da carta h${i}`);assert.ok(art[id]);});
assert.match(app.innerHTML,/COMEÇAR A JOGAR/);
vm.runInContext('view="album";albumFilter="heroes";render()',context);
assert.match(app.innerHTML,/collection-v6/);
assert.match(app.innerHTML,/album-query/);
assert.match(app.innerHTML,/deck-manager/);
assert.match(app.innerHTML,/rarity-query/);
vm.runInContext("showCard('hero',3)",context);
assert.match(app.innerHTML,/detail-grid/);
assert.match(app.innerHTML,/Sinfonia Solar/);
vm.runInContext('closeModal();startBattle()',context);
assert.match(app.innerHTML,/battle-v6/);
assert.match(app.innerHTML,/battle-mat/);
assert.match(app.innerHTML,/battle-dock/);
assert.match(app.innerHTML,/commander/);
assert.equal((app.innerHTML.match(/class="mini-slot/g)||[]).length,6);
assert.equal(vm.runInContext('battle.round',context),1);
assert.equal(vm.runInContext('battle.hand.length',context),5);
assert.equal(vm.runInContext('battle.enemies[1].name',context),'Tio do ZAP');
const starter=vm.runInContext('battle.hand.findIndex(c=>c.type==="hero"&&c.cost<=3)',context);
assert.ok(starter>=0,'mão inicial com Guardião acessível');
vm.runInContext(`playCard(${starter})`,context);
assert.equal(vm.runInContext('battle.heroes.filter(Boolean).length',context),1);
vm.runInContext('enemyTurn()',context);
assert.equal(vm.runInContext('battle.round',context),2);
vm.runInContext('promptResetSaga()',context);
assert.match(app.innerHTML,/Reiniciar sua saga/);
console.log('LULAVERSO 6 OK: retratos/associações, coleção, 3+3 posições, carta, turno da IA, confirmação.');
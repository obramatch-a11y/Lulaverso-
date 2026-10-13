const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const store=new Map();
const app={innerHTML:''};
const toast={textContent:'',classList:{add(){},remove(){}}};
const doc={getElementById:id=>id==='app'?app:id==='toast'?toast:null,querySelectorAll:()=>[]};
const ctx=vm.createContext({
  window:{scrollTo(){},addEventListener(){}},
  document:doc,
  location:{protocol:'https:'},
  navigator:{},
  localStorage:{getItem:key=>store.get(key)||null,setItem:(k,v)=>store.set(k,v)},
  setTimeout:fn=>0,
  clearTimeout(){},
  console
});
vm.runInContext(fs.readFileSync('game.js','utf8'),ctx,{filename:'game.js'});
vm.runInContext(fs.readFileSync('upgrade.js','utf8'),ctx,{filename:'upgrade.js'});
assert.match(app.innerHTML,/feature-splash/,'tela inicial visual');
vm.runInContext("view='album';albumFilter='heroes';render()",ctx);
assert.match(app.innerHTML,/premium-art/,'colecao com retratos');
assert.match(app.innerHTML,/rarity-chip/,'filtro de raridade');
assert.equal((app.innerHTML.match(/class="gcard v3card/g)||[]).length,20,'20 cartas de heroi');
vm.runInContext("showCard('hero',0)",ctx);
assert.match(app.innerHTML,/detail-section/,'ficha detalhada');
assert.match(app.innerHTML,/Cosmo da União/,'poder nomeado');
vm.runInContext("closeModal();startBattle()",ctx);
assert.match(app.innerHTML,/unit-portrait/,'imagens na arena');
assert.match(app.innerHTML,/premium-art/,'cartas na mao');
assert.equal(vm.runInContext('battle.round',ctx),1);
assert.equal(vm.runInContext('battle.hand.length',ctx),5);
vm.runInContext('enemyTurn()',ctx);
assert.equal(vm.runInContext('battle.round',ctx),2,'turno da IA');
console.log('LULAVERSO 3.0: smoke test OK — inicio, colecao, modal, arena e IA.');

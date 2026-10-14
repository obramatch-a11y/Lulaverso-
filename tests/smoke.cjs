const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const memory = new Map();
const root = {innerHTML: ''};
const toast = {textContent: '', classList: {add(){}, remove(){}}};
const windowMock = {LVL_ART: {}, scrollTo(){}, addEventListener(){}};
const ctx = vm.createContext({
  window: windowMock,
  document: {documentElement: {style: {setProperty(){}}}, getElementById(id){return id === 'app' ? root : id === 'toast' ? toast : null;},querySelectorAll(){return [];}},
  location: {protocol: 'file:'}, navigator: {},
  localStorage: {getItem(key){return memory.get(key) || null;}, setItem(key, value){memory.set(key, value);}},
  setTimeout(){return 0;}, clearTimeout(){}, console,
});
for (const file of ['art-1.js','art-2.js','art-3.js','art-4.js','art-5-heroes.js','art-5-foes.js','game.js']) {
  assert.ok(fs.existsSync(file), 'Faltando '+file);
  vm.runInContext(fs.readFileSync(file,'utf8'),ctx,{filename:file});
}
assert.equal(Object.keys(windowMock.LVL_ART).filter(x=>/^h\d+$/.test(x)).length,20,'20 herois ilustrados');
assert.equal(Object.keys(windowMock.LVL_ART).filter(x=>/^v\d+$/.test(x)).length,20,'20 rivais ilustrados');
const heroPortraits=Array.from(vm.runInContext('GUARDIAN_PORTRAIT_IDS',ctx));
assert.equal(heroPortraits.length,20,'20 identificadores de retratos');
assert.equal(new Set(heroPortraits).size,20,'cada heroi com retrato exclusivo');
const actualHeroGenders=['M','M','F','F','M','M','F','M','F','F','F','M','M','M','M','M','F','M','F','F'];
const drawnPortraitGenders=['M','M','F','F','M','F','F','F','F','M','F','M','F','M','M','M','M','F','M','M'];
heroPortraits.forEach((id,i)=>{
 const sourceIndex=Number(id.slice(1));
 assert.ok(windowMock.LVL_ART[id], 'ilustracao ausente: '+id);
 assert.equal(drawnPortraitGenders[sourceIndex],actualHeroGenders[i], 'retrato divergente para '+i);
});

assert.match(root.innerHTML,/COMEÇAR A JOGAR/,'acao principal exibida');
assert.match(root.innerHTML,/card-portrait/,'retratos carregados na tela inicial');
vm.runInContext("view='album';albumFilter='heroes';render()",ctx);
assert.match(root.innerHTML,/card-portrait/,'colecao com imagens');
assert.match(root.innerHTML,/card-rarity/,'raridade visivel');
assert.equal(vm.runInContext('HEROES.length',ctx),20);
vm.runInContext("showCard('hero',0)",ctx);
assert.match(root.innerHTML,/detail-grid/,'ficha ampliada');
assert.match(root.innerHTML,/Cosmo da União/,'poder de heroi explicado');
vm.runInContext('closeModal();startBattle()',ctx);
assert.equal(vm.runInContext('battle.stage',ctx),0,'comeco da saga');
assert.equal(vm.runInContext('battle.enemies[1].name',ctx),'Tio do ZAP','primeiro adversario');
assert.match(root.innerHTML,/battle-dock/,'mao sempre acessivel');
assert.match(root.innerHTML,/hand-card-play/,'carta jogavel');
assert.match(root.innerHTML,/card-portrait/,'retratos na arena');
assert.equal(vm.runInContext('battle.hand.length',ctx),5);
vm.runInContext('enemyTurn()',ctx);
assert.equal(vm.runInContext('battle.round',ctx),2,'turno da IA');
vm.runInContext('promptResetSaga()',ctx);
assert.match(root.innerHTML,/reset|reiniciar|apagar/i,'confirmacao antes de reiniciar');
console.log('LULAVERSO 5: OK — 40 retratos, inicio, colecao, ficha, duelo, mao, IA, confirmacao.');
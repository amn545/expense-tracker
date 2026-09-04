const $=id=>document.getElementById(id);
let data=JSON.parse(localStorage.getItem("expenseTracker"))||[];
$("date").value=new Date().toISOString().slice(0,10);

const money=n=>new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:2}).format(n);
const safe=s=>{const d=document.createElement("div");d.textContent=s;return d.innerHTML};
const icons={Food:"🍴",Transport:"↗",Shopping:"🛍",Bills:"▤",Education:"📚",Entertainment:"♪",Salary:"₹",Other:"•"};

function save(){localStorage.setItem("expenseTracker",JSON.stringify(data))}
function render(){
 const inc=data.filter(x=>x.type==="income").reduce((a,x)=>a+x.amount,0);
 const exp=data.filter(x=>x.type==="expense").reduce((a,x)=>a+x.amount,0);
 $("income").textContent=money(inc);$("expense").textContent=money(exp);$("balance").textContent=money(inc-exp);
 $("note").textContent=data.length?`${data.length} transaction${data.length>1?"s":""} recorded`:"Add your first transaction";
 const f=$("filter").value;
 const rows=data.filter(x=>f==="all"||x.type===f).sort((a,b)=>b.id-a.id);
 $("list").innerHTML=rows.map(x=>`<div class="tx"><div class="icon">${icons[x.category]||"•"}</div><div class="info"><strong>${safe(x.desc)}</strong><small>${safe(x.category)} · ${new Date(x.date+"T00:00:00").toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}</small></div><div class="amt ${x.type==="income"?"in":"out"}">${x.type==="income"?"+":"-"}${money(x.amount)}</div><button class="del" data-id="${x.id}">×</button></div>`).join("");
 $("empty").style.display=rows.length?"none":"block";
}
$("form").addEventListener("submit",e=>{e.preventDefault();data.push({id:Date.now(),desc:$("desc").value.trim(),amount:Number($("amount").value),type:$("type").value,category:$("category").value,date:$("date").value});save();render();e.target.reset();$("type").value="expense";$("date").value=new Date().toISOString().slice(0,10);$("desc").focus()});
$("list").addEventListener("click",e=>{if(!e.target.classList.contains("del"))return;data=data.filter(x=>x.id!==Number(e.target.dataset.id));save();render()});
$("filter").addEventListener("change",render);
$("clear").addEventListener("click",()=>{if(data.length&&confirm("Delete all transactions?")){data=[];save();render()}});
render();
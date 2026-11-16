// SELBA Cargo · web · calculadora de la página de precios
(function(){
  var P={base:39,std:59,resp:5,tecp:5,tect:7,staff:19,fleet:19,maint:19,biz:29};
  function $(id){return document.getElementById(id);}
  function n(id){var v=parseInt($(id).value,10);return isNaN(v)||v<0?0:Math.min(v,50);}
  function c(id){return $(id).checked;}
  function calc(){
    var found=c("c_found"), lines=[];
    var base=found?P.base:P.std; lines.push(["Plan Core",base]);
    var r=n("c_resp"),tp=n("c_tecp"),tt=n("c_tect");
    if(r)lines.push([r+" × Responsable",r*P.resp]);
    if(tp)lines.push([tp+" × Pack técnicos",tp*P.tecp]);
    if(tt)lines.push([tt+" × Pack temporal",tt*P.tect]);
    if(c("m_staff"))lines.push(["Staff",P.staff]);
    if(c("m_fleet"))lines.push(["Fleet",P.fleet]);
    if(c("m_maint"))lines.push(["Maintenance",P.maint]);
    if(c("m_biz"))lines.push(["Business",P.biz]);
    var total=lines.reduce(function(s,l){return s+l[1];},0);
    $("c_total").textContent=total;
    $("c_lines").innerHTML=lines.map(function(l){return "<li><span>"+l[0]+"</span><span>"+l[1]+" €</span></li>";}).join("");
    $("c_note").style.display=found?"":"none";
    $("c_after").textContent=total-P.base+P.std;
  }
  document.querySelectorAll("[data-step]").forEach(function(b){
    b.addEventListener("click",function(){var i=$(b.dataset.for);i.value=Math.max(0,Math.min(50,n(i.id)+parseInt(b.dataset.step,10)));calc();});
  });
  ["c_found","c_resp","c_tecp","c_tect","m_staff","m_fleet","m_maint","m_biz"].forEach(function(id){$(id).addEventListener("input",calc);$(id).addEventListener("change",calc);});
  calc();
})();

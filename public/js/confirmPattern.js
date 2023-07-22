var log=console.log;
function op(elem){return document.querySelector(elem)}
function opp(elem){return document.querySelectorAll(elem)}

var lockBox=op('.lockBox');
for(var a=9; a>=1; a--){
    lockBox.insertAdjacentHTML("afterbegin",`<div class="dot"><div class="dotArea" onmousedown="down(this)"><i>${a}</i></div></div>`)
}

var startDot,
svg=op("svg"),
dots=opp(".dot"),
lineData="M",
tempLineData,
svgPath=op('svg path'),
inputData="",
correctData="2413";

function end(){
    giveOutConfirm(inputData);
    document.body.style.setProperty('--baseCol',(inputData==correctData)?"#0f0":"#f00");

    startDot=undefined;
    lineData="M";
    inputData="";
    tempLineData=undefined;

    setTimeout(()=>{
    opp('.dot.active').forEach(val=>{val.classList.remove('active')})
    svgPath.setAttribute("d",'');
    document.body.style.setProperty('--baseCol',"#f6422e");
    },500)
}

function down(elem){
    startDot=elem;
    lockBox.addEventListener('mousemove',moving)
    addEvToMouseEnter();
    lineData+=`${startDot.parentElement.offsetLeft +5},${startDot.parentElement.offsetTop +5}`;
    makeLine();
    startDot.classList.add("active")
}
document.onmouseup=function (){
    lockBox.removeEventListener('mousemove',moving)
    removeEvToMouseEnter();
    tempLineData=''
    updateLine();
    end(startDot,tempLineData,lineData)
}
function moving(e){
    makeLineWhileMoving(e.clientX,e.clientY)
}
function makeLineWhileMoving(x,y){
    var x=Math.floor(x - lockBox.getBoundingClientRect().left);
    var y=Math.floor(y - lockBox.getBoundingClientRect().top);

    tempLineData=" L"+x+','+y;

    updateLine()
}

function makeLine(e=startDot){
    e.target=startDot;
    var dot=e.target.parentElement;
    dot.classList.add('active');
    var x=dot.getBoundingClientRect().left,
    y=dot.getBoundingClientRect().top;
    inputData+=dot.innerText;

    makeLineWhileMoving(x,y)
    lineData+=tempLineData;
}

function addEvToMouseEnter(){
    opp(".dotArea").forEach(val=>{
    val.addEventListener("mouseenter",makeLine);
    })
}
function removeEvToMouseEnter(){
    opp(".dotArea").forEach(val=>{
    val.removeEventListener("mouseenter",makeLine);
    })
}
function updateLine(){
    svgPath.setAttribute("d",lineData+tempLineData);
}

function giveOutConfirm(inputData){
    console.log(`input:${inputData}`);
}
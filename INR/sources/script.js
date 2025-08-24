// ---- Globals ----
let blockchainLedger=[]; // simulated on-chain record
let nftReceipts=[];      // NFT receipt store
let aptRewards=0;

// ---- Tab Switching ----
document.querySelectorAll(".nav-links li").forEach(item=>{
  item.addEventListener("click",function(){
    document.querySelectorAll(".nav-links li").forEach(li=>li.classList.remove("active"));
    this.classList.add("active");
    document.querySelectorAll(".tab-content").forEach(tab=>tab.classList.remove("active"));
    document.getElementById(this.dataset.tab).classList.add("active");
    loadTab(this.dataset.tab);
  });
});

// ---- Dark Mode ----
document.getElementById("darkModeToggle").addEventListener("click",()=>document.body.classList.toggle("dark-mode"));

// ---- Load Tabs ----
function loadTab(tab){
  let area=document.getElementById(tab);
  area.innerHTML="";
  if(tab==="dashboard"){area.innerHTML=`<div class="card"><h3>Welcome</h3><p>Your bills and rewards are managed on Aptos Blockchain</p></div>`;}
  if(tab==="payment") loadPayment(area);
  if(tab==="transactions") loadTransactions(area);
  if(tab==="nft") loadNFTs(area);
  if(tab==="split") loadSplit(area);
  if(tab==="rewards") loadRewards(area);
}

// ---- PAYMENT ----
function loadPayment(area){
  area.innerHTML=`<div class="card">
    <h3>Pay Bill (On-Chain)</h3>
    <label>Bill Type</label><input id="billType" type="text" placeholder="Electricity"/>
    <label>Amount (USDT)</label><input id="billAmount" type="number" placeholder="100"/>
    <button class="btn" onclick="payBill()">Pay</button>
    <p id="payMsg"></p>
  </div>`;
}
function payBill(){
  let type=document.getElementById("billType").value||"Bill";
  let amt=document.getElementById("billAmount").value||0;
  let txHash="APT"+Math.random().toString(36).substr(2,9);
  let record={type,amt,date:new Date().toLocaleString(),tx:txHash};
  blockchainLedger.push(record);
  nftReceipts.push(record);
  aptRewards+=5; // reward points
  document.getElementById("payMsg").innerText=`✅ Paid ${type} ${amt} USDT (Tx: ${txHash})`;
}

// ---- ON-CHAIN RECORDS ----
function loadTransactions(area){
  let html=`<div class="card"><h3>On-Chain Bill Records</h3>
    <table class="table"><tr><th>Date</th><th>Bill</th><th>Amt</th><th>Tx</th></tr>`;
  blockchainLedger.forEach(r=>{
    html+=`<tr><td>${r.date}</td><td>${r.type}</td><td>${r.amt}</td><td><span class="badge">${r.tx}</span></td></tr>`;
  });
  html+="</table></div>";
  area.innerHTML=html;
}

// ---- NFT RECEIPTS ----
function loadNFTs(area){
  area.innerHTML=`<div class="card"><h3>NFT Bill Receipts</h3><div id="nftList"></div></div>`;
  let list=document.getElementById("nftList");
  nftReceipts.forEach(r=>{
    let div=document.createElement("div");
    div.className="card";
    div.innerHTML=`<p><b>${r.type}</b> - ${r.amt} USDT<br/>Tx: ${r.tx}</p><canvas id="qr${r.tx}"></canvas>`;
    list.appendChild(div);
    QRCode.toCanvas(document.getElementById("qr"+r.tx), JSON.stringify(r), function (error) {});
  });
}

// ---- BILL SPLITTING ----
function loadSplit(area){
  area.innerHTML=`<div class="card">
    <h3>Smart Bill Split</h3>
    <label>Total Bill (USDT)</label><input id="splitAmt" type="number" placeholder="300"/>
    <label>No. of People</label><input id="splitPeople" type="number" placeholder="3"/>
    <button class="btn" onclick="splitBill()">Generate</button>
    <div id="splitResult"></div>
  </div>`;
}
function splitBill(){
  let amt=document.getElementById("splitAmt").value;
  let n=document.getElementById("splitPeople").value;
  if(amt>0&&n>0){
    let share=(amt/n).toFixed(2);
    let res=document.getElementById("splitResult");
    res.innerHTML="";
    for(let i=1;i<=n;i++){
      let tx="SPLIT"+Math.random().toString(36).substr(2,5);
      let div=document.createElement("div");
      div.innerHTML=`Person ${i}: ${share} USDT<br/>Tx: ${tx}<canvas id="qr${tx}"></canvas>`;
      res.appendChild(div);
      QRCode.toCanvas(document.getElementById("qr"+tx),`Pay ${share} USDT for bill`,()=>{});
    }
  }
}

// ---- REWARDS ----
function loadRewards(area){
  area.innerHTML=`<div class="card"><h3>APT Rewards</h3>
    <p>You earned <b>${aptRewards}</b> APT for on-time bill payments 🎉</p></div>`;
}

// ---- Default ----
loadTab("dashboard");

const secondHand = document.querySelector(".clock .second");
const minuteHand = document.querySelector(".clock .minute");
const hourHand = document.querySelector(".clock .hour");
const showTime = document.getElementById("showTime");
const showTime1 = document.querySelector("#alaramContainer #showTime");
const hourOptionEl=document.querySelector(".userInput #hour");
const minuteOptionEl=document.querySelector(".userInput #minutes");
const secondOptionEl=document.querySelector(".userInput #seconds");
const setAlaramBtn = document.getElementById("setAlaramBtn");
const stEl=document.querySelector(".userInput #st");
const currentAlaram=document.getElementById("currentAlaram");
let count=1;
const timeouts = {};

function startClock() {
  const now = new Date();
  let hh = now.getHours();
  const mm = now.getMinutes();
  const ss = now.getSeconds();
  let st = "AM";

  // Calculate rotation angles for hour, minute, and second hands
  const secondRotation = (ss / 60) * 360; // 360 degrees in 60 seconds
  const minuteRotation = ((mm + ss / 60) / 60) * 360; // 360 degrees in 60 minutes
  const hourRotation = ((hh + mm / 60) / 12) * 360; // 360 degrees in 12 hours

  if(hh==0){
    hh=12;
  }

  if (hh > 12) {
    hh -= 12;
    st = "PM";
  }

  // Apply rotations to the clock hands
  secondHand.style.transform = `rotate(${secondRotation}deg) translateY(-50%)`;
  minuteHand.style.transform = `rotate(${minuteRotation}deg) translateY(-50%)`;
  hourHand.style.transform = `rotate(${hourRotation}deg) translateY(-50%)`;

  let element = `
    <span class="hour">${hh.toString().padStart(2,"0")} </span>:
     <span class="minute">${mm.toString().padStart(2,"0")}</span>:
    <span class="second">${ss.toString().padStart(2,"0")}</span> :
    <span >${st.toString().padStart(2,"0")}</span>`;

    

  showTime.innerHTML = element;
  showTime1.innerHTML=element;
}
// Update the clock every second
startClock();
setInterval(startClock, 1000);

function creatingSelectBoxes(){
    for(let i=1;i<=12;i++){
      let ele=`<option>${i.toString().padStart(2,"0")}</option>`;
      hourOptionEl.innerHTML+=ele;
    }
    for(let i=0;i<=59;i++){
      let ele=`<option>${i.toString().padStart(2,"0")}</option>`;
      minuteOptionEl.innerHTML+=ele;
      secondOptionEl.innerHTML+=ele;
    }
}
creatingSelectBoxes();

/****** set aralarm button   ****** */

setAlaramBtn.addEventListener('click',()=>{
  if(validateInputs()){
    
    let ele=`
    <div class="showCurrentAlaram" data-id="${count}">
      <div>${hourOptionEl.value}:${minuteOptionEl.value}: ${secondOptionEl.value} ${stEl.value}</div>
      <button onclick="handleDeleteClick(event)">delete</button>
    </div>`;
    currentAlaram.innerHTML+=ele;
    let hour=parseInt(hourOptionEl.value);
    let minute=parseInt(minuteOptionEl.value);
    let second=parseInt(secondOptionEl.value);
    if(stEl.value == "PM"){
         hour+=12;
    }
    setAlarmAtSpecificTime(hour,minute,second,count);
    count++;

  }else{
    alert("Please select all values !!");
  }
})

function validateInputs(){
   console.log(hourOptionEl.value);
   console.log(minuteOptionEl.value);
   console.log(secondOptionEl.value);
   if(hourOptionEl.value == "null" || minuteOptionEl.value == "null" || secondOptionEl.value == "null"){
    console.log("hello");
    return false;
   }
   return true;
}

function handleDeleteClick(e){
  const id = e.target.parentNode.getAttribute("data-id");
  clearTimeout(timeouts[id]);
  console.log("handleDeleteClick",e.target.parentNode.remove());
}

function setAlarmAtSpecificTime(hour, minute,second,id) {
  const now = new Date();
  const alarmTime = new Date();
  alarmTime.setHours(hour);
  alarmTime.setMinutes(minute);
  alarmTime.setSeconds(second);

  const timeDifference = alarmTime.getTime() - now.getTime();

  if (timeDifference < 0) {
      // If the alarm time is in the past, set it for the next day
      alarmTime.setDate(alarmTime.getDate() + 1);
  }

  const timeUntilAlarm = alarmTime.getTime() - now.getTime();

  timeouts[id]=setTimeout(function() {
      // This function will be executed when the alarm time is reached
      const alarm=new Audio("ringtone.mp3");
      alarm.loop = true; 
      alarm.play();
      setTimeout(function() {
        alarm.pause();
    }, 3000);
      alert("Alarm at " + hour + ":" + minute);
      document.querySelector(`.showCurrentAlaram[data-id="${id}"]`).remove();
      delete timeouts[id];
     

  }, timeUntilAlarm);
}


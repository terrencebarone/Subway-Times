function nextArrival(firstTrain,freq){
    let currentTime= new Date();
    let currentHour= currentTime.getHours();
    let currentMin= currentTime.getMinutes();
    let firstTrainHour= Number(firstTrain.substr(0,2));
    let firstTrainMin= Number(firstTrain.substr(3,2));
    freq=Number(freq);
    if(currentHour>=firstTrainHour){
        //the first train has already started its freq
        while(currentHour>firstTrainHour){
            firstTrainMin=firstTrainMin+freq;
            if(firstTrainMin>=60){
                firstTrainMin=firstTrainMin-60;
                firstTrainHour++;
            }
        }
        while(firstTrainMin<=currentMin){
            firstTrainMin=firstTrainMin+freq;
        }
        if(firstTrainMin===60){
            firstTrainHour++;
            firstTrainMin=00;
            let nextArrival = `${firstTrainHour}:${firstTrainMin}`;
            return [nextArrival,`${60-currentMin} minutes`];
        }
        else{
        console.log(firstTrainHour + " " +firstTrainMin);
        console.log(currentHour+ " " +currentMin);
        let nextArrival = `${firstTrainHour}:${firstTrainMin}`;
        let minutesAway = `${firstTrainMin-currentMin} minutes`;
        console.log(nextArrival);
        console.log(minutesAway);
        return [nextArrival,minutesAway];
        }

    }
    else{
       let nextArrival = `${firstTrainHour}:${firstTrainMin}`;
       let toHour = 60-currentMin;
       currentHour++;
       let hourDifference=(firstTrainHour-currentHour)*60;
       let totalMinDifference=toHour+hourDifference+firstTrainMin;
       if(totalMinDifference>60){
        let FinalHours=Math.floor(totalMinDifference/60);
        let FinalMinutes=totalMinDifference%60;
        let finalTimeDifference=`${FinalHours} hours ${FinalMinutes} minutes`;
         return [nextArrival,finalTimeDifference]
       }
       else{
           let finalTimeDifference=`${totalMinDifference} minutes`;
          return [nextArrival, finalTimeDifference];
       }
    }
}

let noTrainMessage = document.getElementById("no-train-message");
function updateSchedule(localStorageData){
    if(noTrainMessage.style.display!=="none"){
        noTrainMessage.style.display="none";
    }
    let tableData = `<caption>Train Schedule</caption>
    <tr>
        <th>Train Name</th>
        <th>Destination</th>
        <th>Frequency in Minutes</th>
        <th>Next Arrival</th>
        <th>Minutes Away</th>
    </tr>
   `;
    for(let i = 0 ; i<localStorageData.length; i++){
        
        let calcedData = nextArrival(localStorageData[i].firstTrain,localStorageData[i].freq);
        tableData = tableData + `
        <tr class="data-row">
            <td class="table-data">${localStorageData[i].name}</td>
            <td class="table-data">${localStorageData[i].dest}</td>
            <td class="table-data">${localStorageData[i].freq}</td>
            <td class="table-data">${calcedData[0]}</td>
            <td class="table-data">${calcedData[1]}</td>
        </tr>
        `;
        
    }
    document.getElementById("train-schedule-table").innerHTML=tableData;
}

//LOCAL STORAGE TRAIN DATA 
//local storage does not have trainData key
if(localStorage.getItem("trainData")===null){
    localStorage.setItem("trainData","[]");
    noTrainMessage.style.display="table-row";
}//localstorge has trainData Key 
else{
    noTrainMessage.style.display="none";
    let currentData = JSON.parse(localStorage.getItem("trainData"));
    updateSchedule(currentData);
}



//ADD NEW TRAIN 
const formButton = document.getElementById("train-form-button")
const formInfo = document.getElementsByTagName("input");
const timeError = document.getElementById("time-error-message");
const freqError = document.getElementById("freq-error-message");

//removes default for form submission (no refresh on page)
function removeFormRefresh (event){
    event.preventDefault();
}
document.getElementById("train-form").addEventListener("submit", removeFormRefresh);

//form submitted and all inputs have values
formButton.addEventListener("click", (e)=> {
    const timeRegex = new RegExp(/^([01]\d|2[0-3]):?([0-5]\d)$/);
    //If Time of first train has correct format
    if(timeRegex.test(formInfo[2].value)===true){
        //check if time error message is displayed and removes 
        if(timeError.classList.contains("hide-message")===false){
            timeError.classList.add("hide-message");
        }
        //checks to see if frequency is less than 300 
        let trainFreq = formInfo[3].value;
        if(trainFreq > 300){
            freqError.classList.remove("hide-message");
            return;
        }
        //removes freq error message if exists 
        if(freqError.classList.contains("hide-message")===false){
            freqError.classList.add("hide-message");
        }
        //All info has right syntax******
        let trainName = formInfo[0].value;
        let trainDest = formInfo[1].value;
        let trainTime = formInfo[2].value;
        let trainObj = {
            name: trainName,
            dest: trainDest,
            firstTrain: trainTime,
            freq : trainFreq
        }
        let currentData = JSON.parse(localStorage.getItem("trainData"));
        currentData.push(trainObj);
        localStorage.setItem("trainData", JSON.stringify(currentData));
        updateSchedule(currentData);
    }
    //If time of first train does not have correct format
    else{
        //show error message
        timeError.classList.remove("hide-message");
    }
});
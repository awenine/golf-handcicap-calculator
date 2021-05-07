import { fetchTable } from "./services.js";
import { courses } from "/courses.js"

//? takes a flat array of cell objects & table ID to populate
export function tableMaker(dataList, container, hasLinkedColumn = false) {
  if (dataList.length) {
    let noOfRows = +dataList.slice(-1)[0].row;
    let dataListMap = [];
    while (noOfRows) {
      dataListMap = [dataList.filter(cell => cell.row === noOfRows + ''),...dataListMap ];
      noOfRows --;
    }
    dataListMap
      .forEach(row => {
        let rowElement = document.createElement("tr");
        row.forEach((cell) => {
          let cellElement = document.createElement("td");
          let cellContents = cell.$t
          hasLinkedColumn ?
            cell.col === '1' ?
              cellElement.innerHTML = `<a href="/${cellContents.toLowerCase()}-stats.html">${cellContents}</a>` :  
              cellElement.innerText = cellContents :
            cellElement.innerText = cellContents;
          rowElement.appendChild(cellElement)
        })
        document.getElementById(container).appendChild(rowElement)
    });
    return dataListMap;
  }
}

export function createCourseObject(inputString) {
  const splitInput = inputString.split(',').map(a => a.trim());
  const courseObject = {};
  courseObject.name = splitInput[0].split(' ').join('').charAt(0).toLowerCase() + splitInput[0].split(' ').join('').slice(1);
  courseObject.tee = splitInput[1];
  courseObject.holes = splitInput[2] === "18 holes" ?
    "full18" :
    splitInput[2].split(' ').join('');
  return courseObject;
}

export function calculateHandicapDifferential(score, courseObject) {
  const course = courses[courseObject.name][courseObject.tee][courseObject.holes]
  return +((score - course.rating) * (113/course.slope)).toFixed(2)
} //TODO: change to retrieve data from course sheet instead of object


export function calculateHI(games) {
  let noOfTopGames = 
    games.length < 6
      ? 1
      : games.length < 9
        ? 2
        : games.length < 12
          ? 3
          : games.length < 15
            ? 4
            : games.length < 17
              ? 5
              : games.length < 19
                ? 6
                : games.length < 20
                  ? 7
                  : 8;
  const differentials = 
    games
      .slice()
      .sort((a,b) => +b[0].numericValue - +a[0].numericValue) // sorts by date
      .slice(0,20) // picks top 20
      .map(row => calculateHandicapDifferential(+row[2].$t, 
        createCourseObject(row[1].$t)))
      .sort((a,b) => a - b) // sorts by score
      .slice(0, noOfTopGames) // picks top 8
      console.log("differentials (top 8): ",differentials);
  return differentials
      .reduce((a,b) => a + b, 0) / differentials.length
}


//? for calculating exceptional scores for adjusting the Handicap (not currently used)
export function calculateHIWithExceptionalScores(games) {
  const differentials = 
    games
      .slice()
      .sort((a,b) => +b[0].numericValue - +a[0].numericValue) // sorts by date
      .map(row => calculateHandicapDifferential(+row[2].$t, createCourseObject(row[1].$t))) // array of differentials
      .map((diff, index) => {
        return [diff, calculateHI(games.slice(0, index+1))]
      }); // array of type [differential, HI to that point]
      console.log("differentials: ",differentials);
  for (let i = 1; i < differentials.length; i++) {
    console.log('HI for line',i,':',differentials[i][1]);
    // if hi 20 and score 9
    if (differentials[i][0] <= differentials[i-1][1] - 10) { //? 'check' loop
      console.log('over 10 check, differential = ',differentials[i][0]);
      // 34 (i)
      // 15 - 34 = -2
      // recalculate all HI's 
      for (let j = Math.max(i-19, 0); j <= i; j++) { //? 'adjust' loop
        differentials[j][0] -= 2
        differentials[j][1] = differentials
          .slice(0, j+1)
          .sort((a,b) => a - b)
          .slice(0,8)
          .reduce((a,b) => a + b, 0) / Math.min(j+1,8);
      }
    } else if (differentials[i][0] <= differentials[i-1][1] - 7) { 
      console.log('over 7 check, differential = ',differentials[i][0]);
      for (let j = Math.max(i-19, 0); j <= i; j++) { //? 'adjust' loop
        differentials[j][0] -= 1
        differentials[j][1] = differentials
          .slice(0, j+1)
          .sort((a,b) => a - b)
          .slice(0,8)
          .reduce((a,b) => a + b, 0) / Math.min(j+1,8);
      }
    } else {
      console.log('diff fine, differential = ',differentials[i][0]);
    }
  }
  const sortedDifferentials = differentials
    .slice(0,20) // picks recent 20
    .sort((a,b) => a - b) // sorts by score
    .slice(0,8) // picks top 8

  return sortedDifferentials
      .reduce((a,b) => a + b[0], 0) / sortedDifferentials.length;
}

export function lowestHI(games) {
  const ordered = games.slice().sort((a,b) => +b[0].numericValue - +a[0].numericValue)
  if (ordered.length < 20) return calculateHI(ordered) //TODO apply different rules in calculateHI for amounts less than 20
  else {
    const HIvalues = [];
    for (let i = 0; i <= ordered.length-20; i++) {
      HIvalues.push(calculateHI(ordered.slice(i, 20+i)))
    }
    return Math.min(...HIvalues);
  }
}

//TODO combine bottom 2 functions 
export function renderCappedHIandLHI(HI, LHI) {
  const difference = HI - LHI;
  const cappedHI = difference > 3 ? LHI + Math.min((difference-3)/2+3, 5) : HI;
  document.getElementById("HI-value").innerText = cappedHI.toFixed(1);
  document.getElementById("LHI-value").innerText = LHI.toFixed(1);    
}

// ? needed to get HI/LHI for table 
export function indexReturnCappedHIandLHI(HI, LHI) {
  const difference = HI - LHI;
  const cappedHI = difference > 3 ? LHI + Math.min((difference-3)/2+3, 5) : HI;
  return [cappedHI.toFixed(1), LHI.toFixed(1)]; //? return 2 values in one array    
}

import { calculateHI, indexReturnCappedHIandLHI, lowestHI } from "./helperModules.js";
import { fetchTable } from "./services.js";

//? pulls all name cells formatted to one array
const indexTable = await fetchTable("1aftm8hpBj7vWlZK4Y5Rodv6XYheLngd5k1g-jkkVbiQ", "1");

// for storing hi and lhi for each player
const gameInfo = [];


for (let i = 0; i < indexTable.length; i++) {
  let playerGames = await fetchTable("1aftm8hpBj7vWlZK4Y5Rodv6XYheLngd5k1g-jkkVbiQ", `${i+3}`)
  let noOfRows = +playerGames.slice(-1)[0].row;
  let playerGamesMap = [];
  // console.log("playerGamesMap: ",playerGamesMap);
  while (noOfRows) {
    playerGamesMap = [playerGames.filter(cell => cell.row === noOfRows + ''),...playerGamesMap ];
    noOfRows --;
  }
  gameInfo.push(indexReturnCappedHIandLHI(calculateHI(playerGamesMap),lowestHI(playerGamesMap)))
}

indexTable
      .forEach((row, index) => {
        let rowElement = document.createElement("tr");
        let nameCell = document.createElement("td");
        let nameCellContents = row.$t
        nameCell.innerHTML = `<a href="/${nameCellContents.toLowerCase()}-stats.html">${nameCellContents}</a>`;
        rowElement.appendChild(nameCell)
        let HICell = document.createElement("td");
        HICell.innerHTML = gameInfo[index][0];
        rowElement.appendChild(HICell);
        let LHICell = document.createElement("td");
        LHICell.innerHTML = gameInfo[index][1];
        rowElement.appendChild(LHICell);
        document.getElementById("table").appendChild(rowElement)
    });
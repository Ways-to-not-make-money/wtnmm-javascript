var varslist;

varslist = [["incamount", 1.0], ["money", 0.0], ["mps", 0], ["amounts", [0, 0, 0, 0, 0]], ["costs", [8.0, 120.0, 1337.0, 20160.0, 123456.0]], ["origcosts", [8.0, 120.0, 1337.0, 20160.0, 123456.0]], ["mpsadds", [0.1, 0.4, 3.0, 7.5, 32.1]], ["upgs", [[0, 0], [0, 0], [0, 0], [0], [0]]], ["clickupgs", [0, 0]], ["totalclicks", 0], ["totalearned", 0], ["totalspent", [0, 0, 0, 0, 0]], ["totalcrits", 0], ["clicklvinfo", [1, 0.0, 100.0]], ["idlelvinfo", [1, 0.0, 300.0]], ["levelperks", [0.0, 0.0, 3, 0.9, 0.999]]];

var a, amounts, buildingFunc, buildingMult, buildings, buildnames, clickUpg, clickcosts, clickeffects, clicklvinfo, clicknames, clickupgs, convertCosts, costs, displayUpgs, i, idleInc, idlecheck, idlelvinfo, inc, incamount, levelUp, levelperks, money, moneynameacr, mps, mpsadds, multiplier, multiplierChange, origcosts, ref, retrieve, round, toggleDisplay, totalclicks, totalcrits, totalearned, totalspent, upgcosts, upgeffects, upgnames, upgradeFunc, upgs,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

for (a = i = 0, ref = varslist.length - 1; 0 <= ref ? i <= ref : i >= ref; a = 0 <= ref ? ++i : --i) {
  if (localStorage.getItem(varslist[a][0]) === null) {
    localStorage.setItem(varslist[a][0], varslist[a][1]);
  }
}

retrieve = function(name) {
  var j, len, ref1, templist, x;
  if (indexOf.call(localStorage.getItem(name), ",") >= 0) {
    templist = [];
    ref1 = localStorage.getItem(name).split(",");
    for (j = 0, len = ref1.length; j < len; j++) {
      x = ref1[j];
      templist.push(parseFloat(x));
    }
    return templist;
  }
  return eval(localStorage.getItem(name));
};

incamount = retrieve("incamount");

money = retrieve("money");

moneynameacr = ["", "million", "billion", "trillion", "quadrillion", "quintillion"];

mps = retrieve("mps");

multiplier = 1;

amounts = retrieve("amounts");

costs = retrieve("costs");

origcosts = retrieve("costs");

mpsadds = retrieve("mpsadds");

buildings = ["ac", "mp", "cc", "sc", "bh"];

buildnames = ["Auto-Clicker", "Money Printer", "Counterfeit Company", "Sharemarket Crash", "Bank Heist"];

upgs = retrieve("upgs");

upgcosts = [[100, 4200], [500, 15000], [1690, 40000], [50000], [500000]];

upgeffects = [[1.5, 2.5], [2.0, 3.0], [2.0, 4.0], [3.0], [3.5]];

upgnames = [["Clicking Factories", "Iron-Clad Mice"], ["Printing Templates", "Efficient Ink Cartridges"], ["Skilled Fake Money Making", "Patented Products"], ["Fire on Wall Street"], ["Lockpicks"]];

clickupgs = retrieve("clickupgs");

clickcosts = [210, 70000];

clickeffects = [3, 10];

clicknames = ["Flexible Fingers", "More Clicks!"];

idlecheck = 0;

totalclicks = retrieve("totalclicks");

totalearned = retrieve("totalearned");

totalspent = retrieve("totalspent");

totalcrits = retrieve("totalcrits");

clicklvinfo = retrieve("clicklvinfo");

idlelvinfo = retrieve("idlelvinfo");

levelperks = retrieve("levelperks");

round = function(n, sigfigs) {
  return parseFloat(n.toFixed(sigfigs));
};

$("html").bind("keypress", function(e) {
  if (e.keyCode === 13) {
    return false;
  }
});

convertCosts = function(n) {
  var check, j, ref1;
  check = 0;
  for (a = j = 1, ref1 = moneynameacr.length - 1; 1 <= ref1 ? j <= ref1 : j >= ref1; a = 1 <= ref1 ? ++j : --j) {
    if (n >= Math.pow(10, 6 + ((a - 1) * 3))) {
      check += 1;
    }
  }
  if (check === 0) {
    return n.toFixed(1);
  } else {
    return (n / Math.pow(10, 6 + ((check - 1) * 3))).toFixed(1) + " " + moneynameacr[check];
  }
};

levelUp = function(system) {
  var outclick, outidle, randomno, temp, x;
  randomno = 0 | Math.random() * 5;
  outclick = ["Clicking Level Multiplier + 0.1!", "Critical Click Multiplier + 1!", "Chance of Crit Click increased!", "Chance of getting Item increased!", "Idle Levelling speeds increased!"];
  outidle = ["Idle Level Multiplier + 0.1!", "Random building MPS * 3!", "Costs for buildings decreased!", "Skip ahead in time by 30mins!", "Clicking Levelling speeds increased!"];
  if (randomno === 0) {
    if (system === "click") {
      levelperks[0] += 1;
    } else {
      levelperks[1] += 1;
    }
  } else if (randomno === 1) {
    if (system === "click") {
      levelperks[2] += 1;
    } else {
      buildingMult();
    }
  } else if (randomno === 2) {
    if (system === "click") {
      levelperks[3] = round(levelperks[3] * 0.99, 5);
    } else {
      [
        (function() {
          var j, len, results;
          results = [];
          for (j = 0, len = costs.length; j < len; j++) {
            x = costs[j];
            results.push(x = round(x * 0.95, 3));
          }
          return results;
        })()
      ];
    }
  } else if (randomno === 3) {
    if (system === "click") {
      levelperks[4] = round(levelperks[4] * 0.999, 5);
    } else {
      money = round(money + (mps * 1800), 3);
    }
  } else {
    if (system === "click") {
      idlelvinfo[2] = round(idlelvinfo[2] * 0.9, 3);
    } else {
      clicklvinfo[2] = round(clicklvinfo[2] * 0.9, 3);
    }
  }
  if (system === "click") {
    temp = outclick[randomno];
  } else {
    temp = outidle[randomno];
  }
  return $("#levellog").html(temp);
};

buildingMult = function() {
  var randomnobuild;
  randomnobuild = 0 | Math.random() * mpsadds.length;
  return mpsadds[randomnobuild] = round(mpsadds[randomnobuild] * 3, 3);
};

inc = function() {
  var clickcritcheck, randombuildget;
  if (Math.random() < (1 - levelperks[3])) {
    clickcritcheck = 1;
    totalcrits += 1;
    $("#crits").html("Total Crit Clicks: " + totalcrits);
  }
  if (Math.random() < (1 - levelperks[4])) {
    randombuildget = 0 | Math.random * amounts.length;
    amounts[randombuildget] += 1;
  }
  money = round(money + (incamount * (clickcritcheck === 1 ? levelperks[2] : 1)), 3);
  totalearned = round(totalearned + (incamount * (clickcritcheck === 1 ? levelperks[2] : 1)), 3);
  totalclicks += 1;
  clicklvinfo[1] += 1;
  if (clicklvinfo[1] >= clicklvinfo[2]) {
    clicklvinfo[0] += 1;
    if (clicklvinfo[0] % 5 === 0) {
      levelUp("click");
    }
    incamount = round(incamount * (1.5 + round(levelperks[0] / 10, 1)), 3);
    clicklvinfo[1] = round(clicklvinfo[1] - clicklvinfo[2], 3);
    clicklvinfo[2] = round(clicklvinfo[2] * 1.1, 3);
    $("#clicklvinfo[0]").html("Clicking: Level " + clicklvinfo[0]);
    $("#clickearns").html("Click earns: $" + incamount);
  }
  $("#clickbar").width(round(clicklvinfo[1] / clicklvinfo[2] * 100, 1) + "%");
  $("#clickxpamount").html(round(clicklvinfo[1] / clicklvinfo[2] * 100, 1) + "%");
  $("#money").html("Balance: $" + convertCosts(money));
  $("#earned").html("Total Money Earned: $" + convertCosts(totalearned));
  $("#clicks").html("Total Clicks: " + totalclicks);
  if (clickcritcheck === 1) {
    return clickcritcheck = 0;
  }
};

toggleDisplay = function(id) {
  if (id === "build") {
    $("#buildings").toggle();
    if ($("#buildings").css("display") !== "none") {
      $("#stats").hide();
      $("#statsbutton").css("background-color", "grey");
      return $("#buildbutton").css("background-color", "#5555cc");
    } else {
      return $("#buildbutton").css("background-color", "grey");
    }
  } else {
    $("#stats").toggle();
    if ($("#stats").css("display") !== "none") {
      $("#buildings").hide();
      $("#buildbutton").css("background-color", "grey");
      return $("#statsbutton").css("background-color", "#5555cc");
    } else {
      return $("#statsbutton").css("background-color", "grey");
    }
  }
};

idleInc = function() {
  var b, j, ref1;
  money = round(money + (mps / 100), 3);
  totalearned = round(totalearned + (mps / 100), 3);
  idlelvinfo[1] = round(idlelvinfo[1] + (mps / 100), 3);
  if (idlelvinfo[1] >= idlelvinfo[2]) {
    idlelvinfo[0] += 1;
    if (idlelvinfo[0] % 5 === 0) {
      levelUp("idle");
    }
    for (b = j = 0, ref1 = mpsadds.length; 0 <= ref1 ? j <= ref1 : j >= ref1; b = 0 <= ref1 ? ++j : --j) {
      mpsadds[b] = round(mpsadds[b] * (1.1 + levelperks[1]), 3);
    }
    mps = round(mps * 1.1, 3);
    idlelvinfo[1] = round(idlelvinfo[1] - idlelvinfo[2], 3);
    idlelvinfo[2] = round(idlelvinfo[2] * 2, 3);
    $("#idlelvinfo[0]").html("Idling: Level " + idlelvinfo[0]);
  }
  $("#idlebar").width(round(idlelvinfo[1] / idlelvinfo[2] * 100, 1) + "%");
  $("#idlexpamount").html(round(idlelvinfo[1] / idlelvinfo[2] * 100, 1) + "%");
  $("#money").html("Balance: $" + convertCosts(money));
  $("#earned").html("Total Money Earned: $" + convertCosts(totalearned));
  window.setTimeout(idleInc, 10);
};

buildingFunc = function(n) {
  var c, j, ref1;
  if (money >= costs[n]) {
    money -= costs[n];
    totalspent[n] = round(totalspent[n] + costs[n], 3);
    costs[n] = round(costs[n] * (Math.pow(1.15, multiplier)), 3);
    if (multiplier !== 1) {
      for (c = j = 1, ref1 = multiplier; 1 <= ref1 ? j <= ref1 : j >= ref1; c = 1 <= ref1 ? ++j : --j) {
        costs[n] = round(costs[n] + Math.pow(1.15, origcosts[n] + c), 3);
      }
    }
    amounts[n] += multiplier;
    $("#" + buildings[n] + "build").html(buildnames[n] + "<br>($" + convertCosts(costs[n]) + ")");
    mps = round(mps + (mpsadds[n] * multiplier), 1);
    $("#mps").html("$" + convertCosts(mps) + "/second");
    $("#" + buildings[n] + "stats").html("Amount: " + amounts[n] + "<br>$" + convertCosts(mpsadds[n] * amounts[n]) + "/second<br>Total Spent: $" + convertCosts(totalspent[n]));
    if (idlecheck === 0) {
      idlecheck += 1;
      idleInc();
    }
  } else {
    window.alert("You do not have enough money.");
  }
};

upgradeFunc = function(n, step) {
  if (money >= upgcosts[n][step] && amounts[n] >= 1) {
    money -= upgcosts[n][step];
    upgs[n][step] += 1;
    $("#" + buildings[n] + "upg" + (step + 1)).hide();
    if (!(indexOf.call(upgs[n], 0) >= 0)) {
      $("#" + buildings[n] + "upglist").css("height", 0);
    }
    mps += amounts[n] * (mpsadds[n] * (upgeffects[n][step] - 1));
    mpsadds[n] = round(mpsadds[n] * upgeffects[n][step], 3);
    $("#mps").html("$" + convertCosts(mps) + "/second");
  } else {
    window.alert("You do not have enough money or the required building.");
  }
};

clickUpg = function(n) {
  if (money >= clickcosts[n]) {
    money -= clickcosts[n];
    clickupgs[n] += 1;
    incamount *= clickeffects[n];
    $("#clickupg" + (n + 1)).hide();
    if (!(indexOf.call(clickupgs, 0) >= 0)) {
      $("#clickupglist").css("height", 0);
    }
    return $("#clickearns").html("Click earns: $" + incamount);
  } else {
    window.alert("You do not have enough money.");
  }
};

displayUpgs = function(n) {
  var upgtemp;
  if (n === -1) {
    upgtemp = "click";
  } else {
    upgtemp = buildings[n];
  }
  if ($("#" + upgtemp + "upglist").css("display") !== "none") {
    $("#" + upgtemp + "displayupgs").html("Open Upgrades");
    $("#" + upgtemp + "displayupgs").css("background-color", "grey");
  } else {
    $("#" + upgtemp + "displayupgs").html("Close Upgrades");
    $("#" + upgtemp + "displayupgs").css("background-color", "#5555cc");
  }
  return $("#" + upgtemp + "upglist").toggle();
};

multiplierChange = function() {
  var d, e, f, g, j, k, l, m, multipliercolours, multiplierlist, ref1, ref2, ref3, ref4, results;
  multiplierlist = [1, 10, 100];
  multipliercolours = ["orange", "yellow", "chartreuse"];
  for (d = j = 0, ref1 = costs.length - 1; 0 <= ref1 ? j <= ref1 : j >= ref1; d = 0 <= ref1 ? ++j : --j) {
    costs[d] = round(origcosts[d] * (Math.pow(1.15, amounts[d])), 3);
  }
  if (multiplier === 100) {
    multiplier = 1;
    $("#multiplier").html("x1");
    $("#multiplier").css("background-color", "orange");
  } else if (indexOf.call(multiplierlist.slice(0, 2), multiplier) >= 0) {
    multiplier = multiplierlist[multiplierlist.indexOf(multiplier) + 1];
    $("#multiplier").html("x" + multiplier);
    $("#multiplier").css("background-color", multipliercolours[multiplierlist.indexOf(multiplier)]);
    for (e = k = 1, ref2 = multiplier - 1; 1 <= ref2 ? k <= ref2 : k >= ref2; e = 1 <= ref2 ? ++k : --k) {
      for (f = l = 0, ref3 = costs.length - 1; 0 <= ref3 ? l <= ref3 : l >= ref3; f = 0 <= ref3 ? ++l : --l) {
        costs[f] = round(costs[f] + origcosts[f] * (Math.pow(1.15, amounts[f] + e)), 3);
      }
    }
  }
  results = [];
  for (g = m = 0, ref4 = buildings.length - 1; 0 <= ref4 ? m <= ref4 : m >= ref4; g = 0 <= ref4 ? ++m : --m) {
    results.push($("#" + buildings[g] + "build").html(buildnames[g] + "<br>($" + convertCosts(costs[g]) + ")"));
  }
  return results;
};

var currentzone, mobdata, mobs, zonenames;

mobs = [[["Spider", "slow"], ["Lizard", "none"], ["Ent", "poison"], ["Tree Spider", "slow/poison"]], [["Archaeologist", "none"], ["Lumberjack", "bleed"], ["Imp", "bleed"], ["Treasure Chest", "none"]], [["Wolf", "bleed"], ["Dryad", "poison"], ["Shaman", "undead"], ["Potion Master", "slow/poison/bleed"]]];

mobdata = [[1, 5, 1, 3, 2], [10, 35, 4, 10, 8], [50, 180, 15, 30, 20]];

zonenames = [["Money Forest", 3]];

currentzone = 0;

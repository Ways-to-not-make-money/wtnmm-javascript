var amounts, buildingFunc, buildings, buildnames, clickUpg, clickcosts, clickeffects, clicklevel, clicknames, clickupgs, clickxp, convertCosts, costs, displayUpgs, idleInc, idlecheck, idlelevel, idlexp, inc, incamount, money, moneynameacr, mps, mpsadds, multiplier, multiplierChange, origcosts, round, toggleDisplay, totalclicks, totalearned, totalspent, upgcosts, upgeffects, upgnames, upgradeFunc, upgs,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

incamount = 1.0;

money = 0.0;

moneynameacr = ["", "million", "billion", "trillion", "quadrillion", "quintillion"];

mps = 0.0;

multiplier = 1;

amounts = [0, 0, 0, 0, 0];

costs = [8.0, 120.0, 1337.0, 20160.0, 123456.0];

origcosts = [8.0, 120.0, 1337.0, 20160.0, 123456.0];

mpsadds = [0.1, 0.4, 3.0, 7.5, 32.1];

buildings = ["ac", "mp", "cc", "sc", "bh"];

buildnames = ["Auto-Clicker", "Money Printer", "Counterfeit Company", "Sharemarket Crash", "Bank Heist"];

upgs = [[0, 0], [0, 0], [0], [0], [0]];

upgcosts = [[100, 4200], [500, 15000], [1690, 40000], [50000], [500000]];

upgeffects = [[1.5, 2.5], [2.0, 3.0], [2.0, 4.0], [3.0], [3.5]];

upgnames = [["Clicking Factories", "Iron-Clad Mice"], ["Printing Templates", "Efficient Ink Cartridges"], ["Skilled Fake Money Making", "Patented Products"], ["Fire on Wall Street"], ["Lockpicks"]];

clickupgs = [0, 0];

clickcosts = [210, 70000];

clickeffects = [3, 10];

clicknames = ["Flexible Fingers", "More Clicks!"];

idlecheck = 0;

totalclicks = 0;

totalearned = 0;

totalspent = [0, 0, 0, 0, 0];

clicklevel = 1;

clickxp = [0.0, 100.0];

idlelevel = 1;

idlexp = [0.0, 300.0];

round = function(n, sigfigs) {
  return parseFloat(n.toFixed(sigfigs));
};

convertCosts = function(n) {
  var a, check, i, ref;
  check = 0;
  for (a = i = 1, ref = moneynameacr.length - 1; 1 <= ref ? i <= ref : i >= ref; a = 1 <= ref ? ++i : --i) {
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

inc = function() {
  money = round(money + incamount, 3);
  totalearned = round(totalearned + incamount, 3);
  totalclicks += 1;
  clickxp[0] += 1;
  if (clickxp[0] >= clickxp[1]) {
    clicklevel += 1;
    incamount = round(incamount * 1.5, 3);
    clickxp[0] = round(clickxp[0] - clickxp[1], 3);
    clickxp[1] = round(clickxp[1] * 1.1, 3);
    $("#clicklevel").html("Clicking: Level " + clicklevel);
    $("#clickearns").html("Click earns: $" + incamount);
  }
  $("#clickbar").width(round(clickxp[0] / clickxp[1] * 100, 1) + "%");
  $("#clickxpamount").html(round(clickxp[0] / clickxp[1] * 100, 1) + "%");
  $("#money").html("Balance: $" + convertCosts(money));
  $("#earned").html("Total Money Earned: $" + convertCosts(totalearned));
  return $("#clicks").html("Total Clicks: " + totalclicks);
};

toggleDisplay = function(id) {
  if (id === "build") {
    $("#buildings").toggle();
    if ($("#buildings").css("display" !== "none")) {
      $("#stats").hide();
      $("#statsbutton").css("background-color", "grey");
      return $("#buildbutton").css("background-color", "#5555cc");
    } else {
      return $("#buildbutton").css("background-color", "grey");
    }
  } else {
    $("#stats").toggle();
    if ($("#stats").css("display" !== "none")) {
      $("#buildings").hide();
      $("#buildbutton").css("background-color", "grey");
      return $("#statsbutton").css("background-color", "#5555cc");
    } else {
      return $("#statsbutton").css("background-color", "grey");
    }
  }
};

idleInc = function() {
  var b, i, ref;
  money = round(money + (mps / 100), 3);
  totalearned = round(totalearned + (mps / 100), 3);
  idlexp[0] = round(idlexp[0] + (mps / 100), 3);
  if (idlexp[0] >= idlexp[1]) {
    idlelevel += 1;
    for (b = i = 0, ref = mpsadds.length; 0 <= ref ? i <= ref : i >= ref; b = 0 <= ref ? ++i : --i) {
      mpsadds[b] = round(mpsadds[b] * 1.1, 3);
    }
    mps = round(mps * 1.1, 3);
    idlexp[0] = round(idlexp[0] - idlexp[1], 3);
    idlexp[1] = round(idlexp[1] * 1.5, 3);
    $("#idlelevel").html("Idling: Level " + idlelevel);
  }
  $("#idlebar").width(round(idlexp[0] / idlexp[1] * 100, 1) + "%");
  $("#idlexpamount").html(round(idlexp[0] / idlexp[1] * 100, 1) + "%");
  $("#money").html("Balance: $" + convertCosts(money));
  $("#earned").html("Total Money Earned: $" + convertCosts(totalearned));
  window.setTimeout(idleInc, 10);
};

buildingFunc = function(n) {
  var c, i, ref;
  if (money >= costs[n]) {
    money -= costs[n];
    totalspent[n] = round(totalspent[n] + costs[n], 3);
    costs[n] = round(costs[n] * (Math.pow(1.15, multiplier)), 3);
    if (multiplier !== 1) {
      for (c = i = 1, ref = multiplier; 1 <= ref ? i <= ref : i >= ref; c = 1 <= ref ? ++i : --i) {
        costs[n] = round(costs[n] + Math.pow(1.15, origcosts[n] + c), 3);
      }
    }
    amounts[n] += multiplier;
    $("#" + buildings[n] + "build").html(buildnames[n] + "<br>($" + convertCosts(costs[n]) + ")");
    mps = round(mps + mpsadds[n], 1);
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
    $("#" + buildings[n] + "upg" + (step + 1)).css("margin-bottom", "0");
    $("#" + buildings[n] + "upg" + (step + 1)).hide();
    mps += amounts[n] * (mpsadds[n] * (upgeffects[n][step] - 1));
    mpsadds[n] = round(mpsadds[n] * upgeffects[n][step], 3);
    $("#mps").html("$" + convertCosts(mps) + "/second");
  } else {
    window.alert("You do not have enough money.");
  }
};

clickUpg = function(n) {
  if (money >= clickcosts[n]) {
    money -= clickcosts[n];
    clickupgs[n] += 1;
    incamount *= clickeffects[n];
    $("#clickupg" + (n + 1)).css("margin-bottom", "0");
    return $("#clickupg" + (n + 1)).hide();
  } else {
    return window.alert("You do not have enough money.");
  }
};

displayUpgs = function(n) {
  var upgtemp;
  if (n === -1) {
    upgtemp = "click";
  } else {
    upgtemp = buildings[n];
  }
  if ($("#" + upgtemp + "upglist").css("display" !== "none")) {
    $("#" + upgtemp + "displayupgs").html("Open Upgrades");
    $("#" + upgtemp + "displayupgs").css("background-color", "grey");
  } else {
    $("#" + upgtemp + "displayupgs").html("Close Upgrades");
    $("#" + upgtemp + "displayupgs").css("background-color", "#5555cc");
  }
  return $("#" + upgtemp + "upglist").toggle();
};

multiplierChange = function() {
  var d, e, f, g, i, j, k, l, multipliercolours, multiplierlist, ref, ref1, ref2, ref3, results;
  multiplierlist = [1, 10, 100];
  multipliercolours = ["orange", "yellow", "chartreuse"];
  for (d = i = 0, ref = costs.length - 1; 0 <= ref ? i <= ref : i >= ref; d = 0 <= ref ? ++i : --i) {
    costs[d] = round(origcosts[d] * (Math.pow(1.15, amounts[d])), 3);
  }
  if (multiplier === 100) {
    multiplier = 1;
    $("#multiplier").html("x1");
    $("#multiplier").css("background-color", "orange");
  } else if (indexOf.call(multiplierlist.slice(0, 2), multiplier) >= 0) {
    multiplier = multiplierlist[multiplierlist.indexOf(multiplier + 1)];
    $("#multiplier").html("x" + multiplier);
    $("#multiplier").css("background-color", multipliercolours[multiplierlist.indexOf(multiplier)]);
    for (e = j = 1, ref1 = multiplier - 1; 1 <= ref1 ? j <= ref1 : j >= ref1; e = 1 <= ref1 ? ++j : --j) {
      for (f = k = 0, ref2 = costs.length - 1; 0 <= ref2 ? k <= ref2 : k >= ref2; f = 0 <= ref2 ? ++k : --k) {
        costs[f] = round(costs[f] + origcosts[f] * (Math.pow(1.15, amounts[f] + e)), 3);
      }
    }
  }
  results = [];
  for (g = l = 0, ref3 = buildings.length - 1; 0 <= ref3 ? l <= ref3 : l >= ref3; g = 0 <= ref3 ? ++l : --l) {
    results.push($("#" + buildings[g] + "build").html(buildnames[g] + "<br>($" + convertCosts(costs[g]) + ")"));
  }
  return results;
};

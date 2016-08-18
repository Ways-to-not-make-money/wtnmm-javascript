# General
incamount = 1.0
money = 0.0
moneynameacr = ["", "million", "billion", "trillion", "quadrillion",
                "quintillion"]
mps = 0.0
multiplier = 1

# Building Lists
amounts = [0, 0, 0, 0, 0]
costs = [8.0, 120.0, 1337.0, 20160.0, 123456.0]
origcosts = [8.0, 120.0, 1337.0, 20160.0, 123456.0]
mpsadds = [0.1, 0.4, 3.0, 7.5, 32.1]
buildings = ["ac", "mp", "cc", "sc", "bh"]
buildnames = ["Auto-Clicker", "Money Printer", "Counterfeit Company",
              "Sharemarket Crash", "Bank Heist"]

# Upgrade Lists
upgs = [[0, 0], [0, 0], [0], [0], [0]]
upgcosts = [[100, 4200], [500, 15000], [1690, 40000], [50000], [500000]]
upgeffects = [[1.5, 2.5], [2.0, 3.0], [2.0, 4.0], [3.0], [3.5]]
upgnames = [["Clicking Factories", "Iron-Clad Mice"],
            ["Printing Templates", "Efficient Ink Cartridges"],
            ["Skilled Fake Money Making", "Patented Products"],
            ["Fire on Wall Street"], ["Lockpicks"]]

# Click Upgrade Lists
clickupgs = [0, 0]
clickcosts = [210, 70000]
clickeffects = [3, 10]
clicknames = ["Flexible Fingers", "More Clicks!"]

# Launch Checks
idlecheck = 0

# Stats
totalclicks = 0
totalearned = 0
totalspent = [0, 0, 0, 0, 0]

# Levelling
clicklevel = 1
clickxp = [0.0, 100.0]
idlelevel = 1
idlexp = [0.0, 300.0]

clicklevelmult = 0.0
clickcritchance = 0.9
clickcrit = 3
buildcrit = 0.999
idlelevelmult = 0.0

round = (n, sigfigs) ->
  return parseFloat n.toFixed sigfigs

convertCosts = (n) ->
  check = 0
  for a in [1..moneynameacr.length - 1]
    if n >= 10 ** (6 + ((a - 1) * 3))
      check += 1
  if check == 0
    return n.toFixed(1)
  else
    return (n / 10 ** (6 + ((check - 1) * 3))).toFixed(1) +
           " " + moneynameacr[check]

levelUp = (system) ->
  randomno = 0 | Math.random() * 5
  outclick = ["Clicking Level Multiplier + 0.1!",
              "Critical Click Multiplier + 1!",
              "Chance of Crit Click increased!",
              "Chance of getting Item increased!",
              "Idle Levelling speeds increased!"]
  outidle = ["Idle Level Multiplier + 0.1!",
             "Random building MPS * 3!",
             "Costs for buildings decreased!",
             "Skip ahead in time by 30mins!"
             "Clicking Levelling speeds increased!"]
  if randomno == 0
    if system == "click" then clicklevelmult += 1 else idlelevelmult += 1
  else if randomno == 1
    if system == "click" then clickcrit += 1 else buildingMult()
  else if randomno == 2
    if system == "click" then clickcritchance = round(clickcritchance * 0.99, 5) else [x = round(x * 0.95, 3) for x in costs]
  else if randomno == 3
    if system == "click" then buildcrit = round(buildcrit * 0.999, 5) else money = round(money + (mps * 1800), 3)
  else
    if system == "click" then idlexp[1] = round(idlexp[1] * 0.9, 3) else clickxp[1] = round(clickxp[1] * 0.9, 3)
  if system == "click" then temp = outclick[randomno] else temp = outidle[randomno]
  $("#levellog").html temp

buildingMult = ->
  randomnobuild = 0 | Math.random() * mpsadds.length
  mpsadds[randomnobuild] = round mpsadds[randomnobuild] * 3, 3

# Main Button - increment for clicking
inc = ->
  if Math.random() < (1 - clickcritchance)
    clickcritcheck = 1
  if Math.random() < (1 - buildcrit)
    randombuildget = 0 | Math.random * amounts.length
    amounts[randombuildget] += 1
  money = round money + (incamount * (if clickcritcheck == 1 then clickcrit else 1)), 3
  totalearned = round totalearned + incamount, 3
  totalclicks += 1
  clickxp[0] += 1
  if clickxp[0] >= clickxp[1]
    clicklevel += 1
    if clicklevel % 5 == 0
      levelUp("click")
    incamount = round incamount * (1.5 + round(clicklevelmult / 10, 1)), 3
    clickxp[0] = round clickxp[0] - clickxp[1], 3
    clickxp[1] = round clickxp[1] * 1.1, 3
    $("#clicklevel").html "Clicking: Level " + clicklevel
    $("#clickearns").html "Click earns: $" + incamount
  $("#clickbar").width round(clickxp[0] / clickxp[1] * 100, 1) + "%"
  $("#clickxpamount").html round(clickxp[0] / clickxp[1] * 100, 1) + "%"
  $("#money").html "Balance: $" + convertCosts money
  $("#earned").html "Total Money Earned: $" + convertCosts totalearned
  $("#clicks").html "Total Clicks: " + totalclicks
  if clickcritcheck == 1
    clickcritcheck = 0

# Toggles the display for buildings, upgrades, and stats.
toggleDisplay = (id) ->
  if id == "build"
    $("#buildings").toggle()
    if $("#buildings").css("display") != "none"
      $("#stats").hide()
      $("#statsbutton").css "background-color", "grey"
      $("#buildbutton").css "background-color", "#5555cc"
    else
      $("#buildbutton").css "background-color", "grey"
  else
    $("#stats").toggle()
    if $("#stats").css "display" != "none"
      $("#buildings").hide()
      $("#buildbutton").css "background-color", "grey"
      $("#statsbutton").css "background-color", "#5555cc"
    else
      $("#statsbutton").css "background-color", "grey"

# Idle increments
idleInc = ->
  money = round money + (mps / 100), 3
  totalearned = round totalearned + (mps / 100), 3
  idlexp[0] = round idlexp[0] + (mps / 100), 3
  if idlexp[0] >= idlexp[1]
    idlelevel += 1
    if idlelevel % 5 == 0
      levelUp("idle")
    for b in [0..mpsadds.length]
      mpsadds[b] = round mpsadds[b] * (1.1 + idlelevelmult), 3
    mps = round((mps * 1.1), 3)
    idlexp[0] = round idlexp[0] - idlexp[1], 3
    idlexp[1] = round idlexp[1] * 1.5, 3
    $("#idlelevel").html "Idling: Level " + idlelevel
  $("#idlebar").width round(idlexp[0] / idlexp[1] * 100, 1) + "%"
  $("#idlexpamount").html round(idlexp[0] / idlexp[1] * 100, 1) + "%"
  $("#money").html "Balance: $" + convertCosts money
  $("#earned").html "Total Money Earned: $" + convertCosts totalearned
  window.setTimeout idleInc, 10
  return

# Money system for buildings
buildingFunc = (n) ->
  if money >= costs[n]
    money -= costs[n]
    totalspent[n] = round totalspent[n] + costs[n], 3
    costs[n] = round costs[n] * (1.15 ** multiplier), 3
    if multiplier != 1
      for c in [1..multiplier]
        costs[n] = round costs[n] + 1.15 ** (origcosts[n] + c), 3
    amounts[n] += multiplier
    $("#" + buildings[n] + "build").html buildnames[n] + "<br>($" +
                                         convertCosts(costs[n]) + ")"
    mps = round((mps + (mpsadds[n] * multiplier)), 1)
    $("#mps").html "$" + convertCosts(mps) + "/second"
    $("#" + buildings[n] + "stats").html "Amount: " + amounts[n] + "<br>$" +
                                         convertCosts(mpsadds[n] * amounts[n]) +
                                         "/second<br>Total Spent: $" +
                                         convertCosts totalspent[n]
    if idlecheck == 0
      idlecheck += 1
      idleInc()
      return
  else
    window.alert "You do not have enough money."
    return

# Money system for upgrades
upgradeFunc = (n, step) ->
  if money >= upgcosts[n][step] and amounts[n] >= 1
    money -= upgcosts[n][step]
    upgs[n][step] += 1
    $("#" + buildings[n] + "upg" + (step + 1)).css "margin-bottom", "0"
    $("#" + buildings[n] + "upg" + (step + 1)).hide()
    mps += amounts[n] * (mpsadds[n] * (upgeffects[n][step] - 1))
    mpsadds[n] = round mpsadds[n] * upgeffects[n][step], 3
    $("#mps").html "$" + convertCosts(mps) + "/second"
    return
  else
    window.alert "You do not have enough money or the required building."
    return

clickUpg = (n) ->
  if money >= clickcosts[n]
    money -= clickcosts[n]
    clickupgs[n] += 1
    incamount *= clickeffects[n]
    $("#clickupg" + (n + 1)).css "margin-bottom", "0"
    $("#clickupg" + (n + 1)).hide()
  else
    window.alert "You do not have enough money."

# Displays upgrades.
displayUpgs = (n) ->
  if n == -1
    upgtemp = "click"
  else
    upgtemp = buildings[n]
  if $("#" + upgtemp + "upglist").css("display") != "none"
    $("#" + upgtemp + "displayupgs").html "Open Upgrades"
    $("#" + upgtemp + "displayupgs").css "background-color", "grey"
  else
    $("#" + upgtemp + "displayupgs").html "Close Upgrades"
    $("#" + upgtemp + "displayupgs").css "background-color", "#5555cc"
  $("#" + upgtemp + "upglist").toggle()

multiplierChange = ->
  multiplierlist = [1, 10, 100]
  multipliercolours = ["orange", "yellow", "chartreuse"]
  for d in [0..costs.length - 1]
    costs[d] = round origcosts[d] * (1.15 ** amounts[d]), 3
  if multiplier == 100
    multiplier = 1
    $("#multiplier").html "x1"
    $("#multiplier").css "background-color", "orange"
  else if multiplier in multiplierlist[..1]
    multiplier = multiplierlist[multiplierlist.indexOf(multiplier) + 1]
    $("#multiplier").html "x" + multiplier
    $("#multiplier").css "background-color",
                         multipliercolours[multiplierlist.indexOf(multiplier)]
    for e in [1..multiplier - 1]
      for f in [0..costs.length - 1]
        costs[f] = round costs[f] + origcosts[f] * (1.15 ** (amounts[f] + e)), 3
  for g in [0..buildings.length - 1]
    $("#" + buildings[g] + "build").html buildnames[g] + "<br>($" +
                                         convertCosts(costs[g]) + ")"

/****************************************************************************
 * This document is kinda long, almost 4000 lines,
 * so let me give you a quick overview of how it is structured
 * 
 * ACTION BUTTONS
 * the app accepts 4 inputs: I bought it, I did it, i didn't do it, Make a goal
 * the goal input extends to a date and time picker,
 * the bought input extends to accept an amount of money,
 * the did and didn't inputs take no additional parameters.
 * 
 * NOTIFICATIONS
 * The app communicates with the users via notifications
 * These notifications can also have response tools included in them, to garner further information from a user,
 * for example, upon returning to the app after a goal has finished, the app will prompt users (with a notificaiton)
 * to confirm they completed the goal, or else give them a new date input to enter in the approximate date the goal actually ended.
 * 
 * MAIN APP PAGES
 * There are 4 main pages (tab-content) in the app: 
 * Baseline (questionnaire), (Weekly) Reports, (Live) Statistics, and Settings.
 * 
 * Baseline allows users to input their relationship to a habit (that they chose to track),
 * at the moment (or within the first week) that they start using Escrave.
 * 
 * Reports generate a day to day breakdown of action button clicks,
 * Comparing your usage with what you entered into your baseline questionnaire. 
 * Reports are broken up into week long segments
 *  
 * Clicking any of the action buttons takes users to the Statistics page.
 * Many of the functions in this file are dedicated to update this data onLoad, onClick, in local memory, in storage.
 * Each type of click has a live timer, which is kept in sync even if users close the site, or go inactive.
 * Statistics are shown or hidden based on if they have a relevant value, 
 * there's a function to show relevant statistics, and one to hide them if there isn't enough data for them to be relevant.
 * Many of the functions are related to formatting and displaying statistics about user input, especially to handle goal completion.
 * onLoad, there is a check if a goal has completed since the user has visited the site,
 * if a goal has ended, they are prompted to either confirm the goal as complete, or to mark the date their goal really ended.
 * Any completed goal will populate into a list of completed goals, demonstrating amount of time spent and when the goal ended.
 * 
 * Finally, there is a settings page where users can access some basic controls for the app:
 * a button that removes the last click action in storage (UNDO), 
 * a button to completely wipe storage (START OVER), 
 * a button to read more about the app - which takes the user to the main marketing site (about Escrave),
 * and a button to give feedback about the app (give feedback).
 * Aditionally, the settings page lists every type of statistic possible to be displayed by Escrave, 
 * with a checkbox next to them to decide whether or not to display it.
 * 
 * 
 * and finally - the software license
 * 
 * MIT License

Copyright (c) 2021 Corey Boiko

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*********************************************************************************/
var welcomeHome;

$(document).ready(function () {
    //CLIENT CAN USE STORAGE SYSTEM - html5
    if (typeof (Storage) !== "undefined") {
        //local working data to use in app
        var json = {
            "statistics": {
                "cost": {
                    "sinceTimerStart": {
                        "totalSeconds": 0,
                        "days": 0,
                        "hours": 0,
                        "minutes": 0,
                        "seconds": 0
                    },
                    "clickCounter": 0,
                    "totals": {
                        "total": 0, 
                        "week": 0, 
                        "Month": 0, 
                        "year": 0
                    },
                    "firstClickStamp": 0,
                    "lastClickStamp": 0,
                    "averageBetweenClicks": 0
                },
                "use": {
                    "sinceTimerStart": {
                        "totalSeconds": 0,
                        "days": 0,
                        "hours": 0,
                        "minutes": 0,
                        "seconds": 0
                    },
                    "clickCounter": 0,
                    "craveCounter": 0,
                    "cravingsInARow": 0,
                    "firstClickStamp": 0,
                    "lastClickStamp": 0,
                    "lastClickStampCrave": 0,
                    "averageBetweenClicks": 0
                },
                "goal": {
                    "untilTimerEnd": {
                        "totalSeconds": 0,
                        "days": 0,
                        "hours": 0,
                        "minutes": 0,
                        "seconds": 0
                    },
                    "clickCounter": 0,
                    "lastClickStamp": 0,
                    "bestTimeSeconds": 0,
                    "completedGoals": 0,
                    "activeGoalUse": 0,
                    "activeGoalBought": 0,
                    "activeGoalBoth": 0
                }
            },
            "baseline": {
                "specificSubject": false,
                "decreaseHabit": true,
                "useStatsIrrelevant": false,
                "costStatsIrrelevant": false,
                "amountDonePerWeek": 0,
                "goalDonePerWeek": 0,
                "amountSpentPerWeek": 0,
                "goalSpentPerWeek": 0,
                "valuesTime": true,
                "valuesMoney": true,
                "valuesHealth": true,
                
            },
            "option": {
                "activeTab": "reports-content",
                "liveStatsToDisplay": {
                    "goalButton": true,
                    "untilGoalEnd": true,
                    "longestGoal": true,
                    "usedButton": true,
                    "usedGoalButton": true,
                    "cravedButton": true,
                    "sinceLastDone": true,
                    "avgBetweenDone": true,
                    "didntPerDid": true,
                    "resistedInARow": true,
                    "spentButton": true,
                    "boughtGoalButton": true,
                    "sinceLastSpent": true,
                    "avgBetweenSpent": true,
                    "totalSpent": true,
                    "currWeekSpent": true,
                    "currMonthSpent": true,
                    "currYearSpent": true
                },
                "logItemsToDisplay": {
                    "goal": true,
                    "used": true,
                    "craved": true,
                    "bought": true
                },
                "reportItemsToDisplay": {
                    "useChangeVsBaseline": false,
                    "useChangeVsLastWeek": true,
                    "costChangeVsBaseline": false,
                    "costChangeVsLastWeek": true,
                    "useGoalVsThisWeek": false,
                    "costGoalVsThisWeek": false
                }
            },
            "report": {
                "minEndStamp": 0,
                "activeEndStamp": 0,
                "maxEndStamp": 0,
            }
        };

        //open local storage, make it into an object
        function retrieveStorageObject(key) {
            //convert localStorage to json
            if (key) {
                var currJsonString = localStorage[key];
                var jsonObject = JSON.parse(currJsonString);
            } else {
                var currJsonString = localStorage.esCrave;
                var jsonObject = JSON.parse(currJsonString);
            }
            return jsonObject;
        }

        //stringify object, write it to localstorage
        function setStorageObject(object) {
            var jsonString = JSON.stringify(object);
            localStorage.esCrave = jsonString;
        }

        //get configuration from storage
        function setOptionsFromStorage() {
            var jsonObject = retrieveStorageObject();
            json.option.activeTab = jsonObject.option.activeTab;

            //set remembered variables for settings page 
            //display logic
            json.option.liveStatsToDisplay = jsonObject.option.liveStatsToDisplay;
            json.option.logItemsToDisplay = jsonObject.option.logItemsToDisplay;
            json.option.reportItemsToDisplay = jsonObject.option.reportItemsToDisplay;

            //SETTINGS PAGE INITIAL DISPLAY
            //LIVE STATS
            for (var key in json.option.liveStatsToDisplay) {
                $("#" + key + "Displayed").prop('checked', json.option.liveStatsToDisplay[key]);
            }

            //HABIT LOG
            for (var key in json.option.logItemsToDisplay) {
                $("#" + key + "RecordDisplayed").prop('checked', json.option.logItemsToDisplay[key]);
            }
            //WEEKLY REPORT
            for (var key in json.option.reportItemsToDisplay) {
                $("#" + key + "Displayed").prop('checked', json.option.reportItemsToDisplay[key]);
            }
            //baseline questionnaire
            json.baseline = jsonObject.baseline;

            if(json.baseline.userSubmitted) {
                $(".baseline-questionnaire").removeClass("show");
                $(".baseline-questionnaire-heading").attr("aria-expanded", "false");
                $(".displayed-statistics").addClass("show");
                $(".displayed-statistics-heading").attr("aria-expanded", "true");

                $(".displayed-statistics-heading").show();
            } else {
                $(".displayed-statistics-heading").hide();

            }

            //populate fields on form with existing values
            if(json.baseline.userSubmitted && json.baseline.decreaseHabit) {
                $("input.decreaseHabit").prop('checked', true)

            } else if(json.baseline.userSubmitted && !json.baseline.decreaseHabit) {
                $("input.increaseHabit").prop('checked', true)
            }
            
            if(json.baseline.userSubmitted && json.baseline.valuesTime) {
                $("input.valuesTime").prop('checked', true)
            }
            if(json.baseline.userSubmitted && json.baseline.valuesMoney) {
                $("input.valuesTime").prop('checked', true)
            }
            if(json.baseline.userSubmitted && json.baseline.valuesHealth) {
                $("input.valuesHealth").prop('checked', true)
            }
            
            if ($.isNumeric(json.baseline.amountSpentPerWeek) && json.baseline.amountSpentPerWeek != 0) {
                $("input.amountSpentPerWeek").val(parseInt(json.baseline.amountSpentPerWeek, 10));
            }
            if ($.isNumeric(json.baseline.goalSpentPerWeek) && json.baseline.goalSpentPerWeek != 0) {
                $("input.goalSpentPerWeek").val(parseInt(json.baseline.goalSpentPerWeek, 10));
            }
            if ($.isNumeric(json.baseline.amountDonePerWeek) && json.baseline.amountDonePerWeek != 0) {
                $("input.amountDonePerWeek").val(parseInt(json.baseline.amountDonePerWeek, 10));
            }
            if ($.isNumeric(json.baseline.goalDonePerWeek) && json.baseline.goalDonePerWeek != 0) {
                $("input.goalDonePerWeek").val(parseInt(json.baseline.goalDonePerWeek, 10));
            }

            //recheck Not Applicable boxes
            if (json.baseline.useStatsIrrelevant == true) {
                $("#doneNA").prop('checked', true);
                $("#goalDoneNA").prop('checked', true);
            }
            if (json.baseline.costStatsIrrelevant === true) {
                $("#spendingNA").prop('checked', true);
                $("#goalSpentNA").prop('checked', true);
            }
            if (JSON.parse(json.baseline.specificSubject)) {
                $($(".baseline-questionnaire .question-set")[0]).addClass("d-none");
                $($(".baseline-questionnaire .question-set")[1]).removeClass("d-none");
                $(".displayed-statistics").removeClass("d-none");
            }
            if (JSON.parse(json.baseline.decreaseHabit)) {
                $(".desires-decrease").removeClass("d-none");
                $(".desires-increase").addClass("d-none");
            } else {
                $(".desires-decrease").addClass("d-none");
                $(".desires-increase").removeClass("d-none");

            }
        }

        //SET STATS FROM STORAGE
        //set initial values in app			 
        function setStatsFromRecords() {
            var jsonObject = retrieveStorageObject();
            var timeNow = Math.round(new Date() / 1000);

            /* USE STATISTICS */
            //total USE actions
            var useTabActions = jsonObject.action.filter(function (e) {
                return e.clickType == "used" || e.clickType == "craved";
            });

            //total uses
            var useCount = jsonObject.action.filter(function (e) {
                return e.clickType == "used";
            });
            useCount = useCount.sort( (a, b) => {
                return parseInt(a.timestamp) > parseInt(b.timestamp) ? 1 : -1;
            })
            json.statistics.use.clickCounter = useCount.length;

            //Restart timer value
            if (useCount.length > 0) {
                var sinceLastUse = useCount[useCount.length - 1].timestamp;
                restartTimerAtValues("use", sinceLastUse);

                //average time between uses	
                var totalTimeBetweenUses = useCount[useCount.length - 1].timestamp - useCount[0].timestamp,
                    averageTimeBetweenUses = Math.round(totalTimeBetweenUses / (useCount.length - 1));

                if ($.isNumeric(averageTimeBetweenUses)) {
                    json.statistics.use.averageBetweenClicks = averageTimeBetweenUses;
                }
                //used to calculate avg time between from json obj, live
                json.statistics.use.firstClickStamp = useCount[0].timestamp;
                //timestamp of most recent click - to limit clicks in a row
                json.statistics.use.lastClickStamp = useCount[useCount.length - 1].timestamp;
            }

            //total craves
            var craveCount = jsonObject.action.filter(function (e) {
                return e.clickType == "craved";
            });
            json.statistics.use.craveCounter = craveCount.length;

            //craves in a row
            var cravesInARow = 0;
            for (var i = useTabActions.length - 1; i >= 0; i--) {
                if (useTabActions[i].clickType == "craved") {
                    cravesInARow++;
                } else {
                    break;
                }
            }
            //update display	
            $("#cravingsResistedInARow").html(cravesInARow);
            //update json
            json.statistics.use.cravingsInARow = cravesInARow;

            //timestamp of most recent click - to limit clicks in a row
            if (craveCount.length > 0) {
                json.statistics.use.lastClickStampCrave = craveCount[craveCount.length - 1].timestamp;
            }

            //avg craves per smoke
            var avgDidntPerDid = Math.round(craveCount.length / useCount.length * 10) / 10;
            //don't forget to call updates from clicking smoke and crave button
            $("#avgDidntPerDid").html(avgDidntPerDid);

            /* COST STATISTICS */
            //total boughts
            var boughtCount = jsonObject.action.filter(function (e) {
                return e.clickType == "bought";
            });
            json.statistics.cost.clickCounter = boughtCount.length;

            //Restart timer value
            if (boughtCount.length > 0) {
                var sinceLastBought = boughtCount[boughtCount.length - 1].timestamp;
                restartTimerAtValues("cost", sinceLastBought);

                //average time between boughts
                var totalTimeBetweenBoughts = boughtCount[boughtCount.length - 1].timestamp - boughtCount[0].timestamp,
                    averageTimeBetweenBoughts = Math.round(totalTimeBetweenBoughts / (boughtCount.length));

                if ($.isNumeric(averageTimeBetweenBoughts)) {
                    json.statistics.cost.averageBetweenClicks = averageTimeBetweenBoughts;
                }

                //used to calculate avg time between from json obj, live
                json.statistics.cost.firstClickStamp = boughtCount[0].timestamp;
                //timestamp of most recent click - to limit clicks in a row
                json.statistics.cost.lastClickStamp = boughtCount[boughtCount.length - 1].timestamp;
            }

            //calculate timestamps for past week
            var oneWeekAgoTimeStamp = timeNow - (60 * 60 * 24 * 7);
                oneMonthAgoTimeStamp = timeNow - (60 * 60 * 24 * 30);
                oneYearAgoTimeStamp = timeNow - (60 * 60 * 24 * 365);

            var runningTotalCost = 0,
                runningTotalCostWeek = 0,
                runningTotalCostMonth = 0,
                runningTotalCostYear = 0;

            for (var i = boughtCount.length - 1; i >= 0; i--) {
                //update every bought record into running total
                runningTotalCost = runningTotalCost + parseInt(boughtCount[i].spent);

                if (boughtCount[i].timestamp > oneWeekAgoTimeStamp) {
                    //update running week only with timestamps from past week
                    runningTotalCostWeek = runningTotalCostWeek + parseInt(boughtCount[i].spent);
                }
                if (boughtCount[i].timestamp > oneMonthAgoTimeStamp) {
                    //update any record in last month into running total month
                    runningTotalCostMonth = runningTotalCostMonth + parseInt(boughtCount[i].spent);
                }
                if (boughtCount[i].timestamp > oneYearAgoTimeStamp) {
                    //update any record in last month into running total month
                    runningTotalCostYear = runningTotalCostYear + parseInt(boughtCount[i].spent);
                }
            }
            
            $("#totalAmountSpent").html("$" + runningTotalCost);
            $("#spentThisWeek").html("$" + runningTotalCostWeek);
            $("#spentThisMonth").html("$" + runningTotalCostMonth);
            $("#spentThisYear").html("$" + runningTotalCostYear);

            //update json
            json.statistics.cost.totals = {
                total: runningTotalCost, 
                week: runningTotalCostWeek, 
                month: runningTotalCostMonth, 
                year: runningTotalCostYear
            };

            // json.statistics.cost.total = runningTotalCost;
            // json.statistics.cost.thisWeek = runningTotalCostWeek;
            // json.statistics.cost.thisMonth = runningTotalCostMonth;
            // json.statistics.cost.thisYear = runningTotalCostYear;

            /* GOAL STATISTICS*/
            var goalCount = jsonObject.action.filter(function (e) {
                return e.clickType == "goal";
            });
            //goal status
            //1 == active goal
            //2 == partially completed goal
            //3 == completed goal

            if (goalCount.length > 0) {
                var activeGoals = goalCount.filter(function (e) { return e.status == 1 });
                var inactiveGoals = goalCount.filter(function (e) { return e.status == 2 || e.status == 3 });

                //timestamp of most recent click - to limit clicks in a row
                json.statistics.goal.lastClickStamp = goalCount[goalCount.length - 1].timestamp;
                json.statistics.goal.clickCounter = goalCount.length;

                if (activeGoals.length > 0) {
                    var mostRecentGoal = activeGoals[activeGoals.length - 1];

                    //set var in json for if there is an active goal of X type - 
                    //to be used on click of relevant buttons to end goal
                    if (mostRecentGoal.goalType == "both") {
                        json.statistics.goal.activeGoalBoth = 1;
                    } else if (mostRecentGoal.goalType == "use") {
                        json.statistics.goal.activeGoalUse = 1;
                    } else if (mostRecentGoal.goalType == "bought") {
                        json.statistics.goal.activeGoalBought = 1;
                    }

                    var totalSecondsUntilGoalEnd = mostRecentGoal.goalStamp - timeNow;
                    if (totalSecondsUntilGoalEnd > 0) {
                        loadGoalTimerValues(totalSecondsUntilGoalEnd);
                        initiateGoalTimer();
                    } else {
                        //goal ended ewhile user was away
                        var mostRecentGoal = goalCount[goalCount.length - 1];
                        createGoalEndNotification(mostRecentGoal);
                        //last made goal time has concluded
                        $("#goal-content .timer-recepticle").hide();
                    }
                } else {
                    //hide empty timer when last goal has ended
                    $("#goal-content .timer-recepticle").hide();
                }

                if (inactiveGoals.length > 0) {
                    //number of goals Completed
                    json.statistics.goal.completedGoals = inactiveGoals.length;
                    //used for finding longest goal completed
                    var largestDiff = 0;

                    //iterate through goals for longest goal
                    for (var i = 0; i < inactiveGoals.length; i++) {
                        var currStartStamp = inactiveGoals[i].timestamp,
                            currEndStamp = inactiveGoals[i].goalStopped;

                        //find longest completed goal
                        var currDiff = currEndStamp - currStartStamp;
                        if (largestDiff < currDiff) {
                            largestDiff = currDiff;
                        }
                    }

                    json.statistics.goal.completedGoals = inactiveGoals.length;
                    $("#numberOfGoalsCompleted").html(json.statistics.goal.completedGoals);
                    json.statistics.goal.bestTimeSeconds = largestDiff;
                    $("#longestGoalCompleted").html(json.statistics.goal.bestTimeSeconds);
                }
            }

            //NEEEWWWWW USERRR
            if ((useCount == 0 && craveCount == 0 && boughtCount == 0 && goalCount == 0) &&
                (json.baseline.specificSubject == false)) {
                var introMessage = "<b>Welcome back!</b> - Try clicking some stuff this time! You can undo anything in the settings:";
                var responseTools = '<button class="btn btn-md btn-outline-info clear-notification" onClick="$(\'#settings-tab-toggler\').click();">' +
                    "App Settings</button>";
                createNotification(introMessage, responseTools);

            } else {
                /* ADD ACTIONS INTO LOG */
                var allActions = jsonObject.action.filter(function (e) {
                    return e.clickType == "used" ||
                        e.clickType == "craved" ||
                        e.clickType == "bought" ||
                        (e.clickType == "goal" && (e.status == 2 || e.status == 3));
                });
                allActions = allActions.sort( (a, b) => {
                    return parseInt(a.timestamp) > parseInt(b.timestamp) ? 1 : -1;
                })

                /* only display a certain number of actions per page */
                var actionsToAddMax = allActions.length - 1,
                    actionsToAddMin = allActions.length - 10;

                function addMoreIntoHabitLog() {
                    if (actionsToAddMax >= 0) {
                        for (var i = actionsToAddMax; i >= actionsToAddMin && i >= 0; i--) {

                            var currClickStamp = allActions[i].timestamp,
                                currClickType = allActions[i].clickType,
                                currClickCost = null,
                                currGoalEndStamp = -1,
                                currGoalType = "";

                            if (currClickType == "used" || currClickType == "craved") {
                                placeActionIntoLog(currClickStamp, currClickType, currClickCost, true);

                            } else if (currClickType == "bought") {
                                currClickCost = allActions[i].spent;
                                //append curr action
                                placeActionIntoLog(currClickStamp, currClickType, currClickCost, true);

                            } else if (currClickType == "goal") {
                                currGoalEndStamp = allActions[i].goalStopped,
                                    currGoalType = allActions[i].goalType;
                                //append 10 new goals
                                placeGoalIntoLog(currClickStamp, currGoalEndStamp, currGoalType, true);
                            }

                            if (i == actionsToAddMin || i == 0) {
                                actionsToAddMin -= 10;
                                actionsToAddMax -= 10;

                                //if button is not displayed
                                if ($("#habit-log-show-more").hasClass("d-none") && allActions.length > 10) {
                                    $("#habit-log-show-more").removeClass("d-none");
                                    $("#habit-log-show-more").click(function () {
                                        addMoreIntoHabitLog();
                                    });
                                }
                                break;
                            }
                        }
                    }
                }
                addMoreIntoHabitLog();
            }
        }

        //create object of weeks values from the end date timestamp
        function calculateReportValues(reportEndStamp) {
            var valuesObject = {
                "reportStart": -1,
                "reportEnd": -1,
                "usesWeek": [0, 0, 0, 0, 0, 0, 0],
                "cravesWeek": [0, 0, 0, 0, 0, 0, 0],
                "spentWeek": [0, 0, 0, 0, 0, 0, 0],
                "usesLastWeek": 0,
                "CostLastWeek": 0
            }

            var jsonObject = retrieveStorageObject();

            //start one week prior to end stamp
            var reportStartStamp = reportEndStamp - (60 * 60 * 24 * 7);

            //update report valuesObject
            valuesObject.reportStart = reportStartStamp;
            valuesObject.reportEnd = reportEndStamp;

            //keep json obj up to date
            //to make the "previous report" arrow button workable
            json.report.activeEndStamp = reportEndStamp;

            //query action table within acquired report range

            var useActionsInRange = jsonObject.action.filter(function (e) {
                return e.clickType == "used" &&
                    e.timestamp >= reportStartStamp &&
                    e.timestamp <= reportEndStamp
            });

            for (var i = 0; i <= useActionsInRange.length - 1; i++) {
                for (j = 0; j < 7; j++) {
                    //increment the number in the array of any record happened on each of 7 days in a timespan week
                    if (
                        useActionsInRange[i].timestamp <= (reportStartStamp + (60 * 60 * 24) * (j + 1)) &&
                        useActionsInRange[i].timestamp >= (reportStartStamp + (60 * 60 * 24) * (j))
                    ) {
                        //console.log("on day = " + (j + 1));
                        valuesObject.usesWeek[j]++;
                    }
                }
            }

            var craveActionsInRange = jsonObject.action.filter(function (e) {
                return e.clickType == "craved" &&
                    e.timestamp >= reportStartStamp &&
                    e.timestamp <= reportEndStamp
            });

            for (var i = 0; i <= craveActionsInRange.length - 1; i++) {
                for (j = 0; j < 7; j++) {
                    //increment the number in the array of any record happened on each of 7 days in a timespan week
                    if (
                        craveActionsInRange[i].timestamp <= (reportStartStamp + (60 * 60 * 24) * (j + 1)) &&
                        craveActionsInRange[i].timestamp >= (reportStartStamp + (60 * 60 * 24) * (j))
                    ) {
                        valuesObject.cravesWeek[j]++;
                    }
                }
            }

            var spentActionsInRange = jsonObject.action.filter(function (e) {
                return e.clickType == "bought" &&
                    e.timestamp >= reportStartStamp &&
                    e.timestamp <= reportEndStamp
            });

            for (var i = 0; i <= spentActionsInRange.length - 1; i++) {
                for (j = 0; j < 7; j++) {
                    //increment the number in the array of any record happened on each of 7 days in a timespan week
                    if (
                        spentActionsInRange[i].timestamp <= (reportStartStamp + (60 * 60 * 24) * (j + 1)) &&
                        spentActionsInRange[i].timestamp >= (reportStartStamp + (60 * 60 * 24) * (j))
                    ) {
                        valuesObject.spentWeek[j] = valuesObject.spentWeek[j] + parseInt(spentActionsInRange[i].spent);
                    }
                }
            }

            //total uses last week
            var useActionsLastWeek = jsonObject.action.filter(function (e) {
                return e.clickType == "used" &&
                    e.timestamp >= (reportStartStamp - (60 * 60 * 24 * 7)) &&
                    e.timestamp < (reportEndStamp - (60 * 60 * 24 * 7))
            });
            valuesObject.usesLastWeek = useActionsLastWeek.length;

            //total amount spent last week
            var costActionsLastWeek = jsonObject.action.filter(function (e) {
                return e.clickType == "bought" &&
                    e.timestamp >= (reportStartStamp - (60 * 60 * 24 * 7)) &&
                    e.timestamp <= (reportEndStamp - (60 * 60 * 24 * 7))
            });
            if (costActionsLastWeek.length) {
                var totalCostLastWeek = 0;
                for (var i = 0; i <= costActionsLastWeek.length - 1; i++) {
                    totalCostLastWeek = totalCostLastWeek + parseInt(costActionsLastWeek[i].spent);
                }
                valuesObject.CostLastWeek = totalCostLastWeek;
            }
            return valuesObject;
        }

        function initiateReport() {
            var jsonObject = retrieveStorageObject();
            var timeNow = Math.round(new Date() / 1000);

            //REPORTS!!!
            //is there ANY data??
            if (jsonObject["action"].length) {
                //is there at least a week of data? 
                var firstStamp = jsonObject.action[0].timestamp;
                if ((timeNow - firstStamp) >= (60 * 60 * 24 * 7)) {

                    //calculate values for report
                    var reportEndStamp = firstStamp;
                    //as long as latest endStamp is < a week before the most recent timestamp taken,
                    //add a week - to find interval of 7 since FIRST stamp    
                    while (reportEndStamp <= (timeNow - (60 * 60 * 24 * 7))) {
                        //add a week 
                        reportEndStamp = parseInt(reportEndStamp) + (60 * 60 * 24 * 7);
                    }

                    //define parameters for report ranges
                    json.report.minEndStamp = parseInt(firstStamp) + (60 * 60 * 24 * 7);
                    json.report.maxEndStamp = parseInt(reportEndStamp) + (60 * 60 * 24 * 7);

                    //show most recent report
                    createReport(calculateReportValues(reportEndStamp));
                    //hide report description
                    $(".weekly-report-description").hide();

                    //Notify user of new report unless user is on reports page
                    if (!$("#reports-content").hasClass("active")) {
                        //find any data made in past report range
                        var reportRangeActions = jsonObject.action.filter(function (e) {
                            return e.timestamp >= parseInt(reportEndStamp) - (60 * 60 * 24 * 7)
                                && e.timestamp < parseInt(reportEndStamp)
                        });

                        //find any action taken since report made possible
                        var actionsSinceReportEnd = jsonObject.action.filter(function (e) {
                            return e.timestamp > parseInt(reportEndStamp)
                        });

                        //if any action taken since report could be generated, 
                        //follows that the report end notification was seen.
                        //and, only notify user if there was something in that report

                        if (!(actionsSinceReportEnd.length) && reportRangeActions.length) {
                            //createNotification();
                            var message = "A new report is available about the previous week's data about your habit!";
                            var responseTools = '<button class="btn btn-md btn-outline-info clear-notification" onClick="$(\'#reports-tab-toggler\').click();">' +
                                "Review your progress</button>";

                            createNotification(message, responseTools);
                        }
                    }
                }
            }
        }

        //report template
        function createReport(reportValues) {
            //remove d-none from report template
            if ($($(".weekly-report-template")[0]).hasClass("d-none")) {
                $($(".weekly-report-template")[0]).removeClass("d-none");
            }

            //split object passed in to individual values
            var reportStart = reportValues.reportStart,
                reportEnd = reportValues.reportEnd,
                usesWeek = reportValues.usesWeek,
                cravesWeek = reportValues.cravesWeek,
                spentWeek = reportValues.spentWeek,
                usesLastWeek = reportValues.usesLastWeek,
                costLastWeek = reportValues.CostLastWeek;

            var totalUsesThisWeek = usesWeek.reduce(function (a, b) { return a + b; });
            var totalCostThisWeek = spentWeek.reduce(function (a, b) { return a + b; });

            //set start date
            $("#reportStartDate").html(timestampToShortHandDate(reportStart, true));
            //set end date
            $("#reportEndDate").html(timestampToShortHandDate(reportEnd, true));

            //set bar chart values
            var dayLabels = [];
            for (var i = 0; i <= 7; i++) {
                dayLabels.push(timestampToShortHandDate((reportStart + (60 * 60 * 24 * i)), false));
            }

            //initialize bar chart
            var data = {
                labels: dayLabels,
                series: [
                    usesWeek,
                    cravesWeek
                ]
            };

            var options = {
                seriesBarDistance: 10
            };

            var responsiveOptions = [
                ['screen and (max-width: 640px)', {
                    seriesBarDistance: 10,
                    /*
                    axisX: {
                        labelInterpolationFnc: function (value) {
                            return value[0];
                        }
                    }
                    */
                }]
            ];

            new Chartist.Bar('.ct-chart', data, options, responsiveOptions);

            //set uses vs last week
            if (json.option.reportItemsToDisplay.useChangeVsLastWeek) {
                var percentChanged = percentChangedBetween(totalUsesThisWeek, usesLastWeek);
                var finishedStat = formatPercentChangedStat($("#useChangeVsLastWeek"), percentChanged);

                $("#useChangeVsLastWeek").html(finishedStat);

            } else {
                $("#useChangeVsLastWeek").parent().parent().hide();
            }

            //set uses vs baseline
            if (json.option.reportItemsToDisplay.useChangeVsBaseline) {
                var percentChanged = percentChangedBetween(totalUsesThisWeek, json.baseline.amountDonePerWeek);
                var finishedStat = formatPercentChangedStat($("#useChangeVsBaseline"), percentChanged);

                $("#useChangeVsBaseline").html(finishedStat);

            } else {
                $("#useChangeVsBaseline").parent().parent().hide();
            }


            //set spent vs last week
            if (json.option.reportItemsToDisplay.costChangeVsLastWeek) {
                var percentChanged = percentChangedBetween(totalCostThisWeek, costLastWeek);
                var finishedStat = formatPercentChangedStat($("#costChangeVsLastWeek"), percentChanged);

                $("#costChangeVsLastWeek").html(finishedStat);

            } else {
                $("#costChangeVsLastWeek").parent().parent().hide();
            }

            //set spent vs baseline
            if (json.option.reportItemsToDisplay.costChangeVsBaseline) {
                var percentChanged = percentChangedBetween(totalCostThisWeek, json.baseline.amountSpentPerWeek);
                var finishedStat = formatPercentChangedStat($("#costChangeVsBaseline"), percentChanged);

                $("#costChangeVsBaseline").html(finishedStat);

            } else {
                $("#costChangeVsBaseline").parent().parent().hide();
            }


            //set goal done / week
            if (json.option.reportItemsToDisplay.useGoalVsThisWeek) {
                $("#goalDonePerWeek").html(json.baseline.goalDonePerWeek);
            } else {
                $("#goalDonePerWeek").parent().parent().hide();
            }

            //set done this week
            if (json.option.reportItemsToDisplay.useGoalVsThisWeek) {
                $("#actualDoneThisWeek").html(totalUsesThisWeek);
                //higher or lower than goal?
                if (totalUsesThisWeek < json.baseline.goalDonePerWeek) {
                    $("#actualDoneThisWeek").addClass("down");
                    $("#actualDoneThisWeek").removeClass("up");
                } else if (totalUsesThisWeek >= json.baseline.goalDonePerWeek) {
                    $("#actualDoneThisWeek").addClass("up");
                    $("#actualDoneThisWeek").removeClass("down");
                }
            } else {
                $("#goalDonePerWeek").parent().parent().hide();
            }

            //set goal spent / week
            if (json.option.reportItemsToDisplay.costGoalVsThisWeek) {
                $("#goalSpentPerWeek").html(json.baseline.goalSpentPerWeek + "$");
            } else {
                $("#goalSpentPerWeek").parent().parent().hide();
            }

            //set spent this week
            if (json.option.reportItemsToDisplay.costGoalVsThisWeek) {
                $("#actualSpentThisWeek").html(totalCostThisWeek + "$");
                //higher or lower than goal?
                if (totalCostThisWeek < json.baseline.goalSpentPerWeek) {
                    $("#actualSpentThisWeek").addClass("down");
                    $("#actualSpentThisWeek").removeClass("up");
                } else if (totalCostThisWeek >= json.baseline.goalSpentPerWeek) {
                    $("#actualSpentThisWeek").addClass("up");
                    $("#actualSpentThisWeek").removeClass("down");
                }
            } else {
                $("#goalSpentPerWeek").parent().parent().hide();
            }
            //remove table headers given case of nothing to be displayed in table
            if (!(json.option.reportItemsToDisplay.useGoalVsThisWeek) && !(json.option.reportItemsToDisplay.costGoalVsThisWeek)) {
                $(".goal-report thead").hide();
            }
        }

        function percentChangedBetween(first, second) {
            var percentChanged = -1;

            if (!(first === 0 && second === 0)) {
                //handle normal cases
                percentChanged = Math.round(((first - second) / first) * 100);
            }
            if (first === 0 && second === 0) {
                //hand NaN case
                percentChanged = 0;
            }
            if (first === 0) {
                //handle -infinity cases
                percentChanged = -100;
            }

            return percentChanged;
        }

        function formatPercentChangedStat(statTarget, percentChanged) {
            //assign correct colors and caret if percent change is neg/pos
            if (percentChanged >= 0) {
                //color
                statTarget.parent().removeClass("down");
                statTarget.parent().addClass("up");
                //icon
                statTarget.parent().find("i.fas").remove();
                statTarget.parent().prepend('<i class="fas fa-caret-up"></i>');
            } else {
                //color
                statTarget.parent().removeClass("up");
                statTarget.parent().addClass("down");
                //icon
                statTarget.parent().find("i.fas").remove();
                statTarget.parent().prepend('<i class="fas fa-caret-down"></i>');
                //remove minus sign
                percentChanged *= -1;

            }
            //format string
            if (percentChanged.toString().length == 1) {
                percentChanged = "&nbsp;&nbsp;&nbsp;&nbsp;" + percentChanged + "%";
            } else if (percentChanged.toString().length == 2) {
                percentChanged = "&nbsp;&nbsp;" + percentChanged + "%";
            } else {
                percentChanged = percentChanged + "%";
            }
            return percentChanged;
        }

        function timestampToShortHandDate(timestamp, includeYear) {
            var endDateObj = new Date(parseInt(timestamp + "000"));
            var shortHandDate = (endDateObj.getMonth() + 1) + "/" +
                endDateObj.getDate();
            if (includeYear) {
                shortHandDate = shortHandDate + "/" + (endDateObj.getFullYear());
            }
            return shortHandDate;
        }

        $(".previous-report").on("click", function () {
            if (json.report.activeEndStamp - (60 * 60 * 24 * 7) >= json.report.minEndStamp) {
                var reportEndStamp = json.report.activeEndStamp - (60 * 60 * 24 * 7);
                createReport(calculateReportValues(reportEndStamp));
            } else {
                createNotification("Looks like there isn't enough data to make that report!");
            }
        });

        $(".next-report").on("click", function () {
            if (json.report.activeEndStamp + (60 * 60 * 24 * 7) <= json.report.maxEndStamp) {
                var reportEndStamp = json.report.activeEndStamp + (60 * 60 * 24 * 7);
                createReport(calculateReportValues(reportEndStamp));
            } else {
                createNotification("The next report is for a week that has not happened yet!");
            }
        });

        //listen for baseline responses 
        (function updateBaselineResponses() {
            //user doesn't know what to track, 
            //send them to 'what to track' help docs
            $(".baseline-questionnaire .passerby-user").on('change', function () {
                $($(".baseline-questionnaire .question-set:hidden")[0]).removeClass("d-none");

                var message = "Feel free to poke around, you can reset the entire app (in settings) if you decide to track something specific.";
                var responseTools = "<a class='btn btn-md btn-outline-info' href='https://escrave.com#habits'>Some Suggestions</a>";
                createNotification(message, responseTools);
            });

            //user declared they have chosen something to track
            //display further baseline questions
            $(".baseline-questionnaire .serious-user").on('change', function () {
                $($(".baseline-questionnaire .question-set:hidden")[0]).removeClass("d-none");
                //save user response
                json.baseline.specificSubject = true;
                var jsonObject = retrieveStorageObject();
                jsonObject.baseline.specificSubject = true;
                setStorageObject(jsonObject);

            });
            //check both relevant N/A checkboxes when one is clicked 
            $(".baseline-questionnaire  input.stat-group-not-applicable").on('change', function () {
                //check if checkbox was checked
                if ($(this).is(":checked")) {
                    //on either click of a spent related N/A click, select both
                    $("#" + this.id).prop('checked', true);

                } else {
                    $("#" + this.id).prop('checked', false);
                }
            });

            //.follow-up-questions submitted
            $(".baseline-questionnaire .submit").on("click", function () {
                //required to update loacal storage
                var jsonObject = retrieveStorageObject();

                //track if any submission has been made
                jsonObject.baseline.userSubmitted = true;

                if ($(".decreaseHabit").is(":checked")) {
                    console.log("desires decrease")
                    jsonObject.baseline.decreaseHabit = true;

                    /*
                        CUSTOM SETTINGS
                    */

                } else if ($(".increaseHabit").is(":checked")) {
                    console.log("desires increase")
                    jsonObject.baseline.decreaseHabit = false;

                     /*
                        CUSTOM SETTINGS
                    */

                }
                if ($($(".valuesTime")[0]).is(":checked")) {
                    console.log("valuesTime")
                    jsonObject.baseline.valuesTime = true;
                } else {
                    jsonObject.baseline.valuesTime = false;

                }
                if ($(".valuesMoney").is(":checked")) {
                    console.log("valuesMoney")
                    jsonObject.baseline.valuesMoney = true;
                } else {
                    jsonObject.baseline.valuesMoney = false;
                }

                if ($(".valuesHealth").is(":checked")) {
                    console.log("valuesHealth")
                    jsonObject.baseline.valuesHealth = true;
                } else {
                    jsonObject.baseline.valuesHealth = false;
                }
                

                if ($("#spendingNA").is(":checked") || $($("input.amountSpentPerWeek")[0]).val() == "") {

                    jsonObject.baseline.costStatsIrrelevant = true;
                    jsonObject.baseline.amountSpentPerWeek = false;

                    //uncheck visibility of spent related stats
                    // jsonObject.option.liveStatsToDisplay.boughtGoalButton = false;
                    // jsonObject.option.liveStatsToDisplay.avgBetweenSpent = false;
                    // jsonObject.option.liveStatsToDisplay.totalSpent = false;
                    // jsonObject.option.liveStatsToDisplay.currWeekSpent = false;
                    // jsonObject.option.liveStatsToDisplay.currMonthSpent = false;
                    // jsonObject.option.liveStatsToDisplay.currYearSpent = false;
                    
                    jsonObject.option.reportItemsToDisplay.costChangeVsBaseline = false;
                    jsonObject.option.reportItemsToDisplay.costChangeVsLastWeek = false;


                } else {
                    jsonObject.baseline.amountSpentPerWeek = $("input.amountSpentPerWeek").val();
                    jsonObject.option.reportItemsToDisplay.costChangeVsBaseline = true;

                }

                if ($("#goalSpentNA").is(":checked") || $($("input.goalSpentPerWeek")[0]).val() == "") {
                    jsonObject.baseline.goalSpentPerWeek = false;
                    jsonObject.option.reportItemsToDisplay.costGoalVsThisWeek = false;

                } else {
                    jsonObject.baseline.goalSpentPerWeek = $("input.goalSpentPerWeek").val();
                    jsonObject.option.reportItemsToDisplay.costGoalVsThisWeek = true;

                }

                if ($("#doneNA").is(":checked") || $($("input.amountDonePerWeek")[0]).val() == "") {
                    //toggle spent statistics (likely they are not useful)
                    jsonObject.baseline.useStatsIrrelevant = false;
                    jsonObject.baseline.amountDonePerWeek = false;
                    jsonObject.option.liveStatsToDisplay.sinceLastDone = true;
                    jsonObject.option.liveStatsToDisplay.avgBetweenDone = true;
                    jsonObject.option.liveStatsToDisplay.didntPerDid = false;
                    jsonObject.option.liveStatsToDisplay.resistedInARow = false;

                    jsonObject.option.reportItemsToDisplay.useChangeVsBaseline = false;
                    jsonObject.option.reportItemsToDisplay.useChangeVsLastWeek = false;

                } else {
                    jsonObject.baseline.amountDonePerWeek = $("input.amountDonePerWeek").val();
                    jsonObject.option.reportItemsToDisplay.useChangeVsBaseline = true;

                }

                if ($("#goalDoneNA").is(":checked") || $($(".goalDonePerWeek")[0]).val() == "") {
                    jsonObject.baseline.goalDonePerWeek = false;
                    jsonObject.option.reportItemsToDisplay.useGoalVsThisWeek = false;

                } else {
                    jsonObject.baseline.goalDonePerWeek = $("input.goalDonePerWeek").val();
                    jsonObject.option.reportItemsToDisplay.useGoalVsThisWeek = true;

                }

                //sync local running copy
                json.baseline = jsonObject.baseline;
                json.option = jsonObject.option;
                setStorageObject(jsonObject);
                
                //SETTINGS PAGE INITIAL DISPLAY
                //LIVE STATS
                for (var key in jsonObject.option.liveStatsToDisplay) {
                    $("#" + key + "Displayed").prop('checked', jsonObject.option.liveStatsToDisplay[key]);
                }

                //HABIT LOG
                for (var key in jsonObject.option.logItemsToDisplay) {
                    $("#" + key + "RecordDisplayed").prop('checked', jsonObject.option.logItemsToDisplay[key]);
                }
                //WEEKLY REPORT
                for (var key in jsonObject.option.reportItemsToDisplay) {
                    $("#" + key + "Displayed").prop('checked', jsonObject.option.reportItemsToDisplay[key]);
                }

                $("#statistics-tab-toggler").click();
                $(".baseline-questionnaire .intro.question").addClass("d-none");
                $(".baseline-questionnaire").removeClass("show");
                $(".displayed-statistics").addClass("show");
                $(".displayed-statistics-heading").show();

                var message = "Thank you for answering those questions! Let's get going";
                createNotification(message);
            });

        })();

        //function to read settings changes for which stats to display
        (function settingsDisplayChanges() {
            //LIVE STATISTICS
            //listen when changed checkbox inside display options area
            $(".statistics-display-options .form-check-input").on('change', function () {

                //detect specific id
                var itemHandle = this.id;
                var displayCorrespondingStat = false;

                if ($("#" + itemHandle).is(":checked")) {
                    displayCorrespondingStat = true;
                }

                //change value in JSON
                var jsonHandle = itemHandle.replace("Displayed", "");
                json.option.liveStatsToDisplay[jsonHandle] = displayCorrespondingStat;

                //update option table value
                var jsonObject = retrieveStorageObject();
                jsonObject.option.liveStatsToDisplay[jsonHandle] = displayCorrespondingStat;

                setStorageObject(jsonObject);
                showActiveStatistics();
                hideInactiveStatistics();

            });

            //HABIT LOG 
            //listen when changed checkbox inside display options area
            $(".habit-log-display-options .form-check-input").on('change', function () {
                //detect specific id
                var itemHandle = this.id;
                var jsonHandle = itemHandle.replace("RecordDisplayed", "");
                var displayCorrespondingStat = false;

                if ($("#" + itemHandle).is(":checked")) {
                    displayCorrespondingStat = true;
                    //remove display none from relevant habit log items
                    $("#habit-log .item." + jsonHandle + "-record").removeClass("d-none");

                } else {
                    //add display none to relevant habit log items
                    $("#habit-log .item." + jsonHandle + "-record").addClass("d-none");
                }

                //change value in JSON
                json.option.logItemsToDisplay[jsonHandle] = displayCorrespondingStat;

                //update option table value
                var jsonObject = retrieveStorageObject();
                jsonObject.option.logItemsToDisplay[jsonHandle] = displayCorrespondingStat;

                setStorageObject(jsonObject);

            });

            //WEEKLY REPORT
            //listen when changed checkbox inside display options area
            $(".report-display-options .form-check-input").on('change', function () {

                //detect specific id
                var itemHandle = this.id;
                var displayCorrespondingStat = false;

                if ($("#" + itemHandle).is(":checked")) {
                    displayCorrespondingStat = true;
                }

                //change value in JSON
                var jsonHandle = itemHandle.replace("Displayed", "");
                json.option.reportItemsToDisplay[jsonHandle] = displayCorrespondingStat;

                //update option table value
                var jsonObject = retrieveStorageObject();
                jsonObject.option.reportItemsToDisplay[jsonHandle] = displayCorrespondingStat;

                setStorageObject(jsonObject);
            });
        })();

        //return to last active tab
        function returnToActiveTab() {
            if (json.option.activeTab) {
                var tabName = json.option.activeTab.split("-")[0];
                $("#" + tabName + "-tab-toggler").click();
            } else {
                $("#" + "reports" + "-tab-toggler").click();
            }
        }

        //save current tab on switch
        function saveActiveTab() {
            //update instance json
            json.option.activeTab = $(".tab-pane.active").attr('id');

            //update in option table
            //convert localStorage to json
            var jsonObject = retrieveStorageObject();
            jsonObject.option.activeTab = $(".tab-pane.active").attr('id');
            setStorageObject(jsonObject);

        }

        //convert last timestamp to a running timer
        function restartTimerAtValues(timerArea, sinceLastAction) {
            var timeNow = new Date() / 1000;

            //update json with previous timer values
            var newTimerTotalSeconds = Math.floor(timeNow - sinceLastAction);

            var newTimerSeconds = -1,
                newTimerMinutes = -1,
                newTimerHours = -1,
                newTimerDays = -1;

            //calc mins and secs
            if (newTimerTotalSeconds > 60) {
                newTimerSeconds = newTimerTotalSeconds % 60;
                newTimerMinutes = Math.floor(newTimerTotalSeconds / 60);
                if (newTimerMinutes < 10) {
                    newTimerMinutes = "0" + newTimerMinutes;
                }
            } else {
                newTimerSeconds = newTimerTotalSeconds;
                newTimerMinutes = 0;
            }

            //calc hours
            if (newTimerTotalSeconds > (60 * 60)) {
                newTimerMinutes = newTimerMinutes % 60;
                newTimerHours = Math.floor(newTimerTotalSeconds / (60 * 60));
                if (newTimerMinutes < 10) {
                    newTimerMinutes = "0" + newTimerMinutes;
                }
                if (newTimerHours < 10) {
                    newTimerHours = "0" + newTimerHours;
                }

            } else {
                newTimerHours = 0;
            }

            //calc days
            if (newTimerTotalSeconds > (60 * 60 * 24)) {
                newTimerHours = newTimerHours % 24;
                newTimerDays = Math.floor(newTimerTotalSeconds / (60 * 60 * 24));
                if (newTimerHours < 10) {
                    newTimerHours = "0" + newTimerHours;
                }

            } else {
                newTimerDays = 0;
            }

            //update appropriate JSON values
            json.statistics[timerArea].sinceTimerStart.totalSeconds = newTimerTotalSeconds;
            json.statistics[timerArea].sinceTimerStart.seconds = newTimerSeconds;
            json.statistics[timerArea].sinceTimerStart.minutes = newTimerMinutes;
            json.statistics[timerArea].sinceTimerStart.hours = newTimerHours;
            json.statistics[timerArea].sinceTimerStart.days = newTimerDays;

        }

        //hide timers on initiation if needed
        function hideTimersOnLoad() {
            if (json.statistics.use.sinceTimerStart.totalSeconds == 0) {
                $("#use-content .fibonacci-timer:first-child").toggle();

            } else {
                //start timer from json values
                initiateSmokeTimer();
            }

            if (json.statistics.cost.sinceTimerStart.totalSeconds == 0) {
                $("#cost-content .fibonacci-timer:first-child").toggle();

            } else {
                //start timer from json values
                initiateBoughtTimer();
            }

            if (json.statistics.goal.untilTimerEnd.totalSeconds == 0) {
                $("#goal-content .fibonacci-timer").toggle();

            } else {
                //start timer from json values
                initiateGoalTimer();
            }
        }

        /* NOTIFICATION CREATION AND RESPONSES */
        var clearNotification = function (event, swipeDirection) {
            //when user clicks X on a notification, slide it off the screen.
            var currNotification = $(event).parent().parent();
            //var notificationWidth = currNotification.css("width");
            //	notificationWidth = -1 * parseInt(notificationWidth);
            var animateLeft = 0;
            if (swipeDirection == "right") {
                animateLeft = (6400);

            } else {
                animateLeft = -1 * (6400);

            }
            currNotification.animate(
                { left: animateLeft }, 600,
                function () {
                    currNotification.css("display", "none");
                });
        }

        function swipeNotification() {
            document.addEventListener('touchstart', handleTouchStart, false);
            document.addEventListener('touchmove', handleTouchMove, false);

            var xDown = null;
            var yDown = null;

            function getTouches(evt) {
                return evt.touches ||             // browser API
                    evt.originalEvent.touches; // jQuery
            };

            function handleTouchStart(evt) {
                const firstTouch = getTouches(evt)[0];
                xDown = firstTouch.clientX;
                yDown = firstTouch.clientY;
            };

            function handleTouchMove(evt) {
                if (!xDown || !yDown) {
                    return;
                }
                var xUp = evt.touches[0].clientX;
                var yUp = evt.touches[0].clientY;
                var xDiff = xDown - xUp;
                var yDiff = yDown - yUp;

                if (Math.abs(xDiff) > Math.abs(yDiff)) {/*most significant*/
                    if (xDiff > 0) {
                        /* left swipe */
                        var selectedElem = document.elementFromPoint(xUp, yUp);
                        if ($(selectedElem).parents('.notification').length) {
                            //console.log("got class");
                            clearNotification.call(event, selectedElem, "left");
                        }
                    } else {
                        /* right swipe */
                        var selectedElem = document.elementFromPoint(xUp, yUp);
                        if ($(selectedElem).parents('.notification').length) {
                            //console.log("got class");
                            clearNotification.call(event, selectedElem, "right");
                        }
                    }
                }
                /* reset values */
                xDown = null;
                yDown = null;
            };

        }
        swipeNotification();

        function createNotification(message, responseTools) {
            var template = '<div class="notification" style="left:600px;">' +
                '<div class="notification-message">' +
                '<p class="notification-text">' + message + '</p>' +
                '<a class="notification-close" href="#">X</a>' +
                '</div>';

            if (responseTools) {
                template += '<div class="notification-response-tools">' + responseTools + '</div>';
            } else {
                template += '<div class="spacer" style="height:15px;"></div>';
            }

            template += '</div><!--end notification div-->';

            $('#notifications-container').append(template);
            highlightNotification();

        }

        function highlightNotification() {
            //find last notification appended to container

            $($(".notification")[$(".notification").length - 1]).animate({
                left: 0
            }, 300);

            setTimeout(function () {
                $($(".notification")[$(".notification").length - 1]).addClass("rotate-left");
                setTimeout(function () {
                    $($(".notification")[$(".notification").length - 1]).removeClass("rotate-left");
                    $($(".notification")[$(".notification").length - 1]).addClass("rotate-right");
                    setTimeout(function () {
                        $($(".notification")[$(".notification").length - 1]).removeClass("rotate-right");
                    }, 300);
                }, 300);
            }, 300);
        }

        function createGoalEndNotification(goalHandle) {
            var goalType = goalHandle.goalType,
                goalTypeGerund = "";
            if (goalType == "use") {
                goalTypeGerund = "doing";
                goalType = "did";
            } else if (goalType == "bought") {
                goalTypeGerund = "buying";
            } else if (goalType == "both") {
                goalTypeGerund = "buying and doing";
            }

            var message = 'Your most recent goal ended since your last visit. ' +
                'Did you make it without ' + goalTypeGerund + ' it?';
            var responseTools =
                '<button class="notification-response-tool goal-ended-on-time" href="#" >' +
                'Yes</button>' +
                '<button class="notification-response-tool goal-ended-early" href="#">' +
                'No</button>';

            createNotification(message, responseTools);

        }

        /* Notification button events */
        $('#notifications-container').on('click', '.notification-close, .clear-notification', function (event) {
            clearNotification.call(event, this);
        });

        $('#notifications-container').on('click', '.notification-response-tool', function (event) {
            //need these variables: startStamp, endStamp, goalType
            //convert localStorage to json
            var currJsonString = localStorage.esCrave;
            var jsonObject = JSON.parse(currJsonString);

            //return active goal
            var activeGoals = jsonObject.action.filter(function (e) {
                return e.clickType == "goal" && e.status == 1;
            });
            var mostRecentGoal = activeGoals[activeGoals.length - 1];

            //grab relevant data from object
            var startStamp = mostRecentGoal.timestamp,
                endStamp = mostRecentGoal.goalStamp,
                goalType = mostRecentGoal.goalType;

            //your last goal has finished, was it successful?
            if ($(this).hasClass("goal-ended-on-time")) {
                //this is to just shoot the goal straight through the pipeline
                clearNotification.call(event, this);
                placeGoalIntoLog(startStamp, endStamp, goalType, false);

                var message = "congrats on completing your goal! Check your habit log on your statistics page for details.";
                createNotification(message);
                changeGoalStatus(3, goalType);

                //update json about if there's an active goal
                json.statistics.goal.activeGoalBoth = 0;
                json.statistics.goal.activeGoalUse = 0;
                json.statistics.goal.activeGoalBought = 0;

                
            } else if ($(this).hasClass("goal-ended-early")) {
                clearNotification.call(event, this);
                var now = Math.round(new Date() / 1000);
                var min = new Date(parseInt(startStamp)).getTime();
                var max = new Date(parseInt(endStamp)).getTime();

                var minFormatted = Math.floor((now - min) / 86400),
                    maxFormatted = Math.floor((now - max) / 86400);

                if (minFormatted == 0) {
                    minFormatted = "-" + (minFormatted);
                } else {
                    minFormatted = (minFormatted * -1);
                }

                if (maxFormatted == 0) {
                    maxFormatted = "-" + (maxFormatted);
                } else {
                    maxFormatted = (maxFormatted * -1);
                }
            
                var message = "Even though you didn't make it until the end, you still get credit for how long you waited. " +
                    "Around when do you think you broke your goal?";

                var responseTools = '<!-- custom Time picker-->' +
                    '<div id="goalEndTimePicker" class="time-picker-container">' +
                    '<select class="time-picker-hour" data-min="0" data-max="23" data-step="1">' +
                    '<option value="0">12</option>' +
                    '<option value="1">1</option>' +
                    '<option value="2">2</option>' +
                    '<option value="3">3</option>' +
                    '<option value="4">4</option>' +
                    '<option value="5">5</option>' +
                    '<option value="6">6</option>' +
                    '<option value="7">7</option>' +
                    '<option value="8">8</option>' +
                    '<option value="9">9</option>' +
                    '<option value="10">10</option>' +
                    '<option value="11">11</option>' +
                    '</select>' +
                    '<select class="time-picker-am-pm">' +
                    '<option value="AM">AM</option>' +
                    '<option value="PM">PM</option>' +
                    '</select>' +
                    '</div>' +
                    '<div id="datepicker-notification" style="display:inline-block;"></div>' +
                    '<script type="text/javascript">' +
                    '$( "#datepicker-notification" ).datepicker({ minDate:' + minFormatted + ', maxDate:' + maxFormatted + '});' +
                    'var currHours = new Date().getHours();' +
                    '$("#goalEndTimePicker .time-picker-hour").val(currHours%12);' +
                    'if(currHours>=12){ $("#goalEndTimePicker .time-picker-am-pm").val("PM"); }' +
                    '</script><br/>' +
                    '<button class="notification-response-tool submit-new-goal-time" href="#" >' +
                    'Submit</button>';

                createNotification(message, responseTools);

            }

            //if goal ended ahead of schedule, when did it end?
            //submitted new date/time
            if ($(this).hasClass("submit-new-goal-time")) {
                var tempEndStamp = convertDateTimeToTimestamp('#datepicker-notification', '#goalEndTimePicker');
                //console.log(tempEndStamp);
                if (tempEndStamp - startStamp > 0 || endStamp - tempEndStamp < 0) {
                    changeGoalStatus(2, goalType, tempEndStamp);
                    placeGoalIntoLog(startStamp, tempEndStamp, goalType, false);
                    clearNotification.call(event, this);

                    //update json about if there's an active goal
                    json.statistics.goal.activeGoalBoth = 0;
                    json.statistics.goal.activeGoalUse = 0;
                    json.statistics.goal.activeGoalBought = 0;

                } else {
                    alert('Please choose a time within your goal range!');
                }
            }

        });

        $('#notifications-container').on('click', '.extend-goal', function (event) {
            clearNotification.call(event, this);
            extendActiveGoal();
        });

        $('#notifications-container').on('click', '.end-goal', function (event) {
            clearNotification.call(event, this);
            endActiveGoal();
        });

        function extendActiveGoal() {
            if (json.statistics.goal.activeGoalUse !== 0) {
                var goalType = "use";
            } else if (json.statistics.goal.activeGoalBought !== 0) {
                var goalType = "bought";
            } else if (json.statistics.goal.activeGoalBoth !== 0) {
                var goalType = "both";
            }

            var requestedGoalEnd = $('#goalEndPicker').datepicker({
                dateFormat: 'yy-mm-dd'
            }).val();

            var goalStampSeconds = Math.round(new Date(requestedGoalEnd).getTime() / 1000);
            changeGoalStatus(1, goalType, false, goalStampSeconds);

        }
        function endActiveGoal() {
            var date = new Date();
            var timestampSeconds = Math.round(date / 1000);

            if (json.statistics.goal.activeGoalUse !== 0) {
                var goalType = "use";
                json.statistics.goal.activeGoalUse = 0;
            } else if (json.statistics.goal.activeGoalBought !== 0) {
                var goalType = "bought";
                json.statistics.goal.activeGoalBought = 0;
            } else if (json.statistics.goal.activeGoalBoth !== 0) {
                var goalType = "both";
                json.statistics.goal.activeGoalBoth = 0;
            }
            var message = 'Your goal just ended early, ' +
                'it has been added to your habit log. ' +
                'Be proud, any progress is good progress!';

            changeGoalStatus(2, goalType, timestampSeconds);
            createNotification(message);

            var startStamp = json.statistics.goal.lastClickStamp;
            var actualEnd = timestampSeconds;
            placeGoalIntoLog(startStamp, actualEnd, goalType, false);

            //if longest goal just happened
            if ((actualEnd - startStamp) > json.statistics.goal.bestTimeSeconds) {
                //update json
                json.statistics.goal.bestTimeSeconds = (actualEnd - startStamp);
                //insert onto page
                var newLongestGoal = convertSecondsToDateFormat(json.statistics.goal.bestTimeSeconds);
                $("#longestGoalCompleted").html(newLongestGoal);
            }
            //update number of goals
            json.statistics.goal.completedGoals++;
            $("#numberOfGoalsCompleted").html(json.statistics.goal.completedGoals);
            showActiveStatistics();

            var requestedGoalEnd = $('#goalEndPicker').datepicker({
                dateFormat: 'yy-mm-dd'
            }).val();

            var goalStampSeconds = Math.round(new Date(requestedGoalEnd).getTime() / 1000);

            //keep lastClickStamp up to date while using app
            json.statistics.goal.lastClickStamp = timestampSeconds;

            //return to relevant screen
            $("#statistics-tab-toggler").click();

            //set local json goal type which is active
            var jsonHandle = "activeGoal" + goalType.charAt(0).toUpperCase() + goalType.slice(1);
            json.statistics.goal[jsonHandle] = 1;

            updateActionTable(timestampSeconds, "goal", "", goalStampSeconds, goalType);

            //convert goalend to days hours minutes seconds
            var totalSecondsUntilGoalEnd = Math.round(goalStampSeconds - timestampSeconds);

            loadGoalTimerValues(totalSecondsUntilGoalEnd);
            initiateGoalTimer();
            showActiveStatistics();
            adjustFibonacciTimerToBoxes("goal-timer");

        }

        /* GOAL LOG FUNCTION */
        function placeGoalIntoLog(startStamp, endStamp, goalType, placeBelow) {

            var endDateObj = new Date(parseInt(endStamp + "000"));

            var timeElapsed = convertSecondsToDateFormat(endStamp - startStamp);
            var dayOfTheWeek = endDateObj.toString().split(' ')[0];

            var shortHandDate = (endDateObj.getMonth() + 1) + "/" +
                endDateObj.getDate() + "/" +
                (endDateObj.getFullYear());

            var template = '<div class="item goal-record">' +
                '<hr/><p class="title"><i class="far fa-calendar-plus"></i>&nbsp;' +
                'You waited <b><span class="timeElapsed">' + timeElapsed + '</span></b>.' +
                '</p>' +
                '<p class="date" style="text-align:center;color:D8D8D8">' +
                '<span class="dayOfTheWeek">' + dayOfTheWeek + '</span>,&nbsp;' +
                '<span class="shortHandDate">' + shortHandDate + '</span>' +
                '</p>' +
                '</div><!--end habit-log item div-->';

            //assure user has selected to display this log item type 
            //controller is on settings pane
            if (json.option.logItemsToDisplay.goal === true) {
                if (placeBelow) {
                    $('#habit-log').append(template);
                } else {
                    $('#habit-log').prepend(template);
                }
                //and make sure the heading exists too
                $("#habit-log-heading").show();
            } else {
                //console.log("create log entry of type: '" + "goal" + "' did not display.");
            }
        }

        /* COST && USE LOG FUNCTION */
        function placeActionIntoLog(clickStamp, clickType, amountSpent, placeBelow) {

            //data seems to be in order
            var endDateObj = new Date(parseInt(clickStamp + "000"));
            var dayOfTheWeek = endDateObj.toString().split(' ')[0];
            var shortHandDate = (endDateObj.getMonth() + 1) + "/" +
                endDateObj.getDate() + "/" +
                (endDateObj.getFullYear());
            var shortHandTimeHours = (endDateObj.getHours()),
                shortHandTimeMinutes = (endDateObj.getMinutes()),
                shortHandTimeAMPM = "am";
            if (shortHandTimeHours == 12) {
                shortHandTimeAMPM = "pm";
            } else if (shortHandTimeHours > 12) {
                shortHandTimeHours = shortHandTimeHours % 12;
                shortHandTimeAMPM = "pm";
            }
            if (shortHandTimeMinutes < 10) {
                shortHandTimeMinutes = "0" + shortHandTimeMinutes;
            }

            var shortHandTime = shortHandTimeHours + "<b>:</b>" + shortHandTimeMinutes + shortHandTimeAMPM;

            var titleHTML = "";
            var target = "#habit-log";

            if (clickType == "bought") {
                titleHTML = '<i class="fas fa-dollar-sign"></i>&nbsp;&nbsp;' + "You spent <b>" + parseInt(amountSpent) + "$</b> on it.";
                //target = "#cost-log";
            } else if (clickType == "used") {
                titleHTML = '<i class="fas fa-cookie-bite"></i>&nbsp;' + "You did it at <b>" + shortHandTime + "</b>.";
                //target = "#use-log";
            } else if (clickType == "craved") {
                titleHTML = '<i class="fas fa-ban"></i>&nbsp;' + "You resisted it at <b>" + shortHandTime + "</b>.";
                //target = "#use-log";
            }

            var template = '<div class="item ' + clickType + '-record">' +
                '<hr/><p class="title">' + titleHTML + '</p>' +
                '<p class="date" style="text-align:center;color:D8D8D8">' +
                '<span class="dayOfTheWeek">' + dayOfTheWeek + '</span>,&nbsp;' +
                '<span class="shortHandDate">' + shortHandDate + '</span>' +
                '</p>' +
                '</div><!--end habit-log item div-->';

            if (json.option.logItemsToDisplay[clickType] === true) {
                if (placeBelow) {
                    $(target).append(template);
                } else {
                    $(target).prepend(template);
                }
                //and make sure the heading exists too
                $(target + "-heading").show();
            }
        }

        /* Format entries into HABIT LOG */
        function convertSecondsToDateFormat(rangeInSeconds) {

            //s
            var currSeconds = rangeInSeconds % 60;
            if (currSeconds < 10) { currSeconds = "0" + currSeconds };

            var finalStringStatistic = currSeconds + "s";

            //s	//m
            if (rangeInSeconds > (60)) {
                var currMinutes = Math.floor(rangeInSeconds / (60)) % 60;
                if (currMinutes < 10) { currMinutes = "0" + currMinutes };

                finalStringStatistic = currMinutes + "<span>m&nbsp;</span>" + finalStringStatistic;

            }

            //s //m //h
            if (rangeInSeconds > (60 * 60)) {
                var currHours = Math.floor(rangeInSeconds / (60 * 60)) % 24;
                if (currHours < 10) { currHours = "0" + currHours };

                finalStringStatistic = currHours + "<span>h&nbsp;</span>" + finalStringStatistic;
                //drop seconds
                finalStringStatistic = finalStringStatistic.split("m")[0] + "m</span>";

            }

            //s //m //h //d
            if (rangeInSeconds > (60 * 60 * 24)) {
                var dayCount = Math.floor(rangeInSeconds / (60 * 60 * 24));
                var plural = "";
                if (dayCount > 1) {
                    plural = "s";
                }
                finalStringStatistic = dayCount + "<span>&nbsp;day" + plural + "&nbsp;</span>" + finalStringStatistic;
                //drop minutes
                finalStringStatistic = finalStringStatistic.split("h")[0] + "h</span>";
            }

            //remove very first 0 from string	
            if (finalStringStatistic.charAt(0) === "0") { finalStringStatistic = finalStringStatistic.substr(1) }

            return finalStringStatistic;

        }

        /* Goal completion management */
        function changeGoalStatus(newGoalStatus, goalType, actualEnd, goalExtendedTo) {

            //goal status
            //1 == active goal
            //2 == partially completed goal
            //3 == completed goal

            //console.log("inside changeGoalStatus, newGoalStatus = " + newGoalStatus);
            //convert localStorage to json
            var jsonObject = retrieveStorageObject();

            var goals = jsonObject.action.filter(function (e) {
                return e.clickType == 'goal' && e.goalType == goalType
            });
            var mostRecentGoal = goals[goals.length - 1];
            mostRecentGoal.status = newGoalStatus;

            //actual end was passed to function	
            if (actualEnd) {
                mostRecentGoal.goalStopped = actualEnd;
            } else {
                //else set the actual end to end of goal endDate
                mostRecentGoal.goalStopped = mostRecentGoal.goalStamp;
            }

            //user wants to extend current goal
            if (goalExtendedTo) {
                if (mostRecentGoal.goalStamp < goalExtendedTo) {
                    //goal was extended, not shortened
                    mostRecentGoal.goalStamp = goalExtendedTo;

                    setStorageObject(jsonObject);

                    var date = new Date();
                    var timestampSeconds = Math.round(date / 1000);
                    var totalSecondsUntilGoalEnd = Math.round(goalExtendedTo - timestampSeconds);

                    loadGoalTimerValues(totalSecondsUntilGoalEnd);
                    initiateGoalTimer();
                    showActiveStatistics();
                    adjustFibonacciTimerToBoxes("goal-timer");

                } else {
                    //requested was shorter than original goal!!
                    var message = "Your current goal was longer than the one you just requested. " +
                        "Don't worry if you can't make it all the way, just try a more manageable goal next time!";
                    createNotification(message);
                }

            } else {
                setStorageObject(jsonObject);
            }

        }

        /* CONVERT JSON TO LIVE STATS */
        function convertDateTimeToTimestamp(datePickerTarget, timePickerTarget) {
            var tempEndStamp = $(datePickerTarget).datepicker({ dateFormat: 'yy-mm-dd' }).val();
            tempEndStamp = Math.round(new Date(tempEndStamp).getTime() / 1000);

            //get time selection from form
            var requestedTimeEndHours = parseInt($(timePickerTarget + " select.time-picker-hour").val());

            //12 am is actually the first hour in a day... goddamn them.
            if (requestedTimeEndHours == 12) {
                requestedTimeEndHours = 0;
            }
            //account for am vs pm from userfriendly version of time input
            if ($(timePickerTarget + " select.time-picker-am-pm").val() == "PM") {
                requestedTimeEndHours = requestedTimeEndHours + 12;
            }

            tempEndStamp += requestedTimeEndHours * (60 * 60);
            return tempEndStamp;
        }

        function displayAverageTimeBetween(actionType) {
            //convert total seconds to ddhhmmss
            var htmlDestination = "";

            if (actionType == "use") {
                htmlDestination = "#averageTimeBetweenUses";

            } else if (actionType == "cost") {
                htmlDestination = "#averageTimeBetweenBoughts";
            }

            var finalStringStatistic = convertSecondsToDateFormat(json.statistics[actionType].averageBetweenClicks);

            //insert HTML into span place holder
            $(htmlDestination).html(finalStringStatistic);
        }

        function calculateAverageTimeBetween(actionType) {
            //current timestamp
            var timeNow = Math.round(new Date() / 1000);

            //set key to the correct calculation ((timeNow - firstTimestamp) / (totalClicks))
            var totalTimeBetween = parseInt(timeNow) - parseInt(json.statistics[actionType].firstClickStamp),
                totalClicks = parseInt(json.statistics[actionType].clickCounter);
            json.statistics[actionType].averageBetweenClicks = Math.round(totalTimeBetween / (totalClicks - 1));

            //call function to display new stat
            displayAverageTimeBetween(actionType);
        }

        function displayLongestGoal() {
            var html = convertSecondsToDateFormat(json.statistics.goal.bestTimeSeconds);
            $("#longestGoalCompleted").html(html);
        }

        //TOGGLE ANY STATS WHICH ARE NOT ZERO 
        function hideInactiveStatistics() {
            //used to hide instructions once app is in use
            var statisticPresent = false;
            //bought page 
            /*HIDE UNAVAILABLE STATS */
            if (json.statistics.cost.clickCounter === 0) {
                $("#bought-total").hide();
                $("#cost-content .timer-recepticle").hide();
            } else {
                statisticPresent = true;
            }
            if (json.statistics.cost.averageBetweenClicks === 0) {
                $("#averageTimeBetweenBoughts").parent().hide();
            }
            console.log("json.statistics.cost: ", json.statistics.cost)
            if (json.statistics.cost.totals.total === 0) {
                //toggle all
                $("#cost-content .statistic-recepticle").hide();
                $("#totalAmountSpent").parent().hide();
                $("#spentThisWeek").parent().hide();
                $("#spentThisMonth").parent().hide();
                $("#spentThisYear").parent().hide();
            } else if (json.statistics.cost.totals.week == json.statistics.cost.totals.total) {
                //toggle year month week 
                $("#spentThisWeek").parent().hide();
                $("#spentThisMonth").parent().hide();
                $("#spentThisYear").parent().hide();
            } else if (json.statistics.cost.totals.month == json.statistics.cost.totals.week) {
                //toggle year and month
                $("#spentThisMonth").parent().hide();
                $("#spentThisYear").parent().hide();
            } else if (json.statistics.cost.totals.year == json.statistics.cost.totals.month) {
                $("#spentThisYear").parent().hide();
            }
            

            if (json.statistics.use.clickCounter === 0) {
                $("#use-total").hide();
                $("#use-content .timer-recepticle").hide();
            } else {
                statisticPresent = true;
            }
            if (json.statistics.use.averageBetweenClicks === 0) {
                $("#averageTimeBetweenUses").parent().hide();
            }
            if (json.statistics.use.craveCounter === 0) {
                $("#crave-total").hide();
            } else {
                statisticPresent = true;
            }
            if (json.statistics.use.craveCounter === 0 || json.statistics.use.clickCounter === 0) {
                $("#avgDidntPerDid").parent().hide();
            }
            if (json.statistics.use.cravingsInARow === 0 || json.statistics.use.cravingsInARow === 1) {
                $("#cravingsResistedInARow").parent().hide();
            }

            if (json.statistics.goal.clickCounter === 0) {
                $("#goal-content .timer-recepticle").hide();
            } else {
                statisticPresent = true;
            }
            if (json.statistics.goal.bestTimeSeconds === 0) {
                $("#longestGoalCompleted").parent().hide();
            }
            if (json.statistics.goal.completedGoals === 0) {
                $("#numberOfGoalsCompleted").parent().hide();
            }
            if (statisticPresent) {
                $("#statistics-content .initial-instructions").hide();
            }

            /* HIDE UNWANTED STATISTICS */
            //COST
            if (json.option.liveStatsToDisplay.spentButton == false) {
                $("#bought-button").parent().hide();
            }
            if (json.option.liveStatsToDisplay.boughtGoalButton == false) {
                $("#boughtGoalInput").parent().hide();
            }
            if (json.option.liveStatsToDisplay.sinceLastSpent == false) {
                $("#cost-content .timer-recepticle").hide();
            }
            if (json.option.liveStatsToDisplay.avgBetweenSpent == false) {
                $("#averageTimeBetweenBoughts").parent().hide();
            }
            if (json.option.liveStatsToDisplay.totalSpent == false) {
                $("#totalAmountSpent").parent().parent().hide();
            }
            if (json.option.liveStatsToDisplay.currWeekSpent == false) {
                $("#spentThisWeek").parent().parent().hide();
            }
            if (json.option.liveStatsToDisplay.currMonthSpent == false) {
                $("#spentThisMonth").parent().parent().hide();
            }
            if (json.option.liveStatsToDisplay.currYearSpent == false) {
                $("#spentThisYear").parent().parent().hide();
            }

            //USE
            if (json.option.liveStatsToDisplay.usedButton == false) {
                $("#use-button").parent().hide();
            }
            if (json.option.liveStatsToDisplay.usedGoalButton = false) {
                $("#usedGoalInput").parent().hide();
            }
            if (json.option.liveStatsToDisplay.cravedButton == false) {
                $("#crave-button").parent().hide();
            }
            if (json.option.liveStatsToDisplay.sinceLastDone == false) {
                $("#use-content .timer-recepticle").hide();
                //console.log("hide timer - use - if turned off");
            }

            if (json.option.liveStatsToDisplay.avgBetweenDone == false) {
                $("#averageTimeBetweenUses").parent().hide();
            }

            if (json.option.liveStatsToDisplay.didntPerDid == false) {
                $("#avgDidntPerDid").parent().hide();
            }

            if (json.option.liveStatsToDisplay.resistedInARow == false) {
                $("#cravingsResistedInARow").parent().hide();
            }

            //GOAL    
            if (json.option.liveStatsToDisplay.goalButton == false) {
                $("#goal-button").parent().hide();
            }

            if (json.option.liveStatsToDisplay.longestGoal === 0) {
                $("#longestGoalCompleted").parent().hide();
            }

        }
        function showActiveStatistics() {
            //Show Buttons if requested
            if (json.option.liveStatsToDisplay.spentButton == true) {
                $("#bought-button").parent().show();
            }
            if (json.option.liveStatsToDisplay.boughtGoalButton == true) {
                $("#boughtGoalInput").parent().hide();
            }
            if (json.option.liveStatsToDisplay.usedButton == true) {
                $("#use-button").parent().show();
            }
            if (json.option.liveStatsToDisplay.usedGoalButton == true) {
                $("#usedGoalInput").parent().hide();
            }
            if (json.option.liveStatsToDisplay.cravedButton == true) {
                $("#crave-button").parent().show();
            }
            if (json.option.liveStatsToDisplay.goalButton == true) {
                $("#goal-button").parent().show();
            }

            //bought page 
            if (json.statistics.cost.clickCounter !== 0) {
                $("#bought-total").show();
                if (json.option.liveStatsToDisplay.sinceLastSpent == true) {
                    //console.log("about to show cost timer");
                    $("#cost-content .timer-recepticle").show();
                    $("#cost-content .fibonacci-timer").show();
                }
            }
            if (json.statistics.cost.averageBetweenClicks !== 0) {
                if (json.option.liveStatsToDisplay.avgBetweenSpent == true) {
                    $("#averageTimeBetweenBoughts").parent().show();
                    calculateAverageTimeBetween("cost");
                }
            }
            if (json.statistics.cost.totals.total !== 0) {
                $("#cost-content .statistic-recepticle").show();
                if (json.option.liveStatsToDisplay.totalSpent == true) {
                    $("#totalAmountSpent").parent().show();
                }
            }
            if (json.statistics.cost.totals.week !== json.statistics.cost.totals.total) {
                if (json.option.liveStatsToDisplay.currWeekSpent == true) {
                    $("#spentThisWeek").parent().show();
                }
            }
            if (json.statistics.cost.totals.month !== json.statistics.cost.totals.week) {
                if (json.option.liveStatsToDisplay.currMonthSpent == true) {
                    $("#spentThisMonth").parent().show();
                }
            }
            if (json.statistics.cost.totals.year !== json.statistics.cost.totals.month) {
                if (json.option.liveStatsToDisplay.currYearSpent == true) {
                    $("#spentThisYear").parent().show();
                }
            }
            if (json.statistics.use.clickCounter !== 0) {
                $("#use-total").show();
                if (json.option.liveStatsToDisplay.sinceLastDone == true) {
                    $("#use-content .timer-recepticle").show();
                    $("#use-content .fibonacci-timer").show();
                }
            }
            if (json.statistics.use.averageBetweenClicks !== 0) {
                if (json.option.liveStatsToDisplay.avgBetweenDone == true) {
                    $("#averageTimeBetweenUses").parent().show();
                    calculateAverageTimeBetween("use");
                }
            }
            if (json.statistics.use.craveCounter !== 0) {
                $("#crave-total").show();
            }
            if (json.statistics.use.craveCounter !== 0 && json.statistics.use.clickCounter !== 0) {
                if (json.option.liveStatsToDisplay.didntPerDid == true) {
                    $("#avgDidntPerDid").parent().show();
                }
            }
            if (json.statistics.use.cravingsInARow !== 0) {
                if (json.option.liveStatsToDisplay.resistedInARow == true) {
                    $("#cravingsResistedInARow").parent().show();
                }
            }

            //goal page
            if (json.statistics.goal.clickCounter !== 0 &&
                (json.statistics.goal.activeGoalBoth || json.statistics.goal.activeGoalBought || json.statistics.goal.activeGoalUse)
            ) {
                if (json.option.liveStatsToDisplay.untilGoalEnd == true) {
                    $("#goal-content .timer-recepticle").show();
                    $("#goal-content .fibonacci-timer").show();
                }
            }
            if (json.statistics.goal.bestTimeSeconds !== 0) {
                if (json.option.liveStatsToDisplay.longestGoal == true) {
                    $("#longestGoalCompleted").parent().show();
                }
            }
            if (json.statistics.goal.completedGoals !== 0) {
                $("#numberOfGoalsCompleted").parent().show();
            }
        }

        /*SETTINGS MENU FUNCTIONS*/
        //undo last click
        function undoLastAction() {
            var jsonObject = retrieveStorageObject();
            var undoneActionClickType = jsonObject["action"][jsonObject["action"].length - 1].clickType;

            //remove most recent (last) record
            jsonObject["action"].pop();

            setStorageObject(jsonObject);

            //UNBREAK GOAL
            //if action could have broken a goal
            if (undoneActionClickType == "used" || undoneActionClickType == "bought") {
                //cycle back through records until 
                for (var i = jsonObject["action"].length - 1; i >= 0; i--) {
                    var currRecord = jsonObject["action"][i];

                    if (currRecord.clickType == "goal" && (currRecord.goalType == "both" || currRecord.goalType == undoneActionClickType)) {
                        //if this first finds a goal which would have been broken by undoneActionClickType, 
                        //change this.status to active, exit loop 
                        changeGoalStatus(1, currRecord.goalType, -1);
                        break;

                    } else if (currRecord.clickType == undoneActionClickType) {
                        //if this first finds an action.clickType == undoneActionClickType, 
                        //then a goal could not have been broken, so exit loop without changing goal status
                        break;

                    }
                }
            }
            window.location.reload();

        }
        //reset all stats
        function clearActions() {
            window.localStorage.clear();
            window.location.reload();
        }

        /*SETTINGS MENU CLICK EVENTS */
        $("#undoActionButton").click(function (event) {
            event.preventDefault();
            if (confirm("Your last click will be undone - irreversibly. Are you sure?")) {
                undoLastAction();
            }
        });

        $("#clearTablesButton").click(function (event) {
            event.preventDefault();
            if (confirm("ALL your data will be cleared - irreversibly. Are you sure??")) {
                clearActions();
            }

        });

        /* CREATE NEW RECORD OF ACTION */
        //timestamp, clicktype, spent, goalStamp, goalType
        function updateActionTable(ts, ct, spt, gs, gt) {
            var jsonObject = retrieveStorageObject();

            ts = ts.toString();

            var newRecord;
            var now = Math.round(new Date() / 1000);

            if (ct == "used" || ct == "craved") {
                newRecord = { timestamp: ts, clickType: ct, clickStamp: now };

            } else if (ct == "bought") {
                spt = spt.toString();
                newRecord = { timestamp: ts, clickType: ct, clickStamp: now, spent: spt };

            } else if (ct == "goal") {
                gs = gs.toString();
                var st = 1;
                var goalStopped = -1;
                newRecord = { timestamp: ts, clickType: ct, clickStamp: now, goalStamp: gs, goalType: gt, status: st, goalStopped: goalStopped };
            }

            jsonObject["action"].push(newRecord);
            setStorageObject(jsonObject);

        }

        //readjust timer box to correct size
        function adjustFibonacciTimerToBoxes(timerId) {

            //came from putting all statistics onto one page
            var relevantPaneIsActive = true;

            if (userIsActive && relevantPaneIsActive) {
                var visibleBoxes = $("#" + timerId + " .boxes div:visible"),
                    timerElement = document.getElementById(timerId);

                if (visibleBoxes.length == 1) {
                    timerElement.style.width = "3.3rem";
                    timerElement.style.height = "3.3rem";

                    //adjustment to align horizontal at 4 boxes shown                    
                    timerElement.classList.remove("fully-visible");

                } else if (visibleBoxes.length == 2) {
                    timerElement.style.width = "6.4rem";
                    timerElement.style.height = "3.3rem";

                    //adjustment to align horizontal at 4 boxes shown                    
                    timerElement.classList.remove("fully-visible");

                } else if (visibleBoxes.length == 3) {
                    timerElement.style.width = "9.4rem";
                    timerElement.style.height = "6.4rem";

                    //adjustment to align horizontal at 4 boxes shown                    
                    timerElement.classList.remove("fully-visible");

                } else if (visibleBoxes.length == 4) {
                    timerElement.style.width = "15.7rem";
                    timerElement.style.height = "9.8rem";

                    //adjustment to align horizontal at 4 boxes shown                    
                    timerElement.classList.add("fully-visible");
                }

                //hack to resolve visible boxes = 0 bug
                if (visibleBoxes.length == 0) {
                    //adjust .fibonacci-timer to timer height
                    timerElement.style.width = "3.3rem";
                    timerElement.style.height = "3.3rem";
                }

                //timerElement.style.display = "block";
                timerElement.style.margin = "0 auto";

            }
        }

        //open more info div
        function openClickDialog(clickDialogTarget) {

            var navBarHeight = 62;

            $(clickDialogTarget + ".log-more-info").slideToggle("fast");

            $('html, body').animate({
                scrollTop: $('.log-more-info').offset().top - navBarHeight
            }, 1500);
            //grey out background
            var bodyHeight = $(document).height();
            $("#greyed-out-div").height(bodyHeight);
            $("#greyed-out-div").css("z-index", "10");
            $("#greyed-out-div").animate({ opacity: 0.7 }, 300);
            $("#greyed-out-div").click(function () {
                if ($("#greyed-out-div").height() > 0) {

                    if (confirm("Are you sure you want to close out of this dialog? No action will be recorded.")) {
                        closeClickDialog(clickDialogTarget);

                    }
                }
            });

        }

        function closeClickDialog(clickDialogTarget) {
            $("#greyed-out-div").animate({ opacity: 0 }, 200);
            $("#greyed-out-div").css("z-index", "0");
            $("#greyed-out-div").height(0);
            $("#greyed-out-div").off("click");

            $(clickDialogTarget + ".log-more-info").slideToggle("fast");
        }

        //SMOKE BUTTONS - START TIMER
        var smokeTimer;
        var boughtTimer;
        var goalTimer;

        /*Actions on switch tab */
        $(document).delegate("#baseline-tab-toggler", 'click', function (e) {
            saveActiveTab();
            $("#settings-tab-toggler").removeClass("active");
            $("#statistics-tab-toggler").removeClass("active");
            $("#reports-tab-toggler").removeClass("active");

            //close dropdown nav
            if ($("#options-collapse-menu").hasClass("show")) {
                $(".navbar-toggler").click();
            }

        });
        $(document).delegate("#reports-tab-toggler", 'click', function (e) {
            saveActiveTab();
            $("#baseline-tab-toggler").removeClass("active");
            $("#settings-tab-toggler").removeClass("active");
            $("#statistics-tab-toggler").removeClass("active");

            //close dropdown nav
            if ($("#options-collapse-menu").hasClass("show")) {
                $(".navbar-toggler").click();

            }

            initiateReport();

        });

        $(document).delegate("#statistics-tab-toggler", 'click', function (e) {
            saveActiveTab();

            setTimeout(function () {
                hideInactiveStatistics();
                adjustFibonacciTimerToBoxes("goal-timer");
                adjustFibonacciTimerToBoxes("smoke-timer");
                adjustFibonacciTimerToBoxes("bought-timer");

            }, 0);

            $("#baseline-tab-toggler").removeClass("active");
            $("#settings-tab-toggler").removeClass("active");
            $("#reports-tab-toggler").removeClass("active");

            //close dropdown nav
            if ($("#options-collapse-menu").hasClass("show")) {
                $(".navbar-toggler").click();
            }
        });

        $(document).delegate("#settings-tab-toggler", 'click', function (e) {

            saveActiveTab();
            $("#baseline-tab-toggler").removeClass("active");
            $("#reports-tab-toggler").removeClass("active");
            $("#statistics-tab-toggler").removeClass("active");

            //close dropdown nav
            if ($("#options-collapse-menu").hasClass("show")) {
                $(".navbar-toggler").click();
            }
        });

        /* CALL INITIAL STATE OF APP */
        //If json action table doesn't exist, create it
        if (localStorage.esCrave) {
            setOptionsFromStorage();
            setStatsFromRecords();

            //set stats	
            //set total clicks for each button
            $("#use-total").html(json.statistics.use.clickCounter);
            $("#crave-total").html(json.statistics.use.craveCounter);
            $("#bought-total").html(json.statistics.cost.clickCounter);

            //Average time between
            displayAverageTimeBetween("use");
            displayAverageTimeBetween("cost");
            displayLongestGoal();
            returnToActiveTab();
            hideTimersOnLoad();

            //after all is said and done 
            hideInactiveStatistics();

            //get them notifcations for useful reports
            initiateReport();

        } else {
            //replace this with 
            //empty action table
            //basic stat display settings option table
            var newJsonString = '{ "action": [], ' +
                '  "baseline": {"userSubmitted": false, "specificSubject": false, "decreaseHabit": true, "useStatsIrrelevant": false, "costStatsIrrelevant": false, "amountDonePerWeek":"0","goalDonePerWeek":"0","amountSpentPerWeek":"0","goalSpentPerWeek":"0", "valuesTime": true, "valuesMoney": true, "valuesHealth": true},' +
                '  "option": { "activeTab" : "settings-content",' +
                '"liveStatsToDisplay" : {"untilGoalEnd": true, "longestGoal": true, "sinceLastDone": true, "avgBetweenDone": true, "didntPerDid": true, "resistedInARow": true, "sinceLastSpent": true,"avgBetweenSpent": true, "totalSpent": true, "currWeekSpent": true, "currMonthSpent": true, "currYearSpent": true},' +
                '"logItemsToDisplay" : {"goal": true, "used": true, "craved": true,	"bought": true},' +
                '"reportItemsToDisplay" : {	"useChangeVsBaseline": false, "useChangeVsLastWeek": true, "costChangeVsBaseline": false, "costChangeVsLastWeek": true, "useGoalVsThisWeek": false, "costGoalVsThisWeek": false}' +
                '} }';
            localStorage.setItem("esCrave", newJsonString);

            hideInactiveStatistics();

            $("#settings-tab-toggler").click();
            $(".displayed-statistics-heading").hide();

            //ABSOLUTE NEW USER
            var introMessage = "<b>Welcome to Escrave</b> - the anonymous habit tracking app that shows you statistics about your habit as you go!";
            createNotification(introMessage);
        }

        //SMOKE BUTTON		
        //CRAVE BUTTON 		
        //BOUGHT BUTTON		
        $("#bought-button, #crave-button, #use-button, #goal-button").click(function () {

            //Detect section
            var timestampSeconds = Math.round(new Date() / 1000);

            if (this.id == "crave-button") {

                //don't allow clicks more recent than 10 seconds
                if (timestampSeconds - json.statistics.use.lastClickStampCrave > 10) {

                    //return user to stats page
                    $("#statistics-tab-toggler").click();

                    //update relevant statistics
                    json.statistics.use.craveCounter++;
                    $("#crave-total").html(json.statistics.use.craveCounter);
                    updateActionTable(timestampSeconds, "craved");

                    //add record into log
                    placeActionIntoLog(timestampSeconds, "craved", null, false);

                    var currCravingsPerSmokes = Math.round(json.statistics.use.craveCounter / json.statistics.use.clickCounter * 10) / 10;
                    $("#avgDidntPerDid").html(currCravingsPerSmokes);

                    json.statistics.use.cravingsInARow++;
                    $("#cravingsResistedInARow").html(json.statistics.use.cravingsInARow);

                    showActiveStatistics();

                    //keep lastClickStamp up to date while using app
                    json.statistics.use.lastClickStampCrave = timestampSeconds;

                } else {
                    alert("You just clicked this button! Wait a bit longer before clicking it again");
                }

            } else if (this.id == "use-button") {                
                openClickDialog(".use");

                var date = new Date();
                var currHours = date.getHours(),
                    currMinutes = date.getMinutes();
                if (currHours >= 12) {
                    $(".use.log-more-info .time-picker-am-pm").val("PM");
                    currHours = currHours % 12;
                }

                //set minutes to approx. what time it is
                if (currMinutes >= 45) {
                    currMinutes = 45;
                } else if (currMinutes >= 30) {
                    currMinutes = 30;
                } else if (currMinutes >= 15) {
                    currMinutes = 15;
                } else {
                    currMinutes = 0;
                }
                
                $(".use.log-more-info .time-picker-hour").val(currHours);
                $(".use.log-more-info .time-picker-minute").val(currMinutes);


            } else if (this.id == "bought-button") {
                openClickDialog(".cost");

            } else if (this.id == "goal-button") {
                openClickDialog(".goal");

                var date = new Date();
                var currHours = date.getHours(),
                    currMinutes = date.getMinutes();
                if (currHours >= 12) {
                    $(".goal.log-more-info .time-picker-am-pm").val("PM");
                    currHours = currHours % 12;
                }

                //set minutes to 0, 15, 30, or 45
                var currMinutesRounded = 0;
                if (currMinutes < 15) {
                    currMinutesRounded = 15;
                }else if (currMinutes < 30) {
                    currMinutesRounded = 30;
                } else if (currMinutes < 45) {
                    currMinutesRounded = 45;
                } else {
                    currHours += 1;
                }
                $(".goal.log-more-info .time-picker-minute").val(currMinutesRounded);
                $(".goal.log-more-info .time-picker-hour").val(currHours);

            }

        }); //end bought-button click handler

        //START USED TIMER		
        function initiateSmokeTimer(requestedTimestamp) {
            //if there is a more recent timer than newly requested
            var existingTimer = 
                requestedTimestamp != undefined && 
                requestedTimestamp < json.statistics.use.lastClickStamp;

            if (existingTimer) {
                return false;
            }
            //USE TIMER
            clearInterval(smokeTimer);

            if ($("#smoke-timer").hasClass("counting")) {
                //reset local vars
                var daysSinceUse = 0,
                    hoursSinceUse = 0,
                    minutesSinceUse = 0,
                    secondsSinceUse = 0,
                    totalSecondsSinceUse = 0;

                var nowTimestamp = Math.floor(new Date().getTime() / 1000);

                if (requestedTimestamp != undefined) {
                    totalSecondsSinceUse = nowTimestamp - requestedTimestamp;
                    daysSinceUse = Math.floor(totalSecondsSinceUse / (60*60*24));
                    hoursSinceUse = Math.floor(totalSecondsSinceUse / (60*60)) % 24;
                    minutesSinceUse = Math.floor(totalSecondsSinceUse / (60)) % 60;
                    secondsSinceUse = totalSecondsSinceUse % 60;
                    
                    // console.log("daysSinceUse: ", daysSinceUse)
                    // console.log("hoursSinceUse: ", hoursSinceUse)
                    // console.log("minutesSinceUse: ", minutesSinceUse)
                    // console.log("secondsSinceUse: ", secondsSinceUse)

                    //reset json vars
                    json.statistics.use.sinceTimerStart.days = daysSinceUse;
                    json.statistics.use.sinceTimerStart.hours = hoursSinceUse;
                    json.statistics.use.sinceTimerStart.minutes = minutesSinceUse;
                    json.statistics.use.sinceTimerStart.seconds = secondsSinceUse;
                    json.statistics.use.sinceTimerStart.totalSeconds = requestedTimestamp;

                } else {
                    //reset json vars
                    json.statistics.use.sinceTimerStart.days = 0;
                    json.statistics.use.sinceTimerStart.hours = 0;
                    json.statistics.use.sinceTimerStart.minutes = 0;
                    json.statistics.use.sinceTimerStart.seconds = 0;
                    json.statistics.use.sinceTimerStart.totalSeconds = 0;
                }
                
                //Insert timer values into timer
                $("#use-content .secondsSinceLastClick:first-child").html("0" + secondsSinceUse);
                $("#use-content .minutesSinceLastClick:first-child").html(minutesSinceUse);
                $("#use-content .hoursSinceLastClick:first-child").html(hoursSinceUse);
                $("#use-content .daysSinceLastClick:first-child").html(daysSinceUse);

                if (requestedTimestamp != undefined) {
                    for (let timerBox of $("#use-content .boxes div:visible")) {
                        if (parseInt($(timerBox).find(".timerSpan").html()) == 0) {
                            
                            console.log("$(timerBox): ", $(timerBox))
                            $(timerBox).hide();
                        } else { //found a non-zero value
                            $(timerBox).show();
                            break;
                        }
                    }

                } else {
                    if (!$("#use-content .fibonacci-timer").is(':visible')) {
                        $("#use-content .fibonacci-timer:first-child").toggle();
                   }
                   while ($("#use-content .boxes div:visible").length > 1) {
                       $( $("#use-content .boxes div:visible")[0] ).toggle();
                   }
                }

                adjustFibonacciTimerToBoxes("smoke-timer");

            } else {

                //reset timer from values
                var daysSinceUse = json.statistics.use.sinceTimerStart.days,
                    hoursSinceUse = json.statistics.use.sinceTimerStart.hours,
                    minutesSinceUse = json.statistics.use.sinceTimerStart.minutes,
                    secondsSinceUse = json.statistics.use.sinceTimerStart.seconds,
                    totalSecondsSinceUse = json.statistics.use.sinceTimerStart.totalSeconds;

                    // console.log("daysSinceUse: ", daysSinceUse)
                    // console.log("hoursSinceUse: ", hoursSinceUse)
                    // console.log("minutesSinceUse: ", minutesSinceUse)
                    // console.log("secondsSinceUse: ", secondsSinceUse)

                var nowTimestamp = Math.floor(new Date().getTime() / 1000);

                if (requestedTimestamp != undefined) {
                    totalSecondsSinceUse = nowTimestamp - requestedTimestamp;
                    daysSinceUse = Math.floor(totalSecondsSinceUse / (60*60*24));
                    hoursSinceUse = Math.floor(totalSecondsSinceUse / (60*60)) % 24;
                    minutesSinceUse = Math.floor(totalSecondsSinceUse / (60)) % 60;
                    secondsSinceUse = totalSecondsSinceUse % 60;
                
                }

                //Insert timer values into timer
                if (secondsSinceUse >= 10) {
                    $("#use-content .secondsSinceLastClick:first-child").html(secondsSinceUse);
                } else {
                    $("#use-content .secondsSinceLastClick:first-child").html("0" + secondsSinceUse);
                }
                $("#use-content .minutesSinceLastClick:first-child").html(minutesSinceUse);
                $("#use-content .hoursSinceLastClick:first-child").html(hoursSinceUse);
                $("#use-content .daysSinceLastClick:first-child").html(daysSinceUse);

                //Hide timer boxes which have zero values
                var foundNonZero = false;
            
                if (daysSinceUse == 0) {
                    $("#use-content .daysSinceLastClick").parent().toggle();
                } else {
                    foundNonZero = true;
                }
                
                if (hoursSinceUse == 0 && !foundNonZero) {
                    $("#use-content .hoursSinceLastClick").parent().toggle();
                } else {
                    foundNonZero = true;
                }

                if (minutesSinceUse == 0 && !foundNonZero) {
                    $("#use-content .minutesSinceLastClick").parent().toggle();
                } else if(minutesSinceUse == 0) {
                    $("#use-content .minutesSinceLastClick:first-child").html("0" + minutesSinceUse);
                } else {
                    foundNonZero = true;
                }
                
                adjustFibonacciTimerToBoxes("smoke-timer");

            }

            smokeTimer = setInterval(function() {
                //reset local scope vars
                totalSecondsSinceUse++;
                secondsSinceUse++;
                //update json
                json.statistics.use.sinceTimerStart.totalSeconds++;
                json.statistics.use.sinceTimerStart.seconds++;

                if (secondsSinceUse >= 10) {
                    $("#use-content .secondsSinceLastClick:first-child").html(secondsSinceUse);
                } else {
                    $("#use-content .secondsSinceLastClick:first-child").html("0" + secondsSinceUse);
                }

                if (secondsSinceUse >= 60) {
                    //reset local scope vars
                    secondsSinceUse = 0;
                    minutesSinceUse++;
                    //update json
                    json.statistics.use.sinceTimerStart.seconds = 0;
                    json.statistics.use.sinceTimerStart.minutes++;

                    if ($("#use-content .boxes div:visible").length == 1) {
                        var numberOfBoxesHidden = $("#use-content .boxes div:hidden").length;
                        $($("#use-content .boxes div:hidden")[numberOfBoxesHidden - 1]).toggle();

                    }

                    if (minutesSinceUse >= 10) {
                        $("#use-content .minutesSinceLastClick:first-child").html(minutesSinceUse);
                    } else {
                        $("#use-content .minutesSinceLastClick:first-child").html("0" + minutesSinceUse);
                    }
                    $("#use-content .secondsSinceLastClick:first-child").html("0" + secondsSinceUse);
                    adjustFibonacciTimerToBoxes("smoke-timer");


                }
                if (minutesSinceUse >= 60) {
                    //reset local scope vars
                    minutesSinceUse = 0;
                    hoursSinceUse++;
                    //update json
                    json.statistics.use.sinceTimerStart.minutes = 0;
                    json.statistics.use.sinceTimerStart.hours++;

                    if ($("#use-content .boxes div:visible").length == 2) {
                        var numberOfBoxesHidden = $("#use-content .boxes div:hidden").length;
                        $($("#use-content .boxes div:hidden")[numberOfBoxesHidden - 1]).toggle();
                    }

                    if (hoursSinceUse >= 10) {
                        $("#use-content .hoursSinceLastClick:first-child").html(hoursSinceUse);
                    } else {
                        $("#use-content .hoursSinceLastClick:first-child").html("0" + hoursSinceUse);
                    }

                    $("#use-content .minutesSinceLastClick:first-child").html("0" + minutesSinceUse);
                    adjustFibonacciTimerToBoxes("smoke-timer");

                }
                if (hoursSinceUse >= 24) {

                    //reset local vars
                    hoursSinceUse = 0;
                    daysSinceUse++;
                    //update json
                    json.statistics.use.sinceTimerStart.hours = 0;
                    json.statistics.use.sinceTimerStart.days++;

                    if ($("#use-content .boxes div:visible").length == 3) {
                        var numberOfBoxesHidden = $('#use-content .boxes div:hidden').length;
                        $($("#use-content .boxes div:hidden")[numberOfBoxesHidden - 1]).toggle();
                    }

                    $("#use-content .hoursSinceLastClick:first-child").html("0" + hoursSinceUse);
                    $("#use-content .daysSinceLastClick:first-child").html(daysSinceUse);

                }

            }, 1000); //end setInterval

            $("#smoke-timer").addClass("counting");
            $("#smoke-timer").show();

        }

        //USE DIALOG CLICK
        $(".use.log-more-info button.submit").click(function () {

            var date = new Date();
            var timestampSeconds = Math.round(date / 1000);

            //get time selection from form
            var requestedTimeStartHours = parseInt($(".use.log-more-info select.time-picker-hour").val());
            var requestedTimeStartMinutes = parseInt($(".use.log-more-info select.time-picker-minute").val());

            var userDidItNow = $("#nowUseRadio").is(':checked');
            if( userDidItNow ) {
                requestedTimeStartHours = date.getHours();
                requestedTimeStartMinutes = date.getMinutes();
            }

            //12 am is actually the first hour in a day... goddamn them.
            if (requestedTimeStartHours == 12) {
                requestedTimeStartHours = 0;
            }
            //account for am vs pm from userfriendly version of time input
            if ($(".use.log-more-info select.time-picker-am-pm").val() == "PM") {
                requestedTimeStartHours = requestedTimeStartHours + 12;
            }

            var requestedTimeDiffSeconds = 0;
                requestedTimeDiffSeconds += date.getHours()*60*60 - requestedTimeStartHours*60*60;
                requestedTimeDiffSeconds += date.getMinutes()*60 - requestedTimeStartMinutes*60;

                //use requested time
                requestedTimestamp = timestampSeconds - requestedTimeDiffSeconds;

                //return to relevant screen
                $("#statistics-tab-toggler").click();

                //fake firstStampUses in json obj
                if (json.statistics.use.clickCounter == 0) {
                    json.statistics.use.firstClickStamp = json.statistics.use.firstClickStamp + timestampSeconds;

                } else if (json.statistics.use.clickCounter == 1) {
                    json.statistics.use.averageBetweenClicks = timestampSeconds - json.statistics.use.firstClickStamp;

                }

                json.statistics.use.clickCounter++;
                $("#use-total").html(json.statistics.use.clickCounter);

                var currCravingsPerSmokes = Math.round(json.statistics.use.craveCounter / json.statistics.use.clickCounter * 10) / 10;
                $("#avgDidntPerDid").html(currCravingsPerSmokes);

                json.statistics.use.cravingsInARow = 0;
                $("#cravingsResistedInARow").html(json.statistics.use.cravingsInARow);

                //start timer with optional param for past date
                var userDidItNow = $("#nowUseRadio").is(':checked');
                if (userDidItNow) {
                    //update relevant statistics
                    updateActionTable(timestampSeconds, "used");
                    placeActionIntoLog(timestampSeconds, "used", null, false);
                    initiateSmokeTimer();

                } else {
                    //user is selecting time that appears to be in the future
                    //will interpret as minus one day
                    var secondsToNow = date.getHours()*60*60 + date.getMinutes()*60;
                    var secondsToRequested = requestedTimeStartHours*60*60 + requestedTimeStartMinutes*60;

                    console.log("date.getHours(): ", date.getHours())
                    console.log("date.getMinutes(): ", date.getMinutes())
                    console.log("requestedTimeStartHours: ", requestedTimeStartHours)
                    console.log("requestedTimeStartMinutes: ", requestedTimeStartMinutes)
                    console.log("secondsToRequested: ", secondsToRequested)
                    console.log("secondsToNow: ", secondsToNow)

                    if( secondsToRequested > secondsToNow) {
                        console.log('firing initsmoke with a req timestampe: ', requestedTimestamp)
                        //take one day off
                        requestedTimestamp = requestedTimestamp - (1*24*60*60);
                    }

                    //update relevant statistics
                    updateActionTable(requestedTimestamp, "used");
                    initiateSmokeTimer(requestedTimestamp);
                }

                //there is an active bought related goal
                if (json.statistics.goal.activeGoalUse !== 0 || json.statistics.goal.activeGoalBoth !== 0) {
                    if (json.statistics.goal.activeGoalUse !== 0) {
                        var goalType = "use";
                        var message = 'Your goal just ended early, ' +
                            'and was added to your habit log. ' +
                            'Be proud no matter what, all progress is good progress!';

                        json.statistics.goal.activeGoalUse = 0;

                    } else if (json.statistics.goal.activeGoalBoth !== 0) {
                        var goalType = "both";
                        var message = 'Your goal just ended early, ' +
                            'and was added to your habit log. ' +
                            'Be proud no matter what, all progress is good progress!';

                        json.statistics.goal.activeGoalBoth = 0;

                    }

                    changeGoalStatus(2, goalType, requestedTimestamp);
                    createNotification(message);
                    clearInterval(goalTimer);

                    $("#goal-content .timer-recepticle").hide();
                    hideInactiveStatistics();

                    //place a goal into the goal log
                    var startStamp = json.statistics.goal.lastClickStamp;
                    var actualEnd = requestedTimestamp;
                    placeGoalIntoLog(startStamp, actualEnd, goalType, false);

                    //if longest goal just happened
                    if ((actualEnd - startStamp) > json.statistics.goal.bestTimeSeconds) {
                        //update json
                        json.statistics.goal.bestTimeSeconds = (actualEnd - startStamp);
                        //insert onto page
                        var newLongestGoal = convertSecondsToDateFormat(json.statistics.goal.bestTimeSeconds);
                        $("#longestGoalCompleted").html(newLongestGoal);

                    }
                    //update number of goals
                    json.statistics.goal.completedGoals++;
                    $("#numberOfGoalsCompleted").html(json.statistics.goal.completedGoals);

                }

                showActiveStatistics();
                //keep lastClickStamp up to date while using app
                json.statistics.use.lastClickStamp = timestampSeconds;
                closeClickDialog(".use");

        });
        
        //notify user when requested times are for yesterday.
        $(".use.log-more-info").find(".time-picker-minute, .time-picker-hour, .time-picker-am-pm, .form-check-input").on('change', function() {
            var date = new Date();
            var currMinutes = date.getHours()*60 + date.getMinutes();
            var reqHours = parseInt( $(".use.log-more-info .time-picker-hour").val() );
            var reqMinutes = parseInt( $(".use.log-more-info .time-picker-minute").val() );

            //compensate for non-military time
            if ($(".use.log-more-info .time-picker-am-pm").val() == "PM") {
                reqHours = reqHours + 12;
            }
            //total requested minutes
            reqMinutes += reqHours*60;

            var reqTimeInFuture = reqMinutes > currMinutes;
            if (reqTimeInFuture && $('#pastTimeUseRadio').is(":checked") ) {
                $('.24-hour-day-indicator').show();
            } else {
                $('.24-hour-day-indicator').hide();
            }
        });

        $(".use.log-more-info button.cancel").click(function () {
            closeClickDialog(".use");
        });

        //START BOUGHT TIMER
        function initiateBoughtTimer() {
            clearInterval(boughtTimer);

            if ($("#bought-timer").hasClass("counting")) {

                //reset local vars
                var daysSinceBought = 0,
                    hoursSinceBought = 0,
                    minutesSinceBought = 0,
                    secondsSinceBought = 0,
                    totalSecondsSinceBought = 0;
                //reset json vars
                json.statistics.cost.sinceTimerStart.days = 0,
                    json.statistics.cost.sinceTimerStart.hours = 0,
                    json.statistics.cost.sinceTimerStart.minutes = 0,
                    json.statistics.cost.sinceTimerStart.seconds = 0,
                    json.statistics.cost.sinceTimerStart.totalSeconds = 0;

                //Insert timer values into timer
                $("#cost-content .secondsSinceLastClick:first-child").html("0" + secondsSinceBought);
                $("#cost-content .minutesSinceLastClick:first-child").html(minutesSinceBought);
                $("#cost-content .hoursSinceLastClick:first-child").html(hoursSinceBought);
                $("#cost-content .daysSinceLastClick:first-child").html(daysSinceBought);

                if (!$("#cost-content .fibonacci-timer").is(':visible')) {
                    $("#cost-content .fibonacci-timer:first-child").toggle();
                }
                while ($("#cost-content .boxes div:visible").length > 1) {
                    $($("#cost-content .boxes div:visible")[0]).toggle();

                }

            } else {

                //reset timer from values
                var daysSinceBought = json.statistics.cost.sinceTimerStart.days,
                    hoursSinceBought = json.statistics.cost.sinceTimerStart.hours,
                    minutesSinceBought = json.statistics.cost.sinceTimerStart.minutes,
                    secondsSinceBought = json.statistics.cost.sinceTimerStart.seconds,
                    totalSecondsSinceBought = json.statistics.cost.sinceTimerStart.totalSeconds;

                //Insert timer values into timer
                if (secondsSinceBought >= 10) {
                    $("#cost-content .secondsSinceLastClick:first-child").html(secondsSinceBought);
                } else {
                    $("#cost-content .secondsSinceLastClick:first-child").html("0" + secondsSinceBought);
                }
                $("#cost-content .minutesSinceLastClick:first-child").html(minutesSinceBought);
                $("#cost-content .hoursSinceLastClick:first-child").html(hoursSinceBought);
                $("#cost-content .daysSinceLastClick:first-child").html(daysSinceBought);

                //Hide timer boxes which have zero values
                if ($("#cost-content .secondsSinceLastClick:first-child").html() == "0") {
                    $("#cost-content .secondsSinceLastClick").parent().toggle();
                }

                if ($("#cost-content .minutesSinceLastClick:first-child").html() == "0") {
                    $("#cost-content .minutesSinceLastClick").parent().toggle();

                }

                if ($("#cost-content .hoursSinceLastClick:first-child").html() == "0") {
                    $("#cost-content .hoursSinceLastClick").parent().toggle();
                }

                //this temporarily toggles seconds box
                if ($("#cost-content .daysSinceLastClick:first-child").html() == "0") {
                    $("#cost-content .daysSinceLastClick").parent().toggle();
                }

                adjustFibonacciTimerToBoxes("bought-timer");
            }

            boughtTimer = setInterval(function () {
                totalSecondsSinceBought++;
                secondsSinceBought++;

                if (secondsSinceBought >= 10) {
                    $("#cost-content .secondsSinceLastClick:first-child").html(secondsSinceBought);
                } else {
                    $("#cost-content .secondsSinceLastClick:first-child").html("0" + secondsSinceBought);
                }

                if (secondsSinceBought >= 60) {
                    secondsSinceBought = 0;
                    minutesSinceBought++;
                    if ($("#cost-content .boxes div:visible").length == 1) {
                        var numberOfBoxesHidden = $("#cost-content .boxes div:hidden").length;
                        $($("#cost-content .boxes div:hidden")[numberOfBoxesHidden - 1]).toggle();
                    }
                    //add trailing zero to below 10 values
                    if (minutesSinceBought >= 10) {
                        $("#cost-content .minutesSinceLastClick:first-child").html(minutesSinceBought);
                    } else {
                        $("#cost-content .minutesSinceLastClick:first-child").html("0" + minutesSinceBought);
                    }
                    $("#cost-content .secondsSinceLastClick:first-child").html("0" + secondsSinceBought);

                    adjustFibonacciTimerToBoxes("bought-timer");
                }
                if (minutesSinceBought >= 60) {
                    minutesSinceBought = 0;
                    hoursSinceBought++;
                    if ($("#cost-content .boxes div:visible").length == 2) {
                        var numberOfBoxesHidden = $("#cost-content .boxes div:hidden").length;
                        $($("#cost-content .boxes div:hidden")[numberOfBoxesHidden - 1]).toggle();
                    }
                    //add trailing zero to below 10 values
                    if (hoursSinceBought >= 10) {
                        $("#cost-content .hoursSinceLastClick:first-child").html(hoursSinceBought);
                    } else {
                        $("#cost-content .hoursSinceLastClick:first-child").html("0" + hoursSinceBought);
                    }
                    $("#cost-content .minutesSinceLastClick:first-child").html("0" + minutesSinceBought);

                    adjustFibonacciTimerToBoxes("bought-timer");
                }
                if (hoursSinceBought >= 24) {
                    hoursSinceBought = 0;
                    daysSinceBought++;
                    if ($("#cost-content .boxes div:visible").length == 3) {
                        var numberOfBoxesHidden = $('#cost-content .boxes div:hidden').length;
                        $($("#cost-content .boxes div:hidden")[numberOfBoxesHidden - 1]).toggle();
                    }
                    $("#cost-content .hoursSinceLastClick:first-child").html("0" + hoursSinceBought);
                    $("#cost-content .daysSinceLastClick:first-child").html(daysSinceBought);

                    adjustFibonacciTimerToBoxes("bought-timer");
                }

            }, 1000); //end setInterval
            $("#bought-timer").addClass("counting");
            $("#bought-timer").show();
        }

        //GOAL TIMER	
        function initiateGoalTimer() {
            var timerSection = "#goal-content";

            json.statistics.goal.clickCounter++;

            clearInterval(goalTimer);

            var jsonDaysString = json.statistics.goal.untilTimerEnd.days,
                jsonHoursString = json.statistics.goal.untilTimerEnd.hours,
                jsonMinutesString = json.statistics.goal.untilTimerEnd.minutes,
                jsonSecondsString = json.statistics.goal.untilTimerEnd.seconds,
                jsonTotalSecondsString = json.statistics.goal.untilTimerEnd.totalSeconds;

            $(timerSection + " .secondsSinceLastClick:first-child").html(jsonSecondsString);
            $(timerSection + " .minutesSinceLastClick:first-child").html(jsonMinutesString);
            $(timerSection + " .hoursSinceLastClick:first-child").html(jsonHoursString);
            $(timerSection + " .daysSinceLastClick:first-child").html(jsonDaysString);

            //return to default all visible value
            $("#goal-content .boxes div").show();

            //make boxes with value of zero hidden	until find a non zero value
            function hideZeroValueTimerBoxes(timerSection) {
                //make boxes with value of zero hidden	until find a non zero value
                for (var i = 0; i < $("#" + timerSection + " .boxes div").length; i++) {
                    var currTimerSpanValue = $("#" + timerSection + " .boxes div .timerSpan")[i];
                    if (currTimerSpanValue.innerHTML == "0") {
                        $(currTimerSpanValue).parent().hide();
                    } else {
                        break;
                    }
                }
            }
            hideZeroValueTimerBoxes("goal-content");

            goalTimer = setInterval(function () {

                jsonTotalSecondsString--;
                jsonSecondsString--;

                if (jsonSecondsString >= 10) {
                    $(timerSection + " .secondsSinceLastClick:first-child").html(jsonSecondsString);
                } else {
                    $(timerSection + " .secondsSinceLastClick:first-child").html("0" + jsonSecondsString);
                }

                if (jsonSecondsString < 0) {

                    if (jsonMinutesString > 0 || jsonHoursString > 0 || jsonDaysString > 0) {
                        jsonSecondsString = 59;
                        jsonMinutesString--;
                        if (jsonMinutesString == 0 && jsonHoursString == 0 && jsonDaysString == 0) {
                            if ($(timerSection + ' .boxes div:visible').length > 1) {
                                $($(timerSection + ' .boxes div:visible')[0]).toggle();

                                adjustFibonacciTimerToBoxes("goal-timer");
                            }
                        }

                    } else {
                        /* ENTIRE GOAL IS DONE */
                        jsonSecondsString = 0;
                        clearInterval(goalTimer);
                        hideInactiveStatistics();

                        //find most recent goal type
                        var goalType = "";
                        if (json.statistics.goal.activeGoalBoth == 1) {
                            goalType = "both";
                            json.statistics.goal.activeGoalBoth = 0;

                        } else if (json.statistics.goal.activeGoalBought == 1) {
                            goalType = "bought";
                            json.statistics.goal.activeGoalBought = 0;

                        } else if (json.statistics.goal.activeGoalUse == 1) {
                            goalType = "use";
                            json.statistics.goal.activeGoalUse = 0;
                        }

                        var actualEnd = Math.round(new Date() / 1000);
                        changeGoalStatus(3, goalType, actualEnd);

                        //(startStamp, endStamp, goalType) =>
                        var startStamp = json.statistics.goal.lastClickStamp;
                        placeGoalIntoLog(startStamp, actualEnd, goalType, false);

                        //if longest goal just happened
                        if ((actualEnd - startStamp) > json.statistics.goal.bestTimeSeconds) {
                            //update json
                            json.statistics.goal.bestTimeSeconds = (actualEnd - startStamp);
                            //insert onto page
                            var newLongestGoal = convertSecondsToDateFormat(json.statistics.goal.bestTimeSeconds);
                            $("#longestGoalCompleted").html(newLongestGoal);

                        }
                        //update number of goals
                        json.statistics.goal.completedGoals++;
                        $("#numberOfGoalsCompleted").html(json.statistics.goal.completedGoals);
                        showActiveStatistics();

                        //notify user that goal ended
                        var message = "your goal just ended, congrats! Check your habit log on your statistics page for details.";
                        createNotification(message);

                        //disappear zero seconds left timer
                        $(timerSection + " .fibonacci-timer").parent().hide();
                    }

                    $(timerSection + " .minutesSinceLastClick:first-child").html(jsonMinutesString);
                    $(timerSection + " .secondsSinceLastClick:first-child").html(jsonSecondsString);
                }
                if (jsonMinutesString < 0) {

                    if (jsonHoursString > 0 || jsonDaysString > 0) {
                        jsonMinutesString = 59;
                        jsonHoursString--;
                        if (jsonHoursString == 0 && jsonDaysString == 0) {
                            if ($(timerSection + ' .boxes div:visible').length > 1) {
                                $($(timerSection + ' .boxes div:visible')[0]).toggle();

                                adjustFibonacciTimerToBoxes("goal-timer");
                            }
                        }
                    }

                    $(timerSection + " .minutesSinceLastClick:first-child").html(jsonMinutesString);
                    $(timerSection + " .hoursSinceLastClick:first-child").html(jsonHoursString);
                }
                if (jsonHoursString < 0) {
                    if (jsonDaysString > 0) {
                        jsonHoursString = 23;
                        jsonDaysString--;
                        if (jsonDaysString == 0) {
                            //console.log("days turns to zero");
                            setTimeout(function () {
                                $($("#goal-content .boxes div")[0]).hide();
                                adjustFibonacciTimerToBoxes("goal-timer");
                            }, 0);

                        }
                    }

                    if ($(timerSection + " .boxes div:visible").length == 3) {
                        var numberOfBoxesHidden = $(timerSection + ' .boxes div:hidden').length;
                        $($(timerSection + " .boxes div:hidden")[numberOfBoxesHidden - 1]).toggle();
                    }
                    $(timerSection + " .hoursSinceLastClick:first-child").html(jsonHoursString);
                    $(timerSection + " .daysSinceLastClick:first-child").html(jsonDaysString);
                }

            }, 1000); //end setInterval

            $("#goal-button").addClass("counting");
        }

        //COST DIALOG CLICK
        $(".cost.log-more-info button.submit").click(function () {
            var amountSpent = $("#spentInput").val();

            if (!$.isNumeric(amountSpent)) {
                alert("Please enter in a number!");

            } else {

                //return to relevant screen
                $("#statistics-tab-toggler").click();

                var timestampSeconds = Math.round(new Date() / 1000);
                updateActionTable(timestampSeconds, "bought", amountSpent);

                //add record into log
                placeActionIntoLog(timestampSeconds, "bought", amountSpent, false);

                //fake firstStampBought in json obj
                if (json.statistics.cost.clickCounter == 0) {
                    json.statistics.cost.firstClickStamp = json.statistics.cost.firstClickStamp + timestampSeconds;

                } else if (json.statistics.cost.clickCounter == 1) {
                    json.statistics.cost.averageBetweenClicks = timestampSeconds - json.statistics.cost.firstClickStamp;

                }

                //update display
                json.statistics.cost.clickCounter++;
                $("#bought-total").html(json.statistics.cost.clickCounter);

                //update spent in json
                json.statistics.cost.totals.total = parseInt(json.statistics.cost.totals.total) + parseInt(amountSpent);
                json.statistics.cost.totals.week = parseInt(json.statistics.cost.totals.week) + parseInt(amountSpent);
                json.statistics.cost.totals.month = parseInt(json.statistics.cost.totals.month) + parseInt(amountSpent);
                json.statistics.cost.totals.year = parseInt(json.statistics.cost.totals.year) + parseInt(amountSpent);

                console.log("json.statistics.cost.totals after submit: ", json.statistics.cost.totals)
                //update display
                $("#totalAmountSpent").html("$" + json.statistics.cost.totals.total);
                $("#spentThisWeek").html("$" + json.statistics.cost.totals.week );
                $("#spentThisMonth").html("$" + json.statistics.cost.totals.month );
                $("#spentThisYear").html("$" + json.statistics.cost.totals.year );

                closeClickDialog(".cost");
                initiateBoughtTimer();
                showActiveStatistics();
                hideInactiveStatistics();
                adjustFibonacciTimerToBoxes("bought-timer");

                //there is an active bought related goal
                if (json.statistics.goal.activeGoalBought !== 0 || json.statistics.goal.activeGoalBoth !== 0) {
                    if (json.statistics.goal.activeGoalBought !== 0) {
                        var goalType = "bought";
                        var message = 'Your goal just ended early, ' +
                            'it has been added to your habit log. ' +
                            'Be proud, any progress is good progress!';

                        json.statistics.goal.activeGoalBought = 0;

                    } else if (json.statistics.goal.activeGoalBoth !== 0) {
                        var goalType = "both";
                        var message = 'Your goal just ended early, ' +
                            'it has been added to your habit log. ' +
                            'Be proud, any progress is good progress!';

                        json.statistics.goal.activeGoalBoth = 0;

                    }

                    changeGoalStatus(2, goalType, timestampSeconds);
                    createNotification(message);
                    clearInterval(goalTimer);

                    $("#goal-content .timer-recepticle").hide();
                    hideInactiveStatistics();

                    //place a goal into the goal log
                    var startStamp = json.statistics.goal.lastClickStamp;
                    var actualEnd = timestampSeconds;
                    placeGoalIntoLog(startStamp, actualEnd, goalType, false);

                    //if longest goal just happened
                    if ((actualEnd - startStamp) > json.statistics.goal.bestTimeSeconds) {
                        //update json
                        json.statistics.goal.bestTimeSeconds = (actualEnd - startStamp);
                        //insert onto page
                        var newLongestGoal = convertSecondsToDateFormat(json.statistics.goal.bestTimeSeconds);
                        $("#longestGoalCompleted").html(newLongestGoal);

                    }
                    //update number of goals
                    json.statistics.goal.completedGoals++;
                    $("#numberOfGoalsCompleted").html(json.statistics.goal.completedGoals);
                    showActiveStatistics();
                }
                //keep lastClickStamp up to date while using app
                json.statistics.cost.lastClickStamp = timestampSeconds;
            }

        });

        $(".cost.log-more-info button.cancel").click(function () {
            closeClickDialog(".cost");
        });

        //calculate goal timer values
        function loadGoalTimerValues(totalSecondsUntilGoalEnd) {

            json.statistics.goal.untilTimerEnd.days = 0;
            json.statistics.goal.untilTimerEnd.hours = 0;
            json.statistics.goal.untilTimerEnd.minutes = 0;
            json.statistics.goal.untilTimerEnd.seconds = 0;
            json.statistics.goal.untilTimerEnd.totalSeconds = totalSecondsUntilGoalEnd;

            //calc mins and secs
            if (totalSecondsUntilGoalEnd > 60) {
                json.statistics.goal.untilTimerEnd.seconds = totalSecondsUntilGoalEnd % 60;
                json.statistics.goal.untilTimerEnd.minutes = Math.floor(totalSecondsUntilGoalEnd / 60);
            } else {
                json.statistics.goal.untilTimerEnd.seconds = totalSecondsUntilGoalEnd;
                json.statistics.goal.untilTimerEnd.minutes = 0;
            }

            //calc hours
            if (totalSecondsUntilGoalEnd > (60 * 60)) {
                json.statistics.goal.untilTimerEnd.minutes = json.statistics.goal.untilTimerEnd.minutes % 60;
                json.statistics.goal.untilTimerEnd.hours = Math.floor(totalSecondsUntilGoalEnd / (60 * 60));
            } else {
                json.statistics.goal.untilTimerEnd.hours = 0;
            }

            //calc days
            if (totalSecondsUntilGoalEnd > (60 * 60 * 24)) {
                json.statistics.goal.untilTimerEnd.hours = json.statistics.goal.untilTimerEnd.hours % 24;
                json.statistics.goal.untilTimerEnd.days = Math.floor(totalSecondsUntilGoalEnd / (60 * 60 * 24));
            } else {
                json.statistics.goal.untilTimerEnd.days = 0;
            }

        }

        //Restrict possible dates chosen in goal tab datepicker
        //restrictGoalRange();
        $("#goalEndPicker").datepicker({ minDate: 0 });
        //INITIALIZE GOAL DATE TIME PICKER
        $("#goalEndPicker").datepicker();

        //GOAL DIALOG CLICK
        $(".goal.log-more-info button.submit").click(function () {

            var date = new Date();
            var timestampSeconds = Math.round(date / 1000);

            //get time selection from form
            var requestedTimeEndHours = parseInt($(".goal.log-more-info select.time-picker-hour").val());
            var requestedTimeEndMinutes = parseInt($(".goal.log-more-info select.time-picker-minute").val());

            //12 am is actually the first hour in a day... goddamn them.
            if (requestedTimeEndHours == 12) {
                requestedTimeEndHours = 0;
            }
            //account for am vs pm from userfriendly version of time input
            if ($(".goal.log-more-info select.time-picker-am-pm").val() == "PM") {
                requestedTimeEndHours = requestedTimeEndHours + 12;
            }

            var requestedGoalEnd = $('#goalEndPicker').datepicker({
                dateFormat: 'yy-mm-dd'
            }).val();

            var goalStampSeconds = Math.round(new Date(requestedGoalEnd).getTime() / 1000);

            var secondsUntilRequestedGoal = (requestedTimeEndHours * 60 * 60) + (requestedTimeEndMinutes * 60);
            //values 1-12 for Hours 0-59 for minutes	

            //default datepicker time selection
            var secondsUntilDefaultTime = (0);
            var nowHours = date.getHours();
            var nowMinutes = date.getMinutes();
            var secondsUntilNow = (nowHours * 60 * 60) + (nowMinutes * 60);
            //values 1-12 for Hours 0-59 for minutes	

            if (goalStampSeconds >= timestampSeconds || secondsUntilRequestedGoal > secondsUntilNow) {

                goalStampSeconds += secondsUntilRequestedGoal;

                var goalType = "";
                /* figure goal type */
                if ($("#boughtGoalInput").is(":checked") && $("#usedGoalInput").is(":checked")) {
                    //both are checked
                    goalType = "both";

                } else {
                    if ($("#boughtGoalInput").is(":checked")) {
                        goalType = "bought";
                    } else if ($("#usedgoalInput").is(":checked")) {
                        goalType = "use";
                    }
                }

                //there is an active goal
                if (json.statistics.goal.activeGoalUse !== 0 ||
                    json.statistics.goal.activeGoalBought !== 0 ||
                    json.statistics.goal.activeGoalBoth !== 0) {

                    //ask if if user wants to extend goal
                    var message = "You already have an active goal, would you like to extend it?";
                    var responseTools =
                        '<button class="notification-response-tool extend-goal" href="#" >' +
                        'Yes</button>' +
                        '<button class="notification-response-tool end-goal" href="#">' +
                        'No</button>';


                    createNotification(message, responseTools);

                } else {
                    //keep lastClickStamp up to date while using app
                    json.statistics.goal.lastClickStamp = timestampSeconds;

                    //return to relevant screen
                    $("#statistics-tab-toggler").click();

                    //set local json goal type which is active
                    var jsonHandle = "activeGoal" + goalType.charAt(0).toUpperCase() + goalType.slice(1);
                    json.statistics.goal[jsonHandle] = 1;

                    updateActionTable(timestampSeconds, "goal", "", goalStampSeconds, goalType);

                    //convert goalend to days hours minutes seconds
                    var totalSecondsUntilGoalEnd = Math.round(goalStampSeconds - timestampSeconds);

                    loadGoalTimerValues(totalSecondsUntilGoalEnd);
                    initiateGoalTimer();

                    showActiveStatistics();
                    adjustFibonacciTimerToBoxes("goal-timer");

                }

                closeClickDialog(".goal");


            } else {
                /* user selected a time on today (equal to or) prior to current time */
                alert("Please choose a time later than right now!");
            }

        });

        $(".goal.log-more-info button.cancel").click(function () {
            closeClickDialog(".goal");
        });



    } else {
        //NO LOCAL STORAGE
        alert("This app uses your local storage to store your data." +
            " That means we DO NO STORE YOUR DATA. You store your data." +
            " BUT, your browser doesn't support local storage, so your data cannot be saved!" +
            " Modern browsers support LocalStorage, so if you want to try Escrave, you should update your browser or try Chrome, Firefox, or safari!");
    }


    //refreshes the page automatically, upon user action,
    //to refresh timers from local storage timestamp
    var userIsActive = true;
    (function manageInactivity() {
        var idleTime = 0;
        //Increment the idle time counter every minute.
        var idleInterval = setInterval(timerIncrement, 60000); // 1 minute

        //Zero the idle timer on mouse movement.
        $(this).mousemove(function (e) {
            idleTime = 0;
        });
        $(this).keypress(function (e) {
            idleTime = 0;
        });

        function timerIncrement() {
            idleTime = idleTime + 1;
            if (idleTime >= 5) { // 5 minutes

                userIsActive = false;
                $(this).mousemove(function (e) {
                    if (!userIsActive) {
                        window.location.reload();
                    }
                    userIsActive = true;
                });
                $(this).keypress(function (e) {
                    if (!userIsActive) {
                        window.location.reload();
                    }
                    userIsActive = true;

                });
            }
        }

    })();

});
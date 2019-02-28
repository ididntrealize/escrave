var welcomeToMyJavascriptDoc;
/****************************************************************************
 * This document is kinda long, like over 3000 lines,
 * so let me give you a quick overview of how everything works
 * that is, assuming it IS working. It usually does, I swear...
 * 
 * ANYWAYS, 
 * the app accepts 4 inputs: I bought it, I did it, i didn't do it, Make a goal
 * the goal input extends to a date and time picker,
 * the bought input extends to accept an amount of money,
 * the did and didn't inputs take no additional parameters.
 * 
 * The rest of the app updates statistics about this data onLoad and onClick.
 * Each type of click has a live timer, which is kept in sync even if users close the site, or go inactive.
 * Statistics are shown or hidden based on if they have a relevant value, 
 * there's a function to show relevant statistics, and one to hide them if there isn't enough data for them to be relevant.
 * Most of the functions are related to formatting and displaying statistics about user input, 
 * however, a large amount are dedicated to handling goal completion.
 * onLoad, there is a check if a goal has completed since the user has visited the site,
 * if a goal has ended, they are prompted to either confirm the goal as complete, or to mark the date their goal really ended.
 * Any completed goal will populate into a list of completed goals, demonstrating amount of time spent and when the goal ended.
 * 
 * Additionally, there are some rudimentary controls built in, to help the user recieve relevant data from the app:
 * There is a button that removes the last click action in storage (UNDO), 
 * a button to completely wipe storage (START OVER), 
 * and one to dump their storage for debugging purposes.
 * 
 * Dig in, and please get back to me about any inconsistencies, or improvements!
 * 
 * ONE LAST THING - the software license
 * 
 * MIT License

Copyright (c) 2019 Corey Boiko

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


$( document ).ready(function() {


//refreshes the page automatically, upon user action,
//to refresh timers from local storage timestamp
var userIsActive = true;
(function manageInactivity(){
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
				if(!userIsActive){
					window.location.reload();
				}
				userIsActive = true;
			});
			$(this).keypress(function (e) {
				if(!userIsActive){
					window.location.reload();
				}
				userIsActive = true;
				
			});
			
		}
	}


})();
	
    //CLIENT CAN USE STORAGE SYSTEM - html5
        if (typeof(Storage) !== "undefined") {

            //local working data to use in app
				var json = {
					
					"statistics":
					{
						"cost":
						{
							"sinceTimerStart":
							{
								"totalSeconds": 0,
								"days": 0,
								"hours": 0,
								"minutes": 0,
								"seconds": 0
							},
							"clickCounter": 0,
							"total": 0,
							"thisWeek": 0,
							"thisMonth": 0,
							"thisYear": 0,
							"firstClickStamp": 0,
							"lastClickStamp": 0,
							"averageBetweenClicks": 0
						},

						"use":
						{
							"sinceTimerStart":
							{
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
							"lastClickStampCrave" : 0,
							"averageBetweenClicks": 0
						},

						"goal":
						{
							"untilTimerEnd":
							{
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

                    "baseline":
                    {
                        "specificSubject": 0,
                        "amountDonePerWeek": 0,
                        "goalDonePerWeek": 0,
                        "amountSpentPerWeek": 0,
                        "goalSpentPerWeek": 0
                    },

					"option":
					{
						"activeTab": "reports-content",
                        "liveStatsToDisplay":{
									"untilGoalEnd": true,
									"longestGoal": true,
									"sinceLastDone": true,
									"avgBetweenDone": true,
									"didntPerDid": true,
									"resistedInARow": true,
									"sinceLastSpent": true,
									"avgBetweenSpent": true,
									"totalSpent": true,
									"currWeekSpent": true,
									"currMonthSpent": true,
									"currYearSpent": true
                                 },

                        "logItemsToDisplay":{
									"goal": true,
									"used": true,
									"craved": true,
									"bought": true
                                },
                        "reportItemsToDisplay":{
									"useChangeVsBaseline": false,
									"useChangeVsLastWeek": true,
									"costChangeVsBaseline": false,
									"costChangeVsLastWeek": true,
                                    "useGoalVsThisWeek": false,
									"costGoalVsThisWeek": false
							     }
					}

				};
		//open 
        function retrieveStorageObject(key){
            //convert localStorage to json
            if(key){
                var currJsonString =  localStorage[key];
				var jsonObject = JSON.parse(currJsonString);

            }else{
				var currJsonString =  localStorage.esCrave;
				var jsonObject = JSON.parse(currJsonString);
            }

            return jsonObject;
        }

        function setStorageObject(object){
            var jsonString = JSON.stringify(object);
		    localStorage.esCrave = jsonString;
        }


		//get data from storage and convert to working json object
            //set initial values in app			 
			function setStateFromRecords(){
				
				var jsonObject = retrieveStorageObject();
				
				//retrieve curr date for time relevant stats
				var timeNow = Math.round(new Date()/1000);
				
						
							
						/* USE STATISTICS */
								//total USE actions
									var useTabActions = jsonObject.action.filter(function(e){
										return e.clickType == "used" || e.clickType == "craved";
									});
							
								//total uses
									var useCount = jsonObject.action.filter(function(e){
										return e.clickType == "used";
									});
									json.statistics.use.clickCounter = useCount.length;
								
								//Restart timer value
								if(useCount.length>0){
									var sinceLastUse = useCount[useCount.length-1].timestamp;
									restartTimerAtValues("use", sinceLastUse);

									//average time between uses	
										var totalTimeBetweenUses = useCount[useCount.length - 1].timestamp - useCount[0].timestamp,
											averageTimeBetweenUses = Math.round(totalTimeBetweenUses/(useCount.length));

										if ($.isNumeric(averageTimeBetweenUses)){
											json.statistics.use.averageBetweenClicks = averageTimeBetweenUses;
										}


									//used to calculate avg time between from json obj, live
										json.statistics.use.firstClickStamp = useCount[0].timestamp;

									//timestamp of most recent click - to limit clicks in a row
										json.statistics.use.lastClickStamp = useCount[useCount.length-1].timestamp;
										
								}

							
								//total craves
									var craveCount = jsonObject.action.filter(function(e){
										return e.clickType == "craved";
									});
									json.statistics.use.craveCounter = craveCount.length;
								
								//craves in a row
									var cravesInARow = 0;
										for(i = useTabActions.length - 1; i>=0 ;i--){
											
											if(useTabActions[i].clickType == "craved"){
												cravesInARow++;
											}else{
												break;
											}
											
										}
									//update display	
									$("#cravingsResistedInARow").html(cravesInARow);
									//update json
									json.statistics.use.cravingsInARow = cravesInARow;

									
								//timestamp of most recent click - to limit clicks in a row
								if(craveCount.length > 0){
									json.statistics.use.lastClickStampCrave = craveCount[craveCount.length-1].timestamp;
								}

									
								//avg craves per smoke
									var avgDidntPerDid = Math.round( craveCount.length/useCount.length *10) /10;
									//don't forget to call updates from clicking smoke and crave button
									$("#avgDidntPerDid").html(avgDidntPerDid);
									
						/* COST STATISTICS */		
								//total boughts
									var boughtCount = jsonObject.action.filter(function(e){
										return e.clickType == "bought";
									});
									json.statistics.cost.clickCounter = boughtCount.length;
									
									
								//Restart timer value
								if(boughtCount.length>0){
									var sinceLastBought = boughtCount[boughtCount.length-1].timestamp;
									restartTimerAtValues("cost", sinceLastBought);

									//average time between boughts
										var totalTimeBetweenBoughts = boughtCount[boughtCount.length - 1].timestamp - boughtCount[0].timestamp,
											averageTimeBetweenBoughts = Math.round(totalTimeBetweenBoughts/(boughtCount.length));

									if ($.isNumeric(averageTimeBetweenBoughts)){
										json.statistics.cost.averageBetweenClicks = averageTimeBetweenBoughts;
									}
									
									//used to calculate avg time between from json obj, live
										json.statistics.cost.firstClickStamp = boughtCount[0].timestamp;

									//timestamp of most recent click - to limit clicks in a row
										json.statistics.cost.lastClickStamp = boughtCount[boughtCount.length-1].timestamp;
										
									

								}
								//calculate timestamps for past week
								
								
									var oneWeekAgoTimeStamp = timeNow - (60*60*24*7);
										oneMonthAgoTimeStamp = timeNow - (60*60*24*30),
										oneYearAgoTimeStamp = timeNow - (60*60*24*365);

									var runningTotalCost = 0,
										runningTotalCostWeek = 0,
										runningTotalCostMonth = 0,
										runningTotalCostYear = 0;

									
									for (i = boughtCount.length - 1; i >= 0; i--){
										
										//update every bought record into running total
										runningTotalCost = runningTotalCost + parseInt(boughtCount[i].spent);

										if (boughtCount[i].timestamp > oneWeekAgoTimeStamp){
											//update running week only with timestamps from past week
											runningTotalCostWeek = runningTotalCostWeek + parseInt(boughtCount[i].spent);

										}

										if (boughtCount[i].timestamp > oneMonthAgoTimeStamp){
											//update any record in last month into running total month
											runningTotalCostMonth = runningTotalCostMonth + parseInt(boughtCount[i].spent);
											
											}
										
										if (boughtCount[i].timestamp > oneYearAgoTimeStamp){
											//update any record in last month into running total month
											runningTotalCostYear = runningTotalCostYear + parseInt(boughtCount[i].spent);
											//might have to fabricate this sucker to test it.
											}

									}
									//console.log(runningTotalCost + " = total cost \n" + runningTotalCostWeek + " = cost this week\n"  + runningTotalCostMonth + " = cost this month\n" + runningTotalCostYear + " = cost this year");
									
									//update display
									$("#totalAmountSpent").html(runningTotalCost + "$");
									$("#spentThisWeek").html(runningTotalCostWeek + "$");
									$("#spentThisMonth").html(runningTotalCostMonth + "$");
									$("#spentThisYear").html(runningTotalCostYear + "$");

									//update json
									json.statistics.cost.total    = runningTotalCost;
									json.statistics.cost.thisWeek  = runningTotalCostWeek;
									json.statistics.cost.thisMonth = runningTotalCostMonth;
									json.statistics.cost.thisYear  = runningTotalCostYear;

						/* GOAL STATISTICS*/
									
								var goalCount = jsonObject.action.filter(function(e){
										return e.clickType == "goal";
									});
								//goal status
								//1 == active goal
								//2 == partially completed goal
								//3 == completed goal
								
							
								if(goalCount.length>0){
									var activeGoals = goalCount.filter(function(e){ return e.status == 1});
									//console.log("inside setStateFromRecords, activeGoals = " + activeGoals);
									
									var inactiveGoals = goalCount.filter(function(e){ return e.status == 2 || e.status == 3 });
									//console.log("inside setStateFromRecords, inactiveGoals = " + inactiveGoals);	
									
									//timestamp of most recent click - to limit clicks in a row
									json.statistics.goal.lastClickStamp = goalCount[goalCount.length-1].timestamp;
									
									json.statistics.goal.clickCounter = goalCount.length;
									if (activeGoals.length > 0){
										var mostRecentGoal = activeGoals[activeGoals.length - 1];

										//set var in json for if there is an active goal of X type - 
										//to be used on click of relevant buttons to end goal
										if(mostRecentGoal.goalType == "both"){
											json.statistics.goal.activeGoalBoth = 1;

										}else if(mostRecentGoal.goalType == "use"){
											json.statistics.goal.activeGoalUse = 1;

										}else if(mostRecentGoal.goalType == "bought"){
											json.statistics.goal.activeGoalBought = 1;

										}


										var totalSecondsUntilGoalEnd = mostRecentGoal.goalStamp - timeNow;
							
										if (totalSecondsUntilGoalEnd > 0){
										
											loadGoalTimerValues(totalSecondsUntilGoalEnd);
											initiateGoalTimer();	
										}else{
											//goal ended ewhile user was away
											var mostRecentGoal = goalCount[goalCount.length - 1];
											createGoalEndNotification(mostRecentGoal);
											//last made goal time has concluded
												//hide empty timer
												$("#goal-content .timer-recepticle").hide();
										}
									}else{
										
										//last made goal time has concluded
										//hide empty timer
											$("#goal-content .timer-recepticle").hide();
									}

									if(inactiveGoals.length > 0){

										//number of goals Completed
										json.statistics.goal.completedGoals = inactiveGoals.length;

										//used for finding longest goal completed
										var largestDiff = 0;

										//iterate through goals for longest goal
										for(var i = 0; i < inactiveGoals.length; i++){

											var currStartStamp = inactiveGoals[i].timestamp,
												currEndStamp = inactiveGoals[i].goalStopped;

											//find longest completed goal
											var currDiff = currEndStamp - currStartStamp;

											if(largestDiff < currDiff){
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
					if(useCount == 0 && craveCount == 0 && boughtCount == 0 && goalCount == 0){				
						var introMessage = "<b>Welcome to esCrave</b> - the anonymous habit tracking app that shows you statistics about any habit as you record data about it!";
						createNotification(introMessage);
					}else{
                        //populate habit log with all actions

                            /* ADD ACTIONS INTO LOG */
                            var allActions = jsonObject.action.filter(function(e){
										return e.clickType == "used" ||
                                               e.clickType == "craved" ||
                                               e.clickType == "bought" ||
                                              (e.clickType == "goal" && (e.status == 2 || e.status == 3));
									});
                            //console.log("allActions = ");
                           // console.log(allActions);
                            /* only display a certain number of actions per page */
                            var actionsToAddMax = allActions.length - 1,
                                actionsToAddMin = allActions.length - 10;

                            function addMoreIntoHabitLog(){
                                if(actionsToAddMax >= 0){
                                    //console.log(actionsToAddMax + " = actionsToAddMax, above zero");
                                    for(var i = actionsToAddMax; i >= actionsToAddMin && i >= 0; i--){

                                        //console.log("inside for loop");

                                    var currClickStamp = allActions[i].timestamp,
                                        currClickType = allActions[i].clickType,
                                        currClickCost = null,
                                        currGoalEndStamp = -1,
                                        currGoalType = "";

                                        if(currClickType == "used" || currClickType == "craved"){
                                             placeActionIntoLog(currClickStamp, currClickType, currClickCost, true);

                                        }else if(currClickType == "bought"){
                                            currClickCost =  allActions[i].spent;
                                             //append curr action
                                           placeActionIntoLog(currClickStamp, currClickType, currClickCost, true);


                                        }else if(currClickType == "goal"){
											currGoalEndStamp = allActions[i].goalStopped,
											currGoalType = allActions[i].goalType;
													//append 10 new goals
											placeGoalIntoLog(currClickStamp, currGoalEndStamp, currGoalType, true);
                                        }
                                    
                                   
                                        if(i == actionsToAddMin || i == 0){
                                                actionsToAddMin -= 10;
                                                actionsToAddMax -= 10;
                                                
                                            //if button is not displayed
                                                if($("#habit-log-show-more").hasClass("d-none") && allActions.length > 10){
                                                    $("#habit-log-show-more").removeClass("d-none");
                                                    $("#habit-log-show-more").click(function(){
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

        //get configuration from storage
			function setOptionsFromStorage(){
				var jsonObject = retrieveStorageObject();

				//set local json from option in local storage
				json.option.activeTab = jsonObject.option.activeTab;
                     //console.log("json.option.activeTab was set to " + jsonObject.option.activeTab);

                //set remembered variables for settings page 
                //display logic
                json.option.liveStatsToDisplay = jsonObject.option.liveStatsToDisplay;
                json.option.logItemsToDisplay = jsonObject.option.logItemsToDisplay;
                json.option.reportItemsToDisplay = jsonObject.option.reportItemsToDisplay;


        //SETTINGS PAGE INITIAL DISPLAY
            //loop over 
                //LIVE STATS
                for( var key in json.option.liveStatsToDisplay){
                    $("#" + key + "Displayed").prop('checked', json.option.liveStatsToDisplay[key]);
                }

                //HABIT LOG
                 for( var key in json.option.logItemsToDisplay){
                    $("#" + key + "Displayed").prop('checked', json.option.logItemsToDisplay[key]);
                }

                //WEEKLY REPORT
                 for( var key in json.option.reportItemsToDisplay){
                    $("#" + key + "Displayed").prop('checked', json.option.reportItemsToDisplay[key]);
                }

               
			}

		
		//Restrict possible dates chosen in goal tab datepicker

		//restrictGoalRange();
		$( "#goalEndPicker" ).datepicker({minDate: 0});
		//INITIALIZE GOAL DATE TIME PICKER
		$( "#goalEndPicker" ).datepicker();

/* NOTIFICATION CREATION AND RESPONSES */

	var clearNotification = function(event){

		//when user clicks X on a notification, slide it off the screen.
		var currNotification = $(event).parent().parent();
		//var notificationWidth = currNotification.css("width");
		//	notificationWidth = -1 * parseInt(notificationWidth);
		var animateLeft = -1*(6400);
			currNotification.animate(
				{left: animateLeft}, 600, 
				function(){
					currNotification.css("display", "none");
				});	
	}


	function createNotification(message, responseTools){
		var template =  '<div class="notification" style="left:600px;">' + 
							'<div class="notification-message">' +
								'<p class="notification-text">' + message + '</p>' + 
								'<a class="notification-close" href="#">X</a>' +
							'</div>';

						if(responseTools){
							template+= '<div class="notification-response-tools">' + responseTools + '</div>';
						}else{
							template+= '<div class="spacer" style="height:15px;"></div>';
						}

			template +=	'</div><!--end notification div-->';

		$('#notifications-container').append(template);

		highlightNotification();

	}

	function highlightNotification(){
		//find last notification appended to container

			$($(".notification")[$(".notification").length - 1]).animate({
						left: 0
			},300);

			setTimeout(function(){	
				$($(".notification")[$(".notification").length - 1]).addClass("rotate-left");
				
				setTimeout(function(){
					$($(".notification")[$(".notification").length - 1]).removeClass("rotate-left");
					$($(".notification")[$(".notification").length - 1]).addClass("rotate-right");
				
					setTimeout(function(){
						$($(".notification")[$(".notification").length - 1]).removeClass("rotate-right");
			
					}, 300);
				}, 300);
			}, 300);	

	}

	function createGoalEndNotification(goalHandle){

			var goalType = goalHandle.goalType,
			goalTypeGerund= "";
			if(goalType == "use"){
				goalTypeGerund = "doing";
				goalType = "did";
			}else if (goalType == "bought"){
				goalTypeGerund = "buying";
			}else if (goalType == "both"){
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

	$('#notifications-container').on('click', '.notification-close', function(event){
		clearNotification.call(event, this); 
	});

	$('#notifications-container').on('click', '.notification-response-tool', function(event){
		
		//need these variables: startStamp, endStamp, goalType
			//convert localStorage to json
			var currJsonString = localStorage.esCrave;
			var jsonObject = JSON.parse(currJsonString);

			//return active goal
			var activeGoals = jsonObject.action.filter(function(e){ 
				return e.clickType == "goal" && e.status == 1;
			});	

			var mostRecentGoal = activeGoals[activeGoals.length-1];

			//grab relevant data from object
			var startStamp = mostRecentGoal.timestamp,
				endStamp = mostRecentGoal.goalStamp,
				goalType = mostRecentGoal.goalType;

		//your last goal has finished, was it successful?
			//yes
			if($(this).hasClass("goal-ended-on-time")){
							clearNotification.call(event, this); 

							placeGoalIntoLog(startStamp, endStamp, goalType, false);
							
							var message = "Congrats on completing your goal! " + 
									"It's been added to the your goal tab";
							createNotification(message);
							
							changeGoalStatus(3, goalType);

			//no
			}else if($(this).hasClass("goal-ended-early")){
							clearNotification.call(event, this); 
						
							var now = Math.round(new Date()/1000);

							var min = new Date(parseInt(startStamp)).getTime();
							var max = new Date(parseInt(endStamp)).getTime();

							var	minFormatted = Math.floor((now - min) / 86400),
								maxFormatted = Math.floor((now - max) / 86400);
								
								if(minFormatted == 0){
									minFormatted = "-" + (minFormatted);
								}else{
                                   minFormatted = (minFormatted * -1);
                                }

								if(maxFormatted == 0){
									maxFormatted = "-" + (maxFormatted);
								}else{
                                    maxFormatted = (maxFormatted * -1);
                                }
                                console.log("minFormatted = " + minFormatted + "\nmaxFormatted = " + maxFormatted);
								
								
							var message = "You can still get a percentage of points for how long you waited. " + 
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
									'$( "#datepicker-notification" ).datepicker({ minDate:' + minFormatted+ ', maxDate:' + maxFormatted + '});' +
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
			if($(this).hasClass("submit-new-goal-time")){


							var tempEndStamp = convertDateTimeToTimestamp('#datepicker-notification', '#goalEndTimePicker' ); 
                            console.log(tempEndStamp);
								if(tempEndStamp - startStamp  > 0 || endStamp  - tempEndStamp < 0){
									changeGoalStatus(2, goalType, tempEndStamp);
									placeGoalIntoLog(startStamp, tempEndStamp, goalType, false); 
									
									clearNotification.call(event, this); 


								}else{
									alert('Please choose a time within your goal range!');
								}
			}


	});


/* GOAL LOG FUNCTIONS */

	function placeGoalIntoLog(startStamp, endStamp, goalType, placeBelow){
		
		
			//data seems to be in order
			//console.log(endStamp);
			
			var endDateObj = new Date(parseInt(endStamp + "000"));
			
			var timeElapsed = convertSecondsToDateFormat(endStamp - startStamp);
			var	dayOfTheWeek = endDateObj.toString().split(' ')[0];

			var	shortHandDate = (endDateObj.getMonth() + 1) + "/" + 
								endDateObj.getDate() + "/" + 
								(endDateObj.getFullYear());


			var	actionGerund = "do or buy";
			
			if(goalType == "bought"){
				actionGerund = 'buy';
			}else if (goalType == "use"){
				actionGerund = 'do';
			}

			var template =  '<div class="item">' +
								'<hr/><p class="title"><i class="far fa-calendar-plus"></i>&nbsp;' +
									'You waited <b><span class="timeElapsed">' + timeElapsed + '</span></b>&nbsp;' +
									'to <span class="actionGerund">' + actionGerund + '</span> it!' +
								'</p>' +
								'<p class="date" style="text-align:center;color:D8D8D8">' +
									'<span class="dayOfTheWeek">' + dayOfTheWeek + '</span>,&nbsp;' +
									'<span class="shortHandDate">' + shortHandDate + '</span>' +
								'</p>' + 
							'</div><!--end habit-log item div-->';


            //assure user has selected to display this log item type 
            //controller is on settings pane
            if(json.option.logItemsToDisplay.goal == true){
                if(placeBelow){
                    $('#habit-log').append(template);

                }else{
                    $('#habit-log').prepend(template);

                }	

                //and make sure the heading exists too
                $("#habit-log-heading").show();

            }else{
               // console.log("create log entry of type: '" + "goal" + "' did not display.");
            }
	}

	function changeGoalStatus(newGoalStatus, goalType, actualEnd){

		//goal status
			//1 == active goal
			//2 == partially completed goal
			//3 == completed goal

		//console.log("inside changeGoalStatus, newGoalStatus = " + newGoalStatus);
		//convert localStorage to json
			var jsonObject = retrieveStorageObject();

		var goals = jsonObject.action.filter(function(e){
			return e.clickType == 'goal' && e.goalType == goalType
		});
		var mostRecentGoal = goals[goals.length - 1];
			mostRecentGoal.status = newGoalStatus;

		//actual end was passed to function	
		if(actualEnd){
			//console.log("actualEnd returns true, and is = " + actualEnd)
			mostRecentGoal.goalStopped = actualEnd;
		}else{
			//else set the actual end to end of goal endDate
			mostRecentGoal.goalStopped = mostRecentGoal.goalStamp;
		}

		setStorageObject(jsonObject);
	}

	function convertSecondsToDateFormat(rangeInSeconds){
				
			//s
			var currSeconds = rangeInSeconds % 60;
			if(currSeconds<10)
				{ currSeconds = "0" + currSeconds };
			
			var finalStringStatistic = currSeconds + "s";	
				
			//console.log(json.statistics.secondsBetweenUse);
				
				//s	//m
				if (rangeInSeconds > (60)){
					var currMintues = Math.floor(rangeInSeconds /(60))%60;
					if(currMintues<10){ currMintues = "0" + currMintues };
					
					finalStringStatistic =  currMintues + "<span>m&nbsp;</span>" + finalStringStatistic;
					
				}
					
					//s //m //h
				if (rangeInSeconds > (60*60)){
					var currHours = Math.floor(rangeInSeconds /(60*60))%24;
					if(currHours<10){ currHours = "0" + currHours };
					
					finalStringStatistic = currHours + "<span>h&nbsp;</span>" + finalStringStatistic;
					//drop seconds
					finalStringStatistic = finalStringStatistic.split("m")[0] + "m</span>";
					
				}	

					//s //m //h //d
				if (rangeInSeconds > (60*60*24)){
                    var dayCount = Math.floor(rangeInSeconds /(60*60*24));
                    var plural = "";
                    if(dayCount > 1){
                        plural = "s";
                    }
					finalStringStatistic = dayCount + "<span>&nbsp;day" + plural + "&nbsp;</span>" + finalStringStatistic;
					//drop minutes
					finalStringStatistic = finalStringStatistic.split("h")[0] + "h</span>";
				}
				

			//remove very first 0 from string	
			//console.log(finalStringStatistic);
			if(finalStringStatistic.charAt(0) === "0")	
				{ finalStringStatistic = finalStringStatistic.substr(1)}

			return finalStringStatistic;
			
	}

/* COST && USE LOG FUNCTION */
function placeActionIntoLog(clickStamp, clickType, amountSpent, placeBelow){
		
	//data seems to be in order
	//console.log(clickStamp, clickType, amountSpent, target, placeBelow);
	
	var endDateObj = new Date(parseInt(clickStamp + "000"));
	var	dayOfTheWeek = endDateObj.toString().split(' ')[0];
	var	shortHandDate = (endDateObj.getMonth() + 1) + "/" + 
						endDateObj.getDate() + "/" + 
						(endDateObj.getFullYear());
	var shortHandTimeHours = (endDateObj.getHours()),
		shortHandTimeMinutes = (endDateObj.getMinutes()),
		shortHandTimeAMPM = "am";

		if(shortHandTimeHours == 12){
			shortHandTimeAMPM = "pm";

		}else if(shortHandTimeHours > 12){
           
			shortHandTimeHours = shortHandTimeHours % 12;
             shortHandTimeAMPM = "pm";
        }
		if(shortHandTimeMinutes < 10){
			shortHandTimeMinutes = "0" + shortHandTimeMinutes;
		}

	var	shortHandTime = shortHandTimeHours + "<b>:</b>" + shortHandTimeMinutes + shortHandTimeAMPM;


	var	titleHTML = "";
	var target = "#habit-log";
	
	if(clickType == "bought"){
		titleHTML = '<i class="fas fa-dollar-sign"></i>&nbsp;&nbsp;' + "You spent <b>" + parseInt(amountSpent) + "$</b> on it.";
		//target = "#cost-log";

	}else if (clickType == "used"){
		titleHTML = '<i class="fas fa-cookie-bite"></i>&nbsp;' + "You did it at <b>" + shortHandTime + "</b>.";
		//target = "#use-log";

	}else if(clickType == "craved"){
		titleHTML = '<i class="fas fa-ban"></i>&nbsp;' + "You didn\'t do it at <b>" + shortHandTime + "</b>.";
		//target = "#use-log";

	}

	var template =  '<div class="item">' +
						'<hr/><p class="title">' + titleHTML + '</p>' +
						'<p class="date" style="text-align:center;color:D8D8D8">' +
							'<span class="dayOfTheWeek">' + dayOfTheWeek + '</span>,&nbsp;' +
							'<span class="shortHandDate">' + shortHandDate + '</span>' +
						'</p>' + 
					'</div><!--end habit-log item div-->';

					//console.log(template);


    if(json.option.logItemsToDisplay[clickType] == true){
        if(placeBelow){
            $(target).append(template);
        }else{
            $(target).prepend(template);
        }	

        //and make sure the heading exists too
        $(target + "-heading").show();
    }else{
        //console.log("create log entry of type: '" + clickType + "' did not display.");
    }
}


/* CONVERT JSON TO LIVE STATS */
	function convertDateTimeToTimestamp(datePickerTarget, timePickerTarget){
		var tempEndStamp = $(datePickerTarget).datepicker({dateFormat: 'yy-mm-dd'}).val(); 
			tempEndStamp = Math.round(new Date(tempEndStamp).getTime() / 1000);
		
			//console.log("tempEndStamp after pulled from datepicker = " + tempEndStamp);
			//get time selection from form
				var requestedTimeEndHours = parseInt($( timePickerTarget + " select.time-picker-hour").val());
				
				//12 am is actually the first hour in a day... goddamn them.
				if(requestedTimeEndHours == 12){
					requestedTimeEndHours = 0;
				}	
				//account for am vs pm from userfriendly version of time input
				if($(timePickerTarget + " select.time-picker-am-pm").val() == "PM"){
					requestedTimeEndHours = requestedTimeEndHours + 12;

				}

				tempEndStamp += requestedTimeEndHours*(60*60);
				//console.log("tempEndStamp after timepicker hours added = " + tempEndStamp);

				
				return tempEndStamp;

				
	}

	function displayAverageTimeBetween(actionType){
		//convert total seconds to ddhhmmss
			var htmlDestination = "";

				if(actionType == "use"){
					htmlDestination = "#averageTimeBetweenUses";

				}else if(actionType == "cost"){
					htmlDestination = "#averageTimeBetweenBoughts";
					
				}
				
				var finalStringStatistic = convertSecondsToDateFormat(json.statistics[actionType].averageBetweenClicks);
				
					//insert HTML into span place holder
				$(htmlDestination).html(finalStringStatistic);
				
	}

	function calculateAverageTimeBetween(actionType){
		//current timestamp
			var currTimestamp = Math.round(new Date()/1000);

		//set key to the correct calculation ((currTimestamp - firstTimestamp) / (totalClicks))
		var totalTimeBetween = parseInt(currTimestamp) - parseInt(json.statistics[actionType].firstClickStamp),
			totalClicks = parseInt(json.statistics[actionType].clickCounter);
		json.statistics[actionType].averageBetweenClicks = Math.round(totalTimeBetween / totalClicks);
		
		//call function to display new stat
		displayAverageTimeBetween(actionType);

	}

	function displayLongestGoal(){
		var html = convertSecondsToDateFormat(json.statistics.goal.bestTimeSeconds);
		$("#longestGoalCompleted").html(html);
		
	}


//return to last active tab
function returnToActiveTab(){
	if(json.option.activeTab){
		var tabName = json.option.activeTab.split("-")[0];
		$("#" + tabName + "-tab-toggler").click();
		//console.log("json.option.activeTab = " + json.option.activeTab);
		//console.log($("#" + tabName + "-tab-toggler"));
	}else{
		//console.log("option returns false");
		$("#" + "reports" + "-tab-toggler").click();
	}

	/*
	//toggle active class on nav-tabs
		$(".nav-tabs li").removeClass("active");
		$("#" + tabName + "-tab-toggler").parent().addClass("active");
	//toggle active class on actual tab content
		$(".tab-pane").removeClass("active");
		$("#" + tabName + "-content").addClass("active");
	*/	

}
//save current tab on switch
function saveActiveTab(){
	//update instance json
	json.option.activeTab = $(".tab-pane.active").attr('id');
	//console.log("save active tab fired");
	//console.log($(".tab-pane.active").attr('id'));

	//update in option table
        //convert localStorage to json
			var jsonObject = retrieveStorageObject();
				
                jsonObject.option.activeTab =  $(".tab-pane.active").attr('id');

              setStorageObject(jsonObject);
		 

}

//convert last timestamp to a running timer
function restartTimerAtValues(timerArea, sinceLastAction){
	var timeNow = new Date()/1000;
	
	//console.log("timer is trying to restart " + sinceLastAction);
	//update json with previous timer values
	var newTimerTotalSeconds = Math.floor(timeNow - sinceLastAction);
	
	var newTimerSeconds = -1,
		newTimerMinutes = -1,
		newTimerHours   = -1,
		newTimerDays    = -1;
		
		//calc mins and secs
			if(newTimerTotalSeconds > 60){
				newTimerSeconds = newTimerTotalSeconds % 60;
				newTimerMinutes = Math.floor(newTimerTotalSeconds / 60);
				if(newTimerMinutes<10){
					newTimerMinutes = "0" + newTimerMinutes;
				}


			}else{
				newTimerSeconds = newTimerTotalSeconds;
				newTimerMinutes = 0;
			}
		
		//calc hours
			if(newTimerTotalSeconds > (60*60)){
				newTimerMinutes = newTimerMinutes % 60;
				newTimerHours = Math.floor(newTimerTotalSeconds / (60*60));
				if(newTimerMinutes<10){
					newTimerMinutes = "0" + newTimerMinutes;
				}
				if(newTimerHours<10){
					newTimerHours = "0" + newTimerHours;
				}

			}else{
				newTimerHours = 0;
			}
			
		//calc days
			if(newTimerTotalSeconds > (60*60*24)){
				newTimerHours = newTimerHours % 24;
				newTimerDays = Math.floor(newTimerTotalSeconds / (60*60*24));
				if(newTimerHours<10){
					newTimerHours = "0" + newTimerHours;
				}

			}else{
				newTimerDays = 0;
			}
		
		//update appropriate JSON values
				json.statistics[timerArea].sinceTimerStart.totalSeconds = newTimerTotalSeconds;
				json.statistics[timerArea].sinceTimerStart.seconds = newTimerSeconds;
				json.statistics[timerArea].sinceTimerStart.minutes = newTimerMinutes;					
				json.statistics[timerArea].sinceTimerStart.hours = newTimerHours;	
				json.statistics[timerArea].sinceTimerStart.days = newTimerDays;
				
			
}

//listen for baseline responses 
(function updateBaselineResponses(){

    //user declared they have chosen something to track
        //display further baseline questions
        $(".baseline-questionnaire .serious-user").on('change', function(){
            $(".baseline-questionnaire .follow-up-questions").removeClass("d-none");
        });
	
	//user doesn't know what to track, 
        //send them to 'what to track' help docs
        $(".baseline-questionnaire .passerby-user").on('change', function(){
            $(".baseline-questionnaire .follow-up-questions").addClass("d-none");

            var message = "Feel free to poke around, you can reset the entire app (in settings) if you decide to track something specific.";
            var responseTools =  "<a class='btn btn-md btn-outline-info' href='https://escrave.com#habits'>Some Suggestions</a>";
            createNotification(message, responseTools);
        });

        //.follow-up-questions
        $(".baseline-questionnaire .submit").on("click", function(){
            
            //if there's no reports made yet,
                //update json && localstorage obj with responses
                    //baseline spent / week
                    //goal spend / week
                    //baseline done / week
                    //goal done / week


                //if baseline spent == 0 && baseline goal == 0
                    //trigger clicks to spent statistics (likely they are not useful)

        });

})();



//function to read settings changes for which
//stats to display
(function settingsDisplayChanges(){

    //LIVE STATISTICS
    //listen when changed checkbox inside display options area
    $(".live-statistics-display-options .form-check-input").on('change', function(){
        
            //detect specific id
            var itemHandle = this.id;
            var displayCorrespondingStat = false;
        
            if($("#" + itemHandle).is(":checked")){
                displayCorrespondingStat = true;
            }

            //change value in JSON
                var jsonHandle = itemHandle.replace("Displayed", "");
                json.option.liveStatsToDisplay[jsonHandle] = displayCorrespondingStat;
                console.log(jsonHandle + " will be displayed = " + displayCorrespondingStat);

            //update option table value
            var jsonObject = retrieveStorageObject();
                jsonObject.option.liveStatsToDisplay[jsonHandle] = displayCorrespondingStat;
            
            setStorageObject(jsonObject);


    });

    //HABIT LOG 
    //listen when changed checkbox inside display options area
        $(".habit-log-display-options .form-check-input").on('change', function(){
            
                //detect specific id
                var itemHandle = this.id;
                var displayCorrespondingStat = false;
            
                if($("#" + itemHandle).is(":checked")){
                    displayCorrespondingStat = true;
                }

                //change value in JSON
                    var jsonHandle = itemHandle.replace("Displayed", "");
                    json.option.logItemsToDisplay[jsonHandle] = displayCorrespondingStat;
                    console.log(jsonHandle + " will be displayed = " + displayCorrespondingStat);

                //update option table value

        });

    //WEEKLY REPORT
    //listen when changed checkbox inside display options area
        $(".weekly-report-display-options .form-check-input").on('change', function(){
            
                //detect specific id
                var itemHandle = this.id;
                var displayCorrespondingStat = false;
            
                if($("#" + itemHandle).is(":checked")){
                    displayCorrespondingStat = true;
                }

                //change value in JSON
                    var jsonHandle = itemHandle.replace("Displayed", "");
                    json.option.reportItemsToDisplay[jsonHandle] = displayCorrespondingStat;
                    console.log(jsonHandle + " will be displayed = " + displayCorrespondingStat);

                //update option table value

        });
})();

  console.log(json.option);





//TOGGLE ANY STATS WHICH ARE NOT ZERO 
function hideInactiveStatistics(){


    var statisticPresent = false;
	//bought page 
	//if(relevantPane == "cost-content"){	
    
        /*HIDE UNAVAILABLE STATS */
            if (json.statistics.cost.clickCounter === 0){
                $("#bought-total").hide();
                $("#cost-content .timer-recepticle").hide();

            }else{
                statisticPresent = true;
            }

            if(json.statistics.cost.averageBetweenClicks === 0){
                $("#averageTimeBetweenBoughts").parent().hide();
                
            }

            if (json.statistics.cost.total === 0){
                //console.log("total spent is 0: " + json.statistics.totalSpent);
                //toggle all
                $("#cost-content .statistic-recepticle").hide();
                $("#totalAmountSpent").parent().parent().hide();
                $("#spentThisWeek").parent().parent().hide();
                $("#spentThisMonth").parent().parent().hide();
                $("#spentThisYear").parent().parent().hide();

            }else if (json.statistics.cost.thisWeek == json.statistics.cost.total){
                //console.log("toggle all but total - spent this week equals total");
                //toggle year month week 
                $("#spentThisWeek").parent().parent().hide();
                $("#spentThisMonth").parent().parent().hide();
                $("#spentThisYear").parent().parent().hide();
                

            }else if (json.statistics.cost.thisMonth == json.statistics.cost.thisWeek){
                //console.log("toggle all but week - spent this month equals week");
                //toggle year and month
                $("#spentThisMonth").parent().parent().hide();
                $("#spentThisYear").parent().parent().hide();
                

            }else if (json.statistics.cost.thisYear == json.statistics.cost.thisMonth){
                //console.log("toggle year - spent this year equals month");
                $("#spentThisYear").parent().parent().hide();
                
            
            }

        //}else if(relevantPane == "use-content"){

            if (json.statistics.use.clickCounter === 0){
                $("#use-total").hide();
                $("#use-content .timer-recepticle").hide();

            }else{
                statisticPresent = true;
            }

            if(json.statistics.use.averageBetweenClicks === 0){
                $("#averageTimeBetweenUses").parent().hide();

            }

            if (json.statistics.use.craveCounter === 0){
                $("#crave-total").hide();

            }else{
                statisticPresent = true;
            }

            if(json.statistics.use.craveCounter === 0 || json.statistics.use.clickCounter === 0){
                $("#avgDidntPerDid").parent().hide();

            }

            if(json.statistics.use.cravingsInARow === 0 || json.statistics.use.cravingsInARow === 1){
                $("#cravingsResistedInARow").parent().hide();

            }

        //}else if(relevantPane == "goal-content"){

            if(json.statistics.goal.clickCounter === 0){
                $("#goal-content .timer-recepticle").hide();
            }else{
                statisticPresent = true;
            }

            if(json.statistics.goal.bestTimeSeconds === 0){
                $("#longestGoalCompleted").parent().hide();
            }

            if(json.statistics.goal.completedGoals === 0){
                $("#numberOfGoalsCompleted").parent().hide();
                
            }

            //figure a way to mark goals complete
                //track in clickType:goal records in action table
                //goalStatus: 1 (pending), 2 (unverified), 3 (partial - ended), 4 (achieved - ended)
                /*
                if(json.statistics.goalCounter:partial === 0){
                    $("#numberOfGoalsCompleted").parent().hide();
                    //remove from previous conditional
                }
                if(json.statistics.goalCounter:achieved === 0){
                    $("#longestGoalCompleted").parent().hide();
                    //remove from previous conditional
                }
                */

        //}
            if(statisticPresent){
                //hide instructions
            // console.log("a statistic is present, hide instructions");
                $("#statistics-content .initial-instructions").hide();
            }

    /* HIDE UNWANTED STATISTICS */
        //COST
            if(json.option.liveStatsToDisplay.sinceLastSpent == false){
                $("#cost-content .timer-recepticle").hide();
            }

            if(json.option.liveStatsToDisplay.avgBetweenSpent == false){
                $("#averageTimeBetweenBoughts").parent().hide();
            }

            if(json.option.liveStatsToDisplay.totalSpent == false){
                $("#totalAmountSpent").parent().parent().hide();
            }
            
            if(json.option.liveStatsToDisplay.currWeekSpent == false){
                $("#spentThisWeek").parent().parent().hide();
            }

            if(json.option.liveStatsToDisplay.currMonthSpent == false){
                $("#spentThisMonth").parent().parent().hide();
            }

            if(json.option.liveStatsToDisplay.currYearSpent == false){
                $("#spentThisYear").parent().parent().hide();
            }
        
        //USE
            if(json.option.liveStatsToDisplay.sinceLastDone == false){
                $("#use-content .timer-recepticle").hide();
            }

            if(json.option.liveStatsToDisplay.avgBetweenDone == false){
                $("#averageTimeBetweenUses").parent().hide();
            }

            if(json.option.liveStatsToDisplay.didntPerDid == false){
                $("#avgDidntPerDid").parent().hide();
            }

            if(json.option.liveStatsToDisplay.resistedInARow == false){
                $("#cravingsResistedInARow").parent().hide();
            }

        //GOAL    

           if(json.option.liveStatsToDisplay.longestGoal === 0){
                $("#longestGoalCompleted").parent().hide();
            }

}
function showActiveStatistics(){

	//bought page 
	//if(relevantPane == "cost-content"){	
		if (json.statistics.cost.clickCounter !== 0){
			$("#bought-total").show();
            if(json.option.liveStatsToDisplay.sinceLastSpent == true){
			    $("#cost-content .timer-recepticle").show();
            }

		}
		if(json.statistics.cost.averageBetweenClicks !== 0){
            if(json.option.liveStatsToDisplay.avgBetweenSpent == true){
			    $("#averageTimeBetweenBoughts").parent().show();
		    	calculateAverageTimeBetween("cost");
            }

		}
		if (json.statistics.cost.total !== 0){
                $("#cost-content .statistic-recepticle").show();

                if(json.option.liveStatsToDisplay.totalSpent == true){
                    $("#totalAmountSpent").parent().parent().show();
                }    

		}
		if (json.statistics.cost.thisWeek !== json.statistics.cost.total){
			if(json.option.liveStatsToDisplay.currWeekSpent == true){
                $("#spentThisWeek").parent().parent().show();
            }
		}
		if (json.statistics.cost.thisMonth !== json.statistics.cost.thisWeek){
			if(json.option.liveStatsToDisplay.currMonthSpent == true){
                $("#spentThisMonth").parent().parent().show();
            }

		}
		if (json.statistics.cost.thisYear !== json.statistics.cost.thisMonth){
            if(json.option.liveStatsToDisplay.currYearSpent == true){
		    	$("#spentThisYear").parent().parent().show();
            }
		}

	//}else if(relevantPane == "use-content"){

		if (json.statistics.use.clickCounter !== 0){
			$("#use-total").show();
            if(json.option.liveStatsToDisplay.sinceLastDone == true){
			    $("#use-content .timer-recepticle").show();
            }
		}
		
		if(json.statistics.use.averageBetweenClicks !== 0){
            if(json.option.liveStatsToDisplay.avgBetweenDone == true){
			    $("#averageTimeBetweenUses").parent().show();
                //Average time between uses
                calculateAverageTimeBetween("use");	
            }
			
		}

		if (json.statistics.use.craveCounter !== 0){
			$("#crave-total").show();

		}
		if(json.statistics.use.craveCounter !== 0 && json.statistics.use.clickCounter !== 0){
            if(json.option.liveStatsToDisplay.didntPerDid == true){
			    $("#avgDidntPerDid").parent().show();
            }
		}
		if(json.statistics.use.cravingsInARow !== 0){
            if(json.option.liveStatsToDisplay.resistedInARow == true){
		    	$("#cravingsResistedInARow").parent().show();
            }
		}


	//}else if(relevantPane == "goal-content"){
		//console.log("show stats goal tab");
		if(json.statistics.goal.clickCounter !== 0){
             if(json.option.liveStatsToDisplay.untilGoalEnd == true){
			    $("#goal-content .timer-recepticle").show();
             }
		}

		if(json.statistics.goal.bestTimeSeconds !== 0){
             if(json.option.liveStatsToDisplay.longestGoal == true){
			    $("#longestGoalCompleted").parent().show();
             }
			//console.log("showing lng compl");
		}
		if(json.statistics.goal.completedGoals !== 0){
			$("#numberOfGoalsCompleted").parent().show();
		}

		

	//}

    
}	
	

	/*OPTIONS MENU FUNCTIONS*/

		//undo last click
		function undoLastAction(){
			
			//console.log("undo last action - clicked");
			var jsonObject = retrieveStorageObject();
				//console.log(jsonObject);

        
				//remove most recent (last) one
				jsonObject["action"].pop();

                //change goal status, if last action broke a goal
                    //if most recent record is a goal record
                        //find most recent goal actiontype,
                        //if this.status !== 1
                            //set this.status


				//console.log(jsonObject);
	    	setStorageObject(jsonObject);
			


			//reload the page refresh
				window.location.reload();

            

		}

		//reset all stats
		function clearActions(){
			window.localStorage.clear();
			window.location.reload();
		}

		//share stats
		function shareActions(){
			
			//window.location("dataexport.html");
			//window.open("dataexport.html", "_blank");
		}

		/*OPTIONS MENU CLICK EVENTS */
		$("#undoActionButton").click(function(event){
			event.preventDefault();
			undoLastAction();
			//close dropdown
			$(".hamburger .navbar-toggler").click();

		});

		$("#clearTablesButton").click(function(event){
			event.preventDefault();
			clearActions();
			//close dropdown
			$(".hamburger .navbar-toggler").click();

		});

		$("#shareStatsButton").click(function(event){
			event.preventDefault();
			shareActions();
			//close dropdown
			$(".hamburger .navbar-toggler").click();

		});


	/* CREATE NEW RECORD OF ACTION */
	//timestamp, clicktype, spent, goalStamp, goalType
	function updateActionTable(ts, ct, spt, gs, gt){
		var jsonObject = retrieveStorageObject();

			ts = ts.toString();
		
		var newRecord;
		
		if(ct == "used" || ct == "craved"){
			newRecord = { timestamp: ts, clickType: ct };
			
		}else if(ct == "bought"){
			spt = spt.toString();
			newRecord = { timestamp: ts, clickType: ct, spent: spt};

		}else if (ct == "goal"){
			gs = gs.toString();
			var st = 1;
			var goalStopped = -1;
			newRecord = { timestamp: ts, clickType: ct, goalStamp: gs, goalType: gt, status: st, goalStopped: goalStopped};
		}	

			jsonObject["action"].push(newRecord);
			
		    setStorageObject(jsonObject);
		
	}
	

	//readjust timer box to correct size
	function adjustFibonacciTimerToBoxes(timerId){
		
		var relevantPane = "";
		
		if(timerId == "smoke-timer"){
			relevantPane = "use-content";
		
		}else if(timerId == "bought-timer"){
			relevantPane = "cost-content";
			
		}else if(timerId == "goal-timer"){
			relevantPane = "goal-content";
			
		}
		//console.log(relevantPane);
		var relevantPaneIsActive = false;
		if($("#" + relevantPane).css("display") == "block"){
			relevantPaneIsActive = true;
		}

	
		if(userIsActive && relevantPaneIsActive){
			
			//console.log("fibbo timer readjust fired with timerId = " + timerId);
			var visibleBoxes = $("#" + timerId + " .boxes div:visible"),
				timerElement = document.getElementById(timerId);
			//console.log("visibile boxes equals: " + visibleBoxes.length)


			if(visibleBoxes.length == 1){
				//adjust .fibonacci-timer to timer height
					timerElement.style.width = "3.3rem";
					timerElement.style.height = "3.3rem";	
			
						
			}else if(visibleBoxes.length == 2){
				//adjust .fibonacci-timer to timer height
					timerElement.style.width = "6.4rem";
					timerElement.style.height = "3.3rem";
				
						
			}else if(visibleBoxes.length == 3){
				//adjust .fibonacci-timer to timer height
					timerElement.style.width = "9.4rem";
					timerElement.style.height = "6.4rem";
					
					
			}else if(visibleBoxes.length == 4){
				//adjust .fibonacci-timer to timer height
					timerElement.style.width = "9.4rem";
					timerElement.style.height = "15.9rem";
		
			}

			//hack to resolve visible boxes = 0 bug
			if(visibleBoxes.length == 0){
				//adjust .fibonacci-timer to timer height
					timerElement.style.width = "3.3rem";
					timerElement.style.height = "3.3rem";	
		
			}


			//timerElement.style.display = "block";
			timerElement.style.margin = "0 auto";
			
		}else{
			
		}
		
	}
	

	//open more info div
	
		$(".log-more-info-div").toggle();
	
		function openClickDialog(clickDialogTarget){

			$(clickDialogTarget + ".log-more-info-div").slideToggle("fast");

			//grey out backgeround
			var bodyHeight= $(document).height();
			$("#greyed-out-div").height(bodyHeight);
			$("#greyed-out-div").css("z-index", "10");
			$("#greyed-out-div").animate({opacity: 0.4}, 300);
			$("#greyed-out-div").click(function(){
				if ($("#greyed-out-div").height() > 0){
					
					if(confirm("your data will not be saved, close anyways?")){
						closeClickDialog(clickDialogTarget);
					
					}
				}
			});
			
			
			
		}
		function closeClickDialog(clickDialogTarget){
			$("#greyed-out-div").animate({opacity: 0}, 200);
			$("#greyed-out-div").css("z-index", "0");
			$("#greyed-out-div").height(0);
			$("#greyed-out-div").off("click");
			
			$(clickDialogTarget + ".log-more-info-div").slideToggle("fast");
		}
		
	
     //SMOKE BUTTONS - START TIMER
            var smokeTimer;
            var boughtTimer;
			var goalTimer;


	 //hide timers on initiation
	 function hideTimersOnLoad(){
            if(json.statistics.use.sinceTimerStart.totalSeconds == 0){
              $("#use-content .fibonacci-timer:first-child").toggle();

            }else{
                //start timer from json values
				initiateSmokeTimer();
            }

            if(json.statistics.cost.sinceTimerStart.totalSeconds == 0){
              $("#cost-content .fibonacci-timer:first-child").toggle();

            }else{
                //start timer from json values
				initiateBoughtTimer();	
            }

            if(json.statistics.goal.untilTimerEnd.totalSeconds == 0){
              $("#goal-content .fibonacci-timer").toggle();

            }else{
                //start timer from json values
                initiateGoalTimer();	
			}
		}
			

	/*Actions on switch tab */
	$(document).delegate("#reports-tab-toggler", 'click', function(e){
		saveActiveTab();
        $("#settings-tab-toggler").removeClass("active");
        $("#settings-tab-toggler").attr( "aria-expanded", "false");
		//console.log('reports tab clicked - code to generate reports here');

        //insert code here to generate most recent report

	});
	$(document).delegate("#statistics-tab-toggler", 'click', function(e){
		
		hideInactiveStatistics();
		saveActiveTab();

		//push adjusting fibo timer to end of stack, so it reads the number of needed boxes corectly
			setTimeout(function(){
				adjustFibonacciTimerToBoxes("goal-timer");
				adjustFibonacciTimerToBoxes("smoke-timer");
				adjustFibonacciTimerToBoxes("bought-timer");

			},0);
		$("#settings-tab-toggler").removeClass("active");
        $("#settings-tab-toggler").attr( "aria-expanded", "false");

		//console.log('statistics tab clicked');

	});
	$(document).delegate("#settings-tab-toggler", 'click', function(e){
		
		saveActiveTab();
         $("#reports-tab-toggler").removeClass("active");
         $("#statistics-tab-toggler").removeClass("active");

	    //console.log('settings tab clicked');
	});
	
	
	
	//create initial state of app
//If json action table doesn't exist, create it
if(localStorage.esCrave){
	setStateFromRecords();
	setOptionsFromStorage();
//dump stats
//console.log(json);

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

}else{
	//replace this with 
        //empty action table
        //basic stat display settings option table
	var newJsonString = '{ "action":[], "option": { "activeTab" : "reports-content",' +
                                                    '"liveStatsToDisplay" : {"untilGoalEnd": true, "longestGoal": true, "sinceLastDone": true, "avgBetweenDone": true, "didntPerDid": true, "resistedInARow": true, "sinceLastSpent": true,"avgBetweenSpent": true, "totalSpent": true, "currWeekSpent": true, "currMonthSpent": true, "currYearSpent": true},' + 
                                                    '"logItemsToDisplay" : {"goal": true, "used": true, "craved": true,	"bought": true},' + 
                                                    '"reportItemsToDisplay" : {	"useChangeVsBaseline": false, "useChangeVsLastWeek": true, "costChangeVsBaseline": false, "costChangeVsLastWeek": true, "useGoalVsThisWeek": false, "costGoalVsThisWeek": false}' + 
                                                    '} }';
		localStorage.setItem("esCrave", newJsonString);

		hideInactiveStatistics();
		//console.log("hiding inactive use");
}
	
		
	//SMOKE BUTTON		
	//CRAVE BUTTON 					
	//BOUGHT BUTTON		
			
			 $("#bought-button,	#crave-button, #smoke-button, #goal-button").click(function(){
              
                //Detect section
                var timerSection;
				var timestampSeconds = Math.round(new Date()/1000);
				
				
					if(this.id == "crave-button"){
						//timerSection = "#use-content";
						
						//don't allow clicks more recent than 10 seconds
						if(timestampSeconds - json.statistics.use.lastClickStampCrave > 10){

							//update relevant statistics
								json.statistics.use.craveCounter++;
								$("#crave-total").html(json.statistics.use.craveCounter);
								updateActionTable(timestampSeconds, "craved");

								//add record into log
								placeActionIntoLog(timestampSeconds, "craved", null, false);
								
								var currCravingsPerSmokes = Math.round(json.statistics.use.craveCounter / json.statistics.use.clickCounter *10)/10;
								$("#avgDidntPerDid").html(currCravingsPerSmokes);
								
								json.statistics.use.cravingsInARow++;
								$("#cravingsResistedInARow").html(json.statistics.use.cravingsInARow);
								
								//keep lastClickStamp up to date while using app
									json.statistics.use.lastClickStampCrave = timestampSeconds;


								showActiveStatistics();
								hideInactiveStatistics();
						}else{
							alert("You just clicked this button! Wait a bit longer before clicking it again");
						}

						
					}else if(this.id == "smoke-button"){
						//update relevant statistics
							updateActionTable(timestampSeconds, "used");
						
							//add record into log
							placeActionIntoLog(timestampSeconds, "used", null, false);
						
							//fake firstStampUses in json obj
							if(json.statistics.use.clickCounter == 0){
								json.statistics.use.firstClickStamp = json.statistics.use.firstClickStamp + timestampSeconds;
								
							}else if (json.statistics.use.clickCounter == 1){
								json.statistics.use.averageBetweenClicks = timestampSeconds - json.statistics.use.firstClickStamp;
								
							}

							json.statistics.use.clickCounter++;
							$("#use-total").html(json.statistics.use.clickCounter);
						
							var currCravingsPerSmokes = Math.round(json.statistics.use.craveCounter / json.statistics.use.clickCounter *10)/10;
							$("#avgDidntPerDid").html(currCravingsPerSmokes);
					
							json.statistics.use.cravingsInARow = 0;
							$("#cravingsResistedInARow").html(json.statistics.use.cravingsInARow);
						
							

							//start timer
							initiateSmokeTimer();	

							adjustFibonacciTimerToBoxes("smoke-timer");
							showActiveStatistics();
							hideInactiveStatistics();

							//there is an active bought related goal
							if(json.statistics.goal.activeGoalUse !== 0 || json.statistics.goal.activeGoalBoth !==0){
								if(json.statistics.goal.activeGoalUse !== 0){
									var goalType = "use";
									var message = 'Your goal just ended early! ' +
												'But don\'t worry, Escrave will keep track of how long you waited anyways!';
									
									json.statistics.goal.activeGoalUse = 0;
								
								}else if(json.statistics.goal.activeGoalBoth !==0){
									var goalType = "both";
									var message = 'Your goal just ended early! ' +
												'But don\'t worry, you still get a percentage of points!';

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
								if((actualEnd - startStamp) > json.statistics.goal.bestTimeSeconds){
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
							json.statistics.use.lastClickStamp = timestampSeconds;

							
							
					}else if(this.id == "bought-button"){
						openClickDialog(".cost");    
						
					}else if(this.id == "goal-button"){
						
						openClickDialog(".goal");   

							
						//set time default to curr time
							//get hour and minutes value from date object
							var date = new Date();

							var	currHours = date.getHours(),
								currMintues = date.getMinutes();

							if(currHours >= 12){
								$(".goal.log-more-info-div .time-picker-am-pm").val("PM");
								currHours=currHours % 12;
							}
							$(".goal.log-more-info-div .time-picker-hour").val(currHours);

							//set minutes to 0, 15, 30, or 45
							var currMintuesRounded = 0;
							if(currMintues > 8){
								currMintuesRounded = 15;
							}
							if(currMintues > 23){
								currMintuesRounded = 30;
							}
							if(currMintues > 38){
								currMintuesRounded = 45;
							}
							$(".goal.log-more-info-div .time-picker-minute").val(currMintuesRounded);
						
					}
            }); //end bought-button click handler
            
			
			
		
			
	function initiateSmokeTimer(){
		//USE TIMER
			clearInterval(smokeTimer);

			if($("#smoke-timer").hasClass("counting")){

				//reset local vars
				var daysSinceUse = 0,
					hoursSinceUse = 0,
					minutesSinceUse = 0,
					secondsSinceUse = 0,
					totalSecondsSinceUse = 0;
				//reset json vars
				json.statistics.use.sinceTimerStart.days = 0,
				json.statistics.use.sinceTimerStart.hours = 0,
				json.statistics.use.sinceTimerStart.minutes = 0,
				json.statistics.use.sinceTimerStart.seconds = 0,
				json.statistics.use.sinceTimerStart.totalSeconds = 0;	

					//Insert timer values into timer
						$("#use-content .secondsSinceLastClickSpan:first-child").html("0" + secondsSinceUse);
						$("#use-content .minutesSinceLastClickSpan:first-child").html(minutesSinceUse);
						$("#use-content .hoursSinceLastClickSpan:first-child").html(hoursSinceUse);
						$("#use-content .daysSinceLastClickSpan:first-child").html(daysSinceUse);

					if(!$("#use-content .fibonacci-timer").is(':visible')){  
						 $("#use-content .fibonacci-timer:first-child").toggle();
					}
					while ($("#use-content .boxes div:visible").length > 1 ) {
						$($("#use-content .boxes div:visible")[0]).toggle();
						
					}
					
				
			
			}else{

				//reset timer from values
				var daysSinceUse = json.statistics.use.sinceTimerStart.days,
					hoursSinceUse = json.statistics.use.sinceTimerStart.hours,
					minutesSinceUse = json.statistics.use.sinceTimerStart.minutes,
					secondsSinceUse = json.statistics.use.sinceTimerStart.seconds,
					totalSecondsSinceUse = json.statistics.use.sinceTimerStart.totalSeconds;

					//Insert timer values into timer
						 if(secondsSinceUse>=10){
				                $("#use-content .secondsSinceLastClickSpan:first-child").html(secondsSinceUse);
				            }else{
				                $("#use-content .secondsSinceLastClickSpan:first-child").html("0" + secondsSinceUse);
				            }
						$("#use-content .minutesSinceLastClickSpan:first-child").html(minutesSinceUse);
						$("#use-content .hoursSinceLastClickSpan:first-child").html(hoursSinceUse);
						$("#use-content .daysSinceLastClickSpan:first-child").html(daysSinceUse);


					//Hide timer boxes which have zero values
						if($("#use-content .secondsSinceLastClickSpan:first-child").html() === "0"){
							$("#use-content .secondsSinceLastClickSpan").parent().toggle();
						}

						if($("#use-content .minutesSinceLastClickSpan:first-child").html() === "0"){
							$("#use-content .minutesSinceLastClickSpan").parent().toggle();

						}

						if($("#use-content .hoursSinceLastClickSpan:first-child").html() === "0"){
							$("#use-content .hoursSinceLastClickSpan").parent().toggle();
						}

						//this temporarily toggles seconds box
						if($("#use-content .daysSinceLastClickSpan:first-child").html() === "0"){
							$("#use-content .daysSinceLastClickSpan").parent().toggle();
						}
						
				

			}

		

		 smokeTimer = setInterval(function() {

		 	//reset local scope vars
            totalSecondsSinceUse++;
            secondsSinceUse++;
            //update json
            json.statistics.use.sinceTimerStart.totalSeconds++;
            json.statistics.use.sinceTimerStart.seconds++;
        	/*	
			if($("#smoke-timer").width() > 200){
				console.log("big box, eh?");
				adjustFibonacciTimerToBoxes("smoke-timer");
				
			}
			*/
			
			
            if(secondsSinceUse>=10){
                $("#use-content .secondsSinceLastClickSpan:first-child").html(secondsSinceUse);
            }else{
                $("#use-content .secondsSinceLastClickSpan:first-child").html("0" + secondsSinceUse);
            }
            

            if(secondsSinceUse>=60){
            	//reset local scope vars
                secondsSinceUse=0;
                minutesSinceUse++;
                //update json
                json.statistics.use.sinceTimerStart.seconds = 0;
                json.statistics.use.sinceTimerStart.minutes++;

                if ($("#use-content .boxes div:visible").length == 1 ) {
                    var numberOfBoxesHidden = $("#use-content .boxes div:hidden").length;
                    $($("#use-content .boxes div:hidden")[numberOfBoxesHidden - 1]).toggle();
						
                }
				
					 if(minutesSinceUse>=10){
						$("#use-content .minutesSinceLastClickSpan:first-child").html(minutesSinceUse);
					}else{
						$("#use-content .minutesSinceLastClickSpan:first-child").html("0" + minutesSinceUse);
					}
                $("#use-content .secondsSinceLastClickSpan:first-child").html("0" + secondsSinceUse);
				
				adjustFibonacciTimerToBoxes("smoke-timer");
				
				
            }
            if(minutesSinceUse>=60){
               
                //reset local scope vars
                minutesSinceUse=0;
                hoursSinceUse++;
                //update json
                json.statistics.use.sinceTimerStart.minutes = 0;
                json.statistics.use.sinceTimerStart.hours++;


                if ($("#use-content .boxes div:visible").length == 2 ) {
                    var numberOfBoxesHidden = $("#use-content .boxes div:hidden").length;
                    $($("#use-content .boxes div:hidden")[numberOfBoxesHidden - 1]).toggle();
					
                }
				
					if(hoursSinceUse>=10){
						$("#use-content .hoursSinceLastClickSpan:first-child").html(hoursSinceUse);
					}else{
						$("#use-content .hoursSinceLastClickSpan:first-child").html("0" + hoursSinceUse);
					}
				
                $("#use-content .minutesSinceLastClickSpan:first-child").html("0" + minutesSinceUse);
				
				
				adjustFibonacciTimerToBoxes("smoke-timer");
				
            }
            if(hoursSinceUse>=24){
                
            	//reset local vars
                hoursSinceUse=0;
                daysSinceUse++;
                //update json
                json.statistics.use.sinceTimerStart.hours = 0;
                json.statistics.use.sinceTimerStart.days++;


                if ($("#use-content .boxes div:visible").length == 3 ) {
                    var numberOfBoxesHidden = $('#use-content .boxes div:hidden').length;
                    $($("#use-content .boxes div:hidden")[numberOfBoxesHidden - 1]).toggle();
					
					//console.log("3 visible boxes");
					//adjustFibonacciTimerToBoxes();
						
                }
				
                $("#use-content .hoursSinceLastClickSpan:first-child").html("0" + hoursSinceUse);
                $("#use-content .daysSinceLastClickSpan:first-child").html(daysSinceUse);
				
				
				
            }
                
           
        
        }, 1000); //end setInterval
            
		 $("#smoke-timer").addClass("counting");
		
	}

	//START BOUGHT TIMER
	function initiateBoughtTimer(){

	
		clearInterval(boughtTimer);

		
		if($("#bought-timer").hasClass("counting")){

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
						$("#cost-content .secondsSinceLastClickSpan:first-child").html("0" + secondsSinceBought);
						$("#cost-content .minutesSinceLastClickSpan:first-child").html(minutesSinceBought);
						$("#cost-content .hoursSinceLastClickSpan:first-child").html(hoursSinceBought);
						$("#cost-content .daysSinceLastClickSpan:first-child").html(daysSinceBought);

					if(!$("#cost-content .fibonacci-timer").is(':visible')){  
						 $("#cost-content .fibonacci-timer:first-child").toggle();
					}
					while ($("#cost-content .boxes div:visible").length > 1 ) {
						$($("#cost-content .boxes div:visible")[0]).toggle();
						
					}
					
				
			
			}else{

				//reset timer from values
				var daysSinceBought = json.statistics.cost.sinceTimerStart.days,
					hoursSinceBought = json.statistics.cost.sinceTimerStart.hours,
					minutesSinceBought = json.statistics.cost.sinceTimerStart.minutes,
					secondsSinceBought = json.statistics.cost.sinceTimerStart.seconds,
					totalSecondsSinceBought = json.statistics.cost.sinceTimerStart.totalSeconds;

					//Insert timer values into timer
						 if(secondsSinceBought>=10){
				               $("#cost-content .secondsSinceLastClickSpan:first-child").html(secondsSinceBought);
				            }else{
				                $("#cost-content .secondsSinceLastClickSpan:first-child").html("0" + secondsSinceBought);
				            }
						$("#cost-content .minutesSinceLastClickSpan:first-child").html(minutesSinceBought);
						$("#cost-content .hoursSinceLastClickSpan:first-child").html(hoursSinceBought);
						$("#cost-content .daysSinceLastClickSpan:first-child").html(daysSinceBought);

				//Hide timer boxes which have zero values
						if($("#cost-content .secondsSinceLastClickSpan:first-child").html() == "0"){
							$("#cost-content .secondsSinceLastClickSpan").parent().toggle();
						}

						if($("#cost-content .minutesSinceLastClickSpan:first-child").html() == "0"){
							$("#cost-content .minutesSinceLastClickSpan").parent().toggle();

						}

						if($("#cost-content .hoursSinceLastClickSpan:first-child").html() == "0"){
							$("#cost-content .hoursSinceLastClickSpan").parent().toggle();
						}

						//this temporarily toggles seconds box
						if($("#cost-content .daysSinceLastClickSpan:first-child").html() == "0"){
							$("#cost-content .daysSinceLastClickSpan").parent().toggle();
						}
			
				adjustFibonacciTimerToBoxes("bought-timer");	
			}
		
		
		
		 boughtTimer = setInterval(function() {

		 		
                totalSecondsSinceBought++;
                secondsSinceBought++;
                
                if(secondsSinceBought>=10){
                    $("#cost-content .secondsSinceLastClickSpan:first-child").html(secondsSinceBought);
                }else{
                    $("#cost-content .secondsSinceLastClickSpan:first-child").html("0" + secondsSinceBought);
                }
                

                if(secondsSinceBought>=60){
                    secondsSinceBought=0;
                    minutesSinceBought++;
                    if ($("#cost-content .boxes div:visible").length == 1 ) {
                        var numberOfBoxesHidden = $("#cost-content .boxes div:hidden").length;
                        $($("#cost-content .boxes div:hidden")[numberOfBoxesHidden - 1]).toggle();
                    }
					//add trailing zero to below 10 values
						if(minutesSinceBought>=10){
							 $("#cost-content .minutesSinceLastClickSpan:first-child").html(minutesSinceBought);
						}else{
							$("#cost-content .minutesSinceLastClickSpan:first-child").html("0" + minutesSinceBought);
						}
                    $("#cost-content .secondsSinceLastClickSpan:first-child").html("0" + secondsSinceBought);
					
					adjustFibonacciTimerToBoxes("bought-timer");
                }
                if(minutesSinceBought>=60){
                    minutesSinceBought=0;
                    hoursSinceBought++;
                    if ($("#cost-content .boxes div:visible").length == 2 ) {
                        var numberOfBoxesHidden = $("#cost-content .boxes div:hidden").length;
                        $($("#cost-content .boxes div:hidden")[numberOfBoxesHidden - 1]).toggle();
                    }
						//add trailing zero to below 10 values
						 if(hoursSinceBought>=10){
							$("#cost-content .hoursSinceLastClickSpan:first-child").html(hoursSinceBought);
						}else{
							$("#cost-content .hoursSinceLastClickSpan:first-child").html("0" + hoursSinceBought);
						}	
                    $("#cost-content .minutesSinceLastClickSpan:first-child").html("0" + minutesSinceBought);
					
					adjustFibonacciTimerToBoxes("bought-timer");
                }
                if(hoursSinceBought>=24){
                    hoursSinceBought=0;
                    daysSinceBought++;
                    if ($("#cost-content .boxes div:visible").length == 3 ) {
                        var numberOfBoxesHidden = $('#cost-content .boxes div:hidden').length;
                        $($("#cost-content .boxes div:hidden")[numberOfBoxesHidden - 1]).toggle();
                    }
                    $("#cost-content .hoursSinceLastClickSpan:first-child").html("0" + hoursSinceBought);
                    $("#cost-content .daysSinceLastClickSpan:first-child").html(daysSinceBought);
					
					adjustFibonacciTimerToBoxes("bought-timer");
                } 
                    
               
            
            }, 1000); //end setInterval
     		$("#bought-timer").addClass("counting");
	}
			
	//GOAL TIMER	
	function initiateGoalTimer(){
		var timerSection = "#goal-content";

			json.statistics.goal.clickCounter++;


			clearInterval(goalTimer);
			
            var jsonDaysString = json.statistics.goal.untilTimerEnd.days,
                jsonHoursString = json.statistics.goal.untilTimerEnd.hours,
                jsonMinutesString = json.statistics.goal.untilTimerEnd.minutes,
                jsonSecondsString = json.statistics.goal.untilTimerEnd.seconds,
                jsonTotalSecondsString = json.statistics.goal.untilTimerEnd.totalSeconds;
                
                    $(timerSection + " .secondsSinceLastClickSpan:first-child").html(jsonSecondsString);
                    $(timerSection + " .minutesSinceLastClickSpan:first-child").html(jsonMinutesString);
                    $(timerSection + " .hoursSinceLastClickSpan:first-child").html(jsonHoursString);
                    $(timerSection + " .daysSinceLastClickSpan:first-child").html(jsonDaysString);

				//return to default all visible value
				$("#goal-content .boxes div").show();

				//make boxes with value of zero hidden	until find a non zero value
				function hideZeroValueTimerBoxes(timerSection){
					//make boxes with value of zero hidden	until find a non zero value
					for(i = 0; i< $("#"+ timerSection + " .boxes div").length; i ++){
						var currTimerSpanValue = $("#"+ timerSection + " .boxes div .timerSpan")[i];
						if(currTimerSpanValue.innerHTML == "0"){
							$(currTimerSpanValue).parent().hide();
							//console.log("dive to hide: " + $(currTimerSpanValue).parent());
						}else{
							//console.log("got to " + i + ". now bouta break;");
							break;
						}
					}
			
				}
				hideZeroValueTimerBoxes("goal-content");
				

                goalTimer =  setInterval(function() {

                    jsonTotalSecondsString--;
                    jsonSecondsString--;
                    
                    if(jsonSecondsString>=10){
                        $(timerSection + " .secondsSinceLastClickSpan:first-child").html(jsonSecondsString);
                    }else{
                        $(timerSection + " .secondsSinceLastClickSpan:first-child").html("0" + jsonSecondsString);
                    }
					
                    if(jsonSecondsString < 0){

						


						if(jsonMinutesString > 0 || jsonHoursString > 0 || jsonDaysString > 0 ){
							jsonSecondsString=59;
							jsonMinutesString--;
								if(jsonMinutesString == 0 && jsonHoursString ==0  && jsonDaysString == 0 ){
									if ($(timerSection + ' .boxes div:visible').length > 1 ) {
										$($(timerSection + ' .boxes div:visible')[0]).toggle();

										adjustFibonacciTimerToBoxes("goal-timer");
									  }
								}

						}else{
							/* ENTIRE GOAL IS DONE */
							jsonSecondsString=0;
							clearInterval(goalTimer);
							hideInactiveStatistics();
							

							//find most recent goal type
								var goalType = "";
								if(json.statistics.goal.activeGoalBoth == 1){
									goalType = "both";
									json.statistics.goal.activeGoalBoth = 0;

								}else if(json.statistics.goal.activeGoalBought == 1){
									goalType = "bought";
									json.statistics.goal.activeGoalBought = 0;

								}else if(json.statistics.goal.activeGoalUse == 1){
									goalType = "use";
									json.statistics.goal.activeGoalUse = 0;
								}
								
								var actualEnd = Math.round(new Date()/1000);

							changeGoalStatus(3, goalType, actualEnd);

							//(startStamp, endStamp, goalType) =>
							var startStamp = json.statistics.goal.lastClickStamp;
							placeGoalIntoLog(startStamp, actualEnd, goalType, false);

							//if longest goal just happened
							if((actualEnd - startStamp) > json.statistics.goal.bestTimeSeconds){
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
							var message = "your goal just ended, congrats! Check your goal log for details.";
							createNotification(message);

							//disappear zero seconds left timer
							$(timerSection + " .fibonacci-timer").parent().hide();
							
						}

						
                        $(timerSection + " .minutesSinceLastClickSpan:first-child").html(jsonMinutesString);
                        $(timerSection + " .secondsSinceLastClickSpan:first-child").html(jsonSecondsString);
                    }
                    if(jsonMinutesString<0){
                      
						if(jsonHoursString > 0 || jsonDaysString > 0 ){
							jsonMinutesString=59;
							jsonHoursString--;
								if(jsonHoursString ==0  && jsonDaysString == 0 ){
									 if ($(timerSection + ' .boxes div:visible').length > 1 ) {
										$($(timerSection + ' .boxes div:visible')[0]).toggle();
										
										adjustFibonacciTimerToBoxes("goal-timer");
									  }
								}

						}
						
						/*
                        if ($(timerSection + " .boxes div:visible").length == 2 ) {
                            var numberOfBoxesHidden = $(timerSection + " .boxes div:hidden").length;
                            $($(timerSection + " .boxes div:hidden")[numberOfBoxesHidden - 1]).toggle();
                        }
						*/
                        $(timerSection + " .minutesSinceLastClickSpan:first-child").html(jsonMinutesString);
                        $(timerSection + " .hoursSinceLastClickSpan:first-child").html(jsonHoursString);
                    }
                    if(jsonHoursString < 0){
                        if(jsonDaysString > 0){
							jsonHoursString=23;
							jsonDaysString--;
								if(jsonDaysString == 0){
								//console.log("days turns to zero");
									setTimeout(function(){
										$($("#goal-content .boxes div")[0]).hide();
										adjustFibonacciTimerToBoxes("goal-timer");

									},0);
								
								}
						}else{
							
							
						}
						
						
                        if ($(timerSection + " .boxes div:visible").length == 3 ) {
                            var numberOfBoxesHidden = $(timerSection + ' .boxes div:hidden').length;
                            $($(timerSection + " .boxes div:hidden")[numberOfBoxesHidden - 1]).toggle();
                        }
                        $(timerSection + " .hoursSinceLastClickSpan:first-child").html(jsonHoursString);
                        $(timerSection + " .daysSinceLastClickSpan:first-child").html(jsonDaysString);
                    } 
                        
                
                }, 1000); //end setInterval
                
               
                $("#goal-button").addClass("counting");		
	}
	

			
			
			
		//COST DIALOG CLICK
		
		$(".cost.log-more-info-div button").click(function(){
			var amountSpent = $("#spentInput").val();
			
				if(!$.isNumeric(amountSpent)){
					alert("Please enter in a number!");
					
				}else{
					var timestampSeconds = Math.round(new Date()/1000);
					updateActionTable(timestampSeconds, "bought", amountSpent);

					//add record into log
					placeActionIntoLog(timestampSeconds, "bought", amountSpent, false);
					
					//fake firstStampBought in json obj
					if(json.statistics.cost.clickCounter == 0){
						json.statistics.cost.firstClickStamp = json.statistics.cost.firstClickStamp + timestampSeconds;
						
					}else if (json.statistics.cost.clickCounter == 1){
						json.statistics.cost.averageBetweenClicks = timestampSeconds - json.statistics.cost.firstClickStamp;
						
					}

					//update display
					json.statistics.cost.clickCounter++;
					$("#bought-total").html(json.statistics.cost.clickCounter);

					//update spent in json
					json.statistics.cost.total = parseInt(json.statistics.cost.total) + parseInt(amountSpent);
					json.statistics.cost.thisWeek = parseInt(json.statistics.cost.thisWeek) + parseInt(amountSpent);
					json.statistics.cost.thisMonth = parseInt(json.statistics.cost.thisMonth) + parseInt(amountSpent);
					json.statistics.cost.thisYear = parseInt(json.statistics.cost.thisYear) + parseInt(amountSpent);

					//update display
					$("#totalAmountSpent").html(json.statistics.cost.total + "$");
					$("#spentThisWeek").html(json.statistics.cost.thisWeek + "$");
					$("#spentThisMonth").html(json.statistics.cost.thisMonth + "$");
					$("#spentThisYear").html(json.statistics.cost.thisYear + "$");

					closeClickDialog(".cost");
					
					initiateBoughtTimer();	
					
					adjustFibonacciTimerToBoxes("bought-timer");
					showActiveStatistics();
					hideInactiveStatistics();

					//there is an active bought related goal
					if(json.statistics.goal.activeGoalBought !== 0 || json.statistics.goal.activeGoalBoth !==0){
						if(json.statistics.goal.activeGoalBought !== 0){
							var goalType = "bought";
							var message = 'Your goal just ended early! ' +
										'But don\'t worry, you still get a percentage of points!';
							
							json.statistics.goal.activeGoalBought = 0;
						
						}else if(json.statistics.goal.activeGoalBoth !==0){
							var goalType = "both";
							var message = 'Your goal just ended early! ' +
										'But don\'t worry, you still get a percentage of points!';
							
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
						if((actualEnd - startStamp) > json.statistics.goal.bestTimeSeconds){
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
			
		//calculate goal timer values
		function loadGoalTimerValues(totalSecondsUntilGoalEnd){

			json.statistics.goal.untilTimerEnd.days = 0;
			json.statistics.goal.untilTimerEnd.hours = 0;
			json.statistics.goal.untilTimerEnd.minutes = 0;
			json.statistics.goal.untilTimerEnd.seconds = 0;
			json.statistics.goal.untilTimerEnd.totalSeconds = totalSecondsUntilGoalEnd;
			
			
			//calc mins and secs
				if(totalSecondsUntilGoalEnd > 60){
					json.statistics.goal.untilTimerEnd.seconds = totalSecondsUntilGoalEnd % 60;
					json.statistics.goal.untilTimerEnd.minutes = Math.floor(totalSecondsUntilGoalEnd / 60);
				}else{
					json.statistics.goal.untilTimerEnd.seconds = totalSecondsUntilGoalEnd;
					json.statistics.goal.untilTimerEnd.minutes = 0;
				}
			
			//calc hours
				if(totalSecondsUntilGoalEnd > (60*60)){
					json.statistics.goal.untilTimerEnd.minutes = json.statistics.goal.untilTimerEnd.minutes % 60;
					json.statistics.goal.untilTimerEnd.hours = Math.floor(totalSecondsUntilGoalEnd / (60*60));
					
				}else{
					json.statistics.goal.untilTimerEnd.hours = 0;
				}
				
			//calc days
				if(totalSecondsUntilGoalEnd > (60*60*24)){
					json.statistics.goal.untilTimerEnd.hours = json.statistics.goal.untilTimerEnd.hours % 24;
					json.statistics.goal.untilTimerEnd.days = Math.floor(totalSecondsUntilGoalEnd / (60*60*24));
				}else{
					json.statistics.goal.untilTimerEnd.days = 0;
				}
			
			/*
			console.log(
						  "days till complete: " + json.statistics.goal.untilTimerEnd.days
						+ "\nhours until: "      + json.statistics.goal.untilTimerEnd.hours 
						+ "\nminutes until: "    + json.statistics.goal.untilTimerEnd.minutes
						+ "\nseconds until: "    + json.statistics.goal.untilTimerEnd.seconds 
						+ "\ntotal seconds are: "+ json.statistics.goal.untilTimerEnd.totalSeconds
						);
			*/

		}	



		//GOAL DIALOG CLICK
		
		$(".goal.log-more-info-div button").click(function(){
		
			var date = new Date();

			var timestampSeconds = Math.round(date/1000);
			
			//get time selection from form
				var requestedTimeEndHours = parseInt($(".goal.log-more-info-div select.time-picker-hour").val());
				var requestedTimeEndMinutes = parseInt($(".goal.log-more-info-div select.time-picker-minute").val());
			

			//12 am is actually the first hour in a day... goddamn them.
			if(requestedTimeEndHours == 12){
				requestedTimeEndHours = 0;
			}	
			//account for am vs pm from userfriendly version of time input
			if($(".goal.log-more-info-div select.time-picker-am-pm").val() == "PM"){
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

			if(goalStampSeconds >= timestampSeconds || secondsUntilRequestedGoal > secondsUntilNow){
				//alert("it's not today || or you picked a time later than now");
				
				goalStampSeconds += secondsUntilRequestedGoal;

				var goalType = "";
				/* figure goal type */
				if($("#boughtInput").is(":checked") && $("#usedInput").is(":checked")){
					//both are checked
					goalType = "both";
					
				}else{
					if($("#boughtInput").is(":checked")){
						goalType = "bought";
						
					}else if($("#usedInput").is(":checked")){
						goalType = "use";
						
					}else{
						//manage those people who just haveta SPECIFICALLY mark neither....


					}
				}

			//there is an active goal
			if(json.statistics.goal.activeGoalUse !== 0 || json.statistics.goal.activeGoalBought !== 0 || json.statistics.goal.activeGoalBoth !==0){
				if(json.statistics.goal.activeGoalUse !== 0){
					var goalType = "use";
					var message = 'Your goal just ended early! ' +
								'But don\'t worry, you still get a percentage of points!';
								
								json.statistics.goal.activeGoalUse = 0;
				
				}else if(json.statistics.goal.activeGoalBought !== 0){
					var goalType = "bought";
					var message = 'Your goal just ended early! ' +
								'But don\'t worry, you still get a percentage of points!';

								json.statistics.goal.activeGoalBought = 0;
				
				}else if(json.statistics.goal.activeGoalBoth !==0){
					var goalType = "both";
					var message = 'Your goal just ended early! ' +
								'But don\'t worry, you still get a percentage of points!';

								json.statistics.goal.activeGoalBoth = 0;
				
				}

				changeGoalStatus(2, goalType, timestampSeconds);
				createNotification(message);

				//place a goal into the goal log
				var startStamp = json.statistics.goal.lastClickStamp;
				var actualEnd = timestampSeconds;
				placeGoalIntoLog(startStamp, actualEnd, goalType, false);

				//if longest goal just happened
				if((actualEnd - startStamp) > json.statistics.goal.bestTimeSeconds){
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
			json.statistics.goal.lastClickStamp = timestampSeconds;



				//set local json goal type which is active
				var jsonHandle = "activeGoal" + goalType.charAt(0).toUpperCase() + goalType.slice(1);
				json.statistics.goal[jsonHandle] = 1;
				

				updateActionTable(timestampSeconds, "goal", "", goalStampSeconds, goalType);
				
				closeClickDialog(".goal");
				
				
				//convert goalend to days hours minutes seconds
				var totalSecondsUntilGoalEnd = Math.round(goalStampSeconds - timestampSeconds);
				
				loadGoalTimerValues(totalSecondsUntilGoalEnd);
								
				initiateGoalTimer();	

				showActiveStatistics();

				adjustFibonacciTimerToBoxes("goal-timer");

			}else{
				/* user selected a time on today (equal to or) prior to current time */
				alert("Please choose a time later than right now!");
			}
			
		});
		

        } else {
            //NO LOCAL STORAGE
		   alert("This app uses your local storage to store your data." + 
				   " That means we can honestly say we got nothing, if anyone ever demands to see your data." +
				   " BUT, your browser doesn't support local storage, so your data cannot be saved!" +
				   " You should update your browser or try Chrome, or Firefox!");
        }  


    });
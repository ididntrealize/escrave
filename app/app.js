var welcomeToMyJavascriptDoc;
/****************************************************************************
 * This document is kinda long, like over 2000 lines,
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
 * Dig in, and please get back to me about any inconsistencies, or improvements. 

*********************************************************************************/


$( document ).ready(function() {

//MANAGE INACTIVITY!!!	

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
	
        if (typeof(Storage) !== "undefined") {


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

					"options":
					{
						"activeTab": "use-content"
					}

				};
				
					 
			function retrieveActionTable(){
				
				//convert localStorage to json
				var currJsonString =  localStorage.esCrave;
				var jsonObject = JSON.parse(currJsonString);
				
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
									//console.log("inside retrieveActionTable, activeGoals = " + activeGoals);
									
									var inactiveGoals = goalCount.filter(function(e){ return e.status == 2 || e.status == 3 });
									//console.log("inside retrieveActionTable, inactiveGoals = " + inactiveGoals);	
									
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

										/* only display a certain number of goals per page */
										var goalsToAddMax = inactiveGoals.length - 1,
											goalsToAddMin = inactiveGoals.length - 10;

										function addMoreIntoGoalLog(){
											if(goalsToAddMin > 0){
												for(var i = goalsToAddMax; i >= goalsToAddMin; i--){
													console.log("i in add to log = " + i);
												var currStartStamp = inactiveGoals[i].timestamp,
													currEndStamp = inactiveGoals[i].goalStopped,
													currGoalType = inactiveGoals[i].goalType;
													//append 10 new goals
													placeGoalIntoLog(currStartStamp, currEndStamp, currGoalType, true);

													if(i == goalsToAddMin){
														goalsToAddMin -= 10;
														goalsToAddMax -= 10;
														//if button is not displayed
															if($("#goal-log-show-more").hasClass("d-none")){
																$("#goal-log-show-more").removeClass("d-none");
																$("#goal-log-show-more").click(addMoreIntoGoalLog);
															}
														break;
													}
												}
											}else{
												//console.log("no more entries");
											}
										}
										addMoreIntoGoalLog();
										
									}

								}
					//NEEEWWWWW USERRR
					if(useCount == 0 && craveCount == 0 && boughtCount == 0 && goalCount == 0){				
						var introMessage = "<b>Welcome to esCrave</b> - the anonymous habit tracking app that shows you statistics about any habit as you record data about it!";
						createNotification(introMessage);
					}	
							
			}


			function retrieveOptionTable(){
				var currJsonString =  localStorage.esCrave;
				var jsonObject = JSON.parse(currJsonString);

				//set local json from option in local storage
				json.options.activeTab = localStorage.getItem("activeTab");
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
								
								console.log("min = " + min + "\nMax = " + max);
								if(minFormatted == 0){
									minFormatted = "-" + (minFormatted);
								}
								if(maxFormatted == 0){
									maxFormatted = "-" + (maxFormatted);
								}
								
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
									'$( "#datepicker-notification" ).datepicker({ minDate:' + minFormatted + ', maxDate:' + maxFormatted + '});' +
									'$( "#datepicker-notification" ).datepicker();' +
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
								'<hr/><p class="title">' +
									'You waited <b><span class="timeElapsed">' + timeElapsed + '</span></b>&nbsp;' +
									'to <span class="actionGerund">' + actionGerund + '</span> it!' +
								'</p>' +
								'<p class="goal-date" style="text-align:center;color:D8D8D8">' +
									'<span class="dayOfTheWeek">' + dayOfTheWeek + '</span>,&nbsp;' +
									'<span class="shortHandDate">' + shortHandDate + '</span>' +
								'</p>' + 
							'</div><!--end goal-log item div-->';


			if(placeBelow){
				
				$('#goal-log').append(template);
			}else{
				
				$('#goal-log').prepend(template);

			}	

			
			//and make sure the heading exists too
			$("#goal-log-heading").show();
	}

	function changeGoalStatus(newGoalStatus, goalType, actualEnd){

		//goal status
			//1 == active goal
			//2 == partially completed goal
			//3 == completed goal

		//console.log("inside changeGoalStatus, newGoalStatus = " + newGoalStatus);
		//convert localStorage to json
			var currJsonString =  localStorage.esCrave;
			var jsonObject = JSON.parse(currJsonString);

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

		var jsonString = JSON.stringify(jsonObject);
		localStorage.esCrave = jsonString;
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
				if (rangeInSeconds > (60*60*60)){
					finalStringStatistic = Math.floor(rangeInSeconds /(60*60*24)) + "<span>&nbsp;days&nbsp;&nbsp;</span>" + finalStringStatistic;
					//drop minutes
					finalStringStatistic = finalStringStatistic.split("h")[0] + "h</span>";
				}
				

			//remove very first 0 from string	
			//console.log(finalStringStatistic);
			if(finalStringStatistic.charAt(0) === "0")	
				{ finalStringStatistic = finalStringStatistic.substr(1)}

			return finalStringStatistic;
			
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
	if(json.options.activeTab){
		var tabName = json.options.activeTab.split("-")[0];
		$("#" + tabName + "-tab-toggler").click();
		//console.log(json.options.activeTab);
		//console.log($("#" + tabName + "-tab-toggler"));
	}else{
		//console.log("options is null");
		$("#" + "use" + "-tab-toggler").click();
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
	json.options.activeTab = $(".tab-pane.active").attr('id');
	//console.log("save active tab fired");
	//console.log($(".tab-pane.active").attr('id'));
	//update in options table
	localStorage.setItem("activeTab", $(".tab-pane.active").attr('id'));
}

	
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


//TOGGLE ANY STATS WHICH ARE NOT ZERO 
function hideInactiveStatistics(relevantPane){

	//console.log("hide inactive");
	//bought page 
	if(relevantPane == "cost-content"){	
		if (json.statistics.cost.clickCounter === 0){
			$("#bought-total").hide();
			$("#cost-content .timer-recepticle").hide();

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

	}else if(relevantPane == "use-content"){

		if (json.statistics.use.clickCounter === 0){
			$("#use-total").hide();
			$("#use-content .timer-recepticle").hide();

		}

		if(json.statistics.use.averageBetweenClicks === 0){
			$("#averageTimeBetweenUses").parent().hide();

		}

		if (json.statistics.use.craveCounter === 0){
			$("#crave-total").hide();

		}
		if(json.statistics.use.craveCounter === 0 || json.statistics.use.clickCounter === 0){
			$("#avgDidntPerDid").parent().hide();

		}
		if(json.statistics.use.cravingsInARow === 0 || json.statistics.use.cravingsInARow === 1){
			$("#cravingsResistedInARow").parent().hide();

		}

	}else if(relevantPane == "goal-content"){

		if(json.statistics.goal.clickCounter === 0){
			$("#goal-content .timer-recepticle").hide();
		}

		if(json.statistics.goal.bestTimeSeconds === 0){
			$("#longestGoalCompleted").parent().hide();
		}
		if(json.statistics.goal.completedGoals === 0){
			$("#numberOfGoalsCompleted").parent().hide();
			$("#goal-log-heading").hide();
			
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

	}
}
function showActiveStatistics(relevantPane){


	//console.log("show active");
	//bought page 
	if(relevantPane == "cost-content"){	
		if (json.statistics.cost.clickCounter !== 0){
			$("#bought-total").show();
			$("#cost-content .timer-recepticle").show();

		}
		if(json.statistics.cost.averageBetweenClicks !== 0){
			$("#averageTimeBetweenBoughts").parent().show();
			calculateAverageTimeBetween("cost");

		}
		if (json.statistics.cost.total !== 0){
			$("#cost-content .statistic-recepticle").show();
			$("#totalAmountSpent").parent().parent().show();

		}
		if (json.statistics.cost.thisWeek !== json.statistics.cost.total){
			$("#spentThisWeek").parent().parent().show();

		}
		if (json.statistics.cost.thisMonth !== json.statistics.cost.thisWeek){
			$("#spentThisMonth").parent().parent().show();

		}
		if (json.statistics.cost.thisYear !== json.statistics.cost.thisMonth){
			$("#spentThisYear").parent().parent().show();
		
		}

	}else if(relevantPane == "use-content"){

		if (json.statistics.use.clickCounter !== 0){
			$("#use-total").show();
			$("#use-content .timer-recepticle").show();

		}
		
		if(json.statistics.use.averageBetweenClicks !== 0){
			$("#averageTimeBetweenUses").parent().show();
			//Average time between uses
			calculateAverageTimeBetween("use");	
			
		}

		if (json.statistics.use.craveCounter !== 0){
			$("#crave-total").show();

		}
		if(json.statistics.use.craveCounter !== 0 && json.statistics.use.clickCounter !== 0){
			$("#avgDidntPerDid").parent().show();

		}
		if(json.statistics.use.cravingsInARow !== 0){
			$("#cravingsResistedInARow").parent().show();

		}


	}else if(relevantPane == "goal-content"){
		//console.log("show stats goal tab");
		if(json.statistics.goal.clickCounter !== 0){
			$("#goal-content .timer-recepticle").show();
		}

		if(json.statistics.goal.bestTimeSeconds !== 0){
			$("#longestGoalCompleted").parent().show();
			//console.log("showing lng compl");
		}
		if(json.statistics.goal.completedGoals !== 0){
			$("#numberOfGoalsCompleted").parent().show();
			$("#goal-log-heading").show();
		}

		//track in clickType:goal records in action table
		//goalStatus: 1 (pending), 2 (partial), 3 (achieved)
		/*
		if(json.statistics.goalCounter:partial !== 0){
			$("#numberOfGoalsCompleted").parent().show();
		}
		if(json.statistics.goalCounter:achieved !== 0){
			$("#longestGoalCompleted").parent().show();
		}
		*/

	}
}	
	

	/*OPTIONS MENU FUNCTIONS*/

		//undo last click
		function undoLastAction(){
			
			//console.log("undo last action - clicked");

			var currJsonString =  localStorage.esCrave;
			var jsonObject = JSON.parse(currJsonString);
				//console.log(jsonObject);
				//remove most recent (last) one
				jsonObject["action"].pop();
				//console.log(jsonObject);
			var jsonString = JSON.stringify(jsonObject);
				localStorage.esCrave = jsonString;

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
			window.open("dataexport.html", "_blank");
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
		var currJsonString =  localStorage.esCrave;
		var jsonObject = JSON.parse(currJsonString);

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
			
		var jsonString = JSON.stringify(jsonObject);
			localStorage.esCrave = jsonString;
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


			timerElement.style.display = "block";
			timerElement.style.margin = "0 auto";
			
		}else{
			
		}
		
	}
	

	//open more info div
	
		$(".log-more-info-div").toggle();
	
		function openClickDialog(){

			$(".log-more-info-div").slideToggle("fast");

			//grey out backgeround
			var bodyHeight= $(document).height();
			$("#greyed-out-div").height(bodyHeight);
			$("#greyed-out-div").css("z-index", "10");
			$("#greyed-out-div").animate({opacity: 0.4}, 300);
			$("#greyed-out-div").click(function(){
				if ($("#greyed-out-div").height() > 0){
					
					if(confirm("your data will not be saved, close anyways?")){
						closeClickDialog();
					
					}
				}
			});
			
			
			
		}
		function closeClickDialog(){
			$("#greyed-out-div").animate({opacity: 0}, 200);
			$("#greyed-out-div").css("z-index", "0");
			$("#greyed-out-div").height(0);
			$("#greyed-out-div").off("click");
			
			$(".log-more-info-div").slideToggle("fast");
		}
		
	
     //SMOKE BUTTONS - START TIMER
            var smokeTimer;
            var boughtTimer;
			var goalTimer;
            var sinceLastAction;
            var secondsBetweenSmokes = [];


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
			
	//toggle options nav dropdown
	function closeOptionsNav(){
		if($("#options-collapse-menu").is(":visible")){
			$(".navbar-toggler").click();
		}

	}	
	/*Actions on switch tab */
	$(document).delegate("#cost-tab-toggler", 'click', function(e){
		
		hideInactiveStatistics("cost-content");
		closeOptionsNav();
		saveActiveTab();
		
		//push adjusting fibo timer to end of stack, so it reads the number of needed boxes corectly
			setTimeout(function(){
				adjustFibonacciTimerToBoxes("bought-timer");
			},0);

		//console.log('cost tab clicked');

	});
	$(document).delegate("#use-tab-toggler", 'click', function(e){
		
		hideInactiveStatistics("use-content");
		closeOptionsNav();
		saveActiveTab();

		//push adjusting fibo timer to end of stack, so it reads the number of needed boxes corectly
			setTimeout(function(){
				adjustFibonacciTimerToBoxes("smoke-timer");
			},0);
		
		//console.log('use tab clicked');

	});
	$(document).delegate("#goal-tab-toggler", 'click', function(e){
		
		hideInactiveStatistics("goal-content");
		closeOptionsNav();
		saveActiveTab();

		//push adjusting fibo timer to end of stack, so it reads the number of needed boxes corectly
			setTimeout(function(){
				adjustFibonacciTimerToBoxes("goal-timer");
			},0);
		
		//console.log('goal tab clicked');
	});
	
	
	
	//create initial state of app
//If json action table doesn't exist, create it
if(localStorage.esCrave){
	retrieveActionTable();
	retrieveOptionTable();
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
	//replace this with empty action table
	var newJsonString = '{ "action":[], "option": { "activeTab" : "use-content"} }';
		localStorage.setItem("esCrave", newJsonString);

		hideInactiveStatistics("use-content");
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
								
								var currCravingsPerSmokes = Math.round(json.statistics.use.craveCounter / json.statistics.use.clickCounter *10)/10;
								$("#avgDidntPerDid").html(currCravingsPerSmokes);
								
								json.statistics.use.cravingsInARow++;
								$("#cravingsResistedInARow").html(json.statistics.use.cravingsInARow);
								
								//keep lastClickStamp up to date while using app
									json.statistics.use.lastClickStampCrave = timestampSeconds;


								showActiveStatistics("use-content");
								hideInactiveStatistics("use-content");
						}else{
							alert("You just clicked this button! Wait a bit longer before clicking it again");
						}

						
					}else if(this.id == "smoke-button"){
						//update relevant statistics
							updateActionTable(timestampSeconds, "used");
						
						
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
							showActiveStatistics("use-content");
							hideInactiveStatistics("use-content");

							//there is an active bought related goal
							if(json.statistics.goal.activeGoalUse !== 0 || json.statistics.goal.activeGoalBoth !==0){
								if(json.statistics.goal.activeGoalUse !== 0){
									var goalType = "use";
									var message = 'Your goal just ended early! ' +
												'But don\'t worry, you still get a percentage of points!';
									
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
								hideInactiveStatistics("goal-content");

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

								showActiveStatistics("goal-content");

							}
							//keep lastClickStamp up to date while using app
							json.statistics.use.lastClickStamp = timestampSeconds;

							
							
					}else if(this.id == "bought-button"){
						openClickDialog();    
						
					}else if(this.id == "goal-button"){
						
						openClickDialog();   

							
						//set time default to curr time
							//get hour and minutes value from date object
							var date = new Date();

							var	currHours = date.getHours(),
								currMintues = date.getMinutes();

							if(currHours >= 12){
								$("#goal-content .time-picker-am-pm").val("PM");
								currHours=currHours % 12;
							}
							$("#goal-content .time-picker-hour").val(currHours);
							$("#goal-content .time-picker-minute").val(currMintues);
						
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
							hideInactiveStatistics("goal-content");
							

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

							showActiveStatistics("goal-content");

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
		
		$("#cost-content .log-more-info-div button").click(function(){
			var amountSpent = $("#spentInput").val();
			
				if(!$.isNumeric(amountSpent)){
					alert("Please enter in a number!");
					
				}else{
					var timestampSeconds = Math.round(new Date()/1000);
					updateActionTable(timestampSeconds, "bought", amountSpent);
					
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

					closeClickDialog();
					
					initiateBoughtTimer();	
					
					adjustFibonacciTimerToBoxes("bought-timer");

					showActiveStatistics("cost-content");

					hideInactiveStatistics("cost-content");

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
						hideInactiveStatistics("goal-content");

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

						showActiveStatistics("goal-content");
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
		
		$("#goal-content .log-more-info-div button").click(function(){
		
			var date = new Date();

			var timestampSeconds = Math.round(date/1000);
			
			//get time selection from form
				var requestedTimeEndHours = parseInt($("#goal-content select.time-picker-hour").val());
				var requestedTimeEndMinutes = parseInt($("#goal-content select.time-picker-minute").val());
			

			//12 am is actually the first hour in a day... goddamn them.
			if(requestedTimeEndHours == 12){
				requestedTimeEndHours = 0;
			}	
			//account for am vs pm from userfriendly version of time input
			if($("#goal-content select.time-picker-am-pm").val() == "PM"){
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
				showActiveStatistics("goal-content");
				
			}
			//keep lastClickStamp up to date while using app
			json.statistics.goal.lastClickStamp = timestampSeconds;



				//set local json goal type which is active
				var jsonHandle = "activeGoal" + goalType.charAt(0).toUpperCase() + goalType.slice(1);
				json.statistics.goal[jsonHandle] = 1;
				

				updateActionTable(timestampSeconds, "goal", "", goalStampSeconds, goalType);
				
				closeClickDialog();
				
				
				//convert goalend to days hours minutes seconds
				var totalSecondsUntilGoalEnd = Math.round(goalStampSeconds - timestampSeconds);
				
				loadGoalTimerValues(totalSecondsUntilGoalEnd);
								
				initiateGoalTimer();	

				showActiveStatistics("goal-content");

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
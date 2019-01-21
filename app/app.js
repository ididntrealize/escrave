
var scriptIsRunning;

//global scope functions

	//these functions are in global scope, because when notifications are dynamically added, their onClick attr needs access.
	var clearNotification = function(event){
		event.preventDefault();
		//when user clicks X on a notification, slide it off the screen.
		var currNotification = $(this).parent().parent();
		var notificationWidth = currNotification.css("width");
			currNotification.animate(
				{right: notificationWidth}, 300, 
				function(){
					currNotification.css("display", "none");
				});	
	}

	//one of the buttons created dynamically needs this function to be globalscope to use this
	function createNotification(message, responseTools){
		var template =  '<div class="notification" style="">' + 
							'<div class="notification-message">' +
								'<p class="notification-text">' + message + '</p>' + 
								'<a class="notification-close" href="#" onclick="clearNotification.call(this, event);">X</a>' +
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
					'<button class="notification-response-tool" href="#" ' + 
						'onclick="clearNotification.call(this, event);' + 
						'		respondToGoalEnd(true,' + goalHandle.timestamp + ',' + goalHandle.goalStamp + ',' + '\'' + goalHandle.goalType + '\'' +  ')">' + 
					'Yes</button>' + 
					'<button class="notification-response-tool" href="#" ' + 
						'onclick="clearNotification.call(this, event);' + 
						'respondToGoalEnd(false,' + goalHandle.timestamp + ',' + goalHandle.goalStamp + ',' + '\'' + goalHandle.goalType + '\'' +  ')">' + 
					'No</button>';
		
		createNotification(message, responseTools);

	}

	function respondToGoalEnd(success, startStamp, endStamp, goalType){

			var message = "",
				responseTools = "";

		if(success){
				message = "Congrats on completing your goal! " + 
						"It's been added to the bottom of your goal tab";
				responseTools = '<script type="script/javascript">' +
								'placeGoalIntoLog(' + startStamp + ',' + endStamp + ',' + '\'' + goalType + '\'' + ');' + 
								'</script>';
				createNotification(message, responseTools);
				
				//goal status
					//1 == active goal
					//2 == partially completed goal
					//3 == completed goal
				changeGoalStatus(3, goalType);
		}else{

			var now = Math.round(new Date()/1000);

			var min = new Date(startStamp).getTime();
			var max = new Date(endStamp).getTime();

			var	minFormatted = Math.floor((now - min) / 86400),
				maxFormatted = Math.floor((now - max) / 86400);
				if(minFormatted == 0){
					minFormatted = "-" + (minFormatted);
				}
				if(maxFormatted == 0){
					maxFormatted = "-" + (maxFormatted);
				}

		
			message = "You can still get a percentage of points for how long you waited. " + 
					"Around when do you think you broke your goal?";

responseTools = '<!-- custom Time picker-->' +
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
				'<button class="notification-response-tool" href="#" ' + 
						'onclick="' + 
							'var tempEndStamp = convertDateTimeToTimestamp(\'#datepicker-notification\', \'#goalEndTimePicker\' );' +
								'if(tempEndStamp - ' + startStamp + ' > 0 || ' + endStamp + ' - tempEndStamp < 0){' +
									'changeGoalStatus(2, ' + '\'' + goalType + '\'' + ', tempEndStamp);' +
									'placeGoalIntoLog(' + startStamp + ', tempEndStamp ,' + '\'' + goalType + '\'' +  ');' + 
									'clearNotification.call(this, event);' + 
								'}else{alert(\'Please choose a time within your goal range!\');}">' +
				'Submit</button>';
			
			createNotification(message, responseTools);
			
			//need to pull most recent clickType goal 
			//min = this.timestamp;
			//max = this.goalStamp;

			//var target = $( "#datepicker-notification" ),
			//	min = -7,
			//	max = -0;
			//target.datepicker({ minDate: min, maxDate: max });
			//target.datepicker();
			
			
		}	
	}
	function convertDateTimeToTimestamp(datePickerTarget, timePickerTarget){
		var tempEndStamp = $(datePickerTarget).datepicker({dateFormat: 'yy-mm-dd'}).val(); 
			tempEndStamp = Math.round(new Date(tempEndStamp).getTime() / 1000);
		
			console.log("tempEndStamp after pulled from datepicker = " + tempEndStamp);
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
				console.log("tempEndStamp after timepicker hours added = " + tempEndStamp);

				
				return tempEndStamp;

				
			}

	function placeGoalIntoLog(startStamp, endStamp, goalType){
		
		
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
								'<p class="title">' +
									'You waited <b><span class="timeElapsed">' + timeElapsed + '</span></b>&nbsp;' +
									'to <span class="actionGerund">' + actionGerund + '</span> it!' +
								'</p>' +
								'<p class="goal-date" style="text-align:center;color:D8D8D8">' +
									'<span class="dayOfTheWeek">' + dayOfTheWeek + '</span>,&nbsp;' +
									'<span class="shortHandDate">' + shortHandDate + '</span>' +
								'</p><hr/>' + 
							'</div><!--end goal-log item div-->';


			$('#goal-log').prepend(template);
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
			console.log("actualEnd returns true, and is = " + actualEnd)
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
            // Code for localStorage/sessionStorage.
       
				var json = {
					"sinceLastUse":
						{
							"totalSeconds" : 0,
							"days" : 0,
							"hours" : 0,
							"minutes" : 0,
							"seconds" : 0
							
						},
					"sinceLastBought":
						{
							"totalSeconds" : 0,
							"days" : 0,
							"hours" : 0,
							"minutes" : 0,
							"seconds" : 0
							

						},
					"untilGoalEnd":
						{
							"totalSeconds" : 0,
							"days" : 0,
							"hours" : 0,
							"minutes" : 0,
							"seconds" : 0
							
							
						},
					"statistics":
						{
							"craveCounter" : 0,
							"cravingsInARow" : 0,
							"useCounter" : 0,
							"boughtCounter": 0,
							"goalCounter": 0,
							"totalSpent" :   0,
							"spentThisWeek" : 0,
							"spentThisMonth" : 0,
							"spentThisYear" : 0,
							"secondsBetweenBought": 0,
							"secondsBetweenUse": 0,
							"firstUseClickStamp" : 0,
							"firstBoughtClickStamp" : 0,
							"longestGoalTotalSeconds": 0,
							"numberOfGoalsCompleted" : 0,
							"activeGoalUse" : 0,
							"activeGoalBought" : 0,
							"activeGoalBoth": 0,
							"lastClickStampUse": 0,
							"lastClickStampBought" : 0,
							"lastClickStampCrave" : 0,
							"lastClickStampGoal" : 0,

						},
					"options":
						{
							"activeTab" : "use-content"

						}
					
				};
				
				
				var jsonRefactored = {
					/*
				REFACTORED JSON -- CUZ it was getting really messy, and could make issues

					json.sinceLastBought =>
					json.statistics.cost.sinceTimerStart

					json.sinceLastUse =>
					json.statistics.use.sinceTimerStart

					json.untilGoalEnd =>
					json.statistics.goal.untilTimerEnd
					
						(child stats equivalent)



					json.statistics.boughtCounter =>
					json.statistics.cost.clickCounter

					json.statistics.useCounter =>
					json.statistics.use.clickCounter

					json.statistics.goalCounter =>
					json.statistics.goal.clickCounter




					json.statistics.totalSpent =>
					json.statistics.cost.total

					json.statistics.spentThisWeek =>
					json.statistics.cost.thisWeek

					json.statistics.spentThisMonth =>
					json.statistics.cost.thisMonth

					json.statistics.spentThisYear =>
					json.statistics.cost.thisYear



					
					json.statistics.firstUseClickStamp =>
					json.statistics.use.firstClickStamp
					
					json.statistics.firstBoughtClickStamp =>
					json.statistics.cost.fistClickStamp



					json.statistics.secondsBetweenBought =>
					json.statistics.cost.averageBetweenClicks

					json.statistics.secondsBetweenUse =>
					json.statistics.use.averageBetweenClicks



					json.statistics.craveCounter =>
					json.statistics.use.craveCounter

					json.statistics.cravingsInARow =>
					json.statistics.use.cravingsInARow

					
					json.statistics.activeGoalBought =>
					json.statistics.goal.activeType = "cost || use || both"

					json.statistics.activeGoalUse =>
					json.statistics.goal.activeType = "cost || use || both"

					json.statistics.activeGoalBoth =>
					json.statistics.goal.activeType = "cost || use || both"



					json.statistics.longestGoalCompleted =>
					json.statistics.goal.bestTimeSeconds

					json.statistics.completedGoals =>
					json.statistics.goal.percentCompleted

					
				*/
					"statistics": 
						{
							"cost":
								{
									"sinceLastBought":
										{
											"totalSeconds" : 0,
											"days" : 0,
											"hours" : 0,
											"minutes" : 0,
											"seconds" : 0
										},
									"boughtCounter" : 0,
									"TotalSpent" : 0,
									"spentThisWeek" : 0,
									"spentThisMonth" : 0,
									"spentThisYear" : 0,
									"firstClickStamp" : 0,
									"lastClickStamp" : 0,
									"secondsBetweenClicks" : 0
								},

							"use":
								{
									"sinceLastUse" : 
										{
											"totalSeconds" : 0,
											"days" : 0,
											"hours" : 0,
											"minutes" : 0,
											"seconds" : 0
										},
									"useCounter" : 0,
									"craveCounter" : 0,
									"cravingsInARow" : 0,
									"firstClickStamp" : 0,
									"lastClickStamp" : 0,
									"secondsBetweenClicks" : 0
								},

							"goal": 
								{
									"untilGoalEnd" :
										{
											"totalSeconds" : 0,
											"days" : 0,
											"hours" : 0,
											"minutes" : 0,
											"seconds" : 0
										},
									"goalCounter" : 0,
									"lastClickStamp" : 0,
									"longestGoalTotalSeconds": 0,
									"completedGoals" : 0,
									"activeGoalUse" : 0,
									"activeGoalBought" : 0,
									"activeGoalBoth": 0
								}
						},

					"options" : 
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
									json.statistics.useCounter = useCount.length;
								
								//Restart timer value
								if(useCount.length>0){
									var sinceLastUse = useCount[useCount.length-1].timestamp;
									restartTimerAtValues("use", sinceLastUse);

									//average time between uses	
										var totalTimeBetweenUses = useCount[useCount.length - 1].timestamp - useCount[0].timestamp,
											averageTimeBetweenUses = Math.round(totalTimeBetweenUses/(useCount.length));

										if ($.isNumeric(averageTimeBetweenUses)){
											json.statistics.secondsBetweenUse = averageTimeBetweenUses;
										}


									//used to calculate avg time between from json obj, live
										json.statistics.firstUseClickStamp = useCount[0].timestamp;

									//timestamp of most recent click - to limit clicks in a row
										json.statistics.lastClickStampUse = useCount[useCount.length-1].timestamp;
										
								}

							
								//total craves
									var craveCount = jsonObject.action.filter(function(e){
										return e.clickType == "craved";
									});
									json.statistics.craveCounter = craveCount.length;
								
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
									json.statistics.cravingsInARow = cravesInARow;

									
								//timestamp of most recent click - to limit clicks in a row
								if(craveCount.length > 0){
									json.statistics.lastClickStampCrave = craveCount[craveCount.length-1].timestamp;
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
									json.statistics.boughtCounter = boughtCount.length;
									
									
								//Restart timer value
								if(boughtCount.length>0){
									var sinceLastBought = boughtCount[boughtCount.length-1].timestamp;
									restartTimerAtValues("bought", sinceLastBought);

									//average time between boughts
										var totalTimeBetweenBoughts = boughtCount[boughtCount.length - 1].timestamp - boughtCount[0].timestamp,
											averageTimeBetweenBoughts = Math.round(totalTimeBetweenBoughts/(boughtCount.length));

									if ($.isNumeric(averageTimeBetweenBoughts)){
										json.statistics.secondsBetweenBought = averageTimeBetweenBoughts;
									}
									
									//used to calculate avg time between from json obj, live
										json.statistics.firstBoughtClickStamp = boughtCount[0].timestamp;

									//timestamp of most recent click - to limit clicks in a row
										json.statistics.lastClickStampBought = boughtCount[boughtCount.length-1].timestamp;
										
									
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
									json.statistics.totalSpent     = runningTotalCost;
									json.statistics.spentThisWeek  = runningTotalCostWeek;
									json.statistics.spentThisMonth = runningTotalCostMonth;
									json.statistics.spentThisYear  = runningTotalCostYear;

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
									json.statistics.lastClickStampGoal = goalCount[goalCount.length-1].timestamp;
									
									json.statistics.goalCounter = goalCount.length;
									if (activeGoals.length > 0){
										var mostRecentGoal = activeGoals[activeGoals.length - 1];

										//set var in json for if there is an active goal of X type - 
										//to be used on click of relevant buttons to end goal
										if(mostRecentGoal.goalType == "both"){
											json.statistics.activeGoalBoth = 1;

										}else if(mostRecentGoal.goalType == "use"){
											json.statistics.activeGoalUse = 1;

										}else if(mostRecentGoal.goalType == "bought"){
											json.statistics.activeGoalBought = 1;

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
												hideInactiveStatistics("goal-content");
										}
									}else{
										
										//last made goal time has concluded
										//hide empty timer
											$("#goal-content .timer-recepticle").hide();
											hideInactiveStatistics("goal-content");
									}

									if(inactiveGoals.length > 0){

										//used for finding longest goal completed
										var largestDiff = 0;

										//iterate through goals for goal log
										for(var i = 0; i < inactiveGoals.length; i++){

											var currStartStamp = inactiveGoals[i].timestamp,
												currEndStamp = inactiveGoals[i].goalStopped,
												currGoalType = inactiveGoals[i].goalType;

											placeGoalIntoLog(currStartStamp, currEndStamp, currGoalType);

											/* only display a certain number of goals per page */
												//if(i == 4){
													//$("#goal-log-show-more").toggle();
													//break;
												//}

											//find longest completed goal
											var currDiff = currEndStamp - currStartStamp;

											if(largestDiff < currDiff){
												largestDiff = currDiff;
											}
											
										}

										json.statistics.longestGoalTotalSeconds = largestDiff;

									}

								}
					//NEEEWWWWW USERRR
					if(useCount == 0 && craveCount == 0 && boughtCount == 0 && goalCount == 0){				
						var introMessage = "Welcome to esCrave! Try clicking some buttons, you can reset the app from the menu at any time.";
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
		

/* CONVERT JSON TO LIVE STATS */
		
		function displayAverageTimeBetween(actionType){
			//convert total seconds to ddhhmmss
				var jsonHandle = "",
				htmlDestination = "";
					if(actionType == "uses"){
						jsonHandle = "secondsBetweenUse";
						htmlDestination = "#averageTimeBetweenUses";
						//console.log("uses");

					}else if(actionType == "boughts"){
						jsonHandle = "secondsBetweenBought";
						htmlDestination = "#averageTimeBetweenBoughts";
						//console.log("boughts display stat()");
					}
					var finalStringStatistic = convertSecondsToDateFormat(json.statistics[jsonHandle]);
					
						//insert HTML into span place holder
					$(htmlDestination).html(finalStringStatistic);
					
		}


		
		function calculateAverageTimeBetween(actionType){
			//current timestamp
				var currTimestamp = Math.round(new Date()/1000);

			//read & write to correct json keys
				var clickCountKey = "",
					firstTimestampKey = "",
					avgTimeBetweenKey = "";
					if(actionType == "uses"){
						clickCountKey = "useCounter";
						firstTimestampKey = "firstUseClickStamp";
						avgTimeBetweenKey = "secondsBetweenUse";
						//console.log("uses");

					}else if(actionType == "boughts"){
						clickCountKey = "boughtCounter";
						firstTimestampKey = "firstBoughtClickStamp";
						avgTimeBetweenKey = "secondsBetweenBought";
						//console.log("boughts");
					}

			//set key to the correct calculation ((currTimestamp - firstTimestamp) / (totalClicks))
			var totalTimeBetween = parseInt(currTimestamp) - parseInt(json.statistics[firstTimestampKey]),
				totalClicks = parseInt(json.statistics[clickCountKey]);
			json.statistics[avgTimeBetweenKey] = Math.round(totalTimeBetween / totalClicks);
			
			//call function to display new stat
			displayAverageTimeBetween(actionType);

		}


		function displayLongestGoal(){
			var html = convertSecondsToDateFormat(json.statistics.longestGoalTotalSeconds);
			$("#longestGoalCompleted").html(html);
			
		}

		//If json action table doesn't exist, create it
			if(localStorage.esCrave){
				retrieveActionTable();
				retrieveOptionTable();
			//set stats	
				//set total clicks for each button
				$("#use-total").html(json.statistics.useCounter);
				$("#crave-total").html(json.statistics.craveCounter);
				$("#bought-total").html(json.statistics.boughtCounter);
				
				//Average time between
				displayAverageTimeBetween("uses");	
				displayAverageTimeBetween("boughts");	
				displayLongestGoal();
			}else{
				//replace this with empty action table
				var newJsonString = '{ "action":[], "option": { "activeTab" : "use-content"} }';
					localStorage.setItem("esCrave", newJsonString);
			}

//TOGGLE ANY STATS WHICH ARE NOT ZERO 
function hideInactiveStatistics(relevantPane){

	//console.log("hide inactive");
	//bought page 
	if(relevantPane == "cost-content"){	
		if (json.statistics.boughtCounter === 0){
			$("#bought-total").hide();
			$("#cost-content .timer-recepticle").hide();

		}
		if(json.statistics.secondsBetweenBought === 0){
			$("#averageTimeBetweenBoughts").parent().hide();

		}
		if (json.statistics.totalSpent === 0){
			//console.log("total spent is 0: " + json.statistics.totalSpent);
			//toggle all
			$("#cost-content .statistics-recepticle").hide();
			$("#totalAmountSpent").parent().parent().hide();
			$("#spentThisWeek").parent().parent().hide();
			$("#spentThisMonth").parent().parent().hide();
			$("#spentThisYear").parent().parent().hide();

		}else if (json.statistics.spentThisWeek == json.statistics.totalSpent){
			//console.log("toggle all but total - spent this week equals total");
			//toggle year month week 
			$("#spentThisWeek").parent().parent().hide();
			$("#spentThisMonth").parent().parent().hide();
			$("#spentThisYear").parent().parent().hide();

		}else if (json.statistics.spentThisMonth == json.statistics.spentThisWeek){
			//console.log("toggle all but week - spent this month equals week");
			//toggle year and month
			$("#spentThisMonth").parent().parent().hide();
			$("#spentThisYear").parent().parent().hide();

		}else if (json.statistics.spentThisYear == json.statistics.spentThisMonth){
			//console.log("toggle year - spent this year equals month");
			$("#spentThisYear").parent().parent().hide();
		
		}

	}else if(relevantPane == "use-content"){

		if (json.statistics.useCounter === 0){
			$("#use-total").hide();
			$("#use-content .timer-recepticle").hide();

		}

		if(json.statistics.secondsBetweenUse === 0){
			$("#averageTimeBetweenUses").parent().hide();

		}

		if (json.statistics.craveCounter === 0){
			$("#crave-total").hide();

		}
		if(json.statistics.craveCounter === 0 || json.statistics.useCounter === 0){
			$("#avgDidntPerDid").parent().hide();

		}
		if(json.statistics.cravingsInARow === 0 || json.statistics.cravingsInARow === 1){
			$("#cravingsResistedInARow").parent().hide();

		}

	}else if(relevantPane == "goal-content"){

		if(json.statistics.goalCounter === 0){
			$("#goal-content .timer-recepticle").hide();
		}

		if(json.statistics.longestGoalTotalSeconds === 0){
			$("#longestGoalCompleted").parent().hide();
		}
		if(json.statistics.numberOfGoalsCompleted === 0){
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

	}
}
function showActiveStatistics(relevantPane){


	//console.log("show active");
	//bought page 
	if(relevantPane == "cost-content"){	
		if (json.statistics.boughtCounter !== 0){
			$("#bought-total").show();
			$("#cost-content .timer-recepticle").show();

		}
		if(json.statistics.secondsBetweenBought !== 0){
			$("#averageTimeBetweenBoughts").parent().show();
			calculateAverageTimeBetween("boughts");	
		}
		if (json.statistics.totalSpent !== 0){
			$("#cost-content .statistics-recepticle").show();
			$("#totalAmountSpent").parent().parent().show();

		}
		if (json.statistics.spentThisWeek !== json.statistics.totalSpent){
			$("#spentThisWeek").parent().parent().show();

		}
		if (json.statistics.spentThisMonth !== json.statistics.spentThisWeek){
			$("#spentThisMonth").parent().parent().show();

		}
		if (json.statistics.spentThisYear !== json.statistics.spentThisMonth){
			$("#spentThisYear").parent().parent().show();
		
		}

	}else if(relevantPane == "use-content"){

		if (json.statistics.useCounter !== 0){
			$("#use-total").show();
			$("#use-content .timer-recepticle").show();

		}
		
		if(json.statistics.secondsBetweenUse !== 0){
			$("#averageTimeBetweenUses").parent().show();
			//Average time between uses
			calculateAverageTimeBetween("uses");	
			
		}

		if (json.statistics.craveCounter !== 0){
			$("#crave-total").show();

		}
		if(json.statistics.craveCounter !== 0 && json.statistics.useCounter !== 0){
			$("#avgDidntPerDid").parent().show();

		}
		if(json.statistics.cravingsInARow !== 0){
			$("#cravingsResistedInARow").parent().show();

		}


	}else if(relevantPane == "goal-content"){
		//console.log("show stats goal tab");
		if(json.statistics.goalCounter !== 0){
			$("#goal-content .timer-recepticle").show();
		}

		if(json.statistics.longestGoalTotalSeconds !== 0){
			$("#longestGoalCompleted").parent().show();
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
					
					console.log("undo last action - clicked");

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
					console.log("share stats - clicked");
					//localStorage.clear();

					//might want to actually set up a db to handle this though!~! 
				}

				/*OPTIONS MENU CLICK EVENTS */
				$("#undoActionButton").click(function(event){
					event.preventDefault();
					undoLastAction();

				});

				$("#clearTablesButton").click(function(event){
					event.preventDefault();
					clearActions();

				});

				$("#shareStatsButton").click(function(event){
					event.preventDefault();
					shareActions();

				});


			
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
			
	
	function restartTimerAtValues(timerId, sinceLastAction){
				var timeNow = new Date()/1000;
				
				
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
						if(timerId == "use"){
							json.sinceLastUse.totalSeconds = newTimerTotalSeconds;
							json.sinceLastUse.seconds = newTimerSeconds;
							json.sinceLastUse.minutes = newTimerMinutes;					
							json.sinceLastUse.hours = newTimerHours;	
							json.sinceLastUse.days = newTimerDays;
							
							
						}else if(timerId == "bought"){
							json.sinceLastBought.totalSeconds = newTimerTotalSeconds;
							json.sinceLastBought.seconds = newTimerSeconds;
							json.sinceLastBought.minutes = newTimerMinutes;					
							json.sinceLastBought.hours = newTimerHours;	
							json.sinceLastBought.days = newTimerDays;
							
						}else if(timerId == "goal"){
							json.untilGoalEnd.totalSeconds = newTimerTotalSeconds;
							json.untilGoalEnd.seconds = newTimerSeconds;
							json.untilGoalEnd.minutes = newTimerMinutes;					
							json.untilGoalEnd.hours = newTimerHours;	
							json.untilGoalEnd.days = newTimerDays;
							
						}
						/*
						console.log(  
 						"USE SECTION - json seconds = " + json.sinceLastUse.seconds + 
 						"\njson minutes are = " + json.sinceLastUse.minutes +
 						"\njson Hours are = " + json.sinceLastUse.hours +
 						"\njson Days are = " + json.sinceLastUse.days +
 					 
 						"BOUGHT SECTION - json seconds = " + json.sinceLastBought.seconds + 
 						"\njson minutes are = " + json.sinceLastBought.minutes +
 						"\njson Hours are = " + json.sinceLastBought.hours +
 						"\njson Days are = " + json.sinceLastBought.days
 					);	
					*/
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
	 (function hideTimersOnLoad(){
            if(json.sinceLastUse.totalSeconds == 0){
              $("#use-content .fibonacci-timer:first-child").toggle();

            }else{
                //start timer from json values
				initiateSmokeTimer();
            }

            if(json.sinceLastBought.totalSeconds == 0){
              $("#cost-content .fibonacci-timer:first-child").toggle();

            }else{
                //start timer from json values
				initiateBoughtTimer();	
            }

            if(json.untilGoalEnd.totalSeconds == 0){
              $("#goal-content .fibonacci-timer").toggle();

            }else{
                //start timer from json values
                initiateGoalTimer();	
			}
		})();
			
	//toggle options nav dropdown
	function closeOptionsNav(){
		if($("#options-collapse-menu").is(":visible")){
			$(".navbar-toggler").click();
		}

	}	
	/*Actions on switch tab */
	$(document).delegate("#cost-tab-toggler", 'click', function(e){
		adjustFibonacciTimerToBoxes("bought-timer");
		hideInactiveStatistics("cost-content");
		closeOptionsNav();
		saveActiveTab();

	});
	$(document).delegate("#use-tab-toggler", 'click', function(e){
		adjustFibonacciTimerToBoxes("smoke-timer");
		hideInactiveStatistics("use-content");
		closeOptionsNav();
		saveActiveTab();

	});
	$(document).delegate("#goal-tab-toggler", 'click', function(e){
		adjustFibonacciTimerToBoxes("goal-timer");
		hideInactiveStatistics("goal-content");
		closeOptionsNav();
		saveActiveTab();
	});
	
	//return to last active tab
	(function returnToActiveTab(){
		var tabName = (json.options.activeTab).split("-")[0];
			$("#" + tabName + "-tab-toggler").click();

		/*
		//toggle active class on nav-tabs
			$(".nav-tabs li").removeClass("active");
			$("#" + tabName + "-tab-toggler").parent().addClass("active");
		//toggle active class on actual tab content
			$(".tab-pane").removeClass("active");
			$("#" + tabName + "-content").addClass("active");
		*/	

	})();
	//save current tab on switch
	function saveActiveTab(){
		//update instance json
		json.options.activeTab = $(".tab-pane.active").attr('id');
		//update in options table
		localStorage.setItem("activeTab", $(".tab-pane.active").attr('id'));
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
						if(timestampSeconds - json.statistics.lastClickStampCrave > 10){

							//update relevant statistics
								json.statistics.craveCounter++;
								$("#crave-total").html(json.statistics.craveCounter);
								updateActionTable(timestampSeconds, "craved");
								
								var currCravingsPerSmokes = Math.round(json.statistics.craveCounter / json.statistics.useCounter *10)/10;
								$("#avgDidntPerDid").html(currCravingsPerSmokes);
								
								json.statistics.cravingsInARow++;
								$("#cravingsResistedInARow").html(json.statistics.cravingsInARow);
								
								//keep lastClickStamp up to date while using app
									json.statistics.lastClickStampCrave = timestampSeconds;


								showActiveStatistics("use-content");
								hideInactiveStatistics("use-content");
						}else{
							alert("You just clicked this button! Wait a bit longer before clicking it again");
						}

						
					}else if(this.id == "smoke-button"){
						//update relevant statistics
							updateActionTable(timestampSeconds, "used");
						
						//fake firstStampUses in json obj
							if(json.statistics.useCounter == 0){
								json.statistics.firstUseClickStamp = json.statistics.firstUseClickStamp + timestampSeconds;

							}else if (json.statistics.useCounter == 1){
								json.statistics.secondsBetweenUse = timestampSeconds - json.statistics.firstUseClickStamp;

							}

							json.statistics.useCounter++;
							$("#use-total").html(json.statistics.useCounter);
						
							var currCravingsPerSmokes = Math.round(json.statistics.craveCounter / json.statistics.useCounter *10)/10;
							$("#avgDidntPerDid").html(currCravingsPerSmokes);
					
							json.statistics.cravingsInARow = 0;
							$("#cravingsResistedInARow").html(json.statistics.cravingsInARow);
						
							

							//start timer
							initiateSmokeTimer();	

							adjustFibonacciTimerToBoxes("smoke-timer");
							showActiveStatistics("use-content");
							hideInactiveStatistics("use-content");

							//there is an active bought related goal
							if(json.statistics.activeGoalUse !== 0 || json.statistics.activeGoalBoth !==0){
								if(json.statistics.activeGoalUse !== 0){
									var goalType = "use";
									var message = 'Your goal just ended! ' +
												'But, you still get a percentage of points!';
									
									json.statistics.activeGoalUse = 0;
								
								}else if(json.statistics.activeGoalBoth !==0){
									var goalType = "both";
									var message = 'Your goal just ended! ' +
												'But, you still get a percentage of points!';

									json.statistics.activeGoalBoth = 0;
								
								}

								changeGoalStatus(2, goalType, timestampSeconds);
								createNotification(message);
								clearInterval(goalTimer);
								
								$("#goal-content .timer-recepticle").hide();
								hideInactiveStatistics("goal-content");

								//place a goal into the goal log
								var startStamp = json.statistics.lastClickStampGoal;
								var actualEnd = timestampSeconds;
								placeGoalIntoLog(startStamp, actualEnd, goalType);

							}
							//keep lastClickStamp up to date while using app
							json.statistics.lastClickStampUse = timestampSeconds;

							
							
					}else if(this.id == "bought-button"){
						//timerSection = "#cost-content";
						sinceLastAction = "sinceLastBought";
						currTimer = boughtTimer;
							
						openClickDialog();    
						
					}else if(this.id == "goal-button"){
						timerSection = "#goal-content";
						sinceLastAction = "untilGoalEnd";
						
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
				json.sinceLastUse.days = 0,
				json.sinceLastUse.hours = 0,
				json.sinceLastUse.minutes = 0,
				json.sinceLastUse.seconds = 0,
				json.sinceLastUse.totalSeconds = 0;	

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
				var daysSinceUse = json.sinceLastUse.days,
					hoursSinceUse = json.sinceLastUse.hours,
					minutesSinceUse = json.sinceLastUse.minutes,
					secondsSinceUse = json.sinceLastUse.seconds,
					totalSecondsSinceUse = json.sinceLastUse.totalSeconds;

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
            json.sinceLastUse.totalSeconds++;
            json.sinceLastUse.seconds++;
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
                json.sinceLastUse.seconds = 0;
                json.sinceLastUse.minutes++;

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
                json.sinceLastUse.minutes = 0;
                json.sinceLastUse.hours++;


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
                json.sinceLastUse.hours = 0;
                json.sinceLastUse.days++;


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
				json.sinceLastBought.days = 0,
				json.sinceLastBought.hours = 0,
				json.sinceLastBought.minutes = 0,
				json.sinceLastBought.seconds = 0,
				json.sinceLastBought.totalSeconds = 0;	

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
				var daysSinceBought = json.sinceLastBought.days,
					hoursSinceBought = json.sinceLastBought.hours,
					minutesSinceBought = json.sinceLastBought.minutes,
					secondsSinceBought = json.sinceLastBought.seconds,
					totalSecondsSinceBought = json.sinceLastBought.totalSeconds;

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

			json.statistics.goalCounter++;


			clearInterval(goalTimer);
			
            var jsonDaysString = json.untilGoalEnd.days,
                jsonHoursString = json.untilGoalEnd.hours,
                jsonMinutesString = json.untilGoalEnd.minutes,
                jsonSecondsString = json.untilGoalEnd.seconds,
                jsonTotalSecondsString = json.untilGoalEnd.totalSeconds;
                
                    $(timerSection + " .secondsSinceLastClickSpan:first-child").html(jsonSecondsString);
                    $(timerSection + " .minutesSinceLastClickSpan:first-child").html(jsonMinutesString);
                    $(timerSection + " .hoursSinceLastClickSpan:first-child").html(jsonHoursString);
                    $(timerSection + " .daysSinceLastClickSpan:first-child").html(jsonDaysString);


				//make any boxes with value of zero hidden	
				for(i = 0; i< $("#goal-content .boxes div").length; i ++){
					var currTimerSpanValue = ($("#goal-content .boxes div .timerSpan")[i].innerHTML);
					if(currTimerSpanValue == "0"){
						$($("#goal-content .boxes div")[i]).hide();
					}else{
						console.log("got to " + i + ". now bouta break;");
						break;
					}
				}
				

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
									  }
								}

						}else{
							/* ENTIRE GOAL IS DONE */
							jsonSecondsString=0;
							clearInterval(goalTimer);
							$(timerSection + " .fibonacci-timer").parent().toggle();
							hideInactiveStatistics("goal-content");
							

							//find most recent goal type
								var goalType = "";
								if(json.statistics.activeGoalBoth == 1){
									goalType = "both";
									json.statistics.activeGoalBoth = 0;

								}else if(json.statistics.activeGoalBought == 1){
									goalType = "bought";
									json.statistics.activeGoalBought = 0;

								}else if(json.statistics.activeGoalUse == 1){
									goalType = "use";
									json.statistics.activeGoalUse = 0;
								}
								
								var actualEnd = Math.round(new Date()/1000);

							changeGoalStatus(3, goalType, actualEnd);

							//(startStamp, endStamp, goalType) =>
							var startStamp = json.statistics.lastClickStampGoal;
							placeGoalIntoLog(startStamp, actualEnd, goalType);

							//notify user that goal ended
							var message = "your goal just ended, congrats! Check your goal log for details.";
							createNotification(message);

						}
						/*
						if ($(timerSection + " .boxes div:visible").length == 1 ) {
                            var numberOfBoxesHidden = $(timerSection + " .boxes div:hidden").length;
                            $($(timerSection + " .boxes div:hidden")[numberOfBoxesHidden - 1]).toggle();
                        }
						*/
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
							console.log(jsonDaysString);
								if(jsonDaysString == 0){
									if ($(timerSection + ' .boxes div:visible').length > 1 ) {
										$($(timerSection + ' .boxes div:visible')[0]).toggle();
									  }
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
					if(json.statistics.boughtCounter == 0){
						json.statistics.firstBoughtClickStamp = json.statistics.firstBoughtClickStamp + timestampSeconds;
						
					}else if (json.statistics.boughtCounter == 1){
						json.statistics.secondsBetweenBought = timestampSeconds - json.statistics.firstBoughtClickStamp;
						
					}

					//update display
					json.statistics.boughtCounter++;
					$("#bought-total").html(json.statistics.boughtCounter);

					//update spent in json
					json.statistics.totalSpent = parseInt(json.statistics.totalSpent) + parseInt(amountSpent);
					json.statistics.spentThisWeek = parseInt(json.statistics.spentThisWeek) + parseInt(amountSpent);
					json.statistics.spentThisMonth = parseInt(json.statistics.spentThisMonth) + parseInt(amountSpent);
					json.statistics.spentThisYear = parseInt(json.statistics.spentThisYear) + parseInt(amountSpent);

					//update display
					$("#totalAmountSpent").html(json.statistics.totalSpent + "$");
					$("#spentThisWeek").html(json.statistics.spentThisWeek + "$");
					$("#spentThisMonth").html(json.statistics.spentThisMonth + "$");
					$("#spentThisYear").html(json.statistics.spentThisYear + "$");

					closeClickDialog();
					
					initiateBoughtTimer();	
					
					adjustFibonacciTimerToBoxes("bought-timer");

					showActiveStatistics("cost-content");

					//there is an active bought related goal
					if(json.statistics.activeGoalBought !== 0 || json.statistics.activeGoalBoth !==0){
						if(json.statistics.activeGoalBought !== 0){
							var goalType = "bought";
							var message = 'Your goal just ended! ' +
										'But, you still get a percentage of points!';
							
							json.statistics.activeGoalBought = 0;
						
						}else if(json.statistics.activeGoalBoth !==0){
							var goalType = "both";
							var message = 'Your goal just ended! ' +
										'But, you still get a percentage of points!';
							
							json.statistics.activeGoalBoth = 0;
						
						}

						changeGoalStatus(2, goalType, timestampSeconds);
						createNotification(message);
						clearInterval(goalTimer);
						
						$("#goal-content .timer-recepticle").hide();
						hideInactiveStatistics("goal-content");

						//place a goal into the goal log
						var startStamp = json.statistics.lastClickStampGoal;
						var actualEnd = timestampSeconds;
						placeGoalIntoLog(startStamp, actualEnd, goalType);
					}
					
					//keep lastClickStamp up to date while using app
					json.statistics.lastClickStampBought = timestampSeconds;


				}
			
		});
			
		//calculate goal timer values
		function loadGoalTimerValues(totalSecondsUntilGoalEnd){

			json.untilGoalEnd.days = 0;
			json.untilGoalEnd.hours = 0;
			json.untilGoalEnd.minutes = 0;
			json.untilGoalEnd.seconds = 0;
			json.untilGoalEnd.totalSeconds = totalSecondsUntilGoalEnd;
			
			
			//calc mins and secs
				if(totalSecondsUntilGoalEnd > 60){
					json.untilGoalEnd.seconds = totalSecondsUntilGoalEnd % 60;
					json.untilGoalEnd.minutes = Math.floor(totalSecondsUntilGoalEnd / 60);
				}else{
					json.untilGoalEnd.seconds = totalSecondsUntilGoalEnd;
					json.untilGoalEnd.minutes = 0;
				}
			
			//calc hours
				if(totalSecondsUntilGoalEnd > (60*60)){
					json.untilGoalEnd.minutes = json.untilGoalEnd.minutes % 60;
					json.untilGoalEnd.hours = Math.floor(totalSecondsUntilGoalEnd / (60*60));
					
				}else{
					json.untilGoalEnd.hours = 0;
				}
				
			//calc days
				if(totalSecondsUntilGoalEnd > (60*60*24)){
					json.untilGoalEnd.hours = json.untilGoalEnd.hours % 24;
					json.untilGoalEnd.days = Math.floor(totalSecondsUntilGoalEnd / (60*60*24));
				}else{
					json.untilGoalEnd.days = 0;
				}
			
			/*
			console.log(
						  "days till complete: " + json.untilGoalEnd.days
						+ "\nhours until: "      + json.untilGoalEnd.hours 
						+ "\nminutes until: "    + json.untilGoalEnd.minutes
						+ "\nseconds until: "    + json.untilGoalEnd.seconds 
						+ "\ntotal seconds are: "+ json.untilGoalEnd.totalSeconds
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
			if(json.statistics.activeGoalUse !== 0 || json.statistics.activeGoalBought !== 0 || json.statistics.activeGoalBoth !==0){
				if(json.statistics.activeGoalUse !== 0){
					var goalType = "use";
					var message = 'Your goal just ended! ' +
								'But, you still get a percentage of points!';
								
								json.statistics.activeGoalUse = 0;
				
				}else if(json.statistics.activeGoalBought !== 0){
					var goalType = "bought";
					var message = 'Your goal just ended! ' +
								'But, you still get a percentage of points!';

								json.statistics.activeGoalBought = 0;
				
				}else if(json.statistics.activeGoalBoth !==0){
					var goalType = "both";
					var message = 'Your goal just ended! ' +
								'But, you still get a percentage of points!';

								json.statistics.activeGoalBoth = 0;
				
				}

				changeGoalStatus(2, goalType, timestampSeconds);
				createNotification(message);

				//place a goal into the goal log
				var startStamp = json.statistics.lastClickStampGoal;
				var actualEnd = timestampSeconds;
				placeGoalIntoLog(startStamp, actualEnd, goalType);
			}
			//keep lastClickStamp up to date while using app
			json.statistics.lastClickStampGoal = timestampSeconds;



				//set local json goal type which is active
				var jsonHandle = "activeGoal" + goalType.charAt(0).toUpperCase() + goalType.slice(1);
				json.statistics[jsonHandle] = 1;
				

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
  $(function() {
	
	var scriptIsRunning;

	//TO DO
	/*
		TIMERS
		-create a "clear timer" link restart timer
		
		USE PAGE
		-limit clicks on did button
			-retrieve timestamp, if it's not 10 seconds different, alert them
		-limit clicks on didnt button 
			-check if >20 have been done in a minute, and then alert them and lock button for 10 seconds
		+avg time between clicks
			-reload on click!
	

		GOALS PAGE
		-add hour selector next to date
		-create statistics:
			-Longest goal completed:
			-Number of Goals completed:
		-create a management system for achieving goals
			-on click of bought or used, check if goal is running with same type
				-if so, give notification that goal timer was reset to zero
			-onload check if goal time is completed
				-if so, ask if they completed their goal (please just do it in goal tab!)
					-on yes, check if there were "i didn't clicks in between.
						-if there were, change goalStatus in local storage
						-else, ask to confirm, like, are you suuuree??
					and insert info into template to populate under timer area
						<div class="goal-success-template">
							<h3>You completed a goal!</h3>
							<p class="goal-date">{[dateCompleted]}</p>
							<p>
								Congrats on waiting {[totalGoalTime]} before {[goalTypeGerund]}.
								Can you wait even longer next time?
							</p>
						</div>
					-on no, increment completed goals by fraction (waitedTime/totalGoalTime)
					and insert info into template to populate under timer area
						<div class="goal-success-template">
							<h3>You almost completed your goal!</h3>
							<p class="goal-date">{[dateEnded]}!</p>
							<p>
								Congrats on waiting {[waitedTime]} before {[goalTypeGerund]}.
								For your next goal, try entering in {[waitedTime + 1 hour]}!
							</p>
						</div>
	*/
	
//MANAGE INACTIVITY!!!	
	var userIsActive = true;
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
							"smokeCounter" : 0,
							"boughtCounter": 0,
							"goalCounter": 0,
							"totalSpent" :   0,
							"spentThisWeek" : 0,
							"spentThisMonth" : 0,
							"spentThisYear" : 0,
							"secondsBetweenSpent": 0,
							"secondsBetweenUse": 0
						},
					"options":
						{
							"activeTab" : "use-content"


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
									var smokeCount = jsonObject.action.filter(function(e){
										return e.clickType == "used";
									});
									json.statistics.smokeCounter = smokeCount.length;
								
								//Restart timer value
								if(smokeCount.length>0){
									var sinceLastUse = smokeCount[smokeCount.length-1].timeStamp;
									restartTimerAtValues("use", sinceLastUse);
								}

								//average time between uses								
									var runningTotalBetweenUses = 0;	
										for(i=1; i< smokeCount.length; i++){
											
											var currTimeBetween = smokeCount[smokeCount.length - i].timeStamp - smokeCount[smokeCount.length - (i+1)].timeStamp;
											runningTotalBetweenUses = runningTotalBetweenUses + currTimeBetween;
											
										}
									var averageTimeBetweenUses = Math.round(runningTotalBetweenUses/(smokeCount.length -1));
									if ($.isNumeric(averageTimeBetweenUses)){
										json.statistics.secondsBetweenUse = averageTimeBetweenUses;
									}
									
									//console.log("secbetuse in retr act table" + json.statistics.secondsBetweenUse);
									
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
									
									
								//avg craves per smoke
									var avgDidntPerDid = Math.round( craveCount.length/smokeCount.length *10) /10;
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
									var sinceLastBought = boughtCount[boughtCount.length-1].timeStamp;
									restartTimerAtValues("bought", sinceLastBought);
								}
								//calculate timestamps for past week
								
									//console.log(boughtCount);
								
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

										if (boughtCount[i].timeStamp > oneWeekAgoTimeStamp){
											//update running week only with timestamps from past week
											runningTotalCostWeek = runningTotalCostWeek + parseInt(boughtCount[i].spent);

										}

										if (boughtCount[i].timeStamp > oneMonthAgoTimeStamp){
											//update any record in last month into running total month
											runningTotalCostMonth = runningTotalCostMonth + parseInt(boughtCount[i].spent);
											
											}
										
										if (boughtCount[i].timeStamp > oneYearAgoTimeStamp){
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

								json.statistics.goalCounter = goalCount.length;

								if(goalCount.length>0){
									var totalSecondsUntilGoalEnd = goalCount[goalCount.length - 1].goalStamp - timeNow;

										loadGoalTimerValues(totalSecondsUntilGoalEnd);
										initiateGoalTimer();	
								}
			}
			function retrieveOptionTable(){
				var currJsonString =  localStorage.esCrave;
				var jsonObject = JSON.parse(currJsonString);

				//set local json from option in local storage
				json.options.activeTab = localStorage.getItem("activeTab");
			}
			
		
		function restrictGoalRange(){

			//adjust goal picker calendar
			$( "#datepicker" ).datepicker({ minDate: 1 });
			
			//use this dynamically with longestGoalCompleted
			//$( ".selector" ).datepicker({ maxDate: 1 });

		}
		restrictGoalRange();
		//INITIALIZE GOAL DATE TIME PICKER
		$( "#datepicker" ).datepicker();


/* CONVERT JSON TO LIVE STATS */
		
		function reloadAverageTimeBetweenUses(){
			//convert total seconds to ddhhmmss
						
						//s
					var currSeconds = json.statistics.secondsBetweenUse % 60;
					if(currSeconds<10){ currSeconds = "0" + currSeconds };
					
					var finalStringStatistic = currSeconds + "s";	
						
					console.log(json.statistics.secondsBetweenUse);
						
						//s	//m
						if (json.statistics.secondsBetweenUse > (60)){
							var currMintues = Math.floor(json.statistics.secondsBetweenUse /(60))%60;
							 if(currMintues<10){ currMintues = "0" + currMintues };
							 
							finalStringStatistic =  currMintues + "<span>m&nbsp;</span>" + finalStringStatistic;

						}
							
							//s //m //h
						if (json.statistics.secondsBetweenUse > (60*60)){
							var currHours = Math.floor(json.statistics.secondsBetweenUse /(60*60))%24;
							if(currHours<10){ currHours = "0" + currHours };
							 
							finalStringStatistic = currHours + "<span>h&nbsp;</span>" + finalStringStatistic;
							//drop seconds
							finalStringStatistic = finalStringStatistic.split("m")[0] + "m";
						}	

							//s //m //h //d
						if (json.statistics.secondsBetweenUse > (60*60*60)){
							finalStringStatistic = Math.floor(json.statistics.secondsBetweenUse /(60*60*24)) + "<span>&nbsp;days&nbsp;&nbsp;</span>" + finalStringStatistic;
							//drop minutes
							finalStringStatistic = finalStringStatistic.split("h")[0] + "h";
						}

						//insert HTML into span place holder
					$("#averageTimeBetweenUses").html(finalStringStatistic);
					
		}
		
	
			if(localStorage.esCrave){
				retrieveActionTable();
				retrieveOptionTable();
			//set stats	
				//set total clicks for each button
				$("#use-total").html(json.statistics.smokeCounter);
				$("#crave-total").html(json.statistics.craveCounter);
				$("#bought-total").html(json.statistics.boughtCounter);
				
				//Average time between uses
				reloadAverageTimeBetweenUses();	
				
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
		if (json.statistics.totalSpent === 0){
			//console.log("total spent is 0: " + json.statistics.totalSpent);
			//toggle all
			$("#cost-content .statistics-recepticle").hide();
			$("#totalAmountSpent").parent().parent().hide();
			$("#spentThisWeek").parent().parent().hide();
			$("#spentThisMonth").parent().parent().hide();
			$("#spentThisYear").parent().parent().hide();

		}else if (json.statistics.spentThisWeek == json.statistics.totalSpent){
			console.log("toggle all but total - spent this week equals total");
			//toggle year month week 
			$("#spentThisWeek").parent().parent().hide();
			$("#spentThisMonth").parent().parent().hide();
			$("#spentThisYear").parent().parent().hide();

		}else if (json.statistics.spentThisMonth == json.statistics.spentThisWeek){
			console.log("toggle all but week - spent this month equals week");
			//toggle year and month
			$("#spentThisMonth").parent().parent().hide();
			$("#spentThisYear").parent().parent().hide();

		}else if (json.statistics.spentThisYear == json.statistics.spentThisMonth){
			console.log("toggle year - spent this year equals month");
			$("#spentThisYear").parent().parent().hide();
		
		}

	}else if(relevantPane == "use-content"){

		if (json.statistics.smokeCounter === 0){
			$("#use-total").hide();
			$("#use-content .timer-recepticle").hide();

		}

		if(json.statistics.secondsBetweenUse === 0){
			$("#averageTimeBetweenUses").parent().hide();

		}

		if (json.statistics.craveCounter === 0){
			$("#crave-total").hide();

		}
		if(json.statistics.craveCounter === 0 || json.statistics.smokeCounter === 0){
			$("#avgDidntPerDid").parent().hide();

		}
		if(json.statistics.cravingsInARow === 0){
			$("#cravingsResistedInARow").parent().hide();

		}

	}else if(relevantPane == "goal-content"){

		if(json.statistics.goalCounter === 0){
			$("#goal-content .timer-recepticle").hide();
			$("#numberOfGoalsCompleted").parent().hide();
			$("#longestGoalCompleted").parent().hide();
		}

		//figure a way to mark goals complete
			//track in clickType:goal records in action table
			//goalStatus: 1 (pending), 2 (partial), 3 (achieved)
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

		if (json.statistics.smokeCounter !== 0){
			$("#use-total").show();
			$("#use-content .timer-recepticle").show();

		}

		if(json.statistics.secondsBetweenUse !== 0){
			$("#averageTimeBetweenUses").parent().show();

		}

		if (json.statistics.craveCounter !== 0){
			$("#crave-total").show();

		}
		if(json.statistics.craveCounter !== 0 && json.statistics.smokeCounter !== 0){
			$("#avgDidntPerDid").parent().show();

		}
		if(json.statistics.cravingsInARow !== 0){
			$("#cravingsResistedInARow").parent().show();

		}

	}else if(relevantPane == "goal-content"){
		console.log("show stats goal tab");
		if(json.statistics.goalCounter !== 0){
			$("#goal-content .timer-recepticle").show();
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

				
					//retrieve table
					var currJsonString =  localStorage.esCrave;
					var jsonObject = JSON.parse(currJsonString);

					//iterate all the records
					var allActionsInTable = jsonObject.action.filter(function(e){
						return e;
					});
					var lastActionStamp = allActionsInTable[allActionsInTable.length - 1].timeStamp;

					//var newActionsTable = allActionsInTable.slice(0, allActionsInTable.length-1);
					
					//console.log(newActionsTable);
					//localStorage.removeItem

					//localStorage.setItem("esCrave.action", JSON.stringify(newActionsTable));
					//remove most recent (last) one

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


			
			//timeStamp, clicktype, spent, goalStamp, goalType
			function updateActionTable(ts, ct, spt, gs, gt){
				var currJsonString =  localStorage.esCrave;
				var jsonObject = JSON.parse(currJsonString);

					ts = ts.toString();
				
				var newRecord;
				
				if(ct == "used" || ct == "craved"){
					newRecord = { timeStamp: ts, clickType: ct };
					
				}else if(ct == "bought"){
					spt = spt.toString();
					newRecord = { timeStamp: ts, clickType: ct, spent: spt};

				}else if (ct == "goal"){
					gs = gs.toString();
					var st = 1;
					newRecord = { timestamp: ts, clickType: ct, goalStamp: gs, goalType: gt, status: st};
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
			//grey out backgeround
			var bodyHeight= $(document).height();
			$("#greyed-out-div").height(bodyHeight);
			$("#greyed-out-div").css("z-index", "10");
			$("#greyed-out-div").animate({opacity: 0.3}, 300);
			$("#greyed-out-div").click(function(){
				if ($("#greyed-out-div").height() > 0){
					
					if(confirm("your data will not be saved, close anyways?")){
						closeClickDialog();
					
					}
				}
			});
			
			
			$(".log-more-info-div").slideToggle("fast");
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
						timerSection = "#use-content";
					
						//update relevant statistics
							json.statistics.craveCounter++;
							$("#crave-total").html(json.statistics.craveCounter);
							updateActionTable(timestampSeconds, "craved");
							
							var currCravingsPerSmokes = Math.round(json.statistics.craveCounter / json.statistics.smokeCounter *10)/10;
							$("#avgDidntPerDid").html(currCravingsPerSmokes);
							
							json.statistics.cravingsInARow++;
							$("#cravingsResistedInARow").html(json.statistics.cravingsInARow);
							
							showActiveStatistics("use-content");
							hideInactiveStatistics("use-content");

						return 0;
						
					}else if(this.id == "smoke-button"){
						//update relevant statistics
							updateActionTable(timestampSeconds, "used");
						
							json.statistics.smokeCounter++;
							$("#use-total").html(json.statistics.smokeCounter);
							//avg between smokes
						
							var currCravingsPerSmokes = Math.round(json.statistics.craveCounter / json.statistics.smokeCounter *10)/10;
							$("#avgDidntPerDid").html(currCravingsPerSmokes);
					
							json.statistics.cravingsInARow = 0;
							$("#cravingsResistedInARow").html(json.statistics.cravingsInARow);
						
							//start timer
							initiateSmokeTimer();	

							adjustFibonacciTimerToBoxes("smoke-timer");
							showActiveStatistics("use-content");
							hideInactiveStatistics("use-content");
							
					}else if(this.id == "bought-button"){
						timerSection = "#cost-content";
						sinceLastAction = "sinceLastBought";
						currTimer = boughtTimer;
						showActiveStatistics("cost-content");
							
						openClickDialog();    
						
					}else if(this.id == "goal-button"){
						timerSection = "#goal-content";
						sinceLastAction = "untilGoalEnd";
						
						openClickDialog();   
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

                if(jsonDaysString > 0) {  
					if($(timerSection + " .fibonacci-timer").is(":hidden")){
						$(timerSection + " .fibonacci-timer").toggle();
					}	
					
                }else if(jsonHoursString > 0) {
					$(timerSection + " .fibonacci-timer").toggle();
					$(timerSection + " .fibonacci-timer .boxes div:first-child").toggle();
					 
				}else if(jsonMinutesString > 0) {
					 $(timerSection + " .fibonacci-timer:first-child").toggle();
					 $(timerSection + " .fibonacci-timer:first-child").toggle();
					
				}
					 
				adjustFibonacciTimerToBoxes("goal-timer");
				/*
				while ($(timerSection + " .boxes div:visible").length > 1 ) {
                    $($(timerSection + " .boxes div:visible")[0]).toggle();
                  }
                */
               

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
							jsonSecondsString=0;
							clearInterval(goalTimer);
							$(timerSection + " .fibonacci-timer").toggle();
					
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
					
					//update display
					json.statistics.boughtCounter++;
					$("#bought-total").html(json.statistics.boughtCounter);
					closeClickDialog();
					
					initiateBoughtTimer();	
					
					adjustFibonacciTimerToBoxes("bought-timer");

					showActiveStatistics("cost-content");
					
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
		
			var timestampSeconds = Math.round(new Date()/1000);
			
			//retrieve chosen date as mm/dd/yyyy
			var requestedGoalEnd = $('#datepicker').datepicker({ dateFormat: 'yy-mm-dd' }).val();
			
			var goalStampSeconds = Math.round(new Date(requestedGoalEnd).getTime() / 1000);
			
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
					//manage those people who just haveta mark neither....


				}
			}
			
			
			
			updateActionTable(timestampSeconds, "goal", "", goalStampSeconds, goalType);
			
			closeClickDialog();
			
			
			//convert goalend to days hours minutes seconds
			var totalSecondsUntilGoalEnd = Math.round(goalStampSeconds - timestampSeconds);
			
			loadGoalTimerValues(totalSecondsUntilGoalEnd);
							
			initiateGoalTimer();	

			showActiveStatistics("goal-content");

			adjustFibonacciTimerToBoxes("goal-timer");
			
		});
		
		


            /*dynamically add boxes 
			
            function addClicked() {
                if ($('.boxes div:visible').length < 4 ) {
                    var numberOfBoxesHidden = $('.boxes div:hidden').length;
                    $($('.boxes div:hidden')[numberOfBoxesHidden - 1]).toggle();
                }
            }
            function removeClicked() {
              if ($('.boxes div:visible').length > 1 ) {
                $($('.boxes div:visible')[0]).toggle();
              }
            }
			*/

        } else {
            //NO LOCAL STORAGE
           alert("This app uses your local storage to store your data. That means we can honestly say we got nothing, if anyone ever demands to see your data. BUT, your browser doesn't support local storage, so your data cannot be saved! You should update your browser or try Chrome, or Firefox!");
        }  


        });
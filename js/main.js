  $(function() {
	
	var scriptIsRunning;

	//TO DO
	/*
		TIMERS
		-create a "clear timer" link restart timer
		
		USE PAGE
		-limit clicks on did button
			-retrieve timestamp, if it's not 10 seconds different, alert them
		-potentially limit clicks on didnt button 
			-check if >20 have been done in a minute, and then alert them and lock button for 10 seconds
		
		GOALS PAGE
		-restart timer on load
		-create a management system for achieving goals
			-maybe a reward or a log?
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
		if (idleTime > 4) { // 5 minutes
			
			userIsActive = false;
			$(this).mousemove(function (e) {
				userIsActive = true;
				window.location.reload();
			});
			$(this).keypress(function (e) {
				userIsActive = true;
				window.location.reload();
				
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
							"totalSpent" :   0,
							"spentThisWeek" : 0,
							"spentThisMonth" : 0,
							"spentThisYear" : 0,
							"secondsBetweenSpent": 0,
							"secondsBetweenUse":0
						}
					
				}
				
				
			function retrieveActionTable(){
				
				//convert localStorage to json
				var currJsonString =  localStorage.actions;
				var jsonObject = JSON.parse(currJsonString);
				
				//retrieve curr date for time relevant stats
				timeNow = Math.round(new Date()/1000);
				
				
						//statistics
							
							//USE
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
									var sinceLastUse = smokeCount[smokeCount.length-1].timeStamp;
									restartTimerAtValues("use", sinceLastUse);
									
								//average time between uses								
									var runningTotalBetweenUses = 0;	
										for(i=1; i< smokeCount.length; i++){
											
											var currTimeBetween = smokeCount[smokeCount.length - i].timeStamp - smokeCount[smokeCount.length - (i+1)].timeStamp;
											runningTotalBetweenUses = runningTotalBetweenUses + currTimeBetween;
											
										}
									var averageTimeBetweenUses = Math.round(runningTotalBetweenUses/(smokeCount.length -1));
										json.statistics.secondsBetweenUse = averageTimeBetweenUses;
									
									
									
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
									var avgCravingsPerSmoke = Math.round( smokeCount.length/craveCount.length *10) /10;
									//don't forget to call updates from clicking smoke and crave button
									$("#avgCravingsPerSmoke").html(avgCravingsPerSmoke);
									
								

								
								//total boughts
									var boughtCount = jsonObject.action.filter(function(e){
										return e.clickType == "bought";
									});
									json.statistics.boughtCounter = boughtCount.length;
									
									
								//Restart timer value
									var sinceLastBought = boughtCount[boughtCount.length-1].timeStamp;
									restartTimerAtValues("bought", sinceLastBought);
										
								//calculate timestamps for past week
								
									//console.log(boughtCount);
								
									var oneWeekAgoTimeStamp = timeNow - (60*60*24*7);
										oneMonthAgoTimeStamp = timeNow - (60*60*24*30),
										oneYearAgoTimeStamp = timeNow - (60*60*24*365);

									var runningTotalCost = 0,
										runningTotalCostWeek = 0,
										runningTotalCostMonth = 0,
										runningTotalCostYear = 0;

									
									for (i = boughtCount.length - 1; i > 0; i--){
										
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

				
			}
			
		
/* CONVERT JSON TO LIVE STATS */
			
		function reloadAverageTimeBetweenUses(){
			//convert total seconds to ddhhmmss
						
						//s
					var currSeconds = json.statistics.secondsBetweenUse % 60;
					if(currSeconds<10){ currSeconds = "0" + currSeconds };
					
					var finalStringStatistic = currSeconds;	
						
						
						//s	//m
						if (json.statistics.secondsBetweenUse > (60)){
							var currMintues = Math.floor(json.statistics.secondsBetweenUse /(60))%60;
							 if(currMintues<10){ currMintues = "0" + currMintues };
							 
							finalStringStatistic =  currMintues + "<span>:</span>" + finalStringStatistic;
						}
							
							//s //m //h
						if (json.statistics.secondsBetweenUse > (60*60)){
							var currHours = Math.floor(json.statistics.secondsBetweenUse /(60*60))%24;
							if(currHours<10){ currHours = "0" + currHours };
							 
							finalStringStatistic = currHours + "<span>:</span>" + finalStringStatistic;
						
						}	

							//s //m //h //d
						if (json.statistics.secondsBetweenUse > (60*60*60)){
							finalStringStatistic = Math.floor(json.statistics.secondsBetweenUse /(60*60*24)) + "<span>&nbsp;days&nbsp;&nbsp;</span>" + finalStringStatistic;
						}	
						
						//insert HTML into span place holder
					$("#averageTimeBetweenUses").html(finalStringStatistic);
					
		}
		
//TOGGLE ANY STATS WHICH ARE NOT ZERO 
function toggleActiveStatistics(){

	//click counters
		//if equals zero toggleOff else toggleOn for following stats
		//$("#bought-total")
		//$("#use-total")
		//$("#crave-total")

	//bought page 
		//if total == 0 toggleOff else toggleOn
		//if week equals total toggleOff else toggleOn 
		//if month equals week toggleOff else toggleOn 
		//if year equals month toggleOff else toggleOn 

	//use page 
		//if average time == 0 (unset) toggleOff else toggleOn
		//if dids/didnts == 0 || infinity toggleOff else toggleOn
		//if dids in a row == 0 toggleOff else toggleOn


}	

		//convert this into a reset button for users
		//localStorage.clear();
		
			
			if(localStorage.actions){
				retrieveActionTable();
				
			//set stats	
				//set total clicks for each button
				$("#use-total").html(json.statistics.smokeCounter);
				$("#crave-total").html(json.statistics.craveCounter);
				$("#bought-total").html(json.statistics.boughtCounter);
				
				//Average time between uses
				reloadAverageTimeBetweenUses();	
				
			}else{
				//replace this with empty action table
				var newJsonString = '{ "action":[]}';
					localStorage.setItem("actions", newJsonString);
			}
			
			
			//timeStamp, clicktype, spent, goalStamp, goalType
			function updateActionTable(ts, ct, spt, gs, gt){
				var currJsonString =  localStorage.actions;
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
					newRecord = {timestamp: ts, clickType: ct, goalStamp: gs, goalType: gt};
				}	
				
					jsonObject["action"].push(newRecord);
					
				var jsonString = JSON.stringify(jsonObject);
					localStorage.actions = jsonString;
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
		
		if(userIsActive && $("#" + relevantPane).css("display") == "block"){
			
			//console.log("fibbo timer readjust fired with timerId = " + timerId);
			
			if($("#" + timerId + " .boxes div:visible").length == 1){
				//adjust .fibonacci-timer to timer height
					document.getElementById(timerId).style.width = "3.3rem";
					document.getElementById(timerId).style.height = "3.3rem";	
			
						
			}else if($("#" + timerId + " .boxes div:visible").length == 2){
				//adjust .fibonacci-timer to timer height
					document.getElementById(timerId).style.width = "6.4rem";
					document.getElementById(timerId).style.height = "3.3rem";
				
						
			}else if($("#" + timerId + " .boxes div:visible").length == 3){
				//adjust .fibonacci-timer to timer height
					document.getElementById(timerId).style.width = "9.4rem";
					document.getElementById(timerId).style.height = "6.4rem";
					
					
			}else if($("#" + timerId + " .boxes div:visible").length == 4){
				//adjust .fibonacci-timer to timer height
					document.getElementById(timerId).style.width = "9.4rem";
					document.getElementById(timerId).style.height = "15.9rem";
		
			}
			document.getElementById(timerId).style.display = "block";
			document.getElementById(timerId).style.margin = "0 auto";
			
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
				adjustFibonacciTimerToBoxes("bought-timer");	
            }

            if(json.untilGoalEnd.totalSeconds == 0){
              $("#goal-content .fibonacci-timer").toggle();

            }else{
                //start timer from json values

            }
			
		
	/*Actions on switch tab */
	$(document).delegate("#cost-tab-toggler", 'click', function(e){
		adjustFibonacciTimerToBoxes("bought-timer");
	});
	$(document).delegate("#use-tab-toggler", 'click', function(e){
		adjustFibonacciTimerToBoxes("smoke-timer");
	});
	$(document).delegate("#goals-tab-toggler", 'click', function(e){
		adjustFibonacciTimerToBoxes("goal-timer");
	});
	
	
	
	
	
		
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
							
							var currCravingsPerSmokes = Math.round(json.statistics.smokeCounter / json.statistics.craveCounter *10)/10;
							$("#avgCravingsPerSmoke").html(currCravingsPerSmokes);
							
							json.statistics.cravingsInARow++;
							$("#cravingsResistedInARow").html(json.statistics.cravingsInARow);
							
						return 0;
						
					}else if(this.id == "smoke-button"){
						//update relevant statistics
							updateActionTable(timestampSeconds, "used");
						
							json.statistics.smokeCounter++;
							$("#use-total").html(json.statistics.smokeCounter);
							//avg between smokes
						
							var currCravingsPerSmokes = Math.round(json.statistics.smokeCounter / json.statistics.craveCounter *10)/10;
							$("#avgCravingsPerSmoke").html(currCravingsPerSmokes);
					
							json.statistics.cravingsInARow = 0;
							$("#cravingsResistedInARow").html(json.statistics.cravingsInARow);
						
							//start timer
							initiateSmokeTimer();	
							adjustFibonacciTimerToBoxes("smoke-timer");
							
							
					}else if(this.id == "bought-button"){
						timerSection = "#cost-content";
						sinceLastAction = "sinceLastBought";
						currTimer = boughtTimer;
						
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
						if($("#use-content .secondsSinceLastClickSpan:first-child").html() == 0){
							$("#use-content .secondsSinceLastClickSpan").parent().toggle();
						}

						if($("#use-content .minutesSinceLastClickSpan:first-child").html() == 0){
							$("#use-content .minutesSinceLastClickSpan").parent().toggle();

						}

						if($("#use-content .hoursSinceLastClickSpan:first-child").html() == 0){
							$("#use-content .hoursSinceLastClickSpan").parent().toggle();
						}

						//this temporarily toggles seconds box
						if($("#use-content .daysSinceLastClickSpan:first-child").html() == 0){
							$("#use-content .daysSinceLastClickSpan").parent().toggle();
						}
						
						adjustFibonacciTimerToBoxes("smoke-timer");	
						

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
						if($("#cost-content .secondsSinceLastClickSpan:first-child").html() == 0){
							$("#cost-content .secondsSinceLastClickSpan").parent().toggle();
						}

						if($("#cost-content .minutesSinceLastClickSpan:first-child").html() == 0){
							$("#cost-content .minutesSinceLastClickSpan").parent().toggle();

						}

						if($("#cost-content .hoursSinceLastClickSpan:first-child").html() == 0){
							$("#cost-content .hoursSinceLastClickSpan").parent().toggle();
						}

						//this temporarily toggles seconds box
						if($("#cost-content .daysSinceLastClickSpan:first-child").html() == 0){
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
	function initiateGoalTimer(timerSection, sinceLastAction, currTimer){


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

					//update spent stats
					
				}
			
		});
			
		//GOAL DIALOG CLICK
		
		$("#goal-content .log-more-info-div button").click(function(){
		
		
					var timestampSeconds = Math.round(new Date()/1000);
					
					
					//retrieve chosen date as mm/dd/yyyy
					var requestedGoalEnd = $('#datepicker').datepicker({ dateFormat: 'yy-mm-dd' }).val();
					
						
					//maybe perform checks if goal is too far forward? perhaps?
					
					
					var goalStampSeconds = Math.round(new Date(requestedGoalEnd).getTime() / 1000);
					
					
					
					var goalType = "";
					/*
					if($("#boughtInput").checked && $("#usedInput").checked){
						//both are checked
						goalType = "both";
					}else{
						if($("#boughtInput").checked){
							goalType = "use";
							
						console.log("got in used box");
						}
						if($("#usedInput").checked){
							goalType = "bought";
							
							 
							console.log("got in bought box");
						}
						console.log("not both checkboxes");
					}
					
					console.log(goalType);
					*/
					
					updateActionTable(timestampSeconds, "goal", "", goalStampSeconds, goalType);
					
					//update display
					
					
					closeClickDialog();
					
					
					
					//convert goalend to days hours minutes seconds
					var totalSecondsUntilGoalEnd = Math.round(goalStampSeconds - timestampSeconds);
					
					
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
					
					
					
					//start timer
						timerSection = "#goal-content";
						sinceLastAction = "untilGoalEnd";
						currTimer = goalTimer;
						
						
					initiateGoalTimer(timerSection, sinceLastAction, currTimer);	
				
			
		});
		
		//INITIALIZE GOAL DATE TIME PICKER
		$( "#datepicker" ).datepicker();


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
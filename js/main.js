  $(function() {
	
	var scriptIsRunning;

	//TO DO
	/*
		TIMERS
		-style labels to be centered
		-style backgtound to fit
		-create a "clear timer" link restart timer
		
		BOUGHT PAGE
		-create dropdown menu on click of bought
			-recalculate stats
				-set json values from localstorage
				-update display values from json
		
		GOALS PAGE
		-create a dropdown on click of set a goal	
			
			<datepicker/>
				if (!goalsInActionTable && dateIsTooFarAway){
					I understand that you want to quit right away, 
					but goals this far in the future tend to be incredibly difficult to achieve,
					without first trying to set a much shorter goal. 
					Maybe try one in within the next week?
					
					restrictCalendarRange();
					
				}else{
					
					start countdown timer
					
					update action table
						convert date to timeStampSeconds = goalStamp
						goal type = Bought || Used || Both
						clickType = "Goal"
						timeStamp = timestampSeconds
						
				}
					
	*/
	
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
							"secondsBetweenSpent": 0,
							"secondsBetweenUse":0
						}
					
				}
				
				
			function retrieveActionTable(){
				
				//convert localStorage to json
				var currJsonString =  localStorage.actions;
				var jsonObject = JSON.parse(currJsonString);

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
									
									
							//cost - complex stats
								//Total Spent
									//handle action[clickType = "bought"]
										//var totalSpent = each value of "spent" added together
										//var firstSpentDate = timestamp from oldest clickType = "bought"
											//var avgPerDay = totalSpent divided by number of days since first bought
											//var avgPerWeek = totalSpent divided by number of weeks since first bought
											//var avgPerMonth = totalSpent divided by number of months since first bought
											
										//var spentToday total where timestamp < one day
										//var spentThisWeek where timestamp < one week
										//var spentThisMonth where timestamp < one month
										
								//average time between purchases
									//retrieve all the time stamps for clicktype: bought 
										//find difference of first and last stamps 
										//divide that by total number of time stamps for clicktype: bought
									
									
							
							//use - complex stats
								//cravings per use
									//json.statistics.craveCounter / json.statistics.smokeCounter
								//average time between uses
									//retrieve all the time stamps for clicktype: use 
										//find difference of first and last stamps 
										//divide that by total number of time stamps for clicktype: use
										
										
										
							//goal 
								//find most recent goalstamp
								//take current timestamp
								//subtract current timestamp from goalend stamp 
									//set equal to json.untilGoalEnd.totalSeconds
										//calculate days hours minutes seconds
										//start goal timer from json
					
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
				var newJsonString = '{ "action":[{"timeStamp": "1508276353", "clickType": "used"}, {"timeStamp": "1508276579", "clickType": "craved"}, {"timeStamp": "1508276596", "clickType": "bought", "spent": "10"}, {"timeStamp": "1508276609", "clickType": "bought", "spent": "15"}, {"timeStamp": "1508277166", "clickType": "goal", "goalStamp": "1508296434", "goalType": "use"}]}';
					localStorage.setItem("actions", newJsonString);
			}
			
			
			//timeStamp, clicktype, spent, goalStamp, goalType
			function updateActionTable(ts, ct, spt, gs, gt){
				var currJsonString =  localStorage.actions;
				var jsonObject = JSON.parse(currJsonString);

					ts = ts.toString();
					
				var newRecord = { timeStamp: ts, clickType: ct };
				
				/*	
				if(ct == "bought"){
					spt = spt.toString();
					newRecord.push(', spent: ' + spt);
				}else if (ct == "goal"){
					gs = gs.toString();
					newRecord.push(', goalStamp: ' + gs + ', goalType: ' + gt);
				}				
				*/	
				
					jsonObject["action"].push(newRecord);
					
				var jsonString = JSON.stringify(jsonObject);
					localStorage.actions = jsonString;
			}
			
			

            //goalStamp generated by datepicker=>timestamp function
            //goalType generated by dropdown options (use, bought, both)

            //if(){

                //overwrite json values with locally stored values


            //}
	
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
						}else{
							newTimerSeconds = newTimerTotalSeconds;
							newTimerMinutes = 0;
						}
					
					//calc hours
						if(newTimerTotalSeconds > (60*60)){
							newTimerMinutes = newTimerMinutes % 60;
							newTimerHours = Math.floor(newTimerTotalSeconds / (60*60));
							
						}else{
							newTimerHours = 0;
						}
						
					//calc days
						if(newTimerTotalSeconds > (60*60*24)){
							newTimerHours = newTimerHours % 24;
							newTimerDays = Math.floor(newTimerTotalSeconds / (60*60*24));
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
					
			}
	

	//readjust timer box to correct size
	function adjustFibonacciTimerToBoxes(){
		if($("#use-content .boxes div:visible").length == 1){
			//adjust .fibonacci-timer to timer height
				document.getElementById("smoke-timer").style.width = "3.3rem";
				document.getElementById("smoke-timer").style.height = "3.3rem";	
		
					
		}else if($("#use-content .boxes div:visible").length == 2){
			//adjust .fibonacci-timer to timer height
				document.getElementById("smoke-timer").style.width = "6.4rem";
				document.getElementById("smoke-timer").style.height = "3.3rem";
			
					
		}else if($("#use-content .boxes div:visible").length == 3){
			//adjust .fibonacci-timer to timer height
				document.getElementById("smoke-timer").style.width = "9.4rem";
				document.getElementById("smoke-timer").style.height = "6.4rem";
				
				
		}else if($("#use-content .boxes div:visible").length == 4){
			//adjust .fibonacci-timer to timer height
				document.getElementById("smoke-timer").style.width = "9.4rem";
				document.getElementById("smoke-timer").style.height = "16.1rem";
	
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
				adjustFibonacciTimerToBoxes();	
            }

            if(json.sinceLastBought.totalSeconds == 0){
              $("#cost-content .fibonacci-timer:first-child").toggle();

            }else{
                //start timer from json values

            }

            if(json.untilGoalEnd.totalSeconds == 0){
              $("#goal-content .fibonacci-timer").toggle();

            }else{
                //start timer from json values

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
					
						//updates
							json.statistics.craveCounter++;
							$("#crave-total").html(json.statistics.craveCounter);
							updateActionTable(timestampSeconds, "craved");
									
							//updateCravingsPerSmokes();
								var currCravingsPerSmokes = Math.round(json.statistics.smokeCounter / json.statistics.craveCounter *10)/10;
								$("#avgCravingsPerSmoke").html(currCravingsPerSmokes);
								
							//increment cravings in a row json and display
								json.statistics.cravingsInARow++;
								$("#cravingsResistedInARow").html(json.statistics.cravingsInARow);
							
						return 0;
						
					}else if(this.id == "smoke-button"){
						//updates
							updateActionTable(timestampSeconds, "used");
						//update display
							//smoke count
								json.statistics.smokeCounter++;
								$("#use-total").html(json.statistics.smokeCounter);
							//avg between smokes
						
						
							//updateCravingsPerSmokes();
									var currCravingsPerSmokes = Math.round(json.statistics.smokeCounter / json.statistics.craveCounter *10)/10;
									$("#avgCravingsPerSmoke").html(currCravingsPerSmokes);
							
							//reset cravings in a row json
								json.statistics.cravingsInARow = 0;
								$("#cravingsResistedInARow").html(json.statistics.cravingsInARow);
							
							
							
							//start timer
								initiateSmokeTimer();	
								adjustFibonacciTimerToBoxes();
							
							
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

			}

		
			
		


		 smokeTimer = setInterval(function() {

		 	//reset local scope vars
            totalSecondsSinceUse++;
            secondsSinceUse++;
            //update json
            json.sinceLastUse.totalSeconds++;
            json.sinceLastUse.seconds++;
            
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
                $("#use-content .minutesSinceLastClickSpan:first-child").html(minutesSinceUse);
                $("#use-content .secondsSinceLastClickSpan:first-child").html(secondsSinceUse);
				
				adjustFibonacciTimerToBoxes();
				
				
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
                $("#use-content .minutesSinceLastClickSpan:first-child").html(minutesSinceUse);
                $("#use-content .hoursSinceLastClickSpan:first-child").html(hoursSinceUse);
				
				
				adjustFibonacciTimerToBoxes();
				
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
					
					console.log("3 visible boxes");
					//adjustFibonacciTimerToBoxes();
						
                }
                $("#use-content .hoursSinceLastClickSpan:first-child").html(hoursSinceUse);
                $("#use-content .daysSinceLastClickSpan:first-child").html(daysSinceUse);
				
				
				
            }
                
           
        
        }, 1000); //end setInterval
            
		 $("#smoke-timer").addClass("counting");
		
	}



	//START BOUGHT TIMER
	function initiateBoughtTimer(){

		var jsonTotalSecondsString = 0,
			jsonSecondsString = 0,
			jsonMinutesString = 0,
			jsonHoursString = 0,
			jsonDaysString = 0;



		clearInterval(boughtTimer);

			
				$("#cost-content .secondsSinceLastClickSpan:first-child").html("0" + jsonSecondsString);
				$("#cost-content .minutesSinceLastClickSpan:first-child").html(jsonMinutesString);
				$("#cost-content .hoursSinceLastClickSpan:first-child").html(jsonHoursString);
				$("#cost-content .daysSinceLastClickSpan:first-child").html(jsonDaysString);

			if(!$("#cost-content .fibonacci-timer").is(':visible')){  
				 $("#cost-content .fibonacci-timer:first-child").toggle();
			}

			while ($("#cost-content .boxes div:visible").length > 1 ) {
				$($("#cost-content .boxes div:visible")[0]).toggle();
			}
			
		 boughtTimer = setInterval(function() {

		 		
                jsonTotalSecondsString++;
                jsonSecondsString++;
                
                if(jsonSecondsString>=10){
                    $("#cost-content .secondsSinceLastClickSpan:first-child").html(jsonSecondsString);
                }else{
                    $("#cost-content .secondsSinceLastClickSpan:first-child").html("0" + jsonSecondsString);
                }
                

                if(jsonSecondsString>=60){
                    jsonSecondsString=0;
                    jsonMinutesString++;
                    if ($("#cost-content .boxes div:visible").length == 1 ) {
                        var numberOfBoxesHidden = $("#cost-content .boxes div:hidden").length;
                        $($("#cost-content .boxes div:hidden")[numberOfBoxesHidden - 1]).toggle();
                    }
                    $("#cost-content .minutesSinceLastClickSpan:first-child").html(jsonMinutesString);
                    $("#cost-content .secondsSinceLastClickSpan:first-child").html(jsonSecondsString);
                }
                if(jsonMinutesString>=60){
                    jsonMinutesString=0;
                    jsonHoursString++;
                    if ($("#cost-content .boxes div:visible").length == 2 ) {
                        var numberOfBoxesHidden = $("#cost-content .boxes div:hidden").length;
                        $($("#cost-content .boxes div:hidden")[numberOfBoxesHidden - 1]).toggle();
                    }
                    $("#cost-content .minutesSinceLastClickSpan:first-child").html(jsonMinutesString);
                    $("#cost-content .hoursSinceLastClickSpan:first-child").html(jsonHoursString);
                }
                if(jsonHoursString>=24){
                    jsonHoursString=0;
                    jsonDaysString++;
                    if ($("#cost-content .boxes div:visible").length == 3 ) {
                        var numberOfBoxesHidden = $('#cost-content .boxes div:hidden').length;
                        $($("#cost-content .boxes div:hidden")[numberOfBoxesHidden - 1]).toggle();
                    }
                    $("#cost-content .hoursSinceLastClickSpan:first-child").html(jsonHoursString);
                    $("#cost-content .daysSinceLastClickSpan:first-child").html(jsonDaysString);
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
					var timestampSeconds = new Date()/1000;
					updateActionTable(timestampSeconds, "bought");
					
					//update display
					json.statistics.boughtCounter++;
					$("#bought-total").html(json.statistics.boughtCounter);
					closeClickDialog();
					
					initiateBoughtTimer();	
				
				}
			
		});
			
		//GOAL DIALOG CLICK
		
		$("#goal-content .log-more-info-div button").click(function(){
		
		
					var timestampSeconds = new Date()/1000;
					
					
					//retrieve chosen date as mm/dd/yyyy
					var requestedGoalEnd = $('#datepicker').datepicker({ dateFormat: 'yy-mm-dd' }).val();
					
						
					//maybe perform checks if goal is too far forward? perhaps?
					
					
					var goalStampSeconds = new Date(requestedGoalEnd).getTime() / 1000;
					
					
					
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
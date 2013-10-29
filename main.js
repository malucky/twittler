$(document).ready(function(){
	window.visitor = 'Mystery Man';
	var prevTweetNum;
	var howManyTweets = 10;
	/* get a tweets */
	// takes a string, who, and an int, index, and returns an object, thisTweet.
	var getATweet = function(user, index) {
		if (user === 'home') {
			return streams.home[index];
		}
		return streams.users[user][index];
	};

	/* construct tweet structure */
	// takes an object, tweet and returns an html node of the tweet.
	var tweetHTML = function(tweet) {
		var $tweetNode = $('<div class="tweet-main clearfix"></div>');
		// user name
		var $tweetUser = $('<p class="tweet-user"></p>');
		$tweetUser.text('@' + tweet.user);
		// timestamp
		var $tweetTime = $('<p class="tweet-time"></p>');
		$tweetTime.text(getFriendlyTime(tweet.created_at));
		// user avatar
		var $tweetAvatar = $('<img class="tweet-avatar"/>');
		$tweetAvatar.attr('src', 'iem_1.png');											/*****need to implement**/
		// tweet message
		var $tweetContent = $('<p class="tweet-message"></p>');
		$tweetContent.text(tweet.message);

		//add children to parent node
		$userAndTime = $('<div class="userAndTime clearfix"></div>');
		$userAndTime.append($tweetUser);
		$userAndTime.append($tweetTime);
		$tweetNode.append($tweetAvatar);
		$tweetNode.append($userAndTime);
		$tweetNode.append($tweetContent);
		return $tweetNode;
	};
	/* display the tweets */
	// takes an int, numOfTweets, a string, user, and a string indicating
	// the node to append to, appendWhere. Append the latest numOfTweets from user onto
	// appendWhere
	var displayTweets = function(numOfTweets, user, appendWhere) {
		var totalTweetsNum;
		if (user === 'home'){
		  totalTweetsNum = streams.home.length;
		  prevTweetNum = totalTweetsNum;
		} else {
		  totalTweetsNum = streams.users[user].length;
		}
		var i = totalTweetsNum;
		var $tweetNode;
		while (--i >= totalTweetsNum - numOfTweets) {	
			$tweetNode = tweetHTML(getATweet(user, i));
			$tweetNode.appendTo(appendWhere);
			$tweetNode.css('display', 'block');
		}
	};
	/* get time of tweet in friendly format */
	// takes a Date and returns a string indicating the time in user-friendly format
	var getFriendlyTime = function(time) {
		var rightNow = Date.now();
		// milliseconds
		var minute = 60 * 1000; 
		var hour = 60 * minute;
		var day = 24 * hour;
		var howLongAgo = rightNow - time.getTime();
		if (howLongAgo < minute) {
			return 'few seconds ago';
		} else if (howLongAgo < hour) {
			return Math.floor(howLongAgo / minute).toString() + ' minutes ago';
		} else if (howLongAgo < day) {
			return Math.floor(howlongAgo / hour).toString() + ' hours ago';
		} else {
			return 'more than a day ago';
		}
	};

	/* refresh tweets */
	var refreshTweets = function(){
		$refreshButton = $('.refreshButton');
		$refreshButton.on('click', 'button', function(){
			var numOfTweets = streams.home.length;
			if (numOfTweets - prevTweetNum > howManyTweets) {
				$('<button class="moreButton" type="button">More!</button>').prependTo('.tweets');
			}
			var newTweetsNum = Math.min(numOfTweets-prevTweetNum, howManyTweets);
			var i = numOfTweets-newTweetsNum - 1;
			var $tweetNode;
			while (i < numOfTweets) {
				$tweetNode = tweetHTML(getATweet('home', i))
				$tweetNode.prependTo('.tweets');
				$tweetNode.css('display','none');
				$tweetNode.slideDown(800);
				i++;
			}
			prevTweetNum = numOfTweets;
		});
	};
	var sendTweet = function(){
	  $('.tweetForm').on('click', 'button', function(){
			var myTweetMessage = $('.myTweet').val();
	  	if (streams.users[visitor] === undefined) {
	  		streams.users[visitor] = [];
	  		users[visitor] = [];
	  	}
	  	if (myTweetMessage.length !== 0){
	  	  writeTweet(myTweetMessage);
	  	  $('.myTweet').val("");
	  	}
	  	/*myTweet.user = myName;
	  	myTweet.message = myTweetMessage;
	  	myTweet.created_at = Date.now();*/
	  });
	};

	/* get user-specific tweets */

	/* display user-specific tweets */

	/* add user information */
	window.setTimeout(function(){
		var myName = window.prompt("What's your name?");
		if (myName) {
			visitor = myName;
		}
		streams.users[visitor] = [];
	},200);

	/* enter tweets */
	displayTweets(howManyTweets, 'home', '.tweets');
	refreshTweets();
	sendTweet();
});
/*
    var $body = $('body');
		var numOfTweets = streams.home.length;
		var $refresh = $('.refreshButton');

		var initTweets = function(){
	      var index = numOfTweets-1;
	  	  while (index >= 0) {
	      	var tweet = streams.home[index];
	    	var $tweet = $('<div class=tweet></div>');
	    	var clicked = false;
	    	$tweet.text(tweet.created_at.toTimeString() + ' @' + tweet.user + ': ' + tweet.message);
	    	$tweet.click(function(){
	      	if (clicked){
			  $(this).children().remove();
	          clicked = false;
            } 
	        else {//show user tweets
              var tweetContent = $(this).text();
   	          var userNameIndex = tweetContent.indexOf('@')+1;
	          var thisUser = tweetContent.slice(userNameIndex, tweetContent.indexOf(':',userNameIndex));
	          i = streams.users[thisUser].length-1;
	          while (i >= 0) {
	            var thisTweet = streams.users[thisUser][i];
	            var $thisTweet = $('<div class=thisUser></div>');
	            $thisTweet.text(">>>>>" + thisTweet.created_at.toTimeString() + ' @' + thisUser + ': ' + thisTweet.message);
	            $(this).append($thisTweet);
		        i--;
  	          }
	          clicked = true;
	        }
        });

	    $tweet.appendTo($body);
    	    index -= 1;
	  }
	}

	var refreshTweets = function(){
	  var appendTweet = function($tweet, tweet) {
	    $tweet.text(tweet.created_at.toTimeString() + ' @' + tweet.user + ': ' + tweet.message);
	  }
	  var $tweet = $('.tweet :first');
	  
	  for (var index = streams.home.length-1; index >= streams.home.length-1 - numOfTweets; index--){
	    appendTweet($tweet, streams.home[index]);
	    $tweet = $tweet.next();
	  }
	}
	$refresh.click(refreshTweets);
	window.setTimeout(initTweets,0);
	window.setInterval(refreshTweets, 20000);
      });
*/
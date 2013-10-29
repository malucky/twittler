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
		var $tweetNode = $('<div class="tweet-main clearfix" data-click="false"></div>');
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
			userSpecificTweet();
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
	  });
	};
	var singleTweetHTML = function(tweet){
		var $tweetNode = $('<div class="tweet-single"></div>'); //parent node
		var $timeNode = $('<p class="tweet-single-time"></p>');
		var $messageNode = $('<p class="tweet-single-message"></p>');
		$timeNode.text(tweet.created_at.toLocaleString());
		$messageNode.text(tweet.message);
		$tweetNode.append($timeNode);
		$tweetNode.append($messageNode);
		return $tweetNode;
	};
	/* get user-specific tweets */
	var userSpecificTweet = function(){
	$thisTweet = $('.tweet-main');
	$thisTweet.on('click', function(){
		var $parentNode = $(this);
		if ($parentNode.attr('data-click') === 'false'){
		var user = $parentNode.find('.tweet-user').text().slice(1);
		var numOfTweets = streams.users[user].length;
		var newTweetsNum = Math.min(numOfTweets, howManyTweets);
		var i = numOfTweets;
		while (--i >= numOfTweets - newTweetsNum) {
			var $tweetNode = singleTweetHTML(getATweet(user, i));
			$tweetNode.appendTo($parentNode);
			$tweetNode.css('display','none');
			$tweetNode.slideDown(400);
			$parentNode.attr('data-click', 'true');
		}
		} else {
			var $singleTweets = $parentNode.find('.tweet-single');
			$singleTweets.slideToggle()
			window.setTimeout(function(){$singleTweets.remove()}, 400);
			$parentNode.attr('data-click', 'false');
		}		
	});
};

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
	userSpecificTweet();
});
      $(document).ready(function(){
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

import {tweetsData} from './data.js';
import { v4 as uuid} from 'https://jspm.dev/uuid'
const tweetInput = document.getElementById('tweet-input');
const tweetsFromLocalStorage = JSON.parse(localStorage.getItem("Tweets"))
let currentTweetData = tweetsData;

if (tweetsFromLocalStorage) {
    currentTweetData = tweetsFromLocalStorage;
    render()
}

document.addEventListener('click', (e) => {
    if (e.target.dataset.like) {
        handleLikes(e.target.dataset.like);
    }
    else if (e.target.dataset.retweet) {
        handleRetweets(e.target.dataset.retweet);
    }
    else if (e.target.dataset.reply) {
        handleReplies(e.target.dataset.reply);
    }
    else if (e.target.id === 'tweet-btn') {
        handleTweetBtn();
    }
    else if (e.target.id === 'delete-btn') {
        handleDeleteBtn();
    }
})

function handleLikes(tweetId) {
    const targetTweetObj = currentTweetData.find((tweet) => {
        return tweetId === tweet.uuid;
    })
    targetTweetObj.isLiked ? targetTweetObj.likes-- : targetTweetObj.likes++;
    targetTweetObj.isLiked = !targetTweetObj.isLiked;
    localStorage.setItem("Tweets", JSON.stringify(currentTweetData))
    render();
}

function handleRetweets(tweetId) {
    const targetRetweetObj = currentTweetData.find((retweet) => {
        return tweetId === retweet.uuid;
    })
    targetRetweetObj.isRetweeted ? targetRetweetObj.retweets-- : targetRetweetObj.retweets++;
    targetRetweetObj.isRetweeted = !targetRetweetObj.isRetweeted;
    localStorage.setItem("Tweets", JSON.stringify(currentTweetData))
    render()
} 

function handleReplies(replyId) {
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden');
}

function handleTweetBtn() {
    
    let newTweet = {
        handle: "@Scrimba",
        profilePic: "./images/userLogo.png",
        likes: 0,
        retweets: 0,
        tweetText: tweetInput.value,
        replies: [],
        isLiked: false,
        isRetweeted: false,
        uuid: uuid()
    }

    if (newTweet.tweetText === '' || "") return;
    
    
    currentTweetData.unshift(newTweet)
    tweetInput.value = '';
    
    localStorage.setItem("Tweets", JSON.stringify(currentTweetData))
    render(currentTweetData)
}

function handleDeleteBtn() {
    currentTweetData.forEach((tweet) => {
        if (tweet.handle === '@Scrimba') {
        currentTweetData.shift(currentTweetData[0])
        localStorage.clear('Tweets')
        }
    })
    render()
}

function getTweetHtml() {
    let tweetFeed = ''
    currentTweetData.forEach((tweet) => {
        
        let likedClass = '';
        let retweetedClass = '';
        
        if (tweet.isLiked) likedClass = 'liked';
        if (tweet.isRetweeted) retweetedClass = 'retweeted';
        
        
        let repliesHtml = '';
        
        if (tweet.replies.length > 0) {
            tweet.replies.forEach((reply) => {
                repliesHtml += `
                <div class="tweet-reply">
                    <div class="tweet-inner">
                        <img src="${reply.profilePic}" class="profile-pic">
                            <div>
                                <p class="handle">${reply.handle}</p>
                                <p class="tweet-text">${reply.tweetText}</p>
                            </div>
                        </div>
                </div>
                `        
            })
        }
        
        tweetFeed += `
        <div class="tweet">
            <div class="tweet-inner">
                <img src="${tweet.profilePic}" class="profile-pic">
                <div>
                    <p class="handle">${tweet.handle}</p>
                    <p class="tweet-text">${tweet.tweetText}</p>
                    <div class="tweet-details">
                        <span class="tweet-detail">
                        <i class="fa-regular fa-comment-dots" data-reply="${tweet.uuid}"></i>
                            ${tweet.replies.length}
                        </span>
                        <span class="tweet-detail">
                        <i class="fa-solid fa-heart ${likedClass}" data-like="${tweet.uuid}"></i>
                            ${tweet.likes}
                        </span>
                        <span class="tweet-detail">
                        <i class="fa-solid fa-retweet ${retweetedClass}" data-retweet="${tweet.uuid}"></i>
                            ${tweet.retweets}
                        </span>
                    </div>   
                </div>            
            </div>
                <div class="hidden" id="replies-${tweet.uuid}">
                        ${repliesHtml}
                </div> 
        </div>
        `
    })
    return tweetFeed;
}

function render() {
    document.getElementById('feed').innerHTML = getTweetHtml();
}

render(currentTweetData);
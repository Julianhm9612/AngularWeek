let refreshButton = document.querySelector('.refresh');
let closeButton1 = document.querySelector('.close1');
let closeButton2 = document.querySelector('.close2');
let closeButton3 = document.querySelector('.close3');

let refreshClickStream = Rx.Observable.fromEvent(refreshButton, 'click');
let close1ClickStream = Rx.Observable.fromEvent(closeButton1, 'click');
let close2ClickStream = Rx.Observable.fromEvent(closeButton2, 'click');
let close3ClickStream = Rx.Observable.fromEvent(closeButton3, 'click');

let requestStream = refreshClickStream.startWith('startup click')
    .map(function() {
        let randomOffset = Math.floor(Math.random()*500);
        return 'https://api.github.com/users?since=' + randomOffset;
    });

let responseStream = requestStream
    .flatMap(function (requestUrl) {
        return Rx.Observable.fromPromise($.getJSON(requestUrl));
    });

function createSuggestionStream(closeClickStream) {
    return closeClickStream.startWith('startup click')
        .combineLatest(responseStream,             
            function(click, listUsers) {
                return listUsers[Math.floor(Math.random()*listUsers.length)];
            }
        )
        .merge(
            refreshClickStream.map(function(){ 
                return null;
            })
        )
        .startWith(null);
}

let suggestion1Stream = createSuggestionStream(close1ClickStream);
let suggestion2Stream = createSuggestionStream(close2ClickStream);
let suggestion3Stream = createSuggestionStream(close3ClickStream);


// Rendering ---------------------------------------------------
function renderSuggestion(suggestedUser, selector) {
    let suggestionEl = document.querySelector(selector);
    if (suggestedUser === null) {
        suggestionEl.style.visibility = 'hidden';
    } else {
        suggestionEl.style.visibility = 'visible';
        let usernameEl = suggestionEl.querySelector('.username');
        usernameEl.href = suggestedUser.html_url;
        usernameEl.textContent = suggestedUser.login;
        let imgEl = suggestionEl.querySelector('img');
        imgEl.src = "";
        imgEl.src = suggestedUser.avatar_url;
    }
}

suggestion1Stream.subscribe(function (suggestedUser) {
    renderSuggestion(suggestedUser, '.suggestion1');
});

suggestion2Stream.subscribe(function (suggestedUser) {
    renderSuggestion(suggestedUser, '.suggestion2');
});

suggestion3Stream.subscribe(function (suggestedUser) {
    renderSuggestion(suggestedUser, '.suggestion3');
});

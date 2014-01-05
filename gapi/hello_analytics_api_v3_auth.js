var clientId = '553727275951-bvuaefdtfejrr7s3hs2dbm048rbrv6o4.apps.googleusercontent.com';
var apiKey = 'AIzaSyBcjyG6tQWgIlPSo_XT5IAMTw_0YM5oEXw';
var scopes = 'https://www.googleapis.com/auth/analytics.readonly';


// This function is called after the Client Library has finished loading
function handleClientLoad() {
    // 1. Set the API Key
    gapi.client.setApiKey(apiKey);

    // 2. Call the function that checks if the user is Authenticated. This is defined in the next section
    window.setTimeout(checkAuth,1);
}


// The checkAuth function calls the Google Accounts Service. The response from the service will be passed back to the handleAuthResult function
function checkAuth() {
    // Call the Google Accounts Service to determine the current user's auth status.
    // Pass the response to the handleAuthResult callback function
    gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, handleAuthResult);
}


// handleAuthResult() will check the response from the Google Accounts service and will determine what to do based on whether the user has or has not authorized acccess
function handleAuthResult(authResult) {
    if (authResult) {
        // The user has authorized access
//DEBUG         alert("you're authorised!");
        // Load the Analytics Client. This function is defined in the next section.
        loadAnalyticsClient();
    }
    else {
//DEBUG         alert("you're NOT authorised!");
        // User has not Authenticated and Authorized
        handleUnAuthorized();
    }
}


// Authorized user
function handleAuthorized() {
    var authorizeButton = document.getElementById('authorize-button');
    var makeApiCallButton = document.getElementById('make-api-call-button');

    // Show the 'Get Visits' button and hide the 'Authorize' button
    makeApiCallButton.style.visibility = '';
    authorizeButton.style.visibility = 'hidden';

    // When the 'Get Visits' button is clicked, call the makeAapiCall function
    makeApiCallButton.onclick = makeApiCall;
}


// Unauthorized user
function handleUnAuthorized() {
    var authorizeButton = document.getElementById('authorize-button');
    var makeApiCallButton = document.getElementById('make-api-call-button');

    // Show the 'Authorize Button' and hide the 'Get Visits' button
    makeApiCallButton.style.visibility = 'hidden';
    authorizeButton.style.visibility = '';

    // When the 'Authorize' button is clicked, call the handleAuthClick function
    authorizeButton.onclick = handleAuthClick;
}


// handleAuthClick() is called when the 'Authorize' button is clicked and will start the auth flow that will ask the user to authenticate and authorize the application
function handleAuthClick(event) {
    gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, handleAuthResult);
    return false;
}


// This will load the Analytics Client and then call the handleAuthorized() function that will update the UI elements and add an onclick event to the "Get Visits" button.
function loadAnalyticsClient() {
    alert("loadAnalyticsClient");
    // Load the Analytics client and set handleAuthorized as the callback function
    gapi.client.load('analytics', 'v3', handleAuthorized);
}

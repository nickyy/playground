// makeApiCall() was set as the function to invoke on the click of the "Get Data" button
function makeApiCall() {
    queryAccounts();
}

function queryAccounts() {
    alert('Querying Accounts.');

    // Get a list of all Google Analytics accounts for this user
    gapi.client.analytics.management.accounts.list().execute(handleAccounts);
}

function handleAccounts(results) {
    if (!results.code) {
        if (results && results.items && results.items.length) {

            // Get the first Google Analytics account
            var firstAccountId = results.items[0].id;
//DEBUG            alert("handleAccounts:firstAccountId = " + firstAccountId);

            // Query for Web Properties
            queryWebproperties(firstAccountId);

        } else {
            alert('No accounts found for this user.')
        }
    } else {
       alert('There was an error querying accounts: ' + results.message);
    }
}

function queryWebproperties(accountId) {
    // Get a list of all the Web Properties for the account
    gapi.client.analytics.management.webproperties.list({'accountId': accountId}).execute(handleWebproperties);
}

function handleWebproperties(results) {
    if (!results.code) {
        if (results && results.items && results.items.length) {

            // Get the first Google Analytics account
            var firstAccountId = results.items[0].accountId;
//DEBUG             alert("handleWebproperties:firstAccountId = " + firstAccountId);
            // Get the first Web Property ID
            var firstWebpropertyId = results.items[0].id;
//DEBUG             alert("handleWebproperties:firstWebpropertyId = " + firstWebpropertyId);

            // Query for Views (Profiles)
            queryProfiles(firstAccountId, firstWebpropertyId);

        } else {
            alert('No webproperties found for this user.');
        }
    } else {
        alert('There was an error querying webproperties: ' + results.message);
    }
}

function queryProfiles(accountId, webpropertyId) {
    // Get a list of all Views (Profiles) for the first Web Property of the first Account
    gapi.client.analytics.management.profiles.list({
        'accountId': accountId,
        'webPropertyId': webpropertyId
    }).execute(handleProfiles);
}

function handleProfiles(results) {
    if (!results.code) {
        if (results && results.items && results.items.length) {

            // Get the first View (Profile) ID
            var firstProfileId = results.items[0].id;
//            alert("handleProfiles:firstProfileId = " + firstProfileId);

            // Step 3. Query the Core Reporting API
            queryCoreReportingApi(firstProfileId);

        } else {
            alert('No views (profiles) found for this user.');
        }
    } else {
        alert('There was an error querying views (profiles): ' + results.message);
    }
}


function queryCoreReportingApi(profileId) {
    // Use the Analytics Service Object to query the Core Reporting API
    gapi.client.analytics.data.ga.get({
        'ids': 'ga:' + profileId,
        'start-date': '2013-01-01',
        'end-date': 'yesterday',
        'metrics': 'ga:visits,ga:pageviews'
    }).execute(handleCoreReportingResults);
}

function handleCoreReportingResults(results) {
    if (results.error) {
        alert('There was an error querying core reporting API: ' + results.message);
    } else {
        printResults(results);
    }
}


// output the results returned from the Core Reporting API
function printResults(results) {
//DEBUG     alert("results.profileInfo.profileName = " + results.profileInfo.profileName);
    if (results.rows && results.rows.length) {
        alert('View (Profile) Name: ' + results.profileInfo.profileName);
        alert('Total ' + results.columnHeaders[0].name + ': ' + results.rows[0][0]);
        alert('Total ' + results.columnHeaders[1].name + ': ' + results.rows[0][1]);
    } else {
        alert('No results found');
    }
}
// Construct the API query and submit it to Analytics engine
function makeApiCall(){
    // Loop through each checked checkbox and add to array
    var d = [];
    $("input:checkbox:checked").each(function(){
        d.push($(this).val());
    });

    // separate each array element with comma
    var dimensions = d.join(',');

    // Get user inputs for view ID, start and end dates
    var viewId = document.getElementById("viewId").value;
    var startDate = document.getElementById("startDate").value;
    var endDate = document.getElementById("endDate").value;
    var apiQuery = gapi.client.analytics.data.ga.get({
        'ids': viewId,
        'start-date': startDate,
        'end-date': endDate,
        'metrics': 'ga:visits',
        'dimensions': dimensions
    });

    // Send the query in!
    apiQuery.execute(handleCoreReportingResults);
}

// Handle response from query
function handleCoreReportingResults(results){
    if (results.error) {
        alert('There was an error querying core reporting API: ' + results.message);
    } else {
        printResults(results);
    }
}

// Construct table with results
function printResults(results){
    if (results.rows && results.rows.length){
        var output = document.getElementById("output");
        output.innerHTML = "";

        var table = $("<table></table>").addClass("outputTable");
        var tableHeader = $("<thead></thead>").addClass("tHeader");
        var tableBody = $("<tbody></tbody>").addClass("tBody");
        var tableFooter = $("<tfoot></tfoot>").addClass("tFooter");
        var numCols = 0;

        // Append <table></table>
        $("#output").append(table);

        /********************* TABLE HEADER *******************/
        // Append <thead></thead>
        table.append(tableHeader);
        var headerRow = $("<tr></tr>").addClass("resultRow");
        tableHeader.append(headerRow);

        // Populate <thead></thead>
        $.each(results.columnHeaders, function(i, val){
            var headerData = $("<th></th>").text(val.name);
            headerRow.append(headerData);
            numCols++;
        });

        /********************* TABLE BODY *******************/
        // Append <tbody></tbody>
        table.append(tableBody);

        // Populate <tbody></tbody>
        $.each(results.rows, function(i2, val2){
            var bodyRow = $("<tr></tr>").addClass("resultRow");
            tableBody.append(bodyRow);
            for (var j=0; j<val2.length; j++){
                var bodyData = $("<td></td>").text(val2[j]);
                bodyRow.append(bodyData);
            }
        });

        /********************* TABLE FOOTER *******************/
        // Append <tfoot></tfoot>
        table.append(tableFooter);
        var footerRow = $("<tr></tr>").addClass("footerResultRow");
        tableFooter.append(footerRow);

        // Populate <tfoot></tfoot>
        var footerData = $("<td></td>").text(results.totalsForAllResults['ga:visits']);
        footerRow.append("<td colspan='" + (numCols - 1) + "'>Total Visits</td>");
        footerRow.append(footerData);
    }
    else {
        output.innerHTML = "No results found";
    }
}

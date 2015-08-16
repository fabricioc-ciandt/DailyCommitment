
var URL_GET = 'http://FabricioLaptop:8087/DailyCommitment/Get';
var URL_POST = 'http://FabricioLaptop:8087/DailyCommitment/Save';

$(document).ready(function () {
    
    bindStaticEvents();

});

// GET
function fetchCommitments() {

    $.ajax({
        url: URL_GET,
        data: {
            team: $('#team-selection').val()
        },
        error: function () {
            $('#error').text('An error has occurred while fetching data.');
        },
        success: function (data) {
            renderCommitments(data);
            bindDynamicEvents();
        },
        type: 'GET'
    });

}

// POST
function saveCommitment(assingeeName) {

    $.ajax({
        url: URL_POST,
        data:
            {
                team: $('#team-selection').val(),
                assignee: assingeeName,
                date: $('#' + assingeeName + 'date').val(),
                story: $('#' + assingeeName + 'story').val(),
                task: $('#' + assingeeName + 'task').val(),
                description: $('#' + assingeeName + 'description').val(),
                commitment: $('#' + assingeeName + 'commitment').val(),
                status: 'In Progress',
            },
        error: function () {
            showMessage('An error has occurred!');
        },
        success: function (data) {
            showMessage('Commitment Set In Progress!');
            checkCommmitments();
        },
        type: 'POST'
    });
}

// POST
function markDoneCommitment(assingeeName) {

    $.ajax({
        url: URL_POST,
        data:
            {
                team: $('#team-selection').val(),
                assignee: assingeeName,
                date: $('#' + assingeeName + 'date').val(),
                story: $('#' + assingeeName + 'story').val(),
                task: $('#' + assingeeName + 'task').val(),
                description: $('#' + assingeeName + 'description').val(),
                commitment: $('#' + assingeeName + 'commitment').val(),
                status: 'Done',
            },
        error: function () {
            showMessage('An error has occurred!');
        },
        success: function (data) {
            $(this).find('input[type="hidden"]').val('Done')
            showMessage('Commitment Completed!');
            checkCommmitments();
        },
        type: 'POST'
    });
}

// Render Ajax Response
function renderCommitments(result) {

    // Clear data before reloading.
    $("#commitments tbody tr").empty();

    $.each(result, function (i, data) {
        var r = "<tr>";

        r += "<td><span>" + data.Assignee + "</span></td>";

        r += "<td>" + "<input id='" + data.Assignee + "date' type='date' value='" + data.Date + "' />"; + "</td>";

        r += "<td>" + "<input id='" + data.Assignee + "story' type='text' value='" + data.Story + "' />"; + "</td>";

        r += "<td>" + "<input id='" + data.Assignee + "task' type='text' value='" + data.Task + "' />"; + "</td>";

        r += "<td>" + "<input id='" + data.Assignee + "description' type='text' class='bigger' value='" + data.Description + "' />"; + "</td>";

        r += "<td>" + buildCommitmentElement(data) + "</td>";

        r += "<td><a  href='#' class='save' id='" + data.Assignee + "' >Set</a> <br/> ";
        r += "<a  href='#' class='done' id='" + data.Assignee + "' >Done</a>";
        r += "<input type='hidden' id='" + data.Assignee + "status' value='" + data.Status + "' />";
        r += "</td>";

        r += "</tr>";

        $("#commitments").append(r);
    })
}

// Build dropdown commitments
function buildCommitmentElement(data) {

    var elm = "<select id='" + data.Assignee + "commitment'>";

    elm += ("<option value='EOM' " + (data.CommitmentAim == "EOM" ? "selected" : "") + " >EOM</option>");
    elm += ("<option value='Noon' " + (data.CommitmentAim == "Noon" ? "selected" : "") + " >Noon</option>");
    //elm += ("<option " + (data.CommitmentAim == "Afternoon" ? "selected" : "") + " >Afternoon</option>");
    elm += ("<option value='EOD' " + (data.CommitmentAim == "EOD" ? "selected" : "") + " >EOD</option>");

    elm += "</select>";

    return elm;
}

// Bind OnClick
function bindDynamicEvents() {
    $('a.save').click(function () {
        saveCommitment($(this).attr('id'));
    });

    $('a.done').click(function () {
        markDoneCommitment($(this).attr('id'));
    });

    checkCommmitments();
}

function bindStaticEvents(){
    // Team Change
    $('#team-selection').change(function(){
        $('#team-title').text($(this).val());
        fetchCommitments();
    });
    $('#team-selection').change();    
}

function onGoingCommitmentCheck(){
    setTimeout(function(){
        checkCommmitments();
    }, 3000);
}

function checkCommmitments(){
    
    resetRowStyle();

    var curTime = getCurrentHour();
    var today = getCurrentDate();

    if (curTime >= 11) {
        //FILTER ALSO BY STATUS, IS COMMITMENT WAS ACHIEVED

        var rows = $('table>tbody>tr>td>select option[value="EOM"]:selected').closest('tr');
        $(rows).each(function(){
            var commitmentDate = $(this).find('input[type="date"]').val();
            var isCommitmentLate = Date.parse(commitmentDate) <= Date.parse(today);
            var isTaskDone = $(this).find('input[type="hidden"]').val() == "Done";

            if (isCommitmentLate) {
                $(this).addClass('late-commitment');
            };
            if (isTaskDone) {
                $(this).addClass('done-commitment');
            };
        });
    }
    if(curTime >= 12){
        //FILTER ALSO BY STATUS, IS COMMITMENT WAS ACHIEVED
        var rows = $('table>tbody>tr>td>select option[value="Noon"]:selected').closest('tr');
        $(rows).each(function(){
            var commitmentDate = $(this).find('input[type="date"]').val();
            var isCommitmentLate = Date.parse(commitmentDate) <= Date.parse(today);
            var isTaskDone = $(this).find('input[type="hidden"]').val() == "Done";

            if (isCommitmentLate) {
                $(this).addClass('late-commitment');
            };
            if (isTaskDone) {
                $(this).addClass('done-commitment');
            };
        });
    } 
    if(curTime >= 16){
        //FILTER ALSO BY STATUS, IS COMMITMENT WAS ACHIEVED
        var rows = $('table>tbody>tr>td>select option[value="EOD"]:selected').closest('tr');
        $(rows).each(function(){
            var commitmentDate = $(this).find('input[type="date"]').val();
            var isCommitmentLate = Date.parse(commitmentDate) <= Date.parse(today);
            var isTaskDone = $(this).find('input[type="hidden"]').val() == "Done";

            if (isCommitmentLate) {
                $(this).addClass('late-commitment');
            };
            if (isTaskDone) {
                $(this).addClass('done-commitment');
            };
        });
    }

    onGoingCommitmentCheck();
}

function getCurrentHour(){
    var now = new Date(Date.now());
    var formatted = (now.getHours().toString());
    return formatted;
}

function getCurrentDate(){
    var now = new Date(Date.now());
    var formatted = (now.getFullYear() + '-' + padDigits(now.getMonth()+1, 2) + '-' + now.getDate());
    return formatted;
}

function padDigits(number, digits) {
    return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
}

function showMessage(msg){
    $('#error').show();
        $('#error').text(msg);
        
        setTimeout(function(){
            $('#error').text('');
            $('#error').hide();
        }, 2000)
}

function resetRowStyle(){
    $("table>tbody>tr").css('background-color', '#005180');
    $("tr").removeClass('late-commitment');
    $("tr").removeClass('done-commitment');
}
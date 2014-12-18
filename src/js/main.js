$(document).ready(function() {
    var model = {};
    model.nfcList = ["nfc_1", "nfc_2"];
    model.connectedJobs = {};
    model.companyJobs = {};
    $.get('/api/job/list', function(data) {
        model.companyJobs = data.queryResult;
        createTable();
    });

    function createTable() {
        var tablecontents = "<table class='table table-header'>";
        tablecontents += "<thead><tr><th>Chip ID</th><th>Job to apply</th></tr></thead>";
        tablecontents += "<tbody>";
        for (var i = 0; i < model.nfcList.length; i++) {
            var nfc_id = model.nfcList[i];
            tablecontents += "<tr>";
            tablecontents += "<td>" + nfc_id + "</td>";
            tablecontents += "<td id='joblink_" + nfc_id + "'>" + createSelect(nfc_id) + "</td>";
            tablecontents += "</tr>";

            $.ajax("/api/apply/" + nfc_id, {
                nfc_id: nfc_id,
                success: function(data) {
                    model.connectedJobs[this.nfc_id] = data;
                    var tdlink = $('#joblink_' + this.nfc_id);
                    var select = tdlink.children('select');
                    //tdlink[0].innerHTML = data.title;
                    select.val(data.job_id);
                    select.on('change', selectChangeHandler);
                }
            });
        }
        tablecontents += "</tbody></table>";
        document.getElementById("tablespace").innerHTML = tablecontents;
    }

    function createSelect(chipId) {
        var html = "<select id='" + chipId + "'><option value='newjob'>=== New job ===</option>";
        for (var i = 0; i < model.companyJobs.length; i++) {
            var job = model.companyJobs[i];
            html += "<option value='" + job.id + "'>" + job.jobTitle + "</option>";
        }
        html += "</select>";
        return html;
    }

    function selectChangeHandler(e) {
        var sel = $(e.target);
        var value = sel.val();
        if (value === "newjob") {
            var dBox = $('<div id="newjobform" title="temp dialog"><form id="new_job_form><fieldset><label for="title">Title</label><input type="text" name="title" id="title" value="" class="text ui-widget-content ui-corner-all"></fieldset></form></div>');
            dBox.dialog({
                "title": "New Job",
                "width": 425,
                "height": 200,
                "minHeight": 200,
                "minWidth": 425,
                "closeOnEscape": false,
                modal: true,
                buttons: {
                    "Create": function(e) {
                        $('#newjobform').submit();
                    }
                }
            });
            $("#newjobform").on("submit", createNewJob);
        } else {
            var saveButton = $(document.createElement('input'));
            saveButton.attr('type', 'button');
            saveButton.attr('value', "Save");
            saveButton.addClass('orangeButton');
            saveButton.click(saveButtonClick);

            var sel = $(e.target);
            saveButton.insertAfter(sel);
        }
    }

    function saveButtonClick(e) {
        $(e.target).remove();
    }

    function createNewJob(event) {
        event.preventDefault();
        console.log("SUBMIT");
        var form = $(event.target).children('form');
        var jobTitle = form.children('input').val();
        $.ajax({
            type: "POST",
            url: "/api/job/new/",
            data: {
                title: jobTitle
            },
            success: function() {
                $(event.target).dialog('close');
            },
            dataType: "json"
        });
    }
});
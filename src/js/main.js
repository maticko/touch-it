$(document).ready(function() {
    var model = {};
    model.nfcList = [];
    model.connectedJobs = {};
    model.companyJobs = {};
    $.get('/api/job/list', function(data) {
        model.companyJobs = data.queryResult;
        loadNFCList();
    });

    function loadNFCList() {
        $.get('/api/nfc/list', function(data) {
            console.log(data);
            model.nfcList = data;
            createTable();
        });
    }

    function createTable() {
        var tablecontents = "<table class='table table-header'>";
        tablecontents += "<thead><tr><th>NFC ID</th><th>Job to apply</th><th style='width: 50px'><th></tr></thead>";
        tablecontents += "<tbody>";
        tablecontents += "</tbody></table>";
        document.getElementById("tablespace").innerHTML = tablecontents;
        var addButton = $(document.createElement('input'));
        addButton.attr('id', "addnfcbutton");
        addButton.attr('type', 'button');
        addButton.attr('value', "Add");
        addButton.addClass('orangeButton bottomButton');
        $('#bottomdiv').append(addButton);
        addButton.click(function() {
            var dBox = $('<div id="newnfcform" title="temp dialog"><form id="new_nfc_form><fieldset><label for="nfcid_input">NFC ID</label><input type="text" name="nfcid_input" id="nfcid_input" value="" class="text ui-widget-content ui-corner-all"></fieldset></form></div>');
            dBox.dialog({
                "title": "New NFC ID",
                "width": 425,
                "height": 200,
                "minHeight": 200,
                "minWidth": 425,
                "closeOnEscape": false,
                modal: true,
                buttons: {
                    "Add": function(e) {
                        $('#newnfcform').submit();
                    }
                }
            });
            $("#newnfcform").on("submit", function(event) {
                event.preventDefault();
                console.log("SUBMIT");
                var form = $(event.target).children('form');
                var nfcid = form.children('input').val();
                $('#newnfcform').dialog('close');
                var tr = createTableRow(nfcid);
                $('table').append(tr);

            });
        });

        for (var i = 0; i < model.nfcList.length; i++) {
            var entry = model.nfcList[i];
            var nfc_id = entry.nfcId;
            var jobId = entry.jobID;
            var tr = createTableRow(nfc_id);
            $('table').append(tr);
            var select = $('#' + nfc_id);
            select.val(jobId);
        }
    }

    function createSelectHTML(chipId) {
        var html = "<select id='" + chipId + "'><option value=''></option><option value='newjob'>=== New job ===</option>";
        for (var i = 0; i < model.companyJobs.length; i++) {
            var job = model.companyJobs[i];
            html += "<option value='" + job.id + "'>" + job.jobTitle + "</option>";
        }
        html += "</select>";
        return html;
    }

    function createSaveButton(chipId) {
        var saveButton = $(document.createElement('input'));
        saveButton.attr('id', "savebutton_" + chipId);
        saveButton.attr('type', 'button');
        saveButton.attr('value', "Save");
        saveButton.addClass('orangeButton');
        saveButton.css('display', 'none');
        saveButton.on("click", {
            id: chipId
        }, saveButtonClick);

        return saveButton;
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
            $("#newjobform").on("submit", {
                id: sel.attr('id')
            }, createNewJob);
        } else {
            var nfcid = sel.attr('id');
            var saveButton = $('#savebutton_' + nfcid);
            saveButton.css('display', 'block');
        }
    }

    function saveButtonClick(e) {
        var sel = $("#" + e.data.id);
        var option = sel.children('option:selected');
        var jobTitle = option.text();
        var jobId = option.val();
        $.ajax({
            type: "PUT",
            url: "/api/nfc/" + e.data.id,
            data: {
                job_id: jobId,
                job_title: jobTitle
            },
            success: function(data) {
                model.nfcList.push(e.data.id);
                model.connectedJobs[e.data.id] = jobId;
                $(e.target).hide();
            },
            dataType: "json"
        });

    }

    function createNewJob(event) {
        event.preventDefault();
        console.log("SUBMIT");
        var form = $(event.target).children('form');
        var jobTitle = form.children('input').val();
        console.log("Create job: " + jobTitle);
        $.ajax({
            type: "POST",
            url: "/api/job/new/",
            data: {
                title: jobTitle
            },
            success: function(data) {
                $(event.target).dialog('close');
                console.log(JSON.stringify(data.result));
                model.companyJobs.push(data);
                model.connectedJobs[event.data.id] = data.result.id;
                $('select').each(function() {
                    var html = $(this)[0].innerHTML;
                    var opt = "<option value='" + data.result.id + "'>" + data.result.jobTitle + "</option>";
                    $(this)[0].innerHTML = html + opt;
                    var nfc_id = $(this).attr('id');
                    $(this).val(model.connectedJobs[nfc_id]);
                });
                $.ajax({
                    type: "PUT",
                    url: "/api/nfc/" + event.data.id,
                    data: {
                        job_id: data.result.id,
                        job_title: data.result.jobTitle
                    },
                    dataType: "json"
                });
            },
            dataType: "json"
        });
    }

    function createTableRow(nfcId) {
        var tr = $(document.createElement('tr'));
        var nfctd = $(document.createElement('td'));
        //nfcId[0].innerHTML = nfcId;
        nfctd.append(nfcId);
        tr.append(nfctd);
        var seltd = $(document.createElement('td'));
        seltd.attr('id', 'joblink_' + nfcId);
        seltd[0].innerHTML = createSelectHTML(nfcId);
        tr.append(seltd);
        var btntd = $(document.createElement('td'));
        btntd.css('width', '50px');
        var saveButton = createSaveButton(nfcId);
        btntd.append(saveButton);
        tr.append(btntd);
        var select = tr.find('select');
        select.on('change', selectChangeHandler);
        return tr;
    }
});
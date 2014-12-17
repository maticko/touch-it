$(document).ready(function() {

    //sample data
    var nfc_data = [{
        nfc_id: "nfc_id",
        job_link: "job link"
    }, {
        nfc_id: "nfc_id_2",
        job_link: "job link 2"
    }];

    var tablecontents = "<table class='table table-header'>";
    tablecontents += "<thead><tr><th>Chip identity</th><th>Connected job link</th><th>Manage</th></tr></thead>";
    tablecontents += "<tbody>";
    for (var i = 0; i < nfc_data.length; i++) {
        var item = nfc_data[i];
        tablecontents += "<tr>";
        tablecontents += "<td>" + item.nfc_id + "</td>";
        tablecontents += "<td id='joblink_" + item.nfc_id + "'>" + item.job_link + "</td>";
        tablecontents += "<td><input type=button data-nfcid='" + item.nfc_id + "' data-request='modify' value='Modify'></td>";
        tablecontents += "</tr>";
    }
    tablecontents += "</tbody></table>";
    document.getElementById("tablespace").innerHTML = tablecontents;

    $('input[type=button]').on('click', function(e) {
        var input = $(e.target);
        var chipId = input.attr('data-nfcid');
        console.log(chipId);
        var requestType = input.attr('data-request');
        var tdlink = $('#joblink_' + chipId);
        //modify
        if (requestType === "modify") {
            var linkValue = tdlink[0].innerHTML;
            tdlink[0].innerHTML = "<input type='text' value='" + linkValue + "'>";
            input.attr('data-request', 'save');
            input.attr('value', "Save");
        }
        //save
        else {
            var linkInput = tdlink.children('input');
            var newValue = linkInput.val();
            tdlink[0].innerHTML = newValue;
            input.attr('data-request', 'modify');
            input.attr('value', "Modify");
        }
    });
});
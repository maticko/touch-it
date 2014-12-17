$(document).ready(function() {

    //sample data
    var nfc_data = [{
        nfc_id: "nfc id",
        job_link: "job link"
    }, {
        nfc_id: "nfc id 2",
        job_link: "job link 2"
    }];

    var tablecontents = "<table>";
    for (var i = 0; i < nfc_data.length; i++) {
        var item = nfc_data[i];
        tablecontents += "<tr>";
        tablecontents += "<td>" + item.nfc_id + "</td>";
        tablecontents += "<td>" + item.job_link + "</td>";
        tablecontents += "<td><input type=button data-nfcid='" + item.nfc_id + "' value='Modify'></td>";
        tablecontents += "</tr>";
    }
    tablecontents += "</table>";
    document.getElementById("tablespace").innerHTML = tablecontents;

    $('input[type=button]').on('click', function(e) {
        var input = $(e.target);
        var chipId = input.attr('data-nfcid');
        console.log(chipId);
    });
});
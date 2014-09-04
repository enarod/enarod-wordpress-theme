var service = new AgreemnetService();
service.getAgreement(<?php echo $id ?>, function (data) {
  $('#agreement-name').html('<div>' + data.Name + '</div>');
  $('#agreement-text').html('<div>' + data.Text + '</div>');
  $('#agreement-stats').html('<div>' + data.NumberOfVotes + '</div>');
});
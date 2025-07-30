function doGet() {
  return HtmlService.createTemplateFromFile('Index').evaluate()
      .setTitle('TCM Recording Generator')
      .setFaviconUrl('https://raw.githubusercontent.com/arjungupta26012002/ExcelerateResources/refs/heads/main/favicon.ico');
}

function generateMessage(formData) {
  var template = HtmlService.createTemplateFromFile('MessageTemplate');

  var selectedDate = new Date(formData.tcmDate);

  var year = selectedDate.getFullYear();
  var month = selectedDate.getMonth();
  var day = selectedDate.getDate();

  var startTimeDummy = new Date(year, month, day, 9, 0); 
  var durationMinutes = parseInt(formData.tcmDuration);
  var endTimeDummy = new Date(startTimeDummy.getTime() + durationMinutes * 60 * 1000);

  var formattedDayName = Utilities.formatDate(selectedDate, "Asia/Kolkata", "EEEE");
  var formattedDatePart = Utilities.formatDate(selectedDate, "Asia/Kolkata", "d'S' MMMM").replace(/(\d)(S)/, function(match, p1) {
      var n = parseInt(p1);
      if (n > 3 && n < 21) return p1 + 'th';
      switch (n % 10) {
        case 1: return p1 + 'st';
        case 2: return p1 + 'nd';
        case 3: return p1 + 'rd';
        default: return p1 + 'th';
      }
  });

  var hours = Math.floor(durationMinutes / 60);
  var minutes = durationMinutes % 60;
  var durationString = '';
  if (hours > 0) {
    durationString += hours + ' hr' + (hours > 1 ? 's' : '');
  }
  if (minutes > 0) {
    durationString += (hours > 0 ? ' ' : '') + minutes + ' min' + (minutes > 1 ? 's' : '');
  }
  if (durationString === '') { 
    durationString = '0 mins';
  }

  var fullDateTimeString = `${formattedDayName}, ${formattedDatePart}`;

  var rawLink = formData.recordingLink;
  var curedLink = rawLink.trim().replace(/\s/g, ''); 

  if (!curedLink.startsWith('http://') && !curedLink.startsWith('https://')) {
    curedLink = 'https://' + curedLink;
  }

  var internshipName = formData.internshipName;
  var weekNumber = formData.week; 

  var fileName = `${internshipName} - Week ${weekNumber} Recording`;

  template.week = formData.week;
  template.internshipName = formData.internshipName;

  template.dateTime = fullDateTimeString;
  template.recordingLink = curedLink; 
  template.fileName = fileName; 
  template.name = formData.name;

  return template.evaluate().getContent();
}

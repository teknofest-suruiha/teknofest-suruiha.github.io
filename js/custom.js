function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}




(function($) {
 

  const url = '../results.json';
  

  var teamMapping = {}
  var teamScores = {}
  var reportScores = [
        {
          "team": "Hadsafha",
          "score": 79.4          
        },
        {
          "team": "İztech Onair",
          "score": 88.6            
        },
        {
          "team": "Test Uçuşu",
          "score": 92            
        },        
        {
          "team": "Vist",
          "score": 90.4            
        }
      ]

  var finalScores = [["Test Uçuşu", 82.885196], ["Vist", 84.728677], ["Hadsafha", 75.141011], ["İztech Onair", 76.667647]]
  $.getJSON(url, function (data) {

      const location = window.location.href;
      var teamWord = "Takım"
      var totalWord = "Toplam"
      var dayWord = "Gün"
      var score = "Skor"
      var area = "Alan"
      var track = "Takip"
      var detection = "Tanıma"
      var reportWord = "Rapor"
      var scenarioKeyword = "Senaryo"
      if(location.includes("index-en")){
          teamWord = "Team"
          totalWord = "Total"
          dayWord = "Day"
          score = "Score"
          area = "Area"
          track = "Tracking"
          detection = "Detection"
          reportWord = "Report"
          scenarioKeyword = "Scenario"
      } 

      $.each(data, function (key, entry) {
        var dayScores = {}
        if( key === 0 ){
          
          $("#results-pills").append('<li class="active"><a href="#day' + (key + 1) + '" data-toggle="tab">' + dayWord + entry.day + '</a></li>');
          $("#results-tab").append('<div role="tabpanel" class="table-responsive tab-pane fade in active" id="day' + (key + 1) + '"><table align="center" class="table-hover table-bordered"><thead><tr><th scope="col">' + teamWord + '</th></tr></thead><tbody></tbody></table></div>');

        }else{
          
          $("#results-pills").append('<li><a href="#day' + (key + 1) + '" data-toggle="tab">' + dayWord + entry.day + '</a></li>');
          $("#results-tab").append('<div role="tabpanel" class="table-responsive tab-pane fade" id="day' + (key + 1) + '"><table align="center" class="table-hover table-bordered"><thead><tr><th scope="col">' + teamWord + '</th></tr></thead><tbody></tbody></table></div>');        
        
        }
        var resultsForDay = entry
        var scenarios = []
        var teams = []

        $.each(entry.scenarios, function (scenarioIndex, scenario) {
          $("#day" + (key + 1) + " table thead tr").append('<th scope="col">' + scenario.name + '</th>');
          $.each(scenario.results, function (resultIndex, result) {
            if (scenarioIndex === 0 ){
                teamMapping[result.team] = resultIndex
                dayScores[result.team] = 0
                $("#day" + (key + 1) + " table tbody").append('<tr id="team' + (resultIndex  + 1)+ '"><th scope="col">' + result.team + '</th></tr>');        
            }
            dayScores[result.team] = dayScores[result.team] + result.score;
            $('#day' + (key + 1) + ' #team' + (teamMapping[result.team] + 1)).append('<td>' + area + ': ' + result.area + ' ' + track + ': ' + result.tracking + ' ' + detection + ': ' + result.detection + ' ' + score + ': ' + round(result.score, 4) + '</td>') 
          })

        });

        $("#day" + (key + 1) + " table thead tr").append('<th scope="col">' + totalWord + '</th>');
        for (var team in dayScores){
          if(!(team in teamScores)){
            teamScores[team] = dayScores[team]
          }else{
            teamScores[team] = teamScores[team] + dayScores[team]
          }
          $('#day' + (key + 1) + ' #team' + (teamMapping[team] + 1)).append('<td>' + score + ': ' + round(dayScores[team], 4) + '</td>') 
        }

      })

      $("#results-pills").append('<li><a href="#total" data-toggle="tab">' + totalWord + '</a></li>');
      $("#results-tab").append('<div role="tabpanel" class="table-responsive tab-pane fade" id="total"><table align="center" class="table-hover table-bordered"><thead><tr><th scope="col">' + teamWord + '</th></tr></thead><tbody></tbody></table></div>');        
      $("#total table thead tr").append('<th scope="col">' + scenarioKeyword + ' ' + totalWord + '</th>');
      $("#total table thead tr").append('<th scope="col">' + reportWord + '</th>');
      $("#total table thead tr").append('<th scope="col"> Final ' + score + '</th>');
      var scores = Object.keys(teamScores).map(function(key) {
        return [key, teamScores[key]];
      });
      // Sort the array based on the second element
      finalScores.sort(function(first, second) {
        return second[1] - first[1];
      });

      for(var pair in finalScores){
        $("#total table tbody").append('<tr id="team' + (teamMapping[finalScores[pair][0]] + 1)+ '"><td scope="col" class="text-center">' + finalScores[pair][0] + '</td></tr>');        

      } 
      for(var pair in scores){
        $('#total #team' + (teamMapping[scores[pair][0]] + 1)).append('<td class="text-center">' + round(scores[pair][1], 4) + '</td>')
      }

      for(var pair in reportScores){
        $('#total #team' + (teamMapping[reportScores[pair].team] + 1)).append('<td class="text-center">' + round(reportScores[pair].score, 4) + '</td>')
      }

      for(var pair in finalScores){
        $('#total #team' + (teamMapping[finalScores[pair][0]] + 1)).append('<td class="text-center">' + round(finalScores[pair][1], 4) + '</td>')
      }


  });



  $(".sidenav a").on('click', function(event) {
    var hash = this.hash;
    if (hash) {
      event.preventDefault();
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 900, function() {
        window.location.hash = hash;
      });
    }

  });

  $(".sidenav a").on('click', function() {
		closeNav();
	});

})(jQuery);

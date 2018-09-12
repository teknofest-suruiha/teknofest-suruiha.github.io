function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}



(function($) {
 

  const url = '../results.json';
  

  var teamMapping = {}
  var teamScores = {}

  
  $.getJSON(url, function (data) {

      const location = window.location.href;
      var teamWord = "Takım"
      var totalWord = "Toplam"
      var dayWord = "Gün"

      if(location.includes("index-en")){
          teamWord = "Team"
          totalWord = "Total"
          dayWord = "Day"
      } 

      $.each(data, function (key, entry) {
        var dayScores = {}
        if( key === 0 ){
          
          $("#results-pills").append('<li class="active"><a href="#day' + (key + 1) + '" data-toggle="tab">' + dayWord + entry.day + '</a></li>');
          $("#results-tab").append('<div role="tabpanel" class="table-responsive tab-pane fade in active" id="day' + (key + 1) + '"><table class="table-hover table-bordered"><thead><tr><th scope="col">' + teamWord + '</th></tr></thead><tbody></tbody></table></div>');

        }else{
          
          $("#results-pills").append('<li><a href="#day' + (key + 1) + '" data-toggle="tab">' + dayWord + entry.day + '</a></li>');
          $("#results-tab").append('<div role="tabpanel" class="table-responsive tab-pane fade" id="day' + (key + 1) + '"><table class="table-hover table-bordered"><thead><tr><th scope="col">' + teamWord + '</th></tr></thead><tbody></tbody></table></div>');        
        
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
            $('#day' + (key + 1) + ' #team' + (teamMapping[result.team] + 1)).append('<td><strong>Skor: ' + result.score + '</strong><img src="' + result.image + '" class="img-thumbnail img-responsive" alt="' + result.team + '-'+ scenario.name + '"></td>') 
          })

        });

        $("#day" + (key + 1) + " table thead tr").append('<th scope="col">' + totalWord + '</th>');
        for (var team in dayScores){
          if(!(team in teamScores)){
            teamScores[team] = dayScores[team]
          }else{
            teamScores[team] = teamScores[team] + dayScores[team]
          }
          $('#day' + (key + 1) + ' #team' + (teamMapping[team] + 1)).append('<td><strong>Skor: ' + dayScores[team] + '</strong></td>') 
        }

      })

      $("#results-pills").append('<li><a href="#total" data-toggle="tab">' + totalWord + '</a></li>');
      $("#results-tab").append('<div role="tabpanel" class="table-responsive tab-pane fade" id="total"><table align="center" class="table-hover table-bordered"><thead><tr><th scope="col">' + teamWord + '</th></tr></thead><tbody></tbody></table></div>');        
      $("#total table thead tr").append('<th scope="col">' + totalWord + '</th>');

      var scores = Object.keys(teamScores).map(function(key) {
        return [key, teamScores[key]];
      });

      // Sort the array based on the second element
      scores.sort(function(first, second) {
        return second[1] - first[1];
      });

      for(var pair in scores){
        $("#total table tbody").append('<tr id="team' + (teamMapping[scores[pair][0]] + 1)+ '"><td scope="col" class="text-center">' + scores[pair][0] + '</td></tr>');        
        $('#total #team' + (teamMapping[scores[pair][0]] + 1)).append('<td class="text-center">' + scores[pair][1] + '</td>') 
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

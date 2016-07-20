(function() {
  
  function filterContent() {
    var filterGroups = [];
    $('[data-filter]').each(function() {
      filter = { name : $(this).attr('data-filter'), values: [] };
      var $filter = $(this);
      if($filter.find(':checked').length) {
        $filter.find(':checked').each(function(){ 
          filter.values.push($(this).val())
        });
      }
      if($filter.find('input:text').length) {
        filter.values.push($filter.find('input:text').val());
      }
      if(filter.values.length) {
        filterGroups.push(filter);
      }
    });
    $('.media-list li').each(function() {
      var row = $(this),
      score = 0;
      row.removeClass('visible');
      filterGroups.forEach(function(filterGroup) {
        // test each filter and make sure the list item applies to both
        var show = false,
        filterJoined = filterGroup.values.join(' ');
        
        if(filterGroup.name == 'search') {
          if(row.text().toLowerCase().indexOf(filterJoined.toLowerCase()) > -1){ 
            show = true;
          }
        } else {
          if(row.attr('data-'+filterGroup.name)){
            var rowFilters = row.attr('data-'+filterGroup.name).split(' ');
            for(var i = 0; i < rowFilters.length && !show; i++){
              var rowFilter = rowFilters[i];
              if(filterJoined.indexOf(rowFilter) > -1) {
                show = true;
              }
            };
          }
        }
        if(show) {
          score++;
        }
      });
      
      // show if it scored success in all the filter groups
      if(score == filterGroups.length) { 
        row.addClass('visible');
      }
    });
    $('.no-results').remove();
    if(!$('.media-list li.visible').length) {
      $('.media-list').after('<div class="no-results">There were no results with the filters you specified</div>');
    }
  }
  
  $('[data-filter] input').on('change keyup', function() {
    filterContent();
  });
  
  $('.clear-filters').on('click', function(e) {
    e.preventDefault();
    // CLEAR THE FILTERS!
    $('[data-filter] :checked').prop('checked','');
    $('[data-filter] :text').val('');
    filterContent();
  })
  
  // When the CTA is clicked, fetch data from chucknorris jokes and populate
  // into the text next door
  $('.cta-quote--button').on('click', function() {
    $.get('http://api.icndb.com/jokes/random', function(data) {
      $('.cta-quote--text').html(data.value.joke);
    }, 'json');
  });
  
})(jQuery);
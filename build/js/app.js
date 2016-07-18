(function() {
  $('[data-filter] input:checkbox').on('change', function() {
    var val = $(this).val(),
    filtered = [],
    filterName = $(this).closest('.filter').attr('data-filter');
    $(this).closest('.options').find(':checkbox:checked').each(function() {
      filtered.push($(this).val());
    });
    $('.media-list-row li').each(function() {
      $(this).hide();
      if(filtered.join(' ').indexOf($(this).attr('data-'+filterName)) === -1) {
        $(this).show();
      }
    });
  });
})(jQuery);
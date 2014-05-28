var data = document.querySelector('.commandBox');
var form = document.querySelector('form');
var results = document.querySelector('.results');

form.addEventListener('submit', function(evt){
  //results.innerHTML = '<p>' + 'This is something...' + '</p>';
  evt.preventDefault();
  reqwest({
    url: '/search',
    type: 'json',
    method:'POST',
    data: {searchInput: data.value}
  })
  .then(function (resp) {
    console.log(resp);
    results.innerHTML = '<p>' + resp + '</p>';
  })
  .fail(function (err, msg) {
    console.warn(err);
    results.innerHTML = '<p>' + err.response + '</p>';
  });
});

// Bumpkit
require.config({
  baseUrl: 'js'
});

require(['bumpkit'], function(bumpkit) {
  console.log('main');
  console.log(bumpkit);
});

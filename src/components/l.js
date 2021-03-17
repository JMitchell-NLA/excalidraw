var passed = responseBody.response+"".toLowerCase().indexOf('thesis') != -1;

if (!passed) {  
 throw 'the word thesis was not in the response'
}


var types = responseBody.response.zone[0].records.work.map(x => {return x.type.toLowerCase().trim();})


types.forEach(y => {
  if(y != "thesis" ){
    throw 'one of the results was not a thesis'
    }
})

// make sure the query that comes out is the same as the query that was passed in.
var query = 'hey'
if(responseBody.response.query != query){
  throw `${responseBody.response.query},${query} response query doesn't match request query`
}



return true;
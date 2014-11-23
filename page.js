/*
$(function() {
    var client = new WindowsAzure.MobileServiceClient('https://bluetracker.azure-mobile.net/', 'TxAUyFMxPNQFYYZbJygdGIlRUieXdW86'),
        todoItemTable = client.getTable('locations');

    // Read current data and rebuild UI.
    // If you plan to generate complex UIs like this, consider using a JavaScript templating library.
    function refreshTodoItems() {
        var query = todoItemTable.where({ complete: false });

        query.read().then(function(todoItems) {
            var listItems = $.map(todoItems, function(item) {
                return $('<li>')
                    .attr('data-todoitem-id', item.id)
                    .append($('<button class="item-delete">Delete</button>'))
                    .append($('<input type="checkbox" class="item-complete">').prop('checked', item.complete))
                    .append($('<div>').append($('<input class="item-text">').val(item.text)));
            });

            $('#todo-items').empty().append(listItems).toggle(listItems.length > 0);
            $('#summary').html('<strong>' + todoItems.length + '</strong> item(s)');
        }, handleError);
    }

    function handleError(error) {
        var text = error + (error.request ? ' - ' + error.request.status : '');
        $('#errorlog').append($('<li>').text(text));
    }

    function getTodoItemId(formElement) {
        return $(formElement).closest('li').attr('data-todoitem-id');
    }

    // Handle insert
    $('#add-item').submit(function(evt) {
        var textbox = $('#new-item-text'),
            itemText = textbox.val();
        if (itemText !== '') {
            todoItemTable.insert({ text: itemText, complete: false }).then(refreshTodoItems, handleError);
        }
        textbox.val('').focus();
        evt.preventDefault();
    });

    // Handle update
    $(document.body).on('change', '.item-text', function() {
        var newText = $(this).val();
        todoItemTable.update({ id: getTodoItemId(this), text: newText }).then(null, handleError);
    });

    $(document.body).on('change', '.item-complete', function() {
        var isComplete = $(this).prop('checked');
        todoItemTable.update({ id: getTodoItemId(this), complete: isComplete }).then(refreshTodoItems, handleError);
    });

    // Handle delete
    $(document.body).on('click', '.item-delete', function () {
        todoItemTable.del({ id: getTodoItemId(this) }).then(refreshTodoItems, handleError);
    });

    // On initial load, start by fetching the current data
    refreshTodoItems();
});
*/

$(function() {
    var client = new WindowsAzure.MobileServiceClient('https://bluetracker.azure-mobile.net/', 'TxAUyFMxPNQFYYZbJygdGIlRUieXdW86'),
    locationTable = client.getTable('locations');

	


function refreshClient() {
		var query = locationTable.where({ mac: 2});
        var latlon = [];
        var clientHistory = L.polyline(
			latlon
		).addTo(map);

query.read().then(function(clientLocations) {
            var listItems = $.map(clientLocations, function(item) {
                        //alert(item.locX);
                        latlon.push([item.locX,item.locY]);
                        clientHistory.setLatLngs(latlon);
                        
               
            });

        }, handleError);
        
        
        
    }
    
    function handleError(error) {
        var text = error + (error.request ? ' - ' + error.request.status : '');
        $('#errorlog').append($('<li>').text(text));
    }

function loadLatest() {


    client.invokeApi("latest", {
        body: null,
        method: "post"
    }).done(function (results) {
        //console.log(results.result[0]);
        var clientMac = results.result[0].mac;
        //console.log(results.result.length);
        var clientCount = 0;
        var loc = [];
//console.log(results.result.length);
                paths.clearLayers();
        while (clientCount < results.result.length) {

//console.log(results.result[clientCount].locX);
//console.log(results.result[clientCount].locY);
var temp = [results.result[clientCount].locX, results.result[clientCount].locY];
//var temp = [10,20];
//console.log(temp);
//loc.push(temp);

                loc.push(temp);
//console.log(clientCount);

            if (results.result[clientCount+1].mac != clientMac)  {

var polygon = L.polyline(loc,{
            color: 'blue',
            weight: 5,
            smoothFactor: 1
            });
            paths.addLayer(polygon);


                            loc = [];

                            clientMac = results.result[clientCount].mac;
            }  

            clientCount = clientCount + 1;
            
            if (clientCount == results.result.length-1) {
                var temp = [results.result[clientCount].locX, results.result[clientCount].locY];
                                loc.push(temp);
                                            var polygon = L.polyline(loc,{
            color: 'blue',
            weight: 5,
            smoothFactor: 1
            });
            paths.addLayer(polygon);

                                            break;
            }
        }

                                map.addLayer(paths);

        
        //var message = results.result.count + " item(s) marked as complete.";
        //results.result[0]


    }, function(error) {
        alert(error.message);
    });

}
    
    $('#buttonLoadLatest').click(function () {
    loadLatest();
});

function get_random_color() 
{
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) 
    {
       color += letters[Math.round(Math.random() * 15)];
    }
return color;
}
var map = L.map('map').setView([42.05345, -87.67274], 19);

		L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
        		//L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
			maxZoom: 22,
			attribution: '<a href="http://mapbox.com">Mapbox</a>',
			id: 'examples.map-i875mjb7'
		}).addTo(map);
        var paths = new L.FeatureGroup();

    
   // loadLatest();
   setInterval(function(){ 
    loadLatest();  
}, 5000);
    
});


	


		

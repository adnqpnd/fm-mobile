'use strict';

angular.module("FMApp.filters",[])

.filter("truckFilter", function ($filter) {
    return function (data,id) {
        console.log(data);
        console.log(id);
        if (angular.isArray(data)) {
            var result = [];
            angular.forEach(data, function(item){
              if (item.truck_id.id === id){
                 result.push(item);
              }
            });
            console.log(result);
            return result;
        } else {
            return data;
        }
    }
});

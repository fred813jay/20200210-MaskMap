
var apiurl={
  data:"https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json",
}

var vm = new Vue({
  el: "#app",
  data: {
    classes: [],
    CountyName: [],
  },
  created: function(){
    $.ajax({
      url: apiurl.data,
      success: function(res){
        vm.classes=JSON.parse(res);
      }
    })
  },
  computed: {
    getCountyName: function(){
      for (let i=0 ; i<=this.classes.length ; i++){
        this.CountyName.push(this.classes["features"][i]["properties"].address)
      }
      console.log(this.CountyName)
    },     
    
  },
})

// vm.classes["features"][0]["properties"].name


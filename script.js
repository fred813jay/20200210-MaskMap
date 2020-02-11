
var apiurl={
  data:"https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json",
}

var vm = new Vue({
  el: "#app",
  data: {
    classes: [],
    CountyName: [],
    ZoneName: []
  },
  mounted: function(){
    $.ajax({
      url: apiurl.data,
      success: function(res){
        vm.classes=JSON.parse(res);
      }
    })
  },
  methods: {
    getCountyName: function(){
      for (var i=0 ; i<this.classes["features"].length ; i++){
        let a = this.classes["features"][i]["properties"].address
        let b = a.replace(/巿/i, '市').replace(/臺/i, '台').replace(/淡/i,'新北市淡')  //更改錯字
        let c = b.indexOf('市')
        let d = b.indexOf('縣')
        if (d == -1){                                       //判斷為市
          var addr = b.substring(c-2,c+1)
        }
        else if (c == -1){                                  //判斷為縣
          var addr = b.substring(d-2,d+1)
        }
        else if (c == -1 && d == -1){                      
          var addr = ""
        }
        let result = this.CountyName.find(function(name, index, array){
          return name === addr;   
        });
        if (result === undefined && addr.length>0){
          this.CountyName.push(addr)
          console.log(i+'  '+addr)
        }

        // 以下為地區
        // let zone = this.classes["features"][i]["properties"].address.substring(3,6)
        // let result1 = this.ZoneName.find(function(name, index, array){
        //   return name === zone;   
        // });   
        // if (result1 === undefined){
        //   this.ZoneName.push(zone)
        // }             
      }
    },     
    
  },
})

// vm.classes["features"][0]["properties"].name


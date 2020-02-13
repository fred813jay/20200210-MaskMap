
var apiurl={
  mask_data:"https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json",
  road_data:"https://raw.githubusercontent.com/donma/TaiwanAddressCityAreaRoadChineseEnglishJSON/master/AllData.json"
}

var vm = new Vue({
  el: "#app",
  data: {
    classes: [],
    Address : [],
    CountyName: [],
    ZoneName: [],
    RoadName: [],
    County: '',
    Zone: ''
        // vm.address[3]["AreaList"][0].AreaName 區域名
        // vm.address[3]["AreaList"][0].RoadList[0].RoadName 路名
  },
  mounted: function(){
    $.ajax({
      url: apiurl.road_data,
      success: function(res){
        var r  = JSON.parse(res)
        for (let i=0 ; i< r.length ; i++){
          if (i == 5 || i == 18){
            continue
          }
          else {
            vm.Address.push(r[i])
          }
        }
        vm.Address.unshift({
          CityName : "請選擇縣市",
          AreaList : {
            [0]: {
              'AreaName' : '請選擇區域名',
              RoadList : {
                [0] : {
                  'RoadName' : '請選擇路名'
                }
              }
            }
          }
        })
        vm.County= "請選擇縣市"
      } 
    })
    $.ajax({
      url: apiurl.mask_data,
      success: function(res){
        var rest = JSON.parse(res)
        for (var i=0 ; i< rest["features"].length ; i++){
          let a = rest["features"][i]["properties"].address
          let b = a.replace(/巿/i, '市')
                   .replace(/台/i, '臺')
                   .replace(/淡/i,'新北市淡')
                   .replace(/桃園縣/i,'桃園市')
                   .replace(/高雄縣/i,'高雄市')
                   .replace(/彰化市/i,'彰化縣彰化市')
                   .replace(/臺南縣/i,'臺南市')
                   .replace(/屏東市/i,'屏東縣屏東市')
                   .replace(/花蓮市/i,'花蓮縣花蓮市')
                   .replace(/台東市/i,'臺東市')  
                   .replace(/950/i,'臺東縣')//更改錯字
          vm.classes.push({
            name : rest["features"][i]["properties"].name,
            address : b,
            phone : rest["features"][i]["properties"].phone,
            mask_adult : rest["features"][i]["properties"].mask_adult,
            mask_child : rest["features"][i]["properties"].mask_child
          })
        }
      },

    })
  },
  watch: {
    County: (NewVal) => {                                 //監看縣市Select
      for (let i=0 ; i< vm.Address.length ; i++){
        let New = vm.Address[i].CityName.indexOf(NewVal)
        if (New == 0){
          vm.ZoneName.length = 0
          for (let y=0 ; y< vm.Address[i]["AreaList"].length ; y++){
            vm.ZoneName.push(vm.Address[i]["AreaList"][y].AreaName)
          }
        }
      }
      vm.ZoneName.unshift("請選擇區域名")
      vm.Zone = "請選擇區域名"
    },
  },
  methods: {
    // getCountyName: function(){
    //   for (var i=0 ; i<this.classes["features"].length ; i++){
    //     let a = this.classes["features"][i]["properties"].address
    //     let b = a.replace(/巿/i, '市').replace(/臺/i, '台').replace(/淡/i,'新北市淡')  //更改錯字
    //     let c = b.indexOf('市')
    //     let d = b.indexOf('縣')
    //     if (d == -1){                                       //判斷為市
    //       var addr = b.substring(c-2,c+1)
    //     }
    //     else if (c == -1){                                  //判斷為縣
    //       var addr = b.substring(d-2,d+1)
    //     }
    //     else if (c == -1 && d == -1){                      
    //       var addr = ""
    //     }
    //     let result = this.CountyName.find(function(name, index, array){
    //       return name === addr;   
    //     });
    //     if (result === undefined && addr.length>0){
    //       this.CountyName.push(addr)
    //       console.log(i+'  '+addr)
    //     }

    //     // 以下為地區
    //     // let zone = this.classes["features"][i]["properties"].address.substring(3,6)
    //     // let result1 = this.ZoneName.find(function(name, index, array){
    //     //   return name === zone;   
    //     // });   
    //     // if (result1 === undefined){
    //     //   this.ZoneName.push(zone)
    //     // }             
    //   }
    //   // if (this.CountyName.length == 0){
    //   //   return
    //   // }
    // },     
    
  },
})

// vm.classes["features"][0]["properties"].name



var apiurl={
  mask_data:"https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json",
  road_data:"https://raw.githubusercontent.com/donma/TaiwanAddressCityAreaRoadChineseEnglishJSON/master/AllData.json"
}

var vm = new Vue({
  el: "#app",
  data: {
    UpdatedTime: '',
    classes: [],
    Address : [],
    CountyName: [],
    ZoneName: [],
    RoadName: [],
    County: '',
    Zone: '',
    Road: '',
  },
  mounted: function(){
    $.ajax({
      url: apiurl.road_data,
      success: function(res){
        var r = JSON.parse(res)
        for (let a=0 ; a< r.length ; a++){
          for (let b=0 ; b< r[a].AreaList.length ; b++){
            for (let c=0 ; c< r[a].AreaList[b].RoadList.length ; c++){
              let d = r[a].AreaList[a].RoadList[c].RoadName.replace(/１/i, '1') 
                                                           .replace(/２/i, '2') 
                                                           .replace(/３/i, '3') 
                                                           .replace(/４/i, '4') 
                                                           .replace(/５/i, '5') 
                                                           .replace(/６/i, '6') 
                                                           .replace(/７/i, '7') 
                                                           .replace(/８/i, '8') 
                                                           .replace(/９/i, '9') 
                                                           .replace(/０/i, '0')
              console.log(d)     
              vm.Address.push({                          ///////改由這裡推陣列
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
            }
          }
        }     
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
          if (a.length == 0){
            continue
          }
          else {
            let b = a.replace(/巿/i, '市')                        //更改錯字
                    .replace(/台/i, '臺')
                    .replace(/淡/i,'新北市淡')
                    .replace(/桃園縣/i,'桃園市')
                    .replace(/高雄縣/i,'高雄市')
                    .replace(/彰化市/i,'彰化縣彰化市')
                    .replace(/臺南縣/i,'臺南市')
                    .replace(/屏東市/i,'屏東縣屏東市')
                    .replace(/花蓮市/i,'花蓮縣花蓮市')
                    .replace(/台東市/i,'臺東市')  
                    .replace(/950/i,'臺東縣') 
            vm.classes.push({
              name : rest["features"][i]["properties"].name,
              address : b,
              phone : rest["features"][i]["properties"].phone,
              mask_adult : rest["features"][i]["properties"].mask_adult,
              mask_child : rest["features"][i]["properties"].mask_child
            })  
            vm.UpdatedTime = rest["features"][i]["properties"].updated   //資料更新時間
          }            
        }
      },

    })
  },
  watch: {
    County: (NewVal) => {                                 //監看縣市Selector
      for (let i=0 ; i< vm.Address.length ; i++){
        let New = vm.Address[i].CityName.indexOf(NewVal)
        if (New == 0){
          vm.ZoneName.length = 0
          vm.RoadName.length = 0
          for (let y=0 ; y< vm.Address[i]["AreaList"].length ; y++){
            vm.ZoneName.push(vm.Address[i]["AreaList"][y].AreaName)
          }
        }
      }
      vm.ZoneName.unshift("請選擇區域名")
      vm.Zone = "請選擇區域名"
      if (vm.RoadName.length < 1){
        vm.RoadName.unshift("請選擇路名")
      }
      vm.Road = "請選擇路名"
    },
    Zone: () => {                                   //監看地區Selector
      for (let i=0 ; i< vm.Address.length ; i++){
        let FindCounty = vm.Address[i].CityName.indexOf(vm.County)
        if (FindCounty == 0 ){
          for (let y=0 ; y< vm.Address[i]["AreaList"].length ; y++){
            let FindZone = vm.Address[i]["AreaList"][y].AreaName.indexOf(vm.Zone)
            if (FindZone == 0){
              vm.RoadName.length = 0
              for (let z=0 ; z< vm.Address[i]["AreaList"][y].RoadList.length ; z++){
                vm.RoadName.push(vm.Address[i]["AreaList"][y].RoadList[z].RoadName)
              }
            }
          }
        }
      }
      if (vm.County !== "請選擇縣市") {
        vm.RoadName.unshift("請選擇路名")        
      }
      vm.Road = "請選擇路名"
    },

  },
  computed: { 
    SearchAddress: function(){
        let a = this.County+this.Zone+this.Road
        let b = ""
        if ( a =="請選擇縣市請選擇區域名請選擇路名" ){
          return b
        }
        else if ( a.indexOf("請選擇區域名") > 0 ){
          return this.County
        }
        else if ( a.indexOf("請選擇路名") > 0 ){
          return this.County+this.Zone
        }
        else {
          return a
        }
    },
    filter_post: function(){
      return this.classes.filter(post => {
        return post.address.includes(this.SearchAddress)
      })
    }

  },

})

// vm.classes["features"][0]["properties"].name

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
const jsonPath = "../data/FishEyeDataFR.json";
var photographers = [0];
var medias = [0];

function GetJsonData(path){
    console.log("path = " + path);
    
    var tempData = JSON.parse(path);
    // console.log("tempData = " + tempData);
    // photographers = tempData[0];
    // medias = tempData[1];
    // console.log("Photographers = " + photographers);
    console.log("Medias = " + medias);
}

GetJsonData(jsonPath);

class Phototo{
    
}
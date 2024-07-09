
const config = require('config.json');
// var fs = require('fs');
// var { readdirSync } = require('fs');
const fs = require('fs').promises;
const path = require('path');

const { Client } = require("basic-ftp") 
const AmbientWeatherApi = require("ambient-weather-api");

const api = new AmbientWeatherApi({
    apiKey: "dc4f47d539594e92b9a7430908a7ce5c19617be05e2940cd8fe3af4add20ceb9",
    applicationKey: 'e1bd181957384fa4ae8e029000322fcc07ca5d2b57b94dc3ab92a747b36e33ec'
  });
module.exports = {
    readWXImgFile,
    latestCam1file,
    latestCam4file,
    getYearList,
    readWeatherData,
    getWeatherTrends
};

// async function readWXImgFile({cameraname, yearNum, monthNum, dayNum, hour }) {
async function readWXImgFile() {
    const client = new Client()
    client.ftp.verbose = true;
    let listData = null;
    try {
        await client.access({
            port: 21,
            host: "iad1-shared-b8-21.dreamhost.com",
            user: "scwxcams",
            password: "Chalet69!",
        })
        // console.log(await client.list())
        const directoryList = await client.list();
        listData = directoryList;
        // await client.uploadFrom("README.md", "README_FTP.md")
        // await client.downloadTo("README_COPY.md", "README_FTP.md")
        // await client.list('/');
    }
    catch(err) {
        console.log(err)
    }
    client.close();
    return listData;
}

async function getYearList() {
    const client = new Client();
    // client.ftp.verbose = true;
    let yearList = null;
    await client.access({
        port: 21,
        host: "denalicams.com",
        user: "wxwebappusr",
        password: "Dr0p!Offs",
    })
    

    // const cam1List = await client.list(`/public_html/cam_images/cam1/`);
    // const cam2List = await client.list('/public_html/cam_images/cam2/');
    // const cam3List = await client.list(`/public_html/cam_images/cam3/`);
    const cam4List = await client.list(`/public_html/cam_images/cam4`);
    return {c4: cam4List};
}

async function latestCam4file() {
    const client = new Client()
    client.ftp.verbose = true;
    let listData = null;
    try {
        await client.access({
            port: 21,
            host: "denalicams.com",
            user: "wxwebappusr",
            password: "Dr0p!Offs",
        })
        const cam4List = await client.list(`/public_html/cam_images/cam4`);
        const yearVal = cam4List[0].name;
        const cam4Months = await client.list(`/public_html/cam_images/cam4/${yearVal}`);
        const dayVal = cam4Months[0].name;
        const cam4Days = await client.list(`/public_html/cam_images/cam4/${yearVal}/${dayVal}`);
        const hourVal = cam4Days[0].name;
        const cam4Hours = await client.list(`/public_html/cam_images/cam4/${yearVal}/${dayVal}/${hourVal}`);
       listData = cam4Hours;
    }
    catch(err) {
        console.log(err)
    }
    client.close();
    return listData;
}

async function latestCam1file() {
    const client = new Client()
    client.ftp.verbose = true;
    let listData = null;
    try {
        await client.access({
            port: 21,
            host: "denalicams.com",
            user: "wxwebappusr",
            password: "Dr0p!Offs",
        })
        const cam1List = await client.list(`/public_html/cam_images/cam1`);
        
        // console.log(await client.list())
        // const nowDate = new Date();
        // const yearNum = nowDate.getFullYear().toString();
        // const monthNum = nowDate.getMonth() + 1;
        // const dateNum = nowDate.getDate();
        // const directoryList = await client.list(`/cam1/${yearNum}/${monthNum.toString().padStart(2, "0")}/${dateNum.toString().padStart(2, "0")}`);
        // let modifyDate = null;
        // let pathName = null;
        // directoryList.map((item, key) => {
        //     const modItemDate = new Date(item.modifiedAt);
        //     if(item.type == 2){
        //         if(key == 0 ){
        //             modifyDate = modItemDate;
        //             pathName = item.name;
        //         }else if(modifyDate.getTime() < modItemDate.getTime()){
        //             modifyDate = modItemDate;
        //             pathName = item.name;
        //         }
        //     }
        // })
        // const fileListArr = await client.list(`/cam1/${yearNum}/${monthNum.toString().padStart(2, "0")}/${dateNum.toString().padStart(2, "0")}/${pathName}`);
        
        // fileListArr.map((fItem, indexKey) => {
        //     if(fItem.type == 1){
        //         if(indexKey == 0){
        //             listData = fItem;
        //         }else if(listData.modifiedAt < fItem.modifiedAt){
        //             listData = fItem;
        //         }
        //     }
        // })
        // if(listData){
        //     const fPath = `/cam1/${yearNum}/${monthNum.toString().padStart(2, "0")}/${dateNum.toString().padStart(2, "0")}/${pathName}/${listData.name}`
        //     await client.downloadTo('/check.jpg', fPath);
        // }
       
    }
    catch(err) {
        console.log(err)
    }
    client.close();
    return listData;
}

async function readWeatherData() {
    
    const devices = await api.userDevices();
    const deviceData = await api.deviceData(devices[0].macAddress, {limit: 1});
    return deviceData;
}

async function getWeatherTrends() {
    const devices = await api.userDevices();
    const deviceData = await api.deviceData(devices[0].macAddress);
    return deviceData;
}
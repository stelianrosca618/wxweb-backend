
const config = require('config.json');
var fs = require('fs');
const { readdirSync } = require('fs');
const { Client } = require("basic-ftp") 
const AmbientWeatherApi = require("ambient-weather-api");

const api = new AmbientWeatherApi({
    apiKey: "dc4f47d539594e92b9a7430908a7ce5c19617be05e2940cd8fe3af4add20ceb9",
    applicationKey: 'e1bd181957384fa4ae8e029000322fcc07ca5d2b57b94dc3ab92a747b36e33ec'
  });
module.exports = {
    readWXImgFile,
    latestCam1file,
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
    client.ftp.verbose = true;
    let yearList = null;
    // await client.access({
    //     port: 21,
    //     host: "iad1-shared-b8-21.dreamhost.com",
    //     user: "scwxcams",
    //     password: "Chalet69!",
    // })
    

    const getDirectories = source =>
    readdirSync(source, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
    const cam1List = await client.list(`/cam1/`);
    const cam2List = await client.list('/cam2/');
    const cam3List = await client.list(`/cam3/`);
    const cam4List = await client.list(`/cam4/`);
    return {c1: cam1List, c2: cam2List, c3: cam3List, c4: cam4List, getDirectories};
}

async function latestCam1file() {
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
        const nowDate = new Date();
        const yearNum = nowDate.getFullYear().toString();
        const monthNum = nowDate.getMonth() + 1;
        const dateNum = nowDate.getDate();
        const directoryList = await client.list(`/cam1/${yearNum}/${monthNum.toString().padStart(2, "0")}/${dateNum.toString().padStart(2, "0")}`);
        let modifyDate = null;
        let pathName = null;
        directoryList.map((item, key) => {
            const modItemDate = new Date(item.modifiedAt);
            if(item.type == 2){
                if(key == 0 ){
                    modifyDate = modItemDate;
                    pathName = item.name;
                }else if(modifyDate.getTime() < modItemDate.getTime()){
                    modifyDate = modItemDate;
                    pathName = item.name;
                }
            }
        })
        const fileListArr = await client.list(`/cam1/${yearNum}/${monthNum.toString().padStart(2, "0")}/${dateNum.toString().padStart(2, "0")}/${pathName}`);
        
        fileListArr.map((fItem, indexKey) => {
            if(fItem.type == 1){
                if(indexKey == 0){
                    listData = fItem;
                }else if(listData.modifiedAt < fItem.modifiedAt){
                    listData = fItem;
                }
            }
        })
        if(listData){
            const fPath = `/cam1/${yearNum}/${monthNum.toString().padStart(2, "0")}/${dateNum.toString().padStart(2, "0")}/${pathName}/${listData.name}`
            await client.downloadTo('/check.jpg', fPath);
        }
        // listData = directoryList;

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
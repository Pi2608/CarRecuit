const currentTime = async()=>{
    var date = new Date();

    date.setHours(date.getHours()+7);

    var dateFormat = date.toISOString().slice(0,19).replace('T',' ');
    
    return dateFormat;
}

module.exports={
    currentTime
}
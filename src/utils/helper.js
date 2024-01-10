

export function timeStamp(record){

    const dateTimeStamp= new Date(record)
    const year = dateTimeStamp.getFullYear();
    const month = String(dateTimeStamp.getMonth() + 1).padStart(2, '0');
    const day = String(dateTimeStamp.getDate()).padStart(2, '0');
    var time = dateTimeStamp.getHours()+":"+dateTimeStamp.getMinutes()// + ":" + dateTimeStamp.getSeconds();
    const simpleDate = `${year}-${month}-${day}`;
    return `${simpleDate} ( ${time} )`
}

export const stringContinuety= (text, i, j)=>{
    var dots = "...";
    if (text.length > j) {
      text = text.substring(i, j) + dots;
      return text
    }else{
      return text
    }
}
export const API_KEY = "AIzaSyASLecrIfT4DD7sSWoy-onF_697zu6gpD4";

export const value_converter = (value)=>{
    if(value>=1000000){
        return Math.floor(value/1000000)+'M';
    }
    else if(value>=1000){
        return Math.floor(value/1000)+'k'
    }
    else{
        return value;
    }
}
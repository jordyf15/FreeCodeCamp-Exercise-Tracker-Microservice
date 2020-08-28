function getExercise(){
    var link='/api/exercise/log?'
    if(document.getElementById('getUserId').value!=""){
        link+="userId="+document.getElementById("getUserId").value;
    }
    if(document.getElementById('getFromDate').value!=""){
        link+="&from="+document.getElementById('getFromDate').value;
    }
    if(document.getElementById('getToDate').value!=""){
        link+="&to="+document.getElementById('getToDate').value;
    }
    if(document.getElementById('getLimit').value!=""){
        link+="&limit="+document.getElementById('getLimit').value;
    }
    console.log(link)
    return link;
}
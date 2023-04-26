function flashMe(data){
    console.log(data);
    if (data.type == 'error') {
        $("#modal-danger").modal('show');
    } else if (data.type == 'success') {
        $("#modal-success").modal('show');
    }else if(data.type == "info"){
        $("#modal-info").modal('show');
    }
}
const socket = io ();
let user;
let chatBox = document.getElementById('chatBox');

Swal.fire({
    title:"Idientificate",
    input:"text",
    text:"Ingresa tu nombre para mostrarlo en el chat",
    inputValidator: (value) => {  //CREA UN MENSAJE SI NO COLOCAS EL USUARIO
        return !value && '!Necesitas escribir un nombre de usuario para continuar!'
    },
    allowOutsideClick:false //Impide salir si das click afuera del aviso
}).then(result=>{
    user=result.value
});


chatBox.addEventListener('keyup',evt=>{
    if(evt.key==="Enter"){
        if(chatBox.value.trim().length>0){
            socket.emit("messageChat", {user:user,message:chatBox.value});
            chatbox.value="";
        }
    }
})

socket.on('messageLogs',data=>{
    let log = document.getElementById('messageLogs');
    let messages = "" ;
    data.forEach(message=>{
        messages = messages+`${message.user} dice; ${message.message}</br>`
    })
    log.innerHTML = messages;
})
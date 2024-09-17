let i, j;
let array_objetos_tiempo="dan_prod_tiem_caj";
let texto_dato_tiempo;
let array_campos=['fecha','referencia','actividad','operario','tiempo'];
let array_datos_tiempo;
let texto_referencia=document.getElementById("textoreferencia");
let texto_actividad=document.getElementById("textoactividad");
let texto_operario=document.getElementById("textooperario");
let select_referencia=document.getElementById("selectreferencia");
let select_actividad=document.getElementById("selectactividad");
let select_operario=document.getElementById("selectoperario");
let tabla_tiempos=document.getElementById("tabladatostiempo");
let body, tblHeader, tblBody, hilera, celda, texto_celda
let registro_nuevo;
let time_running=false, time_pause=false;
let start_time, end_time, calc_time=0;
let end_time_midd, calc_time_midd=0;
let button_start=document.getElementById("starbutton");
let label_datos=document.getElementById("numerodatos");
let number_dates;

actualizar_tabla();

select_referencia.addEventListener("change", function() {
    let indice_select_referencia=select_referencia.selectedIndex;
    texto_referencia.value=select_referencia.options[indice_select_referencia].value;
});

select_actividad.addEventListener("change", function() {
    let indice_select_actividad=select_actividad.selectedIndex;
    texto_actividad.value=select_actividad.options[indice_select_actividad].value;
});

select_operario.addEventListener("change", function() {
    let indice_select_operario=select_operario.selectedIndex;
    texto_operario.value=select_operario.options[indice_select_operario].value;
});

function leer_datos(){
    texto_dato_tiempo=localStorage.getItem(array_objetos_tiempo);
    if(texto_dato_tiempo!=null && texto_dato_tiempo!="null"){ array_datos_tiempo = JSON.parse(texto_dato_tiempo); }
    else{ array_datos_tiempo=[]; }
}

function actualizar_tabla(){
    leer_datos();
    body = document.getElementsByTagName("body")[0];
    tblHeader = document.createElement("thead");
    hilera = document.createElement("tr");
    for(i=0;i<array_campos.length;i++){
        celda = document.createElement("th");
        textoCelda = document.createTextNode(array_campos[i]);
        celda.appendChild(textoCelda);
        hilera.appendChild(celda)
    }
    tblHeader.appendChild(hilera);
    tblBody=document.createElement("tbody");
    number_dates=array_datos_tiempo.length;
    for(i=0;i<number_dates;i++){
        hilera = document.createElement("tr");
        for(j=0;j<array_campos.length;j++){
            celda = document.createElement("td");
            textoCelda = document.createTextNode(array_datos_tiempo[i][array_campos[j]]);
            celda.appendChild(textoCelda);
            hilera.appendChild(celda);
        }
        tblBody.appendChild(hilera);
    }
    tabla_tiempos.replaceChildren();
    tabla_tiempos.appendChild(tblHeader);
    tabla_tiempos.appendChild(tblBody);
    tabla_tiempos.rows[number_dates].cells[0].contentEditable=true;
    tabla_tiempos.rows[number_dates].cells[0].focus();
    body.appendChild(tabla_tiempos);
    label_datos.textContent=number_dates;
}

function run_time(){
    if(time_running){
        if(!time_pause){ 
            end_time=Date.now();
            calc_time=(end_time-start_time)/1000+calc_time_midd;
            calc_time_midd=0;
            start_time=end_time;
            registro_nuevo={};
            registro_nuevo['fecha']=new Date();
            registro_nuevo['referencia']=texto_referencia.value;
            registro_nuevo['actividad']=texto_actividad.value;
            registro_nuevo['operario']=texto_operario.value;
            registro_nuevo['tiempo']=parseFloat(calc_time.toFixed(2));
            array_datos_tiempo.push(registro_nuevo);
            localStorage.setItem(array_objetos_tiempo,JSON.stringify(array_datos_tiempo));
            actualizar_tabla();
        }else{
            start_time=Date.now();
            button_start.value="PARTIAL";
            time_pause=false;
        }
    }else{
        time_running=true;
        start_time=Date.now();
        button_start.value="PARTIAL";
    }
}

function pause_time(){
    if(time_running){
        end_time_midd=Date.now();
        calc_time_midd=(end_time_midd-start_time)/1000;
        button_start.value="RESTART";
        time_pause=true;
    }
}

function stop_time(){
    if(time_running){
        if(!time_pause){ 
            end_time=Date.now();
            calc_time=(end_time-start_time)/1000+calc_time_midd;
        }else{
            calc_time=calc_time_midd;
        }
        registro_nuevo={};
        registro_nuevo['fecha']=new Date();
        registro_nuevo['referencia']=texto_referencia.value;
        registro_nuevo['actividad']=texto_actividad.value;
        registro_nuevo['operario']=texto_operario.value;
        registro_nuevo['tiempo']=parseFloat(calc_time.toFixed(2));
        array_datos_tiempo.push(registro_nuevo);
        localStorage.setItem(array_objetos_tiempo,JSON.stringify(array_datos_tiempo));
        actualizar_tabla();
        time_running=false;
        time_pause=false;
        calc_time_midd=0;
        button_start.value="__RUN__";
    }
}

function return_time(){
    if(time_running){
        actualizar_tabla();
        time_running=false;
        time_pause=false;
        calc_time_midd=0;
        button_start.value="__RUN__";
    }
}

function export_time(){
    time_running=false;
    time_pause=false;
    let fecha_ahora=texto_fecha_ahora();
    let filename="TIEMPO_"+fecha_ahora+'.xlsx';
    let data=[];
    for(i=0;i<array_datos_tiempo.length;i++){
        registro_nuevo={};
        for(j=0;j<array_campos.length;j++){
            registro_nuevo[array_campos[j]]=array_datos_tiempo[i][array_campos[j]]
        }
        data.push(registro_nuevo); 
    }
    let ws = XLSX.utils.json_to_sheet(data);
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SG");
    XLSX.writeFile(wb,filename);
    button_start.value="__RUN__";
}

function delete_time(){
    time_running=false;
    time_pause=false;
    localStorage.setItem(array_objetos_tiempo,null);
    actualizar_tabla(); 
    button_start.value="__RUN__";
}

function texto_fecha_ahora(){
    let fecha_hoy=new Date();
    let t_mes, t_dia, t_hor, t_min, t_seg;
    if((parseInt(fecha_hoy.getMonth())+1)>9){ t_mes=(parseInt(fecha_hoy.getMonth())+1)+""; }
    else{ t_mes = "0" + (parseInt(fecha_hoy.getMonth())+1); }
    if(fecha_hoy.getDate()>9){ t_dia = fecha_hoy.getDate() +""; }
    else{ t_dia = "0" +  fecha_hoy.getDate(); }
    if(fecha_hoy.getHours()>9){ t_hor = fecha_hoy.getHours() +""; }
    else{ t_hor = "0" +  fecha_hoy.getHours(); }
    if(fecha_hoy.getMinutes()>9){ t_min = fecha_hoy.getMinutes() +""; }
    else{ t_min = "0" +  fecha_hoy.getMinutes(); }
    if(fecha_hoy.getSeconds()>9){ t_seg = fecha_hoy.getSeconds() +""; }
    else{ t_seg = "0" +  fecha_hoy.getSeconds(); }
    
    return fecha_hoy.getFullYear() + t_mes + t_dia + t_hor + t_min + t_seg;
}

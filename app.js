const cl = console.log;


const vform = document.getElementById('vform')
const vname = document.getElementById('vname')
const vprice = document.getElementById('vprice')
const vbrand = document.getElementById('vbrand')
const vyear = document.getElementById('vyear')
const vehicleType = document.getElementById('vehicleType')
const addbtn = document.getElementById('addbtn')
const updatebtn = document.getElementById('updatebtn')
const vcontainer = document.getElementById('vcontainer')
const spinner = document.getElementById('spinner')


const Base_url = `https://crud-dfd04-default-rtdb.firebaseio.com/`
const vehicle_url = `${Base_url}vehicle.json`

const state = {
     vehicleArr :[],
     edit_id :null,
}

function objToArr(obj){
    for(const key in obj){
        obj[key].id = key;
        state.vehicleArr.unshift(obj[key])
    }
}

function handleSpinner(flag){
    if(flag){
        spinner.classList.remove('d-none')
    }else{
        spinner.classList.add('d-none')
    }
}

function snackBar(msg,icon){
    Swal.fire({
        title:msg,
        timer:3000,
        icon:icon,
    })
}

function makeApiCall(url,methodName,body=null){
    return fetch(url,{
        method:methodName,
        headers:{
            "Content-Type":"application/json",
            "auth":"JWT token"
        },
        body:body ? JSON.stringify(body) : null
    })
    .then(res=>{
        if(!res.ok){
            throw new Error ()
        }
        return res.json()
    })
}

//read....!


function oncreate(){
    handleSpinner(true)
    makeApiCall(vehicle_url,"GET")
     .then(data =>{
        cl(data)
        objToArr(data)
        templiting(state.vehicleArr)
     })
     .catch(err=>{
        snackBar("something went wrong !!!" , "error")
     })
     .finally(()=>{
        handleSpinner()
     })
}
oncreate()

function templiting(arr){
    let result = ``
    arr.forEach((p,i)=>{
        result += `
                <tr id="${p.id}">
                    <td>${i+1}</td>
                    <td>${p.name}</td>
                    <td>${p.price}</td>
                    <td>${p.brand}</td>
                    <td>${p.year}</td>
                    <td>${p.type}</td>
                    <td><button onclick="onedit(this)" class="btn btn-secondary">Edit</button></td>
                    <td><button onclick="ondelete(this)" class="btn btn-danger">Delete</button></td>
                </tr>`
    })
    vcontainer.innerHTML = result;
}


//create....!

function onAddstd(eve){
     eve.preventDefault();
     let newObj = {
        name:vname.value,
        price:vprice.value,
        brand:vbrand.value,
        year:vyear.value,
        type:vehicleType.value,
     }
     handleSpinner(true)
     makeApiCall(vehicle_url,"POST",newObj)
     .then(res=>{
        cl(res)
        newObj.id = res.name
        state.vehicleArr.unshift(newObj)
        templiting(state.vehicleArr)
        snackBar('New Data Added Successfully !','success')
        vform.reset()
     })
     .catch(err=>{
        snackBar(err,'error')
     })
     .finally(()=>{
        handleSpinner()
     })
}

//edit..!

function onedit(ele){
    let editId = ele.closest('tr').id
    state.edit_id = editId
    let editObj = state.vehicleArr.find(m=>m.id=== editId)

    vname.value = editObj.name,
    vprice.value = editObj.price,
    vbrand.value = editObj.brand,
    vyear.value = editObj.year,
    vehicleType.value = editObj.type
    

    addbtn.classList.add('d-none')
    updatebtn.classList.remove('d-none')

}

function onupdatestd(eve){
    let updateId = state.edit_id;
    let updateUrl = `${Base_url}vehicle/${updateId}.json`
    let updatedObj = {
        name : vname.value,
        price : vprice.value,
        brand : vbrand.value,
        year : vyear.value,
        type : vehicleType.value,
        id: updateId
    }
    handleSpinner(true)
    makeApiCall(updateUrl,"PATCH",updatedObj)
     .then(res=>{
        let getIndex = state.vehicleArr.findIndex(s=> s.id === updateId)
        state.edit_id = null;
        state.vehicleArr[getIndex] = updatedObj;

        templiting(state.vehicleArr)

        updatebtn.classList.add('d-none')
        addbtn.classList.remove('d-none')
        vform.reset()

        snackBar('Updated Successfully !','success')

     })
     .catch(err=>{
        snackBar(err,"error")
     })
     .finally(()=>{
        handleSpinner()
     })
}
//delete....!

function ondelete(ele){
    let removeId = ele.closest('tr').id

     Swal.fire({
  title: "Are you sure?",
  icon: "warning",
  showCancelButton: true,
  
  confirmButtonText: "Yes, Remove it!"
}).then((result) => {
  if (result.isConfirmed) {
    handleSpinner(true)
    let removeUrl= `${Base_url}vehicle/${removeId}.json`
    makeApiCall(removeUrl,"DELETE")
     .then(res =>{
        let getIndex = state.vehicleArr.findIndex(t=> t.id === removeId)
        state.vehicleArr.splice(getIndex,1)
        ele.closest('tr').remove()

        let td = [...document.querySelectorAll("#vcontainer tr td:first-child")];
                       td.forEach((td,i)=>{
                        td.innerHTML = i+1
                       })
        snackBar(`The Data Removed Successfully !!!`,'success')
     })
     .catch(err=>{
        snackBar(err,'error')
     })
     .finally(()=>{
        handleSpinner()
     })
  }
  })
}

vform.addEventListener("submit",onAddstd)
updatebtn.addEventListener("click",onupdatestd)
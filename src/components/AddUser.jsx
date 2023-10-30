import React from 'react';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Email } from "@mui/icons-material";
import { FileUpload } from 'primereact/fileupload';
import  { useState,useRef,useEffect} from 'react';
import {adduser,getuser } from "../services/ApiService";
import { Toast } from 'primereact/toast';



const AddUser = ({showAddUsersDialog,setshowAddUsersDialog}) => {
  const toast = useRef(null);
  const [users,setUsers]=useState([])

  const [first_name, setfirst_name] = useState('');
  const [Adress, setAdress] = useState('');
  const [Phone_Number, setPhone_Number] = useState('');
  const [username, setusername] = useState('');
  const [last_name, setlast_name] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState('');


  const hideDialogshowuser = () => {
    setshowAddUsersDialog(false);
  };
  
  const handleAddSubmit =async(e)=>{
    e.preventDefault();
    
    const user={first_name,last_name,email,Adress,Phone_Number,username,image}
console.log  (user)  
 await adduser(user)
 .then(res=>{
  setUsers(res)
 })


    hideDialogshowuser()


  }


  const productDialogFooter = (
    <React.Fragment>
        <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialogshowuser} />
        <Button label="Save" type='submit' icon="pi pi-check"  />
    </React.Fragment>
);
  return (
    <Dialog visible={showAddUsersDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="User Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialogshowuser}>
                  {/* <img className="product-image block m-auto pb-3" /> */}
                <form onSubmit={handleAddSubmit}> 
                  <div className="field">
                      <label htmlFor="name"  className="font-bold">
                          First Name 
                      </label>
                      <InputText id="   First Name " value={first_name} name='first_name' onChange={(e) => setfirst_name(e.target.value)} required autoFocus  />
                      
                  </div>
                  <div className="field">
                      <label htmlFor="Last Name" className="font-bold">
                          Last Name
                      </label>
                      <InputText id="Last Name" value={last_name} name='last_name'  required rows={3} cols={20} onChange={(e) => setlast_name(e.target.value)} />
                  </div>
                  <div className="field">
                      <label htmlFor="email"  className="font-bold" >
                        Email
                      </label>
                      <InputText id="email" name='email' value={email} type={Email} required rows={3} cols={20} onChange={(e) => setEmail(e.target.value)} />
                  </div>


                  <div className="field">
                    <label htmlFor="Adress" className="font-bold">
                       Adress
                      </label>
                          <InputText id="Adress" name='Adress' value={Adress}   onChange={(e) => setAdress(e.target.value)} />
                  </div>
    
                  <div className="formgrid grid">
                      <div className="field col">
                          <label htmlFor="Phone" className="font-bold">
                              Phone
                          </label>
                          <InputNumber id="Phone" name='Phone_Number' value={Phone_Number} onChange={(e) => setPhone_Number(e.target.value)}   />
                      </div>
                      <div className="field col">
                      <label htmlFor="username" className="font-bold">
                        username
                          </label>
                          <InputText id="username" value={username} name='username'  onChange={(e) => setusername(e.target.value)} />
        
                      </div>
                      <div className="field col">
                      <label htmlFor="Image" className="font-bold">
                        Image
                          </label>
                          <input type='file' id="Image"  name='Image'  onChange={(e) => setImage(e.target.value)} />
        
                      </div>
                  </div>

                
                  <div>                    <Button label="Save" type='submit' icon="pi pi-check"  />
</div>


                    <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialogshowuser} />
  
                  
                  </form> 
                  <Toast ref={toast} />

              </Dialog>
  );
}

export default AddUser;

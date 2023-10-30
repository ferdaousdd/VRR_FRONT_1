import React from "react";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { Helmet } from "react-helmet-async";
import { Panel } from "primereact/panel";
import { Password } from 'primereact/password';
import axios from 'axios';

//core
// import { useSelector } from 'react-redux';
// import { selectUserInfo } from '../../features/userSlice';
import { useUpdateUsersMutation } from '../../services/userAuthApi';
import { useDeleteUserMutation } from '../../services/userAuthApi';
import "primereact/resources/primereact.min.css";
//icons
import { getToken } from '../../services/LocalStorageService';
import { useRegisterUserMutation } from '../../services/userAuthApi'
import { classNames } from 'primereact/utils';
import "primeicons/primeicons.css";
import { Box, useTheme,Avatar } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { userSlice } from '../../features/userSlice';
import "primeflex/primeflex.css";
import { Email } from "@mui/icons-material";

const Contacts = () => {
  // const userInfo = useSelector(selectUserInfo);
  const [showEdituserDialog, setshowEdituserDialog] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [users, setUsers] = useState([]);
  const [showAddUsersDialog, setshowAddUsersDialog] = useState(false);
  // const userInfo = useSelector(userSlice);
  const [SelectedEditData, setSelectedEditData] = useState("");
  const rows = [];
  const [Data, setData] = useState(null);
  const [server_error, setServerError] = useState({})
  const { access_token } = getToken()
  const [DeleteUser, { isLoading }] = useDeleteUserMutation()
  const [UpdateUsers] = useUpdateUsersMutation()

  useEffect(() => {

    const fetchUserData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/user/All_user/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization':`Bearer ${access_token}`
          }

        });
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.log(error);
      }
    }
    
    // console.log(userInfo);

    fetchUserData();
  }, []);


  for (let i = 0; i < users.length; i++) {
    rows.push({
      id: users[i].id,
      image:users[i].image,
      first_name: users[i].first_name,
      last_name: users[i].last_name,
      username: users[i].username,
      email: users[i].email,
      Phone_Number: users[i].phone_number,
      Adress: users[i].address,
    });
  }
  const [userData, setUserData] = useState({
    first_name:'',
    last_name:'',
    email: '',
    address:'',
    password:'',
    password_confirmation:'',
    username:'',
    image:'',
    phone_number:'',

})

const [userEditData, setUserEditData] = useState({})




// const [registerUser] = useRegisterUserMutation()


// const handleChange = (e) => {
//   const { name, value } = e.target;
//   if (e.target.type === 'file') {
//   setUserData((prevState) => ({
//   ...prevState,
//   image: e.target.files[0],
//   }));
//   } else {
//   setUserData((prevState) => ({
//   ...prevState,
//   [name]: value,
//   }));
//   }
//   };

const handleChange = (e) => {
  const { name, value } = e.target;
  if (e.target.type === 'file') {
    setUserData((prevState) => ({
      ...prevState,
      image: e.target.files[0],
      // ajouter le nom du fichier sans l'URL encodée
      image_url: e.target.files[0] ? e.target.files[0].name : '',
    }));
  } else {
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }
};

// const handleChange = (e) => {
//   const { name, value, files } = e.target;
//   if (name === "image" && files) {
//     const file = files[0];
//     const imageUrl = URL.createObjectURL(file);
//     const imagePath = imageUrl.split("/").pop();
//     setUserData((prevState) => ({ ...prevState, image: file, imagePath }));
//   } else {
//     setUserData((prevState) => ({ ...prevState, [name]: value }));
//   }
// };



const handleChanges = (e) => {
  const { name, value } = e.target;
  setUserEditData((prevState) => ({
      ...prevState,
      [name]: value,
  }));
};




const handleShow = async () => {
  const formData = new FormData();
  formData.append('first_name', userData.first_name);
  formData.append('last_name', userData.last_name);
  formData.append('email', userData.email);
  formData.append('address', userData.address);
  formData.append('password', userData.password);
  formData.append('password_confirmation', userData.password_confirmation);
  formData.append('username', userData.username);
  formData.append('phone_number', userData.phone_number);
  formData.append('image', userData.image);
  formData.append('image_url', userData.image_url);

  try {
    const response = await axios.post('http://127.0.0.1:8000/api/user/register/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (response.data.error) {
      setServerError(response.data.error.data.errors);
    } 
    else {
      setServerError({});
      setUserData({});
      setshowAddUsersDialog(false);

      const usersResponse = await axios.get('http://127.0.0.1:8000/api/user/All_user/', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      });
      setUsers(usersResponse.data);
      showSuccess();
    }
  } catch (error) {
    console.log(error);
    setServerError(error.response.data.errors);
  }
};







// const handleShow = async () => {
//   const formData = new FormData();
//   formData.append('first_name', userData.first_name);
//   formData.append('last_name', userData.last_name);
//   formData.append('email', userData.email);
//   formData.append('address', userData.address);
//   formData.append('password', userData.password);
//   formData.append('password_confirmation', userData.password_confirmation);
//   formData.append('username', userData.username);
//   formData.append('phone_number', userData.phone_number);
//   formData.append('image', userData.image);
  
//   const res = await registerUser(formData);
//   if (res.error) {
//   setServerError(res.error.data.errors);
//   }
//   if (res.data) {
//   setServerError({});
//   setUserData({});
//   setshowAddUsersDialog(false);
//   try {
//   const response = await fetch('http://127.0.0.1:8000/api/user/All_user/', {
//   method: 'GET',
//   headers: {
//   'Content-Type': 'application/json',
//   Authorization: `Bearer ${access_token}`,
//   },
//   });
//   const data = await response.json();
//   setUsers(data);
//   } catch (error) {
//   console.log(error);
//   }
//   showSuccess();
//   }
//   };


// const handleShow = async () => {

//   // }
//   const res = await registerUser(userData)
//   if (res.error) {
//     // console.log(typeof (res.error.data.errors))
//     // console.log(res.error.data.errors)
//     console.log(userData.image)

//     setServerError(res.error.data.errors)

//   }
//   if (res.data) {
//     console.log(typeof (res.data))
//     console.log(res.data)
//     setServerError({});
//     setUserData({})
//     setshowAddUsersDialog(false);
//     try {
//       const response = await fetch('http://127.0.0.1:8000/api/user/All_user/', {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization':`Bearer ${access_token}`
//         }
//       });
//       const data = await response.json();
//       setUsers(data);
//     } catch (error) {
//       console.log(error);
//     }
    
//     showSuccess()


//   }
// }


const  showSuccessEdit = async(id,user) => {
  console.log(userEditData.email)
  console.log("user")
  console.log(user)

  // const newUserData = {
  //   email: user.email,
  //   username: user.username,
  //   address:user.address,
  //   first_name:user.first_name,
  //   last_name:user.last_name,
  //   phone_number:user.phone_number,
  // };

  // console.log(newUserData)

  const res =await UpdateUsers({id,userEditData})
  console.log('appppppppppppp')
  console.log(userEditData)

  if (res.error) {
    // console.log(typeof (res.error.data.errors))
    // console.log(res.error.data.errors)
    setServerError(res.error.data.errors)
    // setUserEditData({})

    

  }

  if (res.data) {
    console.log(res.data)
    setServerError({});
    // setUserData({})
    setUserEditData({})
    try {
      const response = await fetch('http://127.0.0.1:8000/api/user/All_user/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization':`Bearer ${access_token}`
        }
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.log(error);
    }
    setshowEdituserDialog(false);
    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: "User updated",
      life: 2000,
    });
    
  }

};

  const toast = useRef(null);
  const showSuccess = () => {
    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: "User Created",
      life: 2000,
    });
    setshowEdituserDialog(false);
    setDeleteProductDialog(false);
  };


  const showSuccessDelete = (id) => {
    console.log(id)
    DeleteUser({access_token,id})
    setUsers(users.filter(user => user.id !== Data.id));
    setDeleteProductDialog(false);
    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: "User deleted",
      life: 2000,
    });
  };

  const hideDeleteProductDialog = (Data) => {
    setDeleteProductDialog(false);
  };

  const confirmDeleteProduct = (user) => {
    setData(user);
    setDeleteProductDialog(true);
  };

  // const editUser = (product) => {
  //   setshowEdituserDialog(true);

  // };
  const handeleEditbtn = (user) => {
    setSelectedEditData(user);
    console.log("user")

    console.log(user)
    setUserEditData(user);
    setshowEdituserDialog(true);
  };

  const handleDeleteBtn = async (user,id) => {
    console.log(id)

  
    confirmDeleteProduct(user)
  };

  const hideDialogshowuser = () => {
    setshowAddUsersDialog(false);
    setServerError({});
  };
  const hideDialogEdituser = () => {
    setServerError({});

    setshowEdituserDialog(false);
  };

  const showUserDialogFooter = (
    <React.Fragment>
      <Button label="Save" text type="submit" outlined icon="pi pi-check" onClick={() => handleShow()}/>
      <Button label="Cancel" text outlined icon="pi pi-times" severity="danger" onClick={()=>hideDialogshowuser()} />
    </React.Fragment>
  );
  const EdituserDialogFooter = (
    <React.Fragment>
            <Button label="Edit" text icon="pi pi-check" onClick={() =>showSuccessEdit(SelectedEditData.id,SelectedEditData)} />
      <Button
        label="Cancel"
        icon="pi pi-times"
        text
        severity="danger"
        onClick={hideDialogEdituser}
      />
    </React.Fragment>
  );












  // tayeb
  const deleteProductDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        text

        icon="pi pi-times"
        outlined
        onClick={hideDeleteProductDialog}
      />
      <Button
        label="Yes"
        text
        icon="pi pi-check"
        severity="danger"
        onClick={() => showSuccessDelete(Data.id)}
      />
    </React.Fragment>
  );

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const columns = [
    { field: "id", headerName: "Id", width: 150 },
    {
      field: "image",
      headerName: "Image",
      width: 150,
      renderCell: (params) => (
        <Avatar
        key={params.row.id}
        src={`http://localhost:8000${params.row.image}`}
        alt={userData.username}
        sx={{
          height: 40,
          mb: 0.5,
          width: 40
        }}


      />      )
    },

    { field: "first_name", headerName: "FirstName", width: 150 },
    { field: "last_name", headerName: "LastName", width: 200 },
    { field: "Phone_Number", headerName: "Phone Number", width: 250 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "Adress", headerName: "Address", width: 250 },
    { field: "username", headerName: "username", width: 250 },


    {
      field: "actions",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <>
          <Button
          
            icon="pi pi-pencil"
            rounded
            style={{ width: '40px', height: '40px' }}
            outlined
            className="mr-2"
            onClick={() => handeleEditbtn(params.row)}
          />
          <Button
            outlined
            style={{ width: '40px', height: '40px' }}

            icon="pi pi-trash"
            rounded
            severity="danger"
            onClick={() => handleDeleteBtn(params.row,params.row.id,params.row.image)}
            
          />
        </>
      ),
    },
  ];

















  
  return (
    <>
      <Helmet>
        <title> Form </title>
        <link rel="canonical" href="https://www.tacobell.com/" />
      </Helmet>

      <Box m="20px">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Header
            title="Users Informations"
            subtitle="welcome to you users informations"
          />
          <Button
            onClick={() => setshowAddUsersDialog(true)}
            color={colors.greenAccent[400]}
            variant="contained"
          >
            Create New User
          </Button>
          {/* <AddUser showAddUsersDialog={showAddUsersDialog} setshowAddUsersDialog={setshowAddUsersDialog} /> */}
        </Box>
        <Box
          m="7px 0 0 0"
          width="100%"
          height="70vh"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
            },

        
            //header color
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.blueAccent[700],
              // borderBottom: "none",
            },
            //color body
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: colors.primary[400],
            },

            //color footer
            "& .MuiDataGrid-footerContainer": {
              //  borderTop: "none",
              fontSize: "15px",
              backgroundColor: colors.blueAccent[700],
            },

            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${colors.grey[100]} !important`,
            },
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            editable={true}
            components={{ Toolbar: GridToolbar }}
        
          />
        </Box>


        <Dialog
          visible={deleteProductDialog}
          style={{ width: "32rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header="Confirm"
          modal
          data={Data}
          footer={deleteProductDialogFooter}
          onHide={hideDeleteProductDialog}
        >
      <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {Data && (
                        <span>
                            Are you sure you want to delete <b>{Data.username}</b>?
                        </span>
                    )}
                </div>
  
        </Dialog>


        <Toast ref={toast} />


        <Dialog
          visible={showAddUsersDialog}
          footer={showUserDialogFooter}
          style={{ width: "55rem", height: "70rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header=" ADD USER "
          modal
          className="p-fluid"
          onHide={hideDialogshowuser}
        >

        <form> 
          <div className="col-12">
            <Panel header="Cordonneés professionnel">
              <div className="p-fluid formgrid grid">

            <>
                  <div className="field col-6 md:col-6">
                    <label htmlFor="first_name">Firstname</label>
                    <InputText id="first_name" type="text" name='first_name'  onChange={handleChange}/>
              
                  </div>
              
                  <div className="field col-6 md:col-6">
                    <label htmlFor="last_name">Lastname</label>
                    <InputText id="last_name" type="text" name="last_name"     onChange={handleChange} />
                  </div>
            </>

          <>
                  <div className="field col-6 md:col-6">
                    <label htmlFor="email">Email</label>
                    <InputText id="email"   type={Email} name="email"    onChange={handleChange} className={classNames({ 'p-invalid':  server_error.email })} />
                    {server_error.email ? <small className="p-error">{server_error.email[0]}</small> : ""}
            
                  </div>
            
                  <div className="field col-6 md:col-6">
                    <label htmlFor="username">Username</label>
                    <InputText id="username" rows="2" name="username"  onChange={handleChange} className={classNames({ 'p-invalid':  server_error.username })} />
                    {server_error.username ? <small className="p-error">{server_error.username[0]}</small> : ""}
            
                  </div>
          </>
              
<>
  
                  <div className="field col-6 md:col-6">
                    <label htmlFor="password">Password:</label>
                    <Password
                                        feedback={false}
  
                      id="password"
                      name="password"
                      toggleMask
                      onChange={handleChange}
                      className={classNames({ 'p-invalid':  server_error.password })}
                    />
                                    {server_error.password ? <small className="p-error">{server_error.password[0]}</small> : ""}
  
                  </div>
                  
  
  
                  {/* <div className="field col-12 md:col-3">
                              <label htmlFor="state">State</label>
                              <Dropdown id="state" value={dropdownItem} onChange={(e) => setDropdownItem(e.value)} options={dropdownItems} optionLabel="name" placeholder="Select One"></Dropdown>
                          </div> */}
                  <div className="field col-6 md:col-6">
                  <label htmlFor="password">Password Confirmation:</label>
                    <Password
                      id="Password Confirmation"
                      onChange={handleChange}
                      feedback={false}
                      name="password_confirmation"
                      toggleMask
                      className={classNames({ 'p-invalid':  server_error.password_confirmation || server_error.non_field_errors})}
  
                    
                    />
                                    {server_error.password_confirmation ? <small className="p-error">{server_error.password_confirmation[0]}</small> : ""}
                                    {server_error.non_field_errors ? <small  className="p-error">{server_error.non_field_errors[0]}</small> : ''}
  
  
                  </div>

                  
                


</>
              

              </div>
            </Panel>
          </div>
          <div className="col-12">
            <Panel header="Cordonneés du Profile  User ">
              <div className="p-fluid formgrid grid">
                <div className="field col-6 md:col-6">
                  <label htmlFor="Phone Number">Phone Number</label>
                  <InputText  id="Phone_Number" name="phone_number"   onChange={handleChange}   className={classNames({ 'p-invalid':  server_error.phone_number })}
  />
                  {server_error.phone_number ? <small className="p-error">{server_error.phone_number[0]}</small> : ""}
                </div>

                

                <div className="field col-6 md:col-6">
                  <label htmlFor="Address">Address</label>
                  <InputText id="Adress" name="address"  onChange={handleChange} />
                </div>

                {/* <div className="field col-12 ">
                  <label htmlFor="image">Image:</label>
                  <FileUpload
                    id="image"
                    name="image"
                    onChange={handleChange}
                    mode="basic"
                  />
                </div> */}
                  <div className="field col-6 md:col-6">
                    <label htmlFor="image">Image:</label>
                    
                  <input type='file' name="image" id="image" onChange={handleChange} />
  
                  </div>
              </div>


              {/* <Checkbox onChange={handleChange} name="tc" id="tc"  >I agree to term and condition.</Checkbox> */}

            </Panel>



          </div>
      
              </form>
            
        </Dialog>







        
        <Dialog
          visible={showEdituserDialog}
          footer={EdituserDialogFooter}
          style={{ width: "55rem", height: "70rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header=" EDIT USER "
          modal
          className="p-fluid"
          onHide={hideDialogEdituser}
        >

             <form> 
          <div className="col-12">
            <Panel header="Cordonneés Personnelles">
              <div className="p-fluid formgrid grid">

              <>
                  <div className="field col-6 md:col-6">
                    <label htmlFor="first_name">Firstname</label>
                    <InputText id="first_name" type="text" name='first_name' defaultValue={SelectedEditData.first_name}  onChange={handleChanges}/>
                
                  </div>
                
                  <div className="field col-6 md:col-6">
                    <label htmlFor="last_name">Lastname</label>
                    <InputText id="last_name" type="text" name="last_name" defaultValue={SelectedEditData.last_name} onChange={handleChanges} />
                  </div>
              </>


                <div className="field col-12 md:col-6">
                  <label htmlFor="email">Email</label>
                  <InputText id="email"  type={Email} name="email"    onChange={handleChanges} className={classNames({ 'p-invalid':  server_error.email })} defaultValue={SelectedEditData.email}  />
                  {server_error.email ? <small className="p-error">{server_error.email[0]}</small> : ""}

                </div>

                <div className="field col-12 md:col-6">
                  <label htmlFor="username">Username</label>
                  <InputText id="username" rows="2" name="username"  onChange={handleChanges} className={classNames({ 'p-invalid':  server_error.username })} defaultValue={SelectedEditData.username}  />
                  {server_error.username ? <small className="p-error">{server_error.username[0]}</small> : ""}

                </div>

              </div>
            </Panel>
          </div>
          <div className="col-12">
            <Panel header="Cordonneés du Profile  User ">
              <div className="p-fluid formgrid grid">
                <div className="field col-12 md:col-6">
                  <label htmlFor="Phone Number">Phone Number</label>
                  <InputText  id="Phone_Number" name="phone_number"   onChange={handleChanges}   className={classNames({ 'p-invalid':  server_error.phone_number })} defaultValue={SelectedEditData.Phone_Number} 
  />
                  {server_error.phone_number ? <small className="p-error">{server_error.phone_number[0]}</small> : ""}
                </div>

                

                <div className="field col-12 md:col-6">
                  <label htmlFor="Address">Address</label>
                  <InputText id="Adress" name="address"  onChange={handleChanges} defaultValue={SelectedEditData.Adress} />
                </div>

                {/* <div className="field col-12 ">
                  <label htmlFor="image">Image:</label>
                  <FileUpload
                    id="image"
                    name="image"
                    onChange={handleChange}
                    mode="basic"
                  />
                </div> */}
              </div>


              {/* <Checkbox onChange={handleChange} name="tc" id="tc"  >I agree to term and condition.</Checkbox> */}

            </Panel>

          </div>
      
              </form>
            
        </Dialog>
      </Box>
    </>
  );
};

export default Contacts;




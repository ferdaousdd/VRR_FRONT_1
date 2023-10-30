import React from 'react'
import { Box, Button, TextField } from '@mui/material'
import { Formik } from "formik";
import * as yup from 'yup';
import { useMediaQuery } from "@mui/material";
import Header from "../../components/Header";
import { Toast } from 'primereact/toast';
import {useRef,useState} from 'react';
import { Helmet } from "react-helmet-async";
import axios from "axios"


const Form = () => {
  const toast = useRef(null);
  const [post,setPost]=useState({
    title:'',
    body:'',
  });
  

    const isNonMobile = useMediaQuery("(min-width:600px)");
    const phoneRegExp = /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;
    const [formData, setFormData] = useState({
      first_name: '',
      last_name: '',
      username:'',
      email: '',
      Phone_Number: '',
      Adress: '',
      image:'',



    });
  


    const handleChange = (event) => {
      setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleFormSubmit = async (values) => {
      // event.preventDefault()
      console.log(values)
        await axios.post('http://127.0.0.1:8000/rest/userviewsets/', values)
        .then(response=>console.log(response))
       .catch (err=>console.log(err))
       toast.current.show({severity:'success', summary: 'Success', detail:'User created', life: 2000});

       
      }
    
      
        


    

  
    const initialValues = {
        first_name: "",
        last_name: "",
        email: "",
        Phone_Number: "",
        Adress: "",
    };
    const checkoutSchema = yup.object().shape({
        firstName:yup.string().required("Required"),
        lastName:yup.string().required("Required"),
        email:yup.string().email("Invalid email!").required("Required"),
        contact:yup.string().matches(phoneRegExp, "phone number is not valid!").required("Required"),
        address:yup.string().required("Required"),
    })
    const showSuccessDelete = () => {
      toast.current.show({severity:'success', summary: 'Success', detail:'Created User', life: 1500});
    
  
  }

    



    return (

        <>

<Helmet>
        <title> Form </title>
        <link rel="canonical" href="https://www.tacobell.com/" />
</Helmet>




{/* <form onSubmit={handleFormSubmit}>
firstName:<input type='text' onChange={handleChange} name="first_name"></input><br/>
lastName:<input type='text' onChange={handleChange} name="last_name"></input><br/>
address:<input type='text' onChange={handleChange} name="address"></input><br/>
username:<input type='text' onChange={handleChange} name="username"></input><br/>
contact:<input type='text' onChange={handleChange} name="contact"></input><br/>
email:<input type='text' onChange={handleChange} name="email"></input><br/>
image:<input type='file' onChange={handleChange} name='image'/>
<button type='submit'>save</button>

</form> */}
<Toast ref={toast} />
<Box m="20px">
      <Header title="CREATE USER" subtitle="Create a New User Profile" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleFormSubmit} >
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="First Name"
                // onBlur={handleBlur}
                onChange={handleChange}
                value={values.firstName}
                name="first_name"
                error={!!touched.firstName && !!errors.firstName}
                helperText={touched.firstName && errors.firstName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Last Name"
                // onBlur={handleBlur}
                onChange={handleChange}
                value={values.lastName}
                name="last_name"
                error={!!touched.lastName && !!errors.lastName}
                helperText={touched.lastName && errors.lastName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Email"
                // onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Contact Number"
                // onBlur={handleBlur}
                onChange={handleChange}
                value={values.contact}
                name="Phone_Number"
                error={!!touched.contact && !!errors.contact}
                helperText={touched.contact && errors.contact}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Address 1"
                // onBlur={handleBlur}
                onChange={handleChange}
                value={values.address1}
                name="Adress"
                error={!!touched.address1 && !!errors.address1}
                helperText={touched.address1 && errors.address1}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Username"
                // onBlur={handleBlur}
                onChange={handleChange}
                value={values.address2}
                name="username"
                error={!!touched.address2 && !!errors.address2}
                helperText={touched.address2 && errors.address2}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="file"
                label="image"
                // onBlur={handleBlur}
                onChange={handleChange}
                value={values.address2}
                name="Image"
                error={!!touched.address2 && !!errors.address2}
                helperText={touched.address2 && errors.address2}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create New User
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>






        </>
      );
}

export default Form
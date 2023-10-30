import React , {useEffect} from "react";
import { Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { GridToolbar } from "@mui/x-data-grid";
import { Button } from "primereact/button";
import { useState } from "react";
import { Dialog } from "primereact/dialog";
import Header from "../../components/Header";
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import { Helmet } from "react-helmet-async";


const History = () => {
  const [data, setdata] = useState([]);
  const [Data, setData] = useState(null);
  // const rows = [];

  const toast = useRef(null);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/user/history/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setdata(data);
        
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserData();
  }, []);

  // for (let i = 0; i < data.length; i++) {
  //   rows.push({
  //     id: data.history[i].id,
  //     Adress_de_noeud: data.point[i].name,
  //     Adresse_de_pipe: data.line[i].name,
  //     zone: data.zone[i].name,
  //     Date: data.water_level[i].date,
  //   });
  // }
console.log(data)
  const rows = data.map((notification) => ({
    id: notification.history[0].id,
    Adress_de_noeud: notification.point[0].name,
    Adresse_de_pipe: notification.line[0].name,
    zone: notification.zone[0].name,
    Date: notification.history[0].date,
  }));

  console.log(rows);
  


const showSuccessDelete = (id) => {
  console.log(id)
  const deleteData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/user/history/${id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setdata(prevData => prevData.map(item => ({
        ...item,
        history: item.history.filter(history => history[0].id !== id)
      })));    } catch (error) {
      console.log(error);
    }
  };

  deleteData();
  toast.current.show({severity:'success', summary: 'Success', detail:'History Deleted', life: 1500});
  setDeleteProductDialog(false);

}
  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  };

  const confirmDeleteProduct = (product) => {
   setData(product)
    console.log(product)
    setDeleteProductDialog(true);
  };


  // tayeb
  const deleteProductDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
    
        icon="pi pi-times"
        outlined
        onClick={hideDeleteProductDialog}
      />
      <Button label="Yes"         onClick={() => showSuccessDelete(Data.id)} icon="pi pi-check" severity="danger" />
    </React.Fragment>
  );

  const columns = [
    { field: "id", headerName: "Id" },

    { field: "Adress_de_noeud", headerName: "Name de noeud", width: 220 },
    { field: "Adresse_de_pipe", headerName: "Name de pipe", width: 220 },
    {field: "zone",headerName: "Zone",width: 220,},
    { field: "Date", headerName: "Date", width: 220 },

    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        
        <React.Fragment >
    
          <Button
            className="p-button-sm d-flex ml-6"
            icon="pi pi-trash"
            outlined
            severity="danger"
            onClick={() => confirmDeleteProduct(params.row)}          />
        </React.Fragment>
      ),
    },
  ];


  
  return (

<>
<Helmet>
        <title> History  </title>
        <link rel="canonical" href="https://www.tacobell.com/" />
</Helmet>
      <Box m="20px">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Header title="leak history" subtitle="welcome to you History" />
        </Box>
        <Box
          m="7px 0 0 0"
          height="70vh"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .name-column--cell": {
              color: colors.greenAccent[300],
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.blueAccent[700],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: colors.primary[400],
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: colors.blueAccent[700],
            },
            "& .MuiCheckbox-root": {
              color: `${colors.greenAccent[200]} !important`,
            },
            "& .MuiChackbox-root": {
              color:` ${colors.greenAccent[200]} !important`,
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${colors.grey[100]} !important`,
            },
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            componentsProps={{
              panel: {
                sx: {
                  "& .MuiButtonBase-root": {
                    color: colors.grey[100],
                  },
                },
              },
            }}
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
                            Are you sure you want to delete <b>{Data.Adress_de_noeud}</b>?
                        </span>
                    )}
                </div>
  
        </Dialog>
  
        <Toast ref={toast} />
  
      </Box>
</>
  );
};

export default History;
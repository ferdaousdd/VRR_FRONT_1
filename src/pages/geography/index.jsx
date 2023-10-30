import { Box, useTheme } from "@mui/material";
import GeographyChart from "../../components/GeographyChart";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { Helmet } from "react-helmet-async";
import 'primeflex/primeflex.css';
import  { useState} from 'react';
import { MdMemory } from 'react-icons/md';
import {

  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { GiTeePipe } from 'react-icons/gi';
import { SpeedDial } from 'primereact/speeddial';
import { Toast } from 'primereact/toast';
import React, { useRef } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
const Geography = () => {
  const [PipeDialog, setPipetDialog] = useState(false);

  const AddPipe = (product) => {
    setPipetDialog(true);
  };

  const hideDialog = () => {
    setPipetDialog(false);
  };
  const productDialogFooter = (
    <React.Fragment>
        <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
        <Button label="Save" icon="pi pi-check"   />
    </React.Fragment>
);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const toast = useRef(null);
    const items = [
        {
            label: 'Add',
            icon: 'pi pi-pencil',
            command: () => {
              AddPipe();
            }
        },
        {
            label: 'Update',
            icon: 'pi pi-plus',
            command: () => {
              AddPipe();
            }
        },
        {
            label: 'Delete',
            icon: 'pi pi-trash',
            command: () => {
              AddPipe();
                // toast.current.show({ severity: 'error', summary: 'Delete', detail: 'Data Deleted' });
            }
        },
    
    ];
  return (

<>
<Helmet>
        <title> Geography </title>
</Helmet>

<Box m="20px">
<Header title="Geography" subtitle="welcome to you Geography" />
        <Box height="80vh">
        <GeographyChart />
        </Box>
      </Box>




    


        
</>

  );
};

export default Geography;






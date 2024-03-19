// SideBar.tsx
import React from 'react';
import { Drawer, List, ListItem, ListItemText } from '@mui/material';

const SideBar: React.FC = () => {
  return (
    <Drawer variant="permanent">
      <List>
        <ListItem button>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="About" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Contact" />
        </ListItem>
      </List>
    </Drawer>
  );
}

export default SideBar;

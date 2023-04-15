import {Box} from '@mui/material';
import React from 'react';

function TabPanel(props) {
	const {children, value, index, styledTab, ...other} = props;

	return (
		<div
			role='tabpanel'
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && <Box sx={{...styledTab}}>{children}</Box>}
		</div>
	);
}

export default TabPanel;

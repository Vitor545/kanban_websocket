import {styled} from '@mui/material/styles';
import {TextField} from '@mui/material';

export const CustomInput = styled(TextField)(({disabledinput}) => ({
	'& .MuiFilledInput-input': {
		paddingTop: '8px !important',
	},
	'& input': {background: 'white', width: '100%'},
	'*::before': {
		borderBottom: `${disabledinput === 'true' ? '0px' : '1px'} solid black`,
	},
	'*::after': {
		borderBottom: `${disabledinput === 'true' ? '0px' : '1px'} solid black`,
	},
	'.MuiInputBase-root.MuiFilledInput-root::before': {
		borderBottom: `${disabledinput === 'true' ? '0px' : '1px'} solid black`,
	},
	'.MuiInputBase-root.MuiFilledInput-root::after': {
		borderBottom: `${disabledinput === 'true' ? '0px' : '1px'} solid black`,
	},
	'.Mui-disabled': {color: 'black !important', fontSize: '14px'},
}));

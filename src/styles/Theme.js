import {createTheme} from '@mui/material/styles';

const theme = createTheme({
	typography: {
		h6: {
			fontWeight: 900,
		},
	},
	components: {
		MuiDrawer: {
			styleOverrides: {
				paper: {
					backgroundColor: 'white',
					color: 'black',
				},
			},
		},
		MuiDataGrid: {
			styleOverrides: {
				cell: {
					borderBottom: 'none',
					border: 'none',
				},
			},
		},
		MuiSelect: {
			styleOverrides: {
				root: {
					height: '2rem',
				},
			},
		},
		MuiInputBase: {
			styleOverrides: {
				input: {
					height: '0.750rem',
				},
			},
		},

		MuiFilledInput: {
			styleOverrides: {
				root: {

				},
			},
		},
	},

	palette: {
		primary: {
			main: '#f97d00',
			contrastText: '#fff',
		},
		secondary: {
			main: '#nnn',
		},
		neutral: {
			main: 'rgba(0, 0, 0, 0.54)',
			contrastText: '#fff',
		},
		transparent: {
			main: 'transparent',
		},
	},
});

export default theme;

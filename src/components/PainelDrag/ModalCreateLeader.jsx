import PropTypes from 'prop-types';
import * as React from 'react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import DialogTitle from '@mui/material/DialogTitle';
import {Controller, useForm} from 'react-hook-form';
import {Alert, Box, Button, Chip, Stack} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {useState, useEffect} from 'react';
import {DatePicker} from '@mui/x-date-pickers';
import {requestGetRoute, requestPost} from '../../services/requests';
import NumberPhoneMask from '../NumberPhoneMask';

export default function ModalCreateLeader({
	open,
	setOpen,
	requestLead,
	boardId,
}) {
	const {id} = JSON.parse(localStorage.getItem('user'));
	const [arrayFields, setArrayFields] = useState([]);
	const [earAlert, setEarAlert] = useState({
		error: false,
		visible: false,
		message: '',
	});

	const {control, handleSubmit} = useForm();
	const onSubmit = async data => {
		await requestPost(`lead/create/userId/${id}`, {
			title: data['Título do Card'],
			description: data['Descrição do Card'],
			propsLead: JSON.stringify(data),
			boardId,
		});
		setOpen(false);
		requestLead();
	};

	const handleClose = () => {
		setOpen(false);
	};

	useEffect(() => {
		const requestFields = async () => {
			const request = await requestGetRoute(`/form/userId/${id}`);
			setArrayFields(JSON.parse(request.properties));
		};

		requestFields();
	}, []);

	return (
		<Dialog open={open} onClose={handleClose} fullWidth maxWidth='md'>
			<Box display='flex' justifyContent='space-between' alignItems='center'>
				<DialogTitle>Novo Lead</DialogTitle>
				<CloseIcon onClick={() => setOpen(false)} sx={{marginRight: 3}} />
			</Box>
			<DialogContent
				className='input-perfil-account'
				sx={{
					display: 'flex',
					gap: '8px',
					flexDirection: 'column',
				}}
			>
				{earAlert.visible && (
					<Alert
						severity={earAlert.error ? 'error' : 'success'}
						onClose={() =>
							setEarAlert({
								error: false,
								visible: false,
								message: '',
							})
						}
					>
						{earAlert.message}
					</Alert>
				)}
				<form
					onSubmit={handleSubmit(onSubmit)}
					style={{display: 'flex', flexDirection: 'column'}}
				>
					{Object.keys(arrayFields).map(el => (
						<Box key={el}>
							<Chip label={el} sx={{height: 'auto'}} />
							<Box
								display='flex'
								flexWrap='wrap'
								gap={2}
								justifyContent='center'
								my={4}
							>
								{arrayFields[el].map(({label, type, props}) => {
									switch (type) {
										case 'number':
											return (
												<Controller
													key={label}
													name={label}
													control={control}
													render={({field}) => (
														<TextField
															label={label}
															variant='outlined'
															size='small'
															{...field}
															width='50%'
															{...props}
															autoFocus
															InputProps={{
																inputComponent: NumberPhoneMask,
															}}
															fullWidth
															sx={{width: '300px'}}
														/>
													)}
												/>
											);
										case 'date':
											return (
												<LocalizationProvider
													dateAdapter={AdapterDayjs}
													key={label}
												>
													<Stack spacing={3}>
														<Controller
															name={label}
															control={control}
															render={({field}) => (
																<DatePicker
																	inputFormat='DD/MM/YYYY'
																	margin='dense'
																	{...field}
																	renderInput={params => (
																		<TextField
																			{...params}
																			margin='dense'
																			{...props}
																			width='50%'
																			autoFocus
																			sx={{width: '300px'}}
																			size='small'
																			label='Data Prevista de Embarque'
																		/>
																	)}
																/>
															)}
														/>
													</Stack>
												</LocalizationProvider>
											);
										default:
											return (
												<Controller
													name={label}
													key={label}
													control={control}
													render={({field}) => (
														<TextField
															label={label}
															variant='outlined'
															size='small'
															{...field}
															width='50%'
															{...props}
															autoFocus
															fullWidth
															sx={{width: '300px'}}
														/>
													)}
												/>
											);
									}
								})}
							</Box>
						</Box>
					))}
					<Button type='submit'>salvar</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}

ModalCreateLeader.propTypes = {
	open: PropTypes.any,
	requestLead: PropTypes.func,
	setOpen: PropTypes.func,
}.isRequired;

import PropTypes from 'prop-types';
import React, {useEffect, useRef, useState} from 'react';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Slide from '@mui/material/Slide';
import {Box, Button, Divider, Tab, Tabs} from '@mui/material';
import Close from '@mui/icons-material/Close';
import jwtDecode from 'jwt-decode';
import EditIcon from '@mui/icons-material/Edit';
import {Controller, useForm} from 'react-hook-form';
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {IMaskInput} from 'react-imask';
import {requestGetRoute, requestPutRoute} from '../../services/requests';
import {CustomInput} from '../../styles/NavForm';
import TabPainel from '../TabPanel';

const Transition = React.forwardRef((props, ref) => (
	<Slide direction='up' ref={ref} {...props} />
));

const TextMaskCustom = React.forwardRef((props, ref) => {
	const {onChange, ...other} = props;
	return (
		<IMaskInput
			{...other}
			mask='(00) 00000-0000'
			definitions={{
				'#': /[1-9]/,
			}}
			inputRef={ref}
			onAccept={value => onChange({target: {name: props.name, value}})}
			overwrite
		/>
	);
});

function TextFunction({labelText, control, disabledInput}) {
	return (
		<Box display='flex' alignItems='flex-start' flexDirection='column'>
			<Typography mt={1} sx={{fontSize: '14px', fontWeight: '500'}}>
				{labelText}
			</Typography>
			<Controller
				key={labelText}
				name={labelText}
				control={control}
				render={({field}) => (
					<CustomInput
						disabled={disabledInput}
						focused
						{...field}
						margin='dense'
						disabledinput={disabledInput.toString()}
						variant='filled'
					/>
				)}
			/>
		</Box>
	);
}

TextFunction.propTypes = {
	control: PropTypes.any,
	disabledInput: PropTypes.shape({
		toString: PropTypes.func,
	}),
	labelText: PropTypes.any,
};

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

export default function DialogDrag({setOpen, open, task}) {
	const [infosTask, setInfoTask] = useState([]);
	const taskInfo = JSON.parse(task.propsLead);
	const [value, setValue] = React.useState(0);
	const {control, handleSubmit} = useForm({
		defaultValues: taskInfo,
	});
	const [disabledInput, setDisabledInput] = useState(true);
	const [titleValue, setTitleValue] = useState(task.title);
	const [inputDisabled, setInputDisabled] = useState(true);
	const inputRef = useRef();
	const [disabledInputBody, setDisabledInputBody] = useState(true);
	const handleClose = () => {
		setOpen(false);
	};

	useEffect(() => {
		const requestModel = async () => {
			const {id} = jwtDecode(localStorage.getItem('token'));
			const request = await requestGetRoute(`/form/userId/${id}`);
			setInfoTask(JSON.parse(request.properties));
		};

		requestModel();
	}, []);

	const onSubmit = async data => {
		await requestPutRoute(`lead/update/propsLead/taskId/${task.id}`, {
			propsLead: JSON.stringify(data),
		});
		setDisabledInput(true);
		setDisabledInputBody(true);
	};

	const requestUpdate = async () => {
		if (titleValue) {
			await requestPutRoute(`lead/update/name/leadId/${task.id}`, {
				title: titleValue,
			});
		} else {
			setTitleValue(task.title);
		}
	};

	useEffect(() => {
		const mouseDownFunc = e => {
			if (inputRef.current.contains(e.target)) {
				setInputDisabled(false);
			} else {
				requestUpdate();
				setInputDisabled(true);
			}
		};

		document.addEventListener('mousedown', mouseDownFunc);
		return () => {
			document.removeEventListener('mousedown', mouseDownFunc);
		};
	}, [titleValue]);

	return (
		<div>
			<Dialog
				fullScreen
				open={open}
				onClose={handleClose}
				TransitionComponent={Transition}
			>
				<Box sx={{display: 'flex', flexDirection: 'column'}} p={2}>
					<Box
						justifyContent='space-between'
						display='flex'
						mb={3}
						alignItems='center'
					>
						<CustomInput
							value={titleValue}
							disabled={inputDisabled}
							ref={inputRef}
							disabledinput={inputDisabled.toString()}
							onChange={e => setTitleValue(e.target.value)}
							sx={{
								cursor: 'pointer',
								'& input': {
									fontSize: '24px',
									fontWeight: '900',
									color: '#301e0b',
								},
								'& input.Mui-disabled': {
									fontSize: '24px',
									fontWeight: '900',
									color: '#301e0b',
								},
								'& .MuiFilledInput-input.Mui-disabled': {
									WebkitTextFillColor: '#301e0b',
								},
							}}
							variant='filled'
						/>
						<IconButton sx={{padding: 0}} disableRipple onClick={handleClose}>
							<Close />
						</IconButton>
					</Box>
					<Box display='flex' gap='16px'>
						<Box
							border='1px solid #e0e0e0'
							sx={{width: '300px', height: '85vh'}}
							borderRadius={1}
							p={2}
							display='flex'
							flexDirection='column'
							alignItems='flex-start'
						>
							<Box
								mt={2}
								display='flex'
								alignItems='center'
								justifyContent='space-between'
								width='100%'
							>
								<Typography sx={{fontSize: '16px', fontWeight: '900'}}>
                  Informações de Contato
								</Typography>
								<IconButton
									disableRipple
									fontSize='16px'
									onClick={() => setDisabledInput(false)}
								>
									<EditIcon />
								</IconButton>
							</Box>
							<Divider mb={3} />
							<form
								onSubmit={handleSubmit(onSubmit)}
								style={{display: 'flex', flexDirection: 'column'}}
							>
								{infosTask['Identificação do Solicitante']?.map(({label}) => (
									<TextFunction
										taskInfo={taskInfo}
										key={label}
										control={control}
										labelText={label}
										setDisabledInput={setDisabledInput}
										disabledInput={disabledInput}
									/>
								))}
								{!disabledInput && (
									<Box display='flex' mt={4}>
										<Button type='submit' sx={{mr: 2}}>
                      Salvar
										</Button>
										<Button onClick={() => setDisabledInput(true)}>
                      Cancelar
										</Button>
									</Box>
								)}
							</form>
						</Box>
						<Box
							border='1px solid #e0e0e0'
							flex={1}
							height='100%'
							borderRadius={1}
							p={2}
						>
							<Box sx={{width: '100%'}}>
								<Box sx={{borderBottom: 1, borderColor: 'divider'}}>
									<Tabs
										value={value}
										onChange={(e, newValue) => setValue(newValue)}
										aria-label='basic tabs example'
									>
										{Object.keys(infosTask)
											.filter(
												el =>
													![
														'Identificação do Solicitante',
														'Informações do Card',
													].includes(el),
											)
											.map((el, index) => (
												<Tab key={el} label={el} {...a11yProps(index)} />
											))}
									</Tabs>
								</Box>
								{Object.keys(infosTask)
									.filter(
										el =>
											![
												'Identificação do Solicitante',
												'Informações do Card',
											].includes(el),
									)
									.map((el, index) => (
										<TabPainel
											value={value}
											index={index}
											key={el}
											styledTab={{p: 3}}
										>
											<form
												onSubmit={handleSubmit(onSubmit)}
												style={{display: 'flex', flexDirection: 'column'}}
											>
												<Box key={el}>
													<Box display='flex' justifyContent='space-between'>
														<Typography sx={{fontWeight: '900'}}>
															{el}
														</Typography>
														{disabledInputBody && (
															<IconButton
																disableRipple
																fontSize='16px'
																onClick={() => setDisabledInputBody(false)}
															>
																<EditIcon />
															</IconButton>
														)}
														{!disabledInputBody && (
															<Box display='flex'>
																<Button type='submit' sx={{mr: 2}}>
                                  Salvar
																</Button>
																<Button
																	type='submit'
																	onClick={() => setDisabledInputBody(true)}
																>
                                  Cancelar
																</Button>
															</Box>
														)}
													</Box>
													<Box
														display='flex'
														flexWrap='wrap'
														gap={2}
														justifyContent='flex-start'
													>
														{infosTask[el].map(({label, type, props}) => {
															switch (type) {
																case 'number':
																	return (
																		<Box
																			display='flex'
																			key={label}
																			alignItems='flex-start'
																			flexDirection='column'
																		>
																			<Typography
																				mt={1}
																				sx={{
																					fontSize: '14px',
																					fontWeight: '500',
																				}}
																			>
																				{label}
																			</Typography>
																			<Controller
																				key={label}
																				name={label}
																				control={control}
																				render={({field}) => (
																					<CustomInput
																						variant='filled'
																						size='small'
																						{...field}
																						width='50%'
																						margin='dense'
																						disabled={disabledInputBody}
																						{...props}
																						autoFocus
																						disabledinput={disabledInputBody.toString()}
																						InputProps={{
																							inputComponent: TextMaskCustom,
																						}}
																						fullWidth
																						sx={{width: '280px'}}
																					/>
																				)}
																			/>
																		</Box>
																	);
																case 'date':
																	return (
																		<Box
																			display='flex'
																			key={label}
																			alignItems='flex-start'
																			flexDirection='column'
																		>
																			<Typography
																				mt={1}
																				sx={{
																					fontSize: '14px',
																					fontWeight: '500',
																				}}
																			>
																				{label}
																			</Typography>
																			<LocalizationProvider
																				dateAdapter={AdapterDayjs}
																				key={label}
																			>
																				<Controller
																					name={label}
																					control={control}
																					render={({field}) => (
																						<DatePicker
																							inputFormat='DD/MM/YYYY'
																							margin='dense'
																							disabled={disabledInputBody}
																							{...field}
																							InputAdornmentProps={{
																								sx: {
																									display: disabledInputBody
																										? 'none'
																										: 'inherit',
																								},
																							}}
																							renderInput={params => (
																								<CustomInput
																									{...params}
																									margin='dense'
																									{...props}
																									width='50%'
																									variant='filled'
																									disabledinput={disabledInputBody.toString()}
																									autoFocus
																									sx={{
																										width: '280px',
																										'.MuiFilledInput-root.MuiFilledInput-underline':
                                                      {background: 'white'},
																									}}
																									size='small'
																								/>
																							)}
																						/>
																					)}
																				/>
																			</LocalizationProvider>
																		</Box>
																	);
																default:
																	return (
																		<Box
																			display='flex'
																			key={label}
																			alignItems='flex-start'
																			flexDirection='column'
																		>
																			<Typography
																				mt={1}
																				sx={{
																					fontSize: '14px',
																					fontWeight: '500',
																				}}
																			>
																				{label}
																			</Typography>
																			<Controller
																				name={label}
																				key={label}
																				control={control}
																				render={({field}) => (
																					<CustomInput
																						variant='filled'
																						size='small'
																						{...field}
																						disabled={disabledInputBody}
																						width='50%'
																						{...props}
																						autoFocus
																						margin='dense'
																						disabledinput={disabledInputBody.toString()}
																						fullWidth
																						sx={{width: '280px'}}
																					/>
																				)}
																			/>
																		</Box>
																	);
															}
														})}
													</Box>
												</Box>
											</form>
										</TabPainel>
									))}
							</Box>
						</Box>
					</Box>
				</Box>
			</Dialog>
		</div>
	);
}

DialogDrag.propTypes = {
	open: PropTypes.any,
	setOpen: PropTypes.func,
	task: PropTypes.shape({
		id: PropTypes.any,
		propsLead: PropTypes.any,
		title: PropTypes.any,
	}),
};

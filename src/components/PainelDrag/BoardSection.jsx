import PropTypes from 'prop-types';
import React, {useEffect, useRef, useState} from 'react';
import Box from '@mui/material/Box';
import {useDroppable} from '@dnd-kit/core';
import {
	SortableContext,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Typography from '@mui/material/Typography';
import {
	Divider,
	IconButton,
	Alert,
	List,
	ListItemIcon,
	ListItemText,
	ListSubheader,
	Popover,
} from '@mui/material';
import PopupState, {bindTrigger, bindPopover} from 'material-ui-popup-state';
import CreateIcon from '@mui/icons-material/Create';
import Close from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import SortableTaskItem from './SortableTaskItem';
import TaskItem from './TaskItem';
import ModalCreateLeader from './ModalCreateLeader';
import {requestPost, requestPutRoute} from '../../services/requests';
import ChangeColorBoard from './ChangeColorBoard';
import DialogDrag from './DialogDrag';
import {CustomInput} from '../../styles/NavForm';

function TaskDialog({task}) {
	const [openDialog, setOpenDialog] = React.useState(false);
	return (
		<>
			<SortableTaskItem id={task.id}>
				<TaskItem task={task} setOpen={setOpenDialog} />
			</SortableTaskItem>
			{openDialog && (
				<DialogDrag open={openDialog} setOpen={setOpenDialog} task={task} />
			)}
		</>
	);
}

TaskDialog.propTypes = {
	task: PropTypes.shape({
		id: PropTypes.any,
	}),
};

function BoardSection({
	id,
	title,
	tasks,
	requestLead,
	allBoards,
	boardId,
	boardVerify,
	boardList,
}) {
	const [openCreate, setOpenCreate] = useState(false);
	const parseBoard = allBoards;
	const [titleValue, setTitleValue] = useState(title);
	const [inputDisabled, setInputDisabled] = useState(true);
	const inputRef = useRef();
	const [anchorEl, setAnchorEl] = useState(null);
	const [earAlert, setEarAlert] = useState({
		error: false,
		visible: false,
		message: '',
	});

	const deleteBoard = async () => {
		await requestPost(`board/delete/${boardId}`);
		requestLead();
	};

	const requestUpdate = async () => {
		if (boardVerify.includes(titleValue) && titleValue !== title) {
			setEarAlert({
				error: true,
				visible: true,
				message: 'Nome já existente!',
			});
			return setTitleValue(title);
		}

		if (titleValue && titleValue !== title) {
			await requestPutRoute(`board/update/boardName/${boardId}`, {
				boardName: titleValue,
				kanbanId: boardList[0].kanbanId,
			});
		} else {
			setTitleValue(title);
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

	const {setNodeRef} = useDroppable({
		id,
	});

	const open = Boolean(anchorEl);
	const idPop = open ? 'simple-popover' : undefined;

	const changeColor = async color => {
		await requestPutRoute(`board/update/color/${boardId}`, {
			color,
		});
	};

	return (
		<Box
			sx={{
				backgroundColor: '#fff',
				borderRadius: '4px',
				width: '272px',
				display: 'flex',
				flexDirection: 'column',
				maxHeight: 'calc(100vh - 40px - 56px )',
				border: '1px solid #E9E9E9',
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
					sx={{marginBottom: '8px'}}
				>
					{earAlert.message}
				</Alert>
			)}
			<Box
				display='flex'
				alignItems='flex-end'
				justifyContent='space-between'
				paddingBottom='10px'
				flexDirection='column-reverse'
				px='8px'
			>
				<Box
					sx={{
						bgcolor: parseBoard.find(el => el.boardName === id)?.color,
						width: '100%',
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'flex-end',
						borderRadius: '4px',
						padding: '20px',
					}}
				>
					<Typography
						variant='h6'
						sx={{
							fontSize: '18px',
							fontWeight: 500,
							color: '#ffffff',
						}}
					>
						{tasks.length}
					</Typography>
					<CustomInput
						value={titleValue}
						disabled={inputDisabled}
						ref={inputRef}
						disabledinput={inputDisabled.toString()}
						onChange={e => setTitleValue(e.target.value)}
						sx={{
							width: '130px',
							cursor: 'pointer',
							'& input': {
								fontSize: '14px',
								fontWeight: 500,
								color: '#ffffff',
								bgcolor: parseBoard.find(el => el.boardName === id)?.color,
								textAlign: 'end',
							},
							'& input.Mui-disabled': {
								fontSize: '14px',
								fontWeight: 500,
								textAlign: 'end',
								color: '#ffffff',
							},
							'& .MuiFilledInput-input.Mui-disabled': {
								WebkitTextFillColor: '#ffffff',
							},
						}}
						variant='filled'
					/>
				</Box>
				<PopupState variant='popover' popupId='demo-popup-popover'>
					{popupState => (
						<div style={{display: 'flex', justifyContent: 'flex-end'}}>
							<IconButton disableRipple {...bindTrigger(popupState)}>
								<MoreHorizIcon />
							</IconButton>
							<Popover
								{...bindPopover(popupState)}
								anchorOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}
								transformOrigin={{
									vertical: 'top',
									horizontal: 'left',
								}}
							>
								<List
									sx={{
										width: '272px',
										paddingBottom: 0,
										bgcolor: 'background.paper',
									}}
									component='nav'
									aria-labelledby='nested-list-subheader'
									subheader={
										<>
											<ListSubheader
												component='div'
												id='nested-list-subheader'
												sx={{
													display: 'flex',
													lineHeight: '36px',
													justifyContent: 'center',
												}}
											>
                        Lista de ações
											</ListSubheader>
											<Divider />
										</>
									}
								>
									<Box
										display='flex'
										alignItems='center'
										onClick={deleteBoard}
										p={1}
										sx={{'&:hover': {background: '#f5f5f5'}}}
										justifyContent='flex-start'
										gap={1}
									>
										<ListItemIcon sx={{minWidth: 0}}>
											<Close />
										</ListItemIcon>
										<ListItemText
											primary='Excluir Board'
											sx={{
												cursor: 'pointer',
												'& span': {fontSize: '14px', lineHeight: '90%'},
											}}
										/>
									</Box>
									<Box
										display='flex'
										alignItems='center'
										onClick={event => setAnchorEl(event.currentTarget)}
										aria-describedby={idPop}
										p={1}
										justifyContent='flex-start'
										sx={{'&:hover': {background: '#f5f5f5'}}}
										gap={1}
									>
										<ListItemIcon sx={{minWidth: 0}}>
											<CreateIcon />
										</ListItemIcon>
										<ListItemText
											primary='Trocar cor do Board'
											sx={{
												cursor: 'pointer',
												'& span': {fontSize: '14px', lineHeight: '90%'},
											}}
										/>
									</Box>
									<ChangeColorBoard
										setAnchorEl={setAnchorEl}
										changeColor={changeColor}
										anchorEl={anchorEl}
									/>
								</List>
							</Popover>
						</div>
					)}
				</PopupState>
			</Box>
			<Box flex={1} overflow='auto'>
				<SortableContext
					id={id}
					items={tasks}
					strategy={verticalListSortingStrategy}
				>
					<div ref={setNodeRef}>
						{tasks.map(task => (
							<Box
								p={1}
								sx={{'&:last-child': {paddingBottom: 1}}}
								key={task?.id}
							>
								<Box key={task?.id}>
									<TaskDialog task={task} />
								</Box>
							</Box>
						))}
					</div>
				</SortableContext>
			</Box>
			<ModalCreateLeader
				open={openCreate}
				setOpen={setOpenCreate}
				requestLead={requestLead}
				boardId={boardId}
			/>
			<Box
				display='flex'
				alignItems='center'
				onClick={() => setOpenCreate(true)}
				p={1}
				sx={{borderRadius: '4px', '&:hover': {background: '#dbdbdb'}}}
				justifyContent='flex-start'
				gap={1}
			>
				<ListItemIcon sx={{minWidth: 0}}>
					<AddIcon />
				</ListItemIcon>
				<ListItemText
					primary='Adicionar um cartão'
					sx={{
						cursor: 'pointer',
						'& span': {fontSize: '14px', lineHeight: '90%'},
					}}
				/>
			</Box>
		</Box>
	);
}

BoardSection.propTypes = {
	allBoards: PropTypes.any,
	boardId: PropTypes.any,
	boardList: PropTypes.any,
	boardVerify: PropTypes.shape({
		includes: PropTypes.func,
	}),
	id: PropTypes.any,
	requestLead: PropTypes.func,
	tasks: PropTypes.shape({
		length: PropTypes.any,
		map: PropTypes.func,
	}),
	title: PropTypes.any,
};

export default BoardSection;

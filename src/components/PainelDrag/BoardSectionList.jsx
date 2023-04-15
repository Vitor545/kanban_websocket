/* eslint-disable camelcase */
import React, {useEffect, useState} from 'react';
import Grid from '@mui/material/Grid';
import {
	useSensors,
	useSensor,
	PointerSensor,
	KeyboardSensor,
	DndContext,
	closestCorners,
	DragOverlay,
	defaultDropAnimation,
} from '@dnd-kit/core';
import jwt_decode from 'jwt-decode';
import {HubConnectionBuilder} from '@microsoft/signalr';
import {sortableKeyboardCoordinates, arrayMove} from '@dnd-kit/sortable';
import {Alert, Box, Button, IconButton, Menu, TextField} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TaskItem from './TaskItem';
import {
	requestGetRoute,
	requestPost,
	requestPutRoute,
} from '../../services/requests';
import BoardSection from './BoardSection';
import {useNavigate} from 'react-router-dom';

export const initializeBoard = (tasks, BOARD_SECTIONS) => {
	const boardSections = {};

	BOARD_SECTIONS.forEach(({boardName, id}) => {
		boardSections[boardName] = {
			listTask: tasks.filter(task => task.boardId === id),
			boardId: id,
		};
	});

	return boardSections;
};

export const findBoardSectionContainer = (boardSections, id) => {
	if (id in boardSections) {
		return id;
	}

	const container = Object.keys(boardSections).find(key =>
		boardSections[key].listTask.find(item => item.id === id),
	);
	return container;
};

function BoardSectionList() {
	const [tasks, setTasks] = useState();
	const [newBoardName, setNewBoardName] = useState();
	const [boardList, setBoardList] = useState([]);
	const [allBoards, setAllBoards] = useState([]);
	const navigate = useNavigate();
	const [boardSections, setBoardSections] = useState({});
	const boardVerify = boardList.map(el => el.boardName);
	const [anchorElButton, setAnchorElButton] = React.useState(null);
	const openButton = Boolean(anchorElButton);

	const [earAlert, setEarAlert] = useState({
		error: false,
		visible: false,
		message: '',
	});

	const [activeTaskId, setActiveTaskId] = useState(null);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const requestLead = async () => {
		try {
			const {id} = jwt_decode(localStorage.getItem('token'));
			const {boards} = await requestGetRoute(`kanban/userId/${id}`);
			setAllBoards(boards);
			if (boards) {
				setBoardList(boards);
			}

			setBoardSections(
				initializeBoard(
					boards.flatMap(el => el.leads),
					boards,
				),
			);
			setTasks(boards.flatMap(el => el.leads));
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		if (!localStorage.getItem('token')) {
			navigate('/');
		}

		const connection = new HubConnectionBuilder()
			.withUrl('https://localhost:7208/hubs/kanban')
			.withAutomaticReconnect()
			.build();

		connection
			.start()
			.then(() => {
				connection.on('ReceiveMessage', message => {
					requestLead(message);
				});
			})
			.catch(e => console.log('Connection failed: ', e));
	}, []);

	const handleClose = () => {
		setAnchorElButton(null);
	};

	const handleSubmitBoard = async () => {
		try {
			if (boardVerify.includes(newBoardName)) {
				setEarAlert({
					error: true,
					visible: true,
					message: 'Nome já existente',
				});
			} else {
				setEarAlert({
					error: true,
					visible: false,
					message: 'Nome já existente',
				});
				const {id} = jwt_decode(localStorage.getItem('token'));
				await requestPost(`board/create/userId/${id}`, {
					boardName: newBoardName,
					kanbanId: boardList[0].kanbanId,
					color: '#FFAF3F',
				});
				requestLead();
				handleClose();
			}
		} catch (e) {
			return console.log(e);
		}
	};

	useEffect(() => {
		requestLead();
	}, []);

	const handleDragStart = ({active}) => {
		setActiveTaskId(active.id);
	};

	const handleDragOver = async ({active, over}) => {
		// Find the containers
		const activeContainer = findBoardSectionContainer(boardSections, active.id);
		const overContainer = findBoardSectionContainer(boardSections, over?.id);

		if (
			!activeContainer
      || !overContainer
      || activeContainer === overContainer
		) {
			return;
		}

		setBoardSections(boardSection => {
			const activeItems = boardSection[activeContainer].listTask;
			const overItems = boardSection[overContainer].listTask;

			// Find the indexes for the items
			const activeIndex = activeItems.findIndex(
				item => item.id === active.id,
			);
			const overIndex = overItems.findIndex(item => item.id !== over?.id);

			return {
				...boardSection,
				[activeContainer]: {
					listTask: [
						...boardSection[activeContainer].listTask.filter(
							item => item.id !== active.id,
						),
					],
					boardId: boardSection[activeContainer].boardId,
				},
				[overContainer]: {
					listTask: [
						...boardSection[overContainer].listTask.slice(0, overIndex),
						boardSections[activeContainer].listTask[activeIndex],
						...boardSection[overContainer].listTask.slice(
							overIndex,
							boardSection[overContainer].listTask.length,
						),
					],
					boardId: boardSection[overContainer].boardId,
				},
			};
		});
	};

	const handleClick = event => {
		setAnchorElButton(event.currentTarget);
	};

	const handleDragEnd = async ({active, over}) => {
		const activeContainer = findBoardSectionContainer(boardSections, active.id);
		const overContainer = findBoardSectionContainer(boardSections, over?.id);

		if (
			!activeContainer
      || !overContainer
      || activeContainer !== overContainer
		) {
			return;
		}

		const activeIndex = boardSections[activeContainer].listTask.findIndex(
			task => task.id === active.id,
		);
		const overIndex = boardSections[overContainer].listTask.findIndex(
			task => task.id === over?.id,
		);
		let newBoardList = boardSections;
		if (activeIndex !== overIndex) {
			setBoardSections(boardSection => {
				const {listTask} = boardSection[overContainer];
				const newListLeads = arrayMove(listTask, activeIndex, overIndex);
				newBoardList = {
					...boardSection,
					[overContainer]: {
						listTask: newListLeads.filter(el => Boolean(el)),
						boardId: boardSection[overContainer].boardId,
					},
				};
				return newBoardList;
			});
		}

		await requestPutRoute('lead/update', {
			boardId: newBoardList[activeContainer].boardId,
			listBoard: newBoardList[activeContainer].listTask,
		});

		setActiveTaskId(null);
	};

	const dropAnimation = {
		...defaultDropAnimation,
	};

	const task = activeTaskId
		? tasks.find(task => task.id === activeTaskId)
		: null;

	return (
		<Box height='100vh' display='flex' flexDirection='column'>
			<Box flex={1} display='flex' flexDirection='column'>
				<DndContext
					sensors={sensors}
					collisionDetection={closestCorners}
					onDragStart={handleDragStart}
					onDragOver={handleDragOver}
					onDragEnd={handleDragEnd}
				>
					<Box display='flex' gap={1} p={2} flex={1} overflow='auto'>
						{Object.keys(boardSections).map(boardSectionKey => (
							<Grid item xs={4} key={boardSectionKey}>
								<BoardSection
									id={boardSectionKey}
									title={boardSectionKey}
									allBoards={allBoards}
									boardList={boardList}
									boardVerify={boardVerify}
									requestLead={requestLead}
									tasks={boardSections[boardSectionKey].listTask}
									boardId={boardSections[boardSectionKey].boardId}
								/>
							</Grid>
						))}
						<div>
							<Button
								id='demo-positioned-button'
								aria-controls={openButton ? 'demo-positioned-menu' : undefined}
								aria-haspopup='true'
								sx={{width: '272px'}}
								aria-expanded={openButton ? 'true' : undefined}
								onClick={handleClick}
							>
                Adicionar lista
							</Button>
							<Menu
								id='demo-positioned-menu'
								aria-labelledby='demo-positioned-button'
								anchorEl={anchorElButton}
								open={openButton}
								sx={{'& ul': {padding: 0}}}
								onClose={handleClose}
								anchorOrigin={{
									vertical: 'top',
									horizontal: 'left',
								}}
								transformOrigin={{
									vertical: 'top',
									horizontal: 'left',
								}}
							>
								<Box display='flex' flexDirection='column' width='272px' p={1}>
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
									<TextField
										onChange={e => setNewBoardName(e.target.value)}
										onKeyPress={event =>
											event.key === 'Enter' && handleSubmitBoard()
										}
									/>
									<Box display='flex' alignItems='center'>
										<Button
											sx={{display: 'flex', justifyContent: 'flex-start'}}
											onClick={handleSubmitBoard}
										>
                      Adicionar
										</Button>
										<IconButton
											size='large'
											onClick={handleClose}
											disableRipple
											color='inherit'
										>
											<CloseIcon />
										</IconButton>
									</Box>
								</Box>
							</Menu>
						</div>
						<DragOverlay dropAnimation={dropAnimation}>
							{task ? <TaskItem task={task} /> : null}
						</DragOverlay>
					</Box>
				</DndContext>
			</Box>
		</Box>
	);
}

export default BoardSectionList;

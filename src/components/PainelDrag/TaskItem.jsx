import React from 'react';
import {Card, CardContent, IconButton} from '@mui/material';
import ArticleIcon from '@mui/icons-material/Menu';

function TaskItem({task, setOpen}) {
	return (
		<Card
			sx={{
				boxShadow: 'none',
				border: '1px solid #e9e9e9',
				cursor: 'grabbing',
			}}
			onClick={() => setOpen(true)}
		>
			<CardContent
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'flex-start',
					padding: 1,
					'&:last-child': {padding: 1},
				}}
			>
				{task.title}
				<IconButton disableRipple sx={{padding: '0', pt: 1}}>
					<ArticleIcon sx={{fontSize: 'medium'}} />
				</IconButton>
			</CardContent>
		</Card>
	);
}

export default TaskItem;

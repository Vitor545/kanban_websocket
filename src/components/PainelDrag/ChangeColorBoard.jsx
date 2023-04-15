import PropTypes from 'prop-types';
import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import {Box, Divider} from '@mui/material';

export default function ChangeColorBoard({
	setAnchorEl,
	anchorEl,
	changeColor,
}) {
	const handleClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover' : undefined;

	const colorList = [
		'#FF8ED4',
		'#7BC86C',
		'#EF7564',
		'#172B4D',
		'#CD8DE5',
		'#FFAF3F',
	];

	return (
		<div>
			<Popover
				id={id}
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'left',
				}}
			>
				<Box width='200px'>
					<Typography
						sx={{lineHeight: '36px', textAlign: 'center'}}
						fontSize='14px'
					>
            Cores
					</Typography>
				</Box>
				<Divider />
				<Box
					sx={{padding: '16px'}}
					display='flex'
					gap='8px'
					width='200px'
					flexWrap='wrap'
				>
					{colorList.map(el => (
						<Box
							width='50px'
							key={el}
							sx={{cursor: 'pointer'}}
							height='32px'
							bgcolor={el}
							onClick={() => changeColor(el)}
							borderRadius='4px'
						/>
					))}
				</Box>
			</Popover>
		</div>
	);
}

ChangeColorBoard.propTypes = {
	anchorEl: PropTypes.any,
	changeColor: PropTypes.func,
	setAnchorEl: PropTypes.func,
};

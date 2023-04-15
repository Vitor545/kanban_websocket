import React from 'react';
import {IMaskInput} from 'react-imask';

const NumberPhoneMask = React.forwardRef((props, ref) => {
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

export default NumberPhoneMask;

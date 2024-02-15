import React from 'react';
import { InputProps, Input, Text } from '@ui-kitten/components';
import { Control, useController } from 'react-hook-form';
import { RegisterOptions } from 'react-hook-form/dist/types/validator';

export interface IRKCInputProps extends InputProps {
	control: Control<any>;
	name: string;
	rules?: Omit<
		RegisterOptions<any, any>,
		'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
	>;
}

export function RkcInput(props: IRKCInputProps): React.JSX.Element {
	const { field, fieldState } = useController({
		control: props.control,
		defaultValue: '',
		name: props.name,
		rules: props.rules,
	});

	return (
		<Input
			{...props}
			value={field.value}
			onChangeText={field.onChange}
			status={fieldState.invalid ? 'danger' : 'basic'}
		/>
	);
}

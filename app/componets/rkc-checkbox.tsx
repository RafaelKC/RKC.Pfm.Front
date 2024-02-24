import React from 'react';
import { CheckBox, CheckBoxProps } from '@ui-kitten/components';
import { Control, useController } from 'react-hook-form';
import { RegisterOptions } from 'react-hook-form/dist/types/validator';

export interface IRKCInputProps extends CheckBoxProps {
	control: Control<any>;
	name: string;
	rules?: Omit<
		RegisterOptions<any, any>,
		'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
	>;
}

export function RkcCheckbox(props: IRKCInputProps): React.JSX.Element {
	const { field, fieldState } = useController({
		control: props.control,
		defaultValue: '',
		name: props.name,
		rules: props.rules,
	});

	return <CheckBox
		{...props}
		checked={field.value}
		onChange={field.onChange}
		status={fieldState.invalid ? 'danger' : 'basic'}
	>{props.children}</CheckBox>

}
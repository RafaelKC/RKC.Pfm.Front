import { Control, useController } from 'react-hook-form';
import { RegisterOptions } from 'react-hook-form/dist/types/validator';
import React, { useCallback, useState } from 'react';
import { useTranslation } from '../contex/TranslationContext';
import Moment from 'moment/moment';
import { Input } from '@ui-kitten/components';
import MonthPicker from 'react-native-month-year-picker';
import 'moment/locale/pt-br';
import { StyleProp, TextStyle } from 'react-native';

interface RkcMonthPickerInputProps {
	style?: StyleProp<TextStyle>;
	label?: string;
	placeholder?: string;
	mode?: 'full' | 'short' | 'number' | 'shortNumber';
	control: Control<any>;
	name: string;
	rules?: Omit<
		RegisterOptions<any, any>,
		'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
	>;
}

export function RkcMonthPicker(props: RkcMonthPickerInputProps): React.JSX.Element {
	const { locale } = useTranslation();
	const { field, fieldState } = useController({
			control: props.control,
			defaultValue: '',
			name: props.name,
			rules: props.rules,
	});

	const [open, setOpen] = useState(false);

	field.value = new Date();
	const getFormattedValue = (data: Date): string => {
		const moment = Moment(data);
		moment.locale(locale?? 'en');
		return moment.format('MMMM, YYYY');
	}

	const [formattedValue, setFormattedValue] = useState<string>(getFormattedValue(field.value));

	const showPicker = useCallback((value: boolean) => setOpen(value), []);

	const handleChange = useCallback(
		(newDate: Date) => {
			const selectedDate = newDate || field.value;
			
			showPicker(false);
			field.onChange(selectedDate);
			setFormattedValue(getFormattedValue(selectedDate));
		},
		[field.value, showPicker],
	);

	return <>
		<Input
			label={props.label}
			placeholder={props.placeholder}
			value={formattedValue}
			editable={false}
			onFocus={() => showPicker(true)}
			style={props.style}
			status={fieldState.invalid ? 'danger' : 'basic'}
		></Input>

		{!open ? <></>:
			<MonthPicker
				onChange={(_, newDate: Date) => handleChange(newDate)}
				value={field.value}
				locale={locale}
				mode={props.mode}
			/>
		}
	</>
}
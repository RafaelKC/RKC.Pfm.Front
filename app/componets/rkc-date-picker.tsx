import { Datepicker, DatepickerProps, I18nConfig, NativeDateService } from '@ui-kitten/components';
import { Control, useController } from 'react-hook-form';
import { RegisterOptions } from 'react-hook-form/dist/types/validator';
import React from 'react';
import { useTranslation } from '../contex/TranslationContext';
import { NativeDateServiceOptions } from '@ui-kitten/components/ui/calendar/service/nativeDate.service';

interface RkcDatePickerInputProps extends DatepickerProps {
	control: Control<any>;
	name: string;
	rules?: Omit<
		RegisterOptions<any, any>,
		'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
	>;
}

export function RkcDatePicker(props: RkcDatePickerInputProps): React.JSX.Element {
	const { locale } = useTranslation();

	const { field, fieldState } = useController({
		control: props.control,
		defaultValue: '',
		name: props.name,
		rules: props.rules,
	});

	const ptTranslation: I18nConfig = {
		dayNames: {
			short: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'],
			long:  ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feita', 'Sexta', 'Sábado']
		},
		monthNames: {
			short: ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez',],
			long: [
				'Janeiro',
				'Fevereiro',
				'Março',
				'Abril',
				'Maio',
				'Junho',
				'Julho',
				'Agosto',
				'Setembro',
				'Outubro',
				'Novembro',
				'Dezembro',
			]
		}
	}

	const options: NativeDateServiceOptions = {
		i18n: locale === 'pt' ? ptTranslation : undefined,
		format: locale === 'pt' ? 'DD/MM/YYYY' : 'MM/DD/YYYY'
	}

	const formatDateService = new NativeDateService(locale, options);

	return <Datepicker
		{...props}
		dateService={formatDateService}
		date={field.value}
		onSelect={field.onChange}
		status={fieldState.invalid ? 'danger' : 'basic'}
	/>

}
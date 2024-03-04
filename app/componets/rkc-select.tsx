import { Control, useController } from 'react-hook-form';
import { RegisterOptions } from 'react-hook-form/dist/types/validator';
import React, { useEffect, useState } from 'react';
import { PagedResult } from '../dtos/commun/paged-result';
import { PagedFilteredInput } from '../dtos/commun/paged-filtered-input';
import { IndexPath, Input, Select } from '@ui-kitten/components';
import { TouchableOpacityProps } from 'react-native-gesture-handler';
import { ImageProps } from '@rneui/base';
import { useTranslation } from '../contex/TranslationContext';
import { RenderProp } from '@ui-kitten/components/devsupport';
import { TextProps } from 'react-native';

export interface SelectRenderItemInfo<ItemT> {
	item: ItemT;
	index: number;
}

export type SelectRenderItem<ItemT> = (info: SelectRenderItemInfo<ItemT>) => React.JSX.Element;

export interface IRKCSelectOptions<ItemT> extends TouchableOpacityProps{
	renderItems: SelectRenderItem<ItemT>;
	loadItems: (filter: PagedFilteredInput) => Promise<PagedResult<ItemT> | undefined>;
	onSelect?: (items: ItemT, index: IndexPath) => void;
	onSelectMultiply?: (items: ItemT[], index: IndexPath[]) => void;
	getItemValue?: (items: ItemT) => any;
	getRenderValueMultiply?: (items:ItemT[]) => RenderProp<TextProps> | string;
	getRenderValue?: (items: ItemT) => RenderProp<TextProps> | string;
	getIndexOnList?: (selectValue: any | any[], items: ItemT[]) => IndexPath | IndexPath[];

	placeholder?: string;
	size?: 'small' | 'medium' | 'large' ;
	label?: string;
	multiSelect?: boolean;
	accessoryLeft?: RenderProp<Partial<ImageProps>>
	accessoryRight?: RenderProp<Partial<ImageProps>>
}

export interface IRKCSelectProps<ItemT extends any = null> extends TouchableOpacityProps{
	options: IRKCSelectOptions<ItemT>;
	name: string;
	control: Control<any>;
	rules?: Omit<
		RegisterOptions<any, any>,
		'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
	>;
}

export function RkcSelect<ItemT extends any = null>(props: IRKCSelectProps<ItemT>): React.JSX.Element {
	const [loaded, setLoaded] = useState(false);
	const [pagedResult, setPagedResult] = useState<PagedResult<ItemT>>();
	const [renderValue, setRenderValue] = useState<RenderProp<TextProps> | string>();
	const [selectedIndex, setSelectedIndex] = useState<IndexPath | IndexPath[]>(new IndexPath(0));
	const { i18n } = useTranslation();

	const { field, fieldState } = useController({
		control: props.control,
		defaultValue: '',
		name: props.name,
		rules: props.rules,
	});

	const load = async () => {
		const filter = new PagedFilteredInput();
		filter.maxResultCount = 10;

		const result = await props.options.loadItems(filter);
		if (result) {
			setPagedResult(result);
		} else {
			setPagedResult({ items: [], totalCount: 0 });
		}

		setLoaded(true);
		setSelected()
	}

	const setSelected = () => {
		const hasValue = field.value != null && field.value !== '';
		const hasHowToFindIndex = props.options.getIndexOnList && pagedResult;

		if (!hasValue || !hasHowToFindIndex) {
			setSelectedIndex([])
			field.onChange(null);
		} else if (!hasValue) {
			if (props.options.getIndexOnList) {
				setSelectedIndex(props.options.getIndexOnList(field.value, pagedResult.items))
			}
		}
	}

	useEffect(() => {
		load();
	}, []);


	const handleSelected = (path: IndexPath | IndexPath[]) => {
		setSelectedIndex(path);
		if (pagedResult?.items) {
			if (props.options.multiSelect) {
				const itens = (path as IndexPath[]).map(path => {
					return pagedResult.items[path.row];
				})
				if (props.options.onSelectMultiply) {
					props.options.onSelectMultiply(itens, (path as IndexPath[]));
				}

				const itemsValues= itens.map(item => {
					if (props.options.getItemValue) {
						return props.options.getItemValue(item)
					}
				});
				field.onChange(itemsValues);
				if (props.options.getRenderValueMultiply) {
					setRenderValue(props.options.getRenderValueMultiply(itemsValues))
				}
			} else {
				const indexFirst = (path as IndexPath).row;
				const firstSelect = pagedResult.items[indexFirst];
				if (firstSelect) {
					if (props.options.onSelect) {
						props.options.onSelect(firstSelect, (path as IndexPath));
					}
					if (props.options.getItemValue) {
						field.onChange(props.options.getItemValue(firstSelect));
					}
					if (props.options.getRenderValue) {
						setRenderValue(props.options.getRenderValue(firstSelect))
					}
				}
			}
		}
	}

	const Loading = () => {
		return <Input readOnly={true} label={props.options.label} value={'Carregando...'} ></Input>
	}

	return !loaded ? <Loading/> : <Select
		{...props}
		{...props.options}
		value={renderValue}
		selectedIndex={selectedIndex}
		status={fieldState.invalid ? 'danger' : 'basic'}
		onSelect={handleSelected}
	>
		{ pagedResult?.items
			.map((item, index) => props.options.renderItems({ item: item, index }))
		}
	</Select>

}


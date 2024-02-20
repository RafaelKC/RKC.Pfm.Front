import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { ListRenderItem } from '@react-native/virtualized-lists';
import { PagedFilteredInput } from '../dtos/commun/paged-filtered-input';
import { PagedResult } from '../dtos/commun/paged-result';
import { Skeleton } from '@rneui/base';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Icon, Layout, List, Text, useTheme } from '@ui-kitten/components';
import { useTranslation } from '../contex/TranslationContext';

interface RkcListInput<ItemT> {
	renderItem: ListRenderItem<ItemT> | null | undefined;
	loadItems: (input: PagedFilteredInput) => Promise<PagedResult<ItemT> | undefined>;
	loadOnInit: boolean;
}

export interface IRkcListRef {
	reload: () => void;
}

export const RkcList = forwardRef(RkcListComponent<any>);

function RkcListComponent<TItem>(
	{ loadItems, renderItem, loadOnInit }: RkcListInput<TItem>,
	ref: React.ForwardedRef<IRkcListRef>): React.JSX.Element {
	useImperativeHandle(ref, () => ({
		reload() {
			load();
		},
	}));

	const [loaded, setLoaded] = useState(false);
	const [loading, setLoading] = useState(loadOnInit)
	const [error, setError] = useState(false)
	const [pagedResult, setPagedResult] = useState<PagedResult<any>>();
	const { i18n } = useTranslation()
	const theme = useTheme();

	const load = async () => {
		setLoading(true);
		setLoaded(false);
		setError(false);

		const filter = new PagedFilteredInput();
		filter.maxResultCount = 10;

		const result = await loadItems(filter);
		if (result) {
			setPagedResult(result);
		} else  {
			setError(true);
		}

		setLoading(false);
		setLoaded(true);
	}

	useEffect(() => {
		if (loadOnInit) {
			load();
		}
	}, []);

	const hasItens = () => {
		return pagedResult != null && pagedResult.totalCount > 0;
	}

	const LoadedScreen = (): React.JSX.Element => (
		<>{ error ? <ErrorScreen/> : <ListScreen/> }</>
	);

	const ListScreen = (): React.JSX.Element => (
		<>{ hasItens() ? <WithItemsListScreen/> : <EmptyListScreen/>}</>
	);

	const ErrorScreen = (): React.JSX.Element => (
		<Layout style={baseStyles.actionScreem}>
			<Text>{i18n?.t('components.list.error')}</Text>
			<ReloadButton/>
		</Layout>
	);

	const EmptyListScreen = (): React.JSX.Element => (
		<Layout style={baseStyles.actionScreem}>
			<Text>{i18n?.t('components.list.empty')}</Text>
			<ReloadButton/>
		</Layout>
	);

	const NotLoadedScreen = (): React.JSX.Element => (
		<>{loading ? <LoadingScreen/> : <LoadScreen/>}</>
	);

	const LoadScreen = (): React.JSX.Element => (
		<Layout style={baseStyles.actionScreem}>
			<Text>{i18n?.t('components.list.load')}</Text>
			<ReloadButton/>
		</Layout>
	);

	const WithItemsListScreen = (): React.JSX.Element => (
		<List data={pagedResult?.items} renderItem={renderItem} style={baseStyles.list} />
	);

	const ReloadButton = () => {
		return (<TouchableWithoutFeedback onPress={load}>
			<Icon style={baseStyles.reloadIcon} name={'refresh-outline'} fill={theme['text-basic-color']}/>
		</TouchableWithoutFeedback>);
	}

	return <Layout style={baseStyles.backgroud}>{loaded ? <LoadedScreen /> : <NotLoadedScreen/>}</Layout>;
}

const LoadingScreen = (): React.JSX.Element[] => {
	const skeletons = new Array<React.JSX.Element>();

	for (let i = 0; i < 9; i++) {
		skeletons.push(
			<Skeleton
				LinearGradientComponent={LinearGradient}
				animation='wave'
				style={baseStyles.skeleton}
				height={75}
				key={i}
			/>,
		);
	}

	return skeletons;
};

const baseStyles = StyleSheet.create({
	skeleton: {
		width: '100%',
		borderRadius: 5,
	},
	list: {
		backgroundColor: 'invisivble',
		width: '100%',
		height: '100%',
		gap: 8,
		display: 'flex',
	},
	reloadIcon: {
		width: 24,
		height: 24,
	},
	actionScreem: {
		backgroundColor: 'invisivble',
		display: 'flex',
		flexDirection: 'row',
		gap: 8,
		justifyContent: 'center',
		alignItems: 'center'
	},
	backgroud: {
		backgroundColor: 'invisivble',
		display: 'flex',
		gap: 5,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		height: '100%'
	}
});
import React, { useEffect, useState } from 'react';
import Moment from 'moment';
import { Icon, Layout, List, ListItem, Text, useStyleSheet, useTheme } from '@ui-kitten/components';
import { Skeleton } from '@rneui/base';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { PeriodService } from '../../services/period-service';
import { PeriodsGetListInput } from '../../dtos/periods-get-list-input';
import { PeriodState } from '../../enums/period-state.enum';
import { PeriodsDto } from '../../dtos/periods-dto';
import { PagedResult } from '../../dtos/commun/paged-result';
import { useTranslation } from '../../contex/TranslationContext';
import { FAB } from '@rneui/themed';
import { NavigationProp } from '@react-navigation/native';
import { Screens } from '../screens.conts';

export function Periods({ navigation }: { navigation: NavigationProp<any> }): React.JSX.Element {
	const [loaded, setLoaded] = useState(false);
	const [ascending, setAscending] = useState(true);
	const [pagedResult, setPagedResult] = useState<PagedResult<PeriodsDto>>();
	const { locale, i18n } = useTranslation();

	const theme = useTheme();
	const styles = useStyleSheet(baseStyles);

	const loadPeriods = async () => {
		const input = new PeriodsGetListInput();
		input.orderAscending = ascending;
		input.endOnOrBeforeFilter = new Date();
		input.maxResultCount = 10;

		const periods = await PeriodService.getList(input);
		if (Boolean(periods)) {
			setLoaded(true);
			setPagedResult(periods);
		}
	};

	useEffect(() => {
		setLoaded(false);
		loadPeriods();
	}, [ascending]);

	useEffect(() => {
		Moment.locale(locale ?? 'en');
	}, [locale]);

	const handleAcendingChange = () => {
		setAscending(!ascending);
	};

	const stateIcon = (state: PeriodState) => {
		let icon = 'checkmark-circle-2-outline';
		let color = theme['color-success-focus'];

		if (state === PeriodState.Current) {
			icon = 'play-circle-outline';
			color = theme['color-info-400'];
		}
		if (state === PeriodState.Finalized) {
			icon = 'minus-circle-outline';
			color = theme['color-warning-default'];
		}

		return (props: any) => <Icon {...props} fill={color} name={icon} />;
	};

	const renderItem = ({ item }: { item: PeriodsDto }): React.ReactElement => (
		<ListItem
			style={styles.listItem}
			title={Moment(item.start).format('MMM YY')}
			description={item.name}
			accessoryRight={stateIcon(item.state)}
		/>
	);

	const LoadedScreen = (): React.JSX.Element => (
		<List data={pagedResult?.items} renderItem={renderItem} style={styles.list} />
	);

	return (
		<Layout style={styles.backgroud} level='2'>
			<Layout style={styles.actonsContainer}>
				<TouchableWithoutFeedback onPress={handleAcendingChange}>
					<Icon
						name={ascending ? 'arrow-up-outline' : 'arrow-down-outline'}
						style={styles.icon}
						fill={theme['text-basic-color']}></Icon>
				</TouchableWithoutFeedback>
				<Text category='label' style={styles.actionText}>
					{ascending ? 'Mais antigas primeiro' : 'Mais novas primeiro'}
				</Text>
			</Layout>
			{loaded ? <LoadedScreen /> : <LoadingScreen />}
			<FAB
				onPress={() => navigation.navigate(i18n?.t(Screens.periodsCreate) ?? Screens.periodsCreate)}
				style={styles.fab}
				placement={'right'}
				color={theme['color-basic-700']}
				icon={{ name: 'add', color: theme['color-basic-100'] }}
			/>
		</Layout>
	);
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
	backgroud: {
		height: '100%',
		padding: 16,
		display: 'flex',
		gap: 8,
	},
	skeleton: {
		width: '100%',
		borderRadius: 5,
	},
	icon: {
		width: 28,
		height: 28,
	},
	actionText: {
		color: 'text-basic-color',
	},
	actonsContainer: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'background-basic-color-2',
	},
	listItem: {
		backgroundColor: 'background-basic-color-4',
		borderRadius: 5,
		height: 75,
	},
	list: {
		backgroundColor: 'invisivble',
	},
	fab: {
		marginBottom: 32
	}
});

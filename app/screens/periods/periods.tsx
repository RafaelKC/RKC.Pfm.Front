import React, { useEffect, useRef, useState } from 'react';
import Moment from 'moment';
import { Icon, Layout, ListItem, Text, useStyleSheet, useTheme } from '@ui-kitten/components';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { PeriodService } from '../../services/period-service';
import { PeriodsGetListInput } from '../../dtos/periods-get-list-input';
import { PeriodState } from '../../enums/period-state.enum';
import { PeriodsDto } from '../../dtos/periods-dto';
import { useTranslation } from '../../contex/TranslationContext';
import { FAB } from '@rneui/themed';
import { NavigationProp } from '@react-navigation/native';
import { Screens } from '../screens.conts';
import { IRkcListRef, RkcList } from '../../componets/rkc-list';
import { PagedFilteredInput } from '../../dtos/commun/paged-filtered-input';

export function Periods({ navigation }: { navigation: NavigationProp<any> }): React.JSX.Element {
	const [ascending, setAscending] = useState(true);
	const { locale, i18n } = useTranslation();
	const [fistEffectApplied, setFistEffectApplied] = useState(false);

	const childRef = useRef<IRkcListRef>(null);

	const theme = useTheme();
	const styles = useStyleSheet(baseStyles);

	const loadPeriods = async (listInput: PagedFilteredInput) => {
		const input = listInput as PeriodsGetListInput;
		input.orderAscending = ascending;
		input.endOnOrBeforeFilter = new Date();
		input.maxResultCount = 10;
		return await PeriodService.getList(input);
	};

	useEffect(() => {
		if (fistEffectApplied) {
			childRef.current?.reload();
		} else {
			setFistEffectApplied(true);
		}
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
			<RkcList loadOnInit={true} loadItems={loadPeriods} ref={childRef} renderItem={renderItem} />
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

const baseStyles = StyleSheet.create({
	backgroud: {
		height: '100%',
		padding: 16,
		display: 'flex',
		gap: 8,
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
		width: '100%',
		marginBottom: 5
	},
	fab: {
		marginBottom: 32
	}
});

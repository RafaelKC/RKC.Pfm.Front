import { PeriodState } from '../enums/period-state.enum';

export class PeriodsDto {
	public id: string;
	public name: string;
	public start: Date;
	public end: Date;
	public isSchema: boolean;
	public idSchemaPeriod?: string;

	public get state(): PeriodState {
		const currentDate = new Date();

		const finalized = currentDate > this.end;
		const planned = currentDate < this.start;

		if (finalized) return PeriodState.Finalized;
		if (planned) return PeriodState.Planned;
		return PeriodState.Current;
	}
}
import { PeriodsGetListInput } from '../dtos/periods-get-list-input';
import { PagedResult } from '../dtos/commun/paged-result';
import { PeriodsDto } from '../dtos/periods-dto';
import { HttpService } from '../utils/http-service';
import { IPeriodsUpdateInput } from '../dtos/periods-update-input';

export class PeriodService {
	private static readonly periodsRoute = 'periods';

	public static async getList(input: PeriodsGetListInput): Promise<PagedResult<PeriodsDto> | undefined> {
		const result = await HttpService.get<PagedResult<PeriodsDto>>(this.periodsRoute, input);
		return result.data
	}

	public static async get(periodId: string): Promise<PeriodsDto | undefined> {
		const result = await HttpService.get<PeriodsDto>(`${this.periodsRoute}/${periodId}`);
		return result.data
	}

	public static async create(input: PeriodsDto): Promise<void> {
		await HttpService.post(this.periodsRoute, input);
	}

	public static async update(periodId: string, input: IPeriodsUpdateInput): Promise<void> {
		await HttpService.put(`${this.periodsRoute}/${periodId}`, input);
	}

	public static async delete(periodId: string): Promise<void> {
		await HttpService.delete(`${this.periodsRoute}/${periodId}`);
	}
}
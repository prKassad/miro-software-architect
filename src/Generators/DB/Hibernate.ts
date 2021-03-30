import {IDataBaseModel, IDatabaseGenerator} from '../../Interfaces'

export class HibernateDatabaseGenerator implements IDatabaseGenerator {
	generate(model: IDataBaseModel): string {
		return 'Coming soon'
	}
}

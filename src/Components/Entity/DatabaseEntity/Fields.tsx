import {Button, ButtonType} from '../../Reusable/Button'
import {Component, h} from 'preact'
import {IEntityFieldMetaWithWidgetId, IEntityFieldsMetaWithWidgetId} from '../../../Interfaces'

import {DatabaseEntityField} from './Field'
import {Separator} from '../../Reusable/Separator'

export interface IDatabaseEntityFieldsContainerProps {
	fieldsContainer: IEntityFieldsMetaWithWidgetId
	fieldContainers: IEntityFieldMetaWithWidgetId[]
	onFieldUpdated(index: number, field: IEntityFieldMetaWithWidgetId)
	onFieldRemoved(index: number)
}

export class DatabaseEntityFieldsContainer extends Component<IDatabaseEntityFieldsContainerProps, {}> {
	render() {
		return (
			<div>
				{this.props.fieldContainers.map((field, index) => (
					<div key={index}>
						<Separator text={`Field ${index + 1}`} />
						<DatabaseEntityField
							field={field}
							index={index}
							setField={(field: IEntityFieldMetaWithWidgetId) => this.props.onFieldUpdated(index, field)}
						></DatabaseEntityField>
						<Button type={ButtonType.SECONDARY} onClick={(e) => this.props.onFieldRemoved(index)} textColor="#e01616">
							Remove field
						</Button>
					</div>
				))}
			</div>
		)
	}
}

import {Component, h} from 'preact'

import {IEntityNameMetaWithWidgetId} from '../../../Interfaces'
import {Input} from '../../Reusable/Input'

export interface IDatabaseEntityTitleContainerProps {
	nameContainer: IEntityNameMetaWithWidgetId
	onNameUpdated(name: string)
}

export class DatabaseEntityNameContainer extends Component<IDatabaseEntityTitleContainerProps, {}> {
	render() {
		return (
			<div>
				<Input
					label="Name"
					type="text"
					value={this.props.nameContainer.name}
					onChange={(e) => this.props.onNameUpdated(e.currentTarget.value)}
				></Input>
			</div>
		)
	}
}

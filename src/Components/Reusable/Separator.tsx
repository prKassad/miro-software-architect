import {h} from 'preact'

export interface ISeparatorProps {
	text?: string
}

export const Separator = ({text = ''}: ISeparatorProps) => (
	<p
		style={{
			height: '15px',
			width: '100%',
			borderBottom: 'solid 1px #CDCCD7',
			textAlign: 'center',
			margin: '17px 0px 20px 0',
		}}
	>
		<span
			style={{
				background: '#fff',
				position: 'relative',
				top: '0',
				padding: '0 8px',
				lineHeight: '30px',
				color: '#333',
			}}
		>
			{text}
		</span>
	</p>
)

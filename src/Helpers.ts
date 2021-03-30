import {
	APP_ID,
	EMPTY_CELLS_ON_FIELDS_CONTINER,
	ENTITY_CONTINER_WIDTH,
	ENTITY_FIELD_CONTINER_HEIGHT,
	ENTITY_NAME_CONTINER_HEIGHT,
} from './Config'
import {DataBaseFieldType, IAppMetadata, WidgetType} from './Interfaces'

//////////////////////////////////////////////////////////////////////
// Virtual tree traversal
//////////////////////////////////////////////////////////////////////

/**
 * Check that widget is root (WidgetType = ENTITY_NAME_CONTAINER)
 * @param widgetId wdiget id
 */
export const isRootWidget = async (widgetId: string) => {
	const widgets: SDK.ILineWidget[] = await miro.board.widgets.get({
		id: widgetId,
		metadata: {[APP_ID]: {widgetType: WidgetType.ENTITY_NAME_CONTAINER}},
	})
	return widgets.length === 1
}

/**
 * Find id of root widget traversal along service edges
 * @param widgetId wdiget id
 */
export const findRootWidgetId = async (widgetId: string): Promise<string | null> => {
	const edges: SDK.ILineWidget[] =
		(await miro.board.widgets.get({
			endWidgetId: widgetId,
			metadata: {[APP_ID]: {widgetType: WidgetType.SERVICE_EDGE}},
		})) || []
	if (edges.length === 1) return edges[0].startWidgetId || null
	return null
}

/**
 * Find children widget ids traversal along service edges
 * @param widgetId root wdiget id
 */
export const findChildrenWidgetIds = async (widgetId: string): Promise<string[]> => {
	const edges: SDK.ILineWidget[] = await miro.board.widgets.get({
		startWidgetId: widgetId,
		metadata: {[APP_ID]: {widgetType: WidgetType.SERVICE_EDGE}},
	})
	// Lol. TS lint swears on this
	// return edges
	//   .map((e: SDK.ILineWidget) => e.endWidgetId || null)
	//   .filter(s => s !== null);
	return edges.map((e: SDK.ILineWidget) => e.endWidgetId || '').filter((s) => s !== '')
}

/**
 * Find reachable wdiget ids traversal along service edges
 * @param widgetId wdiget id
 * @param includeCurrent place current widget to result
 */
export const findReachableWidgetIds = async (widgetId: string, includeCurrent: boolean = false): Promise<string[]> => {
	const rootId: string | null = await findRootWidgetId(widgetId)
	if (rootId) {
		const childrens: string[] = await findChildrenWidgetIds(rootId)
		const result: string[] = [rootId, ...childrens]
		return includeCurrent ? result : result.filter((id: string) => id !== widgetId)
	} else {
		const childrens: string[] = await findChildrenWidgetIds(widgetId)
		return includeCurrent ? [widgetId, ...childrens] : childrens
	}
	return []
}

//////////////////////////////////////////////////////////////////////
// Styled text on widgets
//////////////////////////////////////////////////////////////////////

/**
 * Get styled marker text
 * @param text
 * @param bgColor
 */
export const getMarkerText = (text: string, bgColor: string): string =>
	`<span style="background-color: ${bgColor};">${text}</span>`

/**
 * Get styled field text for widget
 * @param options
 */
export const genFieldTextWidget = ({
	autoIncrement,
	primaryKey,
	notNull,
	unique,
	foreginKey,
	name,
	type,
}: {
	autoIncrement: boolean
	primaryKey: boolean
	notNull: boolean
	unique: boolean
	foreginKey: boolean
	name: string
	type: DataBaseFieldType
}): string => {
	let markers: string[] = []
	if (autoIncrement) markers.push(getMarkerText('AI', '#abfe45'))
	if (primaryKey) markers.push(getMarkerText('PK', '#fef445'))
	if (notNull) markers.push(getMarkerText('NN', '#f272c7'))
	if (unique) markers.push(getMarkerText('UQ', '#a572f2'))
	if (foreginKey) markers.push(getMarkerText('FK', '#45dcfe'))

	const textMarkers = markers.join(' ')
	const textType: string = DataBaseFieldType[type]
	return `<span style="color: #494857;">${name} : ${textType} ${textMarkers}</span>`
}

//////////////////////////////////////////////////////////////////////
// Widget factories
//////////////////////////////////////////////////////////////////////

/**
 * Convert start coords to center
 * @param x
 * @param y
 * @param width
 * @param height
 */
export const convertStartToCenterCoords = (x: number, y: number, width: number, height: number) => {
	return {x: x + width / 2, y: y + height / 2, width, height}
}

export const genServiceEdgeWidget = ({
	startWidgetId,
	endWidgetId,
}: {
	startWidgetId: string
	endWidgetId: string
}): SDK.ILineWidget => {
	return {
		type: 'LINE',
		startWidgetId,
		endWidgetId,
		capabilities: {
			editable: false,
		},
		metadata: {
			[APP_ID]: {
				widgetType: WidgetType.SERVICE_EDGE,
			},
		},
		clientVisible: false,
		// @ts-ignore Why style params in SDK not optional?
		style: {
			lineColor: 'transparent',
			lineThickness: 0,
		},
	}
}

export const genEnitityNameWidget = ({
	x = 0,
	y = 0,
	width = ENTITY_CONTINER_WIDTH,
	height = ENTITY_NAME_CONTINER_HEIGHT,
	color = '#000',
	name = 'newField',
}: {
	x?: number
	y?: number
	width?: number
	height?: number
	color?: string
	name?: string
}): SDK.IShapeWidget => {
	const metadata: IAppMetadata = {
		widgetType: WidgetType.ENTITY_NAME_CONTAINER,
		data: {
			name,
		},
	}
	return {
		type: 'SHAPE',
		metadata: {
			[APP_ID]: metadata,
		},
		capabilities: {
			editable: false,
		},
		// @ts-ignore Why params in SDK not optional?
		style: {
			backgroundColor: `#${color}`,
			borderColor: '#1A1A1A',
			textColor: '#FFFFFF',
			borderWidth: 1,
			borderOpacity: 1,
		},
		...convertStartToCenterCoords(x, y, width, height),
		text: name,
	}
}

export const genEnityFieldWidget = ({
	x = 0,
	y = 0,
	position = 0,
	clientVisible = true,
	width = ENTITY_CONTINER_WIDTH,
	height = ENTITY_FIELD_CONTINER_HEIGHT,
	name = 'id',
	default_: defaultValue = '',
	length = null,
	type = DataBaseFieldType.integer,
	autoIncrement = true,
	primaryKey = true,
	notNull = false,
	unique = false,
	foreginKey = false,
}: {
	x?: number
	y?: number
	position?: number
	clientVisible?: boolean
	width?: number
	height?: number
	name?: string
	default_?: string
	length?: number | null
	type?: DataBaseFieldType
	autoIncrement?: boolean
	primaryKey?: boolean
	notNull?: boolean
	unique?: boolean
	foreginKey?: boolean
}): SDK.IShapeWidget => {
	const metadata: IAppMetadata = {
		widgetType: WidgetType.ENTITY_FIELD_CONTINER,
		data: {
			position,
			name,
			defaultValue,
			length,
			type,
			autoIncrement,
			primaryKey,
			notNull,
			unique,
			foreginKey,
		},
	}

	const text = genFieldTextWidget({
		name,
		type,
		autoIncrement,
		primaryKey,
		notNull,
		unique,
		foreginKey,
	})

	return {
		type: 'SHAPE',
		capabilities: {
			editable: false,
		},
		clientVisible: clientVisible,
		metadata: {
			[APP_ID]: metadata,
		},
		text,
		...convertStartToCenterCoords(x, y, width, height),
		// @ts-ignore Why params in SDK not optional?
		style: {
			backgroundColor: 'transparent',
			borderColor: 'transparent',
			fontFamily: 0,
			fontSize: 12,
			textAlign: 'l',
			textAlignVertical: 'm',
			textColor: '#1A1A1A',
		},
	}
}

export const genEntityFieldsWidget = ({
	x = 0,
	y = 0,
	width = ENTITY_CONTINER_WIDTH,
	height = (EMPTY_CELLS_ON_FIELDS_CONTINER + 1) * ENTITY_FIELD_CONTINER_HEIGHT,
}: {
	x?: number
	y?: number
	width?: number
	height?: number
}): SDK.IShapeWidget => {
	const metadata = {
		widgetType: WidgetType.ENTITY_FIELDS_CONTAINER,
	}
	return {
		type: 'SHAPE',
		capabilities: {
			editable: false,
		},
		metadata: {
			[APP_ID]: metadata,
		},
		// @ts-ignore Why params in SDK not optional?
		style: {
			shapeType: 3,
			backgroundColor: '#E1E0E7',
			backgroundOpacity: 1,
			borderColor: '#1A1A1A',
			borderWidth: 1,
			borderOpacity: 1,
			borderStyle: 2,
		},
		...convertStartToCenterCoords(x, y, width, height),
	}
}

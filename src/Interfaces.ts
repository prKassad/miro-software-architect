export enum DataBaseFieldType {
	'binary' = 0,
	'blob' = 1,
	'date' = 2,
	'datetime' = 3,
	'decimal' = 4,
	'float' = 5,
	'integer' = 6,
	'string' = 7,
	'text' = 8,
	'time' = 9,
	'timestamp' = 10,
	'varchar' = 11,
}
export interface IEntityMeta {}

export interface IEntityNameMeta extends IEntityMeta {
	name: string
}

export interface IEntityFieldsMeta extends IEntityMeta {}

export interface IEntityFieldMeta extends IEntityMeta {
	position: number
	name: string
	type: DataBaseFieldType
	defaultValue: string
	length: number | null
	primaryKey: boolean
	notNull: boolean
	unique: boolean
	autoIncrement: boolean
	foreginKey: boolean
}

export type Meta = IEntityNameMeta | IEntityFieldsMeta | IEntityFieldMeta

export enum WidgetType {
	ENTITY_NAME_CONTAINER,
	ENTITY_FIELDS_CONTAINER,
	ENTITY_FIELD_CONTINER,
	SERVICE_EDGE,
}

export interface IAppMetadata {
	widgetType: WidgetType
	data?: Meta
}

export interface IWidgetId {
	widgetId: string
}

export interface IEntityNameMetaWithWidgetId extends IEntityNameMeta, IWidgetId {}

export interface IEntityFieldsMetaWithWidgetId extends IEntityFieldsMeta, IWidgetId {}

export interface IEntityFieldMetaWithWidgetId extends IEntityFieldMeta, IWidgetId {}

export interface IDataBaseEntity {
	widgetId: string
	name: string
	fields: IEntityFieldMetaWithWidgetId[]
}

export interface IDataBaseModel {
	entities: IDataBaseEntity[]
}

export interface IDatabaseGenerator {
	generate(model: IDataBaseModel): string
}

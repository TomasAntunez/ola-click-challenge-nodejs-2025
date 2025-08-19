import {
  AllowNull,
  Column,
  DataType,
  Default,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

import { OrderItem } from './order-item.entity';

@Table
export class Order extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  declare clientName: string;

  @HasMany(() => OrderItem, { onDelete: 'CASCADE', as: 'items' })
  declare items: OrderItem[];
}

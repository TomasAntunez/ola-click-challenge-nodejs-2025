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

export enum OrderStatus {
  INITIATED = 'initiated',
  SENT = 'sent',
  DELIVERED = 'delivered',
}

@Table
export class Order extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  declare clientName: string;

  @Default(OrderStatus.INITIATED)
  @Column(DataType.ENUM(...Object.values(OrderStatus)))
  declare status: OrderStatus;

  @HasMany(() => OrderItem, { onDelete: 'CASCADE', as: 'items' })
  declare items: OrderItem[];
}

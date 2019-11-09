import {
  Column,
  CreatedAt,
  Model,
  Table,
  UpdatedAt,
  DataType,
  PrimaryKey,
} from 'sequelize-typescript';
import { IChapter } from 'types/models';

@Table
export class Chapter extends Model<IChapter> {
  @PrimaryKey
  @Column
  id!: number;

  @Column
  name!: string;

  @Column
  description!: string;

  @Column
  category!: string;

  @Column(DataType.JSON)
  details!: any;

  @Column
  creatorId!: number;

  @CreatedAt
  @Column
  created_at!: Date;

  @UpdatedAt
  @Column
  updated_at!: Date;
}

import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Url {
  @PrimaryColumn()
  id: string;

  @Column({
    unique: true,
  })
  longUrl: string;

  @Column()
  shortUrl: string;
}

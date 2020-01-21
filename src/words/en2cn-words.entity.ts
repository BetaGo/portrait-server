import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class En2CnWord {
  @PrimaryColumn({ length: 32, default: '' })
  word: string;

  @Column({ length: 512 })
  translation: string;
}

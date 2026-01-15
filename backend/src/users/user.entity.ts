import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  CreateDateColumn, 
  UpdateDateColumn 
} from 'typeorm';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  firstName: string;

  @Column()
  @IsNotEmpty()
  lastName: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @MinLength(6)
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
import { Community } from 'src/community/community.entity';
import { Proposal } from 'src/proposal/proposal.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Auction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: true })
  visible: boolean;

  @Column()
  title: string;

  @Column()
  startTime: Date;

  @Column()
  proposalEndTime: Date;

  @Column()
  votingEndTime: Date;

  @Column()
  amountEth: number;

  @Column()
  numWinners: number;

  @OneToMany(() => Proposal, (proposal) => proposal.auction, {
    eager: true,
  })
  @JoinColumn()
  proposals: Proposal[];

  @ManyToOne(() => Community, (community) => community.auctions)
  @JoinColumn()
  community: Community;

  @Column()
  createdDate: Date;

  @Column({ nullable: true })
  lastUpdatedDate: Date;

  @BeforeInsert()
  setCreatedDate() {
    this.createdDate = new Date();
  }

  @BeforeUpdate()
  setUpdatedDate() {
    this.lastUpdatedDate = new Date();
  }
}

import classes from './FullAuction.module.css';
import Card, { CardBgColor, CardBorderRadius } from '../Card';
import AuctionHeader from '../AuctionHeader';
import ProposalCards from '../ProposalCards';
import AllProposalsCTA from '../AllProposalsCTA';
import { Row, Col } from 'react-bootstrap';
import { StoredAuction } from '@nouns/prop-house-wrapper/dist/builders';

export enum AuctionStatus {
  NotStarted,
  AcceptingProposals,
  Voting,
  Ended,
}

const FullAuction: React.FC<{
  auction: StoredAuction;
  showAllProposals: boolean;
}> = (props) => {
  const { auction, showAllProposals } = props;

  return (
    <Card
      bgColor={CardBgColor.LightPurple}
      borderRadius={CardBorderRadius.thirty}
    >
      <AuctionHeader auction={auction} />
      <Row>
        <Col xs={4} md={2}>
          <div className={classes.proposalTitle}>Proposals</div>
        </Col>
        <Col xs={8} md={10}>
          <div className={classes.divider} />
        </Col>
      </Row>
      <ProposalCards
        proposals={
          showAllProposals ? auction.proposals : auction.proposals.slice(0, 6)
        }
      />
      {!showAllProposals && (
        <AllProposalsCTA
          numProposals={auction.proposals.length}
          auctionId={auction.id}
        />
      )}
    </Card>
  );
};

export default FullAuction;

import classes from './VoteAllotmentTooltip.module.css';
import { useAppSelector } from '../../hooks';
import { FaLink, FaList } from 'react-icons/fa';
import ReactTooltip from 'react-tooltip';
import removeZeroVotesAndSortByVotes from '../../utils/removeZeroVotesAndSortByVotes';
import React from 'react';
import { cmdPlusClicked } from '../../utils/cmdPlusClicked';
import { useNavigate, useParams } from 'react-router-dom';
import { openInNewTab } from '../../utils/openInNewTab';
import { buildRoundPath } from '../../utils/buildRoundPath';

const VoteAllotmentTooltip: React.FC<{}> = () => {
  const community = useAppSelector(state => state.propHouse.activeCommunity);
  const round = useAppSelector(state => state.propHouse.activeRound);
  const voteAllotments = useAppSelector(state => state.voting.voteAllotments);

  const navigate = useNavigate();

  const params = useParams();
  const { id } = params;

  const voteAllotmentsForTooltip = removeZeroVotesAndSortByVotes(voteAllotments).map((v, idx) => (
    <div key={idx} className={classes.votesRow}>
      <div className={classes.voteRowTitle}>
        <span className={classes.votesAndTitle}>
          <span className={classes.propVotes}>
            {v.votes} {v.votes === 1 ? 'vote' : 'votes'} for{' '}
          </span>
          <span className={classes.propTitle}>{v.proposalTitle}</span>
        </span>

        {round && community && (
          <button
            disabled={v.proposalId === Number(id)}
            className={classes.verifyVoteBtn}
            onClick={e => {
              if (cmdPlusClicked(e)) {
                openInNewTab(`${buildRoundPath(community, round)}/${v.proposalId}`);
                return;
              }
              navigate(`${buildRoundPath(community, round)}/${v.proposalId}`);
            }}
          >
            <FaLink />
          </button>
        )}
      </div>
    </div>
  ));
  return (
    <>
      <div
        className="voteTooltip"
        data-tip="custom show"
        data-event="click focus"
        data-iscapture="true"
      >
        <div className={classes.allottedVotesTooltip}>
          <FaList />
        </div>
      </div>

      <ReactTooltip globalEventOff="scroll">
        <div className={classes.votesContainer}>
          {voteAllotmentsForTooltip.length > 0 ? voteAllotmentsForTooltip : 'No votes allotted'}
        </div>
      </ReactTooltip>
    </>
  );
};

export default VoteAllotmentTooltip;

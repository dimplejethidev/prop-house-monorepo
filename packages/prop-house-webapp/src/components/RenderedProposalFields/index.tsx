import classes from './RenderedProposalFields.module.css';
import { Row, Col } from 'react-bootstrap';
import { ProposalFields } from '../../utils/proposalFields';
import EthAddress from '../EthAddress';
import ReactMarkdown from 'react-markdown';
import Markdown from 'markdown-to-jsx';
import sanitizeHtml from 'sanitize-html';
import { useTranslation } from 'react-i18next';

export interface RenderedProposalProps {
  fields: ProposalFields;
  address?: string;
  proposalId?: number;
  backButton?: React.ReactNode;
  community?: any;
  roundName?: string;
}

const RenderedProposalFields: React.FC<RenderedProposalProps> = props => {
  const { fields, address, proposalId, backButton } = props;
  const { t } = useTranslation();

  return (
    <>
      <Row>
        <Col xl={12} className="proposalCopy">
          <div className={classes.headerContainer}>
            <div className={classes.backBtnContainer}>{backButton && backButton}</div>
            <div>
              {address && proposalId && (
                <div className={classes.subinfo}>
                  <div className={classes.propBy}>
                    <span>{t('propCap')}</span>
                    {t('by')}
                    <div className={classes.submittedBy}>
                      <EthAddress address={address} className={classes.submittedBy} />
                    </div>
                  </div>
                </div>
              )}

              <h1>{fields.title}</h1>
            </div>
          </div>

          <span className={classes.proposalBody}>
            {fields.tldr && (
              <>
                <hr></hr>
                <h2>{t('tldr')}</h2>
                <ReactMarkdown className={classes.markdown} children={fields.tldr}></ReactMarkdown>
              </>
            )}

            <h2>{t('description')}</h2>
            {/*
             * We sanitize HTML coming from rich text editor to prevent xss attacks.
             *
             * <Markdown/> component used to render HTML, while supporting Markdown.
             */}
            <Markdown>
              {sanitizeHtml(fields.what, {
                allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
                allowedSchemes: sanitizeHtml.defaults.allowedSchemes.concat(['data']),
                allowedAttributes: {
                  img: ['src', 'alt', 'height', 'width'],
                  a: ['href', 'target'],
                },
                allowedClasses: {
                  code: ['language-*', 'lang-*'],
                  pre: ['language-*', 'lang-*'],
                },
                // edge case: handle ampersands in img links encoded from sanitization
              }).replaceAll('&amp;', '&')}
            </Markdown>
          </span>
        </Col>
      </Row>
    </>
  );
};

export default RenderedProposalFields;

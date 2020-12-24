import React, {useEffect, useState} from 'react';
import {whiskyStore} from '../store';
import {observer} from 'mobx-react-lite';
import caretRight from '../assets/caret-right.svg';
import classNames from 'classnames';
import {Link} from 'react-router-dom';
import {convertToBase64} from '../grabber/grab-whisky';
import {filterHighlightablePart} from '../helper';

const AMOUNT = 10;

export const Home = observer(() => {
  const [currentPage, setCurrentPage] = useState(0);
  const [query, setQuery] = useState('');
  const [submittedCount, setSubmittedCount] = useState(0);

  useEffect(() => {
    whiskyStore.loadWhiskies({page: currentPage, amount: AMOUNT, query});
  }, [currentPage, submittedCount]);

  const renderSearch = () => (
    <>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        type="text"
        id="whisky-search"
      />
      <button
        onClick={() => setSubmittedCount(submittedCount + 1)}
        className="button"
      >
        Search
      </button>
    </>
  );

  const renderWhiskies = () =>
    whiskyStore.whiskies.map(({name}, index) => (
      <div className="whisky" key={`whisky-${index}`}>
        <p className="name">{filterHighlightablePart(name)}</p>
        <div className="review">
          <Link to={`/whisky/${convertToBase64(name)}`}>
            <button className="button">Review lesen</button>
          </Link>
        </div>
      </div>
    ));

  const renderPagination = () => (
    <>
      <img
        className={classNames('inverted', {disabled: currentPage === 0})}
        src={caretRight}
        onClick={() =>
          currentPage !== 0 ? setCurrentPage(currentPage - 1) : ''
        }
      />
      <span>{currentPage + 1}</span>
      <img onClick={() => setCurrentPage(currentPage + 1)} src={caretRight} />
    </>
  );

  return (
    <div className="Home">
      <div className="search">{renderSearch()}</div>
      <div className="whiskies">{renderWhiskies()}</div>
      <div className="pagination">{renderPagination()}</div>
    </div>
  );
});

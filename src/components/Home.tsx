import React, {useEffect, useState} from 'react';
import {homeStore, whiskyStore} from '../store';
import {observer} from 'mobx-react-lite';
import caretRight from '../assets/caret-right.svg';
import classNames from 'classnames';
import {Link} from 'react-router-dom';
import {convertToBase64} from '../grabber/grab-whisky';
import {filterHighlightablePart} from '../helper';

const AMOUNT = 10;

export const Home = observer(() => {
  const [submittedCount, setSubmittedCount] = useState(0);

  useEffect(() => {
    whiskyStore.loadWhiskies({
      page: homeStore.currentPage,
      amount: AMOUNT,
      query: homeStore.query,
    });
  }, [homeStore.currentPage, submittedCount]);

  const submit = () => {
    homeStore.currentPage = 0;
    setSubmittedCount(submittedCount + 1);
  };

  const renderSearch = () => (
    <>
      <input
        value={homeStore.query}
        onChange={e => (homeStore.query = e.target.value)}
        type="text"
        id="whisky-search"
      />
      <button onClick={submit} className="button">
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
    <div className="items">
      <img
        className={classNames('inverted', {
          disabled: homeStore.currentPage === 0,
        })}
        src={caretRight}
        onClick={() =>
          homeStore.currentPage !== 0 ? (homeStore.currentPage -= 1) : ''
        }
      />
      <span>{homeStore.currentPage + 1}</span>
      <img onClick={() => (homeStore.currentPage += 1)} src={caretRight} />
    </div>
  );

  return (
    <div className="Home">
      <div className="search">{renderSearch()}</div>
      <div className="whiskies">{renderWhiskies()}</div>
      <div className="pagination">{renderPagination()}</div>
    </div>
  );
});
